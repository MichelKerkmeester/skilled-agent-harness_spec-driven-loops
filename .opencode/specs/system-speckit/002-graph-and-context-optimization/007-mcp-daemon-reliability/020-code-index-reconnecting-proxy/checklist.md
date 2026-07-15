---
title: "Verification Checklist: mk-code-index reconnecting session proxy"
description: "Verification Date: 2026-06-07"
trigger_phrases:
  - "code-index reconnecting proxy checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy"
    last_updated_at: "2026-06-07T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked verification items with evidence"
    next_safe_action: "Phase 021 orphan-sweeper activation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-020-code-index-reconnecting-proxy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: mk-code-index reconnecting session proxy

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
- [x] CHK-002 [P0] Technical approach defined in plan.md — factory + per-server classify injection
- [x] CHK-003 [P1] Dependencies identified — injectable classify confirmed; reference wiring traced
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` clean (both files)
- [x] CHK-011 [P0] No console errors or warnings — launcher suite ran clean
- [x] CHK-012 [P1] Error handling implemented — proxy inherits reattach/fail-closed; unknown tools not replayed
- [x] CHK-013 [P1] Code follows project patterns — mirrors mk-spec-memory wrapper + `require.main` guard
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — code tools replay, scan/apply don't, memory unchanged, guard inert
- [x] CHK-021 [P0] Manual testing complete (in-session) — 13-assertion require smoke + vitest
- [x] CHK-022 [P1] Edge cases tested — unsafe-wins, protocol methods, custom set, set isolation
- [x] CHK-023 [P1] Error scenarios validated — mutating tools never replayed; default classifier preserved
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `cross-consumer` (shared proxy classifier generalized for a second launcher)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — two launchers bridge; mk-spec-memory already had the proxy, mk-code-index now does too
- [x] CHK-FIX-003 [P0] Consumer inventory — `classifyFrame` consumers (`createPendingRequestsTracker`/`createSessionProxy`) preserved via default factory call
- [x] CHK-FIX-004 [P0] Adversarial cases — unsafe-wins, unknown tool, protocol method, memory-vs-code set isolation
- [x] CHK-FIX-005 [P1] Matrix axes — {server, tool-class, custom-set, protocol-method}
- [x] CHK-FIX-006 [P1] Hostile/global-state variant — require guard verified inert; env-load isolated per test file
- [x] CHK-FIX-007 [P1] Evidence pinned — against working-tree launchers + vitest run output
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none
- [x] CHK-031 [P0] Input validation implemented — frames parsed defensively; non-object/non-string rejected
- [x] CHK-032 [P1] Auth/authz working correctly — owner-lease + socket model unchanged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the proxy port
- [x] CHK-041 [P1] Code comments adequate — durable WHY on factory + wrapper; no ids/paths
- [x] CHK-042 [P2] README updated — N/A; launcher-internal
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
