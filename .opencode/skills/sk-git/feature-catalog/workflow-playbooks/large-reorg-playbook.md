---
title: "Large reorg playbook"
description: "Step-ordered runbook for a large rename/reorg that confines file-rename operations to a worktree while deferring the spec-kit toolchain and memory reindex to main after merge."
trigger_phrases:
  - "large reorg playbook"
  - "mass git mv renames"
  - "toolchain on main after merge"
  - "leftover ignored cruft cleanup"
version: 1.0.0.0
---

# Large reorg playbook

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A rename/renumber/reorg touching dozens or more paths — a folder restructure, a phase consolidation, a mass renumber — has failure modes a handful of ordinary renames does not. This playbook is a step-ordered runbook for exactly that case: it does file/rename operations in a worktree only, then runs the spec-kit toolchain and the global memory/vector database reindex on `main` after merge, never inside the worktree.

For a small number of renames on the current branch, the standard commit workflow is sufficient and this playbook is unnecessary.

---

## 2. HOW IT WORKS

### Why the Worktree Cannot Run the Toolchain

A fresh worktree is a clean checkout of tracked files only, so it does not contain gitignored build dependencies (`node_modules`, `dist`). Toolchains that import from those directories break silently inside a bare worktree — some crash on a missing module, and some (worse) simply no-op and report success having touched zero files. Symlinking dependencies into the worktree does not fix this: Node then resolves paths relative to the symlink target, so a generator can walk the wrong root and exit 0 having done no real work. Separately, the memory and vector databases are a single global instance, not one per worktree, so running a reindex from inside a reorg worktree would index paths that do not yet exist on `main`, producing stale or duplicate rows once the merge lands.

### The Runbook Sequence

Before touching anything, the gitignored databases are snapshotted, since `git revert`/`git reset` cannot restore a gitignored directory if a botched reindex corrupts it. The worktree is created from a clean, up-to-date base so the resulting diff is pure rename signal. Renames are performed with `git mv` (not raw `mv` + `git add`, which can register as delete+add and lose blame continuity), and the wave is verified to have landed as `R`-status before committing — content edits are kept in separate commits from pure renames so rename detection stays reliable. After merging back to `main`, the tree is sanity-checked for zero tracked files under the old path prefix, confirming the rename moved rather than copied.

### Post-Merge Cleanup on Main

Everything from this point runs on `main`, the merged tree being the source of truth. `git mv` leaves gitignored cruft (`.DS_Store`, `*.log`, `*.pyc`, build caches) behind in old source directories; a scan finds directories with disk files but zero tracked files and nothing committable, and those are removed. The spec-kit toolchain (metadata regeneration, strict validation) runs only here, where real `node_modules`/`dist` exist, and any strict-validate result obtained from inside the worktree is treated as meaningless. The memory/vector reindex runs here too, exactly once, against the final tree.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/references/large-reorg-playbook.md` | Shared | Step-ordered runbook: snapshot, worktree rename, merge, post-merge toolchain/DB, verify |
| `.opencode/skills/sk-git/references/worktree-workflows.md` | Shared | §8b large-reorg caveats that motivate this playbook |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| — | — | No dedicated automated test or manual playbook scenario exercises the large-reorg runbook itself; verification is the step-by-step checklist in the runbook source |

---

## 4. SOURCE METADATA

- Group: Workflow Playbooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow_playbooks/large_reorg_playbook.md`

Related references:
- [numbered_worktree_workflows.md](numbered-worktree-workflows.md) — Numbered worktree workflows
- [conventional_commit_workflows.md](conventional-commit-workflows.md) — Conventional commit workflows
