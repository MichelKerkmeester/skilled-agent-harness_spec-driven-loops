# Iteration 1: Running workers at hand-over (report section 2, Q1)

## Focus
Verify every claim and path:line citation in the running-workers section (section 2, Q1) of `scratch/handover-gaps-research-2026-11-13.md`, settle its two UNCONFIRMED items (an OpenCode child alive at parent idle; pid liveness in `markOrphanedLineages`) and its inferred orphan claim. Session names (Q2) and other dropped state (Q3) are deferred to iterations 2 and 3.

## Actions Taken
1. Read the state files and the report (lines 1-81).
2. Read `claude/stop-arm.mjs` 30-45 and 110-140, `claude/subagent-guard.mjs` 65-80, and README lines 120-135, 155-165 and 205-215.
3. Read `.opencode/plugins/session-relaunch.js` 158-164, 236-261, 295-345 and 400-445.
4. Read `lib/killer.cjs` 28 and 790-800, `codex/shared.mjs` 45-65, `bin/session-relaunch.cjs` 268-312 and 518-530, and `lib/nudge.cjs` 160-206.
5. Read `cli-codex/SKILL.md` 209-216, `cli-devin/SKILL.md` 254-261 and `commands/speckit/handoff.md` 129-134.
6. Read the `fanout-run.cjs` cited ranges, then found and read the definition of `markOrphanedLineages` in `fanout-pool.cjs` 284-324.
7. Read `opencode-goal.js` 3030-3042 and 3620-3632 to check whether OpenCode exposes a per-session busy status.

## Findings

### Claude background tasks
1. **CONFIRMED.** Stop defers when `payload.background_tasks` is non-empty. It logs `deferred-background-tasks`, calls `markDeferred` and returns null without arming. [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:119] [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:135] `done()` exits 0 with no output. [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:39] The `deferredAt` stamp is written in the core. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1151] A pending record silences the nudge. [SOURCE: .skilled/hooks/session-relaunch/README.md:132]
2. **CONFIRMED (gap stands).** The deferral path emits nothing to the session or the operator. Its only output is a `relaunch.log` line. [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:123] A task that never drains therefore parks the hop with no visible notice. [INFERENCE: based on stop-arm.mjs:119-135 returning null and done() writing nothing]

### Claude foreground sub-agents
3. **CONFIRMED, with a correction to scope.** The nudge stays silent for a tool call carrying `agent_id`. [SOURCE: .skilled/hooks/session-relaunch/README.md:132] The PreToolUse guard denies the call. [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:73] The report says the guard denies only `prepare` and `claim`. The README lists seven denied commands (`claim`, `complete`, `keep`, `prepare`, `cancel`, `consume`, `hand-over`), with `history` still allowed. [SOURCE: .skilled/hooks/session-relaunch/README.md:211] So the report understates the guard. Its "nothing lost, no fix" verdict stands.

### OpenCode task sessions
4. **CONFIRMED.** Children are recorded from `session.created` and `session.updated` events that carry `info.parentID`. Every later event for them is skipped. [SOURCE: .opencode/plugins/session-relaunch.js:326] [SOURCE: .opencode/plugins/session-relaunch.js:341] The child set is a plain skip set and holds no busy or idle status. [SOURCE: .opencode/plugins/session-relaunch.js:158]
5. **CONFIRMED.** On `session.idle`, the parent arms when `armableRecord` agrees and then spawns the killer. No child or busy check sits on that path. [SOURCE: .opencode/plugins/session-relaunch.js:418] [SOURCE: .opencode/plugins/session-relaunch.js:433] [SOURCE: .opencode/plugins/session-relaunch.js:435]
6. **CITATION PARTLY WRONG.** README:130 does say the OpenCode killer runs without `--transcript` and only waits its idle time. [SOURCE: .skilled/hooks/session-relaunch/README.md:130] The "3 s" figure is not on that line. It comes from `DEFAULT_IDLE_MS = 3000`. [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:28] The OpenCode `spawnKiller` passes only `--loop-id` and `--target-pid`, so the default applies. [SOURCE: .opencode/plugins/session-relaunch.js:241]
7. **STILL UNCONFIRMED: can a child be alive when the parent arms?** No repository code answers it. The relaunch plugin tracks no child status, so a live child would not block the arm. Whether OpenCode's `task` tool can return, and the parent go idle, while a child session still runs is OpenCode runtime behaviour. The missing evidence is OpenCode's task-tool source or an event trace that shows `session.idle` for the parent before the child's own idle. Iteration 2 can try `command opencode --help` for a background-task option. [INFERENCE: based on session-relaunch.js:158-164 and :418-437]
8. **NEW: a cheaper fix mechanism already exists in-repo.** The goal plugin records `session.status` per session and suppresses its continuation while a session is `busy` or `retry`. [SOURCE: .opencode/plugins/opencode-goal.js:3623] [SOURCE: .opencode/plugins/opencode-goal.js:3038] The report's fix ("skip the arm while a tracked child is busy") could reuse that event. The relaunch plugin would store `session.status` for ids in `childSessions` instead of discarding child events at :335-336, and `session.idle` would return early while any child is busy. [INFERENCE: based on opencode-goal.js:3623-3626 and session-relaunch.js:335-341]

### External CLI workers
9. **CONFIRMED.** `prepare` refuses only for a direct child of the runtime pid whose command name is a known shell (`processInfo.ppid === runtimePid` plus `LIVE_SHELL_NAMES`). [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:277] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:280] It runs only inside the loop. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:524] The README says any other child program goes undetected. [SOURCE: .skilled/hooks/session-relaunch/README.md:124]
10. **CONFIRMED.** Both skills prescribe the `&` pattern: `codex exec ... & CODEX_PID=$!` [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:213] and `devin -p -- "$PROMPT" > "$LOG" 2>&1 </dev/null &`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:258] Once the tool shell exits, a worker started with `&` is not a direct child of the runtime. It is not a shell either, so the check at :277-281 cannot see it on two counts. [INFERENCE: based on session-relaunch.cjs:277-281]
11. **CONFIRMED.** The killer sends SIGTERM to one pid, not a process group. [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:796]
12. **CONFIRMED, but the citation is weak.** The Codex adapters have no background-task check: a search of `codex/*.mjs` for "background" matched only a comment. That comment says Codex delivers no background-task completions as prompts. [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:55] The cited line documents the absence; it does not show a missing branch.
13. **CONFIRMED.** The nudge asks only for an `Active command:` line, plus `Active goal:` on Codex. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:183] `handoff.md` mentions "running processes" in prose only, with no required line. [SOURCE: .skilled/commands/speckit/handoff.md:132] The receiver re-runs `Active command:` with no worker check. [SOURCE: .skilled/hooks/session-relaunch/README.md:160]
14. **STILL INFERRED (orphan claim).** No run was observed, so the orphan claim stays an inference, but the code evidence makes it stronger. A `&` worker leaves its tool shell. The killer's single-pid SIGTERM reaches only the runtime. So nothing in the hop path signals the worker, and it keeps running after the runtime exits. [INFERENCE: based on killer.cjs:796 and session-relaunch.cjs:277-281] To confirm: the process table after a hop that left a `sleep`-style `&` child running.

### Fan-out lineages
15. **CONFIRMED.** Lineages spawn with `detached: process.platform !== 'win32'`, so each gets its own process group. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2113] The process-group kill (`process.kill(-child.pid, signal)`) runs only from SIGINT and SIGTERM handlers on the runner. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:348] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:589] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:719]
16. **CONFIRMED as inference.** The killer never signals the runner. Its only target is `options.targetPid`, the runtime. [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:796] Because the lineages are detached, a runtime SIGTERM does not reach their groups. [INFERENCE: based on killer.cjs:796 and fanout-run.cjs:2113]
17. **CONFIRMED.** The nudge tells the session to release the deep-loop lock before `prepare`. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:199] Nothing in that step stops the runner or waits for its lineages.
18. **RESOLVED UNCONFIRMED ITEM: `markOrphanedLineages` does NOT check pid liveness.** It is defined in `fanout-pool.cjs`, not `fanout-run.cjs`. It calls `detectOrphanedLineages`, which builds its list purely from the ledger: a label with a `started` event and no later `completed`, `failed` or `orphan_requeued` counts as orphaned. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:284] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:290] For each one it appends `orphan_requeued` with no process check. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:307] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:314] A lineage that is still running is therefore requeued on a re-run.
19. **CONFIRMED (duplicate writer).** The re-run calls `markOrphanedLineages` before spawning. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3520] The snapshot marks those labels `requeued`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:386] `readStoredLineageSessionId` reuses the stored session id of any non-complete lineage config. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:640] Two processes can then write one lineage directory under one session id. [INFERENCE: based on fanout-pool.cjs:284-324 and fanout-run.cjs:631-646]
20. **NEW: a second smallest fix for fan-out.** The runner already keeps per-lineage liveness with pids: a `lineageProcessLiveness` map, and pid-carrying liveness records in the pool. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3525] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:176] If the `started` ledger event carried the lineage pid, `detectOrphanedLineages` could skip labels whose pid answers `process.kill(pid, 0)`. That would make the re-run safe even when the nudge-step fix (report change 2) is not followed. Whether `started` records already carry a pid is UNCONFIRMED. [INFERENCE: based on fanout-pool.cjs:176-196 and :284-305]

## Ruled Out
- Looking for `markOrphanedLineages` inside `fanout-run.cjs`: it is only imported there, at line 41. The definition is in `fanout-pool.cjs:307`.
- Using repository code to settle the OpenCode child-at-idle question: the behaviour belongs to the OpenCode runtime, not to this repo.

## Dead Ends
- None yet. The OpenCode child-at-idle question moves to runtime help or source, not to more in-repo reads.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: the report says the guard denies "prepare and claim", while README:211 lists seven commands. README is better supported. The report is incomplete rather than wrong in effect.
- Missing dependencies: no OpenCode runtime source or event trace, so finding 7 stays UNCONFIRMED.
- Partial success: no.

## SCOPE VIOLATIONS
- None. `research/research.md` was not updated. `progressiveSynthesis` is true, but this iteration's prompt pack lists only the iteration file and the delta file as allowed write paths.

## Sources Consulted
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs:39, :119-135
- .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:73-74
- .skilled/hooks/session-relaunch/README.md:124, :130, :132, :160, :211
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1151
- .opencode/plugins/session-relaunch.js:158-164, :236-251, :300-341, :418-437
- .opencode/plugins/opencode-goal.js:3038, :3623-3626
- .skilled/hooks/session-relaunch/lib/killer.cjs:28, :796
- .skilled/hooks/session-relaunch/codex/shared.mjs:55
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:270-310, :524
- .skilled/hooks/session-relaunch/lib/nudge.cjs:166-203
- .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:213
- .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:258
- .skilled/commands/speckit/handoff.md:132
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:41, :348-353, :386, :589-593, :631-646, :715-730, :2113, :3520, :3525
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:176-196, :284-324

## Assessment
- New information ratio: 0.75
- Questions addressed: Running workers (Q1).
- Questions answered: none in full. Q1 is answered except the OpenCode child-at-idle item, which needs runtime evidence.

## Questions Answered
- Partly: the running-workers question. Every Q1 citation resolves, with one partly wrong (README:130 for the 3 s figure) and one weak (codex/shared.mjs:55). The pid-liveness item resolves to no liveness check. The orphan claim stays an inference with stronger code support.

## Questions Remaining
- The OpenCode child alive at parent idle: needs OpenCode runtime evidence.
- Whether fan-out `started` ledger events carry a lineage pid (decides the cost of the fix in finding 20).
- Q2 session names, Q3 other dropped state, Q4 report accuracy beyond Q1, and Q5 re-ranking.

## Reflection
- What worked and why: reading every cited range in a few batched shell reads. Each citation got checked against the exact line, which caught the misplaced 3 s figure and the guard's understated scope.
- What did not work and why: OpenCode child timing cannot be settled from this repo because the behaviour lives in the runtime.
- What I would do differently: grep for the definition site of an imported symbol first, rather than assuming it lives in the importing file.

## Recommended Next Focus
Iteration 2: session names (Q2). Run `command <runtime> --help` for claude, pi, opencode, codex, cursor-agent and devin and quote each naming flag. Check `skilled-loop` 495-496, 596-597, 616-617, 631-632, 637-674, 775-787, 940 and 1226-1252, plus `bin/session-relaunch.cjs:560, :641`. Also check `command opencode --help` for any background or async task option, to close finding 7. Fold in whether fan-out `started` ledger records carry a pid (`fanout-pool.cjs` started-event writer).
