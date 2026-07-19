---
title: Wireframe Exploration
description: Private procedure card for design-interface low-fidelity layout and flow exploration.
trigger_phrases:
  - "wireframe exploration"
  - "low fidelity layout options"
  - "storyboard flow"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Wireframe Exploration

Private procedure card for applying the existing design-interface wireframe exploration workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-interface` explore low-fidelity layout or flow options before committing to high-fidelity direction. |
| Owning mode | `design-interface` |
| Source reference | `wireframe.md` |
| Trigger | Use when the user asks to sketch, wireframe, explore options, storyboard a flow, or compare early structural directions. |
| Output contract | A low-fidelity exploration plan with 3 or more distinct structural options, their variation axes, and the decision each option is meant to test. |
| Proof gate | The options differ in structure or flow, not cosmetic styling; each option has a rationale and a recommended next step. |
| Privacy rule | This card is private interface guidance and is not exposed as a standalone wireframe skill. |

## 2. READ-ONLY COMPATIBILITY

For read-only operation, the card returns a storyboard, ASCII outline, or handoff plan. It must not require file creation or prototype rendering from `design-interface`.

## 3. PROCEDURE

1. Identify the user goal, target surface, constraints, and strongest variation axis.
2. Keep fidelity intentionally low so feedback focuses on structure.
3. Generate at least three options that span safe, refined, and riskier structures.
4. Annotate each option with the tradeoff it tests.
5. End with a recommended next procedure: direction, variation, prototype handoff, or another wireframe round.

## 4. CONFLICT RULE

If the user asks for high-fidelity alternatives, use `variation-set.md` instead. If they ask for interaction behavior, hand off from this card to `prototype-flow-spec.md`.
