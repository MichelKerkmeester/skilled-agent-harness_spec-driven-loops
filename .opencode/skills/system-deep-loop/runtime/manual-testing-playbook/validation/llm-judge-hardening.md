---
title: "DLR-045 -- LLM-judge hardening"
description: "Manual validation scenario for LLM-judge hardening in the runtime/ skill."
version: 1.4.0.15
---

# DLR-045 -- LLM-judge hardening

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-045`.

---

## 1. OVERVIEW

Hardens LLM judge validation with retries, dual timeouts, format-strip parsing, neutral fallback cards, and quarantine gating.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm LLM-judge hardening behaves as documented and remains aligned with its implementation and tests.
- Layer partition: validation runtime.
- Real user request: `Validate LLM-judge hardening and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Retry behavior, neutral fallback card shape, quarantine skip paths, and non-quarantined success coverage.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/validation/llm-judge-hardening.md`.

### Steps

1. Inspect `lib/deep-loop/post-dispatch-validate.ts` for the implementation contract.
2. Inspect `tests/unit/post-dispatch-validate.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

LLM-judge hardening matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/post-dispatch-validate.ts` | LLM-judge hardening. |

### Validation

| File | Role |
|---|---|
| `tests/unit/post-dispatch-validate.vitest.ts` | Primary regression coverage for LLM-judge hardening. |

---

## 5. SOURCE_METADATA

- Group: Validation
- Playbook ID: DLR-045
- Feature catalog entry: `feature-catalog/validation/llm-judge-hardening.md`
- Scenario file path: `manual-testing-playbook/validation/llm-judge-hardening.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//016-llm-judge-hardening`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
