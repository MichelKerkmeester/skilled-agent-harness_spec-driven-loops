---
title: Worked Examples Not Presets Scenario
description: Manual scenario verifying that foundations examples are loaded as illustrative calibration and never reused as a style preset.
trigger_phrases:
  - "test foundations worked examples"
  - "worked examples not presets"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: WORKED_EXAMPLES
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/worked-examples.md
---

**Exact prompt**

```
Show me what a complete foundations answer looks like, but do not reuse it as a preset.
```

# FOUND-EXAMPLE-001 | Worked Examples Not Presets

## Expected Process

1. Route to `foundations`.
2. Load `references/worked-examples.md` as calibration.
3. State that the examples are illustrative and not reusable presets.
4. Extract the answer shape, not the specific palette, type or spacing values.

## Pass Criteria

- The response marks the examples illustrative.
- No example value is copied into a live system without brief evidence.
- The output keeps roles before raw values.
- The final handoff still uses current surface constraints.
