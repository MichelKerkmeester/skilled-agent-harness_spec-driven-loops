---
title: "IMP-003 -- Export guidance"
description: "This scenario validates PNG/SVG export for `IMP-003`. It focuses on manual-only, diagram-only export via references/export.md, the Playwright PNG path, and an unchanged source HTML."
version: 1.0.0.0
---

# IMP-003 -- Export guidance

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `IMP-003`.

---

## 1. OVERVIEW

This scenario validates PNG/SVG export for `IMP-003`. It focuses on manual-only, diagram-only export via `references/export.md`, the Playwright PNG path, and an unchanged source HTML.

### Why This Matters

Export is deliberately manual and deliberately narrow: it must never run unprompted, and it must deliver the diagram only — the `<svg>` node, never the editorial wrapper. The SVG path must stay a faithful standalone copy (kept `role="img"`, prefixed `<title>`/`<desc>`, merged font `@import`), and the PNG path must render the original HTML and screenshot the SVG bounding box with a transparent background so the asset drops onto any slide or document. Two common failures are importing a diagram HTML that still depends on the page, and silently mutating or auto-exporting the source. This scenario locks both the procedure and the "never unprompted" discipline.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `IMP-003` and confirm the expected signals without contradictory evidence.

- Objective: verify PNG/SVG export is manual-only, diagram-only, follows `references/export.md`, and leaves the source HTML byte-unchanged
- Real user request: `Give me a PNG of that architecture diagram for the slide deck.`
- Prompt: `Export docs/checkout-architecture.html to PNG for a slide deck (scale 2) and also save it as SVG. Follow the export procedure: extract the first svg node for SVG, render the original HTML and screenshot the svg bounding box for PNG with a transparent background. Don't modify the source HTML. Save the outputs next to the source.`
- Expected execution process: the agent reads `references/export.md`, verifies Playwright availability before the PNG step, extracts the first `<svg>` block into a standalone `.svg` (preserving `role="img"`, `aria-labelledby`, prefixed `<title>`/`<desc>`, adding `xmlns`/`viewBox` if missing, merging the font `@import` into the existing `<defs>`), then renders the original HTML and screenshots the SVG bounding box at scale 2 with a transparent background.
- Expected signals: the SVG keeps the prefixed accessibility names and merges rather than duplicates the `<defs>`; the PNG is transparent at `viewBox × device_scale_factor`; the source HTML checksum is unchanged; no export files appear unless the user asked.
- Desired user-visible outcome: a `.svg` and a transparent `.png` beside the source, with the source untouched and no auto-export elsewhere.
- Pass/fail: PASS if both outputs are produced from the source HTML, the SVG preserves the accessibility contract and merges the font `@import`, the PNG is transparent at the requested scale, and the source is byte-unchanged; FAIL if the source is modified, an export runs unprompted, the SVG is not standalone, or the PNG is not diagram-only.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Export docs/checkout-architecture.html to PNG for a slide deck (scale 2) and also save it as SVG. Follow the export procedure: extract the first svg node for SVG, render the original HTML and screenshot the svg bounding box for PNG with a transparent background. Don't modify the source HTML. Save the outputs next to the source.`

### Commands

1. `bash: shasum docs/checkout-architecture.html` (capture the before-checksum)
2. `bash: python -c "import playwright"` (verify availability; if the import fails, surface the exact install instruction and stop)
3. `agent: Read references/export.md`
4. `agent: Extract the first <svg>...</svg> block from docs/checkout-architecture.html; ensure xmlns and viewBox; preserve role="img" and the prefixed <title>/<desc>; merge the Google Fonts @import into the existing <defs>; prepend the XML declaration; write docs/checkout-architecture.svg`
5. `bash: python /tmp/rasterize.py docs/checkout-architecture.html docs/checkout-architecture.png 2` (the rasterize snippet from references/export.md, screenshotting `svg` first with `omit_background=True`)
6. `bash: shasum docs/checkout-architecture.html` (capture the after-checksum; must match the before value)

### Expected

Step 2 either confirms Playwright or blocks with the surfaced `pip install playwright` + `playwright install chromium` instruction — never auto-installs. Step 4 writes a well-formed standalone SVG with the accessibility names intact and a single `<defs>` containing the merged font `@import`. Step 5 writes `docs/checkout-architecture.png` at `1280×720 viewBox × 2 = 2560×1440` with a transparent background. Step 6 shows identical checksums, proving the source was never modified.

### Evidence

Capture the before/after checksums, the Playwright detection result (or the surfaced install instruction for a `SKIP`), the generated `.svg` head (XML declaration, `xmlns`, merged `@import` inside one `<defs>`), the `.png` dimensions and transparency check, and the output paths.

### Pass / Fail

- **Pass**: both outputs exist beside the source, the SVG preserves the accessibility contract with a merged font import, the PNG is transparent and diagram-only, and the source checksum is unchanged.
- **Fail**: the source HTML was modified, an export ran unprompted, the SVG is not standalone (external refs or duplicated `<defs>`), or the PNG includes the editorial wrapper.
- **SKIP**: only when a named runtime blocker prevents execution — e.g. the Playwright Python package is missing from the operator environment; the `pip install playwright` + `playwright install chromium` instruction must be surfaced and the PNG step skipped, never auto-installed.

### Failure Triage

1. Confirm the source file is a generated diagram from a current template — it must contain the Google Fonts `<link>` in `<head>` and a single `<svg>`; the gallery (`assets/index.html`) must be refused, not exported.
2. If the SVG shows duplicate `<defs>` or the font import missing, re-extract the first `<svg>` block and merge the `<style>` into the existing `<defs>` rather than adding a second one.
3. If the PNG is not transparent, re-run step 5 with `omit_background=True` and confirm the screenshot targets the `svg` locator, not the whole page.

### Optional Supplemental Checks

Confirm the never-unprompted rule: generate a fresh diagram HTML and verify no `.svg`/`.png` appears next to it until the user explicitly requests an export.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/import-export/export-guidance.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `references/export.md` | SVG and PNG export procedures, edge cases, sizing |
| `references/output-spec.md` | Size presets and `viewBox` → pixel mapping |
| `SKILL.md` (HOW IT WORKS — Output) | Manual-only export rule |

---

## 5. SOURCE METADATA

- Group: IMPORT AND EXPORT
- Playbook ID: IMP-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `import-export/export-guidance.md`
