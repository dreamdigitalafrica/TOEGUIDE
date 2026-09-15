const { formidable } = require("formidable");
const {
  appendSheetRow,
  businessRow,
  contactRow,
  getSupabase,
  publicSubmissionRow,
  send,
  uploadFiles,
  value,
  vendorRow,
  values
} = require("./_toe-utils");

function parseForm(req) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    allowEmptyFiles: true,
    maxFileSize: 15 * 1024 * 1024
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

function normalizeSubmission(fields) {
  const isContact = Boolean(value(fields.form_name) || value(fields.form_message));
  const route = value(fields.form_context) || value(fields.route) || value(fields.listing_type);
  const submissionType = isContact ? "contact" : /business/i.test(route) ? "business" : "vendor";
  const verificationChecks = submissionType === "business" ? values(fields.business_verify) : values(fields.vendor_verify);

  return {
    submission_type: submissionType,
    listing_type: value(fields.listing_type),
    business_name: value(fields.business_name) || value(fields.form_name),
    category: value(fields.category) || value(fields.form_subject),
    contact_name: value(fields.contact_name) || value(fields.form_name),
    phone: value(fields.phone) || value(fields.form_phone),
    email: value(fields.email) || value(fields.form_email),
    area: value(fields.area),
    business_address: value(fields.business_address),
    maps: value(fields.maps),
    description: value(fields.description) || value(fields.form_message),
    social_follow: values(fields.social_follow),
    verification_checks: verificationChecks,
    raw_payload: fields
  };
}

function parseUploadedFiles(fields) {
  const raw = value(fields.uploaded_files);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    error.statusCode = 400;
    error.message = "Uploaded file details could not be read. Please choose the files again and resubmit.";
    throw error;
  }
}

function flattenUploadedFiles(uploaded) {
  return Object.values(uploaded || {}).flatMap((items) => Array.isArray(items) ? items : []);
}

function firstPublicImage(files) {
  for (const items of Object.values(files || {})) {
    const found = (items || []).find((item) => item.public_url);
    if (found) return found.public_url;
  }
  return null;
}

async function createListing(supabase, submission, files) {
  if (submission.submission_type === "contact") return null;

  const table = submission.submission_type === "business" ? "businesses" : "vendors";
  const record = {
    submission_id: submission.id,
    display_name: submission.business_name || "Untitled listing",
    category: submission.category,
    contact_name: submission.contact_name,
    phone: submission.phone,
    email: submission.email,
    area: submission.area,
    description: submission.description,
    profile_image_url: firstPublicImage(files),
    metadata: {
      social_follow: submission.social_follow,
      verification_checks: submission.verification_checks
    }
  };

  if (table === "businesses") {
    record.business_address = submission.business_address;
    record.maps = submission.maps;
  }

  const { data, error } = await supabase.from(table).insert(record).select("*").single();
  if (error) throw error;
  return { table, row: data, id: data.id };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, message: "Use POST." });

  try {
    const supabase = getSupabase();
    const { fields, files } = await parseForm(req);
    const payload = normalizeSubmission(fields);
    const preuploadedFiles = parseUploadedFiles(fields);

    const { data: submission, error } = await supabase
      .from("form_submissions")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;

    const { uploaded, mediaRows } = preuploadedFiles
      ? { uploaded: preuploadedFiles, mediaRows: flattenUploadedFiles(preuploadedFiles) }
      : await uploadFiles(supabase, files, submission.submission_type, submission.id);
    const listing = await createListing(supabase, { ...submission, files: uploaded }, uploaded);

    if (mediaRows.length) {
      await supabase.from("listing_media").insert(mediaRows.map((file) => ({
        owner_type: listing ? submission.submission_type : "submission",
        owner_id: listing ? listing.id : null,
        submission_id: submission.id,
        bucket: file.bucket,
        path: file.path,
        public_url: file.public_url,
        media_type: file.type,
        alt_text: file.original_name,
        is_primary: Boolean(file.public_url && file.public_url === firstPublicImage(uploaded))
      })));
    }

    const { error: updateError } = await supabase
      .from("form_submissions")
      .update({ files: uploaded })
      .eq("id", submission.id);
    if (updateError) throw updateError;

    const sheetStatuses = [];
    try {
      sheetStatuses.push(await appendSheetRow(publicSubmissionRow({ ...submission, files: uploaded }, uploaded), "Submissions"));
      if (submission.submission_type === "contact") {
        sheetStatuses.push(await appendSheetRow(contactRow(submission), "Contacts"));
      }
      if (listing && submission.submission_type === "vendor") {
        sheetStatuses.push(await appendSheetRow(vendorRow(listing.row), "Vendors"));
      }
      if (listing && submission.submission_type === "business") {
        sheetStatuses.push(await appendSheetRow(businessRow(listing.row), "Businesses"));
      }
      if (sheetStatuses.some((status) => status && status.skipped)) {
        await supabase.from("form_submissions").update({ sheet_error: "Google Sheets credentials are not configured." }).eq("id", submission.id);
      } else {
        await supabase.from("form_submissions").update({ sheet_synced_at: new Date().toISOString(), sheet_error: null }).eq("id", submission.id);
      }
    } catch (sheetError) {
      await supabase.from("form_submissions").update({ sheet_error: sheetError.message }).eq("id", submission.id);
    }

    return send(res, 200, {
      ok: true,
      id: submission.id,
      message: "Thank you. T.O.E Guide has received your details."
    });
  } catch (error) {
    return send(res, error.statusCode || 500, {
      ok: false,
      message: error.message || "Submission failed."
    });
  }
};
