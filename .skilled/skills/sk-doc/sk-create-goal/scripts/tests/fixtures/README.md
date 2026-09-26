---
title: "goal checker fixtures: throwaway goal packets"
description: "Builds the positive and negative goal packets the check-goal tests run against."
trigger_phrases:
  - "check-goal fixtures"
  - "goal fixture packets"
---

# goal checker fixtures: throwaway goal packets

---

## 1. OVERVIEW

`fixtures/` builds the goal packets the checker tests run against. Nothing here is a stored packet: `createGoalFixtures(fixtureRoot)` writes each one into a temporary directory the test suite creates and deletes, so the repository keeps one readable goal builder instead of a copy per case.

Current state:

- Each fixture is a phase parent. Its children, `001-contract`, `002-result` and `003-handoff` unless a case says otherwise, each get a `spec.md` and a stub `goal.md`.
- The positive packet passes all four checks. Each negative packet changes one thing, so it fails exactly one named check.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `goal-fixtures.cjs` | Exports `createGoalFixtures(fixtureRoot)`, which returns `{ positive, directiveCriteria, negatives }` as packet paths. |

---

## 3. FIXTURE SET

| Fixture | What it changes | Check it must fail |
|---|---|---|
| `positive` | Nothing | None |
| `directiveCriteria` | Adds a numbered criteria list inside the directive and wraps the criteria in the completion anchor | None, because the anchor decides the count |
| `binding-row-removed-but-identifier-mentioned` | Keeps one child and no binding rows, while a criterion still names that child | `missing-binding-row` |
| `objective-placeholder` | Leaves the template objective | `placeholder` |
| `decision-placeholder` | Leaves the template decision row | `placeholder` |
| `criterion-placeholder` | Leaves a template criterion | `placeholder` |
| `criteria-count-out-of-range` | Lists fewer than three criteria | `criteria-count` |
| `over-budget-parent` | Pads the objective to 4,200 characters | `parent-budget` |

---

## 4. VALIDATION

```bash
node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/
```

---

## 5. RELATED

- [`../check-goal.test.cjs`](../check-goal.test.cjs) runs every fixture.
- [`../../README.md`](../../README.md) describes the checker these fixtures exercise.
