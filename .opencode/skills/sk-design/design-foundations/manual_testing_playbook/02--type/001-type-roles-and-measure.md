---
title: Type Roles And Measure Scenario
description: Manual scenario verifying role-based typography, scale, pairing, measure, and data text guidance.
trigger_phrases:
  - "test typography roles"
  - "test type measure"
  - "foundations type scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: TYPE
expected_resources:
  - references/type/typography_system.md
---

**Exact prompt**

```
Define typography for a dense analytics app with long labels, metrics, and a small marketing header.
```

# FOUND-TYPE-001 | Type Roles And Measure

## Prompt

`Define typography for a dense analytics app with long labels, metrics, and a small marketing header.`

## Expected Process

1. Load `references/type/typography_system.md`.
2. Define display, heading, body, caption, utility, and data roles.
3. Name measure and line-height constraints.
4. Include tabular numerals for metrics.

## Pass Criteria

- Does not pick fonts before roles.
- Keeps expressive display type limited to identity moments.
- Addresses long labels and localization expansion.
- Provides implementable role guidance for `sk-code`.
