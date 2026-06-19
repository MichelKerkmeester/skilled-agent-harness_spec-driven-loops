---
title: "Verification Checklist: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "P0/P1/P2 verification gates for the implemented Code Graph schema foundation: code_edges valid_at/invalid_at, SCHEMA_VERSION 6->7, UP/DOWN/BACKFILL, idempotent fail-closed migration tests, fresh init, and default-off temporal read consumption."
trigger_phrases:
  - "code edge bitemporal checklist"
  - "q1-c1 cluster verification"
  - "apply-once g2 invariant checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/004-code-edge-bitemporal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified code-edge bitemporal schema foundation"
    next_safe_action: "Keep consumer behavior default-off until explicitly benchmarked"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Phase posture**: the schema foundation is implemented. Temporal read/write consumers remain default-off and gated for a later benchmarked consumer path.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (schema foundation done; consumers gated)
- [x] CHK-002 [P0] Original DEFER decision recorded with evidence; user amendment unblocked schema foundation only
- [x] CHK-003 [P1] Sequencing defined in plan.md; schema foundation now precedes any consumer behavior
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Production code changed only in `system-code-graph/mcp_server/lib/code-graph-db.ts`
- [x] CHK-011 [P1] Typecheck passes (`npm run typecheck` in `system-code-graph`)
- [x] CHK-012 [P1] Additive columns are nullable and forward-compatible; no default reader is rerouted
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Migration test covers UP applies and fresh init
- [x] CHK-021 [P0] Migration test covers DOWN, BACKFILL, idempotent rerun, and fail-closed behavior
- [x] CHK-022 [P1] Default read consumption stays off behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`
- [x] CHK-023 [P1] As-of/timeline behavior remains gated and unshipped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Schema foundation class verified: additive migration + default-off consumer seam
- [x] CHK-FIX-002 [P0] Reindex producer behavior deliberately unchanged by default
- [x] CHK-FIX-003 [P0] Consumer behavior deliberately unchanged by default; flag seam added
- [x] CHK-FIX-004 [P0] Adversarial migration cases tested: rollback, rerun, missing required table, fresh init
- [x] CHK-FIX-005 [P1] Matrix axes scoped to schema foundation: {legacy DB | fresh DB} × {up | down | rerun | backfill}
- [x] CHK-FIX-006 [P1] Wider consumer gate remains explicit: no default behavior change without benchmark
- [x] CHK-FIX-007 [P1] Evidence pinned in spec/tasks/summary and focused test output
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced
- [x] CHK-031 [P0] Temporal columns carry generation values only — no recalled-content surface
- [x] CHK-032 [P1] No new untrusted-content read path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/tasks/checklist/implementation-summary synchronized for schema foundation
- [x] CHK-041 [P1] Wider consumer deferral remains documented; schema foundation marked done
- [x] CHK-042 [P2] Comment hygiene checked on modified code/test files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No packet temp files created outside scratch/
- [x] CHK-051 [P1] No scratch cleanup required
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [x]/11 |
| P1 Items | 12 | [x]/12 |
| P2 Items | 2 | [x]/2 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented; schema-foundation amendment captured in spec/tasks/summary
- [x] CHK-101 [P1] All ADRs have status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented: columns additive/nullable, UP/DOWN/BACKFILL, SCHEMA_VERSION 6->7
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Runtime read/write behavior unchanged by default
- [x] CHK-111 [P2] No as-of read path added
- [x] CHK-112 [P2] No default behavior benchmark claimed
- [x] CHK-113 [P2] Benefit number not claimed
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback helper implemented: `rollbackCodeEdgeBitemporalSchema`
- [x] CHK-121 [P1] Consumer behavior remains gated/default-off
- [x] CHK-122 [P2] No new monitoring surface introduced
- [x] CHK-123 [P2] Branch-only; nothing pushed/deployed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] No new untrusted-content read path
- [x] CHK-131 [P2] No new external dependency / license surface
- [x] CHK-132 [P2] Temporal columns carry generation values only — no PII / content
- [x] CHK-133 [P2] Data handling limited to code-edge schema metadata
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] spec/tasks/checklist/implementation-summary synchronized
- [x] CHK-141 [P1] Schema foundation DONE; wider consumers gated
- [x] CHK-142 [P2] Standalone-REFUTED note preserved
- [x] CHK-143 [P2] Research citations preserved where still relevant
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Pending] | Code Graph maintainer | [ ] Approved | |
| [Pending] | 028 packet owner | [ ] Approved | |
| [Pending] | Reviewer (adversarial verify) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
