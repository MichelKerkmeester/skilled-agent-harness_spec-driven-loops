---
title: "Implementation Plan — Phase 16 — health-md catalog and playbook update"
description: "Plan for reworking OBS-014 and the health-md catalog card to the researched contract."
trigger_phrases:
  - "phase 16 plan"
  - "OBS-014 rework plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/016-health-md-catalog-and-playbook"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 16 plan"
    next_safe_action: "Execute T001-T004"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan — Phase 16 — health-md catalog and playbook update

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rework OBS-014 (health-md data round-trip) and the health-md catalog card so they implement the research's render-contract + mock-fallback findings. The scenario must grade FAIL when only bundled mock data would render, and PASS only when an authentic source file is verified. Reversible: git-revert the scenario/card files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Fence hygiene | No `health-md` fence / `type: chart` / `metric:` / `dateRange` in scenario or card | grep -r |
| Mock guard | Scenario contains an authentic-source verification step + FAIL-on-mock grading | read |
| Fixture safety | Throwaway fixture path only (`_pbtest-`), cleanup step present | read |
| Indexes | Playbook + catalog indexes consistent | read |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two authored files + two index/changelog touches:

| File | Rework |
|------|--------|
| `plugin-tie-ins/health-md-data.md` | Replace invented blocks with `health-viz`; add mock-fallback detection step (empty data folder → bundled example data renders → NOT proof); grade accordingly |
| `feature-catalog/plugins/health-md.md` | Update overview + guardrails to the researched contract; point to Phase 15 assets |
| `manual-testing-playbook.md` / `changelog/v1.4.0.0.md` | Description/count/changelog consistency |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Extract scenario-relevant facts from research.md §3 (render grammar) + §7.2 (mock warning) |
| Implementation | Rewrite OBS-014; update card; indexes + changelog |
| Verification | Grep gates + read-through |

Sequenced in tasks.md (T001–T004).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Static verification only in this phase: grep gates, grading-table review, pointer checks to Phase 15 assets. Live execution happens in Phase 17.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Phase 15 fixture asset | Scenario pointer dangles | Verify after Phase 15 ships |
| Research renderer names | Block invalidity | Only registered renderers; recheck note |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout --` the scenario + card files; revert index/changelog edits. No other files touched.
<!-- /ANCHOR:rollback -->
