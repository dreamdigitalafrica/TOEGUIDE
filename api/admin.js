const { ADMIN_TABLES, getSupabase, requireAdmin, send } = require("./_toe-utils");

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
    req.on("error", reject);
  });
}

function tableFromQuery(req) {
  const url = new URL(req.url, "https://toeguide.com");
  const table = url.searchParams.get("resource") || "vendors";
  if (!ADMIN_TABLES.has(table)) {
    const error = new Error("Unsupported admin resource.");
    error.statusCode = 400;
    throw error;
  }
  return { table, id: url.searchParams.get("id") };
}

module.exports = async function handler(req, res) {
  try {
    requireAdmin(req);
    const supabase = getSupabase();
    const { table, id } = tableFromQuery(req);

    if (req.method === "GET") {
      const orderColumn = table === "categories" ? "sort_order" : "created_at";
      const { data, error } = await supabase.from(table).select("*").order(orderColumn, { ascending: table === "categories" });
      if (error) throw error;
      return send(res, 200, { ok: true, data });
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      const { data, error } = await supabase.from(table).insert(body).select("*").single();
      if (error) throw error;
      return send(res, 200, { ok: true, data });
    }

    if (req.method === "PUT") {
      if (!id) return send(res, 400, { ok: false, message: "Missing id." });
      const body = await readBody(req);
      const { data, error } = await supabase.from(table).update(body).eq("id", id).select("*").single();
      if (error) throw error;
      return send(res, 200, { ok: true, data });
    }

    if (req.method === "DELETE") {
      if (!id) return send(res, 400, { ok: false, message: "Missing id." });
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      return send(res, 200, { ok: true });
    }

    return send(res, 405, { ok: false, message: "Method not allowed." });
  } catch (error) {
    return send(res, error.statusCode || 500, {
      ok: false,
      message: error.message || "Admin request failed."
    });
  }
};
