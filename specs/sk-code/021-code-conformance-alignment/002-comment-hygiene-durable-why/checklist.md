---
title: "Verification Checklist: Comment Hygiene — Durable WHY"
description: "Verification Date: TBD"
trigger_phrases:
  - "comment hygiene checklist"
  - "durable why verification"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/002-comment-hygiene-durable-why"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist for comment-hygiene remediation"
    next_safe_action: "Leave unchecked until the phase executes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Comment Hygiene — Durable WHY

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Child 001 landed: repaired checker runs, generic-label boundary recorded, feature-catalog rule present
- [ ] CHK-005 [P0] T001 complete: all ten findings reproduced or struck with evidence
- [ ] CHK-006 [P1] Shared-file sequencing against the security register's work list recorded
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — parse check per touched file in its own language
- [ ] CHK-011 [P0] No console errors or warnings introduced
- [ ] CHK-012 [P1] Error handling implemented — N/A; no control flow touched. Recorded as not applicable, not skipped
- [ ] CHK-013 [P1] Code follows project patterns — every replacement comment states a durable reason and names no artifact
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-007 each cite an executed command
- [ ] CHK-021 [P0] Manual testing complete — checker clean on every touched file and on the staged set
- [ ] CHK-022 [P1] Edge cases tested — no template literal, heredoc, or runtime-visible docstring modified
- [ ] CHK-023 [P1] Error scenarios validated — the comment-only assertion demonstrated failing on a deliberately non-comment change
- [ ] CHK-024 [P0] Owning-package suites green for every touched package
- [ ] CHK-025 [P0] The two files that are themselves tests still assert the same behaviour
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The pattern-anchor finding is `class-of-bug` and its work list is the checker's output.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed — the repaired checker's full-tree run is the population, not the nine named files.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed — proven empty, since no symbol changed; recorded as a checked claim rather than an assumption.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests — N/A for this child; recorded as not applicable with the reason.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — {language} × {comment context}, every axis exercised.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — the goal-injection hook reads environment state; verified after its header comment changed.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — no replacement comment introduces a credential, absolute developer path, or internal URL
- [ ] CHK-031 [P0] Input validation implemented — N/A; no input path touched
- [ ] CHK-032 [P1] Auth/authz working correctly — N/A
- [ ] CHK-033 [P0] No comment documenting a hazard was deleted; hazard comments were rewritten
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate — each replacement is a reason, not a renamed pointer
- [ ] CHK-042 [P2] README updated (if applicable) — no README is touched by this child
- [ ] CHK-043 [P1] Every deleted comment is listed with the reason its WHY was unrecoverable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
