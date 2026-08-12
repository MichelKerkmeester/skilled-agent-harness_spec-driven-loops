---
title: "Export guidance"
description: "Manual, diagram-only export of a generated diagram HTML file to a portable .svg and/or .png beside it, following references/import-export/export.md."
trigger_phrases:
  - "Export guidance"
  - "export diagram to png"
  - "export diagram to svg"
  - "rasterize diagram"
  - "manual export never automatic"
version: 1.0.0.0
---

# Export guidance

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Manual, diagram-only export of a generated diagram HTML file to a portable `.svg` and/or `.png` beside it, following `references/import-export/export.md`.

When asked to export, save, rasterize, or convert a generated diagram to `.png` or `.svg`, the agent loads `references/import-export/export.md` and follows the procedure there. Export is manual — never run unprompted — and it never modifies the source HTML. The caller is an operator who wants a diagram for a slide, social card, print, or further editing, and the main failure modes are missing a Playwright install for PNG and asking for a full-page screenshot rather than the diagram.

---

## 2. HOW IT WORKS

### Scope

Both formats are diagram-only: the deliverable is just the `<svg>` node, and editorial wrappers (header, summary cards, footer in the full variants) are dropped by design. The SVG-only export keeps the source `<title>` and `<desc>` with their per-diagram and per-variant prefixed IDs, which is what makes multiple exported SVGs safe to inline in one page. If the user asks for a screenshot of the whole page including the cards, that is a different request handled by a normal full-page screenshot, not by this feature.

### SVG export

The SVG procedure reads the source HTML, extracts the first `<svg>...</svg>` block, and makes it standalone: the opening tag gets `xmlns`, the existing `viewBox` is preserved (warned about if absent), `role="img"`, `aria-labelledby`, and the first-child `<title>`/`<desc>` are preserved exactly as authored, and a Google Fonts `@import` is injected so typography renders in a browser — merged into an existing `<defs>` rather than adding a second one. The file gets an XML declaration and is written as `<basename>.svg` next to the source, honouring an explicit output path when provided.

### PNG export

PNG export renders the original HTML (not the extracted SVG) and screenshots only the `<svg>` element's bounding box, with a transparent background (`omit_background=True`). It requires Playwright: the agent verifies the import first, and if it is missing, surfaces the exact `pip install playwright` / `playwright install chromium` instruction and stops — it never auto-installs. The default `device_scale_factor` is 2, with 1 for compact assets and 3 for print/retina use.

### Sizing

The PNG's pixel dimensions are the SVG's `viewBox` × `device_scale_factor`, so the size decision was already made when the diagram was drawn. For an exact target, the scale is computed as `target_width / viewBox_width` (fractional values are allowed), but it is never scaled below 1 (that soft-focuses the type) and never past 4 (that upscales a layout designed for a smaller canvas). If the target aspect ratio does not match the `viewBox`, the agent says so and offers a redraw at the matching preset instead of padding or cropping.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/import-export/export.md` | Shared | The manual-only trigger, diagram-only scope, SVG procedure, Playwright-gated PNG procedure, and sizing rules |
| `references/foundations/output-spec.md` | Shared | The size presets whose `viewBox` the export multiplies by the device scale factor |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/import-export/export-guidance.md` | Manual playbook | Scenario IMP-003 verifies manual-only PNG/SVG export, the prefixed accessible title/desc, the transparent PNG, and a byte-unchanged source HTML (PNG step requires a local Playwright install, otherwise a documented SKIP) |
| `references/import-export/export.md` | Reference | Anchor for the export procedure and the never-modifies-source invariant |

---

## 4. SOURCE METADATA

- Group: IMPORT AND EXPORT
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `import-export/export-guidance.md`

Related references:
- [drawio-import.md](drawio-import.md) — the import flow whose format dial can ask for a PNG/SVG export
- [mermaid-import.md](mermaid-import.md) — the parallel import flow that also delegates export to this feature
