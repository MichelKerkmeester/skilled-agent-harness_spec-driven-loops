---
title: "Project Manager Plugin File-Layer Data Model"
description: "The pm-task frontmatter schema for the Project Manager community plugin: the confirmed field set, the status and priority vocabularies, dependency and subtask-hierarchy encoding, time tracking, custom fields, and the three view types."
trigger_phrases:
  - "project manager data model"
  - "pm-task frontmatter schema"
  - "project manager status vocabulary"
  - "project manager priority vocabulary"
  - "project manager dependencies field"
  - "project manager subtask hierarchy"
  - "project manager time tracking"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Project Manager Plugin File-Layer Data Model

The plugin persists every task as its own `.md` note whose YAML frontmatter carries one value per field, and every project as its own `.md` note. Nothing lives outside vault markdown — no database file, no external service. The frontmatter flag, the task field set, the status and priority vocabularies, the dependency and hierarchy encoding, the time-tracking shape and the three view identifiers below were all read directly from the installed build's compiled `main.js` (v1.8.0) and are confirmed. Only the per-type encoding of non-scalar `customFields` values and the project-side custom-field **definition** shape remain `VERIFY` (see §8).

---

## 1. OVERVIEW

### Storage model

| Layer | Artifact | AI-operable |
| --- | --- | --- |
| Task | One `.md` note per task, carrying `pm-task: true` and the field set in §2 | Yes — create, read, edit frontmatter |
| Project | One `.md` note per project, carrying `pm-project: true`, in the `Projects/` folder (setting `projectsFolder`) | Yes — read, edit; a task joins it via `projectId` + the project's `taskIds` |
| Task field | One frontmatter key per field (§2) | Yes for every text-representable field |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled when this reference set is loaded for a live vault) |
| Rendering | The open Obsidian window (Table / Gantt / Kanban) | No — file-layer writes prove the fields, not the pixels |

### Core contract

- A note is a task **only** when its frontmatter has `pm-task: true`. Detection is by the flag, not by folder location — confirmed.
- Deleting the plugin never deletes data: the markdown task notes survive on their own.
- `status`, `priority`, `dependencies`, `parentId`, `subtaskIds` and the time-tracking fields are all plain frontmatter — every task operation is a frontmatter edit.
- Views (`table`, `gantt`, `kanban`) are lenses over the same frontmatter; there is no per-view data store.

---

## 2. THE TASK FRONTMATTER FIELD SET (confirmed)

These keys are written by the plugin's own serializer, in this order. The first block is always present; the second block is written only when the field has a value.

### Always written

| Key | Type | Meaning |
| --- | --- | --- |
| `pm-task` | boolean `true` | Required flag — the note is not a task without it |
| `projectId` | string (project id) | The owning project's `id` |
| `parentId` | string \| `null` | Parent task's `id`, or `null` for a top-level task |
| `id` | string | Opaque task id, e.g. `a3f9k2p1m8x0b4` — a base-36 random+timestamp string, **not** a `task-…` slug |
| `title` | string | Task title (also drives the file name, slugified) |
| `type` | `task` \| `subtask` \| `milestone` | Task type; default `task` |
| `status` | string (status id) | One of the defined status ids; default `todo` (§3) |
| `priority` | string (priority id) | One of the defined priority ids; default `medium` (§4) |
| `start` | string `YYYY-MM-DD` | Start date (plain date); may be empty |
| `due` | string `YYYY-MM-DD` | Due date (plain date); may be empty |
| `progress` | number 0–100 | Percent complete; default 0 |
| `assignees` | list of strings | Assigned team members |
| `tags` | list of strings | Task tags |
| `subtaskIds` | list of strings | The `id`s of this task's direct children (§5) |
| `dependencies` | list of strings | The `id`s of tasks this one depends on (§6) |
| `createdAt` | string (ISO datetime) | Creation timestamp |
| `updatedAt` | string (ISO datetime) | Last-update timestamp |

### Written only when set

| Key | Type | Meaning |
| --- | --- | --- |
| `completed` | string (date) | Completion date; present only once the task is completed |
| `recurrence` | object | Recurrence rule — confirmed fields `interval`, `every`, `endDate` (§7) |
| `timeEstimate` | number | Estimated hours (§7) |
| `timeLogs` | list of objects | Logged time entries, each `{ date, hours, note }` (§7) |
| `customFields` | object (map) | Per-task custom field values (§8) |

### Task file name and dates

- The task note's file name is the title slugified: lowercase, spaces to hyphens, truncated to 60 characters, plus `.md`. Renaming the title regenerates the slug; the stable identity is `id`, not the file name.
- `start`, `due` and `completed` are plain calendar dates in `YYYY-MM-DD` form; `createdAt`/`updatedAt` are full ISO datetimes.

---

## 3. STATUS VOCABULARY (confirmed defaults)

`status` holds a status **id** (the slug), not the display label. The confirmed default set:

| Status id (frontmatter value) | Label | Counts as complete |
| --- | --- | --- |
| `todo` | To Do | no |
| `in-progress` | In Progress | no |
| `blocked` | Blocked | no |
| `done` | Done | yes |
| `cancelled` | Cancelled | yes |

Statuses are customizable in the plugin's Settings (add, rename, recolor, reorder). When a vault defines custom statuses, write the **id** the Settings assign, not the label. A `status` value that matches no defined id will not group in the Kanban view — write only defined ids.

---

## 4. PRIORITY VOCABULARY (confirmed defaults)

`priority` holds a priority **id** (the slug). The confirmed default set:

| Priority id (frontmatter value) | Label |
| --- | --- |
| `critical` | Critical |
| `high` | High |
| `medium` | Medium (default) |
| `low` | Low |

Priorities are customizable in Settings the same way statuses are. Write the defined id, not the label.

---

## 5. SUBTASK HIERARCHY (`parentId` + `subtaskIds`)

Hierarchy is encoded by two reciprocal id fields, not by wikilinks:

- On each child task: `parentId: <parent task id>`.
- On each parent task: `subtaskIds: [ <child id>, <child id> ]`.

A top-level task has `parentId: null`. A subtask is usually written with `type: subtask`. Nesting can go multiple levels — a child that is itself a parent carries both a `parentId` and its own `subtaskIds`.

```yaml
# Projects/Website Relaunch/design-homepage.md
---
pm-task: true
projectId: proj-9f2a
id: a3f9k2p1m8x0b4
parentId: null
title: Design homepage
type: task
subtaskIds: [b7c1n4q8z2, c2d5r9s3w6]
---
```

```yaml
# Projects/Website Relaunch/design-homepage-review.md
---
pm-task: true
projectId: proj-9f2a
id: b7c1n4q8z2
parentId: a3f9k2p1m8x0b4
title: Design homepage - review
type: subtask
---
```

The note body also carries a generated `Parent: [[…]]` (or `Project: [[…]]`) link and a `## Subtasks` list. Those are readable output, **not** the source of truth — the hierarchy graph is the `parentId`/`subtaskIds` id fields. The AI verifies a subtree by resolving each `id` to a real task note and confirming each parent lists each child and each child names its parent.

---

## 6. DEPENDENCIES

A `dependencies` value is a list of the **task ids** this task depends on (is blocked by), not wikilinks:

```yaml
# Projects/Website Relaunch/write-copy.md
---
pm-task: true
id: d4e6t1u7v0
title: Write homepage copy
status: blocked
dependencies: [a3f9k2p1m8x0b4]
---
```

The Gantt view draws a link from each dependency to the dependent task and uses the relationship for blocked-state logic. A dependency is one-directional: only the dependent task lists the id; the blocking task is not edited. The AI verifies a dependency by confirming every id in `dependencies` resolves to a real task note. A dependency id that resolves to no task is a broken edge (see `troubleshooting.md` §4).

---

## 7. TIME TRACKING

Two confirmed fields, both written only when set:

- `timeEstimate` — a number (hours estimated for the task).
- `timeLogs` — a list of logged entries, each an object with the confirmed keys `date`, `hours`, `note`.

```yaml
# Projects/Website Relaunch/design-homepage.md
---
pm-task: true
id: a3f9k2p1m8x0b4
title: Design homepage
timeEstimate: 8
timeLogs:
  - { date: "2026-08-20", hours: 2.5, note: "wireframes" }
  - { date: "2026-08-21", hours: 3, note: "hi-fi mockups" }
---
```

Logged total is the sum of the `hours` across `timeLogs` entries — the AI can compute it by reading the entries, without the plugin rendering. The `recurrence` object (present only on recurring tasks) carries the confirmed fields `interval`, `every` and `endDate`; any additional recurrence keys are **VERIFY** against a real recurring task.

---

## 8. CUSTOM FIELDS

Custom fields have two halves:

- **Definitions** live on the **project** note (`pm-project` frontmatter) and/or in Settings. Per-project field types documented by the plugin are text, number, date, select, multi-select, person, checkbox and url. The exact definition object shape (its id/name/type/options keys) is **VERIFY** — read a real project note the plugin wrote before authoring one by hand.
- **Values** live on the **task** note as a `customFields` map — confirmed to be a plain object of `fieldKey: value`:

```yaml
# Projects/Website Relaunch/design-homepage.md
---
pm-task: true
id: a3f9k2p1m8x0b4
title: Design homepage
customFields:
  effort_points: 5
  needs_review: true
---
```

The `customFields` map itself is confirmed. The serialized encoding of a **non-scalar** value — a select id, a multi-select list, a person reference — is **VERIFY**: scalar values (text, number, date, checkbox) are safe to write directly, but confirm how the plugin stores select/multi-select/person values against a real task before setting one.

---

## 9. VIEW TYPES (confirmed)

Three view modes read the same task frontmatter across a project:

| View id | Reads | Notes |
| --- | --- | --- |
| `table` | Every field, one row per task | Default view (`defaultView: table`) |
| `gantt` | `start`, `due`, `dependencies`, `progress` | Spans start→due and draws dependency links; granularity is a project/setting concern, not a task field |
| `kanban` | `status` (as the grouping axis) | One column per defined status; a task with an undefined `status` will not land in a column |

A view is a lens, never a store: to make a task appear or move in a view, write the fields that view reads. Projects persist named view configs in a `savedViews` list on the project note; that is a project-level concern, separate from the per-task fields above.

---

## 10. WHAT THE AI MUST NOT DO

- Never write a task note without `pm-task: true` — it will be invisible to every view.
- Never write a `status` or `priority` value that is not a defined id. The confirmed defaults are the five statuses in §3 and the four priorities in §4; a custom vault may define more, but the value must match a defined id.
- Never encode `dependencies`, `parentId` or `subtaskIds` as wikilinks or file paths — they reference the opaque task `id`. Never treat the generated `Parent:`/`## Subtasks` body text as the source of truth.
- Never present the non-scalar `customFields` value encoding or the project-side custom-field definition shape as byte-verified — both are `VERIFY`.
- Never claim a task rendered in the Table, Gantt or Kanban UI. File-layer verification proves the frontmatter write; a reload proves the render, and that belongs to the plugin-install phase.
