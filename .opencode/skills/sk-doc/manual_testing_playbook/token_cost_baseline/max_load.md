---
id: SD-015
category: token_cost_baseline
title: 'Ceiling token cost: ON_DEMAND_KEYWORDS load all RESOURCE_MAP'
expected_intent: ON_DEMAND_ALL
expected_resources:
  - references/validation.md
  - create-quality-control/references/workflows.md
  - references/core_standards.md
  - references/evergreen_packet_id_rule.md
  - references/hvr_rules.md
  - create-quality-control/references/optimization.md
  - references/skill_creation.md
  - references/README.md
  - references/README.md
  - references/README.md
  - references/README.md
  - references/README.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_readme_template.md
  - assets/skill/skill_reference_template.md
  - assets/agent_template.md
  - assets/command/command_template.md
  - assets/readme/readme_template.md
  - assets/changelog_template.md
  - assets/flowcharts/simple_workflow.md
  - assets/flowcharts/decision_tree_flow.md
expected_workflow_mode: create-agent+create-benchmark+create-changelog+create-command+create-diff+create-feature-catalog+create-flowchart+create-manual-testing-playbook+create-quality-control+create-readme+create-skill+create-skill-parent
full_inventory_intent: true
expected_leaf_resources:
  - workflow_mode: create-agent
    leaf_resource_id: assets/agent_template.md
  - workflow_mode: create-agent
    leaf_resource_id: references/README.md
  - workflow_mode: create-agent
    leaf_resource_id: references/agent-vs-skill-vs-command.md
  - workflow_mode: create-agent
    leaf_resource_id: references/common_pitfalls.md
  - workflow_mode: create-agent
    leaf_resource_id: references/permission_design.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/behavior_benchmark/behavior_benchmark_baseline_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/behavior_benchmark/behavior_benchmark_index_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/behavior_benchmark/behavior_benchmark_scenario_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance_benchmark/conformance_benchmark_contract_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance_benchmark/conformance_benchmark_fixture_manifest_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance_benchmark/conformance_benchmark_lane_config_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance_benchmark/conformance_benchmark_readme_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/model_benchmark/model_benchmark_code_task_fixture_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/model_benchmark/model_benchmark_pattern_fixture_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/model_benchmark/model_benchmark_profile_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/shared/benchmark_report_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/shared/source_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/skill_benchmark/skill_benchmark_readme_template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/agent_improvement/agent_improvement_authoring_guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/behavior_benchmark/behavior_benchmark_guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/conformance_benchmark/conformance_benchmark_authoring_guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/model_benchmark/model_benchmark_fixture_guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/README.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/case_studies.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/command_benchmark_composition.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/pitfalls.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/worked_example.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/skill_benchmark/skill_benchmark_storage_guide.md
  - workflow_mode: create-changelog
    leaf_resource_id: assets/changelog_template.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/README.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/topology_edge_cases.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/version_bump_rules.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/worked_examples.md
  - workflow_mode: create-command
    leaf_resource_id: assets/command_contract.json
  - workflow_mode: create-command
    leaf_resource_id: assets/command_contract.schema.json
  - workflow_mode: create-command
    leaf_resource_id: assets/command_presentation_template.md
  - workflow_mode: create-command
    leaf_resource_id: assets/command_router_template.md
  - workflow_mode: create-command
    leaf_resource_id: assets/command_template.md
  - workflow_mode: create-command
    leaf_resource_id: references/README.md
  - workflow_mode: create-command
    leaf_resource_id: references/argument_hints_and_modes.md
  - workflow_mode: create-command
    leaf_resource_id: references/common_pitfalls.md
  - workflow_mode: create-command
    leaf_resource_id: references/router_presentation_split.md
  - workflow_mode: create-command
    leaf_resource_id: references/worked_example.md
  - workflow_mode: create-diff
    leaf_resource_id: assets/fixtures/README.md
  - workflow_mode: create-diff
    leaf_resource_id: assets/fixtures/onboarding-after.md
  - workflow_mode: create-diff
    leaf_resource_id: assets/fixtures/onboarding-before.md
  - workflow_mode: create-diff
    leaf_resource_id: references/README.md
  - workflow_mode: create-diff
    leaf_resource_id: references/accessibility-contract.md
  - workflow_mode: create-diff
    leaf_resource_id: references/capabilities-and-fidelity.md
  - workflow_mode: create-diff
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: create-diff
    leaf_resource_id: references/worked-example.md
  - workflow_mode: create-diff
    leaf_resource_id: references/workflow.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: assets/feature_catalog_snippet_template.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: assets/feature_catalog_template.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: references/README.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: references/common_pitfalls.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: references/examples.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/approval_workflow_loops.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/decision_tree_flow.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/parallel_execution.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/simple_workflow.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/system_architecture_swimlane.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/user_onboarding.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/README.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/notation_and_validator.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/pattern_selection.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/worked_example.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: assets/manual_testing_playbook_snippet_template.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: assets/manual_testing_playbook_template.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/README.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/common_pitfalls.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/examples.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/prompt_voice.md
  - workflow_mode: create-quality-control
    leaf_resource_id: assets/llmstxt_templates.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/README.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/core_standards.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/evergreen_packet_id_rule.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/hvr_rules.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/optimization.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/transformation_patterns.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/validation_and_enforcement.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/workflow_examples.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/install_guide_template.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/readme_code_template.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/readme_template.md
  - workflow_mode: create-readme
    leaf_resource_id: references/README.md
  - workflow_mode: create-readme
    leaf_resource_id: references/install_guide/quality_and_standards.md
  - workflow_mode: create-readme
    leaf_resource_id: references/install_guide/section_examples.md
  - workflow_mode: create-readme
    leaf_resource_id: references/readme/quality_and_checklist.md
  - workflow_mode: create-readme
    leaf_resource_id: references/readme/types_and_voice.md
  - workflow_mode: create-readme
    leaf_resource_id: references/readme/writing_patterns.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/parent_skill_description_template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/parent_skill_graph_metadata_template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/parent_skill_hub_router_template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/parent_skill_hub_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/parent_skill_registry_template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/parent_skill_smart_routing_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/scaffold/hub_skill_scaffold.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent_skill/scaffold/packet_skill_scaffold.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_asset_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_md_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_procedure_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_readme_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_reference_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_scaffold_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_smart_router.md
  - workflow_mode: create-skill
    leaf_resource_id: references/README.md
  - workflow_mode: create-skill
    leaf_resource_id: references/parent_skill/parent_hub_router_schema.md
  - workflow_mode: create-skill
    leaf_resource_id: references/parent_skill/parent_skills_nested_packets.md
  - workflow_mode: create-skill
    leaf_resource_id: references/shared/common_pitfalls.md
  - workflow_mode: create-skill
    leaf_resource_id: references/shared/overview.md
  - workflow_mode: create-skill
    leaf_resource_id: references/shared/validation_and_packaging.md
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/creation_workflow.md
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/examples_and_maintenance.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/parent_skill_description_template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/parent_skill_graph_metadata_template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/parent_skill_hub_router_template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/parent_skill_hub_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/parent_skill_registry_template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/parent_skill_smart_routing_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/scaffold/hub_skill_scaffold.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent_skill/scaffold/packet_skill_scaffold.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill_asset_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill_md_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill_procedure_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill_readme_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill_reference_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill_scaffold_template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill_smart_router.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/README.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/parent_skill/parent_hub_router_schema.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/parent_skill/parent_skills_nested_packets.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/shared/common_pitfalls.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/shared/overview.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/shared/validation_and_packaging.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/skill/creation_workflow.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/skill/examples_and_maintenance.md
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
- Feature file path: `token_cost_baseline/max_load.md`
