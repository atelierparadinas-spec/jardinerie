/* =====================================================================
   Jardinerie — app.js
   Logique applicative : chargement des données, rendu des cartes plantes,
   calcul automatique des prochaines dates d'entretien, filtres, validation
   des tâches (« Fait ») et export CSV / Notion.

   Fonctionne aussi bien via un petit serveur local (fetch des .json) qu'en
   double-clic sur index.html (protocole file://), grâce au fallback
   window.JARDINERIE_DB défini dans data/db.js.
   ===================================================================== */

(function () {
  "use strict";

  /* ----------  Constantes & état  ---------- */
  const STORAGE_KEY = "jardinerie.taskState.v1"; // mémorise les dates "fait"
  const TYPES = {
    arrosage:     { label: "Arrosage",     icon: "💧" },
    rempotage:    { label: "Rempotage",    icon: "🪴" },
    engrais:      { label: "Engrais",      icon: "🌿" },
    surveillance: { label: "Surveillance", icon: "🔎" }
  };

  let PLANTS = [];       // fiches plantes
  let TASKS = [];        // tâches d'entretien (enrichies de nextDue)
  let activeFilter = "tous";

  /* =====================================================================
     1. CHARGEMENT DES DONNÉES
     ===================================================================== */

  /**
   * Essaie de charger un JSON via fetch ; renvoie null si impossible
   * (typiquement en file:// où fetch est bloqué par la politique CORS).
   */
  async function tryFetchJSON(url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function loadData() {
    let plantsData = await tryFetchJSON("data/plants.json");
    let tasksData = await tryFetchJSON("data/tasks.json");

    // Fallback : données embarquées (db.js) pour le mode double-clic file://
    if (!plantsData && window.JARDINERIE_DB) plantsData = window.JARDINERIE_DB.plants;
    if (!tasksData && window.JARDINERIE_DB) tasksData = window.JARDINERIE_DB.tasks;

    PLANTS = (plantsData && plantsData.plantes) || [];
    TASKS = (tasksData && tasksData.taches) || [];
  }

  /* =====================================================================
     2. OUTILS DATES
     ===================================================================== */

  function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
  function toISO(date) {
    // YYYY-MM-DD (compatible import date Notion)
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const j = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${j}`;
  }
  function daysBetween(a, b) {
    return Math.round((a - b) / 86400000);
  }
  const MOIS = ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];
  function frLong(date) {
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  /* =====================================================================
     3. ÉTAT PERSISTANT (localStorage)
     ===================================================================== */

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { /* navigation privée / file:// restreint : on ignore */ }
  }

  /**
   * Calcule la prochaine date d'une tâche.
   * Ancre = dernière date "fait" si elle existe, sinon aujourd'hui.
   * Prochaine date = ancre + intervalleJours.
   */
  function computeNextDue(task, state) {
    const rec = state[task.id];
    const anchor = rec && rec.lastDone ? new Date(rec.lastDone + "T00:00:00") : today();
    return addDays(anchor, task.intervalleJours);
  }

  /** Enrichit toutes les tâches avec nextDue + statut, et trie par date. */
  function refreshTasks() {
    const state = loadState();
    const t0 = today();
    TASKS.forEach(function (task) {
      const due = computeNextDue(task, state);
      task._due = due;
      task._diff = daysBetween(due, t0);
      task._lastDone = state[task.id] && state[task.id].lastDone ? state[task.id].lastDone : null;
      task._statut = task._diff < 0 ? "En retard" : (task._diff <= 7 ? "À faire bientôt" : "Planifié");
    });
    TASKS.sort(function (a, b) { return a._due - b._due; });
  }

  /* =====================================================================
     4. RENDU DES CARTES PLANTES
     ===================================================================== */

  // Illustration SVG de secours (si une photo locale est absente / cassée).
  function fallbackSVG(nom) {
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>` +
        `<rect width='400' height='300' fill='#e8ede1'/>` +
        `<g fill='#8a9a7b'>` +
          `<path d='M200 250 C150 200 120 150 200 60 C280 150 250 200 200 250 Z' opacity='0.9'/>` +
          `<path d='M200 250 C170 210 110 200 70 230 C140 240 170 250 200 260 Z' opacity='0.6'/>` +
          `<path d='M200 250 C230 210 290 200 330 230 C260 240 230 250 200 260 Z' opacity='0.6'/>` +
        `</g>` +
        `<rect x='170' y='250' width='60' height='30' rx='4' fill='#c0744a'/>` +
        `<text x='200' y='295' text-anchor='middle' font-family='Georgia,serif' font-size='13' fill='#6b7a5c'>${escapeHTML(nom)}</text>` +
      `</svg>`;
    // encodeURIComponent ne masque PAS l'apostrophe : on la force en %27
    // car l'URI est ensuite injectée dans un attribut onerror="...src='...'".
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg).replace(/'/g, "%27");
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function plantCard(p) {
    const specs = [
      ["☀️ Lumière", p.lumiere],
      ["💧 Arrosage", p.arrosage],
      ["💦 Humidité", p.humidite],
      ["🌡️ Température", p.temperature],
      ["🪴 Rempotage", p.rempotage],
      ["🌿 Engrais", p.engrais]
    ].map(function (s) {
      return `<div class="spec"><div class="k">${s[0]}</div><div class="v">${escapeHTML(s[1])}</div></div>`;
    }).join("");

    const symptomes = (p.symptomes || []).map(function (x) {
      return `<li>${escapeHTML(x)}</li>`;
    }).join("");

    const fallback = fallbackSVG(p.nomCommun);

    return `
      <article class="card" id="${escapeHTML(p.id)}">
        <div class="photo">
          <img src="${escapeHTML(p.photo)}" alt="${escapeHTML(p.nomCommun)}" loading="lazy"
               onerror="this.onerror=null;this.src='${fallback}';">
          <span class="badge-diff">${escapeHTML(p.difficulte)}</span>
        </div>
        <div class="body">
          <div class="titre">
            <h3>${escapeHTML(p.nomCommun)}</h3>
            <div class="latin">${escapeHTML(p.nomLatin)}</div>
          </div>
          <p class="desc">${escapeHTML(p.description)}</p>
          <div class="specs">${specs}</div>
          <details class="symptomes">
            <summary>Symptômes à surveiller</summary>
            <ul>${symptomes}</ul>
          </details>
          <div class="next-action">
            <div class="k">Prochaine action</div>
            ${escapeHTML(p.prochaineAction)}
          </div>
          <a class="card-link" href="plante.html?id=${escapeHTML(p.id)}">Ouvrir la fiche complète →</a>
          <div class="qr-block">
            <img class="qr" src="assets/qr/${escapeHTML(p.id)}.png" alt="QR code — ${escapeHTML(p.nomCommun)}"
                 loading="lazy" onerror="this.closest('.qr-block').classList.add('qr-missing');">
            <div class="qr-cap">
              <span class="qr-title">Fiche d'entretien</span>
              <span class="qr-sub">Scannez pour ouvrir cette fiche</span>
            </div>
          </div>
        </div>
      </article>`;
  }

  function renderPlants() {
    const grid = document.getElementById("plants-grid");
    if (!PLANTS.length) {
      grid.innerHTML = `<div class="empty">Aucune plante chargée. Vérifiez le dossier <code>/data</code>.</div>`;
      return;
    }
    grid.innerHTML = PLANTS.map(plantCard).join("");
  }

  /* =====================================================================
     5. RENDU DES FILTRES & DU CALENDRIER
     ===================================================================== */

  function renderFilters() {
    const container = document.getElementById("filters");
    const counts = { tous: TASKS.length };
    Object.keys(TYPES).forEach(function (k) {
      counts[k] = TASKS.filter(function (t) { return t.type === k; }).length;
    });

    const chips = [["tous", "Tout", "🗂️"]].concat(
      Object.keys(TYPES).map(function (k) { return [k, TYPES[k].label, TYPES[k].icon]; })
    );

    container.innerHTML = chips.map(function (c) {
      const key = c[0];
      const active = key === activeFilter ? " active" : "";
      return `<button class="filter-chip${active}" data-filter="${key}">` +
             `${c[2]} ${c[1]} <span class="count">${counts[key] || 0}</span></button>`;
    }).join("");

    container.querySelectorAll(".filter-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeFilter = btn.getAttribute("data-filter");
        renderFilters();
        renderTasks();
      });
    });
  }

  function taskRow(task) {
    const due = task._due;
    const dueClass = task._diff < 0 ? "late" : (task._diff <= 7 ? "soon" : "ok");
    let dueLabel;
    if (task._diff < 0) dueLabel = `En retard de ${Math.abs(task._diff)} j`;
    else if (task._diff === 0) dueLabel = "Aujourd'hui";
    else if (task._diff === 1) dueLabel = "Demain";
    else dueLabel = `Dans ${task._diff} jours`;

    const doneNote = task._lastDone
      ? ` · Dernier : ${new Date(task._lastDone + "T00:00:00").toLocaleDateString("fr-FR")}`
      : "";

    return `
      <div class="task" data-type="${task.type}" data-id="${task.id}">
        <div class="date-box">
          <div class="d">${due.getDate()}</div>
          <div class="m">${MOIS[due.getMonth()]}</div>
        </div>
        <div class="info">
          <div class="t">
            <span class="type-tag" data-type="${task.type}">${TYPES[task.type].label}</span>
            ${escapeHTML(task.titre)}
          </div>
          <div class="sub">${escapeHTML(task.plante)} · ${escapeHTML(task.frequence)}${doneNote}</div>
          <div class="due ${dueClass}">${dueLabel} — ${frLong(due)}</div>
        </div>
        <div class="actions">
          <button class="btn-done" data-id="${task.id}">✓ Fait</button>
        </div>
      </div>`;
  }

  function renderTasks() {
    const list = document.getElementById("task-list");
    const filtered = activeFilter === "tous"
      ? TASKS
      : TASKS.filter(function (t) { return t.type === activeFilter; });

    if (!filtered.length) {
      list.innerHTML = `<div class="empty">Aucune tâche pour ce filtre.</div>`;
      return;
    }
    list.innerHTML = filtered.map(taskRow).join("");

    list.querySelectorAll(".btn-done").forEach(function (btn) {
      btn.addEventListener("click", function () {
        markDone(btn.getAttribute("data-id"));
      });
    });
  }

  /* =====================================================================
     6. VALIDATION D'UNE TÂCHE (« Fait »)
     ===================================================================== */

  function markDone(taskId) {
    const state = loadState();
    state[taskId] = { lastDone: toISO(today()) };
    saveState(state);

    refreshTasks();          // recalcule toutes les prochaines dates
    renderTasks();
    renderStats();

    const task = TASKS.find(function (t) { return t.id === taskId; });
    if (task) {
      showToast(`✓ « ${task.titre} » fait. Prochaine date : ${frLong(task._due)}.`);
    }
  }

  /* =====================================================================
     7. STATISTIQUES (hero)
     ===================================================================== */

  function renderStats() {
    const within7 = TASKS.filter(function (t) { return t._diff <= 7; }).length;
    document.getElementById("stat-plantes").textContent = PLANTS.length;
    document.getElementById("stat-taches").textContent = TASKS.length;
    document.getElementById("stat-semaine").textContent = within7;
  }

  /* =====================================================================
     8. EXPORT CSV / NOTION
     ===================================================================== */

  // Échappe un champ pour le format CSV (guillemets doublés, entouré de "").
  function csvField(v) {
    const s = String(v == null ? "" : v);
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function buildCSV(notionMode) {
    refreshTasks();
    // Colonnes attendues par la base Notion (voir README.md)
    const headers = ["Tâche", "Plante", "Type", "Date", "Fréquence", "Statut", "Notes"];
    const rows = TASKS.map(function (t) {
      return [
        t.titre,
        t.plante,
        TYPES[t.type].label,
        toISO(t._due),               // format YYYY-MM-DD pour Notion
        t.frequence,
        t._statut,
        t.notes || ""
      ].map(csvField).join(",");
    });
    // BOM UTF-8 pour conserver les accents à l'ouverture (Excel/Notion)
    return "﻿" + headers.map(csvField).join(",") + "\n" + rows.join("\n");
  }

  function downloadCSV(filename, content) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* =====================================================================
     9. TOAST
     ===================================================================== */

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3200);
  }

  /* =====================================================================
     9b. LIEN PROFOND (QR / ancre #id-plante)
     Ouvre, fait défiler vers, et met en surbrillance la carte ciblée par
     le hash de l'URL (ex. index.html#peperomia-scandens). C'est la
     destination des QR codes.
     ===================================================================== */

  function focusPlant(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    // Décalage pour ne pas passer sous l'en-tête collant
    const header = document.querySelector(".site-header");
    const offset = (header ? header.offsetHeight : 0) + 14;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
    // Surbrillance temporaire
    el.classList.remove("card-highlight");
    void el.offsetWidth;            // relance l'animation si déjà appliquée
    el.classList.add("card-highlight");
  }

  function handleDeepLink() {
    const id = decodeURIComponent((location.hash || "").replace(/^#/, "").trim());
    if (id) focusPlant(id);
  }

  /* =====================================================================
     10. INITIALISATION
     ===================================================================== */

  async function init() {
    await loadData();
    refreshTasks();

    renderPlants();
    renderFilters();
    renderTasks();
    renderStats();

    // Lien profond : après le rendu des cartes
    handleDeepLink();
    window.addEventListener("hashchange", handleDeepLink);

    document.getElementById("footer-date").textContent =
      "Calendrier calculé à partir du " + frLong(today()) + ".";

    document.getElementById("btn-csv").addEventListener("click", function () {
      downloadCSV("jardinerie-taches.csv", buildCSV(false));
      showToast("CSV exporté ⬇︎");
    });
    document.getElementById("btn-notion").addEventListener("click", function () {
      downloadCSV("notion-template.csv", buildCSV(true));
      showToast("CSV Notion exporté ⬇︎ — importez-le dans une base Notion.");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
