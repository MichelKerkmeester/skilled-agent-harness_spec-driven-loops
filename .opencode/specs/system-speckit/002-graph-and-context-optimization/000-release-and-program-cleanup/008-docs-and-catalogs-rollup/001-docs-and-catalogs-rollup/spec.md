---
title: "Feature Specification: Docs and Catalogs Rollup"
description: "Roll up the umbrella docs and catalog indexes so they reflect the capabilities spec 026 actually shipped. Gap-analysis driven, sync not aspiration."
trigger_phrases:
  - "docs and catalogs rollup"
  - "umbrella docs rollup 026"
  - "feature catalog rollup"
  - "readme capability sync"
  - "026 docs sync"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-docs-and-catalogs-rollup"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Umbrella docs rollup complete"
    next_safe_action: "None, packet complete"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/mcp_server/README.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "docs-rollup-2026-06-01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope generalized from the 012 sub-campaign to the whole 026 program"
      - "Method = gap analysis then surgical additions, not a rewrite (docs were already maintained)"
---
# Feature Specification: Docs and Catalogs Rollup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-04-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec 026 shipped capabilities across 8 tracks over months. The umbrella docs (root README, the system-spec-kit SKILL.md and README, the mcp_server README and INSTALL_GUIDE) and the catalog indexes (feature_catalog, manual_testing_playbook) needed to reflect what actually shipped, without drifting into claims for work that did not land.

### Purpose

Bring the umbrella docs and catalog indexes into sync with the capabilities 026 shipped, adding only what is genuinely missing and grounded in the changelogs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update the 7 umbrella docs and catalog indexes to surface genuinely-missing 026 capabilities.
- Ground every addition in a shipped changelog (sync, not aspiration).

### Out of Scope

- Code changes. This packet is documentation only.
- Code-graph and skill-advisor handler docs. Those subsystems were extracted to the system-code-graph and system-skill-advisor skills during 026, so their handler docs live in those skills, not here.
- Per-packet feature_catalog and manual_testing_playbook entries authored inline by their own packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Surface daemon reliability, index-scan, embedding-reconcile; tool counts |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Index-scan + reconcile memory notes, worktree and session-cleanup tooling |
| `.opencode/skills/system-spec-kit/README.md` | Modify | Reconcile tool, index-scan behavior, RSS flag, corrupt-health troubleshooting |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modify | Reconcile entrypoint, WAL durability and boot integrity guardrails |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modify | Reconcile and health tools, non-destructive build, corrupt-health row |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modify | Reconcile entry, index-scan and health notes, session and worktree tooling |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Reconcile scenario, extended index-scan scenario contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each umbrella doc reflects genuinely-missing 026 capabilities | Gap analysis run, additions applied where missing |
| REQ-002 | No factual claim unsupported by what 026 shipped | Every addition cites a shipped changelog |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No broken links in updated docs | All referenced paths verified to exist |
| REQ-004 | Catalog top-level indexes reflect new entries | feature_catalog and playbook updated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 7 umbrella docs surface the four final-sprint 026 capabilities (embedding reconcile, index-scan self-maintenance, daemon reliability, session and worktree tooling) that were not yet reflected.
- **SC-002**: Zero existing content removed (surgical additions only) and zero new HVR violations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Degrading already-maintained docs by rewriting | High | Gap analysis first, surgical additions only, content-preservation guard |
| Risk | Documenting moved capabilities in the wrong skill | Medium | Code-graph and advisor handlers explicitly left to their extracted skills |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Additions match each doc's existing format and voice so the docs stay coherent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A capability already covered by a doc: skip, do not duplicate.
- A capability that moved to an extracted skill: do not add here, note as moot.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 7 docs, additive only |
| Risk | 10/25 | Core docs, mitigated by gap-first + guard |
| Research | 8/20 | Gap analysis against changelogs |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
