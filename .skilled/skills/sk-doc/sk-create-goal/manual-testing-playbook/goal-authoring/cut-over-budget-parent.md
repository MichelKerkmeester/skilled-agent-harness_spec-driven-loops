---
title: "SCG-004 -- Cut an over-budget parent"
description: "This scenario validates the ordered budget cut for `SCG-004`. It focuses on bringing an over-budget parent goal to `packet_budget=ok` through the documented cut order with the completion criterion count unchanged."
stage: routing
version: 1.0.0.0
---

# SCG-004 -- Cut an over-budget parent

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-004`.

---

## 1. OVERVIEW

This scenario validates the ordered budget cut for `SCG-004`. It focuses on bringing an over-budget parent goal to `packet_budget=ok` through the documented cut order with the completion criterion count unchanged.

### Why This Matters

The durable slice caps at 4000 characters because the runtime goal surfaces hold that much and a truncated objective loses its tail, which is where the criteria live. The cut order exists so the easy edits come first: frontmatter and log changes move nothing in the measured slice while child restatement and long decision prose are where the real characters sit. A run that drops a criterion to fit the budget has traded a checkable outcome for a number and the criterion count in this scenario is the tripwire for exactly that.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-004` and confirm the expected signals without contradictory evidence.

- Objective: cut an over-budget parent goal in the documented cut order down to `packet_budget=ok` with the completion criterion count unchanged
- Real user request: `The phase parent goal is too long for the budget. Trim it down but do not lose any of the completion criteria.`
- Prompt: `The parent goal at $SCRATCH/specs/demo-phase is over the durable budget. Use /create:goal amend :auto to cut it in the documented cut order without dropping a completion criterion and show the budget field after each cut.`
- Expected execution process: the goal is authored deliberately verbose so its durable slice exceeds the limit. The cuts then follow the reference order one at a time with a measurement after each: frontmatter and log first, then child restatement, then decision prose, then criterion wording as needed.
- Expected signals: the first report prints `packet_budget=over` with `packet_durable_chars=N0`, the first goal check exits 1 with `FAIL parent-budget findings=1` and `RESULT: FAILED (3/4 checks)`, the report after the frontmatter and log cuts prints the same `packet_durable_chars=N0`, the report after the child-restatement cut prints `packet_durable_chars=N1` with N1 below N0, the report after the decision cut prints `packet_durable_chars=N2` with N2 below N1, the final report prints `packet_budget=ok`, the criteria count reads 5 both before and after the cuts and the final goal check exits 0 with `RESULT: PASSED (4/4 checks)` and `PASS criteria-count findings=0`.
- Desired user-visible outcome: the operator sees the budget field reach `ok` with every completion criterion still present and checkable.
- Pass/fail: PASS if the budget travels from `over` to `ok` in the documented order and the criteria count stays 5. FAIL if a cut moves the measured slice out of order, the count changes, a criterion becomes uncheckable or the final budget reads other than `ok`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The parent goal at $SCRATCH/specs/demo-phase is over the durable budget. Use /create:goal amend :auto to cut it in the documented cut order without dropping a completion criterion and show the budget field after each cut.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-004 | Cut an over-budget parent | Cut an over-budget parent in the reference order with the criterion count unchanged | `The parent goal at $SCRATCH/specs/demo-phase is over the durable budget. Use /create:goal amend :auto to cut it in the documented cut order without dropping a completion criterion and show the budget field after each cut.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `agent: run /create:goal $SCRATCH/specs/demo-phase phase-parent :auto and /create:goal $SCRATCH/specs/demo-phase/001-alpha child :auto with a deliberately verbose brief that restates the child goal in the parent body, explains each decision at length and writes the five completion criteria in long wording` -> 6. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 7. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"` -> 8. `bash: grep -c '^- \[ \]' "$SCRATCH/specs/demo-phase/goal.md"` -> 9. `agent: apply cut-order step 1 and step 2 only: trim the goal frontmatter and empty the log below its anchor` -> 10. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 11. `agent: apply cut-order step 3 only: remove the parent text that restates the child goal` -> 12. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 13. `agent: apply cut-order step 4 only: shorten the decision prose to the choice a later author must honor` -> 14. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 15. `agent: apply cut-order step 5 only: shorten criterion wording as needed, keeping every criterion and matching any objective copy to it` -> 16. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 17. `bash: grep -c '^- \[ \]' "$SCRATCH/specs/demo-phase/goal.md"` -> 18. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"` -> 19. `bash: rm -rf "$SCRATCH"` | Step 6 prints `packet_budget=over` and `packet_durable_chars=N0`. Step 7 exits 1 with `FAIL parent-budget findings=1` and `RESULT: FAILED (3/4 checks)`. Step 8 prints 5. Step 10 prints `packet_durable_chars=N0` again. Step 12 prints `packet_durable_chars=N1` with N1 below N0. Step 14 prints `packet_durable_chars=N2` with N2 below N1. Step 16 prints `packet_budget=ok`. Step 17 prints 5. Step 18 exits 0 with `RESULT: PASSED (4/4 checks)`, `PASS criteria-count findings=0` and `PASS parent-budget findings=0` | The prompt, the reply text, the full step 6 to 18 outputs and transcripts including every `packet_durable_chars` reading in order and both criteria counts | PASS if the readings travel N0, N0, N1, N2 with N2 at or below the limit and the count stays 5. FAIL if a measurement drops before the child restatement cut, the count changes, a criterion loses its checkable result or the final budget reads other than `ok` | 1. A drop between step 6 and step 10 means an out-of-order cut: the frontmatter and log sit outside the measured slice and cannot move the count. 2. If step 18 still fails `parent-budget`, read the remaining `packet_durable_chars` against the 4000 limit and decide whether the decision prose or the criterion wording still carries repetition. 3. If the count in step 17 differs from step 8, a criterion was removed or merged to fit the budget, which the mode forbids. Split the packet scope instead and escalate |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `agent: run /create:goal $SCRATCH/specs/demo-phase phase-parent :auto and /create:goal $SCRATCH/specs/demo-phase/001-alpha child :auto with a deliberately verbose brief that restates the child goal in the parent body, explains each decision at length and writes the five completion criteria in long wording`
6. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
7. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"`
8. `bash: grep -c '^- \[ \]' "$SCRATCH/specs/demo-phase/goal.md"`
9. `agent: apply cut-order step 1 and step 2 only: trim the goal frontmatter and empty the log below its anchor`
10. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
11. `agent: apply cut-order step 3 only: remove the parent text that restates the child goal`
12. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
13. `agent: apply cut-order step 4 only: shorten the decision prose to the choice a later author must honor`
14. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
15. `agent: apply cut-order step 5 only: shorten criterion wording as needed, keeping every criterion and matching any objective copy to it`
16. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
17. `bash: grep -c '^- \[ \]' "$SCRATCH/specs/demo-phase/goal.md"`
18. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"`
19. `bash: rm -rf "$SCRATCH"`

### Scratch fixture

Step 4 writes these files with these exact bytes:

```markdown
==== $SCRATCH/specs/demo-phase/spec.md ====
# Demo phase packet specification

## Problem and purpose

Two concurrent runs append to counter.txt and the file sometimes ends up with
duplicated or lost lines. The fix is split across one phase that proves the
append behavior.

## Decisions

Counter lines are plain text and append-only.

## Phase documentation map

| Phase | Folder |
|---|---|
| alpha | `001-alpha` |

==== $SCRATCH/specs/demo-phase/acceptance-criteria.md ====
# Acceptance criteria

- [ ] counter.txt grows by exactly one line per run
- [ ] an interleaved run appends after the earlier run line
- [ ] no existing line is rewritten or removed
- [ ] the append order matches run start order
- [ ] the goal check passes for the parent goal

==== $SCRATCH/specs/demo-phase/001-alpha/spec.md ====
# Alpha phase specification

Prove that counter.txt grows by exactly one line per run.

==== $SCRATCH/specs/demo-phase/001-alpha/acceptance-criteria.md ====
# Acceptance criteria

- [ ] one run appends exactly one counter line
- [ ] the appended line records the run identifier
- [ ] the goal check passes for the alpha goal
```

### Expected

Step 5 authors a parent goal whose durable slice is deliberately over the limit and whose five criteria mirror the five acceptance criteria in the fixture. Step 6 reads `packet_budget=over` and records the starting count N0. Step 7 shows the budget as the only failing check, so the goal is otherwise sound and the cut has a clean target. Steps 9 and 10 demonstrate the first two cut-order moves: frontmatter and log are bookkeeping outside the measured slice, so the count stays N0. Step 12 shows the count drop after child restatement is removed, which is the first cut that can move the number. Step 14 shows the second drop from compressing decision prose. Step 16 reaches `packet_budget=ok` after criterion wording is tightened. Steps 17 and 18 prove the criterion count stayed 5 and all four named checks now pass.

### Evidence

Capture the prompt and reply text and the complete outputs of steps 6 to 18 in order, keeping every `packet_durable_chars` reading and both criteria counts. The sequence of readings is the scenario, so a missing intermediate reading makes the run ungradable.

### Pass / Fail

- **Pass**: the budget travels from `over` to `ok` through the documented cut order with the criteria count unchanged at 5 and the final goal check green.
- **Fail**: an early cut moves the measured slice, the criteria count changes between steps 8 and 17, any criterion stops resolving to one observable result or the final budget reads other than `ok`.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. Compare the step 6 and step 10 readings first. They must be identical, because neither the frontmatter nor the log sits in the measured slice. A difference points at a cut applied in the wrong region of the file.
2. If the final reading still exceeds the limit, weigh splitting the packet scope. The mode forbids dropping a criterion to meet the budget and the escalation is the correct outcome rather than a failure to force a fit.
3. If step 17 prints a number other than 5, diff the goal against its earlier state to see which criterion was removed or merged and restore it before rerunning the cut.

### Optional Supplemental Checks

Run the same fixture with the verbose goal but cut in reverse order and confirm the criterion wording degrades before the repetition does, which is the outcome the reference order prevents. Then push the criteria to seven long ones and confirm the count check still passes while the budget cut needs every step of the order.

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
| [`../../references/budget-and-handoff.md`](../../references/budget-and-handoff.md) | The cut order this scenario applies step by step |
| [`../../references/parent-and-nested-goals.md`](../../references/parent-and-nested-goals.md) | The amendment workflow behind the amend operation |
| [`../../../../../hooks/goal/bin/goal.cjs`](../../../../../hooks/goal/bin/goal.cjs) | Packet report source for `packet_budget` and `packet_durable_chars` |
| [`../../../../../hooks/goal/lib/goal-slice.cjs`](../../../../../hooks/goal/lib/goal-slice.cjs) | The durable-slice measurement and the budget states |
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | The `parent-budget` and `criteria-count` checks read in steps 7 and 18 |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/cut-over-budget-parent.md`
