---
title: "Tasks: Phase 2: synthesis-and-decisions"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "synthesis tasks"
  - "allocation tasks"
  - "adr tasks"
  - "duplicate assignment check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: synthesis-and-decisions

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

The eight operator decisions are recorded and Accepted in `decision-record.md`, so no task below asks
for a decision. The work is to allocate the candidate union against those decisions, record the
candidates no surface can carry and record what was rejected and why.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm both research syntheses exist at their exact paths and are non-empty (`001-research-communication-context/research/research.md`, `004-sk-communication-upgrade/research/research.md`)
  - Evidence: both synthesis paths listed this session and both are non-empty. The 001 synthesis was read in full. The 004 synthesis was size-checked only.
- [x] T002 Read each synthesis rather than its dashboard or its own summary. Record the iteration counts the handoff criteria name, ten and five (both synthesis docs read in full this session. DeepSeek `001-research-communication-context/research/research.md`: 10 iterations, 10 files iteration-001 through iteration-010 counted in its `research/iterations/`; concludes 47 raw recommendations merge to 29 failure-keyed candidates across `communication.md`'s split, the wording standard's base-plus-supplement shape and the benchmark folder, with the ADHD contract split into 7 unconditional and 3 reader-conditional rules. LUNA `research/luna-fanout/lineages/luna/research.md`: 5 iterations, 5 files iteration-001 through iteration-005 counted in its own `iterations/`, run record section 8 confirms all five ran under the max-iterations policy; concludes the stack already covers most sentence-level clarity, directness, actionability, list, tangent, handoff and evidence rules, with new material limited to pre-draft content choice, a strongest-objection paragraph, section-question transitions, document thresholds, code-comment style and ADHD reader framing plus its runtime and eval mechanism, and names three scope-sensitive contradictions)
- [x] T003 Confirm each of the eight ADRs in `decision-record.md` reads Accepted, because a row cites an ADR as its verdict source (`decision-record.md`)
  - Evidence: decision-record.md read in full this session. ADR-001 through ADR-009 all read Accepted.
- [x] T004 [P] Re-read the current stack so an already-covered verdict is checked against the rule text rather than against memory of it (allocation-table.md Section 1 re-read in full: 29 rows read either adopt, 25, or non-work, 4; zero rows read already-covered, matching Note 5's own count of the 34 source rows excluded before the merge. Cross-checked the current-stack text that exclusion rests on by reading repo-rules/communication-prose.md in full, the 2026-09-14 rename of prose-mechanics.md: its content at the cited line numbers, 60-65 state-the-relation, 67-72 name-the-mechanism, 118-127 concise-is-not-compressed, still matches the already-covered claims the source syntheses cite under the old filename. 0 already-covered rows found, 0 needed further confirmation, none failed to hold)
- [x] T005 Take the candidate union and its arithmetic from the phase 001 synthesis: 44 candidate rows merged into 29 candidates by the failure each one prevents
  - Evidence: the union taken verbatim from iteration-004.md F1 this session. 81 = 34 + 47, 47 - 3 = 44, 44 - 15 = 29.
- [x] T006 [P] Take the engine synthesis's four decision-free changes and its five decisions. Confirm each decision maps to an Accepted ADR
  - Evidence: 004 research.md section 4 lists five decisions. Content-loss floor maps to ADR-006, the unchanged candidate to ADR-007, thinking mode to ADR-008, the detector channel to ADR-005 which builds none, the cut-and-reorder lane to ADR-004 which keeps the smoothing pass. All five Accepted in decision-record.md. The four decision-free changes in section 3 needed no ADR and landed in phase 004
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Build the allocation table with one row per candidate and record the failure each candidate prevents (`spec.md`)
  - Evidence: allocation-table.md section 1. 29 rows, one per candidate, each carrying the failure wording from iteration-004.md F1.
- [x] T008 Assign a verdict to every row: adopt, reject, already-covered or recorded non-work (`spec.md`)
  - Evidence: section 1 verdict column. 25 adopt, 4 non-work, no blanks. The other two verdicts are unused because the 34 already-covered source rows produced no candidate.
- [x] T009 For every adopted row, name exactly one owning document (`spec.md`)
  - Evidence: section 1 owning-document column. All 25 adopted rows name exactly one. The 4 non-work rows name none.
- [x] T010 For every adopted row, name the specific failure it prevents and reject any row that cannot name one (`spec.md`)
  - Evidence: section 1 candidate column. Every adopted row carries the failure wording copied from iteration-004.md F1. None failed to name one.
- [x] T011 Point each row whose verdict came from a settled conflict or engine question at its ADR (`decision-record.md`)
  - Evidence: section 1 ADR column. Row 19 cites ADR-003 and row 11 cites ADR-004. Both read Accepted in decision-record.md.
- [x] T012 Record the four candidates with no owning surface as deliberate non-work, each with its blocking reason: the editing lane for durable prose, the long-session decay problem, runtime mirror verification and reply-level numbering (`spec.md`)
  - Evidence: section 2. Rows 11, 21, 24 and 28, each with a blocking reason and no owning document.
- [x] T013 Write the rejection list with one reason per rejection, covering the colon-clause ban, the framework-word rename, the unchanged evidence rule on cause ordering, the cut-and-reorder lane and the second-lane option, both detector designs, the proportion threshold and the no-floor option, the two unchanged-candidate options, the two remaining thinking-mode options and the not-X-but-Y permission (`spec.md`)
  - Evidence: section 3. Fourteen rejected options, one reason each, covering all nine required items.
- [x] T014 Record the reader-profile split: the seven delivery rules that bind whenever a reply is written and the three reader-conditional rules that need an operator-selected mode that stays off by default (`spec.md`)
  - Evidence: section 4. The seven delivery rules and the three reader-conditional rules, taken from iteration-009.md, Finding 6.
- [x] T015 Record the wording-standard shape the rows assume: a base plus a supplement rather than two halves, with the two reply-facing wording candidates flowing through the voice-half delegation so both surfaces move together
  - Evidence: section 5. Base plus supplement, with rows 9 and 10 through the voice-half delegation.
- [x] T016 Record the handoff note that the pre-change baseline is captured during phase 003's setup, because a baseline taken after the rules change cannot support a regression claim
  - Evidence: section 6. Baseline in phase 003's setup, before its first edit.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Confirm every row carries a verdict and no row is blank
  - Evidence: section 1. All 29 verdict cells are filled. Checked by counting the verdict-pattern rows after writing.
- [x] T018 Scan the owning-document column for any candidate assigned twice
  - Evidence: section 1. The adopted rows' owner counts sum to 25, one owner per row: 10, 6, 2, 2, 2, 1, 1, 1. No candidate appears twice.
- [x] T019 Confirm the table's row count equals the candidate union, with four rows in the non-work register
  - Evidence: sections 1 and 8. 29 rows against the 29-candidate union, 4 rows in the register.
- [x] T020 Confirm ADR-001 through ADR-008 are present in `decision-record.md`, reachable from the row that cites each one and reading Accepted
  - Evidence: decision-record.md read this session. All nine ADRs present and reading Accepted. Rows 11 and 19 cite 004 and 003. The others are cited from section 3.
- [x] T021 Confirm each candidate assigned to a new rule file names why the existing documents cannot carry it, which for the reply-shape bundle is the length ceiling `communication.md` records
  - Evidence: the notes under section 1. The ceiling and the prior split at communication.md:49-51 are named there, taken from iteration-004.md F3.
- [x] T022 Confirm the rejection list carries a reason per rejection and that no rejected option reappears as an adopted row
  - Evidence: section 3. A reason on each of the 14 rows. Cross-read against section 1: the rejected options are alternatives or pure decisions, so none returns as an adopted row.
- [x] T023 Confirm each non-work row carries a blocking reason and no owning document
  - Evidence: section 2. Four rows, reason column filled, owning-document column none on every row.
- [x] T024 Confirm each lineage disagreement carries a diagnosis of underspecified question or thin evidence and no tally
  - Evidence: section 7. One documented disagreement, diagnosed as thin evidence. The between-runs comparison found none and says what it compared. No tally.
- [x] T025 Run `validate.sh specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions --strict` from the final state and read both its output and its exit status
  - Evidence: RESULT: FAILED. Exit: 2. Then repaired the generated metadata with the repair command the run printed, both violations being recomputable, and reran once: RESULT: PASSED. Exit: 0.
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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md REQ-001 through REQ-007)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md defines the allocation approach)
- [x] CHK-003 [P0] The eight ADRs read as Accepted before any row cites one as a verdict source (T003, T020: ADR-001 through ADR-009 read Accepted)
- [x] CHK-004 [P1] Both research syntheses verified by inspection rather than by their own summaries (T002: DeepSeek research.md and LUNA research.md both read in full this session, 10 and 5 iterations respectively confirmed against their iterations/ directories)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Not applicable, this phase writes documents and runs no build (not applicable: this phase writes documents and runs no build)
- [x] CHK-011 [P0] Every adopted row names a failure specific enough to argue with (T010: all 25 adopted rows carry the failure wording)
- [x] CHK-012 [P0] Each of the eight ADRs is reachable from the packet and reads Accepted (T003, T011, T020)
- [x] CHK-013 [P1] Every verdict traces to the synthesis finding or the ADR it came from (T007-T011, T021)
- [x] CHK-014 [P1] ADR numbering is stable and a changed decision supersedes rather than edits (decision-record.md ADR-001 through ADR-009, sequential and unique, none superseded)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md AC-001 through AC-009 all Met)
- [x] CHK-021 [P0] Duplicate-assignment scan run over the owning-document column (T018: owner counts sum to 25, no duplicate)
- [x] CHK-022 [P0] The row count equals the candidate union, with the four non-work rows present (T019: 29 rows against the 29-candidate union, 4 non-work rows present)
- [x] CHK-023 [P0] The rejection list carries a reason per rejection (T013, T022: 14 rejected rows, one reason each)
- [x] CHK-024 [P1] Already-covered rows checked against the actual document text, not its summary (T004: allocation-table.md Section 1 carries zero already-covered verdict rows, confirmed by direct inspection of all 29 rows and cross-checked against the renamed repo-rules/communication-prose.md text underlying that exclusion)
- [x] CHK-025 [P1] Each lineage disagreement carries a diagnosis rather than a count (T024: one disagreement diagnosed as thin evidence, not averaged)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not applicable, this phase fixes nothing (not applicable: this phase fixes nothing)
- [x] CHK-FIX-002 [P0] Not applicable, no producer class changes (not applicable: no producer class changes)
- [x] CHK-FIX-003 [P0] Not applicable, no helper, policy or schema field changes (not applicable: no helper, policy or schema field changes)
- [x] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic in scope (not applicable: no path, parser, redaction or security logic in scope)
- [x] CHK-FIX-005 [P1] The allocation table's axes are candidate and owning document. The rows are the table itself (allocation-table.md section 1, T007: candidate by owning document)
- [x] CHK-FIX-006 [P1] Not applicable, nothing here reads process-wide state (not applicable: nothing here reads process-wide state)
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase 001 and phase 004 lineage directories, which are immutable once settled (T001: evidence pinned to the phase 001 and phase 004 lineage directories)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or key value enters the allocation table or the rejection list (credential scan of allocation-table.md and decision-record.md clean, no matches)
- [x] CHK-031 [P0] Delegate findings treated as claims to check, not facts to transcribe (T017, T018, T020, T021, T022: independent verification steps, not transcription)
- [x] CHK-032 [P1] Not applicable, no auth or authorization surface in scope (not applicable: no auth or authorization surface in scope)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized and each document treats the eight decisions as recorded rather than open (spec.md, tasks.md notation section, acceptance-criteria.md intro: the eight decisions recorded as Accepted, not open)
- [x] CHK-041 [P1] Not applicable, no code comments written in this phase (not applicable: no code comments written in this phase)
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes (parent spec.md Phase Documentation Map row 2, Status Complete)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only .gitkeep)
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch/ empty except .gitkeep)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15, T002 and T004 completed (both research syntheses read in full and the allocation table's already-covered verdict count re-verified against current repo-rules text), CHK-004 and CHK-024 closed, then validate.sh --strict rerun
**Validate RESULT (strict)**: RESULT: PASSED, errors 0, warnings 1, exit 0
**Metadata repair**: the first strict run reported 2 errors, a stale graph-metadata.json source_fingerprint and a drifted description field against the edited tasks.md, repair-derived.cjs regenerated both, the rerun above is the final state
<!-- /ANCHOR:summary -->

---
