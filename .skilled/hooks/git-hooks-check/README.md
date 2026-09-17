---
title: "Git Hooks Check: Installed-Hook Verification"
description: "SessionStart guard that verifies the repo's versioned git hooks are installed and current across Claude, Codex, Cursor, and Devin, warns on drift, and self-heals from the main checkout when live-sync is on."
trigger_phrases:
  - "check git hooks"
  - "git hook verification"
  - "git hook drift"
importance_tier: "reference"
contextType: "reference"
---

# Git Hooks Check: Installed-Hook Verification

---

## 1. OVERVIEW

`git-hooks-check/` is the index for the SessionStart guard that verifies the repository's managed git hooks are installed and current. A fresh clone or a forgotten install step leaves a versioned hook under `.opencode/scripts/git-hooks/` with no matching effective symlink in `.git/hooks`: a silent gap that can drop commit-msg, pre-commit, or pre-push coverage. This guard detects that state and warns the operator, so the commit/push guardrails stay in force.

It is the detect-and-warn companion to `install-git-hooks.sh`. A SessionStart hook cannot install missing git hooks into an already-running session without side effects, but it can warn: and, when the live-sync loop is enabled, self-heal from the main checkout. It is intentionally non-fatal: it prints one warning line to stderr and always exits 0, so it never blocks a session.

One real script backs all four editor runtimes; the per-runtime entries are relative symlinks into `.opencode/bin/`.

---

## 2. WHAT IT DOES

On each SessionStart, `check-git-hooks.sh`:

1. Checks the caller-side silence switch (`SPECKIT_GIT_HOOKS_GUARD=off`) and the shared kill-switch (`hook_enabled git-hooks-check`, fail-open if the resolver is absent). Either disabled → exit 0.
2. Resolves the repo root, the versioned hook source dir (`.opencode/scripts/git-hooks`), and the effective hook target dir (`git rev-parse --git-path hooks`). Not a git repo, no source dir, or no target dir → exit 0.
3. For every versioned hook in the source dir (skipping `README.md`), checks the matching `.git/hooks/<name>` symlink and classifies it:

   | State | Meaning |
   |---|---|
   | `missing` | No symlink at the target path |
   | `broken` | Symlink exists but its target does not |
   | `mismatched` | Symlink resolves to a different path than the versioned source |
   | `non-executable` | Symlink is valid but not executable |

4. If any hook is invalid, prints one line to stderr naming every invalid hook and the fix command:

   ```text
   [check-git-hooks] Invalid git hook symlink(s): pre-commit (missing), commit-msg (mismatched). Fix: bash .opencode/scripts/install-git-hooks.sh (silence: SPECKIT_GIT_HOOKS_GUARD=off)
   ```

5. **Self-heal:** when the live-sync loop is enabled (`hook_enabled live-sync`), auto-runs `install-git-hooks.sh` from the MAIN checkout only. It compares `git-dir` to `git-common-dir` and skips the self-heal in a linked worktree, because a worktree shares the main checkout's hooks dir and installing from a session tree would point the shared symlinks at scripts that vanish when the worktree is removed. On success it prints `[check-git-hooks] auto-installed git hook symlinks (self-heal)`; on failure `[check-git-hooks] self-heal install failed; run it manually`.

It always exits 0.

---

## 3. PER-RUNTIME DELIVERY

| Runtime | Adapter | Event / wiring | Delivery |
|---|---|---|---|
| **Claude** | `claude/check-git-hooks.sh` (symlink → `../../../bin/check-git-hooks.sh`) | SessionStart hook chain (`bash /abs/path/.opencode/bin/check-git-hooks.sh`) | One stderr warning line on drift; always exits 0 |
| **Codex** | `codex/check-git-hooks.sh` (symlink) | SessionStart hook chain | One stderr warning line on drift |
| **Cursor** | `cursor/check-git-hooks.sh` (symlink) | SessionStart hook chain | One stderr warning line on drift |
| **Devin** | `devin/check-git-hooks.sh` (symlink) | SessionStart hook chain | One stderr warning line on drift |
| **OpenCode** | — | — | Not applicable. OpenCode session guards run inside the owning `mk-*` plugins; this check is wired into the editor runtimes' SessionStart chains. |
| **Pi** | — | — | Not applicable. |

One real file backs all four runtimes; the per-runtime entries are symlinks into `.opencode/bin/`.

---

## 4. DIRECTORY TREE

```text
git-hooks-check/
+-- README.md
+-- claude/   check-git-hooks.sh (symlink -> ../../../bin/check-git-hooks.sh)
+-- codex/    check-git-hooks.sh (symlink)
+-- cursor/   check-git-hooks.sh (symlink)
`-- devin/    check-git-hooks.sh (symlink)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.opencode/bin/check-git-hooks.sh` | The guard. Resolves source/target hook dirs, classifies each versioned hook's effective symlink (`missing` / `broken` / `mismatched` / `non-executable`), warns on stderr, and self-heals from the main checkout when live-sync is on. Always exits 0. |
| `.opencode/scripts/install-git-hooks.sh` | The installer the self-heal leg runs (and the fix command the warning names). Not in this folder. |
| `.opencode/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver (`hook_enabled git-hooks-check`, `hook_enabled live-sync`). Sourced fail-open if absent. |

---

## 6. CONFIGURATION

The guard is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_GIT_HOOKS_CHECK_DISABLED=1` | Canonical kill-switch. The shared resolver (`hook_enabled git-hooks-check`) short-circuits to exit 0. |
| `SPECKIT_GIT_HOOKS_GUARD=off` | Caller-side alias. Checked first, before the shared resolver; silences the guard for one invocation or session. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Disables the live-sync loop, which turns off the self-heal leg. The drift warning still fires; only the automatic repair is suppressed. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory | Reports drift to stderr; never blocks a session. Always exits 0. |
| Self-heal scope | Auto-runs the installer from the MAIN checkout only. Never auto-installs from a linked worktree (shared hooks dir would point at scripts that vanish on worktree removal). |
| Fail-open | Not a git repo, missing source/target dir, or absent shared resolver → exit 0 with no warning. A failed self-heal install prints a manual-fix line and still exits 0. |
| Imports | Bash only; sources the shared `hook-flags.sh` fail-open. Shells out to `install-git-hooks.sh` for the self-heal. Nothing outside the repo. |
| Real code | Stays in `.opencode/bin/`; the hub entries are relative symlinks. |

---

## 8. VALIDATION

```bash
bash .opencode/bin/check-git-hooks.sh; echo "exit: $?"
```

Expected result: `exit: 0`, with a `[check-git-hooks] ...` warning line on stderr only when a versioned hook's effective symlink is missing, broken, mismatched, or non-executable.

```bash
SPECKIT_GIT_HOOKS_GUARD=off bash .opencode/bin/check-git-hooks.sh; echo "exit: $?"
```

Expected result: `exit: 0`, no output (caller-side silence switch short-circuits).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../git-preflight/README.md`](../git-preflight/README.md): the related git preflight advisory.
- [`../../scripts/git-hooks/README.md`](../../scripts/git-hooks/README.md): the versioned git hooks this guard verifies.
- [`../../scripts/install-git-hooks.sh`](../../scripts/install-git-hooks.sh): the installer the self-heal leg runs and the warning names as the fix.
