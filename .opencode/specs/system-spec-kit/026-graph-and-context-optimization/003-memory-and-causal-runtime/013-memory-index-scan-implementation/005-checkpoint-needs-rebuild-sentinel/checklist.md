---
title: "Verification Checklist: checkpoint-v2 .needs-rebuild Sentinel"
description: "Verification Date: 2026-06-02. Mark [x] only with evidence (test name + pass count, or file:line). Maps to spec Acceptance Criteria REQ-001..REQ-006."
trigger_phrases:
  - "checkpoint needs-rebuild sentinel"
  - "post-restore derived rebuild failure"
  - "checkpoint sentinel checklist"
  - "sentinel verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored sentinel verification checklist from follow-up research"
    next_safe_action: "Mark CHK items with evidence after implementation"
    blockers: []
    key_files:
      - "mcp_server/lib/storage/checkpoints.ts"
      - "mcp_server/context-server.ts"
      - "mcp_server/handlers/memory-index.ts"
      - "mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-sentinel-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: checkpoint-v2 .needs-rebuild Sentinel

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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-006). _Evidence:_
- [ ] CHK-002 [P0] Technical approach defined in plan.md (shared helper + sentinel + boot/scan repair). _Evidence:_
- [ ] CHK-003 [P1] Dependencies identified and available (checkpoints.ts, context-server.ts, memory-index.ts, vector-index-store.ts). _Evidence:_
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Touched TS passes scoped typecheck (no new errors). _Evidence:_
- [ ] CHK-011 [P0] No console errors or warnings introduced on the boot/scan path. _Evidence:_
- [ ] CHK-012 [P1] Repair is non-fatal: rebuild errors are caught and logged, never thrown to boot/scan. _Evidence:_
- [ ] CHK-013 [P1] One shared derived-rebuild helper is reused by restore, boot, and scan (no duplicated rebuild body). _Evidence:_
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 sentinel-on-failure, REQ-002 repair-clears, REQ-003 shared helper). _Evidence:_
- [ ] CHK-021 [P0] Forced rebuild failure writes `.needs-rebuild` and the restore still returns success. _Evidence:_
- [ ] CHK-022 [P1] A failed repair retains the sentinel and never blocks boot or scan (REQ-004). _Evidence:_
- [ ] CHK-023 [P1] Swap-done journal recovery without rebuild evidence preserves/creates rebuild-needed state (REQ-006). _Evidence:_
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (`runPostRestoreRebuilds|rebuildDerived|rebuildCommunities|rebuildFts`).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the rebuild summary, the sentinel helpers, and the scan response counts.
- [ ] CHK-FIX-004 [P0] Path/marker handling: the `.needs-rebuild` path resolves beside the restore-journal artifacts; write-on-failure and clear-on-success are covered by tests.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (outcome x site).
- [ ] CHK-FIX-006 [P1] Boot/scan timing variant exercised: sentinel present at boot AND present at the pre-scan checkpoint.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced. _Evidence:_
- [ ] CHK-031 [P0] Sentinel path is resolved safely beside existing restore artifacts (no path traversal). _Evidence:_
- [ ] CHK-032 [P1] The repair path never mutates the restored base snapshot. _Evidence:_
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the implemented behavior. _Evidence:_
- [ ] CHK-041 [P1] No code comment embeds spec paths / packet ids / phase numbers / ADR-REQ-CHK-task ids (durable WHY only). _Evidence:_
- [ ] CHK-042 [P2] Implementation-summary updated with shipped state + evidence. _Evidence:_
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. _Evidence:_
- [ ] CHK-051 [P1] scratch/ cleaned before completion. _Evidence:_
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-06-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-1..ADR-4). _Evidence:_
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted). _Evidence:_
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (fail-restore, status-quo). _Evidence:_
- [ ] CHK-103 [P2] Migration path documented (N/A - no schema change). _Evidence:_
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] No-sentinel hot path adds only a cheap existence probe (NFR-P01). _Evidence:_
- [ ] CHK-111 [P1] Bounded rebuild runs only when the sentinel is present. _Evidence:_
- [ ] CHK-112 [P2] Boot/startup timing observed with the sentinel present. _Evidence:_
- [ ] CHK-113 [P2] Repair work bound documented. _Evidence:_
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (branch revert; no deploy occurred). _Evidence:_
- [ ] CHK-121 [P0] Deploy boundary respected: no `dist/` rebuild, no daemon restart, no live-DB access. _Evidence:_
- [ ] CHK-122 [P1] Repair logging is sufficient to observe sentinel write/clear cycles. _Evidence:_
- [ ] CHK-123 [P1] Runbook note: deleting the marker file is safe. _Evidence:_
- [ ] CHK-124 [P2] Deployment runbook reviewed. _Evidence:_
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (path safety, no snapshot mutation). _Evidence:_
- [ ] CHK-131 [P1] No new dependency licenses introduced. _Evidence:_
- [ ] CHK-132 [P2] OWASP Top 10 not applicable (local marker, no external surface) - documented. _Evidence:_
- [ ] CHK-133 [P2] Data handling unchanged (no new persisted user data). _Evidence:_
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized. _Evidence:_
- [ ] CHK-141 [P1] API documentation N/A (no public API change) - noted. _Evidence:_
- [ ] CHK-142 [P2] Operator-facing note on the sentinel marker added where appropriate. _Evidence:_
- [ ] CHK-143 [P2] Knowledge transfer captured in implementation-summary.md. _Evidence:_
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
