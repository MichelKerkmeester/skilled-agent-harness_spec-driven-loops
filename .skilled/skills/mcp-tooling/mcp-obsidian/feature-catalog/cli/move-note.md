---
title: "Move or rename a note"
description: "Move or rename a note with notesmd-cli while preserving the headless filesystem workflow."
trigger_phrases:
  - "Move or rename a note"
  - "notesmd-cli move"
  - "rename a vault note"
version: 0.1.0.0
---

# Move or rename a note (`notesmd-cli move`)

## 1. OVERVIEW

`notesmd-cli move <src> <dst>` moves or renames a note in a vault without requiring the Obsidian app.

The command is the preferred mutation surface over a raw filesystem move. Whether it updates links or backlinks is explicitly `VERIFY` in the current reference.

---

## 2. HOW IT WORKS

The operator searches for and prints the exact source note before moving it. The destination may be a renamed note or a path under another vault folder, subject to the installed CLI's current path rules.

After the move, the operator searches or prints the destination and confirms the source is no longer addressed at the old path. Link-update behavior must be confirmed on the installed binary before relying on it for backlink migration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Applies read-before-mutate and destructive-operation routing rules. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines the move/rename command and its `VERIFY` caveat. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-notes/move-note.md`](../../manual-testing-playbook/headless-notes/move-note.md) | Manual playbook | Moves a throwaway note and verifies the destination. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Routes path and vault errors to the correct profile. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli move
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/move-note.md`

Related references:
- [`../cli/search-note-names.md`](../cli/search-note-names.md) — resolves the source title.
- [`../cli/delete-note.md`](../cli/delete-note.md) — destructive note targeting rules.
