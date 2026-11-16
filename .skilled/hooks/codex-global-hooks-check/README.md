---
title: "Codex Global Hooks Check: Session-Start Drift Check"
description: "Checks at session start that Codex's user-global hook file holds no copy of this repository's hooks. Six runtimes run the check. Codex owns the file and is not a host."
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

`codex-global-hooks-check/` indexes one check: `node .skilled/bin/install-codex-hooks.mjs --check`. The check reads Codex's user-global hook file, `~/.codex/hooks.json`. It reports every entry there that belongs to this repository.

Codex loads the repository's `.codex/hooks.json` itself for a trusted checkout. A copy of those entries in the user-global file makes each hook run twice per event. An entry whose adapter was renamed runs a file that no longer exists. The check reports both kinds and writes nothing.

Six runtimes run the check when a session starts. Claude, Cursor, Devin and OpenCode each have a folder here that holds one link to the real file. Pi and DSH run the check from their session-start adapters in `system-spec-kit`. Neither Codex nor Vibe runs it.

The folder answers to two concern keys. `hook-install` gates the installer. `codex-watchdog` gates the OpenCode plugin.

---

## 2. HOW IT WORKS

`install-codex-hooks.mjs` compares a source with a target. The source is the repository's `.codex/hooks.json`. The target is `~/.codex/hooks.json`. A hook's identity is the first adapter path in its command.

| Mode | Command | Effect |
|---|---|---|
| Check | `node .skilled/bin/install-codex-hooks.mjs --check` | Writes nothing. Exits 0 on a clean target and 1 on drift. |
| Dry run | `node .skilled/bin/install-codex-hooks.mjs --dry-run` | Prints a JSON report with a `drift` object. Writes nothing. |
| Reconcile | `node .skilled/bin/install-codex-hooks.mjs` | Removes the repository's entries from the target. Prints a JSON report. |

`--check` and `--dry-run` cannot be combined.

The check names three kinds of drift:

- `duplicate`: the target holds an entry that the source file also holds.
- `orphaned`: the target holds an entry under `.skilled/` or `.opencode/` whose adapter is missing on disk.
- `structure`: the target would change without naming an entry, such as an empty group being dropped.

Every other entry belongs to someone else. The installer keeps it untouched in every mode.

Reconcile only removes entries and never adds one. When the target changes, it first copies the file to `<target>.bak-<timestamp>`. Then it writes a temp file and renames it over the target. The file mode stays the same.

The installer refuses to run from a linked worktree. It exits 1 and names the primary checkout. Pass `--allow-worktree` to run it there. A session that starts in a linked worktree therefore gets a warning while the target is clean. A missing `git` binary skips this guard.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart` | `claude/install-codex-hooks.mjs` | `.skilled/bin/install-codex-hooks.mjs` | On a failed check, one context line. |
| Cursor | `sessionStart` | `cursor/install-codex-hooks.mjs` | `.skilled/bin/install-codex-hooks.mjs` | On a failed check, `permission: "allow"` with one `agent_message`. |
| Devin | `SessionStart` | `devin/install-codex-hooks.mjs` | `.skilled/bin/install-codex-hooks.mjs` | On a failed check, one echoed line. |
| OpenCode | `session.created` | `opencode/codex-hooks-watchdog.js` | `.opencode/plugins/codex-hooks-watchdog.js` | On a failed check, one line in a log file. |
| Pi | `session_start` | None | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The check's output as a warning, on a pass too. |
| DSH | `agent/created` | None | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | The check's output as an injected notice, on a pass too. |
| Codex | None | None | None | Nothing. Codex owns the target file and does not check itself. |
| Vibe | None | None | None | Nothing. No registration runs the check. |

Session start continues on every runtime. A failed check never blocks a turn.

Claude, Cursor and Devin register the check in `hook-registry.json` under the id `install-codex-hooks`. Claude and Devin give it 5 seconds and Cursor gives it 10. On failure each one shows this line:

```text
[codex-hooks] drift detected - run: node .skilled/bin/install-codex-hooks.mjs --check
```

No registration names a path in this folder. The four links exist for browsing. Nothing loads through them.

The OpenCode plugin runs the check once per session with a 5-second timeout. It remembers 1000 session ids and drops the oldest when the set is full. On a failed check it appends one line to `.skilled/logs/codex-hooks-watchdog.log`. It empties that log once the file passes 256 KB. The plugin never writes to stdout or stderr, because OpenCode paints plugin output onto the prompt line. Every error inside the plugin ends as a no-op.

Pi runs the check on a `session_start` event with the reason `startup` or `new`. DSH runs it when an agent is created at startup. A fan-out leaf skips it. Both adapters also stop when the `session-lifecycle` concern is off. Both pass on whatever the check prints. A clean run prints an `OK` line, so Pi and DSH show that line too.

---

## 4. DIRECTORY TREE

```text
codex-global-hooks-check/
+-- README.md
+-- claude/    install-codex-hooks.mjs -> ../../../bin/install-codex-hooks.mjs
+-- cursor/    install-codex-hooks.mjs -> ../../../bin/install-codex-hooks.mjs
+-- devin/     install-codex-hooks.mjs -> ../../../bin/install-codex-hooks.mjs
`-- opencode/  codex-hooks-watchdog.js -> ../../../../.opencode/plugins/codex-hooks-watchdog.js
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/install-codex-hooks.mjs` | The installer. It parses arguments, matches hook identities, classifies drift and writes the target with a backup. |
| `.opencode/plugins/codex-hooks-watchdog.js` | The OpenCode plugin. It exports `MkCodexHooksWatchdogPlugin` through `dualPlugin` and calls the installer with `--check`. |
| `.codex/hooks.json` | The project hook file Codex loads. The installer reads it to learn which entries the repository owns. |
| `~/.codex/hooks.json` | The user-global file the check reads and reconcile cleans. It lives outside the repository. |
| `.skilled/hooks/shared/hook-flags.cjs` | The switch resolver. The installer and the plugin both call `isHookEnabled`. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds the `install-codex-hooks` entry for Claude, Cursor and Devin. |

---

## 6. CONFIGURATION

The check is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_HOOK_INSTALL_DISABLED=1` | `hook-install` | The installer exits 0 at once in every mode. Pi and DSH skip the check. |
| `CODEX_HOOKS_WATCHDOG_DISABLED=1` | `codex-watchdog` | The OpenCode plugin skips the check. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Turns off both, along with every other repository hook. |

The first switch silences the check on every runtime, because each one calls the installer. The second silences only the OpenCode plugin.

Older names still work. `MK_HOOK_INSTALL_DISABLED` also turns off `hook-install`. `CODEX_WATCHDOG_DISABLED`, `MK_CODEX_WATCHDOG_DISABLED` and `MK_CODEX_HOOKS_WATCHDOG_DISABLED` also turn off `codex-watchdog`.

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment wins over the file.

The installer takes these flags:

| Flag | Effect |
|---|---|
| `--repo <path>` | The repository root. The default is two levels above the installer. |
| `--source <file>` | The source hook file. The default is `<repo>/.codex/hooks.json`. |
| `--target <file>` | The target hook file. The default is `~/.codex/hooks.json`. |
| `--check` | Report drift and write nothing. |
| `--dry-run` | Print the report and write nothing. |
| `--allow-worktree` | Run from a linked worktree. |

---

## 7. VALIDATION

Run from the repository root. In a linked worktree, add `--allow-worktree` to the installer commands.

```bash
node .skilled/bin/install-codex-hooks.mjs --check; echo "exit: $?"
```

Expected result on a clean target: `install-codex-hooks: OK <target>` and `exit: 0`. On drift the installer prints `install-codex-hooks: DRIFT <target>` with the counts on stderr, then `exit: 1`.

```bash
SYSTEM_HOOK_INSTALL_DISABLED=1 node .skilled/bin/install-codex-hooks.mjs --check; echo "exit: $?"
```

Expected result: `exit: 0` and no other output.

```bash
node -e "import('./.opencode/plugins/codex-hooks-watchdog.js').then(m => console.log('ok', typeof m.default))"
```

Expected result: `ok object`.

```bash
find .skilled/hooks/codex-global-hooks-check -type l | wc -l
```

Expected result: `4`.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the switch resolver both concern keys go through.
- [`../session-lifecycle/README.md`](../session-lifecycle/README.md): the session-start adapters that run the check on Pi and DSH.
- [`../../bin/install-codex-hooks.mjs`](../../bin/install-codex-hooks.mjs): the installer.
- [`../../../.opencode/plugins/codex-hooks-watchdog.js`](../../../.opencode/plugins/codex-hooks-watchdog.js): the OpenCode plugin.
- [`../../../.codex/README.md`](../../../.codex/README.md): how Codex loads the project hook file.
