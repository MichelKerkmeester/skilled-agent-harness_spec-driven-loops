---
title: "Feature Specification: Phase 17 — health-md live validation and closeout"
description: "Execute the remediated OBS-014 live against a vault (including the mock-fallback trap), run packet validation, and close out phases 014-016."
trigger_phrases:
  - "health-md live validation"
  - "OBS-014 live run"
  - "health-md closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/017-health-md-live-validation-closeout"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 17 spec"
    next_safe_action: "Execute OBS-014 live and close out"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-health-md-live-validation-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 17 — health-md live validation and closeout

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
| **Predecessor** | `016-health-md-catalog-and-playbook` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 14-16 ship remediated docs, assets, and a scenario — but none of it has run against a real vault. The research's most important operational finding (the bundled mock-data fallback makes a rendered chart meaningless without authentic-source verification) is exactly the kind of defect that only a live run proves: in the vaults on this machine the default `Health/` folder is empty, so a chart would render from mock data. The remediated OBS-014 must be executed to prove the guard works, and the packet must close out cleanly.

### Purpose
Execute the remediated OBS-014 live (expecting a FAIL-until-authentic-data verdict on an empty vault, then a PASS with a throwaway authentic-shaped file in a `_pbtest-` folder + real folder identification), record evidence, run packet validation, and close out phases 014-016 with consistent statuses.

**End goal:** OBS-014 carries a live verdict with evidence; `validate.sh` passes on the new phases; the packet's phase map and summaries reflect completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Live execution of OBS-014 per the Phase 16 scenario: mock-fallback detection (empty data folder), throwaway fixture in a `_pbtest-` path, `health-viz` block placement, authentic-source verification, cleanup, verdict + evidence recorded in the scenario file.
- Re-run `validate.sh` on phases 014-017 (and the touched mode docs).
- Update implementation summaries for 014-017 + parent phase-map statuses.
- Note: no real health data is written; the throwaway fixture is the Phase 15 example asset.

### Out of Scope
- Writing real health data into any vault (user's data).
- The other plugin reference sets.
- Commit/push (operator-gated per packet handover; worktree discipline).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-obsidian/manual-testing-playbook/plugin-tie-ins/health-md-data.md` | Modify | Live verdict + evidence block |
| `014..016/implementation-summary.md` | Modify | Completion records |
| `017-health-md-live-validation-closeout/{plan,tasks,implementation-summary}.md` | Create | Phase record |
| `013-mcp-obsidian/spec.md` | Modify | Phase-map statuses |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OBS-014 executed live | Scenario file carries a verdict (PASS/FAIL/SKIP), the command transcript, and evidence; the mock-fallback guard was exercised (empty-folder case observed and correctly graded) |
| REQ-002 | Throwaway discipline | Only `_pbtest-` paths touched; fixture is the Phase 15 example asset (or a copy); cleanup executed; real data folder unmodified |
| REQ-003 | Validation clean | `validate.sh` on 014-017 reports 0 errors; metadata fingerprints refreshed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Closeout consistent | 014-017 implementation summaries written; parent phase map statuses updated; 012's superseded tasks noted as shipped via 014-017 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: OBS-014's live run demonstrates both halves of the guard: empty folder → not proof (correctly graded); authentic file identified → PASS.
- **SC-002**: No phase 014-017 validates with errors; the packet's phase map shows 014-017 completed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 14-16 shipped | Scenario/doc pointers dangle | Execute in order; verify pointers first |
| Risk | Vault app running while fixtures written | Obsidian cache/override behavior | File-layer only; no app reload claims; mock-fallback check reads the actual folder listing |
| Risk | Empty-vault run "fails" | Appears as a failed phase | The FAIL verdict IS the expected proof of the guard — documented in the scenario grading |
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
