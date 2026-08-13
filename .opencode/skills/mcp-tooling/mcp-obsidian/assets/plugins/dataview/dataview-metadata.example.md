---
title: "Dataview metadata layers example"
description: "A copyable note showing all three Dataview metadata layers: frontmatter fields, inline fields and implicit file fields, with a query that reads one field from each layer."
trigger_phrases:
  - "dataview metadata layers"
  - "dataview frontmatter example"
  - "dataview inline field example"
  - "dataview file fields example"
  - "dataview three layers"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Dataview Metadata Layers Example

A copyable example note demonstrating the three metadata layers Dataview merges into one field space: YAML frontmatter, inline `Key:: Value` fields and implicit `file.*` fields. The embedded query reads one field from each layer, so a rendered table shows the whole contract in action.

## 1. OVERVIEW

### Purpose

Dataview turns plain note content into queryable data from three sources. This asset shows all three on one note and names the layer each query token comes from, so an agent can author honest queries against real notes instead of guessing field names.

### Usage

Copy the note below into a folder named `Notes` in a vault with Dataview installed. The implicit `file.*` columns need no note content, they exist on every note.

---

## 2. COPY THIS NOTE

````markdown
---
title: "Sprint review"
status: done
owner: grace
tags:
  - retrospective
  - team
---

# Sprint review

Key outcomes and follow-ups.

Due:: 2026-07-15
Sprint:: 42

## Cross-layer view

```dataview
TABLE file.name, file.folder, status, Due, Sprint
FROM "Notes"
WHERE contains(status, "done")
SORT file.mtime DESC
```
````

---

## 3. LAYER MAP

| Query token | Layer | Where it lives |
| --- | --- | --- |
| `file.name` | Implicit | Derived from the note path, always present |
| `file.folder` | Implicit | Derived from the note path, always present |
| `file.mtime` | Implicit | Derived from the note file, always present |
| `status` | Frontmatter | `status: done` above the first `---` |
| `Due` | Inline field | `Due:: 2026-07-15` in the body |
| `Sprint` | Inline field | `Sprint:: 42` in the body |
| `FROM "Notes"` | Folder source | The folder holding the note |

---

## 4. RULES TO KEEP

- Keep one source per key. The note spells `owner` in frontmatter only, so no inline `Owner::` line exists and no ambiguity arises.
- Implicit `file.*` fields never need declaring. They exist on every note.
- `file.day` is conditional and absent here, so the query avoids it.
- `contains(status, "done")` is a verified function from the data model.

---

## 5. HONEST LIMITS

- Rendering is in-app. Copying this note proves the file layer only, a reload shows the table.
- Other notes in the folder render rows too. A note missing `status`, `Due` or `Sprint` shows blank cells, which is expected.
