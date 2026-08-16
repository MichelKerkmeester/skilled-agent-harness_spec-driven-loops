---
title: "sk-git scripts: worktree/branch naming allocator and validators"
description: "The numbered-worktree allocator, its grammar validators and the test harness that exercises them inside a throwaway repo."
trigger_phrases:
  - "worktree naming allocator"
  - "numbered worktree branch validators"
  - "sk-git scripts folder"
---

# sk-git scripts: worktree/branch naming allocator and validators

---

## 1. OVERVIEW

`scripts/` holds the executable core of sk-git's numbered-worktree system. `worktree-naming.sh` allocates numbers for two independent per-namespace counters (`worktrees/` and `branches/`) under a clone-wide lock, creates the branch and directory together and validates every part of the naming grammar. The pre-push hook sources the same file to reuse its validators, so the allocator and the enforcement gate cannot drift apart.

Current state:

- Each namespace (`worktrees/` and `branches/`) numbers independently from its own high-water mark; the allocator seeds its max from that stored mark, every matching local plus remote ref, and (for `worktrees/`) every registered worktree basename, so a partial scan never reissues a live number and a gap is never back-filled.
- Strict mode (`set -euo pipefail`) is scoped to direct execution, so a caller that sources the file for its validators does not inherit `set -e`.
- The validators (`is_valid_slug`, `is_valid_nnn`, `is_valid_branch`, `is_wrapper_branch`, `is_backup_branch`, `is_valid_pair`, `is_remote_push_allowlisted`) are the single source of truth for the grammar, shared with the pre-push hook.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- worktree-naming.sh             # Allocator, worktree creators and grammar validators
+-- migrate-legacy-branch-names.sh # One-shot renumberer for the pre-grammar owner-first names
`-- tests/                         # Hermetic test harness for the allocator
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `worktree-naming.sh` | Per-namespace number allocation under a lock, worktree/dedicated-branch creation and grammar validation |
| `migrate-legacy-branch-names.sh` | Renumber legacy `OWNER/NNNN-SLUG` worktree pairs into `worktrees/NNN-SLUG` (dry-run by design; see its header) |
| `tests/worktree-naming.test.sh` | Runs the allocator inside a throwaway git repo and asserts grammar, scan, locked allocation, no-skip and the creators |

---

## 4. ENTRYPOINTS

Run from any location inside the clone. All subcommands operate on the shared common Git dir, so the counters are clone-wide, not per-worktree.

| Command | Type | Purpose |
|---|---|---|
| `create <slug> [base]` | CLI | Allocate a `worktrees/` number, then create branch `worktrees/NNN-slug` and directory `.worktrees/NNN-slug` together |
| `create-branch <slug> [base]` | CLI | Allocate a `branches/` number and create branch `branches/NNN-slug` with NO worktree |
| `create-detached <slug> [base]` | CLI | Create a numbered detached worktree (no branch) in the `worktrees/` namespace |
| `allocate [worktrees\|branches]` | CLI | Reserve the next number in a namespace under the lock and print it (default `worktrees`) |
| `next [worktrees\|branches]` | CLI | Preview the next number without reserving it (no lock or write) |
| `scan-max [worktrees\|branches]` | CLI | Print the current maximum in a namespace across the high-water mark, matching worktrees and refs |
| `validate-slug <slug>` | CLI | Exit 0 when the slug is lowercase kebab |
| `validate-nnn <nnn>` | CLI | Exit 0 when the number is 3-digit 001..999 (base-10, not octal) |
| `validate-branch <branch>` | CLI | Exit 0 when the branch matches the numbered grammar (`main`, `skilled/v*`, `worktrees/NNN-slug`, `branches/NNN-slug`, `backup/*`, `work/*`) |
| `validate-pair <branch> <dir>` | CLI | Exit 0 when a `worktrees/NNN-slug` branch and `.worktrees/NNN-slug` directory agree |
| `validate-backup <branch>` | CLI | Exit 0 when the branch is a `backup/*` safety ref |
| `validate-remote-allowlist <branch>` | CLI | Check the remote-push-permission allowlist |

```bash
# Allocate and create in one step
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create add-oauth-login

# Create a dedicated branch with no worktree
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create-branch external-dep

# Reserve a number in either namespace
bash .opencode/skills/sk-git/scripts/worktree-naming.sh allocate worktrees
bash .opencode/skills/sk-git/scripts/worktree-naming.sh allocate branches

# Reuse the validators from another script
source .opencode/skills/sk-git/scripts/worktree-naming.sh
is_valid_branch "worktrees/007-add-oauth-login" && echo ok
```

---

## 5. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh
```

Expected result: the harness prints a summary line ending in `FAIL=0` (for example `worktree-naming tests: PASS=65 FAIL=0`).

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`tests/README.md`](./tests/README.md)
- [`../references/worktree-workflows.md`](../references/worktree-workflows.md)
