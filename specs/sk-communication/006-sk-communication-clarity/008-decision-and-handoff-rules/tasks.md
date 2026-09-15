---
title: "Tasks: Phase 8: decision-and-handoff-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "decision and handoff tasks"
  - "qualifier against the tiers"
  - "duplication scan"
  - "edit not append"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: decision-and-handoff-rules

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

- [x] T001 Confirm phase 2 recorded the error-reporting resolution, including the qualifier's exact form (evidence: decision-record.md:251,280-282, the qualifier record accepted, its decision clause fixes the exact form, label it as suspected and name the next check)
- [x] T002 Capture the baseline: what each of the three files currently says about close-outs and causes (evidence: scratch/baseline.md, the BEFORE section, written before the first edit)
- [x] T003 [P] Re-read the five allocation rows (evidence: allocation-table.md:27,39,40,44,45, five adopt rows, only the qualifier carries a qualifier record)
- [x] T004 Locate the existing restate-the-request step, so reader triage can be distinguished from it (evidence: presenting-decisions.md:89-90 as read, the ASK step and its wording, recorded in scratch/baseline.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write reader triage before drafting, stating its distinction from the existing restate step (evidence: presenting-decisions.md:92-100, the rule beside the ASK step, its failure line at :98)
- [x] T006 Write the concrete time-estimate clause (evidence: presenting-decisions.md:121-125, the estimate rides the intended-path duty, the failure line extended at :131-133)
- [x] T007 Edit the handback rule's existing obligation to carry the closing contract, rather than appending a second one (evidence: handoff-and-questions.md:77-84, the contract amended into the existing close of section 1, no section added)
- [x] T008 Write the state-restatement cadence as a cadence, not a preference (evidence: handoff-and-questions.md:65-72, the cadence is triggered, not timed, three triggers named, its failure line at :71)
- [x] T009 Write the unconfirmed-cause qualifier into the evidence rule (evidence: evidence-and-proof.md:71-80, the reporting clause at the end of section 1 after the receipt paragraph, its wording tracks the qualifier record's decision at decision-record.md:282)
- [x] T010 Read the qualifier beside the three tiers and revise until it cannot be read as licence (evidence: evidence-and-proof.md:74-76, the clause reads itself against the tiers, a suspected cause is INFERRED and takes nothing from the proof)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the duplication scan across all three files together (evidence: scratch/baseline.md, the AFTER section, five key phrases, one hit each across all twelve rule files)
- [x] T012 Read the qualifier against the three tiers and confirm an unconfirmed cause still cannot be asserted (evidence: evidence-and-proof.md:73-76, no unmarked case, the INFERRED convention at :53 already demanded what would confirm it)
- [x] T013 Confirm the handback change is an edit and not an append (evidence: handoff-and-questions.md:60-84, the Position it last duty kept, the contract inserted beside it, the original failure line rewritten in place)
- [x] T014 Confirm reader triage states its distinction from the existing restate step (evidence: presenting-decisions.md:96-97, this is not the ASK step, which restates the request, the triage decides who the reply is for)
- [x] T015 Read every added clause and confirm it names its prevented failure (evidence: five clauses, five failure lines, presenting-decisions.md:98 and :131, handoff-and-questions.md:71 and :82, evidence-and-proof.md:79)
- [x] T016 Confirm the scoped diff touches only the three files and, if widened, the router (evidence: the scoped porcelain after the edits shows this dispatch in exactly the three owned rule files plus the granted packet docs, the router's modification predates this run per the before state)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md:116-126, REQ-001 through REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md Architecture and Implementation Phases sections)
- [x] CHK-003 [P1] Baseline of what the three files say about close-outs and causes, captured before the first edit (T002, scratch/baseline.md BEFORE section)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every clause traces to one of the five allocation rows (T003, allocation-table.md:27,39,40,44,45; T005-T009)
- [x] CHK-011 [P0] The qualifier leaves the evidence rule's three tiers governing, verified by reading them together (T010, T012)
- [x] CHK-012 [P1] No file gained a section where a sentence in an existing section would do (how-delivered: "No section was added and the router was not widened"; T007, T008 evidence, no section added)
- [x] CHK-013 [P1] Each clause follows its host file's existing shape (T005-T009, each clause cites the existing section or paragraph it lands beside)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, AC-001 through AC-007 all Met)
- [x] CHK-021 [P0] Duplication scan run across all three files together, not one at a time (T011, scratch/baseline.md AFTER)
- [x] CHK-022 [P1] The handback change confirmed as an edit rather than an append (T013)
- [x] CHK-023 [P1] Adversarial readings of the qualifier attempted: a cause with no status, a status that reads as confirmation, a fix with no cause (implementation-summary, the three adversarial readings section, all three fail)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate carries a finding class, and the evidence-rule clause is treated as cross-consumer (T003, allocation-table.md adopt rows classify each candidate; T011's duplication scan treats the evidence-rule clause as cross-consumer, run across all three files)
- [x] CHK-FIX-002 [P0] Same-class producer inventory run over every file stating close-out content (T002, scratch/baseline.md BEFORE section records what each of the three files says about close-outs)
- [x] CHK-FIX-003 [P0] Consumer inventory run for every document citing the three files (rerun repo grep: 5 citers of presenting-decisions.md, 3 of handoff-and-questions.md, 11 of evidence-and-proof.md, outside specs/)
- [x] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope (not applicable: rule-file wording only)
- [x] CHK-FIX-005 [P1] Matrix axes listed: file by candidate, five rows (plan.md FIX ADDENDUM: "file by candidate. Five rows, three files.")
- [x] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase (not applicable: no code changed this phase)
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range (open: work is uncommitted, all evidence cites file:line and scratch files, not a commit hash)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or private identifier enters a rule file (rerun secret-pattern grep over the three changed files, no matches)
- [x] CHK-031 [P0] No verification standard is weakened; the qualifier narrows a reporting shape only (T010, T012; implementation-summary: "adds a reporting shape and takes nothing from the proof")
- [x] CHK-032 [P1] Not applicable, no auth or authorization surface in scope (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md REQ-001 through REQ-006, plan.md phases and T001-T016 all describe the same five candidates across the three files)
- [x] CHK-041 [P1] Not applicable, no code comments are written in this phase (not applicable: doc-only phase)
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes (parent spec.md:160, phase 8 row reads Complete)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only .gitkeep and baseline.md, verified by listing)
- [x] CHK-051 [P1] scratch/ cleaned before completion (baseline.md is retained by design as the evidence T002 and T011 cite, not stray output; no other file present)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-14, the consumer-citer grep, the credential scan and the parent Phase Documentation Map read all ran from the final state; the one open P1 is the commit-pinning row
<!-- /ANCHOR:summary -->

---
