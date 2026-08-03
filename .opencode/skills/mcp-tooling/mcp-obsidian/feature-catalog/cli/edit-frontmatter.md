---
title: "Read or modify frontmatter"
description: "Use notesmd-cli to inspect or modify YAML frontmatter on a vault note."
trigger_phrases:
  - "Read or modify frontmatter"
  - "notesmd-cli frontmatter"
  - "edit note YAML metadata"
version: 1.0.0.0
---

# Read or modify frontmatter (`notesmd-cli frontmatter`)

## 1. OVERVIEW

`notesmd-cli frontmatter <note>` is the headless CLI entry point for reading or modifying a note's YAML frontmatter.

The command identity is confirmed, but the current reference does not confirm the exact get/set flag or key/value syntax. Those details remain `VERIFY`.

---

## 2. HOW IT WORKS

The operator targets a known note in a registered vault and invokes the frontmatter subcommand. Before scripting a mutation, run `notesmd-cli frontmatter --help` and confirm the installed binary's read and write forms.

Frontmatter changes are filesystem edits and do not require the Obsidian app. The playbook therefore verifies the command surface and uses a controlled note; it does not claim an unconfirmed flag shape.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes frontmatter work to the headless CLI. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Records the command and its unconfirmed flag boundary. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-notes/frontmatter.md`](../../manual-testing-playbook/headless-notes/frontmatter.md) | Manual playbook | Confirms the installed help surface before a controlled metadata edit. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Supplies CLI installation and PATH diagnostics. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli frontmatter
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `notesmd-cli-frontmatter/edit-frontmatter.md`

Related references:
- [`../notesmd-cli-create/create-note.md`](../notesmd-cli-create/create-note.md) — controlled note fixture creation.
- [`../notesmd-cli-search/search-note-content.md`](../notesmd-cli-search/search-note-content.md) — verifies metadata-bearing note content.
