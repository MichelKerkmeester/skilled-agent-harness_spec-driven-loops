# sk-doc Surface Router — per-intent leaf sets

This is sk-doc's second-layer (surface) router. The hub selects a workflow mode in
`hub-router.json`; this doc maps a request's intent to the exact packet-local leaf
resources that mode should load. Every path is either packet-qualified
(`<packet>/references|assets/…`) or a shared-alias disk path (`shared/…`); both
convert to the canonical `(workflowMode, leafResourceId)` pair at the one contract
boundary. `FULL_INVENTORY` is the single explicit full-toolkit intent — no other
intent enumerates the whole hub.

```python
INTENT_SIGNALS = {
    "DOC_QUALITY": {"weight": 4, "keywords": ["documentation quality", "doc quality", "validate documentation", "validation rules", "fail sk-doc standards"]},
    "OPTIMIZATION": {"weight": 4, "keywords": ["optimize", "token efficiency", "llms.txt", "llmstxt"]},
    "SKILL_CREATION": {"weight": 4, "keywords": ["sk-skill", "create a new sk", "create sk-", "skill.md scaffold", "skill.md and starter", "resource_map wiring"]},
    "AGENT_COMMAND": {"weight": 4, "keywords": ["agent and paired", "paired /create", "@analyze agent"]},
    "FLOWCHART": {"weight": 4, "keywords": ["flowchart", "ascii"]},
    "INSTALL_GUIDE": {"weight": 4, "keywords": ["install guide"]},
    "HVR": {"weight": 4, "keywords": ["hvr"]},
    "PLAYBOOK": {"weight": 4, "keywords": ["playbook system", "manual testing playbook", "testing playbook"]},
    "FEATURE_CATALOG": {"weight": 4, "keywords": ["feature catalog"]},
    "README_CREATION": {"weight": 4, "keywords": ["create a readme", "readme for", "a readme"]},
    "CHANGELOG": {"weight": 4, "keywords": ["changelog"]},
    "FULL_INVENTORY": {"weight": 4, "keywords": ["full sk-doc toolkit", "all templates", "show the full", "entire toolkit", "everything sk-doc offers"]},
}

RESOURCE_MAP = {
    "DOC_QUALITY": [
        "shared/references/validation.md",
        "create-quality-control/references/workflows.md",
        "shared/references/core_standards.md",
        "shared/references/evergreen_packet_id_rule.md"
    ],
    "OPTIMIZATION": [
        "create-quality-control/references/optimization.md",
        "shared/assets/llmstxt_templates.md"
    ],
    "SKILL_CREATION": [
        "create-skill/references/skill/creation_workflow.md",
        "create-skill/assets/skill/skill_md_template.md",
        "create-skill/assets/skill/skill_readme_template.md",
        "create-skill/assets/skill/skill_reference_template.md"
    ],
    "AGENT_COMMAND": [
        "create-agent/references/README.md",
        "create-agent/assets/agent_template.md",
        "create-command/references/README.md",
        "create-command/assets/command_template.md"
    ],
    "FLOWCHART": [
        "create-flowchart/assets/simple_workflow.md",
        "create-flowchart/assets/decision_tree_flow.md"
    ],
    "INSTALL_GUIDE": [
        "create-readme/assets/install_guide_template.md",
        "create-readme/references/README.md"
    ],
    "HVR": [
        "shared/references/hvr_rules.md"
    ],
    "PLAYBOOK": [
        "create-manual-testing-playbook/references/README.md"
    ],
    "FEATURE_CATALOG": [
        "create-feature-catalog/references/README.md"
    ],
    "README_CREATION": [
        "create-readme/references/README.md",
        "create-readme/assets/readme_template.md"
    ],
    "CHANGELOG": [
        "shared/assets/changelog_template.md"
    ],
    "FULL_INVENTORY": [
        "create-agent/assets/agent_template.md",
        "create-agent/references/README.md",
        "create-agent/references/agent-vs-skill-vs-command.md",
        "create-agent/references/common_pitfalls.md",
        "create-agent/references/permission_design.md",
        "create-benchmark/assets/behavior_benchmark/behavior_benchmark_baseline_template.md",
        "create-benchmark/assets/behavior_benchmark/behavior_benchmark_index_template.md",
        "create-benchmark/assets/behavior_benchmark/behavior_benchmark_scenario_template.md",
        "create-benchmark/assets/conformance_benchmark/conformance_benchmark_contract_template.md",
        "create-benchmark/assets/conformance_benchmark/conformance_benchmark_fixture_manifest_template.md",
        "create-benchmark/assets/conformance_benchmark/conformance_benchmark_lane_config_template.md",
        "create-benchmark/assets/conformance_benchmark/conformance_benchmark_readme_template.md",
        "create-benchmark/assets/model_benchmark/model_benchmark_code_task_fixture_template.md",
        "create-benchmark/assets/model_benchmark/model_benchmark_pattern_fixture_template.md",
        "create-benchmark/assets/model_benchmark/model_benchmark_profile_template.md",
        "create-benchmark/assets/shared/benchmark_report_template.md",
        "create-benchmark/assets/shared/source_template.md",
        "create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md",
        "create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md",
        "create-benchmark/references/behavior_benchmark/behavior_benchmark_guide.md",
        "create-benchmark/references/conformance_benchmark/conformance_benchmark_authoring_guide.md",
        "create-benchmark/references/model_benchmark/model_benchmark_fixture_guide.md",
        "create-benchmark/references/shared/README.md",
        "create-benchmark/references/shared/case_studies.md",
        "create-benchmark/references/shared/command_benchmark_composition.md",
        "create-benchmark/references/shared/pitfalls.md",
        "create-benchmark/references/shared/worked_example.md",
        "create-benchmark/references/skill_benchmark/skill_benchmark_storage_guide.md",
        "shared/assets/changelog_template.md",
        "create-changelog/references/README.md",
        "create-changelog/references/topology_edge_cases.md",
        "create-changelog/references/version_bump_rules.md",
        "create-changelog/references/worked_examples.md",
        "create-command/assets/command_contract.json",
        "create-command/assets/command_contract.schema.json",
        "create-command/assets/command_presentation_template.md",
        "create-command/assets/command_router_template.md",
        "create-command/assets/command_template.md",
        "create-command/references/README.md",
        "create-command/references/argument_hints_and_modes.md",
        "create-command/references/common_pitfalls.md",
        "create-command/references/router_presentation_split.md",
        "create-command/references/worked_example.md",
        "create-diff/assets/fixtures/README.md",
        "create-diff/assets/fixtures/onboarding-after.md",
        "create-diff/assets/fixtures/onboarding-before.md",
        "create-diff/references/README.md",
        "create-diff/references/accessibility-contract.md",
        "create-diff/references/capabilities-and-fidelity.md",
        "create-diff/references/cli-reference.md",
        "create-diff/references/worked-example.md",
        "create-diff/references/workflow.md",
        "create-feature-catalog/assets/feature_catalog_snippet_template.md",
        "create-feature-catalog/assets/feature_catalog_template.md",
        "create-feature-catalog/references/README.md",
        "create-feature-catalog/references/common_pitfalls.md",
        "create-feature-catalog/references/examples.md",
        "create-flowchart/assets/approval_workflow_loops.md",
        "create-flowchart/assets/decision_tree_flow.md",
        "create-flowchart/assets/parallel_execution.md",
        "create-flowchart/assets/simple_workflow.md",
        "create-flowchart/assets/system_architecture_swimlane.md",
        "create-flowchart/assets/user_onboarding.md",
        "create-flowchart/references/README.md",
        "create-flowchart/references/notation_and_validator.md",
        "create-flowchart/references/pattern_selection.md",
        "create-flowchart/references/worked_example.md",
        "create-manual-testing-playbook/assets/manual_testing_playbook_snippet_template.md",
        "create-manual-testing-playbook/assets/manual_testing_playbook_template.md",
        "create-manual-testing-playbook/references/README.md",
        "create-manual-testing-playbook/references/common_pitfalls.md",
        "create-manual-testing-playbook/references/examples.md",
        "create-manual-testing-playbook/references/prompt_voice.md",
        "shared/assets/llmstxt_templates.md",
        "create-quality-control/references/README.md",
        "create-quality-control/references/optimization.md",
        "create-quality-control/references/transformation_patterns.md",
        "create-quality-control/references/validation_and_enforcement.md",
        "create-quality-control/references/workflow_examples.md",
        "create-quality-control/references/workflows.md",
        "create-readme/assets/install_guide_template.md",
        "create-readme/assets/readme_code_template.md",
        "create-readme/assets/readme_template.md",
        "create-readme/references/README.md",
        "create-readme/references/install_guide/quality_and_standards.md",
        "create-readme/references/install_guide/section_examples.md",
        "create-readme/references/readme/quality_and_checklist.md",
        "create-readme/references/readme/types_and_voice.md",
        "create-readme/references/readme/writing_patterns.md",
        "create-skill/assets/parent_skill/parent_skill_description_template.json",
        "create-skill/assets/parent_skill/parent_skill_graph_metadata_template.json",
        "create-skill/assets/parent_skill/parent_skill_hub_router_template.json",
        "create-skill/assets/parent_skill/parent_skill_hub_template.md",
        "create-skill/assets/parent_skill/parent_skill_registry_template.json",
        "create-skill/assets/parent_skill/scaffold/hub_skill_scaffold.md",
        "create-skill/assets/parent_skill/scaffold/packet_skill_scaffold.md",
        "create-skill/assets/skill/skill_asset_template.md",
        "create-skill/assets/skill/skill_md_template.md",
        "create-skill/assets/skill/skill_procedure_template.md",
        "create-skill/assets/skill/skill_readme_template.md",
        "create-skill/assets/skill/skill_reference_template.md",
        "create-skill/assets/skill/skill_scaffold_template.md",
        "create-skill/assets/skill/skill_smart_router.md",
        "create-skill/references/README.md",
        "create-skill/references/parent_skill/parent_hub_router_schema.md",
        "create-skill/references/parent_skill/parent_skills_nested_packets.md",
        "create-skill/references/shared/common_pitfalls.md",
        "create-skill/references/shared/overview.md",
        "create-skill/references/shared/validation_and_packaging.md",
        "create-skill/references/skill/creation_workflow.md",
        "create-skill/references/skill/examples_and_maintenance.md"
    ],
}
```

## How to read this

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair.
- No keyword match is UNKNOWN_FALLBACK: confirm the target artifact and intent
  before loading anything.
- `FULL_INVENTORY` fires only on an explicit "show the whole toolkit" request.
