---
title: "Verification Checklist: Investigation P1 Fixes for TS CJS Rerank Twin Parity"
description: "Verification checklist for selected drift and parity findings."
trigger_phrases:
  - "arc 010 parity checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-parity-verification-checklist"
    next_safe_action: "close-selected-drift-P1s"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020040100020040100020040100020040100020040100020040100020040"
      session_id: "010-002-004-parity"
      parent_session_id: null
    completion_pct: 0
---
# Verification Checklist: Investigation P1 Fixes for TS CJS Rerank Twin Parity

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

- [ ] CHK-020 [P0] Rerank helper parity tests cover F1, F69, F101, and F102.
- [ ] CHK-021 [P0] Backend/env/API drift tests cover F2, F3, F37, F38, and F70.
- [ ] CHK-022 [P1] Edge cases tested.
- [ ] CHK-023 [P1] Error scenarios validated.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] F1 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-002 [P0] F2 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-003 [P0] F3 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-004 [P0] F37 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-005 [P0] F38 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-006 [P0] F69 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-007 [P0] F70 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-008 [P0] F101 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-009 [P0] F102 status open; evidence TBD: commit hash + test file.
- [ ] CHK-FIX-010 [P1] Evidence is pinned to a fix SHA or explicit diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets.
- [ ] CHK-031 [P0] Input validation implemented where applicable.
- [ ] CHK-032 [P1] File locking, health, and liveness parity are tested.
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
| F1 | P1 | `drift:ensure-rerank-sidecar:config-hash-default-revision-mismatch` | open | TBD: commit hash + test file |
| F2 | P1 | `drift:backend-kind-resolution:duplicate-implementation` | open | TBD: commit hash + test file |
| F3 | P1 | `drift:env-var-naming:inconsistent-conventions` | open | TBD: commit hash + test file |
| F37 | P1 | `drift:sidecar-client:api-surface-drift-from-production-usage` | open | TBD: commit hash + test file |
| F38 | P1 | `drift:backend-kind-resolution:function-signature-drift` | open | TBD: commit hash + test file |
| F69 | P1 | `drift:ensure-rerank-sidecar:missing-file-locking-vs-python` | open | TBD: commit hash + test file |
| F70 | P1 | `drift:types.ts:canonical-location-comment-drift` | open | TBD: commit hash + test file |
| F101 | P1 | `drift:ensure-rerank-sidecar:health-payload-body-size-limit-drift` | open | TBD: commit hash + test file |
| F102 | P1 | `drift:ensure-rerank-sidecar:process-liveness-error-handling-drift` | open | TBD: commit hash + test file |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
