---
title: "SCG-005 -- Refuse a leftover placeholder"
description: "This scenario validates the placeholder refusal for `SCG-005`. It focuses on a template placeholder left in a goal decision failing the goal check on the `placeholder` check with no chat slice handed off."
stage: routing
version: 1.0.0.0
---

# SCG-005 -- Refuse a leftover placeholder

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-005`.

---

## 1. OVERVIEW

This scenario validates the placeholder refusal for `SCG-005`. It focuses on a template placeholder left in a goal decision failing the goal check on the `placeholder` check with no chat slice handed off.

### Why This Matters

A new goal starts as template text and only becomes a goal when every slot is filled. Template text handed to an operator reads like a decision while committing to nothing and once it sits in the objective copy it judges completion for the life of the packet. The handoff boundary is the other half of the test: the mode runs the check before it prints the chat slice, so a leftover placeholder must stop the handoff rather than ride along with it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-005` and confirm the expected signals without contradictory evidence.

- Objective: prove a leftover template placeholder fails the goal check on the `placeholder` check and blocks the handoff
- Real user request: `Write the demo packet goal. I still have not decided how the counter should update so leave that decision open for now.`
- Prompt: `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet so leave that decision as the template placeholder.`
- Expected execution process: the goal is authored with the decision row left as the template placeholder text. The goal check runs before any handoff and its placeholder check reports the unfilled slot. The run stops at the failed check and no chat slice is printed.
- Expected signals: the goal check exits 1 with `FAIL placeholder findings=1` and `RESULT: FAILED (3/4 checks)`, a `FINDING` line reads `decision table contains unfilled template text`, the other three checks report `PASS <check> findings=0` and the transcript contains no `chat_slice` field after the failed check.
- Desired user-visible outcome: the author is told the goal is not ready and which section still carries template text.
- Pass/fail: PASS if the placeholder check fails with the named finding and nothing is handed off. FAIL if the check exits 0, the finding names a different slot without the seeded one being reported or a chat slice is printed while the finding stands.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet so leave that decision as the template placeholder.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-005 | Refuse a leftover placeholder | Fail the goal check on a seeded template placeholder and block the handoff | `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet so leave that decision as the template placeholder.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `agent: run /create:goal $SCRATCH/specs/demo-packet top-level :auto with the brief to leave the counter update rule decision as the template placeholder text` -> 6. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"` -> 7. `bash: rm -rf "$SCRATCH"` | Step 6 exits 1 with `RESULT: FAILED (3/4 checks)`, `FAIL placeholder findings=1` and a `FINDING` line reading `decision table contains unfilled template text`. `PASS missing-binding-row findings=0`, `PASS criteria-count findings=0` and `PASS parent-budget findings=0` stay green. No `chat_slice` field appears in the transcript after step 6 | The prompt, the reply text, the full step 6 transcript and the transcript tail after step 6 showing no chat slice | PASS if the placeholder check fails with the named finding and the run stops without a handoff. FAIL if step 6 exits 0, the finding is absent, the seeded slot is not the one reported or a chat slice is printed while the finding stands | 1. Read the `FINDING` detail to see which slot still holds template text and compare it against the seeded decision row. 2. If the check exits 0, confirm the seeded goal file still contains the literal placeholder text, because a run that filled the slot tested a different scenario. 3. If a chat slice printed after the failed check, the handoff ran before the check result was read and the boundary defect is the finding regardless of the goal content |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `agent: run /create:goal $SCRATCH/specs/demo-packet top-level :auto with the brief to leave the counter update rule decision as the template placeholder text`
6. `bash: node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root "$SCRATCH"`
7. `bash: rm -rf "$SCRATCH"`

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

The decision row that step 5 seeds is the goal template's own placeholder text:

```text
| D1 | [The decision, stated so a reader can tell whether work honors it] |
```

### Expected

Step 6 is the whole scenario. The goal check walks the four named checks and the placeholder check reports the unfilled decision row with the detail `decision table contains unfilled template text`. The other three checks stay green, so the finding is about template text and nothing else. Because the mode runs the check before any handoff, the run stops at the failed check and the transcript ends without a `chat_slice` field.

### Evidence

Capture the prompt and reply text, the complete step 6 transcript including the per-check lines, the `FINDING` line and the `RESULT:` line and the transcript tail after step 6 to show no chat slice was printed. Keep the goal file's decision row in the evidence so the seeded placeholder can be compared against the reported finding.

### Pass / Fail

- **Pass**: the goal check exits 1 with `FAIL placeholder findings=1`, the finding names the seeded decision row and no chat slice is printed.
- **Fail**: the check exits 0, the finding is missing or names an unseeded slot without the seeded one being reported or a handoff happens while the finding stands.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. Compare the finding detail against the goal file section by section. The check reads the objective, the decision table and the criteria separately and the detail names the section.
2. If no finding appears, check whether the authored goal still holds the literal placeholder text. A run that completed the decision produced a passing goal and no longer tests the refusal.
3. A chat slice printed after a failed check is its own defect. Route it to the handoff ordering in the mode contract, which requires the check to resolve before any handoff.

### Optional Supplemental Checks

Seed the objective placeholder `[One sentence. What this packet is for. Not how, not progress.]` and confirm the finding detail reads `objective contains unfilled template text`. Then seed a criterion placeholder and confirm the detail reads `completion criterion contains unfilled template text`. Finally fill every slot and confirm the run proceeds to a green check and a handoff, which proves the gate blocks only on real findings.

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
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | The `placeholder` check and its three finding details |
| [`../../../../system-spec-kit/templates/addons/goal.md.tmpl`](../../../../system-spec-kit/templates/addons/goal.md.tmpl) | The template whose placeholder text step 5 seeds |
| [`../../SKILL.md`](../../SKILL.md) | The rule that the check runs and resolves before any handoff |
| [`../../references/authoring-standards.md`](../../references/authoring-standards.md) | The objective and decision reader checks the filled goal is held to |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/refuse-leftover-placeholder.md`
