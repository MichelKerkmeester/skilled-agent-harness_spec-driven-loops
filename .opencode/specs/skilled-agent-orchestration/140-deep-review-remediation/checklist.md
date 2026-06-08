---
title: "Verification Checklist: Deep-review remediation"
description: "Verification Date: 2026-06-08"
trigger_phrases:
  - "deep review remediation checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-deep-review-remediation"
    last_updated_at: "2026-06-08T11:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deferrals F1b/F4/F5/F7 resolved and re-verified"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-140-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deep-review remediation

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] P1 round-2 verified against the actual code before fixing
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both launchers parse (`node --check`)
- [x] CHK-011 [P0] Comment hygiene clean (no perishable labels in the rewritten comments; checker run via shebang, exit 0)
- [x] CHK-012 [P1] Respawn lock released after spawn and in the finally
- [x] CHK-013 [P1] Reap refuses respawn on unconfirmed SIGKILL
- [x] CHK-014 [P1] F1b: stale-reclaim adopts a live bridgeable daemon (clears own lease, bridges) before any reap
- [x] CHK-015 [P1] F5: release path awaits the grace window and escalates a non-exiting sidecar to SIGKILL
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Durability adoption suite 3/3: orphan survives, newPid === orphanPid, single DB writer (F1b/F4)
- [x] CHK-021 [P0] Full durability suite 18/18; launcher-lease 11/11
- [x] CHK-022 [P1] Checker self-test green; reversed `NNN packet` now caught
- [x] CHK-023 [P1] Test helpers use spawnSync (no shell interpolation)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: F1 is `class-of-bug` (an asymmetry: O_EXCL covers no-existing-lease only).
- [x] CHK-FIX-002 [P0] Producer inventory: the stale-reclaim branch was the only non-exclusive reap path; dead-socket already serializes.
- [x] CHK-FIX-003 [P0] Consumer inventory: `reapLeaseChildBeforeRespawn` is shared; the not-allowed return is handled by both reclaim callers.
- [x] CHK-FIX-004 [P0] Adversarial: single-launcher reap still reaches one writer; second launcher bails on the lock.
- [x] CHK-FIX-005 [P1] Matrix: {single fresh launcher, concurrent fresh launchers} x {orphan dies, orphan survives SIGKILL}.
- [x] CHK-FIX-006 [P1] lsof non-zero-exit hostile case handled by parsing stdout regardless of status.
- [x] CHK-FIX-007 [P1] Evidence pinned to the remediation commit and the suite output.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Test no longer interpolates paths into a shell (F3)
- [x] CHK-032 [P1] Reap signals only a pid recorded in the owner-held lease, under the respawn lock
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments durable (no IDs/paths); overstated mutex comment corrected
- [x] CHK-042 [P1] Deferrals resolved: F1b/F4/F5 (launcher + test) and F7 (settings, Public + Barter); F6/F9 documented as decisions
- [x] CHK-043 [P1] F7: `.claude/settings.local.json` untracked + gitignored in Public and Barter; portable `hooks` in tracked `settings.json`; both JSON valid
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Review artifacts in packet 139; remediation in packet 140
- [x] CHK-051 [P1] No stray review processes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 17 | 17/17 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-08
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
