---
title: "DR-067 -- focusAlignment and the findings gate read leaf fields"
description: "This scenario validates that the deep-research findings gate and the focusAlignment guard run on the leaf fields that the state log keeps, for `DR-067`. It focuses on the default research run, where both checks now apply."
version: 1.15.1.0
---

# DR-067 -- focusAlignment and the findings gate read leaf fields

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-067`.

---

## 1. OVERVIEW

This scenario validates that the findings gate and the `focusAlignment` guard judge the leaf fields the state log keeps on every research run. It focuses on the default run path, where these checks now apply without a flag.

### Why This Matters

A check that reads a field the log does not keep never fires. A default research run could then pass the findings gate with nothing enumerated, or keep answering off-focus questions without a hold. Both checks must read the fields the leaf wrote.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm that both checks read the leaf fields and recover from one off-focus iteration.

- Objective: Confirm that the findings gate reads a real `findingsCount`, that the route proof reads the projected row, and that `focusAlignment` judges only the latest record that carries both question lists.
- Real user request: Make sure a default research run is held when its findings are not enumerated or when it answers a question it did not list, and that one off-focus iteration does not hold the run for good.
- Prompt: `Check that deep-research runs the findings gate and the focusAlignment guard on the fields each leaf writes, on every default research run. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the verify, convergence and projection suites by file stem, then read the guard and the prompt-pack record shape in source.
- Expected signals: A projected row that claims findings with nothing enumerated returns `findings_not_enumerated`. `focusAlignment` fails when the latest record answers outside its key questions, and passes after a later aligned iteration. A `Q1: ` prefixed key question matches its bare answered text. The projection carries the ten leaf keys.
- Desired user-visible outcome: The operator can say the findings gate and the focus guard see what the leaf wrote, and a run is not stuck on one off-focus iteration.
- Pass/fail: PASS if the named suites pass and the source shows the guard reading the latest record that carries both lists; FAIL if a check reads an absent field, or a run stays held after a later aligned iteration.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that deep-research runs the findings gate and the focusAlignment guard on the fields each leaf writes, on every default research run. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run verify-iteration.vitest`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run convergence-script.vitest`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-projections-contract.vitest`
4. `rg -n "focusAlignment|normalizeQuestionForAlignment" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
5. `rg -n "findingsCount|keyQuestions" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`

### Expected

Commands 1 to 3 exit 0 with every case passing. The verify suite includes the findings-gate case on a `findingsCount` that arrives through the gateway and the route-proof case on the projected state row. The convergence suite includes the `focusAlignment` cases for a failing latest record, a recovery after a later aligned iteration and a `Q1: ` prefixed match. The projection suite asserts the ten leaf keys on a projected research iteration row. Command 4 prints the guard and its prefix normalizer. Command 5 prints the record shape with `findingsCount` and `keyQuestions`, and the rule that `keyQuestions` is the exact question text with no id prefix.

### Evidence

- The vitest summary line and exit status for commands 1 to 3.
- The `rg` line numbers for commands 4 and 5, read from the current source.

### Pass / Fail

- **Pass**: Commands 1 to 3 exit 0, and commands 4 and 5 show the guard reading the latest record that carries both lists and the record shape naming both leaf fields.
- **Fail**: A check reads a field the projected row does not carry, `focusAlignment` holds a run after a later aligned iteration, or any named suite fails.

### Failure Triage

- The findings gate passes with nothing enumerated: check that the gate reads the projected `findingsCount`, not only the delta.
- `focusAlignment` holds a run after an aligned iteration: check that the guard reads the latest record that carries both lists.
- The projection lacks a leaf key: check the conditional spreads in the research contract projection and the ten-key assertion in the projection suite.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | The `focusAlignment` guard and the question-prefix normalizer |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Conditional copies of the leaf keys into the projected iteration row |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Record shape the leaf writes, with `findingsCount` and `keyQuestions` |

### Validation

| File | Role |
|---|---|
| `verify-iteration.vitest` | Findings gate and route proof on the projected row |
| `convergence-script.vitest` | `focusAlignment` failure, recovery and prefix match |
| `deep-research-projections-contract.vitest` | The ten leaf keys on a projected research iteration row |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-067
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md`
- Feature catalog status: `feature-catalog/state-management/leaf-field-gates.md` covers this scenario.
