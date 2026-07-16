# Cursor — extracted design style

Reference design language for **Cursor** (cursor.com), from
**[Refero Styles](https://styles.refero.design/style/4e3b4717-84c8-4599-baaf-a343c3d619b6)** —
*"Warm parchment atelier lit by embers."* Kept here as a reusable style source for `sk-design` work.

## Files

| File | What it is |
|------|-----------|
| `DESIGN.md` | The genuine Refero **Extended** DESIGN.md tab — north star, color tokens + roles, typography (with substitutes/OpenType features), type scale, spacing/geometry, elevation, do/don't, layout, components, agent prompt guide. |
| `css-variables.css` | The genuine **Extended** CSS Variables tab (`:root {}` custom properties). |
| `tailwind-v4.css` | The genuine **Extended** Tailwind v4 tab (`@theme {}` block). |
| `design-tokens.json` | The genuine **Extended** Design Tokens tab (structured tokens: color, font, typography, spacing, radius, shadow, surface, `$extensions`). |
| `compact/` | The **Compact** variant of each of the four tabs, as published on the same page. |
| `cursor-canonical.json` | Raw structured extraction from the page's embedded data (colors with oklch/usage stats, contrast pairs, spacing histogram, typography steps, components, dos/donts). Supplementary provenance. |

## Provenance

The four tab artifacts are the page's own rendered exports, captured verbatim from
styles.refero.design (the tabs are client-rendered, so they were captured from a live
browser render — Chrome DevTools MCP via Code Mode — with the Extended toggle active).
Note: the Refero MCP style API carries a *different* Cursor style record
("Warm ivory software studio", other token names); this folder is specifically the
styles.refero.design "atelier" reference the operator selected.

## Notes on fidelity

- **Theme is light.** Warm cream canvas (`--color-parchment #f7f7f4`), warm near-black ink
  (`--color-ink #26251e`), single ember-orange text accent (`--color-ember #f54e00`) —
  never pure `#fff`/`#000`.
- **Fonts.** CursorGothic / EB Garamond / berkeleyMono are custom/licensed; the token stacks
  carry system-safe substitutes, so consumers without the webfonts still render in the
  intended voice.
- **Geometry.** 4px radius is the workhorse; flat surfaces, hairline borders, soft *warm*
  shadows — no gradients, no cool shadow tints, no pill shapes.
