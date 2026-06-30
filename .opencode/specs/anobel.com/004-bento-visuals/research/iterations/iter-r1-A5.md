I’m going to treat this as a read-only deep-research iteration, fetch each listed source, and extract implementable mechanisms rather than summarize the papers.# A5 findings

All five candidate URLs fetched successfully.

## What The Sources Actually Say

| Source | Concrete technique | Exact mechanism to reuse |
|---|---|---|
| IFScale, `2507.11538v1` | Treat instruction density as a measurable failure mode, not a prompt-writing problem. | It evaluates prompts with 10 to 500 simultaneous constraints and grades adherence deterministically. It reports threshold, linear, and exponential degradation patterns, primacy effects, and omission-dominant failures under high load. Applicable mechanism: reduce independent prose pins and move checks into deterministic validators. Citation: https://arxiv.org/html/2507.11538v1 §3.2, §4.4, §4.6, §4.8 |
| LaySPA, `2509.16891v2` | Make layout a structured spatial object with explicit rewards. | Layouts are JSON-like element boxes `(x, y, w, h, category)`. Rewards score format validity, boundary adherence, collision, alignment, distribution, spacing, hierarchy, and visual quality. Fine-tuning with spatial rewards reduced collision rate by 36%, improved alignment by 63%, spacing by 73%, distribution by 26%, and format correctness by 14%. Citation: https://arxiv.org/html/2509.16891v2 §2.1-§2.3, §4.1 |
| GeoSVG-RL, `2605.25447` | Use layout-plan-first generation plus browser-backed geometry verification. | The model first receives/predicts a layout plan containing canvas dimensions, node boxes, text assignments, connector endpoints, anchors, and graph connectivity. The verifier renders the SVG in a browser, extracts bounding boxes/text/anchors/edges, then scores canvas fit, overflow, anchor accuracy, text-in-box, padding, graph F1, and cleanliness. Plan prompting alone improved prompt-only metrics, while verifier reranking and RL produced much larger gains. Citation: https://arxiv.org/html/2605.25447 §3.1-§3.5, §4.1, §4.6 |
| DCGen, `2406.16386v1` | Divide visual generation into bounded regions, then assemble. | Full-screenshot UI generation failed mostly by omission and misarrangement: 1,450/1,699 omitted elements, 216/1,699 misarranged, only 40/1,699 correct. Cropping failed regions improved similarity from 73.7% to 76.0%. DCGen recursively splits screenshots along explicit/implicit separation lines, solves leaf segments, then assembles parent regions. Citation: https://arxiv.org/html/2406.16386v1 §4.2-§5.2 |
| Towards AI SVG article | Replace coordinate token guessing with computed grid tools and fail-first validators. | The article’s rule is “grid before anything is drawn.” It uses computed primitives, snap-to-grid anchors, A* connector routing, free-region detection, callout overlap solving, WCAG contrast checks, alignment checks, connector checks, and collision checks. Applicable mechanism: GLM expresses intent; upstream tools compute coordinates and reject broken geometry. Citation: https://pub.towardsai.net/stop-fixing-your-ai-svgs-715df70ccca0 |

## How It Maps To THIS Run’s Defects

RC-1 vertical overflow is directly a missing global-fit constraint. GeoSVG-RL’s `GFR`, `OAR`, and `EICR` map exactly to the observed failures: 8 audit rows had `overflow:true`, accountbeheer-4 spilled the 4th matrix row into the bottom title, orders-facturen-4 clipped the title off the card, and aangepast-assortiment-3 let the 6th row plus legend collide with the title.

RC-2 node collisions are the same failure class LaySPA and GeoSVG-RL optimize: pairwise collision/overlap and anchor geometry. This maps to oci-4 where `Verbonden` overlaps the SAP card and truncates `MS V...`, plus absolute-position counts of 6 in oci-4, 4 in accountbeheer-4, and 4 in goedkeuringssysteem-4.

RC-3 title-at-bottom failures are a region-ownership issue. DCGen’s segmentation finding applies: solve bounded visual regions separately. The title block should not be another prose instruction competing with the diagram; it should be a reserved region that the diagram cannot enter. This maps to `title_at_bottom:false` in goedkeuringssysteem-4, aangepast-assortiment-3, and orders-facturen-4.

RC-4 uppercase/glyph errors are instruction-density fallout. IFScale supports that models drop/omit constraints under load; in this run, non-layout pins were dropped while the model was spending capacity on hard geometry: `text-transform:uppercase` appeared 3 times in goedkeuringssysteem-4, 2 times in aangepast-assortiment-3, and 1 time in accountbeheer-4.

The key source convergence: none of the sources says “add more prose.” They say reduce model-owned geometry, provide structure, verify rendered output.

## Concrete, Testable Recommendation

Add one pipeline step before GLM for any `matrix`, `node`, `routing`, `funnel`, or `popover` treatment:

```text
PIPELINE STEP: A5_SKELETON_FIRST_2D

If tile.treatment in ["matrix", "node", "routing", "funnel", "popover"]:
  1. Compute a 480px-height safe-zone skeleton upstream.
  2. Reserve the bottom title block before placing any diagram content.
  3. Place rows/nodes/connectors with deterministic AABB checks.
  4. Feed GLM the skeleton as the only allowed geometry source.
  5. Keep prose to mechanical rendering instructions only.
  6. Browser-verify overflow, collisions, title_at_bottom, uppercase, contrast, and connector anchors.
  7. If verifier fails, adjust skeleton or downgrade to compact table/linear flow; do not ask GLM to invent new coordinates.
```

Copy-pasteable skeleton contract:

```json
{
  "layout_mode": "skeleton_first_2d",
  "canvas": { "w": 480, "h": 480 },
  "regions": {
    "eyebrow": { "x": 24, "y": 24, "w": 432, "h": 24 },
    "diagram": { "x": 24, "y": 64, "w": 432, "h": 276 },
    "title": { "x": 24, "y": 360, "w": 432, "h": 96 }
  },
  "constraints": {
    "title_region_reserved": true,
    "diagram_must_not_intersect_title": true,
    "min_node_gap_px": 16,
    "min_text_padding_px": 10,
    "connector_standoff_px": 4,
    "matrix_max_rows_with_legend": 4,
    "matrix_max_rows_without_legend": 5,
    "if_content_exceeds_budget": "summarize_or_convert_to_compact_table"
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
    "Use these regions and coordinates exactly.",
    "Do not invent absolute positions, transforms, row heights, connector endpoints, or extra rows.",
    "Render the title and description only inside regions.title.",
    "Render diagram content only inside regions.diagram.",
    "Use Title case for eyebrow text; do not use text-transform: uppercase.",
    "Use supplied palette tokens only."
  ]
}
```

Recommended dial preset:

```yaml
preset: Product_A5_skeleton_first_2d
register: Product
base_dials: V4/M2/D6
applies_to:
  - matrix
  - node
  - routing
  - funnel
  - popover
prose_budget:
  max_independent_constraints: 8
geometry_owner: upstream_skeleton
glm_role: mechanical_renderer
title_safe_zone_px: 120
diagram_safe_zone_px: 276
matrix_row_cap:
  with_legend: 4
  without_legend: 5
verification_required:
  - overflow == false
  - node_collision_count == 0
  - title_at_bottom == true
  - uppercase_eyebrow_count == 0
  - contrast_exit_code == 0
fallback:
  on_overflow: compact_table
  on_collision: recompute_skeleton
  on_second_failure: linear_flow_tile
```

## Predicted Effect And Cost

Expected 2D tile effect: overflow should drop from 8 known audit rows to 1-2 residual text-measurement misses if browser verification is used. Node collisions should drop by roughly 50-70% because the model no longer owns direct coordinate invention. Title-at-bottom should recover to near 100% on 2D tiles because the title block becomes a reserved region, not a prose rule.

Expected SHIP effect: baseline is 27/45 = 60% SHIP. On the roughly 10 2D-positioned tiles, expect +4 to +7 additional SHIP outcomes after skeleton-first plus verifier, moving the run to about 31-34/45 = 69-76% SHIP. Without verifier, expect closer to +2 to +4.

Expected diagram-vs-linear delta: current 2D diagrams score 35-58 while linear tiles score 86-94, about a 41-point gap. Skeleton-first should close roughly 40-60% of that gap, lifting weak 2D tiles into the 70-82 band rather than full parity.

Expected contrast: no regression if palette tokens remain enforced. Contrast should stay exit-0 because this change moves geometry out of prose and does not loosen color constraints.

Cost: skeleton JSON adds about 400-900 prompt tokens per 2D tile but should replace 600-1,000 tokens of dense layout prose, so net token cost is roughly -200 to +300. CPU skeleton generation is negligible. Browser verification adds roughly 0.2-1.0s per tile with a warm browser. Optional K=2 reranking roughly doubles GLM latency but should be reserved for verifier failures.

## Open Questions For The Next Iteration

Does GLM-5.2 obey numeric skeleton coordinates better as CSS variables, inline styles, or data attributes consumed by existing components?

What is the smallest skeleton that still prevents RC-1 and RC-2: full coordinates for every element, or only safe zones plus row/node caps?

Should the A6 planner compute one skeleton or generate 3 candidates and choose by AABB score before GLM?

What is the real title block height needed across Dutch copy lengths: 96px, 112px, or 120px?

Can the post-render verifier use the same audit rows already producing `overflow:true`, extended with AABB node collision and title-region intersection checks?