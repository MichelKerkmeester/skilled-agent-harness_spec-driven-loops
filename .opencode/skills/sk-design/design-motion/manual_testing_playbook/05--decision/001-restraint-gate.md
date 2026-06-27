---
title: Restraint Gate Scenario
description: Manual scenario verifying the frequency gate, the keyboard rule, the purpose test and register coupling run before any timing choice.
trigger_phrases:
  - "test restraint gate"
  - "should this animate scenario"
  - "animation decision test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: DECISION
expected_resources:
  - references/corpus_map.md
  - references/animation_decision_framework.md
---

**Exact prompt**

```
We want to add animation everywhere in our dashboard, including the command palette and every hover. Make it feel polished.
```

# MOTION-DECISION-001 | Restraint Gate

## Prompt

`We want to add animation everywhere in our dashboard, including the command palette and every hover. Make it feel polished.`

## Expected Process

1. Route to `motion`.
2. Load `../shared/register.md` for the motion-budget dial and `references/animation_decision_framework.md` for the restraint gate.
3. Run the gate in order and stop at the first no: frequency, then input, then purpose, then register.
4. Treat the unlabeled internal dashboard as a Product surface and trim by default.

## Pass Criteria

- Refuses motion on the command palette and any keyboard-driven action, keeping open and close instant.
- Removes or hard-reduces motion on high-frequency hovers, dropping movement for a near-instant color or background change.
- Names one purpose for any interaction that keeps motion and rejects looks-cool outside the rare or first-time tier.
- Confirms the choice against the Product motion-budget dial rather than granting a Brand entrance.
