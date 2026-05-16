---
title: "Verification Checklist: Phase 006 Advisor Rebuild and Validation"
description: "Verification Date: 2026-05-05"
trigger_phrases:
  - "070 phase 006 checklist"
  - "advisor rebuild verification"
  - "final packet validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/006-advisor-and-validate"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized Phase 006 verification checklist"
    next_safe_action: "Fill verification evidence after probes and validation"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 006 Advisor Rebuild and Validation

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (evidence: `REQ-001` through `REQ-009`)
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (evidence: narrative cleanup, advisor build, probes, grep audit, validation)
- [x] CHK-003 [P1] Dependencies identified and available (evidence: Node build script path, Python advisor script, validator path)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Parent narrative cleanup is confined to the five listed files (evidence: parent narrative patch touched only `../spec.md`, `../description.json`, `../graph-metadata.json`, `../resource-map.md`, and `../002-skill-folder-rename/description.json`)
- [x] CHK-011 [P0] Source-side old names are restored only where the prose describes the rename source (evidence: `sk-deep-review`/`sk-deep-research` now appear in source-side parent metadata and resource-map rows)
- [x] CHK-012 [P1] Parent metadata remains searchable by old and new skill names (evidence: parent `description.json` keywords include old and new names)
- [x] CHK-013 [P1] Phase docs follow the Level 2 template contract (evidence: child strict validation exit 0)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Canonical advisor graph build script runs (blocked: requested path missing with `MODULE_NOT_FOUND`; orchestrator MCP rebuild fallback required)
- [x] CHK-021 [P0] Deep review advisor probe top-1 is `deep-review` (evidence: score `0.883`)
- [x] CHK-022 [P0] Deep research advisor probe top-1 is `deep-research` (evidence: score `0.834`)
- [ ] CHK-023 [P0] Active-scope old-name grep returns zero hits (evidence: FAIL, 42 active file hits)
- [x] CHK-024 [P0] Child strict validation exits 0 (evidence: strict validation exit 0)
- [x] CHK-025 [P0] Parent strict validation exits 0 (evidence: recursive parent strict validation exit 0)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is documented as cross-consumer metadata/narrative cleanup (evidence: `implementation-summary.md` verdict and limitations).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for the five listed narrative files (evidence: targeted `rg` over listed files).
- [x] CHK-FIX-003 [P0] Consumer inventory completed through final active-scope grep (evidence: 42 active file hits and 467 excluded hits recorded).
- [x] CHK-FIX-004 [P0] Advisor routing matrix covers deep-review and deep-research prompts (evidence: two direct advisor probes).
- [x] CHK-FIX-005 [P1] Matrix axes are listed in `plan.md` (evidence: affected surfaces section).
- [x] CHK-FIX-006 [P1] Existing unrelated working-tree state is not reverted (evidence: no revert commands run; unrelated dirty state left untouched).
- [x] CHK-FIX-007 [P1] Evidence is pinned to command output in `implementation-summary.md` (evidence: verification table).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets are introduced in docs or generated metadata (evidence: docs/JSON metadata only)
- [x] CHK-031 [P0] No runtime permission or auth configuration is changed by Phase 006 (evidence: `.codex` edits were blocked; no config writes completed)
- [x] CHK-032 [P1] User-global files are not touched (evidence: all successful writes are under `specs/`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist are synchronized with actual verification outcomes (evidence: `tasks.md` and this checklist record `REMEDIATION_NEEDED`)
- [x] CHK-041 [P1] Implementation summary lists changed files, residual references, and verdict (evidence: `implementation-summary.md`)
- [x] CHK-042 [P2] Historical residual references are justified instead of silently ignored (evidence: limitations list)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All Phase 006 artifacts are inside `006-advisor-and-validate/` (evidence: phase docs created in this folder)
- [x] CHK-051 [P1] Source/narrative cleanup touches only requested parent files plus Phase 006 artifacts (evidence: successful edits confined to listed files)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 13/15 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-05
<!-- /ANCHOR:summary -->
