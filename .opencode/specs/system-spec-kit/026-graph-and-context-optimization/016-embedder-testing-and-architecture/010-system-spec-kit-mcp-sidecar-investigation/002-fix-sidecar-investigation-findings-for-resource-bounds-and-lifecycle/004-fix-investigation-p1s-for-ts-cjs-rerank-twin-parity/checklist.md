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
    last_updated_at: "2026-05-23T05:17:00Z"
    last_updated_by: "devin"
    recent_action: "closed-all-9-p1-findings"
    next_safe_action: "update-implementation-summary"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020040100020040100020040100020040100020040100020040100020040"
      session_id: "010-002-004-parity"
      parent_session_id: null
    completion_pct: 100
---
# Verification Checklist: Investigation P1 Fixes for TS CJS Rerank Twin Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

|| Priority | Handling | Completion Impact |
||----------|----------|-------------------|
|| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
|| **[P1]** | Required | Must complete OR get user approval |
|| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks.
- [x] CHK-011 [P0] No console errors or warnings from targeted tests.
- [x] CHK-012 [P1] Error handling implemented.
- [x] CHK-013 [P1] Code follows project patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Rerank helper parity tests cover F1, F69, F101, and F102.
- [x] CHK-021 [P0] Backend/env/API drift tests cover F2, F3, F37, F38, and F70.
- [x] CHK-022 [P1] Edge cases tested.
- [x] CHK-023 [P1] Error scenarios validated.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] F1 status closed; evidence: ensure-rerank-sidecar.cjs:136-150 + ensure_rerank_sidecar.py:135-150 contract comments, test_empty_revision_treated_as_not_set_in_config_hash in test_sidecar_ledger.py:418-438.
- [x] CHK-FIX-002 [P0] F2 status closed; evidence: toBackendKind canonical in sidecar-client.ts:175-183, imported by execution-router.ts:11, test_toBackendKind_normalizes_provider_names_correctly in sidecar-hardening.vitest.ts:342-350.
- [x] CHK-FIX-003 [P0] F3 status closed; evidence: RECOGNIZED_SPECKIT_ENV_VARS JSDoc in sidecar-client.ts:107-143, exported constant, test_RECOGNIZED_SPECKIT_ENV_VARS_includes_all_documented_vars in sidecar-hardening.vitest.ts:353-363.
- [x] CHK-FIX-004 [P0] F37 status closed; evidence: SidecarClientOptions production-only in sidecar-client.ts:26-31, SidecarClientTestOptions extends for test fields in sidecar-client.ts:37-44, test_SidecarClientOptions_constructor_accepts_only_production_fields in sidecar-hardening.vitest.ts:366-378.
- [x] CHK-FIX-005 [P0] F38 status closed; evidence: toBackendKind signature unified in sidecar-client.ts:175-183, execution-router.ts imports and uses canonical version, test_toBackendKind_normalizes_provider_names_correctly in sidecar-hardening.vitest.ts:342-350.
- [x] CHK-FIX-006 [P0] F69 status closed; evidence: JS ledger locking in ensure-rerank-sidecar.cjs:173-198 with .lock file pattern matching Python fcntl in sidecar_ledger.py:94-104, test_concurrent_sidecar_adds_do_not_lose_rows in test_sidecar_ledger.py:149-156.
- [x] CHK-FIX-007 [P0] F70 status closed; evidence: types.ts:5 updated to reference canonical toBackendKind location in sidecar-client.ts, test_types.ts_references_canonical_toBackendKind_location in sidecar-hardening.vitest.ts:381-387.
- [x] CHK-FIX-008 [P0] F101 status closed; evidence: Python health_payload cap raised to 64KB in ensure_rerank_sidecar.py:56,81-82, JS MAX_HEALTH_BODY_BYTES documented as canonical in ensure-rerank-sidecar.cjs:16, test_health_payload_uses_64kb_cap_matching_js in test_sidecar_ledger.py:411-415.
- [x] CHK-FIX-009 [P0] F102 status closed; evidence: Python processLiveness returns structured dict in sidecar_ledger.py:150-167 matching JS contract in ensure-rerank-sidecar.cjs:192-202, test_process_liveness_returns_structured_dict_matching_js_contract in test_sidecar_ledger.py:389-408.
- [x] CHK-FIX-010 [P1] Evidence is pinned to a fix SHA or explicit diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Input validation implemented where applicable.
- [x] CHK-032 [P1] File locking, health, and liveness parity are tested.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary synchronized.
- [x] CHK-041 [P1] Code comments adequate.
- [x] CHK-042 [P2] Parent phase map remains accurate.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only.
- [x] CHK-051 [P1] `scratch/` cleaned before completion except `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

|| Finding | Severity | Fingerprint | Status | Evidence |
||---------|----------|-------------|--------|----------|
|| F1 | P1 | `drift:ensure-rerank-sidecar:config-hash-default-revision-mismatch` | closed | ensure-rerank-sidecar.cjs:136-150 + ensure_rerank_sidecar.py:135-150 + test_sidecar_ledger.py:418-438 |
|| F2 | P1 | `drift:backend-kind-resolution:duplicate-implementation` | closed | sidecar-client.ts:175-183 + execution-router.ts:11 + sidecar-hardening.vitest.ts:342-350 |
|| F3 | P1 | `drift:env-var-naming:inconsistent-conventions` | closed | sidecar-client.ts:107-143 + sidecar-hardening.vitest.ts:353-363 |
|| F37 | P1 | `drift:sidecar-client:api-surface-drift-from-production-usage` | closed | sidecar-client.ts:26-44 + sidecar-hardening.vitest.ts:366-378 |
|| F38 | P1 | `drift:backend-kind-resolution:function-signature-drift` | closed | sidecar-client.ts:175-183 + execution-router.ts:11 + sidecar-hardening.vitest.ts:342-350 |
|| F69 | P1 | `drift:ensure-rerank-sidecar:missing-file-locking-vs-python` | closed | ensure-rerank-sidecar.cjs:173-198 + sidecar_ledger.py:94-104 + test_sidecar_ledger.py:149-156 |
|| F70 | P1 | `drift:types.ts:canonical-location-comment-drift` | closed | types.ts:5 + sidecar-hardening.vitest.ts:381-387 |
|| F101 | P1 | `drift:ensure-rerank-sidecar:health-payload-body-size-limit-drift` | closed | ensure-rerank-sidecar.cjs:16 + ensure_rerank_sidecar.py:56,81-82 + test_sidecar_ledger.py:411-415 |
|| F102 | P1 | `drift:ensure-rerank-sidecar:process-liveness-error-handling-drift` | closed | sidecar_ledger.py:150-167 + ensure-rerank-sidecar.cjs:192-202 + test_sidecar_ledger.py:389-408 |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->
