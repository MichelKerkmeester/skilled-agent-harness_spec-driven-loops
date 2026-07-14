---
title: "Verification Checklist: Eval Loop"
description: "Checklist for loop runner + convergence + iteration run + synthesis"
trigger_phrases:
  - "113/003 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/018-cli-devin-prompt-quality/003-eval-loop"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded checklist.md"
    next_safe_action: "Verify items after loop run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114033"
      session_id: "114-003-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Eval Loop

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

- [ ] CHK-001 [P0] 001 council-report.md ratified
- [ ] CHK-002 [P0] 002 dry-run gate green
- [ ] CHK-003 [P0] cli-devin authenticated + SWE 1.6 access confirmed
- [ ] CHK-003b [P1] Grader CLI authenticated
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All .cjs scripts pass `node --check`
- [ ] CHK-011 [P0] No console warnings during dry-mock run
- [ ] CHK-012 [P1] 7-mode failure handlers explicit (not generic try/catch)
- [ ] CHK-013 [P1] State JSONL schema documented inline
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 REQs (001..009) satisfied
- [ ] CHK-021 [P0] Final synthesis.md exists with ≥ 3 ranked variants
- [ ] CHK-022 [P1] Pause-resume integration test passes
- [ ] CHK-023 [P1] Force-kill recovery test passes (no torn rows)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — greenfield loop (no fixes)
- [ ] CHK-FIX-002 [P0] N/A
- [ ] CHK-FIX-003 [P0] N/A
- [ ] CHK-FIX-004 [P0] N/A
- [ ] CHK-FIX-005 [P1] N/A
- [ ] CHK-FIX-006 [P1] N/A
- [ ] CHK-FIX-007 [P1] N/A
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Variant prompts scrubbed of secrets before SWE 1.6 dispatch
- [ ] CHK-031 [P0] No grader prompt injection (variant content quoted, not interpolated)
- [ ] CHK-032 [P1] State JSONL not world-readable if sensitive (operator policy)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] All packet spec docs synchronized
- [ ] CHK-041 [P1] Synthesis.md reference each ranking with confidence + insight
- [ ] CHK-042 [P2] Inline comments on non-obvious convergence-weight tuning
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Iteration files numbered 001.., no gaps
- [ ] CHK-051 [P1] State/in-flight/ cleaned after run completes (resume markers gone)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-16
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (3-signal convergence) documented
- [ ] CHK-101 [P1] ADR Status field set
- [ ] CHK-102 [P1] Alternatives documented
- [ ] CHK-103 [P2] N/A — no migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] NFR-P01: single iteration < 15 min typical
- [ ] CHK-111 [P1] NFR-P02: state append < 100ms p99
- [ ] CHK-112 [P2] N/A — no throughput target
- [ ] CHK-113 [P2] Wall-clock benchmark logged in implementation-summary
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback (rm -rf state + restart) documented
- [ ] CHK-121 [P0] No feature flags applicable
- [ ] CHK-122 [P1] Cache size visible in dashboard.md
- [ ] CHK-123 [P1] Runbook (pause-resume procedure) documented
- [ ] CHK-124 [P2] N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No external license concerns
- [ ] CHK-131 [P1] N/A
- [ ] CHK-132 [P2] N/A
- [ ] CHK-133 [P2] N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] Spec docs synchronized post-loop-run
- [ ] CHK-141 [P1] N/A — no API
- [ ] CHK-142 [P2] N/A
- [ ] CHK-143 [P2] N/A
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| n/a | Product Owner | [ ] Approved | |
| n/a | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
