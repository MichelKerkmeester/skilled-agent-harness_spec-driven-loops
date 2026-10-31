---
title: "Tasks: Phase 42: label-drafting-and-confirmation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "labeling task breakdown"
  - "draft compare tasks"
  - "confirmation batch tasks"
  - "gate run checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 42: label-drafting-and-confirmation

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

`F` is one of the eleven fillable feature folders under `specs/cli-jev/003-cli-jev-workflow-integration/`: 003, 006, 023, 026, 027, 029, 030, 031, 032, 034 and 035. `C` is that feature's card at `scratch/evidence/card-NNN.md`, `D` its decisions log under `scratch/decisions/` and `L` the label file its card names. The plan's six phases map onto the three sections below: cards and row draws (plan phase 1) in Phase 1 with the pre-draft checks; blind drafting, compare and the operator's confirmation (plan phases 2 to 4) and the label files (plan phase 5) in Phase 2; the zero-call gate runs, the blocked records and the closure (plan phases 5 and 6) in Phase 3. Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin` draft every row blind to each other, DeepSeek V4.1 Flash replaces Luna on `cli-codex` if codex fails, and the orchestrating session checks and completes the cards, runs the draws, writes each label file from the operator's answers, runs every gate and records every result. The operator answers in chat and is the only source of a label. No task passes `--jev` or `--deem`, and no task writes a synthetic row for 020, 022, 024, 025 or 033.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Check and complete the labeling cards (scratch/evidence/card-NNN.md). For each `F`, card `C` states the feature's own rubric from its spec, its allowed label values, its row source, the exact label file its scorer reads, its zero-call gate command and its gate constant, all taken from `scratch/evidence/label-inventory-1.md` to `-4.md`. Check: the eleven fillable features' cards, each carrying those six statements, and the label file named is the file the inventory says the scorer reads; the six other label-gated features carry their own card as a record. Open (2026-10-01): the card files exist under `scratch/evidence/`; this task closes when each fillable card is read against its inventory section. Unlocks every later task because no draft is requested for a feature whose card is missing. Done 2026-10-01: seventeen cards under `scratch/evidence/`, eleven fillable read against their inventories and six record cards.
- [x] T002 [P] Draw the rows the inventories call missing (scratch/, F). Draw 003's 50-row fixture with `.skilled/hooks/goal/lib/build-verifier-fixture.cjs --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl`, 029's sheet with `--write-label-sheet <path outside the repo>`, 030's pair sheet with `--write-pair-sheet <path outside the repo>`, and 032's and 034's rows with `--draw --seed 20260929`. Check: each draw prints its row count (003 50 rows, 029 95 rows, 030 60 rows, 032 40 rows, 034 150 rows), every drawn label field is empty except the construction labels, and every path matches the card. Depends on T001 for the paths. Done 2026-10-01: 003 50, 029 95, 030 60, 032 40 and 034 150 rows, each exit 0; 032 and 034 drew into the ignored `scratch/build/` first (`scratch/evidence/labels/gates.md`).
- [x] T003 Baseline the label files before confirmation (scratch/gates/). Hash or confirm the absence of every `L`, including 006's committed 100-row file, 035's two committed files, and the six operator-named paths. Check: one recorded hash per existing label file, one recorded absence per missing file, and no label file modified. Depends on T002. Done 2026-10-01: HEAD hashes and absences recorded in `scratch/evidence/labels/gates.md` Baselines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Blind draft every row, labeler one (scratch/drafts/, F). Dispatch Luna 6 max on `cli-codex` over every row of each `F`, with no sight of the other labeler's output, printing draft JSONL that names each row id and its drafted label or drafted content. Check: one draft file per feature, every row id present, no file a scorer reads written or modified. DeepSeek V4.1 Flash replaces Luna on `cli-codex` if codex fails, and the substitution is recorded on the card and in `D`. Done 2026-10-01: Luna drafts under `scratch/drafts/` and `~/.skilled/.labels/drafts/`; codex never failed, so DeepSeek was not needed.
- [x] T005 [P] Blind draft every row, labeler two (scratch/drafts/, F). Dispatch SWE 2 max on `cli-devin` over the same rows, blind to labeler one, printing its own draft JSONL. Check: one draft file per feature, every row id present, and the two draft files are independent outputs. Depends on T004 only for the row list, not for the drafts. Done 2026-10-01: SWE drafts beside Luna's, blind. SWE dropped one row in several runs, recorded as `single-draft` in the splits.
- [x] T006 Compare the two drafts per feature (scratch/compare/, F). Split the rows into the rows both drafts agree on and the rows they disagree on, carrying both picks per row. A row with one draft and a recorded reason, such as a codex failure, is listed separately. Check: the agreed and disagreed splits together equal every row of the feature, and each disagreed row names both picks. Depends on T004 and T005. Done 2026-10-01: `scratch/compare/NNN-split.jsonl` per feature and `scratch/compare/summary.txt`.
- [x] T007 Confirm the agreed rows in chat (scratch/decisions/, F). Put the agreed rows to the operator in batches of 10 to 15, or in one batch holding the remainder when a feature has fewer than 10, one approve-all or flip-some question per batch, and record every answer in `D` as it arrives. Check: no batch exceeds 15 agreed rows, every agreed row carries an answer, and a flipped row carries the operator's value beside both drafts. Done 2026-10-01 under ADR-001: the operator delegated row decisions to an Opus 5.5 medium arbiter and reviewed a digest per feature instead of batches.
- [x] T008 Confirm the disagreed rows and the drafted content in chat (scratch/decisions/, F). Ask the disagreed rows one per question with both picks and both labelers' output shown, and show 035's 30 planted sentences and 031's 30 fixture rows for approve, edit or reject. Check: every disagreed row was asked with both picks, every drafted row carries approve, edit or reject, and an edited row carries the operator's final text. Depends on T006. Done 2026-10-01 under ADR-001: the arbiter settled every split row and approved or edited 035's 30 sentences (14 edited) and 031's 36 rows (3 edited, none rejected).
- [x] T009 Write the label files and the decisions logs (L, D, F). Write each `L` from its `D` alone, then record the log so every row names its two draft labels and the operator's answer, and so every written line traces to an answer. Check: every `L` line matches an answered row, no answered row is missing from `L`, no line exists for an unanswered row, each `L`'s hash differs from its pre-confirmation hash only where the file changed for an answer, and no labeler-written file exists. Depends on T007 and T008. Done 2026-10-01: every label file written by parser from the arbiter output; eleven decisions logs under `scratch/evidence/labels/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run each feature's zero-call gate (scratch/gates/, F). Run the exact command `C` names with no `--jev` and no `--deem`, against the confirmed `L`, and record the output. Check: one result per fillable feature, each printing its gate line, or a shortfall recording the exact reason (029 finding fewer than 20 not-real P0s after all 95 rows, or 027 consulting its gate only on a switched run). Depends on T009. Done 2026-10-01: eleven zero-call results in `scratch/evidence/labels/gates.md`, every one exit 0.
- [x] T011 Record the blocked five and 028 (spec.md, F). Record 020, 022, 024, 025 and 033 as blocked with the exact condition that would unblock each, and 028 as following 027's `gate.label.passed` with no labels of its own. Check: six records, each with its unblock condition, no synthetic row drawn for any of the five, and 028's row names 027's report field rather than a label file of its own. Done 2026-10-01: blocked records in `spec.md` and record cards 020, 022, 024, 025, 028 and 033; no blocked feature in the draw list.
- [x] T012 Closure (this phase's docs). Record every draw count, compare split, answer and gate result in `acceptance-criteria.md` and `goal.md`'s log, mark each acceptance row from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict` for this phase and the parent, and `check-goal.cjs`. Check: every acceptance row `Met` or open with its reason, `RESULT: PASSED` for this phase and the parent, and `RESULT: PASSED (5/5 checks)` for the goal. Depends on T010 and T011.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it
- [x] No `[B]` blocked tasks remaining. The five blocked features are records in `spec.md` and carry no task, because no task can fill them from today's corpus (D3)
- [x] Manual verification passed: every fillable feature's card, two blind drafts per row or a recorded reason, the operator's answers in every decisions log, every label file written only from those answers, and each feature's zero-call gate line or shortfall recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Prior phase**: `../041-code-readmes-and-routing-alignment/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-013. Planned: `spec.md` section 4. Evidence: written this pass, with the eleven fillable and the six non-fillable records. Observed: spec.md REQ-001 to REQ-013.
- [x] CHK-002 [P0] Technical approach defined in plan.md with the six phases and their checks. Planned: `plan.md` section 4. Evidence: written this pass, each phase with its observable check. Observed: plan.md six phases.
- [x] CHK-003 [P1] Dependencies identified and available: the four inventories, the seventeen scorers, the row sources, the two labelers and the operator's chat. Planned: `plan.md` section 6. Evidence: the inventories exist under `scratch/evidence/` and name each row source with `path:line`. Observed: every dependency was reached; the operator's chat answers became a delegation (ADR-001).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Label Quality

- [x] CHK-010 [P0] Every fillable feature has a card naming its rubric, label values, row source and exact label file before any draft. Planned: T001 and the proof plan step 1. Evidence: the eleven fillable features' cards under `scratch/evidence/`, each checked against its inventory section. Observed: eleven fillable cards before any draft.
- [x] CHK-011 [P0] Every drafted row carries two blind drafts or a recorded reason, and no labeler wrote a file a scorer reads. Planned: T004, T005 and the proof plan step 2. Evidence: two draft files per feature under `scratch/drafts/`, with the pre-confirmation hashes unchanged. Observed: `scratch/drafts/`, `~/.skilled/.labels/drafts/`, label files unchanged from baseline until the session wrote them.
- [x] CHK-012 [P1] Every feature has a compare split, and every row lands in exactly one side of it. Planned: T006. Evidence: `scratch/compare/` holds one split per feature whose two sides total the feature's row count. Observed: `scratch/compare/summary.txt`; each split's rows equal the feature's labeled rows.
- [x] CHK-013 [P1] Every label file value traces to an operator answer in its decisions log, and no unanswered row is in a label file. Planned: T007 to T009. Evidence: `scratch/decisions/` read against each `L` line by line. Observed under ADR-001: every label value traces to the arbiter output named in its decisions log.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`. Evidence: AC-001, 002, 004, 005, 006 and 007 Met with observed outputs, AC-003 Superseded by ADR-001.
- [x] CHK-021 [P0] Every fillable feature's zero-call gate ran from the final state and printed its gate line or its shortfall reason. Planned: T010. Evidence: `scratch/gates/` holds eleven recordings, each with its exit code. Observed: `scratch/evidence/labels/gates.md`, eleven results, exit 0.
- [x] CHK-022 [P1] Edge cases are covered: a shortfall close on 029, a redraw refused by 003's builder, a flipped row, a blank planted slot and an in-repo draw refusal. Planned: `spec.md` edge cases and the proof plan's boundaries. Met at closure for the cases the run meets, and each unmet case is recorded with its reason. Observed: 003's builder refused a redraw (`OUT_EXISTS`, exit 2), 029's writer refused an in-repo path (exit 2, no file), 032's draw refused once labels existed, and 035's census showed 0 of 30 sentences before drafting. 029 met its gate with 22 negatives, so no shortfall close was needed (`scratch/gates/edge-cases.txt`).
- [x] CHK-023 [P1] The blocked five and 028 carry their unblock condition, and no synthetic row was drawn for a blocked feature. Planned: T011. Evidence: `spec.md`'s blocked records and the draw list, which names no blocked feature. Observed: spec.md blocked records and six record cards; no blocked feature drawn.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Labeling Completeness

- [x] CHK-FIX-001 [P0] Every row's disposition is one of: agreed and approved, flipped, disagreed and answered, undrafted with a recorded reason, or unanswered and absent from the label file. Planned: T006 to T009. Evidence: the compare splits and decisions logs, read row by row. Observed: every row's disposition in `scratch/compare/` is agreed-kept, agreed-flipped, split-settled or single-draft.
- [x] CHK-FIX-002 [P0] Every producer of a label file is the session, proven by the labelers' write scope. Planned: T004, T005 and T009. Evidence: the labelers' outputs sit under `scratch/drafts/`, and each `L`'s hash matches the pre-confirmation hash until T009. Observed: labeler outputs only under drafts folders; label files written by the session alone.
- [x] CHK-FIX-003 [P0] Every consumer of a label file is inventoried: one scorer per feature, each read once, zero-call. Planned: T010. Evidence: the eleven gate recordings name the scorer, the file and the exit code. Observed: one zero-call scorer run per feature in `gates.md`.
- [x] CHK-FIX-004 [P0] Adversarial rows exist: a row both labelers miss, a row the operator flips, a blank planted slot and an in-repo draw refusal. Planned: `spec.md` edge cases and the proof plan's boundaries. Evidence: the double miss is counted in the compare split, the flip carries both drafts, and the refusals are recorded rather than bypassed. Observed: 11 agreed-flipped rows that both drafters missed (023 6, 026 1, 029 1, 032 1, 006 2), the blank planted slots before drafting and the in-repo draw refusal.
- [x] CHK-FIX-005 [P1] Matrix axes and row counts are listed before completion is claimed. Planned: the proof plan's axes and the draws' recorded counts. Evidence: the feature axis, row axis, draft axis, answer axis and gate axis each carry their row counts under `scratch/`. Observed: feature, row, draft, arbiter and gate counts in `scratch/compare/summary.txt` and `gates.md`.
- [x] CHK-FIX-006 [P1] A hostile variant runs with the label file withheld: the scorer prints its gate shortfall rather than a verdict. Planned: T010, run once with the file absent for a feature that still has one. Evidence: the recorded shortfall line with its exit code. Observed: 023 run with no label file printed `labels: none`, `labeled: 0`, `stop: fewer than 20 labeled replies`, exit 0 (`scratch/gates/edge-cases.txt`).
- [x] CHK-FIX-007 [P1] Evidence is pinned to label-file hashes and recorded gate lines, not to a moving state. Planned: T003 and T010. Evidence: the pre-confirmation hashes, the written hashes and the gate outputs under `scratch/`. Observed: baseline hashes, the written files' gate lines and fixture hashes (031 `e7b550eb…`, 023 labels `4bef6075…`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret in any changed file, and no label file carries a secret. Planned: NFR-S01. Evidence: no changed file is a credential file, and the label files carry labels, ids and paths only. Observed: a key-shape scan of the 003 and 026 rows found none; label files hold labels, ids and paths, and 035's two sentences name a variable without a value.
- [x] CHK-031 [P0] No `.env` file is read, no environment value is printed, and no service is called: no `jev` call and no request to the local Deem server. Planned: NFR-S01 and REQ-010. Evidence: no task passes `--jev` or `--deem`, and every command is a repo-local scorer or draw. Observed: no `.env` read, no `--jev`, no `--deem`.
- [x] CHK-032 [P1] The private rows of 003 and 026 go only to the two named labelers, and session-content label files live outside the repository. Planned: NFR-S02 and the operator's "Send to both labelers". Evidence: the draws' outputs and the cards' paths, checked before dispatch. Observed: 003 and 026 rows went only to Luna, SWE and the delegated arbiter; their labels sit in the excluded rows file and `~/.skilled/.labels/`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized as the phase runs. Evidence: the closure pass set `spec.md` Status Complete, every task and checklist item here, every acceptance row and `goal.md` criterion 5 from one recorded state, after the cross-family review fixes logged in `goal.md`.
- [x] CHK-041 [P1] Every card and decisions log is complete enough for a reader to trace a label file line back to the operator's answer. Planned: T001 and T009. Evidence: `scratch/evidence/` and `scratch/decisions/`, read against each `L`. Observed: each decisions log names method, rulings and checks.
- [x] CHK-042 [P2] The operator-named label-file paths are recorded in their cards, and a path inside the repository is used only for repository text. Planned: T001. Evidence: each card's label-file line, checked against the row source's content kind. Observed: the operator named `~/.skilled/.labels`; in-repo label files hold repository text only.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Cards, drafts, compare splits, decisions logs and gate recordings stay under `scratch/` only. Planned: T001 to T010. Evidence: `find` over this phase's `scratch/` lists them, and nothing sits outside it. Observed: cards, drafts, splits, decisions logs and gate recordings under `scratch/`, private copies under `~/.skilled/.labels/`.
- [x] CHK-051 [P1] The label files sit at the exact paths their cards name, and no temp file sits outside `scratch/`. Planned: T009 and T012. Evidence: each card's label-file line matches the written path, and the phase's diff names only the files of `spec.md` section 3. Observed: each written path matches its card.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-01. Every item is checked with its evidence at closure. The closure gate outputs are in `acceptance-criteria.md` AC-006, and the cross-family review outcome is in `goal.md`'s log.
<!-- /ANCHOR:summary -->

---
