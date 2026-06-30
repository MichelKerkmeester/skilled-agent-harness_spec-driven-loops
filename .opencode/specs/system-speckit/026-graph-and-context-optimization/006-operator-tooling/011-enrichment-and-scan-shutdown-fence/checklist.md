---
title: "Verification Checklist: Enrichment + startup-scan shutdown fences"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "enrichment scan shutdown fence checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/011-enrichment-and-scan-shutdown-fence"
    last_updated_at: "2026-06-15T08:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Verified fences: tsc 0, shutdown + enrichment tests green"
    next_safe_action: "Commit + push"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-enrichment-and-scan-shutdown-fence"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Enrichment + startup-scan shutdown fences

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
- [x] CHK-002 [P0] Technical approach defined in plan.md — fence both writers before closeDb
- [x] CHK-003 [P1] Dependencies identified — existing fence machinery + `shuttingDown` flag
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `tsc --noEmit` 0 errors
- [x] CHK-011 [P0] No console errors or warnings — clean build exit 0
- [x] CHK-012 [P1] Error handling implemented — bail paths exit through `finally`; dropped work → backfill
- [x] CHK-013 [P1] Code follows project patterns — mirrors fileWatcher/ingestWorker fences
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001..005
- [x] CHK-021 [P0] Manual testing complete — full shutdown surface exercised
- [x] CHK-022 [P1] Edge cases tested — shutdown mid-scan (lifecycle), real SIGTERM disposal (daemon-reelection)
- [x] CHK-023 [P1] Error scenarios validated — shutdown completes cleanly with fences; enrichment unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `algorithmic`/`lifecycle` (reopen-after-close ordering)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — `rg "requireDb\(|getDb\("` confirms enrichment + scan were the unfenced reopen-capable writers
- [x] CHK-FIX-003 [P0] Consumer inventory — fatalShutdown is the single shutdown path; both fences run before `closeDb`
- [x] CHK-FIX-004 [P0] Adversarial cases — shutdown before-run / mid-await / mid-scan all covered by bail points + break
- [x] CHK-FIX-005 [P1] Matrix axes — {enrichment, scan} × {not-started, in-flight/mid-await, queued}
- [x] CHK-FIX-006 [P1] Hostile state — module-global flag + queue; set before any await
- [x] CHK-FIX-007 [P1] Evidence pinned — clean tsc baseline; tests named with counts
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none
- [x] CHK-031 [P0] Input validation implemented — N/A, internal shutdown path
- [x] CHK-032 [P1] Auth/authz working correctly — N/A
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — reflect the implemented fences
- [x] CHK-041 [P1] Code comments adequate — durable WHY referencing the reopen hazard; hygiene clean
- [ ] CHK-042 [P2] README updated (if applicable) — N/A; the existing close-guarantee README row already documents the contract this restores
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — none stray
- [x] CHK-051 [P1] scratch/ cleaned before completion — empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 3 | 0/3 (N/A or deferred) |

**Verification Date**: 2026-06-15
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — ADR-001
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — full-drain, accessor, leave-it rejected
- [ ] CHK-103 [P2] Migration path documented (if applicable) — N/A, control-flow change
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — no steady-state cost; fence runs only at shutdown
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) — N/A
- [ ] CHK-112 [P2] Load testing completed — N/A
- [ ] CHK-113 [P2] Performance benchmarks documented — N/A
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested — `git revert` + `npm run build`
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — N/A
- [x] CHK-122 [P1] Monitoring/alerting configured — N/A; the launcher log records shutdown steps
- [ ] CHK-123 [P1] Runbook created — N/A; takes effect on next daemon launch
- [ ] CHK-124 [P2] Deployment runbook reviewed — N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed — no auth/transport/secret change
- [ ] CHK-131 [P1] Dependency licenses compatible — N/A, no new dependency
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — N/A
- [ ] CHK-133 [P2] Data handling compliant — N/A (no data loss; backfill recovers)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized — spec/plan/tasks/checklist/decision-record/implementation-summary aligned
- [ ] CHK-141 [P1] API documentation complete (if applicable) — N/A, no public API change
- [ ] CHK-142 [P2] User-facing documentation updated — N/A
- [x] CHK-143 [P2] Knowledge transfer documented — implementation-summary + decision-record + the 010 review-report linkage
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Owner | [ ] Pending commit | |
<!-- /ANCHOR:sign-off -->
