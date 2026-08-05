---
title: "Create a note"
description: "Create a markdown note with notesmd-cli against the selected headless vault."
trigger_phrases:
  - "Create a note"
  - "notesmd-cli create"
  - "new headless markdown note"
version: 0.1.0.0
---

# Create a note (`notesmd-cli create`)

## 1. OVERVIEW

`notesmd-cli create <note>` creates a note in the selected vault without requiring a running Obsidian app.

The current reference confirms the command and headless filesystem behavior. The exact way to supply body content remains `VERIFY`; confirm it with `notesmd-cli create --help` before scripting content-bearing writes.

---

## 2. HOW IT WORKS

The operator first checks registered vaults and searches for an existing title. The create command then writes the note to the selected vault on disk, and `notesmd-cli print <note>` can read it back for confirmation.

The command is suitable for servers, CI, and unattended workflows because it does not talk to the Obsidian desktop app. A named vault can be targeted with the documented `--vault <name>` flag, but the exact flag spelling is marked `VERIFY` in the reference.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes note creation to the headless profile when no app-backed surface is required. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines the current `create` command and its confirmed limitations. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-notes/create-and-read.md`](../../manual-testing-playbook/headless-notes/create-and-read.md) | Manual playbook | Creates a throwaway note and reads it back without an app. |
| [`../../examples/headless-notes-workflow.sh`](../../examples/headless-notes-workflow.sh) | Reference | Shows the current preflight, search-before-create, and read-back flow. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli create
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/create-note.md`

Related references:
- [`../cli/search-note-names.md`](../cli/search-note-names.md) — title lookup used before creation.
- [`../cli/search-note-content.md`](../cli/search-note-content.md) — body search for follow-up verification.
