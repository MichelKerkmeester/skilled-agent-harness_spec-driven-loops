---
title: "Verification Checklist: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers"
description: "Canonical-anchor verification checklist for F18, F20, F25, F57, F62, F73, and F91."
trigger_phrases:
  - "arc 010 003 003 checklist"
  - "sidecar-client p1 constructor helpers checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers"
    last_updated_at: "2026-05-23T06:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-checklist-evidence"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100030030100030030100030030100030030100030030100030030100030030"
      session_id: "010-003-003-sidecar-client-p1"
      parent_session_id: null
    completion_pct: 100
---
# Verification Checklist: Investigation P1 Fixes for Sidecar-Client Constructor and Helpers

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
- [x] CHK-011 [P0] Production/test constructor options are separated; evidence: `sidecar-client.ts:21-43`, constructor overloads at `sidecar-client.ts:317-337`, compile fixture at `sidecar-client.testables.ts:7-28`.
- [x] CHK-012 [P1] Duplicate `EmbedOptions` interface removed from execution-router; evidence: canonical export at `sidecar-client.ts:54-56`, router import at `execution-router.ts:11`, direct adapter use at `execution-router.ts:141-150`.
- [x] CHK-013 [P1] No out-of-scope implementation files changed beyond the F20 sibling type definer; evidence: changed-file list in `implementation-summary.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] F18 negative typecheck fixture passes; evidence: `sidecar-client.testables.ts:7-28`, MCP server typecheck exit 0.
- [x] CHK-021 [P0] F57 grace-period sequencing fixture passes; evidence: `sidecar-hardening.vitest.ts:404-431`.
- [x] CHK-022 [P0] F62 unknown-type fixture passes; evidence: `sidecar-hardening.vitest.ts:473-491`.
- [x] CHK-023 [P1] Full embedders vitest exits 0; evidence: 4 files passed, 40 tests passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] F18 status closed; evidence: production `SidecarClientOptions` at `sidecar-client.ts:21-31`, test-only options at `sidecar-client.ts:33-43`, no internal test-option assertion in constructor at `sidecar-client.ts:317-337`.
- [x] CHK-FIX-002 [P0] F20 status closed; evidence: canonical `EmbedOptions` in `sidecar-client.ts:54-56`, execution-router imports it at `execution-router.ts:11`, local duplicate removed from `execution-router.ts:18-20`.
- [x] CHK-FIX-003 [P0] F25 status closed; evidence: `responseHasId`, separate signal helper, and separate wait helper removed; retained helpers encode default path, type validation, env filtering, embed validation, or termination policy in `sidecar-client.ts:164-290`.
- [x] CHK-FIX-004 [P0] F57 status closed; evidence: single grace-period termination helper in `sidecar-client.ts:209-252`, `terminateChild()` delegates at `sidecar-client.ts:483-499`, test at `sidecar-hardening.vitest.ts:404-431`.
- [x] CHK-FIX-005 [P0] F62 status closed; evidence: discriminator narrowing in `sidecar-client.ts:597-657`, unknown-type fixture in `sidecar-hardening.vitest.ts:473-491`.
- [x] CHK-FIX-006 [P0] F73 status closed; evidence: no `SidecarClient.ready()` remains and tests no longer call `.ready()`.
- [x] CHK-FIX-007 [P0] F91 status closed; evidence: `validateEmbedInput()` in `sidecar-client.ts:276-290`, flattened `embed()` validation path in `sidecar-client.ts:340-367`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Unknown or malformed sidecar responses cannot resolve pending requests without a recognized discriminator; evidence: `sidecar-client.ts:626-657`.
- [x] CHK-031 [P1] Oversized stdout and timeout cleanup still terminate child processes; evidence: full sidecar-hardening vitest exit 0.
- [x] CHK-032 [P1] Constructor type fixture prevents test-only env/worker injection fields from widening production options; evidence: `sidecar-client.testables.ts:7-28`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized.
- [x] CHK-041 [P1] ADRs record constructor split, EmbedOptions consolidation, termination helper, response narrowing, and readiness deletion.
- [x] CHK-042 [P2] Parent phase scope remains unchanged.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Modified files are limited to approved source, test, type fixture, sibling EmbedOptions definer, and packet docs.
- [x] CHK-051 [P1] No generated scratch or temporary files remain in the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

|| Finding | Severity | Fingerprint | Status | Evidence |
||---------|----------|-------------|--------|----------|
|| F18 | P1 | `over-engineering:sidecar-client:optional-config-fields-only-for-tests` | closed | sidecar-client.ts:21-43,317-337 + sidecar-client.testables.ts:7-28 |
|| F20 | P1 | `over-engineering:embed-options:duplicate-single-property-interfaces` | closed | sidecar-client.ts:54-56 + execution-router.ts:11,141-150 |
|| F25 | P1 | `simplification:sidecar-client:eight-single-call-helpers` | closed | sidecar-client.ts:164-290 |
|| F57 | P1 | `simplification:sidecar-client:terminatechild-duplicate-signal-exit-pattern` | closed | sidecar-client.ts:209-252,483-499 + sidecar-hardening.vitest.ts:404-431 |
|| F62 | P1 | `refinement:sidecar-client:handleresponseline-unsafe-type-assertion` | closed | sidecar-client.ts:597-657 + sidecar-hardening.vitest.ts:473-491 |
|| F73 | P1 | `dead-code:sidecar-client:ready-zero-production-callers` | closed | no `SidecarClient.ready()` or sidecar-hardening `.ready()` callers remain |
|| F91 | P1 | `refinement:sidecar-client:embed-validation-cascade` | closed | sidecar-client.ts:276-290,340-367 |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L2: Architecture Verification

- [x] CHK-ARCH-001 [P1] Sidecar client implements the execution adapter surface without the readiness API.
- [x] CHK-ARCH-002 [P1] Termination keeps F79 single-promise lifecycle while adding F57 single helper sequencing.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L2: Performance Verification

- [x] CHK-PERF-001 [P1] `embed()` rejects oversized batches before spawning or dispatching worker requests.
- [x] CHK-PERF-002 [P2] Response validation adds bounded discriminator/vector checks only per completed line.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L2: Deployment Readiness

- [x] CHK-DEPLOY-001 [P1] Full embedders vitest, typecheck, alignment check, and strict validation pass.
- [x] CHK-DEPLOY-002 [P1] Commit handoff lists every modified or created file by absolute path.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L2: Compliance Verification

- [x] CHK-COMPLIANCE-001 [P0] `validate.sh <packet> --strict` exits 0.
- [x] CHK-COMPLIANCE-002 [P1] Forbidden source areas remain untouched: sidecar-worker, launcher, reindex, barrel, registry, and schema.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L2: Documentation Verification

- [x] CHK-DOCS-001 [P1] `implementation-summary.md` status is Completed with completion_pct 100.
- [x] CHK-DOCS-002 [P1] `decision-record.md` exists and records the sidecar-client policies.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L2: Sign-Off

- [x] CHK-SIGNOFF-001 [P0] PACKET-010-003-003 handoff summary is present.
- [x] CHK-SIGNOFF-002 [P0] Parent agent can commit without additional scope discovery.
<!-- /ANCHOR:sign-off -->
