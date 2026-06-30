---
title: "Anobel Bento Visuals — Research Angles (GLM-5.2 vision-to-code refinement)"
research_topic: >-
  Why the GLM-5.2 vision-to-code run produced only "okay-ish, not refined" maritime-B2B
  bento tiles, and how to lift it across seven levers — (1) tightening the text PROMPT
  contract, (2) embedding sk-design DESIGN-SKILL reasoning rather than only values,
  (3) ORCHESTRATION with a render-feedback round-2 and treatment-aware routing,
  (4) pairing MiniMax-M3 heavier as an auditor-in-the-loop, (5) resolving the
  INSTRUCTION-DENSITY vs constraint-layout failure (more upstream structure vs more prose),
  (6) pairing a stronger GPT-5.5 planner/co-auditor, and (7) scoring external ONLINE
  insights against this run's own defects.
spec_folder: ".opencode/specs/anobel.com/004-bento-visuals/"
loop_config:
  max_iterations: 20
  convergence_threshold: 0.0
non_goals:
  - "Do NOT re-run / regenerate the 45 tiles in this document; this is a research-angles seed, not a generation run."
  - "Do NOT change the approved house style, register (Product / V4 M2 D6), or palette (brand #06458c/#043367, green status-only, red alerts-only, orange=0, muted #4e4e4e)."
  - "Do NOT re-litigate the MiniMax-M3 auditor-of-record choice (GLM confabulates audits; that is settled — see vision-audit-benchmark.md)."
  - "Do NOT broaden scope to non-bento surfaces, Open Design transport mechanics, or the deferred improve-if-better sweep."
stop_conditions:
  - "All 7 angles answered with a concrete, testable recommendation AND at least 1 cited external source each."
  - "A recommended end-to-end pipeline is specified with a predicted SHIP-rate lift (baseline 27/45 = 60%) and a predicted diagram-vs-table score-delta reduction (baseline ~41 points: 2D-diagram tiles cluster 35-70, linear tiles 86-94)."
  - "Each Root-Cause id (RC-1..RC-8) is consumed by at least one angle with a named artifact (contract change / dial preset / pipeline step)."
---

# Anobel Bento Visuals — Research Angles

> Seed document for a downstream 20-iteration deep-research loop. Authored from a design-forensics
> retrospective that VIEWED the rendered pixels (not the HTML source) of the 45-tile GLM-5.2 run,
> ran the deterministic gates (`contrast_check.py`, anti-tell greps), and swept external practice.
> Register = **Product**, dials **V4 / M2 / D6** — the instrument-grade posture every recommendation must hold.

**Run facts (authoritative, recomputed from `research/inputs/audit-*.json`):** 45 tiles (9 concepts × 5 treatments),
**27 SHIP / 18 FIX (60% SHIP)**, score mean **81.1**, range **35 → 94**. The 18 FIX findings were produced by
MiniMax-M3 (auditor of record) and **never fed back to GLM** — the run was single-shot generate → gate → audit → STOP.

---

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

## §2 Angles (7 — one per operator dimension)

## Angle A1 — PROMPTING
- **Dimension:** prompting
- **Hypothesis:** Pinning the *mechanical* constraints the dense prose contract only described — case (eyebrow Title-case via literal text, not `text-transform`), z-order, safe-zones, an explicit vertical height budget with a reserved bottom-title band, a neutral-on-dark companion ramp, and an enumerated set of adversarial layout edge-cases — converts RC-1/RC-3/RC-4/RC-5 from "dropped under load" into checkable invariants and lifts SHIP rate without changing the house style.
- **Why it matters (grounded):** RC-1 (overflow) drove the two worst tiles (accountbeheer-4 **35**, orders-facturen-4 **52**); RC-3 broke title-at-bottom on 3 tiles; RC-4 leaked `text-transform:uppercase` **3×** in goedkeuringssysteem-4 despite the contract literally saying "Title case, NOT uppercase"; RC-5 produced #4e4e4e-on-navy at **1.51:1** and #8591b3-as-text at **3.14:1**. These are all *stated-but-unenforced* prose rules — the contract told, it did not constrain.
- **Researchable question:** Which contract rewrites (literal pre-cased strings, an explicit `safe-zone`/height-budget block, a neutral-on-dark token pair, and an enumerated adversarial-edge-case list) most reduce RC-1/RC-3/RC-4/RC-5 recurrence per dollar of added prompt tokens?
- **What to test / measure:** A/B the current contract vs a hardened contract on the 8 RC-1 tiles + the 3 RC-3 tiles; metrics = overflow count (audit `overflow:true` rate), `title_at_bottom:true` rate, `text-transform:uppercase` grep-count → 0, `contrast_check.py` exit-0 rate on the enumerated text-on-navy pairs, and net MiniMax-M3 score delta. Watch token cost — see A5's instruction-density cliff.
- **Candidate online sources:**
  - https://arxiv.org/html/2508.03560v1 (LaTCoder — layout preservation; use absolute positioning sparingly)
  - https://arxiv.org/html/2507.11538v1 (IFScale — every-instruction compliance decays ~exponentially; >15 constraints → cliff)
  - https://www.designersforest.com/dear-llm-heres-how-my-design-system-works/ (practitioner: how to state a design system to an LLM)
- **Decision it should produce:** A revised `goal-prompt.md` contract block (a CONTRACT CHANGE): a `LAYOUT SAFE-ZONE` section (reserved title band height, max instrument height, max-row count per primitive), pre-cased eyebrow string, an explicit `text-on-dark` neutral, and a 6-8 item adversarial edge-case checklist.

## Angle A2 — DESIGN-SKILL UTILIZATION
- **Dimension:** design-skill-utilization
- **Hypothesis:** The run fed GLM design *values* (hex, radius, weights) but not sk-design *reasoning*; embedding the foundations contrast-pair inventory, the interface pre-flight checklist, and the audit-rubric language as a Chain-of-Rubrics reasoning scaffold inside the generation prompt will reduce the refinement defects (RC-5 context-blind contrast, RC-6 color-as-decoration, RC-7 decorative slop) that no value-only contract can prevent.
- **Why it matters (grounded):** RC-7 (slop) and RC-6 (off-brand red/orange) are pure *judgment* misses a value list cannot catch — prijzen-condities-3 (**62**, 3D extrusion reads as gradient), aangepast-assortiment-5 (**70**, funnel buries content), accountbeheer-2 (**78**, decorative red). RC-5's #4e4e4e-on-navy (**1.51:1**) is exactly the "compute the contrast pair, don't eyeball" discipline the foundations contrast-pair inventory enforces but the prompt never asked GLM to run. The register is **Product V4/M2/D6** — restraint is the brief, yet GLM defaulted to decoration.
- **Researchable question:** Does embedding the sk-design pre-flight + contrast-pair inventory + anti-slop reasoning (as a "reason then build" rubric the model must fill before emitting HTML) raise the on-brand/anti-slop audit sub-scores more than an equal token-count of additional value rules?
- **What to test / measure:** A/B value-only contract vs reasoning-embedded contract on the RC-6/RC-7 tiles; metrics = MiniMax-M3 `on_brand:true` rate, anti-slop dimension score, contrast_check exit-0 on enumerated pairs, and whether GLM emits a filled pre-flight before the HTML (compliance rate). Hold register dials fixed (V4/M2/D6).
- **Candidate online sources:**
  - https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework (Chain-of-Rubrics — rubric as the reasoning backbone)
  - https://arxiv.org/html/2507.04469v1 (UI/UX SLR — structured prompt design as the foundational quality enabler; few-shot exemplars as structural amplifier)
  - https://arxiv.org/pdf/2511.15331 (DesignerlyLoop — curated reasoning to form design intent for human-LLM alignment)
- **Decision it should produce:** A generation-prompt PREAMBLE (a CONTRACT CHANGE): a mandatory "fill the contrast-pair inventory + pre-flight card, THEN build" rubric block, plus 1-2 grounded few-shot exemplars of the linear primitive, embedded in the per-tile prompt.

## Angle A3 — ORCHESTRATION
- **Dimension:** orchestration
- **Hypothesis:** Adding a render-feedback round-2 (render GLM's own output, attach reference + render + named gaps) and routing 2D-diagram treatments through a different sub-pipeline than linear treatments will close RC-1/RC-2/RC-8 — converting single-shot's 60% SHIP toward the ~89% SHIP the linear treatments already hit.
- **Why it matters (grounded):** RC-8 is the headline waste: **18/45 FIX findings were produced and discarded** because the pipeline was generate→gate→audit→STOP with no round-2. RC-1/RC-2 are *render-visible* defects (overflow, collisions) that a second pass with the rendered image attached can name and fix — GLM-4.6V's documented "circle the area + 'move this' " loop and Self-Refine's +20% gain both show iterate-on-render works. The diagram-vs-linear delta (~41 points) means a one-size pipeline is mis-serving half the treatments.
- **Researchable question:** What single-shot vs 2-round (generate → render → re-prompt with the render + MiniMax findings) SHIP-rate difference is achievable, and does treatment-aware routing (2D-positioned primitives → skeleton-first or diagram-specialist path; linear → current path) beat a uniform round-2?
- **What to test / measure:** 3-arm test on the 18 FIX tiles — (a) single-shot baseline, (b) uniform render-feedback round-2, (c) routed (linear vs 2D split); metrics = SHIP-rate lift over the 60% baseline, FIX→SHIP conversion count, diagram-tile score delta vs the 86-94 linear band, and added latency/token cost per tile (GLM dispatch cost = 0 on subscription, so cost = wall-clock; budget the 6-161s GLM latency tail).
- **Candidate online sources:**
  - https://github.com/madaan/self-refine (Self-Refine — generate→feedback→refine, +20% avg)
  - https://docs.z.ai/guides/vlm/glm-4.6v (GLM-4.6V — circle-area + natural-language correction loop; pixel-level design-to-code sibling)
  - https://arxiv.org/html/2508.03560v1 (LaTCoder — divide into regions, generate per-region, assemble + dynamic selection)
- **Decision it should produce:** A PIPELINE STEP added to `goal-prompt.md` method: an explicit round-2 (render → re-prompt with reference + render + structured findings) and a routing fork keyed on the layout PRIMITIVE (2D-positioned vs linear-flow), not the a-e index.

## Angle A4 — PAIR MiniMax-M3 HEAVIER (auditor-in-the-loop)
- **Dimension:** minimax-pairing
- **Hypothesis:** Promoting MiniMax-M3 from end-of-line scorer to an in-loop auditor — converting its free-text `issue` strings into a structured, machine-readable fix-list fed back to GLM, with the generator and auditor kept as SEPARATE models to prevent self-bias — yields the highest FIX→SHIP conversion of any single change, because the findings already exist and are accurate.
- **Why it matters (grounded):** RC-8 — MiniMax already emitted 18 file-grounded findings (e.g. accountbeheer-4 "matrix content spills past the inner panel — severe z-order conflict"; oci-3 "bottom PO row too-light grey, near-illegible"). These are precisely the RC-1/RC-2/RC-5 defects. GLM cannot self-audit (it confabulated an "orange CTA"+"#cccccc" that did not exist — vision-audit-benchmark.md), so the external MiniMax signal is the only trustworthy critique channel; Self-Refine's multimodal variant explicitly uses *separate* generator/refiner models to avoid self-bias — which is exactly this pairing.
- **Researchable question:** When MiniMax-M3's `issue` findings are reshaped into a typed fix-list (defect-type, target element, required change) and fed back to GLM for a round-2, what is the FIX→SHIP conversion rate, and does it beat a generic "improve this" round-2 that lacks the structured findings?
- **What to test / measure:** On the 18 FIX tiles — arm (a) round-2 with structured MiniMax fix-list, arm (b) round-2 with no findings; metrics = FIX→SHIP conversion count, post-round-2 MiniMax score delta, contrast_check exit-0 rate, and false-fix rate (did the round-2 break a passing dimension?). Pair MiniMax with the deterministic overflow/contrast gates it is known to miss (it false-negatived a subtle clip in the benchmark).
- **Candidate online sources:**
  - https://arxiv.org/pdf/2412.16829 (Visual Prompting with Iterative Refinement for Design Critique Generation)
  - https://github.com/madaan/self-refine (separate generator/refiner to prevent self-bias)
  - https://arxiv.org/html/2510.16062v1 (Can LLMs Correct Themselves? — when external vs self feedback helps)
- **Decision it should produce:** A PIPELINE STEP + a small schema: a MiniMax-`issue` → typed-fix-list adapter, and a round-2 prompt template that injects the fix-list back to GLM, gated by `proof_check.py` + `contrast_check.py` before adopt-if-better.

## Angle A5 — INSTRUCTION-DENSITY (more upstream structure vs more prose vs less)
- **Dimension:** instruction-density
- **Hypothesis:** The diagram collapse is a constraint-layout weakness GLM will NOT solve from prose at any density; handing it a pre-resolved layout skeleton (computed node/row coordinates + a fixed safe-zone grid) — MORE upstream structure, not more instructions — will outperform both the current dense prose contract and a minimal-instruction variant on the 2D-positioned treatments.
- **Why it matters (grounded):** The current contract carries ~20+ pinned constraints; IFScale shows every-instruction compliance decays ~exponentially and drops sharply past ~15 — which is exactly the dropped-constraint signature in RC-3 (title rule), RC-4 (uppercase 3×), RC-6 (status-by-icon). And the 2D tiles fail on *geometry* (RC-1 overflow, RC-2 collisions) that prose cannot fix — external lit: box-arrow-text diagrams "rely on strict geometric constraints frequently violated"; "direct numerical positioning → out-of-boundary + collisions"; LaySPA cut collision rate 36% by giving the model spatial structure. The ~41-point diagram-vs-linear delta is a geometry gap, not a wording gap.
- **Researchable question:** On the 2D-positioned treatments (matrix/node/routing/funnel), does a pre-resolved coordinate skeleton (computed upstream) beat (a) the current dense prose contract and (b) a minimal-instruction prompt — and by how much on overflow/collision metrics per token spent?
- **What to test / measure:** 3-arm on the ~10 2D-positioned tiles — (a) skeleton-first (coordinates + safe-zone grid supplied), (b) current dense prose, (c) minimal instruction; metrics = overflow rate, node-collision count (manual + AABB-style check), `title_at_bottom` rate, MiniMax score, diagram-vs-table score delta closure, and prompt-token cost. Confirm the IFScale cliff: does compliance on the *non-layout* pins (case, palette) improve when the layout burden is moved out of prose?
- **Candidate online sources:**
  - https://arxiv.org/html/2507.11538v1 (IFScale — instruction-density cliff)
  - https://arxiv.org/html/2509.16891v2 (LLMs as Layout Designers / LaySPA — collision −36% via spatial structure)
  - https://arxiv.org/html/2605.25447 (GeoSVG-RL — geometry-aware constraints for box-arrow-text diagrams)
  - https://arxiv.org/html/2406.16386v1 (Divide-and-Conquer UI-from-screenshot — region split then assemble)
  - https://pub.towardsai.net/stop-fixing-your-ai-svgs-715df70ccca0 (compute SVG coordinates on a grid; don't let the model eyeball them)
- **Decision it should produce:** A PIPELINE STEP (the highest-leverage one): for 2D-positioned treatments, generate a coordinate/safe-zone skeleton upstream (computed, or by the A6 planner) and feed it to GLM as structure; keep prose minimal-and-mechanical for those tiles.

## Angle A6 — PAIR WITH GPT-5.5
- **Dimension:** gpt5.5-pairing
- **Hypothesis:** A stronger planner (GPT-5.5) authoring the per-tile spec and/or the A5 coordinate skeleton — or acting as a second co-auditor — gives more SHIP-rate lift per cost in exactly the role that needs reasoning GLM lacks: resolving the 2D layout geometry upstream, leaving GLM to do the vision-to-code rendering it is good at.
- **Why it matters (grounded):** GLM's strength is vision-to-code *rendering* (linear tiles hit 86-94); its weakness is the *planning/geometry* behind RC-1/RC-2/RC-3 (2D tiles 35-58). The per-treatment briefs in `spec-*.json` were thin; a stronger planner producing the A5 skeleton or a richer spec targets the exact gap. GLM dispatch cost = 0 (subscription) but GPT-5.5 is paid — so the question is role-vs-cost: planner (1 call/tile) vs co-auditor (1 call/tile) vs skeleton-author (1 call/2D-tile only).
- **Researchable question:** Which GPT-5.5 role — (a) per-tile spec author, (b) A5 coordinate-skeleton author for 2D tiles only, (c) co-auditor alongside MiniMax — produces the best SHIP-rate lift per GPT-5.5 dollar?
- **What to test / measure:** 3-arm on a mixed subset (½ 2D, ½ linear) — measure SHIP-rate lift over 60% baseline, diagram-tile score delta, MiniMax score, and GPT-5.5 token/$ cost per adopted SHIP. Compare (b) skeleton-only-for-2D against applying GPT-5.5 to all tiles (linear tiles already at 86-94 may show ~0 lift — cost without benefit).
- **Candidate online sources:**
  - https://docs.z.ai/guides/vlm/glm-4.6v (GLM-4.6V VL sibling — consider it vs glm-5.2 for the render leg before adding a paid planner)
  - https://arxiv.org/pdf/2504.04220 (AdaCoder — adaptive planning + multi-agent for code generation)
  - https://arxiv.org/pdf/2511.15331 (DesignerlyLoop — planner forming design intent)
- **Decision it should produce:** A ROLE + COST RULE: a named GPT-5.5 role (most likely skeleton-author for 2D tiles only) wired into the pipeline with a cost ceiling, plus a recommendation on whether glm-4.6v/5v-turbo should replace glm-5.2 on the render leg.

## Angle A7 — ONLINE INSIGHTS
- **Dimension:** online-insights
- **Hypothesis:** Each external lever from the sweep maps cleanly to one of this run's RCs and can be scored adopt / adapt / reject against the run's own defects — yielding a prioritized, evidence-backed change list rather than generic best-practice.
- **Why it matters (grounded):** The defects are specific (RC-1 overflow, RC-2 collisions, RC-5 #4e4e4e@1.51:1, RC-7 slop) and the literature is specific (LaTCoder divide+assemble, LaySPA collision −36%, IFScale density cliff, Self-Refine +20%, Chain-of-Rubrics) — so every adopt/reject must cite the matching RC + number, never "it's a best practice."
- **Researchable question:** For each external lever, is it ADOPT (fixes a confirmed RC with a measured external effect), ADAPT (right idea, needs the run's units), or REJECT (does not touch any RC / conflicts with the Product register), and in what priority order by predicted SHIP-rate lift?
- **What to test / measure:** A scored matrix — rows = the ~12 external sources, columns = {matched RC-id, verdict adopt/adapt/reject, predicted lift on SHIP-rate / contrast exit-0 / diagram-delta, register-fit Product V4/M2/D6}; validate the top-3 ADOPTs as the A1/A3/A5 experiments above.
- **Candidate online sources:**
  - https://arxiv.org/html/2508.03560v1 · https://arxiv.org/html/2507.11538v1 · https://arxiv.org/html/2509.16891v2 · https://arxiv.org/html/2605.25447 · https://github.com/madaan/self-refine · https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework · https://docs.z.ai/guides/vlm/glm-4.6v · https://arxiv.org/pdf/2510.25761 (DiagramEval — graph-based diagram quality eval) · https://pub.towardsai.net/stop-fixing-your-ai-svgs-715df70ccca0
- **Decision it should produce:** A prioritized adopt/adapt/reject TABLE keyed to RC-ids, feeding the recommended end-to-end pipeline (the loop's stop-condition #2 deliverable).

---

## §3 Extractable question list

- [A1] Which contract rewrites (literal pre-cased strings, explicit safe-zone/height-budget block, neutral-on-dark token pair, enumerated adversarial-edge-case list) most reduce RC-1/RC-3/RC-4/RC-5 recurrence per dollar of added prompt tokens?
- [A2] Does embedding the sk-design pre-flight + contrast-pair inventory + anti-slop reasoning (as a "reason then build" rubric the model fills before emitting HTML) raise the on-brand/anti-slop audit sub-scores more than an equal token-count of additional value rules?
- [A3] What single-shot vs 2-round (generate → render → re-prompt with render + MiniMax findings) SHIP-rate difference is achievable, and does treatment-aware routing by layout primitive beat a uniform round-2?
- [A4] When MiniMax-M3's `issue` findings are reshaped into a typed fix-list and fed back to GLM for a round-2, what is the FIX→SHIP conversion rate, and does it beat a generic "improve this" round-2 without the structured findings?
- [A5] On the 2D-positioned treatments, does a pre-resolved coordinate skeleton (computed upstream) beat both the current dense prose contract and a minimal-instruction prompt — and by how much on overflow/collision metrics per token spent?
- [A6] Which GPT-5.5 role — per-tile spec author, A5 coordinate-skeleton author for 2D tiles only, or co-auditor alongside MiniMax — produces the best SHIP-rate lift per GPT-5.5 dollar?
- [A7] For each external lever, is it adopt / adapt / reject against a confirmed RC-id, and in what priority order by predicted SHIP-rate lift?
