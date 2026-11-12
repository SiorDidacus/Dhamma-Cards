(function () {
  "use strict";

  const GOLD = "#8a5a2b";

  function spokes(cx, cy, r1, r2, n) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n;
      s += '<line x1="' + (cx + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (cy + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (cx + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (cy + r2 * Math.sin(a)).toFixed(1) + '" stroke="' + GOLD + '" stroke-width="4" stroke-linecap="round"/>';
    }
    return s;
  }

  function rays(cx, cy, r1, r2, n, color) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n;
      s += '<line x1="' + (cx + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (cy + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (cx + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (cy + r2 * Math.sin(a)).toFixed(1) + '" stroke="' + color + '" stroke-width="5" stroke-linecap="round"/>';
    }
    return s;
  }

  function heartLeaf(x, y, s, rot, fill) {
    return '<path d="M0 0 C 8 -8 20 -2 14 10 C 10 18 0 24 0 24 C 0 24 -10 18 -14 10 C -20 -2 -8 -8 0 0 Z" transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + s + ')" fill="' + fill + '" stroke="' + GOLD + '" stroke-width="2"/>';
  }

  const MOTIFS = {
    lotus:
      '<path d="M100 152 C74 132 74 92 100 62 C126 92 126 132 100 152 Z" fill="#e3b23c" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M100 152 C64 144 44 116 52 84 C84 96 96 122 100 152 Z" fill="#d9a52e" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M100 152 C136 144 156 116 148 84 C116 96 104 122 100 152 Z" fill="#d9a52e" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M100 152 C56 158 30 138 26 112 C58 116 84 132 100 152 Z" fill="#c9942a" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M100 152 C144 158 170 138 174 112 C142 116 116 132 100 152 Z" fill="#c9942a" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M60 164 Q100 178 140 164" fill="none" stroke="' + GOLD + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M76 172 Q100 182 124 172" fill="none" stroke="' + GOLD + '" stroke-width="3" stroke-linecap="round"/>',

    moon:
      '<path d="M128 34 A72 72 0 1 0 128 166 A58 58 0 1 1 128 34 Z" fill="#e8c766" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<circle cx="152" cy="58" r="3" fill="' + GOLD + '"/>' +
      '<circle cx="162" cy="92" r="2.5" fill="' + GOLD + '"/>' +
      '<circle cx="148" cy="124" r="2" fill="' + GOLD + '"/>' +
      '<circle cx="140" cy="86" r="1.8" fill="' + GOLD + '"/>',

    tree:
      '<path d="M100 172 C96 142 94 118 100 94" stroke="#7c4a1e" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M100 132 C88 124 80 114 76 102" stroke="#7c4a1e" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M100 120 C112 112 120 102 124 90" stroke="#7c4a1e" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      heartLeaf(100, 34, 1.5, 0, "#4a7a3a") +
      heartLeaf(56, 66, 1.2, -30, "#3e6b3e") +
      heartLeaf(144, 66, 1.2, 30, "#3e6b3e") +
      heartLeaf(72, 30, 1, -15, "#5a8a4a") +
      heartLeaf(128, 30, 1, 15, "#5a8a4a") +
      heartLeaf(40, 104, 0.9, -55, "#4a7a3a") +
      heartLeaf(160, 104, 0.9, 55, "#4a7a3a") +
      '<path d="M70 176 Q100 186 130 176" fill="none" stroke="' + GOLD + '" stroke-width="4" stroke-linecap="round"/>',

    wheel:
      '<circle cx="100" cy="100" r="58" fill="none" stroke="' + GOLD + '" stroke-width="6"/>' +
      '<circle cx="100" cy="100" r="68" fill="none" stroke="' + GOLD + '" stroke-width="2"/>' +
      spokes(100, 100, 9, 55, 8) +
      '<circle cx="100" cy="100" r="9" fill="#c9a227" stroke="' + GOLD + '" stroke-width="3"/>',

    snake:
      '<path d="M100 58 C74 66 68 104 78 134 C84 150 116 150 122 134 C132 104 126 66 100 58 Z" fill="#d9b23c" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M100 76 C86 84 84 110 90 130" fill="none" stroke="' + GOLD + '" stroke-width="2.5"/>' +
      '<path d="M100 76 C114 84 116 110 110 130" fill="none" stroke="' + GOLD + '" stroke-width="2.5"/>' +
      '<ellipse cx="100" cy="56" rx="11" ry="8" fill="' + GOLD + '"/>' +
      '<circle cx="95" cy="54" r="1.8" fill="#f6ecd4"/><circle cx="105" cy="54" r="1.8" fill="#f6ecd4"/>' +
      '<path d="M100 152 C64 158 56 172 100 176 C144 172 136 158 100 152" fill="none" stroke="' + GOLD + '" stroke-width="5" stroke-linecap="round"/>',

    elephant:
      '<ellipse cx="92" cy="116" rx="50" ry="34" fill="#c9a886" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<circle cx="142" cy="100" r="27" fill="#c9a886" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<rect x="66" y="140" width="12" height="28" rx="5" fill="#c9a886" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<rect x="94" y="142" width="12" height="26" rx="5" fill="#c9a886" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<rect x="122" y="140" width="12" height="28" rx="5" fill="#c9a886" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M162 112 C176 128 172 150 156 160" fill="none" stroke="#b5651d" stroke-width="11" stroke-linecap="round"/>' +
      '<ellipse cx="130" cy="98" rx="13" ry="18" fill="#b5651d" opacity="0.45"/>' +
      '<circle cx="150" cy="94" r="3" fill="#4a3520"/>' +
      '<path d="M154 116 C160 122 160 128 154 132" fill="none" stroke="#f6ecd4" stroke-width="4" stroke-linecap="round"/>',

    bowl:
      '<circle cx="100" cy="76" r="6" fill="#e3b23c" stroke="' + GOLD + '" stroke-width="2"/>' +
      '<circle cx="86" cy="92" r="4.5" fill="#e3b23c" stroke="' + GOLD + '" stroke-width="2"/>' +
      '<circle cx="114" cy="92" r="4.5" fill="#e3b23c" stroke="' + GOLD + '" stroke-width="2"/>' +
      '<path d="M50 112 C50 144 74 160 100 160 C126 160 150 144 150 112 Z" fill="#a8763e" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<ellipse cx="100" cy="112" rx="50" ry="10" fill="#7c4a1e" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M84 160 L116 160 L110 172 L90 172 Z" fill="#a8763e" stroke="' + GOLD + '" stroke-width="3"/>',

    lamp:
      '<path d="M100 58 C114 84 118 104 100 122 C82 104 86 84 100 58 Z" fill="#e8b33c" stroke="#b5651d" stroke-width="2.5"/>' +
      '<path d="M100 88 C107 100 108 112 100 120 C92 112 93 100 100 88 Z" fill="#f6d76b"/>' +
      rays(100, 92, 34, 46, 8, "#b5651d") +
      '<path d="M58 132 C58 154 78 164 100 164 C122 164 142 154 142 132 Z" fill="#a8763e" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<ellipse cx="100" cy="132" rx="42" ry="8" fill="#7c4a1e" stroke="' + GOLD + '" stroke-width="3"/>',

    book:
      '<path d="M100 74 C80 62 56 60 38 66 L38 134 C56 128 80 130 100 142 C120 130 144 128 162 134 L162 66 C144 60 120 62 100 74 Z" fill="#f0e0b8" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M100 74 L100 142" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<path d="M46 80 C60 76 76 76 92 82 M46 94 C60 90 76 90 92 96 M46 108 C60 104 76 104 92 110 M46 122 C60 118 76 118 92 124" fill="none" stroke="' + GOLD + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M154 80 C140 76 124 76 108 82 M154 94 C140 90 124 90 108 96 M154 108 C140 104 124 104 108 110 M154 122 C140 118 124 118 108 124" fill="none" stroke="' + GOLD + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M38 134 C56 128 80 130 100 142 C120 130 144 128 162 134 L162 144 C144 138 120 140 100 152 C80 140 56 138 38 144 Z" fill="#7a1f1f" stroke="' + GOLD + '" stroke-width="3"/>',

    star:
      '<path d="M100 36 L113 87 L164 100 L113 113 L100 164 L87 113 L36 100 L87 87 Z" fill="#e3b23c" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<circle cx="100" cy="100" r="11" fill="#f6ecd4" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<circle cx="46" cy="52" r="3" fill="' + GOLD + '"/>' +
      '<circle cx="158" cy="52" r="3" fill="' + GOLD + '"/>' +
      '<circle cx="46" cy="150" r="3" fill="' + GOLD + '"/>' +
      '<circle cx="158" cy="150" r="3" fill="' + GOLD + '"/>',

    enso:
      '<path d="M100 34 A66 66 0 1 0 166 100" fill="none" stroke="#5a4632" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M100 48 A52 52 0 1 0 152 100" fill="none" stroke="#5a4632" stroke-width="5" stroke-linecap="round" opacity="0.5"/>',

    mountain:
      '<circle cx="54" cy="50" r="14" fill="#e8c766" stroke="' + GOLD + '" stroke-width="2"/>' +
      '<path d="M28 162 L82 68 L112 122 L142 58 L176 162 Z" fill="#8d9aa5" stroke="#5a4632" stroke-width="3"/>' +
      '<path d="M82 68 L94 92 L82 100 L72 88 Z" fill="#f6ecd4" stroke="#5a4632" stroke-width="2"/>' +
      '<path d="M142 58 L154 84 L142 92 L132 78 Z" fill="#f6ecd4" stroke="#5a4632" stroke-width="2"/>' +
      '<path d="M24 168 Q100 178 180 168" fill="none" stroke="' + GOLD + '" stroke-width="4" stroke-linecap="round"/>',

    sun:
      rays(100, 100, 44, 64, 12, "#b5651d") +
      '<circle cx="100" cy="100" r="36" fill="#e8b33c" stroke="#b5651d" stroke-width="3"/>' +
      '<circle cx="100" cy="100" r="26" fill="#f6d76b"/>',

    wave:
      '<path d="M32 138 C50 88 92 78 112 100 C128 118 120 142 102 144 C90 145 84 134 92 126" fill="none" stroke="#2e6f8e" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M118 118 C132 108 146 114 146 126" fill="none" stroke="#2e6f8e" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="126" cy="96" r="4" fill="#2e6f8e"/>' +
      '<circle cx="142" cy="104" r="3" fill="#2e6f8e"/>' +
      '<circle cx="112" cy="86" r="3" fill="#2e6f8e"/>' +
      '<path d="M24 154 C60 144 140 144 178 154" fill="none" stroke="#2e6f8e" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M40 168 C70 160 130 160 162 168" fill="none" stroke="#2e6f8e" stroke-width="4" stroke-linecap="round" opacity="0.6"/>'
  };

  function motifSVG(name) {
    return '<svg class="motif" viewBox="0 0 200 200" aria-hidden="true" focusable="false">' + (MOTIFS[name] || MOTIFS.lotus) + "</svg>";
  }

  function cardHTML(c, extraClass) {
    return (
      '<article class="card ' + (extraClass || "") + '" data-id="' + c.id + '" tabindex="0" role="button" aria-label="' + c.title + '">' +
        '<div class="card-inner">' +
          '<div class="face front">' +
            '<div class="frame" style="--accent:' + c.accent + '">' +
              '<div class="halo"></div>' +
              motifSVG(c.motif) +
              '<h2 class="card-title">' + c.title + "</h2>" +
              '<p class="didascalia">' + c.text + "</p>" +
            "</div>" +
          "</div>" +
          '<div class="face back">' +
            '<div class="frame back-frame" style="--accent:' + c.accent + '">' +
              '<div class="ornament">&#10022;</div>' +
              '<blockquote class="quote">&ldquo;' + c.quote + "&rdquo;</blockquote>" +
              '<cite class="source">' + c.source + "</cite>" +
              '<div class="ornament">&#10022;</div>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  const pagesEl = document.getElementById("pages");
  const dotsEl = document.getElementById("dots");
  const pageLabel = document.getElementById("pageLabel");
  const overlay = document.getElementById("overlay");
  const overlayStage = document.getElementById("overlayStage");
  const backBtn = document.getElementById("backBtn");
  const hint = document.getElementById("hint");

  let pageCount = 0;

  function viewedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem("santini-viewed") || "[]"));
    } catch (e) {
      return new Set();
    }
  }

  function markViewed(id) {
    const set = viewedSet();
    set.add(id);
    try {
      localStorage.setItem("santini-viewed", JSON.stringify(Array.from(set)));
    } catch (e) { /* storage non disponibile */ }
  }

  function build() {
    pagesEl.innerHTML = "";
    dotsEl.innerHTML = "";
    for (let p = 0; p * CARDS_PER_PAGE < COLLECTION.length; p++) {
      const slice = COLLECTION.slice(p * CARDS_PER_PAGE, (p + 1) * CARDS_PER_PAGE);
      const page = document.createElement("section");
      page.className = "page";
      page.setAttribute("aria-label", "Pagina " + (p + 1));
      const grid = document.createElement("div");
      grid.className = "grid";
      slice.forEach(function (c) {
        grid.insertAdjacentHTML("beforeend", cardHTML(c, "mini"));
      });
      page.appendChild(grid);
      pagesEl.appendChild(page);

      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", "Vai alla pagina " + (p + 1));
      dot.addEventListener("click", function () {
        goToPage(p);
      });
      dotsEl.appendChild(dot);
    }
    pageCount = Math.ceil(COLLECTION.length / CARDS_PER_PAGE);
    const seen = viewedSet();
    seen.forEach(function (id) {
      const mini = pagesEl.querySelector('[data-id="' + id + '"]');
      if (mini) mini.classList.add("viewed");
    });
    pagesEl.addEventListener("scroll", onScroll, { passive: true });
    updateDots();
  }

  function currentPage() {
    return Math.round(pagesEl.scrollLeft / pagesEl.clientWidth);
  }

  function updateDots() {
    const cur = Math.min(currentPage(), pageCount - 1);
    Array.from(dotsEl.children).forEach(function (d, i) {
      d.classList.toggle("active", i === cur);
    });
    pageLabel.textContent = "Pagina " + (cur + 1) + " di " + pageCount;
  }

  let scrollRaf = null;
  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = null;
      updateDots();
    });
  }

  function goToPage(p) {
    pagesEl.scrollTo({ left: p * pagesEl.clientWidth, behavior: "smooth" });
  }

  function openOverlay(card) {
    overlayStage.innerHTML = "";
    overlayStage.insertAdjacentHTML("beforeend", cardHTML(card, "large"));
    const el = overlayStage.querySelector(".card");
    el.addEventListener("click", function () {
      el.classList.toggle("flipped");
      if (el.classList.contains("flipped")) {
        hint.textContent = "Tocca per tornare al fronte";
        markViewed(card.id);
        const mini = pagesEl.querySelector('[data-id="' + card.id + '"]');
        if (mini) mini.classList.add("viewed");
      } else {
        hint.textContent = "Tocca la carta per girarla";
      }
    });
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add("show");
    });
    document.body.classList.add("lock");
  }

  function closeOverlay() {
    overlay.classList.remove("show");
    document.body.classList.remove("lock");
    window.setTimeout(function () {
      overlay.hidden = true;
      overlayStage.innerHTML = "";
    }, 250);
  }

  pagesEl.addEventListener("click", function (ev) {
    const card = ev.target.closest(".card");
    if (!card) return;
    const data = COLLECTION.find(function (c) { return c.id === card.dataset.id; });
    if (data) openOverlay(data);
  });

  backBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", function (ev) {
    if (ev.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", function (ev) {
    if (!overlay.hidden) {
      if (ev.key === "Escape") closeOverlay();
      if (ev.key === " " || ev.key === "Enter") {
        const el = overlayStage.querySelector(".card");
        if (el) el.classList.toggle("flipped");
      }
      return;
    }
    if (ev.key === "ArrowRight") goToPage(Math.min(currentPage() + 1, pageCount - 1));
    if (ev.key === "ArrowLeft") goToPage(Math.max(currentPage() - 1, 0));
  });

  build();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
