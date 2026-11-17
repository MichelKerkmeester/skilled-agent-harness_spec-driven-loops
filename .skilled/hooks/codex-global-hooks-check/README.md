---
title: "Codex Global Hooks Check: Session-Start Drift Check"
description: "Checks the Codex user-global hook file for duplicate or orphaned repository entries. Claude, Cursor, Devin, OpenCode, Pi and DSH run the check at session start."
trigger_phrases:
  - "codex global hooks check"
  - "codex hook drift"
  - "install codex hooks check"
  - "codex hooks watchdog"
  - "reconcile codex hooks"
  - "codex hook installer"
  - "codex hook health"
  - "claude codex hook drift"
  - "codex hook drift check"
  - "codex hooks watchdog link"
  - "codex watchdog opencode entry"
  - "cursor codex hook drift"
  - "devin codex hook drift"
  - "sessionstart hook drift"
importance_tier: "normal"
contextType: "reference"
---

# Codex Global Hooks Check: Session-Start Drift Check

---

## 1. OVERVIEW

`codex-global-hooks-check/` indexes the check for duplicate and stale Codex hook entries. The installer compares the project hook list in `.codex/hooks.json` with the user-global file at `~/.codex/hooks.json`.

The shared check lives in `.skilled/bin/install-codex-hooks.mjs`. Claude, Cursor, Devin, OpenCode, Pi and DSH run it at session start. Codex has no runtime entry for the check. Its user-global file is the target.

Two concern keys control these paths. `hook-install` uses `SYSTEM_HOOK_INSTALL_DISABLED`. `codex-watchdog` uses `CODEX_HOOKS_WATCHDOG_DISABLED`. `SYSTEM_HOOKS_DISABLED` turns off both concerns.

---

## 2. HOW IT WORKS

The installer matches hooks by the first recognized script path in each command. It checks for project-owned paths copied into the user-global file. It also finds a stale script path that starts with `.skilled/` or `.opencode/` when that script no longer exists in the checkout.

| Drift | Condition |
|---|---|
| `duplicate` | The user-global file contains a hook identity found in `.codex/hooks.json`. |
| `orphaned` | The user-global file names a script path starting with `.skilled/` or `.opencode/` that no longer exists. |
| `structure` | The target changes without a named duplicate or orphan, such as when an empty group disappears. |

Every other entry stays untouched. The installer never adds hooks.

| Mode | Command | Result |
|---|---|---|
| Check | `node .skilled/bin/install-codex-hooks.mjs --check` | Reads the project file and reads the target when it exists. A clean target prints `install-codex-hooks: OK <target>` and exits 0. Drift prints `install-codex-hooks: DRIFT <target> (...)` to stderr and exits 1. |
| Dry run | `node .skilled/bin/install-codex-hooks.mjs --dry-run` | Prints a JSON report and writes nothing. |
| Reconcile | `node .skilled/bin/install-codex-hooks.mjs` | Removes project-owned entries and orphaned paths. It writes only when the target changes. |

`--check` and `--dry-run` cannot be combined. When an existing target changes, reconcile copies it to `<target>.bak-<timestamp>`. It then writes a temporary file and renames it over the target while keeping the file mode.

The check runs from linked worktrees because it writes nothing. A dry run or reconcile from a linked worktree needs `--allow-worktree`. The guard treats the checkout as primary when Git is unavailable.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Runtime entry | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart` | `node .skilled/bin/install-codex-hooks.mjs --check` | `.skilled/bin/install-codex-hooks.mjs` | Adds one context line on failure. The check output stays hidden. |
| Codex | None | None | None | Nothing. The installer checks Codex user-global hooks from other runtimes. |
| Cursor | `sessionStart` | `node .skilled/bin/install-codex-hooks.mjs --check` | `.skilled/bin/install-codex-hooks.mjs` | Keeps permission at `allow` and sends an `agent_message` on failure. |
| Devin | `SessionStart` | `node .skilled/bin/install-codex-hooks.mjs --check` | `.skilled/bin/install-codex-hooks.mjs` | Prints one warning line on failure. |
| OpenCode | `session.created` | `.opencode/plugins/*.js` | `.opencode/plugins/codex-hooks-watchdog.js` | Logs one line on failure. The plugin writes no stdout or stderr. |
| Pi | `session_start` for `startup` or `new` | `.pi/extensions/session-start-advisories.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Shows non-empty check output as a warning and hides the clean `OK` line. |
| DSH | `agent/created` for `startup` | `.dsh/plugins/repo-guards/index.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | Adds a notice when the check prints warning text. It skips fan-out leaves. |
| Vibe | None | None | None | Nothing. Its startup guard list does not run this check. |

Claude uses `.claude/settings.json` with a five-second timeout. Cursor uses `.cursor/hooks.json` with a ten-second timeout. Devin uses `.devin/hooks.v1.json` with a five-second timeout. Their generated entries come from `hook-registry.json`.

OpenCode registers through `.opencode/plugins/*.js`. The watchdog listens for `session.created` and gives the check five seconds.

Pi registers through `.pi/extensions/session-start-advisories.ts`. The extension re-exports the Pi implementation in the table. The `install-codex-hooks` row in `hook-registry.json` names that extension. Pi runs it for `startup` or `new` sessions.

DSH registers through `.dsh/plugins/repo-guards/index.mjs`. The bundle imports `session-start-advisories.mjs` through `.dsh/plugins/repo-guards/adapters/session-start-advisories.mjs`. The adapter runs at startup and skips fan-out leaves.

Codex stores its project hook list in `.codex/hooks.json`, which the installer reads as its source. That file has no registration for this check. Vibe registers its session-start composer in `.vibe/hooks.toml`. The composer uses a startup guard list that does not include the installer.

---

## 4. DIRECTORY TREE

```text
codex-global-hooks-check/
+-- README.md
+-- claude/
|   `-- install-codex-hooks.mjs
+-- cursor/
|   `-- install-codex-hooks.mjs
+-- devin/
|   `-- install-codex-hooks.mjs
`-- opencode/
    `-- codex-hooks-watchdog.js
```

The runtime folders have no separate README. This file covers their index entries.

The Claude entry links to `../../../bin/install-codex-hooks.mjs` from its folder. Cursor and Devin use the same target. The OpenCode entry links to `../../../../.opencode/plugins/codex-hooks-watchdog.js` for browsing. OpenCode loads the plugin from `.opencode/plugins/`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/install-codex-hooks.mjs` | Reads the project and user-global files, classifies drift and checks or reconciles entries. |
| `.skilled/bin/lib/user-hook-file.mjs` | Finds hook identities and orphan paths. It guards writes and replaces changed files through a temporary file. |
| `.opencode/plugins/codex-hooks-watchdog.js` | Runs the read-only check at `session.created` and appends failures to `.skilled/logs/codex-hooks-watchdog.log`. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the `hook-install` and `codex-watchdog` switches. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Canonical runtime binding registry. It feeds the generated settings files and names the Pi extension entry. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Runs the installer check in the Pi startup advisory chain. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | Runs the installer check in the DSH startup advisory chain. |
| `.codex/hooks.json` | Supplies the project hook list that the installer compares with the user-global file. |

---

## 6. CONFIGURATION

Both concern keys are enabled by default. The resolver treats `1`, `true`, `yes` or `on` as a switch value in any letter case.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_HOOK_INSTALL_DISABLED=1` | `hook-install` | Skips the installer check on each runtime that calls it. |
| `CODEX_HOOKS_WATCHDOG_DISABLED=1` | `codex-watchdog` | Disables the OpenCode watchdog. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Disables both concerns along with other repository hooks. |

`MK_HOOK_INSTALL_DISABLED` also disables `hook-install`. `CODEX_WATCHDOG_DISABLED` and `MK_CODEX_WATCHDOG_DISABLED` remain aliases for `codex-watchdog`. So does `MK_CODEX_HOOKS_WATCHDOG_DISABLED`.

Set a switch in the environment for one command or export it for a session. To persist switches, copy the [example switch file](../hook-flags.env.example) to `.skilled/hooks/hook-flags.env`. The environment takes precedence over that file.

The installer accepts these flags:

| Flag | Effect |
|---|---|
| `--repo <path>` | Sets the repository root. The default is two levels above the installer. |
| `--source <file>` | Sets the project hook file. The default is `<repo>/.codex/hooks.json`. |
| `--target <file>` | Sets the user-global hook file. The default is `~/.codex/hooks.json`. |
| `--check` | Reports drift without writing. |
| `--dry-run` | Prints the report without writing. |
| `--allow-worktree` | Allows a dry run or reconcile from a linked worktree. |

---

## 7. VALIDATION

The installer cases are in `.skilled/bin/tests/install-codex-hooks-source-root.test.cjs`. They cover source-root aliases and linked worktrees. They also check that duplicates and orphaned entries are removed while unrelated entries stay.

Pi and DSH advisory behavior has tests in `.skilled/hooks/session-lifecycle/tests/pi-session-start-advisories.test.ts` and `.skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs`.

Run this smoke check from the repository root. It sets the installer switch, so the command returns before reading either hook file.

```bash
SYSTEM_HOOK_INSTALL_DISABLED=1 node .skilled/bin/install-codex-hooks.mjs --check
```

Expected result: no output and exit status 0.

---

## 8. RELATED

- [hooks index](../README.md): the concern tree and runtime coverage matrix.
- [switch resolver](../shared/README.md): flag names, aliases and precedence.
- [session lifecycle adapters](../session-lifecycle/README.md): the Pi and DSH startup advisory chains.
- [runtime mirror registry](../../skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json): the generated runtime bindings.

