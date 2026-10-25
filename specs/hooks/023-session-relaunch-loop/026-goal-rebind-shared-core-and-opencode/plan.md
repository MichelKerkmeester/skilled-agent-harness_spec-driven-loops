---
title: "Implementation Plan: Phase 26: goal-rebind-shared-core-and-opencode"
description: "Add one bind-if-unbound step to the shared goal core and call it from the Pi, Devin, Cursor and Hermes adapters, then do the same inside the OpenCode plugin."
trigger_phrases:
  - "goal rebind shared core opencode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 26: goal-rebind-shared-core-and-opencode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ESM), TypeScript for Pi, Python for Hermes |
| **Framework** | The shared goal core and the OpenCode goal plugin |
| **Storage** | Per-session goal records under `.skilled/skills/.state/goal/` |
| **Testing** | `node --test` for the core, the hooks and the plugin, `pytest` for the Hermes plugin |

### Overview
Add one function to the shared core, call it from each adapter at the first turn when the variable is set and no record exists, and mirror it in the OpenCode plugin. Goal text is never sent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Phase 025 field and export exist, or tests set the variable directly

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
- [x] The goal suites and the Hermes tests pass against the recorded baselines
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A shared core with thin per-runtime callers.

### Key Components
- **goal-core.cjs**: Gains the bind-if-unbound function.
- **Pi, Devin, Cursor and Hermes callers**: Call it at the first turn.
- **opencode-goal.js**: Does the same through its own record handling.

### Data Flow
The receiver starts with `SESSION_RELAUNCH_GOAL_PACKET`. At the first turn the caller asks the core to bind. The core checks for a record, binds when none exists, and the usual injection reads `goal.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| goal-core.cjs bind path | Creates the per-session record | Add one function | Core tests for none, existing, paused and invalid |
| Pi, Devin, Cursor and Hermes injectors | Call the core each turn | Add one call | One test per runtime |
| opencode-goal.js | Own record handling | Add the same behavior | Plugin lifecycle tests |
| goal.cjs | CLI over the core | Unchanged | Its test still passes |

Required inventories:
- Same-class producers: `rg -n "bind" .skilled/hooks/goal .opencode/plugins/opencode-goal.js .hermes/plugins` lists every bind path.
- Consumers of the core: `rg -n "goal-core" .skilled .opencode .hermes .pi .devin .cursor --glob "!**/*.test.*"`.
- Matrix axes: five runtimes, record present or absent, variable set or unset.
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
| Unit | The core function and each caller | `node --test`, `pytest` |
| Integration | First turn after a simulated hop | Plugin and hook tests |
| Manual | Live proof on each runtime | Phase 028 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 025 export | Internal | Green | Tests set the variable by hand |
| Probe D verdict | Internal | Green | Read: Hermes needs no call, the launcher export is a follow-up |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A goal suite drops below baseline or a receiver overwrites a goal.
- **Procedure**: Revert the phase diff. The function is called only when the variable is set, so no stored record needs repair.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Core function ──► Pi, Devin, Cursor, Hermes callers
       └────────► OpenCode plugin
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Core function | None | Callers |
| Callers and plugin | Core function | Phase 28 live proof |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 5 to 7 hours |
| Verification | Med | 2 hours |
| **Total** |  | **8 to 10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines for the OpenCode suites, the shared hook suites and the Hermes tests recorded
- [x] Probe D verdict read

### Rollback Procedure
1. Revert the diff.
2. Rerun the goal suites and the Hermes tests.
3. Confirm a session with no variable behaves as before.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
