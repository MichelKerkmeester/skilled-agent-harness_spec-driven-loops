---
title: "SP-023 -- CLI card 5-question fast path"
description: "This scenario validates the CLI prompt quality fast path for `SP-023`. It focuses on passing routine prompts inline without escalating to `@prompt-improver`."
---

# SP-023 -- CLI card 5-question fast path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-023`.

---

## 1. OVERVIEW

This scenario validates that low-complexity CLI dispatch prompts can use `cli_prompt_quality_card.md` inline. The operator asks for a quick check and verifies no `@prompt-improver` escalation occurs when all five CLEAR questions pass.

### Why This Matters

The fast path keeps routine CLI prompts lightweight. Escalating everything would burn context and slow down simple dispatches.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the 5-question CLEAR card passes low-risk prompts inline without agent escalation.
- Real user request: `Quick check on my CLI dispatch prompt — apply the 5-question quality card without escalation.`
- Prompt: `As a CLI orchestrator, apply the sk-prompt cli_prompt_quality_card to a low-complexity dispatch prompt. Verify all five checks pass inline and no @prompt-improver dispatch occurs. Return the card verdict.`
- Expected execution process: The orchestrator loads the card, checks Correctness, Logic, Expression, Arrangement, and Reusability questions, and stays inline because no escalation trigger is present.
- Expected signals: Five `yes` answers; `Fast path`; no `agent: @prompt-improver` invocation.
- Desired user-visible outcome: `Fast-path: 5/5 CLEAR questions passed; no @prompt-improver escalation.`
- Pass/fail: PASS if the inline card passes and no escalation occurs; FAIL if `@prompt-improver` is invoked despite no trigger or a failed question is ignored.

---

## 3. TEST EXECUTION

### Prompt

```
As a CLI orchestrator, apply the sk-prompt cli_prompt_quality_card to a low-complexity dispatch prompt. Verify all five checks pass inline and no @prompt-improver dispatch occurs. Return the card verdict.
```

### Commands

1. `sk-prompt: Quick check on my CLI dispatch prompt — apply the 5-question quality card without escalation.`
2. `bash: rg 'CLEAR 5-Question|Escalation Triggers|@prompt-improver' .opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`

### Expected

The orchestrator reports five passed checklist questions and explicitly states that escalation was not needed.

### Evidence

Capture the five-question checklist result and routing decision.

### Pass / Fail

- **Pass**: All five card questions pass inline and no `@prompt-improver` dispatch occurs.
- **Fail**: Escalation occurs without a trigger, or a failed card question is ignored.

### Failure Triage

1. Inspect `cli_prompt_quality_card.md` §4 for the five checklist questions.
2. Inspect §5 escalation triggers and confirm none apply.
3. Re-run with `complexity_hint=2` and no compliance, policy, or multi-stakeholder language.

### Optional Supplemental Checks

Verify the checked prompt includes task, context, constraints, output, and verification order.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §8 fast-path asset and §7 escalation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/cli_prompt_quality_card.md` | Fast-path five-question CLEAR card and escalation triggers |
| `../../references/patterns_evaluation.md` | Full CLEAR dimension definitions mirrored by the card |

---

## 5. SOURCE METADATA

- Group: Escalation Tiers
- Playbook ID: SP-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--escalation-tiers/023-cli-card-five-question-fast-path.md`
