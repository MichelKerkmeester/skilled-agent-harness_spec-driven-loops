---
title: "Prefix-lifting experiment: the gate prevents nothing and costs one break per session"
description: "A controlled two-arm live experiment on two gateway models, measuring the shipped prefix per turn to settle whether gating prefix lifting on cross-turn stability is worth its cost."
trigger_phrases:
  - "prefix lifting experiment"
  - "cross-turn stability measurement"
  - "prefix break per session"
  - "cache prefix churn evidence"
importance_tier: "important"
contextType: "implementation"
---
# Prefix-lifting experiment

The reverted change gated prefix lifting on having seen a candidate unchanged across two turns, on
the theory that lifting a candidate which later changes destroys the cache prefix. That premise was
never measured. This settles it.

## Why earlier attempts failed

`before_agent_start` fires once per user prompt, not once per provider request, and the promotion
state is process-scoped. One-shot invocations therefore see a single observation each and never
reach the second, so an earlier comparison of "gate on" against "gate off" compared two conditions
that both lifted nothing. Passing several messages to one invocation produces genuine successive
turns in one process, which is what this experiment needs.

## Design

Four turns per model in a single process, on `llmgateway/deepseek-v4-flash-vision-exp` and
`llmgateway/glm-5.3-flash` at max thinking, with a run nonce in the first prompt so no run inherits
another's warm provider cache. An environment-gated probe recorded, per provider request, whether
the optimizer changed the prompt and the hash and length of the stable prefix it shipped. The probe
was removed afterwards; the tree is back at HEAD.

Recording the shipped bytes is the point. The failure of the earlier attempt was assuming the arms
differed instead of proving it.

## Result

| Arm | Turn 1 | Turns 2-4 | Verdict |
|-----|--------|-----------|---------|
| A — current behavior, lift from turn 1 | `c0748d` (59,187) | `c0748d` (59,187) | stable |
| B — the gate | `e3b0c4` (0) | `c0748d` (59,187) | prefix break |

Identical on both models. `e3b0c4` is the hash of the empty string: under the gate, turn 1 ships
nothing lifted, and turn 2 then introduces 59,187 characters at the head of the prompt.

`changed` was true on all eight turns of arm A, so the optimizer really was lifting. That also
retires an earlier doubt: the persisted churn counter is only written when the optimizer changed the
prompt, so a zero could have meant "never lifted" rather than "never churned". Here it lifted every
turn and the prefix still never moved.

## Conclusion

The gate prevents a failure that does not occur, and pays a guaranteed prefix break once per
session to do it. Arm A shows the prefix is already stable from the first turn, so there is nothing
for a stability gate to protect; arm B shows the gate itself is what moves the prefix.

The revert stands, now on measurement rather than argument.

## Limits

Two models on one gateway, four turns each, one run per arm. It does not cover a prompt whose stable
content genuinely changes mid-session — a file in the allowlist being edited between turns, say —
which is the case the gate was imagined for. That case remains unobserved rather than disproven, and
if it were ever observed the right fix would target it directly instead of delaying every lift.
