---
title: Discovery Question Round
description: Private procedure card for deciding when design-interface should ask one bundled context question round.
trigger_phrases:
  - "discovery question round"
  - "design context questions"
  - "interface intake questions"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Discovery Question Round

Private procedure card for applying the existing design-interface discovery question workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Help `design-interface` decide whether to ask a bundled question round before starting ambiguous design work. |
| Owning mode | `design-interface` |
| Source reference | `discovery-questions.md` |
| Trigger | Use after hub routing selects interface and the request lacks design context, audience, fidelity, variation count, novelty level, tweak needs, or focus axis. |
| Output contract | A compact question set grouped by design impact, with already-provided facts excluded and minor choices marked as mode-owned decisions. |
| Proof gate | The response shows the missing facts that would change design direction, caps the question set to only material items, and records which minor decisions the mode will make without asking. |
| Privacy rule | This is a private interface procedure card, not a public question-mode skill. |

## 2. READ-ONLY COMPATIBILITY

The card requires only reading the prompt and any supplied artifacts. `design-interface` may return questions or proceed with stated assumptions; it must not require writing files, running commands, or invoking a separate tool to use this card.

## 3. PROCEDURE

1. Read the provided brief and attached references before asking anything.
2. Ask only when the answer changes route, register, fidelity, scope, or acceptance criteria.
3. Bundle questions into one round rather than asking serially.
4. Prefer structured choices when possible, but keep freeform escape hatches for brand, reference, or constraint details.
5. After answers arrive, recap only the choices that alter the design plan.

## 4. CONFLICT RULE

If `aesthetic-direction.md` also matches, run this card first only when existing context is insufficient to choose or confirm a direction.
