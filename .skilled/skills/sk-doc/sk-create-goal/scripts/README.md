---
title: "sk-create-goal scripts: goal conformance checker"
description: "Read-only checker for packet goal files, with its node:test suites and fixtures."
trigger_phrases:
  - "check-goal script"
  - "goal conformance checker"
  - "goal template parity test"
---

# sk-create-goal scripts: goal conformance checker

---

## 1. OVERVIEW

`scripts/` holds the read-only checker the mode runs before it hands off an authored or revised `goal.md`. It catches four things the system-spec-kit validator does not catch on its own: a phase child with no binding row, leftover template placeholders, a criterion count outside three to seven, and a parent over the 4,000-character durable budget.

Current state:

- `check-goal.cjs` reads goal files and never writes one.
- Durable-slice cutting and budget lookup come from the goal hooks' `goal-slice.cjs`, so the checker measures a goal the same way `goal.cjs packet` does.
- Placeholder detection covers system-spec-kit's `goal.md.tmpl` wording and the wording of the three templates in `../assets/`, which the checker reads at load time.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- check-goal.cjs               # CLI and exported checks
+-- tests/
|   +-- check-goal.test.cjs      # Positive, negative and unfilled-template controls
|   +-- template-parity.test.cjs # Asset templates against goal.md.tmpl
|   `-- fixtures/
|       `-- goal-fixtures.cjs    # Builds the positive and negative packets
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `check-goal.cjs` | Runs the four named checks on one packet, or on every active goal with `--all`. Exports `CHECKS`, `checkMissingBindingRows`, `checkPlaceholders`, `checkCriteriaCount`, `checkParentBudget`, `checkGoalPacket` and `scanCorpus`. |
| `tests/check-goal.test.cjs` | Proves the positive fixture passes every check, each negative fixture fails only its named check, and an unfilled copy of each asset template fails the placeholder check. |
| `tests/template-parity.test.cjs` | Fails when an asset template's fixed text drifts from `goal.md.tmpl` at that template's level. |
| `tests/fixtures/goal-fixtures.cjs` | Writes throwaway goal packets into a temporary directory for the checker tests. |

---

## 4. BOUNDARIES AND FLOW

The checker imports only Node built-ins and `../../../../hooks/goal/lib/goal-slice.cjs`. It reads `goal.md` and the direct phase-child directories of the packet it is given, plus the three asset templates. It changes no file and no session state.

```text
packet/goal.md ──▶ goal-slice.cjs (durable slice, budget) ──▶ four checks ──▶ findings + exit code
../assets/goal-*-template.md ──▶ placeholder wording ──┘
```

---

## 5. ENTRYPOINTS

```bash
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs <packet>
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all
```

One packet prints each check and `RESULT: PASSED (4/4 checks)` or `RESULT: FAILED`, and exits 0 only when all four pass. `--all` scans every active goal outside `z_archive/` and exits 2 when any goal has a finding. `--root <path>` sets the workspace root.

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
