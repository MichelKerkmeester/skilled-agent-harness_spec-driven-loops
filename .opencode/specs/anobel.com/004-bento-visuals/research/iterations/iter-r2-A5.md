Treating this as read-only research synthesis. I’ll first recover any relevant saved context and route the research workflow, then fetch only the remaining source material needed to close the open questions.SKILL ROUTING: deep-loop-workflows recommended with confidence 0.879 for this read-only deep research synthesis; I’m loading it and will keep the work non-mutating.The routing hub maps this to research mode, so I’m resolving the nested packet before fetching sources.The formal `/deep:research` packet workflow is command-owned and would write state; this request asks for a read-only final recommendation in-chat, so I’m using the skill guidance for source-backed synthesis only and not creating research artifacts.The primary A5 sources are now rechecked. I’m doing one additional fetch for the A6 adaptive-planning source because it directly answers whether to always generate multiple skeletons or only escalate after verifier failure.# A5 FINAL recommendation

## The exact change

Replace prose-owned 2D layout instructions with `A5_SKELETON_FIRST_2D_V2`.

```text
PIPELINE STEP: A5_SKELETON_FIRST_2D_V2

If tile.treatment in ["matrix", "node", "routing", "funnel", "popover"]:
  1. Measure Dutch title + description copy before prompting GLM.
  2. Reserve the bottom title region first.
  3. Compute a 480x480 skeleton with explicit regions, row/node boxes, anchors, and connector routes.
  4. Run deterministic AABB checks before GLM:
     - no diagram/title intersection
     - no node/row collisions
     - all text boxes have padding budget
     - all connectors terminate on declared anchors
  5. Feed GLM the skeleton as a rendering contract, not as layout inspiration.
  6. GLM may choose copy, semantic emphasis, component variant, and palette tokens.
  7. GLM must not invent x/y/w/h, absolute positions, transforms, row heights, connector endpoints, or extra rows.
  8. Render in browser and verify overflow, collisions, title_at_bottom, uppercase, contrast, text padding, and connector anchors.
  9. If verifier fails once, recompute up to 3 skeleton candidates and choose the best AABB score.
  10. If verifier fails twice, downgrade to compact_table or linear_flow_tile.
```

```json
{
  "layout_mode": "skeleton_first_2d_v2",
  "canvas": { "w": 480, "h": 480 },
  "regions": {
    "eyebrow": { "x": 24, "y": 24, "w": 432, "h": 24 },
    "diagram": { "x": 24, "y": 64, "w": 432, "h": 252 },
    "title": { "x": 24, "y": 344, "w": 432, "h": 112 }
  },
  "constraints": {
    "title_region_reserved": true,
    "diagram_max_y": 320,
    "diagram_title_gap_px": 24,
    "bottom_margin_px": 24,
    "min_node_gap_px": 16,
    "min_text_padding_px": 10,
    "connector_standoff_px": 4,
    "matrix_max_rows_with_legend": 4,
    "matrix_max_rows_without_legend": 5,
    "min_font_px": 13,
    "if_title_overflows_112px": "summarize_description_or_downgrade",
    "if_diagram_exceeds_budget": "compact_table_or_linear_flow_tile"
  },
  "coordinate_transport": {
    "canonical": "skeleton_json_consumed_by_renderer",
    "audit_tags": ["data-a5-region", "data-a5-id"],
    "renderer_geometry": "inline_style_or_css_variables_generated_from_skeleton",
    "forbid_glm_coordinate_text": true
  },
  "nodes": [
    {
      "id": "sap",
      "label": "SAP",
      "box": { "x": 40, "y": 132, "w": 128, "h": 56 },
      "anchors": { "E": [168, 160], "W": [40, 160] }
    }
  ],
  "connectors": [
    {
      "from": "sap.E",
      "to": "catalog.W",
      "route": [[168, 160], [248, 160], [248, 220], [304, 220]]
    }
  ],
  "glm_rules": [
    "Render only from this skeleton.",
    "Do not create coordinates, transforms, row heights, connector endpoints, or extra rows.",
    "Render title and description only inside regions.title.",
    "Render diagram content only inside regions.diagram.",
    "Use Title case for eyebrow text; do not use text-transform: uppercase.",
    "Use supplied palette tokens only."
  ]
}
```

```yaml
preset: Product_A5_skeleton_first_2d_v2
register: Product
base_dials: V4/M2/D6
applies_to:
  - matrix
  - node
  - routing
  - funnel
  - popover
geometry_owner: upstream_skeleton
glm_role: mechanical_renderer
title_content_region_px: 112
title_safe_band_px: 136
diagram_region_px: 252
prose_budget:
  max_independent_constraints: 8
matrix_row_cap:
  with_legend: 4
  without_legend: 5
verification_required:
  - overflow == false
  - diagram_intersects_title == false
  - node_collision_count == 0
  - text_padding_violation_count == 0
  - connector_anchor_error_count == 0
  - title_at_bottom == true
  - uppercase_eyebrow_count == 0
  - contrast_exit_code == 0
fallback:
  first_failure: recompute_best_of_3_skeletons
  overflow: compact_table
  collision: recompute_skeleton
  second_failure: linear_flow_tile
```

Verifier row extension:

```json
{
  "tile_id": "string",
  "treatment": "matrix|node|routing|funnel|popover",
  "layout_mode": "skeleton_first_2d_v2",
  "overflow": false,
  "diagram_intersects_title": false,
  "node_collision_count": 0,
  "text_padding_violation_count": 0,
  "connector_anchor_error_count": 0,
  "title_at_bottom": true,
  "uppercase_eyebrow_count": 0,
  "contrast_exit_code": 0,
  "fallback_triggered": "none|recompute_best_of_3|compact_table|linear_flow_tile",
  "ship_gate": "PASS|FAIL"
}
```

Coordinate-format decision: do not test whether GLM obeys CSS variables vs inline styles vs data attributes. Remove that choice from GLM. The skeleton JSON is canonical. The renderer emits exact inline style or CSS variables from the skeleton. Data attributes are only for audit lookup.

## Why it works

A5’s defect is not “bad prompting”; it is model-owned geometry. The fix moves 2D layout from token prediction into a deterministic skeleton plus rendered verifier.

RC-1 vertical overflow is fixed by a global fit contract: `diagram_max_y`, reserved `title`, browser overflow checks, and fallback when measured text does not fit. GeoSVG-RL uses plan-first generation plus browser-backed geometry extraction and scores global fit, overflow, and element-in-canvas directly. [SOURCE: https://arxiv.org/html/2605.25447 §3.1-§3.5, §4.1]

RC-2 node collisions are fixed by explicit boxes, AABB gaps, anchor endpoints, and connector routes before GLM sees the prompt. LaySPA represents layouts as `(x, y, w, h, category)` and improves collision, alignment, spacing, and distribution through explicit spatial rewards. [SOURCE: https://arxiv.org/html/2509.16891v2 §2.1-§2.3, §4.1]

RC-3 title-at-bottom failures are fixed by region ownership. The title is not another instruction competing with diagram content; it is a reserved region the diagram cannot enter. DCGen and LaTCoder both show that bounded regions reduce misarrangement in design-to-code tasks. [SOURCE: https://arxiv.org/html/2406.16386v1 §4.2-§5.2] [SOURCE: https://arxiv.org/html/2508.03560v1 §3.1-§3.3]

RC-4 uppercase/glyph errors are fixed by reducing independent prose pins and moving checks into validators. IFScale shows instruction adherence degrades with instruction density, with omission-dominant failures and primacy effects. [SOURCE: https://arxiv.org/html/2507.11538v1 §3.2, §4.4-§4.8]

The “best-of-3 skeletons only after failure” rule follows AdaCoder’s adaptive planning pattern: start cheap, test, then add planning only when failure feedback proves it is needed. [SOURCE: https://ar5iv.labs.arxiv.org/html/2504.04220 §IV-A]

## Predicted effect

SHIP rate: from `27/45 = 60%` to roughly `32-34/45 = 71-76%` if the verifier and fallback are enforced on the ~10 weak 2D tiles. Without browser verification, expect closer to `30-32/45 = 67-71%`.

Diagram-vs-linear delta: current gap is ~41 points. Expected closure is ~45-60% of that gap, reducing it to ~16-23 points. Weak 2D tiles currently scoring `35-58` should move into roughly `65-82` when content fits the row/node caps.

Contrast: expected to remain exit-0 because palette tokens are unchanged and contrast remains a hard verifier gate.

Cost: skeleton JSON adds ~500-1,100 prompt tokens per 2D tile but replaces dense layout prose, so net prompt cost is roughly `-100` to `+400` tokens per affected tile. Skeleton computation is negligible. Warm browser verification adds ~0.2-1.0s per tile. Best-of-3 skeleton recompute should stay cheap because it is upstream geometry, not three GLM calls.

## Synergies + conflicts with sibling angles

A1 synergy: LaTCoder-style bounded regions and BBoxes align directly with A5. A1 can operate at page/block level; A5 applies the same principle inside each 480px tile.

A2 synergy: Chain-of-Rubrics becomes the verifier checklist. Conflict only if A2 turns into more prose instructions; A5 wants machine checks, not more natural-language pins.

A3 synergy: visual self-refine is useful after verifier failure, especially with circled/boxed failed regions. Conflict if GLM is allowed to “fix” coordinates freely; it should request a recomputed skeleton or rerender from the contract.

A4 synergy: bounding-box critique maps cleanly to A5’s `data-a5-id` audit tags and DOM geometry extraction. Conflict if critique remains descriptive instead of feeding deterministic skeleton correction.

A6 synergy: adaptive planning answers the one-vs-three skeleton question. Generate one skeleton first, then best-of-3 only after verifier failure. Conflict with always-on multi-plan generation due to token/latency cost.

A7 synergy: reinforces the same LaTCoder + IFScale + LaySPA basis. A5 is the concrete productized version for maritime-B2B bento 2D treatments.

## Confidence + residual risk

Confidence: 0.82.

High confidence: moving geometry out of GLM and into skeleton plus verifier directly targets the observed failures.

Medium confidence: exact SHIP lift and the `112px` title content height. The title region should be measured against production Dutch copy and fonts; if copy exceeds 112px, summarize or downgrade rather than shrinking below legible type.

Residual risks: production font metrics may differ from the verifier environment, dense matrices may still exceed the diagram budget, and a skeleton renderer must exist or be added. The key guardrail is non-negotiable: if the browser verifier fails twice, do not ask GLM for another coordinate-heavy retry; downgrade the treatment.