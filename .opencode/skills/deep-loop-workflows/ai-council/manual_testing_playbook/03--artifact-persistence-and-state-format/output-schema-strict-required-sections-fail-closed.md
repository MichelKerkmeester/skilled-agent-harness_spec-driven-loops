---
title: "DAC-007 -- Output schema strict required sections fail closed"
description: "This scenario validates fail-closed output schema handling for DAC-007."
---

# DAC-007 -- Output schema strict required sections fail closed

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-007`.

---

## 1. OVERVIEW

This scenario validates that missing required sections stop persistence before writes.

### Why This Matters

Lossy persistence would make council artifacts look complete while hiding missing planning evidence.

---

## 2. SCENARIO CONTRACT

- Objective: Verify missing required report sections exit 1.
- Real user request: Try to persist this incomplete council report and tell me whether it is accepted.
- Prompt: `Try to persist this incomplete council report and tell me whether it is accepted.`
- Expected execution process: Run the helper with a missing-required-section report and capture the exit.
- Expected signals: Helper reports missing sections and exits 1.
- Desired user-visible outcome: The user sees that incomplete reports fail closed.
- Pass/fail: PASS if exit is 1 and no artifact tree is written; FAIL if persistence succeeds.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Use an intentionally incomplete report fixture.
2. Run the helper and echo the exit code.
3. Confirm no new successful artifact tree was created.

### Prompt

`Try to persist this incomplete council report and tell me whether it is accepted.`

### Commands

1. `bash: node .opencode/skills/deep-loop-workflows/ai-council/scripts/persist-artifacts.cjs <packet> --input-file <missing-required-section.md>; echo "exit=$?"`

### Expected

The helper exits 1 and names missing required sections.

### Evidence

Capture stderr/stdout and exit code.

### Pass / Fail

- **Pass**: Exit is 1 before writes.
- **Fail**: Helper writes artifacts from an incomplete report.

### Failure Triage

Check `references/structure/output_schema.md`, parser requiredness matrix, and fixture headings.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-007 | Output schema strictness | Verify fail-closed required sections | `Try to persist this incomplete council report and tell me whether it is accepted.` | `bash: node .opencode/skills/deep-loop-workflows/ai-council/scripts/persist-artifacts.cjs <packet> --input-file <missing-required-section.md>; echo "exit=$?"` | Exit 1 and missing-section message | Command output | PASS if no writes occur | Check output schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/ai-council/references/structure/output_schema.md` | Requiredness contract |
| `.opencode/skills/deep-loop-workflows/ai-council/scripts/persist-artifacts.cjs` | Parser entrypoint |

---

## 5. SOURCE METADATA

- Group: ARTIFACT PERSISTENCE AND STATE FORMAT
- Playbook ID: DAC-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md`
