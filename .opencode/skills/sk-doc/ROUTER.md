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
version: 1.3.1.0
router_state: active
skill_pointer: SKILL.md
---

# sk-doc Surface Router — per-intent leaf sets

## 1. OVERVIEW

This is sk-doc's second-layer (surface) router, first-class at the hub root as
`ROUTER.md`. The hub selects a workflow mode in [`hub-router.json`](hub-router.json)
(sk-create-skill, sk-create-skill-parent, sk-create-readme, sk-create-agent, sk-create-command,
sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-benchmark,
sk-create-diagram, sk-create-chart, sk-create-changelog, sk-create-diff, sk-create-repo-rule,
sk-create-with-human-voice, or sk-create-quality-control);
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
  quality / validate documentation / validate a document / score this document /
  DQI / document audit / review the docs / audit the docs / pass review"
  requests. The scoring phrases mirror `hub-router.json`, so a request that
  reaches the quality mode at stage one also reaches its leaves at stage two.
- **optimization leaves** — the optimization reference and the llms.txt templates
  a request to compress, trim, or token-optimize a doc, or emit a machine-readable
  index loads. Fired by "optimize / token efficiency / llms.txt / reduce tokens /
  slim down" requests.
- **skill-creation leaves** — the skill creation workflow and the skill.md /
  readme / reference templates a request to scaffold or author a new skill loads.
  Fired by "create a skill / skill.md scaffold / resource_map wiring / package a
  capability" requests.
- **parent-hub leaves.** The nested-packet contract, the hub-router schema and
  the four parent-hub templates a request to build or rewire a parent hub loads.
  Fired by "parent hub / parent skill / mode packet / nested workflow packet /
  mode-registry.json / hub-router.json" requests, the file names spelled in full
  so a bare "hub router" in an unrelated sentence does not fire it. This is the leaf set for the
  `sk-create-skill-parent` mode, which shares the `sk-create-skill` packet but
  not its leaves: a plain skill request must not pull the hub templates.
- **agent-creation leaves.** The agent README and agent template a request to
  scaffold an OpenCode agent loads. Fired by "create an agent / new agent /
  agent frontmatter / permission object / @analyze agent" requests.
- **command-creation leaves.** The command README and command template a
  request to scaffold a slash command loads. Fired by "create a command / slash
  command / argument-hint / allowed-tools / thin router" requests.
- **agent-command leaves.** Both packets' READMEs and templates a request to
  author an agent together with its paired `/create` command loads. Fired only
  by the two paired phrases, "agent and paired" and "paired /create", which no
  single-artifact request carries. The paired intent stays separate rather than
  being expressed as the union of the two above, because the router keeps only
  intents within one point of the top score: a paired request that also names
  the agent would otherwise drop the command half.
- **flowchart leaves** — the simple-workflow and decision-tree ASCII patterns a
  request to diagram a flow as ASCII / text characters loads. Fired by
  "flowchart / ascii / text diagram / decision tree / process diagram" requests.
- **chart leaves.** The chart catalog, the colour systems and the template
  contract a request to plot data as a standalone HTML chart loads. Fired by
  "create a chart / plot the data / data visualization / treemap / waterfall
  chart / heatmap / box plot / histogram" requests. The catalog is the
  always-loaded leaf, because turning the comparison a reader needs into one
  chart form comes before any colour or markup decision. The form names claimed
  here are the ones `sk-create-diagram` has no answer for. The bare type names
  that packet does claim, `bar chart`, `line chart`, `scatter plot`, `radar
  chart`, `gantt chart` and `org chart`, stay with it, and only the
  data-qualified `bar chart of`, `line chart of` and `scatter plot of` cross
  the boundary.
- **install-guide leaves** — the install-guide template and the readme README a
  request to author install / setup instructions loads. Fired by "install guide /
  setup instructions / how to install / running from scratch" requests.
- **human-voice leaves** — the scope gate, the scoring method and the Human
  Voice Rules standard a request to apply or score that standard loads. Fired
  by "hvr / human voice rules / apply human voice / rewrite in human voice /
  make this sound human / sounds ai-generated / remove ai tells" requests. The
  scope gate is the always-loaded leaf, because deciding what a voice edit may
  touch comes before deciding what to change.
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
  template a request to author a behavior / model / skill benchmark
  loads. Fired by "create a benchmark / benchmark suite / behavior benchmark /
  skill benchmark" requests.
- **diff leaves** — the diff README, workflow, and worked example a request to
  produce a before/after document diff loads. Fired by "document diff / before
  and after diff / visual document diff" requests.
- **repo-rule leaves** — the four decision tests, the rule anatomy contract, the
  creation standards, the wiring contract, the rule and router templates, and the
  packet reference map a
  request to add, change, or remove a repo-local rule loads. Fired by "repo rule /
  project rule / REPO RULES.md / trigger table / retire a repo rule" requests. Most such
  requests end in a refusal, so `decision-tests.md` is the always-loaded leaf.
- **frontmatter leaves** — the field reference and the versioning standard a
  request about a frontmatter block itself loads. Fired by "yaml frontmatter /
  frontmatter block / frontmatter field / description budget / 4-part version /
  frontmatter versioning" requests. The phrases are qualified rather than bare,
  because `agent frontmatter` belongs to agent-creation and a bare "frontmatter"
  would take that route away from it. The field reference is the always-loaded
  leaf, because resolving the document class comes before any field rule.
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
    "DOC_QUALITY": {"weight": 4, "keywords": ["documentation quality", "doc quality", "validate documentation", "validate a document", "validate this document", "validate markdown", "validation rules", "score this document", "score this doc", "dqi", "document audit", "fail sk-doc standards", "review the docs", "review the documentation", "check the docs", "check the documentation", "audit the docs", "review bar", "quality bar", "flag", "meet our standards", "pass review"]},
    "OPTIMIZATION": {"weight": 4, "keywords": ["optimize", "token efficiency", "llms.txt", "llmstxt", "reduce tokens", "fewer tokens", "trim", "compress the doc", "slim down", "model's budget", "machine-readable index"]},
    "SKILL_CREATION": {"weight": 4, "keywords": ["sk-skill", "create a new sk", "create sk-", "skill.md scaffold", "skill.md and starter", "resource_map wiring", "new skill", "create a skill", "build a skill", "author a skill", "scaffold a skill", "reusable capability", "reusable helper", "starter reference docs", "new capability", "capability module", "package a capability"]},
    "PARENT_HUB": {"weight": 4, "keywords": ["parent hub", "parent skill", "mode packet", "mode packets", "nested packet", "nested workflow packet", "mode-registry.json", "hub-router.json"]},
    "AGENT_CREATION": {"weight": 4, "keywords": ["create an agent", "create agent", "new agent", "author an agent", "scaffold an agent", "agent file", "agent persona", "agent frontmatter", "agent template", "permission object", "authority boundary", "@analyze agent"]},
    "COMMAND_CREATION": {"weight": 4, "keywords": ["create a command", "create command", "slash command", "new slash command", "author a command", "scaffold a command", "argument-hint", "allowed-tools", "command template", "router presentation split", "thin router", "presentation contract"]},
    "AGENT_COMMAND": {"weight": 4, "keywords": ["agent and paired", "paired /create"]},
    "FLOWCHART": {"weight": 4, "keywords": ["flowchart", "ascii", "text diagram", "text characters", "decision tree", "decision branch", "process diagram", "flow diagram", "diagram the", "as a diagram"]},
    "CHART": {"weight": 4, "keywords": ["create a chart", "make a chart", "chart this data", "chart the data", "plot the data", "plot this data", "standalone html chart", "chart catalog", "which chart type", "chart template", "chart color system", "chart colour system", "data visualization", "data visualisation", "data viz", "bar chart of", "line chart of", "scatter plot of", "treemap", "waterfall chart", "heat matrix", "heatmap", "heat map", "calendar heatmap", "box plot", "candlestick chart", "stacked area chart", "stacked bar chart", "grouped bar chart", "donut chart", "waffle chart", "histogram", "parallel coordinates"]},
    "INSTALL_GUIDE": {"weight": 4, "keywords": ["install guide", "installation instructions", "setup instructions", "how to install", "setup steps", "getting it running", "getting our project running", "running from scratch"]},
    "HVR": {"weight": 4, "keywords": ["hvr", "human voice rules", "apply human voice", "rewrite in human voice", "make this sound human", "sounds ai-generated", "reads like ai wrote it", "reads like a machine wrote it", "remove ai tells", "ai writing tells", "voice pass", "de-ai the writing", "banned word check"]},
    "PLAYBOOK": {"weight": 4, "keywords": ["playbook system", "manual testing playbook", "testing playbook"]},
    "FEATURE_CATALOG": {"weight": 4, "keywords": ["feature catalog", "feature inventory", "catalog of features", "features overview", "capabilities"]},
    "README_CREATION": {"weight": 4, "keywords": ["create a readme", "readme for", "a readme", "front-page overview", "project overview", "getting started doc", "intro doc", "overview doc", "landing doc"]},
    "CHANGELOG": {"weight": 4, "keywords": ["changelog", "release notes", "version notes", "release summary", "what shipped", "since the last version"]},
    "BENCHMARK": {"weight": 4, "keywords": ["create a benchmark", "author a benchmark", "benchmark suite", "benchmark authoring", "behavior benchmark", "model benchmark", "skill benchmark"]},
    "DIFF": {"weight": 4, "keywords": ["document diff", "doc diff", "diff document", "before and after diff", "before/after diff", "visual document diff"]},
    "REPO_RULE": {"weight": 4, "keywords": ["repo rule", "repo-rules", "repo rules", "project rule", "repo rule file", "REPO RULES.md", "trigger table", "rule router", "retire a rule", "retire a repo rule", "revise a rule", "revise a repo rule", "add a repo rule", "always-loaded rule", "rule that binds"]},
    "FRONTMATTER": {"weight": 4, "keywords": ["yaml frontmatter", "frontmatter block", "frontmatter template", "frontmatter field", "frontmatter fields", "trigger_phrases", "trigger phrases", "importance_tier", "contextType", "description budget", "4-part version", "X.Y.Z.W", "frontmatter versioning", "frontmatter version", "version field", "frontmatter validation", "missing frontmatter", "frontmatter contract", "yaml header", "goes at the top of the file", "version number at the top", "importance tier", "versioning pass", "stopped showing up in suggestions", "validator says my file is missing", "description too long", "edit count", "field the validator wants"]},
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
    "PARENT_HUB": [
        "sk-create-skill/references/parent-skill/parent-skills-nested-packets.md",
        "sk-create-skill/references/parent-skill/parent-hub-router-schema.md",
        "sk-create-skill/assets/parent-skill/parent-skill-hub-template.md",
        "sk-create-skill/assets/parent-skill/parent-skill-registry-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md"
    ],
    "AGENT_CREATION": [
        "sk-create-agent/references/README.md",
        "sk-create-agent/assets/agent-template.md"
    ],
    "COMMAND_CREATION": [
        "sk-create-command/references/README.md",
        "sk-create-command/assets/command-template.md"
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
    "CHART": [
        "sk-create-chart/references/catalog.md",
        "sk-create-chart/references/color-system.md",
        "sk-create-chart/references/template-contract.md"
    ],
    "INSTALL_GUIDE": [
        "sk-create-readme/assets/install-guide-template.md",
        "sk-create-readme/references/README.md"
    ],
    "HVR": [
        "sk-create-with-human-voice/references/scope-and-exemptions.md",
        "sk-create-with-human-voice/references/scoring-and-verification.md",
        "sk-create-with-human-voice/assets/voice-report-template.md",
        "sk-create-with-human-voice/references/hvr-rules.md"
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
        "sk-create-changelog/assets/changelog-template.md"
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
    "REPO_RULE": [
        "sk-create-repo-rule/references/decision-tests.md",
        "sk-create-repo-rule/references/rule-anatomy.md",
        "sk-create-repo-rule/references/creation-standards.md",
        "sk-create-repo-rule/references/agents-md-integration.md",
        "sk-create-repo-rule/assets/repo-rule-template.md",
        "sk-create-repo-rule/assets/repo-rules-router-template.md",
        "sk-create-repo-rule/references/README.md"
    ],
    "FRONTMATTER": [
        "sk-create-frontmatter/assets/frontmatter-templates.md",
        "sk-create-frontmatter/references/frontmatter-versioning.md",
        "sk-create-frontmatter/references/README.md"
    ],
    "FULL_INVENTORY": [
        "sk-create-agent/assets/agent-template.md",
        "sk-create-agent/references/README.md",
        "sk-create-agent/references/agent-vs-skill-vs-command.md",
        "sk-create-agent/references/common-pitfalls.md",
        "sk-create-agent/references/permission-design.md",
        "sk-create-frontmatter/assets/fixtures/README.md",
        "sk-create-frontmatter/assets/fixtures/over-budget-description.md",
        "sk-create-frontmatter/assets/fixtures/under-budget-trim-lost-tokens.md",
        "sk-create-frontmatter/assets/frontmatter-templates.md",
        "sk-create-frontmatter/references/README.md",
        "sk-create-frontmatter/references/frontmatter-versioning.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md",
        "sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md",
        "sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md",
        "sk-create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md",
        "sk-create-benchmark/assets/shared/benchmark-report-template.md",
        "sk-create-benchmark/assets/shared/source-template.md",
        "sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md",
        "sk-create-benchmark/references/agent-improvement/agent-improvement-authoring-guide.md",
        "sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md",
        "sk-create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md",
        "sk-create-benchmark/references/shared/README.md",
        "sk-create-benchmark/references/shared/case-studies.md",
        "sk-create-benchmark/references/shared/pitfalls.md",
        "sk-create-benchmark/references/shared/worked-example.md",
        "sk-create-benchmark/references/skill-benchmark/serving-snapshot-schema.md",
        "sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md",
        "sk-create-changelog/assets/changelog-template.md",
        "sk-create-changelog/references/README.md",
        "sk-create-changelog/references/topology-edge-cases.md",
        "sk-create-changelog/references/version-bump-rules.md",
        "sk-create-changelog/references/worked-examples.md",
        "sk-create-chart/assets/color/palette-sheet-categorical.html",
        "sk-create-chart/assets/color/palette-sheet-neutral.html",
        "sk-create-chart/assets/color/palette-sheet-ordered.html",
        "sk-create-chart/assets/color/palettes.json",
        "sk-create-chart/assets/examples/calls-by-day-and-hour.html",
        "sk-create-chart/assets/examples/orders-after-the-price-change.html",
        "sk-create-chart/assets/examples/pick-times-by-depot.html",
        "sk-create-chart/assets/examples/staff-hours-by-service.html",
        "sk-create-chart/assets/examples/van-age-against-repair-cost.html",
        "sk-create-chart/assets/examples/where-the-budget-went.html",
        "sk-create-chart/assets/templates/bar-columns.html",
        "sk-create-chart/assets/templates/bar-rows.html",
        "sk-create-chart/assets/templates/box-plot.html",
        "sk-create-chart/assets/templates/calendar-grid.html",
        "sk-create-chart/assets/templates/candlestick.html",
        "sk-create-chart/assets/templates/daily-line.html",
        "sk-create-chart/assets/templates/daily-range.html",
        "sk-create-chart/assets/templates/distribution-strip.html",
        "sk-create-chart/assets/templates/grouped-bars.html",
        "sk-create-chart/assets/templates/heat-matrix.html",
        "sk-create-chart/assets/templates/independent-percentages.html",
        "sk-create-chart/assets/templates/parallel-axes.html",
        "sk-create-chart/assets/templates/progress-single.html",
        "sk-create-chart/assets/templates/scatter.html",
        "sk-create-chart/assets/templates/stacked-area.html",
        "sk-create-chart/assets/templates/stacked-bars.html",
        "sk-create-chart/assets/templates/treemap.html",
        "sk-create-chart/assets/templates/unit-grid.html",
        "sk-create-chart/assets/templates/unit-ring.html",
        "sk-create-chart/assets/templates/waterfall.html",
        "sk-create-chart/references/README.md",
        "sk-create-chart/references/catalog.md",
        "sk-create-chart/references/color-system.md",
        "sk-create-chart/references/template-contract.md",
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
        "sk-create-diagram/assets/examples/README.md",
        "sk-create-diagram/assets/examples/example-architecture.html",
        "sk-create-diagram/assets/examples/example-bar.html",
        "sk-create-diagram/assets/examples/example-data-flow.html",
        "sk-create-diagram/assets/examples/example-dp-integration.html",
        "sk-create-diagram/assets/examples/example-dp-security-matrix.html",
        "sk-create-diagram/assets/examples/example-er.html",
        "sk-create-diagram/assets/examples/example-flowchart.html",
        "sk-create-diagram/assets/examples/example-gantt.html",
        "sk-create-diagram/assets/examples/example-high-level.html",
        "sk-create-diagram/assets/examples/example-import-drawio.html",
        "sk-create-diagram/assets/examples/example-import-mermaid.html",
        "sk-create-diagram/assets/examples/example-it-state.html",
        "sk-create-diagram/assets/examples/example-layers.html",
        "sk-create-diagram/assets/examples/example-line.html",
        "sk-create-diagram/assets/examples/example-loop-terminal.html",
        "sk-create-diagram/assets/examples/example-loop.html",
        "sk-create-diagram/assets/examples/example-medallion.html",
        "sk-create-diagram/assets/examples/example-nested.html",
        "sk-create-diagram/assets/examples/example-org-chart.html",
        "sk-create-diagram/assets/examples/example-process.html",
        "sk-create-diagram/assets/examples/example-pyramid.html",
        "sk-create-diagram/assets/examples/example-quadrant-consultant.html",
        "sk-create-diagram/assets/examples/example-quadrant.html",
        "sk-create-diagram/assets/examples/example-radar.html",
        "sk-create-diagram/assets/examples/example-scatter.html",
        "sk-create-diagram/assets/examples/example-sequence-oauth-dark.html",
        "sk-create-diagram/assets/examples/example-sequence-oauth-full.html",
        "sk-create-diagram/assets/examples/example-sequence-oauth.html",
        "sk-create-diagram/assets/examples/example-sequence.html",
        "sk-create-diagram/assets/examples/example-state.html",
        "sk-create-diagram/assets/examples/example-swimlane.html",
        "sk-create-diagram/assets/examples/example-timeline.html",
        "sk-create-diagram/assets/examples/example-tree.html",
        "sk-create-diagram/assets/examples/example-venn.html",
        "sk-create-diagram/assets/icons.html",
        "sk-create-diagram/assets/templates/README.md",
        "sk-create-diagram/assets/templates/template-dark.html",
        "sk-create-diagram/assets/templates/template-full.html",
        "sk-create-diagram/assets/templates/template-terminal.html",
        "sk-create-diagram/assets/templates/template.html",
        "sk-create-diagram/references/ascii-format/README.md",
        "sk-create-diagram/references/ascii-format/notation-and-validator.md",
        "sk-create-diagram/references/ascii-format/pattern-selection.md",
        "sk-create-diagram/references/ascii-format/worked-example.md",
        "sk-create-diagram/references/foundations/README.md",
        "sk-create-diagram/references/foundations/onboarding.md",
        "sk-create-diagram/references/foundations/output-spec.md",
        "sk-create-diagram/references/foundations/style-guide.md",
        "sk-create-diagram/references/import-export/README.md",
        "sk-create-diagram/references/import-export/export.md",
        "sk-create-diagram/references/import-export/import-drawio.md",
        "sk-create-diagram/references/import-export/import-mermaid.md",
        "sk-create-diagram/references/primitives/README.md",
        "sk-create-diagram/references/primitives/primitive-annotation.md",
        "sk-create-diagram/references/primitives/primitive-icons.md",
        "sk-create-diagram/references/primitives/primitive-sketchy.md",
        "sk-create-diagram/references/primitives/primitive-terminal.md",
        "sk-create-diagram/references/types/README.md",
        "sk-create-diagram/references/types/type-architecture.md",
        "sk-create-diagram/references/types/type-bar.md",
        "sk-create-diagram/references/types/type-data-flow.md",
        "sk-create-diagram/references/types/type-dp-integration.md",
        "sk-create-diagram/references/types/type-dp-security-matrix.md",
        "sk-create-diagram/references/types/type-er.md",
        "sk-create-diagram/references/types/type-flowchart.md",
        "sk-create-diagram/references/types/type-gantt.md",
        "sk-create-diagram/references/types/type-high-level.md",
        "sk-create-diagram/references/types/type-it-state.md",
        "sk-create-diagram/references/types/type-layers.md",
        "sk-create-diagram/references/types/type-line.md",
        "sk-create-diagram/references/types/type-loop.md",
        "sk-create-diagram/references/types/type-medallion.md",
        "sk-create-diagram/references/types/type-nested.md",
        "sk-create-diagram/references/types/type-org-chart.md",
        "sk-create-diagram/references/types/type-process.md",
        "sk-create-diagram/references/types/type-pyramid.md",
        "sk-create-diagram/references/types/type-quadrant.md",
        "sk-create-diagram/references/types/type-radar.md",
        "sk-create-diagram/references/types/type-scatter.md",
        "sk-create-diagram/references/types/type-sequence.md",
        "sk-create-diagram/references/types/type-state.md",
        "sk-create-diagram/references/types/type-swimlane.md",
        "sk-create-diagram/references/types/type-timeline.md",
        "sk-create-diagram/references/types/type-tree.md",
        "sk-create-diagram/references/types/type-venn.md",
        "sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md",
        "sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md",
        "sk-create-manual-testing-playbook/references/README.md",
        "sk-create-manual-testing-playbook/references/common-pitfalls.md",
        "sk-create-manual-testing-playbook/references/examples.md",
        "sk-create-manual-testing-playbook/references/prompt-voice.md",
        "shared/assets/llmstxt-templates.md",
        "shared/references/core-standards.md",
        "shared/references/evergreen-packet-id-rule.md",
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
        "sk-create-repo-rule/assets/repo-rule-template.md",
        "sk-create-repo-rule/assets/repo-rules-router-template.md",
        "sk-create-repo-rule/references/README.md",
        "sk-create-repo-rule/references/agents-md-integration.md",
        "sk-create-repo-rule/references/creation-standards.md",
        "sk-create-repo-rule/references/decision-tests.md",
        "sk-create-repo-rule/references/rule-anatomy.md",
        "sk-create-with-human-voice/assets/voice-report-template.md",
        "sk-create-with-human-voice/references/README.md",
        "sk-create-with-human-voice/references/hvr-rules.md",
        "sk-create-with-human-voice/references/scope-and-exemptions.md",
        "sk-create-with-human-voice/references/scoring-and-verification.md",
        "sk-create-skill/assets/parent-skill/parent-skill-command-metadata-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-description-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-hub-template.md",
        "sk-create-skill/assets/parent-skill/parent-skill-leaf-aliases-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-readme-template.md",
        "sk-create-skill/assets/parent-skill/parent-skill-registry-template.json",
        "sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md",
        "sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md",
        "sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md",
        "sk-create-skill/assets/skill/skill-asset-template.md",
        "sk-create-skill/assets/skill/skill-graph-metadata-template.json",
        "sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json",
        "sk-create-skill/assets/skill/skill-md-template.md",
        "sk-create-skill/assets/skill/skill-procedure-template.md",
        "sk-create-skill/assets/skill/skill-readme-template.md",
        "sk-create-skill/assets/skill/skill-reference-template.md",
        "sk-create-skill/assets/skill/skill-scaffold-template.md",
        "sk-create-skill/assets/skill/skill-smart-router.md",
        "sk-create-skill/assets/skill/skill-sync-manifest-template.md",
        "sk-create-skill/references/README.md",
        "sk-create-skill/references/parent-skill/compiled-routing-architecture.md",
        "sk-create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json",
        "sk-create-skill/references/parent-skill/parent-hub-router-schema.md",
        "sk-create-skill/references/parent-skill/parent-skills-nested-packets.md",
        "sk-create-skill/references/shared/advisor-index-handoff.md",
        "sk-create-skill/references/shared/common-pitfalls.md",
        "sk-create-skill/references/shared/overview.md",
        "sk-create-skill/references/shared/skill-root-metadata-contract.md",
        "sk-create-skill/references/shared/validation-and-packaging.md",
        "sk-create-skill/references/skill/creation-workflow.md",
        "sk-create-skill/references/skill/examples-and-maintenance.md",
        "sk-create-skill/references/skill/upgrading-a-skill-to-v4.md"
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair.
- No keyword match is UNKNOWN_FALLBACK: confirm the target artifact and intent
  before loading anything.
- `FULL_INVENTORY` fires only on an explicit "show the whole toolkit" request.
