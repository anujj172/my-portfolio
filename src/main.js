import "./style.css";
import { profile, projects } from "./data.js";

// ===== Тохиргоо =====
const PIN = "0000";      
const MAX_TRIES = 3;

// ===== Элементүүд =====
const screen = document.querySelector("#screen");
const cardBtn = document.querySelector("#card");
const receipt = document.querySelector("#receipt");

// ===== Төлөв =====
let state = "card";      
let pin = "";
let tries = 0;
let msg = "";

// ===== Дэлгэц зурах функцууд =====
const MENU = [
  { slot: "L1", t: "Танилцуулга", s: "миний тухай", go: "about" },
  { slot: "L2", t: "Үлдэгдэл", s: "ур чадвар", go: "skills" },
  { slot: "L3", t: "Түүх", s: "туршлага", go: "history" },
  { slot: "L4", t: "Баримт", s: "CV хэвлэх", go: "receipt" },
  { slot: "R1", t: "Картууд", s: "төслүүд", go: "projects" },
  { slot: "R2", t: "Шилжүүлэг", s: "холбоо барих", go: "contact" },
  { slot: "R3", t: "Сайтын тухай", s: "санаа, технологи", go: "site" },
  { slot: "R4", t: "Гарах", s: "карт авах", go: "eject" },
];

const ICONS = { phone: "📞", email: "✉️", github: "🐙" };

// ===== Дэлгэц зурах =====
function show(html) {
  screen.innerHTML = `<div class="view">${html}</div>`;
}

function renderCard() {
  show(`<div class="center">
    <p class="small">ATM · ПОРТФОЛИО</p>
    <h1>${profile.name}</h1>
    <p class="role">${profile.role}</p>
    <p class="blink">▼ КАРТАА ОРУУЛНА УУ ▼</p>
  </div>`);
}

function renderPin() {
  const dots = [0, 1, 2, 3].map((i) => `<i class="${i < pin.length ? "on" : ""}"></i>`).join("");
  show(`<div class="center">
    <b>PIN КОДОО ОРУУЛНА УУ</b>
    <div class="dots">${dots}</div>
    <p class="err">${msg}</p>
    <p class="small">Тийм – батлах · Засах – арилгах · Болих – карт авах</p>
  </div>`);
}

function renderMenu() {
  const cell = (m) => {
    const side = m.slot[0] === "L" ? "l" : "r";
    return `<button class="mi ${side} n${m.slot[1]}" data-go="${m.go}">
      <span class="t">${m.t}</span><span class="s">${m.s}</span></button>`;
  };
  show(`<div class="menu">
    <div class="mid">
      <b>Сайн байна уу,</b>
      <b>${profile.name.split(" ")[0]}-ын ATM-д тавтай морилно уу!</b>
    </div>
    ${MENU.map(cell).join("")}
  </div>`);
}

function wrap(title, body) {
  show(`<div class="page">
    <div class="page-head"><span>${title}</span><span class="hint">L4 Буцах · R4 Гарах</span></div>
    <div class="page-body">${body}</div>
    <div class="page-foot"><button data-go="menu">◂ Буцах</button><button data-go="eject">Гарах ▸</button></div>
  </div>`);
}

const chips = (arr) => `<div class="chips">${arr.map((x) => `<span class="chip">${x}</span>`).join("")}</div>`;

const PAGES = {
  about() {
    wrap("ТАНИЛЦУУЛГА", `
      <h3>Миний тухай</h3><p>${profile.bio}</p>
      <h3>Боловсрол</h3>
      ${profile.education.map((e) => `<div class="card-item"><div class="row"><b>${e.school}</b><span>${e.when}</span></div><div>${e.degree}</div></div>`).join("")}
      <h3>Хувийн ур чадвар</h3>${chips(profile.personal)}`);
  },
  skills() {
    wrap("ҮЛДЭГДЭЛ · УР ЧАДВАР", profile.skillGroups.map(([name, list]) => `
      <h3>${name}</h3>
      <div class="dots-line"><span>Нийт ур чадвар</span><b>${list.length}</b></div>
      ${chips(list)}`).join(""));
  },
  history() {
    wrap("ГҮЙЛГЭЭНИЙ ТҮҮХ · ТУРШЛАГА", profile.experience.map((e) => `
      <div class="card-item">
        <div class="row"><b>${e.title}</b><span>${e.when}</span></div>
        <div class="small">${e.org}</div>
        <ul>${e.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>`).join(""));
  },
  projects() {
    wrap("КАРТУУД · ТӨСЛҮҮД", projects.map((p) => {
      const thumb = p.images.length
        ? `<div class="thumb"><img src="${p.images[0]}" alt="${p.title}" /></div>`
        : `<div class="thumb" style="background:linear-gradient(135deg,hsl(${p.hue} 60% 40%),hsl(${p.hue + 40} 60% 25%))">${p.title[0]}</div>`;
      const links = p.links.length
        ? p.links.map((l) => `<a class="btn" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join("")
        : `<span class="btn off">Холбоос удахгүй</span>`;
      return `<div class="card-item proj">${thumb}<b>${p.title}</b><p>${p.desc}</p>${chips(p.tech)}<div class="btns">${links}</div></div>`;
    }).join(""));
  },
  contact() {
    wrap("ШИЛЖҮҮЛЭГ · ХОЛБОО БАРИХ", `<p>Надтай холбогдохыг хүсвэл доорх сувгуудыг сонгоно уу.</p>` +
      profile.contacts.map((c) => `
      <a class="contact" href="${c.href}" target="_blank" rel="noopener">
        <span class="ic">${ICONS[c.type] || "🔗"}</span>
        <span><small>${c.label}</small><b>${c.value}</b></span>
      </a>`).join(""));
  },
  site() {
    wrap("САЙТЫН ТУХАЙ", `
      <h3>Санаа</h3>
      <p>Портфолиог банкны машин (ATM) хэлбэрээр хийсэн. Карт оруулж, PIN цохиод, хажуугийн товчоор цэс сонгоно. Хэсэг бүр банкны үйлчилгээтэй тохирно: ур чадвар = үлдэгдэл, туршлага = гүйлгээний түүх, төсөл = карт, холбоо барих = шилжүүлэг, CV = баримт.</p>
      <h3>Технологи</h3>${chips(["JavaScript", "Vite", "CSS", "Vercel", "GitHub"])}
      <h3>Тэмдэглэл</h3>
      <p>Хийсвэр "ANUJIN ATM" нэр. Жинхэнэ банк, карт, PIN мэдээлэл ашиглаагүй.</p>`);
  },
};

// ===== Төлөв шилжүүлэх =====
function go(name) {
  if (name === "menu") { state = "menu"; renderMenu(); return; }
  if (name === "eject") { eject(); return; }
  if (name === "receipt") { printReceipt(); return; }
  state = "page";
  PAGES[name]();
  screen.querySelector(".page-body").scrollTop = 0;
}

function insertCard() {
  if (state !== "card") return;
  cardBtn.classList.add("in");
  pin = ""; msg = "";
  setTimeout(() => { state = "pin"; renderPin(); }, 650);
  state = "busy";
}

function eject() {
  receipt.classList.remove("out");
  cardBtn.classList.remove("in", "gone");
  state = "card"; pin = ""; msg = ""; tries = 0;
  renderCard();
}

function submitPin() {
  if (pin.length < 4) { msg = "4 орон оруулна уу"; renderPin(); return; }
  if (pin === PIN) { tries = 0; state = "menu"; renderMenu(); return; }
  tries++; pin = "";
  if (tries >= MAX_TRIES) {
    state = "locked";
    cardBtn.classList.remove("in"); cardBtn.classList.add("gone");
    show(`<div class="center"><h1>🏧 КАРТ ЗАЛГИГДЛАА</h1><p class="role">Тоглосон юм аа, Түр хүлээгээрэй, картыг чинь буцааж өгнө.</p></div>`);
    setTimeout(eject, 3500);
    return;
  }
  msg = `Буруу PIN. Үлдсэн оролдлого: ${MAX_TRIES - tries}`;
  renderPin();
}

function printReceipt() {
  receipt.innerHTML = `ANUJIN BANK<br>${new Date().toLocaleDateString("mn-MN")}<br>-----------<br>${profile.name}<br>${profile.role.slice(0, 22)}…<br><a href="/CV.pdf" target="_blank" rel="noopener">CV.pdf татах</a>`;
  receipt.classList.remove("out");
  void receipt.offsetWidth;
  receipt.classList.add("out");
  state = "page";
  wrap("БАРИМТ", `<p>Баримт хэвлэгдлээ. Доорх "баримт" нүхнээс авч, <b>CV.pdf татах</b> холбоос дээр дарна уу.</p>`);
}

// ===== Үйлдлүүд =====
function press(key) {
  if (state !== "pin" || pin.length >= 4) return;
  pin += key; msg = ""; renderPin();
}

function act(a) {
  if (a === "ok") {
    if (state === "card") insertCard();
    else if (state === "pin") submitPin();
  } else if (a === "fix") {
    if (state === "pin") { pin = pin.slice(0, -1); msg = ""; renderPin(); }
  } else if (a === "stop") {
    if (state === "page") go("menu");
    else if (state === "pin" || state === "menu") eject();
  }
}

function side(slot) {
  if (state === "menu") {
    const m = MENU.find((x) => x.slot === slot);
    if (m) go(m.go);
  } else if (state === "page") {
    if (slot === "L4") go("menu");
    if (slot === "R4") eject();
  }
}

// ===== Event холбоос =====
cardBtn.addEventListener("click", insertCard);
screen.addEventListener("click", (e) => {
  const el = e.target.closest("[data-go]");
  if (el) go(el.dataset.go);
});
document.querySelectorAll("[data-key]").forEach((b) => b.addEventListener("click", () => press(b.dataset.key)));
document.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => act(b.dataset.act)));
document.querySelectorAll("[data-slot]").forEach((b) => b.addEventListener("click", () => side(b.dataset.slot)));
document.addEventListener("keydown", (e) => {
  if (/^[0-9]$/.test(e.key)) press(e.key);
  else if (e.key === "Enter") act("ok");
  else if (e.key === "Backspace") act("fix");
  else if (e.key === "Escape") act("stop");
});

renderCard();