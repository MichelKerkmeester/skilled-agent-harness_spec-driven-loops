# Contract Compiler — Seed Design (from 035 phase-003 design pass)

> Produced by GPT-5.5-fast xhigh during the 035 restructure; the feasibility verdict (research-sized) triggered the carve into this 036 packet. Grounded in the real /deep:review 14-file authority chain. This is a STARTING design to be verified + expanded, not a finished spec.

1. **CONTRACT SCHEMA**

Evidence: `/deep:review` currently splits authority across the router, presentation, setup contract, YAML, skill packet, agent, and prompt pack (`.opencode/commands/deep/review.md:68-97`, `.opencode/commands/deep/assets/deep_review_presentation.txt:13-23`, `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md:25-56`, `.opencode/commands/deep/assets/deep_review_auto.yaml:193-200`, `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:75-119`).

Concrete schema:

```yaml
commandContract:
  id: deep/review
  version: 1
  sourceDigests: [{path, sha256, section}]
  gate3Precedence:
    line: "Workflow-resolved spec folder is the only legal write authority."
    classifier: ".opencode/skills/system-spec-kit/shared/gate-3-classifier.ts"
  renderBlocks:
    auto: {startMarker, endMarker, rule: "render only marked block verbatim"}
    confirm: {startMarker, endMarker, rule: "render only marked block verbatim"}
  setup:
    requiredFields: [{name, type, required, default, resolvesVia, tier2Eligible}]
    mode: AUTONOMOUS|INTERACTIVE|ASK
  outputTemplate:
    promptPack: ".opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl"
    requiredArtifacts: [iterationMarkdown, stateJsonlAppend, deltaJsonl]
  writeBoundary:
    approvedRoot: "{artifact_dir}"
    allowedWrites: [...]
    readOnlyTargets: [...]
    bannedOperations: [...]
  executorContract:
    appliesWhen: "executionMode == 'AUTONOMOUS' && writeBoundary.present"
    rules: [{id, must, forbidden, failStatus}]
  refs:
    dispatchReceipt: "phase-004 contract ref"
    progressRecord: "phase-004 contract ref"
  tools:
    allowed: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query, code_graph_context]
    permittedByExecutor: {native: [...], cli_opencode: [...]}
  absorptionAbort:
    rule: "Producing findings without a dispatch receipt is role absorption; write no findings."
```

2. **COMPILER**

Inputs: command router markdown (`.opencode/commands/deep/review.md:78-84`), presentation asset (`deep_review_presentation.txt:1-23`), shared auto-mode contract (`auto_mode_contract.md:25-56`), selected YAML (`deep_review_auto.yaml:1-79`), mode registry (`mode-registry.json:49-64`), hub skill (`deep-loop-workflows/SKILL.md:34-56`), mode skill (`deep-review/SKILL.md:43-63`), protocol/templates (`loop_protocol.md:58-67`, `deep_review_config.json:1-69`, `prompt_pack_iteration.md.tmpl:1-7`), agent definition (`.opencode/agents/deep-review.md:78-120`), and rollout mode (`shared/rollout/resolve-injection-mode.cjs:57-68`).

Build target: `.opencode/commands/deep/assets/compiled/deep_review.contract.md`.

Recommend compiled Markdown embedded as the first prompt block, not JSON plus runtime renderer. Keep typed source internally, but ship the executor a self-contained, grep-checkable artifact; this directly satisfies the “first ~150 lines” reliability goal in `spec.md:55-57`.

3. **EXTERNAL-REF TAXONOMY**

`read_contract`: inline stable contract excerpts with digest, e.g. auto-mode tier rules.

`render_template`: compile marked blocks and prompt-pack templates; fail if markers or placeholders are unresolved.

`invoke_script`: retain executable command refs with tool allowlist and args schema, e.g. `fanout-run.cjs`, `post-dispatch-validate.ts`.

`dynamic_target`: bind runtime paths like `{artifact_dir}` only through deterministic setup.

`conditional_fanout`: compile branches but mark activation predicate and required receipts.

`post_loop_save`: compile save payload schema and phase-save script reference only; do not expose as free prose.

4. **DRIFT GUARD**

Hard-fail in CI and build when a maintained source digest changes but compiled contract is stale, when markers/placeholders are unresolved, or when compiled tools exceed command frontmatter allowlist (`review.md:4`). Warn when non-execution presentation copy changes. Manual override only with an explicit `--accept-compiled-drift` plus recorded digest delta.

Resolve order: maintained layered sources always win; compiled artifact is generated output. Recovery command: `node .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs --command deep/review --write`.

5. **DETERMINISTIC SETUP LOADER**

The loader parses suffix, flags, `PRE-BOUND SETUP ANSWERS`, scope-extracted spec folder, and defaults before model execution, following `auto_mode_contract.md:31-38`. It emits one hydrated packet: `{contractPath, setupValues, writeBoundary, selectedWorkflow, renderedPromptPrelude}`. Any `[PLACEHOLDER]`, unknown required field, duplicate marker block, invalid path, or tool mismatch fails before YAML load, matching existing preflight intent in `deep_review_auto.yaml:193-200`.

6. **FOLD-IN**

Render blocks become `renderBlocks.auto|confirm` with literal START/END markers. The top-of-file executor block becomes typed `executorContract`, mode-bound to autonomous plus `writeBoundary`, avoiding another raw hard-rule prelude. Injection dedupe becomes `sourceDigests` plus one root-policy canonical hash and mirror note, addressing F-027/F-029. The 14 `.opencode/agents/*.md` files become thin pointers: “load compiled contract for command X”; per-agent rules remain source inputs only where mode-specific.

7. **FEASIBILITY VERDICT**

Not realistically one normal implementation phase. Schema plus review-only compiler is M. Deterministic loader is L. Drift guard plus CI is M-L. Retrofitting all commands and 14 agents is L. This should be carved into a dedicated `036` packet unless phase 003 is limited to design plus review-command prototype.

Riskiest unknowns: exact OpenCode prompt-injection insertion point, checksum ownership across generated markdown, and CLI executor parity for receipts/progress under fan-out.
