---
id: SD-007
title: 'Ambiguous prompt scores DOC_QUALITY and FLOWCHART within delta'
description: "This scenario validates ambiguous DOC_QUALITY and FLOWCHART routing for SD-007."
stage: routing
expected_intent: sk-create-quality-control+sk-create-diagram
expected_resources:
  - shared/references/validation.md
  - sk-create-quality-control/references/workflows.md
  - shared/references/core-standards.md
  - shared/references/evergreen-packet-id-rule.md
  - sk-create-diagram/assets/ascii-patterns/simple-workflow.md
  - sk-create-diagram/assets/ascii-patterns/decision-tree-flow.md
expected_workflow_mode: sk-create-quality-control+sk-create-diagram
expected_leaf_resources:
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/core-standards.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/evergreen-packet-id-rule.md
  - workflow_mode: sk-create-diagram
    leaf_resource_id: assets/simple-workflow.md
  - workflow_mode: sk-create-diagram
    leaf_resource_id: assets/decision-tree-flow.md
version: 1.8.0.6
---

# SD-007: Ambiguous Multi-Intent Disambiguation

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-007`.

---

## 1. OVERVIEW

This scenario validates ambiguous DOC_QUALITY and FLOWCHART routing for `SD-007`. It focuses on preserving both candidate intents when a prompt asks for document improvement and flowchart additions.

### Why This Matters

Ambiguous prompts should surface a tie or combined route instead of silently discarding one valid interpretation. This scenario catches overconfident single-intent routing that would either skip quality standards or omit the requested diagram assets.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc routes the scenario to `DOC_QUALITY+FLOWCHART` with the expected resources.
- Real user request: `Improve doc quality and add flowcharts for the new feature docs.`
- Prompt: `Improve doc quality and add flowcharts for the new feature docs.`
- Expected signals: Intent resolves to `DOC_QUALITY+FLOWCHART`; loaded resources match `expected_resources`.
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.
- Pass/fail: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Improve doc quality and add flowcharts for the new feature docs.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Improve doc quality and add flowcharts for the new feature docs.
```

### Expected

Intent resolves to `DOC_QUALITY+FLOWCHART`; loaded resources match `expected_resources`.

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: top-2 within `AMBIGUITY_DELTA=1`: `DOC_QUALITY` and `FLOWCHART`
- **Resources loaded**: union set from both intents (validation/core_standards + flowchart assets)
- **Outcome**: CLI either (a) loads both intents' resources and produces a combined response, or (b) explicitly asks the user to disambiguate, citing both candidate intents and their scores.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: tends to pick top-1 silently — verify it surfaces both.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: may run both intents in sequence; verify resource loads.

**Success Criteria**

- top-2 intents include both `DOC_QUALITY` and `FLOWCHART` within delta=1
- response either disambiguates OR loads union of expected_resources
- false_positive_resource_load_count <= 2 (slack for union load)


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

- Group: Unknown Fallback
- Playbook ID: SD-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `unknown-fallback/ambiguous-multi-intent.md`

