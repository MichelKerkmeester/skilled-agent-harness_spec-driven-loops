---
title: "DAC-006 -- State JSONL records council_complete event"
description: "This scenario validates council_complete event persistence for DAC-006."
---

# DAC-006 -- State JSONL records council_complete event

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-006`.

---

## 1. OVERVIEW

This scenario validates that completed persisted runs include `council_complete`.

### Why This Matters

Resume and audit workflows need an explicit terminal event to distinguish complete runs from interrupted runs.

---

## 2. SCENARIO CONTRACT

- Objective: Verify final state includes `council_complete`.
- Real user request: Check whether this council run completed.
- Prompt: `Check whether this council run completed and show the final state events.`
- Expected execution process: Tail the state JSONL and parse each line with `jq`.
- Expected signals: A `council_complete` event appears in the final records.
- Desired user-visible outcome: The user gets a clear complete/incomplete verdict.
- Pass/fail: PASS if `council_complete` is present; FAIL if missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Use a packet with persisted council artifacts.
2. Tail and parse the state log.
3. Confirm the terminal event.

### Prompt

`Check whether this council run completed and show the final state events.`

### Commands

1. `bash: tail -n 5 <packet>/ai-council/ai-council-state.jsonl | jq -c .`

### Expected

The parsed tail includes `event:"council_complete"`.

### Evidence

Capture parsed JSONL tail.

### Pass / Fail

- **Pass**: Completion event is present and parseable.
- **Fail**: State is missing, malformed, or lacks completion.

### Failure Triage

Run the completion advisory, then inspect helper output and report writes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-006 | State JSONL completion | Verify terminal event | `Check whether this council run completed and show the final state events.` | `bash: tail -n 5 <packet>/ai-council/ai-council-state.jsonl | jq -c .` | `council_complete` appears | Parsed JSONL | PASS if terminal event present | Run advisory helper |

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
| `.opencode/skills/deep-ai-council/references/state_format.md` | State event contract |
| `.opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs` | Completion advisory |

---

## 5. SOURCE METADATA

- Group: ARTIFACT PERSISTENCE AND STATE FORMAT
- Playbook ID: DAC-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--artifact-persistence-and-state-format/002-state-jsonl-records-council-complete-event.md`
