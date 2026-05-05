---
id: SD-001
category: 01--intent-detection
title: 'DOC_QUALITY intent: validate documentation quality for a skill'
expected_intent: DOC_QUALITY
expected_resources:
  - references/global/validation.md
  - references/global/workflows.md
  - references/global/core_standards.md
  - references/global/evergreen_packet_id_rule.md
expected_token_range_input: 1000-2500
expected_token_range_output: 800-2500
created: 2026-05-05
---

# SD-001: DOC_QUALITY Intent Detection

## Setup

```
Validate documentation quality for skill X. Run the standard sk-doc DQI checks
and tell me which sections fail core_standards or workflows guidance.
```

## Expected Behavior

- **Intent picked**: `DOC_QUALITY`
- **Resources loaded**:
  - `references/global/validation.md`
  - `references/global/workflows.md`
  - `references/global/core_standards.md`
  - `references/global/evergreen_packet_id_rule.md`
- **Outcome**: CLI loads only the four global references above and produces a non-empty validation-style response (DQI checklist or per-section findings) referencing at least one of those resources.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: short prompt fits inline; default foreground dispatch is fine.
- **cli-copilot (claude-opus-4.7)**: invoke directly; expect verbose checklist with citations.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: invoke directly; expect concise structured output.

## Success Criteria

- intent_picked == `DOC_QUALITY`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources
