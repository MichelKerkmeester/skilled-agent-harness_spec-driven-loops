---
title: "Checklist: Test-Only Barrel Export Cleanup for F44 and F109"
description: "Verification checklist for closing F44 and F109 without live consumer impact."
trigger_phrases:
  - "020 001 checklist"
  - "F44 F109 verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports"
    last_updated_at: "2026-05-23T10:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Parent agent may commit packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0200010200010200010200010200010200010200010200010200010200010200"
      session_id: "020-001-f44-f109-barrel-cleanup"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: Test-Only Barrel Export Cleanup for F44 and F109

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P0] Scaffold strict validation passes before source edits: `validate.sh .../001-fix-deferred-p2s-for-test-only-and-shared-exports --strict` exit 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] Test imports point to direct source modules before barrel deletion: `embedder-registry.vitest.ts` imports from `@spec-kit/shared/embeddings/registry.js` and `@spec-kit/shared/embeddings/types.js`
- [x] CHK-011 [P0] Barrel export deletion is limited to F44/F109 symbols: `index.ts` removes `EmbedderManifest` and `listSupportedDimensions`; `registry.ts` stops wildcard export of `listSupportedDimensions`
- [x] CHK-012 [P0] Forbidden sibling bucket files remain untouched
- [x] CHK-013 [P1] Code follows existing `.js` import specifier style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-020 [P0] Typecheck passes after test import refactor: `npm run typecheck --workspace=@spec-kit/mcp-server` exit 0
- [x] CHK-021 [P0] Typecheck passes after barrel deletion: `npm run typecheck --workspace=@spec-kit/mcp-server` exit 0
- [x] CHK-022 [P0] Full embedders vitest suite passes: 4 files / 40 tests passed
- [x] CHK-023 [P0] Final strict spec validation passes: `validate.sh ... --strict` exit 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] F44 class is `test-isolation`; no live `system-spec-kit` source consumer depends on the removed barrel export.
- [x] CHK-FIX-002 [P0] F109 class is `test-isolation`; no live source consumer imports `EmbedderManifest` from the barrel.
- [x] CHK-FIX-003 [P0] Consumer inventory completed with `rg -l "listSupportedDimensions" .opencode/`.
- [x] CHK-FIX-004 [P0] Consumer inventory completed with `rg -l "EmbedderManifest" .opencode/`.
- [x] CHK-FIX-005 [P1] ADR records "barrel exports collapsed to direct imports - no live consumer impact".
- [x] CHK-FIX-006 [P1] Finding closure rows record F44 and F109 evidence.
- [x] CHK-FIX-007 [P1] Evidence is pinned to command output and changed file list, not a future branch claim.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-030 [P0] No hardcoded secrets introduced
- [x] CHK-031 [P0] No auth, env, filesystem, or process-boundary behavior touched
- [x] CHK-032 [P1] No production consumer broken silently
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] `decision-record.md` includes at least one ADR
- [x] CHK-042 [P1] `implementation-summary.md` includes verification and handoff
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P1] Temp files remain in `scratch/` only
- [x] CHK-051 [P1] No git commit or branch mutation performed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-23

### Finding Closure

| Finding | Status | Evidence |
|---------|--------|----------|
| F44 | Closed | `embedder-registry.vitest.ts` imports `listSupportedDimensions` directly from `@spec-kit/shared/embeddings/registry.js`; `registry.ts` no longer wildcard-exports it; typecheck and embedders vitest pass |
| F109 | Closed | `embedder-registry.vitest.ts` imports `EmbedderManifest` directly from `@spec-kit/shared/embeddings/types.js`; `index.ts` no longer exports it; typecheck and embedders vitest pass |
<!-- /ANCHOR:summary -->
