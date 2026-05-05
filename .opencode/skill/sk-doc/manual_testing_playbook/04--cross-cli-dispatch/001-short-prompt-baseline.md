---
id: SD-010
category: 04--cross-cli-dispatch
title: 'Short-prompt baseline: CHANGELOG intent across all 3 CLIs'
expected_intent: CHANGELOG
expected_resources:
  - references/specific/changelog.md
  - assets/documentation/changelog_template.md
expected_token_range_input: 200-800
expected_token_range_output: 800-2000
created: 2026-05-05
---

# SD-010: Short-Prompt Baseline (CHANGELOG)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
sk-doc: changelog template for the v2.3.0 release. Cover added, changed,
fixed, removed sections following Keep a Changelog format.
```

(~200 chars; baseline-latency probe)

## Expected Behavior

- **Intent picked**: `CHANGELOG`
- **Resources loaded**:
  - `references/specific/changelog.md`
  - `assets/documentation/changelog_template.md`
- **Outcome**: CLI emits a populated changelog skeleton for v2.3.0 with the four standard sections, citing the template.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: foreground baseline; record dispatch latency.
- **cli-copilot (claude-opus-4.7)**: foreground baseline; record latency.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: foreground baseline; record latency.

## Success Criteria

- intent_picked == `CHANGELOG`
- false_positive_resource_load_count <= 1
- response is non-empty and follows Keep-a-Changelog section structure
- per-CLI latency recorded as the BASELINE for SD-011 (large-prompt) and SD-012 (multi-step) comparisons
