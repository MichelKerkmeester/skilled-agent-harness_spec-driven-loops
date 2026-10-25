---
title: "Feature Specification: Research remediation after phase 032"
description: "Nine child phases fix the relaunch-loop findings the research after phase 032 verified: model and effort replay, a locked consume, the manual claim command, manual goal binding, hop validation, test gaps, the compaction pointer, claim errors and the Pi arm event."
trigger_phrases:
  - "research remediation phase parent spec"
  - "relaunch research remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation"
    last_updated_at: "2026-10-25T13:42:16Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded the phase parent and nine Draft children with briefs"
    next_safe_action: "Fill each child's spec docs from its brief in scratch/briefs, then build wave 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-033-research-remediation"
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
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md; these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Research remediation after phase 032

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | specs/hooks/023-session-relaunch-loop |
| **Predecessor** | 032-opencode2-standalone-replay |
| **Successor** | None |
| **Handoff Criteria** | All nine children are Complete with every acceptance row Met, and `validate.sh 033-research-remediation --recursive --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ten-iteration research after phase 032 (`../research/research.md` sections 9, 9a, 11, 11a and 15) and an independent review against the code left nine fixable items in the session relaunch loop. A relaunch can start on a new model with an old effort (`.skilled/bin/skilled-loop:787-828`). `consume` reads the record outside its lock and never rechecks a withdraw (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:689-730`). The printed manual claim command replays the first launch (`.skilled/bin/skilled-loop:637`), and a manual first launch drops the note's goal packet. `shouldRelaunch` accepts negative and fractional hops (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1044-1047`). Four behaviours have no test. The after-compaction pointer gives no age for the note, the claim error names only a status, and Pi arms on `agent_end`, which a Pi 1.4.0 continuation can undo.

### Purpose
Each child phase fixes one item with a failing-first test, and the children that change what a relaunched session starts on prove it with a live hop.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research recommendations R1 to R6 and blackhole lessons B2, B3 and B4, one child each.
- Failing-first tests for every code change, and live hops for 001 (Claude, Codex, Pi) and 009 (Pi).
- README lines the changed behaviour contradicts.

### Out of Scope
- The Pi and Hermes provider logic at `.skilled/bin/skilled-loop:801-812`. Phase 001 moves model and effort only.
- Dropped: counting cursor-agent processes. Cursor never arms (`.skilled/hooks/session-relaunch/README.md:193`), so no killer ever needs the count.
- Dropped: transcript question-and-answer capture in the pointer (B1). Only Claude, Pi and OpenCode have a pointer, and Pi's blackhole already records answers.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/skilled-loop` | Modify | 001, 002, 003, 004 | Live effort rule, withdrawn decline, live manual command, manual goal binding |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | 001, 004, 005, 006, 008 | Arm-time effort clear in `armLocked`, seed inverse and goal packet helper, hop check in `shouldRelaunch`, goal-switch state in `preparePending`, claim errors in `claimHandoff` |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | 002, 004, 006 | Locked consume, helper move, goal switch at consume |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | 007 | After-compaction pointer text |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | 007, 009 | Pointer type (~85-91) and compaction handler (~633-640) for 007, arm event for 009 |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modify | 007 | After-compaction pointer for Claude |
| `.opencode/plugins/session-relaunch.js` | Modify | 007 | After-compaction pointer for OpenCode |
| `.skilled/hooks/session-relaunch/tests/*` | Modify | all | Failing-first tests |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modify | 007, 009 | Failing-first tests for the Pi pointer and arm event |
| `.skilled/hooks/session-relaunch/README.md` | Modify | 001, 004, 009 | Doc lines the change contradicts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-model-effort-atomic-replay/ | R1: a relaunch takes its effort from the same entry as its model, so a session switched to Opus medium relaunches as Opus medium | Draft |
| 2 | 002-consume-locked-withdraw/ | R2: consume reads and removes the record under one lock and reports `withdrawn: true`, which the wrapper treats as a decline | Draft |
| 3 | 003-manual-claim-live-settings/ | R3: the printed manual claim command uses the record's live model and effort | Draft |
| 4 | 004-manual-claim-goal-binding/ | R4: a manual first launch with a claim seed reads and exports the note's goal packet | Draft |
| 5 | 005-persisted-hops-validation/ | R5: `shouldRelaunch` rejects persisted hops that are not a non-negative integer | Draft |
| 6 | 006-relaunch-coverage-gaps/ | R6: tests for `--server=URL`, a missing binary, concurrent claims and a reused note with the goal switch off | Draft |
| 7 | 007-compaction-pointer-staleness/ | B2: the after-compaction pointer names the note's `created_at` and asks for git evidence | Draft |
| 8 | 008-claim-error-per-state/ | B3: `claimHandoff` errors say what done, claimed and missing status mean | Draft |
| 9 | 009-pi-arm-on-agent-settled/ | B4: the Pi extension arms on `agent_settled` | Draft |

### Dependencies and Parallel Waves

Phases 001 to 004 all edit the wrapper's relaunch path in `.skilled/bin/skilled-loop`, so they run one after another in the order 001, 002, 004, 003. Phase 001 also edits `relaunch-core.cjs` (`armLocked`) in wave 1 beside 005 (`shouldRelaunch`) and 008 (`claimHandoff`): separate functions, shared files, so each rebases on whatever landed first. Phase 006 waits for 004, because 004 moves `usableGoalPacket` into the core and 006 changes the goal-switch handling around it, and both edit `skilled-loop.test.cjs`. Phase 003 also waits for 004, since both change the manual command path. 007 and 009 share the Pi extension and its test file in separate regions; the second to land rebases.

| Wave | Phases | Starts when |
|------|--------|-------------|
| 1 | 001, 005, 007, 008, 009 | Now |
| 2 | 002 | 001 is Complete |
| 3 | 004 | 002 is Complete |
| 4 | 003, 006 | 004 is Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-model-effort-atomic-replay | 002-consume-locked-withdraw | Phase 001 is Complete, because both change the wrapper's relaunch path | `validate.sh 001-model-effort-atomic-replay --strict` RESULT: PASSED |
| 002-consume-locked-withdraw | 004-manual-claim-goal-binding | Phase 002 is Complete, because both change consume and the wrapper | `validate.sh 002-consume-locked-withdraw --strict` RESULT: PASSED |
| 004-manual-claim-goal-binding | 006-relaunch-coverage-gaps | Phase 004 is Complete, because 006 changes the goal-switch handling around the `usableGoalPacket` that 004 moves into the core, and both edit `skilled-loop.test.cjs` | `validate.sh 004-manual-claim-goal-binding --strict` RESULT: PASSED |
| 004-manual-claim-goal-binding | 003-manual-claim-live-settings | Phase 004 is Complete, because both change the manual command path | `validate.sh 004-manual-claim-goal-binding --strict` RESULT: PASSED |
| None | 005, 007, 008, 009 | No dependency; each starts in wave 1 | Its own baseline gate recorded |

### Decision Notes

- The R1 headline case (Claude Sonnet low switched to Opus medium) already relaunches as Opus medium today, because every Claude main-chain assistant entry carries effort (953 of 953 in a real transcript). Phase 001 keeps that case as a regression guard and fixes the cases where a new model arrives without an effort. Hermes is exempt.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does Claude Code write anything to its session log when `/model` or `/effort` switches before the next assistant turn? Phase 001 investigates and documents the limit if nothing is written.
- Does a reused note with `SESSION_RELAUNCH_GOAL=0` hand on an old packet? Phase 006 writes the test and fixes it only if the test confirms it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Briefs**: `scratch/briefs/<child-folder>.md`, the only input a writer gets for each child
- **Research**: `../research/research.md`
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

- The phase parent tracks the nine child phase folders above, each fixing one verified research item with a failing-first test.
<!-- /ANCHOR:requirements -->
