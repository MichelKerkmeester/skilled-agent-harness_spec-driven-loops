# Deep Research: Graph-Engineering-Based Deep Loops

**Packet**: `specs/system-deep-loop/037-graph-engineering`
**Session**: 27ce8e25-71b5-4732-bbf1-f6acf6bbebb4 (generation 1)
**Iterations**: 20 (complete ×17, timeout ×2, insight ×1)
**Executor**: native `deep-research` leaf agent (pi-subagents), model `openai-codex/gpt-5.6-luna`

---

## 1. EXECUTIVE OVERVIEW

The system-deep-loop is a live, loop-based workflow family (7 modes) whose runtime solves termination, state, authorization, and audit with ad-hoc machinery that the 036-deep-loop-innovation program is systematically hardening into an evidence-ledger spine. The graph-engineering corpus (GraphARC, graph-engineering-master, LangChain/LangGraph, and the article set) proposes graph-structured agent workflows. This research establishes the current deep-loop status, what 036 changes, the graph-engineering concept map, the practical reference implementations, and a concrete, constraint-aligned path to graph-engineering-based loops.

**Headline conclusions**

1. The loop is live; authority is NOT cut over. 014 remains blocked (F001/F002/F005, 022 parity, 024 fencing unbuilt).
2. 036 changes the authority plane (typed ledger + gateway + sealed artifacts + receipts + blinded adjudication), landed additive/dark; 034/036-046 ownership is undocumented.
3. Graph engineering is a discipline (typed state, admission-checked routing, subgraphs, checkpointing, control/work graph separation) with concrete when-not-to-use criteria.
4. GraphARC is executable; LangGraph provides primitives; graph-engineering-master is documentary (empty impl dir); LangChain.md is URL-only.
5. Target: hybrid — stable governed control graph + per-run work graphs, evidence ledger authoritative; four-phase migration (additive-dark research adapter → shadow parity → per-mode cutover → convergence-graph enrichment).

---

## 2. BACKGROUND & CONTEXT

- `system-deep-loop` is a hub skill routing 7 workflow modes (research/review/ai-council/alignment + 3 improvement lanes) through `mode-registry.json` over a frozen `runtime/` backend; loops externalize state (JSONL + strategy + registry + dashboard + iterations/deltas) with convergence detection and LEAF per-iteration dispatch.
- Packet 036 implements 178 research recommendations as ONE architecture: an append-only typed event ledger behind a fail-closed transition-authorization gateway, with sealed artifacts, replay fingerprints, receipts, and blinded adjudication — landed additive/dark, authority cutting over one mode at a time.
- Packet 037 holds the graph-engineering corpus: GraphARC-main (Python governance wrapper), graph-engineering-master (skill/workflow package), and 5 articles.

---

## 3. RESEARCH QUESTIONS

- Q1: Current status of the system-deep-loop system — modes, runtime subsystems, convergence/state machinery, landing status?
- Q2: What does 036-deep-loop-innovation change — evidence-ledger spine, migration model, landing status?
- Q3: Core graph-engineering concepts/patterns from the corpus (state graphs, nodes/edges, conditional routing, subgraphs, checkpointing, when-to-use/when-not-to-use)?
- Q4: How do the reference implementations structure graph-based workflows (GraphARC, graph-engineering-master, LangChain/LangGraph)?
- Q5: What would a graph-engineering-based deep-loop architecture look like aligned with OUR system, with a concrete transformation path?

---

## 4. METHODOLOGY

20 sequential iterations of the autonomous deep-research loop (auto workflow): fresh-context LEAF dispatches against externalized state, one focus per iteration, mechanical post-dispatch validation (`verify-iteration.cjs`) and reducer refresh per iteration, synthesis owned by the workflow. Focus rotation: status census → 036 spine → corpus concepts → reference implementations → mapping → adapter contract → reconciliation → GraphARC internals → runtime census → corpus completion → ledger-graph alignment → fixture/parity design → convergence-as-graph → fan-out branches → fan-in replay → cross-check → when-not-to-use → migration path → gap analysis → final sweep. Every finding carries `[SOURCE: file:line]` or `[INFERENCE: ...]`. Graph convergence/upsert ran in the documented unavailable fallback (better-sqlite3 ABI mismatch — Node 25 vs prebuilt Node 22), recorded as `graph_convergence`/`graph_upsert_skipped` events.

---

## 5. KEY FINDINGS SUMMARY

- 125 key findings consolidated in the reducer registry (registry `metrics.keyFindings`); coverage: code sources 165, other 69, LangGraph docs 5.
- P0 status: 014 cutover blocked; 024 append-boundary fencing unbuilt; F001 identityResolver optional; F005 lock partial-record window open.
- Architecture verdict: hybrid loop+graph, not replacement; ledger stays authoritative.
- Convergence verdict: graph layer is a structural guard (contradiction/coverage/diversity/hotspots/replay), never a replacement for the inline 3-signal vote.

---

## 6. FINDINGS — Q1: CURRENT DEEP-LOOP STATUS

- Seven modes, three-tier discriminator (`runtimeLoopType` research|review|council; explicit null for alignment/improvement backends); `mode-registry.json` is routing authority. [iteration-001, iteration-007]
- `graph-metadata.json` is a stale discoverability projection (2026-07-14), not status truth. [iteration-007]
- Runtime boundary is live: convergence = graph-assisted veto over the inline vote (rolling avg 0.30 / MAD 0.35 / entropy 0.35; STOP only when inline ∧ graph STOP_ALLOWED/absent; STOP_BLOCKED → blockedStop); loop-lock, flat-pool fan-out, verify, reduce wired into `deep-research-auto.yaml`. [iteration-009, iteration-013]
- Coverage-graph machinery is auxiliary: `upsert.cjs` validates node kinds (QUESTION|FINDING|CLAIM|SOURCE) and relations (ANSWERS|SUPPORTS|CONTRADICTS|SUPERSEDES|DERIVED_FROM|COVERS|CITES), rejects self-loops; omitted edges reduce coverage, never change the inline ratio. [iteration-013]
- Loop-lock CLI is owner/nonce-scoped with stale reclaim; `openSync(...,'wx')` create-then-write partial-record window remains (F005). [iteration-009, iteration-017]

## 7. FINDINGS — Q2: WHAT 036 CHANGES

- Spine (001-013) landed additive/dark: typed event ledger, fail-closed transition-authorization gateway, sealed/frozen reference artifacts, versioned replay fingerprints, receipts/certificates, blinded/counterfactual adjudication; compatibility adapters + shadow parity; per-mode cutover; legacy retirement. [iteration-002]
- 014 is the blocked, operator-gated crux: F001 (identityResolver conditional — `transition-authorization-gateway.ts:718-773`), F002 (policy-state binding harness-only), F005 (lock window — `loop-lock.ts:239-261`), 022 deep-review parity, and 024 fencing unbuilt (`appendAuthorized` public at `append-only-ledger.ts:349`; ~109 callers; stale positive prose contradicted by code evidence). [iteration-012, iteration-016, iteration-017, iteration-019]
- Phase accounting: 034 optional/reorg-last; 036-046 unassigned in canonical docs — coverage gap. [iteration-007, iteration-009]
- Sequencing: 024 + whole-system clearance precede 014; 015-017 follow. [iteration-018]

## 8. FINDINGS — Q3: GRAPH-ENGINEERING CONCEPTS

- Typed state + declared writes: GraphARC `GraphARCState` forbids undeclared fields; admission is a deterministic fail-closed checker (registry/policy/budget/depth/acyclicity/reachability) binding routing authority to registry kinds, not instance names. [iteration-008, iteration-011]
- Two coupled problems (graph-engineering-master): knowledge-graph (ontology → extraction → fusion → serving) and task-graph (jobs, parallel fan-out, separate verifiers, stop rules, human gates). [iteration-010]
- Control vs work graph separation; checkpointed resume; trace observability with documented inference limits (no parent pointer). [iteration-010, iteration-011]
- When-to-use: complex/high-concurrency, ≥3 independent verification steps, complex decision routing, governed fan-out/fan-in. When-not: simple/linear/low-state/single-pass; overhead (design, failure propagation, context routing, distributed runtime) exceeds value. [iteration-017]

## 9. FINDINGS — Q4: REFERENCE IMPLEMENTATIONS

- GraphARC (`GraphARC-main`): executable governance wrapper — admission (`planner/admission.py`), materialize (`planner/materialize.py`), typed runtime state/budgets/traces, replay-to-OTel (`observe/otel.py`), bench harness; checkpoint resume partial, durability pass-through unimplemented (ROADMAP). [iteration-003, iteration-004, iteration-008]
- LangGraph (official docs): StateGraph, nodes/edges, conditional edges, checkpointers, Send/map; checkpoints preserve resumable state but are NOT a replayable why-audit (no sealed receipts/fingerprints). [iteration-004]
- graph-engineering-master: README + WORKFLOWS.md (9 prompt blocks) + packaged `dist/graph-engineering.skill`; local `graph-engineering/` implementation directory EMPTY — documentary. [iteration-010, iteration-016, iteration-017]
- LangChain.md: URL-only stub; no direct claims attributed. [iteration-003, iteration-010]

## 10. FINDINGS — Q5: TARGET ARCHITECTURE

- Mapping: modes → graphs/subgraphs; iteration focus → node; convergence → edge routing/termination; JSONL state + reducer → graph state + reducers; loop-lock → serialization; fan-out lineages → parallel branches; 036 ledger → authoritative event log beside checkpoints. Non-mapping: transition authorization, sealed receipts, blinded adjudication stay in the ledger plane. [iteration-005, iteration-011]
- First adapter mode = research (additive-dark shadow): strongest artifact contract, clean parity oracle; typed `ResearchGraphState` specified (schemaVersion, namespace, iteration, artifact hashes, knowledge ids, signals, route). [iteration-006]
- Parity gates (DB-independent): one narrative / one state record / one delta; identical reducer outputs; identical convergence decisions; identical failure cases; deterministic replay fixture with permutation-based branch-to-join replay. [iteration-006, iteration-012, iteration-015]
- Convergence-as-graph: CONTRADICTS/COVERS/CITES structural guards + topology fingerprints for replay. [iteration-013]
- Fan-out: flat-pool branch frontier (wave/depends_on rejected, not approximated); lineages are filesystem-enforced detached subgraphs — stronger than shared graph state, preserve them; fanout-merge is deterministic content-first/ID-tiebreak with CONTRADICTS variants, registry-only writes. [iteration-014, iteration-015]
- Migration: Phase A additive-dark research adapter (DB-independent); Phase B exact shadow parity; Phase C per-mode cutover behind 036 gateway + rollback windows, legacy retirement on zero-use; Phase D convergence-graph enrichment after the projection dependency is healthy. Adapter design/fixture parallelizes now; authority changes wait on 036 gates. [iteration-018]

---

## 11. RECOMMENDATIONS

1. **036-owned (blocking)**: build 024 append-boundary fencing in `runtime/lib/authorized-ledger/append-only-ledger.ts` (private primitive, coordinator-issued fence capability, migrate ~109 callers atomically); wire F001 identityResolver mandatorily at the gateway; close the F005 lock partial-record window. Closure evidence: red-before/green-after stale-writer test, no-direct-append negative test, typecheck + concurrent-write suite, code-verified 014 certificate. [iteration-019]
2. **037-owned (follow-up packet)**: research-mode graph adapter in additive-dark shadow with the specified `ResearchGraphState`, `graphEvents` bridge, and five-row shadow-parity gate dashboard; deterministic replay fixture; all DB-independent. [iteration-006, iteration-012]
3. **Tooling**: resolve the coverage-graph DB availability (rebuild better-sqlite3 for Node 25 or pin runtime to Node 22) before Phase D. [iteration-019]
4. **Governance**: produce an owner-approved accounting for 036 phases 034 and 036-046; replace URL-only LangChain.md with a real snapshot. [iteration-019]
5. **Sequencing**: start the 037 implementation packet in parallel with 036's 024/014 work; do not cut authority until 036 gates pass. [iteration-018]

---

## ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Big-bang graph replacement | Violates live-runtime constraint; 036 mandates additive/dark + shadow parity + per-mode cutover | execution-sequencing-strategy.md:1-26; handover.md:44-83 | 005, 011, 018 |
| Graph database-first adapter / DB-gated parity | Projection unavailable (ABI mismatch); correctness must not depend on it | state.jsonl graph_upsert_skipped events | 012, 013, 014 |
| Checkpoint as authority ledger (LangGraph/GraphARC) | Checkpoints are resumable execution state, not temporal/audit authority | 036 spec.md:60-67,94-103; LangGraph persistence docs | 011 |
| Conditional edges as fail-closed transition authorization | Routing cannot enforce identity, policy digests, stale-writer fencing, append authorization | 036 spec.md:123-125,152-153; GraphARC README:69-160 | 011 |
| Branch topology as blinded/counterfactual adjudication | Topology does not prove masking, independence, or certification | 036 spec.md:64-66,98,109 | 011 |
| Graphing every mode and every leaf operation | Corpus + workflow support simpler loops for low-branching work; custom backends fit least | From Loops to Graphs:160-173; deep-research-auto.yaml:147-159 | 017 |
| Rejected scheduler metadata as implicit graphs | wave/depends_on/touches is rejected, not approximated (flat_pool fallback explicit) | fanout-run.cjs:332-432 | 014 |
| graph-engineering-master packaged skill as runnable implementation | Local implementation directory is empty | README.md:20-27; direct inventory of graph-engineering/ | 010, 017 |
| Stale 024/033 landing prose as current runtime behavior | Contradicted by code-verified evidence; safe status is not-discharged/P0-blocked | 024 decision-record.md:391-408; handover "014 IS NOT READY" | 012, 016 |

---

## DIVERGENCE MAP

- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0 (single lineage; divergent-pivot machinery not engaged)
- Saturated: none formally marked; local LangChain.md URL path exhausted as a dead end (superseded by official LangGraph docs)
- Pivot lineage: none
- Remaining frontier: deterministic replay/parity fixture execution; 024 fencing verification; 034/036-046 canonical ownership; coverage-graph DB restoration; production shadow-parity run

---

## 12. OPEN QUESTIONS

1. Who owns canonical status/deprecation accounting for 036 phases 034 and 036-046? (operator-gated)
2. Does the deterministic adapter/replay fixture pass permutation-based branch-to-join replay and golden reducer comparison? (implementation)
3. Does 024 append-boundary fencing land with red-before/green-after evidence, making 014 reachable? (036 epic, operator-gated)
4. Coverage-graph DB: rebuild better-sqlite3 for Node 25 or pin the runtime to Node 22? (tooling decision)
5. Should a 037 implementation packet (adapter/fixture/gates) start once 036's authority gates clear? (planning; `/speckit:plan` next)

## 13. REFERENCES

- Iteration evidence: `research/iterations/iteration-001..020.md`; `research/deltas/iter-001..020.jsonl`; `research/deep-research-state.jsonl`; `research/findings-registry.json`; `research/deep-research-strategy.md`; `research/deep-research-dashboard.md`.
- Subjects (read-only): `specs/system-deep-loop/036-deep-loop-innovation/` (spec.md, handover.md, execution-sequencing-strategy.md, 024-durable-write-boundaries/, 033-identity-and-lock-ownership-hardening/); `.opencode/skills/system-deep-loop/` (mode-registry.json, runtime/scripts/, runtime/lib/authorized-ledger/, runtime/lib/deep-loop/loop-lock.ts); `.opencode/commands/deep/assets/deep-research-auto.yaml`.
- Corpus: `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/`; `context/graph-engineering-master/`; `context/*.md`; official LangGraph docs (docs.langchain.com: graph-api, persistence).

## 14. SOURCES CONSULTED (aggregate)

Registry coverage by source: code 165, other 69, docs.langchain.com 4, langchain-ai.github.io 1, raw.githubusercontent.com 1. Full per-iteration source lists in each `iteration-NNN.md` `Sources Consulted` section.

## 15. RESOURCE MAP

`resource-map.md` was not present at init (packet was nascent; only `context/` existed). A resource map was emitted from converged deltas at synthesis: `research/resource-map.md`.

## 16. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached` (stop-policy=max-iterations; convergence telemetry only)
- Total iterations: 20
- Questions answered: **0 resolved of 5 tracked** (reducer truth: `openQuestions: 5`, `resolvedQuestions: 0`, `carriedForwardOpenQuestions: 61`); evidence-level coverage achieved for Q1-Q5 with explicit open residuals
- Remaining questions: 5 (see §12)
- Last 3 iteration summaries: run 18: migration path (0.90) · run 19: gap analysis (0.72) · run 20: final sweep (0.77)
- Convergence threshold: 0.05 (telemetry; mean newInfoRatio ≈ 0.81 across 20 iterations)
- Divergence summary: no divergent pivots recorded; single lineage; frontier = fixture execution + 036 gates
- Graph convergence: unavailable in-environment (better-sqlite3 ABI mismatch); inline 3-signal vote operated throughout; 20 `graph_upsert_skipped` + `graph_convergence` events recorded (documented fallback)

## 17. APPENDIX — EXECUTION LOG

- Session: 27ce8e25-71b5-4732-bbf1-f6acf6bbebb4, generation 1, lineage `new`, lock owner 79821 (acquired after operator push checkpoint)
- Iteration statuses: 001-007 complete · 008 complete (leaf self-reported error; mechanical gate passed) · 009 complete (after one transient dispatch retry) · 010 complete (leaf self-reported error; gate passed) · 011 complete (one redispatch within contract after tool-ceiling timeout) · 012-015 complete · 016 timeout (partial verification) · 017-019 complete · 020 insight (final sweep)
- Redispatch/repair events: iteration-011 redispatch ×1 (contract); iteration-014/015/018 narrative heading repairs (leaf verifier strictness; authoritative gate passed)
- Coverage-graph DB: better-sqlite3 `ERR_DLOPEN_FAILED` (NODE_MODULE_VERSION 127 vs 141) — all `convergence.cjs`/`upsert.cjs` calls recorded as unavailable, per workflow fallback
- Git: packet committed locally through `docs(research): add iteration 20 and resource map` (136765d113); pushed once to `origin/skilled/v4.0.0.0` at iteration-8 checkpoint (7763ef2977) per operator direction; subsequent local checkpoints await operator go-ahead
