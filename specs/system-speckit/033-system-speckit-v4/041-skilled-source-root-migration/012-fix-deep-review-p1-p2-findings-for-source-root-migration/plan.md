---
title: "Implementation Plan: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration"
description: "Add one sentinel-based source-root selection per language, move every reported caller onto it, then close the live, pre-existing and coverage findings, each with the check that proves it."
trigger_phrases:
  - "source root resolver plan"
  - "sentinel selection block"
  - "deep review remediation plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (git hooks, CI scripts), Node ESM (resolver, plugins, generators), GitHub Actions YAML, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Shell test scripts, `node --test`, vitest, pytest for the doc validator |

### Overview
The review's headline recommendation is one resolver instead of hand-written guesses. JavaScript gets `findSourceRoot` beside `findRepoRoot` in the shared workspace module. The shell hooks cannot source a resolver file without first choosing a root to find it under, so each carries one identical sentinel block, and a test holds every copy identical and fails on any root named directly.
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
- [x] Tests passing, with the baseline delta reported
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One selection rule, expressed once per language.

### Key Components
- **`findSourceRoot(repoRoot)`**: in `shared/workspace/repo-root.mjs`, re-exported by the hooks workspace module. Returns the absolute source root or null.
- **The hook selection block**: sets `SOURCE_ROOT` from `$REPO_ROOT` by the sentinel, `.skilled` first. `_in_toolchain_repo` becomes a test of `SOURCE_ROOT` being set.
- **`source-root-selection.test.sh`**: extracts the block from every hook and checker, compares them, greps for a root named directly, and runs the block against four fixture layouts.

### Data Flow
`git rev-parse --show-toplevel` or `findRepoRoot` gives the repository. The selection gives the source root. Every tree path is built from the source root.

### Why the hooks carry a block instead of sourcing a file
The hooks run from `~/.config/git/hooks` for every repository on this machine. A resolver file has to be found before it can be sourced, and finding it under the committing repository means choosing a root first. Finding it beside the hook's own real path adds a symlink walk and a new failure that would block every commit on the machine if it went wrong. An identical block with a drift test gives one rule with no new failure path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-root.mjs` | Finds the repository by the sentinel under either name | Update: add `findSourceRoot` | Unit test over four layouts |
| Git hooks and `check-git-hooks.sh` | Build gate paths as `$REPO_ROOT/.opencode/...` | Update: build from `SOURCE_ROOT` | Selection test. A real commit and push |
| `install-git-hooks.sh` | Picks the hook source by `-d` | Update: pick by the sentinel | Selection test placeholder row |
| `check-gate-inputs.sh` | Parses hook inputs | Update: both names in every branch | Missing `.skilled` fixture fails the gate |
| `install-codex-hooks.mjs` | Writes global Codex hooks | Update: rewrite command root | Legacy-only fixture test |
| Trigger-index generator | Walks `.skilled` roots | Update: roots from the selected root | Legacy-only and no-root tests |
| Four plugins | Join `.skilled` onto the project root | Update: selected root | Plugin tests |
| CI workflows | Triggers and test loops | Update | `yaml` parse and path-filter match |

Required inventories:
- Same-class producers: `rg -n '\$REPO_ROOT/\.(opencode|skilled)/' .skilled/scripts .skilled/hooks .skilled/bin` and `rg -n "join\([^)]*'\.skilled'" .opencode/plugins`.
- Consumers of changed symbols: `rg -n 'findSourceRoot|SOURCE_ROOT_SENTINEL|CORPUS_ROOTS'`.
- Matrix axes: layout (both, `.skilled` only, `.opencode` only, placeholder `.skilled`) by caller (seven hooks, checker, two installers, generator, four plugins).
- Algorithm invariant: the selected root always contains the sentinel file. A directory never qualifies by existing.
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
| Unit | `findSourceRoot`, corpus roots, installer rewrite | `node --test`, vitest |
| Integration | Each hook under four layouts. A real commit and push in this worktree | Shell test, git |
| Contract | Gate-input fixtures, workflow path filters, install-guide corpus, retired-mode negative test | Shell, python |
| Baseline | `run-node-tests.mjs`, hook suites, gate-input suite, vitest suites at `073e9241e7` and at the fix SHA | Same commands both times |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` with GPT-5.6 Luna | External | Green at the review | Angle 10 cannot run. REQ-015 reported blocked |
| Main checkout fast-forward | Internal | Needed for hook fixes to govern commits | Hooks keep the old behavior until it lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A commit or push that passed before is blocked, or CI turns red on a workflow this phase changed.
- **Procedure**: `git revert <fix-sha>` on the branch, then fast-forward the main checkout so the global hooks pick up the revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Resolver ──► Callers ──► Live + pre-existing fixes ──► Tests ──► Angle 10 ──► Verify + ship
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Resolver | Baseline captured | Callers |
| Callers | Resolver | Tests |
| Live and pre-existing fixes | None | Verify |
| Tests | Callers | Verify |
| Angle 10 | Fixes landed on the branch | Verify |
| Verify and ship | All above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Resolver and callers | Med | 2-3 hours |
| Live, pre-existing and coverage fixes | Med | 2-3 hours |
| Angle 10 and verification | Med | 1-2 hours |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline numbers captured at `073e9241e7`
- [x] Each changed hook run on a real commit in this worktree
- [x] No data migration

### Rollback Procedure
1. `git revert <fix-sha>` on `worktrees/055-skilled-source-root-migration`.
2. Fast-forward `skilled/v4.0.0.0` and `main`, then the main checkout.
3. Commit once in the main checkout to confirm the hooks pass.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
