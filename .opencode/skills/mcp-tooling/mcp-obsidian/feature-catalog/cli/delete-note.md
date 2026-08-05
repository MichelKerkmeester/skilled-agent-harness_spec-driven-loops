---
title: "Delete a note"
description: "Delete a confirmed note with the headless notesmd-cli filesystem surface."
trigger_phrases:
  - "Delete a note"
  - "notesmd-cli delete"
  - "remove a vault note"
version: 0.1.0.0
---

# Delete a note (`notesmd-cli delete`)

## 1. OVERVIEW

`notesmd-cli delete <note>` deletes a note from the selected vault without requiring a running app.

Deletion is destructive. The mode requires an exact search and read-back confirmation before issuing the delete command, and playbook runs use a throwaway note.

---

## 2. HOW IT WORKS

The operator lists or searches the vault, prints the exact candidate, and confirms that the note is disposable. The delete command then removes the filesystem note; a follow-up search or print establishes that it is gone.

There is no documented recovery mechanism in the current references. Recovery therefore means restoring the note from an external backup or recreating the throwaway fixture; production notes must not be used for this scenario.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Requires preview and target confirmation for destructive operations. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines the delete subcommand. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-notes/delete-note.md`](../../manual-testing-playbook/headless-notes/delete-note.md) | Manual playbook | Deletes only a throwaway note and verifies absence. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Covers path errors and the headless/app-backed fallback. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli delete
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/delete-note.md`

Related references:
- [`../cli/search-note-names.md`](../cli/search-note-names.md) — exact target resolution.
- [`../cli/move-note.md`](../cli/move-note.md) — safer non-destructive rename alternative.
