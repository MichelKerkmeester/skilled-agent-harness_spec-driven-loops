---
id: SD-014
title: 'Median token cost: SKILL_CREATION query, 4 resources'
description: "This scenario validates medium-load SKILL_CREATION token-cost behavior for SD-014."
stage: routing
expected_intent: sk-create-skill
expected_resources:
  - sk-create-skill/references/skill/creation-workflow.md
  - sk-create-skill/assets/skill/skill-md-template.md
  - sk-create-skill/assets/skill/skill-readme-template.md
  - sk-create-skill/assets/skill/skill-reference-template.md
expected_workflow_mode: sk-create-skill
expected_leaf_resources:
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-reference-template.md
version: 1.8.0.7
---

# SD-014: Medium-Load Token Cost (Median)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-014`.

---

## 1. OVERVIEW

This scenario validates medium-load SKILL_CREATION token-cost behavior for `SD-014`. It focuses on a typical skill-scaffolding request that should load four creation resources and establish the median baseline.

### Why This Matters

Skill creation is resource-heavy enough to reveal normal routing cost without being a stress case. This scenario catches missing template loads, excessive adjacent resources, and token counts that drift away from the expected middle of the SD-013 to SD-015 range.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc routes the scenario to `SKILL_CREATION` with the expected resources.
- Real user request: `Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.`
- Prompt: `Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.`
- Expected signals: Intent resolves to `SKILL_CREATION`; loaded resources match `expected_resources`.
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.
- Pass/fail: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.
```

### Expected

Intent resolves to `SKILL_CREATION`; loaded resources match `expected_resources`.

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: `SKILL_CREATION`
- **Resources loaded**: 4 (skill_creation reference + SKILL.md, skill README and reference templates).
- **Outcome**: CLI emits a populated `SKILL.md` scaffold, optional README scaffold and starter reference doc. This establishes the MEDIAN token cost per CLI.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: record input/output token counts as median baseline.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: record input/output token counts as median baseline.

**Success Criteria**

- intent_picked == `SKILL_CREATION`
- exactly 4 RESOURCE_MAP resources loaded (false_positive_resource_load_count <= 1)
- per-CLI median token cost recorded; should fall between SD-013 floor and SD-015 ceiling


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

- Group: Token Cost Baseline
- Playbook ID: SD-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `token-cost-baseline/medium-load.md`

