---
id: SD-014
category: token_cost_baseline
title: 'Median token cost: SKILL_CREATION query, 4 resources'
expected_intent: SKILL_CREATION
expected_resources:
  - references/skill_creation.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_readme_template.md
  - assets/skill/skill_reference_template.md
expected_workflow_mode: create-skill
expected_leaf_resources:
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/creation_workflow.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_md_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_readme_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_reference_template.md
expected_token_range_input: 1500-3000
expected_token_range_output: 2000-4000
created: 2026-05-05
version: 1.8.0.7
---

# SD-014: Medium-Load Token Cost (Median)

## 1. OVERVIEW

This scenario validates medium-load SKILL_CREATION token-cost behavior for `SD-014`. It focuses on a typical skill-scaffolding request that should load four creation resources and establish the median baseline.

### Why This Matters

Skill creation is resource-heavy enough to reveal normal routing cost without being a stress case. This scenario catches missing template loads, excessive adjacent resources, and token counts that drift away from the expected middle of the SD-013 to SD-015 range.

---

## 2. SCENARIO CONTRACT

- Real user request: `Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.`
- Prompt: `Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.`
- Expected intent: `SKILL_CREATION`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-014 | Median token cost: SKILL_CREATION query, 4 resources | Verify sk-doc routes the scenario to `SKILL_CREATION` with the expected resources. | `Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `SKILL_CREATION`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Create sk-graph-rag with index/query intents, a SKILL.md scaffold, and a starter reference doc.
```

(Typical SKILL_CREATION query: four resources loaded.)

## Expected Behavior

- **Intent picked**: `SKILL_CREATION`
- **Resources loaded**: 4 (skill_creation reference + SKILL.md, skill README and reference templates).
- **Outcome**: CLI emits a populated `SKILL.md` scaffold, optional README scaffold and starter reference doc. This establishes the MEDIAN token cost per CLI.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: record input/output token counts as median baseline.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: record input/output token counts as median baseline.

## Success Criteria

- intent_picked == `SKILL_CREATION`
- exactly 4 RESOURCE_MAP resources loaded (false_positive_resource_load_count <= 1)
- per-CLI median token cost recorded; should fall between SD-013 floor and SD-015 ceiling

## 4. SOURCE METADATA

- Group: Token Cost Baseline
- Playbook ID: SD-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `token_cost_baseline/medium_load.md`
