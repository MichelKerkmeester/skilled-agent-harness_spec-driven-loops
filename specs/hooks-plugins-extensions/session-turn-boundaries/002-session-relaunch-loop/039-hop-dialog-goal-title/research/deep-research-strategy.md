# Deep Research Strategy

## 2. TOPIC
Close the gaps, unknowns and open ends of packets `038-goal-and-workflow-resume` and `039-hop-dialog-goal-title` of the session relaunch loop: find what a Claude `/rename` made in the mobile app writes and whether a hop can carry it, check each recorded known limitation of both packets against the code, name the smallest set of live runs that proves the fixes not yet run live, explain the open packet-level and parent-level items, and name the smallest change for each gap that survives.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Mobile rename: when a Claude session is renamed from the mobile app or another remote client, what is written and where, does a `custom-title` entry reach the local session log that `prepare` reads, why would the name not carry over a hop, and what does a test for it need?
- [x] Packet 039 residual gaps: for each known limitation of children 001, 002 and 003 of packet 039 (a pending record Stop cannot arm, other dialogs that hold a turn open, an unreadable record, the same gap on Pi, OpenCode and Codex, a goal cleared by hand that comes back, a stale parent goal that is picked, a title ending in the hop number, the cost of one more log search), is it real in the code, how does it fail, and what is the smallest change?
- [x] Packet 038 limits by child: for each known limitation recorded by children 001 to 017 of packet 038, is it still true in the code as it is now, how does it fail, and what is the smallest change?
- [x] Packet and parent open ends: what explains the one failure of the test `killer keeps the record armed when the target exits during its grace period`, what would a Codex goal reader need, how can the 002 parent goal bind packets 037, 038 and 039 inside its 4,000-character limit, why does phase 033 say Draft while its nine children say Complete, and does a rebase keep a `Commit-Id` as sk-git's SKILL.md says?
- [x] Live proof and ranking: which fixes of packets 038 and 039 have no live hop behind them, what is the smallest set of live runs that closes them per runtime, and how do the surviving gaps rank by operator impact against cost?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any fix. This run reports findings and names changes only.
- Starting a runtime session, or running the session-relaunch `prepare`, `claim`, `keep`, `cancel` or `complete` commands. Evidence comes from reading code, tests, fixtures, packet docs and local session logs, from each runtime's `--help` output, and from vendor documentation.
- Running a live hop. The run names which live runs are needed. It does not run them.
- Changing the goal of packet 039 or of the 002 parent. A change there is an amendment the operator decides.
- Repeating what `038-goal-and-workflow-resume/research/research.md` already settled. Read it first and build on it.
- Committing or pushing.

---

## 5. STOP CONDITIONS
- Ten iterations run, whatever the convergence telemetry says (stop policy `max-iterations`).
- Every open item in section 12 carries one of: confirmed with the deciding `path:line`, refuted with the deciding `path:line`, or still unconfirmed with the read-only evidence that is missing.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Mobile rename: when a Claude session is renamed from the mobile app or another remote client, what is written and where, does a `custom-title` entry reach the local session log that `prepare` reads, why would the name not carry over a hop, and what does a test for it need?
- Packet 039 residual gaps: for each known limitation of children 001, 002 and 003 of packet 039 (a pending record Stop cannot arm, other dialogs that hold a turn open, an unreadable record, the same gap on Pi, OpenCode and Codex, a goal cleared by hand that comes back, a stale parent goal that is picked, a title ending in the hop number, the cost of one more log search), is it real in the code, how does it fail, and what is the smallest change?
- Packet 038 limits by child: for each known limitation recorded by children 001 to 017 of packet 038, is it still true in the code as it is now, how does it fail, and what is the smallest change?
- Packet and parent open ends: what explains the one failure of the test `killer keeps the record armed when the target exits during its grace period`, what would a Codex goal reader need, how can the 002 parent goal bind packets 037, 038 and 039 inside its 4,000-character limit, why does phase 033 say Draft while its nine children say Complete, and does a rebase keep a `Commit-Id` as sk-git's SKILL.md says?
- Live proof and ranking: which fixes of packets 038 and 039 have no live hop behind them, what is the smallest set of live runs that closes them per runtime, and how do the surviving gaps rank by operator impact against cost?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the arm path and the withdraw path together showed that the recorded limitation conflates two states; the prompt escape exists only for the deferred one. The runtime question-tool table in the ask-surface core gave the Pi/OpenCode/Codex inventory without starting a runtime. (iteration 2)
- reading the resolver, the note writer and the wrapper consume together turned three recorded limitations into one traceable path (log entry → resolve → note field → consume → start prompt). The budget rules in `goal-slice.cjs` explained the leaf-to-parent preference with one line, `budgetApplies`, instead of guessing. (iteration 3)
- reading the four code paths that actually carry the limits (nudge builders, resolver, bind call sites, wrapper reason) turned eight prose summaries into verdicts with deciding lines. Reading the later children's summaries in the same pass separated "still true" from "already closed", which a single-snapshot read would have missed for 004 L1. (iteration 4)
- reading the summary and the later children in the same pass separated "still true" from "closed by a later phase" (009/L4, 012/L1 OpenCode). Reading the execution evidence (live checks, acceptance criteria, goal log) beside the summary exposed two stale prose rows in 011 that a code-only pass would have confirmed as limits. (iteration 5)
- reading the recorded limit, the deciding code and packet 039's children in one pass separated "still true" from "closed elsewhere" (016/L3) and exposed one limit whose coverage reading was wrong (017/L4). Reading the test titles beside the playbook's suite commands turned a suspected coverage hole into a naming gap with a doc-only fix. (iteration 6)
- reading the test, `waitForIdle` and `supervise` together made the 50 ms race visible; a test-only read would have blamed the 013 spawn race again. Reading the goal resolver's Codex branch and the SQLite schema together separated "no reader" from "no goal": the host has the goal, the repo has no packet to read. (iteration 7)
- reading the binding parser next to the budget report turned a vague "add rows" request into exact row shapes and counts. Reading the hook's `HAS_COMMIT_ID` branch next to the 039 log separated a doc defect from a code defect. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the official hooks page is large and was truncated on fetch; grepping the saved output for the specific event names was needed to extract the deciding lines. (iteration 2)
- the first read of the fallback test looked like coverage of the cleared-goal case, but the test stops at the clearing session; only comparing it with the no-entry test exposed the untested second hop. (iteration 3)
- the attempt to time the headline walk failed because the function is not exported; the cost claim stays structural, not measured. (iteration 4)
- the first pass treated the 011 summary as a single source and would have marked L1 and L3 confirmed. Only the cross-check against `goal.md` and `scratch/live-checks.md` showed the summary predates the orchestrator's live run. The 010/L2 window cannot be measured without a live kill; the finding stays structural. (iteration 5)
- the first pass accepted 017/L4 at face value because the playbook has no section named for 013 or 015. Only opening the suite commands showed they run the entire test files, including those cases. The live-only limits (015/L1, 016/L3, 017/L2, 017/L3) cannot be closed by more reading; they need the named runs. (iteration 6)
- the attempt to recover the one-off failure's log failed because the sandbox is removed in `t.after` and no CI log was retained; the cause stays a code-path proof, not an observed reproduction. The goal DB has zero rows, so the reader requirement is schema-based, not sample-based. (iteration 7)
- the recursive validation command could not be run under the research boundary, so the 033 completion claim rests on artifact statuses rather than a fresh `RESULT: PASSED`. The rebase conclusion is a code-path proof, not a reproduction of the original reword. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`~/.claude/history.jsonl` as a title source.** It holds `display`, `pastedContents`, `timestamp`, `project`, `sessionId`; no title field (F4). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`~/.claude/history.jsonl` as a title source.** It holds `display`, `pastedContents`, `timestamp`, `project`, `sessionId`; no title field (F4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`~/.claude/history.jsonl` as a title source.** It holds `display`, `pastedContents`, `timestamp`, `project`, `sessionId`; no title field (F4).

### **`~/.claude/transcripts/ses_*.jsonl` as a title source.** Its entry types are `user`, `assistant`, `tool_use`, `tool_result`; no title field (F4). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`~/.claude/transcripts/ses_*.jsonl` as a title source.** Its entry types are `user`, `assistant`, `tool_use`, `tool_result`; no title field (F4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`~/.claude/transcripts/ses_*.jsonl` as a title source.** Its entry types are `user`, `assistant`, `tool_use`, `tool_result`; no title field (F4).

### **A 037 row that points at a missing `goal.md`.** The binding check compares the target string with the child name and does not test file existence in the shown function [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:250-275]. It would silence `check-goal` without binding a real goal. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A 037 row that points at a missing `goal.md`.** The binding check compares the target string with the child name and does not test file existence in the shown function [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:250-275]. It would silence `check-goal` without binding a real goal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A 037 row that points at a missing `goal.md`.** The binding check compares the target string with the child name and does not test file existence in the shown function [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:250-275]. It would silence `check-goal` without binding a real goal.

### **A Claude PermissionRequest binding as today's smallest fix.** The registry's Claude `eventOrder` cannot render it without a new event entry, and the guard's envelope shape is event-specific [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:9]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A Claude PermissionRequest binding as today's smallest fix.** The registry's Claude `eventOrder` cannot render it without a new event entry, and the guard's envelope shape is event-specific [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:9].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Claude PermissionRequest binding as today's smallest fix.** The registry's Claude `eventOrder` cannot render it without a new event entry, and the guard's envelope shape is event-specific [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:9].

### **A Codex goal reader as the smallest change.** The store has no packet column; a reader cannot produce a `goal_packet`, and the note's `Active goal:` line already carries the objective [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173]. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A Codex goal reader as the smallest change.** The store has no packet column; a reader cannot produce a `goal_packet`, and the note's `Active goal:` line already carries the objective [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Codex goal reader as the smallest change.** The store has no packet column; a reader cannot produce a `goal_packet`, and the note's `Active goal:` line already carries the objective [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173].

### **A new module for the ending latch.** D3 forbids it; the change fits the existing resolver and note write. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A new module for the ending latch.** D3 forbids it; the change fits the existing resolver and note write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new module for the ending latch.** D3 forbids it; the change fits the existing resolver and note write.

### **A relaunch record key as the ending carrier.** It would put the latch beside `goalSwitch` in `preparePending` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:990] and violate D3 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/goal.md:49]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A relaunch record key as the ending carrier.** It would put the latch beside `goalSwitch` in `preparePending` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:990] and violate D3 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/goal.md:49].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A relaunch record key as the ending carrier.** It would put the latch beside `goalSwitch` in `preparePending` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:990] and violate D3 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/goal.md:49].

### **A shared file, shared port, pid collision or cross-test ordering dependence.** Every test gets its own `mkdtemp` sandbox [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:40], its own fake `ps` [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:52] and its own XDG runtime directory. `loopId` is the same test-process pid in every case, but all state paths are sandbox-local. No port is opened. The only shared resource is CPU time. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A shared file, shared port, pid collision or cross-test ordering dependence.** Every test gets its own `mkdtemp` sandbox [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:40], its own fake `ps` [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:52] and its own XDG runtime directory. `loopId` is the same test-process pid in every case, but all state paths are sandbox-local. No port is opened. The only shared resource is CPU time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A shared file, shared port, pid collision or cross-test ordering dependence.** Every test gets its own `mkdtemp` sandbox [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:40], its own fake `ps` [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:52] and its own XDG runtime directory. `loopId` is the same test-process pid in every case, but all state paths are sandbox-local. No port is opened. The only shared resource is CPU time.

### **A single fix for 009/L3 and 013/L3 in product code.** Both are fixture-environment issues in one test, not a relaunch defect. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A single fix for 009/L3 and 013/L3 in product code.** Both are fixture-environment issues in one test, not a relaunch defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A single fix for 009/L3 and 013/L3 in product code.** Both are fixture-environment issues in one test, not a relaunch defect.

### **A single grouped binding row for 037, 038 and 039.** `extractBindingTarget` requires the second cell to be exactly one code-wrapped or bare `child/goal.md` value; a cell with three paths returns `null` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165-174]. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A single grouped binding row for 037, 038 and 039.** `extractBindingTarget` requires the second cell to be exactly one code-wrapped or bare `child/goal.md` value; a cell with three paths returns `null` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165-174].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A single grouped binding row for 037, 038 and 039.** `extractBindingTarget` requires the second cell to be exactly one code-wrapped or bare `child/goal.md` value; a cell with three paths returns `null` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165-174].

### **One live run can prove the late-write removal.** The race may not happen; the deterministic test is the negative control [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:117]. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **One live run can prove the late-write removal.** The race may not happen; the deterministic test is the negative control [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:117].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **One live run can prove the late-write removal.** The race may not happen; the deterministic test is the negative control [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:117].

### **Re-proposing the descendant walk for 009/L1.** Phase 015 declined it with the operator's answer, and ADR-002 explains why the walk cannot see the worker it was proposed for. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Re-proposing the descendant walk for 009/L1.** Phase 015 declined it with the operator's answer, and ADR-002 explains why the walk cannot see the worker it was proposed for. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-proposing the descendant walk for 009/L1.** Phase 015 declined it with the operator's answer, and ADR-002 explains why the walk cannot see the worker it was proposed for. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60]

### **Re-proposing the descendant walk for 015/L3.** ADR-002 declines it with the operator's answer and explains why a worker reparented to pid 1 is out of the walk's reach. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Re-proposing the descendant walk for 015/L3.** ADR-002 declines it with the operator's answer and explains why a worker reparented to pid 1 is out of the walk's reach. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-proposing the descendant walk for 015/L3.** ADR-002 declines it with the operator's answer and explains why a worker reparented to pid 1 is out of the walk's reach. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md:60]

### **Re-running the cron observation before the build.** The build is already complete and the live claim is confirmed; the order cannot be restored retroactively. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Re-running the cron observation before the build.** The build is already complete and the live claim is confirmed; the order cannot be restored retroactively.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the cron observation before the build.** The build is already complete and the live claim is confirmed; the order cannot be restored retroactively.

### **Reading the cleared packet from the clear entry.** A `/goal clear` carries no condition in the parsed entry [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:563], so the latch cannot name the packet from that line alone; a boolean latch or a separately resolved packet is needed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reading the cleared packet from the clear entry.** A `/goal clear` carries no condition in the parsed entry [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:563], so the latch cannot name the packet from that line alone; a boolean latch or a separately resolved packet is needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the cleared packet from the clear entry.** A `/goal clear` carries no condition in the parsed entry [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:563], so the latch cannot name the packet from that line alone; a boolean latch or a separately resolved packet is needed.

### **Reading the store name regardless of `nameSource`.** Rejected as the smallest change: it would carry the auto-generated `derived` title above the launch name and undo the 039/003 ranking [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading the store name regardless of `nameSource`.** Rejected as the smallest change: it would carry the auto-generated `derived` title above the launch name and undo the 039/003 ranking [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the store name regardless of `nameSource`.** Rejected as the smallest change: it would carry the auto-generated `derived` title above the launch name and undo the 039/003 ranking [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592].

### **Reusing the ask-surface guard as the multi-runtime hop guard.** It is a re-prompt mechanism for prose menus, not a refusal for pending hand-overs [SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:4]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reusing the ask-surface guard as the multi-runtime hop guard.** It is a re-prompt mechanism for prose menus, not a refusal for pending hand-overs [SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:4].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reusing the ask-surface guard as the multi-runtime hop guard.** It is a re-prompt mechanism for prose menus, not a refusal for pending hand-overs [SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:4].

### **Stripping only a different number.** The code already keeps a number that does not match the sender's own [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:665]; the loss is the same-number case only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Stripping only a different number.** The code already keeps a number that does not match the sender's own [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:665]; the loss is the same-number case only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stripping only a different number.** The code already keeps a number that does not match the sender's own [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:665]; the loss is the same-number case only.

### **The 013 spawn race as the current cause.** The test now waits for the target's ready line after the handler is installed [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:781], so a target that reported ready cannot be killed before its handler. The old race remains a historical cause, not this one. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The 013 spawn race as the current cause.** The test now waits for the target's ready line after the handler is installed [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:781], so a target that reported ready cannot be killed before its handler. The old race remains a historical cause, not this one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 013 spawn race as the current cause.** The test now waits for the target's ready line after the handler is installed [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:781], so a target that reported ready cannot be killed before its handler. The old race remains a historical cause, not this one.

### **The 16 MiB tail cap as a mobile-specific cause.** It is runtime-agnostic and already recorded by 038/012 (F7). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The 16 MiB tail cap as a mobile-specific cause.** It is runtime-agnostic and already recorded by 038/012 (F7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 16 MiB tail cap as a mobile-specific cause.** It is runtime-agnostic and already recorded by 038/012 (F7).

### **The app continues the same session after a hop.** The vendor says each interactive process registers one remote session, and a hop is a new process [SOURCE: https://code.claude.com/docs/en/remote-control]; the app shows a new session, and the name is the only thing that can continue. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The app continues the same session after a hop.** The vendor says each interactive process registers one remote session, and a hop is a new process [SOURCE: https://code.claude.com/docs/en/remote-control]; the app shows a new session, and the name is the only thing that can continue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The app continues the same session after a hop.** The vendor says each interactive process registers one remote session, and a hop is a new process [SOURCE: https://code.claude.com/docs/en/remote-control]; the app shows a new session, and the name is the only thing that can continue.

### **The mobile rename is version-gated on this machine.** The transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:40]. It remains a cause for older installs. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The mobile rename is version-gated on this machine.** The transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:40]. It remains a cause for older installs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The mobile rename is version-gated on this machine.** The transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:40]. It remains a cause for older installs.

### **The wrapper passes no `--name` on a hop.** It appends `--name "<stem> (<hop+1)>"` whenever the record carries a replayable name [SOURCE: .skilled/bin/skilled-loop:417]; the missing-name case is an empty record or a failed validation, not a missing code path. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The wrapper passes no `--name` on a hop.** It appends `--name "<stem> (<hop+1)>"` whenever the record carries a replayable name [SOURCE: .skilled/bin/skilled-loop:417]; the missing-name case is an empty record or a failed validation, not a missing code path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The wrapper passes no `--name` on a hop.** It appends `--name "<stem> (<hop+1)>"` whenever the record carries a replayable name [SOURCE: .skilled/bin/skilled-loop:417]; the missing-name case is an empty record or a failed validation, not a missing code path.

### **Treating 017/L4 as a test-coverage hole.** The Pi and OpenCode adapter suite commands run the full test files, and those files hold the 013 and 015 cases; only the naming of the cases is missing. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating 017/L4 as a test-coverage hole.** The Pi and OpenCode adapter suite commands run the full test files, and those files hold the 013 and 015 cases; only the naming of the cases is missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating 017/L4 as a test-coverage hole.** The Pi and OpenCode adapter suite commands run the full test files, and those files hold the 013 and 015 cases; only the naming of the cases is missing.

### **Treating the 011 implementation summary as current for the two live facts.** The later live checks, AC-001 and the packet goal log all contradict it. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14-17] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating the 011 implementation summary as current for the two live facts.** The later live checks, AC-001 and the packet goal log all contradict it. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14-17]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the 011 implementation summary as current for the two live facts.** The later live checks, AC-001 and the packet goal log all contradict it. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14-17]

### **Treating the 014 notice repetition as a defect.** The code confirms the recorded intended rate; suppressing later notices would make a long deferral silent. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the 014 notice repetition as a defect.** The code confirms the recorded intended rate; suppressing later notices would make a long deferral silent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the 014 notice repetition as a defect.** The code confirms the recorded intended rate; suppressing later notices would make a long deferral silent.

### **Treating the deferred example as the worst stuck state.** It is the one that a prompt already clears; the missing-transcript, missing-target-pid and arm-failure states are the ones with no prompt escape [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:26]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating the deferred example as the worst stuck state.** It is the one that a prompt already clears; the missing-transcript, missing-target-pid and arm-failure states are the ones with no prompt escape [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:26].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the deferred example as the worst stuck state.** It is the one that a prompt already clears; the missing-transcript, missing-target-pid and arm-failure states are the ones with no prompt escape [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:26].

### **Treating the fresh Commit-Ids as a prepare-commit-msg defect.** The hook mints only when the replayed message lacks an id; the 039 reword did not carry the old trailer [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:285-288]. The defect is the unconditional sentence in the SKILL.md. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating the fresh Commit-Ids as a prepare-commit-msg defect.** The hook mints only when the replayed message lacks an id; the 039 reword did not carry the old trailer [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:285-288]. The defect is the unconditional sentence in the SKILL.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the fresh Commit-Ids as a prepare-commit-msg defect.** The hook mints only when the replayed message lacks an id; the 039 reword did not carry the old trailer [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:285-288]. The defect is the unconditional sentence in the SKILL.md.

### **Version floor.** Ruled out on this machine, where transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor (F5). It remains a cause for older installs. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Version floor.** Ruled out on this machine, where transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor (F5). It remains a cause for older installs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Version floor.** Ruled out on this machine, where transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor (F5). It remains a cause for older installs.

### **Widening the Claude prompt withdrawal to `pending: 'any'`.** It would withdraw a hand-over the same turn just prepared, which the withdrawal policy deliberately refuses [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:21]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Widening the Claude prompt withdrawal to `pending: 'any'`.** It would withdraw a hand-over the same turn just prepared, which the withdrawal policy deliberately refuses [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:21].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Widening the Claude prompt withdrawal to `pending: 'any'`.** It would withdraw a hand-over the same turn just prepared, which the withdrawal policy deliberately refuses [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:21].

### No adapter-level question guard exists for Pi, OpenCode or Codex to extend; each needs a new host hook. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No adapter-level question guard exists for Pi, OpenCode or Codex to extend; each needs a new host hook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No adapter-level question guard exists for Pi, OpenCode or Codex to extend; each needs a new host hook.

### No Claude `PermissionRequest` binding exists anywhere in the repository to copy; the only one is Devin's [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:917]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No Claude `PermissionRequest` binding exists anywhere in the repository to copy; the only one is Devin's [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:917].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Claude `PermissionRequest` binding exists anywhere in the repository to copy; the only one is Devin's [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:917].

### No code path records which number the wrapper wrote into a session's displayed name. The record's `name` is a flat string [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:997], so a strip that needs the source cannot get it without a new key or a wrapper-side comparison. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No code path records which number the wrapper wrote into a session's displayed name. The record's `name` is a flat string [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:997], so a strip that needs the source cannot get it without a new key or a wrapper-side comparison.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No code path records which number the wrapper wrote into a session's displayed name. The record's `name` is a flat string [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:997], so a strip that needs the source cannot get it without a new key or a wrapper-side comparison.

### No dead end was newly exhausted this iteration. The 009/L1 unnamed-worker direction stays blocked by ADR-002. -- BLOCKED (iteration 6, 2 attempts)
- What was tried: No dead end was newly exhausted this iteration. The 009/L1 unnamed-worker direction stays blocked by ADR-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No dead end was newly exhausted this iteration. The 009/L1 unnamed-worker direction stays blocked by ADR-002.

### No newly exhausted research direction. The live-only limits from iterations 5 to 6 (015/L1, 016/L3, 017/L2, 017/L3) stay live-only; the named runs are the next step, not more reading. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No newly exhausted research direction. The live-only limits from iterations 5 to 6 (015/L1, 016/L3, 017/L2, 017/L3) stay live-only; the named runs are the next step, not more reading.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No newly exhausted research direction. The live-only limits from iterations 5 to 6 (015/L1, 016/L3, 017/L2, 017/L3) stay live-only; the named runs are the next step, not more reading.

### No repository code path reads `~/.claude/sessions` for Claude, so there is no existing implementation to build on; the change is new code, not a wiring fix. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No repository code path reads `~/.claude/sessions` for Claude, so there is no existing implementation to build on; the change is new code, not a wiring fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No repository code path reads `~/.claude/sessions` for Claude, so there is no existing implementation to build on; the change is new code, not a wiring fix.

### Reading the goal DB for a packet is a dead end because the schema has no packet column. The only usable value is the objective text and status. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reading the goal DB for a packet is a dead end because the schema has no packet column. The only usable value is the objective text and status.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the goal DB for a packet is a dead end because the schema has no packet column. The only usable value is the objective text and status.

### The exact mobile write cannot be attributed from the local logs: no entry type or field carries the client, as iteration 1 found [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:74]. Run B is the only closure. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The exact mobile write cannot be attributed from the local logs: no entry type or field carries the client, as iteration 1 found [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:74]. Run B is the only closure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The exact mobile write cannot be attributed from the local logs: no entry type or field carries the client, as iteration 1 found [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:74]. Run B is the only closure.

### The local sample cannot distinguish a mobile rename from a CLI rename: no entry type, field or log carries the client. Attribution needs a live run, not more log mining. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The local sample cannot distinguish a mobile rename from a CLI rename: no entry type, field or log carries the client. Attribution needs a live run, not more log mining.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The local sample cannot distinguish a mobile rename from a CLI rename: no entry type, field or log carries the client. Attribution needs a live run, not more log mining.

### The old spawn-race explanation is a dead end for this failure because the ready-line handshake already closes it; retrying it would only reproduce a fixed bug. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The old spawn-race explanation is a dead end for this failure because the ready-line handshake already closes it; retrying it would only reproduce a fixed bug.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The old spawn-race explanation is a dead end for this failure because the ready-line handshake already closes it; retrying it would only reproduce a fixed bug.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Packet 038 limits by child (001 to 017). (iteration 1)
- Live proof and ranking: which fixes lack a live hop, the smallest live-run set, and the impact-versus-cost ranking. (iteration 1)
- Packet 039 residual gaps (children 001, 002 and 003): real or not, how they fail, smallest change. (iteration 1)
- Packet and parent open ends: the killer test failure, a Codex goal reader, the 002 parent goal binding inside 4,000 characters, phase 033 Draft, and the sk-git `Commit-Id` rebase claim. (iteration 1)
- Packet 039 residual gaps (children 002 and 003): a goal cleared by hand that comes back, a stale parent goal that is picked, a title ending in the hop number, the cost of one more log search. (iteration 2)
- Packet and parent open ends: the killer test failure, a Codex goal reader, the 002 parent goal binding inside 4,000 characters, phase 033 Draft, the sk-git `Commit-Id` rebase claim. (iteration 2)
- Packet and parent open ends: what explains the one failure of the test `killer keeps the record armed when the target exits during its grace period`, what would a Codex goal reader need, how can the 002 parent goal bind packets 037, 038 and 039 inside its 4,000-character limit, why does phase 033 say Draft while its nine children say Complete, and does a rebase keep a `Commit-Id` as sk-git's SKILL.md says? (iteration 3)
- Live proof and ranking: which fixes of packets 038 and 039 have no live hop behind them, what is the smallest set of live runs that closes them per runtime, and how do the surviving gaps rank by operator impact against cost? (iteration 3)
- Packet 038 limits by child: for each known limitation recorded by children 001 to 017 of packet 038, is it still true in the code as it is now, how does it fail, and what is the smallest change? (iteration 3)
- Packet 038 limits by child (001 to 017): 009 to 017 remain (planned iterations 5 and 6). (iteration 4)
- Packet and parent open ends (killer test, Codex goal reader, 002 parent goal budget, phase 033, sk-git `Commit-Id`). (iteration 4)
- Live proof and ranking. (iteration 4)
- Packet 038 limits by child: children 014 to 017 still need the same treatment. (iteration 5)
- Packet and parent open ends: the killer test failure, a Codex goal reader, the 002 parent goal budget, phase 033 Draft, and the sk-git `Commit-Id` rebase claim. (iteration 5)
- Live proof and ranking: which fixes have no live hop, the smallest live-run set, and the impact-versus-cost ranking. (iteration 5)
- Packet and parent open ends: how can the 002 parent goal bind packets 037, 038 and 039 inside its 4,000-character limit, why does phase 033 say Draft while its nine children say Complete, and does a rebase keep a `Commit-Id` as sk-git's SKILL.md says? (iteration 7)
- The live evidence remains uncollected: the mobile write side, the app title, the `--name` versus `--remote-control <value>` precedence, the Pi Plan receiver, the OpenCode deferred arm, and the late write. That is the operator's Run A to Run E. (iteration 10)
- Two completion claims still need a normal-boundary command: `validate.sh --strict` for phase 033 and the packet, and the killer test under the suite's parallel load. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Packets 038 and 039 are both Complete and merged into main. Packet 039 has three children: 001 (the Claude PreToolUse guard refuses `AskUserQuestion` while a hand-over is pending), 002 (a sender with no goal hands on the nearest unfinished packet goal), 003 (`prepare` records the generated title as the session name). Packet 038 has seventeen children, 001 to 017.
- Prior research to build on, not repeat: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/research/research.md`.
- Where the recorded limits live: the Known Limitations section of each child's `implementation-summary.md` under both packets, and the log section of both packet `goal.md` files.
- New operator report of 2026-11-13, not reproduced: a Claude `/rename` made in the mobile app does not carry over a hop. Child 012 of packet 038 reads the `custom-title` entry of the session log. Child 003 of packet 039 falls back to the `ai-title` entry.
- The open items this run works through, by plan iteration:
  1. Mobile rename: what the mobile app writes when it renames, whether it reaches the local log at all, and what a test needs.
  2. Packet 039 child 001: a pending record that Stop cannot arm refuses every question until `cancel`. Only `AskUserQuestion` is matched, so a plan approval or a permission prompt may park a hop the same way (inferred). No test covers an unreadable record. Pi, OpenCode and Codex were not examined for the same gap.
  3. Packet 039 children 002 and 003: a goal cleared by hand with unticked criteria comes back two hops later. A stale parent goal with an open criterion can be picked. Would carrying the ending of a goal through the chain close both, and at what cost? A title ending in the hop number loses it (inferred). One more log search per hop, cost unmeasured.
  4. Packet 038 children 001 to 008: 001 the receiver is asked, not forced, and a `/loop` or wakeup ends with the sender. 003 the goal search costs about 1.5 s, a shared headline drops the goal, Codex only gets the reason line. 008 a throwing bind does not reject the event and two switch parsers remain. Children 002 (Pi), 004, 005 and 007 were not run live.
  5. Packet 038 children 009 to 013: 009 no liveness check in `prepare`, a self-added directory unconfirmed. 010 a reused pid, a runner killed before its ledger row, a Windows pid-only probe. 011 two live facts unrecorded, the `default` mode not mapped. 012 a title older than the 16 MiB tail cap is missed. 013 a child that never reports an end keeps the parent unarmed.
  6. Packet 038 children 014 to 017: 014 the notice repeats at every deferred Stop and omits the cron list. 015 three mode and process-walk gaps, Pi mode not run live. 016 ten runs are a count, a sender can fail to hand over under the goal, a goal that forbids other work can suppress the claim. 017 a late write not seen live, and the Pi and OpenCode playbook has no checks for children 013 and 015.
  7. Packet level: the test `killer keeps the record armed when the target exits during its grace period` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`) failed once in a full run and passed after, cause unknown. Codex has no goal reader.
  8. Parent level: the 002 parent `goal.md` lacks binding rows for 037, 038 and 039 and has 7 characters to spare under its 4,000-character limit. Phase 033 says Draft while its nine children say Complete. sk-git's SKILL.md says a rebase keeps a `Commit-Id`, and two replayed commits got fresh ones.
  9. Live proof: no live hop for any of the three 039 fixes, and several 038 children not run live. The smallest set of live runs that closes them.
  10. A cross-check of iterations 1 to 9: reopen the citations, mark each item confirmed, refuted or unconfirmed, and rank the surviving gaps with the smallest change for each.
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `.skilled/hooks/session-relaunch/README.md`, `bin/session-relaunch.cjs`, `lib/relaunch-core.cjs`, `lib/context-usage.cjs`, `lib/goal-handover.cjs`, `lib/hop-history.cjs`, `lib/killer.cjs`, `lib/nudge.cjs`, `lib/withdraw.cjs`, the `claude/`, `codex/`, `opencode/` and `pi/` adapter folders, and `tests/` beside them. `.opencode/plugins/session-relaunch.js`. `.skilled/hooks/goal/`. `.skilled/bin/skilled-loop` and `.skilled/bin/skilled-loop-shell.sh`. `.skilled/skills/sk-git/SKILL.md`. The parent packet `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/` with its `goal.md`, `spec.md` and child `033-research-remediation`.
- Runtime binaries for help output: `claude`, `pi`, `opencode`, `codex`, `cursor-agent`, `devin`. Call the binary, not a shell function of the same name, and only with `--help` or a subcommand's `--help`.
- Constraints and risks: read-only on everything outside this research packet. In an interactive shell `claude` and the other runtime names are functions that start the relaunch wrapper, so use `command <name> --help`. Local session logs under `~/.claude/projects/` hold private conversations: search them for entry types and field names only, and quote no conversation text.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stop policy `max-iterations`)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-13T20:51:10Z
