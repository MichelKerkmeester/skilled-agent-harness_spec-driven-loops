---
title: "Verification Checklist: Portability and False-Green Repair"
description: "Verification Date: TBD"
trigger_phrases:
  - "portability repair checklist"
  - "errexit verification"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/004-portability-and-false-green-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist for portability and false-green repair"
    next_safe_action: "Leave unchecked until the phase executes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Portability and False-Green Repair

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
- [ ] CHK-004 [P0] T001 complete: all seven findings reproduced or struck with evidence
- [ ] CHK-005 [P0] The nine failure-injection cases captured as the pre-change specification
- [ ] CHK-006 [P0] Per-command tolerance inventory exists for each of the three git-coordination scripts
- [ ] CHK-007 [P0] The no-box flowchart fixture added and demonstrated failing before the fix
- [ ] CHK-008 [P1] The two unnamed `git-hooks/lib` shell errors assigned to a child, with the reason recorded
- [ ] CHK-009 [P1] Child 003 confirmed to exclude the three git-coordination scripts
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — `bash -n` plus ShellCheck on every touched shell file, `python3 -m py_compile` on Python, `tsc --noEmit` on the MCP suites
- [ ] CHK-011 [P0] No console errors or warnings introduced
- [ ] CHK-012 [P0] Error handling implemented — every tolerated non-zero exit is an explicit guarded conditional, and the guard is documented in place
- [ ] CHK-013 [P1] Code follows project patterns — derived roots use the canonical resolution pattern, not lexical prefixing
- [ ] CHK-014 [P0] No script is left partially guarded
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-010 each cite an executed command and its result
- [ ] CHK-021 [P0] Manual testing complete — every repaired helper run from a `git worktree` at a different path and through a symlinked path, output identical
- [ ] CHK-022 [P0] Edge cases tested — all nine injection cases match their captured pre-change recording exactly
- [ ] CHK-023 [P0] Error scenarios validated — a deliberately removed fixture produces a named, actionable failure rather than a skip
- [ ] CHK-024 [P0] Zero skipped cases across the repaired Python test and both MCP suites, confirmed by parsing runner output
- [ ] CHK-025 [P1] `.opencode/bin` verifier delta recorded: baseline FAIL/3 errors → PASS/0 errors
- [ ] CHK-026 [P1] The no-box flowchart fixture produces a verdict
- [ ] CHK-027 [P1] The structured return is covered by a test using a path containing a space
- [ ] CHK-028 [P0] The rollback path exercised: one shell-lane commit reverted and its injection cases confirmed against the pre-change specification
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed — `rg -n '/Users/'` for hardcoded roots and a skip inventory for conditional skips, both beyond the named findings.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers — every caller of the function whose return shape changed is updated.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests — path derivation tested against spaces, non-ASCII, a `.git` file rather than directory, and a symlinked checkout.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — {3 scripts} × {3 injected failures} = 9 rows.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — the shell scripts read git and environment state; verified under an unset `CLAUDE_PROJECT_DIR`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — and no remaining hardcoded developer checkout root in this child's scope
- [ ] CHK-031 [P0] Input validation implemented — the structured return does not reintroduce word-splitting where `eval` was removed
- [ ] CHK-032 [P1] Auth/authz working correctly — N/A
- [ ] CHK-033 [P0] Derived roots resolve canonically, so a symlinked checkout cannot escape the intended tree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate — each new guard states why the command's non-zero exit is tolerated, in durable terms with no artifact pointer
- [ ] CHK-042 [P2] README updated (if applicable)
- [ ] CHK-043 [P1] The silent-failure doctrine is cited from its owning program rather than re-derived
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] Temporary worktrees created for portability verification are removed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 16 | 0/16 |
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
- [ ] CHK-103 [P2] Migration path documented (if applicable) — N/A
- [ ] CHK-104 [P0] The command-by-command errexit doctrine is recorded, including why the blanket form was rejected
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01) — guarded conditionals introduce no extra subprocess in the hot path
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) — any suite that became slower because coverage now actually runs has its new runtime recorded, not re-muted
- [ ] CHK-112 [P2] Load testing completed — N/A
- [ ] CHK-113 [P2] Performance benchmarks documented — script wall-clock recorded before and after
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested — exercised on a shell-lane commit, with injection cases re-verified afterwards
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — N/A
- [ ] CHK-122 [P1] Monitoring/alerting configured — N/A; the injection cases are the signal
- [ ] CHK-123 [P1] Runbook created — the injection harness is reusable and documented
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed — covering the removed `eval` and the canonical root resolution
- [ ] CHK-131 [P1] Dependency licenses compatible — no new dependency
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — N/A
- [ ] CHK-133 [P2] Data handling compliant with requirements — N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable) — the changed return shape documented for its callers
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented — the injection harness and the tolerance inventories recorded for reuse
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
