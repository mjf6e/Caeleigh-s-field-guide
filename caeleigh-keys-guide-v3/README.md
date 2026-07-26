# Caeleigh's Florida Keys Field Guide 🐠🦈🐚

A flip-card learning site covering every shark, fish, shell, and reef invertebrate
from the trip — plus their role in the Florida Keys reef ecosystem. Built as a
plain HTML/CSS/JS site so it can go straight up on **GitHub Pages** for free.

## What's inside
- `index.html` – the page structure
- `styles.css` – the "laminated dive-shop ID card" look
- `data.js` – the full species database (~140 creatures: name, size, description, ecosystem role)
- `script.js` – search, category tabs, card-flip, and "Quiz Me" study mode
- `images/` – put photos here (see below)

## Adding real photos (recommended)
Right now every card falls back to a colorful icon if no photo is found — the site
works perfectly without any images. To add real photos:

1. Find or take a photo of the species (your own trip photos work great for the
   ones marked **"We found this!"** — nurse shark, Caribbean reef shark, spider crab,
   hawksbill turtle, sea cucumber, etc. For the rest, good public-domain sources are
   [Wikimedia Commons](https://commons.wikimedia.org), NOAA's photo library, or
   Florida Fish and Wildlife's public photo galleries.)
2. Save the image as a `.jpg` and name it to match the creature's `id` in `data.js`
   (e.g. the Nurse Shark card looks for `images/nurse-shark.jpg`).
3. Drop it into the `images/` folder. Refresh the page — done, no code changes needed.

Every `id` is the first field of each entry in `data.js`, so you can search that
file to find the exact filename any card expects.

## Publishing it for free with GitHub Pages
1. Create a new repository on [github.com](https://github.com) (e.g. `caeleigh-keys-guide`).
2. Upload all the files in this folder (keep the folder structure, especially `images/`).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save. GitHub will give you a live link like `https://yourusername.github.io/caeleigh-keys-guide/` within a minute or two.

No build tools, servers, or accounts beyond GitHub itself are required.

## Using the site
- **Search bar** — filter by name.
- **Category tabs** — Sharks, Fish & Rays, Shells, or Invertebrates.
- **Tap a card** to flip it and read the description and its role in the reef ecosystem.
- **Quiz Me** — shuffles through one card at a time as a self-quiz; use *Next Card*
  to advance and *Reshuffle* to mix the order again.
- Cards marked **🏝️ We found this!** are species from actual specimens/photos
  encountered on the trip, rather than reference-only species.

## Editing or adding species
Open `data.js` in any text editor. Each entry looks like this:

```js
{id:"nurse-shark", cat:"sharks", name:"Nurse Shark", size:"9–14 ft", spotted:true,
  desc:"...",
  role:"..."},
```

- `cat` must be one of: `sharks`, `fish`, `shells`, `other` (this controls the tab color).
- `spotted:true` adds the "We found this!" badge — remove it (or set to `false`) for
  reference-only entries.
- Just copy an existing block, edit the text, and give it a new unique `id`.
