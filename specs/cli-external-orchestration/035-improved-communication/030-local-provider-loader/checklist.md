---
title: "Verification Checklist: Phase 030 Local Provider Loader"
description: "Verification gates for the shared loader, the fail-closed exact-original rule, the two entry-point wirings, the local-only privacy default, and the package gate."
trigger_phrases:
  - "local-provider-loader"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/030-local-provider-loader"
    last_updated_at: "2026-08-14T18:42:57.776Z"
    last_updated_by: "opencode"
    recent_action: "Verified every local-provider loader checklist item."
    next_safe_action: "Consume the loader from operator rollout documentation when the opt-in story is written."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-030-local-provider-loader-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every P0, P1, and P2 checklist item has observed evidence."
---
# Verification Checklist: Phase 030 Local Provider Loader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 030 until complete |
| **P1** | Required | Complete or obtain an explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The Phase 029 research first choice and the `localProvider` schema are documented. [evidence: `../029-local-llm-easy-config/research/research.md:36-48` and `spec.md:157`]
- [x] CHK-002 [P0] The loader surface, the two entry points, and the fail-closed rule are defined. [evidence: `spec.md:157-168` REQ-001 through REQ-007]
- [x] CHK-003 [P1] The implementation stays at the loader and entry points without transport, adapter, preset, judge, or router behavior changes. [evidence: `src/config/local-provider.ts:126` consumes shipped primitives; no shipped primitive file changed]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The loader parses a valid `localProvider` block into the full projection wiring. [evidence: `parseLocalProjectionConfig()` at `src/config/local-provider.ts:80` and `buildLocalProjectionConfig()` at `src/config/local-provider.ts:126`]
- [x] CHK-011 [P0] The loader fails closed on absent, malformed, unknown-kind, missing-model, and invalid-endpoint inputs. [evidence: `test/config/local-provider.test.ts:156` fail-closed matrix]
- [x] CHK-012 [P1] The record is built from the shipped presets and the endpoint points at the configured value. [evidence: `buildLocalProjectionConfig()` at `src/config/local-provider.ts:126` reuses `createOllamaModelRecord` / `createLlamaCppModelRecord`]
- [x] CHK-013 [P1] The loader is deterministic and network-free at its parse/build core. [evidence: `test/config/local-provider.test.ts:186` pure build tests with injected now and transport]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The loader unit tests cover the valid-config wiring and the absent/malformed null matrix. [evidence: `test/config/local-provider.test.ts:45` and `test/config/local-provider.test.ts:156`]
- [x] CHK-021 [P0] The plugin/runtime test proves a configured local provider projects the rewritten text. [evidence: `test/runtime/local-provider-runtime.test.ts:118`]
- [x] CHK-022 [P0] The wrapper test proves a configured local provider projects through the wrapper seam. [evidence: `test/wrapper/local-provider-wrapper.test.ts:64`]
- [x] CHK-023 [P1] The absent/null path keeps the exact-original fallback byte-identical. [evidence: `test/runtime/local-provider-runtime.test.ts:118` and `.opencode/plugins/tests/mk-communication-projection.test.cjs:373`]
- [x] CHK-024 [P1] The local-only policy denies a hosted record before any call. [evidence: `test/runtime/local-provider-runtime.test.ts:118` hosted-deny test asserts no transport call]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Both entry points call the same loader. [evidence: plugin `buildProjectionInput()` at `.opencode/plugins/mk-communication-projection.js:225` and wrapper bin at `bin/cli-output-wrapper.mjs:111`]
- [x] CHK-031 [P0] The null path preserves today's exact-original fallback at both entry points. [evidence: `.opencode/plugins/tests/mk-communication-projection.test.cjs:373` and `test/runtime/local-provider-runtime.test.ts:118`]
- [x] CHK-032 [P0] `npm run check` ends fully green from the final state. [evidence: `npm run check`; `Test Files  76 passed (76)`, `Tests  406 passed (406)`]
- [x] CHK-033 [P1] Evidence is pinned to explicit receipts. [evidence: `implementation-summary.md:104` verification table]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P0] The loader policy is local-only with `egressConsent: false`. [evidence: policy construction in `buildLocalProjectionConfig()` at `src/config/local-provider.ts:126`]
- [x] CHK-041 [P0] The loader and packet evidence are content-free. [evidence: `LocalProviderConfig` at `src/config/local-provider.ts:56` carries only kind/model/endpoint, never credentials or message content]
- [x] CHK-042 [P1] A malformed or disabled provider config emits the exact original. [evidence: `test/config/local-provider.test.ts:156` fail-closed matrix]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Packet docs agree on Complete status and 100% completion. [evidence: shared `2026-08-14T18:00:00.000Z` continuity timestamp and `completion_pct: 100`]
- [x] CHK-051 [P1] The committed enablement example documents the optional `localProvider` block. [evidence: `enablement.local.json.example:1`]
- [x] CHK-052 [P2] Adjacent-phase navigation identifies the Phase 029 design source. [evidence: `spec.md:65` predecessor metadata]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Closeout documentation stays inside the approved phase folder. [evidence: `implementation-summary.md:64` files-delivered table lists six Level-3 docs plus generated metadata]
- [x] CHK-061 [P1] Code changes stay inside the approved package src/test, plugin, bin, and packet scopes. [evidence: `implementation-summary.md:64` changed-files list]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 15/15 |
| P1 items | 22 | 22/22 |
| P2 items | 2 | 2/2 |

**Verification status**: Complete; package and strict packet gates pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-100 [P0] The primary architecture decisions are documented as Accepted ADRs. [evidence: `decision-record.md:42` ADR-001, `decision-record.md:149` ADR-002, and `decision-record.md:256` ADR-003]
- [x] CHK-101 [P1] ADR status and deciders are recorded. [evidence: ADR metadata tables at `decision-record.md:46`]
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented. [evidence: scored alternatives tables in `decision-record.md:95`]
- [x] CHK-103 [P1] The loader and wiring follow the accepted decision intent. [evidence: `src/config/local-provider.ts:80` and `src/config/local-provider.ts:126` match ADR-001 through ADR-003]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] Discovery and construction run once per activation, not per token. [evidence: single loader call sites at `.opencode/plugins/mk-communication-projection.js:225` and `bin/cli-output-wrapper.mjs:111`]
- [x] CHK-111 [P2] No new network dependency or probe is introduced by the loader. [evidence: `test/config/local-provider.test.ts:186` injects transports instead of probing]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] The rollback procedure is documented. [evidence: `plan.md:176` rollback plan and per-ADR rollback sections in `decision-record.md`]
- [x] CHK-121 [P1] Entry-point and shipped-surface dependencies are recorded. [evidence: `spec.md:87` and `plan.md:170` dependencies]
- [x] CHK-122 [P1] Re-validation on a shipped-surface change is recorded. [evidence: `npm run check` and `validate.sh` gates]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] Privacy and secret-handling review passes. [evidence: `spec.md:225` NFR-S02 and no credential fields in `src/config/local-provider.ts:56`]
- [x] CHK-131 [P1] No dependency or license change is introduced. [evidence: `package.json` manifest unchanged]
- [x] CHK-132 [P1] The fail-closed exact-original default is explicit and reversible. [evidence: `spec.md:160` REQ-004, ADR-002 at `decision-record.md:149`, and rollback plan at `plan.md:176`]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `validate.sh ... --strict` reports `Errors: 0  Warnings: 0`]
- [x] CHK-141 [P1] The loader and its fail-closed rule are complete. [evidence: source at `src/config/local-provider.ts:80`, tests at `test/config/local-provider.test.ts:45`, and packet docs agree]
- [x] CHK-142 [P1] The packet reports Complete state with final observed evidence. [evidence: `implementation-summary.md` and `completion_pct: 100` continuity metadata]
<!-- /ANCHOR:docs-verify -->

---

## Acceptance Criteria Traceability

| AC-ID | Class | Evidence |
|-------|-------|----------|
| AC-001 | Tested | src/config/local-provider.ts:80 |
| AC-002 | Tested | test/config/local-provider.test.ts:156 |
| AC-003 | Tested | src/config/enablement.ts:25 |
| AC-004 | Tested | src/config/local-provider.ts:126 |
| AC-005 | Tested | .opencode/plugins/mk-communication-projection.js:225 |
| AC-006 | Tested | bin/cli-output-wrapper.mjs:111 |
| AC-007 | Tested | test/config/local-provider.test.ts:186 |
| AC-008 | Tested | enablement.local.json.example:1 |
| AC-009 | Tested | test/config/local-provider.test.ts:45 |
| AC-010 | Tested | test/runtime/local-provider-runtime.test.ts:118 |
| AC-011 | Tested | test/runtime/local-provider-runtime.test.ts:118 |

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Project owner | Product and privacy | Complete | 2026-08-14 |
| Implementer | Technical | Complete | 2026-08-14 |
| Reviewer | Quality and routing | Complete | 2026-08-14 |
<!-- /ANCHOR:sign-off -->
