# Deep Research Strategy — graphene-main

## 1. OVERVIEW

Extend, rather than repeat, repo study 1 by extracting mechanisms from Graphene's event-sourced work graph and belief layer and mapping them onto the current system-deep-loop runtime plus the 036 authority plane.

## 2. TOPIC

Graphene-main patterns for a truth-maintaining, ledger-derived, adversarially verified, mutation-fenced graph projection in system-deep-loop.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (completed)

- [x] P1: `BeliefProjectionV1` is a purpose-bound, disposable four-valued projection with checked quiescence and selected-authority guards; only non-stale `IN` premises are usable. [SOURCE: iterations/iteration-020.md:28-32]
- [x] P2: `GraphProjectionReducerV1` uses exact-version/registered no-op reduction over reference-closed independent domain/audit cuts; checkpoints are disposable and committed authority history is never compacted. [SOURCE: iterations/iteration-020.md:34-38]
- [x] P3: `CrossAdapterTraceV1` compares causal operation prefixes with independent checkpoints, closed normalization, proven partial orders, and manifest-bound mutants. [SOURCE: iterations/iteration-020.md:40-44]
- [x] P4: `GraphMutationCommandV1` is claimant-addressed and target-complete, with atomic claim/head/version/fence revalidation; Graphene may inform admission but not commit authority. [SOURCE: iterations/iteration-020.md:46-50]
- [x] P5: supersession uses `(observedAt, authorizedSequence)` while replay remains ledger-ordered; truth/nogood changes require prospective serializable fixed-point admission. [SOURCE: iterations/iteration-020.md:52-56]
- [x] P6: `TransitionRefusalV1` is a versioned, typed, authority-zero non-command outcome whose advice requires a fresh authorized request. [SOURCE: iterations/iteration-020.md:58-62]
- [x] P7: durable human gates bind live topology/evidence/belief/principal/capability/fence/expiry dependencies; consequence and effect remain separate authorized transitions. [SOURCE: iterations/iteration-020.md:64-68]
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Repeating repo study 1's typed graph IR, seven-plane architecture, or staged rollout without a Graphene-derived delta.
- Implementing runtime changes or granting the graph any transition/effect authority.
- Treating blog claims as authority where code or 036 contracts disagree.
- Writing outside this detached lineage artifact directory.

## 5. STOP CONDITIONS

- Run exactly 20 iterations; convergence before iteration 20 is telemetry only.
- Synthesize only after all seven questions have evidence-backed decisions and explicit when-not-to-use boundaries.
- Halt on state corruption, containment breach, or unrecoverable workflow failure.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- **P1 — answered/exhausted:** REFINE + EXTEND repo 1 with executable belief maintenance; do not use for direct facts, simple validated DAGs, explanation-only output, or already-sufficient evidence signals. [SOURCE: iterations/iteration-020.md:28-32]
- **P2 — answered/exhausted:** REFINE repo 1 and CONTRADICT Graphene compaction; do not use checkpoints when genesis replay is cheaper or replay identity is unknown. [SOURCE: iterations/iteration-020.md:34-38]
- **P3 — answered/exhausted:** REFINE + EXTEND repo 1 with causal-prefix parity; do not use for non-semantic presentation/transport behavior or units with stronger direct oracles. [SOURCE: iterations/iteration-020.md:40-44]
- **P4 — answered/exhausted:** CONFIRM + REFINE repo 1 safe-wave semantics; do not require fences for read-only or truly immutable content-addressed writes. [SOURCE: iterations/iteration-020.md:46-50]
- **P5 — answered/exhausted:** EXTEND repo 1 and CONTRADICT unsafe Graphene production paths; do not globally serialize proven closure-disjoint or quarantined non-control data. [SOURCE: iterations/iteration-020.md:52-56]
- **P6 — answered/exhausted:** REFINE + EXTEND repo-1 failure semantics; do not wrap local non-gateway parsing/presentation errors when a complete bounded typed error already exists. [SOURCE: iterations/iteration-020.md:58-62]
- **P7 — answered/exhausted:** REFINE + EXTEND repo-1 human gates; do not use for acknowledgements or preferences without consequence-bearing transitions. [SOURCE: iterations/iteration-020.md:64-68]
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Comparing Graphene mechanisms against repo 1 and the 036 authority plane prevented useful projection mechanics from being mistaken for authority. [SOURCE: iterations/iteration-020.md:70-85]
- Treating each apparent conflict as a typed boundary—semantic time versus replay order, claim versus fence, refusal versus command, choice versus effect—closed P1-P7 without weakening either system. [SOURCE: iterations/iteration-020.md:131-135]
- The twelve-blog corpus was useful for topology, verification, and when-not-use triangulation after code and 036 contracts fixed the authority boundary. [SOURCE: iterations/iteration-015.md:7-58]
- The A1-A7 mutant pass converted prose guarantees into earliest-failure expectations suitable for cross-adapter parity. [SOURCE: iterations/iteration-017.md:9-81]
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Terminal-state or filename-only parity could not prove causal, refusal, budget, effect, or stale-writer behavior. [SOURCE: iterations/iteration-016.md:14-58]
- A bounded settlement loop could not by itself prove quiescence; explicit cycle, oscillation, repeated-state, and bound-exhaustion checks were required. [SOURCE: iterations/iteration-017.md:9-21]
- Workspace isolation, leases, wave admission, checkpoints, green evaluations, refusal advice, and human choices could not supply authority at the protected mutation boundary. [SOURCE: iterations/iteration-020.md:102-110]
- Further document-only passes cannot close implementation races, mutant behavior, performance, or cost gaps. [SOURCE: iterations/iteration-020.md:87-100]
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- **P1 exhausted:** source/state/cascade/convergence/authority-disposition semantics and when-not-use boundaries are resolved; retry only after executable termination or parity evidence changes the facts. [SOURCE: iterations/iteration-020.md:28-32]
- **P2 exhausted:** dual-cut closure, reducer/no-op rules, checkpoint identity, replay, point-in-time, and non-compaction decisions are resolved. [SOURCE: iterations/iteration-020.md:34-38]
- **P3 exhausted:** trace schema, accepted/refused prefix rules, normalization, partial orders, independent checkpoints, and mutant expectations are resolved. [SOURCE: iterations/iteration-020.md:40-44]
- **P4 exhausted:** exact claimant/attempt/target command identity and atomic commit checks are resolved; remaining work is caller inventory and testing. [SOURCE: iterations/iteration-020.md:46-50]
- **P5 exhausted:** observation/replay order, validity, successor, nogood, clean-base, and serializable admission rules are resolved. [SOURCE: iterations/iteration-020.md:52-56]
- **P6 exhausted:** version, code/boundary/detail, audit linkage, authority-zero status, and fresh-request semantics are resolved. [SOURCE: iterations/iteration-020.md:58-62]
- **P7 exhausted:** durable context, dependency vector, revalidation, invalidation/reopen, timeout, consequence, and separate-effect semantics are resolved. [SOURCE: iterations/iteration-020.md:64-68]
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- A unified Graphene authority stack or graph-wide kill switch. [SOURCE: iterations/iteration-019.md:19-70]
- Authority-log compaction, timestamp replay order, synthetic domain/audit sequence, or retroactive truth-history rewriting. [SOURCE: iterations/iteration-020.md:102-110]
- Projection freshness, terminal parity, checkpoint validity, repeat-green, transport success, alerts, refusals, or human choices as authority evidence. [SOURCE: iterations/iteration-020.md:102-110]
- Node-only completion, preflight-only fences, leases, or wave admission as protected mutation authority. [SOURCE: iterations/iteration-017.md:23-28]
- Post-admission nogood detection, last-write-wins supersession, executable refusal advice, implicit approval, or human choice as direct effect authority. [SOURCE: iterations/iteration-017.md:35-58]
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 7. [SOURCE: iterations/iteration-020.md:26-68]
- Failed pivots: 0
- Audited overrides: 0
- Saturated: P1, P2, P3, P4, P5, P6, P7
- Remaining frontier: executable implementation and measurement evidence only; no document-only research frontier remains. [SOURCE: iterations/iteration-020.md:87-100]
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

No research questions. Implementation must still choose reviewed package/field names, prove P1 termination, implement P2 closure, kill A1-A7 mutants, inventory P4 callers, measure P5 contention, drill P7 recovery, and measure quality/latency/cost deltas. [SOURCE: iterations/iteration-020.md:87-100]
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete. Next work is a separately scoped implementation plan following `P6 → P2 → P3 → P4 → P5 → P1 → P7`, with 036 shadow/parity/rollback gates and no authority change implied by this research. [SOURCE: iterations/iteration-020.md:74-85]
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Orientation seed: `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`.
- Baseline decisions: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`.
- Primary implementation: `specs/system-deep-loop/037-graph-engineering/context/graphene-main`.
- Corpus: all 12 files under `specs/system-deep-loop/037-graph-engineering/context/blog-posts`.
- Runtime targets: coverage-graph, contradiction-supersession, authorized-ledger, locks-and-fencing, and branch-leases-waves.
- Authority: `specs/system-deep-loop/036-deep-loop-innovation`.

## 13. RESEARCH BOUNDARIES

- Maximum iterations: 20.
- Convergence threshold: 0.05, telemetry-only before the cap.
- Per-iteration budget: 12 tool calls, 10 minutes.
- Every finding must be labeled confirm/refine/extend/contradict against repo study 1 and carry an exact source-line marker or an explicit inference marker.
- Only the lineage artifact directory is writable.
