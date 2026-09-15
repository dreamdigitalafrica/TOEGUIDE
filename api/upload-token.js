const crypto = require("crypto");
const {
  PUBLIC_BUCKET,
  PRIVATE_BUCKET,
  getSupabase,
  isPrivateFileField,
  safeName,
  send
} = require("./_toe-utils");

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        const error = new Error("Upload request is too large.");
        error.statusCode = 413;
        reject(error);
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        error.statusCode = 400;
        error.message = "Upload request is not valid JSON.";
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, message: "Use POST." });

  try {
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error("Supabase publishable key is not configured. Add SUPABASE_PUBLISHABLE_KEY in Vercel.");
    }

    const payload = await readBody(req);
    const files = Array.isArray(payload.files) ? payload.files : [];
    if (!files.length) return send(res, 200, { ok: true, uploads: [] });

    const route = safeName(payload.route || "vendor");
    const supabase = getSupabase();
    const uploads = [];

    for (const file of files) {
      const size = Number(file.size || 0);
      if (size > MAX_FILE_SIZE) {
        return send(res, 413, {
          ok: false,
          message: `${file.name || "One file"} is too large. Please keep each file under 25MB.`
        });
      }

      const field = safeName(file.field || "upload");
      const originalName = file.name || "upload";
      const bucket = isPrivateFileField(field) ? PRIVATE_BUCKET : PUBLIC_BUCKET;
      const storagePath = `${route}/pending/${crypto.randomUUID()}-${safeName(originalName)}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(storagePath, { upsert: true });

      if (error) throw error;

      let publicUrl = null;
      if (bucket === PUBLIC_BUCKET) {
        const result = supabase.storage.from(bucket).getPublicUrl(storagePath);
        publicUrl = result.data.publicUrl;
      }

      uploads.push({
        field: file.field || field,
        original_name: originalName,
        bucket,
        path: data.path,
        token: data.token,
        signed_url: data.signedUrl,
        public_url: publicUrl,
        type: file.type || "application/octet-stream",
        size
      });
    }

    return send(res, 200, {
      ok: true,
      supabaseUrl: process.env.SUPABASE_URL,
      publishableKey,
      uploads
    });
  } catch (error) {
    return send(res, error.statusCode || 500, {
      ok: false,
      message: error.message || "Could not prepare uploads."
    });
  }
};
