---
title: "Build Phase: Goal-Criteria Lint"
description: "Give sk-create-goal rules 4 and 5 their first machine check: a zero-call lexical lint of goal criteria beside check-goal.cjs, scored against about 100 operator labels under a rubric the operator adopts first. The build stops at the label gate. A model arm on Deem or Jev is built only past the stop rule and stays dormant without its backend."
trigger_phrases:
  - "goal criteria lint"
  - "lint-goal-criteria"
  - "score-goal-lint"
  - "goal criteria rubric rules 4 and 5"
  - "r20 model arm not built"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Build Phase: Goal-Criteria Lint

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 005-compaction-recall-harness |
| **Successor** | 007-classifier-deep-research |
| **Handoff Criteria** | The phase hands off at its label gate (parent D4). The lint, the scorer and their tests pass, and about 100 criterion lines are drawn with a recorded seed and their label fields left empty. The scorer run on that file prints `unlabeled=` with the row count and no rate. The rubric, the labels, the per-rule numbers and the stop or arm decision come after the gate, from the operator, and are not part of this phase's completion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the cli-jev workflow integration specification. It builds recommendation R20 from `../004-deep-research-expansion/research/research.md` (section 3, `### R20 (next): the lexical lint`, section 5, section 11, `### R20. Goal-criteria lint`, and section 13, `### 006-goal-criteria-lint`). The synthesis renamed this phase from `006-goal-criteria-jev-lint`, because its first slice makes no Jev call and the folder name should not promise one. Research round 3 amends the later arm for two backends (`../007-classifier-deep-research/research/research.md` section 12, `### R20. Goal-criteria lint`, condition C12, and section 14, `### 006-goal-criteria-lint (Planned, amended)`): the arm may run on Deem or Jev, Deem preferred, and the lint itself takes no classifier, because its value is that it is deterministic. The folder keeps its name.

**Scope Boundary**: New advisory scripts beside `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`, two test files and a labels file. `check-goal.cjs` is read only, so its five checks, its output and its exit codes 0, 1 and 2 stay exactly as they are. The existing files this phase changes are sk-create-goal's docs and the sk-doc hub feature catalog, each through sk-doc (parent D6). `create-goal-auto.yaml` gains one line only after the label gate, and only with sk-doc's approval.

**Label gate (parent D4)**: The phase stops where a human labels. The build delivers the lint, the scorer, their tests, the skill docs and a drawn sample whose label fields are empty. No model writes a label. The rubric choice, the labels, the scored numbers, the stop decision, any model arm and the workflow line come after the gate and are not part of this phase's completion.

**Build route (parent D5)**: A fresh Opus 5.5 xhigh build orchestrator writes single-change briefs and runs CLI executors by Bash only: Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` and Cursor `grok-4.7-xhigh-fast`. The orchestrator session verifies, gets a cross-family review of the code and commits.

**Dependencies**:
- None for the build up to the label gate. It runs under the working default rubric A. The operator's rubric (open question 34) and about 100 operator labels come after the gate. None on other phases for the lint
- For a later Jev arm: 002's per-call latency record, the redaction unit cases in three modules and the parent D1 checks. For a later Deem arm: `cli-deem` (proposed) from phase 008 (`../008-cli-classifier-hub`) and the Deem check (007's research section 3, `### The Deem check, the second half of D1`)

**Deliverables**:
- `lint-goal-criteria.cjs`: a zero-call lexical lint for rules 4 and 5 that always exits 0
- `score-goal-lint.cjs`: per-rule precision, recall and F1 against the labels, the labeled violation rate and the stop line
- `lint-goal-criteria.test.cjs` with seven cases, and `score-goal-lint.test.cjs` (proposed) proving the scorer on synthetic fixture labels
- `goal-criteria-labels.jsonl` with about 100 drawn rows whose label fields the operator fills after the gate
- sk-create-goal's `SKILL.md`, `README.md`, `scripts/README.md`, changelog and manual testing playbook, plus an sk-doc hub feature catalog entry, updated through sk-doc (parent D6)
- After the label gate, and not part of this phase's completion: a model arm behind `--deem` (proposed) or `--jev`, only when the stop rule clears

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

No machine check tests rules 4 and 5 of `sk-create-goal`. Rule 4 asks for three to seven self-contained criteria, and rule 5 asks that each be checkable without opening another file (`.skilled/skills/sk-doc/sk-create-goal/SKILL.md:121-122`). `check-goal.cjs` runs five structural checks, `missing-binding-row`, `placeholder`, `criteria-count`, `parent-budget` and `frontmatter-fence` (`check-goal.cjs:46-52`), and `criteria-count` covers only the three-to-seven count. This matters because Claude Code's native goal judge reads only the stored goal string (`goal-set-string-playbook.md:55-57`), so a criterion that points at another file cannot be checked there and leaves completion open.

How often criteria break the rules has no single answer. Five recorded readings run from 1.5% (a strict regex for explicit references, 21 of 1,387) to 79.5% (strict referent resolution, 35 of 44 in mimo-02's sample). The synthesis finds that these readings measure three failure definitions, not one quantity, so the base rate waits on a rubric the operator has not chosen (research section 5).

### Purpose

Give rules 4 and 5 a measured, advisory lint whose precision and recall are known against the operator's own labels, at zero model calls and with `check-goal.cjs` untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A lexical lint that reads each active `goal.md`, extracts its criterion bullets with a copy of `check-goal.cjs`'s parser and flags rule 4 and rule 5 spans. It prints a report or JSON and always exits 0.
- A walker that skips `z_archive` and every path with a `scratch` segment, and prints the scratch count apart.
- A scorer that joins the labels to the lint's output, prints per-rule precision, recall and F1, the labeled violation rate with a Wilson 95% interval and a stale-label count, and prints the stop line when the rate is under 0.05. Its tests prove each output on synthetic fixture labels, because the real labels come after the gate.
- About 100 criterion lines, stratified and drawn with a recorded seed, with their label fields left empty. The phase stops at this label gate (parent D4), so the operator's labeling under the adopted rubric follows it and is not part of this phase's completion.
- sk-create-goal's `SKILL.md`, `README.md`, `scripts/README.md`, changelog and manual testing playbook plus an sk-doc hub feature catalog entry, each updated through sk-doc so the skill's docs match the new scripts (parent D6). Code follows sk-code's OpenCode route (`sk-code/sk-code-opencode`).
- After the label gate only: a model arm behind `--deem` or `--jev`, when the stop rule clears and the promotion conditions below hold.

### Out of Scope

- Any edit to `check-goal.cjs`, as a `CHECKS` entry or through new exports. It is a completion gate with frozen exit codes (`check-goal.cjs:695-716`), and a separate script copies its parser instead (What Not To Build row 61).
- Reaching native `/goal` strings, direct edits of `goal.md` or `/goal-opencode set`. No repository hook sits on those paths, so the lint covers `/create:goal` authoring only (row 62).
- Shelling any npm `jevctl` subcommand, `verify` above all. The Jev gate pins the Python `jev-cli` 0.6.2 (007's research section 12, the shared two-backend gate contract), and `verify` throws without evidence, which a criterion line never has (row 46).
- Counting scratch-tree fixture goals in the population (row 70). Fixing the same leak inside `check-goal.cjs`'s walker is sk-doc's call and is reported, not fixed here.
- Rewriting any existing goal's criteria. The lint reports and never edits.
- An R2 model arm over the stored goal string, on either backend, which would duplicate this phase's question (row 72).
- Any label written by a model, on the drawn sample or elsewhere in the population (parent D4). Synthetic labels exist only inside the scorer's tests, on fixture lines.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs` | Create | The lexical lint, about 200 LOC: `goal-slice.cjs` imports, the copied parser, `rule4DanglingRefs()`, `rule5ExternalFile()`, the walker and the report. Proposed name from the research |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | Create | The scorer and the stop line, about 80 LOC |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/lint-goal-criteria.test.cjs` | Create | Seven `node:test` cases, about 90 LOC. Placed in `scripts/tests/` so the existing `node --test` command runs it |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` | Create | Proposed name. Scorer cases on synthetic fixture labels the test writes to a temporary directory: per-rule counts, precision, recall and F1, the Wilson interval, `stale=`, `unlabeled=`, `rubric mismatch:` and the stop line. Added because parent D4 moves the real labels past the gate, so only fixtures can prove the scorer inside this phase |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` | Create | About 100 drawn rows, one JSON row per criterion line, with no criterion text. The build writes `id` and `text_sha12` and leaves the label fields null. The operator fills them after the gate (parent D4) |
| `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` | Modify | Name the advisory lint and the scorer beside the checker, through sk-doc. Added for parent D6 |
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | Modify | The lint and the scorer, their commands and the new `node --test` count in the verification table. Added for parent D6 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md` | Modify | Tree, key files and entrypoints for the two scripts, the two test files and the labels file. Moved in from Out of Scope by parent D6 |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.3.0.0.md` | Create | Proposed version. The release entry through sk-create-changelog. Added for parent D6 |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/` | Modify | One lint scenario in `goal-authoring/` (proposed) and its row in `manual-testing-playbook.md`, through sk-create-manual-testing-playbook. Added for parent D6 |
| `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` and `document-validation/` | Modify | One entry for the lint, proposed `document-validation/goal-criteria-lint.md`, through sk-create-feature-catalog. sk-create-goal ships no catalog of its own, so the hub catalog is where parent D6's catalog update lands |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` | Read only | The parser at `:140-149`, `:167-206` and `:212-217` is copied, never imported or edited |
| `.skilled/hooks/goal/lib/goal-slice.cjs` | Read only | `extractDurableSlice`, `splitFrontmatter` and `LOG_ANCHOR` are imported |
| `.skilled/commands/create/assets/create-goal-auto.yaml` | Modify, after the gate | One advisory line before `step_check` (`:228-229`), only with per-rule precision of at least 0.8 and sk-doc's approval. Untouched by this phase, since precision needs the operator's labels |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Rubric Decision (Open, the Operator's)

The rubric is question 34 in research section 12, and only the operator adopts it. Labels mean nothing until it is written, because the five recorded base rates each measure a different failure definition. The candidates the synthesis carries:

| ID | Rubric | Rule 4 fails when | Rule 5 fails when | Recorded rate |
|----|--------|-------------------|-------------------|---------------|
| A | Strict referent resolution (mimo-02 strict, `mimo-02-strict-v1`) | The line holds a pronoun, a definite description or jargon whose meaning needs text outside the line. Naming a path, a command or the packet itself resolves locally | Deciding pass or fail needs the content of another document, as opposed to running a named command, counting named paths or checking a stated property of a named artifact | Rule 4 35 of 44 (79.5%), rule 5 23 of 44 (52.3%) |
| B | Lenient (mimo-02 lenient) | Only a referent that cannot be resolved from the line or the packet fails | As A | 20 of 44 (45.5%) |
| C | Strict regex for explicit references (council seat-002) | Explicit lexical references only, such as "as described in" or a file reference | As rule 4 | 21 of 1,387 (1.5%) |
| D | One-lens reading (council seat-003) | One reader's judgment | One reader's judgment | 7 of 25 (28%) |

**Recommended default.** The synthesis names A and B as the starting candidates (section 3) and does not pick one. The lint design it adopts, swe-04's, versions its label rows as `mimo-02-strict-v1` and implements the strict half, so this spec treats A as the working default until the operator adopts a rubric. Only under C can the 5% stop rule fire, because every referential reading sits far above it (section 5).

**Adopted rubric:** not yet chosen. Task T001 is the operator's and falls at the label gate (parent D4). The build runs under A until then, and no label is written before the operator adopts one.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The rubric is adopted and recorded before any label | The "Adopted rubric" line above names one rubric id and its two rule definitions before the first label value is written to `goal-criteria-labels.jsonl`. The drawn rows exist before that with every label field null (parent D4). Every labeled row carries that id in `rubric`. A labels file with more than one `rubric` value makes the scorer print `rubric mismatch: <ids>` and no rate |
| REQ-002 | The lint is advisory and exits 0 | `lint-goal-criteria.cjs <packet>` and `lint-goal-criteria.cjs --all` exit 0 on every input, including a goal with no criteria, a missing packet and an unreadable file, each of which prints a named line instead of failing |
| REQ-003 | `check-goal.cjs` is unchanged | `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` exits 0 after the build. `check-goal.cjs --all` prints the same `RESULT` line and exit code before and after the new files exist. `CHECKS` still lists four names |
| REQ-004 | The rules are lexical functions with tested polarity | `rule4DanglingRefs(line)` and `rule5ExternalFile(line)` each return flagged spans for one criterion line. `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes seven new cases: rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal with no criteria and a scratch path excluded |
| REQ-005 | The population excludes fixtures | The walker skips `z_archive` and every path with a `scratch` segment and prints `scratch_excluded=<n>`. The research counted 14 files holding 24 criterion lines. On 2026-09-28 the tree held 30 such `goal.md` files, so the build reports the number it finds |
| REQ-006 | The lint and the scorer make zero model calls and handle no secret | Zero model calls. Stub `jev` and `cli-deem` binaries first on PATH, each logging every invocation, log nothing when either script runs without `--jev` or `--deem`. `grep -n API_KEY` on both scripts returns no match, and neither holds a key literal or reads a key variable |
| REQ-007 | The copied parser matches the original | The lint imports `extractDurableSlice`, `splitFrontmatter` and `LOG_ANCHOR` from `goal-slice.cjs` and copies `getAnchorBody`, `getGoalSections` and `getCriterionItems` with a durable "ported from check-goal.cjs" comment. A test asserts that the lint's criterion count equals `check-goal.cjs`'s `criteria-count` result on the same fixture goals |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The labels file follows one schema and stores no text | Each row is `{id, text_sha12, rubric, rule4_ok, rule5_ok, labeler}` (proposed), where `id` is `path:line` and `text_sha12` is the first 12 hex characters of the criterion line's sha256. About 100 rows, stratified by track group and goal kind with a recorded seed, outside `z_archive` and scratch paths. No row holds criterion text. The build writes `id` and `text_sha12` and sets `rubric`, `rule4_ok`, `rule5_ok` and `labeler` to null. Only the operator fills them, after the label gate (parent D4) |
| REQ-009 | The scorer reports per-rule numbers | `score-goal-lint.cjs --labels <file>` runs the lint in process over the active tree, or reads its saved JSON when `--lint <lint.json>` is given. It joins on `text_sha12`, prints TP, FP, FN and TN, precision, recall and F1 for each rule, the labeled violation rate with a Wilson 95% interval and `stale=<n>` for labels whose `text_sha12` matches no current line. Stale labels leave every rate. Rows whose label fields are null count under `unlabeled=<n>` (proposed) and leave every rate too, and with no labeled row the scorer prints no rate and exits 0. `score-goal-lint.test.cjs` proves each of these outputs on synthetic fixture labels, never on the drawn sample (parent D4) |
| REQ-010 | The stop line prints from the scorer | When the labeled violation rate under the adopted rubric is under 0.05, the scorer prints `r20 model arm not built: labeled_violation_rate<0.05` and no arm is built on either backend, because the stop is the same for both. Inside this phase the line is proven on synthetic fixture labels. The real decision follows the operator's labels, after the gate (parent D4) |
| REQ-011 | The workflow line waits on precision and on the owner | `create-goal-auto.yaml` changes only when both rules show precision of at least 0.8 (proposed) and sk-doc approves. Without both, `git diff --quiet` on that file exits 0. Precision needs the operator's labels, so this phase leaves the file untouched |
| REQ-012 | A model arm, if built, is gated per backend by parent D1 | The Jev half runs only with `--jev`. It prints one identity line with the resolved `jev` path and the provider, `JEV_PROVIDER` when set and `official` otherwise. It then runs, in order and once per run: `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <that provider>` exiting 0. The same `--provider` goes to every later call. Failures print `jev arm skipped: jev not on PATH`, `jev arm skipped: version` plus a details line with the version found and the path, or `jev arm skipped: no credential`, and the lexical output stays byte-identical with exit 0. The Deem half runs only with `--deem`. Once per run, `cli-deem health` (proposed, phase 008) applies the pinned check within 2,000 ms and prints the backend, the model id and the commit pair. Its failures print one of `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: bad health response` and `deem arm skipped: model`, the last with a details line naming the id found, and the lexical output stays byte-identical with exit 0. The script never starts the Deem server. With neither switch set, or with every gate failing, the output is byte-identical to the default run and no binary is spawned |
| REQ-013 | A model arm, if built, keeps only on a measured gain | Two `noul` questions per labeled criterion (checkable from its own text, names one observable result). Jev: over 3 reruns, about 600 calls. Deem: one pass, about 200 local calls, no rerun clause, its stability the commit pair. Keep on either backend only with an F1 gain of at least 0.2 over the lint and a precision of at least 0.8, plus an aggregate flip rate of at most 0.10 for Jev. Jev exit handling follows 002's table by reference, with `jev arm stopped: key rejected` (proposed) on exit 3 after the gate, and before the first billed call the Jev arm prints the payload class, the planned calls and estimated input tokens, never a dollar figure. A Deem arm follows the rest of the shared gate contract in 007's research section 12 by reference: its exit handling, records carrying the commit pair, requalification on a new pair and a payload notice that says nothing leaves the machine |

### Edge Cases

- **A goal with no criteria anchor.** The parser falls back to a "Completion Criteria" heading, as `check-goal.cjs:198-204` does. With neither, the file yields zero criteria, prints one `no_input` line with its path and counts toward no rate.
- **A phase-parent binding row.** Binding rows sit in the binding anchor and are table rows, and `getCriterionItems` reads only bullet lines from the completion section, so a binding row is never linted. A parent criterion that names child goal files is linted like any other line, and whether "every child" is self-contained is the rubric's call, settled by the labels.
- **Criteria outside the 3 to 7 range.** `check-goal.cjs`'s `criteria-count` check owns that finding. The lint still lints every criterion it finds, prints the file's count and adds no finding and no exit code of its own. A file with zero criteria is the `no_input` case.
- **Non-English text.** Both rules are English lexical patterns, so a criterion in another language would pass silently. A line with no word from the lint's English function-word list is reported as `lexical_unscored` and counted apart, never as a pass. UNKNOWN: whether any active criterion is non-English today. The first `--all` run answers it.
- **A template placeholder bullet**, such as `[Another]`. `check-goal.cjs`'s `placeholder` check already fails it, so the lint reports it as `placeholder` and leaves it out of the rates.
- **A stale label.** A goal edited after labeling changes the line's hash. The scorer counts that label under `stale=` and leaves it out of every rate.
- **A bad key, for a later Jev arm.** `auth status` checks presence, not validity, so a rejected key passes the gate and surfaces as exit 3 on the first billed call. The arm stops and reports finished rows as `partial`.

### Stop Rule for a Model Arm

The arm is not part of the first slice, and every step of this rule falls after the label gate (parent D4), so none of it is part of this phase's completion. The arm closes when the scorer prints `r20 model arm not built: labeled_violation_rate<0.05` under the adopted rubric, for both backends. Past that line, the arm is built only when all of these hold:

1. The labeled violation rate under the adopted rubric is at least 0.05.
2. The lint's F1 leaves room for a 0.2 gain, which means an F1 of at most 0.8 on the rule the arm targets.
3. For a Jev arm: 002 has a per-call latency record, and the redaction unit cases pass in the plugin, the scrubber and goal-core (research section 9, step 6). A Deem arm needs neither.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator holds everything needed to learn, under a rubric they choose, how often goal criteria break rules 4 and 5 and how much of that a zero-call lexical lint catches, as per-rule precision and recall: a tested lint, a tested scorer and a drawn sample ready to label. The numbers themselves come after the label gate (parent D4).
- **SC-002**: `check-goal.cjs` behaves exactly as today, and a machine with no Jev key and no Deem server sees no call and no new failure.

### Proof Plan

Written before the build, from R20's record in the research.

1. `lint-goal-criteria.cjs --all` prints per-rule counts and `scratch_excluded=<n>` and exits 0. Boundary: a non-zero exit or a scratch path in the population fails the lint.
2. `git diff --quiet` on `check-goal.cjs` exits 0, and its `--all` `RESULT` line and exit code match the baseline captured before the build. Boundary: any difference fails the phase.
3. The seven test cases pass. Boundary: a rule that fires on its pass fixture fails REQ-004.
4. The scorer's tests print per-rule precision, recall and F1, the labeled violation rate and, under 0.05, the stop line from synthetic fixture labels. The scorer run on the drawn file prints `unlabeled=` with the row count and no rate. Boundary: a rate printed from unlabeled rows fails REQ-009. The real rate comes after the label gate (parent D4).
5. Stub `jev` and `cli-deem` binaries log no call from either script. Boundary: any logged call fails REQ-006.

**Kill criterion.** After the label gate, `r20 model arm not built: labeled_violation_rate<0.05` under the adopted rubric closes the arm on both backends. The lint itself stays as an advisory tool whatever the rate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's rubric | No label and no rate can exist | T001 falls at the label gate (parent D4). The build runs under working default A, and a different adopted rubric may retune the rule patterns after the gate. Candidates are recorded above |
| Dependency | About 100 operator labels | The scorer has nothing real to score inside this phase | Labeling follows the gate (parent D4). The scorer is proven on synthetic fixture labels and prints `unlabeled=` on the drawn file until then. mimo-05 prices the labels at 55 to 65 minutes plus 10 for the rubric (lineage-reported) |
| Risk | Premise moved: `check-goal.cjs` gained a fifth check (`frontmatter-fence`, `:51`) and the `SKDOC_SKIP_VALIDATION` off switch (`:20`, `:697`) after this phase was authored | Low | The copied parser and walker spans are byte-identical and only moved. The T002 baseline runs with the switch unset, because with it on the checker prints a skip notice and exits 0 with no `RESULT` line |
| Risk | Premise moved: the scratch population the walker skips grew from the research's 14 files to 30 on 2026-09-28 | Low | REQ-005 already reports the count the build finds, and `scratch_excluded=` prints it apart |
| Risk | sk-create-goal's docs drift from the new scripts | Low | Parent D6 puts `SKILL.md`, `README.md`, `scripts/README.md`, the changelog, the playbook and the hub catalog entry in scope, each through sk-doc and checked with `validate_document.py` |
| Risk | A lexical lint under-flags the referential class that rubrics A and B count | Med | The lint claims precision first, and its recall against the labels is the reported number, never quoted as the base rate |
| Risk | The stop rule fires only under rubric C | Med | Recorded in the rubric table, so the operator chooses knowing which rubric can close the arm |
| Risk | Labels go stale as goals are edited | Low | `text_sha12` pins each label to its line, and stale labels are counted apart |
| Risk | Coverage is `/create:goal` authoring only | Med | Stated in Out of Scope. Native `/goal` strings, direct edits and `/goal-opencode set` stay unlinted |
| Risk | The workflow line touches an sk-doc asset | Low | REQ-011 gates it on precision and on the owner's approval |
| Risk | A later Jev arm sends committed criterion text off the machine | Low | The arm prints its payload class before the first call, sends no secret and passes the same `--provider` to every check and call |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which rubric does the operator adopt for rules 4 and 5 (question 34)? Only the operator answers it, at the label gate and before any label (parent D4).
- Should the stop rule also require the interval's floor to sit under 0.05, as mimo-05 proposes? The synthesis keeps the bare rate. The operator decides with the rubric.
- Does sk-doc want the advisory line in `create-goal-auto.yaml`? The owner answers it once per-rule precision is measured, after the gate. The `scripts/README.md` listing is no longer open, because parent D6 puts it in this phase.
- Should the lint and the scorer honor `SKDOC_SKIP_VALIDATION`, as `check-goal.cjs` now does (`:697`)? Both always exit 0 and gate nothing, so skipping them changes no result. Until sk-doc answers, the design stays as written and neither script reads the switch.
- Are any active criteria non-English? The first `--all` run's `lexical_unscored` count answers it.
<!-- /ANCHOR:questions -->

---
