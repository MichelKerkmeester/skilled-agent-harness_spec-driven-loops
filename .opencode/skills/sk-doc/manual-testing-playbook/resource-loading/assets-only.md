---
id: SD-005
title: 'FLOWCHART intent loads only assets/flowcharts/*'
description: "This scenario validates FLOWCHART assets-only resource loading for SD-005."
stage: routing
expected_intent: sk-create-flowchart
expected_resources:
  - sk-create-flowchart/assets/simple-workflow.md
  - sk-create-flowchart/assets/decision-tree-flow.md
expected_workflow_mode: sk-create-flowchart
expected_leaf_resources:
  - workflow_mode: sk-create-flowchart
    leaf_resource_id: assets/simple-workflow.md
  - workflow_mode: sk-create-flowchart
    leaf_resource_id: assets/decision-tree-flow.md
version: 1.8.0.6
---

# SD-005: Assets-Only Resource Loading (FLOWCHART)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-005`.

---

## 1. OVERVIEW

This scenario validates FLOWCHART assets-only resource loading for `SD-005`. It focuses on routing an ASCII deploy-pipeline diagram request to the flowchart asset examples.

### Why This Matters

Diagram requests should load reusable visual patterns, not broad documentation standards or creation workflows. This scenario catches cases where sk-doc misses the asset-only path, returns prose instead of a diagram-oriented response, or expands the context window with irrelevant references.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc routes the scenario to `FLOWCHART` with the expected resources.
- Real user request: `Generate an ASCII deploy-pipeline flowchart covering build, test, staging, prod, and rollback.`
- Prompt: `Generate an ASCII deploy-pipeline flowchart covering build, test, staging, prod, and rollback.`
- Expected signals: Intent resolves to `FLOWCHART`; loaded resources match `expected_resources`.
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.
- Pass/fail: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Generate an ASCII deploy-pipeline flowchart covering build, test, staging, prod, and rollback.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Generate an ASCII deploy-pipeline flowchart covering build, test, staging, prod, and rollback.
```

### Expected

Intent resolves to `FLOWCHART`; loaded resources match `expected_resources`.

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: `FLOWCHART`
- **Resources loaded**:
  - `assets/flowcharts/simple-workflow.md`
  - `assets/flowcharts/decision-tree-flow.md`
  - ONLY (no `references/*` loaded)
- **Outcome**: CLI emits an ASCII flowchart matching one of the asset templates, demonstrating the deploy pipeline with rollback decision branch.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: produces clean ASCII grid; foreground OK.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact; expect a single fenced block.

**Success Criteria**

- intent_picked == `FLOWCHART`
- false_positive_resource_load_count <= 1 (no references/* loaded)
- response is non-empty and uses at least one flowchart-template structure


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

- Group: Resource Loading
- Playbook ID: SD-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `resource-loading/assets-only.md`

