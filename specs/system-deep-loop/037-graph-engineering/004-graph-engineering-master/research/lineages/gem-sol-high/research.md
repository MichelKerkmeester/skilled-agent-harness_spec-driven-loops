# Graph-Engineering-Master Doctrine and Four-Study Completeness

## 1. Grounding and Evidence Rules

This is a doctrine and completeness study of a documentary teaching package, not a code study. GEM contains Markdown guidance, prompt workflows, references, and a packaged copy of those documents; it does not provide a scheduler, state machine, persistence layer, replay engine, effect handler, or authority gateway. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:20-27] Claims below therefore distinguish **TEXT-CLAIMED** doctrine from **INFERENCE**, and implementation proof remains owned by studies 1–3 and the live runtime.

The study read the orientation seed, all GEM documents, all twelve blog posts, studies 1–3, the live coverage-graph and contradiction-supersession modules, and the 036 authority/versioning contracts. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/orientation.md:1-19]

The twelve-post coverage ledger is explicit:

| Blog post | Doctrine contribution |
|---|---|
| `Eval Engineering` | Edge-controlling eval gates, permanent failure regression, judge-version drift. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:46-54] |
| `From Loops to Graphs` | Parallel review shape, hybrid retrieval, and simple-task/vector boundaries. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:38-58] |
| `Graph Engineering Roadmap` | Barriers, node isolation, failure containment, and diverse verification. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:96-203] |
| `Graph Engineering explained` | Hidden shared-resource edges, silent fan-in loss, and explicit non-use cases. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:165-220] |
| `Graph Engineering replaced RAG` | Extraction/GraphRAG overview and the schema-after-extraction inconsistency that GEM corrects. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:279-310] |
| `Graph Engineering with Claude` | Pipeline-versus-barrier choice, context collapse, false independence, and silent node failure. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:196-235] |
| `After Loops` | Stable organization topology versus dynamic work graphs and explicit graph failure architecture. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:112-183] |
| `Harness, Loop, or Graph?` | Failure-owner diagnosis and restraint against architecture theater. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:90-116] |
| `Self-Correcting AI Loop` | Structured handoffs, bounded retry/escalation, and deliberate failure testing. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:77-123] |
| `Multi-Factor Alpha Model` | Parallel factor fan-out and persistence illustration, bounded as non-governance proof. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:44-60] |
| `LOOP → GRAPH → HARNESS` | Shared-workspace race warning and harness/tool separation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:112-113] |
| `What is Graph Engineering` | Temporal supersession, hybrid retrieval evidence, entity-resolution compounding, and benchmark skepticism. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:145-180] |

## 2. Executive Decision

**The four-study program is complete enough to finalize the graph-based system-deep-loop design, but not to claim implementation or production fitness.**

- **Studies 1–3 are complete for the executable/control plane:** typed graph IR, readiness/scheduling, reducers, belief settlement, admission, replay, budgets, fencing, effects, human gates, causal parity, and authority cutover. The graph proposes; 036 alone admits protected transitions and owns authoritative history. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-9]
- **Study 4 completes the knowledge/evidence production plane:** competency-driven modeling, deterministic source routing, constrained extraction, quality gates, reversible fusion, hybrid serving, and maintenance. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/orientation.md:69-84]
- **No architectural contradiction remains.** The one substantive doctrine conflict is GEM's general “prefer newer” rule; it is retained only as a purpose-specific retrieval heuristic behind temporal belief settlement and 036 admission. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:82-85] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-327]

## 3. Canonical Doctrine

**[TEXT-CLAIMED]** Graph engineering has two related but distinct halves: knowledge graphs represent what agents remember, with temporal/provenance-bearing relationships; task graphs represent how agents work, with jobs and actual execution dependencies. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:3-13]

**[TEXT-CLAIMED]** The knowledge product proceeds in order: scope, representation, ontology, entity extraction, relation extraction, event extraction, quality gate, fusion, and LLM serving. Model before extracting, fuse before storing, and verify at every stage. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:40-50]

**[TEXT-CLAIMED]** The task product removes fake dependencies; splits only independent work; verifies in separate contexts; gives one owner the merge; gates costly-to-reverse consequences; and caps loops, writers, and spawned agents. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/task-graphs.md:23-75]

## 4. P1 — Pipeline Adopt / Refine / Reject Matrix

| Stage | Decision | Production doctrine |
|---|---|---|
| Scope/value | **ADOPT** | Require recurring entities plus multi-hop, temporal, relational, or synthesis questions. Use tables/vector lookup when simpler. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:49-55] |
| Representation | **ADOPT** | Choose property graph, RDF, or typed local representation before ingestion; define time and provenance for every fact. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:23-28] |
| Ontology | **ADOPT / REFINE** | Competency questions are specification and acceptance corpus; use minimal precise types/relations, domain/range, cardinality, canonical naming. Treat numeric type counts as heuristics. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:30-59] |
| Source routing | **ADOPT** | Deterministic mappings for structured sources, parsers for semi-structured sources, constrained models only for unstructured content. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:12-21] |
| Entity extraction | **ADOPT / REFINE** | Closed vocabularies first; every candidate includes type, canonical guess, span/source, and confidence. Exact-match precision is conditional on vocabulary quality, not universal. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:23-41] |
| Relation extraction | **ADOPT** | Only accepted endpoints, ontology predicates, domain/range validation, and assertion evidence; repeated unknowns enter quarantine. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:43-57] |
| Event extraction | **ADOPT** | First-class event identity, triggers, typed roles, time anchors, and causal/temporal/conditional relations. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:59-75] |
| Quality | **ADOPT / REFINE** | Gate per stage and source family with sampled precision/recall, leakage checks, confidence intervals, and producer repair. Treat 50 items/90% as pilot guidance, not a universal threshold. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:88-94] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:148-162] |
| Fusion | **ADOPT** | Blocking → layered match → ambiguous review → deterministic reversible merge; retain conflicts and source values; align ontologies before instances. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:20-49] |
| Serving | **ADOPT / REJECT graph-only** | Route by question type, retrieve bounded paths/subgraphs, serialize provenance, compare with vector baseline, and retain vector retrieval for simple questions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:165-179] |
| Maintenance | **ADOPT / CONTAIN** | Incremental extraction/fusion and hygiene are sound; “prefer newer” requires the P5 belief adapter below. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:72-86] |

## 5. P2 — Entity Resolution Is Not Truth Admission

The production boundary has four ordered responsibilities:

1. **Identity proposal:** GEM blocking/matching proposes that records denote the same entity and records reversible merge evidence.
2. **Evidence fusion:** immutable source assertions are grouped under a derived identity projection without destructive overwrite.
3. **Belief settlement:** purpose-bound IN/OUT/BOTH/NEITHER usability is derived from support, refutation, qualification, contradiction, supersession, scope, and staleness.
4. **Authority admission:** 036 decides whether one exact protected transition may append.

**[TEXT-CLAIMED]** Runtime detector candidates are explicitly inert and non-authoritative; relationship projections are disposable and additive-dark. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:79-96] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:201-206]

**[INFERENCE]** Identity confidence must never map directly to belief or authority. Reversing an identity merge rebuilds grouped evidence and purpose-bound belief while leaving source evidence immutable.

## 6. P3 — Ontology as Specification and Versioned Dependency

**[TEXT-CLAIMED]** GEM makes competency questions the ontology's specification and test suite and requires extraction prompts to embed the ontology source of truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:34-59]

**[INFERENCE]** Each accepted ontology version/digest is a dependency of source mappings, extraction prompts, candidate validation, fusion policies, competency tests, and serving evaluations. Changes require impact classification and regeneration or explicit retention under the old version. Renames, splits, merges, domain/range changes, and canonicalization changes are semantic; ambiguous migrations fail closed.

This borrows 036's discipline—current version identities, complete compatibility paths, preserved historical bytes, no partial projection—but does not claim that event upcasters automatically solve ontology migration. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:90-119]

## 7. P4 — Three Separate Quality Gates

1. **Data quality:** entity/relation/event/triple accuracy, coverage/recall, evidence spans, leakage, source drift, and fusion error.
2. **Retrieval quality:** route accuracy, retrieval sufficiency, citation fidelity, answer quality by question family, vector baseline, latency, and cost.
3. **Runtime parity:** causal-prefix observations, complete case and mutant manifests, authority/effect suppression, replay/reference closure, and staged promotion.

**[INFERENCE]** The release decision is conjunctive. A high-quality KG can run through an unsafe runtime; a parity-perfect runtime can serve poisoned evidence; a strong answer score can conceal unauthorized effects.

## 8. P5 — Temporal Facts and Purpose-Bound Belief

**[TEXT-CLAIMED][ADOPT]** Preserve conflicting facts with time and provenance rather than overwrite them. The broader corpus distinguishes world-valid time from system-observation time and models supersession explicitly. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:145-158]

**[TEXT-CLAIMED][CONTRADICT as universal truth rule]** “Prefer newer” is insufficient. Study 2 uses `(observed_at, authorized_sequence)`, explicit imputation, prospective cycle/competing-successor checks, checked settlement, and a serialized belief-admission head. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-327]

**[INFERENCE]** Retrieval may prefer a newer applicable fact only after purpose, valid time, observation time, source authority, uncertainty, scope, contradiction, supersession, and required-answer fitness have been settled.

## 9. P6 — Task-Graph Doctrine Audit

GEM confirms the settled design; it adds no new authority primitive. It does add four operational mutant families:

- hidden shared-resource dependence across files, workspaces, APIs, rate limits, credentials, budgets, or mutable services;
- hierarchical fan-in/context-budget exhaustion;
- expected-fan-in cardinality and explicit partial/quorum join semantics;
- barrier necessity versus per-item pipeline scheduling and straggler cost.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:165-192] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:196-235]

Cross-layer doctrine also confirms that topology cannot repair a harness, permission, tool, state, evidence-anchor, or unbounded-loop defect. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:90-116]

## 10. P7 — Two-Axis Staged Rollout

Knowledge maturity and runtime promotion are orthogonal:

| Knowledge axis | Exit evidence |
|---|---|
| K0 scope | Real competency corpus proves a graph is warranted |
| K1 model | Representation, time/provenance, and pinned ontology accepted |
| K2 pilot | Source-routed ten-document pilot completes all stages |
| K3 quality | Per-source extraction gates pass with uncertainty stated |
| K4 fusion | False-merge/missed-merge evaluation and reversible replay pass |
| K5 serving | Hybrid route beats or appropriately yields to vector baseline |
| K6 maintenance | Incremental ingestion, contradiction preservation, and hygiene pass |

The runtime G0–G7 axis remains controlled by studies 1–3: static contract closure, local and cross-boundary mutants, crash/race recovery, shadow parity, reversible canaries, selected writer/effect canaries, and 036 cutover/retirement. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131-143]

## 11. Runtime and 036 Mapping

| Doctrine | Current owner | Authority posture |
|---|---|---|
| Competency/source/extraction/fusion/serving evidence | Knowledge/evidence production plane | Non-authoritative candidate evidence |
| Question, source, evidence, contradiction coverage | `coverage-graph` | Diagnostic projection; research signals already include coverage, verification, contradiction density, diversity, and depth. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:22-56] |
| Contradiction/supersession relationship history | `contradiction-supersession` | Exact-evidence-bound additive-dark projection |
| Purpose-bound usable premises | Study-2 belief admission/settlement design | Truth-affecting candidates previewed at a serialized head |
| Protected transition/effect/history | 036 authority plane | Sole authoritative admission and append owner |

GEM extends what evidence enters projections and how its fitness is measured; it does not change who may mutate authoritative state.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat GEM as runnable engine evidence | Documentary package only | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:20-27] | 1–2 |
| Graph-first or graph-only architecture | Tables/vector win simple lookup, cost, and narrow tasks | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:161-180] | 3, 8, 19 |
| One model path for every source | Structured and semi-structured sources have deterministic routes | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:12-21] | 4 |
| Mega-prompt extraction | Separate passes preserve constraints and rejection | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:77-98] | 5 |
| Silent or model-owned merge | Conflicts/provenance/undo require deterministic policy | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:35-41] | 7 |
| Identity confidence as belief/authority | Identity, evidence, belief, and admission are distinct | [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:79-96] | 9–10 |
| Silent ontology edits | Downstream consumer meaning and comparability change | [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:90-119] | 11–12 |
| One graph-quality score | Data, retrieval, and runtime parity have different failure domains | [INFERENCE: synthesis of P4 sources] | 6, 13–14 |
| Last-write-wins / universal prefer-newer | Semantic time and prospective truth settlement are required | [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-327] | 15 |
| Prompt independence implies safe parallelism | Shared resources create hidden edges | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:165-179] | 16 |
| Big-bang production rollout | Pilot-first knowledge maturity and shadow-first runtime promotion are separate gates | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:92-102] | 18 |

## Divergence Map

- Saturated directions: documentary-as-code, graph-only retrieval, fuzzy identity as truth, last-write-wins, and topology-as-authority.
- Pivots taken: source hierarchy → pipeline stages → identity/belief boundary → ontology dependency → gate taxonomy → temporal falsification → task failures → rollout.
- Pivot failures: none; the attempted nested `cli-codex` dispatch was correctly blocked by the executor recursion guard and did not affect research evidence.
- Remaining frontier: implementation-specific artifact schemas and threshold calibration only.

## 12. Open Questions

No design question remains open. Implementation must still specify and verify:

- the ontology artifact/version/change-manifest shape;
- the immutable source/extraction/fusion evidence envelope;
- per-domain quality thresholds and confidence methods;
- adapters that expose product-quality evidence to existing coverage/parity projections;
- storage, latency, cost, and operator-load baselines for the selected knowledge implementation.

## 13. Knowledge/Evidence Production Methodology

1. Freeze question families and a competency/answer corpus before schema work.
2. Choose representation; require fact-level provenance, valid/observation time, and confidence semantics.
3. Accept and pin the minimal ontology version; classify later changes and stale dependents.
4. Inventory sources and bind each to deterministic mapping, parser, or constrained unstructured extraction.
5. Run entity, relation, and event passes separately; quarantine recurring unknowns.
6. Gate each producer/source family with sampled precision/recall, uncertainty, leakage, and failure taxonomy.
7. Preserve immutable assertions; propose identities through blocking/layered matching/review bands.
8. Align ontologies before instances; record deterministic reversible merge decisions and all conflicts.
9. Project contradiction/supersession and settle purpose-bound belief prospectively; never make retrieval or fusion authoritative.
10. Route questions to graph, hybrid, or vector paths; compare against predeclared baselines and answer keys.
11. Promote knowledge K-stages and runtime G-stages independently; require both relevant gates before protected use.
12. Maintain incrementally with drift measurement, contradiction preservation, confidence rescoring, fusion replay, and hygiene.

## 14. Explicit When-Not-to-Use Boundaries

- Do not build a KG for simple lookups, aggregation-dominant questions, non-recurring entities, or data whose relationships are not the product.
- Do not use GraphRAG when a vector baseline wins the relevant question family or the maintenance cost is unjustified.
- Do not use fuzzy entity resolution when stable curated identifiers or explicit links already solve identity.
- Do not place immutable evidence with no truth-affecting relation behind the full prospective belief-admission protocol.
- Do not build a task graph for small isolated tasks, open-ended exploration, tight approval of every step, or genuinely sequential work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:303-319]
- Do not deploy the full governance stack for a harmless local DAG with no protected mutation, shared budget, durable gate, external effect, recovery obligation, or authority cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:178-189]
- Do not use topology to repair broken tools, permissions, state, effect recovery, or evidence anchors.

## 15. Four-Study Completeness Audit

| Design surface | Study owner | Verdict after study 4 |
|---|---|---|
| Typed execution topology, reducers, scheduling | 1 + 3 | **CONFIRM complete** |
| Replay, belief, truth admission, gates, effects, budgets, parity | 2 + 3 + 036 | **CONFIRM complete for design** |
| Organization versus work graph | 1 + corpus | **CONFIRM; no GEM delta** |
| Knowledge modeling/extraction/events | 4 | **EXTEND; gap closed** |
| Quality and reversible fusion | 4 | **EXTEND; gap closed** |
| Hybrid serving and maintenance | 1–2 + 4 | **REFINE/EXTEND; gap closed** |
| Temporal “prefer newer” | 2 versus 4 | **CONTRADICT/CONTAIN; resolved** |
| Task failure modes | 1–3 + 4 | **EXTEND mutant coverage; no new primitive** |
| Staged rollout | 1–3 + 4 | **EXTEND to two axes** |

## 16. Recommendations

1. Freeze this four-study design boundary and move next to implementation planning rather than another repository study.
2. Add the K0–K6 knowledge maturity axis alongside—not inside—the existing G0–G7 runtime promotion axis.
3. Specify ontology/source/extraction/fusion evidence identities before coding ingestion.
4. Extend coverage/parity evidence inputs, but preserve coverage graph and relationship projections as non-authoritative.
5. Add P6 operational mutants for hidden resources, fan-in cardinality, hierarchical reduction, and barrier necessity.
6. Make the prefer-newer containment and four-layer identity→evidence→belief→authority boundary explicit in the implementation spec.

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 20
- Questions answered: 10 / 10
- Remaining design questions: 0
- Last three new-information ratios: 0.15 → 0.08 → 0.03
- Convergence threshold: 0.05; convergence was telemetry only under the max-iterations policy.
- Reducer findings: 88
- Source coverage: GEM teaching package, all 12 blog posts, studies 1–3, live system-deep-loop projection runtime, and 036 authority/versioning contracts.
- Graph-convergence telemetry: graph projection was empty, so it returned CONTINUE with no blockers; max-iterations remained the configured stop authority.
- Completeness status: complete for design finalization; implementation and production fitness remain evidence-gated.
