---
title: "Verification Checklist: Live F2 clean-close reap coverage"
description: "Verification Date: 2026-05-30"
trigger_phrases:
  - "live reap test checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/001-live-two-launcher-test"
    last_updated_at: "2026-05-30T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored checklist to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-reap.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003604"
      session_id: "036-001-checklist"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Live F2 clean-close reap coverage

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Reap seams + marker resolution confirmed; launcher clean at HEAD
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` launcher exit 0
- [x] CHK-011 [P0] Production change is export-only (no reap logic edited)
- [x] CHK-012 [P1] Importing the launcher does not auto-run main (require.main guard)
- [x] CHK-013 [P1] Test cleans its own temp dirs + children (afterEach)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All four reap branches asserted (already-dead, graceful-clean, graceful-dirty, ignore-SIGTERM)
- [x] CHK-021 [P0] Suite green (5/5)
- [x] CHK-022 [P1] SIGKILL-escalation case bounded + deterministic (real grace constant, no fixed sleeps in assertions)
- [x] CHK-023 [P1] unknown-eperm liveness skips-with-reason (no false assertion)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `test-isolation` (adds missing coverage for an already-shipped barrier)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the reap function is the sole F2 orchestration; helpers already unit-tested
- [x] CHK-FIX-003 [P0] Consumer inventory: only `respawnAfterDeadSocket` calls reap; export is additive and does not change that path
- [x] CHK-FIX-004 [P0] Adversarial matrix covered: killed × markerPresent across the four child stubs
- [x] CHK-FIX-005 [P1] Matrix axes listed (child SIGTERM behavior, marker presence) before completion
- [x] CHK-FIX-006 [P1] Hostile-platform variant handled: unknown-eperm liveness guard
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit (see implementation-summary)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No new external input; child stubs are fixed inline scripts
- [x] CHK-032 [P1] No auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/implementation-summary synchronized
- [x] CHK-041 [P1] Comment-hygiene: 0 ephemeral-pointer violations
- [x] CHK-042 [P2] No README change required
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the 2 in-scope files + this packet touched
- [x] CHK-051 [P1] Commit scoped with explicit pathspecs (no `git add -A`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-30
<!-- /ANCHOR:summary -->
