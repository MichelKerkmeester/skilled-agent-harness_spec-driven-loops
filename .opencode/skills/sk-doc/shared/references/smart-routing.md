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
        "create-quality-control/references/workflows.md",
        "shared/references/core-standards.md",
        "shared/references/evergreen-packet-id-rule.md"
    ],
    "OPTIMIZATION": [
        "create-quality-control/references/optimization.md",
        "shared/assets/llmstxt-templates.md"
    ],
    "SKILL_CREATION": [
        "create-skill/references/skill/creation-workflow.md",
        "create-skill/assets/skill/skill-md-template.md",
        "create-skill/assets/skill/skill-readme-template.md",
        "create-skill/assets/skill/skill-reference-template.md"
    ],
    "AGENT_COMMAND": [
        "create-agent/references/README.md",
        "create-agent/assets/agent-template.md",
        "create-command/references/README.md",
        "create-command/assets/command-template.md"
    ],
    "FLOWCHART": [
        "create-flowchart/assets/simple-workflow.md",
        "create-flowchart/assets/decision-tree-flow.md"
    ],
    "INSTALL_GUIDE": [
        "create-readme/assets/install-guide-template.md",
        "create-readme/references/README.md"
    ],
    "HVR": [
        "shared/references/hvr-rules.md"
    ],
    "PLAYBOOK": [
        "create-manual-testing-playbook/references/README.md"
    ],
    "FEATURE_CATALOG": [
        "create-feature-catalog/references/README.md"
    ],
    "README_CREATION": [
        "create-readme/references/README.md",
        "create-readme/assets/readme-template.md"
    ],
    "CHANGELOG": [
        "shared/assets/changelog-template.md"
    ],
    "BENCHMARK": [
        "create-benchmark/references/shared/README.md",
        "create-benchmark/references/shared/worked-example.md",
        "create-benchmark/assets/shared/benchmark-report-template.md"
    ],
    "DIFF": [
        "create-diff/references/README.md",
        "create-diff/references/workflow.md",
        "create-diff/references/worked-example.md"
    ],
    "FULL_INVENTORY": [
        "create-agent/assets/agent-template.md",
        "create-agent/references/README.md",
        "create-agent/references/agent-vs-skill-vs-command.md",
        "create-agent/references/common-pitfalls.md",
        "create-agent/references/permission-design.md",
        "create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md",
        "create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md",
        "create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md",
        "create-benchmark/assets/conformance-benchmark/conformance-benchmark-contract-template.md",
        "create-benchmark/assets/conformance-benchmark/conformance-benchmark-fixture-manifest-template.md",
        "create-benchmark/assets/conformance-benchmark/conformance-benchmark-lane-config-template.md",
        "create-benchmark/assets/conformance-benchmark/conformance-benchmark-readme-template.md",
        "create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md",
        "create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md",
        "create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md",
        "create-benchmark/assets/shared/benchmark-report-template.md",
        "create-benchmark/assets/shared/source-template.md",
        "create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md",
        "create-benchmark/references/agent-improvement/agent-improvement-authoring-guide.md",
        "create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md",
        "create-benchmark/references/conformance-benchmark/conformance-benchmark-authoring-guide.md",
        "create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md",
        "create-benchmark/references/shared/README.md",
        "create-benchmark/references/shared/case-studies.md",
        "create-benchmark/references/shared/command-benchmark-composition.md",
        "create-benchmark/references/shared/pitfalls.md",
        "create-benchmark/references/shared/worked-example.md",
        "create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md",
        "shared/assets/changelog-template.md",
        "create-changelog/references/README.md",
        "create-changelog/references/topology-edge-cases.md",
        "create-changelog/references/version-bump-rules.md",
        "create-changelog/references/worked-examples.md",
        "create-command/assets/command-contract.json",
        "create-command/assets/command-contract.schema.json",
        "create-command/assets/command-presentation-template.md",
        "create-command/assets/command-router-template.md",
        "create-command/assets/command-template.md",
        "create-command/references/README.md",
        "create-command/references/argument-hints-and-modes.md",
        "create-command/references/common-pitfalls.md",
        "create-command/references/router-presentation-split.md",
        "create-command/references/worked-example.md",
        "create-diff/assets/fixtures/README.md",
        "create-diff/assets/fixtures/onboarding-after.md",
        "create-diff/assets/fixtures/onboarding-before.md",
        "create-diff/references/README.md",
        "create-diff/references/accessibility-contract.md",
        "create-diff/references/capabilities-and-fidelity.md",
        "create-diff/references/cli-reference.md",
        "create-diff/references/worked-example.md",
        "create-diff/references/workflow.md",
        "create-feature-catalog/assets/feature-catalog-snippet-template.md",
        "create-feature-catalog/assets/feature-catalog-template.md",
        "create-feature-catalog/references/README.md",
        "create-feature-catalog/references/common-pitfalls.md",
        "create-feature-catalog/references/examples.md",
        "create-flowchart/assets/approval-workflow-loops.md",
        "create-flowchart/assets/decision-tree-flow.md",
        "create-flowchart/assets/parallel-execution.md",
        "create-flowchart/assets/simple-workflow.md",
        "create-flowchart/assets/system-architecture-swimlane.md",
        "create-flowchart/assets/user-onboarding.md",
        "create-flowchart/references/README.md",
        "create-flowchart/references/notation-and-validator.md",
        "create-flowchart/references/pattern-selection.md",
        "create-flowchart/references/worked-example.md",
        "create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md",
        "create-manual-testing-playbook/assets/manual-testing-playbook-template.md",
        "create-manual-testing-playbook/references/README.md",
        "create-manual-testing-playbook/references/common-pitfalls.md",
        "create-manual-testing-playbook/references/examples.md",
        "create-manual-testing-playbook/references/prompt-voice.md",
        "shared/assets/llmstxt-templates.md",
        "shared/references/core-standards.md",
        "shared/references/evergreen-packet-id-rule.md",
        "shared/references/hvr-rules.md",
        "shared/references/validation.md",
        "create-quality-control/references/README.md",
        "create-quality-control/references/optimization.md",
        "create-quality-control/references/transformation-patterns.md",
        "create-quality-control/references/validation-and-enforcement.md",
        "create-quality-control/references/workflow-examples.md",
        "create-quality-control/references/workflows.md",
        "create-readme/assets/install-guide-template.md",
        "create-readme/assets/readme-code-template.md",
        "create-readme/assets/readme-template.md",
        "create-readme/references/README.md",
        "create-readme/references/install-guide/quality-and-standards.md",
        "create-readme/references/install-guide/section-examples.md",
        "create-readme/references/readme/quality-and-checklist.md",
        "create-readme/references/readme/types-and-voice.md",
        "create-readme/references/readme/writing-patterns.md",
        "create-skill/assets/parent-skill/parent-skill-description-template.json",
        "create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json",
        "create-skill/assets/parent-skill/parent-skill-hub-router-template.json",
        "create-skill/assets/parent-skill/parent-skill-hub-template.md",
        "create-skill/assets/parent-skill/parent-skill-registry-template.json",
        "create-skill/assets/parent-skill/parent-skill-smart-routing-template.md",
        "create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md",
        "create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md",
        "create-skill/assets/skill/skill-asset-template.md",
        "create-skill/assets/skill/skill-md-template.md",
        "create-skill/assets/skill/skill-procedure-template.md",
        "create-skill/assets/skill/skill-readme-template.md",
        "create-skill/assets/skill/skill-reference-template.md",
        "create-skill/assets/skill/skill-scaffold-template.md",
        "create-skill/assets/skill/skill-smart-router.md",
        "create-skill/references/README.md",
        "create-skill/references/parent-skill/parent-hub-router-schema.md",
        "create-skill/references/parent-skill/parent-skills-nested-packets.md",
        "create-skill/references/shared/common-pitfalls.md",
        "create-skill/references/shared/overview.md",
        "create-skill/references/shared/validation-and-packaging.md",
        "create-skill/references/skill/creation-workflow.md",
        "create-skill/references/skill/examples-and-maintenance.md"
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
