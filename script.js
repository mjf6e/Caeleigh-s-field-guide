// Caeleigh's Florida Keys Field Guide — app logic

const CAT_LABEL = { sharks:"Sharks", fish:"Fish & Rays", shells:"Shells & Mollusks", other:"Reef Invertebrates", birds:"Birds" };
const CAT_EMOJI = { sharks:"🦈", fish:"🐠", shells:"🐚", other:"🦀", birds:"🐦" };

let state = {
  activeCat: "all",
  query: "",
  quizMode: false,
  quizOrder: [],
  quizIndex: 0
};

const grid = document.getElementById("grid");
const countNote = document.getElementById("countNote");
const quizBar = document.getElementById("quizBar");
const quizProgress = document.getElementById("quizProgress");

function filteredSpecies(){
  return SPECIES.filter(s=>{
    const catOk = state.activeCat === "all" ? true
      : state.activeCat === "spotted" ? !!s.spotted
      : s.cat === state.activeCat;
    const q = state.query.trim().toLowerCase();
    const queryOk = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
    return catOk && queryOk;
  });
}

function cardHTML(s){
  return `
  <div class="card" data-id="${s.id}">
    <div class="card-inner">
      <div class="face front" data-cat="${s.cat}">
        <div class="tabstrip"></div>
        <div class="punch"></div>
        <div class="media">
          <img src="${s.img || ('images/' + s.id + '.jpg')}" alt="${s.name}" loading="lazy"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="fallback" style="display:none">${CAT_EMOJI[s.cat]}</div>
          ${s.spotted ? '<div class="spotted-badge">🏨 Around Hilton Key West Resort &amp; Marina</div>' : ''}
        </div>
        <div class="face-body">
          <p class="name">${s.name}</p>
          <p class="size mono">${s.size}</p>
          <p class="flip-hint">tap to flip →</p>
        </div>
      </div>
      <div class="face back" data-cat="${s.cat}">
        <div class="tabstrip"></div>
        <p class="name">${s.name}</p>
        <div class="back-scroll">
          <p class="section-label">About</p>
          <p class="desc-text">${s.desc}</p>
          <p class="section-label">Role in the Florida Keys Reef</p>
          <p class="role-text">${s.role}</p>
        </div>
      </div>
    </div>
  </div>`;
}

function render(){
  let list = state.quizMode
    ? state.quizOrder.slice(state.quizIndex, state.quizIndex+1).map(i=>SPECIES[i])
    : filteredSpecies();

  if(list.length === 0){
    grid.innerHTML = `<div class="empty-state">No creatures match "${state.query}" 🐚<br>Try another search!</div>`;
  } else {
    grid.innerHTML = list.map(cardHTML).join("");
  }

  grid.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=> card.classList.toggle("flipped"));
  });

  countNote.textContent = state.quizMode
    ? ""
    : `Showing ${list.length} of ${SPECIES.length} creatures`;

  if(state.quizMode){
    quizProgress.textContent = `Card ${state.quizIndex+1} of ${state.quizOrder.length}`;
  }
}

// tabs
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    state.activeCat = btn.dataset.cat;
    render();
  });
});

// search
document.getElementById("searchInput").addEventListener("input", e=>{
  state.query = e.target.value;
  render();
});

// quiz mode
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

document.getElementById("quizToggle").addEventListener("click", ()=>{
  state.quizMode = true;
  const pool = filteredSpecies();
  state.quizOrder = shuffle(pool.map(s=>SPECIES.indexOf(s)));
  state.quizIndex = 0;
  quizBar.classList.add("active");
  render();
});

document.getElementById("quizExit").addEventListener("click", ()=>{
  state.quizMode = false;
  quizBar.classList.remove("active");
  render();
});

document.getElementById("quizNext").addEventListener("click", ()=>{
  state.quizIndex = (state.quizIndex + 1) % state.quizOrder.length;
  render();
});

document.getElementById("quizShuffle").addEventListener("click", ()=>{
  state.quizOrder = shuffle(state.quizOrder);
  state.quizIndex = 0;
  render();
});

function fillStats(){
  const counts = { sharks:0, fish:0, shells:0, other:0, birds:0 };
  SPECIES.forEach(s=> counts[s.cat]++ );
  document.getElementById("statTotal").textContent = SPECIES.length;
  document.getElementById("statSharks").textContent = counts.sharks;
  document.getElementById("statFish").textContent = counts.fish;
  document.getElementById("statShells").textContent = counts.shells;
  document.getElementById("statOther").textContent = counts.other;
  document.getElementById("statBirds").textContent = counts.birds;
  document.getElementById("statSpotted").textContent = SPECIES.filter(s=>s.spotted).length;
}

fillStats();
render();
