---
title: mcp-obsidian
description: "Makes Obsidian usable by an AI: note operations across headless and live-app surfaces, plus deep plugin knowledge so the data behind your plugins can be operated directly."
trigger_phrases:
  - "obsidian"
  - "obsidian vault"
  - "notesmd-cli"
  - "obsidian mcp"
  - "local rest api"
version: 0.18.7.0
---

# mcp-obsidian

> An agent that works inside your Obsidian vault: it reads and writes notes, finds what you wrote and edits the data your plugins render.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Note, daily-note, tag and plugin-data work in an Obsidian vault |
| **Invoke with** | "obsidian", "obsidian vault", "notesmd-cli", "local rest api" or a plugin name |
| **Works on** | Vault files with no app running, plus the live desktop app through its CLI and Local REST API |
| **Produces** | Notes created, moved, read and tagged, plus plugin data edited at the file layer |

### What It Does

The headless `notesmd-cli` is the default: Yakitrak's binary reads and writes vault files directly, so it needs no running app and no token. When the result needs a live app, the official `obsidian` CLI takes over and the cyanheads MCP covers structured note work against that same open app. The official CLI reaches what the files cannot: the resolved link graph, the computed task and tag index, Bases, sync and plugin state. The routes and the files each one loads live in the [router](./ROUTER.md).

### The Plugin and Theme Knowledge Layer

Obsidian plugins draw their output from files in the vault. The skill treats each documented plugin as a file format and edits that data, so the work is possible with no plugin UI in reach.

| Capability | What the skill knows how to operate |
|---|---|
| **Health.md Visualizations** | Create and validate Apple and Android health exports, place `health-viz` render blocks and recognise the bundled example data |
| **Iconic** | Merge the full 21 file rules and 11 folder rules into `data.json`, backing up before every write |
| **Theme system** | Read a theme package, confirm activation through `cssTheme`, customize with CSS snippets and variables, never edit a shipped theme's own stylesheet |

---

## 2. QUICK START

**Step 1: Check what the machine has.**

```bash
bash .skilled/skills/mcp-tooling/mcp-obsidian/scripts/install.sh --check-only
```

The run exits 0 and prints Phase 1 and Phase 2, with every checklist line marked with a check or a warning. The notesmd-cli phase reports the installed path when the CLI is present, otherwise it says the CLI will be installed. The final line says no installation was performed.

**Step 2: Register a vault and confirm a read.**

Register the vault once with `notesmd-cli add-vault "/path/to/Vault"`, then pin it with `notesmd-cli set-default-vault "Vault"`. Confirm it reads:

```bash
notesmd-cli list-vaults
notesmd-cli list
```

`list-vaults` prints one line per registered vault: the name followed by the folder path. `list` prints the files and folders in the default vault, one entry per line. An empty list is valid for an empty vault. With no default vault resolved, `list` prints `Vault not found in Obsidian config file.` and exits 1.

**Step 3: Enable the app-backed CLI when the live app is the target.**

In Obsidian desktop v1.12.4 or later, open Settings → General → Command line interface, turn it on and click Register CLI. Then confirm the binary and the app:

```bash
obsidian version
```

A version number and exit 0 mean the binary is registered and the app is running. With the app closed it prints `The CLI is unable to find Obsidian. Please make sure Obsidian is running and try again.` and exits 1. It never launches the app.

**Step 4: Register the MCP manual for structured live-vault work.**

The MCP path needs Code Mode, a running app, the Local REST API plugin v4.0.0 or later with an API key and the `obsidian` manual in `.utcp_config.json`. The [installation guide](./INSTALL-GUIDE.md) shows that manual and the environment keys. Enumerate the tools before you call one:

```typescript
const tools = await list_tools();
const info = await tool_info("obsidian.obsidian_get_note");
```

`list_tools()` returns the manual's tools under names of the form `obsidian.obsidian_<tool>`. `tool_info()` returns one tool's schema. A missing name means the manual is not registered or the callable name changed.

---

## 3. HOW IT WORKS

Every request starts with a surface decision. Vault files are the default because the headless CLI works in CI, over SSH and with no app open. An app-backed surface waits until the result needs the running app.

```text
┌──────────────────────────────────┐
│ Obsidian request                 │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐            ┌──────────────────────────────────┐
│ Vault files are enough?          │   [YES] ─▶ │ notesmd-cli on the vault files   │
└────────────────┬─────────────────┘            └──────────────────────────────────┘
                 │ [NO]
                 ▼
┌──────────────────────────────────┐            ┌──────────────────────────────────┐
│ App running?                     │    [NO] ─▶ │ Start Obsidian, then retry       │
└────────────────┬─────────────────┘            └──────────────────────────────────┘
                 │ [YES]
                 ▼
┌──────────────────────────────────┐            ┌──────────────────────────────────┐
│ MCP-only work or a long batch?   │    [NO] ─▶ │ official obsidian CLI            │
└────────────────┬─────────────────┘            └──────────────────────────────────┘
                 │ [YES]
                 ▼
┌──────────────────────────────────┐
│ cyanheads MCP through Code Mode  │
└──────────────────────────────────┘
```

### Choosing a Surface

The official CLI is the default among the app-backed surfaces. It needs only the running app, exposes 106 commands against the MCP server's 12 and answers in about 38 ms per call. The MCP wins on the four capabilities below and on a warm batch over roughly twenty calls, where it costs about 3 ms per call after a startup of 724 ms or more. The measured comparison is in [the CLI and MCP comparison](./references/cli-versus-mcp.md).

| Need | Surface | Why |
|---|---|---|
| Vault registration, note listing, content search, create, move, delete, frontmatter or daily note | `notesmd-cli` | Filesystem only. No app and no token |
| Link graph, tasks, Bases, sync, file history, plugin state or an in-app open | official `obsidian` CLI | 106 commands. Only the live app holds that state |
| Section patch, in-note search and replace, a real tag list, JSON-typed frontmatter or a batch over about 20 calls | cyanheads MCP | 12 tools. Warm calls cost about 3 ms against the CLI's 38 |
| Icon rules, health files or theme files | direct file edits | The skill edits the data that the plugin or theme reads |

Once the app is up, the official CLI exits 0 even when a command fails. Read stdout for a leading `Error:` or the bare `Vault not found.` and treat either as a failure. `obsidian version` is the one call whose exit status means something, so run it before any other command. Always name a target: a bare `obsidian read` returns the note the person has open. `obsidian daily:read` creates today's daily note.

**Four rules hold on every surface.**

- Resolve the surface before acting. Do not launch Obsidian for a headless task.
- Confirm the default vault before a write.
- Read a note before you move or delete it. Quote note names and vault paths.
- Re-read plugin data before a write.

### The File-Layer Rule

Almost every plugin persists its state as text or JSON in the vault, so the skill edits that data instead of driving plugin UI that no headless agent can reach. It locates the exact artifact first and re-reads the file before a write. Keys it does not own stay untouched. A rendered change still needs an in-app reload, because the file layer proves the data changed and not the pixels. The full contract is in [the plugin operation reference](./references/plugins/plugin-operation-logic.md).

Health.md carries a trap worth knowing. An empty or missing data folder falls back to bundled example data, so a rendered chart proves neither that the folder was found nor that a real export parsed. Point at the configured folder and confirm one authentic export before you trust a chart.

A theme is a stylesheet package with no behavior. The skill reads it from the vault's theme folder, confirms the active theme through `cssTheme` and puts customization in CSS snippets, never in a shipped theme's own files.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when a request names Obsidian, a vault, a daily note, a note search, a Local REST API call or one of the documented plugins. The common case is a vault-file task that needs no app. The app-backed CLI takes over when the result needs the live app. Plugin data edits and structured note batches are the remaining work.

Generic markdown authoring outside a vault belongs to `sk-doc`. Note apps other than Obsidian are out of scope.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Runs the `obsidian.obsidian_*` calls through Code Mode |
| `mcp-click-up` | Sibling mode with the same CLI plus MCP shape |
| `sk-doc` | Owns generic markdown authoring outside a vault |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `notesmd-cli: command not found` | The CLI is missing or its install prefix is not on PATH | Run `scripts/install.sh`, which prints the manual install routes when Homebrew is unavailable |
| `Vault not found in Obsidian config file.` | The default vault is not set, or it does not resolve in Obsidian's config | Run `notesmd-cli add-vault "/path/to/Vault"` then `notesmd-cli set-default-vault "Vault"` |
| `obsidian: command not found` | The desktop CLI is not enabled or registered | Enable Command line interface and click Register CLI in Obsidian v1.12.4 or later |
| `The CLI is unable to find Obsidian.` | The binary is registered, but the app is not running | Start Obsidian and wait for `obsidian version` to exit 0. The CLI does not launch it |
| MCP connection refused | The base URL is wrong or the app is closed with Local REST API disabled | Start Obsidian with the target vault. Enable Local REST API v4.0.0 or later and check `OBSIDIAN_BASE_URL` |
| MCP returns 401 | `OBSIDIAN_API_KEY` is absent or wrong | Copy a fresh Local REST API token into the Code Mode environment and restart the client |
| MCP tool not found | The manual is not registered or the callable name was guessed | Run `list_tools()` then `tool_info()`. Call the confirmed `obsidian.obsidian_<tool>` name |
| Search returns no note | The query has no match or the wrong vault is active | Try `search-content` and check `list-vaults`, then report the empty result |

Full recovery procedures live in [the troubleshooting guide](./references/troubleshooting.md).

---

## 6. FAQ

### Which CLI should I use, notesmd-cli or the official obsidian CLI?

Use `notesmd-cli` for filesystem work and anything that must run without the desktop app. Use the official CLI for a result that only the running app can produce, such as a link graph or an in-app open. They are separate binaries with separate prerequisites.

### When is the cyanheads MCP worth the extra setup?

For the four things the official CLI cannot do: patch a section in place, search and replace inside one note, write a tag as a real YAML list and set a JSON-typed frontmatter value. It also wins on a warm batch over roughly twenty calls. The evidence is in [the CLI and MCP comparison](./references/cli-versus-mcp.md).

### Does the install script change .utcp_config.json or .env?

No. `scripts/install.sh` prints the manual and the `obsidian_OBSIDIAN_*` environment keys. It stays read-only. The `obsidian` manual and those keys are already registered in `.utcp_config.json` and `.env.example`.

### How many MCP tools does the server expose?

Twelve. The server builds 14 and withholds `obsidian_list_commands` and `obsidian_execute_command` while `enableCommands` is false. All twelve are named and exercised in [the MCP tools reference](./references/mcp-tools.md). Confirm with `list_tools()` before relying on any signature.

### What does the skill know about my plugins?

It ships reference sets for Health.md and Iconic under `references/plugins/`. The theme system has its own set under `references/themes/`. The installed-plugins roster lists all 24 enabled plugins and notes which two carry dedicated docs. `plugin-operation-logic.md` generalizes the pattern to a plugin with no reference yet.

---

## 7. VERIFICATION

Run these from the repository root.

| Check | Command | What a pass looks like |
|---|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-tooling/mcp-obsidian/README.md --type readme` | Reports `VALID` with `Total issues: 0` |
| Setup diagnostics | `bash .skilled/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh` | A checklist with no `✗` lines. Warnings for absent optional pieces are expected |
| Headless CLI | `notesmd-cli --version` | A version string and exit 0, for example `notesmd-cli version v0.3.7` |
| Vault read | `notesmd-cli list-vaults` then `notesmd-cli list` | At least one vault line, then note names. An empty list is valid |
| Official CLI | `obsidian version` | A version number and exit 0, which requires the app to be running |
| MCP inventory | `list_tools()` in Code Mode | Names in the `obsidian.obsidian_<tool>` form, including `obsidian.obsidian_get_note` |
| Example scripts | `bash .skilled/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh` | The Local REST API preflight and a Code Mode reference. It does not call the MCP |
| Migration parity | `bash .skilled/skills/mcp-tooling/mcp-obsidian/scripts/verify-notion-migration-parity.sh --vault /path/to/vault` | One `PASS`, `FAIL` or `SKIP` line per check, with a summary count |

The scenarios behind these checks live in the [manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md).

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and the agent invariants |
| [`ROUTER.md#3-machine-router`](./ROUTER.md#3-machine-router) | The ten intents and the files each one loads |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Install and configuration for both CLI profiles and the MCP |
| [`references/cli-versus-mcp.md`](./references/cli-versus-mcp.md) | Measured CLI and MCP comparison and the default it sets |
| [`references/obsidian-cli-commands.md`](./references/obsidian-cli-commands.md) | Both CLI command surfaces, with `VERIFY` boundaries marked |
| [`references/official-cli-agent-usage.md`](./references/official-cli-agent-usage.md) | Preflight, exit-0 contract and safety rules for the official CLI |
| [`references/mcp-tools.md`](./references/mcp-tools.md) | The 12-tool MCP catalog and the Code Mode call pattern |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | PATH, vault, Local REST API and auth recovery |
| [`references/notion-migration.md`](./references/notion-migration.md) | Notion to Obsidian reconstruction method |
| [`references/plugins/plugin-operation-logic.md`](./references/plugins/plugin-operation-logic.md) | The file-layer model shared by every plugin reference |
| [`references/plugins/installed-plugins.md`](./references/plugins/installed-plugins.md) | All 24 enabled plugins and which two carry dedicated docs |
| [`references/themes/themes.md`](./references/themes/themes.md) | Theme package, activation and the file-layer stance |
| [`feature-catalog/FEATURE-CATALOG.md`](./feature-catalog/FEATURE-CATALOG.md) | Current inventory of CLI, MCP and plugin capabilities |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The 19 manual scenarios behind the checks |
| [`scripts/install.sh`](./scripts/install.sh) | Installs the headless CLI and prints the app-backed setup |
| [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only environment diagnostics |
| [`examples/README.md`](./examples/README.md) | The example note, MCP and official-CLI workflows |

<!-- readme-check
allow-ref data.json | the Iconic community plugin rulebook inside an Obsidian vault, written by the live plugin rather than kept in this repository
allow-count 24 enabled plugins | matches the roster count in references/plugins/installed-plugins.md
-->
