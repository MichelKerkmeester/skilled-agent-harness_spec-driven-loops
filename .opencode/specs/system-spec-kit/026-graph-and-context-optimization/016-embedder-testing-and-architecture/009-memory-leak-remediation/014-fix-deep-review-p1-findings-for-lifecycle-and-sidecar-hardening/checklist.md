---
title: "Checklist: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening"
description: "Verification ledger with one row per active arc 009 deep-review finding."
trigger_phrases:
  - "arc 009 phase 014 checklist"
  - "deep review finding checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening"
    last_updated_at: "2026-05-22T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-phase-014-finding-checklist"
    next_safe_action: "fill-checklist-evidence-during-batch-implementation"
    blockers: []
    key_files:
      - "checklist.md"
      - "../review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0140140140140140140140140140140140140140140140140140140140140140"
      session_id: "009-memory-leak-remediation-014"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->
# Checklist: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P1** | Required | Must close or have explicit parent-approved deferral before phase completion. |
| **P2** | Advisory | Can defer with rationale, owner, and reopen trigger. |

Status values: `open`, `closed`, `deferred`, `blocked`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P1] Registry, report, and resource map are read before implementation.
- [ ] CHK-002 [P1] Batch scope is selected from `scratch/batch-plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] Shared ownership helpers or parity tests cover mirrored protocols.
- [ ] CHK-011 [P1] No implementation batch modifies review artifacts.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P1] Batch-specific Vitest/pytest/shell tests pass.
- [ ] CHK-021 [P1] Touched phase docs pass strict validation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

### Finding Ledger

| Finding ID | Severity | Batch | Status | Evidence |
|------------|----------|-------|--------|----------|
| DR009-COR-001 | P1 | B1 | open | TBD: commit hash + deep-loop lock concurrent test |
| DR009-COR-002 | P1 | B1 | open | TBD: commit hash + Code Graph lease parity test |
| DR009-COR-013 | P1 | B1 | open | TBD: commit hash + CocoIndex cancel identity test |
| DR009-COR-014 | P1 | B1 | open | TBD: commit hash + rerank ledger concurrency test |
| DR009-COR-015 | P1 | B1 | open | TBD: commit hash + heartbeat lease-transfer test |
| DR009-MNT-002 | P1 | B1 | open | TBD: commit hash + shared/parity lease evidence |
| DR009-COR-003 | P1 | B2 | open | TBD: commit hash + shutdown hook signal test |
| DR009-COR-005 | P1 | B2 | open | TBD: commit hash + cancelled update pytest |
| DR009-COR-007 | P1 | B2 | open | TBD: commit hash + refresh active-work pytest |
| DR009-COR-008 | P1 | B2 | open | TBD: commit hash + embedder timeout cleanup test |
| DR009-COR-009 | P1 | B2 | open | TBD: commit hash + rerank warmup timeout test |
| DR009-COR-010 | P1 | B2 | open | TBD: commit hash + Project.close failure test |
| DR009-COR-012 | P2 | B2 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-003 | P1 | B2 | open | TBD: commit hash + duplicate task ID test |
| DR009-SEC-001 | P1 | B3 | open | TBD: commit hash + rerank API-key startup test |
| DR009-SEC-002 | P1 | B3 | open | TBD: commit hash + warmup auth/rate test |
| DR009-SEC-003 | P1 | B3 | open | TBD: commit hash + ownership proof test |
| DR009-SEC-004 | P1 | B3 | open | TBD: commit hash + stale identity retention test |
| DR009-SEC-005 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-SEC-006 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-SEC-007 | P1 | B3 | open | TBD: commit hash + DB override containment test |
| DR009-SEC-008 | P1 | B3 | open | TBD: commit hash + document-byte cap test |
| DR009-SEC-009 | P1 | B3 | open | TBD: commit hash + ledger identity kill test |
| DR009-SEC-010 | P1 | B3 | open | TBD: commit hash + CocoIndex binary containment test |
| DR009-SEC-011 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-SEC-012 | P1 | B3 | open | TBD: commit hash + executor env allowlist test |
| DR009-SEC-013 | P1 | B3 | open | TBD: commit hash + NODE_OPTIONS dotenv test |
| DR009-SEC-014 | P1 | B3 | open | TBD: commit hash + arg-array git diff test |
| DR009-SEC-015 | P1 | B3 | open | TBD: commit hash + process inventory redaction test |
| DR009-SEC-016 | P1 | B3 | open | TBD: commit hash + unpredictable token test |
| DR009-SEC-017 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-001 | P1 | B3 | open | TBD: commit hash + helper contract parity test |
| DR009-COR-004 | P1 | B4 | open | TBD: commit hash + corrupt JSONL tail test |
| DR009-COR-006 | P1 | B4 | open | TBD: commit hash + degraded inventory test |
| DR009-COR-016 | P2 | B4 | open | TBD: commit hash or deferral rationale |
| DR009-COR-017 | P2 | B4 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-009 | P1 | B4 | open | TBD: commit hash + executor config schema test |
| DR009-TRC-001 | P1 | B5 | open | TBD: commit hash + supervised executor coverage |
| DR009-TRC-002 | P1 | B5 | open | TBD: commit hash + true concurrent lock fixture |
| DR009-TRC-003 | P1 | B5 | open | TBD: commit hash + queued remove fixture |
| DR009-TRC-004 | P1 | B5 | open | TBD: commit hash + integrated retention workload |
| DR009-TRC-005 | P1 | B5 | open | TBD: commit hash + RSS slope evidence |
| DR009-TRC-006 | P1 | B5 | open | TBD: commit hash + SC-003 reconnect evidence |
| DR009-TRC-007 | P1 | B5 | open | TBD: commit hash + public index_cancel transport test |
| DR009-TRC-009 | P1 | B5 | open | TBD: commit hash + parent-death cleanup evidence |
| DR009-TRC-010 | P1 | B5 | open | TBD: commit hash + macOS child-liveness fixture |
| DR009-TRC-011 | P1 | B5 | open | TBD: commit hash + memory index scan evidence |
| DR009-COR-011 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-TRC-008 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-TRC-012 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-004 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-005 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-006 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-007 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-008 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-010 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-011 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-012 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-013 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-014 | P2 | B6 | open | TBD: commit hash or deferral rationale |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Subprocess environment allowlists are tested where security findings touch spawn paths.
- [ ] CHK-031 [P1] Owner tokens and sensitive command-line values are redacted in operator-facing outputs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `checklist.md` evidence is updated for every closed or deferred finding.
- [ ] CHK-041 [P1] `implementation-summary.md` records final status and residual risk.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Scratch material remains under `scratch/`.
- [ ] CHK-051 [P1] No generated temp files are left in implementation surfaces.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P1] ADR decisions are either accepted or updated with implementation rationale.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-110 [P2] RSS benchmark evidence is recorded for DR009-TRC-005 or explicitly deferred.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [ ] CHK-120 [P1] Parent agent has enough evidence to commit after all batches.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] P1 deferrals, if any, have explicit parent approval.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] Phase 014 and arc 009 parent pass strict validation.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

- [ ] CHK-150 [P1] Parent agent accepts the final batch evidence and handles commit.
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Closed | Deferred | Open |
|----------|-------|--------|----------|------|
| P1 Findings | 40 | 0 | 0 | 40 |
| P2 Findings | 20 | 0 | 0 | 20 |
| Batches | 6 | 0 | 0 | 6 |

**Verification Date**: Not started
**Verified By**: TBD
**ADRs**: 4 proposed in `decision-record.md`
<!-- /ANCHOR:summary -->
