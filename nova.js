// =====================================================================
// Nova Sites Studio — menú, idioma ES/EN, WhatsApp/correo y animaciones
// =====================================================================

// >>> DATOS DE CONTACTO: cambia solo estas dos líneas <<<
const WHATSAPP = "18293541102";          // con el 1 delante, sin espacios
const CORREO = "exneillacevedo@gmail.com";

(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Idioma ----------
  let lang = "es";
  try { lang = localStorage.getItem("nova-lang") || (navigator.language || "es").slice(0, 2); } catch { /* sin almacenamiento */ }
  if (lang !== "en") lang = "es";
  const boton = $(".idioma");
  function idioma(l) {
    lang = l;
    document.documentElement.lang = l;
    $$("[data-en]").forEach((el) => {
      if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      el.innerHTML = l === "en" ? el.dataset.en : el.dataset.es;
    });
    $$("[data-en-label]").forEach((el) => {
      if (el.dataset.esLabel === undefined) el.dataset.esLabel = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", l === "en" ? el.dataset.enLabel : el.dataset.esLabel);
    });
    $$("[data-en-ph]").forEach((el) => {
      if (el.dataset.esPh === undefined) el.dataset.esPh = el.getAttribute("placeholder") || "";
      el.setAttribute("placeholder", l === "en" ? el.dataset.enPh : el.dataset.esPh);
    });
    const b = document.body.dataset;
    if (b.tituloEs) document.title = l === "en" ? b.tituloEn : b.tituloEs;
    if (boton) { boton.textContent = l === "en" ? "ES" : "EN"; boton.setAttribute("aria-label", l === "en" ? "Ver en español" : "View in English"); }
    enlaces();
    try { localStorage.setItem("nova-lang", l); } catch { /* sin almacenamiento */ }
  }
  boton?.addEventListener("click", () => idioma(lang === "en" ? "es" : "en"));

  // ---------- WhatsApp y correo ----------
  function enlaces() {
    $$("[data-wa]").forEach((a) => {
      const msg = lang === "en" ? a.dataset.waEn || a.dataset.wa : a.dataset.wa;
      a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      a.target = "_blank"; a.rel = "noopener";
    });
    $$("[data-correo]").forEach((a) => {
      if (!CORREO) { a.closest("[data-si-correo]")?.setAttribute("hidden", ""); return; }
      a.href = `mailto:${CORREO}?subject=${encodeURIComponent(lang === "en" ? "Website project" : "Proyecto de página web")}`;
    });
    $$("[data-correo-texto]").forEach((e) => (e.textContent = CORREO));
    $$("[data-wa-texto]").forEach((e) => (e.textContent = `(${WHATSAPP.slice(1, 4)}) ${WHATSAPP.slice(4, 7)}-${WHATSAPP.slice(7)}`));
  }

  // ---------- Encabezado ----------
  const nav = $(".nav");
  const solido = () => nav.classList.toggle("solido", scrollY > 30);
  addEventListener("scroll", solido, { passive: true });
  solido();
  const burger = $(".burger"), menuM = $("#menu-movil");
  function menu(abrir) { menuM.hidden = !abrir; burger.setAttribute("aria-expanded", String(abrir)); burger.classList.toggle("x", abrir); nav.classList.toggle("claro", abrir); }
  burger.addEventListener("click", () => menu(menuM.hidden));
  menuM.addEventListener("click", (e) => { if (e.target.closest("a")) menu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !menuM.hidden) menu(false); });

  // ---------- Aparición al hacer scroll ----------
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visto"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" })
    : null;
  $$(".revela").forEach((el) => (io ? io.observe(el) : el.classList.add("visto")));

  // ---------- Impacto visual ----------
  const hero = $(".hero");
  const col = $("[data-tilt] .collage-in");
  if (hero && matchMedia("(hover: hover)").matches) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      hero.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      hero.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      if (col) { col.style.setProperty("--ry", `${((x - 0.5) * 14).toFixed(2)}deg`); col.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`); }
    });
    hero.addEventListener("pointerleave", () => { col?.style.setProperty("--rx", "0deg"); col?.style.setProperty("--ry", "0deg"); });
  }
  const contar = (el) => {
    const fin = Number(el.dataset.contar), suf = el.dataset.sufijo || "", t0 = performance.now();
    const paso = (t) => { const k = Math.min(1, (t - t0) / 1500); el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  };
  const medir = (m) => {
    const img = $("img", m), v = $(".vista", m);
    if (!img || !img.offsetHeight) return;
    const d = Math.max(0, img.offsetHeight - v.offsetHeight);
    m.style.setProperty("--d", `${d}px`);
    m.style.setProperty("--t", `${Math.min(9, Math.max(3, d / 350)).toFixed(1)}s`);
  };
  $$(".marco.desliza").forEach((m) => { const img = $("img", m); if (img.complete) medir(m); img.addEventListener("load", () => medir(m)); });
  addEventListener("resize", () => $$(".marco.desliza").forEach(medir));
  const io2 = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((en) => {
        if (!en.isIntersecting) return;
        if (en.target.dataset.contar) contar(en.target);
        else { medir(en.target); en.target.classList.add("en-vista"); }
        io2.unobserve(en.target);
      }), { threshold: 0.35 })
    : null;
  if (io2) $$("[data-contar], .marco.desliza").forEach((el) => io2.observe(el));

  // ---------- Formulario de cotización → WhatsApp ----------
  const form = $("#form-cotiza");
  if (form) {
    const pre = new URLSearchParams(location.search).get("paquete");
    if (pre && form.paquete.querySelector(`option[value="${CSS.escape(pre)}"]`)) form.paquete.value = pre;
    form.nombre.addEventListener("input", () => { $("#f-error").hidden = true; });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (n) => form[n].value.trim();
      const txt = (n) => form[n].selectedOptions[0].textContent.trim();
      const err = $("#f-error");
      if (!v("nombre")) { err.hidden = false; form.nombre.focus(); return; }
      err.hidden = true;
      const en = lang === "en";
      const lineas = [
        en ? `Hi! I'm ${v("nombre")} and I'd like a quote.` : `Hola, soy ${v("nombre")} y quiero una cotización.`,
        v("negocio") && (en ? `Business: ${v("negocio")}` : `Negocio: ${v("negocio")}`),
        (en ? "Package: " : "Paquete: ") + txt("paquete"),
        (en ? "Timeline: " : "Para cuándo: ") + txt("plazo"),
        v("mensaje") && (en ? `Details: ${v("mensaje")}` : `Detalles: ${v("mensaje")}`),
      ].filter(Boolean);
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join("\n"))}`, "_blank", "noopener");
    });
  }

  $$("[data-anio]").forEach((e) => (e.textContent = new Date().getFullYear()));
  idioma(lang);
})();
