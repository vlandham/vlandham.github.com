// Highlight the project currently in view in the contents sidebar.
(function () {
  var toc = document.querySelector(".vis-toc-inner");
  if (!toc) return;

  var links = {};
  toc.querySelectorAll("a").forEach(function (link) {
    links[link.hash.slice(1)] = link;
  });
  var current = null;

  function setCurrent(id) {
    var link = links[id];
    if (!link || link === current) return;
    if (current) current.removeAttribute("aria-current");
    link.setAttribute("aria-current", "true");
    current = link;

    // Keep the highlighted link visible without scrolling the page.
    var top = link.getBoundingClientRect().top - toc.getBoundingClientRect().top + toc.scrollTop;
    if (top < toc.scrollTop || top + link.offsetHeight > toc.scrollTop + toc.clientHeight) {
      toc.scrollTop = top - toc.clientHeight / 3;
    }
  }

  // The current section is the last one whose top has scrolled near the top of the window.
  var sections = Array.prototype.slice.call(document.querySelectorAll(".vis-layout > .section"));
  var ticking = false;

  function update() {
    ticking = false;
    var line = 120;
    var active = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top > line) break;
      active = sections[i];
    }
    setCurrent(active.id);
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
})();

// Close the small-screen "Jump to" menu after picking a project.
document.querySelectorAll(".vis-jump a").forEach(function (link) {
  link.addEventListener("click", function () {
    link.closest("details").open = false;
  });
});
