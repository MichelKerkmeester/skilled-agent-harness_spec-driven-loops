---
title: "Git-hook regression harnesses"
description: "Executable shell harnesses for Git-hook installation, memory-drift locking and pre-push branch policy."
trigger_phrases:
  - "git hook test harnesses"
  - "memory drift lock tests"
  - "pre-push hook tests"
---

# Git-hook regression harnesses

---

## 1. OVERVIEW

This folder contains executable regression harnesses for the repository Git-hook machinery. Each harness creates its own temporary fixture, exercises a real hook or helper and removes the fixture before exit.

These files are test harnesses, not installed Git hooks. The current source inventory is the authoritative list below.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `install-git-hooks-worktree-harness.sh` | Verifies hook placement for a linked worktree and a custom `core.hooksPath`. |
| `memory-drift-marker-lock-harness.sh` | Exercises marker locking, stale-lock handling, concurrent writers, failed writes and token-checked release. |
| `pre-push.test.sh` | Exercises the owner-first branch naming gate, migration tolerance, release branches and the explicit bypass. |

## 3. VALIDATION

Run the harnesses from the repository root:

```bash
bash .opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh
bash .opencode/scripts/git-hooks/tests/memory-drift-marker-lock-harness.sh
bash .opencode/scripts/git-hooks/tests/pre-push.test.sh
```

Expected result: each command exits with status `0` and prints its pass summary. The recorded source run passed the linked-worktree installer checks, all memory-drift producer scenarios and all pre-push cases.

## 4. BOUNDARIES

- Harness fixtures live in operating-system temporary directories.
- The harnesses do not install hooks into this checkout.
- Test failures exit nonzero and leave the source tree unchanged.

## 5. RELATED

- [`Git-hook scripts`](../README.md)
- [`Git-hook installer`](../../install-git-hooks.sh)
