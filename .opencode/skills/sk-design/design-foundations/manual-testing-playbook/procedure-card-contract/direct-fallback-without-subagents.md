---
title: Foundations Direct Fallback Without Subagents Scenario
description: Manual scenario verifying foundations direct fallback preserves proof and read-only tool boundaries.
trigger_phrases:
  - "test foundations direct fallback"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: DIRECT_FALLBACK
expected_resources:
  - SKILL.md
  - ../shared/context-loading-contract.md
---

**Exact prompt**

```text
Subagents are unavailable. foundations: complete the hierarchy/rhythm review directly in this session and show the selected procedure, context basis, proof line, and read-only boundary.
```

# FOUND-PROCCARD-003 | Foundations Direct Fallback Without Subagents

## 1. OVERVIEW

This scenario validates the `Context, Proof, And Direct Fallback` section for foundations.

## 2. SCENARIO CONTRACT

- Objective: Confirm foundations executes directly with Read/Glob/Grep only while preserving selected-card, context, and proof requirements.
- Real user request: `Subagents are unavailable, but I still need a hierarchy/rhythm review.`
- Prompt: `Subagents are unavailable. foundations: complete the hierarchy/rhythm review directly in this session and show the selected procedure, context basis, proof line, and read-only boundary.`
- Expected execution process: No Task dispatch; select `procedures/hierarchy-rhythm-review.md`; record public mode, loaded references, system role, evidence labels, pinned tokens, platforms, accessibility bar, unknowns, proof line, and verification risks.
- Expected signals: Direct execution, no Write/Edit/Bash/Task, proof before ready/handoff claim.
- Desired user-visible outcome: Foundations review with evidence labels and no weakened fallback.
- Pass/fail: PASS if direct fallback preserves proof and read-only boundary; FAIL if proof is skipped or mutating tools are used.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-PROCCARD-003 | Foundations direct fallback | Confirm no-subagent path keeps proof bar | `Subagents are unavailable. foundations: complete the hierarchy/rhythm review directly in this session and show the selected procedure, context basis, proof line, and read-only boundary.` | grep `Context, Proof, And Direct Fallback` in `SKILL.md` -> agent: run exact prompt -> inspect tool calls and proof order | No Task dispatch; selected card or fallback named; proof precedes ready/handoff; only Read/Glob/Grep used | Transcript, response, tool-call record | PASS if direct and read-only with full proof; FAIL if Task/mutating tool or skipped proof appears | 1. Re-read direct fallback section; 2. Inspect first ready/handoff claim; 3. Compare tool surface |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Foundations direct-fallback contract |
| `../../../shared/context-loading-contract.md` | Shared proof fields |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: FOUND-PROCCARD-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `procedure-card-contract/direct-fallback-without-subagents.md`
