---
title: "Official Obsidian CLI — Agent Usage"
description: "How an agent drives the official app-backed obsidian CLI: the preflight that proves it will answer, the exit-0 failure contract that makes $? useless, the key=value syntax, the 106-command surface, and the safety invariants that follow from it being a remote control for a live app."
trigger_phrases:
  - "official obsidian cli"
  - "obsidian cli preflight"
  - "obsidian cli exit code"
  - "obsidian key=value"
  - "app-backed cli"
  - "obsidian cli unable to find"
importance_tier: "important"
contextType: "implementation"
version: 0.1.0.0
---

# Official Obsidian CLI, Agent Usage

The official `obsidian` binary is a remote control for a running desktop app, not a headless tool. Everything below follows from that one fact.

---

## 1. OVERVIEW

The official CLI ships inside the Obsidian desktop app and is registered from Settings → General → Command line interface → Register CLI. On macOS that registration creates a symlink at `/usr/local/bin/obsidian` pointing into the app bundle.

Three properties decide how an agent must use it, and all three differ from an ordinary UNIX tool:

1. **It answers only while the desktop app is running.** With the app down, every invocation fails immediately.
2. **It reports in-app failures with exit status 0.** Branching on `$?` treats a missing file, an unknown command and an unknown vault as success.
3. **It defaults to the note the human currently has open** when no target is given, including for mutating commands.

Use `notesmd-cli` for file-shaped work. Reach for this CLI when the outcome needs the live app: its resolved link graph, its plugins, its sync history, or its rendering.

---

## 2. PREFLIGHT: PROVE IT WILL ANSWER

Run one cheap command and check **only the exit status**. This is the single case where `$?` is meaningful, because the app-down failure is the one failure raised by the launcher rather than by the app.

```bash
if obsidian version >/dev/null 2>&1; then
  : # CLI is live: binary registered AND app running
else
  : # not usable — distinguish the two causes below
fi
```

### The two failure causes, and how to tell them apart

| Condition | Detection | Exit | Stream |
|-----------|-----------|------|--------|
| Binary not registered | `command -v obsidian` finds nothing | `127` (shell) | shell error |
| Registered, app not running | `obsidian version` prints `The CLI is unable to find Obsidian. Please make sure Obsidian is running and try again.` | `1` | **stderr** |
| Registered, app running | `obsidian version` prints a version such as `1.13.7 (installer 1.13.4)` | `0` | stdout |

Full triage:

```bash
if ! command -v obsidian >/dev/null 2>&1; then
  echo "official CLI not registered — enable it in Settings → General → Command line interface"
elif ! obsidian version >/dev/null 2>&1; then
  echo "official CLI registered but the Obsidian app is not running"
else
  echo "official CLI live: $(obsidian version)"
fi
```

### The app is NOT launched for you

`obsidian` does **not** start the desktop app. A command issued while the app is down fails and leaves the app down. If a workflow needs the app, start it explicitly and wait for it to accept connections:

```bash
open -a Obsidian                        # macOS
until obsidian version >/dev/null 2>&1; do sleep 1; done
```

Do not treat this as a formality. An agent that skips the wait races the app's startup and reads the app-down failure as a task failure.

> Obsidian's own documentation at `https://obsidian.md/help/cli` states that "the first command you run launches Obsidian". The binary contradicts that. See §9.

---

## 3. RESULT HANDLING: `$?` IS NOT A SUCCESS SIGNAL

**Once the app is running, the CLI exits 0 for every outcome, including errors.** Failures are reported as human-readable text on **stdout**, not stderr.

Observed on a live app:

| Invocation | Output | Exit |
|------------|--------|------|
| `obsidian read file="ZZZ-does-not-exist"` | `Error: File "ZZZ-does-not-exist" not found.` | `0` |
| `obsidian bogusnonsense` | `Error: Command "bogusnonsense" not found. It may require a plugin to be enabled.` | `0` |
| `obsidian vault="NoSuchVault999" files total` | `Vault not found.` | `0` |
| `obsidian search query="nothing-matches-this"` | `No matches found.` | `0` |

### The detection an agent must use instead

Capture stdout and test its content. Treat a leading `Error:` as a hard failure, and `Vault not found.` as a hard failure too, since it does not carry the `Error:` prefix.

```bash
obs() {
  local out
  out="$(obsidian "$@" 2>/dev/null)"
  case "$out" in
    "Error: "*|"Vault not found."*)
      echo "obsidian: $out" >&2
      return 1
      ;;
  esac
  printf '%s\n' "$out"
}
```

`No matches found.` is an empty result rather than an error. Decide per call whether an empty result should stop the workflow.

Prefer `format=json` where a command offers it, since a JSON parse failure is a second, independent signal that the call did not return data.

---

## 4. SYNTAX

The official CLI does **not** take POSIX flags. Its grammar is `obsidian <command> key=value`.

```bash
obsidian version                                   # correct
obsidian --version                                 # WRONG: "Command \"--version\" not found"
obsidian help                                      # correct: full command list
obsidian create name="My Note" content="Line one"  # quoted values for spaces
```

| Element | Rule |
|---------|------|
| Command | First non-`vault=` word, for example `read`, `search`, `property:set` |
| Parameters | `key=value` pairs, unordered |
| Boolean switches | Bare words with no value, for example `total`, `overwrite`, `permanent`, `case` |
| Values with spaces | Quote them: `name="My Note"` |
| Newline and tab | `\n` and `\t` inside a content value |
| Targeting | `file=<name>` resolves by name like a wikilink, `path=<folder/note.md>` is exact |
| Vault | Global `vault=<name>`, accepted **either before or after** the command word |

Both vault positions were confirmed to work:

```bash
obsidian files vault="My Vault" total     # after the command
obsidian vault="My Vault" files total     # before the command
```

The vendor page states `vault=` "must be the first parameter before your command". That is stricter than the binary requires.

---

## 5. SURFACE SELECTION

Three surfaces reach an Obsidian vault. Pick by what the outcome needs, not by what is convenient.

| The outcome needs | Use | Why |
|-------------------|-----|-----|
| Files read or written with no app available (CI, server, SSH) | `notesmd-cli` | Filesystem-native, no app, no registration |
| Deterministic, greppable, diff-able file operations | `notesmd-cli` | Operates on plain files |
| The app's resolved link graph: backlinks, orphans, unresolved links | official `obsidian` | Only the running app holds the resolved graph |
| Vault-wide tags, tasks, properties or aliases as the app computes them | official `obsidian` | Index lives in the app, not in the files |
| Bases queries, sync history, file version history | official `obsidian` | No filesystem equivalent |
| Plugin, theme or snippet state changes | official `obsidian` | Mutates live app state |
| Opening something in the live UI | official `obsidian` | The remote-control case |
| Structured tool calls from an MCP client with an auth boundary | cyanheads MCP | Typed tools over Local REST API |

> **Agent default stays `notesmd-cli`.** It has no app dependency and no exit-code trap. Escalate to the official CLI when the result genuinely requires the live app, and preflight per §2 before depending on it.

The official CLI and the MCP server both require the running app, and they overlap on basic note operations. Prefer the MCP server when the caller is already an MCP client and wants typed results. Prefer the official CLI for the app-only capabilities in the table above, which the MCP tool set does not expose.

---

## 6. COMMAND SURFACE

`obsidian help` prints the authoritative list. **106 commands** were present on desktop 1.13.7 (installer 1.13.4). Run `obsidian help` for the exhaustive per-command parameter list rather than trusting any transcription, this one included.

### Grouped index

| Group | Commands |
|-------|----------|
| Read and write | `read` `create` `append` `prepend` `delete` `move` `rename` `open` |
| Inspect | `file` `files` `folder` `folders` `outline` `wordcount` `random` `random:read` |
| Properties | `properties` `property:read` `property:set` `property:remove` `aliases` |
| Search | `search` `search:context` `search:open` |
| Link graph | `backlinks` `links` `orphans` `deadends` `unresolved` |
| Tags and tasks | `tag` `tags` `task` `tasks` |
| Daily notes | `daily` `daily:read` `daily:append` `daily:prepend` `daily:path` |
| Templates | `templates` `template:read` `template:insert` |
| Bases | `bases` `base:views` `base:query` `base:create` |
| Vault and UI | `vault` `vaults` `reload` `restart` `tabs` `tab:open` `recents` `bookmark` `bookmarks` |
| Workspaces | `workspaces` `workspace` `workspace:save` `workspace:load` `workspace:delete` |
| Plugins | `plugins` `plugins:enabled` `plugins:restrict` `plugin` `plugin:enable` `plugin:disable` `plugin:install` `plugin:uninstall` `plugin:reload` |
| Themes and snippets | `themes` `theme` `theme:set` `theme:install` `theme:uninstall` `snippets` `snippets:enabled` `snippet:enable` `snippet:disable` |
| Sync | `sync` `sync:status` `sync:history` `sync:read` `sync:restore` `sync:deleted` `sync:open` |
| File history | `history` `history:list` `history:read` `history:restore` `history:open` `diff` |
| App commands | `command` `commands` `hotkey` `hotkeys` |
| Developer | `eval` `devtools` `dev:cdp` `dev:console` `dev:css` `dev:debug` `dev:dom` `dev:errors` `dev:mobile` `dev:screenshot` |
| Meta | `help` `version` |

### The subset an agent uses most, with confirmed parameters

| Command | Parameters | Confirmed behavior |
|---------|-----------|--------------------|
| `version` | none | Prints `1.13.7 (installer 1.13.4)`. The preflight command. |
| `vault` | none | Prints a TSV block: `name`, `path`, `files`, `folders`, `size`. |
| `vaults` | none | One vault name per line. |
| `files` | `folder=` `ext=` `total` | `total` returns a count. `ext=md` filters to markdown. |
| `read` | `file=` `path=` | Prints raw file content including frontmatter. |
| `create` | `name=` `path=` `content=` `template=` `overwrite` `open` `newtab` | Prints `Created: <name>.md`. **See §7 on collisions.** |
| `append` | `file=` `path=` `content=` `inline` | Prints `Appended to: <name>.md`. |
| `prepend` | `file=` `path=` `content=` | Mirror of `append`. |
| `delete` | `file=` `path=` `permanent` | Without `permanent` it goes to trash. Prints `Deleted permanently: <name>.md` with it. |
| `search` | `query=` `path=` `limit=` `total` `case` `format=text\|json` | `format=json` returns a bare array of file paths, not match context. |
| `search:context` | `query=` `path=` `limit=` `case` `format=text\|json` | JSON gives `[{file, matches:[{line, text}]}]`. Repeated lines can appear more than once per match. |
| `property:set` | `file=` `path=` `name=` `value=` | Prints `Set <name>: <value>`. Creates the frontmatter block when absent. |
| `property:read` | `file=` `path=` `name=` | Prints the bare value. |
| `eval` | `code=` | Runs JavaScript inside the app and prints `=> <result>`. **See §7.** |

Anything not listed above was seen in `obsidian help` but its exact output shape was not exercised. Treat those shapes as UNKNOWN and confirm with a real call before parsing them.

---

## 7. SAFETY INVARIANTS

### 1. Always name a target. The default is the human's open note.

`obsidian help` states: "Most commands default to the active file when file/path is omitted". Confirmed: a bare `obsidian read` printed the note the operator had open in the UI.

For read commands this leaks unrelated content into the agent's context. For `append`, `prepend`, `property:set` and `delete`, **it writes to whatever the human is looking at**. Always pass `file=` or `path=`.

```bash
obsidian append content="note"                      # WRONG: writes to the active note
obsidian append file="Target" content="note"        # correct
```

### 2. `create` does not fail on a name collision, and does not overwrite

It creates a numbered sibling instead. Confirmed:

```bash
obsidian create name="scratch" content="A"   # → Created: scratch.md
obsidian create name="scratch" content="B"   # → Created: scratch 1.md
```

Exit 0 both times. An agent that assumes `create` is idempotent silently forks a second note and then writes its updates to the wrong one. Either pass `overwrite`, or read the filename back out of the `Created:` line and use that name for every later call.

### 3. `eval` and `dev:*` execute arbitrary code in the user's live app

`eval code=...` runs JavaScript with the full Obsidian API in the running process, and returns `=> <result>`. It can modify or destroy vault content, and it is not sandboxed. `dev:cdp`, `dev:debug` and `dev:dom` attach a Chrome DevTools Protocol debugger to the user's session.

Use them for diagnosis that has no command equivalent. Never use `eval` as a shortcut for a mutation that a named command already performs, since the named command is inspectable and `eval` is not.

### 4. `delete` mutates a real vault

Without `permanent` the file goes to the app's trash and is recoverable. With `permanent` it is not. Prefer the default, and reserve `permanent` for content the agent itself created in the same run.

### 5. Do not run mutating commands against an unverified vault

`vault=` naming a vault that does not exist prints `Vault not found.` and exits 0. Confirm the target with `obsidian vaults` before a mutation, or a command intended for one vault silently reports success having done nothing.

---

## 8. WORKED PATTERN

A correct read-modify-verify cycle, with the preflight and the result check in place.

```bash
#!/usr/bin/env bash
set -euo pipefail

NOTE="Project Log"

# Preflight: exit status is meaningful ONLY here.
if ! command -v obsidian >/dev/null 2>&1; then
  echo "official CLI not registered" >&2; exit 1
fi
if ! obsidian version >/dev/null 2>&1; then
  echo "Obsidian app is not running" >&2; exit 1
fi

# Every later call goes through a wrapper, because the CLI exits 0 on failure.
obs() {
  local out
  out="$(obsidian "$@" 2>/dev/null)"
  case "$out" in
    "Error: "*|"Vault not found."*) echo "obsidian: $out" >&2; return 1 ;;
  esac
  printf '%s\n' "$out"
}

# Always name the target, never rely on the active file.
obs append file="$NOTE" content="- entry added $(date -u +%FT%TZ)"
obs property:set file="$NOTE" name=updated value="$(date -u +%F)"
obs read file="$NOTE"
```

---

## 9. WHERE THE VENDOR DOCUMENTATION DISAGREES WITH THE BINARY

Checked against `https://obsidian.md/help/cli`. **The binary wins.** Each row was observed on this machine.

| Vendor page says | The binary does | Consequence |
|------------------|-----------------|-------------|
| "If Obsidian isn't running, the first command you run launches Obsidian." | Prints `The CLI is unable to find Obsidian...` to stderr, exits 1, and does **not** launch the app. | Any workflow relying on auto-launch fails on a cold machine. Launch it explicitly per §2. |
| "`vault=<name>` must be the first parameter before your command." | Accepted both before and after the command word. | Harmless, but the constraint is not real. |

Two vendor claims were **not** contradicted and are reproduced here as its own: the CLI requires the Obsidian 1.12 installer or later, and registration on macOS creates the `/usr/local/bin/obsidian` symlink with administrator privileges.

---

## 10. VERIFICATION STATUS

Every behavioral claim in this document was observed by running the binary on macOS against Obsidian desktop 1.13.7 (installer 1.13.4), with one scratch note created and permanently deleted.

**UNKNOWN, with the check that would settle each:**

| Unknown | Check |
|---------|-------|
| Windows and Linux registration paths and behavior | Run `obsidian version` after registering on each platform. The vendor page describes a Windows terminal redirector and a Linux copy to `~/.local/bin/obsidian`, neither exercised here. |
| Whether any command exits non-zero while the app is running | Exercise a failing case per command family and record the status. All observed failures exited 0. |
| Output shape of the sync, history, bases, plugin, theme and dev command groups | Call each with `format=json` where offered and record the shape. |
| Whether `delete` without `permanent` can block on a GUI confirmation | Run it against a scratch note and time it. Only the `permanent` form was exercised. |
| Behavior with more than one vault open | Open a second vault and repeat the `vault=` targeting tests. This machine has one vault. |

---

## 11. GETTING HELP

- `obsidian help`. The authoritative command list from the installed binary, and the first thing to run when this document and the binary disagree
- Vendor reference: `https://obsidian.md/help/cli`
- Headless alternative and profile comparison: [`obsidian-cli-commands.md`](obsidian-cli-commands.md)
- Failure diagnosis: [`troubleshooting.md`](troubleshooting.md)
