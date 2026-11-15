# Iteration 7: killer grace-period flake and the Codex goal reader

## Focus

Two packet-level items left open by the 038 and 039 review. First, the test `killer keeps the record armed when the target exits during its grace period` failed once in a full run and passed on retry; find every timing assumption, shared file, shared port, pid assumption or ordering dependence that could make it fail once under load, name the most likely cause with the lines that support it, and name the smallest change. Second, confirm what a Codex goal reader would need: where Codex keeps a session goal, what the reader would read, and whether the smallest change is a reader, a documented limit, or nothing.

## Actions Taken

1. Read the grace-period test and its helpers in `.skilled/hooks/session-relaunch/tests/killer.test.cjs`, then read `waitForIdle`, `recordTimeout`, `supervise` and the lock/ancestry paths in `.skilled/hooks/session-relaunch/lib/killer.cjs`.
2. Read the spawn-race fix that touched the same test (`specs/system-speckit/repo-operations/002-ci-workflow-efficiency/013-killer-test-spawn-race/implementation-summary.md`) to separate the old cause from the residual one.
3. Read `lib/goal-handover.cjs`, the whole `codex/` adapter, `.skilled/hooks/goal/README.md`, `goal-plugin.md`, the session-relaunch README Codex rows, and `resolveGoalPacketResult` in `lib/relaunch-core.cjs`.
4. Ran `command codex --help`, `command codex exec --help` and `command codex resume --help` (stdin redirected to `/dev/null`), and read the local `~/.codex/goals_1.sqlite` schema and row counts with `sqlite3` without printing any objective text.
5. Checked how the full hook suite runs in CI and how the test isolates its sandbox, loop id, lock and process table.

## Findings

### F1. The residual grace-period flake is a 50 ms idle/timeout margin, not the 013 spawn race

The test starts a target whose SIGTERM handler waits 800 ms before `process.exit(0)`, then runs the killer with `idleMs: 400` and `timeoutMs: 450` against a transcript that never changes [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:780] [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:787] [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:788]. `waitForIdle` polls every 100 ms [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:22], but its transcript branch only evaluates the idle condition inside a `while (Date.now() < deadline)` loop [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:180] [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:193]. If a poll is delayed by more than 50 ms, the loop condition fails before the 400 ms idle check is reached, `waitForIdle` returns false, and `supervise` treats the run as a timeout [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:700] [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:701] [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:704]. `recordTimeout` then unarms the record with reason `killer-timeout` [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:634]. The test fails at the signal-file read because no SIGTERM was sent [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:794], or at the armed-status assertion or the log match [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:799] [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:800].

The 013 packet fixed a different race: the old tests waited for `spawn`, which fires before the target installs its SIGTERM handler, so the killer could signal a target that died by the default action and never wrote the signal file. The fix added a ready line and `waitForTargetReady` [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:82], and this test now waits for it [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:781]. That cause is therefore refuted for the current failure; the remaining 50 ms gap is the most likely cause.

The load is real: CI runs every hook `node:test` file in one `node --test "${files[@]}"` invocation [SOURCE: .github/workflows/opencode-plugin-tests.yml:138], and Node runs test files in parallel child processes. The test itself is otherwise well isolated: every test gets its own `mkdtemp` sandbox [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:40], its own fake `ps` [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:52], its own XDG runtime directory, and it opens no port. `loopId` is `String(process.pid)` in every test, but every state path is under that test's sandbox, so there is no cross-test file, lock or pid collision. The shared resource is the host CPU, which is exactly what delays a 100 ms poll past the 50 ms margin.

**Verdict:** the recorded one-off failure is UNCONFIRMED as to its exact log, because the failing run's killer log is not retained. The 50 ms failure path is CONFIRMED in the code. The 013 spawn race is REFUTED as the current cause.

**What would confirm it:** run only `.skilled/hooks/session-relaunch/tests/killer.test.cjs` up to three times under the same parallel load as the hook suite. On a failure, read `relaunch.log` for `killer-timeout` and the record for `disarmed` with `reason: "killer-timeout"`. If the failure instead says `target <pid> exited ... before its SIGTERM handler was ready`, the 013 race is still present; if it says `killer-timeout` with no `SIGTERM` in the signal file, the margin is confirmed. This iteration did not run it; the confirming run is the missing evidence.

**Smallest change:** one line in the test, `timeoutMs: 450` to `timeoutMs: 1000` on `.skilled/hooks/session-relaunch/tests/killer.test.cjs:788`. That preserves the test's intent (idle still fires well before the timeout) and leaves 600 ms of headroom, six times the poll interval. A product-side alternative would be to let `waitForIdle` report idle when the idle condition was met within the deadline but the poll woke after it; that changes `--timeout-ms` from a hard bound to a soft one and is larger than the test fix.

### F2. Codex keeps a per-thread goal but no packet; the smallest change is a documented limit, not a reader

Codex has no repo goal reader, and the code says so deliberately. `resolveGoalPacketResult` returns an empty packet for Codex with the fixed reason `Codex keeps its goal where this hand-over cannot read a packet` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:899]. The function's comment explains why: the store is keyed by thread and holds the objective text and a status, with no packet, so nothing proves which packet the goal named [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:871].

The store is real. I read `~/.codex/goals_1.sqlite` read-only with `sqlite3 .schema`: it defines `thread_goals(thread_id TEXT PRIMARY KEY, goal_id TEXT NOT NULL, objective TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('active','paused','blocked','usage_limited','budget_limited','complete')), token_budget INTEGER, tokens_used INTEGER NOT NULL DEFAULT 0, time_used_seconds INTEGER NOT NULL DEFAULT 0, created_at_ms INTEGER NOT NULL, updated_at_ms INTEGER NOT NULL)` and `thread_goal_continuation_deferrals(thread_id TEXT PRIMARY KEY ...)`. `select count(*) from thread_goals` returned 0 and the deferrals table returned 0, so the README's statement that no populated record has been read is accurate on this machine [SOURCE: .skilled/hooks/session-relaunch/README.md:181].

What a reader would have to read: the `thread_goals` row whose `thread_id` matches the Codex session/thread id (the hook payload's `session_id`, or the rollout filename suffix), taking `objective` when `status` is `active`, with `token_budget` and `tokens_used` available for a budget-aware reader. There is no packet column, so a reader cannot produce a `goal_packet`; it could only copy the objective text into the note's `Active goal:` line or the seed text.

The existing carriers already cover the hop. The hand-over text asks a Codex sender for an `Active goal:` line with the goal or packet path, or `none` [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173], and the seed tells the receiver to use `create_goal` when the note names one [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:293]. The session-relaunch README records the same design: a Codex hop carries no packet, and a manual claim can still carry a packet another runtime wrote [SOURCE: .skilled/hooks/session-relaunch/README.md:196] [SOURCE: .skilled/hooks/session-relaunch/README.md:203]. The goal plugin's Codex row calls Codex a native host goal command, outside its contract [SOURCE: .skilled/hooks/goal/README.md:82] [SOURCE: .skilled/hooks/goal/goal-plugin.md:160]. That is consistent with "no repo reader": the host owns its goal, and the plugin does not bind it.

**Verdict:** CONFIRMED. Codex keeps the goal in `~/.codex/goals_1.sqlite` (`thread_goals`), no repo code reads it, and the no-packet reason is explicit in `resolveGoalPacketResult`. The recorded limitation is not stale; it is accurate and already documented.

**Smallest change:** a documented limit, not a reader. The documentation already covers it; an automated reader is possible but would only fill the note's prose, which the sender is already asked to fill [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173], and it cannot carry a packet. If the operator wants the convenience anyway, the smallest viable reader is a Codex adapter helper that opens the SQLite file read-only for the payload's `session_id`, selects `objective` where `status = 'active'`, and feeds it to `handoffText`/`seedText`; that is a new feature, not a gap fix, and it should stay out of `prepare` because there is no packet to return.

## Ruled Out

- **The 013 spawn race as the current cause.** The test now waits for the target's ready line after the handler is installed [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:781], so a target that reported ready cannot be killed before its handler. The old race remains a historical cause, not this one.
- **A shared file, shared port, pid collision or cross-test ordering dependence.** Every test gets its own `mkdtemp` sandbox [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:40], its own fake `ps` [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:52] and its own XDG runtime directory. `loopId` is the same test-process pid in every case, but all state paths are sandbox-local. No port is opened. The only shared resource is CPU time.
- **A Codex goal reader as the smallest change.** The store has no packet column; a reader cannot produce a `goal_packet`, and the note's `Active goal:` line already carries the objective [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173].

## Dead Ends

- The old spawn-race explanation is a dead end for this failure because the ready-line handshake already closes it; retrying it would only reproduce a fixed bug.
- Reading the goal DB for a packet is a dead end because the schema has no packet column. The only usable value is the objective text and status.

## Edge Cases

- Ambiguous input: none. The two docs use "goal" differently (host goal command versus repo reader); the distinction is stated in F2, not treated as a conflict.
- Contradictory evidence: none. The goal plugin's "native host goal command" row and the session-relaunch "no goal reader" rows are consistent once "reader" is limited to a repo adapter.
- Missing dependency: the failing run's killer log is not retained, so the exact one-off cause cannot be proven; the code path is proven instead.
- Partial success: the Codex DB exists but has no rows, so the schema and reader requirements are confirmed while a populated-record sample is not available.

## Sources Consulted

- `.skilled/hooks/session-relaunch/tests/killer.test.cjs`
- `.skilled/hooks/session-relaunch/lib/killer.cjs`
- `.skilled/hooks/session-relaunch/lib/goal-handover.cjs`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs`
- `.skilled/hooks/session-relaunch/codex/README.md`, `shared.mjs`, `stop-arm.mjs`, `prompt-seed.mjs`, `context-nudge.mjs`
- `.skilled/hooks/session-relaunch/README.md`
- `.skilled/hooks/goal/README.md`, `.skilled/hooks/goal/goal-plugin.md`
- `.codex/hooks.json`
- `.github/workflows/opencode-plugin-tests.yml`
- `specs/system-speckit/repo-operations/002-ci-workflow-efficiency/013-killer-test-spawn-race/implementation-summary.md`
- `~/.codex/goals_1.sqlite` schema and row counts (read-only, objective text not printed)
- `command codex --help`, `command codex exec --help`, `command codex resume --help`

## Questions Answered

None of the strategy key-question bullets is fully answered. This iteration closes two of the five sub-items in "Packet and parent open ends": the killer test failure and the Codex goal reader. The 002 parent goal budget, the 033 Draft status and the sk-git `Commit-Id` rebase claim remain for iteration 8, and the live-proof ranking remains for iteration 9.

## Questions Remaining

- Packet and parent open ends: how can the 002 parent goal bind packets 037, 038 and 039 inside its 4,000-character limit, why does phase 033 say Draft while its nine children say Complete, and does a rebase keep a `Commit-Id` as sk-git's SKILL.md says?
- Live proof and ranking: which fixes of packets 038 and 039 have no live hop behind them, what is the smallest set of live runs that closes them per runtime, and how do the surviving gaps rank by operator impact against cost?

## Assessment

- New information ratio: 0.75
- Questions addressed: the killer test failure (partially, code path confirmed; exact log missing), the Codex goal reader (fully)
- Questions answered: none of the strategy bullets fully; two sub-items of the packet/parent bullet

## Reflection

- What worked and why: reading the test, `waitForIdle` and `supervise` together made the 50 ms race visible; a test-only read would have blamed the 013 spawn race again. Reading the goal resolver's Codex branch and the SQLite schema together separated "no reader" from "no goal": the host has the goal, the repo has no packet to read.
- What did not work and why: the attempt to recover the one-off failure's log failed because the sandbox is removed in `t.after` and no CI log was retained; the cause stays a code-path proof, not an observed reproduction. The goal DB has zero rows, so the reader requirement is schema-based, not sample-based.
- What I would do differently: run the single killer test file under the suite's parallel load before concluding, so the 50 ms margin is reproduced rather than inferred from the code.

## Recommended Next Focus

Iteration 8: the parent-level items. The 002 parent `goal.md` binding rows for packets 037, 038 and 039 under the 4,000-character limit; phase 033's Draft status against its nine Complete children; and the sk-git `Commit-Id` rebase claim.

## SCOPE VIOLATIONS

None.
