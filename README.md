# 🎂 Birthday Website — Asset Placement Guide

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## 📁 Where to Place Your Assets

### Photos (36 total — 12 per diary)

Drop photos into these folders. Name them exactly `1.jpg` through `12.jpg`:

```
public/
  images/
    diary-1/          ← "My Little Paapa" (12 photos)
      1.jpg
      2.jpg
      ...
      12.jpg

    diary-2/          ← "Our Little World" (12 photos)
      1.jpg
      2.jpg
      ...
      12.jpg

    diary-3/          ← "A Mother's Love" (12 photos)
      1.jpg
      2.jpg
      ...
      12.jpg
```

Photos load in order 1 → 12. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

---

### Audio Files

```
public/
  audio/
    birthday-song.mp3       ← Background birthday song (plays from Home)
    special-surprise.mp3    ← Your personal recorded song (plays in Surprise section)
```

The players are already wired up. Just drop the files in.

---

### Album Art

```
public/
  album-art/
    surprise-placeholder.jpg   ← Replace with real album art for the surprise player
```

Recommended: square image, min 400×400px

---

## ✏️ Editing Content

All text, names, captions and messages are in one file:

```
src/data/birthdayContent.ts
```

Edit these fields:
- `name` — her name
- `hero.beforeBirthday` / `afterBirthday` — hero heading text
- `finalMessage` — the personal message below the music player
- `diaries[n].photos[i].caption` — individual photo captions
- `surprise.songTitle` / `artistName` — music player labels

---

## 🧪 Dev Mode (Testing)

In `src/data/birthdayContent.ts`:

```ts
DEV_MODE: true,
DEV_BIRTHDAY_UNLOCKED: true,   // set false to test countdown mode
```

Set `DEV_MODE: false` before deploying!

---

## 🚀 Production Build

```bash
npm run build
```

Files output to `dist/` — deploy that folder to any static host (Vercel, Netlify, GitHub Pages).
