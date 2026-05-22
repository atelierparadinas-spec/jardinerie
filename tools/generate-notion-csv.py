#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère notion-calendar.csv : UNE LIGNE PAR OCCURRENCE des soins sur ~6 mois.
À importer dans une base Notion, puis afficher dans Notion Calendar.
Colonnes : Tâche | Date | Plante | Type | Fréquence | Notes
"""
import csv, json, os
from datetime import date, datetime, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = {"arrosage":"💧","rempotage":"🪴","engrais":"🌿","surveillance":"🔎"}
LABELS = {"arrosage":"Arrosage","rempotage":"Rempotage","engrais":"Engrais","surveillance":"Surveillance"}

HORIZON = 182  # jours couverts (~6 mois)
anchor = date.today()
tasks = json.load(open(os.path.join(ROOT,"data","tasks.json"), encoding="utf-8"))["taches"]

rows = []
for t in tasks:
    interval = max(1, int(t["intervalleJours"]))
    d = anchor + timedelta(days=interval)
    end = anchor + timedelta(days=HORIZON)
    # toujours inclure au moins la 1re occurrence (utile pour rempotage longue durée)
    first = True
    while d <= end or first:
        rows.append({
            "Tâche": (ICONS.get(t["type"],"") + " " + t["titre"]).strip(),
            "Date": d.isoformat(),
            "Plante": t.get("plante",""),
            "Type": LABELS.get(t["type"],"Entretien"),
            "Fréquence": t.get("frequence",""),
            "Notes": t.get("notes",""),
        })
        d = d + timedelta(days=interval)
        first = False
        if d > end:
            break

rows.sort(key=lambda r: (r["Date"], r["Plante"]))
out = os.path.join(ROOT, "notion-calendar.csv")
with open(out, "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["Tâche","Date","Plante","Type","Fréquence","Notes"])
    w.writeheader()
    w.writerows(rows)
print("✓ %d occurrences écrites dans notion-calendar.csv (horizon %d j)" % (len(rows), HORIZON))
# petit récap
from collections import Counter
c = Counter(r["Type"] for r in rows)
print("  par type :", dict(c))
print("  1res lignes :")
for r in rows[:4]:
    print("   ", r["Date"], "|", r["Tâche"])
