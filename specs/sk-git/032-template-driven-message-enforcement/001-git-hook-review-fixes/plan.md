---
title: "Implementation Plan: Phase 1: git-hook-review-fixes"
description: "Fix the nineteen hook review findings in seventeen single-change units, each written here as literal text and implemented by DeepSeek V4.1 Flash at max effort through cli-opencode, with every diff and its tests checked before the next unit."
trigger_phrases:
  - "git hook fix plan"
  - "hook trust block"
  - "deepseek dispatch units"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: git-hook-review-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2-compatible shell; Node ESM (`.mjs`) |
| **Framework** | git hooks via global `core.hooksPath` |
| **Storage** | None |
| **Testing** | `.skilled/scripts/git-hooks/tests/*.test.sh`; `node --test` for the sk-git `.mjs` tests |

### Overview
The plan is written here, unit by unit, and DeepSeek V4.1 Flash implements each unit in worktree 075. A unit is one change with its literal text, its allowed files and its test command. The orchestrator reads the diff and runs the tests before sending the next unit.
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
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shell hooks sharing one marker-delimited source-root block, plus a shared Node validator.

### Key Components
- **Source-root block**: identical in six hooks, enforced by `tests/source-root-selection.test.sh`. Gains the trust check.
- **message-contract.mjs**: contract-dir resolution, Commit-Id owner lookup, comment stripping.
- **pre-push**: range construction, gate dispatch.

### Data Flow
git invokes a hook, the hook resolves `REPO_ROOT` and `SOURCE_ROOT`, and the trust check either keeps `SOURCE_ROOT` or points it at a path that never exists, which turns every tree-sourced gate into its existing "not in the toolchain repo" path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Source-root block (6 hooks) | Picks tree root from repo content | Add trust check | source-root-selection test; new foreign-repo test |
| commit-msg | Runs validator from HOOK_DIR | Unchanged (already trusted path) | commit-msg suite |
| message-contract.mjs | Contract dir, Commit-Id, comments | Update | message-contract.test.mjs, git-rule-checks.test.mjs |
| pre-push | Range, gates | Update | pre-push suites |
| Docs | README, ENV-REFERENCE, lib/README, headers | Update | read-through |

Algorithm invariant for the trust check: `SOURCE_ROOT` stays under `REPO_ROOT` only when the hook script's resolved git common dir equals the repository's, or local config opts in. Adversarial cases: a clone carrying the sentinel; the same clone with `-c skilled.trustRepoHooks=true` (command scope must not count); a worktree of the hooks' checkout (must count).
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
| Unit | message-contract functions | `node --test` |
| Integration | Each hook in a throwaway repo | `tests/*.test.sh` |
| Manual | P0 reproduction from the review | scratch repo with a planted guard library |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode 1.18.32, `opencode-go/deepseek-v4.1-flash` | External | Green (pre-flight passed) | Units fall back to orchestrator review of a stalled diff |
| git 2.50.1 | External | Green | Behavior probes assume it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hook blocks normal work after the merge to main.
- **Procedure**: `git revert` the merge commit on main; the global hooks follow the main checkout.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core (units D01 to D17, serial) | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | High | 17 dispatches |
| Verification | Med | 1 hour |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Full hook suite green in worktree 075
- [ ] main checked for concurrent commits before merge

### Rollback Procedure
1. `git revert -m 1 <merge-sha>` on main.
2. Push the revert.
3. Run one commit in a scratch repo to confirm the old hooks are live.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
