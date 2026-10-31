---
title: "sk-create-goal scripts: goal checker and criteria lint"
description: "Read-only checker and advisory criteria lint for packet goal files, with the lint's scorer and label sample, node:test suites and fixtures."
trigger_phrases:
  - "check-goal script"
  - "goal conformance checker"
  - "goal template parity test"
  - "goal criteria lint"
  - "score-goal-lint"
---

# sk-create-goal scripts: goal checker and criteria lint

---

## 1. OVERVIEW

`scripts/` holds the read-only checker the mode runs before it hands off an authored or revised `goal.md`. It catches five things the system-spec-kit validator does not catch on its own: a phase child with no binding row, leftover template placeholders, a criterion count outside three to seven, a parent over the 4,000-character durable budget and a stray `---` line that closed the frontmatter early.

Beside it sits an advisory lint for rules 4 and 5, which the checker does not test: each criterion self-contained and checkable without opening another file. A scorer measures that lint against labels the operator writes.

Current state:

- `check-goal.cjs` reads goal files and never writes one.
- Durable-slice cutting and budget lookup come from the goal hooks' `goal-slice.cjs`, so the checker measures a goal the same way `goal.cjs packet` does.
- Placeholder detection covers system-spec-kit's `goal.md.tmpl` wording and the wording of the three templates in `../assets/`, which the checker reads at load time.
- `lint-goal-criteria.cjs` and `score-goal-lint.cjs` read goal files and a labels file and write nothing. The lint always exits 0, so it never blocks a handoff.
- The lint copies the checker's criterion parser instead of importing it, because the checker exports only packet-level runners. A parity test holds the two to the same criteria count.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- check-goal.cjs               # CLI and exported checks
+-- lint-goal-criteria.cjs       # Advisory lint for criteria rules 4 and 5
+-- score-goal-lint.cjs          # Scores the lint against labels
+-- goal-criteria-labels.jsonl   # Drawn criterion lines waiting for labels
+-- tests/
|   +-- check-goal.test.cjs      # Positive, negative and unfilled-template controls
|   +-- lint-goal-criteria.test.cjs # Both rules, the walker and parser parity
|   +-- score-goal-lint.test.cjs # Scorer outputs on synthetic labels
|   +-- template-parity.test.cjs # Asset templates against goal.md.tmpl
|   `-- fixtures/
|       `-- goal-fixtures.cjs    # Builds the positive and negative packets
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `check-goal.cjs` | Runs the five named checks on one packet, or on every active goal with `--all`. Exports `CHECKS`, `checkMissingBindingRows`, `checkPlaceholders`, `checkCriteriaCount`, `checkParentBudget`, `checkFrontmatterFence`, `checkGoalPacket` and `scanCorpus`. |
| `lint-goal-criteria.cjs` | Lints the criteria of one packet, or of every active goal with `--all`, for rules 4 and 5. Skips `z_archive` and counts `scratch` goals apart. Prints counts and flagged lines, or JSON with `--json`, and always exits 0. |
| `score-goal-lint.cjs` | Joins labels to the lint by text hash and prints per-rule precision, recall and F1, the labeled violation rate with a Wilson 95% interval and the stop line under 5%. Counts stale and unlabeled rows apart and refuses mixed rubrics. |
| `goal-criteria-labels.jsonl` | 100 drawn criterion lines, one JSON row each with `id`, `text_sha12` and four label fields left null for the operator. No row holds criterion text. |
| `tests/check-goal.test.cjs` | Proves the positive fixture passes every check, each negative fixture fails only its named check, and an unfilled copy of each asset template fails the placeholder check. |
| `tests/lint-goal-criteria.test.cjs` | Holds each rule to its pass and fail cases, the walker to its scratch and archive exclusions, the parser to the checker's criteria count and the command line to exit 0. |
| `tests/score-goal-lint.test.cjs` | Proves the per-rule numbers, the Wilson interval, the stale, unlabeled and mixed-rubric cases and the stop line on synthetic labels. |
| `tests/template-parity.test.cjs` | Fails when an asset template's fixed text drifts from `goal.md.tmpl` at that template's level. |
| `tests/fixtures/goal-fixtures.cjs` | Writes throwaway goal packets into a temporary directory for the checker tests. |

---

## 4. BOUNDARIES AND FLOW

The checker imports only Node built-ins and `../../../../hooks/goal/lib/goal-slice.cjs`. It reads `goal.md` and the direct phase-child directories of the packet it is given, plus the three asset templates. It changes no file and no session state.

```text
packet/goal.md ──▶ goal-slice.cjs (durable slice, budget) ──▶ five checks ──▶ findings + exit code
../assets/goal-*-template.md ──▶ placeholder wording ──┘
```

The lint imports the same `goal-slice.cjs` and nothing else outside Node. The scorer reads a labels file and either a saved `--json` lint run or a fresh one. Neither makes a model call or spawns a process.

```text
specs/**/goal.md ──▶ lint-goal-criteria.cjs (rules 4 and 5) ──▶ report or JSON, exit 0
goal-criteria-labels.jsonl + lint records ──▶ score-goal-lint.cjs ──▶ per-rule numbers, rate, stop line
```

---

## 5. ENTRYPOINTS

```bash
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs <packet>
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all
```

`<packet>` is a packet folder or the path to its `goal.md`. One packet prints each check and `RESULT: PASSED (5/5 checks)` or `RESULT: FAILED`, and exits 0 only when all five pass. `--all` scans every active goal outside `z_archive/` and prints the finding count per check and each finding. It exits 2 when a goal cannot be read and 0 otherwise, whatever the findings. `--root <path>` sets the workspace root.

```bash
node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs <packet>
node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all [--json]
node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl [--lint <lint.json>]
```

The lint takes the same `<packet>`, `--all` and `--root` and always exits 0. The scorer runs the lint in process unless `--lint` names a saved `--json` run. It exits 0 when it prints a score and 2 when its input cannot be read.

---

## 6. VALIDATION

```bash
node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/
```

Expected result: every test passes.

---

## 7. RELATED

- [`../SKILL.md`](../SKILL.md) runs the checker at step 8 of its workflow.
- [`../assets/`](../assets/) holds the three goal templates the parity test compares.
- [`tests/fixtures/README.md`](tests/fixtures/README.md) describes the fixture packets.
- [`goal-slice.cjs`](../../../../hooks/goal/lib/goal-slice.cjs) owns durable-slice cutting and the budget.
