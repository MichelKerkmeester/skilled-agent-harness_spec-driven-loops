---
title: "Register the official CLI"
description: "Enable and register the official app-backed obsidian CLI shipped with Obsidian desktop."
trigger_phrases:
  - "Register the official CLI"
  - "enable the obsidian CLI"
  - "Obsidian command line interface settings"
version: 0.1.0.0
---

# Register the official CLI (`obsidian`)

## 1. OVERVIEW

The official `obsidian` CLI ships with Obsidian desktop v1.12.4+ and is enabled from Settings → General → Command line interface → toggle on → Register CLI.

It has no separate npm or Homebrew package. Registration adds the `obsidian` binary to PATH on macOS/Linux according to the current reference.

---

## 2. HOW IT WORKS

The operator opens the desktop app, enables the command-line interface setting, selects Register CLI, and then verifies the binary with `obsidian --help`. The CLI is app-backed and is not a headless substitute for `notesmd-cli`.

The exact registration UI wording and PATH location are stable enough to document at this level; use the installed app and shell environment to diagnose GUI-versus-shell PATH mismatches.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes live-app actions to the official CLI only when an app-backed outcome is required. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Records desktop version, registration path, and app-backed boundary. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/official-cli/register-and-help.md`](../../manual-testing-playbook/official-cli/register-and-help.md) | Manual playbook | Verifies registration and `obsidian --help` in an operator-owned app session. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Diagnoses unregistered CLI and GUI PATH failures. |

---

## 4. SOURCE METADATA

- Group: official obsidian CLI registration
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/register-cli.md`

Related references:
- [`../cli/open-note-or-vault.md`](../cli/open-note-or-vault.md) — app-backed command use after registration.
- [`../../references/troubleshooting.md`](../../references/troubleshooting.md) — registration recovery.
