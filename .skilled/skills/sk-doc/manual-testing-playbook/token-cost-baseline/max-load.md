---
id: SD-015
title: 'Ceiling token cost: a full-toolkit request defers instead of fanning out'
description: "SD-015 asserts the fail-safe outcome: a bare full-toolkit request must not fan out across every authoring mode."
stage: negative
expected_intent: UNKNOWN
expected_resources:
  - sk-create-agent/assets/agent-template.md
  - sk-create-agent/references/README.md
  - sk-create-agent/references/agent-vs-skill-vs-command.md
  - sk-create-agent/references/common-pitfalls.md
  - sk-create-agent/references/permission-design.md
  - sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md
  - sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md
  - sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md
  - sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md
  - sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md
  - sk-create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md
  - sk-create-benchmark/assets/shared/benchmark-report-template.md
  - sk-create-benchmark/assets/shared/source-template.md
  - sk-create-benchmark/references/agent-improvement/agent-improvement-authoring-guide.md
  - sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md
  - sk-create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md
  - sk-create-benchmark/references/shared/README.md
  - sk-create-benchmark/references/shared/case-studies.md
  - sk-create-benchmark/references/shared/pitfalls.md
  - sk-create-benchmark/references/shared/worked-example.md
  - sk-create-changelog/assets/changelog-template.md
  - sk-create-changelog/references/README.md
  - sk-create-changelog/references/topology-edge-cases.md
  - sk-create-changelog/references/version-bump-rules.md
  - sk-create-changelog/references/worked-examples.md
  - sk-create-command/assets/command-contract.json
  - sk-create-command/assets/command-contract.schema.json
  - sk-create-command/assets/command-presentation-template.md
  - sk-create-command/assets/command-router-template.md
  - sk-create-command/assets/command-template.md
  - sk-create-command/references/README.md
  - sk-create-command/references/argument-hints-and-modes.md
  - sk-create-command/references/common-pitfalls.md
  - sk-create-command/references/router-presentation-split.md
  - sk-create-command/references/worked-example.md
  - sk-create-diff/assets/fixtures/README.md
  - sk-create-diff/assets/fixtures/onboarding-after.md
  - sk-create-diff/assets/fixtures/onboarding-before.md
  - sk-create-diff/references/README.md
  - sk-create-diff/references/accessibility-contract.md
  - sk-create-diff/references/capabilities-and-fidelity.md
  - sk-create-diff/references/cli-reference.md
  - sk-create-diff/references/worked-example.md
  - sk-create-diff/references/workflow.md
  - sk-create-feature-catalog/assets/feature-catalog-snippet-template.md
  - sk-create-feature-catalog/assets/feature-catalog-template.md
  - sk-create-feature-catalog/references/README.md
  - sk-create-feature-catalog/references/common-pitfalls.md
  - sk-create-feature-catalog/references/examples.md
  - sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md
  - sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md
  - sk-create-manual-testing-playbook/references/README.md
  - sk-create-manual-testing-playbook/references/common-pitfalls.md
  - sk-create-manual-testing-playbook/references/examples.md
  - sk-create-manual-testing-playbook/references/prompt-voice.md
  - shared/assets/llmstxt-templates.md
  - shared/references/core-standards.md
  - shared/references/evergreen-packet-id-rule.md
  - sk-create-with-human-voice/references/hvr-rules.md
  - shared/references/validation.md
  - sk-create-quality-control/references/README.md
  - sk-create-quality-control/references/optimization.md
  - sk-create-quality-control/references/transformation-patterns.md
  - sk-create-quality-control/references/validation-and-enforcement.md
  - sk-create-quality-control/references/workflow-examples.md
  - sk-create-quality-control/references/workflows.md
  - sk-create-readme/assets/readme-code-template.md
  - sk-create-readme/assets/readme-template.md
  - sk-create-readme/references/README.md
  - sk-create-readme/references/readme/quality-and-checklist.md
  - sk-create-readme/references/readme/types-and-voice.md
  - sk-create-readme/references/readme/writing-patterns.md
  - sk-create-skill/assets/parent-skill/parent-skill-description-template.json
  - sk-create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json
  - sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json
  - sk-create-skill/assets/parent-skill/parent-skill-hub-template.md
  - sk-create-skill/assets/parent-skill/parent-skill-registry-template.json
  - sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md
  - sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md
  - sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md
  - sk-create-skill/assets/skill/skill-asset-template.md
  - sk-create-skill/assets/skill/skill-md-template.md
  - sk-create-skill/assets/skill/skill-procedure-template.md
  - sk-create-skill/assets/skill/skill-readme-template.md
  - sk-create-skill/assets/skill/skill-reference-template.md
  - sk-create-skill/assets/skill/skill-scaffold-template.md
  - sk-create-skill/assets/skill/skill-smart-router.md
  - sk-create-skill/references/README.md
  - sk-create-skill/references/parent-skill/parent-hub-router-schema.md
  - sk-create-skill/references/parent-skill/parent-skills-nested-packets.md
  - sk-create-skill/references/shared/common-pitfalls.md
  - sk-create-skill/references/shared/overview.md
  - sk-create-skill/references/shared/validation-and-packaging.md
  - sk-create-skill/references/skill/creation-workflow.md
  - sk-create-skill/references/skill/examples-and-maintenance.md
  - sk-create-skill/assets/skill/skill-graph-metadata-template.json
  - sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json
  - sk-create-skill/assets/skill/skill-sync-manifest-template.md
  - sk-create-skill/references/shared/advisor-index-handoff.md
  - sk-create-skill/references/shared/skill-root-metadata-contract.md
  - sk-create-skill/references/skill/upgrading-a-skill-to-v4.md
  - sk-create-frontmatter/assets/fixtures/README.md
  - sk-create-frontmatter/assets/fixtures/over-budget-description.md
  - sk-create-frontmatter/assets/fixtures/under-budget-trim-lost-tokens.md
  - sk-create-frontmatter/assets/frontmatter-templates.md
  - sk-create-frontmatter/references/README.md
  - sk-create-frontmatter/references/frontmatter-versioning.md
  - sk-create-repo-rule/assets/repo-rule-template.md
  - sk-create-repo-rule/assets/repo-rules-router-template.md
  - sk-create-repo-rule/references/README.md
  - sk-create-repo-rule/references/agents-md-integration.md
  - sk-create-repo-rule/references/creation-standards.md
  - sk-create-repo-rule/references/decision-tests.md
  - sk-create-repo-rule/references/rule-anatomy.md
  - sk-create-with-human-voice/assets/voice-report-template.md
  - sk-create-with-human-voice/references/README.md
  - sk-create-with-human-voice/references/hvr-publish-supplement.md
  - sk-create-with-human-voice/references/scope-and-exemptions.md
  - sk-create-with-human-voice/references/scoring-and-verification.md
  - sk-create-skill/assets/parent-skill/parent-skill-command-metadata-template.json
  - sk-create-skill/assets/parent-skill/parent-skill-leaf-aliases-template.json
  - sk-create-skill/assets/parent-skill/parent-skill-readme-template.md
  - sk-create-skill/references/parent-skill/compiled-routing-architecture.md
  - sk-create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json
expected_workflow_mode: sk-create-skill+sk-create-skill-parent+sk-create-readme+sk-create-agent+sk-create-command+sk-create-feature-catalog+sk-create-manual-testing-playbook+sk-create-benchmark+sk-create-changelog+sk-create-diff+sk-create-frontmatter+sk-create-quality-control+sk-create-repo-rule+sk-create-with-human-voice
full_inventory_intent: true
expected_leaf_resources:
  - workflow_mode: sk-create-agent
    leaf_resource_id: assets/agent-template.md
  - workflow_mode: sk-create-agent
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-agent
    leaf_resource_id: references/agent-vs-skill-vs-command.md
  - workflow_mode: sk-create-agent
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: sk-create-agent
    leaf_resource_id: references/permission-design.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/behavior-benchmark/behavior-benchmark-baseline-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/behavior-benchmark/behavior-benchmark-index-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/behavior-benchmark/behavior-benchmark-scenario-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/model-benchmark/model-benchmark-code-task-fixture-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/model-benchmark/model-benchmark-pattern-fixture-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/model-benchmark/model-benchmark-profile-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/shared/benchmark-report-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: assets/shared/source-template.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: references/agent-improvement/agent-improvement-authoring-guide.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: references/behavior-benchmark/behavior-benchmark-guide.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: references/model-benchmark/model-benchmark-fixture-guide.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: references/shared/README.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: references/shared/case-studies.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: references/shared/pitfalls.md
  - workflow_mode: sk-create-benchmark
    leaf_resource_id: references/shared/worked-example.md
  - workflow_mode: sk-create-changelog
    leaf_resource_id: assets/changelog-template.md
  - workflow_mode: sk-create-changelog
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-changelog
    leaf_resource_id: references/topology-edge-cases.md
  - workflow_mode: sk-create-changelog
    leaf_resource_id: references/version-bump-rules.md
  - workflow_mode: sk-create-changelog
    leaf_resource_id: references/worked-examples.md
  - workflow_mode: sk-create-command
    leaf_resource_id: assets/command-contract.json
  - workflow_mode: sk-create-command
    leaf_resource_id: assets/command-contract.schema.json
  - workflow_mode: sk-create-command
    leaf_resource_id: assets/command-presentation-template.md
  - workflow_mode: sk-create-command
    leaf_resource_id: assets/command-router-template.md
  - workflow_mode: sk-create-command
    leaf_resource_id: assets/command-template.md
  - workflow_mode: sk-create-command
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-command
    leaf_resource_id: references/argument-hints-and-modes.md
  - workflow_mode: sk-create-command
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: sk-create-command
    leaf_resource_id: references/router-presentation-split.md
  - workflow_mode: sk-create-command
    leaf_resource_id: references/worked-example.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: assets/fixtures/README.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: assets/fixtures/onboarding-after.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: assets/fixtures/onboarding-before.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: references/accessibility-contract.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: references/capabilities-and-fidelity.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: references/worked-example.md
  - workflow_mode: sk-create-diff
    leaf_resource_id: references/workflow.md
  - workflow_mode: sk-create-feature-catalog
    leaf_resource_id: assets/feature-catalog-snippet-template.md
  - workflow_mode: sk-create-feature-catalog
    leaf_resource_id: assets/feature-catalog-template.md
  - workflow_mode: sk-create-feature-catalog
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-feature-catalog
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: sk-create-feature-catalog
    leaf_resource_id: references/examples.md
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: assets/fixtures/README.md
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: assets/fixtures/over-budget-description.md
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: assets/fixtures/under-budget-trim-lost-tokens.md
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: assets/frontmatter-templates.md
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-frontmatter
    leaf_resource_id: references/frontmatter-versioning.md
  - workflow_mode: sk-create-manual-testing-playbook
    leaf_resource_id: assets/manual-testing-playbook-snippet-template.md
  - workflow_mode: sk-create-manual-testing-playbook
    leaf_resource_id: assets/manual-testing-playbook-template.md
  - workflow_mode: sk-create-manual-testing-playbook
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-manual-testing-playbook
    leaf_resource_id: references/common-pitfalls.md
  - workflow_mode: sk-create-manual-testing-playbook
    leaf_resource_id: references/examples.md
  - workflow_mode: sk-create-manual-testing-playbook
    leaf_resource_id: references/prompt-voice.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: assets/llmstxt-templates.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/core-standards.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/evergreen-packet-id-rule.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/hvr-rules.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/optimization.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/transformation-patterns.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/validation-and-enforcement.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/workflow-examples.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: sk-create-readme
    leaf_resource_id: assets/readme-code-template.md
  - workflow_mode: sk-create-readme
    leaf_resource_id: assets/readme-template.md
  - workflow_mode: sk-create-readme
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-readme
    leaf_resource_id: references/readme/quality-and-checklist.md
  - workflow_mode: sk-create-readme
    leaf_resource_id: references/readme/types-and-voice.md
  - workflow_mode: sk-create-readme
    leaf_resource_id: references/readme/writing-patterns.md
  - workflow_mode: sk-create-repo-rule
    leaf_resource_id: assets/repo-rule-template.md
  - workflow_mode: sk-create-repo-rule
    leaf_resource_id: assets/repo-rules-router-template.md
  - workflow_mode: sk-create-repo-rule
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-repo-rule
    leaf_resource_id: references/agents-md-integration.md
  - workflow_mode: sk-create-repo-rule
    leaf_resource_id: references/creation-standards.md
  - workflow_mode: sk-create-repo-rule
    leaf_resource_id: references/decision-tests.md
  - workflow_mode: sk-create-repo-rule
    leaf_resource_id: references/rule-anatomy.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-asset-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-graph-metadata-template.json
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-leaf-manifest-config-template.json
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-procedure-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-reference-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-scaffold-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-smart-router.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-sync-manifest-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/shared/advisor-index-handoff.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/shared/common-pitfalls.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/shared/overview.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/shared/skill-root-metadata-contract.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/shared/validation-and-packaging.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/skill/examples-and-maintenance.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/skill/upgrading-a-skill-to-v4.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-command-metadata-template.json
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-description-template.json
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-graph-metadata-template.json
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-hub-router-template.json
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-hub-template.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-leaf-aliases-template.json
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-readme-template.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-registry-template.json
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/parent-skill-root-router-template.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/scaffold/hub-skill-scaffold.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: assets/parent-skill/scaffold/packet-skill-scaffold.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: references/parent-skill/compiled-routing-architecture.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: references/parent-skill/compiled-routing-lockstep-surfaces.json
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: references/parent-skill/parent-hub-router-schema.md
  - workflow_mode: sk-create-skill-parent
    leaf_resource_id: references/parent-skill/parent-skills-nested-packets.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: assets/voice-report-template.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/hvr-publish-supplement.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/hvr-rules.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/scope-and-exemptions.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/scoring-and-verification.md
version: 2.1.0.14
---

# SD-015: Max-Load Token Cost (Ceiling)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-015`.

---

## 1. OVERVIEW

This scenario validates ON_DEMAND_ALL ceiling token-cost behavior for `SD-015`. It focuses on a full-toolkit prompt that should intentionally load the complete sk-doc resource map.

### Why This Matters

The ceiling case records the upper-bound inventory an explicit full-toolkit request would load, and gives operators the cost reference for it. The compiled router does not fan out: a route is capped at the largest declared bundle, and a prompt that names only the hub takes the defer outcome by contract. The assertion is therefore the fail-safe one — no mode may route — and it catches a misroute into a single authoring mode or unbounded expansion beyond the enumerated toolkit. Fan-out to the full inventory remains an open architecture gap; the inventory below stays the reference for the ceiling if it is ever implemented.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc emits no route for a bare full-toolkit request (fail-safe), instead of fanning out across every authoring mode.
- Real user request: `Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.`
- Prompt: `Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.`
- Expected signals: The decision is a non-route (defer); no intent's resources load.
- Desired user-visible outcome: The router trace reports a defer, and no authoring mode's resources are loaded.
- Pass/fail: PASS when the router emits no route (defer or a disambiguation prompt); FAIL if any mode routes.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 17-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, PARENT_HUB, AGENT_CREATION, COMMAND_CREATION, AGENT_COMMAND, FLOWCHART, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG, BENCHMARK, DIFF, REPO_RULE, FULL_INVENTORY; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.
```

### Expected

No route: the router defers, and no intent's resources load (the enumerated inventory above is the reference ceiling, not a load list).

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when the router emits no route (defer or a disambiguation prompt); FAIL if any mode routes.
- **Fail**: any mode routes for this phrasing

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: ON_DEMAND fallback (load-all)
- **Resources loaded**: every reference + asset enumerated in `RESOURCE_MAP` (all 11 intents' resources).
- **Outcome**: CLI emits a directory-style summary of loaded resources, NOT a normal intent-specific output. This establishes the CEILING token cost per CLI.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: stress-tests context window; record peak input tokens.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: may truncate output; record peak input tokens.

**Success Criteria**

- ON_DEMAND_KEYWORDS triggered; load-all engaged
- all 22 enumerated resources appear in the loaded set (false_positive_resource_load_count tolerated up to 3 for any new RESOURCE_MAP additions)
- per-CLI ceiling token cost recorded; should be the upper bound of SD-013/SD-014/SD-015 spectrum


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
- Playbook ID: SD-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `token-cost-baseline/max-load.md`
