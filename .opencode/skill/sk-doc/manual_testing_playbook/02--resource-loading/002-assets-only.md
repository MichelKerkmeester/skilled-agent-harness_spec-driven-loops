---
id: SD-005
category: 02--resource-loading
title: 'FLOWCHART intent loads only assets/flowcharts/*'
expected_intent: FLOWCHART
expected_resources:
  - assets/flowcharts/simple_workflow.md
  - assets/flowcharts/decision_tree_flow.md
expected_token_range_input: 1000-2000
expected_token_range_output: 800-2500
created: 2026-05-05
---

# SD-005: Assets-Only Resource Loading (FLOWCHART)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Generate a flowchart for our deploy pipeline. Use ASCII so it renders in
markdown. Cover build, test, staging, prod, and rollback branches.
```

## Expected Behavior

- **Intent picked**: `FLOWCHART`
- **Resources loaded**:
  - `assets/flowcharts/simple_workflow.md`
  - `assets/flowcharts/decision_tree_flow.md`
  - ONLY (no `references/*` loaded)
- **Outcome**: CLI emits an ASCII flowchart matching one of the asset templates, demonstrating the deploy pipeline with rollback decision branch.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: produces clean ASCII grid; foreground OK.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact; expect a single fenced block.

## Success Criteria

- intent_picked == `FLOWCHART`
- false_positive_resource_load_count <= 1 (no references/* loaded)
- response is non-empty and uses at least one flowchart-template structure
