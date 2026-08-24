---
title: "Tasks: Phase 011 — Refresh the Notion→Obsidian migration playbook"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 migration playbook refresh tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/011-migration-playbook-refresh"
    last_updated_at: "2026-08-23T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Refreshed migration playbook with 006 plugin research"
    next_safe_action: "None — parent phase-map refresh is the orchestrator's step"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-011-migration-playbook-refresh"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 011 — Refresh the Notion→Obsidian migration playbook

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

- [x] T001 Read the corrected 006 plugin reference docs as source of truth [20m]
  - **Evidence**: notion-bases `data-model.md` (view-config keys §6–§7, relation/rollup/lookup keys §2–§5), `workflows.md` (calendar recipe §6a–§6b), `notion-bases.md`; meta-bind `meta-bind.md`/`workflows.md`/`data-model.md` (buttons, `INPUT[datePicker]`, JS Engine); dataview `data-model.md` (expanded API) all read before authoring; no capability re-decided.
- [x] T002 Read both migration playbook docs and confirm the baseline [10m]
  - **Evidence**: `notion-migration.md` §4/§7/§8 and `migration-inventory.md` §2 located; both docs report `validate_document.py` `Total issues: 0` before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### notion-migration.md (write side)
- [x] T010 Rename §4 and add the view-recovery subsection (`references/notion-migration.md`) [25m]
  - **Evidence**: §4 heading → `RELATIONS, ROLLUPS, FORMULAS, VIEWS & INTERACTIVE ELEMENTS — RECOVERY`; view-recovery table maps calendar (`calendarDateField`/`calendarViewMode`), timeline (`timelineStartField`/`timelineEndField`/`timelineGroupByField`), board (`groupByColumnId`/`boardColumnOrder`/`boardColumnLimits`), gallery (`galleryCoverField`/`galleryCardSize`), chart (`chartType`/`chartXAxis`/`chartYAxis`); points to the calendar recipe in `notion-bases/workflows.md`; gives the Core-Bases/Dataview `TABLE`/`LIST`/`CALENDAR` fallback and the 7-of-10 parity note (Form/Map/Dashboard lost). Keys grounded in notion-bases `data-model.md` §6–§7. `validate_document.py` = 0 issues.
- [x] T011 Add the interactive-element recovery subsection (`references/notion-migration.md`) [15m]
  - **Evidence**: table maps Notion buttons → Meta Bind `meta-bind-button`/`js` action; date widgets → `INPUT[datePicker:<key>]`; live timers → `updateMetadata` `evaluate: true` `value: "new Date().toISOString()"` or a JS Engine block; inline edit panels → `INPUT[…]` fields. Framed as reconstruction; parity-honesty note preserved (no `now()`, needs JS Engine + JS enabled). Grounded in meta-bind `data-model.md` §5 / `workflows.md` §2–§5. `validate_document.py` = 0 issues.
- [x] T012 Add notion-bases + meta-bind to §7 sibling references and §8 RELATED RESOURCES (`references/notion-migration.md`) [10m]
  - **Evidence**: §7 table and §8 bullets now list `references/plugins/notion-bases/notion-bases.md` (primary DB-replacement, calendar recipe) and `references/plugins/meta-bind/meta-bind.md` (interactive-element reconstruction); the existing Dataview entry kept. `validate_document.py` = 0 issues.

### migration-inventory.md (read side)
- [x] T020 Add the recovery-routing map to §2 (`../../mcp-notion/references/migration-inventory.md`) [15m]
  - **Evidence**: a `Recovery routing` subsection after the 7-step procedure maps relations/rollups → Notion Bases (Dataview supplement), saved views → Notion Bases view configs, calendar → the calendar recipe, interactive elements → Meta Bind + JS Engine, formulas → Bases formulas / hand-translate, comments → `[!comment]` callouts; each row points to `notion-migration.md` §4/§5 and the plugin refs rather than duplicating the recipe. No section renumbering; no broken `(section N)` refs. `validate_document.py` = 0 issues.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 `validate_document.py` on both edited docs — 0 issues [5m]
  - **Evidence**: `notion-migration.md` and `migration-inventory.md` each report `Total issues: 0` (`--type reference`).
- [x] T031 Author this phase package; run `generate-description.js` + `backfill-graph-metadata.js` [15m]
  - **Evidence**: this folder authored; both generation scripts run on the folder (2-arg form: folder + repo root, then backfill).
- [x] T032 `validate.sh <this-folder> --strict` = Errors:0 [5m]
  - **Evidence**: recorded in `implementation-summary.md` Verification.
- [x] T033 Confirm `git status` scoped to the allowed surfaces only [5m]
  - **Evidence**: writes limited to `notion-migration.md`, `migration-inventory.md`, and this phase folder; phase 010, the parent packet, the deep-loop runtime, and `compiled-routing` untouched; no vault/`.canvas`/token read.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `notion-migration.md` §4 covers view recovery and interactive-element recovery, grounded in the plugin refs
- [x] `notion-migration.md` §7/§8 list the notion-bases and meta-bind trees, Dataview kept
- [x] `migration-inventory.md` carries a recovery-routing map that routes rather than duplicates
- [x] Both edited docs pass `validate_document.py` (0 issues)
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../010-plugin-doc-recs-followup/`
- **Next phase**: None
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
