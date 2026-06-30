# GLM-5.2 visual-refinement research (Anobel bento set)
_2026-06-29 — method: Stage-A Opus deep-dive → 7 research angles → 20 GPT-5.5-fast (xhigh) iterations (r1 deep-dive, r2 cross-referenced, r3 experiment design, r4 synthesis), with online sources._

## Executive summary
The 45-tile run was 'okay-ish' (27/45=60% SHIP, mean 81.1) because of ONE dominant cause, not many small ones: GLM-5.2 cannot self-resolve **2-D constraint layout** (coordinates + collision-avoidance + height budget). Diagram/matrix/node/funnel tiles that need it score 35-58; linear-flow tiles (table/timeline/list/donut) that don't score 86-94 — a ~41-point primitive gap. The fix is to stop asking GLM to *invent* geometry from prose and instead (a) hand 2D-positioned tiles a pre-resolved coordinate skeleton, (b) harden the text contract with mechanical invariants (case, height budget, on-dark token, safe-zones), and (c) add a render-feedback round-2 that feeds MiniMax-M3's existing audit findings back to GLM. The recommended pipeline below is predicted to lift SHIP rate from 60% toward ~80-90% and cut the diagram-vs-linear delta from ~41 to ~10-15 points. See per-angle recommendations + experiment designs for the testable specifics.

## Root cause (RC-1..RC-8)
## §1 Root-Cause Ledger

Built from STEP-3 forensic viewing of the 5 lowest tiles (accountbeheer-4 35, orders-facturen-4 52,
goedkeuringssysteem-4 55, oci-4 58, aangepast-assortiment-3 58) and 5 highest (kwartaalcijfers-2 94,
accountbeheer-5 93, een-factuur-5 93, accountbeheer-1 92, orders-facturen-1 90 / aangepast-assortiment-4 88),
plus calculator-confirmed contrast and grep-confirmed anti-tells.

| RC-id | Defect (render symptom + tile) | Hard-fact / refinement | Root cause | Consumed by |
|---|---|---|---|---|
| **RC-1** | **Vertical overflow — content exceeds the 480px height budget.** 4th matrix row (MS Vesta) spills out of the inner panel and lands ON TOP of the bottom title "Accountbeheer"+desc (accountbeheer-4, **35**); 6th matrix row + legend collide with the title (aangepast-assortiment-3, **58**); the title "Orders & facturen" is clipped clean off the bottom card edge (orders-facturen-4, **52**); panel rows overflow rounded corners (goedkeuringssysteem-1, **62**); CTA buttons bleed past panel (goedkeuringssysteem-3, **66**); panel overlaps title (een-factuur-1, **88**); last row clipped (favorieten-3, **78**). | **Hard-fact** (an overflow/bounding gate catches it; `overflow:true` in 8 audit rows). | **GLM rendering limitation** — lays out N rows/nodes at fixed pixel heights with no constraint solver, never computing cumulative-height ≤ 480px − reserved-title-block; **+ prompt-contract gap** (no per-region height budget, max-row count, or "reserve Npx for the bottom title"). | A1, A3, A5 |
| **RC-2** | **2D node collisions** — the "Verbonden" pill overlaps the SAP card and truncates "MS V…" (oci-4, **58**); eyebrow overlaps the right flow node "Anobel-catalogus" (oci-2, **78**); branch cards crowd the card edge (goedkeuringssysteem-4, **55**); popover overflows the card's right edge and clips the eyebrow (favorieten-4, **62**). `position:absolute` count: oci-4 = **6**, accountbeheer-4 = 4, goedkeuringssysteem-4 = 4. | **Mixed** — the clip is hard-fact (overflow); node-on-node crowding is **refinement** (no gate computes bounding-box overlap). | **GLM rendering limitation** — direct numerical coordinate placement with no collision detection; external lit: "direct LLM numerical positioning → out-of-boundary errors and object collisions." | A1, A5, A3 |
| **RC-3** | **Title-at-bottom rule breaks under diagram layouts** — title rendered TOP-left not bottom-left (goedkeuringssysteem-4, **55**, `title_at_bottom:false`); same on aangepast-assortiment-3 (**58**) and orders-facturen-4 (**52**). | **Hard-fact** (title Y-position is checkable). | **Instruction-density mismatch + GLM limitation** — once GLM commits an absolutely-positioned full-card diagram, it drops the "title bottom-left" pin (one of ~20 contract constraints); the diagram claims the whole canvas. | A1, A5 |
| **RC-4** | **Eyebrow renders ALL-CAPS, wraps, wrong glyph** — "VLOOT-FUNCTIE" uppercase wrapped to 2 lines and crowding a node (goedkeuringssysteem-4); `text-transform:uppercase` grep count: goedkeuringssysteem-4 = **3**, aangepast-assortiment-3 = 2, accountbeheer-4 = 1. Wrong 4-arrows "move" glyph (✛) substituted for the anchor in the eyebrow AND in hub nodes (goedkeuringssysteem-4, oci-4); broken anchor glyph (oci-4). | **Hard-fact** (uppercase is grep-catchable vs the contract's "Title case, NOT uppercase"); glyph substitution is **refinement**. | **Prompt-contract gap + instruction-density** — the "Title case not uppercase" pin was stated in prose but dropped under load; the anchor-only icon rule was not enforceable. | A1, A5, A2 |
| **RC-5** | **Low contrast — muted token reused context-blind on dark surface.** Navy-node labels "Drempelbedrag"/"Routeringsregel" use `color:#4e4e4e` on the navy node `#043367` = **1.51:1 (APCA Lc 0.0)** — effectively invisible (goedkeuringssysteem-4). Caption text "v3.2.1"/"maart 2026" uses `fill:#8591b3` on white = **3.14:1** as TEXT — WCAG-fail (oci-4); too-light bottom PO row (oci-3, **72**); blue-on-blue band label (een-factuur-4, **82**). | **Hard-fact**, BUT the gate only catches it if it enumerates the text-on-navy pair AND distinguishes #8591b3-as-text from #8591b3-as-fill (the high tile aangepast-assortiment-4 uses `#8591b3` only as an SVG icon `stroke=` and scored **88**). | **Prompt-contract gap** (the muted-text rule "#4e4e4e never #787878" had no dark-surface companion "on navy use #ffffff/#e7e9ee"; #8591b3-not-as-text buried in a dense neutral list) **+ audit-gap** (the contrast gate did not enumerate every fg/bg pair). | A1, A2, A4 |
| **RC-6** | **Off-brand color used as decoration, not alert** — red square + red "Stop sessie" text (accountbeheer-2, **78**, `on_brand:false`); down-delta pills in red/orange tones violating no-orange/status-only-green (kwartaalcijfers-5, **89**); red ✗ cells for "hidden" (aangepast-assortiment-3). Contract: red alerts-only, orange=0, status by icon+word not color alone. | **Hard-fact** for orange (palette grep); red-as-status is **refinement** (semantic judgment). | **Prompt-contract gap / instruction-density** (status-by-icon+word rule dropped) **+ audit-gap** (MiniMax flagged `on_brand:false`, nothing fed back). | A1, A4, A7 |
| **RC-7** | **Decorative AI-slop on diagram/chart treatments** — 3D-extruded step-chart bars read as gradient/AI-slop (prijzen-condities-3, **62**); funnel shape buries the actual filtered list, "looks decorative AI-slop" (aangepast-assortiment-5, **70**); donut segments indistinguishable, one navy hue (kwartaalcijfers-4, **86**). | **Refinement** (no gate catches "reads as slop / buries content"). | **Design-skill under-utilization** — the prompt passed sk-design VALUES (palette, radius) but not the anti-slop REASONING ("one signature, everything else quiet; do not decorate a diagram"); GLM defaults to decorative chrome **+ GLM data-viz encoding weakness**. | A2, A5, A7 |
| **RC-8** | **Audit findings never consumed (process meta-defect).** MiniMax-M3 returned 18 specific, file-grounded FIX findings (panel overflow, eyebrow overlap, too-light row) but the pipeline stopped at the report — **18/45 = 40% FIX left on the table**; the audit was a verdict, never a control signal. | **Process** (not a render pixel — the absent loop). | **Missing render-feedback loop / audit-gap** — findings produced, not fed back to GLM for a round-2. | A3, A4 |

### Why the d/e diagram treatments collapse (35-58) while table/timeline/donut/list reach 88-94

The delta is the **layout PRIMITIVE, not the treatment label.** The high tiles are **linear / tabular**: a single
vertical stack of full-width rows (table = orders-facturen-1 90; timeline = accountbeheer-5 93; list = accountbeheer-1 92),
a hero number + short list (kwartaalcijfers-2 94), or a self-contained single-SVG donut + short list
(aangepast-assortiment-4 **88**). Layout is **1-D normal document flow**, element count is bounded (4-5 rows),
position is implied by flow, and text sits on white — GLM produces these reliably from prose because the layout is a
**sequence**, not a constraint problem.

The low tiles are **2-D constraint layouts**: hub-and-spoke node diagrams (oci-4), routing/branch flows
(goedkeuringssysteem-4), wide N×M matrices (accountbeheer-4, aangepast-assortiment-3), funnels
(aangepast-assortiment-5). These need coordinate placement, collision avoidance, connector routing, AND a height budget —
exactly what GLM cannot do from prose at any density (RC-1, RC-2, RC-3, RC-7 all concentrate here). **Decisive proof it is
the primitive and not the d/e label:** aangepast-assortiment-4 is a "(d)" treatment and scored **88** — because it is a
donut (linear/self-contained), not a positioned diagram. Any angle that "routes diagrams differently" must key on the
**primitive (2D-positioned vs linear-flow)**, never the a/b/c/d/e index.

---

## Per-angle final recommendations
I’ll treat this as read-only research and ground the final recommendation in the cited sources and sibling findings before synthesizing the implementation-ready A1 contract.The deep-research skill contract is command/state-owned, but this request is explicitly a single returned final markdown and no workspace writes. I’m going to keep this read-only, cite fetched sources, and reconcile the sibling evidence into one A1 implementation contract rather than creating a research packet.The strongest new convergence is that A1 should not just add prose: it should make layout a small machine-checkable object first, then generate flow/grid code from that object, with prompt-only rules as the cheap first pass and geometry checks only on failures.# A1 FINAL recommendation

## The exact change

Replace the current diffuse layout prose with this early block.

```md
## A1_SAFE_LINEAR_V2: HARD SPATIAL CONTRACT

Use this contract before any tile-specific creative instructions.

Tile geometry:
- Each bento tile is exactly 480px by 480px.
- Use these CSS variables and reference them in the tile CSS:
  `--tile-w:480px; --tile-h:480px; --pad:24px; --visual-y:24px; --visual-h:304px; --visual-bottom:328px; --title-y:352px; --title-h:104px; --gap:24px;`
- The visual panel must fit inside `x=24..456` and `y=24..328`.
- The bottom title band is reserved at `x=24..456` and `y=352..456`.
- Nothing except eyebrow, title, and description may enter the title band.
- Keep at least 24px clear space between visual panel and title band.

Layout primitive:
- Default primitive is normal flow: `display:grid`, `display:flex`, `gap`, `padding`, and fixed row/column sizing.
- Do not use `position:absolute` for text, rows, cards, nodes, labels, arrows, legends, matrices, or flow diagrams.
- `position:absolute` is allowed only for decorative non-text dots, glows, badges, or background shapes with `aria-hidden="true"` and `pointer-events:none`.
- If a diagram has more than 3 nodes, more than 3 data rows, or more than 2 branches, convert it to `linear-flow`, `stacked-list`, or `compact-matrix`.

Primitive caps:
- Matrix: header plus max 3 data rows. If there are more rows, show the top 3 plus a compact `+N more` summary.
- Approval or branch flow: max 3 cards total.
- Integration flow: max 3 nodes total.
- Legend: max 2 inline items inside the visual panel.
- CTA buttons: max 2 inside the visual panel.
- Minimum internal gap between cards/nodes/rows is 10px.

Text and case:
- Use the eyebrow text exactly as provided: `{EYEBROW_TEXT}`.
- Do not use `text-transform: uppercase`.
- Do not substitute glyphs for required symbols. If unsure, use plain text.
- Eyebrow, title, description, row labels, CTA text, and node labels must always be above decorative shapes.

Text-on-dark tokens:
- On navy or dark panels, body text must use `#E7ECF7`.
- On navy or dark panels, muted text must use `#B8C2D6`.
- Do not use `#4e4e4e`, `#666`, `#777`, `#8591b3`, or opacity-reduced gray for readable text on dark backgrounds.

Before returning code, check only these 6 gates:
- Visual panel bottom is at or above `y=328`.
- Title band contains only eyebrow, title, and description.
- No text/card/node/row bounding boxes overlap.
- No readable dark-panel text uses banned gray tokens.
- No `text-transform: uppercase`.
- No clipped CTA, legend, final row, or title.
```

Add this lightweight plan schema as a hidden or first-pass pipeline step before code generation:

```json
{
  "dial": "A1_SAFE_LINEAR_V2",
  "tile": { "w": 480, "h": 480, "visualBox": [24, 24, 432, 304], "titleBox": [24, 352, 432, 104] },
  "primitive": "linear-flow | stacked-list | compact-matrix | kpi-strip",
  "itemCount": 0,
  "visibleItems": 3,
  "overflowSummary": "+N more | null",
  "usesAbsoluteForContent": false,
  "darkTextTokens": { "body": "#E7ECF7", "muted": "#B8C2D6" }
}
```

Add one deterministic failure gate after render:

```text
Fail tile if:
- any non-title element intersects y=352..456
- any visual-panel element has bottom > 328
- any readable text bbox overlaps another readable text/card/node bbox
- any readable dark-panel text uses banned gray token or contrast < 4.5:1
- generated CSS contains text-transform: uppercase
- any CTA, legend, row, title, or description is clipped
```

If a tile fails, do one remediation pass with the failure JSON and rendered screenshot. Do not run multi-pass self-refine on tiles that already pass.

## Why it works

RC-1 overflow: the fixed visual box and title band remove cumulative-height guessing. LaTCoder shows that monolithic design-to-code loses partial layout information, while bounded blocks with recorded boxes improve layout preservation and reduce MAE on complex layouts [SOURCE: https://arxiv.org/html/2508.03560v1].

RC-2 2D collisions: the primitive switch converts high-risk diagrams into grid/flex/list structures. LaySPA and GeoSVG-RL both show that LLMs need explicit spatial objects plus geometry rewards/checks for collision, alignment, containment, and graph consistency [SOURCE: https://arxiv.org/html/2509.16891v2] [SOURCE: https://arxiv.org/html/2605.25447].

RC-3 title-at-bottom failures: the title band is now an early invariant, not buried prose. IFScale shows instruction-following degrades under high instruction density, with omission as the dominant failure mode and earlier instructions favored [SOURCE: https://arxiv.org/html/2507.11538v1].

RC-4 uppercase/glyph failures: literal `{EYEBROW_TEXT}` plus a banned `text-transform` gate is cheaper and more checkable than natural-language case guidance.

RC-5 contrast failures: semantic dark-panel tokens replace model-invented grays. DesignersForest recommends semantic tokens, Auto Layout by default, absolute positioning only sparingly, and splitting work into consumable bites [SOURCE: https://www.designersforest.com/dear-llm-heres-how-my-design-system-works/].

## Predicted effect

SHIP rate: baseline 27/45 = 60%. Prompt-only A1_SAFE_LINEAR_V2 should plausibly reach 31-35/45 = 69-78%. With the deterministic failure gate plus one remediation pass, expected range is 34-37/45 = 76-82%.

Diagram-vs-linear delta: current gap is about 41 pts. This should narrow to about 25-30 pts prompt-only, or 15-22 pts with the geometry gate, because high-risk 2D diagrams are no longer generated as free-positioned mini maps.

Contrast exit-0: expected after first or second pass if the verifier checks computed color and opacity, because all dark-panel text is constrained to `#E7ECF7` or `#B8C2D6`.

Cost: about 350-450 prompt tokens if inserted as a replacement, not an addition. Browser geometry checks add no model tokens and roughly one render pass per tile. One remediation pass costs only for failing tiles, roughly 800-1400 extra tokens per failed tile plus one GLM call.

## Synergies + conflicts with sibling angles

A2 Chain-of-Rubrics: strong synergy. The 6 gates are the rubric chain, but kept short to avoid the IFScale density cliff.

A3 Self-Refine and GLM visual debugging: use only after a deterministic failure. Do not make self-refine always-on.

A4 visual critique boxes: use for remediation screenshots. Circle or box the failing region when RC-2 collision or RC-3 title-band intrusion remains.

A5 IFScale, LaySPA, GeoSVG-RL: strongest alignment. A1 adopts explicit spatial schema, reduced instruction density, and verifier-backed geometry checks.

A6 AdaCoder: use adaptive planning only after failure. This avoids always-on multi-agent cost while preserving the benefit of targeted recovery.

A7 LaTCoder: strong synergy on bounded regions. The only conflict is absolute positioning: LaTCoder can use absolute assembly when boxes are externally computed, but A1 forbids model-invented absolute positioning inside diagrams because that is the observed failure mode.

## Confidence + residual risk

Confidence: 0.8 that this improves SHIP rate materially; 0.9 for overflow/title/contrast gains; 0.65 for collision gains without the render gate.

Residual risk: GLM may still ignore the primitive switch on visually rich tiles. Linearizing diagrams may reduce perceived sophistication. The exact lift depends on the unnamed 5 of 8 RC-1 tiles. Prompt-only collision prevention remains weaker than browser-measured overlap detection.

---

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

---

I’ll treat this as research-only, use the deep-research route the prompt names, and verify the cited mechanisms before producing the final A3 contract.SKILL ROUTING: User directed by the deepening/iteration context and the prior “deep research iteration” route, so I’m using `deep-research` and keeping the output research-only.I’m going to fetch the primary sources plus the sibling-cited layout/instruction-density sources, with special attention to whether GLM-5.2 itself documents visual-debugging parity or only GLM-4.6V does.GLM-5.2V at the guessed docs path returned 404. I’m checking the Z.ai documentation index rather than assuming model parity.The docs clarify an important constraint: `glm-5.2` is documented as text-in/text-out, while the vision chat schema lists `glm-5v-turbo`, `glm-4.6v`, and `glm-4.5v`. I’ll fold that into the final as a model-dial guardrail instead of assuming screenshot support on `glm-5.2`.# A3 FINAL recommendation

## The exact change (copy-pasteable: contract block / dial preset / pipeline step / schema)

```md
### A3 Primitive-Routed Render Repair Contract

Goal: stop treating all 480x480 bento tiles as the same layout task. Route by layout primitive before generation.

Model dial:
- Code/skeleton model: `glm-5.2`, `thinking.enabled`, `reasoning_effort=max`, `response_format=json_object` for skeleton turns.
- Visual repair model: `glm-5v-turbo` preferred, `glm-4.6v` fallback.
- Guardrail: `glm-5.2` is documented as text-only. If the direct API is used, do not send screenshots to `glm-5.2`; send screenshots to `glm-5v-turbo`/`glm-4.6v`, or send `glm-5.2` only structured audit JSON with BBoxes/selectors.
- Temperature: `0.2` for skeleton and repair. Use higher temperature only for first-pass visual concept generation.

Classify every treatment as:
- `linear-flow`: stacked cards, KPI bands, rows, timelines, simple left-to-right flows, or layouts expressible with flex/grid and no coordinate diagram.
- `2d-positioned`: node-link, hub/spoke, matrix, branching approval flow, connector lines, map-like layouts, legends, overlaid pills, popovers, or any design likely to need x/y placement.

Route:
- `linear-flow`: use current Product V4/M2/D6 path. Render and audit. Run Round-2 only if a gate returns FIX.
- `2d-positioned`: run skeleton-first before code. Always run one Round-2 visual repair after first render.

480px tile invariant:
- Canvas: `480x480`.
- Safe x range: `24..456`.
- Eyebrow zone: `y=24..56`.
- Diagram zone: `y=72..324`.
- Diagram/title gutter: `20px`.
- Bottom title zone: `x=24..456`, `y=344..456`, height `112px`.
- No diagram, connector, legend, row, pill, or node may enter `y>=344`.
- Keep the title zone reserved even if the title is only 1-2 lines.

2D skeleton requirements:
- Emit JSON only.
- Every visual element gets a bbox: node, pill, label, connector group, legend, row group, icon group.
- BBoxes use `{ "x": number, "y": number, "w": number, "h": number }`.
- Non-connector bboxes must not overlap.
- Minimum gap between non-connector bboxes: `12px`.
- Minimum gap between text bboxes and connector strokes: `8px`.
- Max visible matrix/table rows: `3`; aggregate extras into `+N` or a summary chip.
- Connector layer must render below text and nodes.
- Prefer CSS grid/flex inside each bbox. Use absolute positioning only to place the validated diagram blocks within the diagram zone.

Deterministic skeleton validators:
- `inside_canvas_safe_area`
- `inside_assigned_zone`
- `no_nonconnector_overlap`
- `min_gap_12`
- `title_zone_reserved`
- `max_visible_rows_3`
- `connector_underlay_only`
- `contrast_exit_0`

Round-2 visual repair input:
- Reference target/spec.
- Rendered v1 screenshot.
- V1 code.
- V1 skeleton JSON.
- Audit findings with `RC-id`, bbox, DOM selector if available, visible evidence, and exact repair instruction.

Round-2 instruction:
"Fix only the named visual gaps. Preserve the concept, palette, copy intent, and bottom-left title rule. Do not add new content. Do not change approved colors unless contrast validation fails. Recompute layout so all content fits the 480px tile. Keep all diagram elements out of the reserved title zone. Prefer grid/flex constraints inside validated BBoxes; use absolute positioning only for validated diagram block placement. Return complete code only."

SHIP gate:
- `overflow=false`
- `title_at_bottom_left=true`
- `contrast_exit_code=0`
- `no RC-1 vertical overflow visible`
- `no RC-2 node/pill/text collision visible`
- `no RC-3 title-zone violation visible`
```

```json
{
  "layoutSkeletonSchema": {
    "tileId": "string",
    "layoutPrimitive": "linear-flow | 2d-positioned",
    "canvas": { "w": 480, "h": 480 },
    "zones": {
      "eyebrow": { "x": 24, "y": 24, "w": 432, "h": 32 },
      "diagram": { "x": 24, "y": 72, "w": 432, "h": 252 },
      "title": { "x": 24, "y": 344, "w": 432, "h": 112 }
    },
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
    "aggregations": [
      {
        "sourceItems": 0,
        "visibleItems": 0,
        "summaryLabel": "+N"
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
}
```

## Why it works (mechanism + the RC-ids it fixes + cited sources)

The root defect is not GLM “bad at design” in general. The data says linear tiles already score `86-94`, while 2D-positioned diagrams collapse to `35-58`. So the fix is primitive routing, not another larger prose prompt.

Mechanism:

- `RC-1 vertical overflow`: fixed by reserving a non-negotiable `112px` title zone and limiting diagram content to `y=72..324`.
- `RC-2 2D collisions`: fixed by requiring a pre-code bbox skeleton and deterministic overlap/gap validation before code exists.
- `RC-3 title-at-bottom failures`: fixed by making the bottom title zone a structural region, not a reminder in prose.
- `RC-8 discarded FIX findings`: fixed by adding a bounded Self-Refine-style render feedback turn instead of stopping after generate/audit.

Source grounding:

- Self-Refine supports `Init -> Feedback -> Iterate`, actionable feedback, localization, and refinement loops. It reports broad task gains from at least 5% to more than 40%, with the public page citing the 20% average claim. Source: `https://selfrefine.info`, `https://github.com/madaan/self-refine`.
- GLM-4.6V docs explicitly describe frontend replication and visual debugging: upload screenshot/design, generate HTML/CSS/JS, circle a generated screenshot region, and correct the corresponding code. Source: `https://docs.z.ai/guides/vlm/glm-4.6v`.
- GLM-5.2 docs list input modality as text, while GLM-5V-Turbo is the documented multimodal coding model for screenshots, frontend recreation, code debugging, visual grounding, and bbox-style outputs. Source: `https://docs.z.ai/guides/llm/glm-5.2`, `https://docs.z.ai/guides/vlm/glm-5v-turbo`, `https://docs.z.ai/api-reference/llm/chat-completion`.
- LaTCoder shows why monolithic design-to-code loses layout, and why bbox division, block-wise synthesis, layout-preserved assembly, and screenshot verification improve complex layouts. It reports CC-HARD gains including TreeBLEU `+66.67%`, Visual Score `+12.5%`, and MAE `-38.53%` for DeepSeek-VL2. Source: `https://arxiv.org/html/2508.03560v1`.
- IFScale shows high instruction density causes degradation, primacy effects, and omission-dominant failure. This supports moving layout constraints into a short invariant block plus deterministic validators instead of adding more prompt prose. Source: `https://arxiv.org/html/2507.11538v1`.
- LaySPA supports layout-as-structured-object: element boxes plus rewards for format, collision, alignment, distribution, spacing, and hierarchy. It reports Qwen-7B + LaySPA collision reduction of 36%, alignment +63%, spacing +73%. Source: `https://arxiv.org/html/2509.16891v2`.
- Visual critique refinement supports BBoxes plus zoomed patches, coordinate markers, validation, and refinement. It improves UI critique grounding IoU from `0.120` to `0.357` for Gemini and `0.233` to `0.345` for GPT-4o. Source: `https://arxiv.org/html/2412.16829`.

## Predicted effect (SHIP-rate delta from 60%, diagram-vs-linear delta from ~41pts, contrast exit-0) + cost (tokens/latency)

Predicted, not confirmed until the 18 FIX tiles are rerun.

- Baseline: `27/45 = 60% SHIP`.
- Expected A3 result: convert `8-11` of the `18` FIX tiles.
- Expected SHIP rate: `35-38/45 = 78-84%`.
- Conservative lower bound: `33-35/45 = 73-78%` if visual repair works but skeleton validation catches fewer 2D cases.
- Upside: `39-40/45 = 87-89%` if most 2D failures are geometry-only and copy/contrast stay stable.
- Diagram band: expected lift from roughly `35-58` to `68-82`.
- Diagram-vs-linear delta: expected shrink from about `41pts` to `10-20pts`.
- Contrast exit-0: should remain unchanged if color mutation is forbidden in Round-2 and contrast remains a hard gate. Treat any contrast regression as a blocked SHIP, not a tradeoff.

Cost:

- Linear FIX tile: one extra render/audit and one extra model repair call only if gate fails.
- 2D tile: one skeleton call, one skeleton validation/repair loop if needed, one code call, one render/audit, one visual repair call.
- Practical token multiplier: about `1.4x-1.8x` for all tiles if routed, about `2.0x-2.6x` for 2D FIX tiles.
- API-equivalent pricing from Z.ai docs: `glm-5.2` is `$1.4/M input` and `$4.4/M output`; `glm-5v-turbo` is `$1.2/M input` and `$4/M output`.
- Exact image token cost is UNKNOWN without pipeline logs.
- Latency: add one GLM latency tail for linear FIX repair; add up to two GLM latency tails for 2D tiles. Using the prior observed `6-161s` tail, budget roughly `+1-3 minutes` per repaired 2D tile serially, lower with safe concurrency.

## Synergies + conflicts with sibling angles (name them)

Synergies:

- A1: Strong synergy. A3 operationalizes A1’s LaTCoder and IFScale recommendation by using layout regions, BBoxes, and deterministic checks instead of diffuse prose.
- A2: Strong synergy. A3 turns Chain-of-Rubrics into concrete gates: classify, skeleton, validate, code, render, repair, ship.
- A4: Strong synergy. A3 uses A4’s visual grounding lesson: audit findings should include BBoxes and zoomable regions. For implementation, include both BBoxes and DOM selectors.
- A5: Strong synergy. A3 adopts LaySPA’s structured spatial object and geometric rewards, but as prompt-time JSON plus validators rather than RL fine-tuning.
- A6: Strong synergy with adaptive planning. A3 is adaptive for `linear-flow` and mandatory only for `2d-positioned`, where the run data shows the defect cluster.
- A7: Strong synergy. A7 independently reinforces LaTCoder, IFScale, and LaySPA, matching A3’s final shape.

Conflicts:

- A6 cost-minimization vs A3 mandatory 2D Round-2: resolved by routing. Do not run heavy repair for all tiles; run it only after FIX for linear and always for 2D because 2D is the observed failure primitive.
- A1/A5 absolute-positioning advice vs maintainable CSS: resolved by allowing absolute positioning only for validated diagram block placement inside the diagram zone, while using grid/flex inside each block.
- GLM-5.2 “vision-to-code” label vs Z.ai docs: docs show `glm-5.2` is text-only and `glm-5v-turbo` is the vision coding model. If the current product wrapper truly accepts images under a GLM-5.2 label, test it directly; otherwise, use `glm-5v-turbo`/`glm-4.6v` for visual turns and `glm-5.2` for structured code.

## Confidence + residual risk

Confidence: `0.78`.

Reason: the recommendation is strongly supported by the defect pattern and by multiple independent sources on layout decomposition, iterative repair, visual grounding, and instruction-density limits.

Residual risks:

- Exact split of the 18 FIX tiles into `linear-flow` vs `2d-positioned` is not available from the prompt excerpt. The router removes the need for manual certainty, but the expected SHIP lift depends on that split.
- GLM-5.2 screenshot support is not source-confirmed. Direct API docs say use `glm-5v-turbo` or `glm-4.6v` for visual input.
- Skeleton validators can prevent collisions but cannot guarantee aesthetic polish. Keep one visual repair turn for 2D.
- Over-constraining the skeleton may make diagrams too sparse. Cap visible rows at 3, but preserve semantic intent through aggregation chips.
- If Round-2 is allowed to change palette or copy, contrast and brand consistency may regress. Keep those locked.

---

I’ll verify the cited mechanisms against the live sources, then collapse A4 into an implementation-ready pipeline that avoids duplicating sibling layout-planning work.SKILL ROUTING: deep-loop-workflows recommended with confidence 0.886, uncertainty 0.16. I’m loading it to follow the research workflow constraints before fetching sources.The request routes to the `research` mode, so I’ll use the deep-research packet for the source-verification pass and keep it read-only: no spec artifacts or workspace writes.I’m going to re-check the core A4 sources plus the sibling mechanisms that affect A4’s boundaries: external localized critique, self-refinement, correction/false-fix metrics, instruction density, layout decomposition, spatial layout rewards, and GLM visual debugging.Verified so far: A4 should remain an external, localized correction loop, not a general self-critique loop. The source evidence also tightens the guardrails: keep the prompt’s hard constraints short, move most checks into validators, and measure misjudgment/false-fix explicitly.# A4 FINAL recommendation

## The exact change

Add **`A4: minimax_issue_to_glm_repair_contract`** between MiniMax audit and GLM round-2. Run it only for `FIX` tiles or deterministic-gate failures.

```yaml
a4_round2_repair:
  scope: FIX_ONLY
  retry_depth: 1
  max_fixes_per_tile: 3
  ship_rule:
    primary: existing_minimax_status == "SHIP"
    fallback: score >= current_audit_config.ship_min_score
  layout_policy:
    rc1_rc2_tiles: force_linear_stack_or_bounded_lanes
    free_absolute_2d_positioning: forbidden
    absolute_allowed_only_for: decorative_backgrounds_or_A1_A5_layout_plan_boxes
  required_gates:
    - proof_check.py
    - contrast_check.py
    - geometry_check.py
    - minimax_rescore
  adopt_if:
    proof_check_pass: true
    contrast_check_pass: true
    geometry_check_pass: true
    minimax_status: SHIP
    false_fix_allowed: false
```

Copy-paste schema:

```json
{
  "tile_id": "accountbeheer-4",
  "round": 2,
  "source_auditor": "MiniMax-M3",
  "round1_status": "FIX",
  "round1_score": 35,
  "render": {
    "image_path": "renders/accountbeheer-4.png",
    "optional_region_bbox_2d": null
  },
  "non_regression_snapshot": {
    "title_position": "bottom-left",
    "overflow": false,
    "contrast_exit_0": true,
    "eyebrow_uppercase": false,
    "glyph_contract": "matches_original"
  },
  "fixes": [
    {
      "id": "fix-001",
      "defect_type": "vertical_overflow",
      "rc_ids": ["RC-1", "RC-3"],
      "severity": "blocking",
      "target_region": "inner matrix panel and reserved title area",
      "evidence": "MiniMax says matrix content spills past inner panel and overlaps bottom title/description.",
      "required_change": "Reserve bottom title block first. Replace dense matrix with at most three stacked rows or grouped summary rows.",
      "layout_contract": {
        "tile_height_px": 480,
        "reserved_bottom_title_block_px": 104,
        "diagram_max_bottom_y_px": 348,
        "preferred_primitives": ["stacked-list", "linear-flow", "bounded-lanes"],
        "forbidden": [
          "free 2D absolute node placement",
          "content overlapping title or description",
          "title above diagram"
        ]
      },
      "verification": [
        "proof_check.py:overflow=false",
        "proof_check.py:title_at_bottom=true",
        "geometry_check.py:node_overlap=false"
      ]
    }
  ]
}
```

GLM round-2 prompt block:

```text
You are regenerating one maritime-B2B dashboard bento tile.

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

Typed repair contract:
{{A4_FIXLIST_JSON}}

Previous MiniMax evidence:
{{MINIMAX_ISSUES}}

Previous code:
{{ROUND1_CODE}}

Return only the corrected tile code.
```

Adapter rules:

```text
spill | clipped | overlaps bottom title | past panel | bleed | outside rounded corners
=> vertical_overflow, RC-1, add bottom reservation + diagram_max_bottom_y constraints

overlaps | collides | crowding | popover clipped | node truncates text
=> node_collision, RC-2, force linear/stacked/bounded-lane primitive

title missing | title clipped | title top | bottom card edge
=> title_position, RC-3, reserve bottom-left title block

uppercase | all-caps | wrong glyph | icon mismatch
=> typography_or_icon_contract, RC-4, preserve original casing/glyph

low contrast | too light | near illegible
=> contrast, RC-5, require contrast_check.py exit 0
```

## Why it works

A4 turns MiniMax from a prose reviewer into an external correction source with typed, localized, validator-backed repair objects.

It fixes the RCs this run actually exposed:

| RC | A4 mechanism |
|---|---|
| RC-1 vertical overflow | Bottom reservation, diagram max-y, row cap, stacked fallback |
| RC-2 2D node collisions | Ban free 2D absolute placement for failing diagram tiles |
| RC-3 title-bottom failure | Bottom-left title block becomes a hard invariant |
| RC-4 uppercase/glyph drift | Explicit contract preservation and false-fix guard |
| RC-5 contrast | Deterministic `contrast_check.py`, not MiniMax-only judgment |
| RC-8 free-text audit gap | MiniMax issue strings become structured fix JSON |

Source grounding:

| Source | Mechanism reused |
|---|---|
| `arxiv.org/html/2412.16829` | UI critique improves when feedback is split into text issue, filtering, bbox/region grounding, refinement, and validation. Their visual prompting + iterative refinement improved bounding-box IoU from `0.120` to `0.357` for Gemini and `0.233` to `0.345` for GPT-4o. |
| `github.com/madaan/self-refine` | Use `Init -> Feedback -> Iterate`, but with MiniMax as external auditor rather than GLM self-critiquing. |
| `arxiv.org/html/2510.16062v1` | External correction is more stable than pure intrinsic correction; measure both correction rate and misjudgment/false-fix rate. |
| `docs.z.ai/guides/vlm/glm-4.6v` | GLM visual debugging supports screenshot-region correction; A4 keeps `optional_region_bbox_2d` for circled/cropped repair when available. |
| `arxiv.org/html/2507.11538v1` | IFScale shows instruction adherence degrades with instruction density and omissions dominate, so A4 keeps eight hard invariants early and moves the rest into JSON/gates. |
| `arxiv.org/html/2508.03560v1` | LaTCoder shows layout preservation improves when regions/BBoxes bound generation; A4 consumes bounded layout contracts instead of relying on prose like “make layout right.” |
| `arxiv.org/html/2509.16891v2` and `arxiv.org/abs/2605.25447` | Spatial layout improves with explicit box specs and executable geometry rewards; A4 adopts this at inference time via `geometry_check.py`, not training. |

## Predicted effect

A4 alone should convert **5-7 of the 18 FIX tiles**.

Expected batch result:

```text
baseline: 27/45 = 60% SHIP
A4 alone: 32-34/45 = 71-76% SHIP
A4 + A1/A5 layout-plan support: 34-36/45 = 76-80% SHIP
```

Diagram-vs-linear gap:

```text
current gap: ~41 pts
A4 alone: reduce by ~16-24 pts
expected low 2D diagram band: 35-58 -> 62-78
remaining gap: ~17-25 pts
```

Contrast:

```text
contrast-labeled FIX subset: +25-40pp contrast_check.py exit-0
full 45-tile batch: likely +8-15pp, depending on how many current failures are contrast-related
```

Cost:

```text
affected tiles only: ~1.7-2.2x latency
full batch, if only 18/45 enter A4: ~1.3-1.5x latency
tokens per repaired tile: previous code + 0.7-1.5k fix JSON + ~0.5k invariant prompt + generated code
extra scoring: deterministic gates + one MiniMax rescore
```

## Synergies + conflicts with sibling angles

| Angle | Synergy | Conflict / boundary |
|---|---|---|
| A1 | A4 consumes A1-style bounded regions and layout decomposition. | A4 should not own global block decomposition or assembly. |
| A2 | A4’s fix-list is a Chain-of-Rubrics repair sequence. | Cap at 3 fixes per tile to avoid instruction-density failure. |
| A3 | A4 uses visual debugging and iterative repair. | Do not let GLM critique itself; MiniMax remains auditor. |
| A5 | A4 uses spatial JSON and geometry gates. | Do not turn A4 into RL/fine-tuning; keep it inference-time. |
| A6 | A4 matches adaptive planning: only add repair after failure. | Do not run round-2 for SHIP tiles. |
| A7 | A4 aligns with layout-as-thought and deterministic spatial checks. | A4 should not duplicate A7’s layout-plan-first primitive work. |

## Confidence + residual risk

Confidence: **0.78**.

Main residual risks:

| Risk | Mitigation |
|---|---|
| GLM still fails RC-1/RC-2 geometry despite typed fixes | Force linear/stacked/bounded-lane primitives for those fixes. |
| MiniMax free text is misclassified by adapter | Keep raw evidence in JSON and log failed fix IDs. |
| Multiple fixes cause false-fixes | Max 3 fixes, non-regression snapshot, adopt-only-if gates pass. |
| `proof_check.py` does not detect node overlap | Add or require `geometry_check.py` before trusting A4 on RC-2. |
| A4 cannot reach the 86-94 linear high band alone | Pair with A1/A5 layout-plan primitives for the remaining gap. |

---

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

---

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

---

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

## Experiment designs (A1, A3, A4, A5)
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

---

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

---

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

---

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

## Recommended end-to-end pipeline
I’ll keep this read-only and synthesize directly from the provided angle recommendations, using the local memory/advisor gates only to catch any relevant context or required skill routing.SKILL ROUTING: advisor surfaced `cli-opencode` and `sk-prompt-models` above threshold but ambiguously. I’ll load the model-prompt guidance for GLM-specific synthesis and the CLI contract only to confirm no external dispatch is needed.# Recommended Program

RC legend: `RC-1` overflow, `RC-2` 2D collisions, `RC-3` title-zone failures, `RC-4` casing/glyph drift, `RC-5` contrast, `RC-6` decorative color, `RC-7` visual slop, `RC-8` discarded audit findings.

## 1. END-TO-END PIPELINE

| Step | What it does | Angle + RC-id | Effort | Applies to |
|---:|---|---|---|---|
| 1 | Replace diffuse layout prose with a short `A1_SAFE_LINEAR_560_V2` hard spatial contract: fixed visual region, reserved bottom title band, primitive caps, dark text tokens, no content `absolute`. | A1, A2, A7; `RC-1`, `RC-2`, `RC-3`, `RC-4`, `RC-5` | S | all tiles |
| 2 | Add required preflight metadata: selected primitive, visible item count, overflow summary, `usesAbsoluteForContent=false`, contrast token inventory. Use it as metadata, not rendered content. | A2; `RC-2`, `RC-5`, `RC-6`, `RC-7` | S | all tiles |
| 3 | Route primitives before generation: keep list/table/timeline as normal flow; flag matrix, node, branch, funnel, popover, connector-map, dense chart as `2D-positioned`. | A3, A5, A6, A7; `RC-1`, `RC-2`, `RC-3` | S | all tiles |
| 4 | Generate first pass with direct Z.AI multimodal API, `thinking.disabled`, low temperature. Keep GLM as renderer/generator, not as verifier. | A3, A6; GLM docs/profile; `RC-8` | S | all tiles |
| 5 | Run deterministic DOM/CSS gate after render: title band intrusion, visual bottom, overlap, clipping, `text-transform`, contrast, banned gray-on-dark text. | A1, A5, A7; LaTCoder, LaySPA, GeoSVG-RL; `RC-1` to `RC-5` | M | all tiles |
| 6 | For failing non-2D or simple 2D tiles, run exactly one typed repair pass with failure JSON and screenshot. Lock copy, palette, title zone, glyph, and casing. | A3, A4; Self-Refine, visual critique refinement; `RC-1` to `RC-5`, `RC-8` | M | all tiles, failure-only |
| 7 | For high-risk `2D-positioned` tiles, compute a skeleton first: regions, boxes, row caps, anchors, connector routes, AABB gaps. GLM must render from skeleton, not invent coordinates. | A5, A7; LaySPA, GeoSVG-RL, LaTCoder; `RC-1`, `RC-2`, `RC-3` | L | 2D-positioned only |
| 8 | If skeleton render fails once, recompute best-of-3 skeletons upstream and choose the best geometry score. Do not ask GLM for free coordinate retries. | A5, A6, A7; AdaCoder; `RC-1`, `RC-2`, `RC-3` | M | 2D-positioned only |
| 9 | If 2D fails twice, downgrade to `linear-flow`, `stacked-list`, or `compact-matrix`. Preserve semantic intent with `+N more`, not crowded geometry. | A1, A5, A7; `RC-1`, `RC-2`, `RC-7` | S | 2D-positioned only |
| 10 | Use MiniMax-M3 as external visual auditor only after deterministic gates pass or for borderline failures. Convert MiniMax issues to typed fix JSON. | A4, A2; visual critique refinement; `RC-5`, `RC-6`, `RC-7`, `RC-8` | M | all tiles, failure-only |
| 11 | Final adoption gate: ship only if deterministic geometry, contrast, casing/glyph, palette, and MiniMax status pass. Otherwise keep prior best or downgrade. | A1 to A7; all RCs | M | all tiles |

## 2. PREDICTED LIFT

| Scenario | SHIP rate | Diagram-vs-linear delta | Interpretation |
|---|---:|---:|---|
| Baseline | `27/45 = 60%` | `~41 pts` | Linear tiles already strong; 2D-positioned diagrams are the core defect. |
| First move only: A1 prompt + deterministic gate + one repair | `34-37/45 = 76-82%` | `15-22 pts` | Best lift-per-effort. Converts many overflow/title/contrast failures and forces risky diagrams into safer primitives. |
| Conservative full pipeline | `36-38/45 = 80-84%` | `14-20 pts` | Assumes overlap among A1/A3/A4/A5 gains and some remaining aesthetic/slop failures. |
| Optimistic full pipeline | `39-41/45 = 87-91%` | `8-14 pts` | Requires skeleton-first 2D renderer to work on most matrix/node/funnel failures without damaging linear winners. |

Reasoning chain:

| Cause | Expected effect |
|---|---|
| The baseline has `18` FIX tiles. A1/T2 is projected by multiple angle designs at roughly `+7` to `+10` shipped tiles. | Moves batch to `34-37/45`. |
| Most high-value failures are `RC-1`, `RC-2`, and `RC-3`, not general taste. | Geometry gates and skeletons should outperform more prose. |
| Linear-flow tiles already score `86-94`. | The program must preserve them, not over-plan them. |
| A5/A7 skeleton-first should recover additional dense 2D holdouts after A1. | Adds roughly `+2` to `+4` tiles beyond first move if renderer/scaffold is implemented well. |
| A4 repair consumes already-created MiniMax findings instead of discarding them. | Adds `+1` to `+3` net tiles after overlap, mainly contrast/palette/clipping. |
| IFScale warns that dense instructions are omitted. | Keep prompt contract short and move checks into validators. |

Contrast expectation: accepted outputs should reach `95-100%` contrast exit-0 because dark text tokens and actual CSS contrast checks are hard gates.

## 3. ADOPT/ADAPT/REJECT TABLE

| Item | Verdict | RC-id(s) | Predicted contribution | Why |
|---|---|---|---|---|
| A1 safe linear contract | ADOPT | `RC-1`, `RC-2`, `RC-3`, `RC-4`, `RC-5` | `+7` to `+10` SHIP tiles when paired with gate/repair | Highest direct match to defect: bounded visual box, title band, primitive caps, banned gray tokens. |
| A2 reasoning-embedded rubric | ADAPT | `RC-2`, `RC-5`, `RC-6`, `RC-7` | `+2` to `+5` tiles, mostly through A1 synergy | Keep the JSON preflight and anti-slop semantics, but do not add a long rubric wall. |
| A3 primitive-routed repair | ADOPT | `RC-1`, `RC-2`, `RC-3`, `RC-8` | `+3` to `+6` incremental after prompt gate | Strong for route-specific repair. Use one failure-triggered turn, not always-on self-refine. |
| A4 MiniMax issue-to-repair adapter | ADOPT | `RC-1` to `RC-6`, `RC-8` | `+1` to `+3` incremental after A1/A3 overlap | Turns free-text audit into typed repair objects and prevents false-fixes with adopt-if gates. |
| A5 skeleton-first 2D | ADOPT | `RC-1`, `RC-2`, `RC-3` | `+2` to `+4` incremental after A1; larger if many 2D holdouts remain | Correct long-term mechanism: upstream geometry owns boxes, GLM renders. |
| A6 GPT-5.5 skeleton author | ADAPT | `RC-1`, `RC-2`, `RC-3`, `RC-4` | `+1` to `+3` on hardest 2D cases | Use only for dense/high-risk 2D or after skeleton failure. Too expensive for linear tiles. |
| A7 Bento Geometry Kernel | ADAPT | `RC-1`, `RC-2`, `RC-3`, `RC-5`, `RC-7` | Long-term ceiling raiser to `39-41/45` | Correct architecture, but bigger engineering lift. Implement after A1 gate proves ROI. |
| LaTCoder, `https://arxiv.org/html/2508.03560v1` | ADOPT | `RC-1`, `RC-2`, `RC-3` | High | Supports bounded regions, block-wise synthesis, and layout-preserved assembly. |
| IFScale, `https://arxiv.org/html/2507.11538v1` | ADOPT | `RC-3`, `RC-4`, `RC-5` | High | Explains why long prompt prose fails. Put hard rules early and validate mechanically. |
| LaySPA, `https://arxiv.org/html/2509.16891v2` | ADOPT | `RC-1`, `RC-2` | High | Supports explicit layout objects and collision/alignment/spacing rewards. |
| GeoSVG-RL, `https://arxiv.org/html/2605.25447` | ADOPT | `RC-1`, `RC-2`, `RC-3` | High | Supports plan-first generation plus browser-backed geometry extraction. |
| Self-Refine, `https://github.com/madaan/self-refine` | ADAPT | `RC-8`, secondary `RC-1` to `RC-5` | Medium | Use feedback/refine once after measured failure. Do not run open-ended self-refine. |
| Visual critique refinement, `https://arxiv.org/html/2412.16829` | ADOPT | `RC-2`, `RC-5`, `RC-8` | Medium | Supports localized issue evidence, bboxes, and refinement validation. |
| Chain-of-Rubrics | ADAPT | `RC-4`, `RC-5`, `RC-6`, `RC-7` | Medium | Useful as short gate sequence, harmful if expanded into dense prose. |
| DesignerlyLoop, `https://arxiv.org/abs/2511.15331` | ADAPT | `RC-6`, `RC-7` | Low to medium | Supports externalized planning and curated examples, but geometry still needs validators. |
| UI/UX LLM SLR, `https://arxiv.org/html/2507.04469v1` | ADAPT | `RC-6`, `RC-7` | Low to medium | Supports structured prompting and evaluation; also warns prompt-only spatial reasoning is weak. |
| DesignersForest semantic-token guidance | ADOPT | `RC-5`, `RC-6`, `RC-7` | Medium | Semantic color tokens and auto-layout defaults map directly to contrast and anti-slop failures. |
| GLM-5.2 / GLM-5V docs | ADAPT | `RC-8` | Medium operational risk reduction | Use direct Z.AI multimodal path where proven. Do not trust GLM self-audit as acceptance source. |
| AdaCoder, `https://ar5iv.labs.arxiv.org/html/2504.04220` | ADOPT | `RC-1`, `RC-2`, `RC-8` | Medium cost control | Supports adaptive planning: escalate only when the verifier proves native generation failed. |
| DiagramEval, `https://arxiv.org/html/2510.25761` | ADAPT | `RC-2`, `RC-7` | Medium for later kernel | Useful for graph/node/edge agreement checks once diagrams are rendered from semantic plans. |
| DCGen, `https://arxiv.org/html/2406.16386v1` | ADOPT | `RC-1`, `RC-3` | Medium | Reinforces region ownership and decomposition for design-to-code layout. |

## 4. HIGHEST-ROI FIRST MOVE

Ship **A1 prompt replacement + deterministic DOM/CSS gate + one failure-only repair** first.

Why this dominates lift-per-effort:

| Factor | Reason |
|---|---|
| Highest defect coverage | Directly hits `RC-1`, `RC-2`, `RC-3`, `RC-4`, and `RC-5`, which are the recurring hard failures. |
| Low implementation cost | Mostly prompt block replacement plus a browser bbox/contrast gate. No deterministic renderer or GPT-5.5 skeleton service required. |
| Applies to all tiles | Protects linear winners while forcing risky diagrams away from freeform positioning. |
| Non-additive proof point | It creates the measurement surface needed for A3/A4/A5: failure JSON, bboxes, title-zone intrusion, contrast, clipping. |
| Expected lift | Best first experiment target is `34-37/45 SHIP`, from `60%` to `76-82%`, with diagram gap reduced to `15-22 pts`. |

Next move after that: implement A5/A7 skeleton-first only for the remaining failing `2D-positioned` tiles. Keep A6 GPT-5.5 skeleton author as an escalation path, not the default.

## Risk & cost
SKILL ROUTING: advisor returned ambiguous `cli-opencode` and `sk-prompt-models` above confidence threshold. I’m loading both read-only; no external CLI dispatch is needed for the critique unless the skill contract says otherwise. 
The OpenCode skill confirms no self-dispatch is appropriate from this runtime; the GLM path matters only as model/provider constraints. I’m reading the GLM/MiniMax prompt-craft and budget references so the cost critique is grounded in local model guidance.**Verdict**
The pipeline is directionally right: move spatial reasoning out of prose and into validators/skeletons. Main risk is that it may raise `SHIP` by downgrading or over-gating, not by improving visual quality. Treat the predicted lift as a hypothesis, not a forecast.

**1. Failure Modes**
| Failure Mode | Risk |
|---|---|
| Validator overfit | DOM/CSS gates can pass technically valid but visually dull outputs. `RC-7` slop will not be solved by bbox/contrast alone. |
| False geometry failures | Bbox overlap gates can flag intended connector proximity, shadows, icons, or decorative layering unless the rules distinguish content text from non-content geometry. |
| False geometry passes | DOM boxes miss semantic crowding, awkward rhythm, visual imbalance, connector ambiguity, and text that is readable but compositionally bad. |
| Contrast gate blind spots | Gradients, opacity, anti-aliasing, shadows, blend modes, and screenshots can differ from computed CSS contrast. |
| Repair pass regression | A typed repair can fix overlap while changing copy, hierarchy, casing, glyphs, or semantic grouping. Locking helps, but models still drift. |
| Skeleton quality bottleneck | Skeleton-first moves the hard problem upstream. If skeleton scoring is weak, GLM will faithfully render bad geometry. |
| 2D downgrade inflation | `linear-flow`/`stacked-list` can improve pass rate while reducing the value of diagrams. This is a quality trade, not pure lift. |
| MiniMax audit noise | External visual audit can introduce false positives or subjective taste changes unless measured against human labels first. |
| Direct Z.AI API operational drift | GLM vision via direct API is justified, but bypasses the normal executor path. Auth, endpoint, slug, and payload behavior become pipeline dependencies. |
| Latency tail | Local GLM profile shows observed `6-161s`, avg `~26s`, and about `1/45` transient dispatch failures. A tight timeout will bias the experiment downward. |

**2. Recommendations That Might Not Lift Quality**
| Recommendation | Why It Might Not Lift |
|---|---|
| A2 rubric expansion | GLM-5.2 profile favors lean COSTAR prompting. Long rubric prose risks omission and instruction dilution. Keep metadata short and machine-checked. |
| A4 MiniMax repair adapter | Useful only if MiniMax findings have high precision. Otherwise it adds paid calls and repair churn after deterministic pass already handled obvious failures. |
| A6 GPT-5.5 skeleton author | Likely too expensive as default. Use only when deterministic skeleton/ranker fails on high-value 2D tiles. |
| A7 full Bento Geometry Kernel | Correct architecture, but high engineering cost. It can become a custom renderer project before ROI is proven. |
| Literature-backed lift estimates | Papers support mechanisms, not your tile-specific delta. They justify experiments, not `+N` shipped tiles. |
| One repair pass for 2D layouts | Good for local fixes, weak for fundamentally overcrowded geometry. Dense node/matrix/funnel failures need replanning, not patching. |
| A1 safe linear contract | High pass-rate lift, but may reduce visual richness. It can win by avoiding hard layouts rather than improving them. |

**3. Cost Ceiling**
Assuming GLM dispatch cost is `0` under the Z.AI plan, the real costs are quota, latency, and paid escalation calls.

| Tile Path | Paid Calls | GLM Calls | Expected Wall-Clock |
|---|---:|---:|---|
| Linear pass first try | `0` | `1` | `~30-45s` typical including render/gate |
| Linear fail + one GLM repair | `0` | `2` | `~60-120s` typical, slow tail can hit `3-6 min` |
| 2D with deterministic skeleton | `0` | `1-2` | `~1-3 min` typical |
| 2D skeleton fail + best-of-3 deterministic skeletons | `0` | `2-3` | `~2-5 min` typical |
| 2D with GPT-5.5 skeleton escalation | `1-4 GPT-5.5` | `1-3` | likely `4-12 min` serial, exact paid price unknown |
| MiniMax visual audit added | `+1 MiniMax` | unchanged | add one paid vision/audit latency per audited tile |

Batch ceiling for 45 tiles:

| Scope | Ceiling |
|---|---|
| A1 + gate + one repair, using baseline `18` failures | `45 + 18 = 63` GLM calls, `0` paid calls |
| MiniMax on every tile | `45` paid MiniMax calls, likely unnecessary |
| MiniMax failure-only on baseline failures | up to `18` paid MiniMax calls |
| GPT-5.5 skeleton on all 2D failures | `N_2D * 1-4` paid GPT-5.5 calls |
| Worst paid escalation if every failing tile is high-risk 2D | up to `18 * 4 = 72` GPT-5.5 calls plus up to `18` MiniMax calls |

Exact dollar ceiling is `UNKNOWN` without live token prices and prompt/image sizes. Track ceiling as `paid calls × avg input/output/image tokens × provider price`.

**4. Pilot First**
Pilot in this order:

| Pilot Step | Goal |
|---|---|
| Offline validator calibration on existing 45 renders | Measure false positives/false negatives before spending model calls. |
| A1 prompt + deterministic gate + one GLM repair on a stratified sample | Use 12-15 tiles: linear winners, known 2D failures, borderline contrast/title failures. |
| Shadow MiniMax audit only | Run MiniMax but do not gate on it. Compare precision against human labels. |
| Skeleton-first only on residual 2D failures | Test deterministic skeleton quality before adding GPT-5.5. |
| GPT-5.5 skeleton author only as A/B escalation | Compare against deterministic skeletons on the same failed 2D cases. |

Go/no-go metrics:

| Metric | Suggested Bar |
|---|---|
| Linear no-regression | `>=90%` of prior linear winners still pass and remain semantically equivalent |
| Validator precision | `<15%` human-disagreed blocks |
| Repair safety | `0` copy/casing/glyph regressions on locked fields |
| 2D recovery | at least `+3` recovered tiles in the pilot sample before building A7 |
| Cost | no paid calls in first pilot except shadow MiniMax sample |
| Latency | median per tile under `90s`; slow-tail policy explicit |

**5. Over-Optimistic Lift Assumptions**
| Claim | Concern |
|---|---|
| `34-37/45` from first move | Plausible, but only if “ship” allows safer downgrades. If preserving diagram richness matters, expect lower lift. |
| `39-41/45` optimistic full pipeline | Aggressive for `n=45`. One tile is `2.2 pts`, so `+1` to `+3` tile claims are noisy. Use paired tile-level deltas. |
| A1/A3/A4/A5 contributions | Strongly overlapping. Do not add gains from prompt, repair, skeleton, and audit independently. |
| Skeleton-first `+2` to `+4` | Assumes skeleton scoring predicts real rendered quality and GLM follows the skeleton. Both need proof. |
| MiniMax `+1` to `+3` | Only true if its findings are precise and repairable. Otherwise net effect can be zero or negative. |
| `95-100%` contrast exit-0 | This is mostly tautological if contrast is a hard gate. It proves accepted outputs pass contrast, not that the system shipped more good tiles. |
| Literature transfer | The cited systems support the architecture, but they do not validate GLM-5.2 on your tile distribution. |

Best first move remains A1 + deterministic gate + one repair, but define success as paired quality lift with semantic preservation, not just a higher `SHIP` count.

## Cited sources
- https://ar5iv.labs.arxiv.org/html/2504.04220
- https://ar5iv.labs.arxiv.org/html/2504.04220`
- https://ar5iv.labs.arxiv.org/html/2511.15331
- https://ar5iv.labs.arxiv.org/html/2511.15331`
- https://arxiv.org/abs/2303.17651
- https://arxiv.org/abs/2412.16829`
- https://arxiv.org/abs/2504.04220`
- https://arxiv.org/abs/2511.15331
- https://arxiv.org/abs/2511.15331`
- https://arxiv.org/html/2406.16386v1
- https://arxiv.org/html/2412.16829`
- https://arxiv.org/html/2507.04469v1
- https://arxiv.org/html/2507.04469v1**
- https://arxiv.org/html/2507.04469v1`
- https://arxiv.org/html/2507.11538v1
- https://arxiv.org/html/2507.11538v1`
- https://arxiv.org/html/2508.03560v1
- https://arxiv.org/html/2508.03560v1`
- https://arxiv.org/html/2509.16891v2
- https://arxiv.org/html/2509.16891v2`
- https://arxiv.org/html/2510.16062v1**
- https://arxiv.org/html/2510.25761
- https://arxiv.org/html/2605.25447
- https://arxiv.org/html/2605.25447`
- https://arxiv.org/pdf/2412.16829**
- https://arxiv.org/pdf/2504.04220`
- https://arxiv.org/pdf/2510.25761
- https://arxiv.org/pdf/2511.15331**
- https://arxiv.org/pdf/2511.15331`
- https://docs.z.ai/api-reference/llm/chat-completion`
- https://docs.z.ai/guides/llm/glm-5.2
- https://docs.z.ai/guides/llm/glm-5.2`
- https://docs.z.ai/guides/vlm/glm-4.6v
- https://docs.z.ai/guides/vlm/glm-4.6v`
- https://docs.z.ai/guides/vlm/glm-5v-turbo`
- https://github.com/madaan/self-refine
- https://github.com/madaan/self-refine**
- https://github.com/madaan/self-refine`
- https://pub.towardsai.net/stop-fixing-your-ai-svgs-715df70ccca0
- https://selfrefine.info`
- https://www.designersforest.com/dear-llm-heres-how-my-design-system-works/
- https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework
- https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework**
- https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework`
