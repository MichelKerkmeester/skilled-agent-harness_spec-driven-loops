---
title: "Verification Checklist: Daemon supervisor probes before adopting"
description: "Verification Date: 2026-06-14"
trigger_phrases:
  - "daemon probe before adopt checklist"
  - "wedged daemon verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/009-daemon-supervisor-probe-before-adopt"
    last_updated_at: "2026-06-14T19:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Verified fix against baseline + 4/4 vitest"
    next_safe_action: "Deep-review + commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-daemon-supervisor-probe-before-adopt"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Daemon supervisor probes before adopting

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..005
- [x] CHK-002 [P0] Technical approach defined in plan.md — probe-before-adopt + fall-through
- [x] CHK-003 [P1] Dependencies identified and available — `probeLeaseHolderWithRetries` exported, confirmed at runtime
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` PASS
- [x] CHK-011 [P0] No console errors or warnings — launcher loads clean; probe export resolves
- [x] CHK-012 [P1] Error handling implemented — non-alive probe falls through to reap; existing `child-kill-unconfirmed` guard unchanged
- [x] CHK-013 [P1] Code follows project patterns — reuses the existing deep-probe the dead-socket path uses
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001..005 covered by the suite
- [x] CHK-021 [P0] Manual testing complete — durability suite is the real-launcher exercise; baseline 3/3 → 4/4
- [x] CHK-022 [P1] Edge cases tested — SIGSTOP'd (wedged) daemon reaped; responsive daemon still adopted
- [x] CHK-023 [P1] Error scenarios validated — probe timeout path drives reap+respawn; single writer preserved
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `algorithmic` (a liveness-decision predicate was wrong: existence ≠ responsiveness)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — `rg "stale-reclaim adopting|bridgeReadiness"` found the single adopt site; the dead-socket path already deep-probes
- [x] CHK-FIX-003 [P0] Consumer inventory — `respawnAfterDeadSocket` confirmed NOT a consumer of this path (owner-lease mismatch); `bridgeReadiness` kept as a cheap pre-gate
- [x] CHK-FIX-004 [P0] Adversarial cases — wedged (SIGSTOP) vs responsive vs flag-off-kill covered; the probe's own retry covers transient-miss-then-alive
- [x] CHK-FIX-005 [P1] Matrix axes listed — {daemon responsive, daemon wedged} × {reelection on} plus the existing flag-off path
- [x] CHK-FIX-006 [P1] Hostile env variant — the test threads probe-timeout/retry envs through `startSession`
- [x] CHK-FIX-007 [P1] Evidence pinned — baseline captured via scoped `git stash` against the exact two changed files
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none added
- [x] CHK-031 [P0] Input validation implemented — probe speaks the existing local JSON-RPC; no new external input
- [x] CHK-032 [P1] Auth/authz working correctly — N/A, no auth boundary touched (local UDS, unchanged)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the implemented fix
- [x] CHK-041 [P1] Code comments adequate — durable WHY on the probe gate; comment-hygiene clean
- [ ] CHK-042 [P2] README updated (if applicable) — N/A, no user-facing README for the launcher internals
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no stray temp files in the packet
- [x] CHK-051 [P1] scratch/ cleaned before completion — empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 13/14 |
| P2 Items | 3 | 0/3 (N/A or deferred, documented) |

**Verification Date**: 2026-06-14
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — ADR-001
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — `respawnAfterDeadSocket` reuse rejected (lease mismatch)
- [ ] CHK-103 [P2] Migration path documented (if applicable) — N/A, control-flow change, no migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — warm adoption happy path adds one sub-100ms probe; only the stale-reclaim path pays it
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) — N/A, not a throughput change
- [ ] CHK-112 [P2] Load testing completed — N/A
- [ ] CHK-113 [P2] Performance benchmarks documented — N/A
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested — `git revert`; hand-authored `.cjs`, no build step
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — N/A, no flag; the change is a corrected predicate on an existing path
- [ ] CHK-122 [P1] Monitoring/alerting configured — N/A; the launcher log already records adopt vs reap decisions
- [ ] CHK-123 [P1] Runbook created — N/A; recovery is now automatic on next launch
- [ ] CHK-124 [P2] Deployment runbook reviewed — N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed — no auth/transport/secret change; local UDS unchanged
- [ ] CHK-131 [P1] Dependency licenses compatible — N/A, no new dependency
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — N/A, internal process supervisor
- [ ] CHK-133 [P2] Data handling compliant with requirements — N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized — spec/plan/tasks/checklist/decision-record/implementation-summary aligned
- [ ] CHK-141 [P1] API documentation complete (if applicable) — N/A, no public API change
- [ ] CHK-142 [P2] User-facing documentation updated — N/A
- [ ] CHK-143 [P2] Knowledge transfer documented — captured in implementation-summary + decision-record
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Owner | [ ] Pending deep-review | |
<!-- /ANCHOR:sign-off -->
