---
title: "Project Manager Plugin File-Layer Index"
description: "Lean entry point for operating the Project Manager community plugin (StepanKropachev/obsidian-pm) at the file layer: create and update tasks as pm-task markdown notes whose frontmatter encodes status, priority, dependencies, subtask hierarchy, time tracking and custom fields behind the Table, Gantt and Kanban views."
trigger_phrases:
  - "project manager plugin"
  - "obsidian-pm"
  - "pm-task frontmatter"
  - "project manager task"
  - "project manager dependency"
  - "project manager subtask"
  - "project manager gantt kanban"
  - "project manager status priority"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Project Manager Plugin File-Layer Index (`project-manager`)

The `mcp-obsidian` mode operates the Project Manager community plugin by **writing task notes and editing their frontmatter**. It never drives the plugin's Table, Gantt or Kanban UI. Project Manager is a full project-management layer inside the vault — subtasks, dependencies, time tracking, custom fields, and due-date notifications — and every task persists as plain markdown plus YAML frontmatter with no external service, so the AI creates and updates tasks entirely at the file layer.

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Plugin repository | [`StepanKropachev/obsidian-pm`](https://github.com/StepanKropachev/obsidian-pm) | Source of behavior facts |
| Display name | **Project Manager** | Name shown in Community Plugins → Browse |
| On-disk manifest `id` | `project-manager` | Confirmed in the installed `manifest.json`; the folder is `.obsidian/plugins/project-manager/` |
| Installed version (operator vault) | **v1.8.0** | Confirmed installed via `manifest.json`; the task schema below was read from this build's compiled `main.js` |
| `minAppVersion` | **1.7.2** | Confirmed in the installed `manifest.json` — the Obsidian floor for this build |
| Platform | Desktop and mobile (`isDesktopOnly: false`) | Confirmed in `manifest.json` |
| Storage model | Every task is its own `.md` note carrying `pm-task: true`; every project is its own `.md` note carrying `pm-project: true`; every task/project field is a frontmatter key. Default project folder is `Projects/` (setting `projectsFolder`) | Confirmed from the compiled plugin. Project Manager persists nothing outside the vault — no database file, no external service |
| Views | Three modes read the same task frontmatter: `table`, `gantt`, `kanban` | Confirmed. A view is a lens over the frontmatter, never a separate store — driving a view means writing the fields it reads |

The task frontmatter schema in [`data-model.md`](data-model.md) — the `pm-task` flag, the field set, the status and priority vocabularies, `dependencies`, `parentId`/`subtaskIds`, `timeEstimate`/`timeLogs`, and the three view identifiers — was read directly from this build's compiled `main.js` and is confirmed. The only items still flagged `VERIFY` are the exact serialized encoding of non-scalar `customFields` values (select, multi-select, person) and the custom-field **definition** object shape on the project note; confirm those against a real task the plugin wrote before relying on them.

---

## 2. HOW IT WORKS

The plugin recognizes a note as a task by the frontmatter flag `pm-task: true` and as a project by `pm-project: true`. A task's frontmatter carries one value per field: `status` and `priority` (slug ids), `start` and `due` (plain `YYYY-MM-DD` dates), `progress` (0–100), `dependencies` (a list of task ids), `parentId`/`subtaskIds` (the hierarchy), and `timeEstimate`/`timeLogs` (time tracking). A task belongs to a project through the task's `projectId` and the project's reciprocal `taskIds` list.

Because tasks are ordinary notes, the AI creates a task by writing a new note with a valid `pm-task` frontmatter block, and updates one by editing that frontmatter. It sets a dependency by adding the blocking task's `id` to the dependent task's `dependencies` list. It builds a subtask tree by writing `parentId` on each child and listing the children's ids in the parent's `subtaskIds`. It drives the Table, Gantt or Kanban view by writing the fields those views read — Kanban groups by `status`, Gantt spans `start`→`due` and draws `dependencies` — never by clicking the view.

Verification is a valid frontmatter write plus a view reload that shows the task: the file layer proves the write, and a reload inside a running Obsidian proves the render. The AI validates a task structurally — required flag present, `status`/`priority` match defined ids, `dependencies`/`parentId` resolve to real task ids — from the files, not from the render.

---

## 3. SOURCE FILES

| File | Use it for |
| --- | --- |
| [`data-model.md`](data-model.md) | The `pm-task` frontmatter schema: the full field set, the status and priority vocabularies, dependency encoding, `parentId`/`subtaskIds` hierarchy, time tracking, custom fields, and the three view types |
| [`workflows.md`](workflows.md) | Numbered file-layer recipes: create a task, set a dependency, build a subtask tree, add time tracking and custom fields, and drive the Table/Gantt/Kanban views from frontmatter |
| [`troubleshooting.md`](troubleshooting.md) | Failure modes and recovery: task not appearing in a view, broken dependency, undefined status/priority, version-gated features, and the Dataview / notion-bases overlap note |

The general file-layer operating model (locate data, edit data, never drive the UI) lives in [`../plugin-operation-logic.md`](../plugin-operation-logic.md). For read-only aggregation across tasks, the sibling [`../dataview/dataview.md`](../dataview/dataview.md) is a supplement — this reference set never edits the Dataview files, it only points to them.

---

## 4. GUARDRAILS

- **Never omit `pm-task: true`.** A task note without the flag is invisible to every view. Confirmed: detection is by the flag, not the folder.
- **Write only defined status and priority ids.** `status` and `priority` are slug ids that must match a status/priority defined in the plugin's Settings. The confirmed defaults are `todo`, `in-progress`, `blocked`, `done`, `cancelled` and `critical`, `high`, `medium`, `low`; a value outside the defined set will not group correctly.
- **Encode dependencies and hierarchy as task ids, never wikilinks.** `dependencies`, `parentId` and `subtaskIds` all reference the opaque task `id` string, not a file path or `[[wikilink]]`. The human-readable `Parent:`/`Project:` links and `## Subtasks` list in the note body are generated output, not the source of truth.
- **Keep both sides of a link in sync.** A dependency, a parent/child pair, and a task/project membership each have two frontmatter fields; write both or the view desynchronizes.
- **Flag the two unconfirmed encodings `VERIFY`.** The task-side `customFields` map is confirmed, but the per-type value encoding for select/multi-select/person values and the project-side custom-field definition shape are not byte-verified — check a real plugin-written task before promising them.
- **File-layer verification proves the write, not the render.** A reload inside a running Obsidian is required to see the Table, Gantt or Kanban output — that check belongs to the plugin-install phase, not this reference set.
