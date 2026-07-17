---
id: SD-017
category: intent_detection
title: 'INSTALL_GUIDE intent: scaffold an install guide for a new MCP server'
expected_intent: create-readme
expected_resources:
  - create-readme/assets/install_guide_template.md
  - create-readme/references/README.md
expected_workflow_mode: create-readme
expected_leaf_resources:
  - workflow_mode: create-readme
    leaf_resource_id: assets/install_guide_template.md
  - workflow_mode: create-readme
    leaf_resource_id: references/README.md
expected_token_range_input: 800-2500
expected_token_range_output: 1500-3500
created: 2026-05-05
version: 1.8.0.6
---

# SD-017: INSTALL_GUIDE Intent Detection

## 1. OVERVIEW

This scenario validates INSTALL_GUIDE intent detection for `SD-017`. It focuses on routing an MCP server setup request to the install-guide template and creation workflow.

### Why This Matters

Install-guide prompts combine prerequisites, setup, configuration, verification, and troubleshooting, which can be mistaken for generic README creation. This scenario catches resource drift that would omit the phase-based install guide structure or return an underspecified setup document.

---

## 2. SCENARIO CONTRACT

- Real user request: `Create an MCP-Postgres install guide with prerequisites, npm setup, env config, verification, and troubleshooting.`
- Prompt: `Create an MCP-Postgres install guide with prerequisites, npm setup, env config, verification, and troubleshooting.`
- Expected intent: `INSTALL_GUIDE`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-017 | INSTALL_GUIDE intent: scaffold an install guide for a new MCP server | Verify sk-doc routes the scenario to `INSTALL_GUIDE` with the expected resources. | `Create an MCP-Postgres install guide with prerequisites, npm setup, env config, verification, and troubleshooting.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `INSTALL_GUIDE`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Create an MCP-Postgres install guide with prerequisites, npm setup, env config, verification, and troubleshooting.
```

## Expected Behavior

- **Intent picked**: `INSTALL_GUIDE`
- **Resources loaded**:
  - `assets/readme/install_guide_template.md`
  - `references/README.md`
- **Outcome**: CLI loads only the two install-guide-specific resources and produces a structured response describing the install-guide section layout (prerequisites, install, configuration, verification, troubleshooting).

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: medium prompt; expect concise structured output with both resource paths and a section outline.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: invoke directly; expect concise output with both resource paths.

## Success Criteria

- intent_picked == `INSTALL_GUIDE`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources

## 4. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: SD-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `intent_detection/install_guide.md`
- response mentions canonical install-guide sections (prerequisites, configuration, verification, troubleshooting) — validates intent semantics
