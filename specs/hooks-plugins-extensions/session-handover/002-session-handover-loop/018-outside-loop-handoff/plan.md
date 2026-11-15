---
title: "Implementation Plan: Phase 18: outside-loop-handoff"
description: "The shared nudge decides once whether a session is inside the loop, and the text switches to a note-only form outside it. A keep subcommand records the note, a Claude SessionStart hook points a compacted session back at it, and the history reads open notes."
trigger_phrases:
  - "outside loop handoff plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: outside-loop-handoff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ES modules, built-ins only |
| **Framework** | Claude Code hooks through the hook registry |
| **Storage** | Handoff notes and the hop history under `.skilled/skills/.state/session-relaunch/` |
| **Testing** | `node --test`, vitest for Pi and the registry |

### Overview
All five automatic adapters already call `nudgeDecision` and `handoffText` and pass no loop id, so both read it from the environment. Outside the loop the decision now nudges with reason `outside-loop`, unless this session already has an open note, and the text asks for `keep` instead of `prepare`. No adapter changes. `keep` shares `prepare`'s note check. A new Claude hook on `SessionStart` handles `source: compact`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One decision in the shared module, one text switch, one new CLI subcommand and one thin hook adapter.

### Key Components
- **`nudgeDecision`**: inside the loop, unchanged. Outside it, quiet while this session has an open note, otherwise the level logic with reason `outside-loop`.
- **`handoffText`**: the same note shape, with a closing step of `keep` and "keep working" when the loop id is empty.
- **`keep`**: `validatedNote`, `supersedeClaimedNotes`, `recordHop('note-kept')`, then the claim and complete commands.
- **`compact-pointer.mjs`**: on `source: compact`, `writeState(level 0)`, then `seedText({ afterCompaction: true })` for the open note unless `handoffPending`.
- **`openNotesLine`**: one line naming the count and the oldest open note.

### Data Flow
The fill passes the threshold outside the loop. The session writes the note, saves continuity when a packet is bound and runs `keep`, which records `note-kept`. Claude compacts. `SessionStart` with `source: compact` resets the level and adds the claim instructions. The session claims the note (`claimed`), works the Remaining work and completes it (`done`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Claude, Codex, Hermes, Pi and OpenCode adapters | Call the shared nudge | unchanged code, new behaviour outside the loop | conformance tests for all five |
| `prepare` | Arms the hop; exits 3 outside the loop | unchanged | existing CLI tests |
| `/speckit:handoff` | Manual hop | wording only | `validate_document.py --type command` |
| `/doctor:setup` | Last hop line | adds the open-notes line | doctor tests |

Required inventories:
- Callers of `nudgeDecision` and `handoffText`: the five adapters, none of which passes a loop id.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Decision reasons, note-only text, open-note silence | `node --test` |
| Integration | `keep`, `history`, the compact pointer as a child process, every adapter outside the loop | `node --test`, vitest for Pi |
| Manual | A live Claude session outside the loop, then `/compact` | tmux and `history` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hop history from phase 017 | Internal | Green | No `note-kept` line |
| Claude `SessionStart` `source` field | External | Green, seen live | No pointer after compaction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A session outside the loop stops, or a hop inside the loop changes.
- **Procedure**: Revert the merge commit and rerun the registration sync, which removes the pointer row from `.claude/settings.json`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Med | 1.5 hours |
| Verification | Med | 1.5 hours |
| **Total** | | **About 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration
- [x] Inside-the-loop tests unchanged and green
- [x] Suite green before merge

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` to silence every session-relaunch hook at once.
2. Revert the merge commit on main and rerun `sync-hook-registrations.cjs`.
3. Rerun the session-relaunch suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Kept notes are ordinary handoff notes and can be completed or deleted.
<!-- /ANCHOR:enhanced-rollback -->

---
