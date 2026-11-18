---
title: "Git Hooks Check: Installed-Hook Verification"
description: "Checks installed Git hook links during session startup for Claude, Codex, Cursor, Devin, OpenCode, Pi, DSH and Vibe."
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

`git-hooks-check/` compares the repository's versioned Git hooks with Git's effective hooks directory. It warns when a hook link is invalid and exits with status 0 so the check does not stop a session.

Claude, Codex, Cursor and Devin have browsing links in this folder. All eight runtimes call `.skilled/bin/check-git-hooks.sh`, directly or through a startup adapter.

The concern key is `git-hooks-check`. Its switch is `SYSTEM_GIT_HOOKS_CHECK_DISABLED`. `SYSTEM_HOOKS_DISABLED=1` is the master switch.

---

## 2. HOW IT WORKS

`check-git-hooks.sh` exits before repository lookup when `SPECKIT_GIT_HOOKS_GUARD=off`. Otherwise, it finds the repository root and selects `.skilled` when `.skilled/skills/system-spec-kit/SKILL.md` exists. If it does not, it selects `.opencode`.

The guard loads `$SOURCE_ROOT/hooks/shared/hook-flags.sh` when that file exists. It exits quietly when `hook_enabled git-hooks-check` is off. If the shared resolver is missing, the check stays enabled.

The guard reads versioned hooks from `$SOURCE_ROOT/scripts/git-hooks` and gets Git's effective hooks directory from `git rev-parse --git-path hooks`. It skips `README.md`. If the source directory is missing in a checkout that carries the toolchain, it writes a warning.

For each versioned hook, the guard checks the link at Git's target path.

| State | What the guard checks |
|---|---|
| `missing` | No symlink exists at the target path. |
| `broken` | The symlink exists but its target does not. |
| `mismatched` | The symlink resolves to a different path than the versioned source. |
| `non-executable` | The symlink is valid but the target is not executable. |

On drift, the script writes one line to stderr with each invalid hook and the fix command `bash .opencode/scripts/install-git-hooks.sh`. Self-heal runs when live-sync is enabled or the shared resolver is absent. It also requires `git rev-parse --git-dir` to match `git rev-parse --git-common-dir`. The guard then runs `install-git-hooks.sh` from the main checkout. It exits with status 0.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry | Real file | What the runtime receives |
|---|---|---|---|---|
| Claude | `SessionStart` | `.skilled/hooks/git-hooks-check/claude/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The drift warning on stderr. Timeout: 3 seconds. |
| Codex | `SessionStart` | `.skilled/hooks/git-hooks-check/codex/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The drift warning on stderr. Timeout: 3 seconds. |
| Cursor | `sessionStart` | `.skilled/hooks/git-hooks-check/cursor/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The drift warning on stderr. Timeout: 10 seconds. |
| Devin | `SessionStart` | `.skilled/hooks/git-hooks-check/devin/check-git-hooks.sh` | `.skilled/bin/check-git-hooks.sh` | The drift warning on stderr. Timeout: 3 seconds. |
| OpenCode | `session.created` | `.opencode/plugins/session-cleanup.js` | `.opencode/plugins/session-cleanup.js` | A startup warning in the system context. Guard timeout: 8 seconds. |
| Pi | `session_start` for `startup` or `new` | `.pi/extensions/session-start-advisories.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | A warning notification. Timeout: 5 seconds. |
| DSH | `agent/created` for `startup` | `.dsh/plugins/repo-guards/adapters/session-start-advisories.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | An injected notice labelled `check-git-hooks`. Timeout: 5 seconds. |
| Vibe | `session_start` | `.vibe/hooks.toml` entry `session-start` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | A guard warning in `additional_context`. |

Claude registers the check in `.claude/settings.json`. Codex registers it in `.codex/hooks.json`. Cursor registers it in `.cursor/hooks.json`. Devin registers it in `.devin/hooks.v1.json`.

OpenCode loads plugins through the flat `.opencode/plugins/` glob. `session-cleanup.js` runs this check with its other startup guards.

Pi's extension entry is `.pi/extensions/session-start-advisories.ts`. It imports the adapter in the table.

`.dsh/patches/guards.patch.yml` loads `.dsh/plugins/repo-guards/index.mjs`. The bundle imports the DSH adapter from its `adapters/` directory.

Vibe registers `session-start` in `.vibe/hooks.toml`. The handler calls `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, which gets startup guard warnings from `.vibe/plugins/repo-guards/session-cleanup.mjs`.

---

## 4. DIRECTORY TREE

```text
git-hooks-check/
+-- README.md
+-- claude/
|   `-- check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
+-- codex/
|   `-- check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
+-- cursor/
|   `-- check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
`-- devin/
    `-- check-git-hooks.sh -> ../../../bin/check-git-hooks.sh
```

These four folders hold browsing symlinks. The other runtime entries live in their runtime integration folders.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| [Check script](../../bin/check-git-hooks.sh) | Compares versioned hook sources with Git's effective target links and runs the self-heal step. |
| [Switch resolver](../shared/hook-flags.sh) | Applies the master switch and per-concern switch. |
| [Hook registry](../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json) | Records the direct runtime bindings and the Pi extension name. |
| [OpenCode startup plugin](../../../.opencode/plugins/session-cleanup.js) | Runs the check with the other startup guards and collects their output. |
| [Git hook installer](../../scripts/install-git-hooks.sh) | Creates symlinks from versioned hook scripts into Git's effective hooks directory. |

---

## 6. CONFIGURATION

The shared hook resolver enables this concern by default. It treats four values as true regardless of case: `1`, `true`, `yes`, `on`.

| Switch | Effect |
|---|---|
| `SYSTEM_GIT_HOOKS_CHECK_DISABLED=1` | Disables this concern. |
| `SPECKIT_GIT_HOOKS_GUARD=off` | Exits before repository lookup. This caller-side switch must be exactly `off`. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables every repository hook. |
| `SYSTEM_LIVE_SYNC_DISABLED=1` | Stops self-heal when the shared resolver is available. Drift warnings still run. |

The shell resolver reads an optional `hook-flags.env` under the selected source root. Environment values override that file.

---

## 7. VALIDATION

The [shell test suite](../../bin/tests/check-git-hooks.test.sh) covers linked source roots, missing hook sources, a missing installer and repositories without the toolchain.

Run these read-only checks from the repository root.

```bash
bash -n .skilled/bin/check-git-hooks.sh
```

Expected result: no output and exit status 0.

```bash
SPECKIT_GIT_HOOKS_GUARD=off bash .skilled/bin/check-git-hooks.sh
```

Expected result: no output and exit status 0. The caller-side switch exits before repository lookup.

---

## 8. RELATED

- [Hooks index](../README.md): the hook tree and runtime coverage.
- [Shared helper docs](../shared/README.md): the switch resolver used by the guard.
