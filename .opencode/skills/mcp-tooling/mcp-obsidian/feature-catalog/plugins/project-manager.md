---
title: "Project Manager plugin file-layer tasks, dependencies and views"
description: "Create and update Project Manager community-plugin tasks at the file layer: pm-task markdown notes whose frontmatter encodes status, priority, dependencies, subtask hierarchy, time tracking and custom fields behind the Table, Gantt and Kanban views."
trigger_phrases:
  - "project manager plugin"
  - "obsidian-pm"
  - "pm-task frontmatter"
  - "project manager dependency"
  - "project manager subtask"
  - "project manager gantt kanban"
version: "0.1.0.0"
---

# Project Manager plugin file-layer tasks, dependencies and views (`project-manager`)

## 1. OVERVIEW

The Project Manager community plugin (repo `StepanKropachev/obsidian-pm`, installed v1.8.0, manifest id `project-manager`) is a full project-management layer inside the vault: Table, Gantt and Kanban views over tasks with subtasks, dependencies, time tracking, custom fields, and due-date notifications. Every task persists as its own `.md` note carrying `pm-task: true`, with each field as a frontmatter key and nothing stored outside the vault — no database, no external service. Because tasks are plain markdown, the AI creates and updates them at the file layer: writing a `pm-task` frontmatter block, editing `status`/`priority`/`dependencies`/`parentId`/`timeEstimate`, and letting the app re-render.

---

## 2. HOW IT WORKS

The mode writes `pm-task` notes and edits their frontmatter. `status` and `priority` are slug ids (defaults `todo`/`in-progress`/`blocked`/`done`/`cancelled` and `critical`/`high`/`medium`/`low`); `dependencies`, `parentId` and `subtaskIds` reference other tasks' opaque `id`s, not wikilinks; `timeEstimate`/`timeLogs` hold time tracking. A task joins a project through `projectId` and the project's reciprocal `taskIds`. The three views — `table`, `gantt`, `kanban` — are lenses over the same frontmatter, so driving a view means writing the fields it reads (Kanban groups by `status`, Gantt spans `start`→`due` and draws `dependencies`). File-layer verification proves the write; a view reload proves the render.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/project-manager/project-manager.md`
- Data contract: `references/plugins/project-manager/data-model.md`
- Recipes: `references/plugins/project-manager/workflows.md`
- Diagnostics: `references/plugins/project-manager/troubleshooting.md`

### Verification

- File-layer checkpoints: `references/plugins/project-manager/workflows.md` §9 (valid `pm-task` frontmatter write plus a view reload that shows the task)

### Related

- Read-only aggregation supplement: `references/plugins/dataview/` (never edited by this plugin's references — `workflows.md` §8 only points to it)
- General relational databases: `references/plugins/notion-bases/` (a broader database layer, not a PM tool — see `troubleshooting.md` §10)

---

## 4. GUARDRAILS

- Never write a task note without `pm-task: true` — it is invisible to every view.
- Write only defined `status`/`priority` ids (the slug, not the label); a value outside the defined set will not group in Kanban.
- Encode `dependencies`, `parentId` and `subtaskIds` as opaque task `id`s, never wikilinks; the generated `Parent:`/`## Subtasks` body text is output, not the source of truth.
- Treat the non-scalar `customFields` value encoding and the project-side custom-field definition shape as `VERIFY` — confirm against a real plugin-written task before authoring them.
- Never claim a task rendered in the Table, Gantt or Kanban UI. File-layer verification proves the frontmatter write, not the pixels.
