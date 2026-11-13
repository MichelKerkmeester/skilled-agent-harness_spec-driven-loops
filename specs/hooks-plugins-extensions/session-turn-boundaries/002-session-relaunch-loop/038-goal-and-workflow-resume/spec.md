---
title: "Feature Specification: Goals and running workflows survive a session hop on every runtime"
description: "A session hop carries the goal and the running command, and names or carries the workers, session name, permission mode and schedules the sender leaves behind."
trigger_phrases:
  - "goal and workflow resume phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Goals and running workflows survive a session hop on every runtime

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/358-handover-goal-resume` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop |
| **Predecessor** | 037-relaunch-test-speed |
| **Successor** | None |
| **Handoff Criteria** | Children 001 to 008 are Complete. Children 009 to 017 are each Complete or closed by a recorded decline, the relaunch, OpenCode plugin, goal hook, Pi and fan-out suites pass, and recursive strict validation prints PASSED for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A review of 2026-11-12, checked by a second reviewer, found that a session hop carries the goal on Claude Code, Pi and OpenCode but loses work around it. No runtime re-enters the command the sender was running: the receiver gets a prose note and continues by hand, so an unattended run or a deep loop comes back as an ordinary session. Codex never carries its goal and says nothing. Cursor and Devin drop a handed-over goal at their next handoff. Pi binds the hop goal into every later session of the same process. With the Claude relaunch switch off, a manual claim starts on the goal and never claims the note. An OpenCode goal continuation can cancel a prepared hop. The printed manual command does not run as typed.

Children 001 to 008 closed those gaps. Live hops and a deep-research run on 2026-11-13 then showed what a hop still drops around the goal. A fan-out lineage or a worker started with `&` outlives the sender, and a re-run can start a second writer beside it. Crons, wakeups and added directories end with the session. The permission mode, a Claude `/rename`, the OpenCode title and the Pi Plan or Build mode revert to the launch values. A deferred Claude hop prints nothing. A Claude receiver under a carried goal claimed its note in two of five live runs. `research/research.md` section 9 ranks fourteen changes, and children 009 to 017 plan every one of them.

### Purpose
After a hop the receiver runs the sender's command again, reads the goal of the phase it works, and every runtime either carries the session goal or prints one line that says why it did not. The receiver also learns which workers, schedules and directories the sender left, starts with the sender's live name and mode where the runtime can replay them, and claims its note under a carried goal.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The handoff note and the claim seed name the active command and the phase goal, and the sender releases a held deep-loop lock.
- The goal resolver keeps a handed-over goal on Cursor and Devin, finds a packet by its headline, and `prepare` prints why a goal was not carried.
- The Pi extension binds a hop goal once per process.
- The Claude start hook delivers a claim with the relaunch switch off.
- The OpenCode goal continuation stays off while a hop is prepared.
- `skilled-loop` is a command in a shell that sources the shim.
- The README and the flags example describe the result.
- Children 009 to 017, planned on 2026-11-13 and built only after the operator's greenlight: the fourteen ranked changes of `research/research.md` section 9, the five gaps of its section 7, its five open questions, the receiver claim under a carried goal, and the documents and harness that follow them.

### Out of Scope
- A Codex goal reader. Codex gets a signal and a prose route only.
- The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder. The verification refuted or rejected them.
- Step state inside the command workflows. The receiver runs the command again and the command's own state detection picks the step.
- The relaunch record format, for children 001 to 008. Children 011, 012 and 015 add the optional keys `permissionMode` and `mode` and read `name` back, with no new module.
- A launch name on Codex, Cursor or Devin, a flag that restores crons, and a launch flag for added directories on OpenCode, Pi or Devin. The research eliminated each.
- Pid reuse protection by process start time in the fan-out liveness check.

### Files to Change
[Summary table of files touched across all phases — for audit trail only; per-phase detail lives in each child's plan.md]

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | 001 | Active command line, lock release step, phase goal step, Codex active goal line |
| `.skilled/commands/speckit/handoff.md` | Modify | 001 | The same note shape and steps for the manual command |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | 001 | Tests that fail before the change |
| `.skilled/hooks/goal/pi/goal-context.ts` | Modify | 002 | One hop bind per process |
| `.skilled/hooks/goal/pi/goal-pi.test.mjs` | Modify | 002 | A second session binds nothing |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | 003 | Inherited packet for Cursor and Devin, headline search, reason for a goal not carried |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | 003 | One stderr reason line, manual text for Cursor and Devin |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | 003 | Resolver cases |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | 003 | `prepare` output cases |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modify | 004 | Claim branch before the switch check |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | 004 | Claim with the switch off |
| `.skilled/hooks/goal/opencode/opencode-goal.js` | Modify | 005 | No continuation while a hop is prepared |
| `.opencode/plugins/opencode-goal.js` | Modify | 005 | The mirrored copy |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modify | 005 | Suppressed, not fired |
| `.skilled/bin/skilled-loop-shell.sh` | Modify | 006 | A `skilled-loop` function |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modify | 006 | The function exists after sourcing |
| `.skilled/hooks/session-relaunch/README.md` | Modify | 007 | Goal carry-over per runtime, the known race, the child goal difference |
| `.skilled/hooks/hook-flags.env.example` | Modify | 007 | The `SESSION_RELAUNCH_GOAL` row |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | 009 | Runner stop before the lock release, the `Running workers:`, `Scheduled:` and `Added directories:` lines, the matching seed steps |
| `.skilled/commands/speckit/handoff.md` | Modify | 009 | The same lines and runner stop in the manual template |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | 009, 011, 012, 015 | `prepare` requires `Running workers:` (009). `consume` prints `permissionMode` (011), `name` (012) and `mode` (015). `prepare` prefers the live Claude title (012) |
| `028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` | Modify | 009 | The harness note gains `Running workers: none` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`, `fanout-run.cjs` | Modify | 010 | A `spawned` ledger row, a liveness read and a refused re-run while a lineage is alive |
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | 011, 014 | The payload's permission mode goes to `arm` (011). A deferral notice and a cron count log line (014) |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | 011, 012, 015 | The armed record keeps `permissionMode` (011) and a Pi `mode` (015). `resolveSessionSettings` carries `name` (012) |
| `.skilled/bin/skilled-loop` | Modify | 011, 012, 015, 016 | Replay of the permission mode (011), the numbered hop name and corrected option comments (012), the Pi mode flag (015), the claim line after the goal slice on the build branch (016) |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify | 012 | `readClaudeSettings` returns the last custom title |
| `.opencode/plugins/session-relaunch.js` | Modify | 013 | A parent does not arm while a child is busy, and the claim seed sets the session title, each only if its live check confirms it |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | 015 | `liveSettings` adds the Plan or Build mode |
| `.skilled/hooks/session-relaunch/lib/goal-handover.cjs` | Modify | 016 | Build branch only: a claim line after the goal slice |
| `.skilled/hooks/session-relaunch/README.md` | Modify | 015, 016, 017 | One sentence each for the Pi mode (015) and the claim line (016), then every shipped or declined change (017) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | 017 | One check per shipped behaviour and a repeatable background-worker hop |
| `028-goal-rebind-live-proof-and-docs/scratch/harness/finish-run.sh`, `test-finish-run.sh` | Modify, Create | 017 | No sandbox session folder is left behind after a late write |
| The test files beside each source above | Modify | 009 to 016 | Each child's `spec.md` names its own test files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-workflow-reentry-seed/ | The note names the active command and the receiver runs it again. The sender releases a deep-loop lock. The receiver reads the phase goal. A Codex sender names its goal in the note | Complete |
| 2 | 002-pi-bind-once/ | The Pi extension binds a hop goal once per process and drops the packet variable afterwards | Complete |
| 3 | 003-goal-resolver-prepare/ | Cursor and Devin keep a handed-over goal, a goal packet is found by a unique headline, `prepare` prints why a goal was not carried and tells Cursor and Devin that nothing ends the session | Complete |
| 4 | 004-claude-start-claim/ | The Claude start hook delivers the claim when the wrapper swapped the prompt, with the relaunch switch off | Complete |
| 5 | 005-opencode-continuation-hop/ | The OpenCode goal continuation does not fire while a relaunch record names the session, and the packet variable is dropped after one bind attempt | Complete |
| 6 | 006-skilled-loop-command/ | `skilled-loop` is a shell function, so the printed manual command runs as typed | Complete |
| 7 | 007-goal-handover-docs/ | The README and the flags example describe the shipped goal carry-over, the known race and the child goal difference | Complete |
| 8 | 008-review-advisories/ | The nine P2 advisories of the deep review are fixed, each with a test that failed first or a contract test | Complete |
| 9 | 009-nudge-note-lines/ | Ranks 1, 3, 12 and the note half of 4. The nudge stops a fan-out runner before the lock release, the note names running workers, scheduled tasks and added directories, `prepare` refuses a note with no `Running workers:` line, and the seed makes the receiver check each pid first | Complete |
| 10 | 010-fanout-orphan-liveness/ | Rank 2. After the double writer is reproduced, each spawn writes its pid to the ledger and a re-run exits 3 while a lineage of the earlier run is alive | Complete |
| 11 | 011-permission-mode-carry/ | Rank 5, Claude only. The Stop payload's permission mode is stamped on the record and replayed as `--permission-mode`, after two live checks on the default spelling and the bypass rule | Complete |
| 12 | 012-session-name-carry/ | Ranks 6, 9 and 11. A Claude `/rename` reaches the record and the receiver, a hop name carries the receiver's number without stacking, and the option comments say which runtimes have no name flag | Complete |
| 13 | 013-opencode-child-and-title/ | Ranks 7 and 10. An event trace and a live title call on OpenCode 2.2.7 decide whether the plugin defers a parent arm under a busy child and sets the session title at the claim seed | Complete |
| 14 | 014-claude-stop-notice-and-crons/ | Rank 8 and the adapter half of rank 4. A deferred Claude hop prints one notice with the task count and the cancel command, the log records the cron count, and one live hop records what happens to crons and the todo list | Complete |
| 15 | 015-pi-mode-and-descendant-walk/ | Ranks 13 and 14. The Pi Plan or Build mode is read from the session branch and replayed on a hop. The descendant walk is declined by a decision record unless the operator asks for it | Complete |
| 16 | 016-receiver-claim-under-goal/ | The receiver claim under a carried goal. Ten live hops under a goal that allows other work decide whether a claim line is appended after the goal slice | Complete |
| 17 | 017-handover-docs-and-harness/ | The README and the Claude playbook describe what children 009 to 016 shipped or declined, and the harness leaves no sandbox session folder behind | Complete |

### Build Order For Children 009 To 017

The greenlight came on 2026-11-13 with the words "max parallel", and the operator chose parallel lanes where no file is shared. Children that share a file run in number order, each from the tree the one before it left. The lanes are 009, 011, 012, 015 and 016 in that order with 014 beside 012 once 011 is done, 010 alone and 013 alone. 017 runs last. These files are changed by more than one child:

- `bin/session-relaunch.cjs`: 009 (`prepare` check), then 011, 012 and 015 (`consume` keys), each in a different function.
- `lib/relaunch-core.cjs`: 011, then 012, then 015.
- `.skilled/bin/skilled-loop`: 011, then 012, then 015, then 016 on its build branch. 012 must not reorder the arguments 011 adds.
- `claude/stop-arm.mjs`: 011, then 014, which finds its anchors by text.
- The session-relaunch README: 015 and 016 each add or rewrite one sentence, because each sentence is an acceptance row of the behaviour it describes. 017 runs last, starts from those sentences and owns every other README line.
- The live hop harness under `028-goal-rebind-live-proof-and-docs/scratch/harness/`: 009 adds one note line to `run-hop.sh`, 016 works on a copy, 017 changes `finish-run.sh` and adds its test.
- The shared test files `session-relaunch-cli.test.cjs`, `relaunch-core.test.cjs`, `claude-adapters.test.cjs`, `skilled-loop-wrapper-launch-arguments.test.cjs`, `skilled-loop-wrapper-claim-goal.test.cjs` and `skilled-loop-wrapper-harness.cjs` follow the same order as their sources.

Every other file is changed by one child. 010 and 013 share no file with any other child.

Each child that rests on an inferred claim opens with the check that confirms it and stops if the check refutes it: the double writer (010), the default mode spelling and the bypass rule (011), the launch name entry (012), the OpenCode event trace and title call (013), crons, the todo list and the Stop notice channel (014), the Pi mode entry and flag (015), ten live goal hops (016) and the late write (017).

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-workflow-reentry-seed | 002-pi-bind-once | Phase 001 is Complete and its suites pass | `validate.sh 001-workflow-reentry-seed --strict` RESULT: PASSED and every row of `001-workflow-reentry-seed/acceptance-criteria.md` is Met |
| 002-pi-bind-once | 003-goal-resolver-prepare | Phase 002 is Complete and its suites pass | `validate.sh 002-pi-bind-once --strict` RESULT: PASSED and every row of `002-pi-bind-once/acceptance-criteria.md` is Met |
| 003-goal-resolver-prepare | 004-claude-start-claim | Phase 003 is Complete and its suites pass | `validate.sh 003-goal-resolver-prepare --strict` RESULT: PASSED and every row of `003-goal-resolver-prepare/acceptance-criteria.md` is Met |
| 004-claude-start-claim | 005-opencode-continuation-hop | Phase 004 is Complete and its suites pass | `validate.sh 004-claude-start-claim --strict` RESULT: PASSED and every row of `004-claude-start-claim/acceptance-criteria.md` is Met |
| 005-opencode-continuation-hop | 006-skilled-loop-command | Phase 005 is Complete and its suites pass | `validate.sh 005-opencode-continuation-hop --strict` RESULT: PASSED and every row of `005-opencode-continuation-hop/acceptance-criteria.md` is Met |
| 006-skilled-loop-command | 007-goal-handover-docs | Phase 006 is Complete and its suites pass | `validate.sh 006-skilled-loop-command --strict` RESULT: PASSED and every row of `006-skilled-loop-command/acceptance-criteria.md` is Met |
| 007-goal-handover-docs | 008-review-advisories | Phase 007 is Complete and the deep review report exists | `validate.sh 007-goal-handover-docs --strict` RESULT: PASSED and `review/review-report.md` is present |
| 008-review-advisories | 009-nudge-note-lines | Phase 008 is Complete and the operator has given the greenlight to build | `validate.sh 008-review-advisories --strict` RESULT: PASSED and the greenlight is quoted in `goal.md` section 4 |
| 009-nudge-note-lines | 010-fanout-orphan-liveness | Phase 009 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 009-nudge-note-lines --strict` RESULT: PASSED and no row of `009-nudge-note-lines/acceptance-criteria.md` is Unmet |
| 010-fanout-orphan-liveness | 011-permission-mode-carry | Phase 010 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 010-fanout-orphan-liveness --strict` RESULT: PASSED and no row of `010-fanout-orphan-liveness/acceptance-criteria.md` is Unmet |
| 011-permission-mode-carry | 012-session-name-carry | Phase 011 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 011-permission-mode-carry --strict` RESULT: PASSED and no row of `011-permission-mode-carry/acceptance-criteria.md` is Unmet |
| 012-session-name-carry | 013-opencode-child-and-title | Phase 012 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 012-session-name-carry --strict` RESULT: PASSED and no row of `012-session-name-carry/acceptance-criteria.md` is Unmet |
| 013-opencode-child-and-title | 014-claude-stop-notice-and-crons | Phase 013 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 013-opencode-child-and-title --strict` RESULT: PASSED and no row of `013-opencode-child-and-title/acceptance-criteria.md` is Unmet |
| 014-claude-stop-notice-and-crons | 015-pi-mode-and-descendant-walk | Phase 014 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 014-claude-stop-notice-and-crons --strict` RESULT: PASSED and no row of `014-claude-stop-notice-and-crons/acceptance-criteria.md` is Unmet |
| 015-pi-mode-and-descendant-walk | 016-receiver-claim-under-goal | Phase 015 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 015-pi-mode-and-descendant-walk --strict` RESULT: PASSED and no row of `015-pi-mode-and-descendant-walk/acceptance-criteria.md` is Unmet |
| 016-receiver-claim-under-goal | 017-handover-docs-and-harness | Phase 016 is Complete or closed by a recorded decline, and its suites pass | `validate.sh 016-receiver-claim-under-goal --strict` RESULT: PASSED and no row of `016-receiver-claim-under-goal/acceptance-criteria.md` is Unmet |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Answered by the operator on 2026-11-13, child 010: a re-run refused because a pid was reused gets no override. The refusal names the label and the pid.
- Answered by the operator on 2026-11-13, child 011: a live `plan` mode is not carried. The receiver starts in the launch mode and the wrapper prints one note (option B).
- Answered by the operator on 2026-11-13, child 015: the decline of the descendant walk is accepted. Child 009's `Running workers:` line is the cover for a worker started with `&`.
- Under research: verify and deepen the hand-over gap report at `scratch/handover-gaps-research-2026-11-13.md`. For each claim about running workers at hand-over, session names across a hop and other state a hop drops, confirm or refute it against the code and each runtime's own help output, close the items it marks UNCONFIRMED and name the smallest change for each confirmed gap.

**Research Context:** a deep-research run covered the topic above on 2026-11-13. `research/research.md` is the canonical source for its findings.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings of the 2026-11-13 deep-research run, abridged from `research/research.md`. Nothing was run against a live runtime, so run-time behaviour is read from code, help output and documentation.

- The gap report holds up: every gap it names is confirmed in the code, with nine wrong or weak citations. None of its nine changes is already shipped.
- Fan-out lineages outlive a hop, and a re-run requeues them while they are alive, because `markOrphanedLineages` has no process check.
- A CLI worker started with `&` is invisible at hand-over: `prepare` sees only a direct shell child, and the note has no line for a running worker.
- Only Claude and Pi take a launch name flag. OpenCode can be titled through the plugin SDK. Codex, Cursor and Devin cannot be named at launch.
- A Claude `/rename` is a `custom-title` transcript entry that `prepare` could read in the scan it already runs.
- Crons and wakeups end with the session, and the Stop payload's `session_crons` field is ignored. Permission mode, Pi mode flags and added directories revert to the launch flags.
- Still unconfirmed, each needing a live runtime or vendor documentation: an OpenCode child busy at parent idle, todo-list persistence, Pi plan-mode state and the OpenCode title call on 2.2.7.
- These changes fall outside this packet's frozen scope. `research/research.md` section 9 ranks fourteen of them.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
