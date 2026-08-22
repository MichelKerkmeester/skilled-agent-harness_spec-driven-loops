---
title: "Project Manager Plugin File-Layer Workflows"
description: "Safe file-layer recipes for the Project Manager community plugin: create a task, set a dependency, build a subtask tree, add time tracking and custom fields, and drive the Table, Gantt and Kanban views from pm-task frontmatter."
trigger_phrases:
  - "create project manager task"
  - "set project manager dependency"
  - "build project manager subtask tree"
  - "project manager time tracking recipe"
  - "project manager custom field recipe"
  - "drive project manager view frontmatter"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Project Manager Plugin File-Layer Workflows

These recipes create and edit the **`pm-task` markdown notes and their frontmatter** the plugin reads. The frontmatter write is the operation; an in-app reload is the render step. The field set, status/priority ids, dependency and hierarchy encoding, and view identifiers below are confirmed from the installed build's compiled `main.js` (v1.8.0). The only items still `VERIFY` are the non-scalar `customFields` value encoding and the project-side custom-field definition shape (`data-model.md` §8).

---

## 1. OVERVIEW

### Operating sequence

1. Identify the target project note (`pm-project: true`, in `Projects/` by default) and read its `id`; every task needs that `id` in `projectId`.
2. Read any task notes the edit will touch — parents, children, and dependency targets — before changing anything.
3. For a new task, write a note with a complete `pm-task` frontmatter block (the always-written fields in `data-model.md` §2).
4. For a link (dependency, parent/child, or project membership), write **both** sides: the field on each end that names the other's `id`.
5. Use only defined `status`/`priority` ids (`data-model.md` §3–§4); confirm the id exists in Settings when the vault has customized them.
6. Back up a task note before an in-place frontmatter rewrite; merge keys rather than replacing the block wholesale.
7. Verify at the file layer: re-read the note and every id it references, confirm each resolves.
8. Tell the user to reload the affected view so the plugin re-renders.

### Backup discipline

- Take a `.bak` copy of a task note before any full-frontmatter rewrite.
- For a single-key edit, keep the original frontmatter in the working transcript.
- Never replace a task's frontmatter wholesale — merge the changed key and leave the id fields intact.

---

## 2. CREATE A TASK

Goal: add a new task the Table, Gantt and Kanban views will pick up.

### Steps

1. Read the target project note and copy its `id`.
2. Choose a title; the file name is the slugified title plus `.md`.
3. Write the note with `pm-task: true`, a fresh opaque `id`, `projectId`, `parentId: null`, and the field set you need.
4. Add the new task's `id` to the project's `taskIds` list so the project claims it.
5. Re-read the note and confirm the frontmatter parses and `projectId` resolves to the project.

### Example

```yaml
# Projects/Website Relaunch/design-homepage.md
---
pm-task: true
projectId: proj-9f2a
id: a3f9k2p1m8x0b4
parentId: null
title: Design homepage
type: task
status: todo
priority: high
start: "2026-08-22"
due: "2026-08-29"
progress: 0
assignees: []
tags: []
subtaskIds: []
dependencies: []
createdAt: "2026-08-22T09:00:00.000Z"
updatedAt: "2026-08-22T09:00:00.000Z"
---
```

### Checkpoint

`task_note_valid`: `pm-task: true` is present, `id` is unique in the project, `status`/`priority` are defined ids, and `projectId` resolves to a real project whose `taskIds` now lists this task.

---

## 3. SET A DEPENDENCY

Goal: mark one task as depending on (blocked by) another so the Gantt view links them.

### Steps

1. Read both the dependent task and the blocking task; copy the blocking task's `id`.
2. Add that `id` to the dependent task's `dependencies` list (append, do not overwrite existing ids).
3. Optionally set the dependent task's `status` to `blocked` while the blocker is open.
4. Re-read the dependent task and confirm every id in `dependencies` resolves to a real task.

### Before

```yaml
# Projects/Website Relaunch/write-copy.md
---
pm-task: true
id: d4e6t1u7v0
title: Write homepage copy
status: todo
dependencies: []
---
```

### After

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

### Checkpoint

`dependency_resolves`: every id in `dependencies` resolves to a real task note in the same project; the dependency is one-directional (only the dependent task is edited).

---

## 4. BUILD A SUBTASK TREE

Goal: nest tasks under a parent using the reciprocal `parentId`/`subtaskIds` id fields.

### Steps

1. Read the parent task and copy its `id`.
2. For each child, write `parentId: <parent id>` and usually `type: subtask`.
3. Add each child's `id` to the parent's `subtaskIds` list.
4. Walk the tree: resolve each child's `parentId` to the parent, and confirm the parent's `subtaskIds` lists every child.

### Before

```yaml
# Projects/Website Relaunch/design-homepage.md
---
pm-task: true
id: a3f9k2p1m8x0b4
title: Design homepage
subtaskIds: []
---
```

### After

```yaml
# Projects/Website Relaunch/design-homepage.md
---
pm-task: true
id: a3f9k2p1m8x0b4
title: Design homepage
subtaskIds: [b7c1n4q8z2, c2d5r9s3w6]
---
```

```yaml
# Projects/Website Relaunch/design-homepage-review.md
---
pm-task: true
id: b7c1n4q8z2
parentId: a3f9k2p1m8x0b4
title: Design homepage - review
type: subtask
---
```

### Checkpoint

`subtree_reciprocal`: each child's `parentId` resolves to the parent, and the parent's `subtaskIds` lists every child's `id`. The generated `Parent:`/`## Subtasks` body text matches, but the id fields are the source of truth.

---

## 5. ADD TIME TRACKING

Goal: record an estimate and logged hours on a task.

### Steps

1. Read the task note.
2. Set `timeEstimate` to the estimated hours (a number).
3. Append entries to `timeLogs`, each an object with `date`, `hours` and `note`.
4. Re-read the note; compute the logged total as the sum of `hours` across `timeLogs`.

### After

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

### Checkpoint

`time_logs_valid`: `timeEstimate` is a number, each `timeLogs` entry has `date`, `hours` and `note`, and the reported logged total is the real sum of the `hours` values.

---

## 6. ADD A CUSTOM FIELD VALUE

Goal: set a per-task custom field value.

### Steps

1. Confirm the field is defined on the project note or in Settings (`data-model.md` §8). Do not invent a field.
2. For a scalar field (text, number, date, checkbox), add `fieldKey: value` under `customFields` on the task.
3. For a non-scalar field (select, multi-select, person), **VERIFY** the plugin's stored encoding against a real task before writing it — do not guess.
4. Re-read the note and confirm `customFields` parses.

### After

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

### Checkpoint

`custom_field_defined`: the field key matches a definition on the project/Settings, scalar values are written directly, and any non-scalar value was confirmed against a real plugin-written task rather than invented.

---

## 7. DRIVE THE TABLE / GANTT / KANBAN VIEWS

Goal: make a task appear, move or span in a view by writing the fields that view reads — never by clicking the view.

### Steps

1. Decide the view and the field it reads (`data-model.md` §9): Kanban reads `status`; Gantt reads `start`, `due`, `dependencies`, `progress`; Table reads every field.
2. Write the field on the task. To move a card between Kanban columns, change `status` to a different defined id. To place a bar on the Gantt, set `start` and `due`. To draw a Gantt link, set `dependencies`.
3. Re-read the task and confirm the field parses and any referenced id resolves.
4. Tell the user to reload the view.

### Example: move a task across the Kanban board

```yaml
# before → after: status changes, the card moves columns on reload
status: todo        # was in the "To Do" column
status: in-progress # now in the "In Progress" column
```

### Checkpoint

`view_field_written`: the field the target view reads is set to a valid value (a defined `status` id for Kanban; parseable `YYYY-MM-DD` dates for Gantt; resolving ids for dependency links), and the render is left for the user to confirm on reload.

---

## 8. DATASOURCE SUPPLEMENT: DATAVIEW FOR CROSS-PROJECT ROLLUPS

The plugin's Table, Gantt and Kanban views cover per-project task tracking. For a read-only aggregation the plugin does not offer — a count of open tasks across every project, a burn-down of `timeLogs` hours, a list of every `blocked` task vault-wide — a Dataview query reads the same `pm-task` frontmatter without touching the plugin.

**Do not edit `references/plugins/dataview/*`.** This section only points to it: read `../dataview/workflows.md` for query recipes and `../dataview/data-model.md` for the DQL grammar.

### Recipe

1. Confirm the need is a cross-cutting read the plugin's own views do not present.
2. Author a DQL block over the `pm-task` fields (for example `WHERE pm-task AND status = "blocked"`).
3. Resolve the query by hand from the real task notes before promising a result (`../dataview/workflows.md` §2).

### Checkpoint

`dataview_supplement_used_correctly`: Dataview was used only for a read the plugin's views do not cover, the query is grounded in real `pm-task` notes, and the plugin remains the surface that writes tasks.

---

## 9. VERIFYING

Run these named checkpoints after any Project Manager operation:

| Checkpoint | What it proves |
| --- | --- |
| `task_note_valid` | `pm-task: true` present, unique `id`, defined `status`/`priority`, `projectId` resolves |
| `dependency_resolves` | Every id in `dependencies` resolves to a real task |
| `subtree_reciprocal` | Each child's `parentId` and the parent's `subtaskIds` agree |
| `time_logs_valid` | `timeEstimate` is numeric and each `timeLogs` entry has `date`/`hours`/`note` |
| `custom_field_defined` | The custom field key is defined; non-scalar values were confirmed, not invented |
| `view_field_written` | The field the target view reads is set to a valid value |
| `dataview_supplement_used_correctly` | Dataview was used only for reads the plugin's views do not cover |

The file layer proves the write. The render proves itself in-app after the user reloads the view — that check belongs to the plugin-install phase, not this reference set.
