---
id: SD-009
category: 03--unknown-fallback
title: 'FEATURE_CATALOG vs PLAYBOOK tie within delta=1'
expected_intent: FEATURE_CATALOG+PLAYBOOK
expected_resources:
  - references/specific/feature_catalog.md
  - references/specific/playbook_creation.md
expected_token_range_input: 1000-2000
expected_token_range_output: 1000-2500
created: 2026-05-05
---

# SD-009: Disambiguation Required (FEATURE_CATALOG ↔ PLAYBOOK)

## Setup

```
I want a feature catalog for the playbook system. Document each playbook
scenario as a catalog entry.
```

## Expected Behavior

- **Intent picked**: `FEATURE_CATALOG` and `PLAYBOOK` both score high; gap within `AMBIGUITY_DELTA=1`.
- **Resources loaded**: top-2 candidates returned; CLI either disambiguates or loads both intents' references.
- **Outcome**: CLI surfaces both candidate intents with scores, OR proceeds with the more specific one (`FEATURE_CATALOG`) but loads PLAYBOOK reference too.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: may silently pick top-1 — verify both are scored.
- **cli-copilot (claude-opus-4.7)**: typically asks "which do you want?"; acceptable disambiguation.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact tie-resolution; verify resource list.

## Success Criteria

- both `FEATURE_CATALOG` and `PLAYBOOK` appear in top-2 within delta=1
- response either disambiguates OR loads both expected_resources
- false_positive_resource_load_count <= 2
