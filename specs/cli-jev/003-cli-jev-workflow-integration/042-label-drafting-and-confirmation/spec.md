---
title: "Feature Specification: Phase 42: label-drafting-and-confirmation"
description: "Seventeen child phases stop at an operator label gate: eleven can be filled from rows that exist or can be drawn, five cannot be filled from today's corpus, and 028 reads 027's report. Two models draft every row blind to each other, the operator confirms every row in chat, and the session writes each label file only from those answers, so a scorer reads only operator-confirmed values and each gate passes on a zero-call run or records its exact shortfall."
trigger_phrases:
  - "label drafting confirmation"
  - "operator label gate"
  - "blind label drafts"
  - "zero call gate run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 42: label-drafting-and-confirmation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-01 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 42 of 42 |
| **Predecessor** | 041-code-readmes-and-routing-alignment |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: every fillable feature holds a labeling card naming its rubric, label values, row source and the exact label file its scorer reads, every drafted row carries two blind drafts or a recorded reason and a compare split, every label file holds only values the operator confirmed in chat and each is traceable in its feature's decisions log, every fillable feature's scorer prints its label gate on a zero-call run or records its shortfall with the exact reason, and the blocked five with 028 carry their unblock condition while `validate.sh --strict` prints `RESULT: PASSED` for this phase and the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 42** of the cli-jev workflow integration specification, the last phase of the packet. It fills the label gates that phases 003 to 035 closed at: each of those phases stops before a model arm until an operator labels its rows, and parent D4 now reads "003, 006 and 019 to 035 stop at their label gate. Only operator-confirmed labels count" (`../goal.md` D4, amended 2026-10-01).

The operator's decisions of 2026-10-01 shape the whole method. Asked how the label gates should be filled, the operator chose "AI drafts, you confirm (Recommended)": two models draft each row blind to each other, rows where they agree are batched for one approve-all or flip-some answer, and rows where they disagree are put one per question with both picks shown, so labels stay human-approved and D4 holds. Asked when, the operator chose "After 041 lands (Recommended)", which is why this phase starts from 041's final state. Asked about the Pi-session excerpts of 003 and 026, whose rows are the operator's own conversation, the operator chose "Send to both labelers (Recommended)". Asked about the five features whose rows cannot be produced from today's corpus, the operator chose "Record them as blocked (Recommended)". The operator also asked to review everything in chat, not in files.

**Amended 2026-10-01 (ADR-001).** After the first chat review of 027 the operator delegated each feature's row decisions to an arbiter: first "Let fresh opus 5.5 xhigh decide", then "Opus decides, you see a digest (Recommended)" for the remaining features, and finally "Instead use Opus medium", one arbiter at a time. The two blind drafts stayed. The batch and per-question chat review in this section and in tasks T007 and T008 was replaced by a fresh Opus 5.5 medium arbiter per feature and a digest the operator can veto. `decision-record.md` holds the record, and each feature's decisions log under `scratch/evidence/labels/` names the arbiter, its rulings and the session's checks.

Four read-only inventories under `scratch/evidence/label-inventory-1.md` to `-4.md` carry the facts this phase plans against. Each opens the scorer, reads the gate constant in code, and cites `path:line`; the only commands they ran were the scorers' zero-call censuses, so no model, `jev` or Deem call was made. No file was written by any scorer.

Seventeen child phases carry a label gate or follow one. Eleven are fillable, and the table below names each one's gate and the rows available today. Five cannot be filled from today's corpus and are recorded as blocked with what would unblock them. 028 writes no labels of its own: it reads 027's report and follows 027's gate.

| Phase | Gate | Rows available today | This phase's work |
|-------|------|----------------------|-------------------|
| 003-goal-verifier-jev-shadow | 30 labeled rows of 50 (`score-verifier-labeled-set.cjs:37`) | 0 on disk; the untracked fixture is absent, and 50 rows are redrawable from `~/.pi/agent/sessions` (41 session files, 1,822 nudges) | Redraw 50 rows, then at least 30 operator-confirmed labels |
| 006-goal-criteria-lint | No numeric gate: one adopted rubric plus at least one labeled row (`score-goal-lint.cjs:216-220`); the operator target is all 100 rows | 100 drawn rows on disk, every label field null, all still joining (`stale=0`) | Adopt one rubric, then fill all 100 rows |
| 023-reply-harness-blinded-judge | 20 graded distinct matched replies (`judge-agreement.mjs:48`) | 42 masked, 38 distinct, 38 matched, 37 with a baseline; 0 graded | Grade 20 of the 37 eligible committed replies |
| 026-completion-claim-audit | 30 labeled rows with at least 5 yes and 5 no (`score-completion-claims.mjs:48`, `:51`) | 0; the named 003 fixture is absent, and 50 rows are drawable through 003's builder | Draw 50 rows, then at least 30 operator-confirmed labels |
| 027-stop-second-rater | 5 confirmed gold reads among the first 5 sampled lineages (`score-stop-rater.cjs:42`) | 16 sampled lineages with derived gold; 0 labeled | The operator's read of 5 lineages |
| 029-p0-reread-order | 20 rows labeled other than `real` (`score-severity-replay.cjs:49`) | 95 P0 rows in 37 registries; 0 labeled | Label the sheet; fewer than 20 negatives closes on the stop line |
| 030-fanout-merge-shadow-record | 40 labeled pairs and 10 labeled cross-body pairs (`score-fanout-pairs.cjs:60-61`) | 124 candidate pairs (all cross-body), 60 drawable in the sheet; 0 labeled | Label 60 drawn rows |
| 031-debug-next-check | 30 labeled fixture rows (`score-debug-next-check.mjs:75`) | 0; the mined corpus is empty and the fixture does not exist | Models draft a 30-row fixture, the operator approves it |
| 032-citation-drift-scan | 40 rows carrying a verdict, 20 live plus 20 constructed (`cite-drift-scan.mjs:70`) | 0 drawn; the 40-row draw succeeded on 2026-09-29 and 208 in-range citations exist today | Draw at the recorded seed, then the operator's 20 live verdicts |
| 034-hvr-reader-needed-lens | 150 rows labeled yes or no, 50 per category (`hvr_reader_lens.py:574-575`) | 0 drawn; the 150-row draw proof succeeded on 2026-09-29 and 41,080 in-band sections exist today | Draw at the recorded seed, then 150 operator labels |
| 035-fetched-text-injection-screen | 90 rows: 60 natural labels plus 30 non-blank planted sentences (`score-injection-screen.mjs:572-584`) | 90 drawn and committed; 30 of 90 labeled, 0 of 30 sentences | 60 natural labels plus 30 approved sentences |

Five features cannot be filled from today's corpus, and 028 writes no labels of its own. Their records, and what would unblock each, follow.

| Blocked feature | Why it cannot be filled today | What would unblock it |
|-----------------|-------------------------------|-----------------------|
| 020-routing-clarify-default | The row source is fixed by code and holds 2 mode-alternative rows against a 30-row gate, and no code path writes transcript rows (`scratch/evidence/label-inventory-1.md:188`) | A rows file holding at least 30 mode-alternative rows, authored by hand or by a transcript draw the loader accepts, named by the operator |
| 022-alignment-folder-suggestion | 0 rows exist, no transcript directory is named, and the committed tree yields 0 alternative-listing events (`scratch/evidence/label-inventory-1.md:254`) | An operator-named transcript directory yielding at least 30 low or infrastructure events that list alternatives, at least 30 of them carrying a state |
| 024-hallucination-grader | 0 benchmark outputs exist and the census runs over an empty outputs directory; producing them is out of scope (`scratch/evidence/label-inventory-2.md:111`) | A benchmark run whose outputs the operator names, holding at least 30 labelable rows with at least 5 of each class |
| 025-reviewer-verdict-fallback | 0 regex-miss outputs exist (8 fixture cases, 8 hits), no `reviewer-report.json` exists, and a live run keeps only a 16-character hash (`scratch/evidence/label-inventory-2.md:169`) | Operator-supplied regex-miss reviewer output text with its full text, at least 12 rows covering `pass`, `fail` and `block` |
| 033-validator-residue-flagger | The draw refuses: resolvable rows are correctness 0 and traceability 7 against the 25 per category a draw needs (`scratch/evidence/label-inventory-4.md:128`) | A corpus with at least 25 resolvable rows per category, then the draw, then the operator's 100 labels |
| 028-confirm-mode-stop-hint (follows 027) | It reads one 027 report and makes no model call in any mode; no 027 report exists in this worktree and the session's final one had a stopped gate (`scratch/evidence/label-inventory-3.md:90`) | A 027 report whose `gate.label.passed` is true, which needs 027's five confirmed gold reads |

**Scope Boundary**: the seventeen label-gated features' cards, the eleven fillable features' row draws, two blind drafts per row, compare splits, the operator's chat answers, their label files and their zero-call gate runs; the blocked five and 028 recorded in this phase's docs. No scorer, gate constant, or other phase's document changes, and no live Jev or Deem arm run happens here.

**Dependencies**:
- Phase 041 (`041-code-readmes-and-routing-alignment`), which is Complete, so this phase starts from its final state and starts after it.
- The four inventories of `scratch/evidence/`, which name each feature's scorer, row source, label schema, gate, feasibility and label-writer rule with `path:line`.
- The seventeen scorers at their committed paths, read only. Their gate constants are the target this phase fills against and no scorer is edited.
- The row sources the inventories name: 006's 100 committed rows, 023's 42 masked files, 032's 208 in-range citations, 034's 41,080 in-band sections, 035's 90 committed rows, 029's 95 P0 rows and 030's 124 candidate pairs under `specs/**`, and 003's and 026's draw from `~/.pi/agent/sessions`.
- The two labelers, Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin`, each drafting the same rows blind to the other. DeepSeek V4.1 Flash replaces Luna on `cli-codex` if codex fails, and the phase records the substitution.
- The operator in chat for every confirmation, in batches of 10 to 15 agreed rows with one approve-all or flip-some question, and one question per disagreed row with both picks shown.
- No install is needed. Every command in the proof plan runs from the repository root.

**Deliverables**:
- Seventeen labeling cards under `scratch/evidence/`, one per label-gated feature (`card-003.md` through `card-035.md`), of which the eleven fillable feature cards are the drafting contracts. Each card states the feature's own rubric from its spec, its label values, its row source and the exact label file its scorer reads.
- The row draws the inventories call missing: 003's 50-row fixture, 029's 95-row sheet, 030's 60-row pair sheet, and 032's and 034's seeded draws.
- Two blind draft JSONL files per fillable feature under `scratch/drafts/`, one per labeler, and one compare split per feature under `scratch/compare/`.
- The operator's answers in chat, recorded per row in a decisions log under `scratch/decisions/`, one per fillable feature.
- The label files themselves, written only from the operator's answers: `goal-criteria-labels.jsonl` (006), `cite-drift-labels.jsonl` (032), `hvr-reader-lens-labels.jsonl` (034), `labels.jsonl` and `planted.jsonl` (035), the redrawn `verifier-labeled-set.jsonl` (003), and the operator-named files the cards fix for 023, 026, 027, 029, 030 and 031.
- One zero-call gate result per fillable feature, recording the gate line or the shortfall with its exact reason.
- The blocked five and 028 recorded in this phase's docs with their unblock condition, and the phase's own record closed by `repair-derived.cjs --apply`, `validate.sh --strict` and `check-goal.cjs`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Seventeen child phases of this packet carry a label gate or follow one, and each is Complete with its gate still open. Each phase built its scorer, fixed its gate constant, printed a zero-call census, and handed the labels to the operator. The result is a fleet of scorers whose verdicts cannot be computed: nothing may call a model until the labels exist, and no phase ever produced them. 006 holds 100 drawn rows with every label field null, 032 and 034 hold no rows on disk at all, 003's untracked fixture is absent in this worktree, and 029, 030, 031 and 035 are short of their gates by between 20 and 150 rows.

The labels cannot simply be generated. Parent D4 rules that only operator-confirmed labels count, and every phase's own decisions say no model writes a label. So the work is a review pipeline: draft each row, put it in front of the operator, and write only what the operator confirms. Five features cannot enter that pipeline at all, because today's corpus cannot produce their rows: 020 has 2 mode-alternative rows against a 30-row gate, 022 has 0 rows and no named transcript directory, 024 has 0 benchmark outputs, 025 has 0 regex-miss outputs, and 033's draw refuses because resolvable correctness rows are 0 against the 25 per category a draw needs. Recording those five as blocked, with what would unblock them, is the only honest disposition.

### Purpose

Fill the eleven label gates that can be filled with operator-confirmed labels so each of their scorers can print its verdict, and record the five that cannot with their unblock condition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One labeling card per label-gated feature under `scratch/evidence/card-NNN.md`, written before any draft, stating the feature's own rubric from its spec, its label values, its row source and the exact label file its scorer reads.
- The row draws the inventories call missing: the 50-row 003 fixture, the 95-row 029 sheet, the 60-row 030 pair sheet, and the 032 and 034 draws at seed 20260929.
- Two blind drafts of every row, Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin`, each labeler printing draft JSONL and writing no label file. DeepSeek V4.1 Flash replaces Luna on `cli-codex` if codex fails.
- One compare split per feature that separates agreed rows from disagreed rows.
- The operator's chat review: agreed rows in batches of 10 to 15 with one approve-all or flip-some question, disagreed rows one per question with both picks shown, and drafted content shown for approve, edit or reject.
- One decisions log per feature recording every row's two draft labels and the operator's answer, and the label files written only from those answers.
- One zero-call gate run per fillable feature, recording the gate line or the shortfall with its exact reason.
- The blocked five and 028 recorded in this phase's docs with their unblock condition, and this phase's own record.

### Out of Scope

- Any live Jev or Deem arm run. Each needs a separate operator yes per feature and is not part of this phase's done (D4).
- Any label a model wrote. The labelers print drafts; the session writes a label file only from the operator's answers, and a row with no answer stays unlabeled (D1, D2).
- Synthetic rows for the blocked five, and any draw for them (D3). They are recorded, not filled.
- 028's own labels. It has none: it reads 027's report, and its unblock condition is 027's `gate.label.passed` turning true.
- Any edit to a scorer, a gate constant, a row source or another phase's documents.
- The commit of the label files and this phase's docs. The orchestrator commits path-scoped after the workers return.
- Reading or printing a credential, opening a `.env` file, and any call to a network service. The phase runs repo-local commands and the two named labelers only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-*.md` | Create | Seventeen labeling cards, one per label-gated feature, the eleven fillable ones being the drafting contracts |
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/drafts/*.jsonl` | Create | Two blind draft files per fillable feature, one per labeler |
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/compare/*.md` | Create | One agreed/disagreed split per fillable feature |
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/decisions/*.md` | Create | One decisions log per fillable feature, recording drafts and answers |
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/gates/*.txt` | Create | One zero-call gate recording per fillable feature |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` | Modify | 006: all 100 rows filled under one adopted rubric, operator-confirmed |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` | Create | 032: the draw's 20 constructed rows plus the operator's 20 live verdicts |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl` | Create | 034: the draw's 150 rows filled with the operator's yes or no labels |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl` | Modify | 035: the 60 natural rows labeled instructs or clean by the operator |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/planted.jsonl` | Modify | 035: the 30 planted sentences the operator approved |
| `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | Create | 003: 50 redrawn rows, at least 30 operator-confirmed; untracked and excluded, never committed |
| This phase folder's five docs (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`), plus `description.json` and `graph-metadata.json` through `repair-derived.cjs` | Modify | The phase record |

The remaining label files are operator-named: 023's, 026's, 027's, 029's, 030's and 031's paths are fixed in their cards before any draft starts, and a path inside the repository is used only when the rows are repository text. 029's `--write-label-sheet`, 030's `--write-pair-sheet` and 031's `--fixture` refuse an in-repo path by design, so those three live outside the repository.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **Every fillable feature has a card before any draft.** Each of the eleven features holds a card stating its own rubric from its spec, its label values, its row source and the exact label file its scorer reads, with the zero-call gate command and that scorer's gate constant. No draft is requested for a feature whose card is not written |
| REQ-002 | **Every row carries two blind drafts or a recorded reason.** Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin` each draft every row of a feature, neither labeler sees the other's output, and each prints draft JSONL. A row with one draft or none names the reason on its card, such as a codex failure that substituted DeepSeek V4.1 Flash, or a construction label that needs no second opinion |
| REQ-003 | **Every feature has a compare split.** One compare step per feature reads the two draft files and splits the rows into the rows both labelers agree on and the rows they disagree on, carrying both picks per row into the decisions log |
| REQ-004 | **The operator confirms every row in chat, and no label file is written before that.** Agreed rows are put to the operator in batches of 10 to 15 with one approve-all or flip-some question per batch, or in one batch holding the feature's remaining agreed rows when there are fewer than 10. Disagreed rows are put one per question with both picks and both labelers' output shown. Drafted content, the 035 planted sentences and the 031 fixture rows, is shown for approve, edit or reject. The operator's answers arrive in chat, and the session records each one |
| REQ-005 | **Every label file a scorer reads holds only operator-confirmed values.** The session writes each label file from the operator's answers alone, and one decisions log per feature records every row's two draft labels and the operator's answer. A row without an answer stays out of the label file, and the gate reports the shortfall |
| REQ-006 | **Every fillable feature's zero-call run reaches its gate or records its shortfall.** Each feature's zero-call command runs against the confirmed label file and its gate line is recorded under `scratch/gates/`. A feature whose corpus or code cannot reach the gate, such as 029 finding fewer than 20 not-real P0s or 027 consulting its gate only on a switched run, records the shortfall with the exact reason and closes on that line |
| REQ-007 | **The blocked five and 028 carry their unblock condition.** 020, 022, 024, 025 and 033 are recorded as blocked, each with the exact condition that would unblock it, and 028 is recorded as following 027's `gate.label.passed`, writing no labels of its own |
| REQ-008 | **No labeler writes a label file.** Each labeler's output is draft JSONL under `scratch/drafts/`. Before confirmation no file a scorer reads is written or modified, and the phase can show that by the label files' hashes at the card step and at the write step |
| REQ-009 | **Drafted content is approved, not assumed.** The 035 planted sentences and the 031 fixture rows are drafted by the two labelers, shown to the operator, and written only in the form the operator approved. An edited row is written as edited; a rejected row is redrafted or recorded as rejected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | **A live arm run waits for a separate yes.** Neither `--jev` nor `--deem` is passed to any scorer in this phase. A live arm run is offered to the operator per feature after its gate passes, and needs its own yes (D4) |
| REQ-011 | **Rows are drawn only where the inventory says they are missing, and the blocked five get no synthetic rows.** 003, 029, 030, 032 and 034 are drawn as the inventories direct; 006, 023, 026, 027, 031 and 035 use rows that exist. No row is invented for 020, 022, 024, 025 or 033 (D3) |
| REQ-012 | **The two labelers are the named models, blind to each other.** Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin`, each drafting the same rows without seeing the other's output. DeepSeek V4.1 Flash replaces Luna on `cli-codex` if codex fails, and the substitution is recorded on the card and in the log |
| REQ-013 | **Every gate result is recorded and the phase's own gates pass.** The eleven zero-call gate results, each draw's counts, each compare split and every operator decision are recorded under `scratch/`, and `repair-derived.cjs --apply`, `validate.sh --strict` for this phase and the parent, and `check-goal.cjs` run from the final state |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Eleven labeling cards exist for the fillable features, one per feature, each naming its rubric, label values, row source, exact label file and zero-call gate command, and the six other label-gated features carry their own card under `scratch/evidence/`.
- **SC-002**: Every row of every fillable feature carries two blind drafts or a recorded reason, and one compare split per feature separates the agreed rows from the disagreed rows.
- **SC-003**: Every label file a scorer reads holds only values the operator confirmed in chat, and each value is traceable to that row's entry in its feature's decisions log.
- **SC-004**: Each fillable feature's scorer prints its label gate on a zero-call run, or its shortfall is recorded with the exact reason, and the blocked five with 028 carry their unblock condition.
- **SC-005**: `validate.sh --strict` prints `RESULT: PASSED` for this phase and the parent, no labeler wrote a label file, and no live Jev or Deem arm ran without a separate operator yes.

### Proof Plan

Written before the build. `C` is a labeling card, `D` a decisions log, `L` a label file a scorer reads, `S` a scorer, and `F` the feature folder of one of the eleven fillable phases under `specs/cli-jev/003-cli-jev-workflow-integration/`.

1. Card gate. For each `C`, read the four required statements (rubric, label values, row source, exact label file) and the zero-call gate command, and check each against the feature's inventory section. Check: the eleven fillable features' cards, each with all five statements, and the label file named is the file the inventory says the scorer reads; the six other label-gated features carry their own card as a record. Boundary: a card whose label file is not the one the scorer reads fails its row, and no draft may start before its card passes.
2. Draft gate. `ls scratch/drafts/` names two draft files per feature, and each file holds one JSON object per row with the feature's own row id. Check: every row id appears in both files, and each labeler's draft is its own output, with no label file written before confirmation. Boundary: a row with one draft and no recorded reason fails its row; a label file whose hash changed before the confirmation step is a kill, because it cannot then be shown to hold only confirmed values.
3. Confirmation gate. For each `D`, every row carries its two draft labels and the operator's answer, and no agreed batch exceeds 15 rows. For each `L`, every line matches an answered row and the value written is the value answered. Check: no `L` line without an answered row, no answered row missing from `L`, and every disagreed row shows both picks in its question. Boundary: a label file value no answer covers is a kill, and so is an answer the decisions log does not carry.
4. Zero-call gate. For each feature, run its exact zero-call command from `C` against the confirmed `L` and record the output under `scratch/gates/`. Expected: the gate line reads ready, or the shortfall line names the exact reason. Boundary: a switched `--jev` or `--deem` run is not a zero-call run and fails the row (REQ-010); 029 closing on `stop: fewer than 20 labeled P0 negatives` after all 95 rows were labeled is a recorded shortfall, not a failure; 027's gate prints only on a switched run, so its row records the census and that reason.
5. Blocked and 028 gate. Read this phase's spec section that records the five blocked features and 028 and check each of the five names the exact condition that would unblock it, and 028 names 027's report field. Check: six records, no synthetic rows drawn for any of the five, and 028 carries no label file of its own. Boundary: a blocked feature with no named unblock condition fails the row.
6. Closure. Record every gate result, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation --apply`, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation --strict`, the same strict run on the parent, and `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` on this folder. Check: `RESULT: PASSED` for this phase and the parent, and `RESULT: PASSED (5/5 checks)` for the goal.

**Kill criterion.** A label file a scorer reads that holds a value no operator answer covers closes nothing. So does a gate line printed from a label file a labeler wrote. A green `validate.sh --strict` never substitutes for REQ-005.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Luna 6 max on `cli-codex` and SWE 2 max on `cli-devin` | A labeler that cannot run leaves rows with one draft | The other labeler's draft stands with the reason recorded, and DeepSeek V4.1 Flash replaces Luna on `cli-codex` if codex fails (REQ-012) |
| Dependency | 003's untracked fixture `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | The file is absent in this worktree, so 003 and 026 have no rows | One builder run recreates 50 rows from `~/.pi/agent/sessions`; the builder refuses to overwrite an existing output |
| Dependency | The operator's chat answers for every row | No label file can be written without them | Rows are batched 10 to 15 at a time, and a row with no answer stays out of the file and is reported by the gate |
| Dependency | The 029 sheet, the 030 pair sheet and the 031 fixture must live outside the repository | An in-repo path is refused with exit 2 and writes nothing | The card fixes an operator-named path outside the repository before the draw (REQ-001, REQ-011) |
| Risk | 029's gate counts negatives, and the read of 95 P0 rows may find fewer than 20 | The gate cannot pass even with every row labeled | The shortfall is recorded with the exact count and the phase closes on the stop line, exactly as 029's own spec allows |
| Risk | 027's gate is consulted only when `--jev` or `--deem` is set | A zero-call run cannot print its gate line | The row records the census (`16 sampled lineages`, derived gold on 16 of 16) and the reason the gate itself is not printed; a live run needs a separate yes (REQ-010) |
| Risk | A labeler writes a file a scorer reads, or a draft is copied into one | A scorer would read a value no operator confirmed | Each labeler writes under `scratch/drafts/` only, and the proof plan compares the label files' hashes before the confirmation step and after the write step |
| Risk | 006's labels need one rubric id before any label, and the scorer refuses mixed rubrics | A mixed labels file prints `rubric mismatch` and no rate | The card records the adopted rubric id before the first label, and the zero-call run is the check (REQ-001, REQ-006) |
| Risk | 035's planted sentences and 031's fixture rows are model-drafted content | A row the operator did not approve would enter a gate | Drafted content is shown for approve, edit or reject, and only the approved form is written (REQ-009) |
| Risk | 020, 022, 024, 025 and 033 cannot be filled from today's corpus | Effort spent inventing rows would produce labels no operator source backs | They are recorded as blocked with their unblock condition, and no synthetic row is drawn for them (D3, REQ-007, REQ-011) |
| Risk | 023's gate counts only graded replies that also carry a baseline | Graded rows can drop out of the counted set | The card names the 37 eligible replies before grading, and the zero-call run prints `distinct`, `matched` and `no baseline` counts to check against |
| Risk | The private rows of 003 and 026 are the operator's own conversation | A misdirected row would leave the machine | The operator chose "Send to both labelers" for those excerpts, so they go only to the two named labelers, and the report files stay outside the repository |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No scorer, hook or runtime path changes. The phase writes label files, scratch artifacts and phase docs, so no request, hook or router call gains a read, a parse or a process. Each gate run is a one-shot zero-call census over committed rows.
- **NFR-P02**: Each feature's zero-call gate run finishes within its own scorer's budget, and no command starts a server, opens a socket or reaches the network. The only outputs that cross a machine boundary are the rows the operator released to the two named labelers.

### Security
- **NFR-S01**: No credential, key, token or `.env` file is read, written or printed. No `jev` call is made and the local Deem server at `127.0.0.1:8300` is never contacted (REQ-010).
- **NFR-S02**: The private rows of 003 and 026, the operator's own Pi conversation, go only to the two labelers the operator named in "Send to both labelers", and the label files that carry session content live outside the repository. No other feature's rows leave the repository.

### Reliability
- **NFR-R01**: A label file is written once, from the operator's answers, and a gate re-run over it is deterministic: the same file prints the same gate line. A re-run that disagrees with the recorded line is a defect to resolve, not a new baseline.
- **NFR-R02**: An interrupted session loses no confirmed answer. The decisions log is written per feature as answers arrive, so a resumed session can rebuild the label file from the log without asking the operator again.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A draw returns fewer rows than the gate needs: the card records the count, the gate line is recorded as a shortfall with that count, and no row is invented to reach the floor.
- 003's builder is run when the fixture already exists: it refuses to overwrite and exits without writing, so the existing file is labeled unless the operator directs a redraw.
- A row's two drafts agree but the operator flips it: the flipped value is what the label file carries, and the decisions log records both drafts and the flip.
- 035's planted slot holds blank text after an edit: the gate requires 30 non-blank sentences, so the row stays open and is reported by the zero-call run.
- 006's labels carry one rubric id: a labels file with two ids prints `rubric mismatch` and no rate, so the card fixes the adopted rubric before the first label.

### Error Scenarios
- A labeler fails or times out: the other labeler's draft stands with the reason recorded, and the codex failure path substitutes DeepSeek V4.1 Flash (REQ-012).
- A scorer exits non-zero on a zero-call run: the exit code and its output are recorded as the feature's gate result, and the cause is fixed in the label file or recorded as the shortfall, never worked around by editing the scorer.
- A draw refuses an in-repo path: the path is moved outside the repository and the card records the new one; no refusal is bypassed.
- The operator approves a batch and later asks to change one row: the change is recorded as a new answer in the decisions log, and the label file is rewritten from the log's final answers.

### State Transitions
- Between drafting and confirmation the repository holds drafts and no label file: the pre-confirmation hash check is what keeps that boundary visible.
- During a batch review the session holds partly answered rows: the decisions log is written per feature as answers arrive, so a resumed session continues from the first unanswered row.
- After a gate passes, a live arm run is offered per feature: it starts only on a separate yes, and until then the phase's done is the gate line itself (REQ-010).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Eleven features, seventeen gate records, six label-file paths and one review pipeline per feature |
| Risk | 9/25 | Every scorer is read-only, the gates are repo-local, and the main risk is a label file holding a value no operator confirmed |
| Research | 6/20 | The four inventories settle every scorer, gate, row source and label-writer rule before the first draft |
| **Total** | **30/70** | **Level 2**, as every build phase of this packet is |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Does 029's read find 20 not-real P0s among the 95 rows?** Proposed: label the whole sheet, and if the read finds fewer than 20 negatives, record the exact count and close on `stop: fewer than 20 labeled P0 negatives`, which 029's own spec already allows. UNKNOWN until the operator's labels exist.
- **Does 027's gate print on a zero-call run?** Observed: the gate is consulted only when `--jev` or `--deem` is set, and a switch without `--out` exits 2 before any call. Proposed: record the census and the derived-gold line as 027's zero-call result and name the switched-run limit as the reason; the gate itself prints on the first switched run the operator approves. UNKNOWN until the operator's five reads exist.
- **Does a redraw still return exactly 50 rows for 003 and 026?** Proposed: run the builder once and record its counts; the recorded run wrote `rows=50 pi=50 claude=0`, and whether today's corpus still yields 50 is inferred from the census, not measured. UNKNOWN until the draw runs.
- **Which paths do the operator-named label files take?** Proposed: the card fixes each path before the first draft, inside the repository only for repository text, and outside it for 023, 026, 027, 029, 030 and 031 where the rows carry session content or the scorer refuses an in-repo path. UNKNOWN until the operator names them.
- **What happens to a row both labelers get wrong?** Proposed: the operator's answer is the label whatever the drafts say, and the row is counted in the compare split as a double miss so the record shows the drafts' error. UNKNOWN until the first disagreement review.
<!-- /ANCHOR:questions -->

---
