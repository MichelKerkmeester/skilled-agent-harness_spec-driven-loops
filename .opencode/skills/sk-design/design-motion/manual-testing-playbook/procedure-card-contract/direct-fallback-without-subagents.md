---
title: Motion Direct Fallback Without Subagents Scenario
description: Manual scenario verifying motion direct fallback preserves proof and read-only tool boundaries.
trigger_phrases:
  - "test motion direct fallback"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: DIRECT_FALLBACK
expected_resources:
  - SKILL.md
  - procedures/interaction-states-pass.md
---

**Exact prompt**

```text
Subagents are unavailable. motion: define the interaction-state matrix directly in this session and show the selected card, context basis, proof line, and read-only boundary.
```

# MOTION-PROCCARD-003 | Motion Direct Fallback Without Subagents

## 1. OVERVIEW

This scenario validates direct execution for motion when subagents are unavailable.

## 2. SCENARIO CONTRACT

- Objective: Confirm motion runs in the current session with Read/Glob/Grep only and preserves selected-card, context, and proof requirements.
- Real user request: `Subagents are unavailable, but I need a motion-state matrix.`
- Prompt: `Subagents are unavailable. motion: define the interaction-state matrix directly in this session and show the selected card, context basis, proof line, and read-only boundary.`
- Expected execution process: No Task dispatch; select `procedures/interaction-states-pass.md`; record target interaction, affected states, existing animation system, motion budget, reduced-motion bar, performance constraints, timing/easing decisions, and verification risks.
- Expected signals: Direct execution, no Write/Edit/Bash/Task, proof before ready/handoff claim.
- Desired user-visible outcome: Motion state guidance with equivalent proof to delegated execution.
- Pass/fail: PASS if direct fallback preserves proof and read-only boundary; FAIL if proof is skipped or mutating tools are used.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-PROCCARD-003 | Motion direct fallback | Confirm no-subagent path keeps proof bar | `Subagents are unavailable. motion: define the interaction-state matrix directly in this session and show the selected card, context basis, proof line, and read-only boundary.` | grep direct fallback in `SKILL.md` -> agent: run prompt -> inspect tool calls and proof order | No Task dispatch; selected card named; proof precedes guidance; only Read/Glob/Grep used | Transcript, response, tool-call record | PASS if direct and read-only with full proof; FAIL if Task/mutating tool or skipped proof appears | 1. Re-read direct fallback; 2. Inspect first ready/handoff claim; 3. Compare tool surface |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Motion direct-fallback contract |
| `../../procedures/interaction-states-pass.md` | Selected card |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: MOTION-PROCCARD-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `procedure-card-contract/direct-fallback-without-subagents.md`
