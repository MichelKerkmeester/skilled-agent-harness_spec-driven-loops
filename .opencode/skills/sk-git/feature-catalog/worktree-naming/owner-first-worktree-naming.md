---
title: "Numbered worktree/branch naming grammar and allocator"
description: "Per-namespace numbered allocator and validators that give every managed branch and worktree directory a legible, collision-free numbered name."
trigger_phrases:
  - "numbered worktree naming grammar and allocator"
  - "worktree naming allocator"
  - "numbered branch grammar"
  - "worktree-naming.sh"
importance_tier: "important"
version: 1.1.0.0
---

# Numbered worktree/branch naming grammar and allocator (worktree-naming.sh)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Every AI-created branch follows one numbered grammar: `worktrees/NNN-slug` (with the directory `.worktrees/NNN-slug`) for a worktree-backed branch, or `branches/NNN-slug` for a dedicated branch with no worktree. Two flat spec-style namespaces keep the Git-UI branch tree legible as a few clean folders instead of a per-skill pile.

`{NNN}` is a 3-digit, zero-padded per-namespace counter (001..999), never hand-computed. `worktrees/` and `branches/` number independently — a `worktrees/003` and a `branches/003` may coexist — strictly sequential, never skipped, never reused. The script is both the CLI an AI invokes to create a worktree and the validator library the pre-push naming hook sources, so the two surfaces enforce identical rules.

---

## 2. HOW IT WORKS

### Grammar and Directory Pairing

A legal branch is one of several shapes: `main` (reserved), a `skilled/vA.B.C.D` release branch, a `worktrees/NNN-slug` task branch, or a `branches/NNN-slug` dedicated branch. The slug is lowercase kebab-case with no leading, trailing, or doubled hyphen; the number is exactly 3 digits with value 001..999 interpreted base-10. `is_valid_pair` cross-checks that a `worktrees/NNN-slug` branch and a `.worktrees/NNN-slug` directory actually agree with each other — a branch `worktrees/0041-fix-thing` must pair with `.worktrees/0041-fix-thing`, not any other basename. Two legal-but-not-task lanes stay distinct: the launch-wrapper lane (`work/<runtime>/<slug>`, recognized by `is_wrapper_branch`) and safety refs (`backup/<anything>`, recognized by `is_backup_branch`), so callers can tell "exempt lane" apart from "malformed."

### Number Allocation

Git has no way to enforce sequential uniqueness itself, so each namespace's counter is allocated under a clone-wide lock. `scan-max [worktrees|branches]` derives the highest number currently in use in one namespace from three independent sources at once — a persisted per-namespace high-water-mark file, every matching registered worktree's basename (worktrees/ only), and every matching local and remote ref — so a partial or stale read of any one source can never cause a number to be reissued. `allocate [worktrees|branches]` reserves the next number atomically: it takes a lock in the shared common git directory, recomputes the max, writes the namespace's new high-water mark, and only then releases the lock. The lock-acquisition loop steals a stale lock only when its recorded holder process is provably dead, never an active one, which is what prevents two concurrent allocations from ever landing on the same number.

### Creation Commands

`create <slug> [base]` allocates a `worktrees/` number and creates the branch and worktree in one step (`git worktree add -b`), printing `<branch> <dir>` on success; omitting `base` branches off the current checkout, or the live branch when the launch wrapper has exported one. `create-branch <slug> [base]` allocates a `branches/` number and creates a branch with no worktree. `create-detached <slug> [base]` creates a numbered-but-unbranched detached worktree for throwaway experiments — no branch, but the directory is still numbered by the same allocator.

### Validators as a Shared Contract

`validate-slug`, `validate-nnn`, `validate-branch`, `validate-pair`, and `validate-backup` expose the same predicates the allocator uses internally as CLI-callable checks. Because the pre-push naming hook sources this same script rather than reimplementing the grammar, the enforcement gate and the creation path can never drift out of agreement with each other.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Script | Per-namespace number scanning/allocation, grammar validators, worktree/dedicated-branch creation, CLI dispatch |
| `.opencode/skills/sk-git/scripts/migrate-legacy-branch-names.sh` | Script | One-shot renumberer of legacy `OWNER/NNNN-SLUG` worktree pairs into `worktrees/NNN-SLUG` (dry-run by design) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Automated test | Exercises grammar validators and allocator behavior |

---

## 4. SOURCE METADATA

- Group: Worktree Naming
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `worktree-naming/owner-first-worktree-naming.md`

Related references:
- [pre-push-naming-enforcement.md](pre-push-naming-enforcement.md) — Pre-push naming enforcement hook
