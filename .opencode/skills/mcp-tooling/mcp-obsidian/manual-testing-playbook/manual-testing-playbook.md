---
title: "mcp-obsidian: Manual Testing Playbook"
description: "Operator-facing scenarios for headless notesmd-cli operations, the official app-backed obsidian CLI, cyanheads MCP round-trips, and eleven community-plugin file-layer tie-ins."
version: 0.1.0.0
---

# mcp-obsidian: Manual Testing Playbook

> **EXECUTION POLICY:** Every scenario is executed against real commands, files, app state, or Code Mode tools. Valid statuses are `PASS`, `FAIL`, or `SKIP` with a specific prerequisite or sandbox blocker. `UNAUTOMATABLE` is not a valid status.

This playbook is the operator directory for the `mcp-obsidian` mode. It validates the headless `notesmd-cli` profile, the official app-backed `obsidian` CLI, the cyanheads `obsidian_*` MCP surface, and file-layer operations for eleven community plugins — Beancount Ledger (`beancount-finance`), Obsidian Tables (`obsidian-tables`), BRAT (`obsidian42-brat`), Health.md Visualizations (`health-md`), Iconic (`iconic`), Charts (`charts`), Dataview (`dataview`), Excalidraw (`excalidraw`), Obsidian Git (`git`), Outliner (`outliner`), and the Minimal theme (`minimal`).

The [feature catalog](../feature-catalog/FEATURE-CATALOG.md) is the current-behavior inventory. These scenario files own exact prompts, command sequences, expected signals, evidence, grading, and triage.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `headless-vaults/`
- `headless-notes/`
- `official-cli/`
- `mcp-roundtrip/`
- `mcp-verification/`
- `plugin-tie-ins/`

---

## 1. OVERVIEW

This package provides 19 deterministic scenarios across 6 categories:

| Surface | Scenario IDs | Runtime requirement |
|---|---|---|
| Headless vault setup | `OBS-001..OBS-002` | `notesmd-cli`; no app required |
| Headless note operations | `OBS-003..OBS-008` | `notesmd-cli`; no app required |
| Official app-backed CLI | `OBS-009..OBS-010` | Obsidian desktop v1.12.4+ and registered `obsidian` CLI |
| MCP round-trip | `MCP-H001..MCP-H004` | Running Obsidian, Local REST API v4.0.0+, token, Code Mode manual |
| MCP verification boundary | `MCP-M001..MCP-M002` | Same MCP prerequisites for live inventory; no-app boundary can be tested headlessly |
| Community-plugin tie-ins | `OBS-011..OBS-021` | File-layer fixtures; app reload is required only for the render/activation check |

The `OBS-*` scenarios use real CLI commands. The `MCP-*` scenarios require the Local REST API + token setup, which may still be pending in an operator environment; those scenarios must be recorded as `SKIP` with that blocker rather than treated as an MCP failure.

### Realistic Test Model

1. A realistic user request is given to the operator or orchestrator.
2. The execution profile is selected from the runtime prerequisites.
3. The exact prompt and command sequence are executed against a controlled vault or live app.
4. The operator captures command output, tool responses, and the user-visible result.
5. The scenario receives a binary verdict or a prerequisite-specific `SKIP`.

---

## 2. GLOBAL PRECONDITIONS

1. The working directory is the repository root.
2. The operator has at least one Obsidian vault on this machine and can identify a non-production or throwaway test vault. The build context confirms that vaults exist locally.
3. Headless scenarios require `notesmd-cli` on `PATH`, at least one registered vault, and an explicit default-vault check. They do not require a running Obsidian app.
4. `OBS-007` and `OBS-008` use throwaway notes. Do not run delete or move scenarios against production notes.
5. Official CLI scenarios require Obsidian desktop v1.12.4+ with Settings → General → Command line interface → Register CLI completed. Exact app-action subcommands remain `VERIFY`.
6. MCP scenarios require a running Obsidian app with the target vault open, Local REST API plugin v4.0.0+ enabled, a bearer token in `OBSIDIAN_API_KEY`, the correct `OBSIDIAN_BASE_URL` (default `http://127.0.0.1:27123`), and the `obsidian` Code Mode manual registered. Local REST API + token setup may be pending.
7. `MCP-H004` deletes only the throwaway note created by `MCP-H001`. The operator must capture the exact path before execution.
8. `OBS-011` uses a scratch `.beancount` ledger. The `bean-check` validator is optional; an explicit warning that it is unavailable is an acceptable signal.
9. `OBS-012` uses a non-production vault and the Tables plugin; preserve the original `.table.md` asset and capture the app reload/render boundary.
10. `OBS-013` uses a throwaway vault, `curl`, `jq`, a release fixture or GitHub access, and backups of BRAT `data.json` and `community-plugins.json`; close Obsidian before the file-layer writes.

---

## 3. EXECUTION POLICY AND EVIDENCE

### Execution Policy

- Run the commands and tool calls exactly as written after replacing only declared placeholders such as `TEST_VAULT`, `TEST_NOTE`, or `TEST_PATH`.
- Confirm a vault before any note write, move, or delete.
- Confirm the exact note path before destructive operations.
- Confirm every MCP tool name and signature with `list_tools()` or `tool_info()` before the first call. The current references confirm five core names but use representative argument shapes.
- Do not turn a missing app, token, manual registration, or unconfirmed command syntax into a fabricated pass.

### Evidence Requirements

Capture the following for every run:

- User request and exact prompt.
- Shell transcript or Code Mode response.
- Exit codes for CLI commands.
- Tool discovery and schema output for MCP scenarios.
- Relevant note path, vault name, or ledger path.
- User-visible result, including the app state for official CLI scenarios.
- Final verdict and rationale. A `SKIP` must name its missing prerequisite or sandbox constraint.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands use `notesmd-cli <subcommand> [args]` or `obsidian <target>`.
- Bash wrappers use `bash: <command>`.
- Code Mode calls use `Code Mode: call_tool_chain({ code: "..." })`.
- Tool discovery uses `list_tools()` and `tool_info("obsidian.obsidian_<tool_name>")`.
- `->` separates sequential steps.
- `VERIFY` means the current references do not confirm the exact syntax or parameter shape; the operator must capture the local help/schema before continuing.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook.
2. Every referenced scenario file.
3. Command and tool-response evidence.
4. Feature-to-scenario coverage map.
5. Triage notes for every `FAIL` or `SKIP`.

### Scenario Acceptance Rules

For each executed scenario:

1. Preconditions were satisfied or the scenario was marked `SKIP` with the blocker.
2. The exact prompt and command sequence were used.
3. Expected signals are present and not contradicted by later evidence.
4. Evidence is readable and includes the relevant paths, responses, or exit codes.
5. The operator recorded a user-facing outcome and explicit verdict.

`PASS` means all scenario acceptance checks are true. `FAIL` means an expected signal is missing, contradictory, or the command/tool behavior is wrong. `SKIP` is reserved for a specific unavailable app, token, manual, binary, or sandbox prerequisite.

### Feature Verdict Rules

- `PASS`: every mapped scenario passes.
- `PARTIAL`: at least one mapped scenario is skipped for an environmental reason and none fail.
- `FAIL`: any mapped scenario fails.

### Release Readiness Rule

The package is `READY` only when no critical-path scenario fails, all available headless scenarios pass, app-backed scenarios either pass or have documented environment-specific skips, MCP tool discovery confirms the five known core names, and no unresolved blocking triage item remains.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

Reserve one coordinator to own the vault fixture, evidence ledger, and final verdict. Execute the waves in order; do not run destructive scenarios before their fixture has been recorded.

| Wave | Scenario set | Isolation |
|---|---|---|
| 1 | `OBS-001..OBS-002` | Local vault registration only; no note mutation required |
| 2 | `OBS-003..OBS-006` | Throwaway vault or notes; headless and app-free |
| 3 | `OBS-007..OBS-008` | Dedicated destructive/metadata wave; throwaway notes only |
| 4 | `OBS-009..OBS-010` | Live Obsidian desktop app; capture visible app state |
| 5 | `MCP-M001..MCP-M002` | Live app/token inventory, plus the no-app fallback boundary |
| 6 | `MCP-H001..MCP-H004` | Live app and throwaway note; delete last |
| 7 | `OBS-011..OBS-013` | Scratch ledger/table and throwaway BRAT fixture; reload only after file-layer evidence |

After each wave, save the transcript and evidence path, then reconcile the root index with the executed scenario files. Run the destructive MCP delete only after the round-trip evidence identifies the disposable note.

---

## 7. HEADLESS VAULT SETUP (`OBS-001..OBS-002`)

### OBS-001 | Vault preflight and default selection

#### Description

Verify the registered vault list and set a known operator-owned vault as the default before note work.

#### Scenario Contract

Prompt: `Before changing any notes, confirm my registered vaults and set TEST_VAULT as the default.`

#### Test Execution

> **Feature File:** [`headless-vaults/vault-preflight.md`](headless-vaults/vault-preflight.md)
> **Catalog:** [`cli/list-vaults.md`](../feature-catalog/cli/list-vaults.md) and [`cli/set-default-vault.md`](../feature-catalog/cli/set-default-vault.md)

### OBS-002 | Vault registration lifecycle

#### Description

Verify a controlled vault can be registered, listed, and unregistered without a running app.

#### Scenario Contract

Prompt: `Register my throwaway vault for headless Obsidian work, verify it appears, then remove only that registration.`

#### Test Execution

> **Feature File:** [`headless-vaults/vault-registration.md`](headless-vaults/vault-registration.md)
> **Catalog:** [`cli/add-vault.md`](../feature-catalog/cli/add-vault.md) and [`cli/remove-vault.md`](../feature-catalog/cli/remove-vault.md)

---

## 8. HEADLESS NOTE OPERATIONS (`OBS-003..OBS-008`)

| Feature ID | Feature Name | Scenario Objective | Prerequisite | Feature File |
|---|---|---|---|---|
| `OBS-003` | Create and read a note | Create a controlled note and read it back | `notesmd-cli`; throwaway vault | [`headless-notes/create-and-read.md`](headless-notes/create-and-read.md) |
| `OBS-004` | Search notes | Search note names and bodies with separate commands | `notesmd-cli`; marker fixture | [`headless-notes/search-notes.md`](headless-notes/search-notes.md) |
| `OBS-005` | Open the daily note | Run the daily-note command and verify a note/output | `notesmd-cli`; daily-note settings may be `VERIFY` | [`headless-notes/daily-note.md`](headless-notes/daily-note.md) |
| `OBS-006` | Move or rename a note | Move a disposable note and verify its destination | `notesmd-cli`; throwaway note | [`headless-notes/move-note.md`](headless-notes/move-note.md) |
| `OBS-007` | Delete a note | Delete a disposable note and verify it is absent | `notesmd-cli`; throwaway note | [`headless-notes/delete-note.md`](headless-notes/delete-note.md) |
| `OBS-008` | Frontmatter command surface | Confirm installed frontmatter help before a controlled metadata edit | `notesmd-cli`; exact flags are `VERIFY` | [`headless-notes/frontmatter.md`](headless-notes/frontmatter.md) |

---

## 9. OFFICIAL APP-BACKED CLI (`OBS-009..OBS-010`)

| Feature ID | Feature Name | Scenario Objective | Prerequisite | Feature File |
|---|---|---|---|---|
| `OBS-009` | Register and inspect official CLI | Register the binary and confirm help output | Obsidian desktop v1.12.4+; Register CLI | [`official-cli/register-and-help.md`](official-cli/register-and-help.md) |
| `OBS-010` | Open an app-backed target | Use the local help-confirmed command to open a note/vault or URI action | Running/launchable desktop app; exact action syntax `VERIFY` | [`official-cli/open-app-action.md`](official-cli/open-app-action.md) |

---

## 10. MCP ROUND-TRIP (`MCP-H001..MCP-H004`)

Every scenario in this category needs a running Obsidian app with the target vault open, Local REST API plugin v4.0.0+, `OBSIDIAN_API_KEY`, the correct base URL, and the registered `obsidian` manual. If any prerequisite is missing, record `SKIP` with the exact blocker.

| Feature ID | Feature Name | Scenario Objective | Prerequisite | Feature File |
|---|---|---|---|---|
| `MCP-H001` | Read/write round-trip | Read a controlled note, append an idempotent section, and write it back | Live app, REST API, token, Code Mode; tool schemas may require `VERIFY` | [`mcp-roundtrip/read-write-roundtrip.md`](mcp-roundtrip/read-write-roundtrip.md) |
| `MCP-H002` | Search live vault | Search a known marker through `obsidian_search_notes` | Same live prerequisites | [`mcp-roundtrip/search-live-vault.md`](mcp-roundtrip/search-live-vault.md) |
| `MCP-H003` | Manage tags | Apply a controlled tag and capture the structured response | Same live prerequisites; argument shape `VERIFY` | [`mcp-roundtrip/manage-tags.md`](mcp-roundtrip/manage-tags.md) |
| `MCP-H004` | Delete throwaway note | Delete only the note created by the round-trip and verify absence | Same live prerequisites; throwaway note required | [`mcp-roundtrip/delete-throwaway-note.md`](mcp-roundtrip/delete-throwaway-note.md) |

---

## 11. MCP VERIFICATION BOUNDARY (`MCP-M001..MCP-M002`)

| Feature ID | Feature Name | Scenario Objective | Prerequisite | Feature File |
|---|---|---|---|---|
| `MCP-M001` | Tool inventory | Enumerate all 14 server tools and confirm the five known names | Live app, REST API, token, registered manual | [`mcp-verification/tool-inventory.md`](mcp-verification/tool-inventory.md) |
| `MCP-M002` | App/token boundary | Show the MCP preflight blocker and preserve a headless fallback | No live MCP prerequisite; `notesmd-cli` for fallback | [`mcp-verification/prerequisite-boundary.md`](mcp-verification/prerequisite-boundary.md) |

---

## 12. COMMUNITY-PLUGIN FILE-LAYER TIE-INS (`OBS-011..OBS-021`)

### OBS-011 | Beancount file-layer transaction

#### Description

Verify a balanced transaction can be appended to a scratch `.beancount` ledger and validated without driving the plugin UI.

#### Scenario Contract

Prompt: `Append a balanced grocery transaction to a scratch Beancount ledger and report whether the ledger validates.`

#### Test Execution

> **Feature File:** [`plugin-tie-ins/beancount-transaction.md`](plugin-tie-ins/beancount-transaction.md)
> **Catalog:** [`../feature-catalog/plugins/beancount-finance.md`](../feature-catalog/plugins/beancount-finance.md) — the scenario links to the canonical beancount-finance plugin reference.

### OBS-012 | Obsidian Tables file-layer round-trip

#### Description

Create or edit a scratch `.table.md` through the file layer, validate its Agentable JSON payload, and verify that the changed table renders after opening or reloading the note in Obsidian.

#### Scenario Contract

Prompt: `Create or update a scratch Obsidian Tables .table.md at the file layer, then verify the edited table renders in Obsidian.`

#### Test Execution

> **Feature File:** [`plugin-tie-ins/obsidian-tables-roundtrip.md`](plugin-tie-ins/obsidian-tables-roundtrip.md)
> **Catalog:** [`../feature-catalog/plugins/obsidian-tables.md`](../feature-catalog/plugins/obsidian-tables.md) — the scenario validates the `.table.md` file-layer recipe and visible render boundary.

### OBS-013 | BRAT headless beta-plugin install

#### Description

Stage a tagged beta-plugin release, register its repository and release policy in BRAT, activate the manifest ID through `community-plugins.json`, and verify each file-layer stage.

#### Scenario Contract

Prompt: `Install a tagged beta plugin headlessly through BRAT by staging its release assets, registering the repository, activating the manifest ID, and reporting every verified stage.`

#### Test Execution

> **Feature File:** [`plugin-tie-ins/brat-headless-install.md`](plugin-tie-ins/brat-headless-install.md)
> **Catalog:** [`../feature-catalog/plugins/obsidian42-brat.md`](../feature-catalog/plugins/obsidian42-brat.md) — the scenario validates BRAT's stage → register → activate file-layer sequence.

### OBS-014 | Health.md data-file round-trip

#### Description

Resolve the Health.md data folder from the plugin's `data.json`, add or edit a data file at the file layer, and verify the visualization reflects it after reload.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/health-md-data.md`](plugin-tie-ins/health-md-data.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/health-md.md`](../feature-catalog/plugins/health-md.md)

### OBS-015 | Iconic rulebook merge round-trip

#### Description

Merge an icon rule (for example a red rule for PDF files) and a toggle into the Iconic `data.json` rulebook, preserving existing rules, and verify the icons after reload.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/iconic-rules.md`](plugin-tie-ins/iconic-rules.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/iconic.md`](../feature-catalog/plugins/iconic.md)

### OBS-016 | Charts render-block round-trip

#### Description

Author chart render blocks (bar and doughnut) with valid JSON bodies in a throwaway note and verify the Charts plugin renders them after reload.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/charts-render-block.md`](plugin-tie-ins/charts-render-block.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/charts.md`](../feature-catalog/plugins/charts.md)

### OBS-017 | Dataview metadata and query round-trip

#### Description

Add inline/frontmatter metadata and a Dataview query block to throwaway notes and verify the query resolves after reload.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/dataview-metadata-query.md`](plugin-tie-ins/dataview-metadata-query.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/dataview.md`](../feature-catalog/plugins/dataview.md)

### OBS-018 | Excalidraw drawing-note round-trip

#### Description

Create an Excalidraw drawing note at the file layer, validate its embedded JSON, and confirm the file opens as a drawing.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/excalidraw-drawing-note.md`](plugin-tie-ins/excalidraw-drawing-note.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/excalidraw.md`](../feature-catalog/plugins/excalidraw.md)

### OBS-019 | Obsidian Git status round-trip

#### Description

Read the vault's git status and log through the read-only allowlist and confirm the expected fresh-repo signals.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/git-status-roundtrip.md`](plugin-tie-ins/git-status-roundtrip.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/git.md`](../feature-catalog/plugins/git.md)

### OBS-020 | Outliner settings and defaults

#### Description

Inspect the Outliner plugin `data.json` (or confirm its absence means defaults) and report the active settings.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/outliner-settings-defaults.md`](plugin-tie-ins/outliner-settings-defaults.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/outliner.md`](../feature-catalog/plugins/outliner.md)

### OBS-021 | Minimal theme activation

#### Description

Activate the Minimal theme via `appearance.json` and apply a snippet-based tweak, verifying at the file layer.

#### Test Execution

> **Feature File:** [`plugin-tie-ins/minimal-theme-activation.md`](plugin-tie-ins/minimal-theme-activation.md) — owns the exact prompt, command sequence, and grading.
> **Catalog:** [`../feature-catalog/plugins/minimal.md`](../feature-catalog/plugins/minimal.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

The current mode package has no dedicated automated test suite for these external CLI/MCP surfaces. The executable anchors are the existing reference scripts and read-only diagnostics; the plugin workflows provide the file-layer verification contracts:

| Anchor | Coverage | Playbook overlap |
|---|---|---|
| [`../examples/headless-notes-workflow.sh`](../examples/headless-notes-workflow.sh) | Headless vault preflight, search, create, and read-back | `OBS-001`, `OBS-003`, `OBS-004` |
| [`../examples/beancount-transaction.sh`](../examples/beancount-transaction.sh) | Balanced file-layer transaction and optional `bean-check` | `OBS-011` |
| [`../references/plugins/obsidian-tables/workflows.md`](../references/plugins/obsidian-tables/workflows.md) | `.table.md` create/edit, parse, and reload contract | `OBS-012` |
| [`../references/plugins/obsidian42-brat/workflows.md`](../references/plugins/obsidian42-brat/workflows.md) | Stage, register, activate, and verify beta-plugin files | `OBS-013` |
| [`../examples/mcp-roundtrip.sh`](../examples/mcp-roundtrip.sh) | MCP prerequisite probe and Code Mode round-trip reference | `MCP-H001`, `MCP-M002` |
| [`../scripts/doctor.sh`](../scripts/doctor.sh) | Read-only binary, manual, REST API, and token diagnostics | `OBS-009`, `MCP-M001`, `MCP-M002` |

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Catalog entries |
|---|---|---|
| `OBS-001` | Vault preflight and default selection | [`list-vaults`](../feature-catalog/cli/list-vaults.md), [`set-default-vault`](../feature-catalog/cli/set-default-vault.md) |
| `OBS-002` | Vault registration lifecycle | [`add-vault`](../feature-catalog/cli/add-vault.md), [`remove-vault`](../feature-catalog/cli/remove-vault.md) |
| `OBS-003` | Create and read a note | [`create-note`](../feature-catalog/cli/create-note.md) |
| `OBS-004` | Search notes | [`search-note-names`](../feature-catalog/cli/search-note-names.md), [`search-note-content`](../feature-catalog/cli/search-note-content.md) |
| `OBS-005` | Open the daily note | [`open-daily-note`](../feature-catalog/cli/open-daily-note.md) |
| `OBS-006` | Move or rename a note | [`move-note`](../feature-catalog/cli/move-note.md) |
| `OBS-007` | Delete a note | [`delete-note`](../feature-catalog/cli/delete-note.md) |
| `OBS-008` | Frontmatter command surface | [`edit-frontmatter`](../feature-catalog/cli/edit-frontmatter.md) |
| `OBS-009` | Register and inspect official CLI | [`register-cli`](../feature-catalog/cli/register-cli.md) |
| `OBS-010` | Open an app-backed target | [`open-note-or-vault`](../feature-catalog/cli/open-note-or-vault.md), [`uri-actions`](../feature-catalog/cli/uri-actions.md) |
| `MCP-H001` | Read/write round-trip | [`get-note`](../feature-catalog/mcp/get-note.md), [`write-note`](../feature-catalog/mcp/write-note.md) |
| `MCP-H002` | Search live vault | [`search-notes`](../feature-catalog/mcp/search-notes.md) |
| `MCP-H003` | Manage tags | [`manage-tags`](../feature-catalog/mcp/manage-tags.md) |
| `MCP-H004` | Delete throwaway note | [`delete-note`](../feature-catalog/mcp/delete-note.md) |
| `MCP-M001` | Tool inventory | [`additional-tools-verify`](../feature-catalog/mcp/additional-tools-verify.md) |
| `MCP-M002` | App/token boundary | [`additional-tools-verify`](../feature-catalog/mcp/additional-tools-verify.md) |
| `OBS-011` | Beancount file-layer transaction | Dedicated plugin reference in [`beancount-transaction.md`](plugin-tie-ins/beancount-transaction.md) |
| `OBS-012` | Obsidian Tables file-layer round-trip | Dedicated plugin reference in [`obsidian-tables-roundtrip.md`](plugin-tie-ins/obsidian-tables-roundtrip.md) |
| `OBS-013` | BRAT headless beta-plugin install | Dedicated plugin reference in [`brat-headless-install.md`](plugin-tie-ins/brat-headless-install.md) |
| `OBS-014` | Health.md file-layer data + render blocks | Dedicated plugin reference in [`health-md-data.md`](plugin-tie-ins/health-md-data.md) |
| `OBS-015` | Iconic rulebook merge round-trip | Dedicated plugin reference in [`iconic-rules.md`](plugin-tie-ins/iconic-rules.md) |
| `OBS-016` | Charts render-block round-trip | Dedicated plugin reference in [`charts-render-block.md`](plugin-tie-ins/charts-render-block.md) |
| `OBS-017` | Dataview metadata and query round-trip | Dedicated plugin reference in [`dataview-metadata-query.md`](plugin-tie-ins/dataview-metadata-query.md) |
| `OBS-018` | Excalidraw drawing-note round-trip | Dedicated plugin reference in [`excalidraw-drawing-note.md`](plugin-tie-ins/excalidraw-drawing-note.md) |
| `OBS-019` | Obsidian Git status round-trip | Dedicated plugin reference in [`git-status-roundtrip.md`](plugin-tie-ins/git-status-roundtrip.md) |
| `OBS-020` | Outliner settings and defaults | Dedicated plugin reference in [`outliner-settings-defaults.md`](plugin-tie-ins/outliner-settings-defaults.md) |
| `OBS-021` | Minimal theme activation | Dedicated plugin reference in [`minimal-theme-activation.md`](plugin-tie-ins/minimal-theme-activation.md) |
