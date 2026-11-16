---
title: "Git Primary Reconcile: Live-Checkout Convergence"
description: "SessionStart primitive that converges the primary checkout onto its live branch, fast-forwarding when behind and rebase-publishing local commits when ahead, across Claude, Codex, Cursor, Devin, DSH, Pi, OpenCode and Vibe."
trigger_phrases:
  - "primary checkout reconcile"
  - "live branch reconcile"
  - "primary reconcile"
  - "claude primary reconcile"
  - "live branch convergence"
  - "sessionstart git reconcile"
  - "codex primary reconcile"
  - "cursor primary reconcile"
  - "devin primary reconcile"
  - "dsh primary reconcile"
  - "repo-guards session start"
  - "pi primary reconcile"
  - "session start advisories"
importance_tier: "normal"
contextType: "reference"
---

# Git Primary Reconcile: Live-Checkout Convergence

---

## 1. OVERVIEW

`git-primary-reconcile/` indexes the script that keeps the primary checkout current on its live branch. A session that commits in the primary can leave it behind origin, ahead of it or both. The next session then opens against a diverged checkout.

The script converges that checkout. It fast-forwards when the checkout is behind. It rebase-publishes local commits when the checkout is ahead. The primary never rests in a half-merged state.

It acts only in the main checkout, only on the resolved live branch and only when tracked files are clean. It never loses a commit. A rebase conflict aborts back to the exact pre-rebase HEAD. A pre-existing rebase is refused rather than touched. A blocked push leaves local commits preserved but unpublished. Every internal failure exits 0, so session start always continues.

Six folders here hold a link into `.skilled/bin/`. No registration names a path in this folder, so nothing loads through them. Claude, Codex, Cursor and Devin call the real script from their hook file. Pi and DSH call it from their session-start adapters. OpenCode starts it from its plugin in `session-cleanup/`. Vibe reaches it through that same plugin, from its `session_start` hook.

---

## 2. HOW IT WORKS

`git-primary-reconcile.sh` runs one flow at session start. Every branch exits 0.

1. **Worktree gate.** The script resolves `git-dir` and `git-common-dir`. A linked worktree has `git-dir != git-common-dir` and exits at once. A worktree shares refs with the primary but belongs to a separate session. Moving its branch here would cross that ownership boundary. This gate precedes flags, logging, locking and fetch.
2. **Kill-switches.** It sources the shared `hook-flags.sh` fail-open. A missing resolver warns and leaves the concern enabled. `hook_enabled live-sync` and `hook_enabled primary-reconcile` each record a skip and exit when disabled.
3. **Single-flight lock.** It takes a lock file in the common dir with a 45-second TTL. A stale lock is reclaimed. A held lock records a skip and exits.
4. **Live-branch resolution.** It reads the current branch. With `SPECKIT_LIVE_BRANCH` unset, only `skilled/v*` release branches count as live. Anything else skips. The current branch must match the resolved live branch.
5. **Dirty check.** It captures tracked-only dirty state from `git diff` and `git diff --cached`. Untracked build output is ignored on purpose.
6. **Bounded fetch.** It runs `git fetch <REMOTE> <LIVE>` under a network timeout, 12 seconds by default. A failed or timed-out fetch skips and leaves the checkout unchanged.
7. **Reconcile.** It compares the local and remote tips.

   | Situation | Action |
   |---|---|
   | Tips equal | Skip, already up to date |
   | Local is behind | `git merge --ff-only`. `ADVANCE` on success, `BLOCK` on a dirty collision or a refused fast-forward |
   | Local is ahead, clean tree, no rebase in progress | `git rebase <REMOTE_TIP>` then `git push <REMOTE> HEAD:<LIVE>`. `PUBLISH` on success |
   | Local is ahead, dirty tree | `SKIP`. A rebase needs a clean tree, so local commits stay unpublished |
   | Local is ahead, rebase already in progress | `BLOCK`. It refuses to rebase or abort a rebase it did not start |
   | Histories diverged, no local commits to rebase | `BLOCK`. It cannot reconcile automatically |

8. **Rebase safety.** A failed rebase is aborted. The script then asserts HEAD landed on the exact pre-rebase commit, forcing `reset --hard` when it did not. It also asserts no leftover rebase state and a clean tree. A failed assertion is `CRITICAL BLOCK`. A clean abort records a plain `BLOCK` instead, keeps the local commits unpublished and prints a resolve hint.
9. **Push gates.** A rejected push is classified from the push output, and the script prints the fix.

   | Gate | Fix |
   |---|---|
   | `mass-deletion` | `After inspection: SPECKIT_ALLOW_MASS_DELETION=1 git push <REMOTE> HEAD:<LIVE>` |
   | `skill-root-metadata` | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` |
   | `remote-create` | `Creating a branch on origin is a decision: SPECKIT_ALLOW_REMOTE_PUSH=<branch> git push <REMOTE> HEAD:<LIVE>` |
   | `remote-permission` | `After explicit approval, retry that one push with SPECKIT_ALLOW_REMOTE_PUSH=1.` |
   | `test-suites` | `Fix the reported test failure or use only the documented operator policy.` |
   | `push-rejected` (default) | `git push <REMOTE> HEAD:<LIVE>` |

Every outcome is one tab-separated line in `<common-dir>/git-primary-reconcile.log`. The line holds a timestamp, the event, the branch, the live branch and a detail. The events are `skip`, `advance`, `block` and `publish`.

Fetch and push run under `timeout`, `gtimeout` or `perl alarm`. With no bounded runner the script refuses network access and skips.

Every internal failure exits 0. A missing git binary warns and skips. A checkout that is not a Git repository exits 0 with no output. Unresolvable Git directories warn and skip. A missing local or remote tip skips. Session start always continues.

These boundaries hold on every path:

- **Scope.** Runs only in the main checkout, only on the resolved live branch. A linked worktree exits before any flag, lock or network call.
- **Uncommitted work.** Cleanliness is tracked-only, so untracked build output is ignored. A dirty tree blocks the rebase and publish path. A dirty collision blocks the fast-forward.
- **Commits.** A rebase conflict aborts back to the exact pre-rebase HEAD. A pre-existing rebase is refused, never aborted. A blocked push leaves local commits intact.
- **Bounded.** Fetch and push run under the network timeout. The single-flight lock prevents concurrent runs.
- **Imports.** Bash only. It sources the shared `hook-flags.sh` fail-open and nothing outside the repository.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart [id git-primary-reconcile, timeout 3]` | `claude/git-primary-reconcile.sh` | `.skilled/bin/git-primary-reconcile.sh` | Nothing. Both streams are discarded. |
| Codex | `SessionStart [id git-primary-reconcile, timeout 3]` | `codex/git-primary-reconcile.sh` | `.skilled/bin/git-primary-reconcile.sh` | Nothing. Both streams are discarded. |
| Cursor | `sessionStart [id git-primary-reconcile, timeout 10]` | `cursor/git-primary-reconcile.sh` | `.skilled/bin/git-primary-reconcile.sh` | Nothing. Both streams are discarded. |
| Devin | `SessionStart [id git-primary-reconcile, timeout 3]` | `devin/git-primary-reconcile.sh` | `.skilled/bin/git-primary-reconcile.sh` | Nothing. Both streams are discarded. |
| DSH | `agent/created` | `dsh/git-primary-reconcile.sh` | `.skilled/bin/git-primary-reconcile.sh` | Nothing. The adapter spawns it detached. |
| Pi | `session_start` | `pi/git-primary-reconcile.sh` | `.skilled/bin/git-primary-reconcile.sh` | Nothing. The adapter backgrounds it. |
| OpenCode | `session.created` | None | `.opencode/plugins/session-cleanup.js` | Nothing. The plugin spawns it detached. |
| Vibe | `session_start` | None | `.vibe/plugins/repo-guards/session-cleanup.mjs` | Nothing from the script. |

Claude, Codex, Cursor and Devin register the script in `hook-registry.json` under the id `git-primary-reconcile`. Claude, Codex and Devin give it 3 seconds and Cursor gives it 10. Each one backgrounds the run and discards both streams, so session start never waits on the network.

Pi runs the script at `session_start` with the reason `startup` or `new`. The adapter in `session-start-advisories.ts` backgrounds it under the concern `session-lifecycle` and throws its output away. DSH runs it at `agent/created` with source `startup` only, when both `session-lifecycle` and `primary-reconcile` are on. That adapter spawns it detached and ignores both streams. A fan-out leaf skips it, because a disposable child must not own background git work.

OpenCode starts the script from `.opencode/plugins/session-cleanup.js`. The plugin's `event` handler starts it on `session.created`, once per session id, detached with both streams ignored. The plugin runs only while the `session-cleanup` concern is on.

Vibe runs the script at `session_start`. Its `.vibe/hooks.toml` entry calls `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, which runs `.vibe/plugins/repo-guards/session-cleanup.mjs`. That hook reuses `.opencode/plugins/session-cleanup.js`, fires its `session.created` event and returns the other guards' warnings as `additional_context`. It skips when the `session-cleanup` concern is off.

A failed launch is logged by the OpenCode plugin and ignored by DSH and Pi. Claude, Codex, Cursor and Devin discard both streams, so a launch failure prints nothing there. On every runtime the reconcile log is the only trace of a run.

---

## 4. DIRECTORY TREE

```text
git-primary-reconcile/
+-- README.md
+-- claude/   git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- codex/    git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- cursor/   git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- devin/    git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
+-- dsh/      git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
`-- pi/       git-primary-reconcile.sh -> ../../../bin/git-primary-reconcile.sh
```

Each runtime folder holds one link into `.skilled/bin/`. The link is relative, so it survives a move of the checkout.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/git-primary-reconcile.sh` | The reconcile script. Worktree gate, kill-switches, single-flight lock, live-branch resolution, bounded fetch, fast-forward or rebase-publish, rebase-abort assertion, push-gate classification and tab-separated logging. Always exits 0. |
| `.opencode/plugins/session-cleanup.js` | The OpenCode session-start plugin. It launches this script on `session.created`. |
| `.skilled/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver. The script sources it fail-open and asks for `hook_enabled live-sync` and `hook_enabled primary-reconcile`. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The Pi adapter. It backgrounds the script at `session_start` under `session-lifecycle`. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | The DSH adapter. It spawns the script detached at `agent/created` under `primary-reconcile`. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds the `git-primary-reconcile` entry for Claude, Codex, Cursor and Devin. It also names the Pi extension `session-start-advisories.ts`. |

---

## 6. CONFIGURATION

The concern is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Variable | Effect |
|---|---|
| `SYSTEM_PRIMARY_RECONCILE_DISABLED=1` | Canonical kill-switch. Turns off this leg alone, and the rest of the live-sync loop stays active. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Disables the whole live-sync loop, which includes this leg. Checked before the per-concern flag. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch. Disables this concern along with every other repo hook. |
| `SPECKIT_LIVE_REMOTE=<name>` | Remote to fetch and push. The default is `origin`. |
| `SPECKIT_LIVE_BRANCH=<name>` | Live branch to reconcile. When unset, only `skilled/v*` release branches auto-resolve. |
| `SPECKIT_PRIMARY_RECONCILE_TIMEOUT=<s>` | Network timeout for fetch and push. The default is `12`. |
| `SPECKIT_PRIMARY_RECONCILE_LOCK_TTL=<s>` | Single-flight lock TTL. The default is `45`. |

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment wins over the file, so a persisted default can be overridden for one session.

---

## 7. VALIDATION

Run from the repository root.

```bash
bash .skilled/bin/git-primary-reconcile.sh; echo "exit: $?"
```

Expected result: `exit: 0`. In a linked worktree the script exits at once, before any output. From the primary checkout every outcome writes one line to `<common-dir>/git-primary-reconcile.log`.

Only some outcomes also print a `[primary-reconcile] ...` line on stderr. A fetch or tip failure prints one. So does a dirty-tree skip. The ADVANCE, BLOCK and PUBLISH outcomes print one too. The status word is `SKIP`, `ADVANCE`, `BLOCK` or `PUBLISH`.

A missing git binary or an unresolvable Git directory warns before the log file exists. A failed flag resolver warns and continues with the concern enabled.

```bash
SYSTEM_PRIMARY_RECONCILE_DISABLED=1 bash .skilled/bin/git-primary-reconcile.sh; echo "exit: $?"
```

Expected result: `exit: 0`, a recorded `skip` for `SYSTEM_PRIMARY_RECONCILE_DISABLED` and no network call.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../session-cleanup/README.md`](../session-cleanup/README.md): the OpenCode session-start plugin that also launches this script.
- [`../git-hooks-check/README.md`](../git-hooks-check/README.md): the installed-hook verification concern.
- [`../shared/README.md`](../shared/README.md): the switch resolver this script sources.
- [`../../bin/git-primary-reconcile.sh`](../../bin/git-primary-reconcile.sh): the reconcile script's real home.
