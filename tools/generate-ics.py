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

    stamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Jardinerie//Entretien des plantes//FR",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Jardinerie — Entretien des plantes",
        "NAME:Jardinerie — Entretien des plantes",
        "X-WR-TIMEZONE:Europe/Paris",
        "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
        "X-PUBLISHED-TTL:PT12H",
        "COLOR:120,154,123",
    ]

    for t in tasks:
        interval = max(1, int(t["intervalleJours"]))
        first = anchor + timedelta(days=interval)         # 1re échéance à venir
        end = first + timedelta(days=1)                   # all-day = +1 jour (exclusif)
        icon = ICONS.get(t["type"], "")
        summary = (icon + " " + t["titre"]).strip()
        desc = t.get("plante", "") + " · " + t.get("frequence", "")
        if t.get("notes"):
            desc += "\n" + t["notes"]
        desc += "\n— Carnet Jardinerie"

        ev = [
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
        lines.extend(ev)

    lines.append("END:VCALENDAR")

    content = "\r\n".join(fold(l) for l in lines) + "\r\n"
    with open(args.out, "w", encoding="utf-8", newline="") as f:
        f.write(content)

    print("✓ %d événements récurrents écrits dans %s" % (len(tasks), args.out))
    print("  Ancrage : %s (1re occurrence = ancrage + intervalle)" % anchor.isoformat())


if __name__ == "__main__":
    main()
