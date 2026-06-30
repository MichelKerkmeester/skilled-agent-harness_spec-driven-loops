Research scope is read-only. I’ll fetch the three cited sources, extract implementation-grade mechanisms, and map them directly to the defect ledger and prompt-contract change.The DesignerlyLoop PDF endpoint exceeded the fetch size limit, so I’m checking the ArXiv abstract/HTML mirrors for the same paper before treating that candidate as failed.The original DesignerlyLoop PDF URL was not usable through `webfetch` because the response exceeded the 5MB tool limit; the ArXiv abstract page was available, and the HTML mirror returned 404.I found the SLR’s actionable parts: structured prompting, few-shot exemplars, modular decomposition, context-aware inputs, and explicit evaluation/explainability are named as best practices; prompt sensitivity, spatial-context weakness, and generic pattern convergence are named risks.The DesignerlyLoop source archive also exceeds the webfetch size limit. I’m trying the ar5iv HTML renderer for the same ArXiv ID as the last readable route.ar5iv provided a readable DesignerlyLoop rendering, including system mechanisms: context builder, editable node canvas, LLM reasoning chain viewer, reasoning-mode classification, Double Diamond phase classification, and few-shot golden examples.# A2 findings

## What The Sources Actually Say

**https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework**

Technique: turn the design prompt into ordered rubric checkpoints, not just prose constraints.

Exact mechanism: CoR decomposes a task into explicit modular rubric items, applies each rubric to the candidate state, emits an intermediate assessment/correction, then aggregates into the final output. It specifically emphasizes explicitness, modularity, iterativity, evaluator/generator roles, rubric-scored criteria, and editable reasoning blocks. The useful implementation pattern is:

```text
for rubric in rubrics:
  evaluate candidate against rubric
  improve candidate from feedback
  proceed only when rubric is satisfied
```

Citation: Chain-of-Rubrics describes CoR as “a sequence of explicit, modular rubric items” with “intermediate assessments” and “iterative feedback loops” [SOURCE: https://www.emergentmind.com/topics/chain-of-rubrics-cor-prompting-framework].

**https://arxiv.org/html/2507.04469v1**

Technique: UI/UX LLM prompting works better when prompts are structured, modular, contextual, few-shot, and evaluation-backed.

Exact mechanism: the SLR identifies structured prompting as a design tool, including chain-of-thought-style reasoning, modular prompts aligned to interface elements, and few-shot learning with curated task exemplars. It also calls out a two-stage prompting pattern that separates critique generation from visual localization, and recommends detailed goal-oriented prompts with user stories, examples, or contextual variables. For control/scalability, it recommends decomposing UI/UX work into smaller interpretable modules. For trust, it recommends explainability, confidence/rationale summaries, and standardized evaluation. It also names the risks this run hit: prompt instability, weak spatial UI reasoning, and generic/conservative design convergence.

Citation: SLR §4.2.1, §4.2.4, §4.2.6 and §4.3.2-4.3.4 [SOURCE: https://arxiv.org/html/2507.04469v1].

**https://arxiv.org/pdf/2511.15331**

Fetch status: the candidate PDF failed through `webfetch` because the response exceeded the 5MB tool limit. I continued with the ArXiv abstract and ar5iv HTML rendering for the same paper/ID.

Technique: DesignerlyLoop externalizes design reasoning before generation, using editable structured reasoning rather than one-shot output.

Exact mechanism: DesignerlyLoop separates design intent from LLM reasoning through a context builder, design-reasoning canvas, and LLM reasoning-chain viewer. The system classifies the user goal into reasoning modes, maps steps to Double Diamond design stages, injects prior context plus “golden examples” as few-shot references, and generates a structured multi-step thinking chain with rationales. Users can inspect, revise, delete, reorder, regenerate, and export reasoning nodes. Reported results: DesignerlyLoop improved creativity support versus baseline, CSI `95.2` vs `78.7`, `p<.001`; expert-rated quality improved, `4.05` vs `3.78`, `p=.006`.

Citation: DesignerlyLoop abstract, system design, prompt appendix, and findings [SOURCE: https://arxiv.org/abs/2511.15331; fallback rendering https://ar5iv.labs.arxiv.org/html/2511.15331].

## How It Maps To This Run's Defects

A2 is well-supported for RC-5, RC-6, and RC-7, but it is not a complete fix for RC-1/RC-2 layout collisions.

RC-5: context-blind contrast. The `#4e4e4e` on navy pair at `1.51:1` is exactly the kind of failure a value list does not prevent. The source-backed mechanism is to require a filled contrast-pair inventory before build, then gate generation on pass/fail pairs.

RC-6: color-as-decoration. `accountbeheer-2` scored `78` with decorative red; the defect is judgment, not token availability. A rubric card should force the model to label every accent as semantic, navigational, or delete it.

RC-7: decorative slop. `prijzen-condities-3` scored `62` because 3D extrusion reads as gradient; `aangepast-assortiment-5` scored `70` because a funnel buries content. The DesignerlyLoop mechanism maps directly: force intent articulation, primitive selection, and anti-slop checks before HTML.

RC-1/RC-2/RC-3 interaction: the core layout primitive still needs a stronger layout contract, but A2 can reduce exposure by steering Product V4/M2/D6 tiles toward linear primitives. The best tiles already prove that linear-flow structures score high: `kwartaalcijfers-2` `94`, `accountbeheer-5` `93`, `een-factuur-5` `93`, `accountbeheer-1` `92`, `orders-facturen-1` `90`.

## Concrete, Testable Recommendation

Add this preamble to every per-tile GLM prompt before the HTML task. Keep register dials fixed: `Product`, `V4/M2/D6`.

```text
DESIGN-SKILL RUBRIC PREAMBLE — COMPLETE BEFORE HTML

You are generating one maritime-B2B Product dashboard bento tile.
Register lock: Product. Dial lock: V4/M2/D6.
Design posture: restrained, operational, credible, content-first. No decorative drama.

Before writing HTML, emit a filled PREFLIGHT block, then emit the HTML.

PREFLIGHT BLOCK FORMAT:

[PREFLIGHT]
1. Intent
- Tile job:
- Primary user decision supported:
- One visual idea only:

2. Layout Primitive
Choose exactly one:
- linear-flow
- stacked-ledger
- compact-kpi-row
- two-column-comparison
- mini-table

Forbidden by default:
- freeform 2D node map
- perspective/3D/extruded object
- large decorative funnel
- decorative red/orange accent
- overlapping badges/cards
- absolute-positioned diagram with more than 3 nodes

If you think a diagram is needed, convert it to a linear-flow or stacked-ledger primitive unless every node can fit without overlap and without stealing the bottom title zone.

3. Contrast-Pair Inventory
List every text/icon/stroke pair you will use.

| Element | Foreground | Background | Estimated ratio | Pass? | Fix if fail |
|---|---:|---:|---:|---|---|

Rules:
- Body and label text must be >= 4.5:1.
- Large display text must be >= 3:1, but prefer >= 4.5:1.
- Do not use dark gray on navy. Specifically avoid #4e4e4e on navy.
- If any pair fails, change the color before HTML.

4. Anti-Slop Audit
Answer yes/no.
- Does every color encode brand, hierarchy, state, or data?
- Is any red/orange used only as decoration? If yes, remove it.
- Does every shape carry information? If no, delete it.
- Is the tile flat, sharp, and B2B-operational rather than glossy/3D?
- Is content more prominent than the motif?
- Is the bottom-left title zone preserved?

5. Build Decision
- Final primitive:
- Removed decorative ideas:
- Safe accent colors:
- Highest-risk contrast pair and fix:
[/PREFLIGHT]

Then build the HTML using the selected primitive.
Use CSS grid/flex flow for layout. Avoid absolute positioning unless it is a small decorative background mark that cannot overlap content.
```

Add these two few-shot exemplars immediately after the preamble.

```text
FEW-SHOT EXEMPLAR 1 — LINEAR FLOW, HIGH-SCORING PATTERN

Good pattern:
A compact operational flow uses 3-4 horizontal steps in one row or vertical stack:
"Order" -> "Controle" -> "Factuur" -> "Boeking".
Each step is a flat card with a short label, one number/status, and a thin connector.
No freeform node map. No badge overlapping another card. No 3D.
The title remains bottom-left, outside the visual cluster.

Why this ships:
It keeps the content inside the visual budget, preserves the title, and makes the business process readable at a glance.
Use this pattern for orders, invoices, approval, OCI, account setup, and assortment workflows.
```

```text
FEW-SHOT EXEMPLAR 2 — STACKED LEDGER, HIGH-SCORING PATTERN

Good pattern:
A restrained ledger tile uses 3 compact rows inside one panel:
left = entity or vessel/account, middle = status chip, right = amount/count/date.
A small summary chip can sit above the rows, but nothing overlaps.
Use muted navy/slate surfaces, white text, and one cyan/teal accent for active state.
No red/orange unless it means error/warning. No funnel, extrusion, glass, or oversized illustration.

Why this ships:
It turns a complex relationship into a linear scan path and avoids GLM's weak 2D coordinate placement.
Use this pattern when the model wants to draw a matrix, branch diagram, or catalog funnel.
```

Pipeline step to add:

```text
After GLM generation:
1. Parse [PREFLIGHT].
2. Fail/retry if PREFLIGHT is missing.
3. Extract contrast-pair rows.
4. Run contrast_check on every listed pair plus grep-discovered CSS pairs.
5. Fail/retry if any pair is below threshold.
6. Run MiniMax-M3 audit for on_brand and anti_slop.
7. Compare against value-only control with equal token budget.
```

A/B test design:

```text
A: value-only contract
- Existing palette/radius/font/weight rules.
- Add equal token count of more value rules.

B: reasoning-embedded contract
- Same values.
- Add PREFLIGHT + contrast inventory + anti-slop audit + 2 linear primitive exemplars.

Sample:
- RC-6/RC-7 target tiles: prijzen-condities-3, aangepast-assortiment-5, accountbeheer-2.
- Include at least 2 layout-sensitive defect tiles as spillover: oci-4, goedkeuringssysteem-4.
- Generate 5 variants per tile per condition if budget allows.
- Hold register/dials fixed: Product V4/M2/D6.

Metrics:
- SHIP rate.
- MiniMax-M3 `on_brand:true` rate.
- Anti-slop dimension score.
- `contrast_check` exit-0 rate on enumerated and actual CSS pairs.
- PREFLIGHT compliance rate.
- Absolute-position count.
- Diagram-vs-linear score delta.
```

## Predicted Effect

Expected improvement: moderate and targeted.

SHIP rate: likely `60%` to `67-73%` if RC-5/RC-6/RC-7 are common near-threshold failures. I would not predict more without A1/A3/A5 layout-budget fixes because RC-1/RC-2 remain dominant.

Contrast exit-0: likely high improvement, from occasional misses like `1.51:1` toward `90%+` on enumerated pairs, assuming the pipeline verifies actual CSS pairs and retries failures.

On-brand / anti-slop: likely meaningful improvement on `prijzen-condities-3` `62`, `aangepast-assortiment-5` `70`, and `accountbeheer-2` `78`, because the new contract forces removal of decorative 3D/funnel/red choices before build.

Diagram-vs-linear delta: small-to-moderate improvement. A2 can reduce diagram selection, but it does not give GLM a true layout solver. Expect maybe `+5-12` points on diagram-prone tiles when the model switches to linear-flow; no reliable fix for dense absolute 2D maps without a separate geometry/layout gate.

Cost: about `+1.1k-1.6k` prompt/output tokens per tile. Latency cost is likely one extra generation-sized reasoning prefix plus parser checks; contrast parsing is negligible, MiniMax audit cost depends on existing audit pipeline. Best operational mode is retry-on-fail only for missing preflight, failed contrast, or decorative slop.

## Open Questions For The Next Iteration

1. Does GLM actually fill the contrast inventory accurately, or does the external `contrast_check` need to be the only trusted source?

2. Should the pipeline strip `[PREFLIGHT]` before rendering, or preserve it in an HTML comment for audit traceability?

3. Which is stronger: two grounded linear exemplars from current high-scoring tiles, or one positive exemplar plus one negative “do not make this 2D diagram” counterexample?

4. How many failures are purely RC-5/RC-6/RC-7 versus layout-budget RC-1/RC-2? This determines whether A2 alone can move SHIP materially or only improves audit sub-scores.

5. Should `freeform 2D node map` be fully banned for Product V4/M2/D6 until GLM has a collision/height gate?