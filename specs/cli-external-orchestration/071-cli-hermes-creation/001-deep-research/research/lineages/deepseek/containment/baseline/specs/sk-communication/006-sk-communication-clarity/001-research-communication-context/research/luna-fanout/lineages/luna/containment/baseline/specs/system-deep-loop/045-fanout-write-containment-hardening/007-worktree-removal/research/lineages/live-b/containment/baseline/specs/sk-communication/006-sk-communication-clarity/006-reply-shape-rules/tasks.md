---
title: "Tasks: Phase 6: reply-shape-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "reply shape tasks"
  - "ten candidates"
  - "counterweight cross-reference"
  - "size check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: reply-shape-rules

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

- [x] T001 Confirm phase 3's split landed and validates, because this phase is blocked on it
  - Evidence: wc before the first edit read communication.md 135 5658 and prose-mechanics.md 106 3945, exactly the SIZE AFTER SPLIT figures at 003/scratch/seam-assignment.md:105-106, both halves present and both named by a router row (REPO RULES.md:47-48)
- [x] T002 Capture the baseline: the per-mark instruction set and each half's size before the first edit
  - Evidence: baseline = 003/scratch/per-mark-baseline.md, eighteen marks in twenty-eight governed rows, plus the seam-assignment sizes, both captured pre-change in 003 and confirmed unchanged before this phase's first edit
- [x] T003 [P] Re-read the ten allocation rows and the two halves as they stand
  - Evidence: rows 3, 4, 5, 6, 7, 12, 15, 16, 17 and 20 read at 002/allocation-table.md:29-33 and :38-46, both halves read end to end this session, all before the first edit
- [x] T004 Assign each candidate to a half by the unit it governs, and record the assignment before writing
  - Evidence: assignment by governed unit, 3, 6 and 7 mechanics, 4, 5, 12, 15, 16 and 17 reply-shape, 20 the rationale layer over both, where no section governed the unit a new numbered section was opened, recorded in scratch/size-and-marks.md and implementation-summary.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the sentence-relation rule into the sentence-mechanics half
  - Evidence: prose-mechanics.md section 1, the State the relation between sentences rule at :60-62 with its failure line at :64-65, failure wording = 002/allocation-table.md:29
- [x] T006 Write the paragraph-progression rule into the reply-shape half
  - Evidence: communication.md section 6, the Each paragraph carries the reader forward rule at :151-153 with its failure line at :155-156, failure wording = 002/allocation-table.md:30
- [x] T007 Write the first-line contract, with its positive test as well as its bans
  - Evidence: communication.md section 5 at :136-145, the contract at :138, the positive test at :139-140, the four habits, announcing, labelling, the fragment opener, the set-up, at :140-142, the failure line at :144-145, failure wording = 002/allocation-table.md:31
- [x] T008 Write the mechanism-visibility rule
  - Evidence: prose-mechanics.md section 1, the Name the mechanism rule at :67-69 with its failure line at :71-72, failure wording = 002/allocation-table.md:32
- [x] T009 Write the concise-is-not-compressed counterweight
  - Evidence: prose-mechanics.md, new section 4, CONCISE IS NOT COMPRESSED at :118, the rule at :120-124 with its failure line at :126-127, failure wording = 002/allocation-table.md:33
- [x] T010 Cross-reference the counterweight from every brevity rule in the set
  - Evidence: five clauses, match length at communication.md:86-87, cut filler at :113, the item cap at :177-178, the outcome at :191-192, plus the reciprocal in the one-idea rule at prose-mechanics.md:47-48, all five point at prose-mechanics.md §4 and resolve to :118-127
- [x] T011 Write the numbered-steps rule
  - Evidence: communication.md section 7, the Number the steps when there is more than one rule at :162-165 with its failure line at :167-168, the bounded-numbers clause at :164-165, failure wording = 002/allocation-table.md:38
- [x] T012 Write the two-line sufficiency rule
  - Evidence: communication.md section 9, the The outcome fits in two lines rule at :187-193 with its failure line at :194-195, the closing-deletion test at :189-191, failure wording = 002/allocation-table.md:41
- [x] T013 Write the visible-item cap, with its completeness safeguard
  - Evidence: communication.md section 8, the Cap what the list shows rule at :174-178, the completeness safeguard at :175-177, the retained-not-discarded clause and the show-when-asked clause, the failure line at :180-181, failure wording = 002/allocation-table.md:42
- [x] T014 Write the tangent-suppression rule
  - Evidence: communication.md section 10, the Suppress the tangent rule at :201-203, the offered-once-at-the-end clause at :202-203, the failure line at :205-206, failure wording = 002/allocation-table.md:43
- [x] T015 Write the rationale layer in the shape phase 2 chose
  - Evidence: both halves audited rule by rule, the register rule (communication.md:74-75) and the no-tables rule (:96-97) lacked the failure line and gained it, every other rule already carried one, the halves now hold seventeen failure lines, eleven reply-shape and six mechanics
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Walk every router row and open every file it names
  - Evidence: both router tables walked (REPO RULES.md:36-70), twelve rule files named, twelve exist and open, the two rows reaching this rule, :47 and :48, read in full, their scope summaries still true after this phase's edits
- [x] T017 Walk both halves and confirm each is named by at least one row
  - Evidence: communication.md named by the trigger row at REPO RULES.md:47 and the index row at :66, prose-mechanics.md by :48 and :67, no half unnamed
- [x] T018 Run the per-mark contradiction scan and compare with the captured baseline
  - Evidence: instruction lines rescanned against 003/scratch/per-mark-baseline.md, no mark gained a second instruction, the rationale line for no-tables (communication.md:96-97) and the opener-position habit at :140 recorded as the rationale layer, the full disposition in scratch/size-and-marks.md
- [x] T019 Read every added rule and confirm it names a failure specific enough to argue with
  - Evidence: all nine added failure lines read against their allocation rows, each names a contestable failure in the row's own wording, juxtaposition fakes the link, the moving parts never named, locally atomic paragraphs, the buried outcome, the shortened list read as complete, the second issue hijacking the reply
- [x] T020 Follow every counterweight cross-reference and confirm it resolves
  - Evidence: all five references followed, communication.md:86-87, :113, :177-178, :191-192 and prose-mechanics.md:47-48, each resolves to prose-mechanics.md §4, CONCISE IS NOT COMPRESSED, :118-127
- [x] T021 Check both halves against the recorded size ceiling
  - Evidence: wc after, communication.md 230 9292, prose-mechanics.md 140 5486, both under the 250-line ceiling the checker enforces (its line-ceiling check, corpus max 234), the reply-shape half crosses the 200 note, recorded in implementation-summary.md and scratch/size-and-marks.md, no candidate dropped
- [x] T022 Confirm the scoped diff touches only the two halves and, if needed, the router
  - Evidence: this phase's edits are repo-rules/communication.md and repo-rules/prose-mechanics.md only, the router untouched, no added trigger phrase needed a router word (rows 47-48 already fire on any substantive reply and on any drafted sentence), the working tree's other modified paths are the earlier phases' adoption work and one skill runtime database. The packet's own graph-metadata.json was regenerated afterward by the validation repair, the run prescribed it
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Baseline per-mark instruction set and per-half sizes captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every added rule traces to one of the ten allocation rows
- [ ] CHK-011 [P0] No added rule relaxes a hard blocker or a verification standard
- [ ] CHK-012 [P1] Each half is within its recorded ceiling, or the overflow is recorded as a finding
- [ ] CHK-013 [P1] Each rule follows the existing rule-file shape rather than inventing a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Trigger reachability verified in both directions
- [ ] CHK-022 [P1] Per-mark contradiction scan compared against the captured baseline
- [ ] CHK-023 [P1] Every counterweight cross-reference followed and confirmed to resolve
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate carries a finding class, and shared-policy rows are treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run over the root doc, the router and the rule directory
- [ ] CHK-FIX-003 [P0] Consumer inventory run for every document citing either half
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [ ] CHK-FIX-005 [P1] Matrix axes listed: governed unit by candidate, ten rows
- [ ] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential, secret path or private identifier enters a rule file
- [ ] CHK-031 [P0] Not applicable, no input-validation surface in scope
- [ ] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Not applicable, no code comments are written in this phase
- [ ] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes
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
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-14
**Validate RESULT (strict)**: RESULT: PASSED, errors 0, warnings 0, exit 0
**Metadata repair**: the first strict run reported 2 errors, both stale generated fields in graph-metadata.json, the stored description and the source fingerprint had gone stale against this phase's edited source docs, repair-derived.cjs regenerated them as the run prescribed, the rerun above is the final state
<!-- /ANCHOR:summary -->

---
