I’ll treat this as read-only research synthesis, first surfacing any indexed context and skill routing, then fetching only the remaining source gaps before producing the final A7 recommendation.SKILL ROUTING: advisor was ambiguous. I’m applying `deep-loop-workflows` for the iteration/research discipline and `sk-prompt-models` for model-specific prompt/constraint design; I’m not dispatching `cli-opencode` because no external executor was requested.I found the likely source gaps: DiagramEval was only PDF bytes, Self-Refine’s paper source was not fully extracted, and GLM-5.2-specific multimodal/tool-loop support is still unconfirmed. I’m fetching those now and checking the GLM-5.2 model profile before final synthesis.# A7 FINAL recommendation

## The exact change

Implement **Bento Geometry Kernel V2**: GLM writes a compact semantic plan, but **all 2D placement is computed and audited outside the model**.

```text
BENTO_GEOMETRY_KERNEL_V2

Card:
- Canvas: 480x480.
- Outer padding: 24.
- No rendered element may leave [0,0,480,480].

Fixed regions:
- eyebrow: x=24 y=20  w=432 h=24
- visual:  x=24 y=64  w=432 h=264
- title:   x=24 y=352 w=432 h=104

Hard rules:
- Title region is always reserved. First title baseline must be y >= 368.
- Visual content must end at y <= 328.
- Gap between visual and title must be >= 24.
- GLM may not invent absolute pixel positions.
- GLM may only choose: tile_type, density, nodes, labels, edges, emphasis, and semantic grouping.
- Renderer computes all bboxes from templates.
- If nodes > 5, rows > 3, or edges > 6, auto-convert to linearized layout.
- Eyebrow must be Title Case. No `text-transform: uppercase`.
- Text contrast must be >= 4.5:1. Object/line contrast must be >= 3:1.
- No `#4e4e4e`.
- No fallback anchor/move glyphs. Use approved icon tokens only.
- Every rendered node must include `data-bento-id`.
- Every connector must include `data-edge-from`, `data-edge-to`, and computed endpoint anchors.

Allowed layout modes:
- `linear-flow`: 2-5 steps, left-to-right or top-to-bottom.
- `hub-spoke`: 1 hub + <=4 spokes.
- `matrix-3`: <=3 rows, <=3 columns.
- `stacked-rows`: <=3 rows with icon + label + metric.
- `mini-map`: background zones only, <=4 labeled markers.
- `linearized`: fallback for over-budget diagrams.

Required GLM output before code:
{
  "schema": "bento_plan_v2",
  "tile_id": "string",
  "tile_type": "linear-flow|hub-spoke|matrix-3|stacked-rows|mini-map",
  "density": "low|medium",
  "register": "Product V4/M2/D6",
  "copy": {
    "eyebrow": "Title Case string",
    "title": "1-2 line title",
    "description": "optional short line"
  },
  "visual": {
    "nodes": [
      {
        "id": "n1",
        "label": "short label",
        "role": "source|hub|process|risk|outcome|metric|location",
        "importance": 1
      }
    ],
    "edges": [
      {
        "from": "n1",
        "to": "n2",
        "relation": "flows-to|depends-on|alerts|routes|aggregates"
      }
    ]
  },
  "style_tokens": {
    "background": "bg.maritime.950",
    "surface": "surface.maritime.900",
    "text_primary": "text.inverse",
    "text_secondary": "text.muted.highContrast",
    "accent": "accent.cyan.300",
    "warning": "accent.gold.400"
  }
}

Renderer mapping:
- `linear-flow`: slots = 5 max, equal width, connector route = orthogonal center-to-center.
- `hub-spoke`: hub centered in visual region, spokes on compass slots, connectors routed around labels.
- `matrix-3`: rows = min(3), fixed row height, no internal free positioning.
- `stacked-rows`: row height = 72, icon box = 36, label max 2 lines.
- `mini-map`: background path/zone is decorative only; markers use computed grid slots.
- `linearized`: convert nodes to `stacked-rows`, drop non-critical decorative edges first.

Acceptance gate:
Reject candidate if any condition is true:
- Any rendered bbox leaves the 480x480 canvas.
- Any visual bbox has y + h > 328.
- Any title/description bbox starts before y=352.
- Any visual bbox intersects title region.
- Any pairwise non-connector overlap area > 4px.
- Any connector endpoint is > 4px from its declared anchor.
- Any text contrast < 4.5:1.
- Any object or connector contrast < 3:1.
- CSS contains `text-transform: uppercase`.
- Eyebrow wraps to more than 1 line.
- Render contains unapproved glyphs.
- Rendered node count differs from plan node count.
- Rendered directed edges differ from plan edges unless layout mode is `linearized`.

Candidate policy:
- Generate n=3 plans.
- Render all three deterministically.
- Score with hard gates first, then rubric score.
- Accept highest passing candidate.
- If none pass, run one Self-Refine repair using only measured audit failures.
- If repair still fails, downgrade to `linearized`.
```

Pipeline step:

```text
1. GLM-5.2 receives reference image/style context + BENTO_GEOMETRY_KERNEL_V2.
2. GLM outputs only `bento_plan_v2` JSON.
3. Deterministic renderer converts plan to React/HTML/SVG.
4. Browser audit measures DOM/SVG bboxes, text metrics, contrast, connectors, and graph edges.
5. Rerank n=3 candidates by pass count and rubric score.
6. One repair pass only if audit fails, with numeric failure feedback.
7. Ship only audit-exit-0 output.
```

Dial preset:

```text
Product V4/M2/D6 + Geometry Kernel

model: GLM-5.2
framework: COSTAR
thinking: disabled for large vision-to-code generation
candidates: 3
temperature: low
plan_required: true
renderer_owns_coordinates: true
max_nodes: 5
max_rows: 3
max_edges: 6
title_region: [24,352,432,104]
visual_region: [24,64,432,264]
repair_passes: 1
fallback: linearized
```

## Why it works

The defect is not visual taste. It is the model being asked to invent reliable 2D geometry. A7 should remove that burden.

| Mechanism | Fixes | Source |
|---|---|---|
| Region-first decomposition reduces global layout inference. | RC-1, RC-2, RC-3 | LaTCoder block/BBox generation and assembly: https://arxiv.org/html/2508.03560v1 |
| Short hard-rule contract avoids instruction-density omissions. | RC-3, RC-4, RC-5 | IFScale instruction-density decay and primacy effects: https://arxiv.org/html/2507.11538v1 |
| Structured plan with collision/alignment/spacing rewards converts layout into measurable state. | RC-1, RC-2, RC-7 | LaySPA spatial rewards: https://arxiv.org/html/2509.16891v2 |
| Browser geometry audit catches real overflow, text-in-box, anchors, and padding. | RC-1, RC-2, RC-3, RC-5 | GeoSVG-RL plan-first verification: https://arxiv.org/html/2605.25447 |
| Rubric gates convert prose requirements into binary checks. | RC-3, RC-4, RC-5 | Chain-of-Rubrics: https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework |
| One measured repair pass improves failed candidates without unconstrained iteration. | RC-1, RC-2, RC-4, RC-5 | Self-Refine reports iterative feedback/refinement without training and about +20% absolute average task improvement: https://arxiv.org/abs/2303.17651 |
| Graph extraction checks whether diagram nodes and paths match the plan. | RC-2, RC-7 | DiagramEval node/path alignment and human-correlation evidence: https://arxiv.org/html/2510.25761 |
| GLM is used as generator, not trusted as auditor. | RC-5, RC-7 | GLM-4.6V docs support visual debugging/tool loops; GLM-5.2 public docs list text input and function calling, so deterministic audit remains mandatory: https://docs.z.ai/guides/vlm/glm-4.6v and https://docs.z.ai/guides/llm/glm-5.2 |

Resolved open questions:

| Question | Resolution |
|---|---|
| Is `88px` enough for title/description? | Use `104px` reserved title region. First title baseline starts at `y >= 368`; the whole title block starts at `y=352`. |
| SVG, HTML/CSS, or React DOM? | Make the audit format-agnostic by requiring `data-bento-id` and edge attributes in rendered DOM/SVG. |
| Convert low-scoring 2D diagrams to linear flows? | Yes. Auto-linearize when `nodes > 5`, `rows > 3`, or `edges > 6`. |
| Palette replacement for `#4e4e4e`? | Use semantic tokens and audit actual contrast. Default fallback: dark maritime surfaces, high-contrast inverse text, cyan/gold accents. |
| Does GLM-5.2 provide reliable visual feedback? | Treat GLM-5.2 as generator only. Use browser metrics for hard gates; use GLM/visual model feedback only after deterministic failures are named. |

## Predicted effect

| Metric | Current | Predicted with A7 |
|---|---:|---:|
| SHIP rate | `27/45 = 60%` | `34-37/45 = 76-82%` |
| Net SHIP delta | baseline | `+7` to `+10` tiles |
| Diagram-vs-linear delta | about `41 pts` | about `11-19 pts` |
| Low diagram tile scores | `35-58` | `72-82` for accepted outputs |
| Contrast exit-0 | inconsistent | `100%` for accepted outputs, because contrast is hard-reject |
| Overflow/title failures | recurring | expected near-zero in accepted outputs |

Cost:

| Component | Cost |
|---|---|
| Contract + schema | `+500-900` prompt tokens |
| Plan output | `+250-600` output tokens |
| `n=3` candidates | about `3x` generation latency |
| Browser audit | usually low seconds per candidate |
| One repair pass | `+1` model call only for failed candidates |
| Deterministic renderer | engineering cost, but lower recurring prompt complexity |

## Synergies + conflicts with sibling angles

| Angle | Synergy | Conflict / guardrail |
|---|---|---|
| A1 | Strong alignment: region decomposition and concise constraints are exactly the A7 kernel. | Avoid adding more prose rules; move rules into audit code. |
| A2 | Chain-of-Rubrics becomes the acceptance gate. | Do not let rubric scoring override hard geometry failures. |
| A3 | Self-Refine and visual debugging fit as one measured repair pass. | No open-ended iterative polishing; repair only named audit failures. |
| A4 | Bounding-box grounded critique maps cleanly to `data-bento-id` failures. | Do not ask a VLM to infer boxes when DOM/SVG bboxes are available. |
| A5 | LaySPA/GeoSVG reward dimensions become deterministic audit metrics. | No RL/fine-tuning needed for this phase. |
| A6 | AdaCoder-style adaptive planning supports “only plan/repair after failure.” | A7 differs slightly: plan is always required, because 2D layout is the known failure mode. Adaptive escalation applies to repair, not initial planning. |

## Confidence + residual risk

Confidence: **0.78**.

High confidence on the mechanism: the evidence consistently points to plan-first, bounded regions, computed geometry, and deterministic audits as the right fix for layout-primitive failures.

Residual risks:

| Risk | Mitigation |
|---|---|
| GLM may emit invalid JSON or over-dense plans. | JSON schema validation, max node/edge caps, retry plan only. |
| Deterministic templates may reduce visual variety. | Keep semantic variety in tile type, emphasis, copy, color tokens, and icon choice. |
| Linearized fallback may feel less diagrammatic. | Use it only when the plan exceeds safe 2D budgets. |
| DOM/SVG graph extraction may miss semantic connector intent. | Require edge attributes from the renderer, then compare rendered endpoints to declared anchors. |
| Public GLM-5.2 docs do not clearly advertise vision input. | Keep the pipeline transport-agnostic: attach images where the endpoint supports them, but never depend on GLM self-audit for acceptance. |