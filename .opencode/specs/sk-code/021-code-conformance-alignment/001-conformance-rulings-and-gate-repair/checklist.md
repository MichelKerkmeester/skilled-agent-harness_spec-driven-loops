---
title: "Verification Checklist: Conformance Rulings and Gate Repair"
description: "Verification Date: TBD"
trigger_phrases:
  - "gate repair checklist"
  - "conformance rulings verification"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/001-conformance-rulings-and-gate-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist for gate repair and rulings"
    next_safe_action: "Leave unchecked until the phase executes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Conformance Rulings and Gate Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] T001 complete: every finding re-confirmed against HEAD, non-reproducing findings struck with evidence
- [ ] CHK-005 [P0] Operator decisions Q2, Q4 and Q5 answered or explicitly deferred with a recorded fallback
- [ ] CHK-006 [P0] Program baseline captured against a clean packet-scoped tree
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — `bash -n` on every touched shell file, `node --check` on every touched JS file, `python3 -m py_compile` on the verifier
- [ ] CHK-011 [P0] No console errors or warnings — the hooks emit no unexpected stderr on a clean edit
- [ ] CHK-012 [P1] Error handling implemented — a missing or non-executable checker produces a visible stderr signal, never a silent exit 0
- [ ] CHK-013 [P1] Code follows project patterns — every file touched here satisfies the file-opening contract it is enforcing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-012 each cite an executed command and its result
- [ ] CHK-021 [P0] Manual testing complete — the live Write-tool smoke blocks a deliberately violating scratch file
- [ ] CHK-022 [P1] Edge cases tested — durable-prose negative fixtures stay clean; exception-class files are skipped with a stated reason
- [ ] CHK-023 [P1] Error scenarios validated — the parse-integrity fixture fails when the adapter is deliberately broken
- [ ] CHK-024 [P0] Each new checker rule has a recorded pre-change failing fixture run
- [ ] CHK-025 [P1] The discovery canary fails when a test directory is hidden from the runner
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — every caller of `check-comment-hygiene.sh` enumerated.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — every doc, gate and CI job naming a changed entry point.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — applied here to the generic-label matcher's adversarial cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — {runtime} × {lifecycle} with one installed path or an explicit "not wired" per cell.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — the hooks read `CLAUDE_PROJECT_DIR`; verify behaviour when it is unset.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented — the checker handles filenames with spaces and non-ASCII without shell-splitting
- [ ] CHK-032 [P1] Auth/authz working correctly — N/A for this phase; recorded as not applicable rather than skipped
- [ ] CHK-033 [P0] No hook change converts fail-open into fail-silent
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate — and free of ephemeral-artifact pointers, per the gate this phase repairs
- [ ] CHK-042 [P2] README updated (if applicable)
- [ ] CHK-043 [P0] Every hook path named in the standard exists and is installed
- [ ] CHK-044 [P0] No pattern in the amended test-filename table globs to zero at HEAD
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 15 | 0/15 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
- [ ] CHK-104 [P0] All six binding rulings recorded with evidence and per-child consequence
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01) — post-edit latency unchanged; the parse check runs in tests, not the hot path
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) — the widened wrapper completes in a duration an operator will tolerate at a completion claim
- [ ] CHK-112 [P2] Load testing completed — N/A
- [ ] CHK-113 [P2] Performance benchmarks documented — wrapper wall-clock recorded before and after the scan-root change
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested — the scan-root revert exercised at least once
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — the exact-header check ships opt-in
- [ ] CHK-122 [P1] Monitoring/alerting configured — N/A; gate output is the signal
- [ ] CHK-123 [P1] Runbook created — the baseline-capture command set is recorded so later children can reproduce it
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed — limited to the fail-open/fail-silent boundary
- [ ] CHK-131 [P1] Dependency licenses compatible — no new dependency introduced
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — N/A
- [ ] CHK-133 [P2] Data handling compliant with requirements — N/A, no data handled
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable) — the verifier's new flag documented in the automation reference
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented — children 002-005 pointed at the baseline and the rulings
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
