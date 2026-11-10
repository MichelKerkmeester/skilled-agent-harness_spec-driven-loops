---
title: "Implementation Plan: Phase 3: agent-mirror-checker-relocation"
description: "Move the agent mirror checker, its lib, its two tests and its crosswalk doc out of the deep-improvement packet into .skilled/bin/, fix their relative paths, and repoint every caller, so the packet can be deleted later without breaking the pre-commit hooks or CI."
trigger_phrases:
  - "agent mirror checker relocation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: agent-mirror-checker-relocation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS, TypeScript tests, shell, YAML, Markdown |
| **Framework** | `.skilled/bin/` repo tools, git pre-commit hooks, GitHub Actions |
| **Storage** | None |
| **Testing** | `vitest.config.bin.ts`, `pre-commit.test.sh`, `broken-move-drill.sh` |

### Overview
The agent mirror checker is a repo-wide guard, yet it lives inside the `deep-improvement` packet that phase 005 deletes. This phase moves it and its support files to `.skilled/bin/` with `git mv`, so history follows the files. The checker's lib loads the frontmatter parser through a package link that exists only in the deep-loop hub's `node_modules`, so the move swaps that for a path require of the built `system-spec-kit/shared` file. One DeepSeek work unit does the edit; the orchestrator verifies the diff and runs the gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Callers listed with line numbers (`scratch/brief-wu1.md` STEP 3)
- [x] Moves listed (`scratch/moves.txt`)
- [x] Gate baselines captured in the worktree

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] The diff touches only the paths in `scratch/files.txt`, `scratch/moves.txt` and the crosswalk line in the two agent `README.txt` files
- [ ] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Relocate and repoint: move with history, fix relative paths inside the moved files, then rewrite each caller's path and nothing else on the line.

### Key Components
- **`check-agent-mirror-sync.cjs`**: the CLI; derives `REPO_ROOT` from its own folder depth.
- **`lib/mirror-sync-verify.cjs`**: the comparison logic; loads `parse-frontmatter.js`.
- **Callers**: both pre-commit hooks, the hook test suite, the broken-move drill, the CI workflow and five docs.

### Data Flow
A pre-commit hook or CI calls the checker, the checker reads the canonical agent and each runtime mirror, and the lib compares parsed frontmatter and bodies.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Checker, lib, two tests, crosswalk | Live in `deep-improvement/` | `git mv` to `.skilled/bin/`; fix depth and parser require | bin vitest, `--all` run |
| Both pre-commit hooks | Call the checker by path | Repoint | `pre-commit.test.sh` |
| `agent-mirror-sync.yml`, `broken-move-drill.sh` | CI and drill callers | Repoint | Drill run; CI only on a pull request |
| `CROSS-CLI.md`, `SYNC.md`, hook README, agent-authoring checklist, agent `README.txt` files | Document the path | Repoint | Path search |

Required inventory: `rg -n "deep-improvement/scripts/check-agent-mirror-sync|references/shared/agent-mirror-crosswalk" --hidden -g '!specs/**'` must print nothing outside the packet after the change.
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
| Unit | The two moved suites | `npx vitest run --config vitest.config.bin.ts` from `.skilled` |
| Integration | Hook calls and the drill | `pre-commit.test.sh`, `broken-move-drill.sh` |
| Manual | Live checker over every agent | `node .skilled/bin/check-agent-mirror-sync.cjs --all` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Built `system-spec-kit/shared/dist` in the worktree | Internal | Green (provisioned) | Checker cannot load its parser |
| DevPass DeepSeek V4.1 Flash | External | Green | Fall back to Cline at `xhigh` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the diff writes outside the allowed paths, or a gate fails beyond its baseline.
- **Procedure**: `git read-tree -u --reset <snapshot>` with the tree hash `dispatch.sh` recorded before the work unit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
WU1 move + repoint ──► orchestrator verify ──► phase docs closed
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WU1 | Baseline | Verify |
| Verify | WU1 | Phase 005 packet deletion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| WU1 | Low | One DeepSeek turn |
| Verification | Low | Four gate runs |
| **Total** | | **Under an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolates main
- [ ] Tree snapshot recorded before WU1

### Rollback Procedure
1. Restore the snapshot tree.
2. Rerun `pre-commit.test.sh` to confirm.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

