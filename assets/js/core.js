/* =====================================================================
   Jardinerie — core.js
   Module commun partagé par plante.html et calendrier.html (et utilisable
   ailleurs). Regroupe : chargement des données, helpers de dates, état
   persistant (localStorage, MÊME clé que app.js pour partager les « Fait »),
   calcul des échéances et génération des occurrences récurrentes.

   Ordre de chargement des balises script : d'abord data/db.js, puis core.js.
   ===================================================================== */

window.JardinerieCore = (function () {
  "use strict";

  // Clé identique à app.js → l'état « Fait » est partagé entre toutes les pages
  var STORAGE_KEY = "jardinerie.taskState.v1";

  var TYPES = {
    arrosage:     { label: "Arrosage",     icon: "💧", color: "#3f7fb0", bg: "#e3eef6" },
    rempotage:    { label: "Rempotage",    icon: "🪴", color: "#a85f39", bg: "#f3e2d6" },
    engrais:      { label: "Engrais",      icon: "🌿", color: "#6b8e3d", bg: "#e8efdb" },
    surveillance: { label: "Surveillance", icon: "🔎", color: "#b08a2e", bg: "#f4ecd2" }
  };

  /* ----------  Chargement des données  ---------- */
  function tryFetchJSON(url) {
    if (typeof fetch !== "function") return Promise.resolve(null);
    return fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  // Renvoie une promesse { plants:[], tasks:[] }
  function loadData() {
    return Promise.all([
      tryFetchJSON("data/plants.json"),
      tryFetchJSON("data/tasks.json")
    ]).then(function (res) {
      var p = res[0], t = res[1];
      if (!p && window.JARDINERIE_DB) p = window.JARDINERIE_DB.plants;
      if (!t && window.JARDINERIE_DB) t = window.JARDINERIE_DB.tasks;
      return {
        plants: (p && p.plantes) || [],
        tasks: (t && t.taches) || []
      };
    });
  }

  function getPlant(plants, id) {
    for (var i = 0; i < plants.length; i++) {
      if (plants[i].id === id) return plants[i];
    }
    return null;
  }

  /* ----------  Dates  ---------- */
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function addDays(date, n) { var d = new Date(date); d.setDate(d.getDate() + n); return d; }
  function toISO(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var j = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + j;
  }
  function fromISO(s) { return new Date(s + "T00:00:00"); }
  function daysBetween(a, b) { return Math.round((a - b) / 86400000); }
  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  var MOIS = ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];
  var MOIS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function frLong(date) {
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  /* ----------  État persistant (localStorage)  ---------- */
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { /* file:// ou navigation privée : on ignore */ }
  }
  function markDone(taskId) {
    var s = loadState();
    s[taskId] = { lastDone: toISO(today()) };
    saveState(s);
    return s;
  }

  /* ----------  Échéances  ---------- */
  // Ancre = dernière date « Fait » sinon aujourd'hui ; prochaine = ancre + intervalle
  function anchorOf(task, state) {
    var rec = state[task.id];
    return rec && rec.lastDone ? fromISO(rec.lastDone) : today();
  }
  function computeNextDue(task, state) {
    return addDays(anchorOf(task, state), task.intervalleJours);
  }

  // Enrichit + trie les tâches (prochaine échéance, écart, statut)
  function enrichTasks(tasks, state) {
    state = state || loadState();
    var t0 = today();
    var out = tasks.map(function (task) {
      var due = computeNextDue(task, state);
      var diff = daysBetween(due, t0);
      var rec = state[task.id];
      return Object.assign({}, task, {
        _due: due,
        _diff: diff,
        _lastDone: rec && rec.lastDone ? rec.lastDone : null,
        _statut: diff < 0 ? "En retard" : (diff <= 7 ? "À faire bientôt" : "Planifié")
      });
    });
    out.sort(function (a, b) { return a._due - b._due; });
    return out;
  }

  // Génère les occurrences récurrentes d'une tâche dans [from, to] (incluses)
  function occurrencesInRange(task, state, from, to) {
    var occ = [];
    var anchor = anchorOf(task, state);
    var interval = Math.max(1, task.intervalleJours);
    // 1re occurrence = anchor + interval (prochaine action à venir)
    var d = addDays(anchor, interval);
    // Avance jusqu'à entrer dans la fenêtre (borne de sécurité)
    var guard = 0;
    while (d < from && guard < 5000) { d = addDays(d, interval); guard++; }
    while (d <= to && guard < 5000) {
      occ.push(new Date(d));
      d = addDays(d, interval);
      guard++;
    }
    return occ;
  }

  /* ----------  Divers  ---------- */
  function escapeHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    TYPES: TYPES,
    loadData: loadData,
    getPlant: getPlant,
    today: today, addDays: addDays, toISO: toISO, fromISO: fromISO,
    daysBetween: daysBetween, sameDay: sameDay,
    MOIS: MOIS, MOIS_LONG: MOIS_LONG, frLong: frLong,
    loadState: loadState, saveState: saveState, markDone: markDone,
    computeNextDue: computeNextDue, enrichTasks: enrichTasks,
    occurrencesInRange: occurrencesInRange,
    escapeHTML: escapeHTML
  };
})();
