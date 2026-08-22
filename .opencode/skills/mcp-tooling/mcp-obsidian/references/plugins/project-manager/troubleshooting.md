---
title: "Project Manager Plugin File-Layer Troubleshooting"
description: "Cause, detection and file-layer recovery for Project Manager plugin failures: task not appearing in a view, broken dependency, undefined status or priority, version-gated features, and the Dataview / notion-bases overlap for task tracking."
trigger_phrases:
  - "project manager task not appearing"
  - "project manager broken dependency"
  - "project manager undefined status"
  - "project manager kanban missing card"
  - "project manager gantt not drawing"
  - "project manager dataview overlap"
importance_tier: "normal"
contextType: "general"
version: "0.1.0.0"
---

# Project Manager Plugin File-Layer Troubleshooting

Diagnose the task note, its id references, and the view separately. A task whose frontmatter parses can still fail to appear if its `pm-task` flag is missing, its `projectId` does not resolve, or its `status` is not a defined id.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Task appears in no view at all | `pm-task: true` missing, or `projectId` names no real project / the project's `taskIds` does not list it |
| Task missing from the Kanban board | `status` is not one of the defined status ids — no column matches |
| Task not spanning on the Gantt | `start` or `due` missing or not a valid `YYYY-MM-DD` date |
| Dependency link not drawn | The blocking task's `id` in `dependencies` resolves to no task, or the field is a wikilink instead of an id |
| Subtask nesting looks wrong | `parentId` and `subtaskIds` disagree, or a `parentId` id resolves to no task |
| Custom field value ignored | The field key is not defined on the project/Settings, or a non-scalar value uses the wrong encoding |
| A feature is absent | The installed version predates that feature — check the version |
| Old state on screen | The view needs a reload after the file change |

---

## 2. DIAGNOSIS SEQUENCE

1. Read the task note and confirm `pm-task: true` is present and the frontmatter parses as valid YAML.
2. Resolve `projectId` to a real project note and confirm that project's `taskIds` lists this task's `id`.
3. For a Kanban miss, confirm `status` is one of the defined status ids (`data-model.md` §3).
4. For a Gantt miss, confirm `start` and `due` are valid `YYYY-MM-DD` dates.
5. For a dependency, resolve every id in `dependencies` to a real task note.
6. For a subtask, resolve `parentId` to the parent and confirm the parent's `subtaskIds` lists this child.
7. Check the render step last: the user must reload the view after any file change.

---

## 3. TASK NOT APPEARING IN A VIEW

| Cause | Check | Fix |
| --- | --- | --- |
| `pm-task: true` missing | Grep the note's frontmatter for `pm-task` | Add `pm-task: true` — without it the note is not a task |
| `projectId` resolves to no project | Compare `projectId` against project note `id`s | Correct `projectId`, or add the task's `id` to the right project's `taskIds` |
| Project does not claim the task | Read the project's `taskIds` list | Add the task's `id` to the project's `taskIds` |
| `status` not a defined id | Compare `status` against the defined status ids | Set `status` to a defined id (default set in `data-model.md` §3) |
| Note not saved / view not reloaded | Confirm the file wrote and the pane was reloaded | Save the note and reload the view |

---

## 4. BROKEN DEPENDENCY

| Cause | Check | Fix |
| --- | --- | --- |
| Dependency id resolves to no task | Resolve every id in `dependencies` | Remove the stale id, or point it at the correct task's `id` |
| Dependency written as a wikilink or path | Inspect the `dependencies` values | Replace with the blocking task's opaque `id` — dependencies are ids, not `[[wikilinks]]` |
| Dependency points across projects unexpectedly | Confirm the blocking task's `projectId` | Keep the dependency within the intended project, or confirm the cross-project link is deliberate |
| Both tasks edited (double-linked) | Confirm only the dependent task lists the id | A dependency is one-directional; remove the id from the blocking task |

---

## 5. UNDEFINED STATUS OR PRIORITY

| Cause | Check | Fix |
| --- | --- | --- |
| `status`/`priority` value is a label, not an id | Compare against the defined ids | Write the id (`in-progress`, not `In Progress`) |
| Custom status/priority not defined in Settings | Read the plugin's Settings status/priority list | Define it in Settings first, or use an existing defined id |
| Typo in the id (`inprogress`, `criticall`) | Grep for the exact value | Correct to the exact defined id |

---

## 6. SUBTASK OR HIERARCHY DRIFT

| Cause | Check | Fix |
| --- | --- | --- |
| `parentId` resolves to no task | Resolve the `parentId` id | Fix the id, or clear it to `null` for a top-level task |
| Parent's `subtaskIds` missing a child | Compare the parent's `subtaskIds` against the children's `parentId` | Add the child's `id` to the parent's `subtaskIds` |
| Child listed by a parent it does not name | Resolve each `subtaskIds` id and read its `parentId` | Make the two sides reciprocal — one source of truth |
| Body `## Subtasks` list out of sync | Compare the body links against the id fields | Trust the id fields; the body text is generated output |

---

## 7. VERSION-GATED FEATURES AND COMPATIBILITY

| Cause | Check | Fix |
| --- | --- | --- |
| A field or view is absent | Read the installed `manifest.json` `version` | The operator vault is on **v1.8.0**; a feature added later needs an upgrade — confirm against the plugin's CHANGELOG before promising it |
| Obsidian too old for the plugin | Compare the app version against `minAppVersion` | The installed manifest requires Obsidian **1.7.2+**; upgrade the app if below it |
| Mobile behavior questioned | Check `isDesktopOnly` | The manifest sets `isDesktopOnly: false` — the plugin loads on mobile |

---

## 8. RECOVERY

| Problem | Fix |
| --- | --- |
| Task invisible | Add `pm-task: true`; fix `projectId` and the project's `taskIds` |
| Kanban card missing | Set `status` to a defined id |
| Gantt bar missing | Set valid `start`/`due` dates |
| Dependency broken | Repoint the id to a real task; ensure it is an id, not a wikilink |
| Subtree drifted | Make `parentId` and `subtaskIds` reciprocal |
| Custom field ignored | Match the field key to a definition; verify non-scalar encoding |
| Stale render | Reload the view |
| Corrupted frontmatter | Restore from `.bak` and re-apply only the intended edit |

---

## 9. VALIDATION CHECKPOINTS

| Checkpoint | What it proves |
| --- | --- |
| `task_flag_present` | The note carries `pm-task: true` |
| `project_membership_resolves` | `projectId` resolves and the project's `taskIds` lists the task |
| `status_priority_defined` | `status`/`priority` are defined ids, not labels or typos |
| `dependency_resolves` | Every id in `dependencies` resolves to a real task |
| `subtree_reciprocal` | `parentId` and `subtaskIds` agree across parent and child |
| `dates_parseable` | `start`/`due`/`completed` are valid `YYYY-MM-DD` dates |
| `reload_advised` | The user knows a view reload is required to see the render |

---

## 10. OVERLAP WITH DATAVIEW AND NOTION BASES (honest note)

Project Manager's Table, Gantt and Kanban views overlap with Dataview and the notion-bases plugin **for task tracking specifically** — all three can surface tasks stored as markdown frontmatter, and a simple task list can be built in any of them. They are not redundant:

- **Project Manager** is purpose-built for project management: dependencies with Gantt links, subtask hierarchy, time tracking, due-date notifications, and a Kanban board. It is the surface that *writes and owns* tasks.
- **Dataview** (`../dataview/`) is read-only. It queries the same `pm-task` frontmatter for cross-project rollups the plugin's views do not present, but it does not manage tasks.
- **notion-bases** (`../notion-bases/`) is a general relational-database layer (two-way relations, rollups, multiple view types). It is broader than tasks but is not a PM tool — it has no dependency-Gantt, no time tracking.

They coexist, and none replaces the other. Use Project Manager to create and manage tasks; reach for Dataview only for read-only aggregation across projects; keep notion-bases for general relational databases that are not project schedules.

---

## 11. LIMITS

- The AI verifies files and resolves id references by hand. The plugin renders in-app, so visual confirmation of the Table, Gantt or Kanban needs the user to reload.
- The `pm-task` field set, the status/priority default ids, the dependency and hierarchy encoding, the time-tracking shape and the three view identifiers are confirmed against the installed build (v1.8.0). The non-scalar `customFields` value encoding and the project-side custom-field definition shape are `VERIFY` (`data-model.md` §8).
- Never claim a task rendered in a view — file-layer checks prove the frontmatter, not the pixels.
- Never fabricate an id reference. If a `dependencies`, `parentId` or `subtaskIds` id resolves to no task on disk, report the broken edge rather than assuming it renders.
