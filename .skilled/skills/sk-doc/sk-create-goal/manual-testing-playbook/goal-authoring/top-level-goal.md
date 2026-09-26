---
title: "SCG-001 -- Top-level goal"
description: "This scenario validates the top-level goal for `SCG-001`. It focuses on authoring a goal for a single-folder packet that passes the goal check and fits the durable budget."
stage: routing
version: 1.0.0.0
---

# SCG-001 -- Top-level goal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-001`.

---

## 1. OVERVIEW

This scenario validates the top-level goal for `SCG-001`. It focuses on authoring a goal for a single-folder packet that passes the goal check and fits the durable budget.

### Why This Matters

The top-level goal is the shape most packets use and the shape every other scenario builds on. The mode must derive the objective and the criteria from the packet's own sources instead of a remembered summary, render the structure from the system-spec-kit template and leave no template text behind. The handoff boundary is part of the test: the check runs first and the chat slice prints only after the check passes, so a runner who sees a chat slice also knows the goal was checked.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-001` and confirm the expected signals without contradictory evidence.

- Objective: author a top-level goal for a single-folder scratch packet and prove the goal check passes and the budget reads ok
- Real user request: `My demo packet has a spec and acceptance criteria but no goal yet. Write the goal and show me what to set as the session objective.`
- Prompt: `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto, run the goal check and print the chat slice if it passes.`
- Expected execution process: the workflow reads the fixture spec and acceptance criteria, renders the goal template at the packet's level and fills an objective sentence, a decision row and three completion criteria copied from the acceptance criteria. It runs the goal check before any handoff and prints the chat slice only after the check passes.
- Expected signals: the goal file exists at the exact packet path, the goal check exits 0 with `RESULT: PASSED (4/4 checks)` and four `PASS <check> findings=0` lines, the packet report prints `packet_budget=ok` and `packet_nested=false`, the `chat_slice` field is present and carries the objective sentence and the criteria count reads 3.
- Desired user-visible outcome: the operator receives a passing goal check and a chat slice ready to set as the session objective.
- Pass/fail: PASS if every expected signal appears with no contradictory evidence. FAIL if the check exits non-zero, the budget reads other than `ok`, the chat slice is missing or the criteria count differs from the fixture's three acceptance criteria.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto, run the goal check and print the chat slice if it passes.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-001 | Top-level goal | Author a top-level goal that passes the goal check and fits the budget | `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto, run the goal check and print the chat slice if it passes.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `agent: run /create:goal $SCRATCH/specs/demo-packet top-level :auto` -> 6. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"` -> 7. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"` -> 8. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-packet --workspace "$SCRATCH"` -> 9. `bash: grep -c '^- \[ \]' "$SCRATCH/specs/demo-packet/goal.md"` -> 10. `bash: rm -rf "$SCRATCH"` | Step 6 exits 0. Step 7 exits 0 with `RESULT: PASSED (4/4 checks)` and `PASS missing-binding-row findings=0`, `PASS placeholder findings=0`, `PASS criteria-count findings=0`, `PASS parent-budget findings=0`. Step 8 prints `STATUS=OK ACTION=packet` with `packet_budget=ok`, `packet_nested=false` and a `chat_slice` field. Step 9 prints 3 | The prompt, the reply text, the step 6 exit status, the full step 7 transcript, the full step 8 output and the step 9 count | PASS if all listed signals appear and the chat slice carries the objective sentence. FAIL if the check exits non-zero, `packet_budget` reads other than `ok`, `chat_slice` is absent or step 9 prints a number other than 3 | 1. Read the step 7 transcript before anything else. A `FINDING` line names the defect and the triage starts there. 2. If step 8 reports `packet_budget=unknown`, the manifest copy in step 3 is missing and no budget verdict can be given. 3. If step 9 prints a count other than 3, compare the criteria against the fixture acceptance criteria to see whether the authoring invented or dropped criteria |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `agent: run /create:goal $SCRATCH/specs/demo-packet top-level :auto`
6. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"`
7. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"`
8. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-packet --workspace "$SCRATCH"`
9. `bash: grep -c '^- \[ \]' "$SCRATCH/specs/demo-packet/goal.md"`
10. `bash: rm -rf "$SCRATCH"`

### Scratch fixture

Step 4 writes these two files with these exact bytes:

```markdown
==== $SCRATCH/specs/demo-packet/spec.md ====
# Demo packet specification

## Problem and purpose

Two concurrent runs append to counter.txt and the file sometimes ends up with
duplicated or lost lines. This packet defines one append-only counter update.

## Decisions

The counter update is append-only. A run never rewrites existing lines.

==== $SCRATCH/specs/demo-packet/acceptance-criteria.md ====
# Acceptance criteria

- [ ] counter.txt grows by exactly one line per run
- [ ] an interleaved run appends after the earlier run line
- [ ] no existing line is rewritten or removed
```

### Expected

Step 6 confirms the goal file landed at the exact packet path. Step 7 runs the four named checks and all four pass with zero findings, so the goal carries no placeholder, a criteria count in range and a durable slice within budget. Step 8 reads the packet report where `packet_budget=ok` proves the slice measured at or below 4000 characters and `packet_nested=false` proves the goal carries no binding section. The `chat_slice` field is the operator handoff text and must carry the objective sentence. Step 9 reads 3 because the fixture carries exactly three acceptance criteria and the mode writes one criterion per acceptance check.

### Evidence

Capture the prompt and reply text, the step 6 exit status, the complete step 7 transcript including every per-check line and the `RESULT:` line, the complete step 8 output with the named fields and the step 9 count. Keep the `chat_slice` value in full so the objective sentence can be compared against the packet's purpose.

### Pass / Fail

- **Pass**: the goal file exists, the goal check exits 0 with `RESULT: PASSED (4/4 checks)`, the packet report shows `packet_budget=ok` and `packet_nested=false`, the `chat_slice` carries the objective sentence and the criteria count reads 3.
- **Fail**: any expected signal is missing or contradictory, in particular a non-zero check exit, a budget state other than `ok`, an absent `chat_slice` or a criteria count that differs from the fixture.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. Start from the step 7 transcript. Each `FINDING` line names its check and the defect and the four checks separate template text, criteria count, binding rows and budget cleanly.
2. If step 8 prints `packet_budget=unknown`, confirm the manifest copy from step 3 exists at `$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`. Without it no budget verdict is possible and the scenario cannot be graded.
3. If the check passes but the chat slice lacks the objective sentence, compare the goal file's `**Objective:**` line against the fixture spec purpose. A goal that invents purpose is a fail of the authoring step even when every check passes.

### Optional Supplemental Checks

Run the same fixture with five acceptance criteria and confirm the criteria count follows the fixture and the check still passes. Then truncate the objective to an empty sentence and confirm the `placeholder` check stays green while a reader fails the goal on the objective rule from the authoring standards.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Mode contract with the pre-write decisions and the handoff boundary |
| [`../../references/parent-and-nested-goals.md`](../../references/parent-and-nested-goals.md) | The top-level workflow this scenario drives |
| [`../../references/authoring-standards.md`](../../references/authoring-standards.md) | Reader checks the authored objective and criteria are held to |
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | The four named checks read in step 7 |
| [`../../../../../hooks/goal/bin/goal.cjs`](../../../../../hooks/goal/bin/goal.cjs) | Packet report source for `packet_budget`, `packet_nested` and `chat_slice` |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/top-level-goal.md`
