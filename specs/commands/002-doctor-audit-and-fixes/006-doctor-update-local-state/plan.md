---
title: "Implementation Plan: Phase 6: doctor-update-local-state"
description: "Move every /doctor:update path from .skilled/release/ into the ignored .skilled/skills/.state/doctor-update/, read a legacy record once, drop the tracked-record refusals, and update the documents that name the old folder."
trigger_phrases:
  - "doctor update local state plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: doctor-update-local-state

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script, ESM spec-kit CLI |
| **Framework** | None |
| **Storage** | JSON files under `.skilled/skills/.state/doctor-update/` |
| **Testing** | `node:test` (`release-update.test.cjs`, `doctor-update-contract.test.cjs`), vitest (`upgrade-legacy.vitest.ts`) |

### Overview
The state paths are constants at the top of `release-update.cjs`, so the move is a constant change plus the places that treated the two records as tracked files. A small reader falls back to the legacy record when the new one is missing. Text surfaces follow the new paths.
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
- [ ] `node .skilled/commands/doctor/scripts/tests/release-update.test.cjs` prints `pass 75` and `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script with module constants.

### Key Components
- **`release-update.cjs` constants**: `STATE_DIR`, `RUNS_DIR`, `BASE_FILE`, `DIVERGENCE_FILE`, `LOCK_FILE`, and `LEGACY_DIR` for the fallback.
- **`loadRecordJson`**: reads a record from the new path, else the legacy path, and prints one notice when it used the legacy one.

### Data Flow
`record-base` and `apply` write the records to the new path. `check`, `align` and `apply` read them through `loadRecordJson`. Runs and the apply lock live beside them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `release-update.cjs` | Owns every state path | update | `--help` paths; `release-update.test.cjs` |
| `upgrade-legacy.mjs` | Refuses a layout move while the apply lock exists | update the lock path | `upgrade-legacy.vitest.ts` |
| `validate-playbook-package.cjs` | Skips installed-state paths in the backtick check | accept the new folder too | validator test; root playbook warnings unchanged |
| Workflow YAML, presentation text, playbook pages, command contract | Name the paths and told the operator to commit the records | update | `rg -n "\.skilled/release" .skilled -g '!**/changelog/**'` |

Consumers: `rg -n "\.skilled/release|release/base\.json|release/runs" .skilled -g '!**/changelog/**'` before and after.
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
| Unit | Legacy read, untracked records, rollback paths, unit filter | `node:test` |
| Integration | Apply-lock refusal in `upgrade-legacy.mjs` | vitest |
| Manual | Barter re-pin: `replay.cjs --check` and no `.skilled/release/` | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.skilled/skills/.state/*/*` ignore rule | Internal | Green | Records would show as untracked files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer loses its base after upgrading, or a test regresses.
- **Procedure**: revert the commit on `worktrees/308-doctor-update-local-state`; in Barter, re-pin `skilled/` back to `23b4f3d2e7` and run `replay.cjs`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator decisions | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit and Barter re-pin |
<!-- /ANCHOR:phase-deps -->

---
