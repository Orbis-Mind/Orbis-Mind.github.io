/* Orbis Mind — small, dependency-free interactions */
(function () {
  "use strict";

  // ---- Theme (light/dark) with persistence ----
  var root = document.documentElement;
  function stored() { try { return localStorage.getItem("om-theme"); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem("om-theme", v); } catch (e) {} }
  var saved = stored();
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  function current() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function toggleTheme() {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    save(next);
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (t) { e.preventDefault(); toggleTheme(); }
  });

  // ---- Mobile nav ----
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-nav-toggle]");
    if (t) {
      var links = document.getElementById("navlinks");
      if (links) links.classList.toggle("open");
      return;
    }
    // close on link click
    if (e.target.closest("#navlinks a")) {
      var l = document.getElementById("navlinks");
      if (l) l.classList.remove("open");
    }
  });

  // ---- Copy buttons on code blocks ----
  document.querySelectorAll(".code").forEach(function (block) {
    var btn = block.querySelector(".code-copy");
    var pre = block.querySelector("pre");
    if (!btn || !pre) return;
    btn.addEventListener("click", function () {
      var text = pre.innerText.replace(/ /g, " ");
      var done = function () {
        var old = btn.textContent; btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else { fallback(); }
      function fallback() {
        try {
          var ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); document.body.removeChild(ta); done();
        } catch (e) {}
      }
    });
  });

  // ---- Docs TOC scrollspy ----
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) map[id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("active"); });
          var a = map[en.target.id];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // ---- Reveal on scroll (respects reduced motion) ----
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var reveals = document.querySelectorAll("[data-reveal]");
    reveals.forEach(function (el) { el.style.opacity = "0"; el.style.transform = "translateY(14px)"; el.style.transition = "opacity .5s ease, transform .5s ease"; });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.opacity = "1"; en.target.style.transform = "none"; ro.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { ro.observe(el); });
  }
})();
