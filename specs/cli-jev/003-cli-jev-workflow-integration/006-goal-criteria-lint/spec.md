---
title: "Build Phase: Goal-Criteria Lint"
description: "Give sk-create-goal rules 4 and 5 their first machine check: a zero-call lexical lint of goal criteria beside check-goal.cjs, scored against about 100 operator labels under a rubric the operator adopts first. A Jev arm is built only past the stop rule and stays dormant without a key."
trigger_phrases:
  - "goal criteria lint"
  - "lint-goal-criteria"
  - "score-goal-lint"
  - "goal criteria rubric rules 4 and 5"
  - "r20 jev arm not built"
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
| **Phase** | 6 of 6 |
| **Predecessor** | 005-compaction-recall-harness |
| **Successor** | None |
| **Handoff Criteria** | The operator's adopted rubric is recorded in this spec, about 100 criterion lines are labeled under it and `score-goal-lint.cjs` has printed per-rule precision, recall and F1 with the labeled violation rate. Either the stop line `r20 jev arm not built: labeled_violation_rate<0.05` printed, or the arm's promotion conditions are recorded as met or unmet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the cli-jev workflow integration specification. It builds recommendation R20 from `../004-deep-research-expansion/research/research.md` (section 3, `### R20 (next): the lexical lint`, section 5, section 11, `### R20. Goal-criteria lint`, and section 13, `### 006-goal-criteria-lint`). The synthesis renamed this phase from `006-goal-criteria-jev-lint`, because its first slice makes no Jev call and the folder name should not promise one.

**Scope Boundary**: New advisory scripts beside `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`, a test file and a labels file. `check-goal.cjs` is read only, so its four checks, its output and its exit codes 0, 1 and 2 stay exactly as they are. The only existing file this phase may change is one line in `create-goal-auto.yaml`, and only with sk-doc's approval.

**Dependencies**:
- The operator's rubric (open question 34) before any label, and about 100 operator labels after it. None on other phases for the lint
- For a later Jev arm only: 002's per-call latency record, the redaction unit cases in three modules and the parent D5 key gate

**Deliverables**:
- `lint-goal-criteria.cjs`: a zero-call lexical lint for rules 4 and 5 that always exits 0
- `score-goal-lint.cjs`: per-rule precision, recall and F1 against the labels, the labeled violation rate and the stop line
- `lint-goal-criteria.test.cjs` with seven cases, and `goal-criteria-labels.jsonl` with about 100 operator labels
- A Jev arm behind `--jev`, only when the stop rule clears

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

No machine check tests rules 4 and 5 of `sk-create-goal`. Rule 4 asks for three to seven self-contained criteria, and rule 5 asks that each be checkable without opening another file (`.skilled/skills/sk-doc/sk-create-goal/SKILL.md:121-122`). `check-goal.cjs` runs four structural checks, `missing-binding-row`, `placeholder`, `criteria-count` and `parent-budget` (`check-goal.cjs:44-49`), and `criteria-count` covers only the three-to-seven count. This matters because Claude Code's native goal judge reads only the stored goal string (`goal-set-string-playbook.md:55-57`), so a criterion that points at another file cannot be checked there and leaves completion open.

How often criteria break the rules has no single answer. Five recorded readings run from 1.5% (a strict regex for explicit references, 21 of 1,387) to 79.5% (strict referent resolution, 35 of 44 in mimo-02's sample). The synthesis finds that these readings measure three failure definitions, not one quantity, so the base rate waits on a rubric the operator has not chosen (research section 5).

### Purpose

Give rules 4 and 5 a measured, advisory lint whose precision and recall are known against the operator's own labels, at zero Jev calls and with `check-goal.cjs` untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A lexical lint that reads each active `goal.md`, extracts its criterion bullets with a copy of `check-goal.cjs`'s parser and flags rule 4 and rule 5 spans. It prints a report or JSON and always exits 0.
- A walker that skips `z_archive` and every path with a `scratch` segment, and prints the scratch count apart.
- A scorer that joins the labels to the lint's output, prints per-rule precision, recall and F1, the labeled violation rate with a Wilson 95% interval and a stale-label count, and prints the stop line when the rate is under 0.05.
- About 100 criterion lines, stratified and labeled by the operator under the adopted rubric.
- A Jev arm behind `--jev`, only when the stop rule clears and the promotion conditions below hold.

### Out of Scope

- Any edit to `check-goal.cjs`, as a `CHECKS` entry or through new exports. It is a completion gate with frozen exit codes (`check-goal.cjs:659-675`), and a separate script copies its parser instead (What Not To Build row 61).
- Reaching native `/goal` strings, direct edits of `goal.md` or `/goal-opencode set`. No repository hook sits on those paths, so the lint covers `/create:goal` authoring only (row 62).
- Shelling any npm `jevctl` subcommand, `verify` above all. D5 pins the Python `jev-cli` 0.6.2, and `verify` throws without evidence, which a criterion line never has (row 46).
- Counting scratch-tree fixture goals in the population (row 70). Fixing the same leak inside `check-goal.cjs`'s walker is sk-doc's call and is reported, not fixed here.
- Rewriting any existing goal's criteria. The lint reports and never edits.
- An R2 Jev arm over the stored goal string, which would duplicate this phase's question (row 72).
- Listing the new scripts in `scripts/README.md`. That file is sk-doc's, and the listing is raised with the workflow line.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs` | Create | The lexical lint, about 200 LOC: `goal-slice.cjs` imports, the copied parser, `rule4DanglingRefs()`, `rule5ExternalFile()`, the walker and the report. Proposed name from the research |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | Create | The scorer and the stop line, about 80 LOC |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/lint-goal-criteria.test.cjs` | Create | Seven `node:test` cases, about 90 LOC. Placed in `scripts/tests/` so the existing `node --test` command runs it |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` | Create | About 100 operator labels, one JSON row per criterion line, with no criterion text |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` | Read only | The parser at `:135-144`, `:162-201` and `:207-212` is copied, never imported or edited |
| `.skilled/hooks/goal/lib/goal-slice.cjs` | Read only | `extractDurableSlice`, `splitFrontmatter` and `LOG_ANCHOR` are imported |
| `.skilled/commands/create/assets/create-goal-auto.yaml` | Modify, conditional | One advisory line before `step_check` (`:220-221`), only with per-rule precision of at least 0.8 and sk-doc's approval. Otherwise untouched |
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

**Adopted rubric:** not yet chosen. Task T001 is the operator's, and no label is written before it.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The rubric is adopted and recorded before any label | The "Adopted rubric" line above names one rubric id and its two rule definitions before the first row of `goal-criteria-labels.jsonl` exists. Every label row carries that id in `rubric`. A labels file with more than one `rubric` value makes the scorer print `rubric mismatch: <ids>` and no rate |
| REQ-002 | The lint is advisory and exits 0 | `lint-goal-criteria.cjs <packet>` and `lint-goal-criteria.cjs --all` exit 0 on every input, including a goal with no criteria, a missing packet and an unreadable file, each of which prints a named line instead of failing |
| REQ-003 | `check-goal.cjs` is unchanged | `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` exits 0 after the build. `check-goal.cjs --all` prints the same `RESULT` line and exit code before and after the new files exist. `CHECKS` still lists four names |
| REQ-004 | The rules are lexical functions with tested polarity | `rule4DanglingRefs(line)` and `rule5ExternalFile(line)` each return flagged spans for one criterion line. `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes seven new cases: rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal with no criteria and a scratch path excluded |
| REQ-005 | The population excludes fixtures | The walker skips `z_archive` and every path with a `scratch` segment and prints `scratch_excluded=<n>`. On today's tree that count is 14 files, which holds 24 criterion lines per the research, so the build reports the number it finds |
| REQ-006 | The lint and the scorer make zero Jev calls and handle no secret | With a stub `jev` first on PATH that logs each invocation, a run of either script without `--jev` leaves the log empty. `grep -n API_KEY` on both scripts returns no match, and neither holds a key literal or reads a key variable |
| REQ-007 | The copied parser matches the original | The lint imports `extractDurableSlice`, `splitFrontmatter` and `LOG_ANCHOR` from `goal-slice.cjs` and copies `getAnchorBody`, `getGoalSections` and `getCriterionItems` with a durable "ported from check-goal.cjs" comment. A test asserts that the lint's criterion count equals `check-goal.cjs`'s `criteria-count` result on the same fixture goals |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The labels file follows one schema and stores no text | Each row is `{id, text_sha12, rubric, rule4_ok, rule5_ok, labeler}` (proposed), where `id` is `path:line` and `text_sha12` is the first 12 hex characters of the criterion line's sha256. About 100 rows, stratified by track group and goal kind with a recorded seed, outside `z_archive` and scratch paths. No row holds criterion text |
| REQ-009 | The scorer reports per-rule numbers | `score-goal-lint.cjs --labels <file>` runs the lint in process over the active tree, or reads its saved JSON when `--lint <lint.json>` is given. It joins on `text_sha12`, prints TP, FP, FN and TN, precision, recall and F1 for each rule, the labeled violation rate with a Wilson 95% interval and `stale=<n>` for labels whose `text_sha12` matches no current line. Stale labels leave every rate |
| REQ-010 | The stop line prints from the scorer | When the labeled violation rate under the adopted rubric is under 0.05, the scorer prints `r20 jev arm not built: labeled_violation_rate<0.05` and the phase closes without an arm |
| REQ-011 | The workflow line waits on precision and on the owner | `create-goal-auto.yaml` changes only when both rules show precision of at least 0.8 (proposed) and sk-doc approves. Without both, `git diff --quiet` on that file exits 0 |
| REQ-012 | A Jev arm, if built, is gated by parent D5 | The arm runs only with `--jev`. It prints one identity line with the resolved `jev` path and the provider, `JEV_PROVIDER` when set and `official` otherwise. It then runs, in order and once per run: `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <that provider>` exiting 0. The same `--provider` goes to every later call. Failures print `jev arm skipped: jev not on PATH`, `jev arm skipped: version` plus a details line with the version found and the path, or `jev arm skipped: no credential`, and the lexical output stays byte-identical with exit 0 |
| REQ-013 | A Jev arm, if built, keeps only on a measured gain | Two `noul` questions per labeled criterion (checkable from its own text, names one observable result) over 3 reruns, about 600 calls. Exit handling follows 002's table by reference, with `jev arm stopped: key rejected` (proposed) on exit 3 after the gate. Before the first billed call it prints the payload class, the planned calls and estimated input tokens, never a dollar figure. Keep only with an F1 gain of at least 0.2 over the lint, precision of at least 0.8 and an aggregate flip rate of at most 0.10 |

### Edge Cases

- **A goal with no criteria anchor.** The parser falls back to a "Completion Criteria" heading, as `check-goal.cjs:193-199` does. With neither, the file yields zero criteria, prints one `no_input` line with its path and counts toward no rate.
- **A phase-parent binding row.** Binding rows sit in the binding anchor and are table rows, and `getCriterionItems` reads only bullet lines from the completion section, so a binding row is never linted. A parent criterion that names child goal files is linted like any other line, and whether "every child" is self-contained is the rubric's call, settled by the labels.
- **Criteria outside the 3 to 7 range.** `check-goal.cjs`'s `criteria-count` check owns that finding. The lint still lints every criterion it finds, prints the file's count and adds no finding and no exit code of its own. A file with zero criteria is the `no_input` case.
- **Non-English text.** Both rules are English lexical patterns, so a criterion in another language would pass silently. A line with no word from the lint's English function-word list is reported as `lexical_unscored` and counted apart, never as a pass. UNKNOWN: whether any active criterion is non-English today. The first `--all` run answers it.
- **A template placeholder bullet**, such as `[Another]`. `check-goal.cjs`'s `placeholder` check already fails it, so the lint reports it as `placeholder` and leaves it out of the rates.
- **A stale label.** A goal edited after labeling changes the line's hash. The scorer counts that label under `stale=` and leaves it out of every rate.
- **A bad key, for a later arm.** `auth status` checks presence, not validity, so a rejected key passes the gate and surfaces as exit 3 on the first billed call. The arm stops and reports finished rows as `partial`.

### Stop Rule for a Jev Arm

The arm is not part of the first slice. The phase closes at the lint when the scorer prints `r20 jev arm not built: labeled_violation_rate<0.05` under the adopted rubric. Past that line, the arm is built only when all of these hold:

1. The labeled violation rate under the adopted rubric is at least 0.05.
2. The lint's F1 leaves room for a 0.2 gain, which means an F1 of at most 0.8 on the rule the arm targets.
3. 002 has a per-call latency record, and the redaction unit cases pass in the plugin, the scrubber and goal-core (research section 9, step 6).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator knows, under a rubric they chose, how often goal criteria break rules 4 and 5 and how much of that a zero-call lexical lint catches, as per-rule precision and recall.
- **SC-002**: `check-goal.cjs` behaves exactly as today, and a machine with no Jev key sees no call and no new failure.

### Proof Plan

Written before the build, from R20's record in the research.

1. `lint-goal-criteria.cjs --all` prints per-rule counts and `scratch_excluded=<n>` and exits 0. Boundary: a non-zero exit or a scratch path in the population fails the lint.
2. `git diff --quiet` on `check-goal.cjs` exits 0, and its `--all` `RESULT` line and exit code match the baseline captured before the build. Boundary: any difference fails the phase.
3. The seven test cases pass. Boundary: a rule that fires on its pass fixture fails REQ-004.
4. The scorer prints per-rule precision, recall and F1 and the labeled violation rate. Boundary: a rate under 0.05 prints the stop line and ends the phase.
5. A stub `jev` logs no call from either script. Boundary: any logged call fails REQ-006.

**Kill criterion.** `r20 jev arm not built: labeled_violation_rate<0.05` under the adopted rubric closes the arm. The lint itself stays as an advisory tool whatever the rate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's rubric | No label and no rate can exist | T001 is the operator's first task. Candidates and the working default are recorded above |
| Dependency | About 100 operator labels | The scorer has nothing to score | mimo-05 prices the labels at 55 to 65 minutes plus 10 for the rubric (lineage-reported) |
| Risk | A lexical lint under-flags the referential class that rubrics A and B count | Med | The lint claims precision first, and its recall against the labels is the reported number, never quoted as the base rate |
| Risk | The stop rule fires only under rubric C | Med | Recorded in the rubric table, so the operator chooses knowing which rubric can close the arm |
| Risk | Labels go stale as goals are edited | Low | `text_sha12` pins each label to its line, and stale labels are counted apart |
| Risk | Coverage is `/create:goal` authoring only | Med | Stated in Out of Scope. Native `/goal` strings, direct edits and `/goal-opencode set` stay unlinted |
| Risk | The workflow line touches an sk-doc asset | Low | REQ-011 gates it on precision and on the owner's approval |
| Risk | A later arm sends committed criterion text off the machine | Low | The arm prints its payload class before the first call, sends no secret and passes the same `--provider` to every check and call |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which rubric does the operator adopt for rules 4 and 5 (question 34)? Only the operator answers it, before any label.
- Should the stop rule also require the interval's floor to sit under 0.05, as mimo-05 proposes? The synthesis keeps the bare rate. The operator decides with the rubric.
- Does sk-doc want the advisory line in `create-goal-auto.yaml` and the new scripts listed in `scripts/README.md`? The owner answers it once per-rule precision is measured.
- Are any active criteria non-English? The first `--all` run's `lexical_unscored` count answers it.
<!-- /ANCHOR:questions -->

---
