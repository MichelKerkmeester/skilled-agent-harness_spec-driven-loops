Research-only scope: I’ll verify the A2 sources directly, check the previously incomplete DesignerlyLoop route via readable fallbacks, then reconcile against sibling mechanisms without modifying files.SKILL ROUTING: advisor surfaced `cli-opencode` and `sk-prompt-models` above threshold; I’m loading the relevant prompt/model guidance and will not dispatch an external CLI unless the skill contract requires it for this read-only synthesis.The advisor-loaded GLM profile matters here because A2 is a prompt-contract change for `glm-5.2`, not just a generic design rubric. I’m checking that profile plus the cited A2 papers and the sibling layout/instruction-density sources most likely to constrain the final contract.Source check supports the main constraint: A2 should stay lean. CoR and DesignerlyLoop justify explicit, inspectable rubric/preflight reasoning, while IFScale and LaTCoder argue against adding many prose rules or expecting rubric prompting alone to solve geometry.I’m checking two sibling mechanisms that can materially change A2’s boundary: structured spatial rewards/layout JSON and render-feedback/visual debugging. This is to keep the final A2 recommendation compatible with the stronger layout gates rather than pretending prompt reasoning is enough.# A2 FINAL recommendation

## The Exact Change

Use A2 as a **lean reasoning-embedded contract**, not a longer style guide. Put this before every GLM-5.2 maritime-B2B tile prompt.

```text
A2 REASONING-EMBEDDED TILE CONTRACT v2

Register lock: Product.
Dial lock: V4/M2/D6.
Tile type: maritime-B2B dashboard bento tile.
Design posture: restrained, operational, credible, content-first.

NON-NEGOTIABLES, CHECK THESE FIRST:
1. Use a linear or tabular layout primitive. Do not use a freeform 2D node map for Product V4/M2/D6.
2. Preserve the bottom-left title zone. No visual cluster may occupy or collide with it.
3. Use CSS grid/flex for content layout. Do not absolutely position text, cards, badges, or nodes.
4. Every accent color must encode brand, hierarchy, state, or data. Decorative red/orange is forbidden.
5. The rendered tile must pass contrast checks. Your contrast inventory is only a draft; external validation is authoritative.
6. Keep one visual idea only. Content must be more prominent than the motif.

ALLOWED PRIMITIVES, CHOOSE EXACTLY ONE:
- linear-flow
- stacked-ledger
- compact-kpi-row
- two-column-comparison
- mini-table

FORBIDDEN BY DEFAULT:
- freeform 2D node map
- perspective, 3D, extrusion, glass, glossy object
- funnel as main motif
- decorative red/orange accent
- overlapping badges/cards
- absolute-positioned content diagram
- more than 4 process steps
- more than 3 ledger/table rows
- any motif that steals the bottom-left title zone

BEFORE HTML, OUTPUT THIS JSON EXACTLY:

[A2_PREFLIGHT_JSON]
{
  "contract_version": "A2-v2",
  "register": "Product",
  "dial_lock": "V4/M2/D6",
  "tile_job": "",
  "primary_user_decision": "",
  "one_visual_idea": "",
  "selected_primitive": "linear-flow | stacked-ledger | compact-kpi-row | two-column-comparison | mini-table",
  "diagram_was_considered": false,
  "diagram_conversion": "If a diagram was tempting, state how it was converted to a linear/table primitive. Otherwise: none.",
  "bottom_left_title_zone_plan": "",
  "layout_method": "grid | flex | grid+flex",
  "absolute_positioned_content_count": 0,
  "contrast_pairs": [
    {
      "element": "",
      "foreground": "#FFFFFF",
      "background": "#0B1D2A",
      "estimated_ratio": 7.0,
      "passes": true,
      "fix_if_fail": ""
    }
  ],
  "accent_semantics": [
    {
      "color": "#38BDF8",
      "role": "brand | hierarchy | state | data",
      "keep": true
    }
  ],
  "anti_slop": {
    "all_shapes_carry_information": true,
    "no_decorative_red_or_orange": true,
    "no_3d_or_gloss": true,
    "content_more_prominent_than_motif": true,
    "bottom_left_title_zone_preserved": true
  },
  "build_decision": {
    "final_primitive": "",
    "removed_decorative_ideas": [],
    "safe_accent_colors": [],
    "highest_risk_contrast_pair": "",
    "fix_applied": ""
  }
}
[/A2_PREFLIGHT_JSON]

THEN OUTPUT THE HTML ONLY:

[A2_HTML]
<!-- one complete self-contained tile -->
[/A2_HTML]

FEW-SHOT EXEMPLAR 1, LINEAR-FLOW:
A shipping or invoice process should be 3-4 flat steps in one row or stack:
"Order" -> "Controle" -> "Factuur" -> "Boeking".
Each step has one short label and one value/status. Use a thin connector if needed.
No freeform node map. No overlap. No 3D. Title remains bottom-left.

FEW-SHOT EXEMPLAR 2, STACKED-LEDGER:
A complex account/catalog/price relation should be 3 compact rows in one panel:
left = entity, middle = status chip, right = amount/count/date.
Use muted navy/slate surfaces, white text, and one cyan/teal state accent.
No funnel, extrusion, glass, oversized illustration, or decorative red/orange.

NEGATIVE-TO-POSITIVE CONVERSION:
If you start drawing a matrix, funnel, branch diagram, or 5+ floating nodes, stop and convert it to linear-flow or stacked-ledger before writing HTML.
```

Use this pipeline schema around the prompt:

```json
{
  "a2_contract_version": "A2-v2",
  "generator": "glm-5.2",
  "register": "Product",
  "dial_lock": "V4/M2/D6",
  "preflight_required": true,
  "render_html_only": true,
  "validators": {
    "preflight_json_parse": "fail_retry",
    "selected_primitive_allowed": "fail_retry",
    "absolute_positioned_content_count_max": 0,
    "contrast_actual_css": "fail_retry",
    "bottom_left_title_zone_collision": "fail_retry",
    "anti_slop_external_audit": "fail_retry",
    "layout_collision_gate": "handoff_to_A1_A5_if_fail"
  },
  "trusted_sources": {
    "contrast": "computed_css_not_model_estimate",
    "anti_slop": "external_vision_auditor_not_glm_self_audit",
    "geometry": "dom_bbox_or_layout_gate_not_prompt_claim"
  }
}
```

Pipeline step:

```text
A2 PIPELINE v2

0. For GLM-5.2 vision-to-code, pass actual reference pixels through the direct Z.AI multimodal API, not a text-only transcription. For large HTML generations, disable thinking if the endpoint otherwise spends output budget on reasoning and returns empty content.

1. Generate with A2 REASONING-EMBEDDED TILE CONTRACT v2.

2. Parse [A2_PREFLIGHT_JSON].
   Fail/retry if missing, invalid JSON, wrong register/dial, or selected_primitive is not in the allowed list.

3. Strip [A2_PREFLIGHT_JSON] from render output.
   Store it as metadata. Do not render it visibly. Do not rely on an HTML comment unless the pipeline has no metadata channel.

4. Parse [A2_HTML].
   Strip markdown fences if present. Render the HTML to screenshot.

5. Run deterministic layout checks:
   - actual CSS color-pair extraction + contrast_check
   - DOM bounding boxes for overlaps/collisions
   - bottom-left title zone collision check
   - count of absolute-positioned content elements
   - primitive compliance check

6. Fail/retry on:
   - any actual CSS contrast failure
   - any absolute-positioned content
   - bottom-left title collision
   - >4 linear-flow steps or >3 ledger rows
   - decorative red/orange
   - 3D/gloss/extrusion/funnel motif

7. Run external visual/design audit, preferably MiniMax-M3, for:
   - on_brand
   - anti_slop
   - content_prominence
   - title_zone_preserved
   Do not use GLM’s own visual audit as the source of truth.

8. If a second retry still fails geometry/collision checks, stop A2 retries and hand off to A1/A5 layout-plan or bbox validation. Do not keep adding prose rules.
```

## Why It Works

A2 directly targets **RC-5, RC-6, and RC-7**, and only partially mitigates **RC-1/RC-2/RC-3**.

- **RC-5, context-blind contrast:** The contrast inventory forces the model to attend to foreground/background pairs before HTML, but the pipeline trusts only computed CSS contrast. This resolves the open question: GLM’s inventory is useful as an attention scaffold, not as a validator.

- **RC-6, color-as-decoration:** The `accent_semantics` section forces every accent to be brand, hierarchy, state, or data. Decorative red/orange becomes mechanically rejectable.

- **RC-7, decorative slop:** The anti-slop block forces intent, primitive choice, and deletion of 3D/funnel/glass/extrusion ideas before code.

- **RC-1/RC-2/RC-3, layout collisions and weak 2D placement:** A2 does not make GLM good at spatial layout. It reduces exposure by banning the failure-prone primitive and routing diagram impulses into linear-flow or stacked-ledger.

Mechanism evidence:

- **Chain-of-Rubrics** supports ordered, modular rubric checkpoints with intermediate assessment/correction loops, which maps directly to the preflight JSON plus validator gates. Source: `https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework`.

- **UI/UX LLM SLR** supports structured prompting, modular decomposition, contextual inputs, few-shot examples, evaluation, and explainability, while warning about prompt instability, limited spatial reasoning, and generic/conservative outputs. Source: `https://arxiv.org/html/2507.04469v1`.

- **DesignerlyLoop** supports externalized, editable reasoning before generation through context building, reasoning chains, few-shot golden examples, and iterative curation. Source: `https://arxiv.org/abs/2511.15331` and `https://ar5iv.labs.arxiv.org/html/2511.15331`.

- **IFScale** is the reason this final version is leaner than round 1: instruction density causes omission-heavy failures and primacy effects, so the hard constraints are first and the rest is schema-driven. Source: `https://arxiv.org/html/2507.11538v1`.

- **LaTCoder** shows that “always get layout right” prompting is insufficient for design-to-code; layout needs decomposition and verification. A2 therefore bans weak primitives but delegates real geometry to A1/A5 when needed. Source: `https://arxiv.org/html/2508.03560v1`.

- **LaySPA** reinforces the same boundary: spatial layout improves when represented as boxes and scored with collision, alignment, spacing, and distribution rewards, not when left implicit in prose. Source: `https://arxiv.org/html/2509.16891v2`.

- **Self-Refine and visual critique refinement** justify retry-on-fail, but with external/deterministic validators rather than trusting same-model self-critique. Sources: `https://github.com/madaan/self-refine`, `https://arxiv.org/html/2412.16829`.

## Predicted Effect

| Metric | Baseline | A2 v2 expected |
|---|---:|---:|
| SHIP rate | `27/45 = 60%` | `67-72%` with gates and retry |
| SHIP delta | n/a | `+7 to +12 pp` |
| Diagram-vs-linear delta | about `41 pts` | measured suite delta shrinks to `28-35 pts` mainly by reducing diagram selection |
| Converted diagram-prone tile gain | diagram tiles `35-58`, linear winners `86-94` | `+15 to +30 pts` when GLM actually switches primitive |
| Contrast exit-0 | occasional hard misses like `1.51:1` | `90-95%+` final if actual CSS contrast gate retries |
| First-pass contrast inventory reliability | unknown | treat as untrusted; expected lower than actual CSS gate |

Cost:

- Prompt input overhead: about `+650-950` tokens.
- Output overhead: about `+250-500` tokens for preflight JSON.
- Total per-tile overhead: about `+900-1.4k` tokens.
- Parser and contrast checks: negligible.
- External MiniMax-M3 audit: one extra model call when enabled.
- Retry latency: one additional GLM generation for failed contrast/slop/primitive cases.
- Best operational mode: first-pass A2 for all Product V4/M2/D6 tiles, retry only on deterministic/audit failures.

## Synergies + Conflicts With Sibling Angles

- **A1 synergy:** A2 selects a safe primitive before generation; A1 can own bounded regions and layout-preserving assembly when the tile genuinely needs spatial structure.

- **A1 conflict:** Do not duplicate A1’s geometry machinery in A2 prose. A2 should ban or route diagrams, not solve bounding boxes.

- **A3 synergy:** A2 preflight gives the critique/refine loop concrete targets: primitive, contrast, title zone, anti-slop.

- **A3 conflict:** Same-model GLM self-critique is not trusted. Use deterministic checks or a separate auditor.

- **A4 synergy:** A2’s preflight fields map cleanly to grounded critique regions: contrast pair, title zone, motif, decorative accent.

- **A4 conflict:** Do not add A4’s full bbox critique process to the first-pass prompt. Keep it as a post-render audit/refinement stage.

- **A5 synergy:** A2’s primitive and anti-slop schema is a good front-end to A5’s layout JSON / collision / alignment / spacing gates.

- **A5 conflict:** If a real 2D diagram is required, A5 should supersede A2. A2 should not permit freeform 2D diagrams without A5-style geometry validation.

- **A6 synergy:** Use A6 adaptive planning after failure, not always. A2 is the cheap first-pass contract; A6 decides when to escalate to visual debugging or planning.

- **A6 conflict:** Always-on multi-plan reasoning would fight IFScale and increase latency. A2 should stay lean.

- **A7 synergy:** A2’s primitive choice can define LaTCoder-like blocks for later assembly.

- **A7 conflict:** A7/LaTCoder may use absolute positioning for bbox-preserving assembly. A2 should still forbid ad hoc absolute-positioned content in normal single-tile generation.

## Confidence + Residual Risk

Confidence: **0.78 overall**.

- High confidence for improving **RC-5/RC-6/RC-7**.
- Medium confidence for moving SHIP from `60%` to `67-72%`.
- Low confidence that A2 alone fixes dense 2D layout collisions.

Residual risk:

- GLM may produce valid-looking preflight JSON while violating it in HTML.
- The contract may over-steer some tiles into safe but less distinctive linear patterns.
- Contrast inventory can be hallucinated; actual CSS extraction remains mandatory.
- Diagram-heavy concepts still need A1/A5 layout planning.
- Final effect depends on retry budget and external audit quality.