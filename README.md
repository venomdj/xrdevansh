# Live Ranking Overlay System (Firebase-powered)

A clone of the flux-esports-automation style live ranking overlay: an OBS browser-source
that shows a real-time team ranking table (rank, alive, kills, total points), driven by
a Firebase Realtime Database and controlled from a simple admin panel — no page reload needed.

## Files

- `firebase-config.js` — your Firebase project config + shared DB helpers. **Edit this first.**
- `setup.html` — one-time setup: creates a tournament → round → match → set, and hands you
  the ready-to-use overlay + admin links (same `tid` / `rid` / `mid` / `setId` URL pattern as
  the reference site).
- `admin.html` — control panel used during the match. Bump alive/kills with +/- buttons,
  edit placement points, add/remove teams, set a match label.
- `live_ranking.html` — the OBS overlay itself. Transparent background, auto-sorts by
  total points (placement points + kills), highlights the #1 team, dims eliminated teams.
- `style.css` — shared design tokens for the admin/setup UI.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com → **Add project**.
2. Once created, go to **Build → Realtime Database → Create Database** (not Firestore —
   this system uses the Realtime Database specifically, same as the reference site).
3. Start it in **test mode** for setup (tighten rules before going live — see below).
4. Go to **Project settings → General → Your apps → Web app (</>)**, register an app,
   and copy the `firebaseConfig` object it gives you.

## 2. Configure

Open `firebase-config.js` and paste your real values into `firebaseConfig`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

`databaseURL` is required — double check it's present (it's sometimes not copied by default
from the console snippet).

## 3. Recommended security rules

Test mode is open to anyone. Before a live event, in **Realtime Database → Rules**, use
something like:

```json
{
  "rules": {
    "tournaments": {
      ".read": true,
      ".write": true
    }
  }
}
```

`.read: true` is what lets the OBS overlay work with zero auth (OBS can't log in). For
`.write`, if you want it locked down, add Firebase Auth to `admin.html` and switch the write
rule to `"auth != null"` — ask if you want this wired in.

## 4. Deploy (or run locally)

This is a static site — no build step. Options:
- Drag the folder into Vercel/Netlify (same hosting the reference site used).
- Or just open `setup.html` / `admin.html` / `live_ranking.html` directly as local files —
  Firebase works fine from `file://` too.

## 5. Usage flow

1. Open **setup.html** → create a Tournament → Round → Match → Set (fill in team count).
   You'll get back a ready-made overlay URL and admin URL, e.g.:
   `live_ranking.html?tid=xxx&rid=xxx&mid=xxx&setId=xxx`
2. Add that overlay URL as an **OBS Browser Source** (background is transparent — no
   need to key anything out). Recommended size: 460×(140 + 34×team count).
3. Open the matching **admin.html** URL on your scoring laptop/tablet during the match.
   Every +/- click or field edit pushes to Firebase and the overlay updates instantly —
   no refresh, no restart.
4. For the next match, just run **setup.html** step 3–4 again (same tid/rid, new mid/setId),
   or reuse a set by editing the same setId.

## Data model

```
tournaments/
  {tid}/
    name
    rounds/
      {rid}/
        name
        matches/
          {mid}/
            name
            sets/
              {setId}/
                meta/ { matchLabel }
                teams/
                  {teamKey}/ { name, alive, kills, placementPoints }
```

`total` shown on the overlay = `placementPoints + kills`, computed live, sorted descending
(ties broken by kills) — same convention as standard battle-royale esports scoring (BGMI/PUBG-style).

## Customizing the look

`live_ranking.html` is a single self-contained file — all styling is inline `<style>` at the
top. Colors, fonts, and row layout can be edited directly without touching the Firebase logic.
