(function () {
  var values = [
    { label: "Distributors", value: "60" },
    { label: "Residents", value: "55" },
    { label: "Vendors", value: "102" }
  ];

  function applyCounters() {
    values.forEach(function (item) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".toe-stat-box"));
      var card = cards.find(function (node) {
        return node.textContent.toLowerCase().indexOf(item.label.toLowerCase()) !== -1;
      });
      if (!card) return;
      var counter = card.querySelector(".count-text");
      if (!counter) return;
      counter.textContent = item.value;
      counter.setAttribute("data-stop", item.value);
      card.classList.add("counted");
    });
  }

  document.addEventListener("DOMContentLoaded", applyCounters);
  window.addEventListener("load", applyCounters);
  setTimeout(applyCounters, 800);
})();
