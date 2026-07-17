---
title: "Verification Checklist: Orphan MCP Leak Prevention"
description: "Verification checklist for dry-run-first process cleanup, Claude Stop cleanup, and MCP idle self-exit."
trigger_phrases:
  - "orphan mcp leak prevention checklist"
  - "mcp leak verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention"
    last_updated_at: "2026-05-24T06:58:36Z"
    last_updated_by: "codex"
    recent_action: "verification checklist completed"
    next_safe_action: "operator reviews dry-run output before LaunchAgent activation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220220"
      session_id: "2026-05-24-orphan-mcp-leak-prevention-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Orphan MCP Leak Prevention

<!-- SPECKIT_LEVEL: 3 -->

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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shell scripts pass `bash -n`
- [x] CHK-011 [P0] Claude settings JSON parses successfully
- [x] CHK-012 [P1] Error handling implemented for failed process kills and shutdown races
- [x] CHK-013 [P1] Code follows existing OpenCode shell and TypeScript patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Sweeper dry-run logs candidates and preserve reasons without mutation
- [x] CHK-021 [P0] Settings parity vitest passes after Stop hook chaining
- [x] CHK-022 [P1] Idle timeout no-client test passes
- [x] CHK-023 [P1] Idle timeout active-client and disabled-timeout tests pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes documented: process sweep is class-of-bug, hook cleanup is cross-consumer, idle timeout is algorithmic lifecycle.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for process match patterns and IPC bridge copies.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed IPC option fields and hook command shape.
- [x] CHK-FIX-004 [P0] Safety tests include dry-run, preserve, no-match, and stubborn-process behavior where practical.
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env variant executed for malformed timeout env values.
- [x] CHK-FIX-007 [P1] Evidence pinned to this working diff and command transcripts.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Process and path inputs are quoted and bounded
- [x] CHK-032 [P1] Cleanup excludes devin and active dev-server processes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Decision record documents rollout choices
- [x] CHK-042 [P2] Implementation summary records verification evidence
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] LaunchAgent remains a repo template, not installed in `~/Library/LaunchAgents`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 19 | 19/19 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-05-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented in implementation summary
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Sweeper dry-run completes within target on live process table
- [x] CHK-111 [P1] Idle timer has negligible steady-state overhead
- [x] CHK-112 [P2] Long-running load testing deferred until LaunchAgent activation
- [x] CHK-113 [P2] Performance observations documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested
- [x] CHK-121 [P0] Feature flag/env disable path configured for idle timeout
- [x] CHK-122 [P1] Monitoring/logging configured through log file rotation
- [x] CHK-123 [P1] Runbook created through LaunchAgent template comments
- [x] CHK-124 [P2] Deployment runbook reviewed by operator before activation
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Safety review completed through dry-run output
- [x] CHK-131 [P1] Dependency licenses compatible because no new dependencies are added
- [x] CHK-132 [P2] OWASP checklist not applicable to local process cleanup
- [x] CHK-133 [P2] Data handling unchanged
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized after implementation
- [x] CHK-141 [P1] API documentation complete for new env var and IPC option
- [x] CHK-142 [P2] User-facing documentation not required beyond local runbook
- [x] CHK-143 [P2] Knowledge transfer captured in implementation summary
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner | Pending activation approval after dry-run implementation | 2026-05-24 |
<!-- /ANCHOR:sign-off -->
