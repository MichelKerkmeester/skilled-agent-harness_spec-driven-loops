I’ll keep this read-only and produce an executable experiment design in-chat, with routing/context checks only.SKILL ROUTING: advisor surfaced an ambiguous executor/model pair; only `sk-prompt-models` applies because this is GLM-specific experiment design, not a CLI dispatch.I’m loading the GLM-5.2 model profile because the experiment changes the prompt contract and verifier surface for that model.# A5 experiment design

## Arms

Run a paired, blocked A/B test on the same frozen `9 concepts × 5 treatments = 45` tile manifest.

| Arm | Name | Exact behavior |
| --- | --- | --- |
| C | `control_current_single_shot` | Current `gen-tile.mjs` pipeline: one GLM-5.2 request, current prose layout instructions, current browser render, current contrast + MiniMax-M3 audit. No A5 skeleton, no new fallback. |
| T | `a5_skeleton_first_2d_v2` | For `matrix`, `node`, `routing`, `funnel`, `popover`: measure Dutch copy, compute one 480×480 skeleton, preflight AABB checks, pass skeleton as hard rendering contract, forbid GLM-owned coordinates, render, browser-verify, recompute best-of-3 skeletons after first verifier failure, downgrade to `compact_table` or `linear_flow_tile` after second verifier failure. For linear-flow treatments, keep the same prompt as control except run the same audit logging, so regressions are visible. |

Repetition: `3` independent replicates per tile per arm.

Total outputs: `45 tiles × 2 arms × 3 reps = 270`.

Run order: blocked by tile, randomized within each tile-rep pair.

```text
for rep in [1,2,3]:
  shuffle tiles with seed "a5-exp-2026-06-29-rep-${rep}"
  for tile in shuffled_tiles:
    arm_order = hash(tile_id + rep) % 2 ? [C,T] : [T,C]
    run both arms adjacent in that order
```

Lock model settings for both arms:

```json
{
  "model": "glm-5.2",
  "temperature": 0.2,
  "top_p": 0.9,
  "max_tokens": 16000,
  "thinking": { "type": "disabled" }
}
```

Rationale: GLM-5.2 has known large-output vision-to-code failures when thinking consumes the budget. Keep thinking disabled for both arms so the A/B isolates layout ownership, not reasoning-token behavior.

## Sample Tiles

Primary sample is the full frozen 45-tile manifest. Do not subset for the confirmatory run; the target claim is a lift from `27/45` to `32-34/45`, so all 45 must remain in scope.

Required strata:

| Stratum | Include | Purpose |
| --- | --- | --- |
| Weak 2D-positioned primitives | All manifest rows with treatment `matrix`, `node`, `routing`, `funnel`, or `popover` | Primary A5 target: layout primitive failures, node collisions, title/diagram intersection, connector anchor errors. |
| Linear-flow primitives | All manifest rows with treatment `timeline`, `linear_flow`, `linear_flow_tile`, or manifest `primitive_class=linear_flow` | Negative-control stratum: A5 should not reduce already-strong linear performance. |

Named sentinel rows that must be present in the frozen manifest:

| Tile | Stratum | Reason |
| --- | --- | --- |
| `accountbeheer-4 matrix` | 2D-positioned | Matrix layout primitive; expected to benefit from row caps, reserved title region, and AABB preflight. |
| `oci-4 node` | 2D-positioned | Node/connector primitive; expected to benefit from node boxes, anchors, connector routes. |
| `accountbeheer-5 timeline` | Linear-flow | Negative-control linear primitive; should remain in the `86-94` score band. |
| `oci-5 timeline` | Linear-flow | Negative-control linear primitive for the OCI concept. |

If any sentinel row is absent, stop and freeze a replacement from the same concept/treatment family before running. Do not choose replacements after seeing results.

## Metrics

Primary metric:

| Metric | Definition |
| --- | --- |
| `SHIP rate` | `ship_gate == PASS` using the same pass/fail gate as the baseline, extended for A5 geometry fields in treatment. Report per arm as `passes / 135` for 3 reps and normalized to `/45` for comparison with baseline. |

Secondary metrics:

| Metric | Definition |
| --- | --- |
| `contrast_check.py exit-0 rate` | Fraction of outputs where `contrast_check.py` exits `0`. |
| `MiniMax-M3 audit score` | Blind visual audit score from MiniMax-M3. The audit prompt must not expose arm name, filename, skeleton metadata, or fallback state. |
| `diagram-vs-linear score delta` | `mean(MiniMax score on linear-flow tiles) - mean(MiniMax score on 2D-positioned tiles)`. Current target gap is about `41` points. |
| `2D weak-tile score` | Mean MiniMax score on prior weak 2D tiles scoring `35-58`. |
| `token cost` | Prompt tokens, completion tokens, total tokens per tile output. |
| `wall-clock cost` | Request latency, browser render latency, verifier latency, total elapsed time. |
| `fallback rate` | Fraction of A5 treatment outputs with `fallback_triggered != "none"`, split by `recompute_best_of_3`, `compact_table`, `linear_flow_tile`. |
| `geometry defect counts` | `diagram_intersects_title`, `node_collision_count`, `text_padding_violation_count`, `connector_anchor_error_count`, `title_at_bottom`. |

A5 treatment row extension:

```json
{
  "tile_id": "accountbeheer-4",
  "concept": "accountbeheer",
  "treatment": "matrix",
  "primitive_class": "2d_positioned",
  "arm": "a5_skeleton_first_2d_v2",
  "replicate": 1,
  "layout_mode": "skeleton_first_2d_v2",
  "overflow": false,
  "diagram_intersects_title": false,
  "node_collision_count": 0,
  "text_padding_violation_count": 0,
  "connector_anchor_error_count": 0,
  "title_at_bottom": true,
  "uppercase_eyebrow_count": 0,
  "contrast_exit_code": 0,
  "minimax_score": 0,
  "fallback_triggered": "none",
  "prompt_tokens": 0,
  "completion_tokens": 0,
  "wall_ms": 0,
  "ship_gate": "PASS"
}
```

## Expected Deltas

| Metric | Expected treatment delta | Rationale |
| --- | ---: | --- |
| SHIP rate | `+11` to `+16` points, from `27/45 = 60%` to `32-34/45 = 71-76%` | A5 targets the known failing subset rather than all tiles. Expected gain is roughly `+5` to `+7` shipped tiles per 45. |
| 2D weak-tile MiniMax score | `+20` to `+30` points on weak 2D tiles | Moving geometry from GLM prose prediction into explicit skeleton boxes mirrors LaySPA-style spatial rewards and LaTCoder/DCGen bounded-region mechanisms. |
| Linear-flow MiniMax score | `-3` to `+3` points | Linear tiles are already strong and mostly outside A5’s intervention. Any larger drop indicates prompt or renderer regression. |
| Diagram-vs-linear gap | Gap shrinks from `~41` to `~16-23` points | This is `45-60%` closure of the observed defect gap. |
| Contrast exit-0 rate | `0` to `+1` point | Palette tokens and contrast gate are unchanged; A5 should not be a contrast intervention. |
| Prompt tokens on affected 2D tiles | `-100` to `+400` tokens per tile | Skeleton JSON adds tokens but replaces dense layout prose. |
| Wall-clock | `+0.2s` to `+1.0s` per tile for browser verification; no extra GLM call on first failure if rerendering from recomputed skeleton | AdaCoder-style adaptive planning: start cheap, escalate only after verifier failure. |
| Fallback rate | First-pass recompute on `10-25%` of affected 2D outputs; final downgrade under `10%` | If downgrade rate is higher, skeleton budgets or row caps are too tight for the Dutch copy. |

## Decision Rule

Adopt A5 if all are true:

| Gate | Adopt threshold |
| --- | --- |
| Primary SHIP lift | Treatment SHIP improves by at least `+10` percentage points over control, and paired cluster bootstrap `90% CI` lower bound is `> 0`. |
| 2D mechanism check | Weak 2D MiniMax score improves by at least `+15` points. |
| Gap closure | Diagram-vs-linear score gap closes by at least `35%`. |
| Linear non-regression | Linear-flow MiniMax score drops by no more than `3` points and linear SHIP drops by no more than `1` tile-equivalent per 45. |
| Contrast non-regression | Contrast exit-0 rate drops by no more than `2` percentage points. |
| Cost guard | Median total wall-clock rises by no more than `20%`, and affected-tile prompt tokens rise by no more than `+500` median tokens. |
| Fallback guard | Final downgrade rate stays under `10%` of affected 2D outputs. |

Iterate if A5 improves 2D scores but misses one operational guard, especially high fallback rate or title overflow. That means the mechanism works but skeleton budgets need tuning.

Reject if SHIP lift is under `+3` points, linear tiles regress materially, or geometry defects persist despite skeleton ownership.

## Minimal Harness Changes

### `gen-tile.mjs` request-body switch

Add an arm switch and A5 prompt contract around the existing request body.

```js
const ARM = process.env.A5_ARM || "control";
const A5_TREATMENTS = new Set(["matrix", "node", "routing", "funnel", "popover"]);

function isA5Tile(tile) {
  return ARM === "a5" && A5_TREATMENTS.has(tile.treatment);
}

function buildA5Prompt(tile, skeleton) {
  return `
## Context
Generate one production bento tile for the supplied Dutch maritime-B2B concept.
Canvas is 480x480. The skeleton JSON below is the canonical geometry contract.

## Objective
Render from the skeleton exactly. Preserve the supplied regions, boxes, anchors, and connector routes.

## Style
Use the existing product palette tokens only. Title case eyebrow text. No text-transform uppercase.

## Constraints
- Do not invent x/y/w/h values.
- Do not invent transforms, absolute positions, row heights, connector endpoints, or extra rows.
- Render title and description only inside regions.title.
- Render diagram content only inside regions.diagram.
- Use data-a5-region for region wrappers.
- Use data-a5-id for every node, row, connector, and label matching the skeleton IDs.
- If content does not fit, shorten copy. Do not shrink below 13px.

## Skeleton JSON
${JSON.stringify(skeleton, null, 2)}

## Response
Return only the tile HTML/CSS fragment. No markdown fence. No explanation.
`;
}

const useA5 = isA5Tile(tile);
const skeleton = useA5 ? buildA5Skeleton(tile) : null;

if (useA5) {
  const preflight = verifyA5Skeleton(skeleton);
  if (!preflight.ok) {
    throw new Error(`A5 skeleton preflight failed for ${tile.id}: ${preflight.errors.join("; ")}`);
  }
}

const promptText = useA5
  ? buildA5Prompt(tile, skeleton)
  : buildCurrentPrompt(tile);

const body = {
  model: "glm-5.2",
  temperature: 0.2,
  top_p: 0.9,
  max_tokens: 16000,
  thinking: { type: "disabled" },
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: promptText },
        ...(tile.reference_image_url
          ? [{ type: "image_url", image_url: { url: tile.reference_image_url } }]
          : [])
      ]
    }
  ]
};
```

### A5 verifier hook after browser render

Add this to the audit step after the tile has rendered in the browser.

```js
async function auditA5Geometry(page, skeleton) {
  if (!skeleton) return {};

  return await page.evaluate((skel) => {
    const rect = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
    };

    const intersects = (a, b) => {
      if (!a || !b) return true;
      return !(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y);
    };

    const containsPadding = (outer, inner, pad) => {
      if (!outer || !inner) return false;
      return inner.x >= outer.x + pad &&
        inner.y >= outer.y + pad &&
        inner.right <= outer.right - pad &&
        inner.bottom <= outer.bottom - pad;
    };

    const title = rect('[data-a5-region="title"]');
    const diagram = rect('[data-a5-region="diagram"]');
    const canvas = rect('[data-a5-region="canvas"]') || { x: 0, y: 0, right: 480, bottom: 480 };

    const nodes = [...document.querySelectorAll('[data-a5-id][data-a5-kind="node"]')]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.getAttribute("data-a5-id"), x: r.x, y: r.y, right: r.right, bottom: r.bottom, w: r.width, h: r.height };
      });

    let nodeCollisionCount = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (intersects(nodes[i], nodes[j])) nodeCollisionCount++;
      }
    }

    const textBoxes = [...document.querySelectorAll('[data-a5-text-box]')];
    const textPaddingViolationCount = textBoxes.filter((el) => {
      const outer = el.getBoundingClientRect();
      const innerEl = el.querySelector('[data-a5-text]');
      if (!innerEl) return true;
      const inner = innerEl.getBoundingClientRect();
      return !containsPadding(outer, inner, skel.constraints?.min_text_padding_px ?? 10);
    }).length;

    const uppercaseEyebrowCount = [...document.querySelectorAll('[data-a5-region="eyebrow"]')]
      .filter((el) => {
        const text = (el.textContent || "").trim();
        return text.length > 2 && text === text.toUpperCase();
      }).length;

    const overflow =
      canvas.x < -1 ||
      canvas.y < -1 ||
      canvas.right > 481 ||
      canvas.bottom > 481 ||
      document.documentElement.scrollWidth > window.innerWidth ||
      document.documentElement.scrollHeight > window.innerHeight;

    return {
      overflow,
      diagram_intersects_title: intersects(diagram, title),
      node_collision_count: nodeCollisionCount,
      text_padding_violation_count: textPaddingViolationCount,
      connector_anchor_error_count: window.__A5_CONNECTOR_ANCHOR_ERRORS__ || 0,
      title_at_bottom: !!title && title.y >= 320,
      uppercase_eyebrow_count: uppercaseEyebrowCount
    };
  }, skeleton);
}
```

### Audit row merge

```js
const a5Audit = await auditA5Geometry(page, skeleton);
const contrastExitCode = await runContrastCheck(renderedHtmlPath);
const minimaxScore = await runBlindMiniMaxAudit(screenshotPath);

const shipGate =
  contrastExitCode === 0 &&
  minimaxScore >= 80 &&
  a5Audit.overflow !== true &&
  a5Audit.diagram_intersects_title !== true &&
  (a5Audit.node_collision_count ?? 0) === 0 &&
  (a5Audit.text_padding_violation_count ?? 0) === 0 &&
  (a5Audit.connector_anchor_error_count ?? 0) === 0 &&
  a5Audit.title_at_bottom !== false &&
  (a5Audit.uppercase_eyebrow_count ?? 0) === 0
    ? "PASS"
    : "FAIL";

auditRows.push({
  tile_id: tile.id,
  concept: tile.concept,
  treatment: tile.treatment,
  primitive_class: tile.primitive_class,
  arm: ARM === "a5" ? "a5_skeleton_first_2d_v2" : "control_current_single_shot",
  replicate: Number(process.env.A5_REPLICATE || 1),
  layout_mode: useA5 ? "skeleton_first_2d_v2" : "current_single_shot",
  ...a5Audit,
  contrast_exit_code: contrastExitCode,
  minimax_score: minimaxScore,
  fallback_triggered: fallbackTriggered || "none",
  prompt_tokens: usage.prompt_tokens,
  completion_tokens: usage.completion_tokens,
  wall_ms: wallMs,
  ship_gate: shipGate
});
```

### Run matrix

```bash
A5_ARM=control A5_REPLICATE=1 node gen-tile.mjs
A5_ARM=a5 A5_REPLICATE=1 node gen-tile.mjs
A5_ARM=control A5_REPLICATE=2 node gen-tile.mjs
A5_ARM=a5 A5_REPLICATE=2 node gen-tile.mjs
A5_ARM=control A5_REPLICATE=3 node gen-tile.mjs
A5_ARM=a5 A5_REPLICATE=3 node gen-tile.mjs
```

Blind the MiniMax-M3 audit by hashing screenshot names before audit:

```js
const auditId = crypto
  .createHash("sha256")
  .update(`${tile.id}:${ARM}:${process.env.A5_REPLICATE}`)
  .digest("hex")
  .slice(0, 12);
const blindedScreenshotPath = `audit-blind/${auditId}.png`;
```

The adoption readout should report: `SHIP`, `contrast exit-0`, `MiniMax score`, `diagram-vs-linear gap`, `weak 2D score`, `fallback rate`, `tokens`, and `wall-clock`, with paired deltas against control.