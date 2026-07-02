# Team photos

Headshots for the three hosts, served by `src/pages/team.astro`.

- **Filename = the member `id`** from `team.astro`: `timothy`, `jonathan`, `johnson`.
- **Format:** square (1:1) JPG, ≥800px per side. LinkedIn "download photo" gives a clean square.
- **Served at:** `/team/<id>.jpg` (everything in `public/` is served from the site root).

Expected files:

- `timothy.jpg` — Timothy Pan
- `jonathan.jpg` — Jonathan Hsiao
- `johnson.jpg` — Johnson Wang

> Note: `team.astro` currently renders initials, not photos. Displaying these files
> needs a small edit to `team.astro` (swap the initials block for an `<img>`, switch
> the card frame to 1:1). Tracked in the project plan.
