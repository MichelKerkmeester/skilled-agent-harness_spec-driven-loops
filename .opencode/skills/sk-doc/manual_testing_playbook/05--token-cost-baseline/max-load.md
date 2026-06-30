---
id: SD-015
category: 05--token-cost-baseline
title: 'Ceiling token cost: ON_DEMAND_KEYWORDS load all RESOURCE_MAP'
expected_intent: ON_DEMAND_ALL
expected_resources:
  - references/global/validation.md
  - references/global/workflows.md
  - references/global/core_standards.md
  - references/global/evergreen_packet_id_rule.md
  - references/global/hvr_rules.md
  - references/global/optimization.md
  - references/skill_creation.md
  - references/agent_creation.md
  - references/readme_creation.md
  - references/feature_catalog_creation.md
  - references/manual_testing_playbook_creation.md
  - references/install_guide_creation.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_readme_template.md
  - assets/skill/skill_reference_template.md
  - assets/agent_template.md
  - assets/command/command_template.md
  - assets/readme/readme_template.md
  - assets/changelog_template.md
  - assets/flowcharts/simple_workflow.md
  - assets/flowcharts/decision_tree_flow.md
expected_token_range_input: 5000-10000
expected_token_range_output: 2000-3000
created: 2026-05-05
version: 1.8.0.9
---

# SD-015: Max-Load Token Cost (Ceiling)

## 1. OVERVIEW

This scenario validates ON_DEMAND_ALL ceiling token-cost behavior for `SD-015`. It focuses on a full-toolkit prompt that should intentionally load the complete sk-doc resource map.

### Why This Matters

The ceiling case proves that load-all behavior is available only when explicitly requested and gives operators an upper-bound cost baseline. This scenario catches accidental truncation, missing resource-map entries, and unbounded expansion beyond the enumerated toolkit.

---

## 2. SCENARIO CONTRACT

- Real user request: `Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.`
- Prompt: `Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.`
- Expected intent: `ON_DEMAND_ALL`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-015 | Ceiling token cost: ON_DEMAND_KEYWORDS load all RESOURCE_MAP | Verify sk-doc routes the scenario to `ON_DEMAND_ALL` with the expected resources. | `Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `ON_DEMAND_ALL`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.
```

(Contains ON_DEMAND_KEYWORDS: "full template", "all frameworks", "format guide" — triggers ON_DEMAND load of every RESOURCE_MAP entry.)

## Expected Behavior

- **Intent picked**: ON_DEMAND fallback (load-all)
- **Resources loaded**: every reference + asset enumerated in `RESOURCE_MAP` (all 11 intents' resources).
- **Outcome**: CLI emits a directory-style summary of loaded resources, NOT a normal intent-specific output. This establishes the CEILING token cost per CLI.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: stress-tests context window; record peak input tokens.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: may truncate output; record peak input tokens.

## Success Criteria

- ON_DEMAND_KEYWORDS triggered; load-all engaged
- all 22 enumerated resources appear in the loaded set (false_positive_resource_load_count tolerated up to 3 for any new RESOURCE_MAP additions)
- per-CLI ceiling token cost recorded; should be the upper bound of SD-013/SD-014/SD-015 spectrum

## 4. SOURCE METADATA

- Group: Token Cost Baseline
- Playbook ID: SD-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--token-cost-baseline/max-load.md`
