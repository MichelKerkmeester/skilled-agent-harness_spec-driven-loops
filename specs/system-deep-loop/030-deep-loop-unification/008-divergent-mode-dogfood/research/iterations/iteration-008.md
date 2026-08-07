# Iteration 008

## Focus

Identify the shared-runtime and command-contract tests missing for the four cost/liveness defects established in iteration 005.

## Actions Taken

1. Re-read the externalized state, reducer-owned next focus, iteration-005 evidence, and iteration output contract before inspecting tests. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-state.jsonl:19-32] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:109-139] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-005.md:14-43]
2. Compared fan-out heartbeat, watchdog, retry, and budget implementation paths with their nearest unit and integration tests. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:646-700,1131-1187] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1103-1210,1517-1720]
3. Compared council dimension and parallel-seat behavior with cost-guard and multi-seat test assertions. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:15-21,61-100] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/council/cost-guards.vitest.ts:18-79] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts:18-127]
4. Checked council subprocess tests and command-contract matrices for timeout containment and council-specific contract coverage. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:189-241] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:154-212] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:32-156] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts:20-73] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:11-35]

## Findings

### F-ITER008-001 (P1): Heartbeat and watchdog tests never enable both controls

The watchdog regression test leaves `progressHeartbeatSeconds` disabled, while the heartbeat test leaves `stallWatchdogMs` at its long default. No test runs a silent child with heartbeat cadence shorter than the watchdog threshold and asserts that synthetic parent progress cannot suppress `stall_detected`. This is the exact interaction behind F-ITER005-001: `startLineageProgressHeartbeat` calls `onProgress`, and that callback updates the timestamp consumed by `startLineageStallWatchdog`. A regression test must distinguish child-observed advancement from host timer emission and require a stall outcome despite continuing observability heartbeats. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1131-1187] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1517-1617]

### F-ITER008-002 (P1): Retry and budget tests do not compose cumulative attempts

The budget helper and pre-spawn integration tests cover only one attempt, while retry tests omit `maxCostUnitsPerLineage`. Consequently the suite accepts the current estimate of `iterations * cost_units_per_iteration` even when `maxRetries` permits repeated full-lineage attempts. Missing cases are: cap exactly equal to one attempt with `maxRetries > 0`, a transient failure followed by retry, cumulative estimate or consumed budget crossing the cap before redispatch, and a non-retryable budget rejection in the ledger and summary. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:658-700] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:500-535,1103-1210,1658-1720]

### F-ITER008-003 (P1): Council guard tests validate positivity, not enforceable ceilings

`cost-guards.vitest.ts` rejects zero and malformed values but has no test for excessive positive topics, rounds, seats, or their product. The default upper-bound test only verifies arithmetic. Missing contract tests should define hard maxima, reject each over-limit dimension at normalization/setup, reject a product over the total seat-output cap, and verify the command's `:auto` and `:confirm` setup paths produce the same rejection before dispatch. Without those tests, the manual claim that over-cap configurations are rejected remains unenforced. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:61-100] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/council/cost-guards.vitest.ts:18-54] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:19-23,69-100] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:19-23,76-107]

### F-ITER008-004 (P1): The council dispatch test enshrines unbounded startup and has no concurrency contract

The primary multi-seat test explicitly expects all three seats to start before any seat is released. That proves parallelism but cannot detect an unsafe `Promise.all` burst. There is no configurable concurrency field in the dispatcher contract or council command setup, and no test with width greater than concurrency asserting bounded in-flight seats, eventual ordered results, and continued admission after success or failure. The needed shared-runtime test should measure peak in-flight dispatches; command-contract tests should require the cap to survive both YAML setup modes into executor configuration. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts:18-46] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:85-105]

### F-ITER008-005 (P1): Timeout tests stop at a mocked direct-child kill and council is omitted from command-contract test matrices

The council CLI test supplies `child.kill = vi.fn()` only for a successful close; no test advances the seat timeout, verifies process-group TERM, waits for exit, escalates to KILL, or proves descendants are gone before recording rejection. This leaves F-ITER005-003 wholly uncovered at the real subprocess boundary. The broader command test gap compounds all council defects: `compile-command-contracts.cjs` defines `deep/ai-council`, but both compile and render tests type and iterate only `deep/review` and `deep/research`. Council setup fields, timeout controls, cost caps, and generated command rendering can therefore drift without either command-contract suite failing. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:200-241] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:154-212] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:32-156] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts:20-73] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:11-35]

## Questions Answered

- **Which tests are missing for synthetic heartbeat liveness?** One interaction test with both heartbeat and watchdog enabled must prove parent-generated observability cannot count as child progress.
- **Which tests are missing for retry-aware cost containment?** Budget tests must compose `maxRetries` with per-attempt cost and stop redispatch when cumulative approved or consumed cost crosses the cap.
- **Which tests are missing for council dimensions and concurrency?** Hard-ceiling normalization, product-cap, bounded in-flight dispatch, and auto/confirm command propagation tests are absent.
- **Which tests are missing for timeout containment?** A real process-tree fixture must prove TERM-to-KILL escalation and descendant reaping before failure persistence.
- **Why have council contract gaps survived?** The compiler supports `deep/ai-council`, but the compile/render command-contract test matrices exclude it.

## Questions Remaining

- How do deep-improvement candidate prompts and reducer boundaries compare with the review and council failure patterns?
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?
- Are review prompt/validator schema mismatches covered outside skill-local tests?
- Which operator-facing defaults should become hard safety limits versus explicit opt-in overrides?

## Ruled-Out Directions

- Treating separate heartbeat-only and watchdog-only tests as interaction coverage is ruled out: neither test exercises the callback/timestamp coupling that masks a silent child. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1517-1617]
- Treating council upper-bound arithmetic as cap enforcement coverage is ruled out: the tests assert computed totals and invalid non-positive values, not rejection of excessive positive configurations. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/council/cost-guards.vitest.ts:18-54]
- Requiring council to adopt research/review delta-file schemas was not revisited because strategy marks that direction exhausted. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:77-90]

## Next Focus

Compare deep-improvement candidate dispatch, timeout/cost controls, and reducer boundaries with the failure patterns already established for research, review, and council.

## Assessment

- `newInfoRatio`: 0.82
- Novelty: The iteration maps each of four prior behavioral defects to a specific missing interaction or boundary test and adds a cross-cutting discovery that council is absent from command-contract test matrices despite compiler support.
- Confidence: High for test absence and current behavior based on direct implementation/test comparisons; the exact future hard-cap values remain a product-policy decision.

## SCOPE VIOLATIONS

None. No researched runtime, command, skill, agent, or test file was modified.
