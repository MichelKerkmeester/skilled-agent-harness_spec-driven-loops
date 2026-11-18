---
title: "Findings gate and focusAlignment read leaf fields"
description: "The deep-research findings gate and the focusAlignment guard judge the leaf fields the projected state-log row keeps, so both checks fire on every default research run."
trigger_phrases:
  - "findings gate leaf fields"
  - "findings_not_enumerated"
  - "focusAlignment guard"
  - "projected iteration row"
version: 1.0.0.0
---

# Findings gate and focusAlignment read leaf fields

## 1. OVERVIEW

Two research checks judge what each leaf wrote. The findings gate holds an iteration that claims findings without enumerating them, and the `focusAlignment` guard holds a run that answers questions outside its key questions. Both read the fields the projected state-log row keeps, so they apply on every default research run without a flag.

---

## 2. HOW IT WORKS

### Findings Gate

`runtime/scripts/verify-iteration.cjs` reads the projected row's `findingsCount`. A row that claims findings with nothing enumerated fails with `findings_not_enumerated`.

### Focus Alignment

The `focusAlignment` guard in `runtime/scripts/convergence.cjs` judges only the latest record that carries both question lists, so one off-focus iteration holds the run until a later aligned iteration clears it. A `Q1: ` prefixed key question matches its bare answered text.

### Projected Row

`runtime/lib/legacy-projections/deep-research-contract.ts` copies the leaf keys into the projected iteration row, and the prompt pack's record shape names `findingsCount` and `keyQuestions`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Script | Findings gate on the projected row. |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Script | The `focusAlignment` guard and the question-prefix normalizer. |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Shared | Conditional copies of the leaf keys into the projected iteration row. |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Asset | Record shape the leaf writes, with `findingsCount` and `keyQuestions`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Vitest | Findings gate and route proof on the projected row. |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Vitest | `focusAlignment` failure, recovery and prefix match. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-projections-contract.vitest.ts` | Vitest | The leaf keys on a projected research iteration row. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md` | Manual playbook | DR-067: both checks read the leaf fields. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-management/leaf-field-gates.md`

Related references:
- [focus-hijack-guard.md](focus-hijack-guard.md) - Next Focus free-text guard
