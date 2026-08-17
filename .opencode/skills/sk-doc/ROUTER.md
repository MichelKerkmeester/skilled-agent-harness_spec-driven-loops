---
title: sk-doc Surface Router — per-intent leaf sets
description: First-class surface router document at the sk-doc hub root (ROUTER.md). hub-router.json selects the workflow mode; this doc maps a request's documentation/authoring intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs. Relocated verbatim from shared/references/smart-routing.md (v1.0.0.0) as the ROUTER.md consolidation pattern.
trigger_phrases:
  - "sk-doc surface router"
  - "doc authoring resource map"
  - "packet leaf resource routing"
  - "surface router pattern"
importance_tier: important
contextType: implementation
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# sk-doc Surface Router — per-intent leaf sets

## 1. OVERVIEW

This is sk-doc's second-layer (surface) router, first-class at the hub root as
`ROUTER.md`. The hub selects a workflow mode in [`hub-router.json`](hub-router.json)
(sk-create-skill, sk-create-skill-parent, sk-create-readme, sk-create-agent, sk-create-command,
sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-benchmark,
sk-create-diagram, sk-create-changelog, sk-create-diff, or sk-create-quality-control);
this doc maps a request's documentation/authoring intent to the exact packet-local
leaf resources that mode should load. Every path is either packet-qualified
(`<packet>/references|assets/…`) or an authored shared-alias disk path (`shared/…`),
and both convert to the canonical `(workflowMode, leafResourceId)` pair at the
contract boundary (`sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`).
`FULL_INVENTORY` is the single explicit full-toolkit intent — no other intent
enumerates the whole hub.

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.
---

## 2. INTENT MODEL

- **doc-quality leaves** — the validation rules, core standards, evergreen
  packet-id rule, and the quality-control workflow a request to validate, audit,
  or score documentation against sk-doc standards loads. Fired by "documentation
  quality / validate documentation / review the docs / audit the docs / pass
  review" requests.
- **optimization leaves** — the optimization reference and the llms.txt templates
  a request to compress, trim, or token-optimize a doc, or emit a machine-readable
  index loads. Fired by "optimize / token efficiency / llms.txt / reduce tokens /
  slim down" requests.
- **skill-creation leaves** — the skill creation workflow and the skill.md /
  readme / reference templates a request to scaffold or author a new skill loads.
  Fired by "create a skill / skill.md scaffold / resource_map wiring / package a
  capability" requests.
- **agent-command leaves** — the agent and command READMEs and templates a
  request to author a paired agent plus a `/create` command loads. Fired by
  "agent and paired / paired /create / @analyze agent" requests.
- **flowchart leaves** — the simple-workflow and decision-tree ASCII patterns a
  request to diagram a flow as ASCII / text characters loads. Fired by
  "flowchart / ascii / text diagram / decision tree / process diagram" requests.
- **install-guide leaves** — the install-guide template and the readme README a
  request to author install / setup instructions loads. Fired by "install guide /
  setup instructions / how to install / running from scratch" requests.
- **hvr leaves** — the HVR rules reference a request governed by the
  hidden-variation rule loads. Fired by "hvr" requests.
- **playbook leaves** — the manual-testing-playbook README a request to author a
  manual testing playbook loads. Fired by "playbook system / manual testing
  playbook / testing playbook" requests.
- **feature-catalog leaves** — the feature-catalog README a request to inventory a
  project's features / capabilities loads. Fired by "feature catalog / feature
  inventory / capabilities" requests.
- **readme-creation leaves** — the readme README and readme template a request to
  author a project README / front-page overview loads. Fired by "create a readme /
  readme for / project overview / landing doc" requests.
- **changelog leaves** — the changelog template a request to author release notes
  / version notes loads. Fired by "changelog / release notes / what shipped /
  since the last version" requests.
- **benchmark leaves** — the benchmark shared README, worked example, and report
  template a request to author a behavior / conformance / model / skill benchmark
  loads. Fired by "create a benchmark / benchmark suite / behavior benchmark /
  skill benchmark" requests.
- **diff leaves** — the diff README, workflow, and worked example a request to
  produce a before/after document diff loads. Fired by "document diff / before
  and after diff / visual document diff" requests.
- **full-inventory leaves** — the entire sk-doc toolkit. `FULL_INVENTORY` is the
  single explicit full-toolkit intent; no other intent enumerates the whole hub.
  Fired only by an explicit "show the full sk-doc toolkit / everything sk-doc
  offers" request.

A single dominant documentation axis routes to one mode's leaf set; two clearly
separate axes route to both.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is the
human-facing contract; this block is the byte-for-byte source the deterministic
router-replay parses. Keep them in sync: when a map row changes above, update the
matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path resolves on disk and
dual-reads to a canonical typed pair through `leaf-manifest.json` or the hub's
`leaf-aliases.json`.

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
        "sk-create-diagram/assets/ascii-patterns/simple-workflow.md",
        "sk-create-diagram/assets/ascii-patterns/decision-tree-flow.md"
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
        "sk-create-diagram/assets/ascii-patterns/approval-workflow-loops.md",
        "sk-create-diagram/assets/ascii-patterns/decision-tree-flow.md",
        "sk-create-diagram/assets/ascii-patterns/parallel-execution.md",
        "sk-create-diagram/assets/ascii-patterns/simple-workflow.md",
        "sk-create-diagram/assets/ascii-patterns/system-architecture-swimlane.md",
        "sk-create-diagram/assets/ascii-patterns/user-onboarding.md",
        "sk-create-diagram/references/ascii-format/README.md",
        "sk-create-diagram/references/ascii-format/notation-and-validator.md",
        "sk-create-diagram/references/ascii-format/pattern-selection.md",
        "sk-create-diagram/references/ascii-format/worked-example.md",
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
        "sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md",
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

## 4. HOW TO READ THIS

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair.
- No keyword match is UNKNOWN_FALLBACK: confirm the target artifact and intent
  before loading anything.
- `FULL_INVENTORY` fires only on an explicit "show the whole toolkit" request.
