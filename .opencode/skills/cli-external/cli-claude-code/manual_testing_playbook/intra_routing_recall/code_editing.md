---
id: CC-R02
category: intra_routing_recall
stage: routing
title: 'Code editing routing'
expected_intent: CODE_EDITING
expected_resources:
  - references/cli_reference.md
  - assets/prompt_templates.md
version: 1.0.0.0
---
# CC-R02: Code editing routing

## SCENARIO CONTRACT
- Expected intent: `CODE_EDITING`
- Tier: T1 (in-skill recall — prompt carries the intent's router keywords)

**Exact prompt**:
```text
Ask Claude to refactor the authentication module and modify the retry logic with surgical, diff-based edits.
```
