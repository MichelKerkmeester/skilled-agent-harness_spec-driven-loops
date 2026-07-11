---
id: CC-H02
category: intra-routing-recall
stage: holdout
title: 'Blind holdout — editing domain'
expected_intent: CODE_EDITING
expected_resources:
  - references/cli_reference.md
  - assets/prompt_templates.md
version: 1.0.0.0
---
# CC-H02: Blind holdout — editing domain

## SCENARIO CONTRACT
- Expected intent: `CODE_EDITING`
- Tier: T2 (blind holdout — prompt names no router keyword, intent key, skill id, or resource basename; tests generalization beyond keyword matching)

**Exact prompt**:
```text
Have the external assistant rework the checkout module so the retry behavior is cleaner, and hand me back the smallest possible set of line changes.
```
