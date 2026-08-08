# Iteration 13: Convergence as graph analysis

## Focus
This iteration examined how the live coverage graph participates in convergence today, how it is composed with the inline rolling-average/MAD/question-entropy vote, and what additional graph structure is needed for contradiction-aware, evidence-dense, source-diverse, hotspot-aware, and replayable termination. The selected interpretation is the runtime decision boundary, not an implementation change; graph execution parity is deferred because the packet records an unavailable native graph database.

## Actions Taken
1. Read the convergence runtime and traced research signal calculation, blockers, score deltas, snapshot persistence, and writer-lock boundaries. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs]
2. Read the graph upsert entrypoint and checked its node/relation validation, self-loop rejection, and event-to-edge normalization. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs]
3. Read the live research workflow's graph-convergence and inline-vote algorithm, including minimum-iteration and quality-guard ordering. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689]
4. Reused the iteration-004 LangGraph findings to distinguish state checkpointing from causal trace/replay evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md]

## Findings
1. **[P1] Current convergence is a graph-assisted veto, not a graph replacement.** The workflow invokes coverage-graph convergence first, then still computes the inline three-signal candidate: rolling average of the last three `newInfoRatio` values, a MAD-derived noise floor over all evidence iterations, and question coverage/entropy. A stop is legal only when the inline candidate is true and graph convergence is `STOP_ALLOWED` or absent; `STOP_BLOCKED` becomes `blockedStop`. The graph runtime independently computes research question coverage, claim verification, contradiction density, source diversity, and evidence depth, then emits blockers, a weighted score, and optional snapshot data. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs]

2. **[P1] The event graph adds relationships that scalar novelty cannot express, but ingestion is fail-closed and vocabulary-bound.** `upsert.cjs` converts node/edge events into loop-scoped records, validates node kinds and relations, rejects self-loops, and persists only accepted events. This makes `CONTRADICTS`, `COVERS`, and `CITES` useful for traversable claims such as unresolved contradiction pairs, per-question coverage, and independent source links; it also means an omitted or invalid edge silently reduces graph coverage rather than changing the inline ratio. Prior state records show graph convergence/upsert were skipped when the native database module was unavailable, so the graph must remain an optional veto/telemetry plane rather than a prerequisite for adapter correctness. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]

3. **[P1] The strongest graph addition is a structural termination predicate, not another blended score.** A research stop candidate should require every required question node to have meaningful `COVERS` paths to findings, sufficient `CITES` diversity and evidence depth, no unresolved high-confidence `CONTRADICTS` component, and saturation of declared hotspots; each failed predicate should carry the exact question/finding/source IDs for recovery. The current runtime already demonstrates pieces of this model for graph review (contradiction-derived finding stability, evidence density, and hotspot saturation) while research uses its own question/claim/source signal family, so a future research graph should normalize these relations without collapsing loop-specific semantics. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs] [INFERENCE: the proposed per-question and per-hotspot predicates follow the existing relation vocabulary and the workflow's blocker-oriented graph gate.]

4. **[P1] Legacy termination semantics must remain a second, independent guard.** Graph conditions are better than the inline vote at exposing why a question is weakly covered or why evidence conflicts, but they lose when the graph is empty, stale, malformed, unavailable, or expensive to materialize. Therefore graph convergence should map to a guarded route: graph `CONTINUE` or `STOP_BLOCKED` forces more research; graph `STOP_ALLOWED` only permits the inline candidate to stop; `minIterations`, stuck recovery, and quality guards still override ordinary stopping, while the max-iteration cap remains terminal. This preserves the documented additive/shadow migration and avoids making a graph database or checkpointer authoritative. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs] [INFERENCE: based on the workflow's explicit combined-stop algorithm and the prior LangGraph distinction between state persistence and causal trace.]

5. **[P2] Replayable convergence needs a topology fingerprint alongside the existing metric snapshot.** The runtime persists score/metrics, node and edge counts, score delta, and momentum under a writer lock, while reducer rollup preserves raw graph signals, decision, and blockers. A deterministic replay snapshot should additionally record a canonical sorted node/edge projection (or content hash), relation counts, per-question coverage paths, contradiction set, source-diversity calculation, thresholds, blocker trace, and the exact inline inputs used for the decision. LangGraph's checkpoint model preserves state continuity, whereas iteration 004 records GraphARC's separate trace as the rationale layer; the same separation is needed here for a replayable why-audit rather than a mutable checkpoint pretending to be one. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:buildGraphConvergenceRollup] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md] [INFERENCE: because the current snapshot call supplies metrics and counts, a topology fingerprint and normalized projection are the smallest additions that make the decision reproducible.]

## Questions Answered
- Q5 refinement: the current graph contribution is a pre-inline quality veto; the target graph contribution is a structural guard layer for contradiction, coverage, source diversity, hotspot saturation, and replay.
- Q1 refinement: convergence is split between imperative inline semantics and an optional session-scoped graph projection; neither layer alone is the complete stop authority.

## Questions Remaining
- The implementation owner still needs to build and execute the deterministic adapter/replay fixture, including graph-off and database-unavailable parity cases.
- Canonical reducer snapshot serialization and production convergence parity remain unexecuted.
- The complete 024 caller migration evidence and owner-approved accounting for 034 and 036-046 remain outside this focus.

## SCOPE VIOLATIONS
None. Only the iteration narrative, append-only state log, and this iteration's delta file were written.

## Ruled Out
- Treating the graph score as a replacement for the inline vote or its `newInfoRatio` semantics. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-689]
- Making graph-database availability a prerequisite for adapter correctness or shadow parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]
- Treating a LangGraph checkpointer as the append-only evidence ledger or complete why-audit. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md]

## Dead Ends
- Live graph execution was not attempted after the packet's prior native-module failure; static runtime analysis was the productive fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]

## Edge Cases
- Ambiguous input: none; the prompt explicitly selected convergence comparison and graph termination analysis.
- Contradictory evidence: none unresolved; graph and inline decisions are intentionally separate gates, not competing claims about one metric.
- Missing dependency: the packet state records a `better-sqlite3` native-module mismatch and skipped graph convergence/upsert; source-level evidence was used instead. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]
- Partial success: static analysis answered the focus, but live graph database execution and production parity remain unverified; status is complete for this research question, not for implementation readiness.

## Sources Consulted
- `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs`
- `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs`
- `.opencode/commands/deep/assets/deep-research-auto.yaml:608-689`
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md`
- `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:buildGraphConvergenceRollup`
- `specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events`

## Assessment
- New information ratio: **0.80** (three findings are fully new runtime/termination detail and two extend prior adapter/snapshot analysis).
- Questions addressed: Q5 convergence-as-graph refinement; Q1 convergence-boundary refinement.
- Questions answered: current two-stage composition, graph termination predicate, legacy guard mapping, and replay requirements.

## Reflection
- What worked and why: reading the workflow algorithm beside the runtime implementation made the graph veto boundary and the inline vote's independent semantics explicit; iteration 004 supplied the checkpoint-versus-trace distinction needed for replay design.
- What did not work and why: no live graph decision or parity run was possible because the packet records the native database module mismatch.
- What I would do differently: the next implementation-owned pass should first define the canonical topology fingerprint and execute graph-available, graph-empty, and graph-unavailable fixtures before considering any authority change.

## Recommended Next Focus
Build and execute the implementation-owned adapter/replay fixture with canonical topology fingerprints, independent reducer-oracle checks, negative blocker tests, and graph-unavailable parity; keep the inline vote and 036 authority gates unchanged.
