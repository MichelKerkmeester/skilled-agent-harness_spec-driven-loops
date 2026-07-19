---
id: SD-003
category: intent_detection
title: 'AGENT_COMMAND intent: author paired @agent and /create command'
expected_intent: create-agent+create-command
expected_resources:
  - create-agent/references/README.md
  - create-agent/assets/agent-template.md
  - create-command/references/README.md
  - create-command/assets/command-template.md
expected_workflow_mode: create-agent+create-command
expected_leaf_resources:
  - workflow_mode: create-agent
    leaf_resource_id: references/README.md
  - workflow_mode: create-agent
    leaf_resource_id: assets/agent-template.md
  - workflow_mode: create-command
    leaf_resource_id: references/README.md
  - workflow_mode: create-command
    leaf_resource_id: assets/command-template.md
expected_token_range_input: 1000-2500
expected_token_range_output: 1500-3000
created: 2026-05-05
version: 1.8.0.7
---

# SD-003: AGENT_COMMAND Intent Detection

## 1. OVERVIEW

This scenario validates AGENT_COMMAND intent detection for `SD-003`. It focuses on routing a paired agent and command authoring request to the agent and command templates without producing artifacts.

### Why This Matters

Agent and command creation share vocabulary with skill scaffolding and generic documentation generation. This scenario catches router mistakes that would load the wrong creation workflow or miss one side of the paired `@agent` and `/create:*` contract.

---

## 2. SCENARIO CONTRACT

- Real user request: `Author an @analyze agent and paired /create:analyze command using the standard templates.`
- Prompt: `Author an @analyze agent and paired /create:analyze command using the standard templates.`
- Expected intent: `AGENT_COMMAND`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-003 | AGENT_COMMAND intent: author paired @agent and /create command | Verify sk-doc routes the scenario to `AGENT_COMMAND` with the expected resources. | `Author an @analyze agent and paired /create:analyze command using the standard templates.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `AGENT_COMMAND`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Author an @analyze agent and paired /create:analyze command using the standard templates.
```

## Expected Behavior

- **Intent picked**: `AGENT_COMMAND`
- **Resources loaded**:
  - `references/README.md`
  - `assets/agent-template.md`
  - `assets/command/command-template.md`
- **Outcome**: CLI loads agent-creation reference + both templates and produces two file scaffolds (`@analyze` agent definition and `/create:analyze` command) with the dispatch wiring described in `references/README.md`.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: dispatches in a single foreground turn; inlines both files.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: produces compact output; verify wiring stanza is present.

## Success Criteria

- intent_picked == `AGENT_COMMAND`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources

## 4. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: SD-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `intent-detection/agent-command.md`
