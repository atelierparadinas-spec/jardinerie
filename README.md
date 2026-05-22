# 🪴 Jardinerie

Carnet d'entretien local pour mes plantes d'intérieur : fiches détaillées,
calendrier de soins calculé automatiquement et export vers Notion.

Aucune installation, aucune dépendance, aucun compte. **Tout fonctionne en
local** — il suffit d'ouvrir `index.html`.

---

## Démarrage rapide

Double-cliquez simplement sur **`index.html`** : la page s'ouvre dans votre
navigateur et tout fonctionne immédiatement (plantes, calendrier, export).

> **Pourquoi ça marche en double-clic ?**
> Les navigateurs bloquent la lecture de fichiers `.json` locaux via `fetch()`
> (politique CORS du protocole `file://`). Pour contourner ça proprement, les
> données sont aussi embarquées dans `data/db.js` (chargé par une balise
> `<script>`). L'application essaie d'abord `fetch()` des JSON, puis bascule
> automatiquement sur `db.js`. Vous avez donc le meilleur des deux mondes.

Si vous préférez servir le projet (optionnel, pour le mode `fetch` natif) :

```bash
cd jardinerie
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

---

## Structure du projet

```
jardinerie/
├── index.html              ← page principale (à ouvrir)
├── plante.html             ← fiche dédiée par plante (?id=…), cible des QR
├── calendrier.html         ← calendrier mensuel live (arrosage, rempotage…)
├── presentation-mobile.html ← maquette iPhone pour présentation
├── README.md               ← ce fichier
├── prompts-images.md       ← prompts pour générer les 6 visuels homogènes
├── notion-template.csv     ← CSV prêt à importer dans Notion
├── tools/generate-qr.py    ← génère les QR (un par plante)
├── assets/
│   ├── css/style.css        ← design « jardinerie premium »
│   ├── js/app.js            ← logique de la page principale
│   ├── js/core.js           ← module commun (données, dates) de plante/calendrier
│   ├── images/              ← VOS photos des plantes (.jpg)
│   └── qr/                  ← QR codes générés (un .png par plante)
└── data/
    ├── plants.json          ← fiches plantes (source de vérité)
    ├── tasks.json           ← tâches d'entretien (source de vérité)
    └── db.js                ← copie embarquée des JSON (mode file://)
```

---

## Fonctionnalités

- **Fiches plantes** : nom commun, nom latin, photo, description, lumière,
  arrosage, humidité, température, rempotage, engrais, symptômes à surveiller,
  niveau de difficulté et prochaine action.
- **Calendrier d'entretien** : les prochaines dates sont calculées
  automatiquement à partir de la date du jour et de la fréquence de chaque
  tâche.
- **Filtres** par type d'action : arrosage, rempotage, engrais, surveillance.
- **Bouton « Fait »** : marque une tâche comme réalisée, mémorise la date
  (dans le navigateur) et **recalcule la prochaine échéance**.
- **Export CSV** et **Export Notion** : génère un fichier prêt à importer.

Les plantes incluses : Peperomia scandens (peperomia cœur), Sansevieria /
*Dracaena trifasciata*, *Clivia miniata*, *Clusia rosea* « Princess »,
*Coffea arabica* (caféier) et *Dracaena marginata*.

---

## Intégration Notion

### 1. Créer la base de données

Dans Notion : **+ New page → Table → New database**. Créez ces colonnes
(propriétés) **avec exactement ces noms** pour que l'import se fasse tout seul :

| Colonne     | Type Notion        | Détail                                              |
|-------------|--------------------|-----------------------------------------------------|
| **Tâche**   | `Title`            | Intitulé de l'action (ex. « Arroser le Caféier »)   |
| **Plante**  | `Text` ou `Select` | Nom de la plante concernée                          |
| **Type**    | `Select`           | Arrosage · Rempotage · Engrais · Surveillance       |
| **Date**    | `Date`             | Prochaine échéance (format AAAA-MM-JJ)              |
| **Fréquence** | `Text`           | Rythme d'entretien (ex. « Tous les 7 à 10 jours »)  |
| **Statut**  | `Select`           | À faire · Fait (ou En retard, etc.)                 |
| **Notes**   | `Text`             | Conseils et rappels                                 |

### 2. Importer le CSV

1. Ouvrez votre base, cliquez sur le menu **`•••`** (en haut à droite) →
   **Merge with CSV** (ou, à la création, **Import → CSV**).
2. Sélectionnez le fichier **`notion-template.csv`** fourni à la racine du
   projet.
3. Notion fait correspondre automatiquement les colonnes grâce aux en-têtes
   identiques. Vérifiez que **Date** est bien reconnu comme propriété `Date`.

> Astuce : pour un suivi vivant, ajoutez ensuite une **vue Calendrier** sur la
> propriété `Date`, et une **vue par Type** (groupement sur `Type`).

### 3. Réexporter depuis l'application

À tout moment, le bouton **« Exporter pour Notion »** régénère un
`notion-template.csv` avec les **dates recalculées** selon vos validations
« Fait ». Réimportez-le (Merge with CSV) pour mettre la base à jour.

---

## Personnaliser / faire évoluer

- **Modifier les données** : éditez `data/plants.json` et `data/tasks.json`
  (ce sont les sources de vérité), puis régénérez `data/db.js` :

  ```bash
  cd jardinerie/data
  node -e 'const fs=require("fs");const p=require("./plants.json");const t=require("./tasks.json");fs.writeFileSync("db.js","window.JARDINERIE_DB = {\n  plants: "+JSON.stringify(p,null,2).split("\n").join("\n  ")+",\n  tasks: "+JSON.stringify(t,null,2).split("\n").join("\n  ")+"\n};\n");'
  ```

  *(Sans Node : recopiez simplement le contenu des deux JSON dans `db.js`,
  sous la forme `window.JARDINERIE_DB = { plants: {...}, tasks: {...} };`.)*

- **Ajouter une plante** : ajoutez un objet dans `plants.json` (mêmes champs)
  et ses tâches dans `tasks.json` (`intervalleJours` = nombre de jours entre
  deux occurrences, qui sert au calcul des dates).

- **Remplacer une photo** : déposez votre image dans `assets/images/` et
  mettez à jour le champ `photo` de la plante. Si une image manque, une jolie
  illustration SVG s'affiche automatiquement à la place.

---

## Notes techniques

- **Calcul des dates** : `prochaine date = (dernière date « Fait » ou
  aujourd'hui) + intervalleJours`. L'`intervalleJours` correspond au point
  médian de la fourchette indiquée (ex. 7–10 jours → 9 jours).
- **Mémoire des validations** : stockée dans le `localStorage` du navigateur
  (propre à chaque appareil/navigateur). Aucune donnée n'est envoyée en ligne.
- **Photos** : le dossier `assets/images/` accueille **vos propres images**
  (`peperomia.jpg`, `sansevieria.jpg`, `clivia.jpg`, `clusia.jpg`, `coffea.jpg`,
  `dracaena.jpg`). Tant qu'une image est absente, une **illustration SVG de
  secours** s'affiche automatiquement. Pour générer des visuels homogènes
  (même pot, fond blanc, posé sur une table), voir **`prompts-images.md`**.

## QR codes (un par plante)

Chaque carte affiche un **QR code** qui, scanné avec un téléphone, ouvre la
**page dédiée** de la plante (`plante.html`) : photo, lumière, arrosage,
rempotage, symptômes et tâches à venir. Le QR encode :

```
<URL_DU_SITE_HÉBERGÉ>/plante.html?id=<id-de-la-plante>
```

Pages du site :
- `index.html` — vue d'ensemble (cartes + tâches + export Notion).
- `plante.html?id=<id>` — fiche complète d'une plante (cible des QR).
- `calendrier.html` — calendrier mensuel **live** des soins, recalculé
  automatiquement et partagé avec les boutons « Fait ».

> ⚠️ Un QR ne peut pas pointer vers un fichier local (`file://`) : pour qu'il
> fonctionne au scan, le site doit être **hébergé en ligne** (URL publique).

### Publier le site (au choix)

- **GitHub Pages** : crée un dépôt, pousse le dossier `jardinerie/`, active
  Pages → URL du type `https://<utilisateur>.github.io/jardinerie/`.
- **Netlify Drop** (sans compte, instantané) : va sur app.netlify.com/drop et
  glisse-dépose le dossier `jardinerie/` → tu obtiens une URL immédiate.

### Générer les QR codes

```bash
pip install segno            # une seule fois
python3 tools/generate-qr.py "https://VOTRE-URL/"
```

Cela crée `assets/qr/<id-plante>.png` pour les 6 plantes. Recharge le site :
les QR apparaissent sur chaque carte. Si `assets/qr/` est vide, le bloc QR est
simplement masqué (aucune image cassée).

## Calendrier dans Notion Calendar / Google / Apple (abonnement .ics)

Le fichier **`jardinerie.ics`** est un flux calendrier standard : un événement
**récurrent** par tâche (arroser tous les X jours, rempoter, engrais…). On s'y
**abonne une fois** et il se met à jour tout seul.

Sur la page `calendrier.html`, le bouton **« S'abonner au calendrier »** ouvre
l'app calendrier par défaut ; **« Télécharger le .ics »** récupère le fichier.

**Notion Calendar** affiche les agendas Google/Apple connectés, donc :

1. **Google Agenda** (ordinateur) → *Autres agendas* **+** → *À partir de l'URL*
   → colle `https://atelierparadinas-spec.github.io/jardinerie/jardinerie.ics`
   → *Ajouter*. Puis dans **Notion Calendar**, connecte ce compte Google :
   l'agenda « Jardinerie » apparaît.
2. **Apple / iPhone** : Réglages → Calendrier → Comptes → Ajouter un compte →
   *Autre* → *Ajouter un calendrier avec abonnement* → colle la même adresse.

Régénérer le flux (après modification des fréquences) :

```bash
python3 tools/generate-ics.py        # crée/maj jardinerie.ics à la racine
```

## Identification des plantes

Les fiches ont été vérifiées à partir des photos réelles. À noter : la plante
grimpante à feuilles ovales et tiges rougeâtres est un **Peperomia grimpant**
(genre *Peperomia*, type « Cupid », *Peperomia scandens*) — et **non** un Hoya :
feuilles opposées semi-charnues à 3–5 nervures courbes et tiges rouges
caractéristiques du genre. Confirmation possible à la floraison (épi fin en
« queue de rat » = Peperomia ; ombelles d'étoiles cireuses = Hoya).

---

*Projet local généré pour un usage personnel — bon jardinage ! 🌿*
