---
title: "Verification Checklist: Investigation P1 Fixes for Resource Bounds and Input Validation"
description: "Verification checklist for P1 findings F48, F85, F86, and F87."
trigger_phrases:
  - "arc 010 resource bounds checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-resource-bound-verification-checklist"
    next_safe_action: "close-F48-F85-F86-F87"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020020100020020100020020100020020100020020100020020100020020"
      session_id: "010-002-002-resource-bounds"
      parent_session_id: null
    completion_pct: 0
---
# Verification Checklist: Investigation P1 Fixes for Resource Bounds and Input Validation

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`.
- [ ] CHK-003 [P1] Dependencies identified and available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks.
- [ ] CHK-011 [P0] No console errors or warnings from targeted tests.
- [ ] CHK-012 [P1] Error handling implemented.
- [ ] CHK-013 [P1] Code follows project patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] F48 unpredictable request ID behavior tested.
- [ ] CHK-021 [P0] F85 health body cap tested.
- [ ] CHK-022 [P0] F86/F87 aligned embed input cap tested.
- [ ] CHK-023 [P1] Error scenarios validated.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] F48 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-002 [P0] F85 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-003 [P0] F86 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-004 [P0] F87 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-005 [P1] Evidence is pinned to a fix SHA or explicit diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets.
- [ ] CHK-031 [P0] Input validation implemented.
- [ ] CHK-032 [P1] Request ID and body cap boundaries are tested.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary synchronized.
- [ ] CHK-041 [P1] Code comments adequate.
- [ ] CHK-042 [P2] Parent phase map remains accurate.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion except `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Finding | Severity | Fingerprint | Status | Evidence |
|---------|----------|-------------|--------|----------|
| F48 | P1 | `security:sidecar-client:predictable-request-ids-hijacking-risk` | open | TBD: commit hash + test file |
| F85 | P1 | `security:ensure-rerank-sidecar:healthpayload-unbounded-body-accumulation` | open | TBD: commit hash + test file |
| F86 | P1 | `security:sidecar-client:unbounded-embed-input-array-resource-exhaustion` | open | TBD: commit hash + test file |
| F87 | P1 | `security:sidecar-worker:unbounded-embed-input-array-worker-resource-exhaustion` | open | TBD: commit hash + test file |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
