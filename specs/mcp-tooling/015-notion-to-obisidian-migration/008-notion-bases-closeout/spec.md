---
title: "Phase 008: Notion Bases consolidation — record three completed items and build the calendar recipe"
description: "The consolidation phase phase 007 defers to. Its original four-item scope is Project Manager deprecation, Meta Bind reference authoring, roster sync, and the Notion Bases calendar recipe. Three were already completed in prior phases (005/009 and an earlier plugin-management commit); this phase newly builds the fourth — a Notion Bases Calendar-view recipe with Meta Bind quick date entry and an optional Dataview agenda — into the shipped mcp-obsidian notion-bases reference docs, every calendar key confirmed against the installed plugin main.js."
trigger_phrases:
  - "015 notion bases consolidation"
  - "notion bases calendar recipe"
  - "mcp-obsidian calendar workflow"
  - "notion-style calendar obsidian recipe"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/008-notion-bases-closeout"
    last_updated_at: "2026-08-23T03:52:43Z"
    last_updated_by: "claude"
    recent_action: "Authored notion-bases calendar recipe and recorded three prior-phase items"
    next_safe_action: "Complete and closed; no further build work in this phase"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "../../../../.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-008-notion-bases-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 008: Notion Bases consolidation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | Notion Bases consolidation follow-up to phase 007 |
| **Predecessor** | `007-excalidraw-deprecation` |
| **Successor** | None for this phase's own scope (closes the Notion Bases consolidation the 007 deprecation deferred) — the packet's next sequential phase is `009-apply-plugin-doc-recs` |
| **Handoff Criteria** | The Notion Bases calendar recipe is authored into the shipped `mcp-obsidian` notion-bases docs, every calendar view key confirmed against the installed plugin `main.js` before it is documented, the changed shipped doc passes `validate_document.py` with 0 issues, and the three already-completed consolidation items (Project Manager deprecation, Meta Bind reference authoring, roster sync) are recorded here honestly without being re-performed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 007 (`007-excalidraw-deprecation`) removed the Excalidraw footprint and, in both its `Phase Context` and `Out of Scope` sections, deferred a four-item **Notion Bases consolidation** to a sibling phase named `008-notion-bases-closeout`: Project Manager deprecation, Meta Bind reference authoring, roster sync, and the Notion Bases calendar recipe. This is that phase — building it makes 007's prose references resolve to a real folder.

Three of the four items were already completed in earlier phases before this folder existed, so this phase does **not** re-perform them; it records them for an honest consolidation ledger. The single item with no prior coverage — the **Notion Bases calendar recipe** — is built here as the only shipped-doc change this phase authors.

**Mandatory main.js verification (done before documenting any calendar key):** every calendar-view key the recipe documents was confirmed present in the installed `notion-bases` plugin bundle (`main.js`, v1.12.0) in the operator's vault, read-only. `calendarDateField` (10 occurrences) and `calendarViewMode` (3 occurrences, default `month`, toggle exposing `month`/`week`) are confirmed; the `calendar` view type and the required `notion-bases: true` marker are confirmed; no other `calendar*` config key exists in the bundle, so a start/end event-span field is marked UNCONFIRMED rather than asserted. The vault was read-only throughout — only the plugin `main.js`/`manifest.json` were read.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 007 deferred four consolidation items to `008-notion-bases-closeout`, but that folder was never built, so 007's prose pointed at a phantom sibling and one real content gap stayed open: the shipped `mcp-obsidian` notion-bases docs had a basic calendar view (`workflows.md` §6a) but no end-to-end **Notion-style calendar recipe** — no quick date entry, no month/week layout guidance, and no agenda companion. An AI asked to reproduce Notion's calendar in Obsidian had only the bare view block to work from.

### Purpose
Build the missing Notion Bases calendar recipe into the shipped notion-bases docs — Calendar view plus Meta Bind quick date entry plus an optional Dataview agenda, every calendar key verified against the installed plugin `main.js` — and record all four consolidation items honestly so the 007 deferral is closed with a truthful ledger rather than false coverage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author a new Notion Bases **calendar recipe** (`workflows.md` §6b) into the shipped notion-bases reference docs: Calendar view with the `calendarViewMode` month/week toggle, Meta Bind `datePicker` quick date entry, and an optional read-only Dataview agenda supplement.
- Confirm every documented calendar-view key against the installed `notion-bases` `main.js` (v1.12.0) before writing it; mark any key that cannot be confirmed as UNCONFIRMED rather than asserting it.
- Reuse only the keys phase 009 corrected and confirmed (`calendarDateField`, not the wrong `date_field`); cross-check against `data-model.md` §7 advanced schema keys.
- Record — without re-performing — the three consolidation items already completed in prior phases (Project Manager deprecation, Meta Bind reference authoring, roster sync).
- This new phase folder's documentation.

### Out of Scope
- **Re-performing the three completed items.** Project Manager deprecation, Meta Bind reference authoring, and roster sync were shipped in earlier phases; this phase records them, it does not redo, re-delete, or re-author them.
- **Editing the dataview, advanced-canvas, claudian, or meta-bind shipped docs** — a separate phase owns those; the recipe only cross-references them read-only.
- **Duplicating the §6a base calendar view** — §6b builds on §6a as a prerequisite and adds only the quick-entry, view-mode, and agenda layers.
- **Any write to the iCloud-synced vault** — the plugin `main.js`/`manifest.json` were read only; no vault file was written, and no token or `.env` value was read.
- **Parent packet files** (`../spec.md`, `../graph-metadata.json`), the deep-loop runtime, and any concurrent-session lane.
- **A feature-catalog or manual-testing-playbook edit** — the catalog card already points to `workflows.md` (Recipes), which now contains §6b, so a dedicated pointer would duplicate the existing generic one; both were left untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md` | Edit | New §6b calendar recipe (Calendar view + `calendarViewMode` month/week + Meta Bind `datePicker` quick entry + optional Dataview agenda) and a matching `calendar_recipe_wired` checkpoint in §8 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Notion Bases calendar recipe is authored into the shipped notion-bases docs | `workflows.md` §6b exists with the Calendar-view, Meta Bind quick-entry, and Dataview-agenda layers, building on §6a without duplicating it |
| REQ-002 | Every documented calendar-view key is confirmed against the installed plugin `main.js` before it is written | `calendarDateField`, `calendarViewMode` (values `month`/`week`, default `month`), the `calendar` view type, and the `notion-bases: true` marker verified in `main.js` v1.12.0; the absent event-span field marked UNCONFIRMED |
| REQ-003 | The changed shipped doc passes the skill-document validator | `validate_document.py --type reference` = 0 issues on `workflows.md` |
| REQ-004 | No file outside the authorized surfaces is written; the vault is read-only | `git status` scoped to `notion-bases/workflows.md` and this phase folder; no vault write, no token/`.env` read; dataview/advanced-canvas/claudian/meta-bind docs, parent files, and concurrent-session lanes untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All four consolidation items are recorded honestly | `spec.md` and `implementation-summary.md` present Project Manager deprecation, Meta Bind reference authoring, and roster sync as ALREADY DONE in prior phases (with the phase/commit that shipped them), and the calendar recipe as newly built here — no item falsely claimed as newly performed |
| REQ-006 | The recipe reuses only confirmed keys and never reintroduces the wrong ones | No `date_field` (the key 009 corrected to `calendarDateField`); keys cross-checked against `data-model.md` §7 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `workflows.md` §6b calendar recipe exists and reports `Total issues: 0` under `validate_document.py --type reference`. **Met 2026-08-22.**
- **SC-002**: Every calendar-view key in the recipe traces to a confirmed `main.js` observation; the one absent event-span field is marked UNCONFIRMED, not asserted. **Met.**
- **SC-003**: `validate.sh <this-folder> --strict` = Errors:0, and `git status` shows only `notion-bases/workflows.md` and this phase folder changed. **Met.**
- **SC-004**: All four consolidation items are recorded truthfully — three as prior-phase completions, one as newly built. **Met.**
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Documenting a calendar key the plugin does not read (as 009 found for `date_field`) | High | Confirm every key against the installed `main.js` before writing it; mark anything unconfirmed rather than asserting it |
| Risk | Duplicating the §6a calendar coverage | Med | §6b is explicitly built on §6a as a prerequisite and adds only new layers (view mode, quick entry, agenda) |
| Risk | Falsely claiming the three completed items were performed here | Med | Record them as prior-phase completions with the phase/commit that shipped them; never re-perform |
| Risk | Editing the iCloud-synced personal vault | High | Read-only on the vault — only plugin `main.js`/`manifest.json` read; never `.env`/tokens; no vault write |
| Dependency | Installed `notion-bases` bundle (`main.js` v1.12.0) | Verification source | Readable; keys confirmed |
| Dependency | Phase 009's corrected keys + `data-model.md` §7 | Source of truth for key spellings | Complete and cross-checked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: No calendar-view key is documented without a confirming `main.js` observation; a key with no bundle evidence is marked UNCONFIRMED, not stated as fact.

### Consistency
- **NFR-C02**: The recipe's keys match `data-model.md` §6/§7 exactly (`calendarDateField`, `calendarViewMode`), and the new §6b checkpoint is mirrored into the §8 verifying table the way §6a's `calendar_view_valid` is.

### Safety
- **NFR-S01**: Comment hygiene — no spec paths, phase numbers, or rec/REQ/CHK ids appear inside any authored code fence; the YAML/markdown/Dataview fences carry only durable WHY.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Content Boundaries
- **§6a already claims a "Notion-style calendar"**: §6b differentiates by adding the interactive quick-entry (Meta Bind `datePicker`), the layout toggle (`calendarViewMode`), and the agenda companion (Dataview) — not by restating the base view block, which stays §6a's.
- **No multi-day event span**: the bundle exposes only `calendarDateField` and `calendarViewMode`; there is no confirmed start/end field, so a spanned event is documented as a single dated note and the span is marked UNCONFIRMED rather than modelled with an invented key.

### Verification Boundaries
- **Meta Bind and Dataview syntax is cross-referenced, not re-verified here**: the `INPUT[datePicker:...]` widget and the DQL agenda grammar are owned and confirmed by their own reference sets; this phase's `main.js` grounding is scoped to the notion-bases calendar keys it actually documents.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Consolidation ledger (recorded, not re-performed):**
  - *Project Manager deprecation* — ALREADY DONE in a prior plugin-management commit: the plugin's files and router wiring were stripped and it was consolidated onto Notion Bases + Meta Bind + JS Engine; recorded in `references/plugins/installed-plugins.md` and `changelog/v0.21.0.0.md`. 008 records it only.
  - *Meta Bind reference authoring* — ALREADY DONE in phase 009 (the `references/plugins/meta-bind/` tree). 008 records it only.
  - *Roster sync* — ALREADY DONE in phase 005 (the `installed-plugins.md` roster). 008 records it only.
  - *Notion Bases calendar recipe* — NEWLY BUILT here (`workflows.md` §6b).
- **Deferred by design (optional):** a dedicated feature-catalog/manual-testing pointer for the calendar recipe — the catalog card already points to `workflows.md` (Recipes), so a subsection-specific pointer would duplicate the generic one; left untouched.
- **Left for the operator:** 007's prose scope-descriptions naming `008-notion-bases-closeout` for the deferred work now resolve to this real folder; whether to further edit 007's prose is the operator's call and outside this packet's authorized write scope.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: `../007-excalidraw-deprecation/spec.md`
- **Shipped recipe**: `../../../../.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md` §6b
<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->
</content>
</invoke>
