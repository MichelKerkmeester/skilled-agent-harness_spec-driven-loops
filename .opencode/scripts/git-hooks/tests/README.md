---
title: "Git-hook regression harnesses"
description: "Executable shell harnesses for Git-hook installation, mass-deletion detection and pre-push branch policy."
trigger_phrases:
  - "git hook test harnesses"
  - "mass deletion guard tests"
  - "pre-push hook tests"
---

# Git-hook regression harnesses

---

## 1. OVERVIEW

This folder contains executable regression harnesses for the repository Git-hook machinery. Each harness creates its own temporary fixture, exercises a real hook or helper and removes the fixture before exit.

These files are test harnesses, not installed Git hooks. The current source inventory is the authoritative list below.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `install-git-hooks-worktree-harness.sh` | Verifies hook placement for a linked worktree and a custom `core.hooksPath`. |
| `mass-deletion-guard.test.sh` | Exercises the guard's threshold, override, add-versus-delete and fail-open verdict logic against a throwaway repository. |
| `pre-push.test.sh` | Exercises the owner-first branch naming gate, migration tolerance, release branches and the explicit bypass. |

---

## 3. VALIDATION

Run the harnesses from the repository root:

```bash
bash .opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh
bash .opencode/scripts/git-hooks/tests/mass-deletion-guard.test.sh
bash .opencode/scripts/git-hooks/tests/pre-push.test.sh
```

Expected result: each command exits with status `0` and prints its pass summary.

---

## 4. BOUNDARIES

- Harness fixtures live in operating-system temporary directories.
- The harnesses do not install hooks into this checkout.
- Test failures exit nonzero and leave the source tree unchanged.

---

## 5. RELATED

- [`Git-hook scripts`](../README.md)
- [`Git-hook installer`](../../install-git-hooks.sh)
