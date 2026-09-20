---
title: "Phase 011: Refresh the Notion→Obsidian migration playbook with the 006 plugin research"
description: "Refresh the two migration playbook reference docs — the write-side reconstruction method (mcp-obsidian notion-migration.md) and the read-side inventory (mcp-notion migration-inventory.md) — so they use the plugin knowledge the 006 deep-research pass produced: the Notion Bases calendar recipe, the corrected view/relation/rollup config keys, Meta Bind + JS Engine interactive-element reconstruction, and the expanded Dataview API. Add view-recovery and interactive-elements recovery to notion-migration.md §4, wire notion-bases and meta-bind into its sibling references, and add a recovery-routing map to the inventory doc."
trigger_phrases:
  - "015 migration playbook refresh"
  - "notion migration view recovery"
  - "notion migration interactive elements meta bind"
  - "migration inventory recovery routing"
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
    key_files:
      - "../010-plugin-doc-recs-followup/spec.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-011-migration-playbook-refresh"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 011: Refresh the Notion→Obsidian migration playbook with the 006 plugin research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | Migration-playbook refresh after the 006 plugin deep-research |
| **Predecessor** | `010-plugin-doc-recs-followup` |
| **Successor** | `None` |
| **Handoff Criteria** | Both migration playbook docs use the 006 plugin knowledge: `notion-migration.md` §4 covers view recovery (Notion Bases view configs + calendar recipe) and interactive-element recovery (Meta Bind + JS Engine), its sibling references and RELATED RESOURCES list the notion-bases and meta-bind trees, and `migration-inventory.md` carries a recovery-routing map from each inventoried feature to its Obsidian plugin. Every capability cited is grounded in the plugin reference docs; both docs pass `validate_document.py` with 0 issues; and this folder passes `validate.sh --strict` with Errors:0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

The 006 plugin deep-research pass corrected and expanded the plugin reference docs under `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/`: it verified the real Notion Bases view-config keys (calendar, timeline, board, gallery, chart) and relation/rollup/lookup keys against the installed v1.12.0 build, added a full calendar recipe, authored a new Meta Bind reference tree (buttons, date pickers, the JS Engine companion), and expanded the DataviewJS API. Those plugin refs are now the source of truth.

The two migration playbook docs did not yet use that knowledge. The write-side method (`notion-migration.md`) recovered relations, rollups, formulas, and comments, but had no view-recovery path and no interactive-element path, even though the importer drops secondary views and interactive controls and `migration-inventory.md` step 4 already inventories dropped views. The read-side inventory (`migration-inventory.md`) inventoried features but never flagged which Obsidian plugin recovers each one.

This phase refreshes both docs from the corrected plugin refs, and documents exactly what changed in each. The vault stays read-only; the plugin reference docs (already correct) are not edited; phase 010, the parent packet, and the concurrent deep-loop lanes are never touched.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The migration playbook lagged the 006 plugin research. `notion-migration.md` §4 recovered relations, rollups, and formulas but had no view recovery and no interactive-element recovery, so an operator reading the write-side method had no path for the secondary views and buttons the importer drops. Its sibling references and RELATED RESOURCES omitted the primary DB-replacement tree (notion-bases) and the new interactive-element tree (meta-bind). And `migration-inventory.md` inventoried features without mapping any of them to the Obsidian plugin that recovers them.

### Purpose
Refresh both playbook docs from the corrected plugin refs. In `notion-migration.md`: add a view-recovery subsection mapping each dropped Notion view to its Notion Bases view config (and the calendar recipe), add an interactive-element recovery subsection mapping Notion buttons/date widgets to Meta Bind + JS Engine, rename §4 to include views and interactive elements, and add the notion-bases and meta-bind trees to the sibling references and RELATED RESOURCES. In `migration-inventory.md`: add a recovery-routing map from each inventoried feature to its Obsidian recovery plugin. Ground every capability in the plugin reference docs and keep the "do not overstate parity" honesty discipline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **notion-migration.md (write-side)**: rename §4 to `RELATIONS, ROLLUPS, FORMULAS, VIEWS & INTERACTIVE ELEMENTS — RECOVERY`; add a **view-recovery** subsection (Notion secondary views → Notion Bases view configs: calendar via the calendar recipe, timeline `timelineStartField`/`timelineEndField`/`timelineGroupByField`, board `groupByColumnId`/`boardColumnOrder`/`boardColumnLimits`, gallery `galleryCoverField`/`galleryCardSize`, chart `chartType`/`chartXAxis`/`chartYAxis`, with a Core-Bases / Dataview `TABLE`/`LIST`/`CALENDAR` fallback and an honest 7-of-10 parity note); add an **interactive-elements** subsection (Notion buttons / date widgets → Meta Bind `js` buttons + `INPUT[datePicker]` and JS Engine frontmatter writes / live timers).
- **notion-migration.md §7 / §8**: add `references/plugins/notion-bases/notion-bases.md` and `references/plugins/meta-bind/meta-bind.md` to the sibling references and RELATED RESOURCES, keeping the Dataview entry.
- **migration-inventory.md (read-side)**: add a concise recovery-routing map (inventoried feature → Obsidian recovery plugin), pointing to `notion-migration.md` §4 and the plugin refs without duplicating the recipes.
- This new phase folder's documentation.

### Out of Scope
- **The plugin reference docs** — `references/plugins/notion-bases/*`, `references/plugins/meta-bind/*`, and `references/plugins/dataview/*` are already corrected by the 006 research; this phase reads them as source of truth and does not edit them.
- **Inventing plugin behavior** — every cited capability is grounded in the plugin refs; anything not documented there is stated as such, not asserted.
- **Any write to the iCloud-synced vault** — the vault is read-only; no plugin file, `.canvas`, or `.env`/token is read or written.
- **Phase 010** — its files are left exactly as-is.
- **The deep-loop runtime, `system-deep-loop`, and `compiled-routing`** — a concurrent session owns these; they are left untouched.
- **The parent packet's `spec.md` / `graph-metadata.json`** — the parent phase-map refresh is the orchestrator's step.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md` | Edit | §4 heading rename; view-recovery + interactive-element recovery subsections; notion-bases + meta-bind added to §7 sibling references and §8 RELATED RESOURCES |
| `.opencode/skills/mcp-tooling/mcp-notion/references/migration-inventory.md` | Edit | Recovery-routing map (inventoried feature → Obsidian recovery plugin) added to §2 |
| `011-migration-playbook-refresh/` | Add | This phase folder's spec/plan/tasks/checklist/implementation-summary + generated metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `notion-migration.md` §4 recovers dropped views | A view-recovery subsection maps calendar/timeline/board/gallery/chart to the confirmed Notion Bases view-config keys, points to the calendar recipe, gives the Core-Bases/Dataview fallback, and names Form/Map/Dashboard as lost |
| REQ-002 | `notion-migration.md` §4 recovers interactive elements | An interactive-element subsection maps Notion buttons/date widgets/live timers to Meta Bind (`meta-bind-button`, `js`, `INPUT[datePicker]`) + JS Engine, framed as reconstruction with the parity honesty preserved |
| REQ-003 | The sibling references point to the new plugin trees | `notion-migration.md` §7 and §8 list `notion-bases/notion-bases.md` and `meta-bind/meta-bind.md`, keeping the Dataview entry |
| REQ-004 | `migration-inventory.md` routes each inventoried feature to its recovery plugin | A recovery-routing map covers relations/rollups, saved views, calendar, interactive elements, formulas, and comments, pointing to `notion-migration.md` §4 and the plugin refs without duplicating recipes |
| REQ-005 | Every cited capability is grounded in the plugin refs; the vault is read-only | No invented plugin key or behavior; nothing outside the two named docs and this folder is written; no vault/`.canvas`/token read |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Both edited docs pass the skill-document validator | `validate_document.py` = 0 issues on `notion-migration.md` and `migration-inventory.md` |
| REQ-007 | This phase folder passes strict validation | `validate.sh <this-folder> --strict` = Errors:0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `notion-migration.md` §4 carries view recovery (Notion Bases view configs + calendar recipe + honest fallback/parity) and interactive-element recovery (Meta Bind + JS Engine); §7 and §8 list the notion-bases and meta-bind trees.
- **SC-002**: `migration-inventory.md` carries a recovery-routing map that flags every dropped/at-risk feature's Obsidian recovery plugin and routes to the recipes rather than duplicating them.
- **SC-003**: Both edited docs report `Total issues: 0` under `validate_document.py`, and `validate.sh <this-folder> --strict` = Errors:0, with no write outside the authorized surfaces.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inventing a Notion Bases view-config key or a Meta Bind action | High | Author only keys confirmed in the plugin refs (`data-model.md` §6–§7, meta-bind `data-model.md` §5) |
| Risk | Overstating parity (claiming a Dataview fallback is a faithful conversion) | High | Keep the "do not overstate parity" discipline; name the 7-of-10 view boundary and Form/Map/Dashboard as lost |
| Risk | Editing an already-correct plugin reference doc | Medium | Scope-locked to the two migration playbook docs; plugin refs are read-only source of truth |
| Risk | Writing outside the allowed surface (deep-loop runtime, phase 010, parent) | High | Scope-locked; the concurrent lanes and parent files are left as-is |
| Dependency | The corrected plugin reference docs (notion-bases, meta-bind, dataview) | Source of truth | Read in full before authoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: Every capability cited traces to a plugin reference doc — the Notion Bases view/relation/rollup keys to `notion-bases/data-model.md`, the calendar recipe to `notion-bases/workflows.md`, the interactive widgets to `meta-bind/`, the Dataview surface to `dataview/data-model.md`. Anything undocumented is stated as such.

### Consistency
- **NFR-C02**: The two playbook docs stay coherent — the write-side view/interactive recovery and the read-side recovery-routing map name the same plugins and the same calendar recipe, and both point to the same plugin refs.

### Safety
- **NFR-S01**: Comment hygiene — no spec paths, phase numbers, rec-ids, or ADR/REQ/CHK ids inside any authored code fence; only durable WHY. (The edits add tables and prose; no code fences were added to the shipped docs.)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Content Boundaries
- **Parity honesty preserved**: the existing "do not overstate parity" formula note stays; the new view and interactive subsections carry their own parity-honesty notes rather than claiming faithful conversion of a fallback.
- **Views with no equivalent**: Form, Map, and Dashboard are documented as lost, not as a pending recipe, matching the plugin refs' 7-of-10 boundary.

### Verification Boundaries
- **Grounded-or-stated**: a capability absent from the plugin refs is not asserted; the multi-day calendar-span case, for instance, is left to the plugin refs' UNCONFIRMED framing rather than restated as fact here.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Resolved — view-recovery placement:** added as a subsection of `notion-migration.md` §4 (with a renamed heading) rather than a new top-level section, so view recovery reads next to the relation/rollup recovery it extends and the §5 comment-reconstruction numbering is undisturbed.
- **Resolved — inventory routing placement:** added as a subsection of `migration-inventory.md` §2 (right after the 7-step procedure) so the routing map reads as an extension of the inventory it summarizes, with no section renumbering and no broken internal `(section N)` references.
- **Resolved — calendar recipe ownership:** the write-side doc and the inventory doc both point to `references/plugins/notion-bases/workflows.md` for the calendar recipe rather than duplicating it, keeping the recipe single-sourced in the plugin refs.
- **Left to the orchestrator:** the parent packet phase-map refresh after this phase lands.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: `../010-plugin-doc-recs-followup/`
<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->
