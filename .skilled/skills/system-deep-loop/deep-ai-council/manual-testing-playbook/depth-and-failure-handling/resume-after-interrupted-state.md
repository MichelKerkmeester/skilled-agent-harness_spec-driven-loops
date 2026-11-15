---
title: "DAC-018 -- Resume after interrupted state"
description: "This scenario validates resume behavior for `DAC-018`. It focuses on continuing from the round artifacts on disk toward council_complete."
version: 1.7.1.0
---

# DAC-018 -- Resume after interrupted state

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-018`.

---

## 1. OVERVIEW

This scenario validates resume behavior for `DAC-018`. It focuses on missing seat files, missing deliberation, and unconverged round recovery rules.

### Why This Matters

Council rounds are append-only. Resume behavior must continue from the round artifacts on disk instead of guessing or rewriting history.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-018` and confirm the expected signals without contradictory evidence.

- Objective: Verify an interrupted council run resumes from the round artifacts on disk and continues toward `council_complete`.
- Real user request: Resume an interrupted council run from the round artifacts on disk and continue toward council_complete.
- Prompt: `Resume an interrupted council run from the round artifacts on disk and continue toward council_complete.`
- Expected execution process: Inspect `state-format.md` §6 ROUND MODEL AND RESUME SEMANTICS, then verify the documented artifact-based recovery paths.
- Expected signals: Resume rules cover missing seat files, a missing `deliberations/round-NNN.md` and a round that did not converge.
- Desired user-visible outcome: The user sees the next safe resume action based on the last complete artifact.
- Pass/fail: PASS if the resume rules document missing seat files, missing deliberation and an unconverged round, and name the artifacts on disk as the resume source; FAIL if any recovery path is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `state-format.md` §6 ROUND MODEL AND RESUME SEMANTICS.
2. Confirm the Resume subsection names the artifacts on disk as the resume source.
3. Run the grep command and confirm the artifact-based cases are documented.

### Prompt

`Resume an interrupted council run from the round artifacts on disk and continue toward council_complete.`

### Commands

1. `bash: rg -n "RESUME SEMANTICS|artifacts on disk|seat files|deliberations/round-NNN.md. is missing" .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md`

### Expected

`state-format.md` documents resume from the artifacts on disk for missing seat files, a missing deliberation and an unconverged round.

### Evidence

Capture grep output and note the matching resume section.

### Pass / Fail

- **Pass**: Resume rules documented for missing seat files, missing deliberation and an unconverged round, with the artifacts on disk as the source.
- **Fail**: Any of the required resume cases is missing.

### Failure Triage

Update `state-format.md` §6 Resume, then rerun the grep check.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-018 | Resume interrupted state | Verify resume from the artifacts on disk | `Resume an interrupted council run from the round artifacts on disk and continue toward council_complete.` | `bash: rg -n "RESUME SEMANTICS\|artifacts on disk\|seat files\|deliberations/round-NNN.md. is missing" .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md` | Resume rules cover missing seats, missing deliberation and an unconverged round | Grep output | PASS if all resume cases are documented | Update state-format.md §6 Resume |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md` | Resume semantics reference |
| `.skilled/agents/ai-council.md` | Authoritative invocation and resume contract |

---

## 5. SOURCE METADATA

- Group: DEPTH AND FAILURE HANDLING
- Playbook ID: DAC-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `depth-and-failure-handling/resume-after-interrupted-state.md`
