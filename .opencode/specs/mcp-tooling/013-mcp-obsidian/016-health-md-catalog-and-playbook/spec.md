---
title: "Feature Specification: Phase 16 — health-md catalog and playbook update"
description: "Update the feature-catalog card and OBS-014 playbook scenario to the researched health-viz contract, mock-fallback guard, and authentic-source verification."
trigger_phrases:
  - "health-md playbook update"
  - "OBS-014 rework"
  - "health-md feature catalog"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/016-health-md-catalog-and-playbook"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 16 spec"
    next_safe_action: "Rework the OBS-014 scenario and catalog card"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/016-health-md-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 16 — health-md catalog and playbook update

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `015-health-md-fixtures-and-blocks` |
| **Successor** | `017-health-md-live-validation-closeout` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode's health-md playbook scenario (OBS-014) and feature-catalog card were authored before the deep research and carry the same defects: the scenario uses the invented `health-md` fence with `type: chart`/`metric`/`dateRange` keys, and its verification would pass against the plugin's bundled mock data — proving nothing about real exports. The catalog card repeats the Apple-only framing.

### Purpose
Rework OBS-014 to the researched contract: `health-viz` fence blocks, authentic-source-file verification (mock-fallback guard), and schema-valid fixture use; rework the catalog card to the Apple/Android model and narrowed write authority. The scenario must FAIL when only mock data would render.

**End goal:** OBS-014 is executable, honest, and would catch the exact defects the research found; the catalog card matches the remediated references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `manual-testing-playbook/plugin-tie-ins/health-md-data.md` (OBS-014): `health-viz` blocks, throwaway fixture use (Phase 15 asset), authentic-source verification step (identify the actual data folder + at least one authentic file; mock-fallback check must FAIL the scenario), cleanup.
- Update `feature-catalog/plugins/health-md.md`: researched render contract, Apple/Android model, mock-fallback warning, asset pointers.
- Update playbook + catalog indexes if counts/descriptions change.
- Update `changelog/v1.4.0.0.md` if not yet covering the scenario rework (fold into the Phase 15 entry or extend it).

### Out of Scope
- Reference docs (Phase 14) and assets (Phase 15).
- Live execution of OBS-014 (Phase 17).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-obsidian/manual-testing-playbook/plugin-tie-ins/health-md-data.md` | Rewrite | Research-conformant OBS-014 |
| `mcp-obsidian/feature-catalog/plugins/health-md.md` | Modify | Researched contract + platform model |
| `mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modify | Scenario description if changed |
| `mcp-obsidian/changelog/v1.4.0.0.md` | Modify | Fold in scenario/card rework |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OBS-014 uses the researched render contract | Zero `health-md` fences, `type: chart`, `metric:`, or `dateRange` in the scenario; blocks use `health-viz` + registered renderers |
| REQ-002 | Mock-fallback guard present | Scenario includes a step that must identify the actual selected data folder and an authentic source file; a run that only proves mock-data rendering is graded FAIL |
| REQ-003 | Scenario uses the Phase 15 fixture correctly | Throwaway fixture written only to a `_pbtest-` path; never into the real data folder; cleanup step present |
| REQ-004 | Catalog card matches the remediated docs | Card reflects `health-viz`, Apple/Android model, mock-fallback warning, and points to the new assets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: OBS-014's grading table distinguishes PASS (authentic file verified) from FAIL (mock-only or invented-block).
- **SC-002**: Grep shows no banned fence/keys in the scenario or card.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 15 fixture | Scenario references a not-yet-written asset | Phases ship in order; verify pointer after Phase 15 |
| Risk | Scenario too strict for real vaults | Unrunnable | Mock-fallback guard is the POINT — an empty-vault run must FAIL until authentic data exists (documented as expected) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
