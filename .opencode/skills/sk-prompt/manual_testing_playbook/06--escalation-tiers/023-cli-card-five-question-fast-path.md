---
title: "SP-023 -- Inline fast path: low-complexity prompts are not escalated"
description: "This scenario validates the inline fast path for `SP-023`. It focuses on passing routine prompts inline through the CLEAR check without escalating to `@prompt-improver`."
---

# SP-023 -- Inline fast path: low-complexity prompts are not escalated

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-023`.

---

## 1. OVERVIEW

This scenario validates that a low-complexity routine prompt is handled inline by `sk-prompt` -- it passes the CLEAR check and is delivered without dispatching the `@prompt-improver` deep path.

### Why This Matters

The fast path keeps routine prompts lightweight. Escalating everything to the fresh-context `@prompt-improver` agent would burn context and slow down simple work.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a low-complexity prompt passes the five CLEAR dimensions inline without `@prompt-improver` escalation.
- Real user request: `Quick check on my prompt -- handle it inline without escalating to a deep pass.`
- Prompt: `Run sk-prompt on a low-complexity prompt. Verify it passes the CLEAR check inline and does not dispatch @prompt-improver. Return the verdict.`
- Expected execution process: sk-prompt scores the five CLEAR dimensions (Correctness, Logic, Expression, Arrangement, Reusability), all pass, and it stays inline because no escalation condition is present.
- Expected signals: Five CLEAR dimensions pass; `Inline`; no `agent: @prompt-improver` invocation.
- Desired user-visible outcome: `Handled inline; CLEAR passed; no @prompt-improver escalation.`
- Pass/fail: PASS if the prompt is handled inline and no escalation occurs; FAIL if `@prompt-improver` is dispatched despite no escalation condition or a failed CLEAR dimension is ignored.

---

## 3. TEST EXECUTION

### Prompt

```
Run sk-prompt on a low-complexity prompt. Verify it passes the CLEAR check inline and does not dispatch @prompt-improver. Return the verdict.
```

### Commands

1. `sk-prompt: Quick check on my prompt -- handle it inline without escalating to a deep pass.`
2. `bash: rg 'CLEAR|Correctness|Logic|Expression|Arrangement|Reusability' .opencode/skills/sk-prompt/references/patterns_evaluation.md`

### Expected

The skill reports five passed CLEAR dimensions and explicitly states that escalation was not needed.

### Evidence

Capture the five-dimension CLEAR result and routing decision.

### Pass / Fail

- **Pass**: All five CLEAR dimensions pass inline and no `@prompt-improver` dispatch occurs.
- **Fail**: Escalation occurs without a condition, or a failed CLEAR dimension is ignored.

### Failure Triage

1. Inspect `references/patterns_evaluation.md` for the CLEAR dimension definitions and floors.
2. Inspect `SKILL.md` §7 for when `@prompt-improver` escalation applies (Quick vs Standard DEPTH energy).
3. Re-run with a simpler prompt and no compliance, policy, or multi-stakeholder language.

### Optional Supplemental Checks

Verify the delivered prompt includes role, context, constraints, output, and verification order.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 `@prompt-improver` escalation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | CLEAR five-dimension definitions and floors |
| `../../references/depth_framework.md` | Quick vs Standard DEPTH energy that distinguishes inline from escalated handling |

---

## 5. SOURCE METADATA

- Group: Escalation Tiers
- Playbook ID: SP-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--escalation-tiers/023-cli-card-five-question-fast-path.md`
