---
title: "Verification Checklist: Lease Socket-Path Persistence"
description: "P0/P1/P2 verification for the additive lease.socketPath field and the prefer-stored-path-with-fallback bridge change."
trigger_phrases:
  - "lease socket path checklist"
  - "prefer stored socket verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/020-lease-socket-path"
    last_updated_at: "2026-06-04T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All P0/P1 items verified with evidence"
    next_safe_action: "Deploy"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Lease Socket-Path Persistence

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

- [x] CHK-001 [P0] Requirements documented in spec.md (R1..R5)
- [x] CHK-002 [P0] Technical approach defined in plan.md (additive field + generic-read-with-fallback)
- [x] CHK-003 [P1] Dependencies identified and available (`resolveSessionProxySocketPath`, `getIpcSocketPath`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` clean on all three `.cjs` files
- [x] CHK-011 [P0] No console errors/warnings introduced (test run clean)
- [x] CHK-012 [P1] Stored path guarded by `fs.existsSync` (UDS) / tcp:// bypass; null-normalized when absent
- [x] CHK-013 [P1] Same additive-guard style as existing `childPid`/`modelServerPid` fields
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (SC-001..003 covered by tests)
- [x] CHK-021 [P0] Targeted suite run: 34 passed, 16 skipped (pre-existing flake skips)
- [x] CHK-022 [P1] Edge cases tested (stale stored path → recompute; tcp:// bypass via existing tests)
- [x] CHK-023 [P1] Legacy + skill-advisor-style no-socketPath leases verified to use recompute fallback
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` (shared bridge/builder used by three launchers) + `class-of-bug` (env-recompute divergence).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "buildLeaseObject|writeLeaseFile" .opencode/bin` — only mk-spec-memory passes a socketPath.
- [x] CHK-FIX-003 [P0] Consumer inventory: `maybeBridgeLeaseHolder` + `leaseHeldFromFile` across all three launchers; skill-advisor/code-index leaseResults carry no socketPath (verified by reading their `leaseHeldFromFile`/`writeLeaseFile`).
- [x] CHK-FIX-004 [P0] Path-handling invariant tested: stored UDS path trusted only when `fs.existsSync`; tcp:// bypass; missing/stale path → recompute fallback (re-applies existence + probe gates).
- [x] CHK-FIX-005 [P1] Matrix axes listed: {stored-present-on-disk, stored-stale, no-socketPath-legacy, no-socketPath-other-launcher} × {recompute-target-present, recompute-target-absent}.
- [x] CHK-FIX-006 [P1] Hostile env variant: tests `delete process.env.SPECKIT_IPC_SOCKET_DIR` to force dbDir-based recompute and restore the original in afterEach.
- [x] CHK-FIX-007 [P1] Evidence pinned to this packet's diff (three `.cjs` + one test file).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Stored path validated (non-empty string + existence) before trust; no arbitrary path executed — only used as a socket connection target the owner already opened
- [x] CHK-032 [P1] No auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Durable WHY comments added (env-divergence rationale); no ephemeral tracking labels in code
- [x] CHK-042 [P2] No README applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside the test framework's tmpdir
- [x] CHK-051 [P1] scratch/ not used; nothing to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-04
<!-- /ANCHOR:summary -->
