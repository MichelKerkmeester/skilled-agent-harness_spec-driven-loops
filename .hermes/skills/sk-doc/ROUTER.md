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
version: 2.3.14.0
router_state: active
skill_pointer: SKILL.md
---

# sk-doc Surface Router — per-intent leaf sets

## 1. OVERVIEW

This is sk-doc's second-layer (surface) router, first-class at the hub root as
`ROUTER.md`. The hub selects a workflow mode in [`hub-router.json`](../../../.skilled/skills/sk-doc/hub-router.json)
(sk-create-skill, sk-create-skill-parent, sk-create-readme, sk-create-agent, sk-create-command,
sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-benchmark,
sk-create-changelog, sk-create-diff, sk-create-repo-rule, sk-create-frontmatter,
sk-create-goal, sk-create-with-human-voice, or sk-create-quality-control);
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
- **diagram and chart leaves belong to the `sk-design` hub.** ASCII flowchart,
  decision-tree and standalone HTML chart authoring is `sk-design-diagram` and
  `sk-design-chart` work, and this router declares no intent for it: `/design:diagram`
  and `/design:chart` are the entry points, so "flowchart", "ascii", "process diagram",
  "create a chart" and "plot the data" reach no key in the two maps below.
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
  template a request to author a behavior benchmark
  loads. Fired by "create a benchmark / benchmark suite / behavior benchmark"
  requests.
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
- **goal-authoring leaves** — the goal authoring standards, the goal exemplars,
  the parent/nested goal workflows and the budget/handoff reference a request to
  author or revise a packet's `goal.md` loads. Fired by "packet goal / goal.md /
  goal document / author goal.md / phase parent goal / goal criteria /
  completion checks" requests. The phrases are qualified rather than bare,
  because a bare "goal" and the session verbs belong to session-goal management
  (set, bind, update, resend), which the goal hooks and host commands own. The
  authoring standards are the always-loaded leaf, because what a goal must state
  comes before how one is phrased.
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
    "DOC_QUALITY": {"weight": 4, "keywords": ["documentation quality", "doc quality", "validate documentation", "validate a document", "validate this document", "validate markdown", "validation rules", "score this document", "score this doc", "dqi", "document audit", "fail sk-doc standards", "review the docs", "review the documentation", "check the docs", "check the documentation", "audit the docs", "documentation review bar", "quality bar", "flag", "meet our standards", "audit documentation quality", "ai-friendly documentation", "extract structure", "validate", "score", "harden", "audit", "/doc:quality"]},
    "OPTIMIZATION": {"weight": 4, "keywords": ["optimize", "token efficiency", "llms.txt", "llmstxt", "reduce tokens", "fewer tokens", "trim", "compress the doc", "slim down", "model's budget", "machine-readable index", "optimize this doc"]},
    "SKILL_CREATION": {"weight": 4, "keywords": ["sk-skill", "create a new sk", "create sk-", "skill.md scaffold", "skill.md and starter", "resource_map wiring", "new skill", "create a skill", "build a skill", "author a skill", "scaffold a skill", "reusable capability", "reusable helper", "starter reference docs", "new capability", "capability module", "package a capability", "create skill", "skill scaffold", "opencode skill", "package skill", "which json files does a skill need", "skill root metadata contract", "leaf-manifest config aliases required", "/create:skill"]},
    "PARENT_HUB": {"weight": 4, "keywords": ["parent hub", "parent skill", "mode packet", "mode packets", "nested packet", "nested workflow packet", "mode-registry.json", "hub-router.json", "hub versus standalone skill class", "skill hub", "/create:skill-parent"]},
    "AGENT_CREATION": {"weight": 4, "keywords": ["create an agent", "create agent", "new agent", "author an agent", "scaffold an agent", "agent file", "agent persona", "agent frontmatter", "agent template", "permission object", "authority boundary", "@analyze agent", "opencode agent", "claude code agent", "/create:agent"]},
    "COMMAND_CREATION": {"weight": 4, "keywords": ["create a command", "create command", "slash command", "new slash command", "author a command", "scaffold a command", "argument-hint", "allowed-tools", "command template", "router presentation split", "thin router", "presentation contract", "opencode command", "$arguments", "/create:command"]},
    "AGENT_COMMAND": {"weight": 4, "keywords": ["agent and paired", "paired /create"]},
    "HVR": {"weight": 4, "keywords": ["hvr", "human voice rules", "apply human voice", "rewrite in human voice", "make this sound human", "sounds ai-generated", "reads like ai wrote it", "reads like a machine wrote it", "remove ai tells", "ai writing tells", "voice pass", "de-ai the writing", "banned word check", "human voice"]},
    "PLAYBOOK": {"weight": 4, "keywords": ["playbook system", "manual testing playbook", "testing playbook", "deterministic scenario", "evidence collection", "operator validation", "multi-agent execution", "release readiness", "/create:manual-testing-playbook"]},
    "FEATURE_CATALOG": {"weight": 4, "keywords": ["feature catalog", "feature inventory", "catalog of features", "features overview", "capabilities", "catalog package", "per-feature files", "source anchors", "root catalog", "capability inventory", "/create:feature-catalog"]},
    "README_CREATION": {"weight": 4, "keywords": ["create a readme", "readme for", "a readme", "front-page overview", "project overview", "getting started doc", "intro doc", "overview doc", "landing doc", "create readme", "readme", "folder readme", "write readme", "readme.md", "code folder readme", "/create:readme"]},
    "CHANGELOG": {"weight": 4, "keywords": ["changelog", "release notes", "version notes", "release summary", "what shipped", "since the last version", "changelog entry", "nested changelog", "packet changelog", "packet-local changelog", "create changelog", "global changelog", "--bump", "--release", "vx.y.z.b", "/create:changelog"]},
    "BENCHMARK": {"weight": 4, "keywords": ["create a benchmark", "author a benchmark", "benchmark suite", "benchmark authoring", "behavior benchmark", "benchmark-report.md", "source.md", "mcp-server/benchmarks", "behavior-benchmark.md", "scenario contract", "claude-baseline", "benchmark/readme.md", "run-label folder", "benchmark package", "benchmark fixture", "benchmark profile", "reviewer-prompt fixture", "agent quality dimensions", "new benchmark", "promote benchmark folder", "create benchmark", "behavior_benchmark"]},
    "DIFF": {"weight": 4, "keywords": ["document diff", "doc diff", "diff document", "before and after diff", "before/after diff", "visual document diff", "create diff report", "document before after review", "before after document diff", "document change report", "before and after document", "document before/after review", "before/after document diff", "review document edits", "docx diff", "pdf diff"]},
    "REPO_RULE": {"weight": 4, "keywords": ["repo rule", "repo-rules", "repo rules", "project rule", "repo rule file", "REPO RULES.md", "trigger table", "rule router", "retire a rule", "retire a repo rule", "revise a rule", "revise a repo rule", "add a repo rule", "always-loaded rule", "rule that binds", "create repo rule", "new repo rule", "repo-local rule", "we should always", "stop doing", "add a rule", "/create:repo-rule"]},
    "FRONTMATTER": {"weight": 4, "keywords": ["yaml frontmatter", "frontmatter block", "frontmatter template", "frontmatter field", "frontmatter fields", "trigger_phrases", "trigger phrases", "importance_tier", "contextType", "description budget", "4-part version", "X.Y.Z.W", "frontmatter versioning", "frontmatter version", "version field", "frontmatter validation", "missing frontmatter", "frontmatter contract", "yaml header", "goes at the top of the file", "version number at the top", "importance tier", "versioning pass", "stopped showing up in suggestions", "validator says my file is missing", "description too long", "edit count", "field the validator wants"]},
    "GOAL_AUTHORING": {"weight": 4, "keywords": ["create packet goal", "packet goal", "goal.md", "author goal.md", "revise packet goal", "phase parent goal", "nested phase child goal", "nested goal", "add a goal file", "write a goal file", "draft a goal file", "goal file", "goal document", "goal criteria", "completion checks", "measurable criteria", "durable objective", "phase objective", "parent objective", "objective for a packet", "phase-child goal", "child-phase goal", "binding table", "goal chat slice", "/create:goal"]},
    "FULL_INVENTORY": {"weight": 4, "keywords": ["full sk-doc toolkit", "all templates", "entire toolkit", "everything sk-doc offers"]},
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
    "GOAL_AUTHORING": [
        "sk-create-goal/references/authoring-standards.md",
        "sk-create-goal/assets/goal-exemplars.md",
        "sk-create-goal/references/parent-and-nested-goals.md",
        "sk-create-goal/references/budget-and-handoff.md",
        "sk-create-goal/assets/goal-top-level-template.md",
        "sk-create-goal/assets/goal-phase-parent-template.md",
        "sk-create-goal/assets/goal-phase-child-template.md"
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
        "sk-create-goal/assets/goal-exemplars.md",
        "sk-create-goal/assets/goal-phase-child-template.md",
        "sk-create-goal/assets/goal-phase-parent-template.md",
        "sk-create-goal/assets/goal-top-level-template.md",
        "sk-create-goal/references/authoring-standards.md",
        "sk-create-goal/references/budget-and-handoff.md",
        "sk-create-goal/references/parent-and-nested-goals.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md",
        "sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md",
        "sk-create-benchmark/assets/shared/benchmark-report-template.md",
        "sk-create-benchmark/assets/shared/source-template.md",
        "sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md",
        "sk-create-benchmark/references/shared/README.md",
        "sk-create-benchmark/references/shared/case-studies.md",
        "sk-create-benchmark/references/shared/pitfalls.md",
        "sk-create-benchmark/references/shared/worked-example.md",
        "sk-create-changelog/assets/changelog-template.md",
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
        "sk-create-readme/assets/architecture-template.md",
        "sk-create-readme/assets/readme-code-template.md",
        "sk-create-readme/assets/readme-template.md",
        "sk-create-readme/references/README.md",
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

---

## 5. MACHINE ROUTER

The hub's detailed routing prose, moved here from `SKILL.md` so the skill body keeps only a short routing summary and a pointer to this file. It sits last, after the stage-two map above, and it declares no map of its own: the `INTENT_SIGNALS` and `RESOURCE_MAP` block in section 3 stays the only replay source.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `sk-doc`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### Surface Router — per-intent leaf sets

Stage 2 of routing lives in section 3 of this file.
It defines three things:
- The per-intent leaf model: document quality, optimization, skill creation, parent-hub creation, agent creation, command creation, the paired agent-plus-command lane, flowcharts, the human-voice pass, playbooks, feature catalogs, READMEs, changelogs, benchmarks, diffs, packet goals, repo rules, and the explicit full-toolkit intent.
- The machine-readable `INTENT_SIGNALS` / `RESOURCE_MAP` block that the deterministic router-replay and benchmarks parse.
- The how-to-read rules: a dominant intent gives one leaf set, near-tied intents give a deduped union, and no keyword match gives the hub UNKNOWN fallback, never a silent default.

Every `RESOURCE_MAP` path is packet-qualified or an authored shared-alias disk path, and each converts to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

The reason this file stays a separate document from `SKILL.md` and from `hub-router.json` is in [the parent-skill reference](../../../.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md#why-the-leaf-router-stays-in-routermd).

### The discriminator
- **`workflowMode`** — the public packet key (e.g. `sk-create-skill`, `sk-create-quality-control`). `sk-create-skill-parent` is a second mode over the same `sk-create-skill` packet.
- **`packetKind`** — `workflow` for every sk-doc packet (there is no surface axis; the sk-create-quality-control pipeline is universal doctrine in `shared/`, not orthogonal stack-evidence).
- **`backendKind`** — `template-scaffold` for the create-* generators, `sk-create-quality-control` for the sk-create-quality-control mode.

### Routing rule
```
SKILL_ROOT = path containing this ROUTER.md and its SKILL.md
REGISTRY = SKILL_ROOT / "mode-registry.json"
HUB_ROUTER = SKILL_ROOT / "hub-router.json"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is sk-create-skill, sk-create-skill-parent, sk-create-readme, sk-create-agent, sk-create-command, sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-benchmark, sk-create-changelog, sk-create-diff, sk-create-repo-rule, sk-create-frontmatter, sk-create-goal, sk-create-with-human-voice, or sk-create-quality-control work",
    "Confirm the target document or component being authored, scaffolded, or reviewed",
    "Provide the available inputs: existing doc, source material, or scaffold parameters",
    "Confirm the validation expectations before completion (DQI/HVR scoring, validate.sh, or packet-specific checks)",
]

def _guard_in_skill(relative_path):
  resolved = (SKILL_ROOT / relative_path).resolve()
  resolved.relative_to(SKILL_ROOT)
  if resolved.suffix.lower() not in {".md", ".json"}:
    raise ValueError("only skill-local markdown/json router resources are routable")
  return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, seen):
  guarded = _guard_in_skill(relative_path)
  if guarded not in seen and (SKILL_ROOT / guarded).exists():
    load(guarded)
    seen.add(guarded)
    return True
  return False

seen = set()
if not REGISTRY.exists() or not HUB_ROUTER.exists():
  return defer("router metadata missing; inspect sk-doc/mode-registry.json and sk-doc/hub-router.json")

read mode-registry.json and hub-router.json
classify the request to one or more workflowMode values using hub-router.json
  (dominant authoring/quality intent; a command like /create:agent resolves directly)

if confidence is low, intent is contradictory, or routerPolicy.defaultMode is null and no mode wins:
  for resource in hub_router.routerPolicy.defaultResource:   # the ordered defer set, never hardcoded here
    load_if_available(resource, seen)
  return UNKNOWN_FALLBACK with disambiguation_checklist = UNKNOWN_FALLBACK_CHECKLIST

for each resolved workflowMode:
  entry = the matching mode-registry.json modes[] item
  if entry is missing or entry.packetKind != "workflow":
    return defer("unknown sk-doc workflowMode; extend mode-registry.json and create a packet first")
  if not load_if_available(f"{entry.packet}/SKILL.md", seen):
    return defer("registered packet SKILL.md is missing; repair the packet before routing")

return single or orderedBundle according to hub-router.json routerPolicy.outcomes
```
`routerPolicy.defaultMode` is `null`: an unclear documentation intent asks for disambiguation rather than forcing a stale default. `hub-router.json` carries the router signals, vocabulary classes, default fallback resource, and bundle rules. Outcomes are `single`, `orderedBundle`, or `defer` — there is no `surfaceBundle` (no surface axis).

Per-packet behavior is **not flattened**: each packet keeps its own authoring contract, references, assets, scripts, and templates.

This hub does **not** use keyed resource discovery (`references/<key>/` or `assets/<key>/`) at the hub root.
There are no hub-root `references/` or `assets/` directories, and packet resources stay inside their owning packet or the shared backbone.
If a future workflow needs keyed resource subdirectories, add that behavior inside the owning packet using guarded runtime discovery.
Do not hardcode resource inventories in this hub.
