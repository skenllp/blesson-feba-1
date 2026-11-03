# Blesson & Feba — Wedding Invitation

A static website (plain HTML, CSS and vanilla JavaScript — no build step). Upload the folder as-is to Vercel, Netlify or GitHub Pages.

```
index.html     page content
style.css      styling (palette + fonts unchanged from the original design)
script.js      calendar, countdown, opening animation, music   <-- CONFIG block at the top
ribbon.mp4     opening ribbon animation
poster.jpg     first frame of the ribbon (shown before the tap)
music.mp3      background music
og.jpg         WhatsApp / social preview image (1200 x 630)
img/           photographs and floral backgrounds
```

## 1. Add the opening photograph

Save your picture as **`img/opening-photo.jpg`** (replace the existing file). That is all.

* It appears on the invitation card, above the ribbon, in a thin gold frame, **before** the visitor taps "Open Invitation", and fades away as the ribbon opens.
* It keeps its natural proportions (never stretched). Landscape and portrait both work; extreme panoramas or tall strips are gently cropped.
* Any size works; about 1200 px on the long edge is plenty (keep it under ~300 KB).
* Until you replace it, the file is a 1×1 blank placeholder and the plain ribbon card is shown, exactly like the original design.

## 2. Couple portrait (currently hidden)

The portrait section under Events is commented out in `index.html`. To show it, remove the comment markers around it and replace **`img/couple-portrait.jpg`**. Best ratio is about 880 × 1024 px (portrait). It is currently a crop of the hands-on-Bible photo.

The hero photograph is `img/hero-blesson-feba.jpg`. To change it, replace the file (landscape 3:2 works best; keep the Bible and hands in the middle of the picture).

## 3. Ceremony time and countdown (`script.js`, top of the file)

The ceremony time has **not** been confirmed, so the countdown is currently **day-level** ("69 DAYS TO GO", counted on the Asia/Kolkata calendar). No hours/minutes/seconds are shown and no time appears anywhere on the site.

When the time is confirmed, set it in the `CONFIG` block:

```js
countdown: {
  date: '2027-01-11',
  time: '10:30'     // 24-hour clock, India time.  null = day-level countdown
}
```

The full Days / Hours / Minutes / Seconds countdown then switches on automatically. After the wedding day the countdown hides itself.

The same block controls the calendar. Each entry in `events` is a day of the month and its type (`'betrothal'` = gold, `'matrimony'` = rose). Weekdays are calculated from the date, so the grid and legend stay accurate. If you ever show event times on the cards, add them in `index.html` inside the two `ev-card` blocks (the `ev-time` style is already in the stylesheet).

## 4. Venue maps and directions

Each event card has **Open in Google Maps** and **Get Directions** buttons (there is no separate venues section or QR code any more). Exact venue pins were not supplied or verifiable, so both buttons use Google Maps links built from the venue name and address:

* Betrothal: `St. Gregorios Orthodox Church Parish Hall, Peringanadu, Adoor, Kerala`
* Wedding: `Landmark Convention Center, Valakom, Kottarakara, Kerala`

For a precise pin: open the venue in Google Maps, tap Share, copy the link, and use it as the `href` of the "Open in Google Maps" button in `index.html`.

## 5. Opening animation

`ribbon.mp4` is the 8-second clip of the ribbon untying and the card opening onto the hands-on-Bible photograph. `poster.jpg` is its first frame. The page fades into the invitation at `FINISH_AT` seconds (6.6, set near the top of `script.js`) once the card has fully opened. Music starts only after the visitor taps the invitation (browsers do not allow sound earlier) and can be toggled with the round button at the bottom right.

## 6. Deploying

* **Vercel / Netlify:** drag-and-drop the folder (or connect the repo). No build command; publish directory is the project root.
* **GitHub Pages:** push the files to a repository and enable Pages on the main branch.

Fonts (Cormorant Garamond, DM Sans) are bundled in `fonts/`, so the site works without any external requests.

**Sharing preview:** `og:url` and `og:image` point to https://blesson-feba-1.vercel.app/ . If WhatsApp shows an old preview, add `?v=2` to the link you share.
