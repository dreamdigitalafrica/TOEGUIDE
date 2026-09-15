(function () {
  var state = {
    token: localStorage.getItem("toeAdminToken") || "",
    resource: "vendors",
    rows: []
  };

  var resources = ["vendors", "businesses", "blog_posts", "events", "form_submissions"];

  function qs(selector) { return document.querySelector(selector); }
  function qsa(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  function api(resource, options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers.Authorization = "Bearer " + state.token;
    if (options.body && !(options.body instanceof FormData)) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }
    return fetch("/api/admin?resource=" + resource + (options.id ? "&id=" + encodeURIComponent(options.id) : ""), options)
      .then(function (response) { return response.json(); })
      .then(function (payload) {
        if (!payload.ok) throw new Error(payload.message || "Admin request failed.");
        return payload;
      });
  }

  function fieldsFor(resource) {
    if (resource === "vendors") return ["display_name", "category", "contact_name", "phone", "email", "area", "description", "profile_image_url", "status", "is_published"];
    if (resource === "businesses") return ["display_name", "category", "contact_name", "phone", "email", "area", "business_address", "maps", "description", "profile_image_url", "status", "is_published"];
    if (resource === "blog_posts") return ["title", "slug", "excerpt", "content", "cover_image_url", "publish_date", "status"];
    if (resource === "events") return ["title", "slug", "description", "event_date", "location", "cover_image_url", "status"];
    return ["submission_type", "status", "business_name", "category", "contact_name", "phone", "email", "area", "description"];
  }

  function renderTabs() {
    qs("[data-admin-tabs]").innerHTML = resources.map(function (resource) {
      return "<button class=\"" + (resource === state.resource ? "active" : "") + "\" data-resource=\"" + resource + "\">" + resource.replace("_", " ") + "</button>";
    }).join("");
    qsa("[data-resource]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.resource = button.dataset.resource;
        load();
      });
    });
  }

  function renderRows() {
    var fields = fieldsFor(state.resource).slice(0, 5);
    qs("[data-admin-list]").innerHTML = state.rows.map(function (row) {
      var title = row.display_name || row.title || row.business_name || row.contact_name || row.email || row.id;
      return "<button class=\"toe-admin-row\" data-id=\"" + row.id + "\"><strong>" + escapeHtml(title || "Untitled") + "</strong><span>" + fields.map(function (field) { return escapeHtml(String(row[field] || "")); }).join(" • ") + "</span></button>";
    }).join("") || "<p>No records yet.</p>";
    qsa(".toe-admin-row").forEach(function (button) {
      button.addEventListener("click", function () {
        edit(state.rows.find(function (row) { return row.id === button.dataset.id; }));
      });
    });
  }

  function edit(row) {
    var fields = fieldsFor(state.resource);
    qs("[data-admin-editor]").innerHTML = "<input type=\"hidden\" name=\"id\" value=\"" + (row ? row.id : "") + "\">" +
      fields.map(function (field) {
        var value = row ? row[field] : "";
        if (field === "description" || field === "content") {
          return "<label>" + label(field) + "<textarea name=\"" + field + "\">" + escapeHtml(value || "") + "</textarea></label>";
        }
        if (field === "is_published") {
          return "<label class=\"toe-admin-check\"><input type=\"checkbox\" name=\"" + field + "\" " + (value ? "checked" : "") + "> Published</label>";
        }
        return "<label>" + label(field) + "<input name=\"" + field + "\" value=\"" + escapeHtml(value || "") + "\"></label>";
      }).join("") +
      (row && /vendors|businesses|blog_posts|events/.test(state.resource) ? "<label>Upload image<input type=\"file\" name=\"image\" accept=\"image/*\"></label>" : "") +
      "<div class=\"toe-admin-actions\"><button type=\"submit\">Save</button><button type=\"button\" data-new>New</button></div>";
  }

  function label(field) {
    return field.replace(/_/g, " ").replace(/\b\w/g, function (letter) { return letter.toUpperCase(); });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'\"]/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", "\"": "&quot;" })[char];
    });
  }

  function load() {
    renderTabs();
    api(state.resource, { method: "GET" }).then(function (payload) {
      state.rows = payload.data || [];
      renderRows();
      edit(state.rows[0] || null);
    }).catch(function (error) {
      qs("[data-admin-list]").innerHTML = "<p>" + escapeHtml(error.message) + "</p>";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    qs("[data-token]").value = state.token;
    qs("[data-login]").addEventListener("submit", function (event) {
      event.preventDefault();
      state.token = qs("[data-token]").value.trim();
      localStorage.setItem("toeAdminToken", state.token);
      load();
    });
    qs("[data-admin-editor]").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      var formData = new FormData(form);
      var id = formData.get("id");
      var image = formData.get("image");
      var body = {};
      fieldsFor(state.resource).forEach(function (field) {
        if (field === "is_published") body[field] = formData.get(field) === "on";
        else body[field] = formData.get(field) || null;
      });
      api(state.resource, { method: id ? "PUT" : "POST", id: id, body: body })
        .then(function (payload) {
          if (image && image.size && /vendors|businesses|blog_posts|events/.test(state.resource)) {
            var upload = new FormData();
            upload.append("image", image);
            return fetch("/api/media?resource=" + state.resource + "&id=" + payload.data.id + "&field=" + (state.resource === "blog_posts" || state.resource === "events" ? "cover_image_url" : "profile_image_url"), {
              method: "POST",
              headers: { Authorization: "Bearer " + state.token },
              body: upload
            });
          }
        })
        .then(load)
        .catch(function (error) { alert(error.message); });
    });
    qs("[data-admin-editor]").addEventListener("click", function (event) {
      if (event.target.matches("[data-new]")) edit(null);
    });
    if (state.token) load();
    else renderTabs();
  });
})();
