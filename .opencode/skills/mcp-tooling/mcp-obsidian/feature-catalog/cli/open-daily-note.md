---
title: "Open today's daily note"
description: "Create or open today's daily note with the headless notesmd-cli workflow."
trigger_phrases:
  - "Open today's daily note"
  - "notesmd-cli daily"
  - "open the Obsidian daily note headlessly"
version: 1.0.0.0
---

# Open today's daily note (`notesmd-cli daily`)

## 1. OVERVIEW

`notesmd-cli daily` creates or opens today's daily note in the selected vault without requiring Obsidian to be running.

The command honors the vault's daily-note settings, but the exact settings interaction is marked `VERIFY` in the current reference.

---

## 2. HOW IT WORKS

The operator confirms the target vault, runs `notesmd-cli daily`, and reads the resulting note or command output. The filesystem-native path is appropriate for unattended daily capture and for environments without a desktop session.

The command's exact output and configuration-driven path are not expanded beyond the confirmed command identity; use the installed binary's help and the real vault to confirm those details.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes daily-note work to notesmd-cli by default. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines the daily-note command and its settings caveat. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-notes/daily-note.md`](../../manual-testing-playbook/headless-notes/daily-note.md) | Manual playbook | Executes the daily command against an operator-owned vault. |
| [`../../examples/headless-notes-workflow.sh`](../../examples/headless-notes-workflow.sh) | Reference | Provides the surrounding headless vault preflight pattern. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli daily
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/open-daily-note.md`

Related references:
- [`../cli/list-vaults.md`](../cli/list-vaults.md) — confirms the target vault.
- [`../cli/search-note-content.md`](../cli/search-note-content.md) — searches the daily note body.
