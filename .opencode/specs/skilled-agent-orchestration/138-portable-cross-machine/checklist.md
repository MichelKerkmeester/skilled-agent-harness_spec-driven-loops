---
title: "Verification Checklist: Portable cross-machine hook paths and Barter framework sync"
description: "Verification Date: 2026-06-08"
trigger_phrases:
  - "portable hook paths checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-portable-cross-machine"
    last_updated_at: "2026-06-08T06:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified hook portability and Barter sync"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".codex/hooks.json"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-138-portable-cross-machine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Portable cross-machine hook paths and Barter framework sync

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
- [x] CHK-003 [P1] Dependencies identified (runtime env vars, with `$PWD` fallback)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All five hook configs JSON-valid after the edit
- [x] CHK-011 [P0] No console errors; the fixer reported the exact before/after for each command
- [x] CHK-012 [P1] Idempotent fixer (re-running normalizes any reintroduced hardcoding)
- [x] CHK-013 [P1] Quoted env var handles the space and pipe in the Barter directory name
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Grep confirms no `/opt/homebrew`, `n/bin/node`, or absolute `/Users/...` cd remains
- [x] CHK-021 [P0] Manual verification of the synced launcher (reap fix present in Barter)
- [x] CHK-022 [P1] Edge case: devin cd left untouched (already portable)
- [x] CHK-023 [P1] Preserve-list untouched (find -newermt shows 0 modified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` (the same hardcoded form across Claude, Codex and Devin hooks in two repos).
- [x] CHK-FIX-002 [P0] Producer inventory: grep across Public and Barter hook/config surfaces; the fixer covers every variant.
- [x] CHK-FIX-003 [P0] Consumer inventory: only the runtime hook runners; the relative script path and PATH node are unchanged.
- [x] CHK-FIX-004 [P0] Adversarial cases: hardcoded path, wrong-repo cd, corrupted `n/bin/node`, and already-portable devin cd all handled.
- [x] CHK-FIX-005 [P1] Matrix axes: runtime {claude, codex, devin} by repo {Public, Barter}.
- [x] CHK-FIX-006 [P1] The process-memory-harness false positive (homebrew in a ps-output fixture) was inspected and correctly left alone.
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit and the grep outputs.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation: N/A; quoted env var prevents word-splitting on the space/pipe path
- [x] CHK-032 [P1] Auth/authz: N/A
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No code comments changed (config-only edits)
- [x] CHK-042 [P2] README: N/A
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Fixer script kept in /tmp; backups in /tmp
- [x] CHK-051 [P1] No stray artifacts in the repos
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-08
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
