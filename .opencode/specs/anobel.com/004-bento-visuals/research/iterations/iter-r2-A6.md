Research-only, so I’m not going to modify files or ask for a spec folder. I’ll first route context/skill selection, then fetch the unresolved source passages and reconcile A6 against the sibling recommendations.The memory trigger call rejected `turnNumber: 0`; I’m retrying with the valid minimum and continuing with skill routing.SKILL ROUTING: advisor surfaced `cli-opencode` and `sk-prompt-models`; the task also uses a deep-research iteration frame. I’m loading the relevant workflow/model guidance but will keep this read-only and return the requested markdown directly.The skill guidance confirms no CLI self-dispatch is appropriate here; the useful model-specific facts are GLM-5.2’s prompt profile and the direct multimodal/API caveat. I’m fetching the source set now, prioritizing papers that affect the final mechanism: layout decomposition, instruction-density limits, spatial rewards, self-refine loops, and visual grounding.The first source batch confirms the main A6 direction: layout failures are a bounded spatial-planning problem, not a general prompt-quality problem. I’m fetching the sibling-specific sources now to tighten the final contract and avoid duplicating/conflicting recommendations.# A6 FINAL recommendation

## The exact change (copy-pasteable: contract block / dial preset / pipeline step / schema)

Use **GPT-5.5 only as a geometry-skeleton author for 2D-risk tiles**, then compile that skeleton into a locked HTML/CSS scaffold before GLM-5.2 renders. Do not ask GPT-5.5 to write final tile code. Do not spend it on linear tiles.

```yaml
A6_FINAL_PIPELINE:
  register: Product
  base_dials: V4/M2/D6
  intervention: risk-gated-geometry-scaffold
  default_renderer: glm-5.2
  premium_model_role: gpt-5.5-skeleton-author
  audit_order:
    - deterministic_dom_geometry_gate
    - deterministic_css_text_gate
    - existing_contrast_gate
    - minimax_visual_audit_only_if_borderline
    - gpt-5.5_audit_only_if_deterministic_and_minimax_disagree

  trigger_gpt55_if:
    - layoutPrimitive in [matrix, flow, hub, branch, popover, node-diagram, network, connector-map]
    - itemCount > 4 and layoutPrimitive not in [linear, stack, simple-kpi, text-card, timeline]
    - brief requires cross-links, connector lines, branching, overlays, pills, edge labels, or popovers

  skip_gpt55_if:
    - layoutPrimitive in [linear, stack, simple-kpi, text-card, timeline]
    - no connector geometry
    - no more than 4 visible rows

  cost_caps:
    max_gpt55_calls_per_2d_tile: 1
    max_gpt55_tokens_per_2d_tile: 4200
    max_glm_render_repairs_per_tile: 1
    no_gpt55_for_linear_tiles: true

  canvas_contract:
    tileHeightPx: 480
    diagramFrame: { x: 24, y: 24, w: "calc(100% - 48px)", h: 312, maxY: 336 }
    titleFrame: { x: 24, y: 368, w: "calc(100% - 48px)", h: 88 }
    minGapBetweenDiagramAndTitlePx: 32
```

Skeleton-author prompt:

```text
You are the geometry skeleton author for a 480px-high maritime B2B dashboard bento tile.

You do not write final UI code.
You produce a prevalidated JSON geometry skeleton that will be compiled into locked HTML/CSS for GLM-5.2 to render.

Hard canvas contract:
- Tile height is 480px.
- diagramFrame = { x: 24, y: 24, w: "calc(100% - 48px)", h: 312, maxY: 336 }.
- titleFrame = { x: 24, y: 368, w: "calc(100% - 48px)", h: 88 }.
- All diagram content must fit inside diagramFrame.
- Nothing may enter y=336..368.
- Title and description must render bottom-left inside titleFrame.
- No node, row, legend, connector label, eyebrow, pill, or popover may exceed diagramFrame.

Coordinate system:
- BBoxes are relative to diagramFrame.
- x and w use 0..1000 horizontal units, scaled to diagramFrame width.
- y and h use pixels, 0..312.
- A bbox is valid only if x >= 0, y >= 0, x + w <= 1000, y + h <= 312.

Diagram constraints:
- Minimum bbox gap between nodes: 16px after scaling.
- Minimum gap between text labels and nodes: 12px.
- Matrix/list diagrams may show at most 4 visible rows.
- If source has more than 4 rows, collapse the remainder into one "+N more" row.
- Row height must be 36-42px; row gap must be 6-8px.
- Edge labels and status pills need their own bbox and may not overlap nodes.
- Connector endpoints must use explicit anchors: top, right, bottom, left, center.
- Prefer orthogonal connectors.
- Legend is optional; include it only if it fits inside diagramFrame.
- Avoid CSS text-transform uppercase.
- Eyebrow must be Title Case.
- Use the intended anchor glyph only; never substitute move/cross-arrows glyph.

Return JSON only. No prose.
```

Schema:

```json
{
  "layoutPrimitive": "matrix | flow | hub | branch | popover | node-diagram | network | connector-map",
  "riskFlags": ["RC-1", "RC-2", "RC-3", "RC-4"],
  "zones": {
    "diagramFrame": { "x": 24, "y": 24, "w": "calc(100% - 48px)", "h": 312, "maxY": 336 },
    "titleFrame": { "x": 24, "y": 368, "w": "calc(100% - 48px)", "h": 88 }
  },
  "coordinateSystem": {
    "origin": "diagramFrame",
    "xUnits": 1000,
    "yPx": 312
  },
  "nodes": [
    {
      "id": "node-1",
      "role": "source | hub | target | status | metric | callout",
      "text": "Node label",
      "bbox": { "x": 0, "y": 0, "w": 180, "h": 48 },
      "anchorPoints": ["left", "right"]
    }
  ],
  "rows": [
    {
      "id": "row-1",
      "text": "Row label",
      "bbox": { "x": 0, "y": 0, "w": 1000, "h": 38 }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "from": { "nodeId": "node-1", "anchor": "right" },
      "to": { "nodeId": "node-2", "anchor": "left" },
      "path": "orthogonal",
      "label": "Optional label",
      "labelBbox": { "x": 410, "y": 96, "w": 180, "h": 24 }
    }
  ],
  "overflowPlan": {
    "maxVisibleRows": 4,
    "collapseRemainderAs": "+N more"
  },
  "textRules": {
    "eyebrowCase": "Title Case",
    "forbidUppercaseTransform": true,
    "glyph": "anchor"
  },
  "validation": {
    "allContentWithinDiagramFrame": true,
    "titleAtBottom": true,
    "overlapPairs": [],
    "minGapPx": 16,
    "maxContentY": 312
  }
}
```

Post-render gates:

```text
A6_SHIP_GATES:
- skeleton_json_valid == true
- skeleton_bbox_bounds_valid == true
- skeleton_overlap_pairs == []
- render_overflow == false
- title_at_bottom == true
- diagram.maxY <= 336
- titleFrame.y >= 368
- dom_bbox_overlap_pairs == []
- text_transform_uppercase_count == 0
- eyebrow_case == Title Case
- anchor_glyph_substitution == false
- contrast_gate == exit_0
- MiniMax score improves or remains >= baseline arm
```

## Why it works

The failure is spatial, not general generation quality. Linear tiles already score `86-94`; 2D-positioned diagrams score `35-58`. The fix is to remove global layout inference from GLM-5.2 and give it a mechanically checked geometry contract.

- **RC-1 vertical overflow:** fixed by hard `diagramFrame.maxY <= 336`, `titleFrame.y >= 368`, and DOM overflow gates. LaTCoder shows the same principle: preserve layout by dividing design into BBoxes and assembling against recorded positions rather than relying on monolithic prompting. Source: `https://arxiv.org/html/2508.03560v1`.

- **RC-2 node collisions:** fixed by bbox skeleton validation before rendering and DOM geometry validation after rendering. LaySPA’s useful mechanism is explicit layout JSON plus rewards for collision, alignment, spacing, distribution, and format validity; it reports collision reduction and spacing/alignment gains from explicit spatial rewards. Source: `https://arxiv.org/html/2509.16891v2`.

- **RC-3 title-at-bottom break:** fixed by reserving title geometry before generation. The title is no longer a prose instruction competing with the diagram; it is a locked zone.

- **RC-4 uppercase/glyph drift:** fixed by moving text-case and glyph requirements into both schema and grepable post-render gates. IFScale’s core warning applies here: as instruction density rises, models omit constraints, and earlier instructions get preferential adherence. So keep the critical invariant block short, early, and mechanically checked. Source: `https://arxiv.org/html/2507.11538v1`.

- **JSON-only is not enough:** resolved by compiling the JSON skeleton into locked scaffold code with `data-layout-id` and fixed zone styles before GLM renders. GeoSVG-RL’s key lesson is plan-first generation plus browser-backed geometry extraction; the browser verifier catches text containment, anchor placement, overflow, and graph consistency better than token-level checks. Source: `https://arxiv.org/html/2605.25447`.

- **Why GPT-5.5 only on 2D-risk:** AdaCoder supports adaptive planning: direct generation first where the base model works, planning only after/where tests indicate native generation is insufficient. Here, linear tiles are already strong, so always-on GPT planning wastes tokens and risks perturbing good outputs. Source: `https://ar5iv.labs.arxiv.org/html/2504.04220`.

- **Why not GLM-4.6V as the main fix:** Z.AI documents GLM-4.6V frontend replication and visual debugging, but that is renderer capability, not proof of constraint planning or collision avoidance. Use GLM-4.6V Flash/FlashX only as a same-skeleton shadow renderer. Source: `https://docs.z.ai/guides/vlm/glm-4.6v`.

- **Why GLM-5.2 still renders:** GLM-5.2 is positioned for long-horizon coding, structured output, 1M context, thinking mode, and engineering-standard adherence. The official GLM-5.2 page lists text input, so the safer implementation is skeleton/scaffold text input, not reliance on image attachment. Source: `https://docs.z.ai/guides/llm/glm-5.2`.

## Predicted effect

- **SHIP rate:** baseline `27/45 = 60%`. Expected final with A6: `33-35/45 = 73-78%`, or `+13 to +18 percentage points`. Stretch if most failures are 2D-layout failures and GLM obeys the scaffold: `36/45 = 80%`.

- **Diagram-vs-linear delta:** current gap is roughly `~41 pts`. Expected diagram lift is `+18 to +28 pts`, compressing the gap to roughly `13-23 pts`. Linear tiles should stay flat within `±0-2 pts` because they skip A6.

- **Contrast exit-0:** expected unchanged. A6 changes geometry, not palette. Keep the existing contrast gate mandatory after render.

- **Token cost:** `N_2D * <= 4.2K GPT-5.5 tokens`, where `N_2D` is the number of triggered 2D-risk tiles. If 18 of 45 trigger, cap is `<= 75.6K GPT-5.5 tokens` for the full batch. Linear tiles use zero GPT-5.5 tokens.

- **Latency:** per 2D-risk tile adds one GPT-5.5 skeleton call plus a deterministic validator/scaffold compile pass. Browser geometry validation should be low seconds per tile. GLM render latency remains the main renderer cost; local GLM-5.2 profile evidence says benchmark latency is high-variance, about `6-161s`, avg `~26s`, so batch with generous timeouts.

## Synergies + conflicts with sibling angles

- **A1 synergy:** A1’s LaTCoder decomposition maps directly to A6’s locked zones and bbox scaffold. A6 should not duplicate full page block-splitting; it applies the idea at tile/diagram level.

- **A2 synergy:** A2’s Chain-of-Rubrics becomes the post-render gate sequence. Use rubrics as deterministic checks, not more prose.

- **A3 synergy:** A3’s self-refine loop is useful only after deterministic failure. Limit to one GLM repair from gate JSON; do not create an open-ended visual self-refine loop.

- **A4 synergy:** A4’s visual grounding pipeline supports MiniMax/vision audits with region-level evidence. Use it for borderline visual critique, not primary layout construction.

- **A5 synergy:** A5’s structured spatial object is the closest sibling. A6 is the model-routing version of A5: GPT-5.5 authors the skeleton; deterministic gates enforce it; GLM renders.

- **A7 synergy:** A7’s LaTCoder/LaySPA/IFScale synthesis agrees with A6: fewer prose constraints, more layout objects, browser-backed geometry checks.

- **Potential conflict:** Do not let A2/A3/A4 turn this into an always-on multi-agent critique loop. AdaCoder’s cost lesson is clear: planning/refinement should be adaptive and failure-triggered.

- **Potential conflict:** Do not let A1/A7 push absolute positioning everywhere. Absolute positioning is acceptable only inside emitted bbox scaffolds for 2D-risk diagrams; ordinary linear tiles should keep normal grid/flex.

## Confidence + residual risk

**Confidence: 0.78.** The mechanism is strongly supported across layout-as-BBoxes, spatial reward, plan-first diagram generation, instruction-density, and adaptive-planning sources.

Residual risks:

- GLM-5.2 may ignore or rewrite scaffold geometry unless the prompt forbids modifying `data-layout-id`, `top`, `left`, `width`, `height`, and zone styles.
- Width responsiveness needs scaling from `xUnits: 1000`; fixed pixel x-values would be brittle across bento widths.
- DOM geometry gates catch rendered HTML/CSS overlap, but screenshot-level perceived overlap may still need MiniMax audit for shadows, glows, dense labels, and anti-aliased connector collisions.
- If the failing tiles are not mostly 2D-risk, SHIP lift will be lower than predicted. The trigger classifier should report `N_2D` before spend.