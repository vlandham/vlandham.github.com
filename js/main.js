// Add "#" anchor links to post headings that have ids.
document.querySelectorAll(".post :is(h1, h2, h3, h4, h5, h6)[id]").forEach(function (heading) {
  var anchor = document.createElement("a");
  anchor.className = "heading-anchor";
  anchor.href = "#" + heading.id;
  anchor.textContent = "#";
  anchor.setAttribute("aria-label", "Link to this section");
  heading.classList.add("heading-anchor-container");
  heading.prepend(anchor);
});

// Add a copy button to code blocks.
if (navigator.clipboard) {
  document.querySelectorAll(".post div.highlighter-rouge").forEach(function (block) {
    var code = block.querySelector("pre code");
    if (!code) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = "Copy";
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(code.innerText).then(function () {
        button.textContent = "Copied";
        setTimeout(function () {
          button.textContent = "Copy";
        }, 1500);
      });
    });
    block.appendChild(button);
  });
}

// Theme toggle: auto follows the system setting; light/dark are saved.
(function () {
  var toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;
  var root = document.documentElement;
  var buttons = toggle.querySelectorAll("button");

  function update() {
    var current = root.dataset.theme || "auto";
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.themeChoice === current);
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var choice = button.dataset.themeChoice;
      try {
        if (choice === "auto") localStorage.removeItem("theme");
        else localStorage.setItem("theme", choice);
      } catch (e) {}
      if (choice === "auto") delete root.dataset.theme;
      else root.dataset.theme = choice;
      update();
    });
  });

  toggle.hidden = false;
  update();
})();
