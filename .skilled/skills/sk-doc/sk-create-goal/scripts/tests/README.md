---
title: "Create-goal scripts tests"
description: "node:test suites for the goal checker, the criteria lint, its label scorer and the asset-template parity check."
trigger_phrases:
  - "create-goal script tests"
  - "check-goal tests"
  - "goal template parity tests"
---

# Create-goal scripts tests

---

## 1. OVERVIEW

`tests/` holds the `node:test` suites for the goal scripts in `../`. Each file drives its subject through the exports and the command line it publishes, or reads the goal templates directly, and fails the run when a case does not hold. The two fixture-backed suites write their goal packets into a temporary directory and delete it after the run.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `check-goal.test.cjs` | Runs the positive fixture through every named check, each negative fixture through the packet runner and its own check, and an unfilled copy of each asset template through the placeholder check. Spawns `../check-goal.cjs` to compare a packet folder against its `goal.md` path and to check the not-a-directory exit. |
| `lint-goal-criteria.test.cjs` | Tests both criteria rules on their pass and fail cases, the parser's count parity with `../check-goal.cjs`, the walker's scratch and `z_archive` exclusions and the report, the JSON output and the exit codes of the command line. |
| `score-goal-lint.test.cjs` | Tests per-rule precision, recall and F1, the Wilson 95% interval, the stale, unlabeled and unscored rows, the mixed-rubric refusal, the stop line and the command line, all on synthetic records and labels. |
| `template-parity.test.cjs` | Tests that each goal template in `../../assets/` keeps the fixed text of `goal.md.tmpl` at that template's level, and that a template missing a fixed line fails and names the line. |
| `fixtures/` | Builds the throwaway goal packets the checker and lint suites run against. See [`fixtures/README.md`](fixtures/README.md). |

---

## 3. VALIDATION

Run the suites from the repository root:

```bash
node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/
```

Expected result: every test in the four suites passes and the runner exits 0. The parent README documents the same command.

---

## 4. RELATED

- [`Create-goal scripts`](../README.md)
- [`Goal checker fixtures`](fixtures/README.md)
