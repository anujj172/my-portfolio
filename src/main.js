import "./style.css";
import { profile, projects } from "./data.js";

const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const chips = (list) => `<div class="chips">${list.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>`;

// Холбоо барих төрөл бүрийн дүрс
const contactIcons = { phone: "📞", email: "✉️", github: "🐙" };

// Зураггүй үед SVG жижиг зураг үүсгэнэ
function thumb(hue, text) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='200'><rect width='420' height='200' fill='hsl(${hue},60%,38%)'/><rect x='20' y='20' width='380' height='28' fill='rgba(0,0,0,.35)'/><rect x='20' y='64' width='180' height='116' fill='rgba(255,255,255,.18)'/><rect x='214' y='64' width='186' height='50' fill='rgba(255,255,255,.28)'/><text x='214' y='156' font-family='monospace' font-size='20' fill='white'>${text}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Хогийн савны төлөв
const trashItems = [
  { icon: "📄", name: "bug404.log", note: "404: сэтгэл санаа олдсонгүй" },
  { icon: "📝", name: "хуучин_cv_v7_final_final.docx", note: "v8 удахгүй гарна" },
  { icon: "🧩", name: "console.log(1).js", note: "Нэргүй хувьсагчууд" },
];
let trashMsg = "";

// ===== 1. АППУУД: дүрс, нэр, өргөн, агуулга зурах функц =====
const apps = {
  about: {
    icon: "📄", label: "Миний тухай", w: 360,
    render: () =>
      `<h3>${esc(profile.name)}</h3>
       <p class="muted">${esc(profile.role)}</p>
       <p>${esc(profile.bio)}</p>
       <h4>Боловсрол</h4>
       ${profile.education
         .map((e) => `<div class="tl"><b>${esc(e.school)}</b><div class="when">${esc(e.when)}</div>${esc(e.degree)}</div>`)
         .join("")}
       <h4>Хувь хүний ур чадвар</h4>${chips(profile.personal)}`,
  },
  skills: {
    icon: "🛠️", label: "Ур чадвар", w: 340,
    render: () =>
      `<h3>Мэргэжлийн ур чадвар</h3>` +
      profile.skillGroups.map(([title, list]) => `<h4>${esc(title)}</h4>${chips(list)}`).join(""),
  },
  experience: {
    icon: "💼", label: "Туршлага", w: 360,
    render: () =>
      `<h3>Ажлын туршлага</h3>` +
      profile.experience
        .map((e) => `<div class="tl"><b>${esc(e.title)}</b><div class="when">${esc(e.org)} · ${esc(e.when)}</div><ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`)
        .join(""),
  },
  projects: {
    icon: "📁", label: "Бүтээлүүд", w: 440,
    render: () =>
      `<h3>Бүтээлүүд</h3><p class="muted">Хавтас бүрийг нээнэ үү.</p><div class="folder">` +
      projects
        .map((p, i) => `<button class="icon" data-open="proj-${i}"><span class="ico">🗂️</span><span class="lbl">${esc(p.title)}</span></button>`)
        .join("") +
      `</div>`,
  },
  contact: {
    icon: "✉️", label: "Холбоо барих", w: 340,
    render: () =>
      `<h3>Холбоо барих</h3>` +
      profile.contacts
        .map((c) => {
          const external = c.href.startsWith("http") ? ` target="_blank" rel="noopener"` : "";
          return `<a class="contact-row" href="${esc(c.href)}"${external}>
            <span class="contact-ico ${esc(c.type)}">${contactIcons[c.type] || "🔗"}</span>
            <span><small>${esc(c.label)}</small><b>${esc(c.value)}</b></span>
          </a>`;
        })
        .join(""),
  },
  settings: {
    icon: "⚙️", label: "Тохиргоо", w: 320,
    render: () =>
      `<h3>Ханын зураг</h3><div class="wp-pick">
        <button class="wp-teal" data-wp="wp-teal" aria-label="Цэнхэр ногоон"></button>
        <button class="wp-sunset" data-wp="wp-sunset" aria-label="Нар жаргах"></button>
        <button class="wp-night" data-wp="wp-night" aria-label="Шөнө"></button></div>`,
  },
  trash: {
    icon: "🗑️", label: "Хогийн сав", w: 320,
    render: () =>
      `<h3>Хогийн сав</h3>` +
      (trashMsg ? `<p class="trash-msg">${esc(trashMsg)}</p>` : "") +
      (trashItems.length
        ? `<ul class="trash-list">${trashItems
            .map((t, i) => `<li><span>${t.icon} <b>${esc(t.name)}</b><small>${esc(t.note)}</small></span><button class="btn mini" data-restore="${i}">Сэргээх</button></li>`)
            .join("")}</ul><button class="btn" data-egg>Хоосолох</button>`
        : `<p class="muted">Хогийн сав хоосон байна ✨</p>`),
  },
};
const desktopApps = ["about", "skills", "experience", "projects", "contact", "trash"];

// "proj-0" гэх мэт ID-аар бүтээлийн цонхны мэдээллийг үүсгэнэ
function getDef(id) {
  if (id.startsWith("proj-")) {
    const p = projects[+id.slice(5)];
    if (!p) return null;
    const shots = p.images && p.images.length ? p.images : [];
    const gallery = shots.length
      ? `<div class="shots${shots.length === 1 ? " one" : ""}">${shots
          .map((s) => `<img alt="${esc(p.title)}" src="${esc(s)}">`)
          .join("")}</div>`
      : `<img alt="${esc(p.title)}" src="${thumb(p.hue, esc(p.title))}">`;
    const links = (p.links || [])
      .map((l) => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} →</a>`)
      .join("");
    return {
      icon: "🗂️", label: p.title, w: 460,
      render: () =>
        `<div class="card">${gallery}<h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>` +
        (p.tech && p.tech.length ? chips(p.tech) : "") +
        (links || `<p class="muted">Холбоос удахгүй нэмэгдэнэ.</p>`) +
        `</div>`,
    };
  }
  return apps[id] || null;
}

// Ширээн дээр дүрсүүдийг зурна
$("#icons").innerHTML = desktopApps
  .map((id) => `<button class="icon" data-open="${id}"><span class="ico">${apps[id].icon}</span><span class="lbl">${esc(apps[id].label)}</span></button>`)
  .join("");

// ===== 2. ЦОНХНЫ СИСТЕМ =====
const desktop = $("#desktop");
const layer = $("#windows");
const tasks = $("#tasks");
const wins = {};            // нээлттэй цонхнууд: { id: { el, btn, min } }
let zTop = 10, spawn = 0;   // zTop: хамгийн дээд z-index, spawn: цонхыг зөрүүлэх тоолуур
const isMobile = () => matchMedia("(max-width: 700px)").matches;

function focusWin(id) {
  Object.entries(wins).forEach(([k, w]) => {
    const on = k === id;
    w.el.classList.toggle("active", on);
    w.btn.classList.toggle("active", on && !w.min);
  });
  if (wins[id]) wins[id].el.style.zIndex = ++zTop; // хамгийн дээр гаргана
}

function setMin(id, m) {
  const w = wins[id];
  w.min = m;
  w.el.classList.toggle("hidden", m);
  w.btn.classList.toggle("min", m);
  if (m) w.btn.classList.remove("active");
  else focusWin(id);
}

function closeWin(id) {
  wins[id].el.remove();
  wins[id].btn.remove();
  delete wins[id];
}

// Хогийн савны цонх нээлттэй бол агуулгыг дахин зурна
function refreshTrash() {
  if (wins.trash) wins.trash.el.querySelector(".content").innerHTML = apps.trash.render();
}

function openApp(id) {
  // Нээлттэй байвал шинээр үүсгэхгүй, буцааж гаргаад дээр нь авчирна
  if (wins[id]) { setMin(id, false); focusWin(id); return; }
  const def = getDef(id);
  if (!def) return;

  const cw = desktop.clientWidth, ch = desktop.clientHeight;
  const w = Math.min(def.w + 120, cw - 16);      // өргөн
  const offset = (spawn % 5) * 26 - 52;          // дараагийн цонхыг бага зэрэг зөрүүлнэ
  spawn++;

  const el = document.createElement("div");
  el.className = "win";
  el.style.width = w + "px";
  el.style.minHeight = "300px";
  el.style.left = Math.max(8, (cw - w) / 2 + offset) + "px";   // голд нь
  el.style.top = Math.max(8, (ch - 340) / 2 + offset) + "px";
  el.innerHTML = `
    <div class="titlebar">
      <span class="t">${def.icon} ${esc(def.label)}</span>
      <button class="mn" aria-label="Жижигрүүлэх">–</button>
      <button class="mx" aria-label="Томруулах">□</button>
      <button class="x" aria-label="Хаах">✕</button>
    </div>
    <div class="content">${def.render()}</div>`;
  layer.appendChild(el);

  const btn = document.createElement("button");
  btn.className = "task";
  btn.textContent = def.icon + " " + def.label;
  tasks.appendChild(btn);

  wins[id] = { el, btn, min: false };

  // Цонхны 3 товч ба taskbar дээрх товч
  el.addEventListener("pointerdown", () => focusWin(id));
  el.querySelector(".mn").onclick = () => setMin(id, true);
  el.querySelector(".mx").onclick = () => el.classList.toggle("max");
  el.querySelector(".x").onclick = () => closeWin(id);
  btn.onclick = () => {
    const win = wins[id];
    if (win.min) setMin(id, false);
    else if (win.btn.classList.contains("active")) setMin(id, true);
    else focusWin(id);
  };

  // Цонх чирэх (хулгана болон хуруу хоёуланд нь ажиллана)
  const bar = el.querySelector(".titlebar");
  bar.addEventListener("dblclick", (e) => {
    if (!e.target.closest("button")) el.classList.toggle("max");
  });
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button") || isMobile() || el.classList.contains("max")) return;
    const r = el.getBoundingClientRect();
    const d = desktop.getBoundingClientRect();
    const dx = e.clientX - r.left;   // хулгана цонхны зүүн ирмэгээс хэр зайтай вэ
    const dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      let x = ev.clientX - dx - d.left;
      let y = ev.clientY - dy - d.top;
      x = Math.max(-r.width + 90, Math.min(x, d.width - 90)); // цонхыг дэлгэцээс бүрэн гаргахгүй
      y = Math.max(0, Math.min(y, d.height - 30));
      el.style.left = x + "px";
      el.style.top = y + "px";
    };
    const up = () => {
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  });

  focusWin(id);
}

// ===== 3. START ЦЭС, ХАНЫН ЗУРАГ, ХОГИЙН САВ =====
const menu = $("#startmenu");
menu.innerHTML = Object.keys(apps)
  .map((id) => `<button data-open="${id}">${apps[id].icon} ${esc(apps[id].label)}</button>`)
  .join("");
$("#start").onclick = (e) => {
  e.stopPropagation();
  menu.hidden = !menu.hidden;
};

function setWp(cls) {
  desktop.className = cls;
  try { localStorage.setItem("wp", cls); } catch (e) {}
}
try {
  const saved = localStorage.getItem("wp");
  if (saved) desktop.className = saved;
} catch (e) {}

// Бүх товшилтыг нэг газраас барина
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open]");
  if (t) {
    menu.hidden = true;
    openApp(t.dataset.open);   // нэг товшилтоор нээнэ
    return;
  }
  const wp = e.target.closest("[data-wp]");
  if (wp) { setWp(wp.dataset.wp); return; }

  const rs = e.target.closest("[data-restore]");
  if (rs) {
    const [item] = trashItems.splice(+rs.dataset.restore, 1);  // жагсаалтаас хасна
    trashMsg = `«${item.name}» сэргээгдлээ. Гэхдээ хэнд ч хэрэггүй байсан 😄`;
    refreshTrash();
    return;
  }
  if (e.target.closest("[data-egg]")) {
    trashItems.length = 0;
    trashMsg = "Хог цэвэрлэгдлээ.";
    refreshTrash();
    $("#bsod").hidden = false;   // нууц цэнхэр дэлгэц
    return;
  }

  if (!e.target.closest("#startmenu")) menu.hidden = true;
});
$("#bsod").onclick = () => { $("#bsod").hidden = true; };
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { $("#bsod").hidden = true; menu.hidden = true; }
});

// ===== 4. ЦАГ БА ЭХЛЭХ =====
function tick() {
  $("#clock").textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
tick();
setInterval(tick, 20000);

setTimeout(() => {
  $("#boot").classList.add("off");
  setTimeout(() => $("#boot").remove(), 600); 
}, 1200);