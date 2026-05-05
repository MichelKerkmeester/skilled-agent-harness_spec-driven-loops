---
id: SD-015
category: 05--token-cost-baseline
title: 'Ceiling token cost: ON_DEMAND_KEYWORDS load all RESOURCE_MAP'
expected_intent: ON_DEMAND_ALL
expected_resources:
  - references/global/validation.md
  - references/global/workflows.md
  - references/global/core_standards.md
  - references/global/evergreen_packet_id_rule.md
  - references/global/hvr_rules.md
  - references/global/optimization.md
  - references/specific/skill_creation.md
  - references/specific/agent_creation.md
  - references/specific/readme_creation.md
  - references/specific/changelog.md
  - references/specific/feature_catalog.md
  - references/specific/playbook_creation.md
  - references/specific/install_guide.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_reference_template.md
  - assets/agent_template.md
  - assets/command_template.md
  - assets/documentation/readme_template.md
  - assets/documentation/changelog_template.md
  - assets/flowcharts/simple_workflow.md
  - assets/flowcharts/decision_tree_flow.md
expected_token_range_input: 5000-10000
expected_token_range_output: 2000-3000
created: 2026-05-05
---

# SD-015: Max-Load Token Cost (Ceiling)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
sk-doc: show me the full template, all frameworks, format guide. I want
every reference and every asset loaded so I can review the complete
documentation toolkit before deciding which intent to use.
```

(Contains ON_DEMAND_KEYWORDS: "full template", "all frameworks", "format guide" — triggers ON_DEMAND load of every RESOURCE_MAP entry.)

## Expected Behavior

- **Intent picked**: ON_DEMAND fallback (load-all)
- **Resources loaded**: every reference + asset enumerated in `RESOURCE_MAP` (all 11 intents' resources).
- **Outcome**: CLI emits a directory-style summary of loaded resources, NOT a normal intent-specific output. This establishes the CEILING token cost per CLI.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: stress-tests context window; record peak input tokens.
- **cli-copilot (claude-opus-4.7)**: large context; record peak input tokens.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: may truncate output; record peak input tokens.

## Success Criteria

- ON_DEMAND_KEYWORDS triggered; load-all engaged
- all 21 enumerated resources appear in the loaded set (false_positive_resource_load_count tolerated up to 3 for any new RESOURCE_MAP additions)
- per-CLI ceiling token cost recorded; should be the upper bound of SD-013/SD-014/SD-015 spectrum
