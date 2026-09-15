const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { createClient } = require("@supabase/supabase-js");

const PUBLIC_BUCKET = "toe-public-media";
const PRIVATE_BUCKET = "toe-private-documents";
const ADMIN_TABLES = new Set(["vendors", "businesses", "blog_posts", "events", "form_submissions", "categories"]);

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function requireAdmin(req) {
  const expected = process.env.TOE_ADMIN_TOKEN;
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!expected || token !== expected) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
}

function send(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function value(input) {
  if (Array.isArray(input)) return input[0] || "";
  return input || "";
}

function values(input) {
  if (!input) return [];
  return Array.isArray(input) ? input.filter(Boolean) : [input].filter(Boolean);
}

function safeName(name) {
  return String(name || "upload")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "upload";
}

function isPrivateFileField(fieldName) {
  return /(id|cac|document|proof|certificate|license)/i.test(fieldName);
}

async function uploadFiles(supabase, files, submissionType, submissionId) {
  const uploaded = {};
  const mediaRows = [];

  for (const [fieldName, fileValue] of Object.entries(files || {})) {
    const fileList = Array.isArray(fileValue) ? fileValue : [fileValue];
    uploaded[fieldName] = [];

    for (const file of fileList) {
      if (!file || !file.filepath || !file.originalFilename) continue;
      const bucket = isPrivateFileField(fieldName) ? PRIVATE_BUCKET : PUBLIC_BUCKET;
      const storagePath = `${submissionType}/${submissionId}/${Date.now()}-${safeName(file.originalFilename)}`;
      const buffer = await fs.promises.readFile(file.filepath);
      const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
          contentType: file.mimetype || "application/octet-stream",
          upsert: true
        });

      if (error) throw error;

      let publicUrl = null;
      if (bucket === PUBLIC_BUCKET) {
        const result = supabase.storage.from(bucket).getPublicUrl(storagePath);
        publicUrl = result.data.publicUrl;
      }

      const item = {
        field: fieldName,
        original_name: file.originalFilename,
        bucket,
        path: storagePath,
        public_url: publicUrl,
        type: file.mimetype || null
      };
      uploaded[fieldName].push(item);
      mediaRows.push(item);
    }
  }

  return { uploaded, mediaRows };
}

async function getGoogleSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !sheetId) return null;

  const auth = new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return {
    sheetId,
    sheets: google.sheets({ version: "v4", auth })
  };
}

async function appendSheetRow(row, tabName) {
  const client = await getGoogleSheetsClient();
  if (!client) return { skipped: true, reason: "Google Sheets credentials are not configured." };

  await client.sheets.spreadsheets.values.append({
    spreadsheetId: client.sheetId,
    range: `${tabName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] }
  });

  return { skipped: false };
}

function publicSubmissionRow(submission, uploadedFiles) {
  return [
    new Date().toISOString(),
    submission.submission_type,
    submission.status || "new",
    submission.business_name || "",
    submission.category || "",
    submission.contact_name || "",
    submission.phone || "",
    submission.email || "",
    submission.area || "",
    submission.business_address || "",
    submission.maps || "",
    submission.description || "",
    (submission.social_follow || []).join(", "),
    (submission.verification_checks || []).join(", "),
    JSON.stringify(uploadedFiles || {}),
    submission.id
  ];
}

function contactRow(submission) {
  return [
    new Date().toISOString(),
    submission.contact_name || submission.business_name || "",
    submission.email || "",
    submission.phone || "",
    submission.category || "",
    submission.description || "",
    submission.id
  ];
}

function vendorRow(listing) {
  return [
    new Date().toISOString(),
    listing.status || "pending",
    listing.is_published ? "Yes" : "No",
    listing.display_name || "",
    listing.category || "",
    listing.contact_name || "",
    listing.phone || "",
    listing.email || "",
    listing.area || "",
    listing.description || "",
    listing.profile_image_url || "",
    listing.id || ""
  ];
}

function businessRow(listing) {
  return [
    new Date().toISOString(),
    listing.status || "pending",
    listing.is_published ? "Yes" : "No",
    listing.display_name || "",
    listing.category || "",
    listing.contact_name || "",
    listing.phone || "",
    listing.email || "",
    listing.area || "",
    listing.business_address || "",
    listing.maps || "",
    listing.description || "",
    listing.profile_image_url || "",
    listing.id || ""
  ];
}

module.exports = {
  ADMIN_TABLES,
  PUBLIC_BUCKET,
  PRIVATE_BUCKET,
  appendSheetRow,
  businessRow,
  contactRow,
  getSupabase,
  publicSubmissionRow,
  requireAdmin,
  send,
  uploadFiles,
  value,
  vendorRow,
  values
};
