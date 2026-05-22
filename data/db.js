/* =====================================================================
 * db.js — Données embarquées (généré depuis plants.json + tasks.json)
 * Permet le fonctionnement en DOUBLE-CLIC (file://). Source de vérité :
 * data/plants.json et data/tasks.json.
 * ===================================================================== */
window.JARDINERIE_DB = {
  plants: {
    "meta": {
      "projet": "Jardinerie",
      "version": "1.0.0",
      "description": "Fiches d'entretien des plantes d'intérieur. Les images sont stockées en local dans assets/images/ (photos libres de droit Unsplash).",
      "miseAJour": "2026-05-21"
    },
    "plantes": [
      {
        "id": "peperomia-scandens",
        "nomCommun": "Peperomia grimpant (Cupid)",
        "nomLatin": "Peperomia scandens",
        "famille": "Piperaceae",
        "photo": "assets/images/peperomia.jpg",
        "creditPhoto": "Photo personnelle (à fournir)",
        "description": "Peperomia grimpant aux feuilles ovales et pointues, semi-charnues, portées par paires sur des tiges rouge-pourpre. Plante-liane facile, palissée ici sur tuteurs ; elle stocke l'eau dans ses feuilles et tiges, ce qui la rend tolérante aux oublis d'arrosage.",
        "lumiere": "Lumière vive à moyenne, indirecte. Pas de soleil direct brûlant ; s'étiole (tiges allongées) si trop sombre.",
        "arrosage": "Tous les 7 à 10 jours. Laisser sécher le premier centimètre de terre. Semi-succulente : mieux vaut un peu trop sec que trop humide.",
        "humidite": "Modérée (40–60 %). Apprécie un brumisage léger en été.",
        "temperature": "18–24 °C. À garder au-dessus de 12 °C, sensible au froid.",
        "rempotage": "Tous les 12 à 18 mois, au printemps, dans un substrat léger et drainant.",
        "engrais": "Engrais plantes vertes dilué tous les 15 jours au printemps et en été. Aucun apport en hiver.",
        "symptomes": [
          "Feuilles molles et translucides : excès d'arrosage / pourriture des tiges",
          "Tiges qui s'allongent et feuilles espacées : manque de lumière",
          "Bords secs et croustillants : air trop sec ou sous-arrosage"
        ],
        "difficulte": "Facile",
        "prochaineAction": "Vérifier l'humidité du substrat et arroser si la surface est sèche ; guider les nouvelles tiges sur le tuteur.",
        "noteIdentification": "Identifié d'après photo : feuilles opposées, semi-charnues, 3–5 nervures courbes, tiges rouge-pourpre grimpantes — caractéristiques du genre Peperomia (grimpant, type Cupid). À confirmer par la floraison : épi fin en « queue de rat » = Peperomia ; étoiles cireuses = Hoya."
      },
      {
        "id": "sansevieria-trifasciata",
        "nomCommun": "Langue de belle-mère",
        "nomLatin": "Dracaena trifasciata (syn. Sansevieria trifasciata)",
        "famille": "Asparagaceae",
        "photo": "assets/images/sansevieria.jpg",
        "creditPhoto": "Photo personnelle (à fournir)",
        "description": "Plante graphique aux feuilles dressées et rigides, vert foncé marbré (forme verte, sans liseré jaune), quasi increvable. Excellente dépolluante et parfaite pour les débutants ou les intérieurs lumineux comme sombres.",
        "lumiere": "S'adapte de la pleine lumière à l'ombre. Croissance plus rapide en lumière vive indirecte.",
        "arrosage": "Tous les 14 à 21 jours. Laisser sécher complètement la terre. En hiver, espacer encore davantage (1 fois/mois).",
        "humidite": "Faible. Aucune exigence particulière, supporte l'air sec.",
        "temperature": "18–27 °C. À ne pas descendre sous 10 °C.",
        "rempotage": "Tous les 2 à 3 ans seulement, quand les racines déforment le pot. Substrat type cactées/succulentes.",
        "engrais": "Engrais cactées dilué toutes les 8 semaines au printemps et en été uniquement.",
        "symptomes": [
          "Base molle et brunâtre : pourriture due à un excès d'eau",
          "Feuilles qui se plient ou se couchent : manque de lumière ou pot trop arrosé",
          "Taches brunes sèches : coup de soleil direct"
        ],
        "difficulte": "Très facile",
        "prochaineAction": "Contrôler que la terre est totalement sèche avant le prochain arrosage."
      },
      {
        "id": "clivia-miniata",
        "nomCommun": "Clivia",
        "nomLatin": "Clivia miniata",
        "famille": "Amaryllidaceae",
        "photo": "assets/images/clivia.jpg",
        "creditPhoto": "Photo personnelle (à fournir)",
        "description": "Plante à feuillage en éventail de lanières épaisses et persistantes, offrant une spectaculaire floraison orange en fin d'hiver. Demande un repos hivernal au frais pour refleurir. Sur ta plante, plusieurs pointes/bords de feuilles sont bruns : à surveiller (voir conseils ci-dessous).",
        "lumiere": "Lumière vive indirecte. Éviter le soleil direct brûlant qui marque les feuilles.",
        "arrosage": "Tous les 7 à 14 jours en période de croissance. Réduire fortement en hiver (repos au frais et au sec pour induire la floraison).",
        "humidite": "Modérée (40–50 %).",
        "temperature": "18–24 °C en croissance ; 10–12 °C pendant le repos hivernal (6 à 8 semaines).",
        "rempotage": "Tous les 3 à 4 ans seulement : le Clivia fleurit mieux à l'étroit. Rempoter après la floraison.",
        "engrais": "Engrais plantes fleuries toutes les 2 semaines du printemps à la fin de l'été. Stopper pendant le repos.",
        "symptomes": [
          "Absence de floraison : pas de repos hivernal au frais",
          "Feuilles jaunissantes : excès d'eau ou racines à l'étroit depuis trop longtemps",
          "Pointes et bords bruns (visibles sur ta plante) : eau trop calcaire/dure, air trop sec ou coup de soleil. Arroser à l'eau douce, éloigner du soleil direct, et couper les parties sèches au ciseau propre en suivant la forme de la feuille."
        ],
        "difficulte": "Moyenne",
        "prochaineAction": "Selon la saison : arroser en croissance, ou maintenir au sec et au frais si repos hivernal."
      },
      {
        "id": "clusia-rosea-princess",
        "nomCommun": "Arbre autographe « Princess »",
        "nomLatin": "Clusia rosea 'Princess'",
        "famille": "Clusiaceae",
        "photo": "assets/images/clusia.jpg",
        "creditPhoto": "Photo personnelle (à fournir)",
        "description": "Arbuste compact aux feuilles épaisses, coriaces et en spatule, vert profond. Robuste et tolérant, il garde une silhouette dense en intérieur lumineux.",
        "lumiere": "Lumière vive indirecte, voire un peu de soleil doux. Reste compact en bonne lumière.",
        "arrosage": "Tous les 7 à 10 jours. Laisser sécher les 2 premiers centimètres entre deux arrosages.",
        "humidite": "Moyenne à élevée (50–70 %). Apprécie un environnement un peu humide.",
        "temperature": "18–26 °C. Sensible au froid sous 13 °C.",
        "rempotage": "Tous les 2 ans, au printemps, dans un substrat drainant et riche.",
        "engrais": "Engrais plantes vertes dilué une fois par mois au printemps et en été.",
        "symptomes": [
          "Feuilles qui tombent : courant d'air froid ou variation brutale d'arrosage",
          "Taches noires sur les feuilles : excès d'eau / mauvais drainage",
          "Feuilles ternes : manque de lumière"
        ],
        "difficulte": "Facile",
        "prochaineAction": "Tester le substrat à 2 cm de profondeur et arroser s'il est sec."
      },
      {
        "id": "coffea-arabica",
        "nomCommun": "Caféier",
        "nomLatin": "Coffea arabica",
        "famille": "Rubiaceae",
        "photo": "assets/images/coffea.jpg",
        "creditPhoto": "Photo personnelle (à fournir)",
        "description": "Le véritable caféier d'ornement, au feuillage vert profond, luisant et joliment nervuré, en touffe de plusieurs tiges. Exige une bonne hygrométrie ; peut produire fleurs blanches parfumées puis cerises après quelques années.",
        "lumiere": "Lumière vive indirecte, abondante. Pas de soleil direct prolongé qui brûle le feuillage.",
        "arrosage": "Tous les 5 à 7 jours. Garder le substrat légèrement humide sans détremper. Sensible au dessèchement.",
        "humidite": "Élevée (60 % et plus). Brumiser régulièrement ou poser sur un lit de billes d'argile humides.",
        "temperature": "20–25 °C. À maintenir au-dessus de 15 °C, redoute les courants d'air.",
        "rempotage": "Tous les 12 à 18 mois au printemps, dans un substrat riche, légèrement acide et drainant.",
        "engrais": "Engrais plantes vertes dilué tous les 15 à 21 jours au printemps et en été.",
        "symptomes": [
          "Bords des feuilles bruns et secs : air trop sec ou manque d'eau",
          "Feuilles jaunes : excès d'arrosage ou carence en fer",
          "Feuilles qui s'enroulent : exposition trop chaude ou trop sèche"
        ],
        "difficulte": "Moyenne à exigeante",
        "prochaineAction": "Vérifier l'humidité de l'air et du substrat ; brumiser si l'atmosphère est sèche."
      },
      {
        "id": "dracaena-marginata",
        "nomCommun": "Dragonnier de Madagascar",
        "nomLatin": "Dracaena marginata",
        "famille": "Asparagaceae",
        "photo": "assets/images/dracaena.jpg",
        "creditPhoto": "Photo personnelle (à fournir)",
        "description": "Plante-arbre au port élancé : fines feuilles vertes arquées réunies en touffes au sommet de cannes ligneuses. Très tolérante, elle structure un intérieur avec sa silhouette graphique.",
        "lumiere": "Lumière vive indirecte. Tolère la mi-ombre, mais le feuillage se densifie en bonne lumière.",
        "arrosage": "Tous les 10 à 14 jours. Laisser sécher la moitié du pot entre deux arrosages. Sensible à l'excès d'eau.",
        "humidite": "Modérée (40–50 %). Un brumisage occasionnel limite les pointes sèches.",
        "temperature": "18–24 °C. À garder au-dessus de 13 °C.",
        "rempotage": "Tous les 2 à 3 ans, au printemps. Privilégier un pot un peu lourd pour la stabilité.",
        "engrais": "Engrais plantes vertes dilué une fois par mois au printemps et en été.",
        "symptomes": [
          "Pointes des feuilles brunes : eau trop calcaire/fluorée ou air trop sec",
          "Feuilles jaunes du bas : normal si renouvellement lent, sinon excès d'eau",
          "Tiges molles à la base : pourriture racinaire"
        ],
        "difficulte": "Facile",
        "prochaineAction": "Contrôler le séchage du substrat ; utiliser de l'eau non calcaire si possible."
      }
    ]
  },
  tasks: {
    "meta": {
      "projet": "Jardinerie",
      "version": "1.0.0",
      "description": "Tâches d'entretien par plante. 'intervalleJours' sert au calcul automatique de la prochaine date (point médian de la fréquence). 'freqMinJours'/'freqMaxJours' donnent la fourchette réelle.",
      "dateBase": "2026-05-21",
      "types": [
        "arrosage",
        "rempotage",
        "engrais",
        "surveillance"
      ]
    },
    "taches": [
      {
        "id": "peperomia-arrosage",
        "plantId": "peperomia-scandens",
        "plante": "Peperomia grimpant",
        "type": "arrosage",
        "titre": "Arroser le Peperomia",
        "frequence": "Tous les 7 à 10 jours",
        "freqMinJours": 7,
        "freqMaxJours": 10,
        "intervalleJours": 9,
        "notes": "Laisser sécher le 1er cm de terre. Craint l'excès d'eau."
      },
      {
        "id": "peperomia-rempotage",
        "plantId": "peperomia-scandens",
        "plante": "Peperomia grimpant",
        "type": "rempotage",
        "titre": "Rempoter le Peperomia",
        "frequence": "Tous les 12 à 18 mois",
        "freqMinJours": 365,
        "freqMaxJours": 548,
        "intervalleJours": 456,
        "notes": "Au printemps, substrat léger et drainant."
      },
      {
        "id": "peperomia-engrais",
        "plantId": "peperomia-scandens",
        "plante": "Peperomia grimpant",
        "type": "engrais",
        "titre": "Engrais Peperomia",
        "frequence": "Tous les 15 jours (printemps-été)",
        "freqMinJours": 15,
        "freqMaxJours": 15,
        "intervalleJours": 15,
        "notes": "Engrais plantes vertes dilué. Stop en hiver."
      },
      {
        "id": "peperomia-surveillance",
        "plantId": "peperomia-scandens",
        "plante": "Peperomia grimpant",
        "type": "surveillance",
        "titre": "Contrôler le Peperomia",
        "frequence": "Contrôle mensuel",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Feuilles molles = trop d'eau ; tiges allongées = manque de lumière."
      },
      {
        "id": "sansevieria-arrosage",
        "plantId": "sansevieria-trifasciata",
        "plante": "Langue de belle-mère",
        "type": "arrosage",
        "titre": "Arroser la Sansevieria",
        "frequence": "Tous les 14 à 21 jours",
        "freqMinJours": 14,
        "freqMaxJours": 21,
        "intervalleJours": 18,
        "notes": "Laisser sécher complètement. 1 fois/mois en hiver."
      },
      {
        "id": "sansevieria-rempotage",
        "plantId": "sansevieria-trifasciata",
        "plante": "Langue de belle-mère",
        "type": "rempotage",
        "titre": "Rempoter la Sansevieria",
        "frequence": "Tous les 2 à 3 ans",
        "freqMinJours": 730,
        "freqMaxJours": 1095,
        "intervalleJours": 912,
        "notes": "Quand les racines déforment le pot. Substrat cactées."
      },
      {
        "id": "sansevieria-engrais",
        "plantId": "sansevieria-trifasciata",
        "plante": "Langue de belle-mère",
        "type": "engrais",
        "titre": "Engrais Sansevieria",
        "frequence": "Toutes les 8 semaines (printemps-été)",
        "freqMinJours": 56,
        "freqMaxJours": 56,
        "intervalleJours": 56,
        "notes": "Engrais cactées dilué. Aucun apport hors saison."
      },
      {
        "id": "sansevieria-surveillance",
        "plantId": "sansevieria-trifasciata",
        "plante": "Langue de belle-mère",
        "type": "surveillance",
        "titre": "Contrôler la Sansevieria",
        "frequence": "Contrôle mensuel",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Base molle = pourriture ; feuilles couchées = manque de lumière."
      },
      {
        "id": "clivia-arrosage",
        "plantId": "clivia-miniata",
        "plante": "Clivia",
        "type": "arrosage",
        "titre": "Arroser le Clivia",
        "frequence": "Tous les 7 à 14 jours (croissance)",
        "freqMinJours": 7,
        "freqMaxJours": 14,
        "intervalleJours": 11,
        "notes": "Réduire fortement en hiver pour le repos / la floraison."
      },
      {
        "id": "clivia-rempotage",
        "plantId": "clivia-miniata",
        "plante": "Clivia",
        "type": "rempotage",
        "titre": "Rempoter le Clivia",
        "frequence": "Tous les 3 à 4 ans",
        "freqMinJours": 1095,
        "freqMaxJours": 1460,
        "intervalleJours": 1278,
        "notes": "Fleurit mieux à l'étroit. Rempoter après floraison."
      },
      {
        "id": "clivia-engrais",
        "plantId": "clivia-miniata",
        "plante": "Clivia",
        "type": "engrais",
        "titre": "Engrais Clivia",
        "frequence": "Toutes les 2 semaines (printemps-été)",
        "freqMinJours": 14,
        "freqMaxJours": 14,
        "intervalleJours": 14,
        "notes": "Engrais plantes fleuries. Stop pendant le repos hivernal."
      },
      {
        "id": "clivia-surveillance",
        "plantId": "clivia-miniata",
        "plante": "Clivia",
        "type": "surveillance",
        "titre": "Contrôler le Clivia",
        "frequence": "Contrôle mensuel",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Penser au repos hivernal au frais (10–12 °C) pour refleurir."
      },
      {
        "id": "clusia-arrosage",
        "plantId": "clusia-rosea-princess",
        "plante": "Clusia « Princess »",
        "type": "arrosage",
        "titre": "Arroser le Clusia",
        "frequence": "Tous les 7 à 10 jours",
        "freqMinJours": 7,
        "freqMaxJours": 10,
        "intervalleJours": 9,
        "notes": "Laisser sécher les 2 premiers centimètres."
      },
      {
        "id": "clusia-rempotage",
        "plantId": "clusia-rosea-princess",
        "plante": "Clusia « Princess »",
        "type": "rempotage",
        "titre": "Rempoter le Clusia",
        "frequence": "Tous les 2 ans",
        "freqMinJours": 730,
        "freqMaxJours": 730,
        "intervalleJours": 730,
        "notes": "Au printemps, substrat drainant et riche."
      },
      {
        "id": "clusia-engrais",
        "plantId": "clusia-rosea-princess",
        "plante": "Clusia « Princess »",
        "type": "engrais",
        "titre": "Engrais Clusia",
        "frequence": "Une fois par mois (printemps-été)",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Engrais plantes vertes dilué."
      },
      {
        "id": "clusia-surveillance",
        "plantId": "clusia-rosea-princess",
        "plante": "Clusia « Princess »",
        "type": "surveillance",
        "titre": "Contrôler le Clusia",
        "frequence": "Contrôle mensuel",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Taches noires = excès d'eau ; chute de feuilles = courant d'air froid."
      },
      {
        "id": "coffea-arrosage",
        "plantId": "coffea-arabica",
        "plante": "Caféier",
        "type": "arrosage",
        "titre": "Arroser le Caféier",
        "frequence": "Tous les 5 à 7 jours",
        "freqMinJours": 5,
        "freqMaxJours": 7,
        "intervalleJours": 6,
        "notes": "Garder le substrat légèrement humide. Sensible au dessèchement."
      },
      {
        "id": "coffea-rempotage",
        "plantId": "coffea-arabica",
        "plante": "Caféier",
        "type": "rempotage",
        "titre": "Rempoter le Caféier",
        "frequence": "Tous les 12 à 18 mois",
        "freqMinJours": 365,
        "freqMaxJours": 548,
        "intervalleJours": 456,
        "notes": "Au printemps, substrat riche, légèrement acide et drainant."
      },
      {
        "id": "coffea-engrais",
        "plantId": "coffea-arabica",
        "plante": "Caféier",
        "type": "engrais",
        "titre": "Engrais Caféier",
        "frequence": "Tous les 15 à 21 jours (printemps-été)",
        "freqMinJours": 15,
        "freqMaxJours": 21,
        "intervalleJours": 18,
        "notes": "Engrais plantes vertes dilué."
      },
      {
        "id": "coffea-surveillance",
        "plantId": "coffea-arabica",
        "plante": "Caféier",
        "type": "surveillance",
        "titre": "Contrôler le Caféier",
        "frequence": "Contrôle mensuel",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Surveiller l'hygrométrie et les acariens (air sec). Brumiser au besoin."
      },
      {
        "id": "dracaena-arrosage",
        "plantId": "dracaena-marginata",
        "plante": "Dragonnier",
        "type": "arrosage",
        "titre": "Arroser le Dragonnier",
        "frequence": "Tous les 10 à 14 jours",
        "freqMinJours": 10,
        "freqMaxJours": 14,
        "intervalleJours": 12,
        "notes": "Laisser sécher la moitié du pot. Eau non calcaire de préférence."
      },
      {
        "id": "dracaena-rempotage",
        "plantId": "dracaena-marginata",
        "plante": "Dragonnier",
        "type": "rempotage",
        "titre": "Rempoter le Dragonnier",
        "frequence": "Tous les 2 à 3 ans",
        "freqMinJours": 730,
        "freqMaxJours": 1095,
        "intervalleJours": 912,
        "notes": "Au printemps. Pot lourd pour la stabilité."
      },
      {
        "id": "dracaena-engrais",
        "plantId": "dracaena-marginata",
        "plante": "Dragonnier",
        "type": "engrais",
        "titre": "Engrais Dragonnier",
        "frequence": "Une fois par mois (printemps-été)",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Engrais plantes vertes dilué."
      },
      {
        "id": "dracaena-surveillance",
        "plantId": "dracaena-marginata",
        "plante": "Dragonnier",
        "type": "surveillance",
        "titre": "Contrôler le Dragonnier",
        "frequence": "Contrôle mensuel",
        "freqMinJours": 30,
        "freqMaxJours": 30,
        "intervalleJours": 30,
        "notes": "Pointes brunes = eau calcaire/fluorée ou air sec."
      }
    ]
  }
};
