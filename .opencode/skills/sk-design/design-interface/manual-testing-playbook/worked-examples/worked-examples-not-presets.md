---
title: Worked Examples Not Presets Scenario
description: Manual scenario verifying that foundations examples are loaded as illustrative calibration and never reused as a style preset.
trigger_phrases:
  - "test foundations worked examples"
  - "worked examples not presets"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: WORKED_EXAMPLES
expected_resources:
  - references/foundations/corpus-map.md
  - ../shared/register.md
  - references/foundations/worked-examples.md
---

# FOUND-EXAMPLE-001 | Worked Examples Not Presets

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-EXAMPLE-001`.

**Exact prompt**

```text
Show me what a complete foundations answer looks like, but do not reuse it as a preset.
```

---

## 1. OVERVIEW

This scenario validates that the foundations worked examples are loaded as illustrative calibration in `interface`'s `foundations` static-system subworkflow, and never reused as a style preset. It is the negative control that keeps the example corpus from becoming a default look.

### Why This Matters

A worked example is the fastest thing to copy and the most expensive thing to copy wrongly. If example palettes, type, or spacing values leak into a live system without brief evidence, the skill has silently acquired a house style — the exact templated-default failure the interface surface exists to prevent.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the worked-examples corpus is loaded as calibration only, with the answer shape extracted and no specific value reused as a preset.
- Real user request: `Can you show me a full example of what a finished foundations answer looks like? I don't want to just copy it though.`
- Prompt: `Show me what a complete foundations answer looks like, but do not reuse it as a preset.`
- Expected execution process: Recognize this as `interface`'s `foundations` static-system subworkflow; load `../../references/foundations/worked-examples.md` as calibration; state that the examples are illustrative and not reusable presets; extract the answer shape, not the specific palette, type, or spacing values.
- Expected signals: The response explicitly marks the examples illustrative; the answer shape is described rather than the concrete values reused; roles still precede raw values; the final handoff reflects current surface constraints rather than the example's.
- Desired user-visible outcome: A clear picture of what a complete foundations answer looks like structurally, with no example value smuggled into the user's live system.
- Pass/fail: PASS if the examples are marked illustrative and only the answer shape is extracted; FAIL if any example value is copied into a live system without brief evidence, if raw values precede roles, or if the handoff carries the example's surface constraints instead of the current ones.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Recognize this as `interface`'s `foundations` static-system subworkflow.
2. Load `references/foundations/worked-examples.md` as calibration.
3. State that the examples are illustrative and not reusable presets.
4. Extract the answer shape, not the specific palette, type or spacing values.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-EXAMPLE-001 | Worked examples used as calibration, not presets | Confirm the examples corpus is loaded as illustrative calibration with no value reused as a preset | `Show me what a complete foundations answer looks like, but do not reuse it as a preset.` | bash: rg -n "example" ../../references/foundations/worked-examples.md -> bash: rg -n "register" ../../../shared/register.md -> agent: describe the complete foundations answer shape | Step 1: worked-example corpus found; Step 2: register posture found; Step 3: output marks the examples illustrative and returns the answer shape rather than the example values | Terminal transcript, the returned answer shape, the illustrative-only statement, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any example palette, type, or spacing value is carried into a live system without brief evidence | 1. Re-read `../../references/foundations/worked-examples.md` for the calibration-not-preset framing; 2. Diff the returned values against the example values and confirm no direct reuse; 3. Re-run and confirm roles still precede raw values |

### Pass Criteria

- The response marks the examples illustrative.
- No example value is copied into a live system without brief evidence.
- The output keeps roles before raw values.
- The final handoff still uses current surface constraints.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and foundations resource map |
| `../../references/foundations/corpus-map.md` | Foundations corpus entry point |
| `../../references/foundations/worked-examples.md` | Illustrative worked-example corpus used as calibration |
| `../../../shared/register.md` | Register posture that constrains the returned answer shape |

---

## 5. SOURCE METADATA

- Group: Worked Examples
- Playbook ID: FOUND-EXAMPLE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `worked-examples/worked-examples-not-presets.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
