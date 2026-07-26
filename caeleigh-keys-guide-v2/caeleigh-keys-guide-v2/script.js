// Caeleigh's Florida Keys Field Guide — app logic
// Small vanilla hash-router, modeled on a searchable directory site.

const CAT_LABEL = { sharks: "Sharks", fish: "Fish & Rays", shells: "Shells & Mollusks", other: "Reef Invertebrates" };
const CAT_EMOJI = { sharks: "🦈", fish: "🐠", shells: "🐚", other: "🦀" };

const app = document.getElementById("app");

/* ---------- tiny DOM helper ---------- */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  });
  children.flat().forEach(child => {
    if (child == null) return;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return node;
}

const searchIconSVG = '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>';
const clearIconSVG = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';

function svgIcon(cls, path, size = 18) {
  return el("svg", {
    class: cls, width: String(size), height: String(size),
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round",
    html: path
  });
}

function highlight(text, q) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  const span = document.createElement("span");
  span.appendChild(document.createTextNode(text.slice(0, idx)));
  const mark = document.createElement("mark");
  mark.textContent = text.slice(idx, idx + q.length);
  span.appendChild(mark);
  span.appendChild(document.createTextNode(text.slice(idx + q.length)));
  return span;
}

/* ---------- routing ---------- */
function parseHash() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [path, queryStr] = hash.split("?");
  return { path, params: new URLSearchParams(queryStr || "") };
}

function setActiveNav(route) {
  document.querySelectorAll(".site-nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

function render() {
  const { path } = parseHash();
  if (path === "/" || path === "") renderHome();
  else if (path === "/directory") renderDirectory();
  else if (path === "/spotted") renderSpotted();
  else if (path === "/resources") renderResources();
  else renderHome();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);

/* ---------- shared: species filtering ---------- */
function speciesMatching(query, cat) {
  const q = (query || "").trim().toLowerCase();
  return SPECIES.filter(s => {
    const catOk = !cat || cat === "all" || s.cat === cat;
    const qOk = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
    return catOk && qOk;
  });
}

function resultCard(s, query) {
  const card = el("div", { class: "result-card" },
    el("div", { class: "result-icon", "data-cat": s.cat }, CAT_EMOJI[s.cat]),
    el("div", { class: "result-body" },
      el("div", { class: "result-header" },
        el("span", { class: "result-name" }, highlight(s.name, query)),
        el("span", { class: "result-tag", "data-cat": s.cat }, CAT_LABEL[s.cat]),
        s.spotted ? el("span", { class: "result-badge" }, "🏝️ we found this") : null
      ),
      el("div", { class: "result-fields" },
        el("div", { class: "result-field" },
          el("span", { class: "result-field-label" }, "Size"),
          el("span", { class: "result-field-value" }, s.size)
        ),
        el("div", { class: "result-field" },
          el("span", { class: "result-field-label" }, "About"),
          el("span", { class: "result-field-value" }, highlight(s.desc, query))
        ),
        el("div", { class: "result-field" },
          el("span", { class: "result-field-label" }, "Reef Role"),
          el("span", { class: "result-field-value" }, highlight(s.role, query))
        )
      )
    )
  );
  return card;
}

/* ---------- HOME ---------- */
function renderHome() {
  setActiveNav("home");
  app.innerHTML = "";

  const counts = { sharks: 0, fish: 0, shells: 0, other: 0 };
  SPECIES.forEach(s => counts[s.cat]++);
  const spottedCount = SPECIES.filter(s => s.spotted).length;

  const hero = el("section", { class: "hero" },
    el("p", { class: "hero-eyebrow" }, "Islamorada · Florida Keys"),
    el("h1", {}, "Caeleigh's ", el("em", {}, "Florida Keys"), " Field Guide"),
    el("p", { class: "hero-lede" },
      "A searchable directory of every shark, fish, shell, and reef critter we met on our trip — plus their role in the Keys reef ecosystem."),
    (() => {
      const wrap = el("div", { class: "search-hero" },
        svgIcon("", searchIconSVG, 20),
        el("input", {
          type: "search",
          placeholder: `Search ${SPECIES.length} creatures…`,
          onInput: (e) => {
            const q = e.target.value;
            if (q.trim().length > 0) location.hash = `#/directory?q=${encodeURIComponent(q)}`;
          }
        })
      );
      return wrap;
    })()
  );

  const stats = el("div", { class: "stats" },
    statBlock(SPECIES.length, "Total Species"),
    statBlock(counts.sharks, "Sharks"),
    statBlock(counts.fish, "Fish & Rays"),
    statBlock(counts.shells, "Shells"),
    statBlock(counts.other, "Invertebrates"),
    statBlock(spottedCount, "Spotted On Our Trip")
  );

  const sectionHead = el("div", { class: "section-heading" },
    el("h2", {}, "Browse by Category")
  );

  const grid = el("div", { class: "lab-grid" });
  Object.keys(CAT_LABEL).forEach(cat => {
    const count = counts[cat];
    const tile = el("a", { class: "lab-tile", href: `#/directory?cat=${cat}` },
      el("div", { class: "lab-tile-photo" }, CAT_EMOJI[cat]),
      el("div", { class: "lab-tile-body" },
        el("div", { class: "lab-tile-name" }, CAT_LABEL[cat]),
        el("div", { class: "lab-tile-meta" }, `${count} species`)
      )
    );
    grid.appendChild(tile);
  });

  app.appendChild(hero);
  app.appendChild(stats);
  app.appendChild(sectionHead);
  app.appendChild(grid);
}

function statBlock(num, label) {
  return el("div", { class: "stat" },
    el("div", { class: "stat-number" }, String(num)),
    el("div", { class: "stat-label" }, label.toUpperCase())
  );
}

/* ---------- DIRECTORY ---------- */
function renderDirectory() {
  setActiveNav("directory");
  const { params } = parseHash();
  const initialQuery = params.get("q") || "";
  const initialCat = params.get("cat") || "all";

  app.innerHTML = "";
  app.appendChild(el("h1", { class: "view-title" }, "Species Directory"));
  app.appendChild(el("p", { class: "view-subtitle" },
    "Search across every creature by name, description, or its role in the reef."));

  const searchPanel = el("div", { class: "search-panel" });
  const inputWrap = el("div", { class: "search-input-wrap" });
  const input = el("input", {
    type: "search",
    placeholder: `Search ${SPECIES.length} creatures…`,
    value: initialQuery,
    "aria-label": "Filter directory"
  });
  const clearBtn = el("button", { class: "search-clear" + (initialQuery ? " visible" : ""), "aria-label": "Clear search" },
    svgIcon("", clearIconSVG, 16));
  clearBtn.addEventListener("click", () => { input.value = ""; input.focus(); doRender(); });

  inputWrap.appendChild(svgIcon("icon-search", searchIconSVG));
  inputWrap.appendChild(input);
  inputWrap.appendChild(clearBtn);
  searchPanel.appendChild(inputWrap);

  const chipsWrap = el("div", { class: "filter-chips" });
  let activeCat = initialCat;
  const chips = ["all", "sharks", "fish", "shells", "other"].map(cat => {
    const label = cat === "all" ? "All" : `${CAT_EMOJI[cat]} ${CAT_LABEL[cat]}`;
    const chip = el("button", { class: "chip" + (cat === activeCat ? " active" : ""), "data-cat": cat }, label);
    chip.addEventListener("click", () => {
      activeCat = cat;
      chipsWrap.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      doRender();
    });
    chipsWrap.appendChild(chip);
    return chip;
  });
  searchPanel.appendChild(chipsWrap);

  const countEl = el("div", { class: "result-count" });
  searchPanel.appendChild(countEl);

  const resultsEl = el("div", { class: "results" });

  app.appendChild(searchPanel);
  app.appendChild(resultsEl);

  function doRender() {
    const q = input.value.trim();
    clearBtn.classList.toggle("visible", q.length > 0);
    const list = speciesMatching(q, activeCat);

    countEl.innerHTML = "";
    countEl.appendChild(document.createTextNode("Showing "));
    const strong = document.createElement("strong");
    strong.textContent = list.length;
    countEl.appendChild(strong);
    countEl.appendChild(document.createTextNode(` of ${SPECIES.length} creatures`));

    resultsEl.innerHTML = "";
    if (list.length === 0) {
      resultsEl.appendChild(el("div", { class: "empty-state" },
        el("h3", {}, "No creatures match"),
        el("p", {}, "Try a different search term or category.")
      ));
      return;
    }
    list.forEach(s => resultsEl.appendChild(resultCard(s, q)));
  }

  input.addEventListener("input", doRender);
  doRender();
}

/* ---------- SPOTTED ---------- */
function renderSpotted() {
  setActiveNav("spotted");
  app.innerHTML = "";
  const list = SPECIES.filter(s => s.spotted);

  app.appendChild(el("h1", { class: "view-title" }, "Spotted On Our Trip"));
  app.appendChild(el("p", { class: "view-subtitle" },
    `${list.length} creatures from actual specimens and photos we saw firsthand in the Keys — everything else in the directory is a reference species from the same reef.`));

  const resultsEl = el("div", { class: "results" });
  list.forEach(s => resultsEl.appendChild(resultCard(s, "")));
  app.appendChild(resultsEl);
}

/* ---------- RESOURCES ---------- */
function renderResources() {
  setActiveNav("resources");
  app.innerHTML = "";
  app.appendChild(el("h1", { class: "view-title" }, "About This Guide"));
  app.appendChild(el("p", { class: "view-subtitle" }, "How the guide works, and how to add real photos or publish it online."));

  const list = el("div", { class: "resources-list" });

  function category(title, items) {
    const cat = el("div", { class: "resource-category" }, el("h3", {}, title));
    items.forEach(([icon, title, desc]) => {
      cat.appendChild(el("div", { class: "resource-item" },
        el("div", { class: "resource-icon" }, icon),
        el("div", {},
          el("div", { class: "resource-title" }, title),
          el("div", { class: "resource-description", html: desc })
        )
      ));
    });
    list.appendChild(cat);
  }

  category("Adding Real Photos", [
    ["📷", "Drop in your own photos",
      "Every species has an <code>id</code> in <code>data.js</code>. Save a photo as <code>images/&lt;id&gt;.jpg</code> (e.g. <code>images/nurse-shark.jpg</code>) and reference it in a card — no code changes needed beyond adding an <code>&lt;img&gt;</code> tag."],
    ["🌊", "Good sources for reference species",
      "Wikimedia Commons, NOAA's photo library, and Florida Fish and Wildlife's public galleries are good public-domain sources for species you didn't personally photograph."]
  ]);

  category("Publishing This Guide", [
    ["🚀", "Deploy free on GitHub Pages",
      "Upload this folder to a GitHub repository, then go to <b>Settings → Pages</b>, set the source to your main branch, and GitHub will host it at a free URL within a minute or two."],
    ["🛠️", "No build tools required",
      "This is a plain HTML/CSS/JS site — open <code>index.html</code> directly in a browser to preview it, or drop the folder straight into any static host."]
  ]);

  category("Using the Directory", [
    ["🔍", "Search & filter",
      "The Directory page searches names, descriptions, and reef-role text together, and can be filtered to one category using the colored chips."],
    ["🏝️", "Spotted On Our Trip",
      "This tab shows only the species from actual specimens and photos taken on the trip, separate from the wider reference species list."]
  ]);

  app.appendChild(list);
}

render();
