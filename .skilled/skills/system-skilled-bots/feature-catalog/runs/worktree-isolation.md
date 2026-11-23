---
title: "Worktree isolation"
description: "Gives a bot that declares worktree isolation its own numbered worktree, and removes it only when clean."
trigger_phrases:
  - "worktree isolation"
  - "bot worktree"
  - "isolation worktree"
  - "kept bot worktree"
version: 1.0.0.0
---

# Worktree isolation

## 1. OVERVIEW

Gives a bot that declares worktree isolation its own numbered worktree, and removes it only when clean.

An unattended run with `isolation: worktree` edits in a tree of its own, so it never writes into the operator's working tree. A bot with `isolation: shared` runs in the checkout itself. Losing a bot's work is worse than a tree left on disk, so removal is conservative.

---

## 2. HOW IT WORKS

The tree comes from sk-git's numbering script, which allocates the number under a lock and creates the branch, because a bot must never create a branch with git primitives and two concurrent runs must never share a number. It is placed under the configured worktree base, outside the checkout and outside the Skilled tree. It gets the launcher's shared paths, or the repository's `worktreeSharedPaths`, as links instead of a full install, so setup needs no network. The runner creates the tree just before dispatch, after every refusal but the executor's own.

Every link made is recorded, and a tree is removed only after each recorded link is unlinked as a link and never followed, so a removal cannot walk into the main checkout's dependencies. A tree is removed only when it is clean, still at its base commit and has no stash. Clean includes gitignored files, because removing the tree deletes them and a bot's report or build output often lands in an ignored folder: a tree whose only changes are ignored is kept as `ignored-changes`, and one with other changes as `dirty`. Anything else is kept and reported with its path and branch, and git's own refusal is a reason to keep it. A killed run's tree is never removed by the reclaim.

The tree is removed or kept before the terminal record, so the record and the delivery notice both say which. A parked run keeps its tree, and the resumed run reopens it. A resumed run whose parked tree is gone is refused as `parked-worktree-missing`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` | Shared | Shared-path resolution, worktree base, create, reopen, inspect and finish |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Script | Allocates the worktree number under a lock and creates the branch |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Shared | Creates the tree before dispatch and settles it before the terminal record |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts` | Vitest | Worktree placement, removal rules, a tree kept for gitignored changes and worktree runs through the runner |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved` | Fixture | A definition whose shared paths do not resolve |

---

## 4. SOURCE METADATA

- Group: Runs
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runs/worktree-isolation.md`

Related references:
- [executor-posture-and-secret-guard.md](executor-posture-and-secret-guard.md) - the posture check that admits the isolation value
- [run-record-and-result-ledger.md](run-record-and-result-ledger.md) - the worktree evidence the record carries
