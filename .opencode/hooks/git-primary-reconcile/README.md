---
title: "Git Primary Reconcile: Live-Checkout Convergence"
description: "SessionStart primitive that converges the primary checkout onto its live branch, fast-forwarding when behind and rebase-publishing local commits when ahead, across Claude, Codex, Pi, and the OpenCode session-start plugin."
trigger_phrases:
  - "primary checkout reconcile"
  - "live branch reconcile"
  - "primary reconcile"
importance_tier: "reference"
contextType: "reference"
---

# Git Primary Reconcile: Live-Checkout Convergence

---

## 1. OVERVIEW

`git-primary-reconcile/` is the index for the SessionStart primitive that keeps the primary checkout current on its live branch. A session that commits directly in the primary can leave it stranded, behind origin, ahead of origin, or both, so the next session opens against a diverged checkout. This script converges it: it fast-forwards when the checkout is behind and rebase-publishes local commits when it is ahead, so the primary never rests in a half-merged state.

It acts only in the main checkout, only on the resolved live branch, and only when tracked files are clean. It never loses a commit: a rebase conflict is aborted back to the exact pre-rebase HEAD, a pre-existing rebase is refused rather than touched, and a blocked push leaves local commits preserved but unpublished. Every internal failure is non-fatal (exit 0) so session start always continues.

One real script backs the wired runtimes. Claude, Codex, and Pi carry relative symlinks into `.opencode/bin/`; OpenCode launches the same script from its session-start plugin (see [`session-cleanup/`](../session-cleanup/README.md)).

---

## 2. WHAT IT DOES

On each SessionStart, `git-primary-reconcile.sh` runs this flow (every branch exits 0):

1. **Worktree gate.** Resolves `git-dir` and `git-common-dir`; a linked worktree (`git-dir != git-common-dir`) exits immediately: a worktree shares refs with the primary but is owned by a separate session, so moving its branch would cross an ownership boundary. This gate precedes flags, logging, locking, and fetch.
2. **Kill-switches.** Loads the shared `hook-flags.sh` fail-open (warns and continues enabled if the resolver is absent). `hook_enabled live-sync` and `hook_enabled primary-reconcile` each short-circuit to a recorded skip when disabled.
3. **Single-flight lock.** Acquires a lock file in the common dir (TTL 45s, stale-lock reclaim). A held lock records a skip and exits.
4. **Live-branch resolution.** Resolves the current branch. With `SPECKIT_LIVE_BRANCH` unset, only `skilled/v*` release branches auto-resolve as live; anything else skips. The current branch must match the resolved live branch.
5. **Dirty check.** Captures tracked-only dirty state (`git diff` + `git diff --cached`). Untracked build output is intentionally ignored.
6. **Bounded fetch.** `git fetch <REMOTE> <LIVE>` under a network timeout (default 12s). A failed or timed-out fetch skips, leaving the checkout unchanged.
7. **Reconcile.** Compares local and remote tips:

   | Situation | Action |
   |---|---|
   | Tips equal | Skip, already up to date |
   | Local is behind (ancestor of remote) | `git merge --ff-only`; on success `ADVANCE`, on a dirty collision `BLOCK` (ff would overwrite local changes), otherwise `BLOCK` (ff refused) |
   | Local is ahead, clean tree, no pre-existing rebase | `git rebase <REMOTE_TIP>` then `git push <REMOTE> HEAD:<LIVE>`; on success `PUBLISH` |
   | Local is ahead, dirty tree | `SKIP`: rebase needs a clean tree; local commits preserved but unpublished |
   | Local is ahead, pre-existing rebase state | `BLOCK`: refuses to rebase or abort a rebase it did not start |
   | Histories diverged with no local commits to rebase | `BLOCK`, cannot reconcile automatically |

8. **Rebase safety.** On a rebase failure it aborts, then asserts HEAD landed back on the exact pre-rebase commit (force `reset --hard` if needed), no leftover rebase state, and a clean tree: otherwise `CRITICAL BLOCK`. A rebase conflict aborts cleanly with local commits preserved but unpublished.
9. **Push gates.** On a rejected push, it classifies the gate from the push output and prints the fix:

   | Gate | Fix |
   |---|---|
   | `mass-deletion` | `After inspection: SPECKIT_ALLOW_MASS_DELETION=1 git push <REMOTE> HEAD:<LIVE>` |
   | `skill-root-metadata` | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` |
   | `naming` | `Use an owner-first branch name; bypass only with SPECKIT_SKIP_PREPUSH_NAMING=1.` |
   | `remote-permission` | `After explicit approval, retry that one push with SPECKIT_ALLOW_REMOTE_PUSH=1.` |
   | `test-suites` | `Fix the reported test failure or use only the documented operator policy.` |
   | `push-rejected` (default) | `git push <REMOTE> HEAD:<LIVE>` |

Every outcome is recorded as a tab-separated line in `<common-dir>/git-primary-reconcile.log` (timestamp, event, branch, live, detail). Events: `skip`, `advance`, `block`, `publish`.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/git-primary-reconcile.sh` (symlink → `../../../bin/git-primary-reconcile.sh`) | SessionStart hook chain | Stderr status lines (`ADVANCE` / `PUBLISH` / `BLOCK` / `SKIP`); log line in the common dir; always exits 0 |
| **Codex** | `codex/git-primary-reconcile.sh` (symlink) | SessionStart hook chain | Same |
| **Pi** | `pi/git-primary-reconcile.sh` (symlink) | SessionStart hook chain | Same |
| **OpenCode** | launched by `.opencode/plugins/session-cleanup.js` | Plugin `event` on `session.created` | Same script, backgrounded by the session-start plugin; no per-runtime symlink adapter |
| **Cursor** | — | — | Not applicable. No Cursor symlink is wired for this concern. |
| **Devin** | — | — | Not applicable. No Devin symlink is wired for this concern. |

One real file backs the wired runtimes; the per-runtime entries are symlinks into `.opencode/bin/`.

---

## 4. DIRECTORY TREE

```text
git-primary-reconcile/
+-- README.md
+-- claude/   git-primary-reconcile.sh (symlink -> ../../../bin/git-primary-reconcile.sh)
+-- codex/    git-primary-reconcile.sh (symlink)
`-- pi/       git-primary-reconcile.sh (symlink)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/bin/git-primary-reconcile.sh` | The reconcile script. Worktree gate, kill-switches, single-flight lock, live-branch resolution, bounded fetch, fast-forward / rebase-publish, rebase-abort safety assertion, push-gate classification, and tab-separated logging. Always exits 0. |
| `.opencode/plugins/session-cleanup.js` | The OpenCode session-start plugin that launches this script on `session.created` (see [`session-cleanup/`](../session-cleanup/README.md)). Not in this folder. |
| `.opencode/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver (`hook_enabled live-sync`, `hook_enabled primary-reconcile`). Sourced fail-open. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_PRIMARY_RECONCILE_DISABLED=1` | Canonical kill-switch. Turns off this leg alone; the rest of the live-sync loop stays active. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Disables the whole live-sync loop, which includes this leg. Checked before the per-concern flag. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SPECKIT_LIVE_REMOTE=<name>` | Remote to fetch and push (default `origin`). |
| `SPECKIT_LIVE_BRANCH=<name>` | Live branch to reconcile. When unset, only `skilled/v*` release branches auto-resolve. |
| `SPECKIT_PRIMARY_RECONCILE_TIMEOUT=<s>` | Network timeout for fetch and push (default `12`). |
| `SPECKIT_PRIMARY_RECONCILE_LOCK_TTL=<s>` | Single-flight lock TTL (default `45`). |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Scope-gated | Runs only in the main checkout, only on the resolved live branch. A linked worktree exits before any flag, lock, or network call. |
| Never touches uncommitted work | Tracked-only cleanliness; untracked build output is ignored. A dirty tree blocks the rebase/publish path (commits preserved, unpublished) and a dirty collision blocks the fast-forward. |
| Never loses a commit | A rebase conflict aborts back to the exact pre-rebase HEAD (force `reset --hard` if needed, then asserted). A pre-existing rebase is refused, never aborted. A blocked push leaves local commits intact. |
| Non-fatal | Every internal failure, missing git, unresolvable dirs, fetch failure/timeout, missing tips, rebase failure, push rejection, exits 0 so session start continues. |
| Bounded | Fetch and push run under the network timeout via `timeout`/`gtimeout`/`perl alarm`; if no bounded runner exists, network access is refused (skip). Single-flight lock prevents concurrent runs. |
| Imports | Bash only; sources the shared `hook-flags.sh` fail-open. Nothing outside the repo. |
| Real code | Stays in `.opencode/bin/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
bash .opencode/bin/git-primary-reconcile.sh; echo "exit: $?"
```

Expected result: `exit: 0`, with a `[primary-reconcile] ...` status line on stderr (`SKIP` / `ADVANCE` / `BLOCK` / `PUBLISH`) and a recorded line in `<common-dir>/git-primary-reconcile.log`.

```bash
SYSTEM_PRIMARY_RECONCILE_DISABLED=1 bash .opencode/bin/git-primary-reconcile.sh; echo "exit: $?"
```

Expected result: `exit: 0`, a recorded `skip` (disabled by `SYSTEM_PRIMARY_RECONCILE_DISABLED`), no network call.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../session-cleanup/README.md`](../session-cleanup/README.md): the OpenCode session-start plugin that also launches this script.
- [`../git-hooks-check/README.md`](../git-hooks-check/README.md): the installed-hook verification concern.
- [`../../bin/git-primary-reconcile.sh`](../../bin/git-primary-reconcile.sh): the reconcile script's real home.
