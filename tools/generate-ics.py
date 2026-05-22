#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère un flux calendrier 'jardinerie.ics' à partir de data/tasks.json.

Chaque tâche d'entretien devient un événement RÉCURRENT (toute la journée),
qui se répète tous les `intervalleJours` jours :
    💧 Arroser le Caféier      → tous les 6 jours
    🪴 Rempoter la Sansevieria → tous les 912 jours
    etc.

Le fichier .ics produit est un standard universel : on peut s'y ABONNER depuis
Google Agenda, Apple Calendrier ou iCloud — et donc le voir dans Notion Calendar
(qui affiche les agendas Google/Apple connectés).

Utilisation :
    python3 tools/generate-ics.py
    python3 tools/generate-ics.py --out jardinerie.ics --start 2026-05-22
"""

import argparse
import json
import os
from datetime import date, datetime, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ICONS = {"arrosage": "💧", "rempotage": "🪴", "engrais": "🌿", "surveillance": "🔎"}
LABELS = {"arrosage": "Arrosage", "rempotage": "Rempotage", "engrais": "Engrais", "surveillance": "Surveillance"}


def esc(text):
    """Échappe une valeur texte ICS (RFC 5545)."""
    return (str(text).replace("\\", "\\\\")
            .replace(";", "\\;")
            .replace(",", "\\,")
            .replace("\n", "\\n"))


def fold(line):
    """Plie les lignes à 75 octets max (continuation = espace en début)."""
    raw = line.encode("utf-8")
    if len(raw) <= 75:
        return line
    out, cur = [], b""
    for ch in line:
        b = ch.encode("utf-8")
        if len(cur) + len(b) > 73:        # marge pour le CRLF + espace
            out.append(cur.decode("utf-8"))
            cur = b
        else:
            cur += b
    out.append(cur.decode("utf-8"))
    return "\r\n ".join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(ROOT, "jardinerie.ics"))
    ap.add_argument("--data", default=os.path.join(ROOT, "data", "tasks.json"))
    ap.add_argument("--start", default=date.today().isoformat(),
                    help="Date d'ancrage AAAA-MM-JJ (défaut : aujourd'hui)")
    args = ap.parse_args()

    anchor = datetime.strptime(args.start, "%Y-%m-%d").date()
    with open(args.data, encoding="utf-8") as f:
        tasks = json.load(f)["taches"]
    # noms des plantes (pour nommer les calendriers par plante)
    plants_path = os.path.join(ROOT, "data", "plants.json")
    names = {}
    if os.path.exists(plants_path):
        for p in json.load(open(plants_path, encoding="utf-8"))["plantes"]:
            names[p["id"]] = p["nomCommun"]

    stamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

    def build_calendar(subset, calname):
        lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Jardinerie//Entretien des plantes//FR",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "X-WR-CALNAME:" + calname,
            "NAME:" + calname,
            "X-WR-TIMEZONE:Europe/Paris",
            "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
            "X-PUBLISHED-TTL:PT12H",
            "COLOR:120,154,123",
        ]
        for t in subset:
            interval = max(1, int(t["intervalleJours"]))
            first = anchor + timedelta(days=interval)     # 1re échéance à venir
            end = first + timedelta(days=1)               # all-day = +1 jour (exclusif)
            summary = (ICONS.get(t["type"], "") + " " + t["titre"]).strip()
            desc = t.get("plante", "") + " · " + t.get("frequence", "")
            if t.get("notes"):
                desc += "\n" + t["notes"]
            desc += "\n— Carnet Jardinerie"
            lines += [
                "BEGIN:VEVENT",
                "UID:" + t["id"] + "@jardinerie",
                "DTSTAMP:" + stamp,
                "SUMMARY:" + esc(summary),
                "DTSTART;VALUE=DATE:" + first.strftime("%Y%m%d"),
                "DTEND;VALUE=DATE:" + end.strftime("%Y%m%d"),
                "RRULE:FREQ=DAILY;INTERVAL=" + str(interval),
                "DESCRIPTION:" + esc(desc),
                "CATEGORIES:" + LABELS.get(t["type"], "Entretien"),
                "TRANSP:TRANSPARENT",
                "END:VEVENT",
            ]
        lines.append("END:VCALENDAR")
        return "\r\n".join(fold(l) for l in lines) + "\r\n"

    # 1) Calendrier complet (toutes les plantes)
    with open(args.out, "w", encoding="utf-8", newline="") as f:
        f.write(build_calendar(tasks, "Jardinerie — Entretien des plantes"))
    print("✓ %d événements -> %s" % (len(tasks), args.out))

    # 2) Un calendrier par plante -> assets/ics/<id>.ics
    per_dir = os.path.join(ROOT, "assets", "ics")
    os.makedirs(per_dir, exist_ok=True)
    by_plant = {}
    for t in tasks:
        by_plant.setdefault(t["plantId"], []).append(t)
    for pid, subset in by_plant.items():
        calname = "Jardinerie — " + names.get(pid, subset[0].get("plante", pid))
        path = os.path.join(per_dir, pid + ".ics")
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(build_calendar(subset, calname))
        print("  ✓ %-26s %d soins -> assets/ics/%s.ics" % (names.get(pid, pid), len(subset), pid))

    print("  Ancrage : %s (1re occurrence = ancrage + intervalle)" % anchor.isoformat())


if __name__ == "__main__":
    main()
