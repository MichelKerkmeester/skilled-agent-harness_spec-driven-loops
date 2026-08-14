# Graph-Based Deep-Loop: Graph-Engineering-Master Completeness Study (Repo Study 4, Final)

## Grounding (terms and sources)

- **036 / authority plane** — the existing transition-authority system. It evaluates canonical requests, records authorization decisions, fences protected mutations, appends authoritative events, accounts for budgets, governs effects, and selects cutover or rollback. Graph machinery may propose a transition and supply evidence, but only 036 may admit the transition and record authoritative history. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:3-7]
- **GEM** — `graph-engineering-master`, a documentary teaching package comprising Markdown guidance, prompt workflows, curriculum material, and reference documents [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:20-27]. Its file inventory contains no runnable graph-engine code — only Markdown plus a packaged `.skill` of the same documents. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/orientation.md:23-36] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-002.md:9-25]
- **`study-1`** — the AgentSwarms study that established the graph-over-036 architecture, typed executable IR, scheduling, gates, replay, typed subgraphs, parity, organization/work separation, and non-authoritative knowledge routing. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-9]
- **`study-2`** — the Graphene study that hardened belief settlement, replay cuts, causal-prefix parity, claimant-addressed mutation, prospective truth admission, refusals, and live-context human gates. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:11-19]
- **`study-3`** — the GraphARC study that hardened admission, sealing, policy provenance, durable gates, budgets, effects, replay, and promotion governance without displacing 036. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:14-20]
- **Citation traceability** — study-4 conclusions cite the completed iteration narratives or their underlying local sources. Each iteration narrative preserves its own `[SOURCE: file:line]` chain and distinguishes text-supported doctrine from synthesis through `[TEXT-CLAIMED]` and `[INFERENCE: ...]`.
- **Status** — DESIGN/doctrine-level. GEM can establish production doctrine and expose coverage deltas. It cannot establish executable contracts, runtime correctness, performance, or production fitness.

The study completed all 20 iterations. Its `stopReason` was `maxIterationsReached`: the configured `stopPolicy=max-iterations` reserved all stopping authority to the iteration cap, so the `0.05` convergence threshold was operationally inert. The self-reported novelty ratio fell steeply from `0.92` to `0.03` and all ten tracked questions were marked answered — evidence that the *documentary corpus was exhausted* for this completeness question, not an independently-certified convergence. Study-3 explicitly rejected treating the novelty ratio as convergence proof; that caution applies here too, since the ratio is the executor's own self-assessment. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-state.jsonl:1,5-26] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:260] [INFERENCE: corpus exhaustion for a fixed documentary source is distinct from proven architectural convergence]

## Executive Verdict

No *new* architectural contradiction surfaced when GEM's doctrine was checked against studies 1–3 — an absence of finding across a bounded, self-directed search, not a proof that none exists. `study-1` through `study-3` settle the executable and control planes: graph projection, typed IR, readiness and scheduling, reducers, belief settlement, admission, replay, fencing, budgets, gates, effects, parity, governance, and 036 cutover. GEM neither replaces nor weakens those contracts. (Study-3's own open architecture-level items remain open — see Program Completeness Verdict.) [INFERENCE: synthesis of the completeness classifications in iterations 1 and 20] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-001.md:9-22] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-020.md:9-14]

GEM’s one substantive contribution is the missing **knowledge/evidence-plane production methodology**. It defines how a knowledge product proceeds from competency questions and representation choices through ontology, source-routed extraction, events, per-source quality gates, reversible fusion, hybrid serving evaluation, and incremental maintenance. This extends what evidence may enter non-authoritative projections and how its fitness is demonstrated. It changes nothing about who may authorize state change. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:40-50] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/orientation.md:69-84]

The one doctrine we make explicit rather than adopt verbatim is GEM’s “prefer newer” guidance. GEM already scopes it to *retrieval time*, not truth admission (`fusion-and-llm.md:82-84`), so this is a tightening of wording, not a contradiction of a position GEM holds. Made explicit: “prefer newer” is permitted only as a purpose-specific retrieval heuristic, applied after valid time, observation time, provenance, uncertainty, contradiction, supersession, and required-answer fitness have been settled. It cannot be read as truth admission, and it cannot bypass `study-2` belief admission or 036 authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:72-85] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-327]

## Completeness Check: Studies 1-3 vs the Canonical Doctrine

| Design area | Verdict after GEM | Evidence and completeness result |
|---|---|---|
| Graph projection over 036 | **CONFIRM** | GEM distinguishes knowledge graphs from task graphs but defines no authority system. Nothing challenges the rule that graphs propose while 036 alone admits protected transitions and records authoritative history. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-21] |
| Typed executable IR | **CONFIRM** | Bounded jobs, explicit outputs, and real dependencies support typed nodes and edges. GEM supplies no `GraphDefinitionV1`, compiler, admission proof, sealing, materialization, or wire semantics. `study-1` and `study-3` remain controlling. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/task-graphs.md:12-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:26-28] |
| Scheduler, reducers, and safe waves | **CONFIRM + REFINE** | Fake-edge removal and parallelism only for genuinely independent work confirm readiness-based scheduling. GEM and the accompanying corpus refine operational tests for hidden shared resources, expected fan-in, context-budget collapse, and barrier necessity. They add no reducer algebra, join contract, conflict admission, or fencing primitive. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-016.md:9-26] |
| Eval verdicts as structural edges | **CONFIRM + EXTEND evaluation evidence** | Independent verification and objective evidence confirm verdict-controlled edges. GEM extends the evidence supplied to those gates with extraction precision/recall, leakage checks, and vector-only baselines [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:148-179], plus the inferred evaluation dimensions fusion error, route accuracy, and citation fidelity [INFERENCE: derived evaluation families, not verbatim from WORKFLOWS]. These quality results remain gate inputs, not authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:43-51] |
| Replay, effects, and human gates | **CONFIRM; NO EXECUTABLE EXTENSION** | GEM correctly places human approval immediately before expensive-to-reverse consequences. It provides no durable gate identity, dependency-vector revalidation, append receipt, idempotency rule, effect recovery, or replay cut. The stronger `study-2` and `study-3` contracts remain unchanged. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/task-graphs.md:61-67] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:29-30,36-41] |
| Loops as typed subgraphs | **CONFIRM at principle level** | Maximum-round and spawn caps support bounded loops. GEM presents a task DAG and supplies no nested state, typed exits, recursive sealing, budget composition, or convergence semantics. It therefore confirms boundedness without extending the subgraph contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/task-graphs.md:19-21,69-75] |
| Behavioral parity | **REFINE + EXTEND evidence coverage** | Data quality and retrieval quality become two additional evidence families. They do not replace causal-prefix runtime parity, complete observations, negative mutants, authority/effect suppression, or normalized ledger traces. A release decision must require the applicable evidence families conjunctively. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-013.md:9-25] |
| Organization graph vs work graph and governance | **CONFIRM** | GEM’s compact task-graph doctrine governs jobs and dependencies, not durable organization policy. Stable governance topology must still constrain dynamic work graphs, preserve rule provenance, and prevent generated work from expanding capability, budget, access, or authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:33-34] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-017.md:9-14] |
| Belief and truth maintenance | **CONFIRM + REFINE; SCOPE “prefer newer”** | Conflict preservation and provenance align with purpose-bound four-valued belief. Identity matching remains separate from proposition truth. GEM already scopes “prefer newer” to retrieval time; we make that scoping explicit so recency is never read as truth admission (a tightening, not a contradiction of GEM's stated position). [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-009.md:9-25] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-015.md:9-25] |
| Knowledge graph and hybrid retrieval | **EXTEND; PRIMARY STUDY-4 DELTA** | Studies 1–3 already require controlled predicates, temporal/provenance-bearing assertions, gated identity, hybrid routing, belief settlement, and non-authority. GEM closes the upstream production gap with competency-driven modeling, source routing, staged extraction, event graphs, measured producer quality, ontology alignment, reversible fusion, serving evaluation, and maintenance. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/orientation.md:69-84] |

## P1 — Close the Modeling-to-Extraction-to-Fusion Gap

**Doctrine.** `[TEXT-CLAIMED]` Begin with a value gate. A graph is warranted for recurring entities and relationship-centric, multi-hop, temporal, or synthesis questions. Tables, exact lookup, or vector retrieval remain preferable when they solve the actual question more simply. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:44-55]

`[TEXT-CLAIMED]` Select the representation before ingestion. Define how property-graph, RDF, or typed local records carry provenance and time before extraction or fusion makes retrofitting those properties unreliable. Use competency questions as both the ontology specification and its acceptance corpus. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:23-59]

`[TEXT-CLAIMED]` Route structured sources to deterministic mappings, semi-structured sources to parsers, and unstructured text to constrained model extraction. Run entity, relation, and event extraction as separate passes. Relations may connect only accepted entities, use ontology predicates, pass domain/range validation, and retain assertion evidence. Recurring unknowns enter quarantine rather than being coerced into the current ontology. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:12-98]

**Completeness verdict — EXTEND.** This is GEM’s central addition. `study-1` through `study-3` define how evidence projections are governed and consumed, but cover their upstream production lightly. GEM supplies the canonical production sequence.

**Design addition.** Add a non-authoritative knowledge/evidence lifecycle covering scope, representation, competency ontology, source routing, staged extraction, source-specific quality, reversible fusion, bounded serving, and maintenance. Its outputs are evidence candidates only. It changes nothing about executable IR, admission, sealing, replay, fences, gates, effects, or 036 authority. [INFERENCE: the pipeline fills an upstream evidence-production gap without creating a new transition path]

## P2 — Entity Resolution as a Truth-Maintenance Boundary

**Doctrine.** `[TEXT-CLAIMED]` Entity resolution should block plausible candidates, layer string, attribute, and neighborhood evidence, and reserve model adjudication for the ambiguous band. Merge policy remains deterministic. It retains aliases, conflicting values, source provenance, and `merged_from` information sufficient for reversal. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:20-41]

**Completeness verdict — REFINE + EXTEND.** GEM extends identity-production methodology. It does not extend truth admission.

The complete boundary has four ordered responsibilities:

1. **Identity proposal** decides whether records may denote the same entity.
2. **Evidence fusion** groups immutable source assertions under a reversible identity projection.
3. **Belief settlement** determines which propositions are usable for a stated purpose.
4. **Authority admission** determines whether one exact protected transition may append.

[INFERENCE: identity equivalence, assertion grouping, premise usability, and transition authority answer different questions and require different owners] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-009.md:9-25]

Identity confidence must never map directly to `IN`, `OUT`, `BOTH`, or `NEITHER`, and it must never authorize a transition. Reversing an identity merge rebuilds the derived evidence and belief projections while preserving the original assertions. These operations remain wholly non-authoritative. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-010.md:9-25]

## P3 — Ontology as Specification and Versioned Dependency

**Doctrine.** `[TEXT-CLAIMED]` Competency questions are the ontology’s specification and test suite. The ontology declares precise verb-named relations, domain/range, cardinality, canonical naming, and only the hierarchy needed by real questions. Extraction prompts consume the accepted ontology. Model-induced types and relations remain evidence-backed proposals requiring manual pruning. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:30-59,80-86]

**Completeness verdict — EXTEND production discipline; CONFIRM version discipline.** GEM establishes the ontology as a load-bearing knowledge-product specification. It does not define an executable ontology wire contract.

`[INFERENCE: the ontology governs extraction validity and evaluation meaning]` Every extraction, fusion, competency-test, and serving result must identify the accepted ontology version or digest on which it depends. A schema change must classify affected mappings, prompts, validation rules, fusion decisions, question corpora, and serving evaluations. Historical evidence remains associated with the version under which it was produced.

Renames, splits, merges, domain/range changes, and canonicalization changes may alter meaning. Ambiguous migrations fail closed rather than borrowing 036 event-upcaster behavior mechanically. This is evidence dependency management, not a change to 036 versioning or authoritative replay. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-012.md:9-25]

## P4 — Knowledge-Plane Quality Gates and Runtime Parity

**Doctrine.** `[TEXT-CLAIMED]` Measure extraction quality before fusion. Sample entities and relations, verify that entities are real and correctly typed, verify that source text asserts each edge, repair the producer, and rerun. Detect leakage and compare results with trivial baselines. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:76-80] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:148-162]

GEM’s 50-item, 90-percent example is pilot guidance, not a universal production threshold. Production thresholds must be calibrated by source family, risk, confidence interval, recall or coverage requirement, and downstream consequence. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-006.md:9-25]

**Completeness verdict — REFINE + EXTEND.** The design needs three separate evidence families:

- **Data quality:** entity, relation, event, and triple accuracy; recall or coverage; evidence spans; leakage; drift; and fusion error.
- **Retrieval quality:** route accuracy, retrieval sufficiency, citation fidelity, answer quality by question family, latency, cost, and comparison with vector-only baselines.
- **Runtime parity:** causal-prefix observations, complete case and mutant manifests, replay closure, authority and effect suppression, and stage-specific promotion evidence.

[INFERENCE: the gates compose but cannot substitute for one another] A high-quality knowledge graph may still execute through an unsafe runtime. A parity-correct runtime may still serve poisoned evidence. A strong answer score may still conceal an unauthorized effect.

Quality results may enrich coverage and parity projections. They remain non-authoritative observations and do not alter admission, sealing, replay, fencing, gate, or effect ownership.

## P5 — Temporal Facts versus Purpose-Bound Belief

**Doctrine.** `[TEXT-CLAIMED][ADOPT]` Preserve conflicting facts with time and provenance instead of overwriting them. Incremental memory should reuse the ontology, extraction, fusion, and bounded serving pipeline while periodically revisiting fusion and confidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:72-86]

**Completeness verdict — REFINE + SCOPE.** GEM already limits “prefer newer” to *retrieval time* (`fusion-and-llm.md:82-84`), so this scopes its wording rather than contradicting a position GEM holds. As a *universal* truth policy “prefer newer” would be insufficient: `study-2` requires composite semantic ordering, explicit supersession, prospective cycle and competing-successor checks, checked settlement, and serializable truth admission. Last-write-wins repair is forbidden. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-327]

`[INFERENCE: newer evidence is only one settlement input]` Retrieval may prefer a newer applicable fact only after purpose, valid time, observation time, source authority, uncertainty, scope, contradiction, supersession, and required-answer fitness have been considered. Receipt time cannot silently substitute for observation time.

This containment removes the only material doctrinal conflict. GEM’s temporal evidence stays in the non-authoritative plane. `study-2` belief settlement and 036 authority remain unchanged.

## P6 — Task-Graph Doctrine Audit for Missing Failure Modes

**Doctrine.** `[TEXT-CLAIMED]` Remove fake dependencies. Split only genuinely independent work. Verify branches in separate contexts. Assign one owner to merge. Place human approval immediately before costly-to-reverse consequences. Bound cycles, agents, and concurrent writers. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/task-graphs.md:23-75]

**Completeness verdict — CONFIRM + EXTEND operational tests.** GEM introduces no missing scheduler or authority primitive. It contributes four useful negative-test families:

- apparent data independence that hides shared files, workspaces, APIs, rate limits, credentials, budgets, or mutable services;
- hierarchical fan-in that exceeds context or reduction budgets;
- silent branch loss where received inputs do not match the join’s expected cardinality;
- unnecessary barriers that impose slowest-node latency where per-item pipelines are valid.

[SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-016.md:9-26]

These become parity and mutant cases. They do not change readiness modes, reducer algebra, wave admission, fencing, gate semantics, or 036 ownership. Topology also cannot repair a defect owned by the harness, tool interface, permission system, state store, evidence anchor, or effect-recovery layer. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-017.md:9-26]

## P7 — Curriculum as Staged-Rollout Evidence

**Doctrine.** `[TEXT-CLAIMED]` The curriculum proceeds from theory and value through representation, ontology, entity/relation/event extraction, quality, fusion, and LLM serving. A small pilot should pass the entire pipeline before scale. Ontology and fusion must not be skipped. The model is machinery within the pipeline, not its owner. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/curriculum.md:8-18,76-88] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:92-102]

**Completeness verdict — EXTEND rollout evidence.** Knowledge-product maturity and runtime promotion are orthogonal:

| Knowledge stage | Required exit evidence |
|---|---|
| K0 — Scope | A real competency corpus demonstrates that graph relationships are needed. |
| K1 — Model | Representation, temporal/provenance semantics, and the ontology dependency are accepted. |
| K2 — Pilot | A source-routed pilot completes entity, relation, event, quality, and fusion stages. |
| K3 — Quality | Per-source producer gates pass with uncertainty and failure taxonomy stated. |
| K4 — Fusion | False-merge and missed-merge evaluation passes; merge decisions are reversible. |
| K5 — Serving | Graph or hybrid routing beats, or appropriately yields to, the vector baseline by question family. |
| K6 — Maintenance | Incremental ingestion, contradiction preservation, drift detection, fusion replay, and hygiene pass. |

[INFERENCE: K0–K6 summarize GEM’s production sequence as promotion evidence rather than an executable state machine] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-018.md:9-25]

The runtime promotion axis from `study-1` through `study-3` remains separate: shadow execution, negative controls, causal-prefix parity, reversible canaries, selected writer/effect canaries, and a distinct 036 cutover. Curriculum completion cannot authorize runtime promotion. Runtime parity cannot compensate for an unfit knowledge product.

## The Knowledge/Evidence-Plane Production Methodology

This methodology is GEM’s one net-new deliverable for the four-study design.

| Stage | Canonical production rule | Required evidence-plane output |
|---|---|---|
| 1. Competency questions and ontology | Freeze real question families before extraction. Derive the smallest ontology that answers them using precise relations, domain/range, cardinality, and canonical naming. | Competency corpus, expected traversals, accepted ontology identity, and known gaps. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:30-59] |
| 2. Representation decision | Choose property graph, RDF, or a typed local representation before ingestion. Define valid time, observation time, provenance, and confidence semantics. | Representation decision and fact-level evidence requirements. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:23-28] |
| 3. Source-routed staged extraction | Map structured sources deterministically, parse semi-structured sources, and reserve constrained model extraction for unstructured text. Separate entity, relation, and event passes. | Source inventory, route identity, source spans, candidate types, confidence, and quarantined unknowns. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:12-57,77-98] |
| 4. Event modeling | Represent events as first-class nodes with triggers, typed arguments, temporal anchors, and causal, temporal, or conditional relations. Do not flatten n-ary events into unrelated pairs. | Event candidates with evidence spans, typed roles, time anchors, and relation qualification. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:59-75] |
| 5. Per-source quality gates | Evaluate each stage and source family independently. Measure precision, recall or coverage, leakage, uncertainty, drift, and failure modes. Repair the producer rather than hand-editing outputs. | Versioned quality results, samples, confidence intervals, rejected cases, and producer remediation evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:148-162] |
| 6. Reversible provenance-preserving fusion | Block candidates, layer identity evidence, review the ambiguous band, align ontologies before instances, and apply deterministic merge policy. Preserve source assertions and conflicting values. | Identity proposals, reviewed decisions, aliases, provenance, conflict records, ontology mappings, and reversible merge history. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:20-49] |
| 7. Hybrid serving evaluation | Entity-link questions, retrieve bounded paths or subgraphs, serialize provenance-bearing triples, and retain vector retrieval. Predeclare question families and compare every route with a vector-only baseline. | Route decisions, candidate origins, answer keys, citation fidelity, answer quality, latency, cost, and maintenance-value evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:165-179] |
| 8. Incremental maintenance | Reuse the accepted ontology and production stages for new evidence. Preserve contradictions, rescore stale confidence, rerun affected fusion, detect drift, and perform hygiene. | Incremental extraction and fusion evidence, contradiction/supersession projections, drift reports, stale-dependency impact, and reproducible rebuild results. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:72-86] |

Two invariants apply across every stage:

1. Every artifact is candidate evidence or a derived projection. None is independently authoritative.
2. Identity fusion precedes purpose-bound belief settlement, and belief settlement precedes any protected transition proposal. Only 036 may authorize and append that transition.

[INFERENCE: the production methodology governs evidence fitness while the inherited four-layer identity→evidence→belief→authority boundary governs its use]

## Explicit When-Not-to-Use Boundaries

- Do not build a knowledge graph for simple lookup, aggregation-dominant questions, non-recurring entities, or data whose relationships are not part of the product. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:49-55]
- Do not use graph-only retrieval. Retain vector and lexical routes, and let the graph yield whenever the relevant question-family baseline is better on quality, latency, cost, or maintenance burden. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:165-179]
- Do not use fuzzy entity resolution when stable curated identifiers or explicit source links already establish identity.
- Do not run model extraction over structured data that can be mapped deterministically. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:12-21]
- Do not fuse producers whose source-specific quality gate has not passed. A global average cannot make a poisoned producer safe. [INFERENCE: fusion compounds upstream false positives and obscures their source]
- Do not accept a knowledge product that cannot preserve source provenance, temporal meaning, conflicting assertions, and reversible identity decisions.
- Do not silently edit an ontology in place when extraction, fusion, evaluation, or serving artifacts depend on its earlier meaning.
- Do not use recency, match confidence, graph connectivity, or retrieval rank as proposition truth or transition authority.
- Do not adopt a knowledge graph merely because it improves presentation. Require measured advantage over a simpler maintained alternative.

## What GEM Does NOT Provide

GEM provides documentary doctrine only. It does not provide:

- a scheduler or readiness engine;
- reducer implementations or join semantics;
- a graph state machine;
- persistence or an append-only ledger;
- reference-closed replay or checkpoints;
- claimant identity, mutation fencing, or atomic commit admission;
- budget accounting;
- durable human gates;
- effect intent, receipts, idempotency, or recovery;
- organization-policy enforcement;
- transition authorization or cutover;
- executable parity fixtures or negative mutants;
- shipped ontology, evidence-envelope, or fusion wire contracts;
- production performance measurements or universal quality thresholds.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:20-27] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-002.md:9-25]

Its workflows are prompt specifications whose rigor lies in the artifacts and checks they request. They do not enforce those checks. Numeric examples such as a 50-document hand-check or 90-percent precision are pedagogical pilot guidance, not validated release criteria. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:78-79] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:92]

No executable contract should be inferred from GEM’s prose. Scheduler, persistence, replay, effects, authority, sealing, and parity remain owned by `study-1`, `study-2`, `study-3`, and 036.

## Program Completeness Verdict (4 studies)

The graph-based `system-deep-loop` *doctrine and plane-separation* are settled at the DESIGN level across the four reference studies — with real architecture-level items still open (below). The program comprises three executable-code studies plus one documentary completeness study — not four executable implementations.

`study-1` establishes the graph runtime architecture. `study-2` hardens truth, replay, concurrency, refusal, parity, and human consequence handling. `study-3` hardens admission, sealing, policy, budgets, gates, effects, governance, and promotion. Study 4 closes the remaining knowledge/evidence-production gap and makes its one retrieval heuristic explicit.

No additional *reference-repository* study is required to settle the plane separation. But study-3's own audit left architecture-level questions open that no documentary study can close, and they are carried forward here as open, not resolved:

- **036 capability is assumed, not audited.** The design offloads a ~10-item revalidation list to 036 without confirming 036 exposes each primitive; if it does not, the graph adapter must build them — a materially larger effort.
- **Owner-disagreement has no resolution mechanism** (no arbitration, escalation, or timeout).
- **Zero measurements.** No latency, memory, or overhead numbers exist for the proposed governance/graph machinery.
- **Concurrency behavior is unanalyzed** (GIL/async/threading/fan-out races).

Implementation-specific schemas, adapters, and threshold calibration also remain necessary. None of these reopen the authority or plane-separation decisions, but they mean the architecture is design-settled, not fully validated.

The single remaining evidence class is **a shadow prototype with measured baselines**. It must exercise the proposed graph runtime and knowledge pipeline against the legacy modes using causal-prefix parity, negative mutants, recovery drills, and measured correctness, quality, latency, cost, storage, contention, and operator-load baselines. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:122-126] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:234-253]

Until that evidence exists, the authoritative status is:

> **Doctrine and plane-separation complete at design level; several architecture-level items (036-capability audit, owner-disagreement arbitration, measurements, concurrency) remain open; implementation and production fitness unproven.**

## Convergence Report

| Dimension | Result |
|---|---|
| Iterations | **20 of 20** narratives completed. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-state.jsonl:5-24] |
| Mechanical stop reason | **`maxIterationsReached`** under `stopPolicy=max-iterations`. The configured workflow did not let convergence telemetry stop the run early. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-state.jsonl:1,25-26] |
| Angle coverage | P1–P7 all received dedicated passes. The terminal iteration records all ten research questions as answered. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-020.md:16-29] |
| Novelty trend | Novelty declined from `0.92` at orientation/baseline to `0.54` after the core production pipeline, `0.27` at temporal containment, and `0.15 → 0.08 → 0.03` across the final rollout, corpus, and terminal passes. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-state.jsonl:5-24] |
| Terminal result | Iteration 20 found no new architectural contradiction. Remaining uncertainty was reduced to implementation-specific artifact shapes, threshold calibration, and prototype measurement. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-020.md:9-14,28-45] |
| Convergence judgment | **Documentary corpus exhaustion (self-reported).** The `0.05` threshold had no stop authority (`stopPolicy=max-iterations`), and the novelty ratio is the executor's own self-assessment — so this is corpus exhaustion for a fixed documentary source plus self-reported telemetry, not an independently-certified convergence. Study-3 explicitly rejected novelty-ratio-as-proof; the same caution holds. [INFERENCE: the fixed documentary corpus was exhausted for the completeness question; convergence itself remains self-reported] |

The result differs materially from the code studies. Their iteration caps arrived with terminal novelty still at approximately `0.31`, `0.46`, and `0.60`, alongside explicit prototype and mechanism residuals. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:128-133] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:121-129] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:257-265]

Here, the steep decline to `0.03` means further documentary iteration is unlikely to change the design. It does not prove runtime behavior. It establishes that the doctrine and completeness questions have converged, and that the next informative step is the measured shadow prototype.