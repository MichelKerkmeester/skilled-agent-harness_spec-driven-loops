I’ll first load indexed context and route the task, then produce a concrete, execution-ready experiment plan without editing files.The context trigger call rejected `turnNumber=0`; I’m retrying with the required minimum value.SKILL ROUTING: advisor surfaced `cli-opencode` and `sk-prompt-models` with high confidence, but the request is not asking for CLI execution. I’m loading the model-prompt skill for GLM-specific prompt/harness constraints and keeping the output research-only.I’m checking the GLM profile from the loaded model-prompt skill so the experiment harness aligns with its documented prompt scaffold.I’m going to inspect the existing tile harness names and request shape so the “minimal harness changes” section maps to real files instead of generic pseudocode.The existing packet has the A3 research question and the actual generator under `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/`; I’m reading those files to anchor the plan in the current harness.I found the full 9-concept input/audit set, including all concept names and score rows. I’m reading the audit JSONs to name the exact 2D and linear samples.The audit rows identify all 18 FIX tiles and their primitives. I’m checking representative `spec-*.json` files for treatment labels so the sample list is reproducible from the manifest, not just score names.The generator currently makes direct Z.AI GLM calls with `thinking.disabled`, `temperature:0.4`, and no skeleton/round-2 path. I’m checking the surrounding scripts so the harness section can target the current render/audit flow.I also found `goal-prompt.md` and `concepts.md`, which define the current 45-tile objective and gates. I’m reading those briefly to keep the experiment aligned with the approved scope and non-goals.# A3 experiment design

## Arms (control = current single-shot pipeline; treatment(s) = the recommendation applied) - exact, reproducible

Run a **paired blocked experiment over all 45 tiles**, not only the 18 existing FIX rows. The primary comparison is per tile: same concept, same treatment brief, same reference shell, same output gate, different pipeline arm.

**Arm A: control**

Use current `gen-tile.mjs` behavior:

- Model: `glm-5.2`
- API: direct Z.AI Coding Plan endpoint
- `temperature: 0.4`
- `thinking: { type: "disabled" }`
- Prompt: current `contract(title, desc, treatment)`
- Input image: reference shell only
- No primitive routing
- No skeleton JSON
- No render-feedback round 2
- Final audit: deterministic gates plus MiniMax-M3 audit

**Arm B: A3 full treatment**

Apply A3 exactly as a pipeline change:

- First classify each tile as `linear-flow` or `2d-positioned` using the frozen table below.
- For `linear-flow`: use the current Product V4/M2/D6 generation path, but lower `temperature` to `0.2`. Run round 2 only if the first audit returns `FIX`.
- For `2d-positioned`: run skeleton-first before HTML generation, validate the skeleton, then generate HTML from the skeleton, then always run one render-feedback repair turn.
- Skeleton model: `glm-5.2`, text-only JSON turn, `response_format: { type: "json_object" }`, `temperature: 0.2`, `reasoning_effort: "max"`.
- Render model: `glm-5.2`, direct API image input, `temperature: 0.2`, `thinking: { type: "disabled" }`.
- Repair model: `glm-5v-turbo` preferred, `glm-4.6v` fallback. If the local Coding Plan endpoint is intentionally testing `glm-5.2` vision repair, record that as `repair_model=glm-5.2` so the result is not confused with the documented A3 model-dial recommendation.
- Final audit: same deterministic gates plus MiniMax-M3 audit as control.

Use **fresh control reruns**, not only the historical `27/45`, because model/provider drift and prompt edits can otherwise masquerade as A3 lift.

## Sample tiles (choose from the 9 concepts x 5 treatments)

Primary sample: **all 45 tiles** from `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/spec-*.json`.

Frozen `2d-positioned` stratum for treatment routing and diagram-vs-linear scoring:

| Tile | Primitive | Baseline | Why included |
|---|---:|---:|---|
| `accountbeheer-4` | permissions matrix | 35 FIX | worst matrix overflow and title collision |
| `oci-2` | punch-out round-trip flow | 78 FIX | connector/flow node crowding |
| `oci-4` | SAP-Anobel node diagram | 58 FIX | node/pill collision |
| `goedkeuringssysteem-4` | threshold decision diagram | 55 FIX | branching diagram, title-zone failure |
| `aangepast-assortiment-3` | ship x category matrix | 58 FIX | matrix overflow, title-zone violation |
| `aangepast-assortiment-5` | catalog funnel | 70 FIX | funnel buries list, clipped panel |
| `favorieten-4` | popover/list-picker | 62 FIX | overlaid popover clips card edge |
| `een-factuur-4` | many-to-one funnel | 82 FIX | connector/funnel clipping and contrast issue |
| `prijzen-condities-3` | staffel ladder | 62 FIX | stepped chart clipped, AI-slop geometry |
| `kwartaalcijfers-4` | category donut/ranked labels | 86 FIX | chart-label collision, segment ambiguity |

Frozen `linear-flow` comparator anchors:

| Tile | Primitive | Baseline | Why included |
|---|---:|---:|---|
| `accountbeheer-5` | timeline | 93 SHIP | high-performing linear reference |
| `orders-facturen-1` | table | 90 SHIP | high-performing tabular reference |
| `accountbeheer-1` | fleet-account list | 92 SHIP | high-performing row-list reference |
| `kwartaalcijfers-2` | download card | 94 SHIP | top score, simple card primitive |
| `een-factuur-5` | monthly timeline | 93 SHIP | high-performing linear timeline |
| `aangepast-assortiment-4` | self-contained stat/ring | 88 SHIP | proves treatment index alone is not the route key |
| `orders-facturen-4` | stat tiles + strip | 52 FIX | linear overflow stress case |
| `goedkeuringssysteem-1` | approval queue table | 62 FIX | linear/table overflow stress case |

All remaining non-2D rows stay in the linear-flow stratum for the primary 45-tile analysis.

## Metrics

Primary metrics:

- `SHIP_rate`: final `SHIP` count divided by 45.
- `FIX_to_SHIP_conversion`: among the historical 18 FIX tiles, count how many become SHIP in Arm B minus Arm A.
- `MiniMax_M3_score_mean`: mean final MiniMax-M3 audit score, overall and by primitive stratum.
- `diagram_vs_linear_delta`: `mean(linear-flow score) - mean(2d-positioned score)`. Baseline target to beat is about `41 pts`.
- `contrast_exit_0_rate`: fraction of final tiles where `contrast_check.py` exits `0`.
- `overflow_false_rate`: fraction with `overflow=false`.
- `title_at_bottom_true_rate`: fraction with `title_at_bottom=true`.
- `cost_token_multiplier`: treatment total tokens divided by control total tokens, logged from API `usage`.
- `cost_wall_clock_multiplier`: treatment elapsed milliseconds divided by control elapsed milliseconds.

Guardrail metrics:

- Linear non-regression: Arm B linear-flow mean score must not drop by more than `2 pts`.
- Linear SHIP non-regression: Arm B must not convert more than `1` historical linear SHIP tile to FIX.
- Palette non-regression: orange count remains `0`, out-of-palette hex count remains `0`.
- Repair false-fix rate: number of tiles where round 2 fixes one issue but introduces a new failing gate.

Audit blinding:

- Save screenshots under opaque IDs like `a3-0001.png`, not `control` or `treatment`.
- MiniMax-M3 receives only the screenshot and rubric, not the arm label.
- Decode arm labels only after all MiniMax rows are written.

## Expected deltas

Expected overall result:

| Metric | Baseline/control expectation | A3 treatment expectation | Rationale |
|---|---:|---:|---|
| SHIP rate | `27/45 = 60%` | `35-38/45 = 78-84%` | Converts `8-11` of the 18 historical FIX rows by consuming audit findings and constraining 2D geometry |
| FIX-to-SHIP conversion | `0` if current stop-after-audit path repeats | `8-11` | RC-8 is a process defect: existing findings become repair instructions |
| Overall MiniMax score | `81.1` mean historical | `+6 to +10 pts` | Largest gains come from low-scoring 2D rows, with limited headroom on linear rows |
| 2D-positioned score band | roughly `35-58` on worst core diagrams | `68-82` | Skeleton JSON attacks RC-1, RC-2, RC-3 before code exists |
| Linear-flow score band | `86-94` for strong rows | `86-95`, no meaningful lift | Linear rows already use normal document flow well |
| Diagram-vs-linear delta | about `41 pts` | `10-20 pts` | The treatment targets the primitive gap directly |
| Contrast exit-0 rate | should be high but not perfect | non-inferior, ideally `+0-5 pp` | A3 is geometry-first; contrast should not regress because repair locks palette |
| Wall-clock cost | `1.0x` | `1.4x-1.8x` all tiles, `2.0x-2.6x` 2D tiles | 2D gets skeleton plus mandatory repair; linear gets repair only on FIX |
| Token cost | `1.0x` | `1.4x-1.8x` all tiles | Skeleton JSON is bounded; repair prompt carries screenshot plus findings |

## Decision rule

**Adopt A3** if all are true:

- Arm B reaches at least `35/45 SHIP`.
- Net paired SHIP improvement is at least `+8 tiles` versus fresh Arm A.
- Historical FIX-to-SHIP conversion is at least `8/18`.
- `diagram_vs_linear_delta <= 20 pts`.
- 2D-positioned mean MiniMax score improves by at least `+15 pts`.
- Linear-flow mean score regresses by less than `2 pts`.
- No more than `1` historical linear SHIP tile becomes FIX.
- `contrast_exit_0_rate` is no worse than control by more than `1 tile`.
- All deterministic hard gates still pass for adopted outputs: no orange, no out-of-palette text, no title-zone violation, no visible overflow.
- Treatment wall-clock multiplier is `<= 1.8x` overall or `<= 2.6x` on the 2D stratum.

**Iterate A3** if any are true:

- SHIP lands at `31-34/45`.
- Net paired SHIP improvement is `+4` to `+7`.
- 2D mean score improves by `+8` to `+14 pts`.
- The geometry improves but repair introduces recurring palette, contrast, or copy drift.
- The route works on matrices but not node/funnel diagrams, or vice versa.

**Reject A3** if any are true:

- Net paired SHIP improvement is `< +4`.
- `diagram_vs_linear_delta` remains `> 30 pts`.
- More than `3` linear-flow tiles regress from SHIP to FIX.
- Contrast or palette regressions become the dominant failure mode.
- Treatment cost exceeds `3.0x` overall without reaching `35/45 SHIP`.

## Minimal harness changes to run it

Current target file:

`.opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs`

### 1. Add frozen primitive routing near the top

```js
const ARM = process.env.A3_ARM || 'control'; // control | a3
const RUN_ID = process.env.A3_RUN_ID || new Date().toISOString().replace(/[:.]/g, '-');
const REPAIR_MODEL = process.env.A3_REPAIR_MODEL || 'glm-5v-turbo';
const METRICS = `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/a3-${RUN_ID}.jsonl`;

const TWO_D_TILES = new Set([
  'accountbeheer-4',
  'oci-2',
  'oci-4',
  'goedkeuringssysteem-4',
  'aangepast-assortiment-3',
  'aangepast-assortiment-5',
  'favorieten-4',
  'een-factuur-4',
  'prijzen-condities-3',
  'kwartaalcijfers-4'
]);

function slugFromOut(out) {
  return out.match(/dist\/(.+?)-glm-(\d+)\.html$/)?.slice(1).join('-') || out;
}

function primitiveFor(t) {
  return TWO_D_TILES.has(slugFromOut(t.out)) ? '2d-positioned' : 'linear-flow';
}

function logMetric(row) {
  fs.appendFileSync(METRICS, JSON.stringify({ runId: RUN_ID, arm: ARM, ...row }) + '\n');
}
```

### 2. Add the A3 invariant block

```js
const A3_INVARIANT = `
A3 PRIMITIVE-ROUTED RENDER CONTRACT:
- Canvas remains 560x480, but reserve the bottom title zone.
- Safe x range: 30..530.
- Eyebrow zone: y=24..56.
- Diagram/body zone: y=72..324.
- Bottom title zone: x=30..530, y=344..456, height 112px.
- No diagram, connector, legend, row, pill, node, popover, or table may enter y>=344.
- Keep the title zone reserved even if the title is only 1-2 lines.
- Max visible matrix/table rows in the body zone: 3; aggregate extras into +N or a summary chip.
- Connector layer renders below text and nodes.
- Prefer CSS grid/flex inside each bbox. Use absolute positioning only to place validated diagram blocks.
`;
```

### 3. Add skeleton prompt and validator

```js
function skeletonPrompt(title, desc, treatment, tileId) {
  return `Return JSON only.

Tile: ${tileId}
Title: ${title}
Description: ${desc}
Treatment: ${treatment}

Create a layout skeleton for a 560x480 bento tile.

Zones:
- eyebrow: { "x": 30, "y": 24, "w": 500, "h": 32 }
- diagram: { "x": 30, "y": 72, "w": 500, "h": 252 }
- title: { "x": 30, "y": 344, "w": 500, "h": 112 }

Schema:
{
  "tileId": "string",
  "layoutPrimitive": "2d-positioned",
  "canvas": { "w": 560, "h": 480 },
  "zones": { "eyebrow": {}, "diagram": {}, "title": {} },
  "elements": [
    {
      "id": "string",
      "type": "node | pill | label | connectorGroup | legend | rowGroup | iconGroup | title | eyebrow",
      "bbox": { "x": 0, "y": 0, "w": 0, "h": 0 },
      "zone": "eyebrow | diagram | title",
      "text": "string",
      "maxLines": 1,
      "priority": "primary | secondary | decorative",
      "mayOverlap": false
    }
  ],
  "connectors": [
    {
      "id": "string",
      "from": "elementId",
      "to": "elementId",
      "route": "straight | elbow | arc",
      "strokeBbox": { "x": 0, "y": 0, "w": 0, "h": 0 }
    }
  ],
  "validation": {
    "insideCanvas": true,
    "insideZones": true,
    "noOverlap": true,
    "minGapPx": 12,
    "titleZoneReserved": true,
    "maxVisibleRows": 3,
    "connectorUnderlayOnly": true
  }
}

Rules:
- Non-connector bboxes must not overlap.
- Minimum gap between non-connector bboxes is 12px.
- Minimum gap between text bboxes and connector strokes is 8px.
- No body element may enter y>=344.
- Do not put generated content in the title zone except title/description placeholders.`;
}

function validateSkeleton(s) {
  const bad = [];
  for (const el of s.elements || []) {
    const b = el.bbox || {};
    if (b.x < 0 || b.y < 0 || b.x + b.w > 560 || b.y + b.h > 480) bad.push(`${el.id}: outside canvas`);
    if (el.zone !== 'title' && b.y + b.h >= 344) bad.push(`${el.id}: enters title zone`);
  }
  const boxes = (s.elements || []).filter(e => !e.mayOverlap && e.type !== 'connectorGroup');
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i].bbox, b = boxes[j].bbox;
      const gapX = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w));
      const gapY = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
      const overlap = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      if (overlap || (gapX < 12 && gapY < 12)) bad.push(`${boxes[i].id}/${boxes[j].id}: overlap or gap <12`);
    }
  }
  return bad;
}
```

### 4. Replace the request-body construction with a helper

```js
async function callZai(body, label) {
  const started = Date.now();
  const r = await fetch(EP, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const j = await r.json();
  logMetric({
    label,
    model: body.model,
    elapsedMs: Date.now() - started,
    promptTokens: j.usage?.prompt_tokens ?? null,
    completionTokens: j.usage?.completion_tokens ?? null,
    totalTokens: j.usage?.total_tokens ?? null,
    finish: j.choices?.[0]?.finish_reason ?? null
  });
  return j;
}

function htmlBody(prompt, imageBase64, model = 'glm-5.2') {
  return {
    model,
    max_tokens: 24000,
    temperature: ARM === 'a3' ? 0.2 : 0.4,
    thinking: { type: 'disabled' },
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: 'data:image/png;base64,' + imageBase64 } }
      ]
    }]
  };
}

function skeletonBody(prompt) {
  return {
    model: 'glm-5.2',
    max_tokens: 5000,
    temperature: 0.2,
    thinking: { type: 'enabled' },
    reasoning_effort: 'max',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }]
  };
}
```

### 5. In `gen(t)`, build control vs A3 prompts

Replace the current `const body={...}` block with:

```js
const tileId = slugFromOut(t.out);
const primitive = primitiveFor(t);
let skeleton = null;

if (ARM === 'a3' && primitive === '2d-positioned') {
  const sj = await callZai(skeletonBody(skeletonPrompt(spec.title, spec.desc, t.brief, tileId)), `${tileId}:skeleton`);
  skeleton = JSON.parse(sj.choices?.[0]?.message?.content || '{}');
  const skeletonErrors = validateSkeleton(skeleton);
  logMetric({ tileId, primitive, label: `${tileId}:skeleton-validate`, skeletonErrors });
  if (skeletonErrors.length) return `FAIL ${t.n} skeleton ${skeletonErrors.join('; ')}`;
}

const treatmentPrompt = ARM === 'a3'
  ? `${contract(spec.title, spec.desc, t.brief)}

${A3_INVARIANT}

LAYOUT PRIMITIVE: ${primitive}

${skeleton ? `VALIDATED SKELETON JSON:
${JSON.stringify(skeleton, null, 2)}

Use the skeleton bboxes as layout constraints. Do not invent new diagram regions.` : ''}`
  : contract(spec.title, spec.desc, t.brief);

const body = htmlBody(treatmentPrompt, img);
```

### 6. Add the repair request body after first render/audit

The existing `gen-tile.mjs` does not currently run render/audit inline. Add this as the repair call in the audit step after producing `v1.html`, `v1.png`, and `audit-v1.json`:

```js
function repairBody({ title, desc, treatment, refImageBase64, renderBase64, html, skeleton, audit }) {
  return {
    model: REPAIR_MODEL,
    max_tokens: 24000,
    temperature: 0.2,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Fix only the named visual gaps.

Title: ${title}
Description: ${desc}
Treatment: ${treatment}

Preserve the concept, palette, copy intent, and bottom-left title rule.
Do not add new content.
Do not change approved colors unless contrast validation fails.
Recompute layout so all content fits the 560x480 tile.
Keep all diagram elements out of the reserved title zone y>=344.
Prefer grid/flex constraints inside validated bboxes; use absolute positioning only for validated diagram block placement.
Return complete HTML only, no markdown fences.

Skeleton JSON:
${JSON.stringify(skeleton || null, null, 2)}

Audit findings:
${JSON.stringify(audit, null, 2)}

Current HTML:
${html}`
        },
        { type: 'image_url', image_url: { url: 'data:image/png;base64,' + refImageBase64 } },
        { type: 'image_url', image_url: { url: 'data:image/png;base64,' + renderBase64 } }
      ]
    }]
  };
}
```

Run repair when:

```js
const mustRepair = ARM === 'a3' && (primitive === '2d-positioned' || audit.verdict === 'FIX');
```

### 7. Audit output schema

Make every final audit row write this shape:

```json
{
  "runId": "string",
  "arm": "control | a3",
  "tileId": "accountbeheer-4",
  "primitive": "2d-positioned | linear-flow",
  "score": 0,
  "verdict": "SHIP | FIX",
  "overflow": false,
  "readable": true,
  "on_brand": true,
  "title_at_bottom": true,
  "contrast_exit_code": 0,
  "prompt_tokens": 0,
  "completion_tokens": 0,
  "total_tokens": 0,
  "wall_clock_ms": 0,
  "repair_model": "glm-5v-turbo",
  "issue": "none or exact MiniMax finding"
}
```

Run commands:

```bash
A3_ARM=control A3_RUN_ID=a3-control node .opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs .opencode/specs/anobel.com/004-bento-visuals/research/inputs/spec-accountbeheer.json
A3_ARM=a3 A3_RUN_ID=a3-treatment A3_REPAIR_MODEL=glm-5v-turbo node .opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs .opencode/specs/anobel.com/004-bento-visuals/research/inputs/spec-accountbeheer.json
```

Repeat for all 9 `spec-*.json` files. The experiment is valid only after the same final gate/audit pass is run over both arms.