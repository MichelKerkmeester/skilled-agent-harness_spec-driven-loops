---
id: SD-003
title: 'AGENT_COMMAND intent: author paired @agent and /create command'
description: "This scenario validates AGENT_COMMAND intent detection for SD-003."
stage: routing
expected_intent: sk-create-agent+sk-create-command
expected_resources:
  - sk-create-agent/references/README.md
  - sk-create-agent/assets/agent-template.md
  - sk-create-command/references/README.md
  - sk-create-command/assets/command-template.md
expected_workflow_mode: sk-create-agent+sk-create-command
expected_leaf_resources:
  - workflow_mode: sk-create-agent
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-agent
    leaf_resource_id: assets/agent-template.md
  - workflow_mode: sk-create-command
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-command
    leaf_resource_id: assets/command-template.md
version: 1.8.0.7
---

# SD-003: AGENT_COMMAND Intent Detection

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-003`.

---

## 1. OVERVIEW

This scenario validates AGENT_COMMAND intent detection for `SD-003`. It focuses on routing a paired agent and command authoring request to the agent and command templates without producing artifacts.

### Why This Matters

Agent and command creation share vocabulary with skill scaffolding and generic documentation generation. This scenario catches router mistakes that would load the wrong creation workflow or miss one side of the paired `@agent` and `/create:*` contract.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc routes the scenario to `AGENT_COMMAND` with the expected resources.
- Real user request: `Author an @analyze agent and paired /create:analyze command using the standard templates.`
- Prompt: `Author an @analyze agent and paired /create:analyze command using the standard templates.`
- Expected signals: Intent resolves to `AGENT_COMMAND`; loaded resources match `expected_resources`.
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.
- Pass/fail: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author an @analyze agent and paired /create:analyze command using the standard templates.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Author an @analyze agent and paired /create:analyze command using the standard templates.
```

### Expected

Intent resolves to `AGENT_COMMAND`; loaded resources match `expected_resources`.

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: `AGENT_COMMAND`
- **Resources loaded**:
  - `references/README.md`
  - `assets/agent-template.md`
  - `assets/command/command-template.md`
- **Outcome**: CLI loads agent-creation reference + both templates and produces two file scaffolds (`@analyze` agent definition and `/create:analyze` command) with the dispatch wiring described in `references/README.md`.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: dispatches in a single foreground turn; inlines both files.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: produces compact output; verify wiring stanza is present.

**Success Criteria**

- intent_picked == `AGENT_COMMAND`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources


---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The sk-doc router under test |
| `../../sk-create-skill/scripts/validate-playbook-topology.cjs` | Routing-gold contract gate |

---

## 5. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: SD-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `intent-detection/agent-command.md`

