---
title: "DAC-018 -- Resume after interrupted state"
description: "This scenario validates resume behavior for `DAC-018`. It focuses on continuing from the last completed JSONL event toward council_complete."
---

# DAC-018 -- Resume after interrupted state

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-018`.

---

## 1. OVERVIEW

This scenario validates resume behavior for `DAC-018`. It focuses on partial `round_start`, missing synthesis, and missing `round_end` recovery rules.

### Why This Matters

Council state is append-only. Resume behavior must continue from real JSONL events instead of guessing or rewriting history.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-018` and confirm the expected signals without contradictory evidence.

- Objective: Verify an interrupted council run can resume from the last completed JSONL event and continue toward `council_complete`.
- Real user request: Resume an interrupted council run from the last completed JSONL event and continue toward council_complete.
- Prompt: `Resume an interrupted council run from the last completed JSONL event and continue toward council_complete.`
- Expected execution process: Inspect `state_format.md` §6 RESUME SEMANTICS and agent body §13 case 3, then verify the documented partial-event recovery paths.
- Expected signals: Resume rules cover partial `round_start`, missing `deliberation_synthesized`, and missing `round_end`.
- Desired user-visible outcome: The user sees the next safe resume action based on the last completed event.
- Pass/fail: PASS if resume rules document partial `round_start`, missing synthesis, and missing `round_end`; FAIL if any recovery path is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `state_format.md` §6 RESUME SEMANTICS.
2. Read `.opencode/agents/ai-council.md` §13 case 3.
3. Run the grep command and confirm the partial-event cases are documented.

### Prompt

`Resume an interrupted council run from the last completed JSONL event and continue toward council_complete.`

### Commands

1. `bash: rg -n "RESUME SEMANTICS|round_start.*without|deliberation_synthesized.*missing" .opencode/skills/deep-loop-workflows/ai-council/references/structure/state_format.md`

### Expected

`state_format.md` documents resume behavior for partial `round_start`, missing `deliberation_synthesized`, and missing `round_end`.

### Evidence

Capture grep output and note the matching resume section.

### Pass / Fail

- **Pass**: Resume rules documented for partial `round_start`, missing synthesis, and missing `round_end`.
- **Fail**: Any of the required resume cases is missing.

### Failure Triage

Update `state_format.md` from agent §13 resume semantics, then rerun the grep check.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-018 | Resume interrupted state | Verify resume from last JSONL event | `Resume an interrupted council run from the last completed JSONL event and continue toward council_complete.` | `bash: rg -n "RESUME SEMANTICS\|round_start.*without\|deliberation_synthesized.*missing" .opencode/skills/deep-loop-workflows/ai-council/references/structure/state_format.md` | Resume semantics mention partial round and missing synthesis cases | Grep output | PASS if all resume cases are documented | Update state reference from agent source |

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
| `.opencode/skills/deep-loop-workflows/ai-council/references/structure/state_format.md` | Resume semantics reference |
| `.opencode/agents/ai-council.md` | Authoritative invocation and resume contract |

---

## 5. SOURCE METADATA

- Group: DEPTH AND FAILURE HANDLING
- Playbook ID: DAC-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--depth-and-failure-handling/resume-after-interrupted-state.md`
