---
title: "Search note content"
description: "Search note bodies with notesmd-cli's full-text filesystem scan."
trigger_phrases:
  - "Search note content"
  - "notesmd-cli search-content"
  - "search the vault body text"
version: 0.1.0.0
---

# Search note content (`notesmd-cli search-content`)

## 1. OVERVIEW

`notesmd-cli search-content <query>` scans note bodies for a term in the selected vault.

This is the headless full-text alternative to title search and to the live-app MCP search when no app or token is available.

---

## 2. HOW IT WORKS

The command reads vault files directly and prints notes whose body contains the query. It is slower than filename-level lookup because it scans file contents, but it remains deterministic and does not require Obsidian to be open.

If the result is empty, the operator checks spelling, the active vault, title search, and `notesmd-cli list` before treating the result as a valid no-match outcome.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Routes content search to the headless CLI when the app-backed MCP is unavailable. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines body-search behavior and the title-search distinction. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-notes/search-notes.md`](../../manual-testing-playbook/headless-notes/search-notes.md) | Manual playbook | Searches a known marker in a real note body. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Defines empty-result diagnostics. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli search
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/search-note-content.md`

Related references:
- [`search-note-names.md`](search-note-names.md) — title/name search.
- [`../cli/open-daily-note.md`](../cli/open-daily-note.md) — daily note content source.
