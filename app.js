/* =============================================================
   NÓS ALIVE — Guia (lógica da app)
   Não precisas de editar este ficheiro para mudar o lineup.
   Edita só o data.js.
   ============================================================= */

// ---------- Estado ----------
const state = {
  tab: "all",                              // all | mine | now | map
  // arranca no dia do festival em que estamos (fora do festival, cai no Dia 1)
  day: festivalNow().day,
  stageFilter: null,                       // id de palco ou null
  onlyFav: false,
  onlyReco: false,
  detailId: null,                          // concerto aberto no ecrã de detalhe
  favs: new Set(JSON.parse(localStorage.getItem("na_favs") || "[]")),
};

const stageById = Object.fromEntries(FESTIVAL.stages.map(s => [s.id, s]));
const dayById   = Object.fromEntries(FESTIVAL.days.map(d => [d.id, d]));
const RECOS     = FESTIVAL.recos || {};
const recoFor   = (artist) => RECOS[artist] || null;
const imageFor  = (artist) => (FESTIVAL.images || {})[artist] || null;
const bioFor    = (artist) => (FESTIVAL.bios || {})[artist] || null;
const linksFor  = (artist) => (FESTIVAL.links || {})[artist] || {};
const spotifySearch = (artist) => "https://open.spotify.com/search/" + encodeURIComponent(artist);
const ytSearch      = (artist) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(artist);

// dá um id único a cada concerto (para favoritos)
FESTIVAL.shows.forEach((s, i) => { s.id = `${s.day}-${s.stage}-${s.start}-${i}`; });

// ---------- Utilidades de tempo ----------
// Minutos desde a meia-noite; horas < 06:00 contam como "madrugada" (dia seguinte)
function mins(hhmm){
  const [h, m] = hhmm.split(":").map(Number);
  let t = h * 60 + m;
  if (h < 6) t += 24 * 60;      // 00:30 vem depois das 23:00
  return t;
}
function overlaps(a, b){
  return a.day === b.day && mins(a.start) < mins(b.end) && mins(b.start) < mins(a.end);
}
function fmtRange(s){ return `${s.start} – ${s.end}`; }

// "Agora" com a hora real. A "noite" do festival só vira de dia às 06:00,
// por isso a madrugada (00:00–05:59) ainda conta como o dia anterior.
// Fora dos dias do festival, mostra uma pré-visualização às 22:20 do Dia 1.
function festivalNow(){
  const now = new Date();
  const h = now.getHours(), mi = now.getMinutes();
  const ref = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (h < 6 ? 1 : 0));
  const iso = `${ref.getFullYear()}-${String(ref.getMonth()+1).padStart(2,"0")}-${String(ref.getDate()).padStart(2,"0")}`;
  const realDay = FESTIVAL.days.find(d => d.iso === iso);
  if (realDay){
    return { day: realDay.id, t: mins(String(h).padStart(2,"0")+":"+String(mi).padStart(2,"0")) };
  }
  return { day: FESTIVAL.days[0].id, t: mins("22:20"), simulated: true };
}
const dayIndex = id => FESTIVAL.days.findIndex(d => d.id === id);
// Preto ou branco — o que der MAIS contraste sobre a cor de fundo (WCAG).
// Um limiar fixo de luminância escolhe mal em cores de tom médio.
function textOn(hex){
  const c = hex.replace("#","");
  const lin = [0,2,4].map(i => {
    const v = parseInt(c.substr(i,2),16) / 255;
    return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  });
  const L = 0.2126*lin[0] + 0.7152*lin[1] + 0.0722*lin[2];
  const comBranco = 1.05 / (L + 0.05);   // contraste contra #fff
  const comPreto  = (L + 0.05) / 0.05;   // contraste contra #000
  return comPreto >= comBranco ? "#000" : "#fff";
}

// ---------- Persistência ----------
function saveFavs(){ localStorage.setItem("na_favs", JSON.stringify([...state.favs])); }
function toggleFav(id){
  state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
  saveFavs(); render();
  if (state.detailId) renderSheet();   // mantém o detalhe em sincronia
}

// ---------- Consultas ----------
function showsForDay(day){
  return FESTIVAL.shows.filter(s => s.day === day)
    .sort((a,b) => mins(a.start) - mins(b.start));
}
function favShows(){
  return FESTIVAL.shows.filter(s => state.favs.has(s.id));
}
// "Para ti" verde = artista que está mesmo na tua playlist
const isPlaylistReco = s => { const r = recoFor(s.artist); return !!r && r.tier === "playlist"; };
// A AGENDA = o que guardaste + os verdes (na tua playlist)
const inAgenda = s => state.favs.has(s.id) || isPlaylistReco(s);
function agendaShows(){ return FESTIVAL.shows.filter(inAgenda); }
function agendaForDay(day){
  return agendaShows().filter(s => s.day === day).sort((a,b) => mins(a.start) - mins(b.start));
}
// Concertos da agenda que colidem com este
function conflictsFor(show){
  return agendaShows().filter(o => o.id !== show.id && overlaps(o, show));
}

// ---------- Componentes (HTML) ----------
function icon(name){
  const P = {
    heart:'<path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
    star:'<path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6-5.9-3.2-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"/>',
    check:'<path d="M20 6L9 17l-5-5"/>',
    warn:'<path d="M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    share:'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v14"/>',
    back:'<path d="M15 18l-6-6 6-6"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${P[name]}</svg>`;
}

function cardHTML(s, ctx){
  const st = stageById[s.stage];
  const fav = state.favs.has(s.id);
  const isLive = ctx.day === s.day && ctx.t >= mins(s.start) && ctx.t < mins(s.end);
  const isNext = ctx.day === s.day && mins(s.start) > ctx.t && mins(s.start) - ctx.t <= 45;
  const di = dayIndex(s.day), ndi = dayIndex(ctx.day);
  const isPast = di < ndi || (di === ndi && ctx.t >= mins(s.end));
  const conf = inAgenda(s) ? conflictsFor(s) : [];

  let tag = "";
  if (isLive)      tag = `<span class="live-tag">● AGORA</span>`;
  else if (isPast) tag = `<span class="past-tag">TERMINOU</span>`;
  else if (isNext) tag = `<span class="next-tag">A SEGUIR</span>`;

  const confHTML = conf.length
    ? `<span class="conflict">${icon("warn")} choca c/ ${conf.map(c=>c.artist).join(", ")}</span>`
    : "";

  const rec = recoFor(s.artist);
  const recLabel = rec && rec.tier === "playlist" ? "♫ Na tua playlist" : "★ Sugestão para ti";
  const recHTML = rec
    ? `<div class="reco ${rec.tier}">${recLabel}<span>${rec.why}</span></div>`
    : "";

  const img = imageFor(s.artist);
  const thumb = img ? `<img class="c-thumb" src="${img}" alt="" loading="lazy">` : "";

  return `
    <div class="card ${isLive?'live':''} ${rec?'rec '+rec.tier:''} ${isPast?'past':''}" onclick="openDetail('${s.id}')">
      <div class="card-b" style="--stage:${st.color}">
        <div class="c-main">
          <div class="c-time mono">${fmtRange(s)}${tag}</div>
          <div class="c-title">${s.artist}</div>
          <div class="c-meta">
            <span class="stg"><span class="sw" style="background:${st.color}"></span>${st.name}</span>
            ${s.genre?`<span>· ${s.genre}</span>`:""}
          </div>
          ${recHTML}
        </div>
        ${thumb}
      </div>
      <div class="c-foot">
        ${confHTML || '<span></span>'}
        <button class="fav ${fav?'on':''}" onclick="event.stopPropagation();toggleFav('${s.id}')">
          ${icon('star')} ${fav?'Guardado':'Guardar'}
        </button>
      </div>
    </div>`;
}

// ---------- Vistas ----------
function viewProgram(){
  const el = document.getElementById("view");

  // filtros de palco
  const chips = FESTIVAL.stages.map(s => {
    const on = state.stageFilter === s.id;
    return `<button class="chip stage-chip ${on?'on':''}"
      style="background:${s.color};color:${textOn(s.color)};border-color:${s.color}"
      onclick="setStage('${s.id}')">${s.name}</button>`;
  }).join("");

  const ctx = festivalNow();
  let cards, countTxt;

  if (state.onlyFav){
    // Guardados: TODOS os dias, agrupados por dia
    const favs = favShows().sort((a,b) =>
      a.day === b.day ? mins(a.start) - mins(b.start) : dayIndex(a.day) - dayIndex(b.day));
    countTxt = `${favs.length} guardado${favs.length!==1?'s':''} · todos os dias`;
    cards = favs.length
      ? FESTIVAL.days.map(d => {
          const items = favs.filter(s => s.day === d.id);
          if (!items.length) return "";
          return `<div class="daylabel">${d.long}</div>` + items.map(s => cardHTML(s, ctx)).join("");
        }).join("")
      : `<div class="empty"><b>Nada guardado</b>Toca em “Guardar” num concerto para o encontrares aqui.</div>`;
  } else {
    let list = showsForDay(state.day);
    if (state.stageFilter) list = list.filter(s => s.stage === state.stageFilter);
    if (state.onlyReco)    list = list.filter(s => recoFor(s.artist));
    countTxt = `${list.length} concerto${list.length!==1?'s':''} · ${dayById[state.day].long}`;
    cards = list.length
      ? list.map(s => cardHTML(s, ctx)).join("")
      : `<div class="empty"><b>Sem concertos</b>Experimenta outro dia ou tira os filtros.</div>`;
  }

  const noFilter = !state.stageFilter && !state.onlyFav && !state.onlyReco;
  el.innerHTML = `
    <div class="fbar">
      <button class="chip ${noFilter?'on':''}" onclick="clearFilters()">Todos</button>
      <button class="chip reco-chip ${state.onlyReco?'on':''}" onclick="toggleOnlyReco()">★ Para ti</button>
      <button class="chip ${state.onlyFav?'on':''}" onclick="toggleOnlyFav()">${icon('star')}&nbsp;Guardados</button>
      ${chips}
    </div>
    <div class="count">${countTxt}</div>
    ${cards}`;
  stickFbar();

  // No dia atual do festival, salta o scroll para a hora certa (agora / a seguir)
  if (pendingScrollToNow){
    pendingScrollToNow = false;
    const c = festivalNow();
    requestAnimationFrame(() => {
      if (!c.simulated && c.day === state.day) scrollToNowCard();
      else window.scrollTo(0, 0);
    });
  }
}

let pendingScrollToNow = false;
// coloca o primeiro concerto que ainda não terminou logo por baixo da barra fixa
function scrollToNowCard(){
  let target = null;
  for (const c of document.querySelectorAll("#view .card")){
    if (!c.classList.contains("past")){ target = c; break; }
  }
  if (!target) return;                       // tudo já terminou -> fica onde está
  const header = document.querySelector("header.top");
  const fbar = document.querySelector(".fbar");
  const off = (header ? header.offsetHeight : 0) + (fbar ? fbar.offsetHeight : 0) + 6;
  const y = window.scrollY + target.getBoundingClientRect().top - off;
  window.scrollTo(0, Math.max(0, y));
}

// A barra de filtros fica congelada logo por baixo do cabeçalho fixo (sem descer com os concertos)
function stickFbar(){
  const header = document.querySelector("header.top");
  const fbar = document.querySelector(".fbar");
  if (header && fbar) fbar.style.top = header.offsetHeight + "px";
}

// "1h 20min" / "45 min"
function fmtDur(min){
  const h = Math.floor(min/60), m = min%60;
  return h ? `${h}h${m ? " "+m+"min" : ""}` : `${m} min`;
}
// Bloco de tempo livre entre dois concertos da agenda
function gapBlock(from, to, day){
  const gap = mins(to) - mins(from);
  const livres = FESTIVAL.shows.filter(s =>
    s.day === day && mins(s.start) < mins(to) && mins(s.end) > mins(from)).length;
  return `<div class="gap">
    <div class="gap-t">${fmtDur(gap)} livres</div>
    <div class="gap-s">${from} – ${to}${livres ? ` · ${livres} concerto${livres!==1?"s":""} nesse intervalo` : ""}</div>
  </div>`;
}

function viewMine(){
  const el = document.getElementById("view");
  const ctx = festivalNow();

  if (!agendaShows().length){
    el.innerHTML = `<div class="empty"><b>A tua agenda está vazia</b>Toca em “Guardar” num concerto e ele aparece aqui, junto com os artistas da tua playlist.</div>`;
    return;
  }
  let html = "";
  FESTIVAL.days.forEach(d => {
    const items = agendaForDay(d.id);
    if (!items.length) return;
    const anyConflict = items.some(s => conflictsFor(s).length);
    html += `<div class="daylabel">${d.long}${anyConflict?' · ⚠️ sobreposições':''}</div>`;
    items.forEach((s, i) => {
      html += cardHTML(s, ctx);
      const next = items[i+1];
      if (next && mins(next.start) - mins(s.end) >= 15){   // < 15 min é tempo de deslocação
        html += gapBlock(s.end, next.start, d.id);
      }
    });
  });
  el.innerHTML = html;
}

function viewNow(){
  const el = document.getElementById("view");
  const ctx = festivalNow();
  const dLong = dayById[ctx.day].long;

  const live = FESTIVAL.shows.filter(s => s.day===ctx.day && ctx.t>=mins(s.start) && ctx.t<mins(s.end))
    .sort((a,b)=>mins(a.start)-mins(b.start));
  const next = FESTIVAL.shows.filter(s => s.day===ctx.day && mins(s.start)>ctx.t)
    .sort((a,b)=>mins(a.start)-mins(b.start)).slice(0,6);

  const sim = ctx.simulated ? `<div class="banner">Fora dos dias do festival — a mostrar uma pré-visualização às 22:20 do ${dayById[ctx.day].long}. Durante o festival usa a hora real.</div>`:"";

  el.innerHTML = `
    ${sim}
    <div class="daylabel">● A tocar agora</div>
    ${live.length ? live.map(s=>cardHTML(s,ctx)).join("") : `<div class="empty" style="padding:30px">Nada a tocar neste momento.</div>`}
    <div class="daylabel" style="padding-top:20px">A seguir</div>
    ${next.length ? next.map(s=>cardHTML(s,ctx)).join("") : `<div class="empty" style="padding:30px">Sem mais concertos hoje.</div>`}`;
}

function viewMap(){
  const el = document.getElementById("view");
  const m = FESTIVAL.map;
  const pins = m.pins.map(p => {
    const st = p.stage ? stageById[p.stage] : null;
    const color = st ? st.color : (p.color || "#111");
    const id = st ? st.id : "";
    const name = st ? st.name.replace('Palco ','') : (p.label||"");
    return `<div class="rpin stage" data-stage="${id}" style="left:${p.x*100}%;top:${p.y*100}%">
      <span class="rdot" style="background:${color}"></span>
      <span class="rlbl">${name}</span></div>`;
  }).join("");

  // legenda clicável — realça o palco no mapa
  const legend = FESTIVAL.stages.map(s =>
    `<span class="leg" onclick="highlightStage('${s.id}')"><span class="sw" style="background:${s.color}"></span>${s.name}</span>`).join("");

  el.innerHTML = `
    <div class="map-wrap">
      <div class="daylabel" style="padding:12px 0 10px">Mapa do recinto</div>
      <div class="rmap-scroll">
        <div class="rmap" style="aspect-ratio:${m.ratio}">
          <img src="${m.image}" alt="Mapa oficial do recinto NOS Alive" draggable="false">
          ${pins}
        </div>
      </div>
      <div class="legend">${legend}</div>
      <div class="banner" style="margin:16px 0 0">Mapa oficial do recinto (nosalive.com). Faz zoom com dois dedos para ver os detalhes.</div>
    </div>`;
}

const ASSIST_URL = "https://notebooklm.google.com/notebook/c2535847-a9b3-4826-8e94-69fb3591f27a/preview";
function viewAssist(){
  const el = document.getElementById("view");
  const i = FESTIVAL.info || {};
  const list = arr => `<ul class="info-list">${arr.map(x=>`<li>${x}</li>`).join("")}</ul>`;
  const block = (title, body) => `
    <div class="info-block"><div class="info-t">${title}</div><div class="info-c">${body}</div></div>`;
  el.innerHTML = `
    <div class="assist-wrap">
      <div class="daylabel" style="padding:6px 0 12px">Assistente do festival</div>
      <div class="assist-card">
        <div class="assist-emoji">💬</div>
        <h2>Fala com o guia do NOS Alive</h2>
        <p>Pergunta o que quiseres sobre o cartaz, horários, palcos ou o recinto. Abre o assistente (NotebookLM) numa nova janela.</p>
        <button class="assist-btn" onclick="openAssist()">Abrir o assistente ↗</button>
      </div>
      <div class="assist-note">Alimentado por Google NotebookLM. Requer ligação à internet.</div>

      <div class="daylabel" style="padding:24px 0 10px">Info útil</div>
      ${i.hours ? block("Horário do recinto", i.hours) : ""}
      ${i.tickets ? block("Bilhetes & pulseiras", i.tickets) : ""}
      ${i.transport ? block("Como chegar", list(i.transport)) : ""}
      ${i.rules ? block("Regras de entrada", list(i.rules)) : ""}
    </div>`;
}
function openAssist(){ window.open(ASSIST_URL, "_blank", "noopener"); }

// realça o palco no mapa ao tocar na legenda
function highlightStage(id){
  document.querySelectorAll(".rpin").forEach(el =>
    el.classList.toggle("hi", el.dataset.stage === id));
}

// ---------- Ações ----------
function setDay(id){ state.day = id; pendingScrollToNow = true; renderDays(); render(); }
function setStage(id){ state.stageFilter = state.stageFilter===id?null:id; state.onlyFav=false; state.onlyReco=false; render(); }
function clearFilters(){ state.stageFilter=null; state.onlyFav=false; state.onlyReco=false; render(); }
function toggleOnlyFav(){ state.onlyFav=!state.onlyFav; state.stageFilter=null; state.onlyReco=false; render(); }
function toggleOnlyReco(){ state.onlyReco=!state.onlyReco; state.stageFilter=null; state.onlyFav=false; render(); }
function setTab(t){
  state.tab = t; renderNav();
  if (t === "all") pendingScrollToNow = true;
  render();
  if (t !== "all") window.scrollTo(0, 0);
}

// ---------- Render ----------
function renderDays(){
  const showStrip = state.tab==="all";
  document.getElementById("days").style.display = showStrip ? "flex":"none";
  if (!showStrip) return;
  document.getElementById("days").innerHTML = FESTIVAL.days.map(d =>
    `<button class="day ${d.id===state.day?'active':''}" onclick="setDay('${d.id}')">
       <div class="dow">${d.dow}</div><div class="num">${d.num}</div></button>`).join("");
}
function renderNav(){
  document.querySelectorAll("nav.bottom button").forEach(b =>
    b.classList.toggle("on", b.dataset.tab === state.tab));
  // o contador mostra SÓ o que tens na agenda para o dia de hoje (limpa-se de um dia para o outro)
  const badge = document.getElementById("mineBadge");
  const n = agendaForDay(festivalNow().day).length;
  badge.style.display = n ? "flex":"none"; badge.textContent = n;
}
function render(){
  renderNav();
  renderDays();
  ({ all:viewProgram, mine:viewMine, now:viewNow, map:viewMap, assist:viewAssist })[state.tab]();
}

// ---------- Perfil ----------
function openProfile(){
  const p = FESTIVAL.profile; if (!p) return;
  document.getElementById("profileCard").innerHTML = `
    <button class="profile-close" onclick="closeProfile()" aria-label="Fechar">✕</button>
    <img class="profile-photo" src="${p.photo}" alt="${p.name}">
    <div class="profile-name">${p.name}</div>
    ${p.subtitle ? `<div class="profile-sub">${p.subtitle}</div>` : ""}
    <div class="profile-links">
      ${p.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" style="background:${l.color}">${l.label}</a>`).join("")}
    </div>`;
  document.getElementById("profile").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeProfile(){
  document.getElementById("profile").classList.remove("open");
  document.body.style.overflow = "";
}

// ---------- Pesquisa ----------
const _norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function openSearch(){
  document.getElementById("search").classList.add("open");
  const inp = document.getElementById("searchInput");
  inp.value = ""; runSearch("");
  document.body.style.overflow = "hidden";
  setTimeout(() => inp.focus(), 60);
}
function closeSearch(){
  document.getElementById("search").classList.remove("open");
  document.body.style.overflow = "";
}
function openFromSearch(id){ closeSearch(); openDetail(id); }
function runSearch(q){
  const res = document.getElementById("searchResults");
  const nq = _norm(q.trim());
  if (!nq){ res.innerHTML = `<div class="search-hint">Escreve o nome de um artista, palco ou género.</div>`; return; }
  let m = FESTIVAL.shows.filter(s =>
    _norm(s.artist).includes(nq) ||
    _norm(stageById[s.stage].name).includes(nq) ||
    (s.genre && _norm(s.genre).includes(nq)));
  m.sort((a,b) => a.day===b.day ? mins(a.start)-mins(b.start) : a.day.localeCompare(b.day));
  if (!m.length){ res.innerHTML = `<div class="search-hint">Nada encontrado.</div>`; return; }
  res.innerHTML = m.slice(0,50).map(s => {
    const st = stageById[s.stage], d = dayById[s.day], img = imageFor(s.artist);
    const pic = img ? `<img class="sres-img" src="${img}" alt="">`
                    : `<span class="sres-img" style="background:${st.color}"></span>`;
    return `<button class="sres" onclick="openFromSearch('${s.id}')">
      ${pic}
      <span class="sres-main">
        <span class="sres-title">${s.artist}</span>
        <span class="sres-sub"><span class="sw" style="background:${st.color}"></span>${st.name} · ${d.dow} ${d.num} · ${s.start}</span>
      </span></button>`;
  }).join("");
}

// ---------- Ecrã de detalhe ----------
function openDetail(id){
  state.detailId = id;
  renderSheet();
  document.getElementById("sheet").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeDetail(){
  state.detailId = null;
  document.getElementById("sheet").classList.remove("open");
  document.body.style.overflow = "";
}
function shareShow(id){
  const s = FESTIVAL.shows.find(x => x.id === id); if(!s) return;
  const st = stageById[s.stage], d = dayById[s.day];
  const txt = `${s.artist} — ${FESTIVAL.name} ${FESTIVAL.edition}\n${d.long}, ${fmtRange(s)} · ${st.name}`;
  if (navigator.share) navigator.share({ title: s.artist, text: txt }).catch(()=>{});
  else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(()=>alert("Copiado!"));
}
function renderSheet(){
  const s = FESTIVAL.shows.find(x => x.id === state.detailId);
  const sheet = document.getElementById("sheet");
  if (!s){ sheet.innerHTML = ""; return; }
  const st = stageById[s.stage], d = dayById[s.day];
  const fav = state.favs.has(s.id);
  const rec = recoFor(s.artist);
  const ctx = festivalNow();
  const isLive = ctx.day === s.day && ctx.t >= mins(s.start) && ctx.t < mins(s.end);
  const conf = conflictsFor(s);

  const recBlock = rec ? `
    <div class="sec-lbl ${rec.tier}-lbl">${rec.tier === "playlist" ? "♫ Na tua playlist" : "★ Sugestão para ti"}</div>
    <div class="sec-body reco-body ${rec.tier}">${rec.why}</div>` : "";

  const confBlock = conf.length ? `
    <div class="sec-lbl warn-lbl">⚠️ Sobreposição na tua agenda</div>
    <div class="sec-body">${conf.map(c=>{
      const cs = stageById[c.stage];
      return `<div class="conf-row"><b>${c.artist}</b><span>${fmtRange(c)} · ${cs.name}</span></div>`;
    }).join("")}</div>` : "";

  const img = imageFor(s.artist);
  const hdStyle = img
    ? `background:${st.color} url('${img}') center/cover;`
    : `background:${st.color};`;
  const bio = bioFor(s.artist);
  const musicStage = !["comedia","literario"].includes(s.stage);
  const L = linksFor(s.artist);
  let spot = "";
  if (musicStage){
    const btns = [
      `<a class="lk lk-sp" href="${L.spotify || spotifySearch(s.artist)}" target="_blank" rel="noopener">Spotify</a>`,
      `<a class="lk lk-yt" href="${L.youtube || ytSearch(s.artist)}" target="_blank" rel="noopener">YouTube</a>`,
    ];
    if (L.site) btns.push(`<a class="lk lk-web" href="${L.site}" target="_blank" rel="noopener">Site oficial</a>`);
    spot = `<div class="lk-row">${btns.join("")}</div>`;
  }

  sheet.innerHTML = `
    <div class="sheet-hd ${img?'has-img':''}" style="${hdStyle}">
      <div class="sheet-top">
        <button class="s-btn" onclick="closeDetail()">${icon('back')}</button>
        <button class="s-btn" onclick="shareShow('${s.id}')">${icon('share')}</button>
      </div>
      <div class="sheet-stage"><span class="sw" style="background:#fff"></span>${st.name}${isLive?' · ● A TOCAR':''}</div>
      <h1 class="sheet-title">${s.artist}</h1>
      <div class="sheet-time mono">${fmtRange(s)}</div>
    </div>

    <div class="sheet-body">
      <div class="sec-lbl">Quando & onde</div>
      <div class="sec-body">
        <div class="info-row"><span>Dia</span><b>${d.long}</b></div>
        <div class="info-row"><span>Hora</span><b>${fmtRange(s)}${mins(s.end)>1440?' (madrugada)':''}</b></div>
        <div class="info-row"><span>Palco</span><b>${st.name}</b></div>
        ${s.genre?`<div class="info-row"><span>Género</span><b>${s.genre}</b></div>`:""}
      </div>
      ${bio ? `<div class="sec-lbl">Sobre</div><div class="sec-body bio-body">${bio}${spot}</div>` : (spot ? `<div class="sec-body bio-body">${spot}</div>` : "")}
      ${recBlock}
      ${confBlock}
    </div>

    <div class="sheet-cta">
      <button class="${fav?'on':''}" onclick="toggleFav('${s.id}')">
        ${icon('star')} ${fav?'Guardado na tua agenda':'Guardar na minha agenda'}
      </button>
    </div>`;
}

// Próximo compromisso: favorito ou "Para ti" que ainda não terminou hoje.
// Empate/sobreposição -> "Para ti" tem prioridade. Serve para colorir o relógio.
function nextRelevant(ctx){
  const cands = FESTIVAL.shows.filter(s =>
    s.day === ctx.day && mins(s.end) > ctx.t &&
    (state.favs.has(s.id) || recoFor(s.artist)));
  if (!cands.length) return null;
  cands.sort((a,b) => mins(a.start) - mins(b.start));
  const first = cands[0];
  const concurrent = cands.filter(s => overlaps(s, first) || mins(s.start) === mins(first.start));
  const chosen = concurrent.find(s => recoFor(s.artist)) || first;   // Para ti ganha
  return chosen;
}

// ---------- Arranque ----------
// impede o browser de restaurar o scroll antigo (senão luta com o salto para a hora atual)
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

document.querySelectorAll("nav.bottom button").forEach(b =>
  b.addEventListener("click", () => setTab(b.dataset.tab)));
window.addEventListener("resize", () => { if (state.tab === "all") stickFbar(); });

let lastMinute = -1;
function tickClock(){
  const n = new Date();
  const hh = String(n.getHours()).padStart(2,"0");
  const mm = String(n.getMinutes()).padStart(2,"0");
  document.getElementById("clockT").textContent = `${hh}:${mm}`;

  // a cada minuto novo, re-render para acertar passado/agora/a seguir (mantém o scroll)
  const cur = n.getHours()*60 + n.getMinutes();
  if (cur !== lastMinute){
    lastMinute = cur;
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
    if (state.detailId) renderSheet();
  }
}
tickClock();
setInterval(tickClock, 15000);

renderDays();
pendingScrollToNow = true;
render();
