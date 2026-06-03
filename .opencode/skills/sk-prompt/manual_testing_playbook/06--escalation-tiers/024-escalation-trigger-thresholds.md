---
title: "SP-024 -- Escalation trigger thresholds"
description: "This scenario validates deep-path escalation triggers for `SP-024`. It focuses on complexity, compliance, multi-stakeholder, ambiguity, and card-failure routing to `@prompt-improver`."
---

# SP-024 -- Escalation trigger thresholds

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-024`.

---

## 1. OVERVIEW

This scenario validates that any documented high-risk trigger routes to `@prompt-improver`. The operator gives a HIPAA-sensitive data-handling prompt and verifies the fast path escalates instead of processing inline.

### Why This Matters

Escalation protects complex, regulated, or ambiguous prompts from shallow treatment. Missing this trigger can produce unsafe downstream CLI instructions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm complexity >=7, compliance sensitivity, multi-stakeholder needs, ambiguity, or failed card floors route to `@prompt-improver`.
- Real user request: `Help with a compliance-sensitive prompt for HIPAA-bound data handling — escalate to @prompt-improver.`
- Prompt: `As a CLI orchestrator, evaluate a HIPAA-bound prompt with the sk-prompt fast-path card. Verify compliance sensitivity escalates to @prompt-improver and the routing decision names the trigger. Return the escalation payload.`
- Expected execution process: The orchestrator loads `cli_prompt_quality_card.md`, detects compliance sensitivity, bypasses inline fast path, and dispatches `@prompt-improver`.
- Expected signals: `Escalation: @prompt-improver (compliance)` or equivalent.
- Desired user-visible outcome: Routing decision plus payload summary for `@prompt-improver`.
- Pass/fail: PASS if compliance triggers escalation with reason; FAIL if HIPAA request stays on fast path.

---

## 3. TEST EXECUTION

### Prompt

```
As a CLI orchestrator, evaluate a HIPAA-bound prompt with the sk-prompt fast-path card. Verify compliance sensitivity escalates to @prompt-improver and the routing decision names the trigger. Return the escalation payload.
```

### Commands

1. `sk-prompt: Help with a compliance-sensitive prompt for HIPAA-bound data handling — escalate to @prompt-improver.`
2. `agent: @prompt-improver raw_task="Enhance a HIPAA-bound data-handling prompt for safe CLI dispatch." task_type=review target_cli=codex complexity_hint=8 constraints="HIPAA compliance; preserve privacy and safety requirements."`
3. `bash: rg 'Complexity is `>= 7/10`|Compliance|@prompt-improver' .opencode/skills/sk-prompt-small-model/assets/cli_prompt_quality_card.md`

### Expected

The routing decision escalates to `@prompt-improver` and names compliance sensitivity as the trigger.

### Evidence

Capture routing decision, trigger reason, and the `@prompt-improver` input payload.

### Pass / Fail

- **Pass**: HIPAA/compliance language triggers `@prompt-improver` and the reason is logged.
- **Fail**: The request is handled only by the fast-path card or the trigger reason is missing.

### Failure Triage

1. Inspect `cli_prompt_quality_card.md` §5 Escalation Triggers.
2. Confirm the operator input contains compliance-sensitive language.
3. Re-run with `complexity_hint=8` and explicit `constraints="HIPAA compliance"` in the payload.

### Optional Supplemental Checks

Run a multi-stakeholder variant and verify it also escalates with a different trigger reason.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 `@prompt-improver` contract and §8 fast-path asset |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../sk-prompt-small-model/assets/cli_prompt_quality_card.md` | Escalation thresholds and fast/deep path split |
| `../../references/depth_framework.md` | Deep-path DEPTH processing after escalation |

---

## 5. SOURCE METADATA

- Group: Escalation Tiers
- Playbook ID: SP-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--escalation-tiers/024-escalation-trigger-thresholds.md`
