---
title: "Tasks: Phase 4: Research Adoption and Rule-Set Reconciliation"
description: "Ordered tasks for turning phase 3 recommendations into decisions: extract and count the list, verify each item against the repository, write one disposition per recommendation, batch the AGENTS.md items into a single approval request, implement only what was accepted, then reconcile the parent packet and validate recursively."
trigger_phrases:
  - "adoption tasks"
  - "disposition table"
  - "approval batching"
  - "recursive validation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: Research Adoption and Rule-Set Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `../003-disposition-and-gap-research/research/research.md` and extract the ranked recommendation list verbatim
- [x] T002 Record the recommendation count, so the disposition table can be checked for completeness rather than assumed complete
- [x] T003 Partition the list by target: `repo-rules/`, `REPO RULES.md`, `AGENTS.md`, out of bounds
- [x] T004 [P] Confirm the working tree is clean, so each item's diff is attributable
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Verify each recommendation against the repository before deciding it - confirm the gap it claims actually exists
- [x] T006 Write `adoption-decisions.md`: one row per recommendation with id, target, verdict, reason, and owner where deferred
- [x] T007 Put every `AGENTS.md` item into one consolidated approval request stating the change, the reason, and the line delta
- [x] T008 Implement accepted `repo-rules/` changes in the phase-1 heading and divider format
- [x] T009 Implement accepted router changes; a new rule costs exactly one file plus two rows
- [x] T010 Implement approved `AGENTS.md` changes, and only those, quoting the approval in the decisions file
- [x] T011 Reconcile the parent: Phase Documentation Map statuses, parent `spec.md` status, and `../implementation-summary.md` completion claims
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Assert the disposition row count equals the phase-3 recommendation count, with no blank verdicts
- [x] T013 Map every path in `git diff --stat` back to an accepted recommendation id; an unattributable change is scope drift
- [x] T014 Confirm no `AGENTS.md` change exists without quoted operator approval
- [x] T015 Re-run the phase-1 format assertions over every new or edited rule file
- [x] T016 Resolve every link in `REPO RULES.md` against the filesystem
- [x] T017 Confirm each rule file is still independently readable - no rule requires another to be actionable
- [x] T018 Report the adoption rate honestly, including a low one
- [x] T019 Run `validate.sh <parent> --recursive --strict` and record the first `RESULT:` line per folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every recommendation dispositioned; every deferral owned
- [x] Parent and four children all validate
- [x] `scratch/` cleaned of anything that is not an intentional working file
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Input**: `../003-disposition-and-gap-research/research/research.md`
- **Parent packet**: See `../spec.md` Phase Documentation Map
- **Format convention**: `../001-header-format-and-dividers/spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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
- [x] CHK-003 [P0] Recommendation count recorded before any disposition is written
- [x] CHK-004 [P1] `AGENTS.md` items identified and batched, not asked one at a time
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed file traces to an accepted recommendation id
- [x] CHK-011 [P0] No rule leaked into the router; the router still holds no rules of its own
- [x] CHK-012 [P1] New and edited rules match the phase-1 format
- [x] CHK-013 [P1] Each rule file is still independently readable
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Recursive validation passed for the parent and all four children
- [x] CHK-022 [P1] Verdict-by-target matrix covered: every combination that occurred has a row
- [x] CHK-023 [P1] Declined items carry reasons that say why the change is not warranted, not merely that it was skipped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Phase 3 handed over hypotheses. These rows are where they get tested.

- [x] CHK-FIX-001 [P0] Every recommendation classed before disposition: `class-of-bug` (a real gap) or `instance-only` (one document's wording)
- [x] CHK-FIX-002 [P0] For each accepted item, the claimed gap confirmed absent from the current rule set by grep before the rule is written
- [x] CHK-FIX-003 [P0] Consumer inventory run after every router edit
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser, or redaction surface; recorded rather than skipped
- [x] CHK-FIX-005 [P1] Matrix axes listed: 3 verdicts x 4 target classes
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state is read
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any adopted rule text
- [x] CHK-031 [P0] No adopted rule instructs an agent to bypass a gate, relax a permission mode, or weaken a check
- [x] CHK-032 [P1] `AGENTS.md` section 1 hard blockers are unchanged unless the operator explicitly approved a change to one
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized across the parent and all four children
- [x] CHK-041 [P1] `adoption-decisions.md` is readable without the research transcripts
- [x] CHK-042 [P1] Parent Phase Documentation Map reflects every child's real status
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



