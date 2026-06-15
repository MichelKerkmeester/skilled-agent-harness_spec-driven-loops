---
title: "DAC-014 -- Depth detection parallel vs sequential"
description: "This scenario validates Depth 0 versus Depth 1 dispatch detection for `DAC-014`. It focuses on selecting sequential_thinking inline mode for explicit nested council calls."
---

# DAC-014 -- Depth detection parallel vs sequential

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-014`.

---

## 1. OVERVIEW

This scenario validates Depth 0 versus Depth 1 dispatch detection for `DAC-014`. It focuses on selecting sequential inline mode when an explicit `Depth: 1` marker is present.

### Why This Matters

Council dispatch must preserve NDP compliance. A council called from another agent should deliberate inline rather than recursively dispatching more agents.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-014` and confirm the expected signals without contradictory evidence.

- Objective: Verify Depth 0 versus Depth 1 dispatch detection and confirm `sequential_thinking` inline mode is selected for an explicit `Depth: 1` marker.
- Real user request: Check whether a nested council call chooses sequential mode.
- Prompt: `As a council dispatcher, classify a request with explicit Depth: 1 marker. Verify sequential_thinking inline mode is selected. Return mode + rationale.`
- Expected execution process: Inspect the agent body §0 and §5 plus `references/convergence/depth_dispatch.md`, then confirm Depth 1 maps to sequential inline deliberation.
- Expected signals: Agent body contains Depth 0, Depth 1, and `sequential_thinking` rules; `depth_dispatch.md` mirrors the numbered sections and decision rule.
- Desired user-visible outcome: The user sees `Depth 1 -> sequential_thinking inline mode` with a short rationale.
- Pass/fail: PASS if detection rules are present in the agent body and mirrored in `depth_dispatch.md`; FAIL if either source is missing the rule.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `.opencode/agents/ai-council.md` §0 and §5.
2. Read `references/convergence/depth_dispatch.md`.
3. Run the grep commands and compare the source and reference signals.

### Prompt

`As a council dispatcher, classify a request with explicit Depth: 1 marker. Verify sequential_thinking inline mode is selected. Return mode + rationale.`

### Commands

1. `bash: rg -n "Depth 0|Depth 1|sequential_thinking" .opencode/agents/ai-council.md`
2. `bash: rg -n "## [0-9]+\\." .opencode/skills/deep-loop-workflows/ai-council/references/convergence/depth_dispatch.md`

### Expected

The agent body and `depth_dispatch.md` both document Depth 0 parallel dispatch, Depth 1 sequential inline processing, and `sequential_thinking` as the nested mode.

### Evidence

Capture grep output showing the source rules and the numbered H2 sections in `depth_dispatch.md`.

### Pass / Fail

- **Pass**: Detection rules present in agent body and mirrored in `depth_dispatch.md`.
- **Fail**: Depth 1 is absent, `sequential_thinking` is absent, or the reference does not mirror source behavior.

### Failure Triage

Check whether the agent body was renumbered, then update `depth_dispatch.md` from the authoritative source before retesting.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-014 | Depth detection | Verify Depth 0 vs Depth 1 dispatch detection | `As a council dispatcher, classify a request with explicit Depth: 1 marker. Verify sequential_thinking inline mode is selected. Return mode + rationale.` | `bash: rg -n "Depth 0\|Depth 1\|sequential_thinking" .opencode/agents/ai-council.md` -> `bash: rg -n "## [0-9]+\\." .opencode/skills/deep-loop-workflows/ai-council/references/convergence/depth_dispatch.md` | Depth rules exist in source and reference | Grep output | PASS if source and reference both contain the rule | Check agent renumbering and reference parity |

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
| `.opencode/agents/ai-council.md` | Authoritative Depth 0 and Depth 1 source |
| `.opencode/skills/deep-loop-workflows/ai-council/references/convergence/depth_dispatch.md` | Reference mirror for operator use |

---

## 5. SOURCE METADATA

- Group: DEPTH AND FAILURE HANDLING
- Playbook ID: DAC-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md`
