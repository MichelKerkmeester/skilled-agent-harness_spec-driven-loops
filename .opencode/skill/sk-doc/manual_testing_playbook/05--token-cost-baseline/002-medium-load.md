---
id: SD-014
category: 05--token-cost-baseline
title: 'Median token cost: SKILL_CREATION query, 3 resources'
expected_intent: SKILL_CREATION
expected_resources:
  - references/specific/skill_creation.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_reference_template.md
expected_token_range_input: 1500-3000
expected_token_range_output: 2000-4000
created: 2026-05-05
---

# SD-014: Medium-Load Token Cost (Median)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Create a new skill called sk-graph-rag for graph-based retrieval-augmented
generation. It should have two intents (index and query) and ship a starter
reference doc plus a SKILL.md scaffold.
```

(Typical SKILL_CREATION query — 3 resources loaded.)

## Expected Behavior

- **Intent picked**: `SKILL_CREATION`
- **Resources loaded**: 3 (skill_creation reference + 2 asset templates).
- **Outcome**: CLI emits a populated `SKILL.md` scaffold and a starter reference doc. This establishes the MEDIAN token cost per CLI.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: record input/output token counts as median baseline.
- **cli-copilot (claude-opus-4.7)**: record input/output token counts as median baseline.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: record input/output token counts as median baseline.

## Success Criteria

- intent_picked == `SKILL_CREATION`
- exactly 3 RESOURCE_MAP resources loaded (false_positive_resource_load_count <= 1)
- per-CLI median token cost recorded; should fall between SD-013 floor and SD-015 ceiling
