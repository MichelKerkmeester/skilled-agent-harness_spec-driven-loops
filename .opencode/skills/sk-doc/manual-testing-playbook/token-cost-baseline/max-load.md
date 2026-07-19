---
id: SD-015
category: token_cost_baseline
title: 'Ceiling token cost: ON_DEMAND_KEYWORDS load all RESOURCE_MAP'
expected_intent: UNKNOWN
expected_resources:
  - create-agent/assets/agent-template.md
  - create-agent/references/README.md
  - create-agent/references/agent-vs-skill-vs-command.md
  - create-agent/references/common-pitfalls.md
  - create-agent/references/permission-design.md
  - create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md
  - create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md
  - create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md
  - create-benchmark/assets/conformance-benchmark/conformance-benchmark-contract-template.md
  - create-benchmark/assets/conformance-benchmark/conformance-benchmark-fixture-manifest-template.md
  - create-benchmark/assets/conformance-benchmark/conformance-benchmark-lane-config-template.md
  - create-benchmark/assets/conformance-benchmark/conformance-benchmark-readme-template.md
  - create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md
  - create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md
  - create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md
  - create-benchmark/assets/shared/benchmark-report-template.md
  - create-benchmark/assets/shared/source-template.md
  - create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md
  - create-benchmark/references/agent-improvement/agent-improvement-authoring-guide.md
  - create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md
  - create-benchmark/references/conformance-benchmark/conformance-benchmark-authoring-guide.md
  - create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md
  - create-benchmark/references/shared/README.md
  - create-benchmark/references/shared/case-studies.md
  - create-benchmark/references/shared/command-benchmark-composition.md
  - create-benchmark/references/shared/pitfalls.md
  - create-benchmark/references/shared/worked-example.md
  - create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md
  - shared/assets/changelog-template.md
  - create-changelog/references/README.md
  - create-changelog/references/topology-edge-cases.md
  - create-changelog/references/version-bump-rules.md
  - create-changelog/references/worked-examples.md
  - create-command/assets/command-contract.json
  - create-command/assets/command-contract.schema.json
  - create-command/assets/command-presentation-template.md
  - create-command/assets/command-router-template.md
  - create-command/assets/command-template.md
  - create-command/references/README.md
  - create-command/references/argument-hints-and-modes.md
  - create-command/references/common-pitfalls.md
  - create-command/references/router-presentation-split.md
  - create-command/references/worked-example.md
  - create-diff/assets/fixtures/README.md
  - create-diff/assets/fixtures/onboarding-after.md
  - create-diff/assets/fixtures/onboarding-before.md
  - create-diff/references/README.md
  - create-diff/references/accessibility-contract.md
  - create-diff/references/capabilities-and-fidelity.md
  - create-diff/references/cli-reference.md
  - create-diff/references/worked-example.md
  - create-diff/references/workflow.md
  - create-feature-catalog/assets/feature-catalog-snippet-template.md
  - create-feature-catalog/assets/feature-catalog-template.md
  - create-feature-catalog/references/README.md
  - create-feature-catalog/references/common-pitfalls.md
  - create-feature-catalog/references/examples.md
  - create-flowchart/assets/approval-workflow-loops.md
  - create-flowchart/assets/decision-tree-flow.md
  - create-flowchart/assets/parallel-execution.md
  - create-flowchart/assets/simple-workflow.md
  - create-flowchart/assets/system-architecture-swimlane.md
  - create-flowchart/assets/user-onboarding.md
  - create-flowchart/references/README.md
  - create-flowchart/references/notation-and-validator.md
  - create-flowchart/references/pattern-selection.md
  - create-flowchart/references/worked-example.md
  - create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md
  - create-manual-testing-playbook/assets/manual-testing-playbook-template.md
  - create-manual-testing-playbook/references/README.md
  - create-manual-testing-playbook/references/common-pitfalls.md
  - create-manual-testing-playbook/references/examples.md
  - create-manual-testing-playbook/references/prompt-voice.md
  - shared/assets/llmstxt-templates.md
  - shared/references/core-standards.md
  - shared/references/evergreen-packet-id-rule.md
  - shared/references/hvr-rules.md
  - shared/references/validation.md
  - create-quality-control/references/README.md
  - create-quality-control/references/optimization.md
  - create-quality-control/references/transformation-patterns.md
  - create-quality-control/references/validation-and-enforcement.md
  - create-quality-control/references/workflow-examples.md
  - create-quality-control/references/workflows.md
  - create-readme/assets/install-guide-template.md
  - create-readme/assets/readme-code-template.md
  - create-readme/assets/readme-template.md
  - create-readme/references/README.md
  - create-readme/references/install-guide/quality-and-standards.md
  - create-readme/references/install-guide/section-examples.md
  - create-readme/references/readme/quality-and-checklist.md
  - create-readme/references/readme/types-and-voice.md
  - create-readme/references/readme/writing-patterns.md
  - create-skill/assets/parent-skill/parent-skill-description-template.json
  - create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json
  - create-skill/assets/parent-skill/parent-skill-hub-router-template.json
  - create-skill/assets/parent-skill/parent-skill-hub-template.md
  - create-skill/assets/parent-skill/parent-skill-registry-template.json
  - create-skill/assets/parent-skill/parent-skill-smart-routing-template.md
  - create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md
  - create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md
  - create-skill/assets/skill/skill-asset-template.md
  - create-skill/assets/skill/skill-md-template.md
  - create-skill/assets/skill/skill-procedure-template.md
  - create-skill/assets/skill/skill-readme-template.md
  - create-skill/assets/skill/skill-reference-template.md
  - create-skill/assets/skill/skill-scaffold-template.md
  - create-skill/assets/skill/skill-smart-router.md
  - create-skill/references/README.md
  - create-skill/references/parent-skill/parent-hub-router-schema.md
  - create-skill/references/parent-skill/parent-skills-nested-packets.md
  - create-skill/references/shared/common-pitfalls.md
  - create-skill/references/shared/overview.md
  - create-skill/references/shared/validation-and-packaging.md
  - create-skill/references/skill/creation-workflow.md
  - create-skill/references/skill/examples-and-maintenance.md
expected_workflow_mode: create-agent+create-benchmark+create-changelog+create-command+create-diff+create-feature-catalog+create-flowchart+create-manual-testing-playbook+create-quality-control+create-readme+create-skill+create-skill-parent
full_inventory_intent: true
expected_leaf_resources:
  - workflow_mode: create-agent
    leaf_resource_id: assets/agent-template.md
  - workflow_mode: create-agent
    leaf_resource_id: references/README.md
  - workflow_mode: create-agent
    leaf_resource_id: references/agent-vs-skill-vs-command.md
  - workflow_mode: create-agent
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: create-agent
    leaf_resource_id: references/permission-design.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/behavior-benchmark/behavior-benchmark-baseline-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/behavior-benchmark/behavior-benchmark-index-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/behavior-benchmark/behavior-benchmark-scenario-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance-benchmark/conformance-benchmark-contract-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance-benchmark/conformance-benchmark-fixture-manifest-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance-benchmark/conformance-benchmark-lane-config-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/conformance-benchmark/conformance-benchmark-readme-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/model-benchmark/model-benchmark-code-task-fixture-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/model-benchmark/model-benchmark-pattern-fixture-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/model-benchmark/model-benchmark-profile-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/shared/benchmark-report-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/shared/source-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: assets/skill-benchmark/skill-benchmark-readme-template.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/agent-improvement/agent-improvement-authoring-guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/behavior-benchmark/behavior-benchmark-guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/conformance-benchmark/conformance-benchmark-authoring-guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/model-benchmark/model-benchmark-fixture-guide.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/README.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/case-studies.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/command-benchmark-composition.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/pitfalls.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/shared/worked-example.md
  - workflow_mode: create-benchmark
    leaf_resource_id: references/skill-benchmark/skill-benchmark-storage-guide.md
  - workflow_mode: create-changelog
    leaf_resource_id: assets/changelog-template.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/README.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/topology-edge-cases.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/version-bump-rules.md
  - workflow_mode: create-changelog
    leaf_resource_id: references/worked-examples.md
  - workflow_mode: create-command
    leaf_resource_id: assets/command-contract.json
  - workflow_mode: create-command
    leaf_resource_id: assets/command-contract.schema.json
  - workflow_mode: create-command
    leaf_resource_id: assets/command-presentation-template.md
  - workflow_mode: create-command
    leaf_resource_id: assets/command-router-template.md
  - workflow_mode: create-command
    leaf_resource_id: assets/command-template.md
  - workflow_mode: create-command
    leaf_resource_id: references/README.md
  - workflow_mode: create-command
    leaf_resource_id: references/argument-hints-and-modes.md
  - workflow_mode: create-command
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: create-command
    leaf_resource_id: references/router-presentation-split.md
  - workflow_mode: create-command
    leaf_resource_id: references/worked-example.md
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
    leaf_resource_id: assets/feature-catalog-snippet-template.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: assets/feature-catalog-template.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: references/README.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: create-feature-catalog
    leaf_resource_id: references/examples.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/approval-workflow-loops.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/decision-tree-flow.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/parallel-execution.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/simple-workflow.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/system-architecture-swimlane.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/user-onboarding.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/README.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/notation-and-validator.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/pattern-selection.md
  - workflow_mode: create-flowchart
    leaf_resource_id: references/worked-example.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: assets/manual-testing-playbook-snippet-template.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: assets/manual-testing-playbook-template.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/README.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/examples.md
  - workflow_mode: create-manual-testing-playbook
    leaf_resource_id: references/prompt-voice.md
  - workflow_mode: create-quality-control
    leaf_resource_id: assets/llmstxt-templates.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/README.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/core-standards.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/evergreen-packet-id-rule.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/hvr-rules.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/optimization.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/transformation-patterns.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/validation-and-enforcement.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/workflow-examples.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/install-guide-template.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/readme-code-template.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/readme-template.md
  - workflow_mode: create-readme
    leaf_resource_id: references/README.md
  - workflow_mode: create-readme
    leaf_resource_id: references/install-guide/quality-and-standards.md
  - workflow_mode: create-readme
    leaf_resource_id: references/install-guide/section-examples.md
  - workflow_mode: create-readme
    leaf_resource_id: references/readme/quality-and-checklist.md
  - workflow_mode: create-readme
    leaf_resource_id: references/readme/types-and-voice.md
  - workflow_mode: create-readme
    leaf_resource_id: references/readme/writing-patterns.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/parent-skill-description-template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/parent-skill-graph-metadata-template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/parent-skill-hub-router-template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/parent-skill-hub-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/parent-skill-registry-template.json
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/parent-skill-smart-routing-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/scaffold/hub-skill-scaffold.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/parent-skill/scaffold/packet-skill-scaffold.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-asset-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-procedure-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-reference-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-scaffold-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-smart-router.md
  - workflow_mode: create-skill
    leaf_resource_id: references/README.md
  - workflow_mode: create-skill
    leaf_resource_id: references/parent-skill/parent-hub-router-schema.md
  - workflow_mode: create-skill
    leaf_resource_id: references/parent-skill/parent-skills-nested-packets.md
  - workflow_mode: create-skill
    leaf_resource_id: references/shared/common-pitfalls.md
  - workflow_mode: create-skill
    leaf_resource_id: references/shared/overview.md
  - workflow_mode: create-skill
    leaf_resource_id: references/shared/validation-and-packaging.md
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/examples-and-maintenance.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-description-template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-graph-metadata-template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-hub-router-template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-hub-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-registry-template.json
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-smart-routing-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/scaffold/hub-skill-scaffold.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/parent-skill/scaffold/packet-skill-scaffold.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill-asset-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill-procedure-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill-reference-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill-scaffold-template.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: assets/skill/skill-smart-router.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/README.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/parent-skill/parent-hub-router-schema.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/parent-skill/parent-skills-nested-packets.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/shared/common-pitfalls.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/shared/overview.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/shared/validation-and-packaging.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: create-skill-parent
    leaf_resource_id: references/skill/examples-and-maintenance.md
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
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `token-cost-baseline/max-load.md`
