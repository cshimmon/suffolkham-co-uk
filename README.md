# SuffolkHam.co.uk

A free amateur radio resource for Suffolk and East Anglia. Repeaters, nets, events, guides, tools and links — all in one place.

Built and maintained by [M9XCN](https://www.qrz.com/db/M9XCN).

---

## Structure

Static HTML site — no build step, no framework. Everything is plain HTML, CSS and vanilla JavaScript.

| File / Folder | Purpose |
|---|---|
| `index.html` | Homepage |
| `repeaters.html` | Repeater listing (rendered from `repeaters.json`) |
| `nets.html` | Local nets (rendered from `nets.json`) |
| `events.html` | Upcoming events (rendered from `events.json`) |
| `calculators.html` | Offset, antenna and ERP calculators |
| `glossary.html` | Amateur radio glossary |
| `getting-started.html` | Beginner guide |
| `dmr.html` | DMR guide |
| `meshcore.html` | MeshCore / LoRa mesh guide |
| `equipment.html` | Equipment guide |
| `locator.html` | Maidenhead QTH locator tool |
| `about.html` | About the site |
| `style.css` | Site-wide styles (CSS custom properties for theming) |
| `nav.js` | Navigation bar, theme toggle, QRZ callsign search modal |
| `nav.json` | Navigation link data consumed by `nav.js` |

## Data files

Content that changes regularly is kept in JSON so it can be updated without touching HTML.

| File | Contains |
|---|---|
| `repeaters.json` | All repeater data — frequencies, CTCSS, status, keeper |
| `nets.json` | Net schedules — frequency/repeater, mode, day, run by |
| `events.json` | Upcoming events — date, location, what3words, organiser |
| `rsgb-news.json` | RSGB Region 9 news feed (auto-updated daily) |

## Automation

A GitHub Actions workflow (`.github/workflows/update-news.yml`) runs daily at 07:00 UTC, fetches the RSGB Region 9 RSS feed, and commits any changes to `rsgb-news.json`. This keeps the news section on the homepage current without manual intervention.

## Updating content

**Repeaters** — edit `repeaters.json`. Each entry includes callsign, mode, frequencies, CTCSS/colour code, status, location, group and keeper.

**Nets** — edit `nets.json`. Each entry includes a `day` field used by the day-filter on the nets page.

**Events** — edit `events.json`. Supports `endDate` for multi-day events, `dayLabel` for non-contiguous dates (e.g. `"12 & 14"`), `endTime`, `what3words`, and `organiser`.

## Theming

Light and dark mode are handled via CSS custom properties in `style.css`. The theme toggle in the nav switches a `data-theme` attribute on `<html>`. The SVG logo uses `currentColor` so it adapts automatically.

## Contributing

Corrections, updates and suggestions welcome. Get in touch via [QRZ (M9XCN)](https://www.qrz.com/db/M9XCN).
