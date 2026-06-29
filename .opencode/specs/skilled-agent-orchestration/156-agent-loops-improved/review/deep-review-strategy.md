# Deep-Review Strategy

**Target:** loop-systems implementation run (156/002) + /goal plugin (git 2aa5fcff4a..HEAD)
**Type:** files (change-set)
**Dimensions:** correctness, security, traceability, maintainability
**Max iterations:** 20  **Convergence:** 0.05 (severity-weighted)
**Executor:** cli-codex gpt-5.5 xhigh fast

## Scope slices
- **ATOMIC** (4): .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts
- **PLUGIN** (2): .opencode/plugins/mk-goal.js, .opencode/commands/goal.md
- **EXEC** (6): .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs, .opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs, .opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs
- **COVERAGE** (5): .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts, .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts, .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts, .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs, .opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs
- **SCRIPTS** (6): .opencode/skills/deep-loop-runtime/scripts/convergence.cjs, .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs, .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs, .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs, .opencode/skills/deep-loop-runtime/scripts/status.cjs, .opencode/skills/deep-loop-runtime/scripts/upsert.cjs
- **WORKFLOWS** (7): .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs
- **ALL** (30): .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts, .opencode/plugins/mk-goal.js, .opencode/commands/goal.md, .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts, .opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs, .opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs, .opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs, .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts, .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts, .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts, .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs, .opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs, .opencode/skills/deep-loop-runtime/scripts/convergence.cjs, .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs, .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs, .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs, .opencode/skills/deep-loop-runtime/scripts/status.cjs, .opencode/skills/deep-loop-runtime/scripts/upsert.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs, .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs

## Iteration plan
1. [correctness] logic correctness & edge cases — slice ATOMIC
2. [correctness] concurrency races, atomicity, crash-safety (temp+fsync+rename, lock heartbeat/single-flight, partial writes) — slice ATOMIC
3. [correctness] logic correctness & state-machine edge cases — slice PLUGIN
4. [security] input validation, injection sanitization, hex(sessionID) keying, no path traversal in state-dir resolution — slice PLUGIN
5. [correctness] concurrency: worker-pool cap, salvage/merge races, signal propagation — slice SCRIPTS
6. [correctness] logic correctness, default/null handling, env precedence — slice EXEC
7. [correctness] error handling: fail-open vs fail-closed consistency, error taxonomy — slice ATOMIC
8. [correctness] error handling: fail-closed on missing session id, rejected actions, budget exhaustion — slice PLUGIN
9. [maintainability] cross-file API/contract consistency (executor-config <-> fallback-router <-> post-dispatch-validate <-> runtime-capabilities) — slice EXEC
10. [correctness] logic correctness: decay/fuzzy scoring, query edges, jsonl round-state — slice COVERAGE
11. [security] path-traversal & state-dir resolution, command injection in spawned codex/opencode — slice SCRIPTS
12. [correctness] concurrency & crash-safety of per-session goal-state writes (atomic write, queue, restore) — slice PLUGIN
13. [correctness] error handling & resource cleanup (timeouts, aborts, child processes) — slice EXEC
14. [maintainability] API/contract consistency: /goal command <-> mk_goal tools <-> state schema <-> injection — slice PLUGIN
15. [correctness] logic correctness: benchmark/promote/rollback/reduce, accepted-vs-shipped — slice WORKFLOWS
16. [traceability] test adequacy: do atomic-state/loop-lock/sleep/jsonl-repair vitest files exercise crash/race/edge paths, or only happy path? — slice ATOMIC
17. [traceability] test adequacy: does the plugin test suite cover the default-export contract, fail-closed, injection, continuation gates? — slice PLUGIN
18. [security] cross-cutting: secrets/log redaction, world-writable paths, TOCTOU, unsafe deserialization across all — slice ALL
19. [maintainability] standards & comment-hygiene & sk-code:opencode alignment (no ephemeral ids in comments, durable WHY, idiom) — slice ALL
20. [maintainability] integration contract: convergence.cjs <-> upsert.cjs <-> reduce-state, fanout-run <-> fanout-pool <-> fanout-salvage <-> fanout-merge — slice SCRIPTS

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 1
- P1 (Required): 35
- P2 (Suggestions): 21
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
