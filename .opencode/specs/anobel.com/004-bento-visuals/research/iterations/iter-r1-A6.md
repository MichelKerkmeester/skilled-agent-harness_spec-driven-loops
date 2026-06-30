Research-only task; no spec-folder gate is needed because I won’t modify files. I’ll load the deep-research workflow guidance, then fetch each listed source URL and extract implementation-level mechanisms.The GLM docs fetched cleanly. The AdaCoder PDF returned raw PDF bytes and DesignerlyLoop exceeded the fetch size limit, so I’m fetching the corresponding arXiv/HTML views to recover the paper mechanisms while preserving the failed-PDF note.# A6 findings

## What the sources actually say

| Source | Fetch status | Concrete technique + mechanism |
|---|---:|---|
| `https://docs.z.ai/guides/vlm/glm-4.6v` | Fetched | GLM-4.6V is positioned for multimodal frontend replication: upload screenshot/design file, model identifies layout/components/colors, then emits HTML/CSS/JS. It also supports visual debugging: user marks a screenshot region and gives a natural-language correction, and the model locates/corrects the corresponding code snippet. It has 128K context and Flash/FlashX variants, including a free/lightweight option. |
| `https://arxiv.org/pdf/2504.04220` | PDF returned raw bytes via `webfetch`; used arXiv abs + HTML fallback | AdaCoder’s key mechanism is adaptive planning: first let the base model generate directly with no planning, run cheap/scripted tests, then only add a planning agent after failure. Their Phase 2 uses rule-based debugging for superficial errors plus an LLM planner that generates a step-by-step plan from specific error feedback. The paper reports planning can help, but always-on multi-plan systems are expensive; AdaCoder reports +27.69% Pass@1 over MapCoder, 16x faster inference, and 12x lower token use. Citation fallback: `https://arxiv.org/abs/2504.04220`, `https://ar5iv.labs.arxiv.org/html/2504.04220`. |
| `https://arxiv.org/pdf/2511.15331` | PDF exceeded fetch size; used arXiv abs + HTML fallback | DesignerlyLoop’s mechanism is curated reasoning: separate design intent from LLM reasoning, expose both as editable node-link structures, and let users add/delete/reorder/regenerate reasoning nodes. The system maps a design goal into structured prompts with task, requirements, context, output, and examples; then generates sequential/parallel reasoning chains classified by reasoning mode and design stage. Citation fallback: `https://arxiv.org/abs/2511.15331`, `https://ar5iv.labs.arxiv.org/html/2511.15331`. |

## How it maps to THIS run’s defects

| Defect | Mapping |
|---|---|
| RC-1 vertical overflow | AdaCoder says don’t spend planning where native generation works; add planning when direct generation fails. Here, linear tiles already score 86-94, while 2D diagram tiles hit 35-58. The “failure-triggered planning” analogue is GPT-5.5 geometry planning only for diagram-risk tiles. |
| RC-2 node collisions | DesignerlyLoop supports externalizing reasoning as editable node-link structure. For this project, the missing reasoning object is not prose intent; it is a prevalidated geometry skeleton: explicit boxes, rows, edges, gaps, and reserved title area before GLM renders. |
| RC-3 title-at-bottom break | The diagram claims the whole 480px canvas. The fix is a skeleton-level reserved zone: GLM must receive a hard `diagramFrame` and `titleFrame`, not a soft prose reminder. |
| RC-4 uppercase/glyph drift | This is a prompt-contract/detail-loss issue. The skeleton/spec should carry explicit text constraints: Title Case eyebrow, no CSS `text-transform: uppercase`, fixed glyph token, and grep gate. |
| GLM render-leg question | GLM-4.6V has documented frontend replication and visual debugging strengths, but the source does not show it solves constraint planning/collision avoidance. Test it as a shadow renderer, not as the first fix. |

## Concrete, testable recommendation

Recommended role: **GPT-5.5 as A5 coordinate-skeleton author for 2D-risk tiles only**.

Do not use GPT-5.5 as an all-tile spec author. Do not use GPT-5.5 as the primary co-auditor. Use cheap deterministic gates plus MiniMax for audit; reserve GPT audit only for disagreement cases.

Copy-pasteable pipeline step:

```yaml
A6_GPT55_PAIRING:
  register: Product
  base_dials: V4/M2/D6
  role: gpt-5.5-skeleton-author
  trigger:
    use_gpt55_if:
      - layoutPrimitive in [matrix, flow, hub, branch, popover, node-diagram]
      - itemCount > 4 and layout is not linear
      - brief requires cross-links, pills, overlays, branching, or connector lines
    skip_gpt55_if:
      - layoutPrimitive in [linear, stack, simple-kpi, timeline, text-card]
  cost_rule:
    max_gpt55_calls_per_tile: 1
    max_gpt55_tokens_per_2d_tile: 3700
    max_gpt55_calls_per_incremental_ship: 5
    no_gpt55_for_linear_tiles: true
  render_leg:
    default: glm-5.2
    shadow_test: glm-4.6v-flash-or-flashx on same skeleton only
    promote_shadow_renderer_only_if: diagram_score_delta >= 5 and no linear regression
```

Skeleton prompt contract:

```text
You are the geometry skeleton author for a 480px-high maritime B2B dashboard bento tile.
You do not write final UI code. You produce a prevalidated JSON layout skeleton for GLM to render.

Hard canvas contract:
- Tile height is 480px.
- Reserve bottom title block: titleFrame = { x: 24, y: 368, w: "calc(100% - 48px)", h: 88 }.
- Diagram content must fit inside diagramFrame = { x: 24, y: 24, w: "calc(100% - 48px)", h: 312, maxY: 336 }.
- Keep at least 32px vertical gap between diagramFrame and titleFrame.
- No node, row, legend, connector label, eyebrow, pill, or popover may exceed diagramFrame.
- Title and description must render bottom-left inside titleFrame.

Diagram constraints:
- Minimum bbox gap between nodes: 16px.
- Minimum bbox gap between text labels and nodes: 12px.
- Matrix/list diagrams may show at most 4 visible rows.
- If source has more than 4 rows, collapse the remainder into one "+N more" row.
- Row height must be 36-42px; row gap must be 6-8px.
- Legend is optional; include it only if it fits inside diagramFrame.
- Edge labels and status pills need their own bbox and may not overlap nodes.
- Avoid CSS text-transform uppercase. Eyebrow must be Title Case.
- Use the intended anchor glyph only; never substitute a move/cross-arrows glyph.
- Prefer CSS grid/flex. If absolute positioning is needed, use only the emitted bboxes.

Return JSON only:
{
  "layoutPrimitive": "...",
  "riskFlags": ["RC-1", "RC-2", "RC-3", "RC-4"],
  "zones": {
    "diagramFrame": { "x": 24, "y": 24, "w": "calc(100% - 48px)", "h": 312, "maxY": 336 },
    "titleFrame": { "x": 24, "y": 368, "w": "calc(100% - 48px)", "h": 88 }
  },
  "nodes": [
    { "id": "...", "text": "...", "bbox": { "x": 0, "y": 0, "w": 0, "h": 0 }, "role": "..." }
  ],
  "rows": [],
  "edges": [],
  "overflowPlan": { "maxVisibleRows": 4, "collapseRemainderAs": "+N more" },
  "textRules": { "eyebrowCase": "Title Case", "forbidUppercaseTransform": true, "glyph": "anchor" },
  "validation": {
    "allContentWithinDiagramFrame": true,
    "titleAtBottom": true,
    "overlapPairs": [],
    "minGapPx": 16,
    "maxContentY": 0
  }
}
```

Post-render gates:

```text
Required SHIP gates for A6:
- overflow == false
- title_at_bottom == true
- bbox_overlap_pairs == []
- diagram.maxY <= 336
- titleFrame.y >= 368
- grep("text-transform: uppercase") == 0
- absolute_position_count <= skeleton.nodes.length + skeleton.edges.length
- MiniMax score improves or remains >= baseline arm
```

## Predicted effect + cost

| Arm | Expected lift | Cost profile |
|---|---:|---|
| GPT-5.5 skeleton-author for 2D only | Best value. Expected +18 to +28 points on failing diagram tiles; +5 to +8 additional SHIPs over 45 if most current failures are diagram-layout failures. Overall SHIP rate likely moves from 27/45 = 60% to roughly 32-35/45 = 71-78%. | One GPT-5.5 call only on 2D-risk tiles. Target ≤3.7K GPT tokens per 2D tile. If half the subset is 2D, average GPT load is ≤1.85K tokens/tile. |
| GPT-5.5 per-tile spec author | Lower value. Likely helps RC-4 and some RC-3, but prose specs still leave RC-1/RC-2 geometry underspecified. Linear tiles at 86-94 likely get near-zero lift. | One paid call for every tile, including already-good linear tiles. Worse cost per adopted SHIP. |
| GPT-5.5 co-auditor | Useful as a tie-breaker, not primary lift. It detects RC-1/RC-2/RC-3 after GLM has already rendered; without a rerender loop it does not improve SHIP rate. | One paid call per audited tile plus possible rerender. Use only when deterministic gates and MiniMax disagree. |
| GLM-4.6V/Flash render swap | Worth a shadow test because docs claim frontend replication and visual debugging, but no evidence it fixes planning geometry. | Cheap/free variants may reduce render cost, but should not replace GLM-5.2 unless same-skeleton A/B shows ≥5 diagram-score lift with no linear regression. |

Contrast prediction: no meaningful change if palette stays unchanged. The A6 intervention targets layout geometry; contrast exit-0 should remain exit-0 unless the renderer changes colors.

Diagram-vs-linear delta prediction: current gap is roughly 35-58 vs 86-94. Skeleton-author should compress the gap by about half if GLM follows the skeleton, moving weak diagram tiles into the 70s/low 80s while linear tiles stay flat.

## Open questions for the next iteration

- How many of the 45 tiles are truly 2D-risk by the trigger rule? That determines GPT spend.
- Does GLM-5.2 obey JSON skeletons, or does GPT-5.5 need to output an HTML/CSS scaffold instead of only geometry JSON?
- What is the actual GPT-5.5 price table in this environment? Use it to convert the `max_gpt55_calls_per_incremental_ship: 5` rule into dollars.
- Can the audit add a real bbox-overlap gate? RC-2 is currently partly refinement, not fully machine-gated.
- Does GLM-4.6V Flash/FlashX beat GLM-5.2 on the same skeleton? The docs justify testing, not replacing.