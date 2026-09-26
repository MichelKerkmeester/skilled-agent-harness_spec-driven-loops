---
title: "SCG-006 -- Detect an unbound phase"
description: "This scenario validates the unbound-phase detection for `SCG-006`. It focuses on a phase folder missing from the parent binding table failing the `missing-binding-row` check even when the phase name appears elsewhere in the goal."
stage: routing
version: 1.0.0.0
---

# SCG-006 -- Detect an unbound phase

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-006`.

---

## 1. OVERVIEW

This scenario validates the unbound-phase detection for `SCG-006`. It focuses on a phase folder missing from the parent binding table failing the `missing-binding-row` check even when the phase name appears elsewhere in the goal.

### Why This Matters

The strict validator checks only the targets a binding row names and never proves a row exists for every phase folder, so a phase can vanish from the binding table while the goal still reads as complete. The prose trap is the subtle part. A phase named in the objective or a decision reads like coverage to a skimming reviewer while the binding table stays silent and the evaluator who follows the binding never opens that phase. The check must key on the table rows and on the disk folders rather than on the goal's prose.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-006` and confirm the expected signals without contradictory evidence.

- Objective: prove a phase folder with no binding row fails the `missing-binding-row` check even though the phase name appears elsewhere in the goal
- Real user request: `Check the phase parent goal against its phase folders before I sign it off. I want to know the binding table covers every phase.`
- Prompt: `Before I sign off the phase parent at $SCRATCH/specs/demo-phase, run the goal check and tell me whether the binding table covers every phase folder.`
- Expected execution process: the seeded parent goal binds one of its two phase folders and names the other phase only in its objective prose. The goal check compares the binding rows against the direct phase-child folders and reports the uncovered folder.
- Expected signals: the goal check exits 1 with `FAIL missing-binding-row findings=1` and `RESULT: FAILED (3/4 checks)`, a `FINDING` line reads `no binding-table target row for 002-beta/goal.md`, the other three checks report `PASS <check> findings=0` and a grep for `002-beta` in the goal file prints 1, proving the phase name appears in the goal while no binding row covers it.
- Desired user-visible outcome: the operator learns exactly which phase has no binding row before signing off.
- Pass/fail: PASS if the binding check fails on the uncovered folder with the named finding while the phase name still appears in the goal. FAIL if the check exits 0, the finding names the covered folder or the phase name is absent from the goal so the prose condition is untested.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Before I sign off the phase parent at $SCRATCH/specs/demo-phase, run the goal check and tell me whether the binding table covers every phase folder.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-006 | Detect an unbound phase | Fail the binding check on a phase folder missing from the binding table despite a prose mention | `Before I sign off the phase parent at $SCRATCH/specs/demo-phase, run the goal check and tell me whether the binding table covers every phase folder.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha" "$SCRATCH/specs/demo-phase/002-beta"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"` -> 6. `bash: grep -c '002-beta' "$SCRATCH/specs/demo-phase/goal.md"` -> 7. `bash: rm -rf "$SCRATCH"` | Step 5 exits 1 with `RESULT: FAILED (3/4 checks)`, `FAIL missing-binding-row findings=1` and a `FINDING` line reading `no binding-table target row for 002-beta/goal.md`. `PASS placeholder findings=0`, `PASS criteria-count findings=0` and `PASS parent-budget findings=0` stay green. Step 6 prints 1 and exits 0 | The prompt, the reply text, the full step 5 transcript and the step 6 count | PASS if the binding check fails on `002-beta` with the named finding and step 6 proves the phase name still appears in the goal. FAIL if the check exits 0, the finding names `001-alpha` or step 6 prints 0 | 1. Read the finding detail against the folder listing. The detail names the folder the table misses and the fixture map shows both folders exist. 2. If the check passes, inspect the binding table for a row whose target matches `002-beta` loosely. A target naming a different file does not cover the folder and the set comparison is by folder name. 3. If step 6 prints 0 the prose condition is untested. Confirm the seeded goal still names the phase in its objective before grading the run |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha" "$SCRATCH/specs/demo-phase/002-beta"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-phase --root "$SCRATCH"`
6. `bash: grep -c '002-beta' "$SCRATCH/specs/demo-phase/goal.md"`
7. `bash: rm -rf "$SCRATCH"`

### Scratch fixture

Step 4 writes these files with these exact bytes. The seeded parent goal is a realistic draft with one binding row missing and the unbound phase named in the objective prose.

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

==== $SCRATCH/specs/demo-phase/002-beta/spec.md ====
# Beta phase specification

Prove that an interleaved run appends after the earlier run line.

==== $SCRATCH/specs/demo-phase/goal.md ====
---
title: "Goal: Demo phase packet"
description: "The durable directive for the demo phase packet."
---
# Goal: Demo phase packet

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Land the demo counter across the alpha and beta phases where 002-beta proves interleaving.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Counter lines are plain text and append-only. |

### Operator copy

The operator holds this directive as the session objective. Whenever anything
above the log changes, resend this file's chat slice so the operator can update
their copy.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.**

| Phase | Goal document |
|-------|---------------|
| alpha | `001-alpha/goal.md` |

**Precedence.** Decisions above outrank child detail.

<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Both phase folders hold a goal document
- [ ] The binding table lists every phase folder
- [ ] The parent durable slice stays within budget
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.
<!-- /ANCHOR:log -->
```

### Expected

Step 5 walks the four named checks. The binding check reads the direct phase-child folders `001-alpha` and `002-beta` and the binding table rows, finds only `001-alpha` covered and reports the missing row for `002-beta/goal.md`. The other three checks stay green, so the failure is about row completeness and nothing else. Step 6 prints 1, which is the prose trap the scenario exists for: the goal names `002-beta` in its objective yet the binding table leaves the phase unbound.

### Evidence

Capture the prompt and reply text, the complete step 5 transcript including every per-check line, the `FINDING` line and the `RESULT:` line and the step 6 count. Keep the seeded goal file in the evidence so the objective mention and the binding table can be compared side by side.

### Pass / Fail

- **Pass**: the binding check fails with exactly one finding naming `002-beta/goal.md`, the other three checks pass and the phase name appears in the goal prose.
- **Fail**: the check exits 0, the finding names `001-alpha`, more than the binding check fails without a seeded cause or the phase name is absent from the goal.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. Compare the finding detail against the seeded binding table row by row. The check extracts folder names from the target cells, so a row whose target names another file does not cover `002-beta`.
2. If a second check fails, the seeded goal drifted from the fixture bytes. Rebuild the scratch root so the run measures the binding check alone.
3. If the check passes, look for a binding row added during the run. A workflow that fixes the row before the check has tested the repair path, which belongs in the supplemental check rather than here.

### Optional Supplemental Checks

Add the missing row `| beta | \`002-beta/goal.md\` |` to the binding table and confirm the check goes green with `PASS missing-binding-row findings=0` and exit status 0. Then point the seeded row target at `003-gamma/goal.md` and confirm the check reports two findings naming `001-alpha/goal.md` and `002-beta/goal.md`, which proves the match is by folder name rather than by row count.

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
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | The `missing-binding-row` check and its folder-to-row comparison |
| [`../../references/parent-and-nested-goals.md`](../../references/parent-and-nested-goals.md) | The set-comparison rule the check backs up |
| [`../../SKILL.md`](../../SKILL.md) | The mode rule that no phase child may be omitted from the binding table |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/detect-unbound-phase.md`
