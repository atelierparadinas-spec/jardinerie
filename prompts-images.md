# 🎨 Prompts de génération d'images — Jardinerie

Objectif : 6 visuels **homogènes** (même pot, même table, même fond blanc, même
lumière), un par plante. Génère-les sur ta plateforme habituelle (Midjourney,
DALL·E, Firefly, Ideogram…), puis dépose chaque image dans
`assets/images/` **sous le nom exact indiqué** (la page les affiche
automatiquement ; en attendant, une illustration de secours s'affiche).

> Astuce homogénéité : garde **le même style / la même seed** d'une image à
> l'autre si ton outil le permet, et réutilise mot pour mot le « BLOC STYLE »
> ci-dessous en ne changeant que la description de la plante. Format conseillé :
> **carré (1:1)** ou **4:3**, paysage.

---

## 🧱 BLOC STYLE (à coller au début de CHAQUE prompt — ne pas modifier)

```
Studio product photo of a single houseplant in a pot, centered.
THE SAME POT IN EVERY IMAGE: a matte cream / off-white stoneware planter,
rounded and slightly tapered, about 18 cm tall, subtle sandy texture, no pattern.
The pot sits on a smooth pale oak wooden tabletop.
Pure seamless solid white background (#ffffff).
Soft natural daylight coming from the left, gentle soft shadow under the pot.
Eye-level camera, very slightly above, centered composition, generous clean
negative space around the plant. Photorealistic, sharp focus, high detail,
minimalist premium plant-shop aesthetic, warm and calm mood.
No text, no logo, no people, no extra objects, no second plant.
--- PLANT: 
```

Puis, juste après `--- PLANT:`, colle la description correspondante ci-dessous.

---

## 1. Peperomia grimpant — `assets/images/peperomia.jpg`

```
a trailing/climbing Peperomia scandens (cupid peperomia): glossy semi-succulent
ovate pointed leaves arranged in opposite pairs along thin reddish-purple stems,
gently trained upward on a few slim bamboo stakes to form a small leafy column.
Fresh medium-green foliage. Vining, slightly cascading habit.
```

## 2. Sansevieria (Langue de belle-mère) — `assets/images/sansevieria.jpg`

```
a Sansevieria / Dracaena trifasciata (snake plant), GREEN form: tall, upright,
stiff sword-shaped leaves, dark green with light grey-green horizontal mottled
banding, NO yellow edges. Vertical architectural silhouette.
```

## 3. Clivia miniata — `assets/images/clivia.jpg`

```
a Clivia miniata: a flat fan of thick, strap-shaped, arching dark green leaves
rising in two ranks from the base, with a central cluster of bright orange
trumpet-shaped flowers. Glossy healthy foliage.
```

## 4. Clusia rosea « Princess » — `assets/images/clusia.jpg`

```
a Clusia rosea 'Princess' (autograph tree): compact upright shrub with very
thick, leathery, paddle-shaped (obovate) glossy dark-green leaves held on stout
green stems. Dense, rounded, lush silhouette.
```

## 5. Coffea arabica (Caféier) — `assets/images/coffea.jpg`

```
a Coffea arabica coffee plant: bushy young plant with several slender stems and
glossy deep-green elliptic leaves that have slightly wavy edges and prominent
sunken veins. Lush, full foliage.
```

## 6. Dracaena marginata (Dragonnier) — `assets/images/dracaena.jpg`

```
a Dracaena marginata (Madagascar dragon tree): slender woody canes topped with
tufts of thin, arching, narrow green leaves edged with a fine reddish-pink line.
Tall, airy, graphic spiky silhouette.
```

---

## Où déposer les fichiers

```
jardinerie/assets/images/
├── peperomia.jpg
├── sansevieria.jpg
├── clivia.jpg
├── clusia.jpg
├── coffea.jpg
└── dracaena.jpg
```

Garde l'extension `.jpg` (ou modifie le champ `photo` de la plante dans
`data/plants.json` puis régénère `data/db.js` — voir le README). Recommandé :
images carrées, ~1000×1000 px, < 400 Ko chacune pour un chargement rapide.
