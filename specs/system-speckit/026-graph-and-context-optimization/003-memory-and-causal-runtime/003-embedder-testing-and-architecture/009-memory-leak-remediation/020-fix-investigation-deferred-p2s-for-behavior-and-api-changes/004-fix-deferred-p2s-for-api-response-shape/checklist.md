---
title: "Checklist: API Response Shape Closure for F9 F32 F39 F97 F99"
description: "Verification checklist for sidecar-client testables separation, response alias compatibility, and pending-map discriminator narrowing."
trigger_phrases:
  - "020 004 checklist"
  - "api response shape checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0200040200040200040200040200040200040200040200040200040200040200"
      session_id: "020-004-api-response-shape"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: API Response Shape Closure for F9 F32 F39 F97 F99

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
- [x] CHK-003 [P0] Scaffold strict validation passes before source edits; evidence: `validate.sh <spec-folder> --strict --verbose` exit 0
- [x] CHK-004 [P0] Parent 020 halt-on-first-regression rule read; no regression occurred and F48 did not flake
- [x] CHK-005 [P0] F37 production/test interface separation precedent checked; evidence: 016/004 and 017/003 decision records
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] F9 `buildSidecarEnv` has no live production consumers; evidence: only local implementation, testables import, hardening tests, and unrelated launcher-local function share the token
- [x] CHK-011 [P0] F9 test imports use `sidecar-client.testables.ts`; evidence: `sidecar-hardening.vitest.ts` imports from `sidecar-client.testables.js`
- [x] CHK-012 [P0] F9 production `sidecar-client.ts` no longer exports `buildSidecarEnv`; evidence: dynamic module fixture asserts no production named export
- [x] CHK-013 [P0] F32/F39/F97 canonical response fields use camelCase; evidence: `lastRequestAt`, `idleForMs`, `requestCount`, and `dimensions`
- [x] CHK-014 [P0] F32/F39/F97 legacy aliases remain for one release cycle; evidence: `last_request_at`, `idle_for_ms`, `request_count`, and `dim`
- [x] CHK-015 [P0] F32/F39/F97 legacy alias reads warn once per process; evidence: alias warning fixtures for `idle_for_ms` and `dim`
- [x] CHK-016 [P0] F99 pending entry handling uses discriminator narrowing instead of unsafe cast; evidence: pending map stores `unknown`, `isPendingRequest()` narrows by `type`
- [x] CHK-017 [P0] F99 malformed pending entry rejects with structured `SidecarClientError`; evidence: F99 hardening fixture asserts `sidecar-pending-entry-invalid`
- [x] CHK-018 [P0] Forbidden sibling files remain untouched by this packet; evidence: implementation diff limited to approved source/test files plus packet docs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-020 [P0] Embedders vitest passes: `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` => 4 files, 47 tests passed, exit 0
- [x] CHK-021 [P0] Typecheck passes: `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` => exit 0
- [x] CHK-022 [P0] Final strict spec validation passes: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` => exit 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] F9 closure row cites consumer grep and fixture
- [x] CHK-FIX-002 [P0] F32 closure row cites both-name response fixture
- [x] CHK-FIX-003 [P0] F39 closure row cites camelCase naming fixture
- [x] CHK-FIX-004 [P0] F97 closure row cites alias warning fixture
- [x] CHK-FIX-005 [P0] F99 closure row cites discriminator-narrowing fixture
- [x] CHK-FIX-006 [P1] ADRs cover F9, F32/F39/F97, and F99 decisions
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-030 [P0] No secrets, env values, vectors, or payload bodies are logged in deprecation warnings
- [x] CHK-031 [P1] Error messages for malformed pending entries avoid leaking request payload data
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] `decision-record.md` includes at least three ADRs
- [x] CHK-042 [P1] `implementation-summary.md` includes verification and handoff
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P1] No files outside approved source/test/docs scope are modified by this packet
- [x] CHK-051 [P1] No git commit or branch mutation performed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 26/26 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-23

### Finding Closure

| Finding | Status | Evidence |
|---------|--------|----------|
| F9 | Closed | `buildSidecarEnv` production named export removed; tests import from `sidecar-client.testables.ts`; fixture asserts production module lacks `buildSidecarEnv` |
| F32 | Closed | Worker info response includes canonical camelCase fields and deprecated snake_case aliases |
| F39 | Closed | Naming convention aligned on `lastRequestAt`, `idleForMs`, `requestCount`, and `dimensions` |
| F97 | Closed | `dimensions` is canonical on `SidecarClient`; `dim` remains deprecated warning alias |
| F99 | Closed | Pending map stores unknown entries and narrows via `isPendingRequest()` before resolving; malformed entry fixture rejects with `sidecar-pending-entry-invalid` |
<!-- /ANCHOR:summary -->
