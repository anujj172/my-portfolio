import "./style.css";
import { profile, projects } from "./data.js";

const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Зураггүй үед SVG жижиг зураг үүсгэнэ
function thumb(hue, text) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='200'><rect width='420' height='200' fill='hsl(${hue},60%,38%)'/><rect x='20' y='20' width='380' height='28' fill='rgba(0,0,0,.35)'/><rect x='20' y='64' width='180' height='116' fill='rgba(255,255,255,.18)'/><text x='214' y='156' font-family='monospace' font-size='22' fill='white'>${text}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Апп бүр: дүрс, нэр, цонхны өргөн, агуулга зурах функц
const apps = {
  about: { icon: "📄", label: "Миний тухай", w: 360, render: () =>
    `<h3>${esc(profile.name)}</h3><p class="muted">${esc(profile.role)}</p><p>${esc(profile.bio)}</p>` },
  skills: { icon: "🛠️", label: "Ур чадвар", w: 340, render: () =>
    `<h3>Ур чадвар</h3>` + profile.skills.map(([n, v]) =>
      `<div class="bar"><span>${esc(n)}</span><i><b style="width:${v}%"></b></i><span>${v}%</span></div>`).join("") },
  projects: { icon: "📁", label: "Бүтээлүүд", w: 440, render: () =>
    `<h3>Бүтээлүүд</h3><p class="muted">Хавтас бүрийг нээнэ үү.</p><div class="folder">` +
    projects.map((p, i) => `<button class="icon" data-open="proj-${i}"><span class="ico">🗂️</span><span class="lbl">${esc(p.title)}</span></button>`).join("") + `</div>` },
  contact: { icon: "✉️", label: "Холбоо барих", w: 340, render: () =>
    `<h3>Холбоо барих</h3>` + Object.entries(profile.contacts).map(([k, v]) =>
      `<p><b>${esc(k)}</b><br><a href="${k === "email" ? "mailto:" : ""}${esc(v)}" target="_blank" rel="noopener">${esc(v)}</a></p>`).join("") },
  settings: { icon: "⚙️", label: "Тохиргоо", w: 320, render: () =>
    `<h3>Ханын зураг</h3><div class="wp-pick">
      <button class="wp-teal" data-wp="wp-teal" aria-label="Цэнхэр ногоон"></button>
      <button class="wp-sunset" data-wp="wp-sunset" aria-label="Нар жаргах"></button>
      <button class="wp-night" data-wp="wp-night" aria-label="Шөнө"></button></div>` },
  trash: { icon: "🗑️", label: "Хогийн сав", w: 320, render: () =>
    `<h3>Хогийн сав</h3><p class="muted">Дотор нь: 404 алдаа, хуучин console.log, нэргүй хувьсагчууд.</p><button class="btn" data-egg>Хоосолох</button>` },
};
const desktopApps = ["about", "skills", "projects", "contact", "trash"];

// "proj-0" гэх мэт ID-аар бүтээлийн цонхны мэдээллийг үүсгэнэ
function getDef(id) {
  if (id.startsWith("proj-")) {
    const p = projects[+id.slice(5)];
    if (!p) return null;
    return { icon: "🗂️", label: p.title, w: 420, render: () =>
      `<div class="card"><img alt="${esc(p.title)}" src="${thumb(p.hue, esc(p.title))}"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">Үзэх →</a></div>` };
  }
  return apps[id] || null;
}

// Ширээн дээр дүрсүүдийг зурна
$("#icons").innerHTML = desktopApps
  .map((id) => `<button class="icon" data-open="${id}"><span class="ico">${apps[id].icon}</span><span class="lbl">${esc(apps[id].label)}</span></button>`)
  .join("");
  const desktop = $("#desktop");
const layer = $("#windows");
const tasks = $("#tasks");
const wins = {};           // нээлттэй цонхнуудыг ID-аар нь хадгална
let zTop = 10, spawn = 0;  // zTop: хамгийн дээд z-index, spawn: цонхыг давхцуулахгүй зөрүүлэх тоолуур
const isMobile = () => matchMedia("(max-width: 700px)").matches;
const coarse = matchMedia("(pointer: coarse)").matches;

function openApp(id) {
  if (wins[id]) return;
  const def = getDef(id);
  if (!def) return;

  const el = document.createElement("div");
  el.className = "win";
  el.style.width = def.w + "px";
  el.style.left = Math.max(8, Math.min(120 + spawn * 28, desktop.clientWidth - def.w - 8)) + "px";
  el.style.top = Math.max(8, Math.min(30 + spawn * 28, desktop.clientHeight - 200)) + "px";
  spawn = (spawn + 1) % 6;
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
}

// Дүрс дээр дарах: хулганаар 2 дарна, утсаар 1 товшино
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open]");
  if (!t) return;
  document.querySelectorAll(".icon.sel").forEach((i) => i.classList.remove("sel"));
  t.classList.add("sel");
  if (coarse || e.detail === 0) openApp(t.dataset.open); // e.detail === 0 нь гараас Enter дарсан үед
});
document.addEventListener("dblclick", (e) => {
  const t = e.target.closest(".icon[data-open]");
  if (t) openApp(t.dataset.open);
});