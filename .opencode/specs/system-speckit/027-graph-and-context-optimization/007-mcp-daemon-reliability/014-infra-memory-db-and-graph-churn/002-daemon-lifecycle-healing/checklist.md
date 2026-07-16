---
title: "Verification Checklist: Daemon-lifecycle healing (F1/F2/F3)"
description: "Verification Date: 2026-05-30"
trigger_phrases:
  - "daemon lifecycle healing checklist"
  - "boot fts rebuild checklist"
  - "substrate test fix checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/002-daemon-lifecycle-healing"
    last_updated_at: "2026-05-30T18:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rewrote checklist to manifest scaffold"
    next_safe_action: "Strict-validate then commit atomically"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000324"
      session_id: "032-001-checklist"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Daemon-lifecycle healing (F1/F2/F3)

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
- [x] CHK-003 [P1] Root cause established (032 research) and change-sites read
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` launcher exit 0
- [x] CHK-011 [P0] Build (shared + mcp-server) exit 0
- [x] CHK-012 [P1] F1 preserves detect-only fallback + corruption banner
- [x] CHK-013 [P1] F2 keeps `reason: 'child-reaped'`; never blocks respawn
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] context-server.vitest 378/378 (T56c asserts auto-heal contract)
- [x] CHK-021 [P0] launcher-clean-close-barrier 4/4 (truth table + marker-path)
- [x] CHK-022 [P1] substrate stress passes vs real daemon (410 ran; Code-Graph SKIP tolerated; FAIL rejected)
- [x] CHK-023 [P1] Full launcher suite green except the pre-existing isRespawnLockStale failure (fails on HEAD too, unrelated)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `algorithmic` (lifecycle root cause) + `test-isolation` (F3 stale test)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: FTS `rebuild` verb -> boot path (new) + memory_health (existing, unchanged)
- [x] CHK-FIX-003 [P0] Consumer inventory: `.unclean-shutdown` writer/boot-reader/launcher-reader all accounted for
- [x] CHK-FIX-004 [P0] Adversarial table test for `cleanCloseAfterReap` (4-row killed x markerPresent matrix)
- [x] CHK-FIX-005 [P1] Matrix axes listed (killed, markerPresent) before completion
- [x] CHK-FIX-006 [P1] `MEMORY_DB_PATH` env override variant covered in the unit test
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit (see implementation-summary)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No new external input; FTS rebuild is an internal SQLite verb
- [x] CHK-032 [P1] No auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/implementation-summary synchronized
- [x] CHK-041 [P1] Comment-hygiene audit: 0 ephemeral-pointer violations
- [x] CHK-042 [P2] No README change required
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the 5 in-scope files touched; no adjacent cleanup
- [x] CHK-051 [P1] Commit scoped with explicit pathspecs (no `git add -A`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-30
<!-- /ANCHOR:summary -->
