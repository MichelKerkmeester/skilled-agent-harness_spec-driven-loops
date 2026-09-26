---
title: "SCG-003 -- Add goal to a packet without one"
description: "This scenario validates the retrofit operation for `SCG-003`. It focuses on adding a goal file to an existing packet that carries its source documents but no goal and verifying it before handoff."
stage: routing
version: 1.0.0.0
---

# SCG-003 -- Add goal to a packet without one

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-003`.

---

## 1. OVERVIEW

This scenario validates the retrofit operation for `SCG-003`. It focuses on adding a goal file to an existing packet that carries its source documents but no goal and verifying it before handoff.

### Why This Matters

Packets created before goals were kept still need one and the retrofit path is where a hand-copied goal template is most tempting. The mode must render the canonical template through the system-spec-kit renderer rather than typing the structure by hand, because a hand-typed structure drifts from the template the validator and the goal hooks parse. The precondition matters just as much: retrofit is only for a packet with no goal file and running it against a packet that already has one would overwrite authored content.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-003` and confirm the expected signals without contradictory evidence.

- Objective: add a goal to an existing single-folder packet that has none and prove the rendered goal passes every check before handoff
- Real user request: `This packet was created before we kept goals on packets. Add a goal file to it and check it the way you normally would.`
- Prompt: `Add a goal to the existing scratch packet at $SCRATCH/specs/demo-packet with /create:goal retrofit :auto and verify it before handing it over.`
- Expected execution process: the workflow confirms the packet exists with its source documents and no goal file, renders the goal template at the packet's level through the inline renderer and fills objective, decisions and criteria from the packet's own sources. The goal check runs before the handoff.
- Expected signals: the precondition check exits 1 with no goal file present, after the operation the goal file check exits 0, the goal file carries the canonical template marker once, the goal check exits 0 with `RESULT: PASSED (4/4 checks)` and the packet report prints `packet_budget=ok` and `packet_nested=false`.
- Desired user-visible outcome: the packet gains a goal indistinguishable in shape from a goal authored at packet creation time.
- Pass/fail: PASS if the goal file appears only after the retrofit step and every listed signal follows. FAIL if the goal file exists before the operation, the template marker is missing, a check exits non-zero or the budget state reads other than `ok`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a goal to the existing scratch packet at $SCRATCH/specs/demo-packet with /create:goal retrofit :auto and verify it before handing it over.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-003 | Add goal to a packet without one | Retrofit a goal onto an existing packet and verify it before handoff | `Add a goal to the existing scratch packet at $SCRATCH/specs/demo-packet with /create:goal retrofit :auto and verify it before handing it over.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"` -> 6. `agent: run /create:goal $SCRATCH/specs/demo-packet retrofit :auto` -> 7. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"` -> 8. `bash: grep -c 'SPECKIT_TEMPLATE_SOURCE: goal' "$SCRATCH/specs/demo-packet/goal.md"` -> 9. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"` -> 10. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-packet --workspace "$SCRATCH"` -> 11. `bash: rm -rf "$SCRATCH"` | Step 5 exits 1. Step 7 exits 0. Step 8 prints 1 and exits 0. Step 9 exits 0 with `RESULT: PASSED (4/4 checks)` and four `PASS <check> findings=0` lines. Step 10 prints `STATUS=OK ACTION=packet` with `packet_budget=ok` and `packet_nested=false` | The prompt, the reply text, the step 5 and step 7 exit statuses, the step 8 count, the full step 9 transcript and the full step 10 output | PASS if the goal file is absent at step 5 and present at step 7 with the canonical marker and all listed signals follow. FAIL if the goal exists before the operation, the marker count differs from 1, a check exits non-zero or the budget reads other than `ok` | 1. If step 5 exits 0, the fixture already carried a goal file and the scenario tested overwrite instead of retrofit. Rebuild the scratch root. 2. If step 8 prints 0, the goal structure was typed by hand instead of rendered from the canonical template. 3. Read the step 9 `FINDING` lines before touching the goal, because each names the section that still needs work |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"`
6. `agent: run /create:goal $SCRATCH/specs/demo-packet retrofit :auto`
7. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"`
8. `bash: grep -c 'SPECKIT_TEMPLATE_SOURCE: goal' "$SCRATCH/specs/demo-packet/goal.md"`
9. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"`
10. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-packet --workspace "$SCRATCH"`
11. `bash: rm -rf "$SCRATCH"`

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

Step 5 exits 1 because the fixture packet carries its source documents and no goal file. Step 6 runs the retrofit operation, which the mode treats as its own operation and which renders the goal through the system-spec-kit inline renderer at the packet's level before filling it. Step 7 confirms the file landed at the exact packet path. Step 8 reads the canonical template marker, which is the signal that the rendered structure was reused rather than typed. Steps 9 and 10 prove the result before handoff: all four named checks pass and the packet report shows a within-budget, non-nested goal.

### Evidence

Capture the prompt and reply text, the step 5 exit status, the step 7 exit status, the step 8 count, the complete step 9 transcript and the complete step 10 output. The pair of step 5 and step 7 readings is the retrofit proof, so record both.

### Pass / Fail

- **Pass**: the goal file is absent before the operation and present after it with the canonical template marker, the goal check exits 0 with `RESULT: PASSED (4/4 checks)` and the packet report shows `packet_budget=ok` and `packet_nested=false`.
- **Fail**: the goal file pre-exists, the marker count differs from 1, a check exits non-zero or the budget state reads other than `ok`.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. If step 5 exits 0 the fixture was not clean and the scenario measured the wrong operation. Rebuild the scratch root and rerun from step 1.
2. If step 8 prints 0 the goal was typed rather than rendered. Compare the goal file structure against the canonical goal template and route the defect to the rendering step of the workflow.
3. If step 9 fails, read each `FINDING` line in turn. The four checks separate template text, criteria count, binding rows and budget, so the detail names where the retrofit stopped short.

### Optional Supplemental Checks

Run the retrofit command a second time against the same packet and confirm the mode refuses or revises rather than overwriting the authored goal blindly. Then run the retrofit against a phase parent with one child and confirm the binding row for the child appears in the retrofitted parent goal.

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
| [`../../references/parent-and-nested-goals.md`](../../references/parent-and-nested-goals.md) | The retrofit workflow with the renderer command |
| [`../../../../system-spec-kit/templates/addons/goal.md.tmpl`](../../../../system-spec-kit/templates/addons/goal.md.tmpl) | The canonical template whose marker step 8 reads |
| [`../../../../system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh`](../../../../system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh) | The renderer the retrofit path calls instead of hand-typing structure |
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | The four named checks read in step 9 |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/add-goal-to-packet-without-goal.md`
