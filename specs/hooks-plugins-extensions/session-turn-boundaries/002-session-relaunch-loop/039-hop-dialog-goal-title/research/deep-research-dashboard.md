---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Close the gaps, unknowns and open ends of packets 038-goal-and-workflow-resume and 039-hop-dialog-goal-title of the session relaunch loop: find what a Claude /rename made in the mobile app writes and whether a hop can carry it, check each recorded known limitation of both packets against the code, name the smallest set of live runs that proves the fixes not yet run live, explain the open packet-level and parent-level items, and name the smallest change for each gap that survives
- Started: 2026-11-13T20:51:10Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 2026-11-13T20:51:10Z
- Parent Session: 2026-11-13T20:51:10Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Iteration 1: the mobile rename -- what a Claude mobile /rename writes, whether a custom-title entry reaches the log prepare reads, why the name is lost on a hop, and what a test or live check needs | - | 0.82 | 0 | complete |
| 2 | Iteration 2: packet 039 child 001, the question dialog after prepare: Stop states that cannot arm, other hold-open Claude dialogs, unreadable or malformed records, and the Pi, OpenCode and Codex question tools | - | 0.83 | 14 | complete |
| 3 | Iteration 3: packet 039 children 002 and 003: the cleared-goal fallback, the lineage parent pick, the title hop-number strip and the added log-search cost | goal-fallback-and-title | 0.73 | 13 | complete |
| 4 | Iteration 4: packet 038 children 001 to 008, recorded Known Limitations checked against current code | - | 0.73 | 19 | complete |
| 5 | Iteration 5: packet 038 children 009 to 013, recorded Known Limitations checked against current code | - | 0.71 | 15 | complete |
| 6 | Iteration 6: packet 038 children 014 to 017, recorded Known Limitations checked against current code | packet-038-limitations | 0.70 | 15 | complete |
| 7 | Iteration 7: killer grace-period test flake and the Codex goal reader | packet-open-ends | 0.75 | 2 | complete |
| 8 | Iteration 8: the 002 parent goal binding budget, phase 033 status, and the sk-git Commit-Id rebase claim | - | 0.85 | 3 | complete |
| 9 | Iteration 9: the second reading of the operator report (the app's view of a hop) and the smallest live-run set | - | 0.85 | 12 | complete |
| 10 | Iteration 10: cross-check and ranking. Reopened the ten load-bearing citations, corrected eight drifted anchors, gave every section 12 open item a final verdict, ranked the confirmed gaps, grouped them into six work packages and named what is not worth building. | - | 0.60 | 14 | complete |

- iterationsCompleted: 10
- keyFindings: 168
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Mobile rename: when a Claude session is renamed from the mobile app or another remote client, what is written and where, does a `custom-title` entry reach the local session log that `prepare` reads, why would the name not carry over a hop, and what does a test for it need?
- [x] Packet 039 residual gaps: for each known limitation of children 001, 002 and 003 of packet 039 (a pending record Stop cannot arm, other dialogs that hold a turn open, an unreadable record, the same gap on Pi, OpenCode and Codex, a goal cleared by hand that comes back, a stale parent goal that is picked, a title ending in the hop number, the cost of one more log search), is it real in the code, how does it fail, and what is the smallest change?
- [x] Packet 038 limits by child: for each known limitation recorded by children 001 to 017 of packet 038, is it still true in the code as it is now, how does it fail, and what is the smallest change?
- [x] Packet and parent open ends: what explains the one failure of the test `killer keeps the record armed when the target exits during its grace period`, what would a Codex goal reader need, how can the 002 parent goal bind packets 037, 038 and 039 inside its 4,000-character limit, why does phase 033 say Draft while its nine children say Complete, and does a rebase keep a `Commit-Id` as sk-git's SKILL.md says?
- [x] Live proof and ranking: which fixes of packets 038 and 039 have no live hop behind them, what is the smallest set of live runs that closes them per runtime, and how do the surviving gaps rank by operator impact against cost?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇▇▆▅▅▅▄▄▄▄▄▅▆▇███▄▁
- score sparkline: ▇▇▇▆▅▅▅▄▄▄▄▄▅▆▇███▄▁
- Last 3 ratios: 0.85 -> 0.85 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":99,"code.claude.com":3,"docs.claude.com":1,"other":122}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **`~/.claude/history.jsonl` as a title source.** It holds `display`, `pastedContents`, `timestamp`, `project`, `sessionId`; no title field (F4). (iteration 1)
- **`~/.claude/transcripts/ses_*.jsonl` as a title source.** Its entry types are `user`, `assistant`, `tool_use`, `tool_result`; no title field (F4). (iteration 1)
- **Reading the store name regardless of `nameSource`.** Rejected as the smallest change: it would carry the auto-generated `derived` title above the launch name and undo the 039/003 ranking [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592]. (iteration 1)
- **The 16 MiB tail cap as a mobile-specific cause.** It is runtime-agnostic and already recorded by 038/012 (F7). (iteration 1)
- **Version floor.** Ruled out on this machine, where transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor (F5). It remains a cause for older installs. (iteration 1)
- No repository code path reads `~/.claude/sessions` for Claude, so there is no existing implementation to build on; the change is new code, not a wiring fix. (iteration 1)
- The local sample cannot distinguish a mobile rename from a CLI rename: no entry type, field or log carries the client. Attribution needs a live run, not more log mining. (iteration 1)
- **A Claude PermissionRequest binding as today's smallest fix.** The registry's Claude `eventOrder` cannot render it without a new event entry, and the guard's envelope shape is event-specific [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:9]. (iteration 2)
- **Reusing the ask-surface guard as the multi-runtime hop guard.** It is a re-prompt mechanism for prose menus, not a refusal for pending hand-overs [SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:4]. (iteration 2)
- **Treating the deferred example as the worst stuck state.** It is the one that a prompt already clears; the missing-transcript, missing-target-pid and arm-failure states are the ones with no prompt escape [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:26]. (iteration 2)
- **Widening the Claude prompt withdrawal to `pending: 'any'`.** It would withdraw a hand-over the same turn just prepared, which the withdrawal policy deliberately refuses [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:21]. (iteration 2)
- No adapter-level question guard exists for Pi, OpenCode or Codex to extend; each needs a new host hook. (iteration 2)
- No Claude `PermissionRequest` binding exists anywhere in the repository to copy; the only one is Devin's [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:917]. (iteration 2)
- **A new module for the ending latch.** D3 forbids it; the change fits the existing resolver and note write. (iteration 3)
- **A relaunch record key as the ending carrier.** It would put the latch beside `goalSwitch` in `preparePending` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:990] and violate D3 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/goal.md:49]. (iteration 3)
- **Reading the cleared packet from the clear entry.** A `/goal clear` carries no condition in the parsed entry [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:563], so the latch cannot name the packet from that line alone; a boolean latch or a separately resolved packet is needed. (iteration 3)
- **Stripping only a different number.** The code already keeps a number that does not match the sender's own [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:665]; the loss is the same-number case only. (iteration 3)
- No code path records which number the wrapper wrote into a session's displayed name. The record's `name` is a flat string [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:997], so a strip that needs the source cannot get it without a new key or a wrapper-side comparison. (iteration 3)
- **A single fix for 009/L3 and 013/L3 in product code.** Both are fixture-environment issues in one test, not a relaunch defect. (iteration 5)
- **Re-proposing the descendant walk for 009/L1.** Phase 015 declined it with the operator's answer, and ADR-002 explains why the walk cannot see the worker it was proposed for. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60] (iteration 5)
- **Treating the 011 implementation summary as current for the two live facts.** The later live checks, AC-001 and the packet goal log all contradict it. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14-17] (iteration 5)
- No dead end was newly exhausted this iteration. The 009/L1 unnamed-worker direction stays blocked by ADR-002. (iteration 5)
- **Re-proposing the descendant walk for 015/L3.** ADR-002 declines it with the operator's answer and explains why a worker reparented to pid 1 is out of the walk's reach. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60] (iteration 6)
- **Re-running the cron observation before the build.** The build is already complete and the live claim is confirmed; the order cannot be restored retroactively. (iteration 6)
- **Treating 017/L4 as a test-coverage hole.** The Pi and OpenCode adapter suite commands run the full test files, and those files hold the 013 and 015 cases; only the naming of the cases is missing. (iteration 6)
- **Treating the 014 notice repetition as a defect.** The code confirms the recorded intended rate; suppressing later notices would make a long deferral silent. (iteration 6)
- **A Codex goal reader as the smallest change.** The store has no packet column; a reader cannot produce a `goal_packet`, and the note's `Active goal:` line already carries the objective [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173]. (iteration 7)
- **A shared file, shared port, pid collision or cross-test ordering dependence.** Every test gets its own `mkdtemp` sandbox [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:40], its own fake `ps` [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:52] and its own XDG runtime directory. `loopId` is the same test-process pid in every case, but all state paths are sandbox-local. No port is opened. The only shared resource is CPU time. (iteration 7)
- **The 013 spawn race as the current cause.** The test now waits for the target's ready line after the handler is installed [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:781], so a target that reported ready cannot be killed before its handler. The old race remains a historical cause, not this one. (iteration 7)
- Reading the goal DB for a packet is a dead end because the schema has no packet column. The only usable value is the objective text and status. (iteration 7)
- The old spawn-race explanation is a dead end for this failure because the ready-line handshake already closes it; retrying it would only reproduce a fixed bug. (iteration 7)
- **A 037 row that points at a missing `goal.md`.** The binding check compares the target string with the child name and does not test file existence in the shown function [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:250-275]. It would silence `check-goal` without binding a real goal. (iteration 8)
- **A single grouped binding row for 037, 038 and 039.** `extractBindingTarget` requires the second cell to be exactly one code-wrapped or bare `child/goal.md` value; a cell with three paths returns `null` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165-174]. (iteration 8)
- **Treating the fresh Commit-Ids as a prepare-commit-msg defect.** The hook mints only when the replayed message lacks an id; the 039 reword did not carry the old trailer [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:285-288]. The defect is the unconditional sentence in the SKILL.md. (iteration 8)
- **One live run can prove the late-write removal.** The race may not happen; the deterministic test is the negative control [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:117]. (iteration 9)
- **The app continues the same session after a hop.** The vendor says each interactive process registers one remote session, and a hop is a new process [SOURCE: https://code.claude.com/docs/en/remote-control]; the app shows a new session, and the name is the only thing that can continue. (iteration 9)
- **The mobile rename is version-gated on this machine.** The transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:40]. It remains a cause for older installs. (iteration 9)
- **The wrapper passes no `--name` on a hop.** It appends `--name "<stem> (<hop+1)>"` whenever the record carries a replayable name [SOURCE: .skilled/bin/skilled-loop:417]; the missing-name case is an empty record or a failed validation, not a missing code path. (iteration 9)
- No newly exhausted research direction. The live-only limits from iterations 5 to 6 (015/L1, 016/L3, 017/L2, 017/L3) stay live-only; the named runs are the next step, not more reading. (iteration 9)
- The exact mobile write cannot be attributed from the local logs: no entry type or field carries the client, as iteration 1 found [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:74]. Run B is the only closure. (iteration 9)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
