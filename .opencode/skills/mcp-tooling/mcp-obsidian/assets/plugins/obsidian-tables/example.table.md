---
title: "Tables .table.md Example"
description: "A valid Tables .table.md asset containing all ten user-facing kinds, two rows, two saved views, and an ID-based Formula column."
trigger_phrases:
  - "tables table md example"
  - "tables starter table"
  - "agentable table example"
  - "tables formula example"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
json-table-plugin: true
table-links:
  - "[[Projects/Atlas.md]]"
  - "[[Projects/Beacon.md]]"
---

# Tables `.table.md` Example

Copy this complete file to create a valid Tables table with a canonical Agentable 1.0 JSON payload.

---

## 1. OVERVIEW

### Purpose

The asset demonstrates every documented user-facing column kind, two ID-keyed rows, named views, derived link frontmatter, and a Formula source with cached results.

### Usage

Copy the whole file, then change the table title, stable IDs, options, links, and rows as one consistent payload. Retain `json-table-plugin: true` and the `json-table` fence.

---

## 2. TABLE PAYLOAD

```json-table
{
  "version": "agentable-1.0.0",
  "metadata": {
    "title": "Project Tracker"
  },
  "columns": [
    {
      "id": "col_task",
      "name": "Task",
      "type": "text",
      "display": { "width": 240 },
      "constraints": { "wrap": true }
    },
    {
      "id": "col_hours",
      "name": "Hours",
      "type": "number"
    },
    {
      "id": "col_done",
      "name": "Done",
      "type": "boolean"
    },
    {
      "id": "col_status",
      "name": "Status",
      "type": "select",
      "constraints": {
        "options": [
          { "value": "Not started", "color": "default" },
          { "value": "In progress", "color": "blue" },
          { "value": "Done", "color": "green" }
        ]
      }
    },
    {
      "id": "col_tags",
      "name": "Tags",
      "type": "select",
      "constraints": {
        "multiSelect": true,
        "options": [
          { "value": "Research", "color": "violet" },
          { "value": "Urgent", "color": "red" }
        ]
      }
    },
    {
      "id": "col_url",
      "name": "Reference",
      "type": "url"
    },
    {
      "id": "col_email",
      "name": "Owner email",
      "type": "email"
    },
    {
      "id": "col_note",
      "name": "Project note",
      "type": "link",
      "constraints": { "suggestAllFiles": true }
    },
    {
      "id": "col_due",
      "name": "Due",
      "type": "date",
      "display": { "dateFormat": "YYYY/MM/DD" }
    },
    {
      "id": "col_total",
      "name": "Total",
      "type": "formula",
      "constraints": {
        "formula": "{{ col_hours }} * 125",
        "formulaResultKind": "number"
      }
    }
  ],
  "views": [
    {
      "id": "view_default",
      "name": "Default",
      "sorts": [],
      "filters": [],
      "hiddenColumns": [],
      "columnOrder": []
    },
    {
      "id": "view_open_work",
      "name": "Open work",
      "sorts": [
        { "id": "srt_due", "columnId": "col_due", "direction": "asc" }
      ],
      "filters": [
        { "id": "flt_not_done", "columnId": "col_done", "operator": "isNot", "value": "true" }
      ],
      "hiddenColumns": ["col_email"],
      "columnOrder": []
    }
  ],
  "rows": [
    {
      "id": "row_atlas",
      "cells": {
        "col_task": "Map plugin data model",
        "col_hours": 8,
        "col_done": "false",
        "col_status": "In progress",
        "col_tags": "Research,Urgent",
        "col_url": "https://github.com/aztekgold/obsidian-tables",
        "col_email": "owner@example.com",
        "col_note": "Projects/Atlas.md",
        "col_due": "1767225600000",
        "col_total": "1000"
      }
    },
    {
      "id": "row_beacon",
      "cells": {
        "col_task": "Review table workflows",
        "col_hours": 3,
        "col_done": "true",
        "col_status": "Done",
        "col_tags": "Research",
        "col_url": "https://github.com/aztekgold/agentable",
        "col_email": "reviewer@example.com",
        "col_note": "Projects/Beacon.md",
        "col_due": "1767312000000",
        "col_total": "375"
      }
    }
  ]
}
```
