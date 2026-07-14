---
title: "sk-git scripts tests: allocator harness"
description: "Hermetic test harness that exercises the worktree-naming allocator, validators and worktree creators inside a throwaway git repo."
trigger_phrases:
  - "worktree naming test harness"
  - "allocator hermetic test"
  - "sk-git scripts tests"
---

# sk-git scripts tests: allocator harness

---

## 1. OVERVIEW

`tests/` holds the harness for `worktree-naming.sh`. It runs entirely inside a throwaway git repo created with `mktemp`, so it never creates refs or worktrees in the real clone. It exercises the grammar validators, the number scan, locked allocation including the concurrent case and both the named and detached worktree creators.

Current state:

- The fixture repo overrides `core.hooksPath` to a `.nohooks` directory, so the shared commit-msg and pre-commit gates never run against throwaway test commits.
- An `EXIT` trap prunes worktrees and removes the temp directory, so a failed run leaves nothing behind.
- The harness uses `set -uo pipefail` without `set -e`, because it tallies pass and fail counts and must keep running after an expected non-zero exit.

---

## 2. DIRECTORY TREE

```text
tests/
`-- worktree-naming.test.sh   # Full harness for worktree-naming.sh
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `worktree-naming.test.sh` | Builds an isolated fixture repo, then asserts grammar, scan, locked allocation and worktree creation |

---

## 4. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh
```

Expected result: the harness prints a pass count and reports `FAIL: 0`. A non-zero exit lists the failing assertion with its expected and actual values.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../worktree-naming.sh`](../worktree-naming.sh)
