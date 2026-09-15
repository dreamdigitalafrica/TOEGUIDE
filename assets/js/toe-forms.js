(function () {
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

  function submitForm(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector("button[type='submit']");
      var originalText = button ? button.textContent : "";
      var data = new FormData(form);
      if (form.id === "toe-signup-form") {
        data.set("form_context", form.dataset.route || data.get("listing_type") || "vendor");
      }
      if (button) {
        button.disabled = true;
        button.textContent = "Submitting...";
      }

      fetch("/api/submit", {
        method: "POST",
        body: data
      })
        .then(function (response) { return response.json(); })
        .then(function (payload) {
          if (!payload.ok) throw new Error(payload.message || "Submission failed.");
          message(form, payload.message || "Thank you. T.O.E Guide has received your details.", true);
          form.reset();
        })
        .catch(function (error) {
          message(form, error.message || "Please try again.", false);
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            button.textContent = originalText;
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
