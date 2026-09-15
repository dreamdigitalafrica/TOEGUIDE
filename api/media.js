const { formidable } = require("formidable");
const { PUBLIC_BUCKET, getSupabase, requireAdmin, send, value } = require("./_toe-utils");

function parseForm(req) {
  const form = formidable({ multiples: false, keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

function safeName(name) {
  return String(name || "image").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 120);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, message: "Use POST." });

  try {
    requireAdmin(req);
    const supabase = getSupabase();
    const url = new URL(req.url, "https://toeguide.com");
    const resource = url.searchParams.get("resource");
    const id = url.searchParams.get("id");
    const field = url.searchParams.get("field") || "profile_image_url";
    if (!resource || !id) return send(res, 400, { ok: false, message: "Missing resource or id." });

    const { files } = await parseForm(req);
    const image = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!image) return send(res, 400, { ok: false, message: "Upload an image file named image." });

    const fs = require("fs");
    const buffer = await fs.promises.readFile(image.filepath);
    const storagePath = `admin/${resource}/${id}/${Date.now()}-${safeName(image.originalFilename)}`;
    const { error } = await supabase.storage.from(PUBLIC_BUCKET).upload(storagePath, buffer, {
      contentType: image.mimetype || "image/jpeg",
      upsert: true
    });
    if (error) throw error;

    const publicUrl = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(storagePath).data.publicUrl;
    const { data, error: updateError } = await supabase
      .from(resource)
      .update({ [field]: publicUrl })
      .eq("id", id)
      .select("*")
      .single();
    if (updateError) throw updateError;

    return send(res, 200, { ok: true, url: publicUrl, data });
  } catch (error) {
    return send(res, error.statusCode || 500, { ok: false, message: error.message || "Upload failed." });
  }
};
