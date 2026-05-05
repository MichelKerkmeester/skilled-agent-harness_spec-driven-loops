---
id: SD-013
category: 05--token-cost-baseline
title: 'Floor token cost: minimal-keyword query, 1 reference load'
expected_intent: HVR
expected_resources:
  - references/global/hvr_rules.md
expected_token_range_input: 500-1000
expected_token_range_output: 500-1500
created: 2026-05-05
---

# SD-013: Minimal-Load Token Cost (Floor)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
sk-doc: hvr fix this paragraph.

The system was designed by us to be modular.
```

(Minimal-keyword query — single intent trigger + DEFAULT_RESOURCE only.)

## Expected Behavior

- **Intent picked**: `HVR`
- **Resources loaded**: `references/global/hvr_rules.md` only (1 reference + DEFAULT_RESOURCE).
- **Outcome**: CLI rewrites the single sentence in HVR voice and emits minimal supporting output. This establishes the FLOOR token cost per CLI.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: record input/output token counts as floor baseline.
- **cli-copilot (claude-opus-4.7)**: record input/output token counts as floor baseline.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: record input/output token counts as floor baseline.

## Success Criteria

- intent_picked == `HVR`
- only 1 RESOURCE_MAP resource loaded (+ DEFAULT_RESOURCE)
- per-CLI floor token cost recorded as BASELINE for SD-014 (medium) and SD-015 (max)
