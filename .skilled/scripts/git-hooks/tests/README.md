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
| `autostash-orphan-guard.test.sh` | Exercises the guard through the shipped `post-rewrite` and `post-commit` hooks in a throwaway repository: a conflicting `git rebase --autostash` must be anchored from the sequencer's recorded object with no manual guard call, and a later commit must anchor a leftover `autostash` stash entry. Where the toolchain ships, each of the three hooks warns when the guard library is missing, and an autosync commit warns about a missing kill switch or publisher. Under a linked source root the guard still anchors and logs under `.skilled/logs`. |
| `commit-msg.test.sh` | Exercises the blocking commit-message grammar against a throwaway repository: the accepted type(scope) form, the numeric-scope refusal, the four-path explanatory-body gate when the body is only the `Spec:`/`Commit-Id:` trailers, a space-form `Spec` line that must count as prose rather than a trailer, a malformed `Commit-Id`, an id already used on another branch, an amend reusing its own HEAD id, and the bypass. A 110-character `Spec:` line must not trip the 100-character body-length warning. |
| `install-git-hooks-worktree-harness.sh` | Verifies hook placement for a linked worktree and a custom `core.hooksPath`. A `--status` case sets a global `core.hooksPath` and asserts it is named with its scope. |
| `mass-deletion-guard.test.sh` | Exercises the guard's threshold, override, add-versus-delete and fail-open verdict logic against a throwaway repository. |
| `pre-commit.test.sh` | Exercises both auto re-mint gates against throwaway fixtures. Compiled routing: the no-op path, a successful re-mint with both manifests confirmed in the index, a partly staged input, a missing authored manifest, a mint failure, a pathspec-narrowed commit and a staged deletion. Spec derived metadata: the same refusal shapes plus a no-op repair that must stay silent, a `scratch/` file that is not a packet document, a phase child that must resolve to itself rather than its parent, a metadata-only directory the gate must walk past, and a two-packet commit asserting the batch costs exactly one process. A route and a spec block must name their bypass flag, and a packet dirty only in its derived metadata must re-derive rather than block. Source-root cases stage `.skilled/` paths through each filter, re-mint a hub through a linked source root, block on each missing gate script where the toolchain ships and keep a repository without the toolchain committable. The legacy hygiene helper gets the same cases. |
| `pre-push.test.sh` | Exercises the remote-permission gate: creating a branch is refused unless it is allowlisted or named in the approval, an update needs approval, `main` and `skilled/v*` pass with nothing set, the allowlist file extends those exemptions, the live autosync branch is exempt and a broken validator fails open. A range under `.skilled/skills` reaches the skill-root metadata checker, and routing drift under `.skilled/` blocks. Where the toolchain ships, a missing permission script, deletion library or route guard blocks while release branches and approvals still pass. |
| `prepare-commit-msg.test.sh` | Exercises the stamper against a throwaway repository carrying the real allocator: a `message` source mints and separates the block from prose by a blank line, a `template` source mints, a `Context:`-only body gets its blank line, an amend keeps its id, a cherry-pick with `CHERRY_PICK_HEAD` present re-mints and drops the copied id, a `merge` source is untouched, a second run changes nothing, comment lines (and a `git commit -v` scissors/diff tail) stay below the block, a configured `core.commentChar` is honored, `SPECKIT_COMMIT_SPEC` adds `Spec:` once, an allocator failure reports one line and leaves the message unstamped, a foreign repository without the allocator is untouched, the bypass skips, and a real commit through both hooks keeps the stamped id. Where the toolchain ships, a missing allocator warns once and leaves the message unstamped, and an allocator under a linked source root still stamps. |
| `source-root-selection.test.sh` | Holds every copy of the hooks' source-root selection block identical, fails on any hook, checker or installer that builds a tree path by naming one root, and runs the block in each layout: both roots, `.skilled` only, `.opencode` only, an empty `.skilled` placeholder, per-entry links and a repository without the toolchain. |

---

## 3. VALIDATION

Run the harnesses from the repository root:

```bash
bash .opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh
bash .opencode/scripts/git-hooks/tests/commit-msg.test.sh
bash .opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh
bash .opencode/scripts/git-hooks/tests/mass-deletion-guard.test.sh
bash .opencode/scripts/git-hooks/tests/pre-commit.test.sh
bash .opencode/scripts/git-hooks/tests/pre-push.test.sh
bash .opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh
bash .opencode/scripts/git-hooks/tests/source-root-selection.test.sh
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
