---
title: "Tasks: Phase 7: wording-standard-restructure"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "standard restructure tasks"
  - "consumer enumeration"
  - "exclusion count"
  - "publish language search"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: wording-standard-restructure

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

- [x] T001 Confirm phase 2 recorded the base-plus-supplement decision
  - Evidence: plan.md records the base-plus-supplement cut, the reply-versus-publish line and the instruction that the base names the supplement (plan.md:32, 57)
- [x] T002 Enumerate every consumer of the standard, starting from the research list and re-running the grep rather than trusting it
  - Evidence: consumer grep re-run before the first edit, 73 files reference hvr-rules.md, full list in scratch/baseline.md
- [x] T003 [P] Map each section of the standard to the reply side, the publish side, or neither
  - Evidence: every section mapped to a side in scratch/baseline.md, sections 1 to 8 reply side, 9 and 10 plus the scoring, precedence and attention machinery publish side
- [x] T004 Record the current exclusion count and the current consumer list as the baseline
  - Evidence: scratch/baseline.md written before the edit with the exclusion count (two), the 73-file consumer list and the section-to-side map
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create the supplement and move the publish machinery into it
  - Evidence: references/hvr-publish-supplement.md created, 151 lines, carrying the scoring machinery, the precedence rule, the pre-publish checklist and related resources, hvr-rules.md reduced to the 419-line reply-side base
- [x] T006 Leave the reply-scoped subsection currently inside a document-structure section on the reply side
  - Evidence: the Tables In A Reply subsection stays in hvr-rules.md section 4, the restructure diff shows no hunks in section 4
- [x] T007 Land the borrowability test
  - Evidence: bold borrowability rule in the base voice directives after the directive block, instruction, rewrite requirement and failure line, prose anyone could have written
- [x] T008 Land the nominalization and stacked-compression pair
  - Evidence: nominalization and stacked compression subsection in the structural patterns section, instruction, failure line and WRONG/RIGHT fence, placed before the banned metaphors subsection
- [x] T009 Land the plain-word test
  - Evidence: bold plain-word rule in the base voice directives, concrete root instruction, Latinate abstraction failure line
- [x] T010 Land the literal-over-figurative rule
  - Evidence: literal over figurative subsection after Tables In A Reply, instruction, failure line and WRONG/RIGHT fence
- [x] T011 Land the document scan test on the side phase 2 chose
  - Evidence: document scan bullet in the supplement checklist section after the pass threshold line, instruction, headers as labels, failure line, a document that cannot be scanned
- [x] T012 Land the worked exemplar on the side phase 2 chose
  - Evidence: marked exemplar paragraph in the base voice directives, five sentences of first person observation with concrete numbers
- [x] T013 Retire the scoring-band exclusion
  - Evidence: scope-and-exemptions.md now states exactly one exclusion remains and that the scoring bands live in the publish supplement a reply never loads
- [x] T014 Restate the surviving exclusion's reason as message ownership, in the file
  - Evidence: the ownership reason sits at the top of section 5 of hvr-rules.md, a projection or rewrite carrying someone else's message skips the section
- [x] T015 Update the mode's router and scope gate for the new shape
  - Evidence: the SKILL.md resource domains, loading table and related-resources row each show base plus supplement, the score step names the supplement, references/README.md carries the supplement row
- [x] T016 Repoint any consumer whose target filename changed
  - Evidence: no-op, the base keeps the filename hvr-rules.md so no consumer pointer changed, the 73-file consumer list is unchanged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Open every reply-side consumer and confirm it resolves to the base
  - Evidence: sk-communication's wording standard section names the Human Voice Rules at hvr-rules.md, response.md:72 and response-by-external-agent.md:136-137 load it by path, communication.md:125 routes to sk-communication which names the base, one indirect hop
- [x] T018 Open every document-side consumer and confirm it resolves to base plus supplement
  - Evidence: the mode lists base and supplement at SKILL.md:59-60, loading table :67-68 and related resources :254-255, with-human-voice.md:28-29 routes to the mode, scoring-and-verification.md:184 names only the base and never the supplement, recorded as an open pointer
- [x] T019 Search the base for file, score and publish-threshold language and expect nothing
  - Evidence: the case-sensitive grep returns 4 lines: 31 the naming sentence, 35 the usage pointer, 281 and 326 the substring hits in endpoints and underscores, the deduction headings hold Point capitalized and never match
- [x] T020 Count the exclusion rows and confirm exactly one remains
  - Evidence: the scope gate states at its lines 152-153 that of the two exclusions carried, exactly one remains, the voice-personality exclusion for carried messages
- [x] T021 Confirm the base names the supplement
  - Evidence: the usage section names hvr-publish-supplement.md at line 31 and the rewritten checklist pointer at line 35
- [x] T022 Run the documentation skill's own gate and read its output and exit status
  - Evidence: the scanner on the supplement, exit 0, no traceback, findings identical to the baseline, x1 get first@63, x4 oxford-comma-candidate first@17, mechanical deductions -1, mechanical ceiling 99/100
- [x] T023 Confirm the scoped diff touches only the standard's files, the scope gate, the mode router and any repointed pointer
  - Evidence: the status shows the mode router, the references README, the scope gate, the base, the supplement and 007/tasks.md, the supplement still untracked from its part one creation, the remaining entries are other packets' work in the shared checkout, this run touched nothing beyond the five files and the 007 folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (checklist worked 2026-09-15 with the folder validated PASSED)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md:122-133, REQ-001 through REQ-007)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md Architecture and Implementation Phases sections, T001)
- [x] CHK-003 [P1] Consumer list and exclusion count captured as a baseline before the first edit (T004, scratch/baseline.md)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every added rule traces to one of the six allocation rows (T007-T012, implementation-summary Candidate To Section table)
- [x] CHK-011 [P0] The surviving exclusion states message ownership as its reason, in the file (T014)
- [x] CHK-012 [P1] The base is smaller than the current single file (T005, hvr-rules.md reduced to the 419-line reply-side base)
- [x] CHK-013 [P1] Both files follow the standard's existing document shape (T005-T012, each candidate placed in its section's own shape per the Candidate To Section table)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, AC-001 through AC-007 all Met)
- [x] CHK-021 [P0] Every consumer opened, not assumed, in both families (T017, T018)
- [x] CHK-022 [P1] The base searched for publish language with an empty result (T019, AC-003, rerun grep confirms the same 4 lines are naming residue and substring coincidences, no actual publish-language violation)
- [x] CHK-023 [P1] The reply-scoped subsection confirmed to reach a reply (T006, T017)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate carries a finding class, and the restructure is treated as cross-consumer (implementation-summary Candidate To Section table classifies each of the six, T002 treats the 73-file consumer list as cross-consumer)
- [x] CHK-FIX-002 [P0] Same-class producer inventory run over every file stating wording guidance (rerun repo grep for the standard's name and the plain-English phrase surfaces only the standard's own consumers, no rival producer, alongside T002's baseline)
- [x] CHK-FIX-003 [P0] Consumer inventory re-run rather than inherited from the research (T002, 73 files, scratch/baseline.md)
- [x] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope (not applicable: doc restructure only, per the Files Changed table)
- [x] CHK-FIX-005 [P1] Matrix axes listed: consumer family by file, four rows (plan.md FIX ADDENDUM, two consumer families times two files)
- [x] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase (not applicable: no code changed this phase)
- [x] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range (the phase's edits landed in `cf5778e12d`, and the verification pass that wrote these rows is `468ffab0b9`, so every file:line above reads against `cf5778e12d` and the checklist against `468ffab0b9`.)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or private identifier enters either file (rerun secret-pattern grep over the five changed files, no matches)
- [x] CHK-031 [P0] The scope gate still names every span a rewrite may never touch (T013, T014, T020, scope-and-exemptions.md still gates the surviving exclusion)
- [x] CHK-032 [P1] Not applicable, no auth or authorization surface in scope (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md REQ-001 through REQ-007, plan.md phases and T001-T023 all describe the same six candidates and base-plus-supplement cut)
- [x] CHK-041 [P1] Not applicable, no code comments are written in this phase (not applicable: doc-only phase)
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes (parent spec.md:161, phase 7 row reads Complete)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only .gitkeep and baseline.md, verified by listing)
- [x] CHK-051 [P1] scratch/ cleaned before completion (baseline.md is retained by design as the evidence T002, T004, T011 and T019 cite, not stray output; no other file present)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15, the base-scoring-language grep, the credential scan and the parent Phase Documentation Map read all ran from the final state; the one open P1 is the commit-pinning row
<!-- /ANCHOR:summary -->

---
