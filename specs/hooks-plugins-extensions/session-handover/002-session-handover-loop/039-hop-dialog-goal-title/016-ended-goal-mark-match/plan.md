---
title: "Implementation Plan: Phase 16: ended-goal-mark-match"
description: "Narrow the ended-goal mark to the note the session claimed last and keep it when the session log cannot be read, test first."
trigger_phrases:
  - "ended goal mark match plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: ended-goal-mark-match

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS) in the core and the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | Handoff notes in the repository's handoffs folder and the Claude session log under `CLAUDE_CONFIG_DIR` |
| **Testing** | `node:test` with `node:assert/strict` against `resolveGoalPacketResult` |

### Overview
`claimedNoteEndedGoal` collects the notes this session claimed and keeps the one with the greatest `claimed_at`, then reads its `goal_ended`. `claudeGoalPacketResult` calls it on the missing-log return and the failed-read return, and keeps its current call for a log with no goal entry. Two tests fail before the edit. The proof is the two tests, the two existing ended-goal tests and the whole relaunch and OpenCode plugin run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `rg -n 'claimedNoteEndedGoal' .skilled/hooks/session-relaunch` prints the definition and one call only, so no other caller depends on the status-blind match

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/green.txt` shows both new tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Narrowed reader over unchanged producers.

### Key Components
- **`claimedNoteEndedGoal` in `lib/relaunch-core.cjs` (line 632)**: scans the handoffs folder of the outgoing note. After the change it keeps the note claimed by this session with the greatest `claimed_at` and returns whether that note carries `goal_ended: true`.
- **`claudeGoalPacketResult` (line 647)**: after the change the missing-log return at line 658 and the failed-read return at line 664 first ask the helper and return `ended: true` when it answers yes.
- **`claimHandoff` (line 1414) and `supersedeClaimed` (line 1471)**: write `claimed_by`, `claimed_at` and the superseded status. Unchanged.

### Data Flow
`prepare` and `keep` call `recordGoalPacket`, which resolves the goal through `resolveGoalPacketResult` and `claudeGoalPacketResult`. When the log is missing, unreadable or has no goal entry, the helper reads the claimed-last note in the outgoing note's folder. Its mark sets `ended`, and `core.recordGoalPacket` writes `goal_ended: true` into the outgoing note as it does today. `supersedeClaimedNotes` runs after that, so the order of writes is unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The review report's Planning Packet holds no finding for this phase. Its `activeFindings` are `"R1-P2-001"` and `"R10-P2-001"`, imported by phases 15 and 19. The two findings here come from the alignment run (A-1) and review FH, checked against the code in `spec.md`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claimedNoteEndedGoal` | Reads the mark from any note this session claimed | update | The first new test turns from red to green |
| The two early returns of `claudeGoalPacketResult` | Return `none` before the mark is read | update | The second new test turns from red to green |
| `claimHandoff` and `supersedeClaimed` | Write `claimed_by`, `claimed_at` and `done` | unchanged | `git show` of the fix commit shows no change from line 1400 on |
| `core.recordGoalPacket` and the CLI's `recordGoalPacket` | Write or remove `goal_ended` | unchanged | `git show --stat` of the fix commit does not list `bin/session-relaunch.cjs` |
| The README goal table | States where the Claude goal and the mark are read | update | `rg -n 'claimed last' .skilled/hooks/session-relaunch/README.md` prints the Claude row |
| The feature catalog and the playbook | Describe the goal carry | phase 19 | Phase 19 tasks |

Required inventories:
- Same-class producers: `rg -n 'goal_ended' .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin` lists the reader at line 639 and the writer in `recordGoalPacket`. Only the reader changes.
- Consumers of changed symbols: `rg -n 'claimedNoteEndedGoal' .skilled .opencode --glob '*.cjs' --glob '*.mjs'` lists the definition and its one call in the core.
- Matrix axes: the log state (whole with no goal entry, missing, unreadable, read in part, with an active goal) crossed with the claimed notes (none, one marked, one unmarked, an older marked and a newer unmarked). The new tests cover the missing and unreadable rows and the older-and-newer row. The existing test covers the rest of the whole, partial and active rows.
- Algorithm invariant: the mark comes from at most one note, the one this session claimed last, and an unreadable log never turns a mark into no mark.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline and confirms the status-blind match, the early returns and the call order. Implementation adds the two failing tests, saves the red run, then edits the helper and the two returns until both pass, then corrects the README row. Verification runs the four ended-goal tests, the whole relaunch and OpenCode plugin run and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveGoalPacketResult` for Claude with notes written by `writeHandoff` under two writer ids and one claiming session, and with a log written by `writeClaudeLog`, a missing config folder or a log path that is a directory | `node:test` |
| Integration | None beyond the existing CLI tests, which still run in the whole suite | Not applicable |
| Manual | None. No live hop is run in this phase | Not run |

The two new tests run first with `--test-name-pattern='ended-goal mark counts only|session log cannot be read'` and must both fail, saved to `scratch/red.txt`. After the edit the same command must show both passing, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `writeHandoff`, `writeClaudeLog`, `writeGoalPacket`, `writeGoalBudget` and `createSandbox` in `tests/relaunch-core.test.cjs` | Internal | Green | The tests would need their own fixtures |
| `claimed_at` written by `claimHandoff` | Internal | Green | The claimed-last rule would have nothing to order by |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a receiver starts on a goal the operator ended, or loses a packet goal it should carry, or any relaunch test fails after the edit.
- **Procedure**: revert the fix commit. No note field and no record format changes, so notes written in between read the same under the old code.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The mark built in phase 10 and the bound built in phase 11 | Implementation |
| Implementation | The baseline count and the two red tests | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
