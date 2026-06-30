SKILL ROUTING: advisor surfaced `sk-prompt-models` for the named GLM-5.2 target. I’m keeping this read-only and using the GLM prompt-profile constraints only to shape the experiment design, not dispatching any model.I’m checking the local harness names before writing the plan so the “minimal harness changes” are copy-pasteable against the actual files rather than generic pseudocode.The harness already uses direct Z.AI vision API with thinking disabled, matching the GLM profile’s large vision-generation guidance. I’m reading the tile specs next to select a balanced, named sample from the actual concept/treatment matrix.I found the real 45-cell matrix and confirmed the high-risk cells include matrices, node/integration diagrams, branch flows, funnels, gauges/charts, and linear tables/lists/timelines. I’m now using the existing audit outputs only to align the metric definitions with how the run is already scored.The existing audit schema is simple enough for experiment scoring: per tile `score`, `verdict`, `overflow`, `readable`, `on_brand`, and `title_at_bottom`. I’m using the known baseline 27/45 SHIP and the audit score scale as-is rather than inventing a new judge.# A1 experiment design

## Arms

Use a paired, blocked A/B with one mechanism ablation. Primary comparison is `C0` vs `T2`; `T1` explains whether the gain comes from prompt structure alone.

| Arm | Name | Exact behavior |
| --- | --- | --- |
| `C0` | Control | Current `gen-tile.mjs` single-shot pipeline, same reference image, `temperature:0.4`, `max_tokens:24000`, `thinking:{type:"disabled"}`, no deterministic layout gate, no repair pass. |
| `T1` | A1 prompt-only | Same as control, but inserts `A1_SAFE_LINEAR_560_V2` before the current `LAYOUT` section. No render rejection and no remediation. |
| `T2` | A1 prompt + deterministic gate + one repair | Same as `T1`, then render-check geometry/contrast. If the gate fails, make exactly one GLM repair call using failure JSON + screenshot. No second repair. |

Important adaptation: the current harness asks for a `560×480` tile, not `480×480`. Do not change card size during the experiment. Use a `560×480` A1 geometry contract so the experiment isolates layout primitives, not a size change.

Run design:

| Setting | Value |
| --- | --- |
| Unit | One generated tile: concept × treatment × arm × replicate |
| Primary sample | All 45 cells from the 9 concept JSON files × 5 treatments |
| Replicates | `r1`, `r2`, `r3` per arm if budget allows |
| Pilot minimum | One replicate of all 45 cells for `C0`, `T1`, `T2` |
| Primary statistic | Paired tile-level delta, blocked by exact tile id |
| Existing 27/45 baseline | Calibration only; re-run `C0` for the primary comparison |

## Sample Tiles

Primary run: all 45 cells from:

| Concept spec | Treatments |
| --- | --- |
| `spec-accountbeheer.json` | `accountbeheer-1` through `accountbeheer-5` |
| `spec-oci.json` | `oci-1` through `oci-5` |
| `spec-goedkeuring.json` | `goedkeuringssysteem-1` through `goedkeuringssysteem-5` |
| `spec-orders-facturen.json` | `orders-facturen-1` through `orders-facturen-5` |
| `spec-prijzen-condities.json` | `prijzen-condities-1` through `prijzen-condities-5` |
| `spec-kwartaalcijfers.json` | `kwartaalcijfers-1` through `kwartaalcijfers-5` |
| `spec-favorieten.json` | `favorieten-1` through `favorieten-5` |
| `spec-een-factuur.json` | `een-factuur-1` through `een-factuur-5` |
| `spec-aangepast-assortiment.json` | `aangepast-assortiment-1` through `aangepast-assortiment-5` |

Mandatory diagnostic slices:

| Slice | Specific tiles |
| --- | --- |
| High-risk 2D / positioned diagrams | `accountbeheer-4 matrix`, `aangepast-assortiment-3 matrix`, `oci-2 round-trip flow`, `oci-4 node diagram`, `goedkeuringssysteem-4 branch diagram`, `een-factuur-4 many-to-one funnel`, `aangepast-assortiment-5 funnel`, `prijzen-condities-3 stepped ladder`, `kwartaalcijfers-4 donut/breakdown`, `favorieten-4 popover` |
| Linear-flow / list primitives | `accountbeheer-1 list`, `accountbeheer-5 timeline`, `oci-3 PO feed`, `goedkeuringssysteem-1 approval table`, `goedkeuringssysteem-2 vertical timeline`, `goedkeuringssysteem-3 approval card`, `orders-facturen-1 table`, `orders-facturen-2 timeline`, `orders-facturen-3 invoice list`, `prijzen-condities-1 price list`, `prijzen-condities-5 terms rows`, `een-factuur-5 invoice timeline` |

## Metrics

| Metric | Definition |
| --- | --- |
| `contrast_check.py` exit-0 rate | A tile passes if all extracted readable foreground/background pairs pass body AA via `contrast_check.py`, and dark-panel readable text avoids banned gray tokens. |
| MiniMax-M3 audit score | Same 0-100 audit rubric used for existing `audit-*.json`. Auditor sees screenshot/HTML only, with arm hidden. |
| SHIP rate | `verdict == "SHIP"` from MiniMax-M3 audit, and for `T2` the deterministic A1 gate must also pass after any repair. |
| Diagram-vs-linear score delta | Mean MiniMax score for linear slice minus mean score for 2D/diagram slice. Lower is better. Baseline defect is large because diagrams score roughly `35-58` while linear tiles score `86-94`. |
| Token cost | Prompt tokens + completion tokens per successful final tile. If API token usage is unavailable, record prompt bytes, completion bytes, and GLM call count. |
| Wall-clock cost | Fetch start to valid final HTML, including repair calls for `T2`. Record p50, p90, mean, and timeout/error count. |

## Expected Deltas

| Metric | Baseline | `T1` expected | `T2` expected | Rationale |
| --- | ---: | ---: | ---: | --- |
| SHIP rate | `27/45 = 60%` | `31-35/45 = 69-78%` | `34-37/45 = 76-82%` | Early spatial contract reduces omission from instruction density; primitive caps stop high-risk diagrams from becoming free-positioned mini maps. |
| MiniMax-M3 mean score | `81.1` current audit mean | `86-89` | `89-92` | Layout containment should lift low-scoring diagram outliers without materially changing already-good linear tiles. |
| 2D/diagram score | `35-58` worst band | `62-74` | `68-82` | Matrix, branch, node, and funnel tiles are forced into grid/flex/list primitives with capped item counts. |
| Linear-flow score | `86-94` typical | `86-94` | `86-94` | A1 should preserve linear/list success; a drop here means the contract is too restrictive. |
| Diagram-vs-linear delta | About `41 pts` | `25-30 pts` | `15-22 pts` | Mechanism target is specifically the layout-primitive gap. |
| Contrast exit-0 rate | Expect `~37/45` readable pass proxy | `40-43/45` | `43-45/45` | Dark-panel semantic tokens plus banned-gray gate directly target contrast failures. |
| Wall-clock cost | GLM profile observed avg `~26s` per call | `~1.0x-1.1x` | `~1.25x-1.45x` | Browser gate is cheap; extra model cost only occurs on failed first-pass tiles. |

## Decision Rule

Adopt `T2` if all are true:

| Gate | Adopt threshold |
| --- | --- |
| SHIP lift | At least `+12pp` absolute over re-run `C0`, and paired bootstrap 90% CI lower bound is above `0`. |
| Diagram gap | Diagram-vs-linear delta improves by at least `15 pts`. |
| Contrast | Final contrast exit-0 rate is at least `95%`. |
| Linear regression | Linear-flow slice mean does not drop by more than `3 pts`. |
| Cost | Mean wall-clock and token cost are no more than `1.45x` control, unless SHIP reaches at least `80%`. |
| Failure concentration | No more than `2/45` final tiles fail for title-band intrusion, clipped title/CTA/legend/row, or visual panel bottom overflow. |

Adopt `T1` instead of `T2` if `T1` reaches at least `+8pp` SHIP lift, diagram gap improves by at least `10 pts`, and `T2` adds less than `+3pp` SHIP over `T1`.

Iterate if SHIP lift is positive but below adoption thresholds, especially if failures cluster in `oci-4`, `goedkeuringssysteem-4`, `accountbeheer-4`, or `aangepast-assortiment-3`.

Reject A1 if SHIP lift is below `+5pp`, linear tiles regress by more than `5 pts`, or the diagram-vs-linear gap remains above `30 pts`.

## Minimal Harness Changes

In `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs`, add this near the top:

```js
import path from 'node:path';

const ARM = process.env.A1_ARM || 'control'; // control | a1_prompt | a1_gate_repair
const RUN_ID = process.env.A1_RUN_ID || 'r1';
const A1_ENABLED = ARM !== 'control';

function primitiveForBrief(brief) {
  const b = brief.toLowerCase();
  if (/(matrix|table|rows|list|feed|timeline|invoice|conditions|terms|folder tree|line items)/.test(b)) return 'stacked-list';
  if (/(node|diagram|flow|funnel|branch|decision|round-trip|many->one|merge|connector|links)/.test(b)) return 'linear-flow';
  if (/(donut|gauge|bar chart|line chart|kpi|stat|ring|waffle)/.test(b)) return 'kpi-strip';
  return 'stacked-list';
}

function armOut(t, pass = 'p0') {
  if (ARM === 'control') return t.out;
  const dir = path.dirname(t.out).replace(/\/dist$/, `/dist-${ARM}-${RUN_ID}`);
  return path.join(dir, path.basename(t.out).replace(/\.html$/, `-${pass}.html`));
}
```

Change the `contract` function signature and treatment line:

```js
function contract(title, desc, t) {
  const treatment = t.brief;
  return `You are GLM-5.2, a multimodal model that CAN see attached images. An image IS attached and visible to you — do NOT deliberate about whether you can see it; you can. Even if you somehow cannot, the LAYOUT section below fully specifies the shell, so build from that — never refuse or explain, just output the HTML.

You are a senior product-UI engineer. The attached image is the EMPTY reference shell for a Dutch maritime "Vloot-functie" bento tile (title "${title}", description "${desc}"). Build ONE self-contained 560×480 HTML tile in the EXACT house style below, filling the body with this treatment:

TREATMENT: ${treatment}

OUTPUT: a single complete HTML document only — no markdown fences, no prose. Inline <style>, inline SVG, the Hanken Grotesk Google Fonts link only.

${A1_ENABLED ? a1Block(t) : ''}

LAYOUT (match the reference shell exactly):
- Card 560×480, page bg #eceef0, centered; background #ffffff, border-radius 22px (NOT >=24), NO border, box-shadow:0 1px 2px rgba(20,28,46,.04),0 26px 52px -22px rgba(20,28,46,.20), padding 30px, overflow hidden; font 'Hanken Grotesk',Arial,sans-serif; -webkit-font-smoothing:antialiased; font-variant-numeric:tabular-nums; color #0a1a2f.
- TITLE + DESCRIPTION SIT AT THE BOTTOM-LEFT of the card (exactly like the reference shell). Title "${title}" 21px weight 700 #0a1a2f. Description "${desc}" 13.5px weight 500 #4e4e4e, directly under the title.
- The instrument/content fills the body ABOVE the title block (a floating inner panel: #fefefe + 1px #ececec border + tight <=14px-blur shadow, radius <=16).
- Eyebrow chip TOP-RIGHT: a small ANCHOR icon (maritime) + the text "Vloot-functie" (Title case, NOT uppercase), brand blue #06458c, on a #f6f8fc rounded pill. Use ONLY this anchor icon for the eyebrow — no other glyph.
- Circular ghost ↗ button BOTTOM-RIGHT (34px, white, 1px #e2e2e2).
- EVERYTHING must fit inside the 560×480 card — nothing clipped or overflowing. Size the instrument to leave room for the bottom title+desc block.

Spend boldness on ONE signature instrument moment for the treatment, grounded in maritime-B2B fleet procurement; everything else quiet. Realistic Dutch data (ships MS Aldebaran/Castor/Pollux/Vesta; maart 2026). Format euro amounts consistently as €X.XXX (thousands dot, no cents).

Palette ONLY (zero out-of-palette hex): brand #06458c/#053b77/#043367; green #367e39 (status/success only); red #c9140f (alerts only); text #0a1a2f; muted secondary/meta/caption/table-header TEXT must be #4e4e4e or #0a1a2f, NEVER #787878 and NEVER #8591b3/#acb3c9/#cbd0dc as TEXT color (they fail WCAG AA) — those light neutrals are for borders, dividers, dots, strokes and fills ONLY; neutrals #ececec #e7e9ee #cbd0dc #8591b3 #acb3c9 #f6f8fc #fefefe #ffffff #e2e2e2. NO orange. No gradient except optionally the navy. No glassmorphism. Reduced-motion-guard any hover. Status by icon+word not color alone. Return ONLY the HTML.`;
}
```

Add this helper below `contract`:

```js
function a1Block(t) {
  const primitive = primitiveForBrief(t.brief);
  return `## A1_SAFE_LINEAR_560_V2: HARD SPATIAL CONTRACT

Use this contract before any tile-specific creative instructions.

Tile geometry:
- The current experiment tile is exactly 560px by 480px. Do not change card size.
- Use these CSS variables and reference them in the tile CSS:
  --tile-w:560px; --tile-h:480px; --pad:30px; --visual-y:30px; --visual-h:298px; --visual-bottom:328px; --title-y:356px; --title-h:94px; --gap:24px;
- The visual panel must fit inside x=30..530 and y=30..328.
- The bottom shell band is reserved at x=30..530 and y=356..456.
- Nothing except title, description, and the circular ghost CTA may enter the bottom shell band.
- Keep at least 24px clear space between visual panel and bottom shell band.
- Add data-a1-role="visual" to the visual panel, data-a1-role="title" to the title, data-a1-role="description" to the description, data-a1-role="eyebrow" to the eyebrow, and data-a1-role="shell-cta" to the circular ghost CTA.

Layout primitive:
- Default primitive is normal flow: display:grid, display:flex, gap, padding, and fixed row/column sizing.
- Do not use position:absolute for text, rows, cards, nodes, labels, arrows, legends, matrices, or flow diagrams.
- position:absolute is allowed only for decorative non-text dots, glows, badges, or background shapes with aria-hidden="true" and pointer-events:none.
- If a diagram has more than 3 nodes, more than 3 data rows, or more than 2 branches, convert it to linear-flow, stacked-list, or compact-matrix.

Primitive caps:
- Matrix: header plus max 3 data rows. If there are more rows, show the top 3 plus a compact +N more summary.
- Approval or branch flow: max 3 cards total.
- Integration flow: max 3 nodes total.
- Legend: max 2 inline items inside the visual panel.
- CTA buttons inside the visual panel: max 2.
- Minimum internal gap between cards/nodes/rows is 10px.

Text and case:
- Use the eyebrow text exactly as provided: Vloot-functie.
- Do not use text-transform: uppercase.
- Do not substitute glyphs for required symbols. If unsure, use plain text.
- Eyebrow, title, description, row labels, CTA text, and node labels must always be above decorative shapes.

Text-on-dark tokens:
- On navy or dark panels, body text must use #E7ECF7.
- On navy or dark panels, muted text must use #B8C2D6.
- Do not use #4e4e4e, #666, #777, #8591b3, or opacity-reduced gray for readable text on dark backgrounds.

Internal first-pass plan. Fill this mentally before writing HTML; do not render it visibly:
{
  "dial": "A1_SAFE_LINEAR_560_V2",
  "tile": { "w": 560, "h": 480, "visualBox": [30, 30, 500, 298], "titleBox": [30, 356, 500, 94] },
  "primitive": "${primitive}",
  "itemCount": 0,
  "visibleItems": 3,
  "overflowSummary": "+N more | null",
  "usesAbsoluteForContent": false,
  "darkTextTokens": { "body": "#E7ECF7", "muted": "#B8C2D6" }
}

Before returning code, check only these 6 gates:
- Visual panel bottom is at or above y=328.
- Bottom shell band contains only title, description, and circular ghost CTA.
- No text/card/node/row bounding boxes overlap.
- No readable dark-panel text uses banned gray tokens.
- No text-transform: uppercase.
- No clipped CTA, legend, final row, or title.`;
}
```

Change the request body call:

```js
{type:'text',text:contract(spec.title,spec.desc,t)}
```

Change output handling inside `gen(t)`:

```js
const out = armOut(t);
if(fs.existsSync(out)){ try{ if(/<\/html>\s*$/i.test(fs.readFileSync(out,"utf8"))) return `SKIP ${t.n}`; }catch{} }
fs.mkdirSync(path.dirname(out), {recursive:true});
```

Then replace `t.out` in the write line:

```js
fs.writeFileSync(out,h);
```

Run commands:

```bash
for run in r1 r2 r3; do for arm in control a1_prompt a1_gate_repair; do for spec in .opencode/specs/anobel.com/004-bento-visuals/research/inputs/spec-*.json; do A1_ARM=$arm A1_RUN_ID=$run node .opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs "$spec"; done; done; done
```

Audit step for `T2`:

```text
Fail tile if:
- any non-title/non-description/non-shell-CTA element intersects y=356..456
- any visual-panel element has bottom > 328
- any readable text bbox overlaps another readable text/card/node bbox
- any readable dark-panel text uses a banned gray token or contrast < 4.5:1
- generated CSS contains text-transform: uppercase
- any CTA, legend, row, title, or description is clipped
```

For failed `T2` tiles, run exactly one repair call with this prompt body:

```text
Your previous HTML failed the deterministic A1 gate.

Return one complete corrected HTML document only. No markdown fences, no prose.

Keep the same visual concept and Dutch copy. Do not redesign the tile. Fix only the reported spatial, contrast, clipping, and text-case failures.

A1 failure JSON:
<PASTE_GATE_JSON>

Use the attached rendered screenshot as the current failed state.
Apply A1_SAFE_LINEAR_560_V2 exactly:
- visual panel inside x=30..530 and y=30..328
- bottom shell band x=30..530 and y=356..456
- bottom shell band contains only title, description, and circular ghost CTA
- no absolute positioning for content
- dark-panel text uses #E7ECF7 or #B8C2D6
- no text-transform: uppercase
- no clipped CTA, legend, final row, title, or description
```

Final scoring uses the repaired HTML for `T2` if repair was triggered; otherwise it uses the first-pass HTML.