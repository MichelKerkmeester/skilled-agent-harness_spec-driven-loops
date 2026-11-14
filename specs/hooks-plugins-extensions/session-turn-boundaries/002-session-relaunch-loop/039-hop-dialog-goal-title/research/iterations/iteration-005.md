# Iteration 5: packet 038 children 009 to 013, recorded Known Limitations checked against current code

## Focus

Read the `Known Limitations` section of `implementation-summary.md` for children 009 to 013 of packet `038-goal-and-workflow-resume`, then check each recorded limit against the code as it is now. Give each limit a verdict (CONFIRMED, REFUTED or UNCONFIRMED), the deciding `path:line`, how it fails for the operator, whether a later child or packet 039 already closed it, and the smallest change. Also list limits found in those files that the dispatch summary did not name.

The five folders are `009-nudge-note-lines`, `010-fanout-orphan-liveness`, `011-permission-mode-carry`, `012-session-name-carry` and `013-opencode-child-and-title`.

## Actions Taken

1. Read the five `Known Limitations` sections and the child `goal.md`/`spec.md` rows that record the operator decisions.
2. Read the deciding code for each limit: the nudge builders, the note validator in `prepare`, the fan-out liveness probe and ledger writer, the wrapper permission-mode branch, the Claude title tail reader, and the OpenCode plugin child-state branch.
3. Compared each limit against the later children 014 to 017 and packet 039 to separate "still true" from "already closed".
4. Reopened the live evidence for 011 (`scratch/live-checks.md`, AC-001, the packet goal log row) because the summary and the goal contradicted each other.
5. Verified that neither `research/iterations/iteration-005.md` nor `research/deltas/iter-005.jsonl` existed before writing.

## Findings

### 009-nudge-note-lines

1. **009/L1 "No liveness check in `prepare`" — CONFIRMED.** `runningWorkersReason` only checks that the note answers the question: it accepts `none`, or any value holding `pid <digits>`, and returns a refusal otherwise. It never probes a pid. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:421-430] `prepare` calls it through `validatedNote` before the record is written. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:478-481] The receiver, not `prepare`, runs the liveness check: the seed tells it to run `kill -0 <pid>` for each listed worker and collect a live one. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:55-59] The recorded failure is therefore real: a note that says `Running workers: none` while a worker runs is accepted, and the receiver starts the same work again; the manual playbook records that exact live check. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:920] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:936] The second half of the limit, "the descendant walk is a later phase", resolved as **declined**: phase 015 recorded ADR-002, which declines the descendant walk because the worker has left the runtime's process tree, and relies on the note line for work the session started itself. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:36] [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60] [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:70] It fails for the operator as duplicate work: the receiver re-runs the active command beside a live worker, and the two write the same files. **Not closed by a later child or 039.** The smallest change that closes the *named* part is to probe each listed pid with `process.kill(pid, 0)` inside `runningWorkersReason` and warn on `ESRCH`; that catches a stale note, not a worker the note omits. The stated "says none while a worker runs" case needs the unnamed-worker scan, which 015 declined; do not re-propose it as a new change without reopening ADR-002.

2. **009/L2 "A directory a session adds itself is UNCONFIRMED" — UNCONFIRMED.** The hop seed instructs the receiver to re-add each `Added directories:` entry or ask the operator to, naming `/add-dir <path>` on Claude Code. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:61-64] The wrapper replays a launch `--add-dir` because it is a value option, but it reads no `Added directories:` line from the note. [SOURCE: .skilled/bin/skilled-loop:580] [SOURCE: .skilled/bin/skilled-loop:1072] It fails for the operator on an unattended hop: if the seed cannot add the directory itself, the receiver runs without it and tool calls outside the workspace fail. The missing evidence is a live Claude run in which the model, not the operator, invokes `/add-dir`; no such run is recorded in this packet. **Not closed by a later child or 039.** The smallest change that removes the operator is to copy the note's `Added directories:` paths onto the pending record and have the wrapper append `--add-dir <path>` on Claude; otherwise the current prompt is the smallest safe behavior.

3. **009/L3 "The full suite needs `OPENCODE_DB` unset" — CONFIRMED (environment, not a product gap).** The history-lookup test writes its fixture as `opencode.db` [SOURCE: .opencode/plugins/tests/session-history-lookup.test.cjs:54] and runs the printed command with an environment that inherits the ambient `OPENCODE_DB`, so a host exporting `opencode-v1.db` points the lookup at a database the fixture never wrote. [SOURCE: .opencode/plugins/tests/session-history-lookup.test.cjs:135] It fails for the operator as a red full-suite run in a feature outside relaunch; the relaunch suites themselves are unaffected. **Not closed by a later child or 039.** The smallest change is to delete `OPENCODE_DB` from that child environment in the test, a one-line change, or to have the lookup prefer the fixture's `XDG_DATA_HOME` when the named database is absent.

4. **009/L4 "The README and the manual testing playbook keep the old wording" — REFUTED, closed by 017.** The README now carries the `Running workers:`, `Scheduled:` and `Added directories:` lines and the receiver check. [SOURCE: .skilled/hooks/session-relaunch/README.md:120-122] The playbook now names the same checks, including the one that proves `prepare` accepts `none` while a worker runs. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:848] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:920] Phase 017 owns those two documents. No change.

### 010-fanout-orphan-liveness

5. **010/L1 "A reused pid can refuse a run that should start" — CONFIRMED, accepted by the operator.** `isLineageAlive` probes `kill(-pid, 0)` then `kill(pid, 0)` and treats `EPERM` as alive; it never compares the process start time with the ledger row. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:303-321] The durable `spawned` row carries `pid`, `attempt`, `at` and `status`, but no kernel start time. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3936-3948] It fails for the operator when a pid is recycled: a legitimate re-run is refused with exit 3, and the refusal names a pid whose process is not the old worker, so the operator has to investigate a false alarm. The operator already chose "Refusal only" and no override. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/goal.md:101] **Not closed by a later child or 039.** The smallest change is to record the kernel start time (for example `ps -o lstart=` on POSIX) in the `spawned` row and compare it in `isLineageAlive`; it is the process-start-time option the spec lists as out of scope. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/spec.md:106]

6. **010/L2 "A runner killed between spawn and the `spawned` row leaves no pid on disk" — CONFIRMED.** A label with no `spawned` row is never live, and `detectOrphanedLineages` requeues it. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:353-360] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:385-389] The row is appended from the `onSpawn` callback after `spawn()` returns, so one synchronous append is the window. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3936-3948] A re-run calls the orphan marker before spawning. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3536] If the lane process itself died in the window, requeue is correct. If the process that spawned it died after `spawn()` returned, the lane can still be alive with no pid on disk, and the next run requeues a live worker: two writers in one lineage. **Not closed by a later child or 039.** The smallest robust change is a child-written row: pass the ledger path in the lane's environment and have the lane append its own `spawned` row with `process.pid` at boot, so a later run sees a pid even when the parent died in the window.

7. **010/L3 "Windows liveness is a pid-only probe" — CONFIRMED (structural).** The Windows branch probes only the pid. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:318-319] Lineages are detached only when the platform is not Windows. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2115] No Windows run is planned. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/spec.md:109] It fails for a Windows operator as the same recycled-pid false refusal, without the process-group probe that narrows the race on POSIX. **Not closed by a later child or 039.** The smallest change is a Windows start-time check (PowerShell `Get-Process -Id <pid>` and compare `StartTime`), or an explicit "Windows unsupported" statement; the latter is smaller.

### 011-permission-mode-carry

8. **011/L1 "The two live facts are unrecorded" — REFUTED as written; the summary is stale, with one residual unknown.** The orchestrator recorded four live result lines on Claude Code 2.1.323. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14-17] AC-001 is `Met`, not `Unmet`. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/acceptance-criteria.md:56] The packet goal log also records the checks as Done. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/goal.md:84] The implementation summary still says the facts are unrecorded and AC-001 stays Unmet. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md:115] The residual is narrow: bypass alone passed only on a machine whose settings already default to bypass, so the summary's own note keeps the stricter replay rule. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:20-22] It fails for the operator as documentation drift: the packet claims an unmet criterion that is met, which distorts closure reporting. **Not closed by a later child or 039; the same packet closed it after the summary was written.** The smallest change is to update summary rows 1 and the continuity `next_safe_action`; no code change.

9. **011/L2 "The planned baseline moved" — CONFIRMED as history only.** The plan named 158 `session-relaunch-cli` tests and the tree held 162 at build start. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md:116] It has no operator-facing failure and no code consequence. No change.

10. **011/L3 "A live `default` mode is deliberately not mapped" — REFUTED.** The wrapper now accepts `default` in its valid-mode set. [SOURCE: .skilled/bin/skilled-loop:224-231] The hop branch replays any valid mode except `plan`, and except `bypassPermissions` without a launch unlocking flag, so `default` is exported and becomes `--permission-mode default`. [SOURCE: .skilled/bin/skilled-loop:1406-1416] [SOURCE: .skilled/bin/skilled-loop:718] The packet log records the spelling as Done and says the orchestrator added `default` after the builder's fallback rejected it. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/goal.md:85] The summary sentence that says the wrapper treats the default mode as unusable is stale. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md:117] It fails for the operator only as a wrong document. **Closed in the same packet after the live check; not by a later child or 039.** The smallest change is to delete or rewrite that limitation row; no code change.

### 012-session-name-carry

11. **012/L1 "The OpenCode title and Pi live names stay out of this phase" — PARTLY CLOSED; the Pi half is CONFIRMED open.** The OpenCode title is now set from `SKILLED_LOOP_NAME` at the claim seed. [SOURCE: .opencode/plugins/session-relaunch.js:269-278] The Pi half is unchanged: a whole-file search of the Pi adapter finds `name` only in the export-check loop, not in any title or rename path. [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:190-192] It fails for the operator as a Pi hop that keeps the launch stem after a live rename, so the receiver is named from the launch line rather than the latest live name. **Packet 039 does not touch Pi naming; 013 closed only the OpenCode half.** The smallest change is an adapter-level read of the Pi live name in the Pi arm and a `name` stamp on the record, mirroring the Claude arm; this is the adapter change the limit names.

12. **012/L2 "A title older than the 16 MiB tail cap is missed" — CONFIRMED.** The tail reader starts at 256 KiB [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:18] and widens by 4x until `MAX_TAIL_BYTES`, which is 16 MiB. [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:21] [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:113-116] `prepare` then falls back from the missed rename to `SKILLED_LOOP_NAME` and then the generated title. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592] It fails for the operator on a very long session: a `/rename` older than 16 MiB from the end does not reach the receiver, which keeps the launch name or gets a generated title. **Not closed by a later child; 039/002 closed the same null-vs-whole ambiguity only for the goal log, not for the title search.** The smallest change is a reverse scan for the two title searches only: read 1 MiB chunks backwards and stop at the first `custom-title`/`ai-title` entry, bounded by the file size instead of the 16 MiB cap.

### 013-opencode-child-and-title

13. **013/L1 "The live bridged title was proven after the build" — not a limitation; CONFIRMED as recorded.** The summary records the live OpenCode 2.2.7 claim seed renaming a session through the bridged call. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/implementation-summary.md:114] No action.

14. **013/L2 "A child that never reports an end keeps the parent unarmed" — CONFIRMED, accepted as a spec risk.** A tracked child is busy from creation, and busy is cleared only on `session.idle` or `session.deleted`; a parent idle while a busy child exists is deferred. [SOURCE: .opencode/plugins/session-relaunch.js:158-166] [SOURCE: .opencode/plugins/session-relaunch.js:172-176] [SOURCE: .opencode/plugins/session-relaunch.js:364] [SOURCE: .opencode/plugins/session-relaunch.js:404-413] The spec's risk table accepted this. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/spec.md:164] It fails for the operator as a hop that never arms: the child is lost without an end event, the parent idles, the record stays pending, and the session falls through to auto-compaction instead of the fresh session. **Not closed by a later child or 039.** The smallest change is a timestamp on each tracked child and an expiry in `hasBusyChild` (for example, clear a child busy longer than 30 minutes and log `child-busy-stale`), which lets the deferred arm run without changing the normal idle path.

15. **013/L3 "The full plugin suite needs `OPENCODE_DB` cleared" — CONFIRMED (environment), same root cause as 009/L3.** The test writes `opencode.db` [SOURCE: .opencode/plugins/tests/session-history-lookup.test.cjs:54] and inherits the ambient database name in the child environment. [SOURCE: .opencode/plugins/tests/session-history-lookup.test.cjs:135] It fails for the operator as a red plugin-suite run outside relaunch. **Not closed by a later child or 039.** The smallest change is the one-line environment fix in the test.

## Limits Found That the Dispatch Summary Did Not Name

- 009/L3 and 013/L3, the `OPENCODE_DB` environment coupling: confirmed, one-line test fix, no product gap.
- 009/L4, the README and playbook wording: refuted, closed by 017.
- 011/L2, the moved baseline: confirmed historical note only.
- 012/L1, the OpenCode and Pi name split: OpenCode closed by 013, Pi still open.
- 013/L1, the post-build live title proof: a record, not a limitation.

## Ruled Out

- **Re-proposing the descendant walk for 009/L1.** Phase 015 declined it with the operator's answer, and ADR-002 explains why the walk cannot see the worker it was proposed for. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60]
- **Treating the 011 implementation summary as current for the two live facts.** The later live checks, AC-001 and the packet goal log all contradict it. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14-17]
- **A single fix for 009/L3 and 013/L3 in product code.** Both are fixture-environment issues in one test, not a relaunch defect.

## Dead Ends

- No dead end was newly exhausted this iteration. The 009/L1 unnamed-worker direction stays blocked by ADR-002.

## Edge Cases

- **Contradictory evidence:** the 011 `implementation-summary.md` says the live facts are unrecorded and AC-001 is Unmet, while `scratch/live-checks.md`, AC-001 and the packet `goal.md` say the opposite. Recorded both; the live file and the acceptance row prevail because they are the later, executed evidence. The residual is the non-bypass bypass-alone run.
- **Ambiguous input:** 010/L2's "runner" can mean the lane process or the process that spawned it. Both readings are recorded; only the parent-death reading produces duplicate work.
- **Missing dependency:** no runtime session was started, as the operator required, so 009/L2 and the Pi live-name carry remain UNCONFIRMED rather than tested.
- **Partial success:** every recorded limit got a verdict; two limits (011/L1, 011/L3) were refuted as stale prose rather than fixed code.

## Questions Answered

None of the three remaining key questions is fully answered. Key question 3 covers children 001 to 017; this iteration answers only the 009 to 013 subset. The 014 to 017 subset remains for iteration 6.

## Questions Remaining

- Packet 038 limits by child: children 014 to 017 still need the same treatment.
- Packet and parent open ends: the killer test failure, a Codex goal reader, the 002 parent goal budget, phase 033 Draft, and the sk-git `Commit-Id` rebase claim.
- Live proof and ranking: which fixes have no live hop, the smallest live-run set, and the impact-versus-cost ranking.

## Assessment

- New information ratio: 0.71
- Questions addressed: packet 038 limits by child, subset 009 to 013.
- Questions answered: none in full.

## Reflection

- What worked and why: reading the summary and the later children in the same pass separated "still true" from "closed by a later phase" (009/L4, 012/L1 OpenCode). Reading the execution evidence (live checks, acceptance criteria, goal log) beside the summary exposed two stale prose rows in 011 that a code-only pass would have confirmed as limits.
- What did not work and why: the first pass treated the 011 summary as a single source and would have marked L1 and L3 confirmed. Only the cross-check against `goal.md` and `scratch/live-checks.md` showed the summary predates the orchestrator's live run. The 010/L2 window cannot be measured without a live kill; the finding stays structural.
- What I would do differently: for every "unrecorded live fact" limit, check the packet's `goal.md` progress table and `acceptance-criteria.md` before the code, since the orchestrator often closes those after the builder stops.

## Recommended Next Focus

Iteration 6: packet 038 children 014 to 017, reading each `Known Limitations` section and checking it against the current code, with the same verdict/failure/closure/smallest-change shape. Carry forward the 011 stale-summary finding and the Pi live-name open item for the packet-level pass.

## Sources Consulted

- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines/implementation-summary.md:117-120`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/implementation-summary.md:119-121`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md:115-117`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/implementation-summary.md:112-113`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/implementation-summary.md:114-116`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:421-430,478-481,592`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:55-59,61-64`
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs:18,21,113-116`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:303-321,353-360,385-389`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2115,3536,3936-3948`
- `.skilled/bin/skilled-loop:224-231,580,718,1072,1406-1416`
- `.opencode/plugins/session-relaunch.js:158-166,172-176,269-278,364,404-413`
- `.opencode/plugins/tests/session-history-lookup.test.cjs:54,135`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:190-192`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14-17,20-22`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/acceptance-criteria.md:56`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/goal.md:84-85`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/goal.md:101`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/spec.md:106,109`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/spec.md:164`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:36,60,70`
- `.skilled/hooks/session-relaunch/README.md:120-122`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:848,920,936`
