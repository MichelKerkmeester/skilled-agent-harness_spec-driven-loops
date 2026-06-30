---
id: SD-016
category: 01--intent-detection
title: 'OPTIMIZATION intent: rewrite a doc for token efficiency / llms.txt generation'
expected_intent: OPTIMIZATION
expected_resources:
  - references/global/optimization.md
  - assets/llmstxt_templates.md
expected_token_range_input: 800-2500
expected_token_range_output: 800-2500
created: 2026-05-05
version: 1.8.0.5
---

# SD-016: OPTIMIZATION Intent Detection

## 1. OVERVIEW

This scenario validates OPTIMIZATION intent detection for `SD-016`. It focuses on routing a token-efficiency and `llms.txt` request to optimization resources rather than general document-quality resources.

### Why This Matters

Optimization prompts often mention document rewriting, which can be misclassified as quality validation or README creation. This scenario catches cases where sk-doc fails to load the token-efficiency guidance and `llms.txt` templates needed for the requested output shape.

---

## 2. SCENARIO CONTRACT

- Real user request: `Optimize this long SKILL.md for token efficiency and generate an llms.txt summary.`
- Prompt: `Optimize this long SKILL.md for token efficiency and generate an llms.txt summary.`
- Expected intent: `OPTIMIZATION`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-016 | OPTIMIZATION intent: rewrite a doc for token efficiency / llms.txt generation | Verify sk-doc routes the scenario to `OPTIMIZATION` with the expected resources. | `Optimize this long SKILL.md for token efficiency and generate an llms.txt summary.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `OPTIMIZATION`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Optimize this long SKILL.md for token efficiency and generate an llms.txt summary.
```

## Expected Behavior

- **Intent picked**: `OPTIMIZATION`
- **Resources loaded**:
  - `references/global/optimization.md`
  - `assets/llmstxt_templates.md`
- **Outcome**: CLI loads only the two optimization-specific resources and produces a structured response describing token-compression strategies + an llms.txt scaffold suggestion.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: short-to-medium prompt; expect concise structured output naming both resources.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: invoke directly; expect concise output with both resource paths.

## Success Criteria

- intent_picked == `OPTIMIZATION`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources

## 4. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: SD-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--intent-detection/optimization.md`
- response mentions both "token compression" and "llms.txt" themes (validates intent semantics)
