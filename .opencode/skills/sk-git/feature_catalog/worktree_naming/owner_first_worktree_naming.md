---
title: "Owner-first worktree naming grammar and allocator"
description: "Clone-wide numbered allocator and validators that give every managed branch and worktree directory a legible, collision-free owner-first name."
trigger_phrases:
  - "owner-first worktree naming grammar and allocator"
  - "worktree naming allocator"
  - "owner-first branch grammar"
  - "worktree-naming.sh"
importance_tier: "important"
version: 1.0.0.0
---

# Owner-first worktree naming grammar and allocator (worktree-naming.sh)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Every AI-created branch and worktree directory follows one owner-first grammar: `<owner>/NNNN-<slug>` paired with `.worktrees/NNNN-<owner>-<slug>`. This makes a Git-UI branch tree legible by owning skill instead of a flat pile of ad hoc names.

`{owner}` is a canonical skill id — the `name:` frontmatter of any checked-in `.opencode/skills/**/SKILL.md` — or the literal `skilled` for cross-cutting, system, or release work. `{NNNN}` is a 4-digit, zero-padded, clone-wide counter, never hand-computed. The script is both the CLI an AI invokes to create a worktree and the validator library the pre-push naming hook sources, so the two surfaces enforce identical rules.

---

## 2. HOW IT WORKS

### Grammar and Directory Pairing

A legal branch is one of three shapes: `main` (reserved), a `skilled/vA.B.C.D` release branch, or an owner-first task branch `<owner>/NNNN-<slug>`. The slug is lowercase kebab-case with no leading, trailing, or doubled hyphen. `is_valid_pair` cross-checks that a branch and a directory actually agree with each other — a branch `sk-git/0041-fix-thing` must pair with `.worktrees/0041-sk-git-fix-thing`, not any other basename. A separate, unnumbered launch-wrapper lane (`work/<runtime>/<slug>`) is recognized by `is_wrapper_branch` as a legal-but-distinct namespace, so callers can tell "exempt wrapper" apart from "malformed."

### Number Allocation

Git has no way to enforce uniqueness scoped to a single owner prefix, so the counter is clone-wide. `scan-max` derives the highest number currently in use from three independent sources at once — a persisted high-water-mark file, every registered worktree's basename, and every local and remote ref — so a partial or stale read of any one source can never cause a number to be reissued. `allocate` reserves the next number atomically: it takes a lock in the shared common git directory, recomputes the max, writes the new high-water mark, and only then releases the lock. The lock-acquisition loop steals a stale lock only when its recorded holder process is provably dead, never an active one, which is what prevents two concurrent allocations from ever landing on the same number.

### Creation Commands

`create <owner> <slug> [base]` allocates a number and creates the branch and worktree in one step (`git worktree add -b`), printing `<branch> <dir>` on success; omitting `base` branches off the current checkout, or the live branch when the launch wrapper has exported one. `create-detached <slug> [base]` creates a numbered-but-unbranched detached worktree for throwaway experiments — no owner and no branch, but the directory is still numbered by the same allocator.

### Validators as a Shared Contract

`validate-owner`, `validate-slug`, `validate-branch`, and `validate-pair` expose the same predicates the allocator uses internally as CLI-callable checks. Because the pre-push naming hook sources this same script rather than reimplementing the grammar, the enforcement gate and the creation path can never drift out of agreement with each other.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Script | Owner discovery, number scanning/allocation, grammar validators, worktree creation, CLI dispatch |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Automated test | Exercises grammar validators and allocator behavior |

---

## 4. SOURCE METADATA

- Group: Worktree Naming
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `worktree_naming/owner_first_worktree_naming.md`

Related references:
- [pre_push_naming_enforcement.md](pre_push_naming_enforcement.md) — Pre-push naming enforcement hook
