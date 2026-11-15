---
title: "Implementation Plan: Phase 8: review-3-remediation"
description: "Fix the third deep review's fifteen findings: five narrow library fixes in the relaunch core, nudge and killer, each driven by a test that fails first, then the command, environment and packet records the review found out of step with their evidence."
trigger_phrases:
  - "review 3 remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: review-3-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM, Node built-ins only |
| **Framework** | None; hook adapters per runtime over one shared core |
| **Storage** | Handoff notes under `.skilled/skills/.state/session-relaunch/handoffs/`, relaunch records and the log under the per-user runtime state directory |
| **Testing** | `node --test` on explicit files |

### Overview
Each code finding gets a test first, then the smallest change in the library file that owns the behavior. The record findings are fixed by restoring the missing evidence (the run-10 log lines, the phase 002 smokes) rather than by rewording the claims, and by bringing the parent's phase count, handoff rows and continuity up to date.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One runtime-neutral core with thin per-runtime adapters. Every fix lands in the core or the shared nudge, so all adapters inherit it.

### Key Components
- **`relaunch-core.cjs`**: the record freshness check, note transitions and supersede.
- **`nudge.cjs`**: plans the note path every automatic adapter hands to the model.
- **`killer.cjs`**: the lock takeover and its leftover sweep.

### Data Flow
An adapter asks `plannedNotePath` for a note path, the model writes the note, `prepare` validates it and supersedes the session's older notes, the arm event arms the record, and the wrapper asks `shouldRelaunch` before it starts the next session.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shouldRelaunch` (core) | Only freshness gate | update: a future `armedAt` is stale | new core test |
| `session-relaunch.cjs should-relaunch`, `nudge.handoffPending` | Consumers of `shouldRelaunch` | unchanged; both inherit the stale reading | `rg -n "shouldRelaunch\("` lists both |
| `supersedeClaimed` (core) | Completes earlier notes on `prepare` | update: also this session's open notes | new core test, edited untouched-notes test |
| `writeHandoffUpdate` (core) | Writes claim, complete and supersede | update: always 0600 | new core test |
| `plannedNotePath`, `openNotePathFor` (nudge) | Note path for Claude, Codex, Pi, OpenCode and Hermes | update: private directory, newest open note | two new nudge tests; `rg -n "plannedNotePath\("` lists the five callers |
| `sweepStaleTakeovers` (killer) | Leftover sweep | update: both leftover prefixes | extended killer sweep test |
| `/speckit:handoff`, `ENV-REFERENCE.md` | Operator docs | update | read against `session-relaunch.cjs` returns and adapter reads |

Required inventories:
- Same-class producers: `rg -n "\.stale-" .skilled/hooks/session-relaunch/lib/killer.cjs` shows the two rename sites the sweep now covers.
- Consumers of changed symbols: `rg -n "shouldRelaunch\(|plannedNotePath\(|supersedeClaimed\(|writeHandoffUpdate\(" .skilled .opencode .hermes .pi`.
- Matrix axes: note status (open, claimed, done) by owner (this session, another session); record age (past, exact limit, future).
- Algorithm invariant: a relaunch record is fresh only when `0 <= now - armedAt <= limit`.
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
| Unit | Core freshness, supersede and note mode; nudge planning; killer sweep | `node --test` |
| Integration | Claude and Codex nudge adapters run as child processes with a `spec_folder` payload | `node --test` |
| Manual | Phase 002's two literal smoke commands | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The local relaunch log holding the run-10 lines | Internal | Green | The phase 007 citations could not be repaired |
| `pi` and the OpenCode plugin import | External | Green | AC-003 of phase 002 would stay on substitutes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a session-relaunch suite fails after merge, or a live hop regresses.
- **Procedure**: revert the phase 008 commit. The fixes touch no stored format, so older records and notes stay readable.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (review verified) ──► Code + tests ──► Records ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The review report | Code + tests |
| Code + tests | Setup | Verify |
| Records | Setup | Verify |
| Verify | Code + tests, Records | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done with the review verification |
| Core Implementation | Low | Under an hour |
| Verification | Med | One full gate run |
| **Total** | | **About two hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: `SYSTEM_SESSION_RELAUNCH_DISABLED` already turns the concern off
- [x] Monitoring alerts set: not applicable to a local hook

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` if a hop misbehaves.
2. Revert the phase 008 commit.
3. Rerun the session-relaunch suites.
4. Tell the operator which finding the revert reopens.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
