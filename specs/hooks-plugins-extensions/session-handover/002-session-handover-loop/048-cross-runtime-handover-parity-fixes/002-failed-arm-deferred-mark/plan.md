---
title: "Implementation Plan: Phase 2: failed-arm-deferred-mark"
description: "Copy the Claude deferred mark onto every failed arm branch of the Codex, Pi and OpenCode adapters and switch their operator-prompt withdraw to the default deferred policy."
trigger_phrases:
  - "failed arm deferred mark plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: failed-arm-deferred-mark

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ES modules), TypeScript for the Pi extension |
| **Framework** | Skilled session-handover core |
| **Storage** | Relaunch state files, read and written under the record lock |
| **Testing** | `node --test` |

### Overview
Each failed arm branch calls `markDeferred` inside a guard that logs a failure, as `claude/stop-arm.mjs` `markParked` does. Codex also prints the Claude notice through `systemMessage`. The three operator-prompt withdraws drop `pending: 'none'` so the default `deferred` policy applies, which still leaves a prepared, never-deferred record alone.
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
- [ ] The handover suite prints `fail 0` with more tests than the baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Copy one runtime's proven branch shape onto the others

### Key Components
- **`codex/stop-arm.mjs`**: Stop arm with three failed branches.
- **`pi/session-handover.ts` `armRelaunch`**: arm at `agent_settled`.
- **`.opencode/plugins/session-handover.js` `armOnIdle`**: arm at `session.idle`.
- **`lib/withdraw.cjs`**: unchanged helper whose default policy accepts a deferred record.

### Data Flow
A turn end that cannot arm stamps `deferredAt` and logs the cause. The next operator prompt calls `withdrawHandOver` with the default policy, which disarms the deferred record and grants one more nudge.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Codex, Pi and OpenCode arm paths | Arm at turn end | update; mark on failure only | the arm success tests unchanged and passing |
| Codex, Pi and OpenCode withdraw | Withdraw an armed record | update; also a deferred one | a fresh pending record stays, by test |
| Claude and Vibe adapters | Already mark and withdraw | unchanged | not in the diff |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, one Vibe brief per change, then the docs and the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each failed branch marks deferred, each withdraw takes a deferred record and leaves a fresh one | `node --test`, the Pi `node --test` suite, one mutation per branch |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `markDeferred` export | Internal | Green | No mark |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a hop that no longer arms, or a prepared record withdrawn before its first turn end.
- **Procedure**: `git revert` the phase's feature commit. No state format changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The operator's go-ahead | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---
