---
title: "Verification Checklist: Dead-socket reap hardening"
description: "Verification Date: 2026-06-07"
trigger_phrases:
  - "dead-socket reap hardening checklist"
  - "lease probe retry verification"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/019-dead-socket-reap-hardening"
    last_updated_at: "2026-06-07T16:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked verification items with evidence"
    next_safe_action: "Phase 020 mk-code-index proxy"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-019-dead-socket-reap-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Dead-socket reap hardening

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..006 + Given/When/Then
- [x] CHK-002 [P0] Technical approach defined in plan.md — bounded retry runner + config resolvers
- [x] CHK-003 [P1] Dependencies identified — `probeDaemon` reused; grace ceiling confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` clean
- [x] CHK-011 [P0] No console errors or warnings — launcher suite ran clean
- [x] CHK-012 [P1] Error handling implemented — retry handles dead/timeout/short-circuit; bounded loop
- [x] CHK-013 [P1] Code follows project patterns — reuses `parsePositiveInteger`/`clampProbeTimeoutMs`; injectable + exported helpers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — first-alive, dead-then-alive, all-dead, retries=0, clamp all verified
- [x] CHK-021 [P0] Manual testing complete (in-session) — 9-assertion smoke + vitest
- [x] CHK-022 [P1] Edge cases tested — backoff between attempts; clamp; retries=0 legacy path
- [x] CHK-023 [P1] Error scenarios validated — all-dead respawns after exactly N probes; dead socket fast-fails
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `algorithmic` (false-dead decision gate in the reap path)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — only `maybeBridgeLeaseHolder` makes the reap decision; mk-code-index has no equivalent reap path
- [x] CHK-FIX-003 [P0] Consumer inventory — the respawn verdict feeds the launcher reap/respawn path; behavior preserved except firing only after N failures
- [x] CHK-FIX-004 [P0] Adversarial cases — first-alive, dead-then-alive, all-dead, retries=0, huge-timeout-clamp
- [x] CHK-FIX-005 [P1] Matrix axes — {attempts, first-result, transient-recovery, env-overrides}
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant — config resolvers tested with adversarial env objects
- [x] CHK-FIX-007 [P1] Evidence pinned — against the working-tree lib + vitest run output
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none
- [x] CHK-031 [P0] Input validation implemented — env parsed via non-negative/positive parsers; timeout clamped
- [x] CHK-032 [P1] Auth/authz working correctly — single-writer owner-lease model unchanged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the retry hardening
- [x] CHK-041 [P1] Code comments adequate — durable WHY on the retry rationale; no ids/paths
- [x] CHK-042 [P2] README updated — N/A; launcher-internal (env knobs in spec)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — none created
- [x] CHK-051 [P1] scratch/ cleaned before completion — only the empty scratch dir
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-07
<!-- /ANCHOR:summary -->
