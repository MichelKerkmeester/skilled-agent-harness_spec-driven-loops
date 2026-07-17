---
title: "Verification Checklist: Ledger v2 Schema and Identity-Verified PID Helpers"
description: "Level 2 verification checklist for arc 010/005/001 ledger v2 owner identity foundation."
trigger_phrases:
  - "arc 010 005 001 checklist"
  - "ledger v2 identity pid checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid"
    last_updated_at: "2026-05-23T11:30:00Z"
    last_updated_by: "codex"
    recent_action: "completed-ledger-v2-checklist"
    next_safe_action: "Parent agent commit handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100050010100050010100050010100050010100050010100050010100050010"
      session_id: "010-005-001-ledger-v2-identity-pid"
      parent_session_id: null
    completion_pct: 100
---

# Verification Checklist: Ledger v2 Schema and Identity-Verified PID Helpers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

|| Priority | Handling | Completion Impact |
||----------|----------|-------------------|
|| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
|| **[P1]** | Required | Must complete or document a blocking reason |
|| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Binding ADRs and F69/F102 precedent read.
- [x] CHK-004 [P0] Initial scaffold strict validation exits 0 before source edits; evidence: `validate.sh <packet> --strict` exit 0 before source edits.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `sidecar_ledger.py` writes ADR-003 v2 payload; evidence: `sidecar_ledger.py:22`, `sidecar_ledger.py:116`, `sidecar_ledger.py:148`, `sidecar_ledger.py:363`.
- [x] CHK-011 [P0] v1 ledger rows read without breaking; evidence: `sidecar_ledger.py:128`, `sidecar_ledger.py:338`, `sidecar_ledger.py:587`, `test_sidecar_ledger.py:318`.
- [x] CHK-012 [P0] Owner prune/register helpers run under `fcntl.flock(LOCK_EX)`; evidence: `sidecar_ledger.py:184`, `sidecar_ledger.py:406`, `sidecar_ledger.py:447`.
- [x] CHK-013 [P1] Unknown liveness errno logs to stderr and fails open; evidence: `sidecar_ledger.py:313`, `sidecar_ledger.py:318`, `test_sidecar_ledger.py:242`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `TestLedgerV2Schema` covers schema write/read behavior; evidence: `test_sidecar_ledger.py:116`.
- [x] CHK-021 [P0] `TestIdentityVerifiedLiveness` covers all liveness reasons; evidence: `test_sidecar_ledger.py:163`.
- [x] CHK-022 [P0] `TestOwnerPruneAndRegister` covers stale pruning and idempotent registration; evidence: `test_sidecar_ledger.py:253`.
- [x] CHK-023 [P0] `TestV1BackwardCompat` covers missing/version 1 ledgers; evidence: `test_sidecar_ledger.py:321`.
- [x] CHK-024 [P0] `TestFixtureMatrix` consumes shared JSON fixture cases; evidence: `test_sidecar_ledger.py:351`, `reaper-ledger-cases.json:1`.
- [x] CHK-025 [P0] Targeted pytest exits 0; evidence: 22 tests passed, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Ledger v2 schema implemented with owner identities; evidence: `sidecar_ledger.py:62`, `sidecar_ledger.py:116`, `sidecar_ledger.py:367`.
- [x] CHK-FIX-002 [P0] Identity-verified PID liveness implemented with ADR-002 reasons; evidence: `sidecar_ledger.py:37`, `sidecar_ledger.py:240`, `sidecar_ledger.py:295`.
- [x] CHK-FIX-003 [P0] Lock-backed owner prune/register helpers implemented; evidence: `sidecar_ledger.py:184`, `sidecar_ledger.py:406`, `sidecar_ledger.py:447`.
- [x] CHK-FIX-004 [P0] Shared cross-runtime fixture matrix created; evidence: `reaper-ledger-cases.json:1`, `reaper-ledger-cases.json:4`, `reaper-ledger-cases.json:243`.
- [x] CHK-FIX-005 [P0] v1 compatibility preserved; evidence: `sidecar_ledger.py:587`, `test_sidecar_ledger.py:321`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] PID reuse cannot be classified as live when recorded identity mismatches current `ps` identity; evidence: `sidecar_ledger.py:326`, `sidecar_ledger.py:329`, `test_sidecar_ledger.py:214`.
- [x] CHK-031 [P0] PID 1 is treated as orphaned/dead for owner liveness; evidence: `sidecar_ledger.py:301`, `test_sidecar_ledger.py:231`.
- [x] CHK-032 [P1] EPERM remains fail-open only when identity handling does not prove recycling; evidence: `sidecar_ledger.py:311`, `sidecar_ledger.py:326`, `test_sidecar_ledger.py:189`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized.
- [x] CHK-041 [P1] Implementation summary includes verification table and commit handoff.
- [x] CHK-042 [P2] Sandbox-blocked `ps` empirical check is documented honestly; evidence: `implementation-summary.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Modified files are limited to approved source, test, fixture, and packet docs.
- [x] CHK-051 [P1] `scratch/.gitkeep` exists and no temporary files remain.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

|| Item | Severity | Status | Evidence |
||------|----------|--------|----------|
|| Ledger v2 schema | P0 | closed | sidecar_ledger.py:62-159,363-367 |
|| Identity liveness | P0 | closed | sidecar_ledger.py:37-44,240-331 |
|| Owner prune/register | P0 | closed | sidecar_ledger.py:184-194,406-473 |
|| Fixture matrix | P0 | closed | reaper-ledger-cases.json:1-274; test_sidecar_ledger.py:351-364 |
|| v1 compatibility | P0 | closed | sidecar_ledger.py:587-595; test_sidecar_ledger.py:321-348 |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L2: Architecture Verification

- [x] CHK-ARCH-001 [P1] ADR-003 `ownerToken` and owner identities both remain present.
- [x] CHK-ARCH-002 [P1] ADR-005 fixture matrix can be consumed without Python-specific types.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L2: Performance Verification

- [x] CHK-PERF-001 [P1] Owner pruning performs one locked read/write cycle per helper invocation.
- [x] CHK-PERF-002 [P2] Fixture tests mock `ps` and do not spawn process trees.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L2: Deployment Readiness

- [x] CHK-DEPLOY-001 [P1] Later launcher phases can call stable owner register/prune/reap helpers.
- [x] CHK-DEPLOY-002 [P1] Commit handoff lists every modified or created file by absolute path.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L2: Compliance Verification

- [x] CHK-COMPLIANCE-001 [P0] `validate.sh <packet> --strict` exits 0 after scaffold.
- [x] CHK-COMPLIANCE-002 [P0] `validate.sh <packet> --strict` exits 0 after final docs.
- [x] CHK-COMPLIANCE-003 [P1] No forbidden files are modified.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L2: Documentation Verification

- [x] CHK-DOCS-001 [P1] `implementation-summary.md` status is Completed with completion_pct 100 after verification.
- [x] CHK-DOCS-002 [P1] `decision-record.md` records no ADR changes unless implementation surfaces a refinement.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L2: Sign-Off

- [x] CHK-SIGNOFF-001 [P0] PACKET-010-005-001 handoff summary is present.
- [x] CHK-SIGNOFF-002 [P0] Parent agent can commit without additional scope discovery.
<!-- /ANCHOR:sign-off -->
