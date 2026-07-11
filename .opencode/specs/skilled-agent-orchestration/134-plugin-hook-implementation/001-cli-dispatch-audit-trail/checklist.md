---
title: "Verification Checklist: CLI Dispatch Audit Trail"
description: "Verification checklist for the CLI dispatch audit trail phase. All items unchecked; verification runs after implementation."
trigger_phrases:
  - "cli dispatch audit checklist"
  - "audit trail verification"
  - "dispatch-audit.mjs checklist"
  - "fail-open verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/001-cli-dispatch-audit-trail"
    last_updated_at: "2026-07-11T06:36:07.865Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 verification checklist (all items unchecked, planning stage)"
    next_safe_action: "Leave items unchecked until implementation and tests exist to cite as evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-dispatch-audit-trail"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: CLI Dispatch Audit Trail

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
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Core, plugin, and hook pass lint/format checks
- [ ] CHK-011 [P0] OpenCode plugin writes no stdout/stderr and has exactly one default export
- [ ] CHK-012 [P1] Every audit-path error is caught in try/catch (fail-open)
- [ ] CHK-013 [P1] Code follows the `dispatch-guard.cjs` core-plus-adapter pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria (REQ-001..REQ-007) met
- [ ] CHK-021 [P0] vitest spec passes (match, build, append round-trip, fail-open)
- [ ] CHK-022 [P1] Edge cases tested (empty command, multi-KB command, missing metadata)
- [ ] CHK-023 [P1] Fail-open validated against an unwritable log path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Command redaction: secret-shaped tokens scrubbed and command truncated before logging
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] `plugins/README.md` §3 row added for `mk-cli-dispatch-audit.js`
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
| P0 Items | 15 | 0/15 |
| P1 Items | 22 | 0/22 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Pending (planning stage; not yet implemented)
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
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Hot-path cost is a regex fast-exit only for non-dispatch commands (NFR-P01)
- [ ] CHK-111 [P1] No daemon/MCP/network call from either surface
- [ ] CHK-112 [P2] Log rotation exercised past the size cap
- [ ] CHK-113 [P2] Append latency measured under a long session
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Env kill-switch disables the surface without code changes
- [ ] CHK-122 [P1] `.claude/settings.json` PostToolUse(Bash) entry validated
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (redaction path)
- [ ] CHK-131 [P1] Log contains no unredacted secrets across the adversarial cases
- [ ] CHK-132 [P2] OWASP-style secret-leak checklist completed
- [ ] CHK-133 [P2] Data-handling reviewed for the JSONL log
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Audit-line JSONL schema documented
- [ ] CHK-142 [P2] User-facing telemetry note added (if applicable)
- [ ] CHK-143 [P2] Knowledge transfer documented for phases 002/003 reuse
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | [ ] Approved | |
| Unassigned | Product Owner | [ ] Approved | |
| Unassigned | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
