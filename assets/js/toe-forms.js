(function () {
  var supabaseClientPromise;

  function message(form, text, ok) {
    var box = form.querySelector(".toe-success-message") || form.querySelector("[data-form-message]");
    if (!box) {
      box = document.createElement("p");
      box.className = "toe-success-message";
      form.appendChild(box);
    }
    box.hidden = false;
    box.textContent = text;
    box.style.color = ok ? "#f7f2e8" : "#ffb199";
  }

  function buttonText(button, text) {
    if (!button) return;
    var title = button.querySelector(".btn-title");
    if (title) title.textContent = text;
    else button.textContent = text;
  }

  function readJsonResponse(response) {
    return response.text().then(function (text) {
      var payload = null;
      try {
        payload = text ? JSON.parse(text) : {};
      } catch (error) {
        if (/request entity too large/i.test(text)) {
          throw new Error("The selected files are too large for a normal form submit. Please refresh and try again.");
        }
        throw new Error(text || "The server returned an unexpected response.");
      }
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.message || "Submission failed.");
      }
      return payload;
    });
  }

  function collectFileEntries(form) {
    var entries = [];
    Array.prototype.slice.call(form.querySelectorAll("input[type='file']")).forEach(function (input) {
      Array.prototype.slice.call(input.files || []).forEach(function (file) {
        entries.push({ input: input, file: file });
      });
    });
    return entries;
  }

  function getSupabaseClient(config) {
    if (window.supabase && window.supabase.createClient) {
      return Promise.resolve(window.supabase.createClient(config.supabaseUrl, config.publishableKey));
    }
    if (!supabaseClientPromise) {
      supabaseClientPromise = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/+esm")
        .then(function (module) {
          return module.createClient(config.supabaseUrl, config.publishableKey);
        });
    }
    return supabaseClientPromise;
  }

  function createTextFormData(form) {
    var data = new FormData(form);
    Array.prototype.slice.call(form.querySelectorAll("input[type='file']")).forEach(function (input) {
      if (input.name) data.delete(input.name);
    });
    return data;
  }

  function uploadFiles(form, fileEntries, route, button) {
    if (!fileEntries.length) return Promise.resolve({});

    buttonText(button, "Preparing uploads...");
    return fetch("/api/upload-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: route,
        files: fileEntries.map(function (entry) {
          return {
            field: entry.input.name,
            name: entry.file.name,
            type: entry.file.type,
            size: entry.file.size
          };
        })
      })
    })
      .then(readJsonResponse)
      .then(function (config) {
        return getSupabaseClient(config).then(function (client) {
          var uploaded = {};
          var chain = Promise.resolve();

          config.uploads.forEach(function (upload, index) {
            chain = chain.then(function () {
              var entry = fileEntries[index];
              if (!entry) return null;
              buttonText(button, "Uploading files " + (index + 1) + " of " + fileEntries.length + "...");
              return client.storage
                .from(upload.bucket)
                .uploadToSignedUrl(upload.path, upload.token, entry.file, {
                  contentType: entry.file.type || "application/octet-stream",
                  upsert: true
                })
                .then(function (result) {
                  if (result.error) throw result.error;
                  if (!uploaded[upload.field]) uploaded[upload.field] = [];
                  uploaded[upload.field].push({
                    field: upload.field,
                    original_name: upload.original_name,
                    bucket: upload.bucket,
                    path: upload.path,
                    public_url: upload.public_url,
                    type: upload.type,
                    size: upload.size
                  });
                });
            });
          });

          return chain.then(function () { return uploaded; });
        });
      });
  }

  function submitForm(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector("button[type='submit']");
      var originalText = button ? button.textContent.trim() : "";
      var fileEntries = collectFileEntries(form);
      var route = form.dataset.route || "vendor";
      var data = createTextFormData(form);
      if (form.id === "toe-signup-form") {
        data.set("form_context", route || data.get("listing_type") || "vendor");
      }
      if (button) {
        button.disabled = true;
        buttonText(button, "Submitting...");
      }

      uploadFiles(form, fileEntries, route, button)
        .then(function (uploaded) {
          if (Object.keys(uploaded).length) data.set("uploaded_files", JSON.stringify(uploaded));
          buttonText(button, "Submitting...");
          return fetch("/api/submit", {
            method: "POST",
            body: data
          });
        })
        .then(readJsonResponse)
        .then(function (payload) {
          message(form, payload.message || "Thank you. T.O.E Guide has received your details.", true);
          form.reset();
        })
        .catch(function (error) {
          message(form, error.message || "Please try again.", false);
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            buttonText(button, originalText || "Submit");
          }
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var signup = document.getElementById("toe-signup-form");
    var contact = document.getElementById("contact_form");
    if (signup) submitForm(signup);
    if (contact) submitForm(contact);
  });
})();
