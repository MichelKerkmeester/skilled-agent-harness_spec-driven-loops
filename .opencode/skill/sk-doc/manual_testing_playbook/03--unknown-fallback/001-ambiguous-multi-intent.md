---
id: SD-007
category: 03--unknown-fallback
title: 'Ambiguous prompt scores DOC_QUALITY and FLOWCHART within delta'
expected_intent: DOC_QUALITY+FLOWCHART
expected_resources:
  - references/global/validation.md
  - references/global/core_standards.md
  - assets/flowcharts/simple_workflow.md
  - assets/flowcharts/decision_tree_flow.md
expected_token_range_input: 1000-2500
expected_token_range_output: 1500-3000
created: 2026-05-05
---

# SD-007: Ambiguous Multi-Intent Disambiguation

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Improve doc quality and create flowcharts for the new feature. The current
docs are messy and there's no visual workflow.
```

## Expected Behavior

- **Intent picked**: top-2 within `AMBIGUITY_DELTA=1`: `DOC_QUALITY` and `FLOWCHART`
- **Resources loaded**: union set from both intents (validation/core_standards + flowchart assets)
- **Outcome**: CLI either (a) loads both intents' resources and produces a combined response, or (b) explicitly asks the user to disambiguate, citing both candidate intents and their scores.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: tends to pick top-1 silently — verify it surfaces both.
- **cli-copilot (claude-opus-4.7)**: usually asks for clarification; acceptable.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: may run both intents in sequence; verify resource loads.

## Success Criteria

- top-2 intents include both `DOC_QUALITY` and `FLOWCHART` within delta=1
- response either disambiguates OR loads union of expected_resources
- false_positive_resource_load_count <= 2 (slack for union load)
