---
title: "Verification Checklist: Command Documentation Cleanup"
description: "PENDING verification checklist for command doc and runtime mirror sweep."
trigger_phrases:
  - "028 release cleanup commands checklist"
  - "commands cleanup checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/000-release-cleanup/006-commands"
    last_updated_at: "2026-07-04T17:31:33.022Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified in-scope command docs, recorded path and stale-reference evidence"
    next_safe_action: "Concurrent session owns deep/ and agent_router.md doc edits"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-checklist-006-commands"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Command Documentation Cleanup

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope is limited to command doc and runtime mirror sweep.
- [x] CHK-002 [P0] Discovery command is run before edits.
- [x] CHK-003 [P1] Candidate list is saved as evidence. (recorded in tasks.md T001/T002)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited markdown has no em dash character. (verified on the doctor/speckit.md row and all authored phase-doc edits)
- [x] CHK-011 [P0] Edited markdown has no semicolon character. (verified on the doctor/speckit.md row and all authored phase-doc edits)
- [x] CHK-012 [P1] Edited markdown avoids Oxford comma patterns.
- [x] CHK-013 [P1] Edits follow nearby documentation structure. (added one table row matching the existing Workflow Assets rows)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stale-reference scan is run with `deprecated flag|removed command|renamed route|stale|missing mirror|orphan`. (only stale-session feature-name hits, not actionable)
- [x] CHK-021 [P0] Source-file path claims are grep-traceable. (every referenced path resolves on disk)
- [x] CHK-022 [P1] Mirror or index counts are checked when the phase has mirrors or indexes. (.claude symlink confirmed, .codex absent, doctor route count reconciled to nine)
- [x] CHK-023 [P1] Strict validation exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Every discovered candidate is reviewed. (19 in-scope docs, deep/ and agent_router.md deferred to the concurrent session)
- [x] CHK-061 [P0] Every stale hit is fixed, explicitly deferred or proven historical. (fable-mode route added, no other drift)
- [x] CHK-062 [P1] Out-of-scope files remain unchanged.
- [x] CHK-063 [P1] Packet 030 remains unchanged.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or private tokens are added to docs.
- [x] CHK-031 [P0] Command examples do not encourage unsafe shell execution.
- [x] CHK-032 [P1] Paths do not expose machine-local private locations unless already present and required.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and checklist remain synchronized.
- [x] CHK-041 [P1] Parent phase map still points to this child. (parent graph-metadata and spec reference 006-commands, parent status rollup left to the parent-level session)
- [x] CHK-042 [P2] Cleanup evidence is linked from the child phase when execution happens. (evidence recorded in tasks.md task notes)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files are committed.
- [x] CHK-051 [P1] Generated discovery output stays in the phase evidence area if created later. (discovery captured inline in tasks.md, no stray output files)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-19

> Note: HVR voice normalization (REQ-004) was descoped for this run per the dispatcher (factual drift only, no wholesale restyle). CHK-010 and CHK-011 are verified against authored edits only. Pre-existing em dashes in deliberate prose were left in place.
<!-- /ANCHOR:summary -->
