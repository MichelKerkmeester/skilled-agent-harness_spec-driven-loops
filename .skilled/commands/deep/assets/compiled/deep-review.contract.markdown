<!-- GENERATED_COMMAND_CONTRACT_HEADER_START
{
  "id": "deep/review",
  "command": "/deep:review",
  "version": 1,
  "generatedBy": ".skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs",
  "sourceDigests": [
    {
      "path": ".skilled/commands/deep/review.md",
      "sha256": "ea1f04a4c5b482bbe92c6e76afffa1d77f0bed613a0e62de12d5ea280e28b613",
      "section": "full"
    },
    {
      "path": ".skilled/commands/deep/assets/deep-review-presentation.txt",
      "sha256": "736a468453a01efd26e27df5bd1cd75ccec373bb774cea9274b3918e16ee4431",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md",
      "sha256": "7dc7f10404b5420fef031b2dad3070068cc6700492ad53097dd4eb993778acf4",
      "section": "full"
    },
    {
      "path": ".skilled/commands/deep/assets/deep-review.yaml",
      "sha256": "6f450eda90bcbd7ef0010e66c5895a9498095c4b2a5a0f749ebc42f8323352f7",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/mode-registry.json",
      "sha256": "126e883c24e67a3ca1c4ebc19028544e70783eeb42b89339de3ba652273c2260",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/SKILL.md",
      "sha256": "041fd5df01b9fd474a097e17f009e66eb0f1e9e42ce1ac343639e28485e6cddb",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/deep-review/SKILL.md",
      "sha256": "a4d2b1a89eb4617f3b60663ef6022efbf5b980f6674b7ac4d0ec15f5811f96f5",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md",
      "sha256": "5aeb769408f0f81b9cde0e5ac927ef296e87acbf5487fa94f6de3bc484d20079",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/deep-review/references/state/state-format.md",
      "sha256": "90b6b87a6703b2dff6f586cde94e7c5690cf59951a107ef6f147d866764112b1",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml",
      "sha256": "14f01a94c1c218b6307c079fc715ad3ba82a0df3c742c4418e680c24a172072e",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md",
      "sha256": "4623c33a30c4fd8b89888e615f18c7aae680a3925d4bbf07ba8894de7727a508",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json",
      "sha256": "398c2b9753b5535f9eda0629a574fdaba80b26ea7a0c733cda0611830339f952",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl",
      "sha256": "96ed8e08e58791ca94e6367c0140c1ab4a89b50edaede8a9c87c66580721d18d",
      "section": "full"
    },
    {
      "path": ".skilled/agents/deep-review.md",
      "sha256": "d0f66e94858620e174123ed6a78dd451dca876bdbe4a5d49fc7be81bf42ee823",
      "section": "full"
    },
    {
      "path": ".skilled/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs",
      "sha256": "83523379ee7037ffdc4b041315c9cc1442acd0fd7a6d28f6d4c963b3a05774c6",
      "section": "full"
    }
  ],
  "compiledBodyDigest": "769379f0ec11ec445b139361af8135cd89ddaf08d9dba1861b175b7e2f22d7c0"
}
GENERATED_COMMAND_CONTRACT_HEADER_END -->
# Compiled Command Contract: /deep:review

This generated contract collapses the maintained command authority chain into one grep-checkable executor contract. Maintained sources remain authoritative; regenerate this file when any source digest changes.

## autonomousExecutionDirective

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked as `/deep:review` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (see gate3Precedence below).
- PROCEED immediately: load the auto workflow YAML and dispatch the `deep-review` agent to run ONE iteration of the review loop over the bound target.
- DISPATCH ONLY: you dispatch `deep-review` to run one iteration; you do NOT read, edit, patch, or run the review loop over the target yourself. The auto workflow YAML owns the loop itself — setup, dispatch-per-iteration, reducer sync, convergence checks, synthesis, and all loop-level artifact writes; the `deep-review` leaf owns only its own single-iteration artifacts — mixing your own inline work with the dispatch is a route violation.
- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so `deep-review` writes each iteration state record with the route-proof fields present — `target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "review"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

Your job is to DISPATCH `deep-review` to run ONE iteration of the review loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. The auto workflow YAML owns the loop itself (setup, dispatch-per-iteration, reducer sync, convergence, synthesis, and loop-level writes). This contract is your instruction set; the review target is the bound spec_folder/target named in your message, never this document.

## sourceAuthority

1. `.skilled/commands/deep/review.md`
2. `.skilled/commands/deep/assets/deep-review-presentation.txt`
3. `.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md`
4. `.skilled/commands/deep/assets/deep-review.yaml`
5. `.skilled/skills/system-deep-loop/mode-registry.json`
6. `.skilled/skills/system-deep-loop/SKILL.md`
7. `.skilled/skills/system-deep-loop/deep-review/SKILL.md`
8. `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`
9. `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md`
10. `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml`
11. `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md`
12. `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json`
13. `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`
14. `.skilled/agents/deep-review.md`
15. `.skilled/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs`

## gate3Precedence

```yaml
block: gate3Precedence
classifierPath: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts
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

Setup contract: see `.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, resolve `{artifact_dir}` and bind the values the workflow writes to `{artifact_dir}/deep-review-config.json` in `step_create_config`, or in `step_fanout_root_config` on a fan-out run (shape: `reviewTarget`, `reviewTargetType`, `reviewDimensions`, `reviewFocus`, `specFolder`, `maxIterations`, `convergenceThreshold`, `antiConvergence.convergenceMode`, `antiConvergence.depthMode`, `antiConvergence.minIterations`, `expansiveDepth.*` (`maxDepth`, `maxChildrenPerNode`, `budgetSplit`, `maxFrontierNodes`), reserved `antiConvergence.divergent: {}`, `stopPolicy`, `executionMode: "auto"`, `lineageMode`, `resource_map.emit`, `config.executor.*`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.skilled/commands/deep/assets/deep-review.yaml` with `execution_mode` bound to `auto`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `review_target_type`, `spec_folder`. **Ordering rule**: if `review_target_type` is ambiguous, ask only for `review_target_type` first — the answer may make `spec_folder` self-evident on the next Tier 1 pass. Missing `review_target` is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:review:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the Consolidated Setup Prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults.

```yaml
PRE-BOUND SETUP ANSWERS:
  review_target: <spec-folder>
  review_target_type: spec-folder  # one of: spec-folder | skill | agent | track | files
  review_dimensions: all  # or comma-separated list: any of correctness, security, traceability, maintainability, plus custom names that follow them; a fan-out run reviews all four in every lineage
  review_focus: ""  # optional free text every iteration covers in addition to its dimension
  spec_folder: existing  # one of: existing | new | update-related | phase-folder, or an explicit specs/.opencode/specs path
  execution_mode: AUTONOMOUS  # from :auto suffix
  lineage_mode: auto  # one of: auto | resume | restart | completed-continue (set by --extend=N)
  extend: ""  # optional positive integer N from --extend=N: extends a completed run by N iterations
  extend_minutes: ""  # optional positive integer M from --extend-minutes=M: minutes added to the later of the prior budget and the minutes elapsed, default the prior budget
  frontier_max_depth: ""  # optional positive integer N from --frontier-max-depth=N, expansive depth only: expansiveDepth.maxDepth, default 3
  frontier_max_nodes: ""  # optional positive integer N from --frontier-max-nodes=N, expansive depth only: expansiveDepth.maxFrontierNodes, default half the iteration budget
  maxIterations: 7
  convergenceThreshold: 0.10
  convergence_mode: default  # default | off | sliding-window | divergent
  depth_mode: default  # default | expansive (opt-in frontier growth)
  frontier_scope: none  # internal, written by fan-out for an expansive lineage: comma-separated frontier node ids, or none
  stop_policy: convergence  # one of: convergence | max-iterations
  executor: native  # one of: native | cli-codex | cli-claude-code | cli-opencode | cli-cursor | cli-devin | cli-pi | cli-deepseek-harness | cli-mistral-vibe, the last one fan-out only (`EXECUTOR_KINDS` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`)
  executor_model: ""  # optional, executor-specific (cli-opencode e.g. llmgateway/glm-5.3-flash, minimax-coding-plan/MiniMax-M2.7-highspeed)
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
| `review_dimensions` | Y | marker `review_dimensions`, the dimensions answer, or default. A fan-out run binds `all` in every lineage, so a subset or a custom name applies only to a single-executor run | `"all"` | N |
| `review_focus` | N | flag `--review-focus="TEXT"`, marker `review_focus`, or default. Control characters and whitespace runs collapse to one space, an empty result is absent, and more than 1000 characters fails setup | empty (dimensions only) | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, `scope-extract` → a target/scope path that resolves to an existing spec folder (auto-bound, per `auto_mode_contract` §1 source 3), or target path when target is a spec folder | none | Y, when target is not a spec folder |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `lineage_mode` | Y | flag `--restart`, flag `--lineage-mode=auto|resume|restart`, marker `lineage_mode`, or default | `auto` | N |
| `extend` | N | flag `--extend=N` (positive integer); sets `lineage_mode=completed-continue` on a completed run; refused with fan-out | none | N |
| `extend_minutes` | N | flag `--extend-minutes=M` (positive integer), valid only with `--extend` | the prior `maxDurationMinutes` | N |
| `frontier_max_depth` | N | flag `--frontier-max-depth=N` or marker `frontier_max_depth` (positive integer), valid only with `--depth-mode=expansive` on a single-executor run; written to `expansiveDepth.maxDepth` | `3` | N |
| `frontier_max_nodes` | N | flag `--frontier-max-nodes=N` or marker `frontier_max_nodes` (positive integer), valid only with `--depth-mode=expansive` on a single-executor run; written to `expansiveDepth.maxFrontierNodes` | `null`, half the iteration budget | N |
| `maxIterations` | Y | flag `--max-iterations`, marker `maxIterations`, or default; the setup-only binding `max_iterations_source` names which (`flag`, `marker`, `setup`, `matrix` or `default`) and is never written to the config. Under `--depth-mode=expansive` a `default` budget is resized after the seed step to `min(24, max(7, 2·c·(S + maxDepth − 1)))`, with S the depth-1 nodes the seed admitted and c the four canonical dimensions less traceability when the configured `reviewDimensions` list leaves it out, plus each custom name, each counted once, and kept at `7` when S is 0. That is the single-executor budget: a fan-out lineage with no matrix `iterations` value is sized from its own seed share with c fixed at four, 24 once it is dealt a node and its loop default of 7 when it is dealt none, but only when the source is `default`: any other source is kept as given, and in a fan-out it reaches the runner as `--max-iterations`, which binds every lineage the matrix gives no `iterations` value in either depth mode | `7` | N |
| `convergenceThreshold` | Y | flag `--convergence`, marker `convergenceThreshold`, or default | `0.10` | N |
| `convergence_mode` | Y | flag `--convergence-mode=default|off|sliding-window|divergent`, marker `convergence_mode`, or default | `default` | N |
| `depth_mode` | Y | flag `--depth-mode=default|expansive`, marker `depth_mode`, or default `default` | `default` | N |
| `stop_policy` | Y | flag `--stop-policy=convergence|max-iterations`, marker `stop_policy`, or default | `convergence` | N |
| `executor` | N | flag `--executor`, marker `executor`, config file, or default | `native` | N |
| `executor_model` | N | flag `--model`, marker `executor_model`, or executor-specific validation | none | N |
| `executor_config_dir` | N | flag `--config-dir`, marker `executor_config_dir`, or executor-specific default | none | N |
| `executor_reasoning` | N | flag `--reasoning-effort`, marker `executor_reasoning`, or executor default | none | N |
| `executor_service_tier` | N | flag `--service-tier`, marker `executor_service_tier`, or executor default | none | N |
| `executor_timeout` | N | flag `--executor-timeout`, marker `executor_timeout`, or default | `900` | N |
| `resource_map_emit` | N | flag `--no-resource-map`, marker `resource_map_emit`, or default | `true` | N |
| `frontier_scope` | N | internal marker `frontier_scope`, written by `fanout-run.cjs` for an expansive fan-out lineage | none | N |
| `config.fanout_lineage_artifact_dir` | N | internal flag `--fanout-lineage-artifact-dir=PATH` or marker `config.fanout_lineage_artifact_dir` | none | N |
| `fanout_executors` | N | repeatable `--executor=<type>` flags or `--executors=<json>`; each group accepts `--model`, `--config-dir`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`, `--label`, `--count`; one expanded lineage selects `config.executor`, two or more select `config.fanout` | none (single-executor when absent) | N |
| `fanout_concurrency` | N | flag `--concurrency=N` | `2` | N |

**Fan-out default policy:** 0–1 `--executor` flags and no `--executors`, or an `--executors` matrix that expands to exactly one lineage → `config.executor` (single-executor, default, unchanged). 2+ `--executor` flags, an `--executors` matrix that expands to two or more lineages, or any `--count > 1` → `config.fanout`. Review fan-out uses strongest-restriction: any lineage active P0 → merged FAIL. Every fan-out lineage needs a `cli-*` executor and runs under `fanout-run.cjs` in the capped pool so every lineage shares retries, artifact checks, and stop-policy validation. A native fan-out lineage is refused before any lineage spawns, because OpenCode 2 `run` cannot start the registered `deep/review` command that adapter needed; `native` runs only as the single executor, and the default `native` executor with `--count > 1` is refused the same way. Fan-out never dispatches the LEAF `@deep-review` agent or a pasted phase-running prompt as a full-loop sub-agent. When fan-out includes `cli-opencode`, that lineage is an explicit parallel-detached OpenCode session with its own lineage directory and session id; this is the documented exception to the cli-opencode self-invocation guard. Single-executor `cli-opencode` remains cross-runtime only.

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
   |-- --max-iterations=N -> maxIterations = N, max_iterations_source = flag
   |-- --convergence=N -> convergenceThreshold = N
   |-- --convergence-mode=default|off|sliding-window|divergent -> antiConvergence.convergenceMode = value
   |-- --depth-mode=default|expansive -> antiConvergence.depthMode = value
   |-- --stop-policy=convergence|max-iterations -> stop_policy = value
   |-- --review-focus="TEXT" -> review_focus = TEXT (optional, carried into every iteration prompt)
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   |-- --restart -> lineage_mode = restart
   |-- --lineage-mode=auto|resume|restart -> lineage_mode = value
   |-- --extend=N -> extend = N, lineage_mode = completed-continue (positive integer only; a completed run only; refused with fan-out)
   |-- --extend-minutes=M -> extend_minutes = M (positive integer only; valid only with --extend)
   |-- --frontier-max-depth=N -> frontier_max_depth = N -> expansiveDepth.maxDepth (positive integer only; valid only with --depth-mode=expansive; refused with fan-out)
   |-- --frontier-max-nodes=N -> frontier_max_nodes = N -> expansiveDepth.maxFrontierNodes (positive integer only; valid only with --depth-mode=expansive; refused with fan-out)
   |-- --executor=<type> -> config.executor.kind (`native` | `cli-codex` | `cli-claude-code` | `cli-opencode` | `cli-cursor` | `cli-devin` | `cli-pi` | `cli-deepseek-harness` | `cli-mistral-vibe`. Every kind runs in `:auto` and `:confirm`, `cli-deepseek-harness` as a single lineage or a fan-out and `cli-mistral-vibe` only as a fan-out lineage. `EXECUTOR_KINDS` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` is authoritative)
   |-- --model=<id> -> config.executor.model (for example `gpt-5.4`)
   |-- --config-dir=<path> -> config.executor.configDir (cli-claude-code only; must resolve under ~/.claude* or a repository .claude* folder; fan-out sets CLAUDE_CONFIG_DIR)
   |-- --sandbox-mode=<mode> -> config.executor.sandboxMode (`read-only` / `workspace-write` / `danger-full-access`; default `workspace-write`; cli-opencode also defaults to `workspace-write`, which denies its file tools outside the working directory but not Bash; `read-only` is refused)
   |-- --reasoning-effort=<level> -> config.executor.reasoningEffort (`none` | `minimal` | `low` | `medium` | `high` | `xhigh` | `max`)
   |-- --service-tier=<tier> -> config.executor.serviceTier (`priority` | `standard` | `fast`)
   |-- --executor-timeout=<seconds> -> config.executor.timeoutSeconds (positive integer, default `900`)
   |-- --no-resource-map -> config.resource_map.emit = false
   |-- --fanout-lineage-artifact-dir=PATH -> config.fanout_lineage_artifact_dir = PATH (internal single-lineage command invocation only)
   |-- --executor=<type> [--model=X] [--config-dir=PATH] [--reasoning-effort=Y] [--service-tier=Z] [--sandbox-mode=MODE] [--executor-timeout=N] [--iters=N] [--label=X] [--count=N]
   |     (repeatable; one occurrence binds config.executor, two or more add one entry each to config.fanout.executors; route by lineage count below)
   |-- --executors=<json> -> parse(json), then route by lineage count below: one lineage -> config.executor, two or more -> config.fanout.executors
   |-- --concurrency=N -> config.fanout.concurrency (default 2)
   |
   |   Fan-out default policy:
   |   - 0 or 1 --executor (no --executors, no count>1): write config.executor (single, unchanged)
   |   - --executors matrix that expands to exactly one lineage (one entry, count 1 or absent): write config.executor from that entry (kind, model, configDir, reasoningEffort, serviceTier, sandboxMode, timeoutSeconds); its iterations value binds to config.maxIterations with max_iterations_source = matrix, and leave config.fanout unset
   |   - 2+ --executor flags, an --executors matrix that expands to two or more lineages, or any count>1: write config.fanout
   |   - Review fan-out verdict: strongest-restriction (any lineage active P0 → merged FAIL)
   |
   +-- Defaults: maxIterations=7 (max_iterations_source=`default`), convergenceThreshold=0.10, antiConvergence.convergenceMode=`default`, antiConvergence.depthMode=`default`, antiConvergence.minIterations=2, antiConvergence.divergent=`{}`, stop_policy=`convergence`, lineage_mode=`auto`, config.executor.kind=`native`, config.executor.timeoutSeconds=900, config.resource_map.emit=`true`

   Executor precedence for setup resolution:
   - CLI flag > config file > schema defaults
   - The generated `deep-review-config.json` stores executor settings under `config.executor.*`

   Parsing to config mapping:
   - `--executor` -> `config.executor.kind`
   - `--model` -> `config.executor.model`
   - `--config-dir` -> `config.executor.configDir`
   - `--reasoning-effort` -> `config.executor.reasoningEffort`
   - `--service-tier` -> `config.executor.serviceTier`
   - `--executor-timeout` -> `config.executor.timeoutSeconds`
   - `--convergence-mode` -> `antiConvergence.convergenceMode`
   - `--depth-mode` -> `antiConvergence.depthMode`

   Validation hook:
   - `parseExecutorConfig` from `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` runs at config-write time
   - Invalid combinations fail fast with clear errors: an unknown executor kind (schema enum), a field the kind does not support (`EXECUTOR_KIND_FLAG_SUPPORT`, e.g. `--service-tier` on `cli-cursor`), an off-allowlist model on `cli-cursor`/`cli-devin`/`cli-pi`, and a missing executor binary

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   $ rg --no-config --files-with-matches --max-count 1 --fixed-strings --ignore-case --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' -- "$REVIEW_TARGET" specs .skilled
   - Exit 0 is a hit set, exit 1 is a clean no-hit, exit 2 or higher is a failure to surface rather than report as no-hit
   - Store: prior_work_found = [yes/no]

6. Ask only the applicable questions, together in one turn, through the question tool that `.skilled/repo-rules/communication-handoff.md` §5 names for your runtime. Each question below becomes one tool question with its lettered options as the choices, and a free-text item such as a target or a path is answered through the tool's own free-text option. When the tool caps how many questions one call holds, make consecutive calls in the same turn. Only where §5 names no tool for this session, print the form below as text. Do not split these questions across turns.
   - No question carries more than four lettered options, so each fits a tool that takes two to four. Mark the recommended option in each.
   - Include Q-Exec only when `--executor` is NOT present and the target text does NOT already mention executor hints such as `cli-opencode`, `cli-codex`, or `gpt-5.4`
   - If Q-Exec is omitted and no executor is otherwise resolved, default to `native`

   Q0. Review Target (if not in command): What to review?
     Examples: spec folder path, `skill:sk-name`, `agent:name`, `track:NN--name`, or file paths/globs

   Q1_type. Review Target Type (auto-detect from Q0, confirm):
     A) spec-folder -- Review spec artifacts + implementation files
     B) skill -- SKILL.md + references/ + assets/ + agents + commands
     C) agent -- Agent family across all runtimes
     D) track -- All child spec folders in a feature track
     E) files -- Arbitrary file paths or globs
     Five types exceed the tool's four options. Through the tool, offer the auto-detected type
     first, marked (Recommended), and the three next most likely types after it; the fifth is
     named through the free-text option. The printed-text fallback keeps all five letters.

   Q_dims. Which review dimensions?
     A) All four (Recommended, default) -- correctness, security, traceability, maintainability
     B) Correctness and security only
     Any other subset, or custom names after them (e.g., "correctness, performance"), goes through the free-text option; a custom dimension is reviewed after the canonical four
     A subset or a custom name applies to a single-executor run only; a fan-out run reviews all four in every lineage

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` only for new or unrelated work (accept `.opencode/specs/` alias roots when already in use)
     C) Related (Use a related folder, phase child, new or existing sub-track, or a series parent for a different change to the same artifact as an existing packet in the same track) [if match found, including a phase folder such as `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias]

   Q2. Execution Mode (if no suffix):
     A) Autonomous (Recommended) -- runs every iteration, then reports
     B) Interactive -- stops for approval before each iteration, up to the iteration cap

   Q3. Max Iterations (if not set via flag):
     A) 7 (Recommended, default)
     B) 5 -- a short pass
     C) 10 -- a longer run
     Any other number goes through the free-text option.

   Q-Exec. Executor (optional):
     A) Native (Recommended, default) — dispatch via @deep-review agent with Opus.
     B) cli-opencode — runs `opencode run`, with the model given as `provider/model`.
     C) cli-claude-code — runs `claude -p`, with the model and an optional config dir.
     D) cli-codex — runs `codex`, with optional reasoning effort and service tier.
     Name cli-cursor, cli-devin, cli-pi or cli-deepseek-harness (experimental, explicit choice only), with its model, through the free-text option.

   What each executor needs:
     - cli-opencode: `opencode run --standalone -m X[#Y] --format json --auto "PROMPT"`, started in `{repo_root}`, with `reasoningEffort` Y on the model id. `--auto` is always passed; under `workspace-write` (the default) an inline `OPENCODE_CONFIG_CONTENT` denies `external_directory` to the file tools, Bash is not confined, and `read-only` is refused. DeepSeek V4 and V4.1 Flash and GLM-5.3-Flash are pinned to `max`. No `--agent`: the default agent runs. No service-tier.
     - cli-claude-code: `claude -p "PROMPT" --model X --permission-mode X`, where the permission mode is `acceptEdits` at the default `workspace-write` and `bypassPermissions` with `--sandbox-mode=danger-full-access`. The default cannot run Bash in `-p` mode, so a lineage that must record state needs the flag. Optional --effort and optional `--config-dir=PATH` for CLAUDE_CONFIG_DIR. No service-tier. It logs `--output-format stream-json --verbose`, and a single-executor iteration writes its session cost to `iterations/iteration-NNN.cost.json`.
     - cli-codex: requires the `codex` binary on PATH. Supports `--reasoning-effort` and `--service-tier`.
     - cli-cursor: requires `cursor-agent`. Model must be on the enforced allowlist. No `--reasoning-effort` (effort is baked into the model id), no `--service-tier`.
     - cli-devin: requires `devin`. Model must be on the enforced allowlist. No `--reasoning-effort`, no `--service-tier`.
     - cli-pi: requires `pi`, run as `pi -p --offline --model SELECTOR` (`provider/model`). Model must be on the enforced allowlist. `reasoningEffort` maps to `--thinking`. No `--service-tier`. Pi has no OS sandbox: `--sandbox-mode=read-only` narrows its tools to `read,grep,find,ls` and passes `--no-extensions --no-skills --no-prompt-templates` (a compensating control), and the other modes pass no restriction.
     - cli-deepseek-harness: a single lineage such as `--executor=cli-deepseek-harness --model=deepseek-v4.1-flash` runs in `:auto` through the shared fan-out command builder, and a fan-out shape such as `--count=2` also works. Requires `dsh` at the pinned release. Model must be `deepseek-v4.1-flash-1017` (LLM Gateway) or `deepseek-v4.1-flash` (OpenCode Go), pinned to `max`. Prompt travels on stdin; no `--service-tier`; the guards patch is required; `liveTools.mcpServers` may name only `code_mode`.
     Every CLI executor builds its command through the shared fan-out command builder (`LINEAGE_COMMAND_ADAPTERS` in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Per-kind flag support (`EXECUTOR_KIND_FLAG_SUPPORT`) and the cli-cursor/cli-devin/cli-pi model allowlists (`CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`, `PI_SUPPORTED_MODELS`) are owned by `executor-config.ts`; this contract does not restate them. Off-allowlist model or missing binary fails closed — a requested CLI executor never degrades to native.

   Reply format examples, for the printed-text fallback only:
   - `"skill:deep-research, B, all, A, A"`
   - `"review the deep-review packet output, E, correctness, B, B, 5"`
   - `"Review review/review-report.md contract drift, E, all, A, 7, 0.10, B, gpt-5.4, high, fast"`
   - `"review executor drift across CLIs, E, all, A, 7, 0.10, C, gpt-5.4, _, _"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - review_target = [from Q0 or $ARGUMENTS]
   - review_target_type = [from Q1_type, auto-detected]
   - review_dimensions = [from Q_dims or default "all"]
   - review_focus = [from flag, marker, or empty]
   - spec_choice = [A/B/C from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - lineage_mode = [auto/resume/restart from flag, marker, or default auto; completed-continue from --extend=N]
   - extend = [N from --extend=N, else unset]
   - extend_minutes = [M from --extend-minutes=M, else unset; valid only with --extend]
   - frontier_max_depth = [N from --frontier-max-depth=N or marker, else unset; valid only with depth_mode `expansive`]
   - frontier_max_nodes = [N from --frontier-max-nodes=N or marker, else unset; valid only with depth_mode `expansive`]
   - maxIterations = [from Q3 or flag or default 7]; a Q3 answer that changes the offered value sets max_iterations_source = setup, a marker sets it to marker, and accepting the default keeps it default
   - convergenceThreshold = [from flag or default 0.10]
   - convergence_mode = [from flag, marker, or default `default`; one of `default`, `off`, `sliding-window`, `divergent`]
   - depth_mode = [from flag, marker, or default `default`; one of `default`, `expansive`]
   - stop_policy = [from flag, marker, or default convergence]
    - executor config = [CLI flags, compact reply, config file, or default `native`; map compact reply fields to `config.executor.kind/model/configDir/reasoningEffort/serviceTier`, and accept an optional volunteered convergence value before executor fields]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split these questions across turns
```

**Phase Output:**

- `review_target` | `review_target_type` | `review_dimensions` | `review_focus`
- `spec_choice` | `spec_path` | `execution_mode` | `maxIterations` | `max_iterations_source` | `convergenceThreshold` | `convergence_mode` | `depth_mode` | `stop_policy`
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
workflow: .skilled/commands/deep/assets/deep-review.yaml
```

## outputTemplate

```yaml
block: outputTemplate
promptPackPath: .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl
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
  writer: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
  validator: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts
  rule: "Reference the existing intent/completion receipt pair and validator; do not copy receipt logic into the command contract."
progressRecord:
  writer: .skilled/skills/system-deep-loop/shared/progress/progress-record.cjs
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
permittedByExecutor:
  native:
    - "Read"
    - "Write"
    - "Edit"
    - "Bash"
    - "Grep"
    - "Glob"
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
