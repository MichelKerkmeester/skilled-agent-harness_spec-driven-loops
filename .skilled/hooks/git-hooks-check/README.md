---
title: "Git Hooks Check: Installed-Hook Verification"
description: "SessionStart guard that verifies the repository's versioned git hooks are installed and current. Eight runtimes run the one real script in `.skilled/bin/`. It self-heals from the main checkout when live-sync is on."
trigger_phrases:
  - "check git hooks"
  - "git hook verification"
  - "git hook drift"
  - "claude git hooks check"
  - "git hook drift warning"
  - "sessionstart hook guard"
  - "codex git hooks check"
  - "codex sessionstart guard"
  - "cursor git hooks check"
  - "cursor sessionstart guard"
  - "devin git hooks check"
  - "devin sessionstart guard"
importance_tier: "normal"
contextType: "reference"
---

# Git Hooks Check: Installed-Hook Verification

---

## 1. OVERVIEW

`git-hooks-check/` indexes the SessionStart guard that verifies the repository's git hooks are installed and current. A fresh clone or a forgotten install step leaves a versioned hook unlinked. The hook sits under `.skilled/scripts/git-hooks/` with no effective symlink in `.git/hooks`. That gap is silent, so nothing reports it. It can drop commit-msg, pre-commit and pre-push coverage. The guard finds that state and warns the operator in one line. The commit and push guardrails then stay in force for the session.

The guard is the detect-and-warn companion to the installer, `install-git-hooks.sh`. A SessionStart hook cannot install missing git hooks into a running session without side effects. It can warn the operator. It can also self-heal from the main checkout when live-sync is on.

It never blocks a session. It writes one warning line to stderr, then exits 0.

One real script backs every runtime that runs the guard. The entries in this folder are relative symlinks into `.skilled/bin/`.

---

## 2. HOW IT WORKS

On each session start, `check-git-hooks.sh` runs these steps in order.

1. It checks the caller-side silence switch (`SPECKIT_GIT_HOOKS_GUARD=off`) and the shared kill-switch (`hook_enabled git-hooks-check`). The kill-switch fails open when the shared resolver is absent. Either switch off ends the run at exit 0 with no output.
2. It resolves the repo root and the versioned hook source dir. It also resolves the effective hook target dir with `git rev-parse --git-path hooks`. The source root is `.skilled` when it holds the spec-kit skill, else `.opencode`. The versioned hooks sit in `scripts/git-hooks` under it, as in `.opencode/scripts/git-hooks`. A missing repo or target dir ends the run at exit 0.
3. It walks every versioned hook in the source dir, skipping `README.md`. It classifies the matching `.git/hooks/<name>` symlink as one of four states.

| State | Meaning |
|---|---|
| `missing` | No symlink at the target path |
| `broken` | Symlink exists but its target does not |
| `mismatched` | Symlink resolves to a different path than the versioned source |
| `non-executable` | Symlink is valid but not executable |

4. If any hook is invalid, it prints one line to stderr. That line names every invalid hook and the fix command.

   ```text
   [check-git-hooks] Invalid git hook symlink(s): pre-commit (missing), commit-msg (mismatched). Fix: bash .opencode/scripts/install-git-hooks.sh (silence: SPECKIT_GIT_HOOKS_GUARD=off)
   ```

5. It self-heals only when at least one hook is invalid. The leg runs when the live-sync loop is on, which `hook_enabled live-sync` reports. It also runs when the shared resolver is absent from the checkout. It compares `git-dir` to `git-common-dir` and runs `install-git-hooks.sh` from the MAIN checkout only. A linked worktree shares the main checkout's hooks dir, so the guard skips it. An install from a session tree would point the shared symlinks at scripts that vanish. On success it prints `[check-git-hooks] auto-installed git hook symlinks (self-heal)` and the links are repaired. On failure it prints `[check-git-hooks] self-heal install failed; run it manually`.

It always exits 0, so a session start never fails on it.

| Boundary | Rule |
|---|---|
| Advisory | Reports drift to stderr and never blocks a session. Always exits 0. |
| Self-heal scope | Runs the installer from the MAIN checkout only. Never from a linked worktree. |
| Fail-open | Not a git repo or no target dir ends the run at exit 0. |
| Absent resolver | The kill-switch is skipped and the guard keeps running. |
| Missing pieces | A missing source dir or installer warns when the checkout ships the toolchain. |
| Imports | Bash only. Sources `hook-flags.sh` fail-open and shells out to `install-git-hooks.sh`. Nothing outside the repo. |
| Real code | Stays in `.skilled/bin/`. The entries here are relative symlinks. |

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart [id check-git-hooks, timeout 3]` | `claude/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The warning line on stderr. Nothing on a clean tree. |
| Codex | `SessionStart [id check-git-hooks, timeout 3]` | `codex/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The warning line on stderr. Nothing on a clean tree. |
| Cursor | `sessionStart [id check-git-hooks, timeout 10]` | `cursor/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The warning line on stderr. Nothing on a clean tree. |
| Devin | `SessionStart [id check-git-hooks, timeout 3]` | `devin/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The warning line on stderr. Nothing on a clean tree. |
| OpenCode | `session.created` | None | `.opencode/plugins/session-cleanup.js` | One line in the startup warnings block. |
| Pi | `session_start` | None | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The warning as a Pi notification. |
| DSH | `agent/created` | None | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | The warning as an injected notice, prefixed with the check label. |
| Vibe | `session_start` | None | `.vibe/plugins/repo-guards/session-cleanup.mjs` | The warning in the session-start additional context. |

Claude, Codex, Cursor and Devin run it from `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`. `hook-registry.json` holds the source entry, under the id `check-git-hooks`. Claude, Codex and Devin give it 3 seconds and Cursor gives it 10. Claude, Codex and Cursor add a fallback that fires only on a nonzero exit. The script always exits 0. The fallback runs only when the script is missing or cannot start.

No registration names a path in this folder, only the real file. The four links exist for browsing the folder. No registration loads anything through them. Any runtime can wire the guard by hand as `bash /abs/path/.skilled/bin/check-git-hooks.sh`.

The OpenCode plugin's `event` hook runs the script on `session.created` with the other startup guards. OpenCode gives each guard 8 seconds and logs failures to its session-cleanup log. The plugin collects the stdout and stderr of every guard. It then pushes one `[session-cleanup] Startup safety warnings:` block into the system prompt. The plugin never writes to the TUI prompt line or to stderr.

Pi runs the script at `session_start` when the reason is `startup` or `new`. DSH runs it at `agent/created` when the source is `startup`. A DSH fan-out leaf skips the check entirely. Both adapters also stop when the `session-lifecycle` concern is off. Pi and DSH also skip it when the `git-hooks-check` concern is off.

Pi gives the script 5 seconds and swallows errors. DSH gives it 5 seconds and logs a failure through `ctx.logger.warn`. Both pass on whatever the script prints, a warning or nothing.

Vibe runs the script at `session_start` through its own hook chain. The registration lives in `.vibe/hooks.toml`, which calls `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` for that event. That script runs `.vibe/plugins/repo-guards/session-cleanup.mjs` with an 8-second timeout on each start. The hook reuses `.opencode/plugins/session-cleanup.js` and then fires its `session.created` event. It returns the warnings as `additional_context` and skips when the `session-cleanup` concern is off.

---

## 4. DIRECTORY TREE

```text
git-hooks-check/
+-- README.md
+-- claude/   check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
+-- codex/    check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
+-- cursor/   check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
`-- devin/    check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/check-git-hooks.sh` | The guard. Resolves the source and target hook dirs, classifies each symlink, warns on stderr and self-heals from the main checkout. |
| `.skilled/scripts/install-git-hooks.sh` | The installer the self-heal leg runs and the warning names as the fix. `.opencode/scripts/install-git-hooks.sh` is the same path under the other source root. |
| `.skilled/hooks/shared/hook-flags.sh` | The shared shell kill-switch resolver. The guard sources it fail-open. `.opencode/hooks/shared/hook-flags.sh` serves a checkout whose `.skilled` lacks the spec-kit skill. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds the `check-git-hooks` entry for Claude, Codex, Cursor and Devin. |
| `.opencode/plugins/session-cleanup.js` | The OpenCode plugin. Runs the guard with the other startup guards. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The Pi extension that runs the guard at session start. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | The DSH adapter that runs the guard when an agent is created. |

---

## 6. CONFIGURATION

The guard is on by default in every checkout. The shared resolver reads a `SYSTEM_*` switch as on for `1` or `true` or `yes` or `on`, in any case. `SPECKIT_GIT_HOOKS_GUARD` silences the guard only when it holds exactly `off`.

| Switch | Effect |
|---|---|
| `SYSTEM_GIT_HOOKS_CHECK_DISABLED=1` | Canonical kill-switch. The shared resolver (`hook_enabled git-hooks-check`) ends the run at exit 0. |
| `SPECKIT_GIT_HOOKS_GUARD=off` | Caller-side alias. Checked first, before the shared resolver. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that turns off this concern and every other repo hook. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Turns off the live-sync loop, so the self-heal leg stops. The drift warning still fires. |

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment wins over the file, so a persisted default can be overridden for one session.

---

## 7. VALIDATION

Run these commands from the repository root.

```bash
bash .skilled/bin/check-git-hooks.sh; echo "exit: $?"
```

Expected result: `exit: 0`. A `[check-git-hooks] ...` warning line appears on stderr only on drift. Drift means a versioned hook's effective symlink is missing, broken, mismatched or non-executable.

```bash
SPECKIT_GIT_HOOKS_GUARD=off bash .skilled/bin/check-git-hooks.sh; echo "exit: $?"
```

Expected result: `exit: 0` and no output. The caller-side silence switch short-circuits the run before any check.

```bash
find .skilled/hooks/git-hooks-check -type l | wc -l
```

Expected result: `4`.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../git-preflight/README.md`](../git-preflight/README.md): the related git preflight advisory.
- [`../../scripts/git-hooks/README.md`](../../scripts/git-hooks/README.md): the versioned git hooks this guard verifies.
- [`../../scripts/install-git-hooks.sh`](../../scripts/install-git-hooks.sh): the installer the self-heal leg runs and the warning names as the fix.
- [`../../bin/check-git-hooks.sh`](../../bin/check-git-hooks.sh): the guard itself.
- [`../../../.opencode/plugins/session-cleanup.js`](../../../.opencode/plugins/session-cleanup.js): the OpenCode plugin that runs the guard.
