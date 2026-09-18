---
title: "Implementation Plan: Phase 14: fix-pre-existing-defects-found-by-migration"
description: "Find each defect's cause before its fix, prove every fix with a test that fails without it, and prove the new CI jobs in a clean clone before they reach the remote."
trigger_phrases:
  - "pre-existing defects plan"
  - "clean clone ci simulation"
  - "root name hardcode plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: fix-pre-existing-defects-found-by-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (scaffolder, sk-doc tests), Node CJS/ESM and TypeScript (hooks, plugins, retrieval), Bash, GitHub Actions YAML |
| **Framework** | None |
| **Storage** | SQLite for the council graph |
| **Testing** | `node --test`, vitest, pytest and self-running Python scripts |

### Overview
Each defect is traced to its cause before it is fixed, and each fix gets a test that is run once against the code before the fix, where it must fail. The two CI jobs are run step for step in a shallow clone with no installed packages and no built output, under the Node version CI pins, before anything is pushed.
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
- [x] Tests passing, with the baseline delta reported
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Resolve the source root where the code runs, never by spelling it. Three mechanisms cover every caller this phase changed:

- **Relative to the file**: a hook or script finds `hooks/shared/` by climbing only to its own source root, which works under either name.
- **By the sentinel**: code that starts from the repository root picks whichever of `.skilled` and `.opencode` holds `skills/system-spec-kit/SKILL.md`, the rule phase 12 set.
- **By real path**: Python resolves its own real path first, so a copy reached through a runtime link still finds its tree.

### Key Components
- **`with_initial_version`** in the scaffolder: sets a rendered `SKILL.md` to `1.0.0.0`.
- **`DEEP_LOOP_COUNCIL_DB_DIR`**: moves the council database; the test helper sets it to a scratch directory.
- **`searchRootsFor`** in the ripgrep wrapper: the convention's roots, named as the checkout names them.
- **`run-script-tests.sh`**: runs each sk-doc test the way it is written.

### Data Flow
A test or hook starts, resolves its source root by one of the three mechanisms, and reads or writes under it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Scaffolder | Writes new skills | Update | Scaffold proof passes; it failed before |
| sk-doc script tests | Guard doc tooling | Update | All 24 pass; four failed before |
| Council database module | Stores council graphs | Update | Guard test fails before, passes after |
| Hook-flags callers | Read kill switches | Update | Every rewritten path resolved from its run location |
| Ripgrep wrapper | Runs retrieval searches | Update | New test fails before, passes after |
| Three plugins | Log advisories | Update | Legacy-root tests fail before, pass after |
| Pi extensions | Read kill switches | Unchanged | Recorded: their load location cannot know the root name |
| CI | Runs guards | Add three workflows | Clean-clone simulation under Node 22 |

Required inventories:
- Same-class producers: `rg -n "\.skilled/hooks/shared/hook-flags" --glob '*.{cjs,mjs,js,ts,sh}'`.
- Consumers of changed symbols: `rg -n 'DEEP_LOOP_COUNCIL_DB_DIR|searchRootsFor|logPathFor|with_initial_version'`.
- Matrix axes: source-root layout (`.skilled` only, `.opencode` only) by caller (hooks, scripts, wrapper, plugins).
- Invariant: a resolved path always lands inside the source root that holds the sentinel.
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
| Regression | Each new test against the code before its fix | `git stash` of the fix, then the test |
| Suites | Node gate, spec-kit projects, deep-loop runtime, sk-doc scripts | The same commands CI runs |
| CI simulation | Both new workflows in a shallow clone under Node 22 | The workflow steps, verbatim |
| Resolution | Every rewritten hook import, from its run location | A resolver script over the changed files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval for `~/.codex/hooks.json` | Internal | Given 2026-09-18 | The drift would stay |
| Node 22 locally | External | Available through nvm | A newer npm rejects the spec-kit lockfile, so the simulation would not match CI |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hook stops honouring its kill switch, a new workflow fails for environment reasons, or a commit that passed before is blocked.
- **Procedure**: `git revert` the commit on the branch and fast-forward both remote branches and the main checkout. For the Codex hooks, copy `~/.codex/hooks.json.bak-before-phase14-20260918T191907` back over `~/.codex/hooks.json`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Scaffold + sk-doc tests ──┐
Council DB + Codex hooks ─┼──► CI jobs ──► Clean-clone simulation ──► Trigger index + docs ──► Push
Root-name hardcodes ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Fixes | Baseline captured | CI jobs |
| CI jobs | Green sk-doc and deep-loop suites | Simulation |
| Simulation | CI jobs committed | Push |
| Trigger index | Final docs, since the index lists them | Push |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Small fixes | Low | 2 hours |
| Root-name hardcodes | Med | 2 hours |
| CI jobs and simulation | Med | 2 hours |
| **Total** | | **6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Codex hooks backed up before the reinstall
- [x] Every commit passed the git hooks with no bypass variable
- [x] No data migration

### Rollback Procedure
1. `git revert <sha>` on `worktrees/055-skilled-source-root-migration`.
2. Fast-forward `skilled/v4.0.0.0` and `main`, then the main checkout.
3. Rebuild the spec-kit and advisor runtimes in the main checkout if a hook change is reverted.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The Codex hooks backup restores the home configuration.
<!-- /ANCHOR:enhanced-rollback -->

---
