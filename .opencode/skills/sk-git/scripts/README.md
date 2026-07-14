---
title: "sk-git scripts: worktree naming allocator and validators"
description: "The owner-first worktree allocator, its grammar validators and the test harness that exercises them inside a throwaway repo."
trigger_phrases:
  - "worktree naming allocator"
  - "owner-first branch validators"
  - "sk-git scripts folder"
---

# sk-git scripts: worktree naming allocator and validators

---

## 1. OVERVIEW

`scripts/` holds the executable core of sk-git's owner-first worktree system. `worktree-naming.sh` allocates globally unique numbers under a clone-wide lock, creates the branch and directory together and validates every part of the naming grammar. The pre-push hook sources the same file to reuse its validators, so the allocator and the enforcement gate cannot drift apart.

Current state:

- The allocator seeds its maximum from the stored high-water mark, every registered worktree basename and all local plus remote refs, so a partial scan never reissues a live number.
- Strict mode (`set -euo pipefail`) is scoped to direct execution, so a caller that sources the file for its validators does not inherit `set -e`.
- The validators (`is_valid_owner`, `is_valid_slug`, `is_valid_branch`, `is_valid_pair`) are the single source of truth for the grammar, shared with the pre-push hook.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- worktree-naming.sh     # Allocator, worktree creators and grammar validators
`-- tests/                 # Hermetic test harness for the allocator
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `worktree-naming.sh` | Owner-first number allocation under a lock, worktree creation and grammar validation |
| `tests/worktree-naming.test.sh` | Runs the allocator inside a throwaway git repo and asserts grammar, scan, locked allocation and creators |

---

## 4. ENTRYPOINTS

Run from any location inside the clone. All subcommands operate on the shared common Git dir, so the counter is clone-wide, not per-worktree.

| Command | Type | Purpose |
|---|---|---|
| `create <owner> <slug>` | CLI | Allocate a number, then create the branch and worktree directory together |
| `create-detached <owner> <slug>` | CLI | Create a detached worktree without an owner-first branch |
| `allocate` | CLI | Reserve the next number under the lock and print it |
| `next` | CLI | Print the next number without reserving it |
| `scan-max` | CLI | Print the current maximum across the high-water mark, worktrees and refs |
| `validate-owner <owner>` | CLI | Exit 0 when the owner is a valid skill id or `skilled` |
| `validate-slug <slug>` | CLI | Exit 0 when the slug is lowercase kebab |
| `validate-branch <branch>` | CLI | Exit 0 when the branch matches the owner-first grammar |
| `validate-pair <owner> <slug>` | CLI | Exit 0 when the owner and slug agree |
| `skill-ids` | CLI | List the owner ids the allocator recognizes |

```bash
# Allocate and create in one step
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create sk-git add-oauth-login

# Reuse the validators from another script
source .opencode/skills/sk-git/scripts/worktree-naming.sh
is_valid_branch "sk-git/0007-add-oauth-login" && echo ok
```

---

## 5. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh
```

Expected result: the harness prints a pass count with `FAIL: 0`.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`tests/README.md`](./tests/README.md)
- [`../references/worktree-workflows.md`](../references/worktree-workflows.md)
