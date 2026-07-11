---
title: "Verification Checklist: Completion Evidence Sentinel"
description: "Verification checklist for the completion-evidence sentinel: policy core, both runtime adapters, wiring, and the no-test guarantee. Planning draft, all items pending."
trigger_phrases:
  - "completion evidence sentinel checklist"
  - "completion sentinel verification"
  - "stop hook completion checklist"
  - "sentinel no-test guarantee checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/004-completion-evidence-sentinel"
    last_updated_at: "2026-07-11T06:21:17.573Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 verification checklist for the sentinel"
    next_safe_action: "Keep items pending until the core and adapters are built"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts"
      - ".opencode/plugins/mk-completion-sentinel.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-completion-evidence-sentinel"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Completion Evidence Sentinel

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

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-008 documented in spec.md
- [ ] CHK-002 [P0] Core-plus-two-adapters approach and no-test guarantee defined in plan.md
- [ ] CHK-003 [P1] Dependencies confirmed: Stop owner, check-completion.sh enum, COMPLETION_CLAIM_PATTERN
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The core reads recorded artifacts only and invokes no test, build, or validate.sh
- [ ] CHK-011 [P0] Every error path fails open to a silent `ok`, no throw escapes the core
- [ ] CHK-012 [P1] Adapters append only to the bounded shared log, never stdout or stderr
- [ ] CHK-013 [P1] Core mirrors the dispatch-guard.cjs transport-free decision shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fixture A (completed P0 item lacks an evidence marker) returns advise with EVIDENCE_MISSING
- [ ] CHK-021 [P0] A no-claim last message returns `ok` and never spawns check-completion.sh
- [ ] CHK-022 [P1] Fixture B (full evidence markers) returns `ok`
- [ ] CHK-023 [P1] Level 1 folder with a claim and no implementation-summary.md advises
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for the completion-claim pattern, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the core export, the Stop return field, and the plugin registration.
- [ ] CHK-FIX-004 [P0] The exit-code trap is covered: check-completion.sh exit 1 for both incomplete and missing checklist is parsed from JSON, never the exit code.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (runtime times folder level times claim presence).
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: a forced internal error still resolves to `ok`.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the core or adapters
- [ ] CHK-031 [P0] The sentinel adds no new execution surface: it reads artifacts and runs one bounded read-only spawn
- [ ] CHK-032 [P1] The bounded log and state dir stay inside the project scratch path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, and tasks synchronized
- [ ] CHK-041 [P1] Core comments explain the fail-open and no-test invariants
- [ ] CHK-042 [P2] plugins/README.md updated with the new plugin
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
| P0 Items | 15 | 0 / 15 |
| P1 Items | 23 | 0 / 23 |
| P2 Items | 9 | 0 / 9 |

**Verification Date**: Not yet verified (planning draft, not implemented)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] Both ADRs have a status of Proposed or Accepted
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path noted: the future enforce posture is gated on a tighter detector
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] The check-completion.sh spawn stays under 1.5s (NFR-P01)
- [ ] CHK-111 [P1] The Claude adapter fits inside the 10s async Stop budget
- [ ] CHK-112 [P2] The bounded advisory log rotates without unbounded growth
- [ ] CHK-113 [P2] Dedup keeps repeated identical claims to a single advisory
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented: revert the Stop insert and rebuild dist
- [ ] CHK-121 [P0] Dist rebuilt so the compiled Stop hook matches source
- [ ] CHK-122 [P1] Dist-freshness guard and validate.sh staleness backstop pass after the rebuild
- [ ] CHK-123 [P1] Advisory log is bounded and rotates via a throttled sweep
- [ ] CHK-124 [P2] Future SPECKIT_COMPLETION_SENTINEL_ENFORCE kill-switch documented as out of scope for v1
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] The sentinel introduces no new execution surface: reads only, one bounded read-only spawn
- [ ] CHK-131 [P1] No secrets or credentials touched by the core or adapters
- [ ] CHK-132 [P2] The OpenCode plugin uses a single default export with no named exports
- [ ] CHK-133 [P2] The core never writes stdout or stderr on any path
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Verified source citations resolve on disk
- [ ] CHK-142 [P2] Changelog entry added for this phase
- [ ] CHK-143 [P2] Continuity frontmatter refreshed on save
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pending assignment | Technical Lead | [ ] Pending | |
| Pending assignment | Packet 134 Owner | [ ] Pending | |
| Pending assignment | Reviewer | [ ] Pending | |
<!-- /ANCHOR:sign-off -->
