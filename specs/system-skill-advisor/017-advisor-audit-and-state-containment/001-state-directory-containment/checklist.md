---
title: "Verification Checklist: 001 State Directory Containment"
description: "Verification items for 001 State Directory Containment."
trigger_phrases:
  - "advisor-018-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-07-27T17:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored from research"
    next_safe_action: "Choose the anchoring strategy"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-018-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 001 State Directory Containment

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

- [ ] CHK-001 [P0] Every writer re-verified at its cited line before edit
- [ ] CHK-002 [P0] The boundary test fails on a leak into a subtree invented after it was written
- [ ] CHK-003 [P0] No writer derives a write root from raw process.cwd()
- [ ] CHK-004 [P0] A writer run from inside a skill folder creates no nested .opencode
- [ ] CHK-005 [P1] All 40 leaked directories are gone
- [ ] CHK-006 [P1] git check-ignore proves nested .opencode ignored and root .opencode not
- [ ] CHK-007 [P1] Anchor tested against .worktrees/ and a vendored node_modules tree
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every change traces to a re-verified finding
- [ ] CHK-011 [P1] No change widens scope beyond its finding
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Affected tests run before and after, both results recorded
- [ ] CHK-021 [P1] A regression test pins the boundary, not one instance
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Reachability searches cover the whole repository, not the owning subsystem.
- [ ] CHK-FIX-002 [P0] Exact symbols are searched, not shorter lookalikes.
- [ ] CHK-FIX-003 [P1] Evidence pinned to a recorded commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No file outside the declared scope is modified
- [ ] CHK-031 [P1] No secrets appear in evidence excerpts
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks reflect what was actually done
- [ ] CHK-041 [P1] Parent phase map updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only
- [ ] CHK-052 [P0] `validate.sh --strict` exits 0
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 0 | 0/0 |
| P1 Items | 0 | 0/0 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
