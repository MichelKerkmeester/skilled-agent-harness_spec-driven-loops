---
title: "SCG-008 -- Resend the parent after a child change"
description: "This scenario validates the parent-first amendment and resend for `SCG-008`. It focuses on a child change that alters a parent decision amending the parent first and then printing the parent chat slice for the operator to resend."
stage: routing
version: 1.0.0.0
---

# SCG-008 -- Resend the parent after a child change

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-008`.

---

## 1. OVERVIEW

This scenario validates the parent-first amendment and resend for `SCG-008`. It focuses on a child change that alters a parent decision amending the parent first and then printing the parent chat slice for the operator to resend.

### Why This Matters

Parent decisions bind every phase and a child goal never overrides one. When a child change contradicts a parent decision the order of edits decides which text is authoritative for a while and amending the child first leaves the packet contradicting itself mid-run. The resend is the second half: the operator holds a copy of the parent directive as the session objective and that copy goes stale the moment the parent changes, so the mode prints the fresh chat slice and leaves the resend to the operator. The mode never touches session state itself.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-008` and confirm the expected signals without contradictory evidence.

- Objective: prove a child change that alters a parent decision amends the parent first and then prints the parent chat slice for the operator to resend
- Real user request: `The alpha phase changed and counter lines now carry a checksum. Make the goals agree again and give me what I need to resend.`
- Prompt: `The alpha phase now appends counter lines with a checksum instead of plain text. Update the goals under $SCRATCH/specs/demo-phase so the parent decision and the child goal agree and print the parent chat slice for me to resend.`
- Expected execution process: the phase parent and child goals exist first and the parent report records the starting slice hash. The change request alters the child and the parent decision it contradicts. The parent goal is amended before the child goal is touched and the packet report prints the updated chat slice afterwards.
- Expected signals: the first parent report prints `packet_slice_hash=H1` and `packet_budget=ok`, the parent goal edit step precedes the child goal edit step in the transcript, a grep for `checksum` in the parent goal exits 0, the final parent report prints `packet_slice_hash=H2` with H2 different from H1 and a `chat_slice` value carrying the amended decision text and `packet_budget=ok`, and the session state directory check exits 1.
- Desired user-visible outcome: the operator receives an up-to-date parent chat slice to resend as the session objective.
- Pass/fail: PASS if the parent is amended first and the printed chat slice carries the amended decision with no session state touched. FAIL if the child is amended before the parent, the slice hash does not change, the chat slice lacks the amended decision or any session state appears.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The alpha phase now appends counter lines with a checksum instead of plain text. Update the goals under $SCRATCH/specs/demo-phase so the parent decision and the child goal agree and print the parent chat slice for me to resend.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-008 | Resend the parent after a child change | Amend the parent first after a child change and print the parent chat slice | `The alpha phase now appends counter lines with a checksum instead of plain text. Update the goals under $SCRATCH/specs/demo-phase so the parent decision and the child goal agree and print the parent chat slice for me to resend.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `agent: run /create:goal $SCRATCH/specs/demo-phase phase-parent :auto` -> 6. `agent: run /create:goal $SCRATCH/specs/demo-phase/001-alpha child :auto` -> 7. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 8. `agent: run /create:goal $SCRATCH/specs/demo-phase/001-alpha amend :auto for the requested change, amending the parent goal decision first and the child goal second` -> 9. `bash: grep -c 'checksum' "$SCRATCH/specs/demo-phase/goal.md"` -> 10. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"` -> 11. `bash: test -d "$SCRATCH/.skilled/skills/.state/goal"` -> 12. `bash: rm -rf "$SCRATCH"` | Step 7 prints `packet_slice_hash=H1` and `packet_budget=ok`. The step 8 transcript shows the parent goal edit before the child goal edit. Step 9 prints a positive count and exits 0. Step 10 prints `packet_slice_hash=H2` with H2 different from H1, a `chat_slice` value carrying the amended decision text and `packet_budget=ok`. Step 11 exits 1 | The prompt, the reply text, the full step 7 and step 10 outputs with the named fields, the step 8 transcript showing the edit order, the step 9 exit status and the step 11 exit status | PASS if the parent edit precedes the child edit, the slice hash changes, the chat slice carries the amended decision and the filesystem shows no session state. FAIL if the order reverses, H2 equals H1, the chat slice lacks the amended decision or step 11 exits 0 | 1. Compare the step 8 transcript order first. A child edit before the parent amendment leaves the packet contradicting itself and is the defect even when the final state looks right. 2. If H2 equals H1 the parent durable slice never changed, so the parent decision was left stale while the child moved. 3. If step 11 exits 0, something bound a session during the run. The mode prints `chat_slice` and stops. The resend is the operator's act |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-phase/001-alpha"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `agent: run /create:goal $SCRATCH/specs/demo-phase phase-parent :auto`
6. `agent: run /create:goal $SCRATCH/specs/demo-phase/001-alpha child :auto`
7. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
8. `agent: run /create:goal $SCRATCH/specs/demo-phase/001-alpha amend :auto for the requested change, amending the parent goal decision first and the child goal second`
9. `bash: grep -c 'checksum' "$SCRATCH/specs/demo-phase/goal.md"`
10. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-phase --workspace "$SCRATCH"`
11. `bash: test -d "$SCRATCH/.skilled/skills/.state/goal"`
12. `bash: rm -rf "$SCRATCH"`

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
- [ ] the parent durable slice stays within budget

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

Steps 5 and 6 author the parent and child goals from the fixture and the parent decision freezes the plain-text choice the change request later contradicts. Step 7 records the starting slice hash H1 for the comparison. Step 8 is the amendment: the change alters the child phase and the parent decision it contradicts, so the parent goal is amended first and the child goal follows. Step 9 confirms the amended decision reached the parent goal. Step 10 prints the updated report where the changed slice hash proves the parent moved and the `chat_slice` carries the amended decision text the operator needs to resend. Step 11 exits 1, so nothing was bound and the resend stays with the operator.

### Evidence

Capture the prompt and reply text, the complete step 7 and step 10 outputs with the named fields kept in full, the step 8 transcript showing the parent edit before the child edit and the step 9 and step 11 exit statuses. The pair of slice hashes is the change proof, so record both readings.

### Pass / Fail

- **Pass**: the parent goal is amended before the child goal, the slice hash changes from H1 to H2, the printed chat slice carries the amended decision and no session state exists.
- **Fail**: the child is amended first, the slice hash is unchanged, the chat slice lacks the amended decision or the session state directory appears.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. Read the step 8 transcript order before the final state. A run that fixes both files but touches the child first has violated the amendment order the mode requires.
2. If the slice hash is unchanged, check whether the edit landed below the log anchor. Log changes never move the durable slice and never require a resend.
3. If step 11 exits 0, identify which step created the state directory. The mode prints the chat slice and stops, so any bind is a boundary leak rather than part of the handoff.

### Optional Supplemental Checks

Make a change contained within one child phase, such as a child criterion rewording and confirm the parent hash stays unchanged and no resend is required. Then alter a parent criterion and confirm the hash changes and the printed chat slice shows the amended criterion, which proves the resend trigger is any change above the log anchor.

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
| [`../../references/parent-and-nested-goals.md`](../../references/parent-and-nested-goals.md) | The precedence and amendment workflow with the parent-first rule |
| [`../../references/budget-and-handoff.md`](../../references/budget-and-handoff.md) | The chat-slice handoff and the boundary the mode stops at |
| [`../../../../../hooks/goal/bin/goal.cjs`](../../../../../hooks/goal/bin/goal.cjs) | Packet report source for `packet_slice_hash` and `chat_slice` |
| [`../../SKILL.md`](../../SKILL.md) | The rule that the mode prints the slice and never touches session state |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-008
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/resend-parent-after-child-change.md`
