const DEFAULT_LANG = "nb";

function getLang() {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  return urlLang || localStorage.getItem("lang") || DEFAULT_LANG;
}

async function loadStrings(lang) {
  const res = await fetch(`./strings/${lang}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load strings for ${lang}`);
  return res.json();
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function applyStrings(strings) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = getByPath(strings, key);
    if (typeof value === "string") el.textContent = value;
  });
}

function setActiveLangButton(lang) {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
  });
}

async function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  const strings = await loadStrings(lang);
  applyStrings(strings);
  setActiveLangButton(lang);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-lang]");
  if (!btn) return;
  const lang = btn.getAttribute("data-lang");
  setLanguage(lang).catch(console.error);
});

setLanguage(getLang()).catch(async () => {
  // fallback to default language if something breaks
  const strings = await loadStrings(DEFAULT_LANG);
  applyStrings(strings);
  setActiveLangButton(DEFAULT_LANG);
});
