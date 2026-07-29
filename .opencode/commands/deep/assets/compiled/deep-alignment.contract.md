<!-- GENERATED_COMMAND_CONTRACT_HEADER_START
{
  "id": "deep/alignment",
  "command": "/deep:alignment",
  "version": 1,
  "generatedBy": ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs",
  "sourceDigests": [
    {
      "path": ".opencode/commands/deep/alignment.md",
      "sha256": "457bac97ab47c1fda8c80c7b73f6554e0912dc21452ec26e54303b52712542d0",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep-alignment-presentation.txt",
      "sha256": "bc0d2dcd6c50ab3eb3236b023dc26f8dbcc20d772cca31bd0dd2746c368e21b6",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md",
      "sha256": "a6ffef6ce5c74d99e2f60a15226aeed32948a201c378eacaaeec1b189814e5e6",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep-alignment-auto.yaml",
      "sha256": "0e93da1561791a4c8fb916700725118af693d9cad3926057f217f54774585e42",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep-alignment-confirm.yaml",
      "sha256": "486d3a6797f0f88c71df1b06a33b6edf1b0db855bcc6a2b1aa822de84fe37fbd",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/mode-registry.json",
      "sha256": "a26e9ebd5a3a10f29ff56833420cc484de53fdc074b35d943214788f627d3b8e",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/SKILL.md",
      "sha256": "d2699da29e2b2cff0bdee7a3bab88bbdd346ffe71730b72152de21e0201bb21e",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md",
      "sha256": "e6e69bfe1f47ebb7bea2b3dc29e05741aa858a89bbf0ca5ed3441ec2e0bddeaa",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md",
      "sha256": "963bfbf751b99b7bd4d485d69a3113ace20add2672b16cbd8d88f54829602162",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-alignment/references/discover-contract.md",
      "sha256": "b5144530eee268133f464ae0182df521709a06e16ba9cab5c7519cc175385b8e",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md",
      "sha256": "bdb213c275fa28f41c66b6c68a15604c12fe0b6d6d7204d652e2ed5f8b0e1e49",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-alignment/references/state-machine-wiring.md",
      "sha256": "10d404e0e2ea5da121357ed3c1610c66fe2eeef49cdab1e0f69d2a1953217fdb",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/deep-alignment/assets/deep-alignment-config-template.json",
      "sha256": "aa2a461d46025e521b46e91ba715c0c035489ae79d872dd093a3260ae598aa58",
      "section": "full"
    },
    {
      "path": ".opencode/agents/deep-alignment.md",
      "sha256": "0553a931cf89346904d053fbdf65fd58d67f6d4615c7af6d44bd479e83b3360d",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs",
      "sha256": "3c801fbecbc5bb01a99a7578243a823b791368cc229966b930418cfb468500df",
      "section": "full"
    }
  ],
  "compiledBodyDigest": "1cc26549fdb1b398244429504dc2078df1d1d104aba9d0161177bec66c50cbca"
}
GENERATED_COMMAND_CONTRACT_HEADER_END -->
# Compiled Command Contract: /deep:alignment

This generated contract collapses the maintained command authority chain into one grep-checkable executor contract. Maintained sources remain authoritative; regenerate this file when any source digest changes.

## autonomousExecutionDirective

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/alignment` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (see gate3Precedence below).
- PROCEED immediately: load the auto workflow YAML and dispatch the `deep-alignment` agent to run ONE iteration of the alignment loop over the bound target.
- DISPATCH ONLY: you dispatch `deep-alignment` to run one iteration; you do NOT read, edit, patch, or run the alignment loop over the target yourself. The auto workflow YAML owns the loop itself — setup, dispatch-per-iteration, reducer sync, convergence checks, synthesis, and all loop-level artifact writes; the `deep-alignment` leaf owns only its own single-iteration artifacts — mixing your own inline work with the dispatch is a route violation.
- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so `deep-alignment` writes each iteration state record with the route-proof fields present — `target_agent: "deep-alignment"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "alignment"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

Your job is to DISPATCH `deep-alignment` to run ONE iteration of the alignment loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. The auto workflow YAML owns the loop itself (setup, dispatch-per-iteration, reducer sync, convergence, synthesis, and loop-level writes). This contract is your instruction set; the alignment target is the bound spec_folder/target named in your message, never this document.

## sourceAuthority

1. `.opencode/commands/deep/alignment.md`
2. `.opencode/commands/deep/assets/deep-alignment-presentation.txt`
3. `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`
4. `.opencode/commands/deep/assets/deep-alignment-auto.yaml`
5. `.opencode/commands/deep/assets/deep-alignment-confirm.yaml`
6. `.opencode/skills/system-deep-loop/mode-registry.json`
7. `.opencode/skills/system-deep-loop/SKILL.md`
8. `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
9. `.opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md`
10. `.opencode/skills/system-deep-loop/deep-alignment/references/discover-contract.md`
11. `.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md`
12. `.opencode/skills/system-deep-loop/deep-alignment/references/state-machine-wiring.md`
13. `.opencode/skills/system-deep-loop/deep-alignment/assets/deep-alignment-config-template.json`
14. `.opencode/agents/deep-alignment.md`
15. `.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs`

## gate3Precedence

```yaml
block: gate3Precedence
classifierPath: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts
classifierLines:
  commandContractShape: "67-72"
  autonomousSatisfaction: "653-680"
command: /deep:alignment
executionMode: AUTONOMOUS
commandContract:
  declaresAutonomousExecution: true
  ownsSpecFolderSetup: true
  allowedSpecFolderSources:
    - flag
    - marker
    - scope_extract
  writeBoundary: "{artifact_dir} resolved from spec_folder for alignment"
rule: "When the classifier receives AUTONOMOUS execution, a validated prebound spec folder, and this command contract, Gate 3 is satisfied by the prebound folder before any write."
```

## renderBlocks.auto

Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.

<!-- START renderBlocks.auto -->
~~~markdown
### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + the `PRE-BOUND SETUP ANSWERS:` block (below) + the Default Resolution Table (below). Resolve lanes from `--lane-config` when present. When every required field is resolved, resolve `{artifact_dir}` from `spec_folder` and persist `{artifact_dir}/deep-alignment-config.json` (shape: `alignmentTarget`, `lanes`, `specFolder`, `maxIterations`, `convergence.coverageThreshold`, `convergence.stabilityWindow`, `convergence.mode`, `convergence.combination: "AND"`, `executionMode: "auto"`, `lineageMode`, `executor`, `batchSize`, `status`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep-alignment-auto.yaml`. End setup.

2. **Tier 2 — Resolve lanes** (the one input that is never guessed): when `--lane-config` is absent, emit ONLY the structured three-axis scoping question (`authority` x `artifactClass` x `scope`) from `.opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md`, bind the resolved lanes, then return to Tier 1. `spec_folder` may also be asked here when it is genuinely ambiguous and no default resolves it. Never guess a scope — SKILL.md ALWAYS #1.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:alignment:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the Consolidated Setup Prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults.

```yaml
PRE-BOUND SETUP ANSWERS:
  alignment_target: <human-readable label for what this run audits>
  lane_config: <path to a --lane-config JSON file>  # the only non-interactive lane source
  spec_folder: existing  # one of: existing | new | update-related | phase-folder, or an explicit specs/.opencode/specs path
  execution_mode: AUTONOMOUS  # from :auto suffix
  lineage_mode: auto  # one of: auto | resume | restart
  max_iterations: 10
  coverage_threshold: 1.0
  stability_window: 2
  convergence_mode: default  # one of: default | off
  batch_size: 5
  executor_kind: native  # one of: native | cli-codex | cli-opencode
  model: ""  # required for cli-opencode; optional for cli-codex
  reasoning_effort: ""  # optional for cli-codex/cli-opencode
  service_tier: ""  # optional for cli-codex only
  executor_timeout: 900
```

Rules:

- Any unspecified field falls back to its documented default.
- Marker fields take precedence over `$ARGUMENTS` flags because the caller explicitly bound setup in the prompt body.
- Unknown fields are warnings, not errors.
- Malformed lines, including a missing `:`, emit a parse error naming the offending line. Known fields parsed before the error may still be used, and unresolved fields continue to Tier 2 or Tier 3.
- Empty strings count as unresolved for required fields.
- Native rejects `model`, `reasoning_effort`, and `service_tier`. `cli-codex` accepts all three. `cli-opencode` requires `model`, accepts `reasoning_effort` as `--variant`, and rejects `service_tier`. `sandbox_mode` is never configurable on this command.
- External executor kinds are auto-only. `:confirm` and no-suffix interactive execution remain native-only and reject `cli-codex` / `cli-opencode`.

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `alignment_target` | Y | `$ARGUMENTS` first positional target, or marker `alignment_target` | none | N |
| `lanes` | Y | flag `--lane-config <file.json>`, or the structured three-axis scoping question | none (never guessed) | Y, when `--lane-config` is absent |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, or a target/scope path that resolves to an existing spec folder | none | Y, when the target is not a spec folder |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `lineage_mode` | Y | flag `--restart`, flag `--lineage-mode=auto|resume|restart`, marker `lineage_mode`, or default | `auto` | N |
| `max_iterations` | Y | flag `--max-iterations`, marker `max_iterations`, or default | `10` | N |
| `coverage_threshold` | Y | flag `--coverage-threshold`, marker `coverage_threshold`, or default | `1.0` | N |
| `stability_window` | Y | flag `--stability-window`, marker `stability_window`, or default | `2` | N |
| `convergence_mode` | Y | flag `--convergence-mode=default|off`, marker `convergence_mode`, or default | `default` | N |
| `batch_size` | N | marker `batch_size`, or default | `5` | N |
| `executor_kind` | Y | flag `--executor-kind`, marker `executor_kind`, or default | `native` | N |
| `model` | Conditional | flag `--model`, marker `model`, or executor-specific validation | none; required for `cli-opencode` | N |
| `reasoning_effort` | N | flag `--reasoning-effort`, marker `reasoning_effort`, or executor default | none | N |
| `service_tier` | N | flag `--service-tier`, marker `service_tier`, or executor default | none; `cli-codex` only | N |
| `executor_timeout` | N | flag `--executor-timeout`, marker `executor_timeout`, or default | `900` | N |

**Lane policy:** `--lane-config <file.json>` is the ONLY non-interactive lane-resolution path (ADR-011 LOCKED). The file is a JSON array of `{authority, artifactClass, scope}` objects; see `.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md`. There is no inline per-flag lane syntax. An empty resolved lane set is a fail-fast, never a guessed scope.

**Convergence policy:** `--coverage-threshold <F>` (default `1.0`) and `--stability-window <N>` (default `2`) tune a two-signal AND-gate. With `--convergence-mode=default`, both must hold together before STOP is legal. With `--convergence-mode=off`, the evaluator cannot return `CONVERGED`; applicable runs continue until exactly `--max-iterations`, then return `STOP_MAX_ITERATIONS`. A zero-applicable-lane run still returns `NOTHING_TO_CONVERGE`. Do NOT transfer `deep-review`'s single `convergenceThreshold` ratio semantics onto these two flags.

**Lifecycle policy:** `lineage_mode=auto` preserves the classifier behavior, `lineage_mode=resume` continues a valid packet, and `lineage_mode=restart` archives the resolved `{artifact_dir}` before any config write or phase init. In `:auto`, an explicit `--restart` or `--lineage-mode=restart` flag is operator authorization for this archive move, so do not ask for a second confirmation. Preserve rollback by moving the timestamped archive back to `alignment/` if needed. A restart request must never silently downgrade to resume; if the archive step cannot run, halt with `STATUS=FAIL`.
~~~
<!-- END renderBlocks.auto -->

## renderBlocks.confirm

Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.

<!-- START renderBlocks.confirm -->
~~~markdown
### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode

Use this block only when `execution_mode = "INTERACTIVE"` or when no suffix was supplied and Q-Mode must ask for the execution mode.

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"    -> execution_mode = "AUTONOMOUS"
   |-- ":confirm" -> execution_mode = "INTERACTIVE"
   +-- No suffix  -> execution_mode = "ASK" (include Q-Mode)

2. CHECK $ARGUMENTS for target (alignment_target):
   |-- Has content (ignoring suffixes and flags):
   |     -> alignment_target = $ARGUMENTS, omit Q-Target
   +-- Empty -> include Q-Target

3. PARSE optional flags from $ARGUMENTS:
   |-- --lane-config=PATH -> lane_config_path = PATH (the only non-interactive lane source; omit Q-Lanes)
   |-- --max-iterations=N -> max_iterations = N
   |-- --coverage-threshold=F -> coverage_threshold = F
   |-- --stability-window=N -> stability_window = N
   |-- --convergence-mode=default|off -> convergence_mode = value
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q-Spec
   |-- --restart -> lineage_mode = restart
   |-- --lineage-mode=auto|resume|restart -> lineage_mode = value
   |-- --executor-kind=native|cli-codex|cli-opencode -> executor.kind = value
   |-- --model=MODEL -> executor.model = MODEL
   |-- --reasoning-effort=LEVEL -> executor.reasoningEffort = LEVEL
   |-- --service-tier=TIER -> executor.serviceTier = TIER
   |-- --executor-timeout=SECONDS -> executor_timeout = SECONDS (positive integer, default 900)
   |
   +-- Defaults: max_iterations=10, coverage_threshold=1.0, stability_window=2, batch_size=5,
       convergence_mode=default, lineage_mode=auto, executor.kind=native, executor_timeout=900

   Validate executor flags before loading YAML. Native rejects model/reasoning/service-tier.
   cli-codex accepts model, reasoning effort, and service tier. cli-opencode requires model,
   accepts reasoning effort, and rejects service tier. When execution_mode is INTERACTIVE,
   require executor.kind=native and fail fast on either external kind; confirm YAML remains native-only.

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: alignment_target OR "deep-alignment", mode: "focused", includeContent: true })
   - Store: prior_work_found = yes/no

6. ASK with SINGLE prompt (include only applicable questions):

   Q-Target. Alignment Target (if not in command): a human-readable label for what this run audits
     Examples: a skill hub name, a docs tree, an agent family

   Q-Lanes. Lanes (required unless --lane-config was supplied): resolve one or more lanes over the
     three axes authority x artifactClass x scope, per
     `.opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md`.
       authority   -- one of: sk-doc | sk-git | sk-design | sk-design-live-render | sk-code
       artifactClass -- the class of artifact this lane audits (per the authority's adapter)
       scope       -- paths / globs, or a branch range for sk-git
     A lane is never guessed. Supply `--lane-config <file.json>` to resolve lanes non-interactively.

   Q-Spec. Spec Folder (required):
     A) Use existing (suggest if found)
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when in use)
     C) Update related (if match found)
     D) Phase folder (e.g. `specs/NN-track/NNN-name/001-phase/`, or matching `.opencode/specs/` alias)

   Q-Mode. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at the init gate for approval

   Q-Iters. Max Iterations (if not set via flag):
     Default is 10. Change? (enter a number, or press enter for the default)

   Q-Converge. Convergence (optional, press enter for defaults):
     Coverage threshold (default 1.0 = every discovered artifact checked at least once) AND
     stability window (default 2 consecutive zero-new-findings iterations). Both must hold to STOP.

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - alignment_target = from Q-Target or $ARGUMENTS
   - lanes = from Q-Lanes structured answer, or from --lane-config
   - lane_config_path = from --lane-config when supplied, else null
   - spec_choice = A/B/C/D from Q-Spec
   - spec_path = derived path
   - execution_mode = AUTONOMOUS/INTERACTIVE
   - lineage_mode = auto/resume/restart from flag, marker, or default auto
   - max_iterations = from Q-Iters or flag or default 10
   - coverage_threshold = from Q-Converge or flag or default 1.0
   - stability_window = from Q-Converge or flag or default 2
   - convergence_mode = from flag, marker, or default `default`
   - batch_size = from marker or default 5
   - executor = resolved kind/model/reasoningEffort/serviceTier; executor_timeout from flag or default 900

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until the user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER guess a lane scope; resolve lanes explicitly or via --lane-config
NEVER split questions into multiple prompts
```

**Phase Output:**

- `alignment_target` | `lanes` | `lane_config_path`
- `spec_choice` | `spec_path` | `execution_mode` | `max_iterations` | `coverage_threshold` | `stability_window` | `convergence_mode` | `batch_size`
- `lineage_mode` | `executor` | `executor_timeout`
~~~
<!-- END renderBlocks.confirm -->

## setup

```yaml
block: setup
mode: "AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied"
requiredFields:
  - "alignment_target"
  - "lanes"
  - "spec_folder"
  - "execution_mode"
  - "lineage_mode"
  - "max_iterations"
  - "coverage_threshold"
  - "stability_window"
optionalFields:
  - "lane_config_path"
  - "session_id"
  - "batch_size"
  - "executor_timeout"
autoWorkflow: .opencode/commands/deep/assets/deep-alignment-auto.yaml
confirmWorkflow: .opencode/commands/deep/assets/deep-alignment-confirm.yaml
```

## outputTemplate

```yaml
block: outputTemplate
requiredArtifacts:
  - "{state_paths_iteration_pattern} iteration narrative markdown"
  - "{state_paths_state_log} append-only canonical JSONL iteration record"
  - "{state_paths_delta_pattern} per-iteration delta JSONL"
validation: "YAML-owned post-dispatch validation rejects missing or malformed artifacts."
```

## writeBoundary

```yaml
block: writeBoundary
approvedRoot: "{artifact_dir} resolved from spec_folder for alignment"
allowed:
  - "{state_paths_iteration_pattern}"
  - "{state_paths_state_log} append only"
  - "{state_paths_delta_pattern}"
  - "{state_paths_findings_registry} reducer-owned in-place updates only"
  - "{state_paths_config} single terminal status:complete transition only"
  - "{state_paths_corpus} init-time write only"
  - "{state_paths_alignment_output} synthesis write only"
  - "{state_paths_lock_file} advisory lock acquire/release"
  - "{state_paths_prompt_dir} rendered prompts"
readOnly:
  - "every audited artifact in the resolved lanes"
  - "command Markdown"
  - "workflow YAML assets"
  - "agent definitions"
  - "compiled contracts other than the selected build target"
banned:
  - "delete, rename, move, or truncate operations outside the allowed list"
  - "writes outside the resolved alignment packet"
  - "any modification of an audited artifact (this mode is read-only by contract)"
  - "remediation actions during the audit loop (REMEDIATE is a separate operator opt-in)"
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
  - "Grep"
  - "Glob"
  - "Task"
  - "Bash"
  - "memory_context"
  - "memory_search"
permittedByExecutor:
  native:
    - "Read"
    - "Grep"
    - "Glob"
    - "Task"
    - "Bash"
    - "memory_context"
    - "memory_search"
```

## absorptionAbort

```yaml
block: absorptionAbort
rule: "Producing findings without a dispatch receipt is role absorption; write no findings."
writePolicy: "If receipt evidence is absent, invalid, or mismatched to command intent, emit an abort status and leave finding artifacts unwritten."
```
