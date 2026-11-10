---
title: "Implementation Plan: Phase 2: git-hook-review-residuals"
description: "Six DeepSeek dispatch units, one change each: legacy hook crash handling, one definition of the authored routing path, a validator-parity rules probe, a linear-time regex fallback, an attribution-key drift test, and the doc fixes."
trigger_phrases:
  - "git hook residuals plan"
  - "rules probe parity plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: git-hook-review-residuals

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 (hooks), Node ESM and CommonJS |
| **Framework** | git hooks via global `core.hooksPath` |
| **Storage** | None |
| **Testing** | Hook suites under `.skilled/scripts/git-hooks/tests/`, `node --test` for sk-git, `.skilled/bin/tests/` |

### Overview
Claude writes one literal brief per unit; DeepSeek V4.1 Flash at max applies it through cli-opencode in worktree 075. After each unit Claude reads the diff, runs the affected suites, and runs each new test against the phase 1 state to confirm it fails there.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding re-read in code and its claim confirmed or refuted
- [x] The regex fallback measured: `^(a+)+$` over 35 characters runs in 1 ms with the flag and does not finish in 15 s without it
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Hook suites, sk-git node tests and compiled-route tests pass
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shell gates that delegate rule decisions to one Node validator.

### Key Components
- **`mcg_repo_declares_rules`**: the node-free answer to "does this repository declare rules", which must agree with `resolveContractDir` plus `extractContract`.
- **`compiled-route-layout.cjs`**: already the single home of the routing runtime layout; it gains the authored program dir.
- **`validate-message.mjs`**: the CLI every hook and CI path runs, and so the one place to switch the regex engine for those processes.

### Data Flow
Hook → probe (shell) → validator CLI (Node) → contract template. The probe only decides whether to call the validator, so a probe that says "declared" when the validator finds nothing costs one node start, while the reverse skips enforcement.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/message-contract-gate.sh` | Probe used by commit-msg and pre-push | Update | commit-msg and pre-push-message-contract suites |
| `message-contract.mjs` `resolveContractDir` | The order the probe must mirror | Unchanged | Read |
| `compiled-route-layout.cjs` | Layout owner | Add export | `.skilled/bin/tests` |
| guard, sync, pre-commit | Consumers of the authored path | Update | `rg -n "015-router-unification-program" .skilled/bin .skilled/scripts` leaves only the layout module and tests |
| `validate-message.mjs` | CLI for hooks and CI | Set the V8 flag | New catastrophic-pattern test |
| OpenCode and Pi transports | Import the library in a host process | Unchanged on purpose | The flag is set in the CLI only, never in a host |
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
| Unit | Validator CLI regex bound, attribution key drift | `node --test` |
| Integration | Probe parity, legacy hook crash, routing re-mint | Hook suites (bash) |
| Manual | Route guard against the real tree | `node .skilled/bin/compiled-route-guard.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 changes | Internal | Green (verified, uncommitted) | This phase edits on top of them |
| opencode-go DeepSeek V4.1 Flash | External | Green | Fall back to asking the operator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite fails after a unit and a repair dispatch does not fix it.
- **Procedure**: Revert that unit's files with `git checkout -p` against the pre-unit diff snapshot kept in the scratchpad.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 | Core |
| Core (units R1-R6) | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Core Implementation | Low | Six dispatches |
| Verification | Low | One full suite run |
| **Total** | | **Six dispatches plus checks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Nothing deploys: the hooks go live only when main is merged

### Rollback Procedure
1. Revert the unit's files in worktree 075.
2. Re-run the affected suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
