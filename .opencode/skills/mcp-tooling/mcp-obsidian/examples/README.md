---
title: "mcp-obsidian - Example Scripts"
description: "Reference bash workflows for headless Obsidian note operations, app-backed MCP preflight, and file-layer Beancount transactions"
trigger_phrases:
  - "obsidian examples"
  - "notesmd-cli workflow"
  - "obsidian mcp roundtrip"
  - "beancount transaction script"
---

# mcp-obsidian - Example Scripts

> Reference bash workflows for headless vault operations, app-backed MCP preparation, and file-layer plugin data writes.

---

- 3.1 [headless-notes-workflow.sh](#31-headless-notes-workflowsh)
- 3.2 [mcp-roundtrip.sh](#32-mcp-roundtripsh)
- 3.3 [beancount-transaction.sh](#33-beancount-transactionsh)

---

## 1. OVERVIEW

This directory contains three focused examples for the mcp-obsidian mode. They demonstrate the three runtime shapes the mode supports: filesystem-native notes with `notesmd-cli`, a reference flow for Code Mode calls against a live Local REST API, and a plugin data operation that edits a Beancount ledger instead of a plugin UI.

### Key Features

**Headless Note Operations**

- Runs with `notesmd-cli` and no running Obsidian app
- Verifies vault registration, searches before creating, and reads the result back
- Avoids recreating an exact note title when it is already present

**MCP Roundtrip Reference**

- Checks the Local REST API and token preconditions without calling Code Mode from Bash
- Prints the `call_tool_chain({ code })` pattern for a read/append/write flow
- Keeps tool names and parameter schemas explicit `VERIFY` points until `list_tools()` / `tool_info()` confirms them

**File-Layer Beancount Data**

- Creates or extends a balanced `.beancount` ledger
- Uses a scratch ledger by default, or a supplied `LEDGER` value
- Runs `bean-check` when available and otherwise states that validation was skipped

**Agent Safety**

- `set -euo pipefail` in all three scripts
- Headless flow reads/searches before a note mutation
- MCP example does not falsely claim Bash can invoke Code Mode directly
- Beancount flow validates balances when `bean-check` is present

---

## 2. PREREQUISITES

```bash
# Headless note workflow
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh
notesmd-cli --version
notesmd-cli list-vaults

# Optional Beancount validation
command -v bean-check >/dev/null || echo "Install Beancount for ledger validation"

# Optional MCP roundtrip preflight
command -v curl >/dev/null || echo "Install curl to probe Local REST API"
```

**Required by script:**

- `headless-notes-workflow.sh`: `notesmd-cli` and at least one registered vault
- `mcp-roundtrip.sh`: no mandatory local binary beyond its optional `curl` probe; executing the printed TypeScript requires the later Code Mode manual, a running app, Local REST API v4.0.0+, and `OBSIDIAN_API_KEY`
- `beancount-transaction.sh`: a writable `LEDGER` path or its default scratch path; `bean-check` is optional but recommended

---

## 3. AVAILABLE SCRIPTS

### 3.1 headless-notes-workflow.sh

**Purpose:** Run a safe `notesmd-cli` note workflow without a running Obsidian app.

**Usage:**

```bash
# Use the registered default vault and today's default title
bash examples/headless-notes-workflow.sh

# Target a named vault and explicit title
VAULT="Work" NOTE_TITLE="Standup 2026-08-02" \
  bash examples/headless-notes-workflow.sh

# Use a different search term before creation
SEARCH_TERM="Roadmap" bash examples/headless-notes-workflow.sh
```

**What it does:**

1. Verifies that `notesmd-cli` resolves and at least one vault is registered.
2. Searches note titles before writing; an empty result is handled as valid.
3. Checks whether the exact title already exists and skips creation when it does.
4. Creates the note with `notesmd-cli create` when needed.
5. Prints the note back for a read-after-write check.

The script's `--vault` usage is `VERIFY` against the installed binary before relying on a named-vault run. Its default-vault path needs no unconfirmed flag.

**Exit codes:**

- `0` — Preflight and note workflow succeeded, including an idempotent existing-note result
- Non-zero — `notesmd-cli` is unavailable, no vault is registered, or a required note operation failed

**Use cases:**

- CI, SSH, and unattended note capture
- Daily note or standup creation without opening Obsidian
- Validating a vault registration before an agent workflow

---

### 3.2 mcp-roundtrip.sh

**Purpose:** Preflight the live-app MCP requirements and print a Code Mode note roundtrip reference.

**Usage:**

```bash
# Probe the default Local REST API endpoint and print the TypeScript reference
bash examples/mcp-roundtrip.sh

# Label an explicit target note path in the preflight output and probe an endpoint
NOTE_PATH="Daily/2026-08-02.md" \
OBSIDIAN_BASE_URL="http://127.0.0.1:27123" \
  bash examples/mcp-roundtrip.sh
```

**What it does:**

1. Reports whether `OBSIDIAN_API_KEY` is set without revealing it.
2. Uses `curl` when available to probe the running app's Local REST API.
3. Prints a TypeScript `call_tool_chain({ code })` example that reads a note, appends an idempotent marker section, and writes it back.
4. Reminds the operator to enumerate the full 14-tool surface with `list_tools()` and verify the individual schema with `tool_info()`.

**It does not call the MCP itself.** Code Mode executes inside the AI runtime, not from Bash. `NOTE_PATH` labels the preflight output; replace the printed sample path after confirming the live tool schema. The shown `path` and `content` argument names are representative and must also be confirmed first.

**Exit codes:**

- `0` — The reference and any available preflight checks ran
- Non-zero — Shell-level script failure

**Use cases:**

- Preparing a live-app MCP session without writing a note
- Explaining why an MCP operation should route back to `notesmd-cli` when the app is unavailable
- Copying a verified invocation shape into a Code Mode session after live tool discovery

---

### 3.3 beancount-transaction.sh

**Purpose:** Append a balanced transaction to a Beancount ledger used by the Beancount Ledger plugin, then validate it when `bean-check` is available.

**Usage:**

```bash
# Use the script's scratch ledger under the temporary directory
bash examples/beancount-transaction.sh

# Target a designated ledger with custom transaction details
LEDGER="/path/to/Vault/Finance/main.beancount" \
PAYEE="Book Store" NARRATION="Research books" AMOUNT="24.00" \
  bash examples/beancount-transaction.sh
```

**What it does:**

1. Creates the scratch ledger and opens its two required accounts when it does not exist.
2. Appends a transaction whose expense and asset postings sum to zero.
3. Runs `bean-check` if it is available; otherwise it preserves the result and warns that validation was skipped.
4. Prints the ledger tail so the new entry is visible.

**Exit codes:**

- `0` — Transaction appended and any available validation passed
- Non-zero — `bean-check` found an invalid ledger or the script could not complete its work

**Use cases:**

- Demonstrating the file-layer plugin model
- Adding a validated Beancount Ledger transaction
- Exercising a disposable scratch ledger before targeting a real vault ledger

---

## 4. COMMON PATTERNS

### Headless Note Capture

```bash
# Confirm vault configuration before changing notes
notesmd-cli list-vaults

# Run the safe file-system workflow
NOTE_TITLE="Decision Log 2026-08-02" \
  bash examples/headless-notes-workflow.sh
```

### Decide Between MCP and Headless Work

```bash
# This only probes prerequisites and prints the Code Mode example.
bash examples/mcp-roundtrip.sh

# If the app or API is unavailable, stay on the filesystem route.
notesmd-cli search-content "roadmap"
```

### Validate a Plugin Data Change First

```bash
# Use the default scratch ledger before assigning a real LEDGER path.
bash examples/beancount-transaction.sh

# After a validated run, open or reload the plugin dashboard in Obsidian.
```

---

## 5. CUSTOMIZATION TIPS

### Choose the Vault and Note Title

The headless workflow accepts environment variables rather than positional arguments:

```bash
VAULT="Work" \
NOTE_TITLE="Planning 2026-08-02" \
SEARCH_TERM="Planning" \
  bash examples/headless-notes-workflow.sh
```

`VAULT` depends on the `notesmd-cli --vault` form used by the script, which is `VERIFY` until the installed binary confirms it. Omit `VAULT` to use the registered default safely.

### Label the MCP Preflight

```bash
NOTE_PATH="Projects/Launch.md" \
OBSIDIAN_BASE_URL="http://127.0.0.1:27123" \
  bash examples/mcp-roundtrip.sh
```

The script prints a reference only; `NOTE_PATH` changes the preflight label, not the emitted TypeScript sample. Replace that sample path after confirming every live tool name and argument schema through Code Mode.

### Choose the Ledger and Transaction

```bash
LEDGER="/path/to/Vault/Finance/main.beancount" \
TXN_DATE="2026-08-02" PAYEE="Grocery Store" \
AMOUNT="42.50" CURRENCY="USD" \
  bash examples/beancount-transaction.sh
```

Use opened account names that exist in the target ledger. The script's initial-account creation only happens when its ledger file is absent.

---

## 6. TROUBLESHOOTING

### headless-notes-workflow.sh: `notesmd-cli` not found

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh
notesmd-cli --version
notesmd-cli list-vaults
```

If the command resolves in an interactive shell but not an agent runtime, follow the GUI-vs-shell `PATH` recovery guidance in [`../references/troubleshooting.md`](../references/troubleshooting.md).

### headless-notes-workflow.sh: no vault is registered

```bash
notesmd-cli add-vault "/path/to/Vault"
notesmd-cli set-default-vault "Vault"
notesmd-cli list-vaults
```

### mcp-roundtrip.sh: Local REST API does not respond

```bash
# Confirm a token is present without printing it
printenv OBSIDIAN_API_KEY >/dev/null && echo "set" || echo "UNSET"

# Confirm the configured endpoint after opening Obsidian and enabling Local REST API
curl -sk -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  "${OBSIDIAN_BASE_URL:-http://127.0.0.1:27123}/"
```

If the app is closed or the plugin is disabled, switch the actual note operation to `notesmd-cli` rather than trying to make the MCP headless.

### beancount-transaction.sh: `bean-check` not found

```bash
pipx install beancount
bean-check --help
```

The script can still append to its designated ledger, but it cannot confirm Beancount validity without `bean-check`.

---

## 7. SEE ALSO

### Skill Documentation

**mcp-obsidian:**

- [`../SKILL.md`](../SKILL.md) — Routing rules, safety invariants, and resource map
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md) — Install and configuration for both CLI profiles and the MCP
- [`../references/obsidian-cli-commands.md`](../references/obsidian-cli-commands.md) — Full CLI reference
- [`../references/mcp-tools.md`](../references/mcp-tools.md) — Cyanheads MCP invocation and tool inventory

### Related References

- [`../references/plugins/plugin-operation-logic.md`](../references/plugins/plugin-operation-logic.md) — Why the mode edits plugin data instead of UI controls
- [`../references/plugins/beancount-finance/beancount-finance.md`](../references/plugins/beancount-finance/beancount-finance.md) — Beancount Ledger model and plugin behavior
- [`../references/troubleshooting.md`](../references/troubleshooting.md) — CLI, Local REST API, and MCP recovery guide

### External

- [notesmd-cli on GitHub](https://github.com/Yakitrak/obsidian-cli) — source and installation paths
- [cyanheads obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server) — MCP server source
- [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) — plugin used by the live-app MCP path

---

## 8. CONTRIBUTING

To add an example script:

1. Follow the existing pattern: `set -euo pipefail`, a clear preflight, explicit headless-vs-app-backed runtime bounds, and no hidden configuration writes.
2. Make the script executable: `chmod +x examples/your-script.sh`.
3. Add a `--help` / `-h` usage block at the top when the script accepts arguments.
4. Update this README with purpose, usage, behavior, exit codes, and destructive-operation boundaries.
5. Link the relevant CLI, MCP, or plugin data reference and mark unconfirmed flag or schema details `VERIFY`.

---

**Directory Version**: 1.0.0
**Last Updated**: 2026-08-02
**Maintained By**: AI Documentation
