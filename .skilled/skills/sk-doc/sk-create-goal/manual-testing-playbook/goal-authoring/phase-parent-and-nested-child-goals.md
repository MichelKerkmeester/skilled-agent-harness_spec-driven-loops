---
title: "SCG-002 -- Phase parent and nested child goals"
description: "This scenario validates the phase parent and nested child goals for `SCG-002`. It focuses on one binding row per phase folder plus one child goal per phase folder with the binding set equal to the folder set by name."
stage: routing
version: 1.0.0.0
---

# SCG-002 -- Phase parent and nested child goals

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-002`.

---

## 1. OVERVIEW

This scenario validates the phase parent and nested child goals for `SCG-002`. It focuses on one binding row per phase folder plus one child goal per phase folder with the binding set equal to the folder set by name.

### Why This Matters

A phase parent's binding table is the contract that lets an evaluator read one child goal at a time and still trust the whole packet. The strict validator checks only the targets a row names and never proves a row exists for every folder, so the set comparison is the mode's own required check. The children carry the mirror rule: a child goal keeps its criteria phase-local and holds no binding section of its own, because two binding tables for one phase structure is how a packet ends up with two owners.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-002` and confirm the expected signals without contradictory evidence.

- Objective: author a phase-parent goal with one binding row per phase folder and one child goal per phase folder and prove all three goals pass their checks
- Real user request: `My demo phase packet has two phase folders and no goals yet. Write the parent goal and a goal for each child so the bindings match the folders.`
- Prompt: `Author the goals for the scratch phase packet at $SCRATCH/specs/demo-phase with /create:goal :auto: one phase-parent goal and one child goal per phase folder, then run the goal check on the parent and on each child.`
- Expected execution process: the workflow compares the fixture phase map with the direct child directories before writing, fills the parent goal from the phase-parent template with one binding row per child and fills each child goal from the phase-child template with no binding anchor. The goal check runs on the parent and on each child.
- Expected signals: the folder listing reads `001-alpha` and `002-beta`, the parent goal contains one binding anchor and one target row each naming `001-alpha/goal.md` and `002-beta/goal.md`, each child goal grep for the binding anchor prints 0 and exits 1, the parent check exits 0 with `RESULT: PASSED (4/4 checks)` and `PASS missing-binding-row findings=0`, each child check exits 0 with `RESULT: PASSED (4/4 checks)` and `PASS parent-budget findings=0`, the parent report prints `packet_nested=true` and `packet_budget=ok` and the child report prints `packet_nested=false` and `packet_budget=unknown`.
- Desired user-visible outcome: the operator sees one parent goal bound to every phase folder and one passing goal check per goal.
- Pass/fail: PASS if the binding set equals the folder set by name and every listed signal appears. FAIL if a folder lacks a binding row, a row names a folder that does not exist, a child goal carries a binding anchor or any check exits non-zero.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author the goals for the scratch phase packet at $SCRATCH/specs/demo-phase with /create:goal :auto: one phase-parent goal and one child goal per phase folder, then run the goal check on the parent and on each child.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-002 | Phase parent and nested child goals | Bind one parent goal row per phase folder and one child goal per folder | `Author the goals for the scratch phase packet at $SCRATCH/specs/demo-phase with /create:goal :auto: one phase-parent goal and one child goal per phase folder, then run the goal check on the parent and on each child.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha" "$SCRATCH/specs/demo-phase/002-beta"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `agent: run /create:goal $SCRATCH/specs/demo-phase phase-parent :auto` -> 6. `agent: run /create:goal $SCRATCH/specs/demo-phase/001-alpha child :auto` -> 7. `agent: run /create:goal $SCRATCH/specs/demo-phase/002-beta child :auto` -> 8. `bash: find "$SCRATCH/specs/demo-phase" -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' -print \| sort` -> 9. `bash: grep -c '<!-- ANCHOR:binding -->' "$SCRATCH/specs/demo-phase/goal.md"` -> 10. `bash: grep -c '001-alpha/goal.md' "$SCRATCH/specs/demo-phase/goal.md"` -> 11. `bash: grep -c '002-beta/goal.md' "$SCRATCH/specs/demo-phase/goal.md"` -> 12. `bash: grep -c '<!-- ANCHOR:binding -->' "$SCRATCH/specs/demo-phase/001-alpha/goal.md"` -> 13. `bash: grep -c '<!-- ANCHOR:binding -->' "$SCRATCH/specs/demo-phase/002-beta/goal.md"` -> 14. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"` -> 15. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase/001-alpha --root "$SCRATCH"` -> 16. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase/002-beta --root "$SCRATCH"` -> 17. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 18. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase/001-alpha --workspace "$SCRATCH"` -> 19. `bash: rm -rf "$SCRATCH"` | Step 8 lists `001-alpha` and `002-beta`. Step 9 prints 1 and exits 0. Steps 10 and 11 each print 1. Steps 12 and 13 each print 0 and exit 1. Steps 14 to 16 each exit 0 with `RESULT: PASSED (4/4 checks)` and step 14 shows `PASS missing-binding-row findings=0` while steps 15 and 16 show `PASS parent-budget findings=0`. Step 17 prints `packet_nested=true` and `packet_budget=ok`. Step 18 prints `packet_nested=false` and `packet_budget=unknown` | The prompt, the reply text, the step 8 listing, the step 9 to 13 counts with their exit statuses, the full step 14 to 16 transcripts and the full step 17 and 18 outputs | PASS if the step 8 names equal the binding targets from steps 10 and 11 and every listed signal appears. FAIL if any folder lacks a row, a child carries a binding anchor, a check exits non-zero or a report field reads differently | 1. When step 14 shows a `missing-binding-row` finding, read the folder name in the finding detail and compare it against the step 8 listing to see which side missed the phase. 2. If steps 12 or 13 print 1, a child goal carries a binding anchor and the phase structure has two owners. 3. If steps 17 or 18 print `packet_budget=unknown` for the parent, the manifest copy from step 3 is missing. For the child the same reading is correct and expected because a phase child is exempt from the cap |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha" "$SCRATCH/specs/demo-phase/002-beta"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `agent: run /create:goal $SCRATCH/specs/demo-phase phase-parent :auto`
6. `agent: run /create:goal $SCRATCH/specs/demo-phase/001-alpha child :auto`
7. `agent: run /create:goal $SCRATCH/specs/demo-phase/002-beta child :auto`
8. `bash: find "$SCRATCH/specs/demo-phase" -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' -print | sort`
9. `bash: grep -c '<!-- ANCHOR:binding -->' "$SCRATCH/specs/demo-phase/goal.md"`
10. `bash: grep -c '001-alpha/goal.md' "$SCRATCH/specs/demo-phase/goal.md"`
11. `bash: grep -c '002-beta/goal.md' "$SCRATCH/specs/demo-phase/goal.md"`
12. `bash: grep -c '<!-- ANCHOR:binding -->' "$SCRATCH/specs/demo-phase/001-alpha/goal.md"`
13. `bash: grep -c '<!-- ANCHOR:binding -->' "$SCRATCH/specs/demo-phase/002-beta/goal.md"`
14. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"`
15. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase/001-alpha --root "$SCRATCH"`
16. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase/002-beta --root "$SCRATCH"`
17. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
18. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase/001-alpha --workspace "$SCRATCH"`
19. `bash: rm -rf "$SCRATCH"`

### Scratch fixture

Step 4 writes these files with these exact bytes:

```markdown
==== $SCRATCH/specs/demo-phase/spec.md ====
# Demo phase packet specification

## Problem and purpose

Two concurrent runs append to counter.txt and the file sometimes ends up with
duplicated or lost lines. The fix is split across two phases.

## Decisions

Counter lines are plain text and append-only.

## Phase documentation map

| Phase | Folder |
|---|---|
| alpha | `001-alpha` |
| beta | `002-beta` |

==== $SCRATCH/specs/demo-phase/acceptance-criteria.md ====
# Acceptance criteria

- [ ] both phase folders hold a goal document
- [ ] the binding table lists every phase folder
- [ ] the parent durable slice stays within budget

==== $SCRATCH/specs/demo-phase/001-alpha/spec.md ====
# Alpha phase specification

Prove that counter.txt grows by exactly one line per run.

==== $SCRATCH/specs/demo-phase/001-alpha/acceptance-criteria.md ====
# Acceptance criteria

- [ ] one run appends exactly one counter line
- [ ] the appended line records the run identifier
- [ ] the goal check passes for the alpha goal

==== $SCRATCH/specs/demo-phase/002-beta/spec.md ====
# Beta phase specification

Prove that an interleaved run appends after the earlier run line.

==== $SCRATCH/specs/demo-phase/002-beta/acceptance-criteria.md ====
# Acceptance criteria

- [ ] two interleaved runs keep both lines
- [ ] the later run line follows the earlier run line
- [ ] the goal check passes for the beta goal
```

### Expected

Steps 5 to 7 author three goals. Step 8 proves the folder side of the comparison reads `001-alpha` and `002-beta`. Steps 9 to 11 prove the binding side: one anchor and one target row per folder, so the two name sets are equal. Steps 12 and 13 print 0 and exit 1, which is the expected reading for a child goal with no binding anchor and proves no second binding table exists. Steps 14 to 16 show all four named checks green on each goal, with `missing-binding-row` covering the parent's row completeness and `parent-budget` green on the children because a phase child is exempt from the durable cap. Steps 17 and 18 read the packet reports: the parent is nested and within budget while the child reports `packet_budget=unknown` because no budget applies to it.

### Evidence

Capture the prompt and reply text, the step 8 listing, the step 9 to 13 counts with their exit statuses, the complete step 14 to 16 transcripts and the complete step 17 and 18 outputs with the named fields. The comparison between the step 8 names and the binding targets is the point of the scenario, so keep both readings in full.

### Pass / Fail

- **Pass**: the binding set equals the folder set by name, one binding anchor exists in the parent and none in the children, all three goal checks pass and the report fields read as listed.
- **Fail**: a folder has no binding row, a row names a folder that is absent, a child goal carries a binding anchor, any check exits non-zero or the parent budget state reads other than `ok`.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. Read the step 14 `FINDING` line first. The `missing-binding-row` detail names the exact folder missing from the table and the step 8 listing shows whether the folder or the row is at fault.
2. A child grep in step 12 or 13 that prints 1 means a binding anchor leaked into a child goal. The mode rule keeps the binding table only in the phase parent.
3. A `packet_budget=unknown` reading on the parent points at the manifest copy from step 3. The same reading on a child is correct, because a phase child is exempt and the goal hooks report it as unknown.

### Optional Supplemental Checks

Delete the `002-beta` row from the parent goal and confirm the parent check fails with exactly one `missing-binding-row` finding naming `002-beta/goal.md`. Then add a third folder `003-gamma` with a spec file and no row and confirm the check names it as well, which proves the check reads the disk set rather than the fixture map.

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
| [`../../references/parent-and-nested-goals.md`](../../references/parent-and-nested-goals.md) | The phase-parent and nested-child workflows with the set-comparison check |
| [`../../SKILL.md`](../../SKILL.md) | Mode rule that the binding table lives only in the phase parent |
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | The `missing-binding-row` and `parent-budget` checks read in steps 14 to 16 |
| [`../../../../../hooks/goal/bin/goal.cjs`](../../../../../hooks/goal/bin/goal.cjs) | Packet report source for `packet_nested` and `packet_budget` |
| [`../../../../../hooks/goal/lib/goal-slice.cjs`](../../../../../hooks/goal/lib/goal-slice.cjs) | Budget applicability rule that exempts phase children |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/phase-parent-and-nested-child-goals.md`
