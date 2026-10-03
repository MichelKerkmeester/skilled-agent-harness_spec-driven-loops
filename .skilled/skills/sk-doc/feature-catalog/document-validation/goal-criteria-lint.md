---
title: "Goal Criteria Lint"
description: "Flags goal completion criteria that a reader cannot check from the line alone, so an author can fix them before the objective carries them."
trigger_phrases:
  - "goal criteria lint"
  - "lint-goal-criteria.cjs"
  - "score-goal-lint.cjs"
  - "goal criteria rules 4 and 5"
version: 2.2.0.0
---

# Goal Criteria Lint (lint-goal-criteria.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Flags goal completion criteria that a reader cannot check from the line alone, so an author can fix them before the objective carries them.

`lint-goal-criteria.cjs` gives rules 4 and 5 of `sk-create-goal` their first machine check. Rule 4 asks that each criterion be self-contained. Rule 5 asks that it be checkable without opening another file. The lint is advisory. It makes no model call, always exits 0 and leaves `check-goal.cjs` and its exit codes as they are.

---

## 2. HOW IT WORKS

The lint walks every active `goal.md` under `specs/`, or the one packet it is given, and reads each completion criterion with a copy of the checker's parser. A parity test holds that copy to the checker's own criteria count. It skips `z_archive` and prints the goals under a `scratch` folder apart as `scratch_excluded=`, because those are fixtures rather than authored criteria.

Each criterion falls in one class. A bracketed template slot is `placeholder`, a line with none of the lint's common English words is `lexical_unscored` and every other line is `scored`. Only scored lines meet the two rules. Rule 4 flags a leading "It" or "They", or a phrase such as "the report" whose head word the line never names in backticks, quotes, a path or a number, unless the word names the packet or the run itself. Rule 5 flags wording whose check needs another document, such as "as described in", "every kept file" or a requirement id like `REQ-001`.

With `--json` the lint prints each criterion as an `id` of `path:line`, a `text_sha12` (the first 12 hex characters of the line's sha256), its class and the spans each rule flagged. `score-goal-lint.cjs` joins operator labels to those records by `text_sha12`. It prints precision, recall and F1 per rule, the labeled violation rate with a Wilson 95% interval, `stale=` for labels whose line has changed and `unlabeled=` for rows not labeled yet. It refuses a labels file that mixes rubrics. Under a 5% labeled violation rate it prints `r20 model arm not built: labeled_violation_rate<0.05`. `goal-criteria-labels.jsonl` holds the drawn sample: 98 rows labeled under rubric `mimo-02-strict-v1` by an operator-delegated arbiter and 2 stale rows left null.

`--jev` adds a model arm and requires `--out <dir>`. The arm asks two noul questions per labeled criterion, three reruns each, and prints a per-rule column plus a keep-or-kill verdict. A rule keeps its model column only on an F1 gain of at least 0.2 over the lint, precision of at least 0.8 and flips of at most 0.10. A rule with fewer than nine in ten rows measured prints `stop (coverage)` instead of a verdict. Every call lands in `calls.jsonl` and the columns land in `report.json` under `--out`. Without a switch the scorer's output is unchanged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs` | Script | Walks the goals, classifies each criterion and runs rules 4 and 5 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | Script | Scores the lint against labels, prints the stop line and, with `--jev`, runs a model arm that writes `calls.jsonl` and `report.json` under `--out` |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` | Data | The drawn sample, 98 rows labeled under `mimo-02-strict-v1` |
| `.skilled/hooks/goal/lib/goal-slice.cjs` | Shared | Cuts the durable slice the criteria are read from |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/lint-goal-criteria.test.cjs` | Unit | Each rule's pass and fail cases, the line classes, the scratch and archive exclusions, parser parity with the checker and the exit-0 command line |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` | Unit | Per-rule numbers, the Wilson interval, stale and unlabeled rows, mixed rubrics and the stop line on synthetic labels, plus the model arm on a stub CLI covering its gate, verdicts, coverage stops and the `--out` artifacts |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/lint-goal-criteria.md` | Manual playbook | Runs the lint on a scratch packet and confirms the goal check still passes |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/goal-criteria-lint.md`

Related references:
- [changelog-entry-frontmatter-check.md](changelog-entry-frontmatter-check.md) - the hub's other document-validation feature
