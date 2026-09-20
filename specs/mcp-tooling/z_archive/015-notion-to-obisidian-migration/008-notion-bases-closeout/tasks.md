---
title: "Tasks: Phase 008 — Notion Bases consolidation and calendar recipe"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 notion bases consolidation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/008-notion-bases-closeout"
    last_updated_at: "2026-08-22T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored notion-bases calendar recipe and recorded three prior-phase items"
    next_safe_action: "Complete and closed; no further build work in this phase"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-008-notion-bases-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 008 — Notion Bases consolidation and calendar recipe

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the full notion-bases reference tree to find existing calendar coverage [20m]
  - **Evidence**: `notion-bases.md`, `data-model.md`, `workflows.md`, `troubleshooting.md` read; existing calendar coverage located at `workflows.md` §6a (base view) and `data-model.md` §6 (view type) / §7 (`calendarViewMode` in the ViewConfig surface). The new §6b builds on §6a rather than restating it.
- [x] T002 Confirm the installed `notion-bases` manifest/version in the vault [5m]
  - **Evidence**: `.obsidian/plugins/notion-bases/manifest.json` → `id: notion-bases`, `version: 1.12.0` — matches the version pin the reference set documents.
- [x] T003 Verify the calendar-view keys against the installed `main.js` [20m]
  - **Evidence**: `calendarDateField` present (10 occ), read as `c.calendarDateField` and matched against `d.schema.find(S=>S.id===...)` filtered to `type==="date"` columns; `calendarViewMode` present (3 occ), default `c.calendarViewMode ?? "month"`, in-pane toggle mapping `S==="month"?…:…week` so the confirmed values are `month`/`week`; `"calendar"` view type present (4 occ); `notion-bases` marker present (7 occ). No other `calendar*` camelCase key exists in the bundle, so a start/end event-span field is UNCONFIRMED and was not documented as a key.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Build item — the Notion Bases calendar recipe

- [x] T010 Author `workflows.md` §6b: Calendar view + `calendarViewMode` month/week toggle, layered on §6a [30m]
  - **Evidence**: §6b added after §6a with a "what each layer contributes" table and Step 1 extending the §6a view with `calendarViewMode: month`; documents `calendarDateField` must name a `type: date` column and `calendarViewMode` accepts `month` (default) / `week`; states no day/agenda mode and no confirmed event-span field (UNCONFIRMED), directing spans to a single dated note.
- [x] T011 Add the Meta Bind quick-date-entry step (Step 2) [10m]
  - **Evidence**: `INPUT[datePicker:dueDate]` widget bound to the same date key the calendar keys on, cross-referencing `../meta-bind/workflows.md` §3 (owner of the widget shape) and §2 (timer `startTime` as an alternate calendar field); the meta-bind docs are pointed to read-only, never edited.
- [x] T012 Add the optional Dataview agenda supplement (Step 3) [10m]
  - **Evidence**: a read-only `dataview` `TABLE … WHERE dueDate >= date(today) SORT dueDate ASC` agenda kept in a separate note/pane, cross-referencing `../dataview/workflows.md` §2 and `../dataview/data-model.md`; framed as a supplement per §7 and the guardrails, never folded into `_database.md` or edited into the dataview docs.
- [x] T013 Add the `calendar_recipe_wired` checkpoint to the §8 verifying table [5m]
  - **Evidence**: new §8 row mirrors §6a's `calendar_view_valid` pattern; asserts `notion-bases: true` + a `calendar` view on an existing `type: date` column, `calendarViewMode` (if set) is `month`/`week`, the Meta Bind `datePicker` binds the same key, and any Dataview agenda is a hand-resolved read-only block outside `_database.md`.
- [x] T014 Comment-hygiene pass on the authored fences [5m]
  - **Evidence**: the YAML/markdown/Dataview fences carry only durable WHY (e.g. `# a type:date column id — the field the grid keys on`); no spec path, phase number, or rec/REQ/CHK id appears in any fence.

### Consolidation ledger — record only, do NOT re-perform

- [x] T020 Record Project Manager deprecation as ALREADY DONE [5m]
  - **Evidence**: recorded in `spec.md` §9 and `implementation-summary.md` — files + router stripped and consolidated onto Notion Bases + Meta Bind + JS Engine in a prior plugin-management commit; captured in `references/plugins/installed-plugins.md` and `changelog/v0.21.0.0.md`. Not re-performed here.
- [x] T021 Record Meta Bind reference authoring as ALREADY DONE (phase 009) [5m]
  - **Evidence**: recorded — the `references/plugins/meta-bind/` tree was authored in phase 009. Not re-performed here.
- [x] T022 Record roster sync as ALREADY DONE (phase 005) [5m]
  - **Evidence**: recorded — the `installed-plugins.md` roster was synced in phase 005. Not re-performed here.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 `validate_document.py --type reference` on `workflows.md` — 0 issues [5m]
  - **Evidence**: `Total issues: 0`, exit 0.
- [x] T031 Author this phase package (spec/plan/tasks/checklist/implementation-summary) to the actual result [30m]
  - **Evidence**: this folder authored; `generate-description.js` + `backfill-graph-metadata.js` run so `description.json`/`graph-metadata.json` validate.
- [x] T032 `validate.sh <this-folder> --strict` = Errors:0 [5m]
  - **Evidence**: recorded in `implementation-summary.md` Verification.
- [x] T033 Confirm `git status` scoped to `notion-bases/workflows.md` + this phase folder only [5m]
  - **Evidence**: recorded in `implementation-summary.md`; no dataview/advanced-canvas/claudian/meta-bind doc, parent file, deep-loop/runtime, or vault path touched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The §6b calendar recipe is authored, building on §6a without duplicating it
- [x] Every documented calendar key confirmed against `main.js`; the absent event-span field marked UNCONFIRMED
- [x] `validate_document.py --type reference` = 0 issues on `workflows.md`
- [x] All four consolidation items recorded honestly (three prior-phase completions, one newly built)
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../007-excalidraw-deprecation/`
- **Next phase**: None — closes the Notion Bases consolidation the 007 deprecation deferred
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
</content>
