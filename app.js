"use strict";

/* ---------------- UTIL ---------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function shuffle(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const $ = (id) => document.getElementById(id);

/* ---------------- BANK SOAL RAMBU ----------------
   img  : nama file di folder assets/rambu/
   cat  : larangan | peringatan | perintah | petunjuk
   shape: bentuk fallback (prohibit|stop|warning|mandatory|info|light)
   opts : jawaban BENAR selalu ditulis PERTAMA (diacak saat tampil)
---------------------------------------------------- */
function makeQ(img, cat, shape, sym, q, opts){
  return { img, cat, shape, sym, q, opts };
}
const QUESTIONS = [
  // --- LARANGAN ---
  makeQ("dilarang-parkir.png", "larangan", "prohibit", "P",
    "Rambu lingkaran merah berisi huruf P yang dicoret artinya…",
    ["Dilarang parkir", "Dilarang berhenti", "Tempat parkir", "Parkir gratis"]),
    
  makeQ("dilarang-berhenti.png", "larangan", "prohibit", "S",
    "Rambu lingkaran merah berisi huruf S yang dicoret artinya…",
    ["Dilarang berhenti", "Dilarang parkir", "Dilarang masuk", "Boleh berhenti semaunya"]),
    
  makeQ("dilarang-masuk.png", "larangan", "prohibit", "▬",
    "Rambu lingkaran merah dengan garis putih mendatar artinya…",
    ["Semua kendaraan dilarang masuk", "Jalan satu arah", "Dilarang parkir", "Pintu keluar tol"]),
    
  makeQ("dilarang-melintas.png", "larangan", "prohibit", "🚷",
    "Rambu lingkaran merah bergambar pejalan kaki yang dicoret artinya…",
    ["Pejalan kaki dilarang melintas", "Wajib berjalan kaki", "Area pejalan kaki", "Dilarang menyeberang"]),
    
  makeQ("dilarang-belok-kiri.png", "larangan", "prohibit", "↰",
    "Rambu panah belok kiri yang dicoret garis merah artinya…",
    ["Dilarang belok kiri", "Wajib belok kiri", "Dilarang belok kanan", "Jalan buntu"]),
    
  makeQ("dilarang-belok-kanan.png", "larangan", "prohibit", "↱",
    "Rambu panah belok kanan yang dicoret garis merah artinya…",
    ["Dilarang belok kanan", "Wajib belok kanan", "Dilarang belok kiri", "Hati-hati belokan"]),
    
  makeQ("dilarang-putar-balik.png", "larangan", "prohibit", "U",
    "Rambu panah putar balik yang dicoret artinya…",
    ["Dilarang putar balik", "Dilarang belok kiri", "Wajib putar balik", "Jalan buntu"]),
    
  makeQ("dilarang-bunyi-klakson.png", "larangan", "prohibit", "🎺",
    "Rambu gambar klakson yang dicoret artinya…",
    ["Dilarang membunyikan klakson", "Wajib membunyikan klakson", "Zona bising", "Dilarang mendengar musik"]),
    
  makeQ("dilarang-mendahului.png", "larangan", "prohibit", "🚗",
    "Rambu dua mobil sejajar dalam lingkaran merah artinya…",
    ["Dilarang mendahului / menyalip", "Wajib di lajur kanan", "Boleh balapan", "Dilarang berhenti"]),

  // --- PERINGATAN ---
  makeQ("penyeberangan-pejalan-kaki.png", "peringatan", "warning", "🚶",
    "Rambu segitiga kuning bergambar orang menyeberang artinya…",
    ["Peringatan tempat penyeberangan pejalan kaki", "Dilarang jalan kaki", "Area olahraga", "Jalan buntu"]),
    
  makeQ("penyempitan-jalan.png", "peringatan", "warning", "┚┖",
    "Rambu segitiga kuning bergambar garis menyempit artinya…",
    ["Peringatan penyempitan jalan di depan", "Jalan melebar", "Jalan dua arah", "Jalan licin"]),
    
  makeQ("jalan-licin.png", "peringatan", "warning", "≈",
    "Rambu segitiga kuning bergambar mobil tergelincir artinya…",
    ["Peringatan jalan licin di depan", "Jalan menanjak", "Area banjir", "Dilarang ngebut"]),
    
  makeQ("perlintasan-kereta.png", "peringatan", "warning", "🚂",
    "Rambu segitiga kuning bergambar kereta api artinya…",
    ["Peringatan perlintasan kereta api", "Stasiun kereta terdekat", "Dilarang naik kereta", "Jembatan kereta"]),
    
  makeQ("tanjakan-curam.png", "peringatan", "warning", "▲",
    "Rambu segitiga kuning bergambar jalan menanjak artinya…",
    ["Peringatan tanjakan curam di depan", "Peringatan turunan", "Dilarang mendaki", "Jalan licin"]),
    
  makeQ("turunan-curam.png", "peringatan", "warning", "▼",
    "Rambu segitiga kuning bergambar jalan menurun artinya…",
    ["Peringatan turunan curam di depan", "Peringatan tanjakan", "Rem blong", "Jalan rusak"]),
    
  makeQ("banyak-anak-anak.png", "peringatan", "warning", "🚸",
    "Rambu bergambar anak-anak sekolah artinya…",
    ["Peringatan banyak anak-anak / kawasan sekolah", "Taman bermain", "Dilarang untuk anak-anak", "Jalan buntu"]),

  // --- PERINTAH ---
  makeQ("wajib-masuk-jalur-kiri.png", "perintah", "mandatory", "↙",
    "Rambu lingkaran biru dengan panah miring ke kiri bawah artinya…",
    ["Wajib memilih lajur/jalur kiri", "Dilarang ke kiri", "Wajib belok kanan", "Jalan buntu"]),
    
  makeQ("wajib-belok-kiri.png", "perintah", "mandatory", "←",
    "Rambu lingkaran biru dengan panah mengarah ke kiri artinya…",
    ["Wajib belok ke kiri", "Dilarang belok kiri", "Boleh belok kanan", "Jalan satu arah"]),
    
  makeQ("wajib-belok-kanan.png", "perintah", "mandatory", "→",
    "Rambu lingkaran biru dengan panah mengarah ke kanan artinya…",
    ["Wajib belok ke kanan", "Dilarang belok kanan", "Boleh belok kiri", "Jalan lurus"]),
    
  makeQ("bundaran.png", "perintah", "mandatory", "🔄",
    "Rambu lingkaran biru dengan panah melingkar artinya…",
    ["Wajib mengikuti arah bundaran", "Dilarang putar balik", "Taman kota", "Jalan buntu"]),

  // --- PETUNJUK ---
  makeQ("tempat-parkir.png", "petunjuk", "info", "P",
    "Rambu kotak biru dengan huruf P putih artinya…",
    ["Petunjuk lokasi tempat parkir", "Dilarang parkir", "Pos polisi lalu lintas", "Jalan tol"]),
    
  makeQ("pom-bensin.png", "petunjuk", "info", "⛽",
    "Rambu kotak bergambar pompa bensin artinya…",
    ["Petunjuk lokasi SPBU (pom bensin)", "Dilarang mengisi bensin", "Bengkel mobil", "Rest area"]),
    
  makeQ("rumah-sakit.png", "petunjuk", "info", "🏥",
    "Rambu kotak biru bergambar tempat tidur dan palang merah artinya…",
    ["Petunjuk lokasi rumah sakit", "Hotel / penginapan", "Halte bus", "Apotek"]),
    
  makeQ("masjid.png", "petunjuk", "info", "🕌",
    "Rambu kotak biru bergambar kubah masjid artinya…",
    ["Petunjuk lokasi tempat ibadah masjid", "Museum", "Taman kota", "Restoran halal"]),
];

const CAT_NAME = {
  larangan:"⛔ RAMBU LARANGAN",
  peringatan:"⚠️ RAMBU PERINGATAN",
  perintah:"🔵 RAMBU PERINTAH",
  petunjuk:"🟢 RAMBU PETUNJUK",
};

/* ---------------- STATE ---------------- */
const state = {
  seq: 0, mode: null, over: false, busy: false,
  current: 0, players: [], board: null, deck: [], tileEls: {},
};
let tokenEls = [];

/* ---------------- ELEMEN DOM ---------------- */
const boardEl = $("board");
const diceEl = $("dice");
const rollBtn = $("rollBtn");
const deckPileEl = $("deckPile");
const deckCountEl = $("deckCount");
const logListEl = $("logList");
const modeTagEl = $("modeTag");
const quizModal = $("quizModal");
const quizCard = $("quizCard");
const quizCatEl = $("quizCat");
const quizTurnEl = $("quizTurn");
const quizSignEl = $("quizSign");
const quizSrcEl = $("quizSrc");
const quizTextEl = $("quizText");
const quizOptsEl = $("quizOpts");
const quizFbEl = $("quizFb");
const winModal = $("winModal");
const modeOverlay = $("modeOverlay");
const rulesModal = $("rulesModal");

/* ---------------- GENERASI PAPAN ---------------- */
function generateBoard(){
  const ladders = {}, snakes = {};
  const used = new Set([1, 100]);
  let guard = 0;
  while(Object.keys(ladders).length < 6 && guard++ < 600){
    const base = rnd(3, 58);
    const top = rnd(base + 14, Math.min(99, base + 36));
    if(used.has(base) || used.has(top)) continue;
    ladders[base] = top; used.add(base); used.add(top);
  }
  guard = 0;
  while(Object.keys(snakes).length < 5 && guard++ < 600){
    const head = rnd(45, 96);
    const tail = rnd(Math.max(2, head - 38), head - 14);
    if(used.has(head) || used.has(tail)) continue;
    snakes[head] = tail; used.add(head); used.add(tail);
  }
  const signs = new Set();
  Object.keys(ladders).forEach((k) => signs.add(+k));
  Object.keys(snakes).forEach((k) => signs.add(+k));
  guard = 0;
  while(signs.size < 24 && guard++ < 1200){
    const t = rnd(2, 99);
    if(!used.has(t)) signs.add(t);
  }
  const prohib = shuffle(QUESTIONS.map((q, i) => q.cat === "larangan" ? i : -1).filter(i => i >= 0));
  const others = shuffle(QUESTIONS.map((q, i) => q.cat !== "larangan" ? i : -1).filter(i => i >= 0));
  let pi = 0, oi = 0;
  const tileQ = {};
  Object.keys(snakes).forEach((k) => { tileQ[k] = prohib[pi++ % prohib.length]; });
  Object.keys(ladders).forEach((k) => { tileQ[k] = others[oi++ % others.length]; });
  const rest = [...signs].filter((n) => !ladders[n] && !snakes[n]);
  shuffle(rest).forEach((n) => {
    tileQ[n] = Math.random() < 0.4
      ? prohib[pi++ % prohib.length]
      : others[oi++ % others.length];
  });
  return { ladders, snakes, signs, tileQ };
}

/* Koordinat pusat petak (unit 0–100 untuk SVG overlay) */
function tileCenter(n){
  const idx = n - 1;
  const rowFromBottom = Math.floor(idx / 10);
  let col = idx % 10;
  if(rowFromBottom % 2 === 1) col = 9 - col;
  return { x: col * 10 + 5, y: (9 - rowFromBottom) * 10 + 5 };
}

/* ---------------- RENDER PAPAN ---------------- */
function buildMini(shape){
  const m = document.createElement("span");
  m.className = "mini m-" + shape;
  if(shape === "light"){ m.innerHTML = "<i></i><i></i><i></i>"; }
  return m;
}

function renderBoard(){
  boardEl.innerHTML = "";
  state.tileEls = {};
  for(let gridRow = 0; gridRow < 10; gridRow++){
    const rowFromBottom = 9 - gridRow;
    for(let gridCol = 0; gridCol < 10; gridCol++){
      const colInRow = rowFromBottom % 2 === 1 ? 9 - gridCol : gridCol;
      const n = rowFromBottom * 10 + colInRow + 1;
      const d = document.createElement("div");
      let cls = "tile";
      if((gridRow + gridCol) % 2) cls += " alt";
      if(n === 1) cls += " start";
      if(n === 100) cls += " finish";
      const isLadder = !!state.board.ladders[n];
      const isSnake = !!state.board.snakes[n];
      const isSign = state.board.signs.has(n);
      if(isSign) cls += " sign";
      if(isLadder) cls += " lb";
      if(isSnake) cls += " sh";
      d.className = cls;

      const num = document.createElement("span");
      num.className = "num";
      num.textContent = n;
      d.appendChild(num);

      if(n === 1){
        const s = document.createElement("span");
        s.className = "tile-label";
        s.textContent = "Go";
        d.appendChild(s);
      }
      if(n === 100){
        const s = document.createElement("span");
        s.className = "tile-label flag";
        s.textContent = "🏆";
        d.appendChild(s);
      }
      if(isSign){
        const q = QUESTIONS[state.board.tileQ[n]];
        d.appendChild(buildMini(q.shape));
        d.title = "Petak " + n + " — kartu soal rambu";
      }
      if(isLadder){
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = "";
        d.appendChild(b);
        d.title = "Petak " + n + " — tangga ke " + state.board.ladders[n] + " (jawab benar untuk naik!)";
      }
      if(isSnake){
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = "";
        d.appendChild(b);
        d.title = "Petak " + n + " — kepala ular! Salah jawab meluncur ke " + state.board.snakes[n];
      }
      state.tileEls[n] = d;
      boardEl.appendChild(d);
    }
  }
  drawOverlay();
}

/* ---------------- OVERLAY SVG ULAR & TANGGA ---------------- */
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(name, attrs){
  const e = document.createElementNS(SVG_NS, name);
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function drawOverlay(){
  const old = document.getElementById("overlaySvg");
  if(old) old.remove();
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.id = "overlaySvg";
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  for(const [b, t] of Object.entries(state.board.ladders)) addLadder(svg, +b, +t);
  for(const [h, t] of Object.entries(state.board.snakes)) addSnake(svg, +h, +t);
  boardEl.appendChild(svg);
}
function addLadder(svg, b, t){
  const a = tileCenter(b), c = tileCenter(t);
  const dx = c.x - a.x, dy = c.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux, off = 1.6;
  const sx = a.x + ux * 2, sy = a.y + uy * 2;
  const ex = c.x - ux * 2, ey = c.y - uy * 2;
  const g = svgEl("g", { opacity: ".92" });
  g.appendChild(svgEl("line", { x1: sx + px * off, y1: sy + py * off, x2: ex + px * off, y2: ey + py * off, stroke: "#b45309", "stroke-width": "1.1", "stroke-linecap": "round" }));
  g.appendChild(svgEl("line", { x1: sx - px * off, y1: sy - py * off, x2: ex - px * off, y2: ey - py * off, stroke: "#b45309", "stroke-width": "1.1", "stroke-linecap": "round" }));
  const rungs = Math.max(3, Math.floor(len / 3.2));
  for(let i = 1; i < rungs; i++){
    const tt = i / rungs;
    const x = sx + (ex - sx) * tt, y = sy + (ey - sy) * tt;
    g.appendChild(svgEl("line", { x1: x + px * off, y1: y + py * off, x2: x - px * off, y2: y - py * off, stroke: "#f59e0b", "stroke-width": ".8", "stroke-linecap": "round" }));
  }
  svg.appendChild(g);
}
function addSnake(svg, h, t) {
  const a = tileCenter(h), b = tileCenter(t);
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;
  const k = (h % 2 === 0 ? 1 : -1)  len  0.18;
  const c1 = { x: a.x + dx  0.3 + px  k, y: a.y + dy  0.3 + py  k };
  const c2 = { x: a.x + dx  0.7 - px  k, y: a.y + dy  0.7 - py  k };

  / ---------- ensure  ---------- /
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = svgEl('defs', {});
    svg.insertBefore(defs, svg.firstChild);
  }

  / ---------- reusable gradients / patterns ---------- /
  const makeId = (id, build) => {
    if (!svg.querySelector('#' + id)) {
      const el = build();
      el.setAttribute('id', id);
      defs.appendChild(el);
    }
  };

  // 1) Body gradient — emerald depth
  makeId('snakeBodyGrad', () => {
    const g = svgEl('linearGradient', {
      x1: '0%', y1: '0%', x2: '100%', y2: '0%'
    });
    g.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#022c22' }));
    g.appendChild(svgEl('stop', { offset: '25%',  'stop-color': '#065f46' }));
    g.appendChild(svgEl('stop', { offset: '50%',  'stop-color': '#10b981' }));
    g.appendChild(svgEl('stop', { offset: '75%',  'stop-color': '#059669' }));
    g.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#022c22' }));
    return g;
  });

  // 2) Head radial gradient — sculpted look
  makeId('snakeHeadGrad', () => {
    const g = svgEl('radialGradient', {
      cx: '45%', cy: '35%', r: '65%', fx: '40%', fy: '30%'
    });
    g.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#6ee7b7' }));
    g.appendChild(svgEl('stop', { offset: '40%',  'stop-color': '#10b981' }));
    g.appendChild(svgEl('stop', { offset: '75%',  'stop-color': '#065f46' }));
    g.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#022c22' }));
    return g;
  });

  // 3) Eye iris gradient — gold reptilian
  makeId('snakeEyeGrad', () => {
    const g = svgEl('radialGradient', {
      cx: '50%', cy: '50%', r: '50%'
    });
    g.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#fef08a' }));
    g.appendChild(svgEl('stop', { offset: '45%',  'stop-color': '#eab308' }));
    g.appendChild(svgEl('stop', { offset: '80%',  'stop-color': '#a16207' }));
    g.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#422006' }));
    return g;
  });

  // 4) Scale pattern — iridescent emerald with gold diamond-back
  makeId('snakeScalePattern', () => {
    const p = svgEl('pattern', {
      patternUnits: 'userSpaceOnUse',
      width: '2.4', height: '2.4',
      patternTransform: 'rotate(35)'
    });
    p.appendChild(svgEl('rect', {
      width: '2.4', height: '2.4', fill: '#064e3b'
    }));
    // scale base
    p.appendChild(svgEl('path', {
      d: 'M0,1.2 Q0.6,0.4 1.2,1.2 Q1.8,2 2.4,1.2',
      fill: 'none', stroke: '#34d399', 'stroke-width': '0.25'
    }));
    p.appendChild(svgEl('path', {
      d: 'M0,0 Q0.6,-0.8 1.2,0 Q1.8,0.8 2.4,0',
      fill: 'none', stroke: '#10b981', 'stroke-width': '0.2'
    }));
    // scale highlight
    p.appendChild(svgEl('circle', {
      cx: '0.6', cy: '0.8', r: '0.25', fill: '#6ee7b7', opacity: '0.5'
    }));
    return p;
  });

  // 5) Drop shadow filter
  makeId('snakeShadow', () => {
    const f = svgEl('filter', {
      id: 'snakeShadow', x: '-25%', y: '-25%', width: '150%', height: '150%'
    });
    f.appendChild(svgEl('feDropShadow', {
      dx: '0.4', dy: '0.6', stdDeviation: '0.7',
      'flood-color': '#000', 'flood-opacity': '0.65'
    }));
    return f;
  });

  // 6) Highlight gradient for body gloss
  makeId('snakeGlossGrad', () => {
    const g = svgEl('linearGradient', {
      x1: '0%', y1: '0%', x2: '0%', y2: '100%'
    });
    g.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#fff', 'stop-opacity': '0.35' }));
    g.appendChild(svgEl('stop', { offset: '50%',  'stop-color': '#fff', 'stop-opacity': '0' }));
    g.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#000', 'stop-opacity': '0.3' }));
    return g;
  });

  / ---------- sample bezier curve ---------- /
  const SEGMENTS = 48;
  const points = [];
  for (let i = 0; i  i % 4 === 0 && i > 2 && i  {
      const s = p.w * 0.35;
      return M${p.x.toFixed(2)},${(p.y - s).toFixed(2)}  +
             L${(p.x + s * 0.55).toFixed(2)},${p.y.toFixed(2)}  +
             L${p.x.toFixed(2)},${(p.y + s).toFixed(2)}  +
             L${(p.x - s * 0.55).toFixed(2)},${p.y.toFixed(2)} Z;
    }).join(' ');
  const diamondPath = svgEl('path', {
    d: diamondD,
    fill: '#fbbf24',
    stroke: '#92400e',
    'stroke-width': '0.12',
    opacity: '0.4'
  });
  diamondPath.classList.add('snake-diamond');
  g.appendChild(diamondPath);

  // Spine ridge line
  const ridgeD = points
    .map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ',' + p.y.toFixed(2))
    .join(' ');
  g.appendChild(svgEl('path', {
    d: ridgeD,
    fill: 'none',
    stroke: '#022c22',
    'stroke-width': '0.2',
    opacity: '0.55'
  }));

  // Gloss highlight overlay (top half of body)
  g.appendChild(svgEl('path', {
    d: bodyPath,
    fill: 'url(#snakeGlossGrad)',
    opacity: '0.5'
  }));

  / ---------- HEAD ---------- /
  const headP = points[0];
  const headAngle = Math.atan2(headP.ny, headP.nx) * 180 / Math.PI;
  const headG = svgEl('g', {
    transform: translate(${headP.x.toFixed(2)},${headP.y.toFixed(2)}) rotate(${headAngle + 90})
  });
  headG.classList.add('snake-head-group');

  // Head base shape — elongated, sculpted
  headG.appendChild(svgEl('ellipse', {
    cx: '0', cy: '0', rx: '2.9', ry: '1.9',
    fill: 'url(#snakeHeadGrad)',
    stroke: '#022c22',
    'stroke-width': '0.22'
  }));

  // Head scale texture
  headG.appendChild(svgEl('ellipse', {
    cx: '0', cy: '0', rx: '2.7', ry: '1.7',
    fill: 'url(#snakeScalePattern)',
    opacity: '0.65'
  }));

  // Facial scale lines (cheek patterns)
  [-1, 1].forEach(side => {
    headG.appendChild(svgEl('path', {
      d: M${(side  0.9).toFixed(2)},-0.3 Q${(side  1.6).toFixed(2)},0.2 ${(side * 2.1).toFixed(2)},0.6,
      fill: 'none', stroke: '#022c22', 'stroke-width': '0.12', opacity: '0.7'
    }));
    headG.appendChild(svgEl('path', {
      d: M${(side  0.7).toFixed(2)},0.4 Q${(side  1.3).toFixed(2)},0.8 ${(side * 1.8).toFixed(2)},1.1,
      fill: 'none', stroke: '#022c22', 'stroke-width': '0.1', opacity: '0.6'
    }));
  });

  // Brow ridge above eyes
  headG.appendChild(svgEl('path', {
    d: 'M-1.8,-0.9 Q0,-1.3 1.8,-0.9',
    fill: 'none', stroke: '#022c22', 'stroke-width': '0.18', opacity: '0.75'
  }));

  // Eyes — gold iris with vertical slit pupil
  const eyeOffX = 1.15, eyeOffY = 0.55;
  [-1, 1].forEach(side => {
    const eyeG = svgEl('g', { transform: translate(${side * eyeOffX},${-eyeOffY}) });

    // Eye socket shadow
    eyeG.appendChild(svgEl('ellipse', {
      cx: '0', cy: '0', rx: '0.75', ry: '0.58',
      fill: '#022c22'
    }));

    // Gold iris
    eyeG.appendChild(svgEl('ellipse', {
      cx: '0', cy: '0', rx: '0.58', ry: '0.46',
      fill: 'url(#snakeEyeGrad)'
    }));

    // Vertical slit pupil
    eyeG.appendChild(svgEl('ellipse', {
      cx: '0', cy: '0', rx: '0.11', ry: '0.42',
      fill: '#000'
    }));

    // Iris ring detail
    eyeG.appendChild(svgEl('ellipse', {
      cx: '0', cy: '0', rx: '0.5', ry: '0.4',
      fill: 'none', stroke: '#713f12', 'stroke-width': '0.08', opacity: '0.6'
    }));

    // Eye highlight (glint)
    const highlight = svgEl('circle', {
      cx: '0.18', cy: '-0.18', r: '0.13',
      fill: '#fff', opacity: '0.9'
    });
    highlight.classList.add('snake-eye-highlight');
    eyeG.appendChild(highlight);

    headG.appendChild(eyeG);
  });

  // Nostrils
  [-1, 1].forEach(side => {
    headG.appendChild(svgEl('ellipse', {
      cx: (side * 0.55).toFixed(2), cy: '-1.35',
      rx: '0.18', ry: '0.12',
      fill: '#022c22'
    }));
  });

  // Jawline scales (small triangles under mouth)
  for (let i = -2; i <= 2; i++) {
    headG.appendChild(svgEl('path', {
      d: M${(i  0.35).toFixed(2)},1.4 L${((i  0.35) + 0.15).toFixed(2)},1.65 L${((i * 0.35) - 0.15).toFixed(2)},1.65 Z,
      fill: '#065f46', stroke: '#022c22', 'stroke-width': '0.08', opacity: '0.8'
    }));
  }

  // Forked tongue
  const tongueG = svgEl('g', { transform: 'translate(0, 1.75)' });
  tongueG.classList.add('snake-tongue');
  tongueG.appendChild(svgEl('path', {
    d: 'M0,0 L0,0.9 M0,0.9 L-0.35,1.25 M0,0.9 L0.35,1.25',
    stroke: '#dc2626',
    'stroke-width': '0.14',
    'stroke-linecap': 'round',
    fill: 'none'
  }));
  // Tongue base (darker)
  tongueG.appendChild(svgEl('path', {
    d: 'M-0.12,0 L0.12,0 L0.08,0.3 L-0.08,0.3 Z',
    fill: '#991b1b'
  }));
  headG.appendChild(tongueG);

  g.appendChild(headG);

  / ---------- TAIL ---------- /
  const tailP = points[points.length - 1];
  const tailG = svgEl('g', {
    transform: translate(${tailP.x.toFixed(2)},${tailP.y.toFixed(2)})
  });

  // Tail tip — sharp point with scale plates
  tailG.appendChild(svgEl('path', {
    d: 'M-0.35,0 L0.35,0 L0,-0.7 Z',
    fill: '#065f46', stroke: '#022c22', 'stroke-width': '0.12'
  }));

  // Tail rattle / plate scales
  for (let i = 1; i <= 3; i++) {
    tailG.appendChild(svgEl('path', {
      d: M${(-0.25 + i  0.02).toFixed(2)},${(i  0.18).toFixed(2)} L${(0.25 - i  0.02).toFixed(2)},${(i  0.18).toFixed(2)} L0,${((i + 1) * 0.18).toFixed(2)} Z,
      fill: '#10b981', stroke: '#022c22', 'stroke-width': '0.08', opacity: '0.85'
    }));
  }
  g.appendChild(tailG);

  svg.appendChild(g);
}
/* ---------------- BIDAK / TOKEN ---------------- */
function buildTokens(){
  tokenEls.forEach((t) => t && t.remove());
  tokenEls = state.players.map((p, i) => {
    const tok = document.createElement("div");
    tok.className = "token t" + i;
    tok.textContent = p.emoji;
    boardEl.appendChild(tok);
    return tok;
  });
}
function positionToken(i){
  const p = state.players[i];
  const tok = tokenEls[i];
  if(!tok) return;
  if(p.pos === 0){
    // Posisi awal: bidak berada di luar papan (area Start, sisi kiri petak 1)
    const el1 = state.tileEls[1];
    if(!el1) return;
    const w = el1.offsetWidth;
    tok.style.width = tok.style.height = (w * 0.5) + "px";
    tok.style.fontSize = (w * 0.26) + "px";
    tok.style.left = (el1.offsetLeft - w * 0.62) + "px";
    tok.style.top = (el1.offsetTop + el1.offsetHeight / 2 + (i === 0 ? -0.32 : 0.32) * w) + "px";
    return;
  }
  const el = state.tileEls[p.pos];
  if(!el) return;
  const w = el.offsetWidth;
  const offX = (i === 0 ? -0.20 : 0.20) * w;
  tok.style.width = tok.style.height = (w * 0.5) + "px";
  tok.style.fontSize = (w * 0.26) + "px";
  tok.style.left = (el.offsetLeft + w / 2 + offX) + "px";
  tok.style.top = (el.offsetTop + el.offsetHeight / 2) + "px";
}
function positionAllTokens(){ state.players.forEach((_, i) => positionToken(i)); }

/* ---------------- DADU ---------------- */
const PIP_MAP = { 1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] };
function setDiceFace(v){
  diceEl.innerHTML = "";
  for(let i = 0; i < 9; i++){
    const cell = document.createElement("span");
    cell.className = "cell" + (PIP_MAP[v].includes(i) ? " pip" : "");
    diceEl.appendChild(cell);
  }
}
async function animateDice(finalV, seq){
  diceEl.classList.add("rolling");
  for(let i = 0; i < 7; i++){
    setDiceFace(rnd(1, 6));
    await sleep(70);
    if(seq !== state.seq) return;
  }
  setDiceFace(finalV);
  diceEl.classList.remove("rolling");
}

/* ---------------- LOG & HUD ---------------- */
function addLog(msg){
  const li = document.createElement("li");
  li.textContent = msg;
  logListEl.prepend(li);
  while(logListEl.children.length > 40) logListEl.lastChild.remove();
}
function clearLog(){ logListEl.innerHTML = ""; }

function updateHUD(){
  state.players.forEach((p, i) => {
    $("name" + i).textContent = p.name;
    $("avatar" + i).textContent = p.emoji;
    $("pos" + i).textContent = p.pos;
    $("pts" + i).textContent = p.pts;
    $("pcard" + i).classList.toggle("active", state.current === i && !state.over);
  });
  modeTagEl.textContent = "Mode: " + (state.mode === "cpu" ? "Pemain vs CPU 🤖" : "2 Pemain 👥");
}
function updateControls(){
  if(!state.players.length) return;
  const p = state.players[state.current];
  rollBtn.disabled = state.busy || state.over || p.isCpu;
  rollBtn.textContent = p.isCpu
    ? "🤖 Giliran CPU…"
    : (state.busy ? "⏳ Menunggu…" : "🎲 Lempar Dadu (" + p.name + ")");
}
function updateDeckUI(pulse){
  deckCountEl.textContent = state.deck.length;
  if(pulse){
    deckPileEl.classList.remove("pulse");
    void deckPileEl.offsetWidth;
    deckPileEl.classList.add("pulse");
  }
}

/* ---------------- GAMBAR RAMBU + FALLBACK ---------------- */
function buildFallback(q){
  const fb = document.createElement("div");
  fb.className = "sign-fallback fb-" + q.shape;
  if(q.shape === "prohibit"){
    fb.innerHTML = '<span class="sym">' + q.sym + '</span><span class="bar"></span>';
  } else if(q.shape === "stop"){
    fb.textContent = "STOP";
  } else if(q.shape === "warning"){
    fb.innerHTML = '<span class="tri"></span><span class="sym">' + q.sym + "</span>";
  } else if(q.shape === "light"){
    fb.innerHTML = '<span class="lamp lr"></span><span class="lamp ly"></span><span class="lamp lg"></span>';
  } else {
    fb.innerHTML = '<span class="sym">' + q.sym + "</span>";
  }
  return fb;
}
function buildSignVisual(q){
  quizSignEl.innerHTML = "";
  const img = document.createElement("img");
  img.src = "assets/rambu/" + q.img;
  img.alt = "Rambu lalu lintas";
  const fb = buildFallback(q);
  fb.style.display = "none";
  img.addEventListener("error", () => {
    img.style.display = "none";
    fb.style.display = "flex";
  });
  quizSignEl.appendChild(img);
  quizSignEl.appendChild(fb);
}

/* ---------------- KUIS (MODAL FLIP 3D) ---------------- */
function pickWrongIdx(correctIdx){
  let i;
  do { i = Math.floor(Math.random() * 4); } while(i === correctIdx);
  return i;
}
function openQuiz(player, q){
  return new Promise((resolve) => {
    const seq = state.seq;
    if(state.deck.length === 0){
      state.deck = shuffle(QUESTIONS.map((_, i) => i));
    }
    state.deck.pop();
    updateDeckUI(true);

    const pairs = shuffle(q.opts.map((t, i) => ({ t, ok: i === 0 })));
    const correctIdx = pairs.findIndex((x) => x.ok);
    const LETTERS = ["A", "B", "C", "D"];

    quizCatEl.textContent = CAT_NAME[q.cat] || "❓ KARTU SOAL";
    quizCatEl.className = "quiz-cat cat-" + q.cat;
    quizTurnEl.textContent = player.emoji + " " + player.name + " menjawab";
    buildSignVisual(q);
    quizTextEl.textContent = q.q;
    quizFbEl.className = "quiz-feedback";
    quizFbEl.textContent = player.isCpu ? "🤖 CPU sedang berpikir…" : "Pilih jawabanmu!";
    quizOptsEl.innerHTML = "";
    quizOptsEl.classList.toggle("locked", !!player.isCpu);

    let done = false;
    const btns = [];
    pairs.forEach((pr, i) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.innerHTML = '<span class="opt-letter">' + LETTERS[i] + '</span><span class="opt-text">' + pr.t + "</span>";
      b.addEventListener("click", () => pick(i));
      quizOptsEl.appendChild(b);
      btns.push(b);
    });

    function pick(i){
      if(done) return;
      done = true;
      const correct = i === correctIdx;
      btns.forEach((b, j) => {
        b.disabled = true;
        if(j === correctIdx) b.classList.add("correct");
        else if(j === i) b.classList.add("wrong");
        else b.classList.add("dim");
      });
      if(correct){
        quizFbEl.textContent = "✅ Benar! +10 poin";
        quizFbEl.classList.add("good");
      } else {
        quizFbEl.textContent = "❌ Salah! Jawaban yang benar: " + LETTERS[correctIdx];
        quizFbEl.classList.add("bad");
      }
      setTimeout(() => {
        quizModal.classList.remove("show");
        quizCard.classList.remove("flipped");
        setTimeout(() => {
          if(seq !== state.seq) return;
          resolve({ correct });
        }, 260);
      }, 1650);
    }

    quizModal.classList.add("show");
    quizCard.classList.remove("flipped");
    requestAnimationFrame(() => setTimeout(() => quizCard.classList.add("flipped"), 160));

    if(player.isCpu){
      const choice = Math.random() < 0.65 ? correctIdx : pickWrongIdx(correctIdx);
      setTimeout(() => {
        if(seq === state.seq && !done) pick(choice);
      }, 2700);
    }
  });
}

/* ---------------- GERAK BIDAK ---------------- */
async function moveSteps(p, target, seq){
  const idxP = state.players.indexOf(p);
  const dir = target > p.pos ? 1 : -1;
  while(p.pos !== target){
    p.pos += dir;
    positionToken(idxP);
    updateHUD();
    await sleep(190);
    if(seq !== state.seq) return;
  }
}
async function glideTo(p, target, seq){
  const idxP = state.players.indexOf(p);
  p.pos = target;
  tokenEls[idxP].classList.add("glide");
  positionToken(idxP);
  updateHUD();
  await sleep(830);
  if(seq !== state.seq) return;
  tokenEls[idxP].classList.remove("glide");
}

/* ---------------- RESOLUSI PETAK ---------------- */
async function resolveTile(p, seq){
  const n = p.pos;
  if(n >= 100){ doWin(p); return true; }
  const B = state.board;
  const qi = B.tileQ[n];
  if(qi === undefined) return false;

  const q = QUESTIONS[qi];
  const isLadder = !!B.ladders[n];
  const isSnake = !!B.snakes[n];

  if(isLadder) addLog("🪜 " + p.name + " menemukan tangga " + n + " → " + B.ladders[n] + "! Jawab benar untuk naik.");
  else if(isSnake) addLog("🐍 " + p.name + " menghadapi kepala ular di petak " + n + "! Jawab benar agar selamat.");
  else addLog("🃏 " + p.name + " mendarat di petak rambu " + n + ".");

  const { correct } = await openQuiz(p, q);
  if(seq !== state.seq) return true;

  if(correct){
    p.pts += 10;
    addLog("✅ " + p.name + " menjawab benar! +10 poin.");
    if(isLadder){
      addLog("⬆️ " + p.name + " NAIK tangga dari " + n + " ke " + B.ladders[n] + "!");
      await glideTo(p, B.ladders[n], seq);
    } else if(isSnake){
      addLog("🛡️ Berkat jawaban benar, " + p.name + " lolos dari ular!");
    }
  } else {
    if(isSnake){
      addLog("🐍 " + p.name + " salah… meluncur turun dari " + n + " ke " + B.snakes[n] + ".");
      await glideTo(p, B.snakes[n], seq);
    } else if(q.cat === "larangan"){
      const back = Math.max(1, n - 2);
      addLog("⛔ Salah di rambu larangan! " + p.name + " mundur 2 langkah ke petak " + back + ".");
      await moveSteps(p, back, seq);
    } else {
      addLog("😅 Jawaban salah — tidak terjadi apa-apa, tapi tanpa poin.");
    }
  }
  updateHUD();
  if(seq !== state.seq) return true;
  if(p.pos >= 100){ doWin(p); return true; }
  return false;
}

/* ---------------- ALUR GILIRAN ---------------- */
async function performTurn(){
  if(state.busy || state.over || !state.players.length) return;
  const seq = state.seq;
  const p = state.players[state.current];
  state.busy = true;
  updateControls();

  const v = rnd(1, 6);
  await animateDice(v, seq);
  if(seq !== state.seq) return;
  addLog("🎲 " + p.name + " melempar dadu → " + v + ".");

  if(p.pos + v > 100){
    addLog("⛔ Harus tepat di petak 100 — " + p.name + " tetap di petak " + p.pos + ".");
    await sleep(600);
    if(seq === state.seq) endTurn(seq);
    return;
  }
  await moveSteps(p, p.pos + v, seq);
  if(seq !== state.seq) return;

  const ended = await resolveTile(p, seq);
  if(seq !== state.seq || ended) return;
  endTurn(seq);
}

function endTurn(seq){
  if(state.over || seq !== state.seq) return;
  state.busy = false;
  state.current = 1 - state.current;
  updateHUD();
  updateControls();
  addLog("➡️ Giliran " + state.players[state.current].name + ".");
  if(state.players[state.current].isCpu){
    setTimeout(() => {
      if(seq === state.seq && !state.over && !state.busy) performTurn();
    }, 1200);
  }
}

/* ---------------- MENANG & KONFETI ---------------- */
function doWin(p){
  state.over = true;
  state.busy = false;
  updateControls();
  updateHUD();
  addLog("🏁 " + p.name + " mencapai petak 100 dan MENANG! 🎉");
  $("winnerName").textContent = p.emoji + " " + p.name;
  $("winnerPts").textContent = "⭐ " + p.pts + " poin dari jawaban benar";
  winModal.classList.add("show");
  confettiBurst();
}
function confettiBurst(){
  const colors = ["#f59e0b", "#22c55e", "#38bdf8", "#ef4444", "#a78bfa", "#fbbf24"];
  for(let i = 0; i < 90; i++){
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = (Math.random() * 0.5) + "s";
    c.style.animationDuration = (2.2 + Math.random() * 2) + "s";
    const s = 6 + Math.random() * 8;
    c.style.width = s + "px";
    c.style.height = (s * 0.45) + "px";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4800);
  }
}

/* ---------------- INIT GAME ---------------- */
function initGame(mode){
  state.seq++;
  state.mode = mode;
  state.over = false;
  state.busy = false;
  state.current = 0;
  state.players = [
    { name: "Pemain 1", emoji: "🚗", pos: 0, pts: 0, isCpu: false },
    mode === "cpu"
      ? { name: "CPU", emoji: "🤖", pos: 0, pts: 0, isCpu: true }
      : { name: "Pemain 2", emoji: "🚙", pos: 0, pts: 0, isCpu: false },
  ];
  state.board = generateBoard();
  renderBoard();
  buildTokens();
  positionAllTokens();
  state.deck = shuffle(QUESTIONS.map((_, i) => i));
  updateDeckUI(false);
  clearLog();
  addLog("🚦 Permainan dimulai! Mendarat di petak rambu untuk menguji pengetahuan lalu lintasmu.");
  addLog("🪜 Jawab BENAR untuk naik tangga. 🐍 Salah di kepala ular = meluncur turun!");
  setDiceFace(6);
  updateHUD();
  updateControls();
}

/* ---------------- EVENT LISTENER ---------------- */
rollBtn.addEventListener("click", () => {
  if(state.players.length && state.players[state.current].isCpu) return;
  performTurn();
});
document.addEventListener("keydown", (e) => {
  if(e.code === "Space" && !rollBtn.disabled && !quizModal.classList.contains("show")){
    e.preventDefault();
    performTurn();
  }
});
window.addEventListener("resize", positionAllTokens);

$("btnPvp").addEventListener("click", () => { modeOverlay.classList.remove("show"); initGame("pvp"); });
$("btnCpu").addEventListener("click", () => { modeOverlay.classList.remove("show"); initGame("cpu"); });
$("btnReplay").addEventListener("click", () => { winModal.classList.remove("show"); initGame(state.mode); });
$("btnChangeMode").addEventListener("click", () => { winModal.classList.remove("show"); modeOverlay.classList.add("show"); });
$("btnRules").addEventListener("click", () => rulesModal.classList.add("show"));
$("btnCloseRules").addEventListener("click", () => rulesModal.classList.remove("show"));
$("btnRestart").addEventListener("click", () => {
  if(state.mode) initGame(state.mode);
  else modeOverlay.classList.add("show");
});
$("btnHome").addEventListener("click", () => {
  state.seq++;
  state.busy = false;
  winModal.classList.remove("show");
  quizModal.classList.remove("show");
  quizCard.classList.remove("flipped");
  modeOverlay.classList.add("show");
});
rulesModal.addEventListener("click", (e) => { if(e.target === rulesModal) rulesModal.classList.remove("show"); });

/* ---------------- BOOTSTRAP ---------------- */
initGame("pvp"); // pratinjau papan di balik overlay pilih mode
modeOverlay.classList.add("show");

