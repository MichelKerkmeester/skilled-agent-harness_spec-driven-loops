---
title: "Search note names"
description: "Search note titles or names with the headless notesmd-cli filesystem surface."
trigger_phrases:
  - "Search note names"
  - "notesmd-cli search"
  - "find notes by title"
version: 0.1.0.0
---

# Search note names (`notesmd-cli search`)

## 1. OVERVIEW

`notesmd-cli search <query>` searches note titles or names in a registered vault without a running app.

An empty result is valid behavior. The operator should report no match rather than fabricating a note, then use `list` or content search if the request needs broader confirmation.

---

## 2. HOW IT WORKS

The command searches the filename or title surface and prints matching notes. It is the first lookup in safe create, move, and delete flows because it resolves the candidate note before a mutation.

The command uses the default vault unless a specific vault is selected. The `--vault <name>` form is documented but its exact applicability to every subcommand remains `VERIFY`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Selects title search for headless note lookup. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines title/name search behavior. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-notes/search-notes.md`](../../manual-testing-playbook/headless-notes/search-notes.md) | Manual playbook | Checks title and body search on a real vault. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Defines valid empty-result handling and follow-up diagnostics. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli search
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/search-note-names.md`

Related references:
- [`search-note-content.md`](search-note-content.md) — body search for the same query surface.
- [`../cli/create-note.md`](../cli/create-note.md) — search-before-create safety pattern.
