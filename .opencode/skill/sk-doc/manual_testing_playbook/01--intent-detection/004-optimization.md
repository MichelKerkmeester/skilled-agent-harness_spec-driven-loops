---
id: SD-016
category: 01--intent-detection
title: 'OPTIMIZATION intent: rewrite a doc for token efficiency / llms.txt generation'
expected_intent: OPTIMIZATION
expected_resources:
  - references/global/optimization.md
  - assets/documentation/llmstxt_templates.md
expected_token_range_input: 800-2500
expected_token_range_output: 800-2500
created: 2026-05-05
---

# SD-016: OPTIMIZATION Intent Detection

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Optimize this skill's SKILL.md for token efficiency. It's currently 850 lines and consuming ~12k tokens per load. Apply sk-doc optimization guidance to compress the prose, deduplicate the resource-domain enumeration with the RESOURCE_MAP block, and generate an llms.txt summary so external AI agents can discover the skill without loading the full SKILL.md upfront.
```

## Expected Behavior

- **Intent picked**: `OPTIMIZATION`
- **Resources loaded**:
  - `references/global/optimization.md`
  - `assets/documentation/llmstxt_templates.md`
- **Outcome**: CLI loads only the two optimization-specific resources and produces a structured response describing token-compression strategies + an llms.txt scaffold suggestion.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: short-to-medium prompt; expect concise structured output naming both resources.
- **cli-copilot (claude-opus-4.7)**: invoke directly; expect verbose but on-target listing — verify it doesn't hallucinate a non-existent `optimization-rubric.md` or similar.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: invoke directly; expect concise output with both resource paths.

## Success Criteria

- intent_picked == `OPTIMIZATION`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources
- response mentions both "token compression" and "llms.txt" themes (validates intent semantics)
