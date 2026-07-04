<!-- GENERATED_COMMAND_CONTRACT_HEADER_START
{
  "id": "deep/review",
  "command": "/deep:review",
  "version": 1,
  "generatedBy": ".opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs",
  "sourceDigests": [
    {
      "path": ".opencode/commands/deep/review.md",
      "sha256": "1832858fd7081288b43f49e7391dc95fdd375a2d3c06adc5a914b65b66aec021",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep_review_presentation.txt",
      "sha256": "ae7d3eea6a1af0e0fb6b456afcc5aa14472154d60d7f25fa214a13b3f0c515e0",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md",
      "sha256": "cc283b7c5e62bd8b012a8f249f4cc63f4f353ad264358e1a5c9b85d753713d64",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep_review_auto.yaml",
      "sha256": "79d7d3d9f04b59868b7bff44672d9b264e5639d80e2ea530543eb0890e4af0cb",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep_review_confirm.yaml",
      "sha256": "30acc93a317893371c5be6fd2387466dd6e10d52b4453e2cfa5dacfc7e980b9d",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/mode-registry.json",
      "sha256": "0e985397e1f957f0aee15ce5a569b5a7c730a8b83df413fb9e73a883d31e9222",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/SKILL.md",
      "sha256": "178744c3eaa704e9eccd43abf53f777c025dc1c6c64487ff57ea1f117d81e9dd",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-review/SKILL.md",
      "sha256": "4c0ae340f7e802e163ce3eb5b9e4119fd0690edf0be00d2d53707311e4e33409",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md",
      "sha256": "bef3be883307c40b5df3ab196ef0168fabd67e4edc27f31678ef9b8a74320143",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-review/references/state/state_format.md",
      "sha256": "c9f0a84bc95ae1d9414d18a9fcef0fd7ab7ee7bdaac9ac97d4749035c5795258",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml",
      "sha256": "28e484288faddcca07b72fc5463a5a895ab7ed8c5ae5d789e4657ebcba9cb1d4",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-review/references/convergence/convergence.md",
      "sha256": "d4f0c3df7fc7883c8f80796f39bc2091eb50be878540ee03a19e396166e87171",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json",
      "sha256": "7b1517d1efc19eaec9be1ab75181228b422f953feabfd58f5ade086b611c4b3a",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl",
      "sha256": "af7586fce11678ace3f2265d182077dedabfefece02f05b7562ddef550375ef9",
      "section": "full"
    },
    {
      "path": ".opencode/agents/deep-review.md",
      "sha256": "bb5d2f265392d777955ff6f354c4f356691baf2cba4e79365a5edbd6255f6f08",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs",
      "sha256": "3c801fbecbc5bb01a99a7578243a823b791368cc229966b930418cfb468500df",
      "section": "full"
    }
  ],
  "compiledBodyDigest": "47f371d3f4b3f9e5b80154c51e5ddef159707399e0eb899ab6da584f5db3e7fe"
}
GENERATED_COMMAND_CONTRACT_HEADER_END -->
# Compiled Command Contract: /deep:review

This generated contract collapses the maintained command authority chain into one grep-checkable executor contract. Maintained sources remain authoritative; regenerate this file when any source digest changes.

## autonomousExecutionDirective

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/review` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (see gate3Precedence below).
- PROCEED immediately: load the auto workflow YAML and dispatch the `deep-review` agent to run the review loop over the bound target.

Your task is to RUN THE REVIEW LOOP over the bound target — NOT to review, analyze, or summarize this contract. This contract is your instruction set; the review target is the bound spec_folder/target named in your message, never this document.

## sourceAuthority

1. `.opencode/commands/deep/review.md`
2. `.opencode/commands/deep/assets/deep_review_presentation.txt`
3. `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`
4. `.opencode/commands/deep/assets/deep_review_auto.yaml`
5. `.opencode/commands/deep/assets/deep_review_confirm.yaml`
6. `.opencode/skills/deep-loop-workflows/mode-registry.json`
7. `.opencode/skills/deep-loop-workflows/SKILL.md`
8. `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md`
9. `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md`
10. `.opencode/skills/deep-loop-workflows/deep-review/references/state/state_format.md`
11. `.opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml`
12. `.opencode/skills/deep-loop-workflows/deep-review/references/convergence/convergence.md`
13. `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json`
14. `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl`
15. `.opencode/agents/deep-review.md`
16. `.opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs`

## gate3Precedence

```yaml
block: gate3Precedence
classifierPath: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts
classifierLines:
  commandContractShape: "67-72"
  autonomousSatisfaction: "653-680"
command: /deep:review
executionMode: AUTONOMOUS
commandContract:
  declaresAutonomousExecution: true
  ownsSpecFolderSetup: true
  allowedSpecFolderSources:
    - flag
    - marker
    - scope_extract
  writeBoundary: "{artifact_dir} resolved from spec_folder for review"
rule: "When the classifier receives AUTONOMOUS execution, a validated prebound spec folder, and this command contract, Gate 3 is satisfied by the prebound folder before any write."
```

## renderBlocks.auto

Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.

<!-- START renderBlocks.auto -->
~~~markdown
### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, resolve `{artifact_dir}` and persist to `{artifact_dir}/deep-review-config.json` (shape: `reviewTarget`, `reviewTargetType`, `reviewDimensions`, `specFolder`, `maxIterations`, `convergenceThreshold`, `stopPolicy`, `executionMode: "auto"`, `lineageMode`, `resource_map.emit`, `config.executor.*`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep_review_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `review_target_type`, `spec_folder`. **Ordering rule**: if `review_target_type` is ambiguous, ask only for `review_target_type` first — the answer may make `spec_folder` self-evident on the next Tier 1 pass. Missing `review_target` is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:review:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the Consolidated Setup Prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults.

```yaml
PRE-BOUND SETUP ANSWERS:
  review_target: <spec-folder>
  review_target_type: spec-folder  # one of: spec-folder | skill | agent | track | files
  review_dimensions: all  # or comma-separated subset: correctness, security, traceability, maintainability
  spec_folder: existing  # one of: existing | new | update-related | phase-folder, or an explicit specs/.opencode/specs path
  execution_mode: AUTONOMOUS  # from :auto suffix
 lineage_mode: auto  # one of: auto | resume | restart
  maxIterations: 10
  convergenceThreshold: 0.10
  stop_policy: convergence  # one of: convergence | max-iterations
  executor: native  # one of: native | cli-opencode | cli-claude-code | cli-opencode
  executor_model: ""  # optional, executor-specific (cli-opencode e.g. xiaomi-token-plan-ams/mimo-v2.5-pro, minimax-coding-plan/MiniMax-M2.7-highspeed)
  executor_config_dir: ""  # optional, cli-claude-code only; maps to CLAUDE_CONFIG_DIR
  executor_reasoning: ""  # optional
  executor_service_tier: ""  # optional
  executor_timeout: 900  # optional
  resource_map_emit: true  # optional
```

Rules:

- Any unspecified field falls back to its documented default.
- Marker fields take precedence over `$ARGUMENTS` flags because the caller explicitly bound setup in the prompt body.
- Unknown fields are warnings, not errors.
- Malformed lines, including missing `:`, emit a parse error naming the offending line. Known fields parsed before the error may still be used, and unresolved fields continue to Tier 2 or Tier 3.
- Empty strings count as unresolved for required fields.
- Compact legacy answer strings are only for the consolidated `:confirm` prompt. They are not a `:auto` marker format.

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `review_target` | Y | `$ARGUMENTS` first positional target, or marker `review_target` | none | N |
| `review_target_type` | Y | marker `review_target_type`, or auto-detect from `review_target` | inferred only | Y, when target is present but ambiguous |
| `review_dimensions` | Y | flag `--dims` if supported by caller, marker `review_dimensions`, or default | `"all"` | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, `scope-extract` → a target/scope path that resolves to an existing spec folder (auto-bound, per `auto_mode_contract` §1 source 3), or target path when target is a spec folder | none | Y, when target is not a spec folder |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `lineage_mode` | Y | flag `--restart`, flag `--lineage-mode=auto|resume|restart`, marker `lineage_mode`, or default | `auto` | N |
| `maxIterations` | Y | flag `--max-iterations`, marker `maxIterations`, or default | `7` | N |
| `convergenceThreshold` | Y | flag `--convergence`, marker `convergenceThreshold`, or default | `0.10` | N |
| `stop_policy` | Y | flag `--stop-policy=convergence|max-iterations`, marker `stop_policy`, or default | `convergence` | N |
| `executor` | N | flag `--executor`, marker `executor`, config file, or default | `native` | N |
| `executor_model` | N | flag `--model`, marker `executor_model`, or executor-specific validation | none | N |
| `executor_config_dir` | N | flag `--config-dir`, marker `executor_config_dir`, or executor-specific default | none | N |
| `executor_reasoning` | N | flag `--reasoning-effort`, marker `executor_reasoning`, or executor default | none | N |
| `executor_service_tier` | N | flag `--service-tier`, marker `executor_service_tier`, or executor default | none | N |
| `executor_timeout` | N | flag `--executor-timeout`, marker `executor_timeout`, or default | `900` | N |
| `resource_map_emit` | N | flag `--no-resource-map`, marker `resource_map_emit`, or default | `true` | N |
| `config.fanout_lineage_artifact_dir` | N | internal flag `--fanout-lineage-artifact-dir=PATH` or marker `config.fanout_lineage_artifact_dir` | none | N |
| `fanout_executors` | N | repeatable `--executor=<type>` flags or `--executors=<json>`; each group accepts `--model`, `--config-dir`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`, `--label`, `--count` | none (single-executor when absent) | N |
| `fanout_concurrency` | N | flag `--concurrency=N` | `2` | N |

**Fan-out default policy:** 0–1 `--executor` flags and no `--executors` → `config.executor` (single-executor, default, unchanged). 2+ `--executor` flags, `--executors`, or any `--count > 1` → `config.fanout`. Review fan-out uses strongest-restriction: any lineage active P0 → merged FAIL. Native and CLI fan-out lineages run under `fanout-run.cjs` in the capped pool so every lineage shares retries, artifact checks, and stop-policy validation. The native adapter calls the `deep/review` command with the internal `--fanout-lineage-artifact-dir` override; it must not dispatch the LEAF `@deep-review` agent or a pasted phase-running prompt as a full-loop sub-agent. When fan-out includes `cli-opencode`, that lineage is an explicit parallel-detached OpenCode session with its own lineage directory and session id; this is the documented exception to the cli-opencode self-invocation guard. Single-executor `cli-opencode` remains cross-runtime only.

**Lifecycle policy:** `lineage_mode=auto` preserves the existing classifier behavior, `lineage_mode=resume` continues a valid packet, and `lineage_mode=restart` archives the resolved `{artifact_dir}` before any config write, phase init, or fan-out spawn. In `:auto`, an explicit `--restart` or `--lineage-mode=restart` flag is operator authorization for this archive move, so do not ask for a second confirmation. Preserve rollback by moving the timestamped archive back to `review/` if needed. A restart request must never silently downgrade to resume; if the archive step cannot run, halt with `STATUS=FAIL`.

**Stop policy:** `stop_policy=convergence` preserves normal deep-review behavior: legal convergence may stop before `maxIterations`. `stop_policy=max-iterations` makes convergence signals telemetry-only until the iteration ceiling; before `maxIterations`, broaden the next angle instead of synthesizing. Terminal manual pause, user stop, unrecoverable error, and `maxIterationsReached` still stop.
~~~
<!-- END renderBlocks.auto -->

## renderBlocks.confirm

Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.

<!-- START renderBlocks.confirm -->
~~~markdown
### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode

Use this block only when `execution_mode = "INTERACTIVE"` or when no suffix was supplied and Q2 must ask for the execution mode.

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"    -> execution_mode = "AUTONOMOUS"
   |-- ":confirm" -> execution_mode = "INTERACTIVE"
   +-- No suffix  -> execution_mode = "ASK" (include Q2)

2. CHECK $ARGUMENTS for target (review_target):
   |-- Has content (ignoring suffixes and flags):
   |     -> review_target = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --stop-policy=convergence|max-iterations -> stop_policy = value
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   |-- --restart -> lineage_mode = restart
   |-- --lineage-mode=auto|resume|restart -> lineage_mode = value
   |-- --executor=<type> -> config.executor.type (`native` | `cli-opencode` | `cli-claude-code` | `cli-opencode`)
   |-- --model=<id> -> config.executor.model (for example `gpt-5.4`)
   |-- --config-dir=<path> -> config.executor.configDir (cli-claude-code only; fan-out sets CLAUDE_CONFIG_DIR)
   |-- --reasoning-effort=<level> -> config.executor.reasoningEffort (`none` | `minimal` | `low` | `medium` | `high` | `xhigh` | `max`)
   |-- --service-tier=<tier> -> config.executor.serviceTier (`priority` | `standard` | `fast`)
   |-- --executor-timeout=<seconds> -> config.executor.timeoutSeconds (positive integer, default `900`)
   |-- --no-resource-map -> config.resource_map.emit = false
   |-- --fanout-lineage-artifact-dir=PATH -> config.fanout_lineage_artifact_dir = PATH (internal single-lineage command invocation only)
   |-- --executor=<type> [--model=X] [--config-dir=PATH] [--reasoning-effort=Y] [--service-tier=Z] [--executor-timeout=N] [--iters=N] [--label=X] [--count=N]
   |     (repeatable; each occurrence adds one entry to config.fanout.executors)
   |-- --executors=<json> -> config.fanout.executors = parse(json) escape hatch
   |-- --concurrency=N -> config.fanout.concurrency (default 2)
   |
   |   Fan-out default policy:
   |   - 0 or 1 --executor (no --executors, no count>1): write config.executor (single, unchanged)
   |   - 2+ --executor flags, --executors, or any count>1: write config.fanout
   |   - Review fan-out verdict: strongest-restriction (any lineage active P0 → merged FAIL)
   |
   +-- Defaults: maxIterations=7, convergenceThreshold=0.10, stop_policy=`convergence`, lineage_mode=`auto`, config.executor.type=`native`, config.executor.timeoutSeconds=900, config.resource_map.emit=`true`

   Executor precedence for setup resolution:
   - CLI flag > config file > schema defaults
   - The generated `deep-review-config.json` stores executor settings under `config.executor.*`

   Parsing to config mapping:
   - `--executor` -> `config.executor.type`
   - `--model` -> `config.executor.model`
   - `--config-dir` -> `config.executor.configDir`
   - `--reasoning-effort` -> `config.executor.reasoningEffort`
   - `--service-tier` -> `config.executor.serviceTier`
   - `--executor-timeout` -> `config.executor.timeoutSeconds`

   Validation hook:
   - `parseExecutorConfig` from `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` runs at config-write time
   - Invalid combinations fail fast with clear errors, including `cli-opencode` without `--model` and reserved-but-unwired executor kinds

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: review_target OR "deep-review", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):
   - Include Q-Exec only when `--executor` is NOT present and the target text does NOT already mention executor hints such as `cli-opencode`, ``, or `gpt-5.4`
   - If Q-Exec is omitted and no executor is otherwise resolved, default to `native`

   Q0. Review Target (if not in command): What to review?
     Examples: spec folder path, `skill:sk-name`, `agent:name`, `track:NN--name`, or file paths/globs

   Q1_type. Review Target Type (auto-detect from Q0, confirm):
     A) spec-folder -- Review spec artifacts + implementation files
     B) skill -- SKILL.md + references/ + assets/ + agents + commands
     C) agent -- Agent family across all runtimes
     D) track -- All child spec folders in a feature track
     E) files -- Arbitrary file paths or globs

   Q_dims. Which review dimensions? (default: all 4)
     All: correctness, security, traceability, maintainability
     Or specify a subset (e.g., "correctness, security")

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 7 for review. Change? [Enter number or press enter for default]

   Q-Exec. Executor (optional, press enter for default):
     A) Native (default) — dispatch via @deep-review agent with Opus.
     B) cli-opencode — ` exec` with --model X -c model_reasoning_effort -c service_tier.
      C) cli-claude-code — `claude -p "PROMPT" --model X --permission-mode acceptEdits` with optional --effort and optional `--config-dir=PATH` for CLAUDE_CONFIG_DIR. No service-tier.
     D) cli-opencode — `opencode run --model X --format json --dangerously-skip-permissions --pure --dir {repo_root} [--variant Y] "PROMPT" </dev/null` (no `--agent`: current opencode rejects top-level `--agent general` — default agent runs; required for MiniMax/Xiaomi token-plan models). `reasoningEffort` maps to `--variant`. No service-tier.

   Reply format examples:
   - `"skill:deep-research, B, all, A, A"`
   - `"review the deep-review packet output, E, correctness security, B, B, 5"`
   - `"Review review/review-report.md contract drift, E, all, A, 7, 0.10, B, gpt-5.4, high, fast"`
   - `"review executor drift across CLIs, E, all, A, 7, 0.10, C, gpt-5.4, _, _"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - review_target = [from Q0 or $ARGUMENTS]
   - review_target_type = [from Q1_type, auto-detected]
   - review_dimensions = [from Q_dims or default "all"]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - lineage_mode = [auto/resume/restart from flag, marker, or default auto]
   - maxIterations = [from Q3 or flag or default 7]
   - convergenceThreshold = [from flag or default 0.10]
   - stop_policy = [from flag, marker, or default convergence]
    - executor config = [CLI flags, compact reply, config file, or default `native`; map compact reply fields to `config.executor.type/model/configDir/reasoningEffort/serviceTier`, and accept an optional volunteered convergence value before executor fields]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**

- `review_target` | `review_target_type` | `review_dimensions`
- `spec_choice` | `spec_path` | `execution_mode` | `maxIterations` | `convergenceThreshold` | `stop_policy`
- `lineage_mode`
- `config.fanout_lineage_artifact_dir` when present
~~~
<!-- END renderBlocks.confirm -->

## setup

```yaml
block: setup
mode: "AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied"
requiredFields:
  - "review_target"
  - "review_target_type"
  - "review_dimensions"
  - "spec_folder"
  - "execution_mode"
  - "lineage_mode"
  - "maxIterations"
  - "convergenceThreshold"
  - "stop_policy"
optionalFields:
  - "executor"
  - "executor_model"
  - "executor_config_dir"
  - "executor_reasoning"
  - "executor_service_tier"
  - "executor_timeout"
  - "resource_map_emit"
  - "config.fanout_lineage_artifact_dir"
  - "fanout_executors"
  - "fanout_concurrency"
autoWorkflow: .opencode/commands/deep/assets/deep_review_auto.yaml
confirmWorkflow: .opencode/commands/deep/assets/deep_review_confirm.yaml
```

## outputTemplate

```yaml
block: outputTemplate
promptPackPath: .opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl
requiredArtifacts:
  - "{state_paths_iteration_pattern} iteration narrative markdown"
  - "{state_paths_state_log} append-only canonical JSONL iteration record"
  - "{state_paths_delta_pattern} per-iteration delta JSONL"
validation: "YAML-owned post-dispatch validation rejects missing or malformed artifacts."
```

## writeBoundary

```yaml
block: writeBoundary
approvedRoot: "{artifact_dir} resolved from spec_folder for review"
allowed:
  - "{state_paths_iteration_pattern}"
  - "{state_paths_state_log} append only"
  - "{state_paths_delta_pattern}"
  - "{state_paths_strategy} in-place updates only"
  - "{state_paths_findings_registry} in-place updates only"
readOnly:
  - "declared review target"
  - "command Markdown"
  - "workflow YAML assets"
  - "agent definitions"
  - "compiled contracts other than the selected build target"
banned:
  - "delete, rename, move, or truncate operations outside the allowed list"
  - "writes outside the resolved review packet"
  - "implementation fixes during review execution"
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
  writer: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts
  validator: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts
  rule: "Reference the existing intent/completion receipt pair and validator; do not copy receipt logic into the command contract."
progressRecord:
  writer: .opencode/skills/deep-loop-workflows/shared/progress/progress-record.cjs
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
  - "memory_context"
  - "memory_search"
  - "code_graph_query"
  - "code_graph_context"
permittedByExecutor:
  native:
    - "Read"
    - "Write"
    - "Edit"
    - "Bash"
    - "Grep"
    - "Glob"
    - "memory_context"
    - "memory_search"
    - "code_graph_query"
    - "code_graph_context"
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
