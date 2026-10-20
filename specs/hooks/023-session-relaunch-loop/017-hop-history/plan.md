---
title: "Implementation Plan: Phase 17: hop-history"
description: "A small module appends one tab-separated line per hop event to a gitignored file beside the handoff notes. The CLI and the killer call it at the four points a hop changes state, and a history subcommand and a doctor line read it back."
trigger_phrases:
  - "hop history plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: hop-history

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, built-ins only |
| **Framework** | None |
| **Storage** | One append-only text file under `.skilled/skills/.state/session-relaunch/` |
| **Testing** | `node --test` |

### Overview
`lib/hop-history.cjs` appends one tab-separated line per hop event and reads the latest lines back. The CLI records on relaunch, claim and complete, and the killer records a timeout. A `history` subcommand prints the file, `/doctor:setup` prints its last line, and an opt-in switch adds a macOS notice on each hand-over.
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
One best-effort recorder module called from the existing state transitions.

### Key Components
- **`recordHop`**: writes one line with the time, event, runtime, hop number, cwd, the goal's first line and the note name. It returns false instead of throwing.
- **`readHistory`**: returns the latest lines in a readable layout.
- **`notifyHandOver`**: runs `osascript` when `SESSION_RELAUNCH_NOTIFY_HOPS` is truthy.

### Data Flow
The wrapper asks `should-relaunch`. A yes records `handed-over` and may show the notice. The seeded session runs `claim` and `complete`, which record `claimed` and `done`. A killer that gives up records `timed-out`. `history` and `/doctor:setup` read the file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `bin/session-relaunch.cjs` | Relaunch decision, claim and complete | update (done) | `hop-history.test.cjs`, CLI tests |
| `lib/killer.cjs` | Stalled-hop give-up | update (done) | `killer.test.cjs` timed-out assertion |
| `/doctor:setup` workflow and presentation | Setup health summary | update (done) | doctor tests, `route-validate` |
| `relaunch.log` | Debug log of every decision | unchanged | still written by the core |

Required inventories:
- Hop state changes: relaunch decision, claim, complete and killer timeout, four call sites.
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
| Unit | Record, read, notice switch, bad `--last` | `node --test` with a stub `osascript` on PATH |
| Integration | CLI subcommands and the killer timeout | `node --test` in sandboxed repositories |
| Manual | A live Claude hop through `skilled-loop` in tmux | `history` output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hook-flags reader | Internal | Green | Notice switch would need the environment only |
| `osascript` | External, macOS | Green | No notice, the history still records |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hop fails or slows because of the recorder.
- **Procedure**: Revert the merge commit. The history file is gitignored state and can be deleted.
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
| Core Implementation | Low | 1 hour |
| Verification | Med | 1 hour |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration
- [x] Notice switch off by default
- [x] Suite green before merge

### Rollback Procedure
1. Set nothing: the notice is already off unless the hook-flags file turns it on.
2. Revert the merge commit on main.
3. Rerun the session-relaunch suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete `hop-history.log` if wanted.
<!-- /ANCHOR:enhanced-rollback -->

---
