---
title: "Feature Specification: Goals and running workflows survive a session hop on every runtime"
description: "[One-line description]"
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
| **Handoff Criteria** | All eight children Complete, the relaunch, OpenCode plugin, goal hook and Pi suites pass, and recursive strict validation prints PASSED for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A review of 2026-11-12, checked by a second reviewer, found that a session hop carries the goal on Claude Code, Pi and OpenCode but loses work around it. No runtime re-enters the command the sender was running: the receiver gets a prose note and continues by hand, so an unattended run or a deep loop comes back as an ordinary session. Codex never carries its goal and says nothing. Cursor and Devin drop a handed-over goal at their next handoff. Pi binds the hop goal into every later session of the same process. With the Claude relaunch switch off, a manual claim starts on the goal and never claims the note. An OpenCode goal continuation can cancel a prepared hop. The printed manual command does not run as typed.

### Purpose
After a hop the receiver runs the sender's command again, reads the goal of the phase it works, and every runtime either carries the session goal or prints one line that says why it did not.

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

### Out of Scope
- A Codex goal reader. Codex gets a signal and a prose route only.
- The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder. The verification refuted or rejected them.
- Step state inside the command workflows. The receiver runs the command again and the command's own state detection picks the step.
- The relaunch record format.

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
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
