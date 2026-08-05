---
title: "Open a note or vault in the app"
description: "Use the official obsidian CLI as a remote control for a live Obsidian desktop app."
trigger_phrases:
  - "Open a note or vault in the app"
  - "official obsidian CLI open note"
  - "launch Obsidian from the command line"
version: 0.1.0.0
---

# Open a note or vault in the app (`obsidian`)

## 1. OVERVIEW

The official `obsidian` binary remote-controls the Obsidian desktop app for live UI actions such as opening a note or vault. It launches or focuses the app when it is not already running.

The current reference does not confirm the exact subcommand or flags. Those command forms remain `VERIFY` and must be read from `obsidian --help` on the installed version.

---

## 2. HOW IT WORKS

This surface is selected only when the requested outcome requires app focus, rendering, or another live-app action. It is not appropriate for deterministic file writes, CI, or server-side note management; those route to `notesmd-cli`.

The operator registers the CLI, confirms the app-backed environment, checks `obsidian --help`, and then uses the installed command form for the target note or vault. The playbook records the command as `VERIFY` until the local binary supplies the exact syntax.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Chooses the official CLI for live app actions and keeps headless work on notesmd-cli. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines the remote-control behavior and unconfirmed command surface. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/official-cli/open-app-action.md`](../../manual-testing-playbook/official-cli/open-app-action.md) | Manual playbook | Runs the local help-confirmed app action and captures visible app state. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Separates app-backed failures from headless CLI failures. |

---

## 4. SOURCE METADATA

- Group: official obsidian CLI app actions
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/open-note-or-vault.md`

Related references:
- [`../cli/register-cli.md`](../cli/register-cli.md) — enables the binary.
- [`uri-actions.md`](uri-actions.md) — app/plugin URI action boundary.
