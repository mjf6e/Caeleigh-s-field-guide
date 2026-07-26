# Caeleigh's Florida Keys Field Guide 🐠🦈🐚

A searchable species directory covering every shark, fish, shell, and reef
invertebrate from the trip — styled after a clean staff-directory layout
(sticky search, category chips, expandable result rows) rather than flashcards.

## What's inside
- `index.html` – page shell + sticky header/nav
- `styles.css` – the navy + coral "field directory" look
- `data.js` – the full species database (~146 creatures)
- `script.js` – hash-router (`#/`, `#/directory`, `#/spotted`, `#/resources`), search, and category filtering
- `images/` – optional, for real photos (see below)

## Pages
- **Home** — hero search bar, stats strip, and category tiles (Sharks / Fish & Rays / Shells / Invertebrates)
- **Directory** — the full searchable list with category filter chips; results expand inline with size, description, and reef role
- **Spotted On Our Trip** — just the species from real specimens/photos taken on the trip
- **Resources** — how to add photos and publish the site

## Adding real photos
Every card falls back to a colorful icon if there's no photo. To add real ones:
1. Save a photo as `.jpg` named to match a species' `id` in `data.js` (e.g. `images/nurse-shark.jpg`).
2. Drop it in the `images/` folder.
3. Add an `<img src="images/${s.id}.jpg">` inside the `result-icon` div in `script.js`'s `resultCard()` function (with an `onerror` fallback to the emoji), or ask Claude to wire this up for you.

Good public-domain sources for reference species: Wikimedia Commons, NOAA's
photo library, Florida Fish and Wildlife's public galleries.

## Publishing for free with GitHub Pages
1. Create a new repository on [github.com](https://github.com).
2. Upload all files in this folder (keep the folder structure).
3. Go to **Settings → Pages** → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — GitHub gives you a live link within a minute or two.

## Editing species
Open `data.js`. Each entry looks like:

```js
{id:"nurse-shark", cat:"sharks", name:"Nurse Shark", size:"9–14 ft", spotted:true,
  desc:"...",
  role:"..."},
```
- `cat` must be `sharks`, `fish`, `shells`, or `other` (controls color).
- `spotted:true` shows the "we found this" badge on the Directory and adds it to the Spotted page.
