<!-- GENERATED_COMMAND_CONTRACT_HEADER_START
{
  "id": "deep/research",
  "command": "/deep:research",
  "version": 1,
  "generatedBy": ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs",
  "sourceDigests": [
    {
      "path": ".opencode/commands/deep/research.md",
      "sha256": "2b0ecf6282dfc49edee5c4a735c9edf1cab149ca52f8a0aa36e2a9d3ef032720",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep-research-presentation.txt",
      "sha256": "d4e661fdb76278ecbfb799c0333923e1ab6795bbdaf7437f544cbea07087ff97",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md",
      "sha256": "d5ca47fd46e04117e305e95b33ba3cf47ff6afb92131bfb1980f4fee2990c260",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep-research-auto.yaml",
      "sha256": "f4168717c35f4d8636b308d25fd0b4309876f58b8579a7ae0741990a463e7944",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep-research-confirm.yaml",
      "sha256": "ed6aa41151410f85659d46dac84116dda45d1557076fd4ca4d35bbe57bdffc2a",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/mode-registry.json",
      "sha256": "12cd354ffa65832fff12c248486279b2b410542d9294a7ca97fedcceeb4524dd",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/SKILL.md",
      "sha256": "38a263848cb72d8414f8307cbe0443b8e7a0f7a3c971af7a486bdb5753424ffe",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/SKILL.md",
      "sha256": "a1f111711db73b3b27cf29c1bebc778cf1c644ac71804f9ac0f4201f78198c79",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md",
      "sha256": "2f2c98b95d6b4ec1ec2219ec1adac8541e7b54463a21cf3837b6c8a7d45522c2",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md",
      "sha256": "f34370a914c0bea4bfc45873429ac5f59bdb6480e00b6a7dd93aec814802a935",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/references/state/state-format.md",
      "sha256": "0f74a85c354cea084a26d235166201e18a25fff005d86b7c35c406f9c34ef59f",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md",
      "sha256": "84f5caf5450d6c1102da8d618b61896485b32f464e968b2713bb3f038edef7bb",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json",
      "sha256": "364d3ad811d3f352ab9c149d12d73aeb9c70e5174e8a0edbdb6fa312d2206fa4",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md",
      "sha256": "ee645fc39e876f967943df8497d098dc63eca2b0c33d7dd78763071c65defacd",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl",
      "sha256": "fcfc3408e81ea6c260ad5b02881137b86b45c4885281216b828843186995c2a5",
      "section": "full"
    },
    {
      "path": ".opencode/agents/deep-research.md",
      "sha256": "fbb3502aa0830a03de2e358261c3e757d49a3254d768bfe251cd6f67f4308f0c",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs",
      "sha256": "8bb0a8d7cd4c37218ea9ad246eb9675e59fba897d13df8230ea2c4383a4faa9e",
      "section": "full"
    }
  ],
  "compiledBodyDigest": "6194dc4963d1ac19f4e4ff92d6cc5fdd63ee9bc622aa012fbb76880125a54dcb"
}
GENERATED_COMMAND_CONTRACT_HEADER_END -->
# Compiled Command Contract: /deep:research

This generated contract collapses the maintained command authority chain into one grep-checkable executor contract. Maintained sources remain authoritative; regenerate this file when any source digest changes.

## autonomousExecutionDirective

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/research` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (see gate3Precedence below).
- PROCEED immediately: load the auto workflow YAML and dispatch the `deep-research` agent to run ONE iteration of the research loop over the bound target.
- DISPATCH ONLY: you dispatch `deep-research` to run one iteration; you do NOT read, edit, patch, or run the research loop over the target yourself. The auto workflow YAML owns the loop itself — setup, dispatch-per-iteration, reducer sync, convergence checks, synthesis, and all loop-level artifact writes; the `deep-research` leaf owns only its own single-iteration artifacts — mixing your own inline work with the dispatch is a route violation.
- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so `deep-research` writes each iteration state record with the route-proof fields present — `target_agent: "deep-research"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "research"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

Your job is to DISPATCH `deep-research` to run ONE iteration of the research loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. The auto workflow YAML owns the loop itself (setup, dispatch-per-iteration, reducer sync, convergence, synthesis, and loop-level writes). This contract is your instruction set; the research target is the bound spec_folder/target named in your message, never this document.

## sourceAuthority

1. `.opencode/commands/deep/research.md`
2. `.opencode/commands/deep/assets/deep-research-presentation.txt`
3. `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`
4. `.opencode/commands/deep/assets/deep-research-auto.yaml`
5. `.opencode/commands/deep/assets/deep-research-confirm.yaml`
6. `.opencode/skills/system-deep-loop/mode-registry.json`
7. `.opencode/skills/system-deep-loop/SKILL.md`
8. `.opencode/skills/system-deep-loop/deep-research/SKILL.md`
9. `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
10. `.opencode/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md`
11. `.opencode/skills/system-deep-loop/deep-research/references/state/state-format.md`
12. `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
13. `.opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json`
14. `.opencode/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md`
15. `.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`
16. `.opencode/agents/deep-research.md`
17. `.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs`

## gate3Precedence

```yaml
block: gate3Precedence
classifierPath: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts
classifierLines:
  commandContractShape: "67-72"
  autonomousSatisfaction: "653-680"
command: /deep:research
executionMode: AUTONOMOUS
commandContract:
  declaresAutonomousExecution: true
  ownsSpecFolderSetup: true
  allowedSpecFolderSources:
    - flag
    - marker
    - scope_extract
  writeBoundary: "{artifact_dir} resolved from spec_folder for research"
rule: "When the classifier receives AUTONOMOUS execution, a validated prebound spec folder, and this command contract, Gate 3 is satisfied by the prebound folder before any write."
```

## renderBlocks.auto

Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.

<!-- START renderBlocks.auto -->
~~~markdown
### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{artifact_dir}/deep-research-config.json` (shape: `researchTopic`, `specFolder`, `maxIterations`, `convergenceThreshold`, `antiConvergence.convergenceMode`, reserved `antiConvergence.divergent: {}`, `executionMode: "auto"`, `resource_map.emit`, `config.executor.*`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep-research-auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_folder`. **Ordering rule**: none needed. Missing `research_topic` is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:research:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto-mode-contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  research_topic: WebSocket reconnection strategies  # string
  spec_folder: <spec-folder>  # existing | new | update-related | phase-folder | explicit path
  execution_mode: AUTONOMOUS  # from :auto suffix
  maxIterations: 10  # positive integer
  convergenceThreshold: 0.05  # decimal 0..1
  convergence_mode: default  # default | off | sliding-window | divergent
  executor: native  # native | cli-codex | cli-claude-code | cli-opencode | cli-cursor | cli-devin | cli-pi (`EXECUTOR_KINDS` in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`)
  executor_model: ""  # optional executor-specific model id (cli-opencode e.g. xiaomi-token-plan-ams/mimo-v2.5-pro, minimax-coding-plan/MiniMax-M2.7-highspeed)
  executor_config_dir: ""  # optional, cli-claude-code only; maps to CLAUDE_CONFIG_DIR
  executor_reasoning: ""  # optional reasoning effort
  executor_service_tier: ""  # optional service tier
  executor_timeout: 900  # optional positive integer seconds
  resource_map_emit: true  # boolean
```

Rules: see `auto-mode-contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field                   | Required | Resolves Via                                                                                                                                                                                           | Default                            | Tier-2 Candidate                                        |
| -------------------------| ----------| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ------------------------------------| ---------------------------------------------------------|
| `research_topic`        | Y        | `$ARGUMENTS` positional topic, or marker `research_topic`                                                                                                                                              | none                               | N                                                       |
| `spec_folder`           | Y        | flag `--spec-folder`, marker `spec_folder`, `scope-extract` → a spec-folder path named in the topic/`$ARGUMENTS` that resolves to an existing folder (auto-bound + stripped, per `auto_mode_contract` §1 source 3), or targeted choice among suggested existing/new/update-related/phase folder | none | Y, ONLY when topic is present, names no resolvable spec folder, and the folder choice is ambiguous |
| `execution_mode`        | Y        | attached suffix `:auto` or marker `execution_mode`                                                                                                                                                     | `AUTONOMOUS` under `:auto`         | N                                                       |
| `maxIterations`         | Y        | flag `--max-iterations`, marker `maxIterations`, or default                                                                                                                                            | `10`                               | N                                                       |
| `convergenceThreshold`  | Y        | flag `--convergence`, marker `convergenceThreshold`, or default                                                                                                                                        | `0.05`                             | N                                                       |
| `convergence_mode`      | Y        | flag `--convergence-mode=default|off|sliding-window|divergent`, marker `convergence_mode`, or default                                                                                                  | `default`                          | N                                                       |
| `stop_policy`           | Y        | flag `--stop-policy=convergence|max-iterations`, marker `stop_policy`, or default                                                                                                                      | `convergence`                      | N                                                       |
| `executor`              | N        | flag `--executor`, marker `executor`, config file, or default                                                                                                                                          | `native`                           | N                                                       |
| `executor_model`        | N        | flag `--model`, marker `executor_model`, or executor-specific validation                                                                                                                               | none                               | N                                                       |
| `executor_config_dir`   | N        | flag `--config-dir`, marker `executor_config_dir`, or executor-specific default                                                                                                                        | none                               | N                                                       |
| `executor_reasoning`    | N        | flag `--reasoning-effort`, marker `executor_reasoning`, or executor default                                                                                                                            | none                               | N                                                       |
| `executor_service_tier` | N        | flag `--service-tier`, marker `executor_service_tier`, or executor default                                                                                                                             | none                               | N                                                       |
| `executor_timeout`      | N        | flag `--executor-timeout`, marker `executor_timeout`, or default                                                                                                                                       | `900`                              | N                                                       |
| `resource_map_emit`     | N        | flag `--no-resource-map`, marker `resource_map_emit`, or default                                                                                                                                       | `true`                             | N                                                       |
| `fanout_executors`      | N        | repeatable `--executor=<type>` flags or `--executors=<json>`; each `--executor` group accepts `--model`, `--config-dir`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`, `--label`, `--count` | none (single-executor when absent) | N                                                       |
| `fanout_concurrency`    | N        | flag `--concurrency=N`                                                                                                                                                                                 | `2`                                | N                                                       |

**Fan-out default policy:** 0–1 `--executor` flags and no `--executors` → `config.executor` (single-executor, default, unchanged). 2+ `--executor` flags, `--executors`, or any `--count > 1` → `config.fanout`. Native fan-out (count N for `native` executor) runs N sequential `@deep-research` agent dispatches with isolated dirs. CLI fan-out runs N headless subprocesses concurrently in the capped pool.
~~~
<!-- END renderBlocks.auto -->

## renderBlocks.confirm

Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.

<!-- START renderBlocks.confirm -->
~~~markdown
### Consolidated Prompt Template

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"         -> execution_mode = "AUTONOMOUS"
   |-- ":confirm"      -> execution_mode = "INTERACTIVE"
   +-- No suffix       -> execution_mode = "ASK"

2. CHECK $ARGUMENTS for topic:
   |-- Has content (ignoring suffixes and flags):
   |     -> research_topic = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --convergence-mode=default|off|sliding-window|divergent -> antiConvergence.convergenceMode = value
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   |-- --executor=<type> -> config.executor.type (`native` | `cli-codex` | `cli-claude-code` | `cli-opencode` | `cli-cursor` | `cli-devin` | `cli-pi`; `EXECUTOR_KINDS` in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` is authoritative)
   |-- --model=<id> -> config.executor.model (for example `gpt-5.4`)
   |-- --config-dir=<path> -> config.executor.configDir (cli-claude-code only; fan-out sets CLAUDE_CONFIG_DIR)
   |-- --reasoning-effort=<level> -> config.executor.reasoningEffort (`none` | `minimal` | `low` | `medium` | `high` | `xhigh` | `max`)
   |-- --service-tier=<tier> -> config.executor.serviceTier (`priority` | `standard` | `fast`)
   |-- --executor-timeout=<seconds> -> config.executor.timeoutSeconds (positive integer, default `900`)
   |-- --no-resource-map -> config.resource_map.emit = false
   |-- --executor=<type> [--model=X] [--config-dir=PATH] [--reasoning-effort=Y] [--service-tier=Z] [--executor-timeout=N] [--iters=N] [--label=X] [--count=N]
   |     (repeatable; each occurrence adds one entry to config.fanout.executors)
   |-- --executors=<json> -> config.fanout.executors = parse(json) escape hatch for complex configs
   |-- --concurrency=N -> config.fanout.concurrency (default 2)
   |
   |   Fan-out default policy:
   |   - 0 or 1 --executor (no --executors, no count>1): write config.executor (single, unchanged)
   |   - 2+ --executor flags, --executors, or any count>1: write config.fanout
   |
   +-- Defaults: maxIterations=10, convergenceThreshold=0.05, antiConvergence.convergenceMode=`default`, antiConvergence.divergent=`{}`, config.executor.type=`native`, config.executor.timeoutSeconds=900, config.resource_map.emit=`true`

   Executor precedence for setup resolution:
   - CLI flag > config file > schema defaults
   - The generated `deep-research-config.json` stores executor settings under `config.executor.*`

   Parsing to config mapping:
   - `--executor` -> `config.executor.type`
   - `--model` -> `config.executor.model`
   - `--config-dir` -> `config.executor.configDir`
   - `--reasoning-effort` -> `config.executor.reasoningEffort`
   - `--service-tier` -> `config.executor.serviceTier`
   - `--executor-timeout` -> `config.executor.timeoutSeconds`
   - `--convergence-mode` -> `antiConvergence.convergenceMode`

   Validation hook:
   - `parseExecutorConfig` from `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` runs at config-write time
   - Invalid combinations fail fast with clear errors: an unknown executor kind (schema enum), a field the kind does not support (`EXECUTOR_KIND_FLAG_SUPPORT`, e.g. `--service-tier` on `cli-cursor`), an off-allowlist model on `cli-cursor`/`cli-devin`/`cli-pi`, and a missing executor binary

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: research_topic OR "deep-research", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):
   - Include Q-Exec only when `--executor` is NOT present and the topic text does NOT already mention executor hints such as `cli-opencode`, `cli-claude-code`, or `gpt-5.4`
   - If Q-Exec is omitted and no executor is otherwise resolved, default to `native`

   Q0. Research Topic (if not in command): What topic to research deeply?

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 10. Change? [Enter number or press enter for default]

   Q-Exec. Executor (optional, press enter for default):
     A) Native (default) — dispatch via @deep-research agent with Opus.
     B) cli-opencode — `opencode run --model X --format json --dangerously-skip-permissions --pure --dir {repo_root} [--variant Y] "PROMPT" </dev/null` (no `--agent`: current opencode rejects top-level `--agent general` — default agent runs; required for MiniMax/Xiaomi token-plan models). `reasoningEffort` maps to `--variant`. No service-tier.
     C) cli-claude-code — `claude -p "PROMPT" --model X --permission-mode acceptEdits` with optional --effort and optional `--config-dir=PATH` for CLAUDE_CONFIG_DIR. No service-tier.
     D) cli-codex — requires the `codex` binary on PATH. Supports `--reasoning-effort` and `--service-tier`.
     E) cli-cursor — requires `cursor-agent`. Model must be on the enforced allowlist. No `--reasoning-effort` (effort is baked into the model id), no `--service-tier`.
     F) cli-devin — requires `devin`. Model must be on the enforced allowlist. No `--reasoning-effort`, no `--service-tier`.
     G) cli-pi — requires `pi`. Model must be on the enforced allowlist. `reasoningEffort` maps to `--thinking`. No `--service-tier`, no sandbox flag.
     D-G build their commands through the shared fan-out command builder (`LINEAGE_COMMAND_ADAPTERS` in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Per-kind flag support (`EXECUTOR_KIND_FLAG_SUPPORT`) and the cli-cursor/cli-devin/cli-pi model allowlists (`CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`, `PI_SUPPORTED_MODELS`) are owned by `executor-config.ts`; this contract does not restate them. Off-allowlist model or missing binary fails closed — a requested CLI executor never degrades to native.

   Reply format examples:
   - `"A, A"`
   - `"WebSocket research, A, B, 15"`
   - `"WebSocket reconnection strategies, B, A, 10, 0.05, B, gpt-5.4, high, fast"`
   - `"agent execution guardrails research, B, A, 15, 0.05, C, gpt-5.4, _, _"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - research_topic = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 10]
   - convergenceThreshold = [from flag or default 0.05]
   - convergence_mode = [from flag, marker, or default `default`; one of `default`, `off`, `sliding-window`, `divergent`]
    - executor config = [CLI flags, compact reply, config file, or default `native`; map compact reply fields to `config.executor.type/model/configDir/reasoningEffort/serviceTier`, and accept an optional volunteered convergence value before executor fields]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**
- `research_topic` | `spec_choice` | `spec_path`
- `execution_mode` | `maxIterations` | `convergenceThreshold` | `convergence_mode`
~~~
<!-- END renderBlocks.confirm -->

## setup

```yaml
block: setup
mode: "AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied"
requiredFields:
  - "research_topic"
  - "spec_folder"
  - "execution_mode"
  - "maxIterations"
  - "convergenceThreshold"
optionalFields:
  - "dry_run"
  - "executor"
  - "executor_model"
  - "executor_config_dir"
  - "executor_reasoning"
  - "executor_service_tier"
  - "executor_timeout"
  - "resource_map_emit"
  - "fanout_executors"
  - "fanout_concurrency"
autoWorkflow: .opencode/commands/deep/assets/deep-research-auto.yaml
confirmWorkflow: .opencode/commands/deep/assets/deep-research-confirm.yaml
```

## outputTemplate

```yaml
block: outputTemplate
promptPackPath: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl
requiredArtifacts:
  - "{state_paths_iteration_pattern} iteration narrative markdown"
  - "{state_paths_state_log} append-only canonical JSONL iteration record"
  - "{state_paths_delta_pattern} per-iteration delta JSONL"
validation: "YAML-owned post-dispatch validation rejects missing or malformed artifacts."
```

## writeBoundary

```yaml
block: writeBoundary
approvedRoot: "{artifact_dir} resolved from spec_folder for research"
allowed:
  - "{state_paths_iteration_pattern}"
  - "{state_paths_state_log} append only"
  - "{state_paths_delta_pattern}"
  - "{state_paths.research_output} only when progressive synthesis is enabled"
  - "idea capture files only when explicitly allowed and packet-local"
readOnly:
  - "{state_paths_strategy}"
  - "{state_paths_registry}"
  - "{state_paths_dashboard}"
  - "command Markdown"
  - "workflow YAML assets"
  - "agent definitions"
  - "compiled contracts other than the selected build target"
banned:
  - "delete, rename, move, or truncate operations outside the allowed list"
  - "writes outside the resolved research packet"
  - "implementation fixes during research execution"
```

## executorContract

```yaml
block: executorContract
appliesWhen:
  executionMode: AUTONOMOUS
  writeBoundaryResolved: true
rules:
  - "The command Markdown resolves setup and selects YAML; YAML owns dispatch, workflow steps, and artifact writes."
  - "Executor dispatch must preserve route intent, selected mode, target agent, write boundary, and artifact paths."
  - "Native and CLI executors must produce only the required prompt-pack artifacts inside the resolved boundary."
  - "Fan-out receipt parity is not claimed here; fan-out remains governed by the workflow runner and merge contract."
  - "Missing or invalid receipt evidence makes route claims advisory only and forbids findings output."
```

## refs

```yaml
block: refs
dispatchReceipt:
  writer: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
  validator: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts
  rule: "Reference the existing intent/completion receipt pair and validator; do not copy receipt logic into the command contract."
progressRecord:
  writer: .opencode/skills/system-deep-loop/shared/progress/progress-record.cjs
  rule: "Reference additive started/completed progress records as liveness evidence; progress records are not iteration, convergence, or completion records."
```

## tools

```yaml
block: tools
allowed:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Grep"
  - "Glob"
  - "Task"
  - "WebFetch"
  - "memory_context"
  - "memory_search"
permittedByExecutor:
  native:
    - "Read"
    - "Write"
    - "Edit"
    - "Bash"
    - "Grep"
    - "Glob"
    - "WebFetch"
    - "memory_context"
    - "memory_search"
  cli-opencode:
    - "headless command execution through YAML-owned audited dispatch only"
  cli-claude-code:
    - "headless command execution through YAML-owned audited dispatch only"
```

## absorptionAbort

```yaml
block: absorptionAbort
rule: "Producing findings without a dispatch receipt is role absorption; write no findings."
writePolicy: "If receipt evidence is absent, invalid, or mismatched to command intent, emit an abort status and leave finding artifacts unwritten."
```
