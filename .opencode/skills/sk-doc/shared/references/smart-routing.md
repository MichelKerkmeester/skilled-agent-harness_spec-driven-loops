---
title: Second-Layer Surface Router Pattern
description: Reusable second-layer leaf-routing pattern for hubs that explicitly declare packet-local surface routing.
trigger_phrases:
  - "second-layer surface router"
  - "packet leaf resource routing"
  - "hub leaf resource map"
  - "surface router pattern"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Second-Layer Surface Router Pattern

This is a reusable pattern for a parent hub that explicitly declares second-layer leaf routing. It is not sk-doc's active router: sk-doc is workflow-only, routes through `hub-router.json`, and uses `shared/references/quick-reference.md` for its fallback.

The block below is illustrative. Adopt it only when the owning hub's registry and router contract declare packet-local leaf routing; otherwise load the selected packet's own `SKILL.md` and resources directly. Every path is either packet-qualified (`<packet>/references|assets/…`) or an authored shared-alias disk path (`shared/…`), and both convert to the canonical `(workflowMode, leafResourceId)` pair at the contract boundary. `FULL_INVENTORY` is the single explicit full-toolkit intent — no other intent enumerates the whole hub.

```python
INTENT_SIGNALS = {
    "DOC_QUALITY": {"weight": 4, "keywords": ["documentation quality", "doc quality", "validate documentation", "validation rules", "fail sk-doc standards", "review the docs", "review the documentation", "check the docs", "check the documentation", "audit the docs", "review bar", "quality bar", "flag", "meet our standards", "pass review"]},
    "OPTIMIZATION": {"weight": 4, "keywords": ["optimize", "token efficiency", "llms.txt", "llmstxt", "reduce tokens", "fewer tokens", "trim", "compress the doc", "slim down", "model's budget", "machine-readable index"]},
    "SKILL_CREATION": {"weight": 4, "keywords": ["sk-skill", "create a new sk", "create sk-", "skill.md scaffold", "skill.md and starter", "resource_map wiring", "new skill", "create a skill", "build a skill", "author a skill", "scaffold a skill", "reusable capability", "reusable helper", "starter reference docs", "new capability", "capability module", "package a capability"]},
    "AGENT_COMMAND": {"weight": 4, "keywords": ["agent and paired", "paired /create", "@analyze agent"]},
    "FLOWCHART": {"weight": 4, "keywords": ["flowchart", "ascii", "text diagram", "text characters", "decision tree", "decision branch", "process diagram", "flow diagram", "diagram the", "as a diagram"]},
    "INSTALL_GUIDE": {"weight": 4, "keywords": ["install guide", "installation instructions", "setup instructions", "how to install", "setup steps", "getting it running", "getting our project running", "running from scratch"]},
    "HVR": {"weight": 4, "keywords": ["hvr"]},
    "PLAYBOOK": {"weight": 4, "keywords": ["playbook system", "manual testing playbook", "testing playbook"]},
    "FEATURE_CATALOG": {"weight": 4, "keywords": ["feature catalog", "feature inventory", "catalog of features", "features overview", "capabilities"]},
    "README_CREATION": {"weight": 4, "keywords": ["create a readme", "readme for", "a readme", "front-page overview", "project overview", "getting started doc", "intro doc", "overview doc", "landing doc"]},
    "CHANGELOG": {"weight": 4, "keywords": ["changelog", "release notes", "version notes", "release summary", "what shipped", "since the last version"]},
    "BENCHMARK": {"weight": 4, "keywords": ["create a benchmark", "author a benchmark", "benchmark suite", "benchmark authoring", "behavior benchmark", "conformance benchmark", "model benchmark", "skill benchmark"]},
    "DIFF": {"weight": 4, "keywords": ["document diff", "doc diff", "diff document", "before and after diff", "before/after diff", "visual document diff"]},
    "FULL_INVENTORY": {"weight": 4, "keywords": ["full sk-doc toolkit", "all templates", "show the full", "entire toolkit", "everything sk-doc offers"]},
}

RESOURCE_MAP = {
    "DOC_QUALITY": [
        "shared/references/validation.md",
        "sk-create-quality-control/references/workflows.md",
        "shared/references/core-standards.md",
        "shared/references/evergreen-packet-id-rule.md"
    ],
    "OPTIMIZATION": [
        "sk-create-quality-control/references/optimization.md",
        "shared/assets/llmstxt-templates.md"
    ],
    "SKILL_CREATION": [
        "sk-create-skill/references/skill/creation-workflow.md",
        "sk-create-skill/assets/skill/skill-md-template.md",
        "sk-create-skill/assets/skill/skill-readme-template.md",
        "sk-create-skill/assets/skill/skill-reference-template.md"
    ],
    "AGENT_COMMAND": [
        "sk-create-agent/references/README.md",
        "sk-create-agent/assets/agent-template.md",
        "sk-create-command/references/README.md",
        "sk-create-command/assets/command-template.md"
    ],
    "FLOWCHART": [
        "sk-create-flowchart/assets/simple-workflow.md",
        "sk-create-flowchart/assets/decision-tree-flow.md"
    ],
    "INSTALL_GUIDE": [
        "sk-create-readme/assets/install-guide-template.md",
        "sk-create-readme/references/README.md"
    ],
    "HVR": [
        "shared/references/hvr-rules.md"
    ],
    "PLAYBOOK": [
        "sk-create-manual-testing-playbook/references/README.md"
    ],
    "FEATURE_CATALOG": [
        "sk-create-feature-catalog/references/README.md"
    ],
    "README_CREATION": [
        "sk-create-readme/references/README.md",
        "sk-create-readme/assets/readme-template.md"
    ],
    "CHANGELOG": [
        "shared/assets/changelog-template.md"
    ],
    "BENCHMARK": [
        "sk-create-benchmark/references/shared/README.md",
        "sk-create-benchmark/references/shared/worked-example.md",
        "sk-create-benchmark/assets/shared/benchmark-report-template.md"
    ],
    "DIFF": [
        "sk-create-diff/references/README.md",
        "sk-create-diff/references/workflow.md",
        "sk-create-diff/references/worked-example.md"
    ],
    "FULL_INVENTORY": [
        "sk-create-agent/assets/agent-template.md",
        "sk-create-agent/references/README.md",
        "sk-create-agent/references/agent-vs-skill-vs-command.md",
        "sk-create-agent/references/common-pitfalls.md",
        "sk-create-agent/references/permission-design.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md",
        "sk-create-benchmark/assets/conformance-benchmark/conformance-benchmark-contract-template.md",
        "sk-create-benchmark/assets/conformance-benchmark/conformance-benchmark-fixture-manifest-template.md",
        "sk-create-benchmark/assets/conformance-benchmark/conformance-benchmark-lane-config-template.md",
        "sk-create-benchmark/assets/conformance-benchmark/conformance-benchmark-readme-template.md",
        "sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md",
        "sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md",
        "sk-create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md",
        "sk-create-benchmark/assets/shared/benchmark-report-template.md",
        "sk-create-benchmark/assets/shared/source-template.md",
        "sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md",
        "sk-create-benchmark/references/agent-improvement/agent-improvement-authoring-guide.md",
        "sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md",
        "sk-create-benchmark/references/conformance-benchmark/conformance-benchmark-authoring-guide.md",
        "sk-create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md",
        "sk-create-benchmark/references/shared/README.md",
        "sk-create-benchmark/references/shared/case-studies.md",
        "sk-create-benchmark/references/shared/command-benchmark-composition.md",
        "sk-create-benchmark/references/shared/pitfalls.md",
        "sk-create-benchmark/references/shared/worked-example.md",
        "sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md",
        "shared/assets/changelog-template.md",
        "sk-create-changelog/references/README.md",
        "sk-create-changelog/references/topology-edge-cases.md",
        "sk-create-changelog/references/version-bump-rules.md",
        "sk-create-changelog/references/worked-examples.md",
        "sk-create-command/assets/command-contract.json",
        "sk-create-command/assets/command-contract.schema.json",
        "sk-create-command/assets/command-presentation-template.md",
        "sk-create-command/assets/command-router-template.md",
        "sk-create-command/assets/command-template.md",
        "sk-create-command/references/README.md",
        "sk-create-command/references/argument-hints-and-modes.md",
        "sk-create-command/references/common-pitfalls.md",
        "sk-create-command/references/router-presentation-split.md",
        "sk-create-command/references/worked-example.md",
        "sk-create-diff/assets/fixtures/README.md",
        "sk-create-diff/assets/fixtures/onboarding-after.md",
        "sk-create-diff/assets/fixtures/onboarding-before.md",
        "sk-create-diff/references/README.md",
        "sk-create-diff/references/accessibility-contract.md",
        "sk-create-diff/references/capabilities-and-fidelity.md",
        "sk-create-diff/references/cli-reference.md",
        "sk-create-diff/references/worked-example.md",
        "sk-create-diff/references/workflow.md",
        "sk-create-feature-catalog/assets/feature-catalog-snippet-template.md",
        "sk-create-feature-catalog/assets/feature-catalog-template.md",
        "sk-create-feature-catalog/references/README.md",
        "sk-create-feature-catalog/references/common-pitfalls.md",
        "sk-create-feature-catalog/references/examples.md",
        "sk-create-flowchart/assets/approval-workflow-loops.md",
        "sk-create-flowchart/assets/decision-tree-flow.md",
        "sk-create-flowchart/assets/parallel-execution.md",
        "sk-create-flowchart/assets/simple-workflow.md",
        "sk-create-flowchart/assets/system-architecture-swimlane.md",
        "sk-create-flowchart/assets/user-onboarding.md",
        "sk-create-flowchart/references/README.md",
        "sk-create-flowchart/references/notation-and-validator.md",
        "sk-create-flowchart/references/pattern-selection.md",
        "sk-create-flowchart/references/worked-example.md",
        "sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md",
        "sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md",
        "sk-create-manual-testing-playbook/references/README.md",
        "sk-create-manual-testing-playbook/references/common-pitfalls.md",
        "sk-create-manual-testing-playbook/references/examples.md",
        "sk-create-manual-testing-playbook/references/prompt-voice.md",
        "shared/assets/llmstxt-templates.md",
        "shared/references/core-standards.md",
        "shared/references/evergreen-packet-id-rule.md",
        "shared/references/hvr-rules.md",
        "shared/references/validation.md",
        "sk-create-quality-control/references/README.md",
        "sk-create-quality-control/references/optimization.md",
        "sk-create-quality-control/references/transformation-patterns.md",
        "sk-create-quality-control/references/validation-and-enforcement.md",
        "sk-create-quality-control/references/workflow-examples.md",
        "sk-create-quality-control/references/workflows.md",
        "sk-create-readme/assets/install-guide-template.md",
        "sk-create-readme/assets/readme-code-template.md",
        "sk-create-readme/assets/readme-template.md",
        "sk-create-readme/references/README.md",
        "sk-create-readme/references/install-guide/quality-and-standards.md",
        "sk-create-readme/references/install-guide/section-examples.md",
        "sk-create-readme/references/readme/quality-and-checklist.md",
        "sk-create-readme/references/readme/types-and-voice.md",
        "sk-create-readme/references/readme/writing-patterns.md",
        "sk-create-skill/assets/parent-skill/parent-skill-description-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-hub-template.md",
        "sk-create-skill/assets/parent-skill/parent-skill-registry-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-smart-routing-template.md",
        "sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md",
        "sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md",
        "sk-create-skill/assets/skill/skill-asset-template.md",
        "sk-create-skill/assets/skill/skill-md-template.md",
        "sk-create-skill/assets/skill/skill-procedure-template.md",
        "sk-create-skill/assets/skill/skill-readme-template.md",
        "sk-create-skill/assets/skill/skill-reference-template.md",
        "sk-create-skill/assets/skill/skill-scaffold-template.md",
        "sk-create-skill/assets/skill/skill-smart-router.md",
        "sk-create-skill/references/README.md",
        "sk-create-skill/references/parent-skill/parent-hub-router-schema.md",
        "sk-create-skill/references/parent-skill/parent-skills-nested-packets.md",
        "sk-create-skill/references/shared/common-pitfalls.md",
        "sk-create-skill/references/shared/overview.md",
        "sk-create-skill/references/shared/validation-and-packaging.md",
        "sk-create-skill/references/skill/creation-workflow.md",
        "sk-create-skill/references/skill/examples-and-maintenance.md"
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
