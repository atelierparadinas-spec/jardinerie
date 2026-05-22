#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère un QR code par plante, pointant vers la fiche de la plante sur le site
hébergé en ligne.

Chaque QR encode :  <URL_DU_SITE>/plante.html?id=<id-de-la-plante>
Au scan, le téléphone ouvre la page dédiée de la plante (fiche complète :
lumière, arrosage, rempotage, symptômes, tâches à venir…).

Prérequis : pip install segno  (pur Python, aucune dépendance image)

Utilisation :
    python3 tools/generate-qr.py "https://mon-site.exemple"
    python3 tools/generate-qr.py "https://user.github.io/jardinerie/"

Options :
    --out DIR    Dossier de sortie (défaut : assets/qr)
    --data PATH  Chemin de plants.json (défaut : data/plants.json)
    --scale N    Taille des modules (défaut : 10)

Les fichiers produits : assets/qr/<id-plante>.png
(les mêmes ids sont utilisés comme ancres par le site et par les cartes.)
"""

import argparse
import json
import os
import sys

try:
    import segno
except ImportError:
    sys.exit(
        "Le module 'segno' est requis.\n"
        "Installe-le avec :  pip install segno   (ou: pip install segno --break-system-packages)"
    )

# Racine du projet = dossier parent de /tools
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def build_url(base, plant_id):
    """Construit l'URL de la page dédiée : <racine>/plante.html?id=<id>."""
    base = base.strip().rstrip("/")
    if not base:
        raise ValueError("URL de base vide.")
    # On veut la RACINE du site : si on nous donne un fichier .html, on l'enlève
    if base.lower().endswith(".html"):
        base = base.rsplit("/", 1)[0]
    return base + "/plante.html?id=" + plant_id


def main():
    ap = argparse.ArgumentParser(description="Génère les QR codes des plantes.")
    ap.add_argument("base_url", help="URL d'hébergement du site (ex. https://user.github.io/jardinerie/)")
    ap.add_argument("--out", default=os.path.join(ROOT, "assets", "qr"), help="Dossier de sortie")
    ap.add_argument("--data", default=os.path.join(ROOT, "data", "plants.json"), help="Chemin de plants.json")
    ap.add_argument("--scale", type=int, default=10, help="Taille des modules (px)")
    args = ap.parse_args()

    with open(args.data, encoding="utf-8") as f:
        plants = json.load(f)["plantes"]

    os.makedirs(args.out, exist_ok=True)

    print(f"Site : {args.base_url}")
    print(f"Sortie : {args.out}\n")
    for p in plants:
        url = build_url(args.base_url, p["id"])
        qr = segno.make(url, error="m")  # correction moyenne (~15 %), bon compromis
        path = os.path.join(args.out, p["id"] + ".png")
        qr.save(
            path,
            scale=args.scale,
            border=2,                 # zone de silence (quiet zone)
            dark="#2a2a26",           # quasi-noir, légère teinte chaude (reste très scannable)
            light="#ffffff",
        )
        print(f"  ✓ {p['nomCommun']:<28} → {os.path.basename(path)}   ({url})")

    print(f"\n{len(plants)} QR codes générés. Recharge le site : ils apparaissent sur chaque carte.")


if __name__ == "__main__":
    main()
