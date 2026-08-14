---
title: "Orientation Seed — graph-engineering-master → graph-based deep-loop (Repo Study 4, final)"
description: "Pre-research orientation for the 20-iteration graph-engineering-master study: a DOCUMENTARY teaching package (no runnable code). Extracts its knowledge-graph + task-graph doctrine and runs a completeness check against studies 1-3, focused on the knowledge-graph production plane the code studies covered lightly. Includes 7 prioritized research angles."
provenance:
  produced_by: "cli-codex executor, model gpt-5.6-sol, reasoning=high, service_tier=fast"
  dispatch: "read-only orientation dispatch (single), stdin-detached"
  produced_at: "2026-08-14"
  scope: "read-only analysis of context/graph-engineering-master (documentary) + context/blog-posts + 001/002/003 research (build-on)"
  role: "seed for the follow-on /deep:research 20-iteration run over this phase child"
  builds_on:
    - "specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md"
    - "specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md"
    - "specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md"
  note: "graph-engineering-master is documentary — a teaching/skill package with no runnable implementation. This study is a doctrine + completeness check, not a code study."
---

# Orientation Seed — graph-engineering-master → graph-based deep-loop (Repo Study 4, final)

> Authored by a gpt-5.6-sol (high, fast) orientation dispatch. Read-only analysis. graph-engineering-master is DOCUMENTARY (a teaching/skill package, no runnable code), so this study is a doctrine + completeness check against studies 1-3, not a code study. Claims marked TEXT-CLAIMED vs INFERENCE; citations use `GEM/` = `../context/graph-engineering-master/`, `BLOG/` = `../context/blog-posts/`, `AS1/`/`GR2/`/`GA3/` = the 001/002/003 research.

---

## 1. GRAPH-ENGINEERING-MASTER SUMMARY

`graph-engineering-master` is a documentary teaching/skill package, not a graph engine. It defines graph engineering as two related disciplines:

- **Knowledge graphs:** structures through which agents remember—entities/facts as nodes and temporal, provenance-bearing relationships as edges.
- **Task graphs:** structures through which agents work—jobs as nodes and actual execution dependencies as edges. `GEM/README.md:3-13`

Its knowledge-graph doctrine is a nine-stage pipeline: scope, representation, ontology, entity extraction, relation extraction, event extraction, quality gate, fusion, and LLM serving. The governing order is “model before extracting, fuse before storing, verify at every stage”; a graph is a schema-governed product rather than a pile of triples. `GEM/README.md:40-50`; `GEM/graph-engineering/SKILL.md:44-90`

`WORKFLOWS.md` operationalizes that curriculum as nine prompt blocks: `/kg-tutor`, then eight chainable tools covering scope, schema, extraction, relations, events, fusion, evaluation, and GraphRAG. `GEM/WORKFLOWS.md:1-8,12-45,47-179` The skill adds a domain-grounded teaching mode with staged exercises and diagrams. `GEM/graph-engineering/SKILL.md:25-42`

Its task-graph doctrine is deliberately compact: remove fake dependencies; use a split–parallel-work–independent-verification–owned-merge diamond; parallelize only genuinely independent work; place human approval immediately before expensive-to-reverse actions; cap cycles, agents, and concurrent writers. `GEM/graph-engineering/references/task-graphs.md:12-21,23-44,46-75`

**Explicit limit:** GEM teaches methodology and emits prompts, ontology artifacts, and diagrams. Its inventory contains Markdown references plus a packaged `.skill` archive containing those same documents; there are no runnable `.py`, `.ts`, `.js`, `.rs`, `.go`, or shell implementation files. The package therefore supplies no scheduler, graph state machine, persistence layer, replay system, effect handler, or executable authority contract. `GEM/README.md:20-27`

## 2. THE DOCTRINE IT TEACHES

**[TEXT-CLAIMED] Modeling.** Start from 10–20 competency questions; they serve simultaneously as the ontology specification and test suite. Derive a minimal set of entity types, precise verb-named relations with domain/range and cardinality, and only the hierarchy required by actual queries. Decide representation—property graph, RDF/OWL, or typed JSON/SQLite—and attach time and provenance before data enters the graph. `GEM/graph-engineering/references/modeling.md:11-28,30-59` This reinforces the blog corpus’s argument that typed edges preserve direction and meaning, while vague “related” links do not. `BLOG/What is Graph Engineering.md:70-80`

**[TEXT-CLAIMED] Extraction.** Route structured sources to deterministic mappings, semi-structured sources to parsers, and reserve model extraction for unstructured text. Run entity, relation, and event extraction as separate constrained passes. Every result carries a source span; relations may connect only recognized entities, must come from the ontology vocabulary, and must pass domain/range checks. Events remain first-class nodes with triggers, typed arguments, time anchors, and causal/temporal/conditional links. `GEM/graph-engineering/references/extraction.md:12-21,23-57,59-75,77-98` This deepens the corpus’s high-level “extract entities and relations” GraphRAG account. `BLOG/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:41-65`

GEM also **refines an inconsistency in that post**: its sketched pipeline builds the schema after extraction, whereas GEM insists ontology precede extraction. `BLOG/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:279-310`; `GEM/graph-engineering/SKILL.md:46-69`

**[TEXT-CLAIMED] Quality and fusion.** Before fusion, measure entity and relation precision on a sample and repair the producer rather than hand-editing outputs. Fusion uses blocking, layered string/attribute/neighborhood matching, LLM adjudication only for ambiguous cases, and deterministic merge policy. Conflicting values retain source-level provenance; merges record their origins for reversal. Schema-to-schema fusion aligns ontologies before instances. `GEM/graph-engineering/SKILL.md:76-85`; `GEM/graph-engineering/references/fusion-and-llm.md:12-49` This directly addresses the corpus’s strongest knowledge-graph failure warning: entity-resolution errors compound across hops. `BLOG/What is Graph Engineering.md:184-198,252-263`

**[TEXT-CLAIMED] LLM use and serving.** The LLM is a bounded component inside modeling, extraction, ambiguous matching, and answer narration—not a replacement for the pipeline. Retrieval should entity-link the query, select paths or a small one-to-two-hop subgraph, serialize provenance-bearing triples, and retain vector retrieval for questions that do not need graph traversal. `GEM/graph-engineering/references/fusion-and-llm.md:51-70` This agrees with the corpus’s “hybrid, never graph-only” position. `BLOG/What is Graph Engineering.md:133-142,174-182`

**[INFERENCE] Curriculum doctrine.** The nine stages convert the source course’s extraction→fusion→representation/reasoning/storage stack into a product sequence with explicit value, ontology, and quality gates. `GEM/graph-engineering/references/curriculum.md:8-18,76-88` This is GEM’s distinctive value: not new graph theory, but a disciplined build order spanning the knowledge plane from questions to maintained retrieval.

## 3. COMPLETENESS CHECK AGAINST STUDIES 1–3

| Current design area | Verdict | Completeness finding |
|---|---|---|
| Graph projection over 036 | **CONFIRM by compatibility** | GEM separates knowledge and task structures, but says nothing about authority. Nothing challenges the rule that graphs propose while 036 alone admits transitions and records history. `AS1/research/research.md:3-9`; `GR2/research/research.md:23-25` |
| Typed executable IR | **CONFIRM, no executable extension** | Bounded node jobs, defined outputs, and real data dependencies support typed nodes/edges. GEM provides teaching rules, not `GraphDefinitionV1`, sealing, admission proof, or compiler semantics. `GEM/graph-engineering/references/task-graphs.md:12-21`; `GA3/research/research.md:26-28` |
| Scheduler, reducers, waves | **CONFIRM/REFINE doctrine** | Fake-edge removal and “split only independent work” confirm readiness-based parallelism; one owned merge and one writer per file are conservative safety rules. GEM does not define reducer algebra, join modes, conflict admission, or fencing. `GEM/graph-engineering/references/task-graphs.md:23-28,46-59,69-75` |
| Eval verdicts | **CONFIRM** | Independent verifier contexts and objective evidence support verdict-controlled edges. The KG workflow extends evaluation inputs with triple precision/recall, leakage checks, confidence intervals, and vector-only baselines. `GEM/WORKFLOWS.md:148-179` |
| Replay, effects, human gates | **CONFIRM intent; under-covers contract** | GEM correctly places approval before irreversible work, but supplies no durable gate identity, effect receipt, dependency-vector revalidation, replay cut, or idempotency rule. Studies 2–3 remain strictly stronger. `GEM/graph-engineering/references/task-graphs.md:61-67`; `GA3/research/research.md:29-30,36-41` |
| Loops as subgraphs | **CONFIRM only at principle level** | Maximum-round caps are compatible with bounded loop subgraphs, but GEM’s task chapter presents a DAG and does not define nested state, typed loop exits, or convergence semantics. `GEM/graph-engineering/references/task-graphs.md:19-21,69-75`; `GR2/research/research.md:30` |
| Behavioral parity | **EXTEND evaluation coverage, not runtime parity** | KG quality gates add domain-specific product tests, especially extraction precision and GraphRAG-vs-vector comparisons. They do not replace causal-prefix parity, negative mutants, or normalized ledger traces. `GR2/research/research.md:31`; `GA3/research/research.md:32,37` |
| Org graph vs work graph and governance | **NO MATERIAL DELTA** | GEM models jobs and dependencies but not long-lived organization policy. The corpus’s stable-org/dynamic-work distinction remains the relevant doctrine, and study 3’s provenance-preserving policy compiler remains uncovered by GEM. `BLOG/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170`; `GA3/research/research.md:33` |
| Belief/truth maintenance | **CONFIRM provenance; REFINE/CONSTRAIN** | GEM says retain conflicting temporal facts, but then suggests preferring newer facts during retrieval. That is acceptable as a retrieval heuristic, not truth admission: study 2’s four-valued, purpose-bound belief state and prospective contradiction admission must remain authoritative. `GEM/graph-engineering/references/fusion-and-llm.md:72-85`; `GR2/research/research.md:33` |
| Hybrid retrieval / knowledge graph | **STRONGLY EXTEND** | Studies 1–3 already specify controlled predicates, bitemporality, provenance, hybrid routing, and non-authority. GEM fills the upstream gap: competency-driven modeling, source routing, staged extraction, event graphs, measured quality, ontology matching, reversible entity resolution, and maintenance. `AS1/research/research.md:85-91`; `GEM/graph-engineering/references/modeling.md:30-59`; `GEM/graph-engineering/references/extraction.md:12-75`; `GEM/graph-engineering/references/fusion-and-llm.md:20-49` |

There is no architectural contradiction with studies 1–3. The only doctrine requiring containment is GEM’s simplified “prefer newer” retrieval rule; newer evidence must not bypass belief settlement or 036 authorization.

## 4. DELTAS FOR OUR DESIGN

GEM adds one substantive coverage-level requirement: define a **knowledge/evidence-plane production methodology** alongside the executable graph contracts.

Concretely, the design should add:

- Competency questions as the ontology’s specification and acceptance corpus.
- An explicit representation decision plus mandatory temporal/provenance fields before ingestion.
- Deterministic routing by source structure; separate entity, relation, and event passes; candidate quarantine for recurring unmodeled concepts.
- Per-source extraction gates with sampled precision/recall and retained evidence spans.
- Reversible, provenance-preserving entity and ontology fusion using blocking, layered matching, review bands, and no silent conflict overwrite.
- Event-logic modeling for causal, temporal, and conditional chains.
- A serving evaluation that routes by question type and compares graph/hybrid retrieval against a vector-only baseline.
- Incremental maintenance: extraction, fusion, contradiction preservation, stale-confidence rescoring, and hygiene passes.

These belong wholly in the non-authoritative evidence/knowledge plane. They do not alter 036 admission, typed executable IR, sealed materialization, replay, fences, effects, gates, or parity. GEM therefore extends **what knowledge enters the projection and how its fitness is measured**, not **who may change authoritative state**.

## 5. RESEARCH ANGLES (PRIORITIZED)

- **P1 — Close the modeling→extraction→fusion gap.** Determine whether GEM’s full pipeline can become the canonical lifecycle for the non-authoritative knowledge plane without leaking LLM output into authority. Examine `GEM/graph-engineering/SKILL.md:44-102`, all three KG references, `BLOG/What is Graph Engineering.md:184-235`, and AS1 Decision 8. Yield: an adopt/refine/reject matrix for every pipeline stage.

- **P2 — Entity resolution as a truth-maintenance boundary.** Test blocking, neighborhood matching, review bands, reversible merges, aliases, and conflict preservation against Graphene’s four-valued beliefs and prospective nogood admission. Examine `GEM/.../fusion-and-llm.md:20-49,72-85`, `BLOG/What is Graph Engineering.md:184-198`, and `GR2/research/research.md:31-33`. Yield: a precise separation among identity proposal, evidence fusion, belief settlement, and authoritative admission.

- **P3 — Ontology as specification and versioned dependency.** Investigate competency questions, minimal schemas, domain/range checks, ontology learning, and cross-graph ontology matching against the typed IR/sealed-dependency design. Examine `GEM/.../modeling.md:30-59,80-86`, `GEM/.../fusion-and-llm.md:43-49`, and GA3’s sealed-graph/admission findings. Yield: the doctrine required for ontology versioning and change evaluation, without prematurely inventing a wire contract.

- **P4 — Knowledge-plane quality gates and parity.** Compare GEM’s 50-item precision gate, triple-level precision/recall, leakage checks, and GraphRAG-vs-vector evaluation with causal-prefix runtime parity. Examine `GEM/graph-engineering/SKILL.md:76-80`, `GEM/WORKFLOWS.md:148-179`, and GR2/GA3 parity findings. Yield: separate but composable definitions of data-quality, retrieval-quality, and runtime-parity evidence.

- **P5 — Temporal facts versus purpose-bound belief.** Challenge GEM’s “keep both, prefer newer” guidance using bitemporal validity, semantic supersession, contradiction, uncertainty, and purpose-specific settlement. Examine `GEM/.../fusion-and-llm.md:72-85`, `BLOG/What is Graph Engineering.md:144-158`, and GR2 Decision 8/P1/P5. Yield: a completeness verdict on whether GEM’s memory loop is safe as written or needs a richer belief adapter.

- **P6 — Task-graph doctrine audit for missing failure modes.** Map fake edges, diamond verification, stop rule, human gates, writer caps, context collapse, silent node failure, and false independence to the already-settled scheduler/gate/effect contracts. Examine `GEM/.../task-graphs.md:23-75`, `BLOG/Graph Engineering Roadmap.md:96-256`, and AS1 Decisions 2–5. Yield: a short list of genuinely missing doctrine, excluding mechanisms already settled by studies 1–3.

- **P7 — Curriculum as staged rollout evidence.** Compare GEM’s pilot-first nine-stage curriculum with the existing shadow-first runtime rollout. Examine `GEM/graph-engineering/SKILL.md:44-102`, `GEM/.../curriculum.md:76-88`, and `AS1/research/research.md:5-9`. Yield: one integrated rollout map distinguishing knowledge-product maturity from executable-runtime promotion.
