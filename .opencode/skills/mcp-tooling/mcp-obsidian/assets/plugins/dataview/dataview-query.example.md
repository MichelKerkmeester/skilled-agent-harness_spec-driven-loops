---
title: Dataview Query Block Example
description: "A copyable note pairing frontmatter and inline fields with one DQL table block that reads exactly those fields, for headless Dataview metadata-query testing."
trigger_phrases:
  - "dataview query example"
  - "dataview table example"
  - "dataview dql example"
  - "dataview metadata query"
  - "dataview query block"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Dataview Query Block Example

A copyable example note that pairs the metadata Dataview reads with one DQL table block that reads exactly those fields. Copy the note below into a folder named `Projects` in a vault with Dataview installed, and the table renders the note's own values instead of blank cells.

## 1. OVERVIEW

### Purpose

The asset demonstrates the file-layer metadata contract: frontmatter fields, inline `Key:: Value` fields and one verified DQL block. Every field the query references exists in the note, so an agent can copy it, author honest queries and verify field-name agreement from the files.

### Usage

Copy the whole note into a folder named `Projects`. Keep every metadata key unique across the note, since the same key in frontmatter and inline body is ambiguous. Rename the note freely, then fix the `FROM "Projects"` line to match the folder you chose.

---

## 2. COPY THIS NOTE

````markdown
---
title: "Quarterly report"
status: active
owner: ada
tags:
  - finance
  - report
amount: 1250
---

# Quarterly report

Revenue summary goes here.

Due:: 2026-06-30
Progress:: 70
Attendees:: ada, grace

## Project status

```dataview
TABLE status, amount, Due, Progress
FROM "Projects"
WHERE contains(status, "active")
SORT Due ASC
LIMIT 20
```
````

---

## 3. WHAT THE QUERY READS

| Query token | Metadata layer | Source in the note |
| --- | --- | --- |
| `status` | Frontmatter | `status: active` |
| `amount` | Frontmatter | `amount: 1250` |
| `Due` | Inline field | `Due:: 2026-06-30` |
| `Progress` | Inline field | `Progress:: 70` |
| `FROM "Projects"` | Folder source | The folder holding the note |
| `contains(status, "active")` | Verified function | Filters on the frontmatter value |

The `File` column comes from the implicit layer. `file.name`, `file.path` and `file.mtime` exist on every note without any declaration.

---

## 4. HONEST LIMITS

- This asset proves the file layer: metadata present, block well-formed and query fields matching the note. Rendering happens in Obsidian after a reload.
- Other notes in the same folder render rows too. A note that lacks one of the referenced fields shows a blank cell, which is expected behavior, not an error.
- Dates are ISO strings. Dataview parses them as date values when used with `date(...)`.
- `file.day` is conditional and absent here, so the query avoids it.
