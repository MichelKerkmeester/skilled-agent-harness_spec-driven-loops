---
title: "SCG-007 -- Route a session goal away"
description: "This scenario validates the session-goal route-away for `SCG-007`. It focuses on a set-or-resend session objective request being redirected to the goal hooks with no goal file written and no session state touched."
stage: negative
version: 1.0.0.0
---

# SCG-007 -- Route a session goal away

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SCG-007`.

---

## 1. OVERVIEW

This scenario validates the session-goal route-away for `SCG-007`. It focuses on a set-or-resend session objective request being redirected to the goal hooks with no goal file written and no session state touched.

### Why This Matters

The mode authors packet files and nothing else. Session objectives live with the goal hooks and the host goal commands and a mode that answers a session request by writing a packet goal has crossed the boundary in the worst direction: the operator asked for a session change and received a file they never wanted. This is the one scenario where writing nothing is the passing outcome and the untouched filesystem is the evidence that matters.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-007` and confirm the expected signals without contradictory evidence.

- Objective: prove a session-objective request does not route to packet-goal authoring and leaves the packet and session state untouched
- Real user request: `Set the goal for $SCRATCH/specs/demo-packet to ship the demo counter this week and resend it so this session picks it up.`
- Prompt: `Set the goal for $SCRATCH/specs/demo-packet to ship the demo counter this week and resend it so this session picks it up.`
- Expected execution process: the request is classified as session-state work rather than file work. The reply redirects the operator to the goal hooks or the host goal command and no packet file is authored or revised.
- Expected signals: the reply names the goal hooks surface or a host goal command as the owner of session objectives, the goal file check exits 1 before and after the request, the session state directory check exits 1 and the packet report prints `STATUS=FAIL ACTION=packet` with `code=PACKET_GOAL_NOT_FOUND`.
- Desired user-visible outcome: the user learns where session objectives belong and sees the mode keep its file boundary.
- Pass/fail: PASS if the redirect names the goal hooks or a host goal command and the filesystem stays untouched. FAIL if a goal file appears, session state is written or the reply claims the session objective was set.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Set the goal for $SCRATCH/specs/demo-packet to ship the demo counter this week and resend it so this session picks it up.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-007 | Route a session goal away | Redirect a session-objective request without authoring a packet goal | `Set the goal for $SCRATCH/specs/demo-packet to ship the demo counter this week and resend it so this session picks it up.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)` -> 2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"` -> 3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"` -> 4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given` -> 5. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"` -> 6. `agent: send the exact prompt to the orchestrator and capture the reply verbatim` -> 7. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"` -> 8. `bash: test -d "$SCRATCH/.skilled/skills/.state/goal"` -> 9. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-packet --workspace "$SCRATCH"` -> 10. `bash: rm -rf "$SCRATCH"` | Step 5 exits 1. The reply names the goal hooks surface at `.skilled/hooks/goal/` or a host goal command as the owner of session objectives. Step 7 exits 1. Step 8 exits 1. Step 9 prints `STATUS=FAIL ACTION=packet` with `code=PACKET_GOAL_NOT_FOUND` | The prompt, the reply text captured in full, the step 5, step 7 and step 8 exit statuses and the full step 9 output | PASS if the redirect names the goal hooks or a host goal command and steps 5, 7, 8 and 9 prove the packet and session state are untouched. FAIL if a goal file exists at step 7, the state directory exists at step 8 or the reply claims the session objective was set | 1. Read the reply before the filesystem checks. A reply that promises a session objective has failed the boundary even if no file appeared. 2. If step 7 exits 0, inspect the goal file's content to see whether the run authored a packet goal for a session request and remove the file only after recording the evidence. 3. If step 8 exits 0, a bind happened through the goal hooks during the run and the mode boundary leak is the finding |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/create-goal-playbook.XXXXXX)`
2. `bash: mkdir -p "$SCRATCH/.skilled/skills/system-spec-kit/templates" "$SCRATCH/specs/demo-packet"`
3. `bash: cp .skilled/skills/system-spec-kit/templates/spec-kit-docs.json "$SCRATCH/.skilled/skills/system-spec-kit/templates/spec-kit-docs.json"`
4. `agent: write the Scratch fixture files below into $SCRATCH exactly as given`
5. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"`
6. `agent: send the exact prompt to the orchestrator and capture the reply verbatim`
7. `bash: test -f "$SCRATCH/specs/demo-packet/goal.md"`
8. `bash: test -d "$SCRATCH/.skilled/skills/.state/goal"`
9. `bash: node .skilled/hooks/goal/bin/goal.cjs packet specs/demo-packet --workspace "$SCRATCH"`
10. `bash: rm -rf "$SCRATCH"`

### Scratch fixture

Step 4 writes these two files with these exact bytes. The fixture packet deliberately carries its source documents and no goal file, so any goal file that appears came from the run.

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

Step 6 is the classification point. The request says set the goal and resend it, which is session-objective language rather than goal-file language and the mode contract sends such a request to the goal hooks or the host's native goal command. Steps 5 and 7 both exit 1, so the packet carried no goal file before the request and gained none from it. Step 8 exits 1, so no session state directory was created and nothing was bound. Step 9 confirms the packet report reads `PACKET_GOAL_NOT_FOUND`, which is the goal hooks reporting the same untouched filesystem from their side.

### Evidence

Capture the prompt and the reply text in full, the step 5, step 7 and step 8 exit statuses and the complete step 9 output. The reply is the routing evidence and the exit statuses are the boundary evidence, so the run needs both.

### Pass / Fail

- **Pass**: the reply redirects the request to the goal hooks or a host goal command and no goal file or session state appears.
- **Fail**: a goal file exists at step 7, the state directory exists at step 8 or the reply claims the session objective was set or resent.
- **SKIP**: only with a specific sandbox blocker, such as `mktemp` or Node being unavailable in the run environment.

### Failure Triage

1. Grade the reply first. The correct redirect names the goal hooks surface or a host goal command and leaves the session change to the operator, while a reply that performs the session change has crossed the boundary.
2. A goal file at step 7 is a boundary defect regardless of its quality. Record the file content as evidence before removing it with the scratch root.
3. A state directory at step 8 means a bind ran through the goal hooks during the scenario. Record which step created it and route the defect to the mode's session-state rule, which forbids binding from goal-file work.

### Optional Supplemental Checks

Run the resend variant with the prompt `Resend the goal so this session picks up the latest copy.` and confirm the same redirect and the same untouched filesystem. Then run a genuine goal-file request against the same fixture and confirm the mode does author a goal, which proves the route discriminates between the two request kinds rather than refusing everything that mentions a goal.

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
| [`../../SKILL.md`](../../SKILL.md) | The session-state boundary and the redirect rule in the routing decisions |
| [`../../../../../hooks/goal/bin/goal.cjs`](../../../../../hooks/goal/bin/goal.cjs) | The packet report whose `PACKET_GOAL_NOT_FOUND` code step 9 reads |
| [`../../../../../hooks/goal/lib/goal-slice.cjs`](../../../../../hooks/goal/lib/goal-slice.cjs) | The workspace containment rule behind the packet report |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/route-session-goal-away.md`
