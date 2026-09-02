---
title: "Obsidian CLI Reference"
description: "Complete command reference for both Obsidian CLI profiles: notesmd-cli (headless, filesystem) and the official obsidian CLI (app-backed remote control), with usage, flags, and agent patterns."
trigger_phrases:
  - "notesmd-cli commands"
  - "obsidian cli"
  - "notesmd-cli create"
  - "notesmd-cli search"
  - "obsidian daily note"
  - "obsidian vault cli"
importance_tier: "normal"
contextType: "implementation"
version: 0.2.0.0
---

# Obsidian CLI Reference

Two distinct CLI profiles operate an Obsidian vault. Pick by whether a live app is available.

- **`notesmd-cli`** (Yakitrak) — HEADLESS. Operates directly on the vault filesystem. Works with **no running Obsidian app**. This is the default for agent automation.
- **`obsidian`** (official) — APP-BACKED. A remote control for an already-running Obsidian desktop app. It does **not** launch the app, and fails with exit 1 when the app is down. Not headless.

---

## 1. OVERVIEW

`notesmd-cli` is a Go CLI that reads and writes the vault's markdown files directly. Because it never talks to a running app, it is the reliable surface for scripted, headless agent workflows: create notes, search content, list files, edit frontmatter, and manage which vault is the default — all against the filesystem.

The official `obsidian` CLI is a thin remote control shipped inside the desktop app (GA in desktop v1.12.4, Feb 2026). It drives an app that is **already running** and does not start one. It is the right surface when you need the live app's resolved link graph, its computed tag/task index, its plugins, sync and file history, or its rendering. Agent-facing usage, preflight and the exit-0 failure contract: [`official-cli-agent-usage.md`](official-cli-agent-usage.md).

**Key agent advantages of `notesmd-cli`:**
- No app dependency — runs on servers, in CI, over SSH
- Operates on plain files — deterministic, greppable, diff-able
- Multi-vault aware — `add-vault` / `set-default-vault` route commands to the right vault

> The binary is named `notesmd-cli` (renamed from "obsidian-cli" to avoid confusion with the official CLI). Do not invoke it as `obsidian-cli`.

---

## 2. PREREQUISITES

**`notesmd-cli` (headless):**
- Installed: `notesmd-cli --version` `VERIFY exact version-flag output`
- At least one vault registered: `notesmd-cli list-vaults`
- A default vault set: `notesmd-cli set-default-vault <name>`

**Install `notesmd-cli`:**
```bash
# macOS / Linux (Homebrew)
brew tap yakitrak/yakitrak && brew install yakitrak/yakitrak/notesmd-cli

# Windows (Scoop)
scoop bucket add scoop-yakitrak https://github.com/yakitrak/scoop-yakitrak.git
scoop install notesmd-cli

# Arch (AUR)
yay -S notesmd-cli-bin

# From source (Go 1.19+) — clone + `go build`; NOTE: `go install` is not supported
```

**`obsidian` (official, app-backed):**
- Obsidian desktop **v1.12.4+** installed
- Enable in-app: **Settings → General → Command line interface → toggle on → "Register CLI"** (auto-adds `obsidian` to PATH on mac/Linux)
- Obsidian must be installed/registered **and the desktop app must already be running**; the CLI does not launch it (confirmed: exit 1 with `The CLI is unable to find Obsidian` when the app is down)

---

## 3. PROFILE SELECTION (notesmd-cli vs official obsidian)

| Need | Use | Reason |
|------|-----|--------|
| Create/edit/search notes with no app running | `notesmd-cli` | Filesystem-native, headless |
| Scripted / CI / server automation | `notesmd-cli` | No GUI dependency |
| Manage multiple vaults, set default | `notesmd-cli` | `add-vault`/`set-default-vault` |
| Drive the live app (open a note in the running UI) | `obsidian` | App-backed remote control |
| Resolved link graph: backlinks, orphans, unresolved | `obsidian` | Only the running app holds the resolved graph |
| Vault-wide tags, tasks or properties as the app computes them | `obsidian` | The index lives in the app, not in the files |
| Bases queries, sync history, file version history | `obsidian` | No filesystem equivalent |
| Plugin, theme or snippet state changes | `obsidian` | Mutates live app state |

> **Agent default:** prefer `notesmd-cli`. Only reach for the official `obsidian` CLI when the outcome genuinely requires the running app.

---

## 4. VAULT CONFIGURATION (notesmd-cli)

| Command | Description | Example |
|---------|-------------|---------|
| `notesmd-cli add-vault <path>` | Register a vault by filesystem path | `notesmd-cli add-vault ~/Notes` |
| `notesmd-cli add-vault <path> --name <name>` | Register with an explicit name `VERIFY flag` | `notesmd-cli add-vault ~/Notes --name work` |
| `notesmd-cli remove-vault <name>` | Unregister a vault | `notesmd-cli remove-vault work` |
| `notesmd-cli list-vaults` | List registered vaults | `notesmd-cli list-vaults` |
| `notesmd-cli set-default-vault <name>` | Set the vault used when `--vault` is omitted | `notesmd-cli set-default-vault work` |

**Config storage:** vault registrations live at `~/.config/obsidian/obsidian.json`.

**Agent pattern:** always confirm the target vault before a write.
```bash
notesmd-cli list-vaults              # See registered vaults + which is default
notesmd-cli set-default-vault work   # Pin the vault this session will operate on
```

---

## 5. NOTE READING & LISTING (notesmd-cli)

| Command | Description | Notes |
|---------|-------------|-------|
| `notesmd-cli list` | List notes in the (default) vault | Add `--vault <name>` to target another |
| `notesmd-cli print <note>` | Print a note's contents to stdout | Machine-readable; safe to pipe |
| `notesmd-cli search <query>` | Search note **titles/names** for a term | **Broken in v0.3.6 (validated):** returns "Cannot find note in vault" even for on-disk notes. Use `list` + filter or `search-content` for name lookups. |
| `notesmd-cli search-content <query>` | Full-text search across note **bodies** | Slower; scans file contents |

**Agent pattern — read before you write:**
```bash
notesmd-cli list | grep -i "Sprint"   # Find notes by name — notesmd-cli search (title) is broken in v0.3.6
notesmd-cli search-content "blocker"  # Find notes mentioning a term in the body (reliable)
notesmd-cli print "Sprint Board"      # Read the full note before editing
```

---

## 6. NOTE CREATION & MUTATION (notesmd-cli)

| Command | Description | Notes |
|---------|-------------|-------|
| `notesmd-cli create <note>` | Create a new note | `VERIFY` flags for content/body input (e.g. `--content`, stdin, or open-in-editor) |
| `notesmd-cli open <note>` | Open a note | Headless: resolves/prints the note `VERIFY`; app-backed open is the official CLI's job |
| `notesmd-cli daily` | Create/open today's daily note | Honors the vault's daily-note settings `VERIFY` |
| `notesmd-cli move <src> <dst>` | Move/rename a note (updates links) `VERIFY link-update` | Prefer over raw `mv` so backlinks follow |
| `notesmd-cli delete <note>` | Delete a note | Destructive — see agent invariants (§11) |
| `notesmd-cli frontmatter <note>` | Read/modify a note's YAML frontmatter | `VERIFY` get-vs-set flag surface |

> **`VERIFY` note:** exact flags for `create` (how body content is supplied) and `frontmatter` (read vs. set, key/value syntax) are not confirmed in this pass. Run `notesmd-cli <command> --help` against the installed binary to confirm before scripting bulk writes.

**Agent pattern — safe create:**
```bash
notesmd-cli search "Meeting 2026-08-02"       # Confirm it does not already exist
notesmd-cli create "Meeting 2026-08-02"       # Create it (VERIFY content-input flag)
notesmd-cli print "Meeting 2026-08-02"        # Read back to confirm
```

---

## 7. FULL SUBCOMMAND INVENTORY (notesmd-cli)

Fourteen subcommands, grouped by purpose:

| Group | Subcommands |
|-------|-------------|
| Read | `list`, `print`, `search`, `search-content` |
| Write | `create`, `daily`, `move`, `delete`, `frontmatter` |
| Navigate | `open` |
| Vault config | `add-vault`, `remove-vault`, `list-vaults`, `set-default-vault` |

> **Headless note:** every subcommand above operates on the vault **filesystem** and needs **no running Obsidian app**. This is what makes `notesmd-cli` safe for servers, CI, and unattended agent runs. Behavior that requires the live app (rendering, plugin execution, UI focus) is out of scope for `notesmd-cli` — use the official `obsidian` CLI (§8) for that.

---

## 8. OFFICIAL OBSIDIAN CLI (APP-BACKED)

The official `obsidian` binary ships inside Obsidian desktop **v1.12.4+** and is a remote control for a running app. It is **not** headless, and it does **not** start the app: with the app down every invocation prints `The CLI is unable to find Obsidian. Please make sure Obsidian is running and try again.` to stderr and exits 1.

**Enable it (one-time):** Settings → General → Command line interface → toggle on → **"Register CLI"**. On macOS/Linux this registers `obsidian` on PATH; the app must be installed.

**Syntax:** `obsidian <command> key=value`. The subcommands are `obsidian version` and `obsidian help`. POSIX flags are not the grammar: `obsidian --version`, `-v` and `-h` each print `Error: Command "..." not found.` and still exit 0. The one exception measured on 1.13.7 is `obsidian --help`, whose output is byte-identical to `obsidian help`. Do not rely on it, since it is undocumented.

**Command surface:** 106 commands, confirmed against desktop 1.13.7 (installer 1.13.4). `obsidian help` prints the authoritative list.

| Capability | Status | Notes |
|------------|--------|-------|
| Read, create, append, prepend, delete, move notes | Confirmed | `obsidian read file="Note"`, `obsidian create name="Note" content="..."` |
| Search the vault | Confirmed | `search` and `search:context`, both with `format=json` |
| Resolved link graph | Confirmed present | `backlinks`, `links`, `orphans`, `deadends`, `unresolved` — no filesystem equivalent |
| Vault-wide tags, tasks, properties | Confirmed present | `tags`, `tasks`, `properties`, `property:set` / `property:read` / `property:remove` |
| Bases queries, sync and file history | Confirmed present | `base:query`, `sync:*`, `history:*`, `diff` |
| Plugin, theme and snippet control | Confirmed present | `plugin:enable`, `theme:set`, `snippet:enable` and siblings |
| Arbitrary JavaScript in the live app | Confirmed | `eval code="..."` returns `=> <result>`. Not sandboxed |
| Launch the app if not running | **Not supported** | The CLI fails with exit 1 and leaves the app down |
| Headless file operations | Not supported | Use `notesmd-cli` — the official CLI requires the running app |

> **Two contracts an agent must respect before scripting this CLI.** First, run the preflight: `obsidian version` prints a version number only when the binary is registered **and** the app is answering. Test the output, not the status, because an app that is still starting answers 0 with an error on stdout. Second, once the app is up the CLI **exits 0 even on failure** and prints `Error: ...` to stdout, so `$?` is not a success signal. Both, with the command surface and the safety invariants, are in [`official-cli-agent-usage.md`](official-cli-agent-usage.md).

**When to prefer it:** when the outcome requires the live app — the resolved link graph, the computed tag and task index, Bases, sync or file history, plugin and theme state, or the UI itself. For everything file-shaped, `notesmd-cli` is faster and needs no app.

---

## 9. GLOBAL FLAGS (notesmd-cli)

> The official `obsidian` CLI has no POSIX flags. Its one global option is `vault=<name>`, accepted either before or after the command word.


| Flag | Applies To | Description |
|------|-----------|-------------|
| `--vault <name>` | Most commands | Target a specific registered vault instead of the default `VERIFY flag name` |
| `--help` / `-h` | All | Print usage for the command (authoritative source for exact flags) |
| `--version` | — | Print `notesmd-cli` version `VERIFY exact spelling` |

> When in doubt about a flag, `notesmd-cli <command> --help` on the installed binary is authoritative — this document marks unconfirmed specifics `VERIFY` rather than guessing.

---

## 10. HEADLESS WORKFLOW RECIPES (notesmd-cli)

**Create a dated note, then read it back:**
```bash
notesmd-cli create "Standup $(date -u +%Y-%m-%d)"
notesmd-cli print  "Standup $(date -u +%Y-%m-%d)"
```

**Find notes touching a topic, across titles and bodies:**
```bash
notesmd-cli search "roadmap"            # Title-level
notesmd-cli search-content "roadmap"    # Body-level (full-text)
```

**Open (or create) today's daily note:**
```bash
notesmd-cli daily
```

**Rename a note so backlinks follow:**
```bash
notesmd-cli move "Draft" "Published/Launch Plan"   # Prefer over raw mv (VERIFY link-update)
```

---

## 11. AGENT INVARIANTS (MUST FOLLOW)

### 1. Confirm the vault before writing

```bash
# WRONG — assume the default vault is the intended one:
notesmd-cli create "Important Note"

# RIGHT — verify which vault is default first:
notesmd-cli list-vaults                  # Which vault is default?
notesmd-cli set-default-vault work       # Pin it explicitly for this session
notesmd-cli create "Important Note"
```

### 2. Read before mutate

```bash
notesmd-cli search "Sprint Board"        # Does it exist?
notesmd-cli print  "Sprint Board"        # Read current contents
# THEN edit / move / delete
```

### 3. Delete and move are destructive — confirm the target

```bash
# WRONG — delete on an unverified name:
notesmd-cli delete "Notes"               # Ambiguous — which note?

# RIGHT — resolve the exact note first:
notesmd-cli search "Notes"               # Confirm the exact title
notesmd-cli print  "Notes/2026-08-02"    # Confirm it is the right file
notesmd-cli delete "Notes/2026-08-02"
```

### 4. Empty search result is VALID

```bash
# An empty result means no matching note exists — not an error.
result="$(notesmd-cli search "nonexistent" || true)"
if [[ -z "$result" ]]; then
  echo "No matching note. Not fabricating one."
  # Before escalating: try search-content, check the vault, verify spelling.
  notesmd-cli search-content "nonexistent"
  notesmd-cli list
fi
```

### 5. Prefer notesmd-cli; escalate to the official CLI only for app-only outcomes

The official `obsidian` CLI needs an **already-running** app and does not start one. Do not route a file-shaped task to it. Reach for it only when the result requires the live app (§8), and before depending on it run the preflight `obsidian version` and check its output looks like a version — exit 0 means the binary is registered and the app is up. Once the app is running the CLI **exits 0 on failure**, so check its stdout for a leading `Error:` rather than `$?`. Full contract: [`official-cli-agent-usage.md`](official-cli-agent-usage.md).

---

## 12. CONFIGURATION STORAGE

| Profile | Config location |
|---------|-----------------|
| `notesmd-cli` | Vault registrations at `~/.config/obsidian/obsidian.json` |
| `obsidian` (official) | Managed in-app (Settings → General → Command line interface). On macOS registration symlinks `/usr/local/bin/obsidian` into the app bundle; no separate CLI config file |

---

## 13. GETTING HELP

- `notesmd-cli` repo: https://github.com/Yakitrak/obsidian-cli
- `notesmd-cli <command> --help` — authoritative per-command flag reference
- Official Obsidian CLI: enable via Settings → General → Command line interface, then `obsidian help` (not `--help`, which is not a valid flag)
- Official CLI agent contract: [`official-cli-agent-usage.md`](official-cli-agent-usage.md)
- Obsidian CLI vendor reference: https://obsidian.md/help/cli
- Obsidian help/docs: https://help.obsidian.md/
