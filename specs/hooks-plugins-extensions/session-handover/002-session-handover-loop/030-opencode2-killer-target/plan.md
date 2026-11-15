---
title: "Implementation Plan: Phase 30: opencode2-killer-target"
description: "The OpenCode relaunch plugin hands the killer the loop's direct child, found by the shared process-table walk, instead of its own pid, then the phase 028 hop is rerun live."
trigger_phrases:
  - "opencode2 killer target plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 30: opencode2-killer-target

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES module plugin, CommonJS core) |
| **Framework** | OpenCode plugin API through the v2 bridge |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
`spawnKiller` passes `core.findLoopChildPid(loopId, { pid: process.pid })` as the target and falls back to `process.pid` when the walk finds nothing. The walk already serves the Hermes adapter. The test is written first and must fail on the old code, then the 028 harness reruns the OpenCode goal hop.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adapter fix inside the existing relaunch plugin.

### Key Components
- **`killerTargetPid`** in the OpenCode plugin: picks the pid the killer signals.
- **`findLoopChildPid`** in the relaunch core: climbs the process table to the ancestor whose parent is the loop.
- **The killer**: unchanged. It still refuses a pid that does not descend from the loop.

### Data Flow
`session.idle` arms the record, the plugin resolves the loop child, and the detached killer waits, checks ancestry and signals that pid. The TUI exits, its server goes with it, and the wrapper reads the armed record and relaunches.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/session-relaunch.js` `spawnKiller` | Producer of `--target-pid` | Update | New test, live hop |
| `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs` | Producer, already walks to the loop child | Unchanged | Read: it calls `findLoopChildPid` |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Producer, passes `process.pid` | Unchanged | Pi runs its extension in the process the wrapper starts; the 028 Pi hop passed |
| Claude and Codex adapters | Producers | Unchanged | Their hops passed in 028 and 029 |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Consumer, checks ancestry; stamps and signals | Update: stamp before the signal, 15-second grace | Its ancestry check accepts the loop child; stamp and slow-exit tests |
| `.skilled/bin/skilled-loop` exit-130 branch | Consumer of the runtime exit | Update: a signalled 130 relaunches | Wrapper test |

Inventory: `rg -n -- "--target-pid" .skilled/hooks/session-relaunch .opencode/plugins .pi/extensions`.
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
| Unit | The killer target when the host sits below the loop's child | `node --test` |
| Integration | The relaunch gate and the plugin suite | `node --test` |
| Manual | A live OpenCode 2 goal hop through the real wrapper | The phase 028 harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2.1.4 | External | Green | No live hop |
| OpenAI quota for GPT-6 Luna | External | Yellow | The hop is recorded as skipped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A relaunch signals the wrong process on any OpenCode version.
- **Procedure**: Revert the phase commit. The plugin then hands its own pid again.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Test first | None | Fix |
| Fix | Test first | Gates, live hop |
| Live hop | Fix | Docs |
| Docs | Live hop | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Test and fix | Low | Under an hour |
| Live hop | Med | One run of about ten minutes |
| Docs | Low | Under an hour |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes
- [x] No feature flag needed: the change only alters which pid is signalled

### Rollback Procedure
1. Revert the phase commit.
2. Rerun the relaunch gate.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
