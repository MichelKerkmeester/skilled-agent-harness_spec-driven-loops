---
title: mcp-obsidian
description: Makes Obsidian usable by an AI: note operations across headless and live-app surfaces, plus deep plugin knowledge so the data behind your plugins can be operated directly.
trigger_phrases:
  - "obsidian"
  - "obsidian vault"
  - "notesmd-cli"
  - "obsidian mcp"
  - "local rest api"
version: 0.12.0.0
---

# mcp-obsidian

> Obsidian is your knowledge base. This skill makes it an AI workspace too: notes, daily notes, tags and the data behind the plugins you rely on, all operable by an agent.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Note and vault operations in Obsidian, plus file-layer automation of community plugins and the Minimal theme (Beancount, Tables, BRAT, Health.md, Iconic, Charts, Dataview, Excalidraw, Git, Outliner) |
| **Invoke with** | "obsidian", "notesmd-cli", "obsidian vault", "daily note", "local rest api", a plugin name or an `obsidian_*` MCP operation |
| **Works on** | Vault files directly with no running app or through the live desktop app and its Local REST API when the situation needs it |
| **Produces** | Created, moved and tagged notes, daily notes, vault registrations, live-app opens and plugin data files edited at the file layer |

---

## 2. OVERVIEW

### Why This Skill Exists

Obsidian holds your thinking. Notes, daily notes, tags and a growing stack of plugins that turn plain files into ledgers, tables, dashboards and icon rules. The value of AI in that workspace comes from one thing: an agent that can actually work with what the vault contains.

That is the whole reason this skill exists. It makes AI use inside Obsidian effective. It knows how to read and write vault files headlessly, how to reach the live app when the UI itself is the goal and how to understand the plugins you run at the data level so it can operate them without guessing. The skill is not a launcher for two CLIs. The CLIs and the MCP are the means. Working with your knowledge and your plugins is the point.

### What It Does

The skill gives an agent three ways to touch a vault, chosen by what the request needs:

- `notesmd-cli` (Yakitrak) operates the vault filesystem directly. No app, no token. Registration, search, print, create, move, delete, frontmatter, daily notes.
- The official `obsidian` CLI (ships with Obsidian desktop v1.12.4+) remote-controls a running app for in-app opens and `obsidian://` URI actions.
- The cyanheads Obsidian MCP exposes a structured 14-tool `obsidian_*` surface through Code Mode when the live app and Local REST API are available.

On top of those surfaces sits the plugin knowledge layer. The mode treats each community plugin as a file format: Beancount ledgers, `.table.md` JSON payloads, BRAT install state, Health.md export files with `health-viz` render blocks, the Iconic `data.json` rulebook, Charts render blocks, Dataview metadata and queries, Excalidraw drawing notes, Obsidian Git repositories and the Minimal theme file layer. Instead of driving plugin UI that no headless agent can reach, it edits the data the plugin renders.

### The Plugin Knowledge Layer

| Plugin | What the skill knows how to operate |
|---|---|
| **Beancount Ledger** | append and patch balanced transactions in the structured `.beancount` ledger |
| **Obsidian Tables** | edit `columns`, `rows` and `views` inside `.table.md` JSON payloads |
| **BRAT** | stage GitHub beta-plugin assets, register repos and activate manifest IDs |
| **Health.md** | create and validate Apple and Android Health export files, place `health-viz` render blocks and detect the bundled mock-data fallback |
| **Iconic** | merge the canonical 21 file rules and 11 folder rules into `data.json` with backup-before-write discipline |
| **Charts** | author and validate chart render blocks and operate the settings file with backup discipline |
| **Dataview** | add and patch note metadata (frontmatter and inline fields) and author DQL query blocks |
| **Excalidraw** | create and patch `.excalidraw.md` drawing notes and validate embedded JSON documents |
| **Git** | read vault git state and operate settings. Destructive operations only on throwaway repos |
| **Outliner** | operate the minimal settings file. The plugin is an editor-behavior contract with no note format |
| **Minimal** | verify theme install and activation and propose snippet tweaks, never editing `theme.css` in a real vault |

---

## 3. QUICK START

**Step 1: Install or inspect the headless profile.**

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh
```

The script installs `notesmd-cli` through Homebrew when available, then prints the app-backed CLI and MCP setup steps without changing configuration files. Confirm with:

```bash
notesmd-cli --version
notesmd-cli list-vaults
```

`--version` prints a version string. `list-vaults` shows registered vaults and the default.

**Step 2: Register and confirm a vault.**

```bash
notesmd-cli add-vault "/path/to/Vault"
notesmd-cli set-default-vault "Vault"
notesmd-cli list
notesmd-cli search "meeting"
```

`notesmd-cli` now works without launching Obsidian. Empty `list` or `search` output is valid, not an error. It means the default vault is empty or has no match.

**Step 3: Enable the app-backed CLI only when the live UI is the target.**

In Obsidian desktop v1.12.4+: Settings → General → Command line interface → toggle on → Register CLI. That registers `obsidian` on PATH on macOS and Linux. Confirm the command surface with `obsidian --help`.

**Step 4: Use the MCP for structured live-app operations.**

The MCP needs a running Obsidian app, the Local REST API plugin v4.0.0+ with an API key and the `obsidian` Code Mode manual. Enumerate the tools before calling one:

```typescript
const tools = await list_tools();
const info = await tool_info("obsidian.obsidian_get_note");
```

---

## 4. HOW IT WORKS

### The Router

Every request starts with a surface decision. The headless filesystem path is the default because it works everywhere, even in CI and over SSH. The live-app paths engage only when the request needs app state, the app is running and the API prerequisites hold. The skill probes, never assumes.

| Need | Primary surface | Why |
|---|---|---|
| Vault registration, daily note, list, print, filename or content search | `notesmd-cli` | Filesystem-native and headless |
| Create, move, delete or edit frontmatter with no app | `notesmd-cli` | Works directly on vault Markdown files |
| Open or control the live app | official `obsidian` CLI | App-backed remote control |
| Structured note reads, writes, tags or live-vault search | `obsidian-mcp-server` via Code Mode | Local REST API returns structured MCP results |
| Plugin data operations | file layer through either surface | The mode edits the files a plugin renders |

### The File-Layer Doctrine

Obsidian plugins are render layers over plain data. The skill operates the data, not the UI. For each plugin it knows where the data lives, what shape it takes and how to mutate it safely. The full contract lives in `references/plugins/plugin-operation-logic.md`.

### Safety Invariants

- Resolve the surface before acting. Do not launch Obsidian just to run a headless operation.
- Confirm the default vault before a write.
- Preview destructive note ops. Read a note before moving or deleting it.
- Quote note names and vault paths. They contain spaces.
- Treat empty search results as valid. Never invent a note.
- Confirm MCP tool names with `tool_info()` before calling `obsidian.obsidian_*`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Use this mode for an Obsidian vault, a daily note, a note search, a Local REST API operation or one of the supported plugin data formats. Use `notesmd-cli` whenever a vault-file outcome is enough. Use the official CLI when the live app is part of the intended result. Use the MCP when the live app is available and you need its structured note or tag API. The router deliberately prefers the headless path until a live-app capability is necessary.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the Code Mode MCP transport used by `obsidian.obsidian_*` calls |
| `mcp-click-up` | Structural sibling with the same CLI plus MCP orchestrator pattern |
| `sk-code` | Owns application-code standards when an application consumes or produces the notes |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `notesmd-cli: command not found` | The headless CLI is missing or its install prefix is not on PATH | Run the mode-root installer and use its printed Scoop, AUR or source-build alternatives when Homebrew is unavailable |
| `notesmd-cli` has no default vault | No vault has been registered and selected | Run `notesmd-cli add-vault <path>` then `notesmd-cli set-default-vault <name>` |
| `obsidian: command not found` | The desktop CLI is not enabled or registered | In Obsidian v1.12.4+, enable Command line interface and click Register CLI |
| MCP connection refused | The app is closed, Local REST API is disabled or the base URL is wrong | Start Obsidian with the target vault, enable Local REST API v4.0.0+ and check `OBSIDIAN_BASE_URL` |
| MCP returns 401 or 403 | `OBSIDIAN_API_KEY` is absent, wrong or the plugin is disabled | Copy a fresh Local REST API token into the Code Mode environment and restart the AI client |
| MCP tool not found | The manual is not registered or the callable name was guessed | Run `list_tools()` and `tool_info()`, then use `obsidian.obsidian_<tool>` after confirming it |
| Search returns no note | The query has no match or the wrong vault is active | Try `search-content`, check `list-vaults` and report the empty result if it stays empty |

Full recovery procedures live in `references/troubleshooting.md`.

---

## 7. FAQ

**Q: When should I use `notesmd-cli` instead of the official `obsidian` CLI?**

A: Use `notesmd-cli` for filesystem operations and any work that must run without the desktop app. Use the official CLI only for an app-backed outcome such as opening or controlling the live UI. They are different binaries with different runtime requirements.

**Q: When should I use the cyanheads MCP?**

A: Use it for structured note reads, writes, search or tag operations against a running Obsidian app with Local REST API enabled. If the app or token is unavailable, use `notesmd-cli` instead.

**Q: Does the install script change `.utcp_config.json` or `.env`?**

A: No. `scripts/install.sh` prints the exact Code Mode manual and `obsidian_OBSIDIAN_*` environment keys. It never writes configuration files. The mode documents the wiring. Registration is owned by a later configuration phase.

**Q: Are all 14 MCP tool names documented?**

A: No. Five core names are confirmed. Use `list_tools()` to enumerate the live 14-tool inventory and `tool_info()` to verify a particular signature before relying on it.

**Q: Is an empty note search an error?**

A: No. Empty output means the selected vault has no match. Verify the vault and query spelling, then report the absence rather than creating a fictional result.

**Q: What does the skill know about my plugins?**

A: It ships reference sets for Beancount, Obsidian Tables, BRAT, Health.md, Iconic, Charts, Dataview, Excalidraw, Git, Outliner and the Minimal theme. Each set covers the data model, file-layer workflows and troubleshooting. The operation-logic reference generalizes the pattern to future plugins.

---

## 8. VERIFICATION

The mode-root scripts are the first checks because they separate required headless pieces from optional app-backed pieces.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-obsidian/README.md --type readme` reports zero issues |
| Setup diagnostics | `bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh` reports the detected CLI, app and MCP prerequisites without changing them |
| Headless CLI | `notesmd-cli --version && notesmd-cli list-vaults && notesmd-cli list` succeeds. An empty note list is valid |
| Official CLI | After in-app registration, `obsidian --help` prints its current command surface |
| MCP health | With the manual registered, `list_tools()` shows `obsidian.obsidian_*` entries and `tool_info("obsidian.obsidian_get_note")` resolves a live schema |
| Example scripts | `mcp-roundtrip.sh` preflights and prints a Code Mode reference. Run `headless-notes-workflow.sh` only against a chosen vault and `beancount-transaction.sh` against its scratch or designated ledger |

The manual testing playbook (`manual-testing-playbook/manual-testing-playbook.md`) runs every scenario behind these checks.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime router, agent invariants, quick reference and resource map |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Step-by-step installation and configuration for both CLI profiles and the MCP |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current-state inventory of every CLI, MCP and plugin capability |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate each catalog entry |
| [`references/plugins/plugin-operation-logic.md`](./references/plugins/plugin-operation-logic.md) | The file-layer operating model shared by all plugin references |
| [`references/obsidian-cli-commands.md`](./references/obsidian-cli-commands.md) | Detailed `notesmd-cli` and official `obsidian` CLI reference, including `VERIFY` boundaries |
| [`references/mcp-tools.md`](./references/mcp-tools.md) | Cyanheads MCP prerequisites, confirmed core tools and Code Mode invocation pattern |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | PATH, vault, Local REST API, auth and MCP recovery guide |
| [`examples/README.md`](./examples/README.md) | Index for the headless notes, MCP roundtrip and Beancount workflows |
| [`scripts/install.sh`](./scripts/install.sh) | Installs the headless CLI when possible and prints the official CLI and MCP setup steps |
| [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only environment diagnostics |
