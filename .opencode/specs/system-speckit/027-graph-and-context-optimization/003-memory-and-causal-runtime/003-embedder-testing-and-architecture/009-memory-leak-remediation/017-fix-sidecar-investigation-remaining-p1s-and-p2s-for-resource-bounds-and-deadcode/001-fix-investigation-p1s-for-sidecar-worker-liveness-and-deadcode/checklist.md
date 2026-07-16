---
title: "Verification Checklist: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code"
description: "Canonical-anchor verification checklist for F5, F14, F19, F26, F30, F94, and F95."
trigger_phrases:
  - "arc 010 003 001 checklist"
  - "sidecar-worker p1 liveness deadcode checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-checklist-evidence"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100030010100030010100030010100030010100030010100030010100030010"
      session_id: "010-003-001-sidecar-worker-p1"
      parent_session_id: null
    completion_pct: 100
---
# Verification Checklist: Investigation P1 Fixes for Sidecar-Worker Liveness and Dead Code

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

- [x] CHK-010 [P0] TypeScript typecheck passes for `@spec-kit/mcp-server`; evidence: `npm run typecheck --workspace=@spec-kit/mcp-server` exit 0.
- [x] CHK-011 [P0] Worker errors use canonical `{ phase, code, detail }` fields; evidence: `sidecar-worker.ts:214-222`, `sidecar-worker.ts:235-240`, `sidecar-worker.ts:320-363`.
- [x] CHK-012 [P1] Helper consolidation preserves readable seams for parsing, liveness, and provider creation; evidence: `sidecar-worker.ts:74-151`, `sidecar-worker.ts:173-259`.
- [x] CHK-013 [P1] No out-of-scope files changed; evidence: changed-file list in `implementation-summary.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] F14 liveness fixtures cover PID 1, EPERM, and ESRCH; evidence: `sidecar-hardening.vitest.ts:465-512`.
- [x] CHK-021 [P0] F94 pre-parse fixtures cover recoverable id and unparseable exit 1; evidence: `sidecar-hardening.vitest.ts:514-555`.
- [x] CHK-022 [P0] F95 provider-cache fixtures cover retry after rejection and success caching after retry; evidence: `sidecar-hardening.vitest.ts:557-615`.
- [x] CHK-023 [P1] Targeted `sidecar-hardening.vitest.ts` command exits 0; evidence: 21 tests passed, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] F5 status closed; evidence: model resolution collapsed to env/config/default in `sidecar-worker.ts:74-88`, with default warning at `sidecar-worker.ts:85-87`.
- [x] CHK-FIX-002 [P0] F14 status closed; evidence: structured liveness in `sidecar-worker.ts:128-151`, polling consumes `.alive` at `sidecar-worker.ts:159-168`, tests in `sidecar-hardening.vitest.ts:465-512`.
- [x] CHK-FIX-003 [P0] F19 status closed; evidence: provider name inline at `sidecar-worker.ts:245-248`, helper chain reduced to non-trivial/test-seam helpers at `sidecar-worker.ts:74-259`.
- [x] CHK-FIX-004 [P0] F26 status closed; evidence: trivial single-call helper removals and retained seams in `sidecar-worker.ts:74-259`.
- [x] CHK-FIX-005 [P0] F30 status closed; evidence: canonical error detail type at `sidecar-worker.ts:45-53`, `writeError` envelope at `sidecar-worker.ts:214-222`, request/pre-parse emissions at `sidecar-worker.ts:320-363`.
- [x] CHK-FIX-006 [P0] F94 status closed; evidence: request-id recovery in `sidecar-worker.ts:225-233`, recoverable/unparseable paths in `sidecar-worker.ts:318-352`, tests in `sidecar-hardening.vitest.ts:514-555`.
- [x] CHK-FIX-007 [P0] F95 status closed; evidence: rejected-promise eviction in `sidecar-worker.ts:243-259`, tests in `sidecar-hardening.vitest.ts:557-615`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Parent liveness cannot treat PID 1 or ESRCH as alive; evidence: `sidecar-worker.ts:133-149`, `sidecar-hardening.vitest.ts:465-512`.
- [x] CHK-031 [P0] Unparseable worker input exits 1 instead of emitting an id 0 response; evidence: `sidecar-worker.ts:343-349`, `sidecar-hardening.vitest.ts:537-555`.
- [x] CHK-032 [P1] Unknown liveness errors emit stderr warning and are represented explicitly; evidence: `sidecar-worker.ts:128-151`, `sidecar-worker.ts:161-164`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized.
- [x] CHK-041 [P1] ADRs record F14 structured-liveness, F94 pre-parse policy, and F95 rejected-promise eviction.
- [x] CHK-042 [P2] Parent phase scope remains unchanged.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Modified files are limited to the approved source, test, and packet docs.
- [x] CHK-051 [P1] No generated scratch or temporary files remain in the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

|| Finding | Severity | Fingerprint | Status | Evidence |
||---------|----------|-------------|--------|----------|
|| F5 | P1 | `dead-code:sidecar-worker:unreachable-model-fallback-chain` | closed | sidecar-worker.ts:74-88 |
|| F14 | P1 | `security:sidecar-worker:incorrect-parent-liveness-detection-eperm-bypass` | closed | sidecar-worker.ts:128-168 + sidecar-hardening.vitest.ts:465-512 |
|| F19 | P1 | `over-engineering:sidecar-worker:single-caller-helper-indirection` | closed | sidecar-worker.ts:74-259 |
|| F26 | P1 | `simplification:sidecar-worker:four-single-call-helpers` | closed | sidecar-worker.ts:74-259 |
|| F30 | P1 | `refinement:embedders:inconsistent-error-message-detail` | closed | sidecar-worker.ts:45-53,214-222,320-363 |
|| F94 | P1 | `refinement:sidecar-worker:error-response-id-zero-dropped-by-client` | closed | sidecar-worker.ts:225-233,318-352 + sidecar-hardening.vitest.ts:514-555 |
|| F95 | P1 | `refinement:embedders:cached-rejected-provider-promise-no-recovery` | closed | sidecar-worker.ts:243-259 + sidecar-hardening.vitest.ts:557-615 |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L2: Architecture Verification

- [x] CHK-ARCH-001 [P1] Structured liveness type matches the ADR and worker polling uses `.alive`.
- [x] CHK-ARCH-002 [P1] Error envelope fields are stable across parse, validation, provider, and line-length errors.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L2: Performance Verification

- [x] CHK-PERF-001 [P1] Provider success cache remains permanent after a successful retry; evidence: `sidecar-hardening.vitest.ts:587-615`.
- [x] CHK-PERF-002 [P2] No additional per-line parsing pass allocates unbounded data; evidence: id recovery regex at `sidecar-worker.ts:225-233`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L2: Deployment Readiness

- [x] CHK-DEPLOY-001 [P1] Worker process exit codes for shutdown, parent death, oversized line, and unparseable input are intentional.
- [x] CHK-DEPLOY-002 [P1] Commit handoff lists every modified or created file by absolute path.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L2: Compliance Verification

- [x] CHK-COMPLIANCE-001 [P0] `validate.sh <packet> --strict` exits 0.
- [x] CHK-COMPLIANCE-002 [P1] No forbidden files are modified.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L2: Documentation Verification

- [x] CHK-DOCS-001 [P1] `implementation-summary.md` status is Completed with completion_pct 100.
- [x] CHK-DOCS-002 [P1] `decision-record.md` exists and records the three behavioral policies.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L2: Sign-Off

- [x] CHK-SIGNOFF-001 [P0] PACKET-010-003-001 handoff summary is present.
- [x] CHK-SIGNOFF-002 [P0] Parent agent can commit without additional scope discovery.
<!-- /ANCHOR:sign-off -->
