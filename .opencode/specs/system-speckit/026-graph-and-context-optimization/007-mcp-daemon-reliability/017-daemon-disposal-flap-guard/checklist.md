---
title: "Verification Checklist: Daemon disposal relaunch-flap guard"
description: "Verification Date: 2026-06-07"
trigger_phrases:
  - "daemon disposal flap checklist"
  - "launcher relaunch guard verification"
  - "mcp respawn fix checklist"
  - "orphan gate verification"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/017-daemon-disposal-flap-guard"
    last_updated_at: "2026-06-07T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked verification items with evidence"
    next_safe_action: "Runtime-verify on fresh session (the one deferred item)"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-017-daemon-disposal-flap-guard"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Daemon disposal relaunch-flap guard

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
- [x] CHK-002 [P0] Technical approach defined in plan.md — fire-time orphan/shutdown gate
- [x] CHK-003 [P1] Dependencies identified — report verified against first-party code; recycle/crash contract traced
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check .opencode/bin/mk-spec-memory-launcher.cjs` clean
- [x] CHK-011 [P0] No console errors or warnings — launcher vitest suite ran clean
- [x] CHK-012 [P1] Error handling implemented — orphan/shutdown path releases lease + exits cleanly
- [x] CHK-013 [P1] Code follows project patterns — reuses `launcherShutdownInProgress` + `clearAllLeaseFiles`; additive guard
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — guard added; recycle/crash preserved; node --check + tests pass
- [x] CHK-021 [P0] Manual testing complete (in-session) — 59 launcher unit tests pass (watchdog now 20/20 incl. 5 disposal-gate cases); logic traced for recycle/crash/disposal
- [ ] CHK-022 [P1] Edge cases tested at RUNTIME — gate predicate edge cases (shutdown / changed-ppid / orphan-to-1 / crash-recycle) are now UNIT-tested; only the live end-to-end flap-stop stays DEFERRED to a fresh launcher (T008)
- [x] CHK-023 [P1] Error scenarios validated — orphan-exit releases lease; wrapper-persisted-parent miss falls back to prior behavior (no regression)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `algorithmic` (lifecycle race in the relaunch supervisor)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — only `mk-spec-memory-launcher.cjs` has this relaunch path; `mk-code-index` has a different (worse) failure mode, deferred
- [x] CHK-FIX-003 [P0] Consumer inventory — recycle + crash-recovery both consume `scheduleRelaunch`; both verified preserved
- [x] CHK-FIX-004 [P0] Algorithm invariant stated + adversarial cases — invariant: respawn only when owner alive AND not shutting down; cases: disposal (no respawn), crash (respawn), recycle (respawn), wrapper-persist (no-op fallback)
- [x] CHK-FIX-005 [P1] Matrix axes listed — axes: {orphaned?, shuttingDown?, recycle?} → respawn decision
- [x] CHK-FIX-006 [P1] Hostile/global-state variant — uses `process.ppid` (process-global) deliberately; behavior reasoned for reparent-to-1 and changed-ppid
- [x] CHK-FIX-007 [P1] Evidence pinned — against working-tree launcher + vitest run output
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none
- [x] CHK-031 [P0] Input validation implemented — N/A; guard reads process state only
- [x] CHK-032 [P1] Auth/authz working correctly — single-writer owner-lease model unchanged; clean lease release preserved
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the same one-file change + deferred scope
- [x] CHK-041 [P1] Code comments adequate — durable WHY in the guard comment; no ADR/REQ/CHK/spec-path ids (comment-hygiene clean)
- [x] CHK-042 [P2] Docs updated — feature-catalog entry + playbook scenario 421 added (14--pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md), both indexes registered
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — none created
- [x] CHK-051 [P1] scratch/ cleaned before completion — only .gitkeep
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 11/12 (1 deferred: runtime-verify owed to fresh session) |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-07
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
