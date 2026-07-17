# create-diff — example report gallery (scratch)

Scratch, regenerable example output from the `create-diff` engine, produced by running
the manual-testing-playbook scenarios against the input pairs in `inputs/`. Open any file
in `reports/` in a browser (offline) to see a real self-contained diff report. Every report
here passes `validate_report.py` (exit 0). Not a canonical spec artifact — safe to delete
and regenerate.

## How these were generated

From the packet root `.opencode/skills/sk-doc/create-diff/`, with `SOURCE_DATE_EPOCH` fixed
for byte-reproducibility:

```bash
python3 scripts/create_diff.py compare-pair \
  --before <inputs/…-before.…> --after <inputs/…-after.…> \
  [--view side-by-side] --report <reports/….html>
python3 scripts/validate_report.py <reports/….html>
```

## Reports

| # | Report | Format / tier | View | Change summary | Demonstrates |
|---|--------|---------------|------|----------------|--------------|
| 01 | `reports/01-onboarding-unified.html` | markdown / full | unified | +4 −0 ~5, 11 unchanged | The canonical Markdown before/after review (CMP-001): additions, in-place rewordings, inline word highlights. |
| 02 | `reports/02-onboarding-side-by-side.html` | markdown / full | side-by-side | +4 −0 ~5, 11 unchanged | The same diff in the two-column, scoped-scroll, keyboard-operable side-by-side view. |
| 03 | `reports/03-api-html-visible-text.html` | html / text | unified | +2 −0 ~2, 9 unchanged | HTML visible-text comparison (CMP-004): `<script>`/`<style>` content is dropped and a fidelity warning states only visible text was compared. |
| 04 | `reports/04-release-notes-text.html` | text / full | unified | +1 −0 ~2, 6 unchanged | Plain-text full-fidelity diff after Unicode/EOL/trailing-whitespace normalization. |
| 05 | `reports/05-xss-cheatsheet-escaped.html` | markdown / full | unified | +5 −0 ~0, 10 unchanged | Hostile-content escaping (SAFE-002): a document whose text *contains* `<script>`/`onerror`/`<svg onload>` payloads renders them as inert, escaped text — 0 live `<script>` tags in the report. |
| 06 | `reports/06-feed-ruleset-review.html` | markdown / full | unified | +4 −2 ~5, 754 unchanged | Real 42KB document at scale: collapsed-context accounting plus heading-aware section bands and `@@ … · §`-labeled hunks. |
| 07 | `reports/07-feed-weighted-ranking.html` | markdown / full | side-by-side | +4 −2 ~4, 532 unchanged | The same section-aware navigation in the two-column view. |
| 08 | `reports/08-feed-functions.html` | markdown / full | unified | +4 −2 ~7, 762 unchanged | Multiple changed sections in one long document — each hunk names the section it falls in. |

## Design: Cursor light mode + document sections

Reports render in the Cursor "warm parchment" language (light mode only): parchment
canvas, bone/linen/stone surfaces, ink text, ember focus accent, 4px geometry, and the
CursorGothic/berkeleyMono substitute font stacks (tokens in
`.opencode/skills/sk-design/styles/cursor/`). Markdown diffs are additionally divided by
the document's own outline: the nearest heading above each change surfaces as a bold
section band (even out of a collapsed run), and every change-hunk header names its
section (`@@ … @@ · § <heading>`). Headings in fully-unchanged territory stay collapsed.

## Fluid-responsive layout

Every report in this gallery carries the always-on fluid-responsive layer: the report's
type scale and section rhythm flex to the width of the content column via container queries
(`container-type:inline-size` on `<main>`, `cqi`-driven `clamp()` tokens `--fs-0`/`--fs-code`/
`--rhythm`/`--measure`, plus two `@container report` refinements). It keys off the content
column rather than the OS viewport, so a report reads correctly whether it is opened full-screen
or in a narrow docked IDE preview pane. To see it, open a report and drag the window/pane
narrower and wider — headings, body text, and inter-section spacing scale smoothly, while the
structural caps and the light/dark contrast tokens stay fixed. Each token's maximum endpoint
equals the prior fixed size, so a comfortable-width report is visually identical to before; the
layer only improves the narrow-pane tier.

## Inputs

`inputs/` holds the before/after source pairs. `onboarding-*.md` are copies of the shipped
fixtures (`create-diff/assets/fixtures/`); the rest are small illustrative documents authored
for this gallery. Source files are never modified by the engine.
