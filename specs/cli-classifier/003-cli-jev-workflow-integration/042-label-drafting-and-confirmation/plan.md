---
title: "Implementation Plan: Phase 42: label-drafting-and-confirmation"
description: "Eleven label-gated features get a labeling card, two blind drafts per row from Luna 6 max on cli-codex and SWE 2 max on cli-devin, a compare split, the operator's chat confirmation in batches of 10 to 15 agreed rows and one question per disagreed row, a decisions log, a label file written only from the answers, and a zero-call gate run that prints the gate line or records the shortfall. Five features whose corpus cannot produce rows are recorded as blocked with what would unblock them, 028 follows 027's gate, and no live Jev or Deem arm runs without a separate operator yes."
trigger_phrases:
  - "label drafting plan"
  - "labeling card gate"
  - "blind draft compare"
  - "chat label confirmation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 42: label-drafting-and-confirmation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown for the cards, compare splits and decisions logs, JSONL for the drafts and every label file, Node and Python only as the scorers' runtimes |
| **Framework** | None. The phase uses the repository's own scorers read-only and the two named labelers; it adds no dependency |
| **Storage** | Seventeen cards, one per label-gated feature, two blind draft files and one compare split per fillable feature, one decisions log per feature, six label files a scorer reads, and the phase's own record |
| **Testing** | Each feature's zero-call gate run, the draw counts, the label-file hashes before confirmation and after the write, `repair-derived.cjs --apply`, `validate.sh --strict` and `check-goal.cjs` |

### Overview

The phase runs one review pipeline per fillable feature. A card fixes the feature's rubric, label values, row source and exact label file. Rows are drawn where the inventory says they are missing. Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin` each draft every row blind to the other, print draft JSONL and write no label file. A compare step splits the rows into agreed and disagreed. The operator confirms in chat: agreed rows in batches of 10 to 15 with one approve-all or flip-some question per batch, disagreed rows one per question with both picks shown, and drafted content shown for approve, edit or reject. The session writes each label file only from those answers, records every row's drafts and answer in a decisions log, and runs the feature's scorer zero-call to print the gate line or record the shortfall. The five features today's corpus cannot fill, and 028, which reads 027's report, are recorded with their unblock condition instead of being given synthetic rows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator's decisions are recorded: 2026-10-01 "AI drafts, you confirm (Recommended)", "After 041 lands (Recommended)", "Send to both labelers (Recommended)" for the Pi-session excerpts of 003 and 026, and "Record them as blocked (Recommended)" for 020, 022, 024, 025 and 033
- [ ] Parent D4 reads "Only operator-confirmed labels count" and the phase's four decisions in `goal.md` are frozen
- [ ] The four inventories under `scratch/evidence/` are read, and every fillable feature's gate constant, row source, label schema and label-writer rule is taken from them rather than assumed
- [ ] Phase 041 is Complete, and this worktree carries the seventeen scorers at the paths the inventories name
- [ ] The row sources are checked before the first draw: 006's 100 committed rows, 023's 42 masked files, 032's 208 in-range citations, 034's 41,080 in-band sections, 035's 90 committed rows, 029's 95 P0 rows and 030's 124 candidate pairs
- [ ] The two labelers are confirmed: Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin`, with DeepSeek V4.1 Flash named as the codex fallback
- [ ] The operator is available in chat for the confirmation step, because no label file may be written before the answers arrive

### Definition of Done
- [ ] The five completion criteria in `goal.md` pass from the final state
- [ ] Every row of `acceptance-criteria.md` is `Met` with its observed command output, or left open with the reason
- [ ] Every fillable feature's card exists under `scratch/evidence/` and every draft started only after its card was written
- [ ] Every drafted row has two blind drafts or a recorded reason, and every feature has a compare split
- [ ] Every label file a scorer reads holds only values the operator confirmed, each traceable in its feature's decisions log
- [ ] Each fillable feature's zero-call run printed its gate line, or its shortfall is recorded with the exact reason
- [ ] The blocked five and 028 are recorded with their unblock condition, and no synthetic row was drawn for any of the five
- [ ] `repair-derived.cjs --apply`, `validate.sh --strict` for this phase and the parent, and `check-goal.cjs` ran from the final state
- [ ] Only the files in `spec.md` section 3 changed, no scorer or other phase's document changed, no labeler wrote a label file, and no live arm ran (REQ-010)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One review pipeline per feature, run eleven times, with the scorers read-only at both ends. The pipeline's fixed points are the card (what to label, against which rubric, into which file), the two blind drafts (what the models think), the compare split (where they agree), the operator's chat answers (what is true) and the label file (what the scorer reads). Nothing in the middle may write a label file, and nothing after confirmation may write a value the operator did not give.

### Key Components

- **The labeling card**: one per label-gated feature under `scratch/evidence/card-NNN.md`, the pipeline's contract for the eleven fillable features. Each states the rubric from the feature's own spec, the allowed label values, the row source and the exact label file the scorer reads, plus the zero-call gate command and the gate constant.
- **The row draw**: the commands the inventories name for the five features whose rows are missing, each writing to the path the card fixes and none inventing a row.
- **The two labelers**: Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin`, each drafting every row of a feature without seeing the other's output, each printing draft JSONL under `scratch/drafts/`.
- **The compare split**: one step per feature that reads both draft files and writes the agreed rows and the disagreed rows with both picks under `scratch/compare/`.
- **The chat confirmation**: the operator's answers, batched 10 to 15 at a time for agreed rows and one question per disagreed row, with drafted content shown for approve, edit or reject.
- **The decisions log**: one per feature under `scratch/decisions/`, recording every row's two draft labels and the operator's answer, and the source the label file is written from.
- **The label files**: the six files the scorers read, written only from the answers, each checked against the decisions log before its gate run.
- **The gate run**: each feature's zero-call command, recorded under `scratch/gates/` with its gate line or its shortfall reason.

### Data Flow

A card fixes a feature's rubric, values, row source and label file. The draw writes rows where they are missing, or the rows already exist. Both labelers read the same rows and each writes draft JSONL; neither writes a label file, so the file a scorer reads is untouched at this stage. The compare step splits the drafts into agreed and disagreed rows. The operator answers in chat, batch by batch for agreed rows and one row at a time for disagreed rows, and the session records every answer in the decisions log as it arrives. The label file is then written from the log alone, so a scorer reads only what the operator confirmed. The zero-call run reads that file and prints the gate line, or names the shortfall, and no model call happens at any point.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a labeling pass over scorers that are already built and gates that are already fixed, so the addendum records the producers and consumers around the changed surface and the invariant the label files keep.

- Same-class producers: `rg -n 'LABEL_GATE|MIN_ROWS|CLASS_GATE' .skilled` names every gate constant, and each fillable feature's constant is taken from its inventory section (`scratch/evidence/label-inventory-1.md:62` for 003, `scratch/evidence/label-inventory-3.md:175` for 030). No constant changes.
- Consumers of a label file: one scorer per feature, read from the file's committed default (006, 032, 034, 035) or from the operator-named path the card fixes. Each consumer is run once, zero-call, from the final state.
- Consumers of the rows: the two labelers read the same rows, and the compare step is the only reader of both draft files. The operator reads the batches in chat, not the files.
- Matrix axes: the feature axis (eleven fillable, five blocked, 028), the row axis (each feature's rows against its gate), the draft axis (two drafts or a recorded reason per row), the answer axis (every row answered against every label-file line), and the gate axis (ready line or shortfall reason).
- Algorithm invariant: for every label file a scorer reads, each line's value equals the answer recorded for that row in the decisions log, and every row without an answer is absent from the file. Adversarial cases: a row both labelers disagree on, which the operator resolves; a row the operator flips, which is written as flipped; a row a labeler left undrafted, which names its reason and stays unlabeled.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task checkboxes and state. The six phases below are the plan of record.

**Who runs what.** The two labelers draft and produce content: Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin`, each blind to the other, and DeepSeek V4.1 Flash replaces Luna on `cli-codex` if codex fails. The orchestrating session checks and writes the cards, runs the draws, runs each scorer's zero-call gate, writes the label files and the decisions logs from the operator's answers, and records every result. The operator answers in chat and is the only source of a label. No other writer touches a file a scorer reads.

Each phase's observable check:

1. **Cards and row draws.** Check the seventeen cards under `scratch/evidence/`, one per label-gated feature, against the inventories, then draw the missing rows: 003's 50-row fixture, 029's 95-row sheet, 030's 60-row pair sheet, and 032's and 034's draws at seed 20260929. Check: the eleven fillable features' cards each name the rubric, the label values, the row source, the exact label file and the zero-call gate command, and each draw writes the row count the inventory records with the label fields empty.
2. **Blind drafting.** Dispatch both labelers per feature, each drafting every row without the other's output, each printing draft JSONL under `scratch/drafts/`. Check: every fillable feature holds two draft files, every row id appears in both or carries a recorded reason, and no file a scorer reads was written or modified.
3. **Compare.** One step per feature splits the two drafts into the rows both labelers agree on and the rows they disagree on, with both picks carried per row. Check: every row of every feature lands in exactly one split, and the two splits together equal the row count.
4. **Chat confirmation.** Put the agreed rows to the operator in batches of 10 to 15 with one approve-all or flip-some question per batch, or in one batch holding the remaining agreed rows when a feature has fewer than 10, and the disagreed rows one per question with both picks shown. Show the drafted 035 sentences and 031 fixture rows for approve, edit or reject. Record every answer in the feature's decisions log as it arrives. Check: every row carries an answer, no batch exceeds 15 agreed rows, every disagreed row was asked with both picks, and no label file was written yet.
5. **Label files and zero-call gates.** Write each label file from its decisions log alone, then run the feature's zero-call command and record the output under `scratch/gates/`. Check: each label file's hashes match the pre-confirmation hashes where the file existed, every line matches an answered row, and each run prints the gate line or the shortfall with its exact reason.
6. **Blocked records and closure.** Record the five blocked features and 028 with their unblock condition in the phase docs, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict` for this phase and the parent, and `check-goal.cjs`. Check: six records with their conditions, `RESULT: PASSED` for this phase and the parent, and `RESULT: PASSED (5/5 checks)` for the goal.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root. `F` is one of the eleven fillable feature folders under `specs/cli-jev/003-cli-jev-workflow-integration/`, `S` the scorer its card names, `L` the label file its card names, and `C` its card.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Card gate | Each card against its feature's inventory section | A read of `C`, checked against `scratch/evidence/label-inventory-*.md` |
| Draw gate | The five draws and their row counts | Each draw command itself, with its output recorded under `scratch/` |
| Draft gate | Two draft files per feature and one draft value per row | A read of `scratch/drafts/`, compared row id by row id |
| Confirmation gate | Every row answered, batch sizes, both picks on disagreed rows | `scratch/decisions/`, checked against `scratch/compare/` |
| Label-file gate | Every label-file line backed by an answer, no unrelated line | `S`'s zero-call run plus a read of `L` against `scratch/decisions/` |
| Gate run | Each feature's status against its own gate constant | `S` with no `--jev` and no `--deem`, output recorded under `scratch/gates/` |
| Blocked gate | The five blocked features and 028 | A read of this phase's spec and the four inventories' closing tables |
| Manual | Reading the operator's answers against the label files as a reviewer would | A row-by-row check per feature, per proof plan step 3 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 041, whose final state this phase starts from | Internal | Complete | The phase would start from a tree 041's closure has not settled |
| The four inventories under `scratch/evidence/` | Internal | Present | No card can name a gate, row source or label file from evidence |
| The seventeen scorers at their committed paths | Internal | Present, read only | No zero-call gate run is possible |
| 006's 100 committed rows and 035's 90 committed rows | Internal | Present, label fields empty or partly filled | The gate has nothing to read |
| 023's 42 masked files, 032's in-range citations and 034's in-band sections | Internal | Present in the tree | The draws or the grades have no rows |
| 029's 95 P0 rows and 030's 124 candidate pairs | Internal | Present under `specs/**` | The label sheets have no rows |
| 003's and 026's Pi-session rows | External, in `~/.pi/agent/sessions` | Present; the fixture is absent and redrawable | Both features have no rows and no labels |
| The operator's answers in chat | External, the only label source | Required per row | Rows stay unlabeled and the gates report the shortfall |
| Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin` | External, dispatched | Named; DeepSeek V4.1 Flash stands in for Luna on codex failure | A feature drafts with one labeler and records the reason |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A label file a scorer reads that holds a value no operator answer covers, a labeler-written label file, a live `--jev` or `--deem` run without a separate yes, a synthetic row drawn for a blocked feature, or an edit to a scorer or another phase's document.
- **Procedure**: Stop the phase at the failing check. Restore the label file from the pre-confirmation hash or delete it if it did not exist, keep the decisions log as the record of what was answered, and re-run the feature's zero-call gate to confirm the file reads back cleanly. No scorer, gate constant or other phase's document was ever in the change set, so the revert is confined to the label files and this phase's scratch artifacts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
1 (Cards and draws) ─► 2 (Blind drafting) ─► 3 (Compare) ─► 4 (Chat confirmation) ─┐
                                                                                     ├─► 6 (Blocked records and closure)
5 (Label files and zero-call gates) ◄────────────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Cards and row draws | The four inventories and the row sources, read only | Phase 2 |
| 2. Blind drafting | Phase 1, so every draft has a card and rows to read | Phase 3 |
| 3. Compare | Phase 2, so both draft files exist per feature | Phase 4 |
| 4. Chat confirmation | Phase 3, so agreed and disagreed rows are separated | Phase 5 |
| 5. Label files and zero-call gates | Phase 4, so every written value is an answer | Phase 6 |
| 6. Blocked records and closure | Phases 1 and 5 | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1. Cards and row draws | Med | Seventeen cards read against the inventories, plus the five draws at their recorded seeds |
| 2. Blind drafting | High | Two labelers over every row of eleven features, the largest share of the work |
| 3. Compare | Low | One split per feature over the two draft files |
| 4. Chat confirmation | High | The operator's answers, batched for agreed rows and one per disagreed row |
| 5. Label files and zero-call gates | Med | Six label files written from the logs, eleven zero-call runs recorded |
| 6. Blocked records and closure | Low | Six records, the acceptance rows and the phase's own gates |
| **Total** | | The six phases above, with the operator's chat time as the critical path |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The four inventories are read and each card's gate, row source and label file is taken from them
- [ ] The label files' hashes are captured before the confirmation step, including files that do not exist yet
- [ ] Each draw's row count is recorded, so a redraw can be compared against it
- [ ] The decisions log is written per feature as answers arrive, so it survives an interrupted session
- [ ] No command carries `--jev` or `--deem` (REQ-010)

### Rollback Procedure
1. Stop the phase at its failing check.
2. Restore or delete the affected label file from its pre-confirmation hash.
3. Re-run that feature's zero-call gate to confirm the file reads back cleanly.
4. Record the revert and the reason in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No. The phase writes label files, scratch artifacts and its own docs, and no persisted service data.
- **Reversal procedure**: A `git checkout` of the affected label files restores their prior contents, and a label file that did not exist is deleted. The decisions log stays as the record of the answers, and the draw commands can be re-run from their recorded seeds to recreate the rows.
<!-- /ANCHOR:enhanced-rollback -->

---
