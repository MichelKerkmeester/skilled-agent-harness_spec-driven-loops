I’ll ground the experiment in the actual generation/audit harness and tile naming before writing the design, without modifying files.SKILL ROUTING: advisor returned an ambiguous set; the highest surfaced relevant workflow is `sk-code-review` (confidence 0.82), which I’m loading only for findings/validation discipline while keeping the task read-only.I’ll now locate the tile generator, audit scripts, and manifest so the plan’s harness edits and sample tile names match the workspace.The generator is under `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/`; I’m reading that harness and nearby files to avoid guessing tile IDs or request fields.I found the 45-tile input set and existing audit artifacts; I’ll inspect the manifests/audits for treatment labels and observed failure distribution.The current audit JSONs already encode tile score, verdict, overflow/readability/title flags, and issue text, which is enough to define a reproducible stratified sample and primary endpoints.I have the baseline failure set: 18 FIX and 27 SHIP, matching the 60% baseline. I’ll check whether the named deterministic gates already exist or need harness stubs in the proposed experiment.There is no packet-local `proof_check.py`, `contrast_check.py`, or `geometry_check.py`; the usable contrast/proof scripts live under `sk-design`, and geometry would need a small DOM/AABB gate or a manual MiniMax proxy for the experiment.# A4 experiment design

## Arms

| Arm | Role | Exact behavior | Output used for decision |
|---|---|---|---|
| `C0_control` | Current baseline | Existing single-shot GLM output, then deterministic gates, then MiniMax audit, stop. No feedback to GLM. | Existing `audit-*.json`: `27/45 SHIP`, `18/45 FIX`. |
| `T0_generic_retry` | Active comparator | For the 18 current `FIX` tiles only, send GLM the reference image, failed render image, previous code, and generic hard invariants. Do not include MiniMax issue text or typed fix JSON. | Diagnostic only: measures “second call helps” without A4. |
| `T1_A4_structured_repair` | A4 treatment | For the same 18 `FIX` tiles only, convert MiniMax issue text into typed repair JSON, attach failed render image + previous code, run one GLM repair, then deterministic gates + MiniMax rescore. | Primary treatment. |
| `T1_A4_adopted` | Production outcome | Use `T1` output only if `contrast_check`, geometry/title/overflow checks, and MiniMax `SHIP` pass with no false-fix. Otherwise keep `C0`. | Primary SHIP-rate endpoint. |

Run `T0` and `T1` in alternating order by tile to reduce provider-time bias:

| Tile lexical index | Order |
|---|---|
| Odd | `T1_A4_structured_repair`, then `T0_generic_retry` |
| Even | `T0_generic_retry`, then `T1_A4_structured_repair` |

Keep fixed:

| Field | Value |
|---|---|
| GLM model | `glm-5.2` |
| Endpoint | `https://api.z.ai/api/coding/paas/v4/chat/completions` |
| `max_tokens` | `24000` |
| `temperature` | `0.4` |
| `thinking` | `{ "type": "disabled" }` |
| Retry depth | `1` repair attempt per tile |
| Max fixes per tile | `3` |
| Auditor | Same MiniMax-M3 rubric used to produce existing `audit-*.json` |
| Blinding | Audit screenshots/HTML should be named opaque IDs before MiniMax rescore, not `a4`/`generic` |

## Sample Tiles

Primary sample is the full finite population: all `45` tiles. Primary repair cohort is all `18` current `FIX` tiles. A4 only runs on those 18. The SHIP tiles are still included in final batch metrics as non-regression and cost sentinels.

### 2D-Positioned / Constraint-Layout Repair Cohort

| Tile | Primitive | Baseline | Main A4 target |
|---|---:|---:|---|
| `accountbeheer-4` | rights/permissions matrix | `35 FIX` | RC-1 overflow, RC-2 matrix collision |
| `aangepast-assortiment-3` | ship x category visibility matrix | `58 FIX` | RC-1 overflow, RC-3 title position, RC-4 uppercase |
| `oci-4` | SAP -> Anobel hub node diagram | `58 FIX` | RC-2 node collision, glyph drift |
| `goedkeuringssysteem-4` | threshold decision routing diagram | `55 FIX` | RC-2 branch crowding, RC-3 title position, RC-5 contrast |
| `aangepast-assortiment-5` | full catalog -> filtered funnel | `70 FIX` | RC-1 clipping, RC-7 decorative funnel |
| `favorieten-4` | product card + popover picker | `62 FIX` | RC-2 popover overflow |
| `prijzen-condities-3` | volume-discount stepped ladder | `62 FIX` | RC-1 clipping, RC-7 3D/slop |
| `een-factuur-4` | many-to-one invoice funnel | `82 FIX` | RC-1 clipping, RC-5 contrast |
| `oci-2` | punch-out round-trip flow | `78 FIX` | RC-2 eyebrow/node collision |

### Linear / Flow / Table Repair Cohort

| Tile | Primitive | Baseline | Main A4 target |
|---|---:|---:|---|
| `accountbeheer-2` | session card | `78 FIX` | RC-6 off-brand red |
| `oci-3` | PO-sync list feed | `72 FIX` | RC-5 low-contrast row |
| `goedkeuringssysteem-1` | approval queue table | `62 FIX` | RC-1 panel row overflow |
| `goedkeuringssysteem-3` | pending-order card | `66 FIX` | RC-1 CTA bleed |
| `een-factuur-1` | consolidated invoice document | `88 FIX` | RC-1 panel/title overlap |
| `favorieten-3` | list detail | `78 FIX` | RC-1 last-row clipping |
| `kwartaalcijfers-4` | donut/ranked category chart | `86 FIX` | label collision, weak segment differentiation |
| `kwartaalcijfers-5` | YoY paired bars | `89 FIX` | RC-6 red/orange misuse |
| `orders-facturen-4` | stat tiles + recent orders | `52 FIX` | RC-1 title/card overflow |

### SHIP Sentinels

| Tile | Primitive | Baseline | Expected A4 behavior |
|---|---:|---:|---|
| `accountbeheer-1` | fleet account list | `92 SHIP` | no repair call |
| `accountbeheer-5` | account activity timeline | `93 SHIP` | no repair call |
| `oci-1` | connection KPI row | `92 SHIP` | no repair call |
| `oci-5` | uptime gauge | `90 SHIP` | no repair call |
| `goedkeuringssysteem-2` | vertical approval timeline | `88 SHIP` | no repair call |
| `goedkeuringssysteem-5` | approval donut overview | `86 SHIP` | no repair call |
| `een-factuur-5` | monthly invoice timeline | `93 SHIP` | no repair call |
| `orders-facturen-1` | combined table | `90 SHIP` | no repair call |
| `kwartaalcijfers-2` | download card | `94 SHIP` | no repair call |

## Metrics

| Metric | Formula | Primary slice |
|---|---|---|
| SHIP rate | `count(verdict == "SHIP") / 45` after adoption fallback | Full 45 |
| FIX -> SHIP conversion | `count(C0_FIX && T1_A4_adopted_SHIP) / 18` | 18 FIX tiles |
| MiniMax-M3 score delta | `mean(score_T1_raw - score_C0)` and `mean(score_T1_adopted - score_C0)` | 18 FIX, plus 2D subgroup |
| Diagram-vs-linear score delta | `mean(linear_ship_sentinel_scores) - mean(2D_repair_scores)` | 2D cohort vs linear sentinels |
| Contrast exit-0 rate | `contrast_check.py` passes on extracted text color pairs, plus fail grep for text using `#787878`, `#8591b3`, `#acb3c9`, `#cbd0dc` | RC-5 tiles and full 45 |
| Geometry pass rate | `overflow=false`, `title_at_bottom=true`, `node_overlap=false`, `diagram_max_bottom_y<=348` | RC-1/RC-2/RC-3 tiles |
| False-fix rate | Repair breaks a previously passing invariant: title position, readable contrast, on-brand palette, glyph/casing, or product meaning | 18 FIX raw repairs |
| Token cost | `usage.prompt_tokens + usage.completion_tokens` if API returns it; else prompt chars + output chars | Per repaired tile |
| Wall-clock cost | `Date.now()` around each GLM call plus MiniMax rescore latency | Full batch and repaired subset |

## Expected Deltas

| Metric | Baseline | Expected A4 | Rationale |
|---|---:|---:|---|
| SHIP rate | `27/45 = 60%` | `32-34/45 = 71-76%` | A4 consumes 18 already-specific MiniMax findings instead of discarding them. Expected `5-7` conversions. |
| FIX -> SHIP | `0/18` under stop-after-audit | `5-7/18` | External localized correction should outperform self-critique because MiniMax supplies grounded defects and GLM only repairs. |
| 2D low band | `35-58` for worst positioned diagrams | `62-78` | Bottom reservation, max-y, and forced stacked/list/lane primitives remove the worst RC-1/RC-2 failures. |
| Diagram-vs-linear gap | about `41 pts` | reduce by `16-24 pts` | A4 does not solve all layout planning, but removes obvious overflow/collision failures. |
| Contrast exit-0 on contrast-labeled FIX | low/partial | `+25-40 pp` | Deterministic contrast gate replaces MiniMax-only judgment for RC-5. |
| Full-batch contrast exit-0 | current baseline | `+8-15 pp` | Contrast failures are concentrated in a smaller subset. |
| Mean MiniMax score on 18 FIX | about `69.5` | `+10-15 pts` raw, `+8-12 pts` adopted | Repairs target named blocking defects, not global redesign. |
| Wall-clock cost | `1.0x` | `1.3-1.5x` full batch | Only 18/45 get a second GLM call and MiniMax rescore. |
| Repaired-tile latency | `1.0x` | `1.7-2.2x` | One extra GLM generation plus gates plus rescore. |

## Decision Rule

Adopt A4 if all conditions hold:

| Gate | Adopt threshold |
|---|---|
| Primary lift | `T1_A4_adopted >= 32/45 SHIP` and `FIX -> SHIP >= 5/18` |
| Active comparator | `T1_A4_adopted` beats `T0_generic_retry` by at least `3` additional conversions, or by `>=8` mean MiniMax points on the 2D cohort |
| Geometry | 2D cohort mean score improves by `>=14 pts`, and at most `1` adopted 2D tile still has blocking overflow/collision/title failure |
| Contrast | Contrast-labeled FIX subset improves by `>=25 pp` exit-0 |
| False-fix | `false_fix_rate <= 1/18`, with zero title-top, uppercase-eyebrow, or off-palette regressions in adopted outputs |
| Cost | Full-batch wall-clock multiplier `<=1.5x`, or documented value/cost exception if SHIP reaches `>=34/45` |

Iterate A4 if any condition holds:

| Result | Action |
|---|---|
| `2-4` conversions | Keep A4 concept, refine adapter regexes and repair JSON specificity |
| Conversions mostly non-2D | Keep A4 for contrast/palette fixes, pair 2D with A1/A5 layout skeletons |
| Good score lift but false-fixes `2/18` | Tighten non-regression snapshot and max fixes per tile |
| T1 does not beat T0 | The second pass matters, but typed MiniMax contract is not justified yet |

Reject A4 as a standalone pipeline step if any condition holds:

| Result | Action |
|---|---|
| `<=1` conversion | Do not adopt |
| `false_fix_rate > 2/18` | Do not adopt |
| 2D gap reduction `<8 pts` | Route diagrams to A1/A5/A7 instead |
| Cost `>1.8x` full batch without `>=7` conversions | Do not adopt |

## Minimal Harness Changes

Current generator path:

` .opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs`

### 1. Add repair-mode inputs

Replace the top import/spec block with:

```js
import fs from 'node:fs';
import path from 'node:path';

const auth = JSON.parse(fs.readFileSync(process.env.HOME + '/.local/share/opencode/auth.json', 'utf8'));
const key = auth['zai-coding-plan'].key;

const specPath = process.argv[2];
const specDir = path.dirname(specPath);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

const arm = process.env.A4_ARM || 'control'; // control | generic | a4
const runId = process.env.A4_RUN_ID || arm;
const auditPath = process.env.A4_AUDIT_JSON || '';
const auditRows = auditPath ? JSON.parse(fs.readFileSync(auditPath, 'utf8')) : [];
const auditByTile = new Map(auditRows.map((row) => [row.tile, row]));

const EP = 'https://api.z.ai/api/coding/paas/v4/chat/completions';

function dataUrl(filePath) {
  return 'data:image/png;base64,' + fs.readFileSync(filePath).toString('base64');
}

function tileSlug(t) {
  return path.basename(t.out).replace(/-glm-\d+\.html$/i, '');
}

function repairOut(t) {
  return arm === 'control' ? t.out : t.out.replace(/\.html$/i, `.${runId}.html`);
}
```

### 2. Add the A4 adapter

Paste below `contract(...)`:

```js
function classifyFixes(row) {
  const issue = row?.issue || '';
  const fixes = [];

  function add(defect_type, rc_ids, required_change, verification, extra = {}) {
    fixes.push({
      id: `fix-${String(fixes.length + 1).padStart(3, '0')}`,
      defect_type,
      rc_ids,
      severity: 'blocking',
      target_region: extra.target_region || 'instrument panel above the reserved bottom title block',
      evidence: issue,
      required_change,
      layout_contract: {
        tile_height_px: 480,
        reserved_bottom_title_block_px: 104,
        diagram_max_bottom_y_px: 348,
        preferred_primitives: ['stacked-list', 'linear-flow', 'bounded-lanes'],
        forbidden: [
          'free 2D absolute node placement',
          'content overlapping title or description',
          'title above diagram'
        ],
        ...extra.layout_contract
      },
      verification
    });
  }

  if (/spill|clipped|clips|cut off|overflows?|bleed|outside rounded corners|past (the )?(panel|card)|overlap[s]? bottom title|pushes content past/i.test(issue)) {
    add(
      'vertical_overflow',
      ['RC-1', 'RC-3'],
      'Reserve the bottom title block first. Keep diagram/content at or above y=348px. Reduce rows/nodes or convert to stacked-list, compact table, or bounded lanes.',
      ['overflow=false', 'title_at_bottom=true', 'diagram_max_bottom_y<=348']
    );
  }

  if (/overlap|collid|crowd|popover|node|branch|hub|matrix|diagram|funnel|connector|truncat/i.test(issue)) {
    add(
      'node_collision',
      ['RC-2'],
      'Replace free 2D placement with stacked-list, linear-flow, or bounded-lane primitives. No node may overlap another node, eyebrow, title, or card edge.',
      ['node_overlap=false', 'eyebrow_overlap=false', 'card_edge_clip=false']
    );
  }

  if (/title.*top|title.*clipped|title.*cut off|title not at bottom|description.*overflow/i.test(issue)) {
    add(
      'title_position',
      ['RC-3'],
      'Keep the title and description bottom-left, unobstructed, and outside the instrument panel.',
      ['title_at_bottom=true', 'title_overlap=false']
    );
  }

  if (/uppercase|all caps|VLOOT-FUNCTIE|glyph|icon|anchor|pin|off-brand|orange|red/i.test(issue)) {
    add(
      'typography_or_icon_contract',
      ['RC-4', 'RC-6'],
      'Preserve Title-case "Vloot-functie", use the anchor eyebrow icon only, remove orange, and use red only for true alerts.',
      ['eyebrow_uppercase=false', 'glyph_contract=anchor_only', 'palette_offbrand=false']
    );
  }

  if (/low contrast|too light|near-illegible|hard to read|grey against|blue-on-blue|readable/i.test(issue)) {
    add(
      'contrast',
      ['RC-5'],
      'Use #0a1a2f or #4e4e4e on light backgrounds and #ffffff or #e7e9ee on navy backgrounds. Do not use #8591b3/#acb3c9/#cbd0dc as text.',
      ['contrast_check.py:exit_0']
    );
  }

  return fixes.slice(0, 3);
}

function a4RepairContract(title, desc, treatment, row, previousCode, renderPath, t) {
  const fixlist = {
    tile_id: `${tileSlug(t)}-${t.n}`,
    round: 2,
    source_auditor: 'MiniMax-M3',
    round1_status: row?.verdict || 'UNKNOWN',
    round1_score: row?.score ?? null,
    render: {
      image_path: renderPath,
      optional_region_bbox_2d: null
    },
    non_regression_snapshot: {
      title_position: row?.title_at_bottom ? 'bottom-left' : 'violated',
      overflow: Boolean(row?.overflow),
      contrast_exit_0: Boolean(row?.readable),
      eyebrow_uppercase: /uppercase|all caps|VLOOT-FUNCTIE/i.test(row?.issue || ''),
      glyph_contract: /glyph|icon|anchor|pin/i.test(row?.issue || '') ? 'verify_anchor_only' : 'matches_original'
    },
    fixes: classifyFixes(row)
  };

  return `You are regenerating one maritime-B2B dashboard bento tile.

Apply only the typed repair contract. Do not reinterpret the product story.

Hard invariants:
1. Canvas height is 480px.
2. Reserve the bottom 104px for title and description.
3. Title and description stay bottom-left and unobstructed.
4. Diagram content must end at or above y=348px.
5. For overflow or node-collision fixes, use stacked-list, linear-flow, or bounded-lane primitives. Do not use free 2D absolute node placement.
6. Preserve the original title, icon/glyph contract, product meaning, and palette.
7. Do not use uppercase eyebrow text.
8. Body/detail text must pass contrast_check.py.
9. Add data-a4-card, data-a4-instrument, data-a4-diagram, and data-a4-title-block attributes so geometry checks can measure the repaired layout.

Original title: "${title}"
Original description: "${desc}"
Original treatment:
${treatment}

Typed repair contract:
${JSON.stringify(fixlist, null, 2)}

Previous MiniMax evidence:
${row?.issue || 'UNKNOWN'}

Previous code:
${previousCode}

Return only the corrected complete HTML document.`;
}

function genericRepairContract(title, desc, treatment, previousCode) {
  return `You are regenerating one maritime-B2B dashboard bento tile.

Fix any visible layout, overflow, contrast, palette, or title-position problems. Do not use external critique findings.

Hard invariants:
1. Canvas height is 480px.
2. Reserve the bottom 104px for title and description.
3. Title and description stay bottom-left and unobstructed.
4. Diagram content must end at or above y=348px.
5. Preserve the original title, icon/glyph contract, product meaning, and palette.
6. Do not use uppercase eyebrow text.
7. Body/detail text must pass contrast_check.py.

Original title: "${title}"
Original description: "${desc}"
Original treatment:
${treatment}

Previous code:
${previousCode}

Return only the corrected complete HTML document.`;
}
```

### 3. Replace request body construction inside `gen(t)`

Replace the current `gen(t)` body construction with:

```js
async function gen(t) {
  const row = auditByTile.get(t.n);
  const out = repairOut(t);

  if (arm !== 'control' && row?.verdict === 'SHIP') return `SKIP_SHIP ${t.n}`;

  if (fs.existsSync(out)) {
    try {
      if (/<\/html>\s*$/i.test(fs.readFileSync(out, 'utf8'))) return `SKIP ${t.n}`;
    } catch {}
  }

  const previousCode = fs.existsSync(t.out) ? fs.readFileSync(t.out, 'utf8') : '';
  const slug = tileSlug(t);
  const renderPath = path.join(specDir, `aud-${slug}-${t.n}.png`);

  let prompt = contract(spec.title, spec.desc, t.brief);
  if (arm === 'a4') prompt = a4RepairContract(spec.title, spec.desc, t.brief, row, previousCode, renderPath, t);
  if (arm === 'generic') prompt = genericRepairContract(spec.title, spec.desc, t.brief, previousCode);

  const content = [
    { type: 'text', text: prompt },
    { type: 'image_url', image_url: { url: dataUrl(spec.refImage) } }
  ];

  if (arm !== 'control' && fs.existsSync(renderPath)) {
    content.push({ type: 'image_url', image_url: { url: dataUrl(renderPath) } });
  }

  const body = {
    model: 'glm-5.2',
    max_tokens: 24000,
    temperature: 0.4,
    thinking: { type: 'disabled' },
    messages: [{ role: 'user', content }]
  };

  for (let a = 1; a <= 5; a++) {
    const started = Date.now();
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), 150000);

    try {
      const r = await fetch(EP, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ac.signal
      });

      clearTimeout(to);
      const j = await r.json();
      let h = (j.choices?.[0]?.message?.content || '')
        .replace(/^```(?:html)?\s*/i, '')
        .replace(/\s*```\s*$/, '')
        .trim();

      const fin = j.choices?.[0]?.finish_reason;
      if ((h.toLowerCase().startsWith('<!doctype') || h.toLowerCase().startsWith('<html')) && /<\/html>\s*$/i.test(h)) {
        fs.writeFileSync(out, h);
        fs.writeFileSync(out + '.meta.json', JSON.stringify({
          arm,
          runId,
          tile: t.n,
          tile_id: `${slug}-${t.n}`,
          source_out: t.out,
          output: out,
          glm_ms: Date.now() - started,
          prompt_chars: prompt.length,
          completion_chars: h.length,
          usage: j.usage || null,
          finish_reason: fin
        }, null, 2));
        return `OK ${t.n} (${h.length}b, ${fin})`;
      }

      if (a === 5) return `FAIL ${t.n} finish=${fin} len=${h.length} (incomplete/no-html)`;
    } catch (e) {
      clearTimeout(to);
      if (a === 5) return `ERR ${t.n} ${e.message}`;
    }

    await new Promise((s) => setTimeout(s, 5000 * a));
  }
}
```

### 4. Audit output schema

For every rescored repair, write rows in this shape:

```json
{
  "arm": "a4",
  "round": 2,
  "tile_id": "accountbeheer-4",
  "tile": 4,
  "score": 78,
  "overflow": false,
  "readable": true,
  "on_brand": true,
  "title_at_bottom": true,
  "verdict": "SHIP",
  "issue": "none",
  "baseline_score": 35,
  "baseline_verdict": "FIX",
  "converted": true,
  "false_fix": false,
  "geometry_pass": true,
  "contrast_exit_0": true,
  "source_html": "accountbeheer-glm-4.html",
  "repair_html": "accountbeheer-glm-4.r2-a4.html",
  "meta": "accountbeheer-glm-4.r2-a4.html.meta.json"
}
```

### 5. Run matrix

Use the existing spec/audit pairs:

| Spec | Audit |
|---|---|
| `spec-accountbeheer.json` | `audit-accountbeheer.json` |
| `spec-oci.json` | `audit-oci.json` |
| `spec-goedkeuring.json` | `audit-goedkeuringssysteem.json` |
| `spec-aangepast-assortiment.json` | `audit-aangepast-assortiment.json` |
| `spec-een-factuur.json` | `audit-een-factuur.json` |
| `spec-favorieten.json` | `audit-favorieten.json` |
| `spec-kwartaalcijfers.json` | `audit-kwartaalcijfers.json` |
| `spec-orders-facturen.json` | `audit-orders-facturen.json` |
| `spec-prijzen-condities.json` | `audit-prijzen-condities.json` |

Example command:

```bash
A4_ARM=a4 A4_RUN_ID=r2-a4 A4_AUDIT_JSON=.opencode/specs/anobel.com/004-bento-visuals/research/inputs/audit-accountbeheer.json node .opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs .opencode/specs/anobel.com/004-bento-visuals/research/inputs/spec-accountbeheer.json
```

Run the same with `A4_ARM=generic A4_RUN_ID=r2-generic` for the active comparator.