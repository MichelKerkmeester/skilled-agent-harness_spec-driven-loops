---
title: "Verification Checklist: Spec Regrouping Renumber Reindex"
description: "Verification checklist for the spec regrouping, renumbering, reference update, and reindex migration."
trigger_phrases:
  - "verification"
  - "checklist"
  - "renumber specs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-speckit/028-memory-search-intelligence/000-release-cleanup/014-spec-regrouping-renumber-reindex"
    last_updated_at: "2026-06-30T11:15:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Recorded correction evidence"
    next_safe_action: "Retry reindex after daemon repair"
    blockers:
      - "memory_index_scan returns E040"
    key_files: []
    session_dedup:
      fingerprint: "sha256:57346e7a5084528ba8ad3b047a5d35fb27d50bb6491116901a730cae642cce5c"
      session_id: "spec-regrouping-renumber-reindex"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Spec Regrouping Renumber Reindex

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: `spec.md` created from Level 2 template and filled for the migration scope.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: `plan.md` documents inventory, rename, reference, reindex, and validate phases.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` names filesystem and Spec Kit Memory dependencies.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Migration command completes without unhandled errors. Evidence: migration script reported `renamedFolders: 135`, `totalFolders: 161`, and `editedFiles: 3446`; second reference pass reported `editedFiles: 2275` and `totalHits: 30357`; correction renamed active orchestration `150`-`156` to `117`-`123`.
- [x] CHK-011 [P0] Directory listings match expected final maps. Evidence: reads showed `design` as `001`-`008`, active orchestration as `117`-`123`, orchestration archive as `001`-`116`, active deep-loops as `029`-`032`, and deep-loops archive as `001`-`028`.
- [x] CHK-012 [P1] Reference replacement is scoped to affected roots. Evidence: replacement script walked only `.opencode/specs/design`, `.opencode/specs/skilled-agent-orchestration`, `.opencode/specs/deep-loops`, and this phase folder.
- [x] CHK-013 [P1] No delete operations are used for spec packets. Evidence: migration used rename operations; no packet delete command was run.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met. Blocked: reindex did not complete.
- [x] CHK-021 [P0] Manual directory verification complete. Evidence: post-migration directory reads matched expected numbering.
- [x] CHK-022 [P1] Stale current-path search completed. Evidence: exact old active orchestration folder names returned no matches under `specs`.
- [x] CHK-023 [P1] Reindex result recorded. Evidence: MCP scans timed out; CLI scan returned `E040`; CLI health returned `backend unavailable: timeout`, exit code `75`.
- [x] CHK-024 [P1] Missing root metadata JSON files added. Evidence: reads showed `specs/design` and `specs/deep-loops` each contain `description.json` and `graph-metadata.json`.
- [x] CHK-025 [P1] Root orchestration graph child list points to existing paths. Evidence: JSON check reported `children_ids=123`, `missing=0`, and `last_active_child_id=skilled-agent-orchestration/123-agent-loops-improved`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Migration map recorded in implementation evidence. Evidence: `implementation-summary.md` records final root actions and counts.
- [x] CHK-FIX-002 [P0] Same-class spec-root inventory completed. Evidence: target roots were inventoried by parallel agents and direct directory reads.
- [x] CHK-FIX-003 [P0] Consumers of changed paths under affected roots updated or preserved intentionally. Evidence: exact-path replacement passes covered generated iteration/log files inside affected roots, and stale active orchestration `150`-`156` names no longer match under `specs`.
- [x] CHK-FIX-004 [P0] Rename collision case handled with temporary names. Evidence: migration script used `.renumber-tmp-*` intermediate names before final names.
- [x] CHK-FIX-005 [P1] Verification matrix lists changed and unchanged roots. Evidence: `implementation-summary.md` records changed and unchanged roots.
- [ ] CHK-FIX-006 [P1] Not applicable: no process environment or global state is read by the migration.
- [x] CHK-FIX-007 [P1] Evidence is pinned to command/tool output in this phase packet. Evidence: command outputs are summarized in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. Evidence: phase docs contain no credentials.
- [x] CHK-031 [P0] Input scope validated from user-named paths. Evidence: only named spec roots are in scope.
- [x] CHK-032 [P1] Auth/authz not applicable to filesystem spec docs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized after migration. Evidence: all docs now name the reindex blocker and completed migration work.
- [x] CHK-041 [P1] Code comments adequate. Evidence: no application code comments changed.
- [x] CHK-042 [P2] README update not applicable. Evidence: task scope is spec folder numbering and indexing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no scratch temp files created at setup stage.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: no scratch files were created for this phase.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 12/13 |
| P1 Items | 12 | 11/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-30
<!-- /ANCHOR:summary -->
