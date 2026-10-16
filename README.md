# NelsonCorp Dashboards

Launch page for the investment team's dashboards, plus the shared navigation strip the
dashboards use to link to each other.

Live at: https://nelsoncorpwealth.github.io/Dashboards/

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | The launch page. Standard NelsonCorp dashboard header, one card per dashboard. |
| `dashboards.json` | **The single source of truth.** The list of dashboards, their names, descriptions and URLs. Both the launch page and the nav strip read this file. |
| `nav.js` | The shared nav strip. Each dashboard includes it with one `<script>` tag; it reads `dashboards.json` and draws the strip under the dashboard's title bar. |

## Adding, renaming or moving a dashboard

Edit `dashboards.json` only. Nothing else needs to change, on this repo or on any dashboard.

```json
{
  "id": "model-scorecard",
  "name": "Model Scorecard",
  "short": "Scorecard",
  "category": "Investment Management",
  "description": "One or two plain sentences on what the page shows.",
  "cadence": "Updated weekly",
  "url": "https://nelsoncorpwealth.github.io/Model-Scorecard/"
}
```

Field notes:

- `name` is the card title on the launch page; `short` is the label in the nav strip (keep it to one or two words).
- `category` is the small uppercase label above the card title. Use the same wording as the dashboard's own header sub-label (Portfolio Analytics, Risk Model Analytics, Investment Management, and so on).
- `cadence` is free text. If it contains the word "live" the card shows a green dot.
- Add `"hidden": true` to keep an entry in the file but off the page (useful while a dashboard is still being built).
- Cards appear in the order listed.

If a dashboard's URL changes, update `url` here and every page is correct on its next load.

## Putting the nav strip on a dashboard

Add this one line just before `</body>` in the dashboard's `index.html`:

```html
<script src="https://nelsoncorpwealth.github.io/Dashboards/nav.js" defer></script>
```

That is the only change a dashboard ever needs. The strip inserts itself directly after the
page's `.title-bar` element (or after `.hdr` if there is no title bar), highlights the current
page, and links back to the launch page. It does not touch the 72px header or the 59px title bar.

If `dashboards.json` can't be reached for any reason, the strip simply doesn't appear and the
dashboard is unaffected.

## Publishing changes

Upload the edited file through the GitHub web UI (same as updating `data.json` on the other
repos). GitHub Pages republishes within a minute or two; a hard refresh (Ctrl+F5) clears the
browser cache if the old list is still showing.

## First-time setup

1. Create a public repo named `Dashboards` under NelsonCorpWealth.
2. Upload `index.html`, `dashboards.json`, `nav.js` and this `README.md`.
3. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)` → Save.
4. After a minute, https://nelsoncorpwealth.github.io/Dashboards/ is live.

If the repo is given a different name, change `hub.url` in `dashboards.json` and the script
`src` in each dashboard to match.
