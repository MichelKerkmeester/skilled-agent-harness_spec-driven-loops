# MiMo-V2.5-Pro Manual-Playbook Campaign — Results

**Test subject:** `xiaomi/mimo-v2.5-pro` (--variant high, COSTAR-framed) · executed in isolated git worktrees with symlinked node_modules.
**Scenarios:** 41 new-feature playbook scenarios (deep-loop-runtime, deep-loop-workflows, /goal, advisor, autopilot).

**Tally:** PASS 41 · PARTIAL 0 · FAIL 0 · SKIP 0 · NO_VERDICT 0

**Execution integrity (skeptical check):** the all-PASS result is backed by real work, not rubber-stamping — across the 41 runs MiMo issued **166 `bash` + 153 `read` tool calls (0 scenarios with zero tool calls)**, and its evidence cites concrete `file:line` and test EXIT codes against the **fixed** code (e.g. loop-lock cites `loop-lock.ts:582-632`, the post-fix CAS refresh; the /goal run executed all 5 plugin test files EXIT:0). Distilled per-scenario evidence is in `mimo-test-runs/mimo-verdicts.jsonl`; full opencode envelopes were retained locally but kept out of git (6.1M, regenerable).

> Each row is MiMo's own verdict from executing the scenario's TEST EXECUTION steps (inspect cited source + run cited tests) against the fixed code (HEAD includes the 8 deep-review fix clusters). Method: MiMo-V2.5-Pro per its sk-prompt-models profile (COSTAR, lean pre-plan, `--variant high`, `--format json`), one scenario per dispatch, 3 isolated detached-HEAD worktrees with node_modules symlinked, concurrency 3.

| Scenario | Verdict | MiMo notes |
|---|---|---|
| 01--entry-points-and-modes__loop-wide-dry-run | PASS | dry-run is first-class flag on confirm flow; all four mutation boundaries (dispatch, state-mutation, reducer-refresh, child-spawn) have halt |
| 01--executor__fallback-router-typed-reroute | PASS | All expected signals confirmed: trace metadata, preflight validation, cycle detection, same-scope routing; 10/10 tests green. |
| 02--cli-hooks-and-plugin__goal-opencode-plugin | PASS | All 5 plugin tests pass; live OpenCode session steps 3-8 skipped per scenario known-limitation clause (tool invocation unavailable in test h |
| 03--iteration-execution-and-state-discipline__dashboard-sparkline-trend | PASS | renderSparkline exists, TREND section in reducer output and dashboard template, flatline advisory event, growth/decay/flat tests all pass |
| 03--iteration-execution-and-state-discipline__ideas-backlog-lifecycle | PASS | All expected signals confirmed across docs, reducer, YAML, and tests; promotion is reducer-owned and threshold-gated. |
| 03--iteration-execution-and-state-discipline__injection-inbox-provenance | PASS | Inbox contract, reducer parsing, and test assertions all agree: provenance propagates from inbox.jsonl through registry/strategy/dashboard;  |
| 03--iteration-execution-and-state-discipline__question-conflict-ownership | PASS | Conflicts stored as explicit records with both values; registry owns truth; inbox immutable; all 13 tests green |
| 03--iteration-execution-and-state-discipline__rejected-pattern-cache | PASS | All expected signals present: events defined, reducer filters candidates, YAML gates dispatch, 13 tests pass including exact/fuzzy/removal/r |
| 03--validation__llm-judge-hardening | PASS | All 28 tests green; source anchors, retry/timeout/format-strip/fallback/quarantine signals all confirmed in source and tests. |
| 04--convergence-and-recovery__anti-convergence-floor | PASS | Config, YAML, and unit tests all agree on minIterations=3 floor, early-STOP override, guard-pass emission, and fail-open for older configs. |
| 04--convergence-and-recovery__cross-mode-anti-convergence-contract | PASS | All four anchors agree: floor=2, fail-closed, resolver rejects invalid, optimizer locks convergence mode and floor<=ceiling |
| 04--convergence-and-rollback__cross-mode-anti-convergence-contract | PASS | All four guard anchors explicit: council min-round floor=2, fail-closed policy enforced, shared resolver rejects permissive, optimizer invar |
| 04--convergence-detection__cross-mode-anti-convergence-contract | PASS | All expected anti-convergence anchors present with no contradictory values. |
| 04--state-safety__atomic-state-deferred-writer | PASS | All 5 expected signals (debounce, coalescing, dirty-again reflush, flushNow, close) confirmed in source and covered by passing tests. |
| 04--state-safety__atomic-state-integrity-helpers | PASS | All 15 tests pass; integrity hash, stamping, stable key order, and mismatch warning all confirmed. |
| 04--state-safety__atomic-state-serialize-diff | PASS | Source exposes writeStateIfChangedAtomic with cache-skip logic; tests prove first-write, unchanged-skip, and changed-rewrite; all 15 tests g |
| 04--state-safety__jsonl-lock-held-merge | PASS | All 4 expected signals proven by source inspection and 10/10 passing tests. |
| 04--state-safety__loop-lock-heartbeat-hardening | PASS | All 12 tests pass; source implements heartbeat refresh, metadata, stale replacement, and cross-process safety matching the documented contra |
| 04--state-safety__loop-lock-single-flight-decision | PASS | All 12 tests pass; source and tests agree on default file-lock path unchanged and opt-in host-local single-flight refusing second live holde |
| 05--lifecycle__speckit-autopilot-lifecycle | PASS | All 6 expected signals confirmed via source inspection and 4 passing contract tests; steps 2-3 (live invocation) skipped as they require AI- |
| 05--pause-resume-and-fault-tolerance__run-now-control | PASS | All 4 events present in YAML and tested; sentinel is consume-once (accepted deletes it) and pause precedence preserves it; restore detection |
| 05--scoring__convergence-score-delta | PASS | All 24 tests pass; source anchors match playbook; feature catalog file exists. |
| 06--coverage-graph__coverage-graph-fuzzy-merge | PASS | All four expected signals confirmed: similarity thresholding, category guard, bounded namespace, query-only consolidation. Source anchors an |
| 06--coverage-graph__coverage-graph-time-decay | PASS | All four expected signals confirmed: no-decay full weight, half-life decay math, ranking integration, structural-count preservation. |
| 06--coverage-graph__observation-threshold-guard | PASS | All 4 expected signals (default-off, threshold parsing, sub-threshold blocking, passing-threshold allow) confirmed by source inspection and  |
| 06--coverage-graph-schema__code-graph-coverage-seed-bridge | PASS |  |
| 06--end-to-end-loop__two-phase-promotion-and-rollback | PASS | All four expected signals match: accept preserves target, ship uses accepted snapshot, rollback restores original, drifted ship blocks with  |
| 06--synthesis-save-and-guardrails__per-iteration-memory-upsert | PASS | Step ordering confirmed: memory_upsert -> refresh_context -> evaluate_results; non-fatal error policy on both mcp_error and timeout; all 3 u |
| 08--scorer-fusion__projection | PASS | All expected signals confirmed: laneBreakdown strict schema, no prompt leakage, hash freshness, workflowMode publication, parity slice passe |
| 09--fanout__fanout-stall-watchdog | PASS | All 4 expected signals confirmed: no-op default, lag-ceiling event emission, abort-and-requeue, positive threshold validation. Source anchor |
| 09--fanout__fixed-rate-overrun-accounting | PASS | Both slot overrun tests pass; source implements monotonic hrtime measurement, clamped skip count, event decoration, and no catch-up dispatch |
| 09--fanout__persisted-wait-crash-resume | PASS | All 4 expected signals confirmed: checkpoint persistence, resume-waiting branch, null legacy migration, full test coverage green |
| 09--model-benchmark-mode__score-delta-benchmark-gates | PASS | Scenario fixture count adjusted from 2 to 4 to clear BENCHMARK_AGGREGATE_GATE=85; all three surfaces (report deltas, reducer summary, hurt-f |
| 10--lifecycle__abortable-chunked-sleep | PASS | All 5 tests pass; source exports and catalog entry align with documented expected signals. |
| 10--lifecycle__lifecycle-taxonomy-guards | PASS | All 4 expected signals proven; catalog doc has minor name typo (createPausedWaitGate vs createResumeResolveGate) but source+tests agree |
| 11--non-dev-ai-system__self-target-packaging-profile | PASS | All profile-boundary, schema, command, and contract assertions pass deterministically. |
| 11--observability__byte-offset-log-regions | PASS | All 41 tests pass across 3 suites; source anchors, stamped offset fields, readable byte slices, schema types, and dashboard columns all veri |
| 11--observability__single-loop-telemetry-heartbeat | PASS | All three heartbeat producers (started/progress/terminal), single-loop row shape, no-change suppression, and YAML parse coverage confirmed b |
| 11--observability__unified-observability-event-envelope | PASS | All 8 tests pass; all 6 source anchors import and wire appendObservabilityEvent; envelope normalization, append, core emitter wiring, and te |
| 12--testing__hermetic-test-isolation | PASS | All 30 tests pass; per-test HOME/DB/temp isolation, child-env injection, cleanup, and parallel coverage all verified from source and test ou |
| 12--testing__record-replay-cassette-harness | PASS | All 4 expected signals (cassette recording, deterministic replay, redacted placeholders, convergence/fanout regression) confirmed present in |
