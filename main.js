// Zhijiang Wang — portfolio interactions (progressive enhancement)
(function () {
  "use strict";

  /* =====================================================================
     PROJECT DATA
     ---------------------------------------------------------------------
     One entry per discipline. To add a project, drop the image/video into
     /assets and add an object to that discipline's `projects` array:

       { img: "assets/your-image.jpg",              // an image, OR
         video: "assets/your-clip.mp4",             // a video, OR
         img: "assets/cover.png", link: "assets/file.pdf",  // image that links out
         title: "Project name",
         desc:  "One or two sentences about the project." }

     Empty arrays show a tasteful "in progress" slide until you add work.
     ===================================================================== */
  var DISCIPLINES = {
    "web-design": {
      title: "Web Design",
      projects: [
        // { img: "assets/web-1.jpg", title: "Project name", desc: "What it is and your role." },
      ]
    },
    "graphic-design": {
      title: "Graphic Design",
      projects: [
        { img: "assets/promo.jpg",
          title: "Fee-Free TAFE — Campaign Key Visual",
          desc: "Key visual and layout for TAFE Queensland's Fee-Free enrolment campaign, composed to work across web banners and print." }
      ]
    },
    "elearning-design": {
      title: "E-Learning Design",
      projects: [
        { img: "assets/brochure-thumb.png", link: "assets/brochure.pdf",
          title: "Patch Application — Learner Guide",
          desc: "Editorial layout for a self-paced cybersecurity learner guide: structured sections, callouts and diagrams. Open the full PDF to read it." }
      ]
    },
    "3d-modelling": {
      title: "3D Modelling",
      projects: [
        // { img: "assets/3d-1.jpg", title: "Fusion 360 prototype", desc: "..." },
      ]
    },
    "unity-games": {
      title: "Unity Games",
      projects: [
        // { img: "assets/unity-1.jpg", title: "Learning game", desc: "..." },
      ]
    },
    "textile": {
      title: "Textile",
      projects: [
        { img: "assets/textile-embroidery.jpg",
          title: "Silk Floral Embroidery",
          desc: "A hand-stitched floral panel worked on a traditional stretched frame — colour, thread and patience." },
        { img: "assets/textile-pants.jpg",
          title: "Floral Trouser Construction",
          desc: "Pattern-cut and machine-sewn trousers in a printed cotton — garment construction from block to finish." }
      ]
    },
    "food-tech": {
      title: "Food Technology",
      projects: [
        { img: "assets/food-dubai-chocolate.jpg",
          title: "Dubai-Style Pistachio Chocolate",
          desc: "A hand-tempered chocolate bar with a pistachio–kunafa filling and edible gold leaf." },
        { img: "assets/food-swirl-bread.jpg",
          title: "Honey Swirl Milk Bread",
          desc: "Enriched pull-apart rolls, hand-shaped and egg-washed for an even golden crust." },
        { img: "assets/food-madeleines.jpg",
          title: "Madeleines",
          desc: "Classic French tea cakes baked for their signature shell shape and hump." },
        { img: "assets/food-char-siu-puffs.jpg",
          title: "Char Siu Puff Pastry",
          desc: "Flaky BBQ-pork puffs, glazed and finished with black sesame." },
        { img: "assets/food-banana-bread.jpg",
          title: "Banana Loaf",
          desc: "A simple quick-bread topped with fresh banana — good for teaching creaming and folding." },
        { img: "assets/food-nachos.jpg",
          title: "Loaded Beef Nachos",
          desc: "Spiced beef, guacamole and fresh pico de gallo — a plating and assembly exercise." },
        { img: "assets/food-beef-stirfry.jpg",
          title: "Coriander & Chilli Beef",
          desc: "Fast, high-heat wok cooking that balances heat, aromatics and freshness." },
        { img: "assets/food-pear-soup.jpg",
          title: "Pear, Snow Fungus & Red Date Soup",
          desc: "A slow-simmered Chinese dessert soup — nutrition and cultural food traditions." }
      ]
    },
    "video-editing": {
      title: "Video Editing",
      projects: [
        { video: "assets/video-editing.mp4",
          title: "Educational explainer edit",
          desc: "Motion-graphics video edit for an educational explainer — pacing, on-screen titling and sound." }
      ]
    }
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ------------------------------------------------------------------
  // mobile nav toggle
  // ------------------------------------------------------------------
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  // ------------------------------------------------------------------
  // scroll reveal
  // ------------------------------------------------------------------
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ------------------------------------------------------------------
  // discipline badges (project counts) + card triggers
  // ------------------------------------------------------------------
  var cards = Array.prototype.slice.call(document.querySelectorAll(".disc-card"));
  cards.forEach(function (card) {
    var key = card.getAttribute("data-discipline");
    var data = DISCIPLINES[key];
    var badge = card.querySelector(".disc-badge");
    var count = data ? data.projects.length : 0;
    if (badge) {
      if (count > 0) {
        badge.textContent = count === 1 ? "1 project" : count + " projects";
        badge.removeAttribute("data-empty");
      } else {
        badge.textContent = "In progress";
        badge.setAttribute("data-empty", "true");
      }
    }
    var trigger = card.querySelector(".disc-trigger");
    if (trigger) {
      trigger.addEventListener("click", function () { openLightbox(key, trigger); });
    }
  });

  // ------------------------------------------------------------------
  // lightbox / carousel
  // ------------------------------------------------------------------
  var lb = document.getElementById("lightbox");
  if (!lb) return;
  var lbPanel   = lb.querySelector(".lb-panel");
  var lbTitle   = document.getElementById("lbTitle");
  var lbMedia   = document.getElementById("lbMedia");
  var lbCount   = document.getElementById("lbCount");
  var lbPTitle  = document.getElementById("lbProjTitle");
  var lbPDesc   = document.getElementById("lbProjDesc");
  var lbDots    = document.getElementById("lbDots");
  var btnPrev   = lb.querySelector(".lb-prev");
  var btnNext   = lb.querySelector(".lb-next");
  var shell     = document.querySelector(".shell");

  var current = { projects: [], index: 0, opener: null };

  var ICON = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="10" width="32" height="24" rx="2"/><path d="M8 30l9-8 6 5 8-9 9 9"/><circle cx="18" cy="18" r="2.5"/></svg>';

  function pauseVideos() {
    lbMedia.querySelectorAll("video").forEach(function (v) { v.pause(); });
  }

  function render() {
    var list = current.projects;
    pauseVideos();
    lbMedia.innerHTML = "";

    if (!list.length) {
      lbMedia.innerHTML = '<div class="lb-placeholder">' + ICON +
        '<p>Projects for this discipline are being added — check back soon.</p></div>';
      lbCount.textContent = "";
      lbPTitle.textContent = current.title;
      lbPDesc.textContent = "New work will appear here.";
      lbDots.hidden = true;
      btnPrev.hidden = btnNext.hidden = true;
      return;
    }

    var i = current.index;
    var p = list[i];

    var media;
    if (p.video) {
      media = document.createElement("video");
      media.src = p.video;
      media.controls = true;
      media.setAttribute("playsinline", "");
      media.setAttribute("preload", "metadata");
    } else {
      media = document.createElement("img");
      media.src = p.img;
      media.alt = p.title;
    }
    lbMedia.appendChild(media);

    lbCount.textContent = pad(i + 1) + " / " + pad(list.length);
    lbPTitle.textContent = p.title;
    lbPDesc.innerHTML = "";
    lbPDesc.appendChild(document.createTextNode(p.desc || ""));
    if (p.link) {
      var a = document.createElement("a");
      a.className = "lb-open";
      a.href = p.link; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Open PDF →";
      lbPDesc.appendChild(document.createElement("br"));
      lbPDesc.appendChild(a);
    }

    // dots
    var multi = list.length > 1;
    lbDots.hidden = !multi;
    btnPrev.hidden = btnNext.hidden = !multi;
    lbDots.innerHTML = "";
    if (multi) {
      list.forEach(function (_, d) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "lb-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Project " + (d + 1));
        dot.setAttribute("aria-selected", d === i ? "true" : "false");
        dot.addEventListener("click", function () { current.index = d; render(); });
        lbDots.appendChild(dot);
      });
    }
  }

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function move(step) {
    var n = current.projects.length;
    if (n < 2) return;
    current.index = (current.index + step + n) % n;
    render();
  }

  function openLightbox(key, opener) {
    var data = DISCIPLINES[key];
    if (!data) return;
    current.projects = data.projects || [];
    current.title = data.title;
    current.index = 0;
    current.opener = opener || null;
    lbTitle.textContent = data.title;
    render();

    lb.hidden = false;
    if (shell) shell.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { lb.classList.add("open"); });
    (lb.querySelector(".lb-close")).focus();
    document.addEventListener("keydown", onKey);
  }

  function closeLightbox() {
    lb.classList.remove("open");
    document.removeEventListener("keydown", onKey);
    pauseVideos();
    var done = function () {
      lb.hidden = true;
      lbMedia.innerHTML = "";
      if (shell) shell.removeAttribute("inert");
      document.body.style.overflow = "";
      if (current.opener) current.opener.focus();
    };
    if (reduce) { done(); }
    else { setTimeout(done, 280); }
  }

  function onKey(e) {
    if (e.key === "Escape") { closeLightbox(); }
    else if (e.key === "ArrowRight") { move(1); }
    else if (e.key === "ArrowLeft") { move(-1); }
    else if (e.key === "Tab") { trapFocus(e); }
  }

  function trapFocus(e) {
    var f = lbPanel.querySelectorAll(
      'button, a[href], video, [tabindex]:not([tabindex="-1"])');
    f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  btnPrev.addEventListener("click", function () { move(-1); });
  btnNext.addEventListener("click", function () { move(1); });
  lb.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });
})();
