# Iteration 4: Prior Context-Optimization Programs

## Focus

Identify prior context-optimization mechanisms and assess what evidence exists for their implementation, outcomes, and limitations.

## Actions Taken

1. Traced archived compaction, session-start, context-preservation, and hookless-bootstrap implementation summaries.
2. Examined the replacement contract for deprecated standalone `/deep:context` and the continuity research behind pointer-first resume and session deduplication.
3. Compared claimed benefits with verification records, deferred work, and later manual/automated gate evidence.

## Findings

1. Compaction recovery used a concrete two-stage mechanism: `PreCompact` precomputed and cached constitutional, triggered, graph, and attention context; `SessionStart(source=compact)` injected it. The implementation bounded the payload to 4,000 tokens, used a five-minute cache TTL, and recorded a two-second latency cap with checked verification items. This is implementation evidence for bounded recovery, not a longitudinal measure of recovery quality. [SOURCE: .opencode/specs/system-speckit/z_archive/024-compact-code-graph/001-precompact-hook/implementation-summary.md:74-93,108-119]
2. Session priming evolved into source-aware routing across `startup`, `resume`, `clear`, and `compact`, with distinct retrieval behavior and pressure-sensitive budgets. Startup and resume were limited to 2,000 tokens, compact to 4,000, and resume directed the model to `memory_context` rather than performing retrieval inside the hook. [SOURCE: .opencode/specs/system-speckit/z_archive/024-compact-code-graph/002-session-start-hook/implementation-summary.md:74-89,103-115]
3. The standalone `/deep:context` loop was deliberately deprecated into a no-write redirect. Its useful capability was retained as bounded, pointer-based snapshots inside `/deep:research` and `/deep:review`, eliminating a separate artifact-producing context loop while preserving focused handoff. [SOURCE: .opencode/specs/system-deep-loop/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts/implementation-summary.md:53-68,81-90]
4. Context-preservation metrics shipped only a partial observability layer: aggregate in-memory lifecycle counters plus a four-factor quality score. SQLite persistence, dashboard integration, response-envelope integration, and final status unification were deferred; legacy heuristics continued to determine the traffic-light status. Recorded verification was mixed at 327 passing and 23 failing tests, so this packet does not establish clean end-to-end outcome evidence. [SOURCE: .opencode/specs/system-speckit/z_archive/024-compact-code-graph/023-context-preservation-metrics/implementation-summary.md:68-85,91-124]
5. Hookless-runtime optimization added a read-only session snapshot, `session_resume(minimal)`, a composite `session_bootstrap`, and bootstrap telemetry. Its packet records TypeScript success and 9,241 passing tests with four failures, but it reports implementation coverage rather than measured token savings or recovery-success change. [SOURCE: .opencode/specs/system-speckit/z_archive/024-compact-code-graph/024-hookless-priming-optimization/implementation-summary.md:65-84,96-113]
6. Thin-continuity research proposed a pointer-first resume path using a small YAML block and fingerprint-based no-op saves. It claimed sub-second or under-100ms happy-path resume and approximately 50% token savings from session deduplication, but these are research/design claims in the cited iteration, not longitudinal production measurements. [SOURCE: .opencode/specs/system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/research/iterations/iteration-005.md:75-107,129-160]
7. Later continuity research explicitly rejected automatic narrative compaction for the current phase. It approved growth instrumentation and complaint/size thresholds while deferring any background summarizer, auto-pruner, or anchor mover, preventing an unmeasured optimization from entering the save path. [SOURCE: .opencode/specs/system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/research/iterations/iteration-040.md:43-58,84-90]
8. Continuity gate evidence shows why acceptance labels require qualification. The handover recorded 10,518 automated tests with 115 failures and 305 manual scenarios of which 281 were `UNAUTOMATABLE`; it later states those regressions were reduced and remediated. The initial gate therefore demonstrated broad execution but weak direct manual observability, while later closure must be evaluated from its own remediation evidence rather than inferred from the initial run. [SOURCE: .opencode/specs/system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/handover.md:52-60]

## Questions Answered

- Q4 answered: prior efforts covered compaction caching/injection, lifecycle-aware priming, bounded context snapshots, in-memory quality metrics, hookless bootstrap, pointer-first continuity, fingerprint deduplication, and deliberately deferred narrative compaction. Outcome evidence is strongest for implementation and bounded tests, weaker for longitudinal quality and token-impact claims.

## Questions Remaining

- Q1-Q2 need final severity and ownership triage.
- Q5 remains open and should map the findings to memory-database teardown preconditions.

## Ruled Out

- Treating a completed implementation summary as proof of longitudinal context-quality improvement.
- Treating projected latency and token savings in research iterations as measured production outcomes.
- Treating broad test execution as release-clean evidence when failures or `UNAUTOMATABLE` scenarios remain.

## Dead Ends

- Raw keyword discovery cannot reconstruct program lineage or distinguish implementation from proposal, verification, or deferral.

## Sources Consulted

- `.opencode/specs/system-speckit/z_archive/024-compact-code-graph/001-precompact-hook/implementation-summary.md`
- `.opencode/specs/system-speckit/z_archive/024-compact-code-graph/002-session-start-hook/implementation-summary.md`
- `.opencode/specs/system-speckit/z_archive/024-compact-code-graph/023-context-preservation-metrics/implementation-summary.md`
- `.opencode/specs/system-speckit/z_archive/024-compact-code-graph/024-hookless-priming-optimization/implementation-summary.md`
- `.opencode/specs/system-deep-loop/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts/implementation-summary.md`
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/research/iterations/iteration-005.md`
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/research/iterations/iteration-040.md`
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates/handover.md`

## Assessment

- New information ratio: 0.90
- Novelty justification: seven mechanism/outcome distinctions are new to this lineage and one finding qualifies later gate evidence rather than merely repeating implementation claims.
- Confidence: high for documented mechanisms and deferrals; medium for effectiveness because several benefits are projections or bounded test evidence rather than longitudinal measurements.

## Reflection

- What worked and why: tracing named packets through implementation summaries, research iterations, and handover evidence separated shipped mechanics from projections and deferred work.
- What did not work and why: packet completion labels alone could not establish production outcome quality.
- What I would do differently: require each optimization packet to publish a baseline, post-change metric, observation window, and failure budget before describing outcome improvement.

## Recommended Next Focus

Map the global drift and context-optimization findings to explicit memory-database teardown preconditions, blockers, preserve-before-delete evidence, and post-teardown verification without performing remediation.
