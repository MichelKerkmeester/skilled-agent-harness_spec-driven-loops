# Iteration 005 - IRQ5 Phase 005 Subprocess Reliability at 24-40 Sequential Dispatches

## Focus

IRQ5 stress-tested Phase 005's plan to dispatch 24-40 sequential `opencode run` subprocesses: 12-20 labeled tasks across baseline and after conditions. The phase already names subprocess reliability as high risk and mitigates it with retry logic, a 10-minute timeout, incremental per-task JSONL save, and the 097 `</dev/null` stdin fix (`005-code-graph-adoption-eval/spec.md:48-53`, `005-code-graph-adoption-eval/spec.md:155-168`). This pass asks whether those mitigations are enough for repeated subprocess churn, shared OpenCode state, timeout cleanup, mixed failure records, and smoke-test coverage.

## Actions Taken

- Read Phase 005 spec requirements and edge cases: subprocess dispatch shape (`005-code-graph-adoption-eval/spec.md:84-103`), REQ-006 incremental save (`005-code-graph-adoption-eval/spec.md:125`), REQ-008 timeout (`005-code-graph-adoption-eval/spec.md:127`), REQ-010 retries (`005-code-graph-adoption-eval/spec.md:133`), risk table (`005-code-graph-adoption-eval/spec.md:155-168`), and L2 timeout/DB/metrics edge cases (`005-code-graph-adoption-eval/spec.md:183-191`).
- Read Phase 005 implementation plan and checklist: dispatcher loop writes one result file per task (`005-code-graph-adoption-eval/plan.md:26-35`), smoke test covers one task per condition (`005-code-graph-adoption-eval/plan.md:49-52`), stress entry is separate (`005-code-graph-adoption-eval/plan.md:54-60`), and all dispatcher reliability checklist items remain unchecked (`005-code-graph-adoption-eval/checklist.md:16-21`).
- Read prior pt-02 iteration context: iter 001 and iter 002 already found file-graph state assumptions where specs relied on graph relationships that existing storage did not guarantee (`027-xce-research-based-refinement-pt-02/iterations/iteration-001.md:29-33`, `027-xce-research-based-refinement-pt-02/iterations/iteration-002.md:19-29`); iter 003 says Phase 005 is where Phase 003 heuristics get validated (`027-xce-research-based-refinement-pt-02/iterations/iteration-003.md:30-40`); iter 004 hands off IRQ5 as the next focus (`027-xce-research-based-refinement-pt-02/iterations/iteration-004.md:77-79`).
- Read cli-opencode dispatch rules: provider auth preflight is once per session and cached (`.opencode/skills/cli-opencode/SKILL.md:180-222`), `</dev/null` is mandatory for non-interactive dispatch after the prompt and before file redirects (`.opencode/skills/cli-opencode/SKILL.md:281-292`), and external output must be parsed and validated instead of trusted blindly (`.opencode/skills/cli-opencode/SKILL.md:288-289`).
- Read 097 stdin fix details: the deadlock was a startup stdin read before session creation (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:7-12`, `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:45-59`), verified by a single patched dispatch (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:117-146`), while stale opencode processes were a separate false trail during diagnosis (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:150-159`).
- Read integration patterns section 6: failure symptoms, bad patterns, good patterns, position rule, and canonical timeout automation shape (`.opencode/skills/cli-opencode/references/integration_patterns.md:261-341`).
- Listed `~/.local/share/opencode/log/` names only, per instruction; no log content was read.
- Read system-spec-kit server shutdown behavior as a proxy for subprocess child cleanup requirements: SIGTERM triggers cleanup (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1735-1739`), cleanup closes watchers, vector DB, skill graph DB, and transport under a 5s deadline (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1612-1683`), and watcher startup is optional but real when enabled (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2094-2137`).

## Findings

### f-iter005-001 - BLOCKING - `</dev/null` fixes startup deadlock, not full 40-process lifecycle cleanup

Evidence: Phase 005 requires SIGTERM at 600s and `timeout: true` (`005-code-graph-adoption-eval/spec.md:127`) and repeats the same edge case as "SIGTERM, mark `timeout: true`, continue" (`005-code-graph-adoption-eval/spec.md:186`). The 097 fix specifically addresses `opencode run` reading stdin at startup before session creation (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:9-11`, `.opencode/skills/cli-opencode/references/integration_patterns.md:261-274`); it does not specify child-process close handling, SIGKILL escalation, or zombie reaping after timeout. The system-spec-kit server does have SIGTERM cleanup hooks and closes watchers/DB handles before exit (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1623-1665`, `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1735-1739`), but the orchestrator still needs to wait for the `close` event and escalate if the subprocess tree does not exit.

Verdict: BLOCKING. Amend Phase 005 to require `spawn()` with `stdio: ['ignore', ...]` or equivalent `</dev/null`, a 600s timeout that sends SIGTERM, a short grace period, SIGKILL escalation, and a final `close`/exit-code wait before launching the next task. Record `timeout:true`, `signal`, `exitCode`, and `killed:true` in the result.

### f-iter005-002 - BLOCKING - Provider auth preflight is missing from Phase 005's loop contract

Evidence: cli-opencode requires provider auth preflight once per session, caching the provider list and rerunning only after an auth error (`.opencode/skills/cli-opencode/SKILL.md:180-222`, `.opencode/skills/cli-opencode/SKILL.md:291`). Phase 005 lists dependencies on cli-opencode stability (`005-code-graph-adoption-eval/spec.md:167`) and plans 24-40 subprocess dispatches, but the dispatcher plan starts directly at spawning `opencode run` inside the task loop (`005-code-graph-adoption-eval/plan.md:26-35`) and the spec requirements do not mention auth preflight (`005-code-graph-adoption-eval/spec.md:117-140`).

Verdict: BLOCKING. Add a pre-loop auth step: run `opencode providers list` once, fail fast or ask before the full run if the selected provider is unavailable, and invalidate the cache only when a subprocess returns an auth-shaped error. Do not run login or provider discovery per task.

### f-iter005-003 - BLOCKING - Mixed success/timeout/failure records need a first-class schema before retries ship

Evidence: REQ-003 and REQ-009 require every output JSONL record to have metric fields (`005-code-graph-adoption-eval/spec.md:122`, `005-code-graph-adoption-eval/spec.md:132`), while REQ-008 and REQ-010 require timeout and failed task states (`005-code-graph-adoption-eval/spec.md:127`, `005-code-graph-adoption-eval/spec.md:133`). The L2 edge cases add `error: db_unavailable`, `error: metrics_missing`, and `error: stale_task_set` (`005-code-graph-adoption-eval/spec.md:186-189`), but no schema says whether failed rows carry null metrics, partial metrics, attempts, final error, stdout/stderr paths, or exclusion flags for the paired t-test.

Verdict: BLOCKING. Define a discriminated result schema before implementation: `status: "success" | "timeout" | "failed"`, `attempt`, `maxAttempts`, `condition`, `taskId`, `metrics: null | {...}`, `error: null | {code,message}`, `stdoutPath`, `stderrPath`, `sessionId: null | string`, and `includeInPairedStats: boolean`. The report generator should skip incomplete pairs and count them separately.

### f-iter005-004 - CONFIRMED - Sequential per-task JSONL avoids append races, but filename shape should include condition/attempt

Evidence: The Phase 005 plan loops `for each task x {baseline, after}` (`005-code-graph-adoption-eval/plan.md:29`) and streams results to `eval-runs/<run_id>/<task_id>.jsonl` (`005-code-graph-adoption-eval/plan.md:35`). The spec also says `eval-runs/<run_id>/<task_id>.jsonl` (`005-code-graph-adoption-eval/spec.md:89`) and incremental result saving preserves completed-task results (`005-code-graph-adoption-eval/spec.md:125`). Because the plan is sequential, two tasks should not append simultaneously under the current design.

Verdict: CONFIRMED with amendment. No append race exists if the implementation remains strictly sequential. Still, use `eval-runs/<run_id>/<condition>/<task_id>.jsonl` or include `condition` and `attempt` in every row, because a single `<task_id>.jsonl` file otherwise mixes baseline, after, retry, timeout, and success records.

### f-iter005-005 - BLOCKING - The smoke test cannot surface the 24-40 subprocess reliability risk

Evidence: The test harness scope is a smoke test with one task in each condition (`005-code-graph-adoption-eval/spec.md:100-103`, `005-code-graph-adoption-eval/plan.md:49-52`), while the success criterion for the real harness is at least 12 tasks x 2 runs under 2 hours (`005-code-graph-adoption-eval/spec.md:147`) and the checklist separately asks for the full harness run (`005-code-graph-adoption-eval/checklist.md:33-38`). Phase 005 also names a stress config entry (`005-code-graph-adoption-eval/spec.md:103`, `005-code-graph-adoption-eval/spec.md:134`), but no acceptance criterion pins a non-trivial mocked subprocess count or timeout/retry matrix.

Verdict: BLOCKING for reliability confidence. Keep the 1x2 smoke test, but add a mocked dispatcher stress test that runs at least 12 tasks x 2 conditions without real OpenCode calls, including success, non-timeout failure with two retries, timeout, metrics-missing retry, and final failed records. The real full harness remains manual/stress, but the lifecycle logic must be unit-tested at scale.

### f-iter005-006 - NO-CHANGE-NEEDED - macOS fs-events watcher leakage is a subprocess cleanup concern, not a separate Phase 005 feature

Evidence: system-spec-kit can start file watchers when enabled (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2094-2137`) and closes them during fatal shutdown (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1636-1651`). Phase 005's role is not to modify watcher internals; it only launches bounded OpenCode subprocesses (`005-code-graph-adoption-eval/spec.md:84-103`).

Verdict: NO-CHANGE-NEEDED on watcher implementation. The needed Phase 005 amendment is process-tree cleanup and close-event waiting from f-iter005-001. If SIGTERM is delivered and cleanup completes, watcher handles should close; if a process survives timeout, every resource type can leak.

### f-iter005-007 - CONFIRMED - Shared DB lock risk is low for strictly sequential runs, but timeout survivors can recreate stale-lock symptoms

Evidence: Phase 005 dispatches one process per task and the plan is sequential (`005-code-graph-adoption-eval/spec.md:120`, `005-code-graph-adoption-eval/plan.md:29-35`). The system-spec-kit server checks and forces WAL mode for its SQLite database (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1912-1918`), reducing normal reader/writer contention in that subsystem. But 097's diagnosis explicitly lists stale opencode-ai processes as a prior operational risk encountered during hang investigation (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:150-155`).

Verdict: CONFIRMED with guard. Sequential dispatch should avoid ordinary DB contention, but any timed-out subprocess that remains alive can keep shared OpenCode state locked. Add pre-run stale-process detection, post-timeout process-tree cleanup, and a retry branch for DB lock/readiness errors that waits briefly before retrying.

## Questions Answered

- Does `</dev/null` prevent the 40-invocation problem? It prevents the known startup stdin deadlock for each invocation (`.opencode/skills/cli-opencode/references/integration_patterns.md:261-274`), but it does not prove memory/file-handle cleanup across 40 processes.
- Does a 10-minute timeout cleanly kill and continue? Not as specified. Phase 005 says SIGTERM and continue (`005-code-graph-adoption-eval/spec.md:127`, `005-code-graph-adoption-eval/spec.md:186`), but needs close-event waiting plus SIGKILL escalation.
- Is JSONL append racing likely? No under the current sequential loop (`005-code-graph-adoption-eval/plan.md:29-35`), but output rows/files need condition and attempt identity.
- Does the schema handle mixed success/timeout/failed records? Not yet. The spec names each condition but does not define a discriminated row schema (`005-code-graph-adoption-eval/spec.md:122-133`, `005-code-graph-adoption-eval/spec.md:186-189`).
- Does auth preflight re-auth per subprocess? The cli-opencode contract says preflight once per session and cache the providers list (`.opencode/skills/cli-opencode/SKILL.md:180-222`, `.opencode/skills/cli-opencode/SKILL.md:291`). Phase 005 should run that once before the loop, not per task.
- Will fs-events watchers leak across 40 spawns? They should not if each subprocess receives SIGTERM and exits through cleanup (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1636-1651`, `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1735-1739`). Surviving processes are the actual leak vector.
- Will shared OpenCode DB state recreate stale-lock issues? Normal sequential runs are lower risk, but timeout survivors can recreate stale-process symptoms; 097 saw stale processes during diagnosis even though they were not the stdin root cause (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:150-155`).
- Does the smoke test cover scale reliability? No. It covers only one task per condition (`005-code-graph-adoption-eval/spec.md:100-103`), while the real run is 24+ subprocesses (`005-code-graph-adoption-eval/spec.md:147`).

## Questions Remaining

- What exact process-tree killer should Phase 005 use on macOS: direct child SIGKILL only, process group kill via detached spawn, or a pid-tree helper?
- Should retries apply to `metrics_missing` and `db_unavailable` exactly once as edge cases say (`005-code-graph-adoption-eval/spec.md:187-188`), or inherit REQ-010's generic two retries (`005-code-graph-adoption-eval/spec.md:133`)?
- Should report statistics drop incomplete pairs or impute neutral values? Dropping incomplete pairs is safer, but the report must show failure counts so the result is not silently biased.

## Next Focus

IRQ6 - Cross-phase integration contract: Phase 002 imports Phase 001's `classifyFileRole`; verify whether JSON contract drift surfaces between HLD/LLD generation, trace payloads, and downstream impact/report consumers.
