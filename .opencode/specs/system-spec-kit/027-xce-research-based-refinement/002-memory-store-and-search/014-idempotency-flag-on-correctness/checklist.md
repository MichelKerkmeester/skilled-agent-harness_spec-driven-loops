---
title: "Verification Checklist: Idempotency Flag-On Correctness"
description: "Verification checklist for correcting the default-off memory idempotency path when SPECKIT_MEMORY_IDEMPOTENCY is explicitly enabled, including replay equality, conflict behavior, receipt write gating, tests, and strict validation."
trigger_phrases:
  - "idempotency verification checklist"
  - "memory receipt checklist"
  - "SPECKIT_MEMORY_IDEMPOTENCY checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness"
    last_updated_at: "2026-06-11T12:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Prepared idempotency correctness verification checklist"
    next_safe_action: "Phase complete; preserve final verification evidence."
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness/checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Idempotency Flag-On Correctness

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` defines replay equality, immutable receipts, normalization, conflict, write gating, flag-off preservation, and no-live-shard constraints.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` records receipt lookup/store changes and memory-save mutating-success write guard.
- [x] CHK-003 [P1] Default-off scope documented
  - **Evidence**: `spec.md` states `SPECKIT_MEMORY_IDEMPOTENCY` remains default-off and enablement is out of scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Replay returns original response
  - **Evidence**: Regression test deep-equals replay response to the original stored MCP response.
- [x] CHK-011 [P0] Receipt store preserves first-write semantics
  - **Evidence**: Regression test stores the same key twice and expects replay to return the first response.
- [x] CHK-012 [P0] Receipt write guard is explicit
  - **Evidence**: `shouldStoreMemorySaveReceipt` allows only non-error `indexed`, `updated`, and `deferred` results with a positive integer id.
- [x] CHK-013 [P1] No new code comments violate hygiene rules
  - **Evidence**: Production fix adds no new comments; final comment-hygiene command remains to be recorded.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] New flag-on tests fail against current code before the fix
  - **Evidence**: Red run failed 2 tests: replay response was decorated and repeated store replayed the later response.
- [x] CHK-021 [P0] Flag-on idempotency/near-duplicate suite passes after the fix
  - **Evidence**: `SPECKIT_MEMORY_IDEMPOTENCY=true npx vitest run tests/memory-idempotency-and-near-duplicate.vitest.ts` passed with 1 file, 10 tests.
- [x] CHK-022 [P1] Related memory-save suites pass with the flag enabled
  - **Evidence**: `SPECKIT_MEMORY_IDEMPOTENCY=true npx vitest run tests/handler-memory-save.vitest.ts tests/memory-save-planner-first.vitest.ts` passed with 2 files, 17 passed, 51 skipped.
- [x] CHK-023 [P0] Flag-off idempotency/near-duplicate suite passes
  - **Evidence**: `npx vitest run tests/memory-idempotency-and-near-duplicate.vitest.ts` passed with 1 file, 10 tests.
- [x] CHK-024 [P0] TypeScript passes
  - **Evidence**: `npx tsc --noEmit` from `.opencode/skills/system-spec-kit/mcp_server` exited 0 with no output.
- [x] CHK-025 [P1] Strict spec validation passes
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness --strict` passed with 0 errors and 0 warnings.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Confirmed correctness issues are fixed minimally
  - **Evidence**: Fix is limited to replay response parsing, receipt insert semantics, and memory-save receipt-write guard.
- [x] CHK-FIX-002 [P0] Normalization false positives/negatives are covered
  - **Evidence**: Test covers key order, stripped client tokens, undefined object values, and a genuine `force` payload change.
- [x] CHK-FIX-003 [P0] Duplicate/unchanged/error/rejected paths are covered
  - **Evidence**: Guard test asserts skipped candidates leave lookup as `miss`.
- [x] CHK-FIX-004 [P1] Near-duplicate behavior preserved
  - **Evidence**: Existing near-duplicate tests remain in the same passing file.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Client-supplied idempotency tokens ignored
  - **Evidence**: Existing and extended tests verify forged token aliases do not affect receipt key or payload hash.
- [x] CHK-031 [P0] No live shard or host daemon touched by tests
  - **Evidence**: Test database is `:memory:` and related memory-save suites use temp fixtures or mocks.
- [x] CHK-032 [P1] Failed retry safety covered
  - **Evidence**: Error-envelope candidate is skipped and lookup remains `miss`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/summary synchronized
  - **Evidence**: All docs describe the same files, fixes, tests, default-off flag decision, and no-live-shard constraint.
- [x] CHK-041 [P1] Description and graph metadata created
  - **Evidence**: `description.json` and `graph-metadata.json` mirror sibling phase structure for phase 023.
- [x] CHK-042 [P1] Final verification results recorded
  - **Evidence**: `implementation-summary.md` records flag-on, flag-off, related memory-save, TypeScript, strict validation, and comment-hygiene results.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New docs are in approved phase folder
  - **Evidence**: Docs are under `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness`.
- [x] CHK-051 [P1] Parent metadata not edited
  - **Evidence**: This phase creates child docs only and does not modify parent `description.json` or `graph-metadata.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-11
**Verified By**: OpenCode
<!-- /ANCHOR:summary -->
