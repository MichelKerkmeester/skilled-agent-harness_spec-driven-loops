---
title: "ID-020 -- Interface direct fallback without subagents"
description: "This scenario validates interface direct fallback with the same proof bar and Read/Glob/Grep-only tool boundary."
contextType: reference
version: 1.0.0.0
id: ID-020
expected_intent: DIRECT_FALLBACK
expected_resources:
  - SKILL.md
  - ../shared/context_loading_contract.md
  - ../shared/register.md
---

# ID-020 -- Interface direct fallback without subagents

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-020`.

**Exact prompt**

```text
Subagents are unavailable. interface: produce the direction in this current session and show the selected procedure or fallback, context basis, proof line, and read-only tool boundary before recommendations.
```

---

## 1. OVERVIEW

This scenario validates `Context, Proof, And Direct Fallback` for interface. Direct fallback must preserve card selection, context capture, proof checks, and Read/Glob/Grep-only operation.

### Why This Matters

Subagent unavailability must not lower the proof bar or grant mutating tools to an advisory mode.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm interface executes directly with the same card/fallback selection, context basis, proof line, and tool restrictions.
- Real user request: `Subagents are unavailable, but I still need interface direction with proof.`
- Prompt: `Subagents are unavailable. interface: produce the direction in this current session and show the selected procedure or fallback, context basis, proof line, and read-only tool boundary before recommendations.`
- Expected execution process: Do not dispatch Task; use Read/Glob/Grep only; capture public mode, selected card or fallback, target surface, audience, pinned axes, constraints, missing facts, loaded references, pre-flight proof, and unresolved risks.
- Expected signals: Direct execution in current session, no Task handoff, no Write/Edit/Bash, and proof before recommendations.
- Desired user-visible outcome: A safe interface answer that names what was proven and what remains unresolved.
- Pass/fail: PASS if fallback stays local and read-only with full proof; FAIL if subagent absence leads to skipped proof, Task dispatch, or mutating tools.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-020 | Interface direct fallback without subagents | Confirm direct fallback preserves proof bar and read-only boundary | `Subagents are unavailable. interface: produce the direction in this current session and show the selected procedure or fallback, context basis, proof line, and read-only tool boundary before recommendations.` | grep `Context, Proof, And Direct Fallback` in `SKILL.md` -> agent: run exact prompt -> inspect tool calls and proof order | Step 1: direct-fallback section found. Step 2: no Task dispatch. Step 3: context/proof line precedes recommendations. Step 4: only Read/Glob/Grep used | Transcript, response, tool-call record, proof line | PASS if direct execution keeps same proof bar and uses no mutating tools; FAIL if proof is skipped or Write/Edit/Bash/Task appears | 1. Re-read `SKILL.md` direct fallback; 2. Inspect first recommendation for missing context; 3. Compare tool calls against the read-only mode surface |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Interface context/proof/direct-fallback contract |
| `../../../shared/context_loading_contract.md` | Shared context proof fields |
| `../../../shared/register.md` | Register posture used before decisions |

---

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: ID-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--procedure-card-contract/direct-fallback-without-subagents.md`
