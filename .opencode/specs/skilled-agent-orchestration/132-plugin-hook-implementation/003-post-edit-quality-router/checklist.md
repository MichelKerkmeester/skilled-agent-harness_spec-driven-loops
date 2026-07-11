---
title: "Verification Checklist: Unified Post-Edit Quality Router"
description: "Level 3 verification checklist for the post-edit quality router: core, both adapters, fail-open posture, and docs wiring. Planning draft, all items unchecked."
trigger_phrases:
  - "post-edit router checklist"
  - "post-edit-router verification"
  - "warn-only fail-open checklist"
  - "checker dispatch verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/003-post-edit-quality-router"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 verification checklist from research brief sheet-003"
    next_safe_action: "Keep all items unchecked until implementation produces real evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs"
      - ".opencode/plugins/mk-post-edit-quality.js"
      - ".opencode/plugins/tests/mk-post-edit-quality.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-post-edit-quality-router"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Unified Post-Edit Quality Router

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (shared core + two adapters)
- [ ] CHK-003 [P1] Canonical checker paths and exit conventions confirmed from the verified sources
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Core `post-edit-router.cjs` writes no stdout/stderr and never throws
- [ ] CHK-011 [P0] No console errors or warnings from the plugin or the Claude hook
- [ ] CHK-012 [P1] Fail-open handling implemented on every path (missing checker, exit not in {0,1}, spawn throw, deadline)
- [ ] CHK-013 [P1] Adapters stay thin and share all policy from the one core (no dispatch-table duplication)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria in spec.md verified with evidence
- [ ] CHK-021 [P0] `resolveDispatch` table test passes for the five classes plus no-match
- [ ] CHK-022 [P1] OpenCode before/after correlation test passes (stash, retrieve, evict, unmatched no-op)
- [ ] CHK-023 [P1] Fail-open and deadline-exhaustion scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (`rg -n 'tool.execute.before|tool.execute.after' .opencode/plugins`).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the swapped command string (`rg -n 'claude-posttooluse' . --glob '*.json' --glob '*.md' --glob '*.sh'`).
- [ ] CHK-FIX-004 [P0] Path-resolution logic includes adversarial table tests: path under both skill and spec dirs, a `.md` with box-drawing glyphs that is not a flowchart, an outside-root path, a no-op path, and a missing-checker fallback.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion (path class x scope unit x exit code).
- [ ] CHK-FIX-006 [P1] Hostile env variant executed for the opt-in and kill-switch envs (SPECKIT_VALIDATE_LINKS on/off, node absent).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the core, plugin, or hook
- [ ] CHK-031 [P0] Checkers spawned with per-child timeouts and non-{0,1} exits treated as unavailable
- [ ] CHK-032 [P1] The router never blocks the edit and never writes outside `.opencode/logs/post-edit-quality.log`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the durable why, no ephemeral artifact labels
- [ ] CHK-042 [P2] `.opencode/plugins/README.md` row added for `mk-post-edit-quality.js`
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
| P0 Items | 12 | 0/12 |
| P1 Items | 14 | 0/14 |
| P2 Items | 4 | 0/4 |

**Verification Date**: Not yet verified (planning draft)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (Python hook to `.cjs`)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Claude hook completes inside the 9s budget with the remaining_timeout carve (NFR-P01)
- [ ] CHK-111 [P1] OpenCode after-hook self-bounds to its deadline and never blocks completion
- [ ] CHK-112 [P2] A typical single-file edit fires 0-1 checkers (measured across the test matrix)
- [ ] CHK-113 [P2] Deadline and per-child timeout values documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (revert settings.json command, remove plugin)
- [ ] CHK-121 [P0] Kill-switch env configured for disabling the router
- [ ] CHK-122 [P1] Append-only log path confirmed at `.opencode/logs/post-edit-quality.log`
- [ ] CHK-123 [P1] Dual-workspace smoke procedure recorded (Public root + Barter symlink)
- [ ] CHK-124 [P2] Legacy Python hook removal plan reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Warn-only posture confirmed: no reject/enforce path exists in v1
- [ ] CHK-131 [P1] Plugin is default-export-only (grep confirms no stray named exports)
- [ ] CHK-132 [P2] Checker contracts unchanged (only a new caller added)
- [ ] CHK-133 [P2] Env precedence for opt-in wikilinks documented
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Dispatch table and surface rules documented in the core
- [ ] CHK-142 [P2] README entrypoint row updated
- [ ] CHK-143 [P2] Knowledge transfer notes captured in implementation-summary.md
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
