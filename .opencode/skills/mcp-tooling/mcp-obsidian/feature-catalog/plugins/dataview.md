---
title: "Dataview file-layer metadata and queries"
description: "Author and validate Dataview note metadata and DQL query blocks at the file layer: frontmatter fields, inline fields and verified query grammar."
trigger_phrases:
  - "dataview query"
  - "dataview table"
  - "dataview dql block"
  - "dataview metadata fields"
  - "dataview frontmatter fields"
  - "dataview inline fields"
version: "0.10.0.0"
---

# Dataview file-layer metadata and queries (`dataview`)

## 1. OVERVIEW

Dataview (repo `blacksmithgu/obsidian-dataview`, installed v0.5.68 per the vault manifest) turns plain note content into queryable data. It reads three metadata sources from every markdown note: YAML frontmatter fields, inline `Key:: Value` fields and implicit `file.*` fields. Query blocks in `dataview` fences render those fields as tables, lists, task lists or calendars. The plugin never writes note content, so every AI operation happens at the file layer.

---

## 2. HOW IT WORKS

The mode edits note metadata (append or merge frontmatter and inline fields) and authors DQL query blocks with validated grammar. Settings changes follow backup discipline when `data.json` exists. Query evaluation happens by reading the source notes directly and applying the verified DQL grammar. Rendering stays in-app: the file layer proves the write and a note reload shows the result.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/dataview/dataview.md`
- Data contract: `references/plugins/dataview/data-model.md`
- Recipes: `references/plugins/dataview/workflows.md`
- Diagnostics: `references/plugins/dataview/troubleshooting.md`

### Assets

- `assets/plugins/dataview/dataview-query.example.md` (copyable note with frontmatter, inline fields and one DQL table block that reads exactly those fields)
- `assets/plugins/dataview/dataview-metadata.example.md` (copyable note showing all three metadata layers with the queryable field space)

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/dataview-metadata-query.md`

---

## 4. GUARDRAILS

- Never invent query syntax or field names. Every example comes from the verified grammar in the data model.
- Read notes before promising query results. A field typo renders blank cells, not an error.
- Keep one source per metadata key. The same key in frontmatter and inline body is ambiguous.
- Back up `data.json` before any settings write and merge key by key. Defaults apply while the file is absent.
- Never claim a query rendered. File-layer verification proves the write, not the pixels.
