---
title: "DR-066 -- Next Focus ignores answered free text"
description: "This scenario validates that deep-research Next Focus and its carried-forward open-question list skip status sentences and answered questions, and read the latest leaf's Recommended Next Focus, for `DR-066`. It focuses on the default focus chain that every research run uses."
version: 1.15.0.0
---

# DR-066 -- Next Focus ignores answered free text

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-066`.

---

## 1. OVERVIEW

This scenario validates that deep-research Next Focus and the carried-forward open-question list skip status sentences and answered questions. It focuses on the default focus chain, which runs on every research iteration without an opt-in flag.

### Why This Matters

A status sentence under `## Questions Remaining`, or a question the run already answered, must not steer the next iteration. The loop should spend its next round on an open machine question or on the latest leaf's own Recommended Next Focus.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm that the focus chain reads only open questions and the leaf recommendation.

- Objective: Confirm that the carried-forward list drops a status sentence and an answered question, and that the latest leaf's Recommended Next Focus is read ahead of the carried-forward thread while a machine question is open.
- Real user request: Make sure a research run never picks its next focus from a sentence that says a question is already settled.
- Prompt: `Check that deep-research picks its next focus from open machine questions and the latest leaf's Recommended Next Focus, and not from a status sentence or an answered question. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the reducer and continuity suites by file stem, then read the carried-forward filter and the leaf read in source.
- Expected signals: A status sentence listed under Questions Remaining is dropped from the carried-forward open questions. An answered question is not carried forward. An unresolved leaf Recommended Next Focus becomes Next Focus while a machine question is open. A leaf focus that equals a resolved question is skipped.
- Desired user-visible outcome: The operator can say the next iteration follows an open question or the leaf's recommendation, not a stale sentence.
- Pass/fail: PASS if every named case passes and the source reads the leaf recommendation after the pivot and recovery picks; FAIL if a status sentence or an answered question reaches Next Focus or the carried-forward list.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that deep-research picks its next focus from open machine questions and the latest leaf's Recommended Next Focus, and not from a status sentence or an answered question. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-reduce-state.vitest -t "status sentence"`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run deep-research-reduce-state.vitest -t "Recommended Next Focus"`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run continuity-thread.vitest`
4. `rg -n "buildCarriedForwardOpenQuestions|deriveNextFocusFromContinuity" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs`
5. `rg -n "resolveNextFocus|buildRegistry" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`

### Expected

Commands 1 to 3 exit 0 with every selected case passing. The case that drops a status sentence listed under Questions Remaining passes. The case that reads the latest leaf Recommended Next Focus, and skips it when it is resolved, passes. Commands 4 and 5 print the carried-forward filter, the leaf read and the call sites that feed the registry.

### Evidence

- The vitest summary line and exit status for commands 1 to 3, with the selected case names.
- The `rg` line numbers for commands 4 and 5, read from the current source.

### Pass / Fail

- **Pass**: Commands 1 to 3 exit 0 with the named cases passing, and commands 4 and 5 show the filter and the leaf read.
- **Fail**: A status sentence or an answered question reaches Next Focus or the carried-forward list, or any named case fails.

### Failure Triage

- A named case is missing or renamed: the test file no longer pins the behavior, so restore the case before trusting the verdict.
- A status sentence reaches the carried-forward list: check the question-shape and answered-question filter in `buildCarriedForwardOpenQuestions`.
- Next Focus ignores an unresolved leaf recommendation while a machine question is open: check the leaf read in `deriveNextFocusFromContinuity`.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` | Carried-forward filter and the leaf recommendation read |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Registry build and the Next Focus resolution that feeds it |

### Validation

| File | Role |
|---|---|
| `continuity-thread.vitest` | Question shape, answered drop, leaf ahead of thread, resolved leaf skip and the terminal sentinel |
| `deep-research-reduce-state.vitest` | Status sentence drop, leaf reader and rejected leaf pattern |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-066
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/next-focus-ignores-answered-free-text.md`
- Feature catalog status: this scenario does not cite a specific catalog entry.
