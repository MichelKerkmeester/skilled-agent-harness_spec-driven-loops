# Iteration 11: Parent structural model — hub vs umbrella, decided by coupling signals (KQ6)

## Focus
Decide the parent structural model with an explicit coupling/shared-runtime signal matrix over the corpus and local-repo evidence, and commit a recommendation.

## Findings

### F45 — The two models, defined from in-corpus exemplars
- **Single hub + nested mode packets** (exemplar: `impeccable`): one identity loads a shared base (anti-slop rules, register, slop test) once; modes are `reference/<command>.md` packets loaded selectively; `audit` routes among modes; `pin` promotes hot modes to shortcuts. Repo scaffold: `create:sk-skill-parent` ("one hub identity, registry source of truth"). [SOURCE: external/impeccable.md:13-186]
- **Umbrella router over a sibling family** (exemplar: `designer-skills` marketplace + repo's `deep-loop-workflows`): a thin parent dispatches by registry to independently-loadable sibling skills over a shared backend/reference base; "holds no per-mode logic — it dispatches by workflowMode through mode-registry.json." Siblings install/load à la carte. [SOURCE: external/designer-skills-main/README.md:29-35,200], [SOURCE: skill registry: deep-loop-workflows]

### F46 — Coupling / shared-runtime signal matrix
| Signal | Reading from evidence | Favors |
|--------|----------------------|--------|
| Shared *knowledge* base (anti-slop core, tokens, slop test) | HIGH — same DON'Ts recur across taste/stitch/baseline/audit/animate/redesign | either, **if** the parent owns a shared reference base |
| Shared *runtime/tooling* | LOW & HETEROGENEOUS — interface = judgment refs; spec = Playwright/ts-node backend (20 modules); others = judgment | **Umbrella** (don't co-load heavy heterogeneous runtimes) |
| Independent invocation | HIGH — users invoke audit, color, motion, spec on their own | **Umbrella/router** (lazy per-child load, independent discovery) |
| Cross-child workflows | PRESENT — redesign/craft sequence multiple children | **Router** parent that can orchestrate/sequence |
| Advisor/skill-graph routing precision | Distinct named children → sharper trigger metadata | **Umbrella** siblings (own trigger_phrases each) |
| Backward-compat | Existing `sk-design-interface`/`sk-design-md-generator` referenced by name across repo | **Umbrella** (keep siblings; nesting breaks references) |
| Context cost of co-load | Co-loading all children inflates context | both (hub mitigates via selective loading; umbrella is lazy natively) |
| Single-identity discoverability | One "sk-design" door is valuable | **Hub** (slight edge), recoverable by an umbrella router with one entry name |

Tally: 5 signals favor umbrella/router, 1 favors hub, 2 neutral. The decisive ones are runtime heterogeneity (F32) and backward-compat (F33).

### F47 — RECOMMENDATION: umbrella-router parent over a sibling family, with a shared design-base, and hub structure used *inside* the interface child
- **Parent `sk-design`** = a thin **smart-router/umbrella** (the `deep-loop-workflows`/`sk-code` shape): a `mode/skill-registry.json`, trigger routing to the 5 sibling children, and ownership of a **shared design-base reference** (the anti-slop core, register split, slop test, token conventions) that children reference rather than each re-deriving. It dispatches; it holds no per-child design logic.
- **Children** = independently-invocable sibling skills (`sk-design-interface`, `sk-design-foundations`, `sk-design-motion`, `sk-design-audit`, `sk-design-spec`), lazily loaded.
- **Inside** the flagship `sk-design-interface`, adopt impeccable's **hub-with-nested-mode-packets** structure (craft/shape/redesign/explore as reference packets, an in-skill router, selective loading) — the hub model is right at the *child* scale where coupling is tight, wrong at the *family* scale where runtimes diverge.
This is a **hybrid**: umbrella across children, hub within the interface child. It matches the parent spec's "umbrella + siblings" default — now evidence-backed, not assumed. [SOURCE: external/impeccable.md:13-186], [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:206-294], [SOURCE: skill registry: deep-loop-workflows]

### F48 — Why NOT a single monolithic hub
A single hub would (1) co-load or vendor the spec child's Playwright/ts-node backend alongside pure-judgment children — a runtime mismatch impeccable never has to handle (all its modes are prompt references); (2) require nesting `sk-design-interface`/`sk-design-md-generator` under one identity, breaking the cross-repo name references and advisor/skill-graph edges (F33); (3) reduce advisor routing precision by collapsing distinct triggers into one skill. The hub's genuine advantages (shared base, single door, in-hub routing, pin) are all recoverable in the umbrella-router via a shared-base reference + one parent entry name + a registry router. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:196-202]

## Sources Consulted
- Synthesis over iters 1–10 (esp. F17, F23, F27–F35) and their cited sources; no new files (analytical iteration).

## Assessment
- **newInfoRatio: 0.4** — The signal matrix, the tallied decision, the hybrid recommendation (umbrella-across / hub-within), and the explicit refutation of the monolithic hub are new synthesis; the underlying signals were gathered earlier.
- **Novelty justification:** Delivers the KQ6 structural-model recommendation with a transparent, evidence-weighted matrix rather than a bare assertion.
- **Confidence:** High — the deciding signals (runtime heterogeneity, backward-compat) are direct reads; the recommendation aligns with two local parent precedents.

## Reflection
- **Worked:** Tabulating signals exposed that "hub vs umbrella" is not symmetric — the family's runtime heterogeneity and existing named siblings settle it.
- **Insight:** Hub and umbrella are not mutually exclusive across scales: umbrella at family scale, hub at the interface-child scale, is the strongest fit.
- **Ruled out:** Monolithic single-hub for the whole family (runtime mismatch + compat breakage).
- **Ruled out:** A pure flat sibling set with NO parent — loses the shared base and the single door the corpus shows are valuable.

## Recommended Next Focus
Iteration 12: Per-child onboarding — triggers, advisor metadata, references, and skill-graph integration for each child (KQ8).
