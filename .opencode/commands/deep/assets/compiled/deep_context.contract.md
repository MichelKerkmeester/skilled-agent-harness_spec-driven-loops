<!-- GENERATED_COMMAND_CONTRACT_HEADER_START
{
  "id": "deep/context",
  "command": "/deep:context",
  "version": 1,
  "generatedBy": ".opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs",
  "sourceDigests": [
    {
      "path": ".opencode/commands/deep/context.md",
      "sha256": "2ca7c620725be93b7a08c1f5745722cf4155276225dc51edc24cee2f87a874a9",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep_context_presentation.txt",
      "sha256": "c18ff92c368b8947ad64ff3229c2cf739932b39699d80fad965c683c591699fb",
      "section": "full"
    },
    {
      "path": ".opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md",
      "sha256": "cc283b7c5e62bd8b012a8f249f4cc63f4f353ad264358e1a5c9b85d753713d64",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep_context_auto.yaml",
      "sha256": "9ee67cc14d32445215ad2256535751e4b87b6d28cb4927e07354fbaff7c20302",
      "section": "full"
    },
    {
      "path": ".opencode/commands/deep/assets/deep_context_confirm.yaml",
      "sha256": "897aad626ba34a42efab2239883b3853663f43a44c19bc6188c2f037db228aff",
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
      "path": ".opencode/skills/deep-loop-workflows/deep-context/SKILL.md",
      "sha256": "771d8e74a197bea4d79b353033d65150975d98356b3ed993d6940856233e1497",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-context/references/protocol/loop_protocol.md",
      "sha256": "08ac70bbfe9bbec0c47961393f7624012b09471939929b7f977fe513e51f9f48",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-context/references/state/state_format.md",
      "sha256": "c6d81e798bb35951e78d27b8877e995e71d16730a9a24877728f0c07e0dd8e02",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-context/references/convergence/convergence.md",
      "sha256": "5e46a3edc0227473ccfd1304e3be83c1acf2e3ccfcd9e75f00263f14cc75cf2a",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json",
      "sha256": "ef401a928adddd8d23b698fb4d2d32a0943bc46d76aa41e400d0a0b3bc376bb5",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/deep-context/assets/context_report_template.md",
      "sha256": "77fbf91c0aa6f958e04b68376e8bb0f727f59ca54d96affa15e73756bcec8f24",
      "section": "full"
    },
    {
      "path": ".opencode/agents/deep-context.md",
      "sha256": "1669241c96e9994450f4f591156dd83e734f90bdb28f93c4a1eff06155ba0ac6",
      "section": "full"
    },
    {
      "path": ".opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs",
      "sha256": "3c801fbecbc5bb01a99a7578243a823b791368cc229966b930418cfb468500df",
      "section": "full"
    }
  ],
  "compiledBodyDigest": "374f566e0f47e31aafda4a0d093d360740262230c5e9c77d6be29fa3cffa9d4d"
}
GENERATED_COMMAND_CONTRACT_HEADER_END -->
# Compiled Command Contract: /deep:context

This generated contract collapses the maintained command authority chain into one grep-checkable executor contract. Maintained sources remain authoritative; regenerate this file when any source digest changes.

## autonomousExecutionDirective

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/context` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (see gate3Precedence below).
- PROCEED immediately: load the auto workflow YAML and dispatch the `deep-context` agent to run the context loop over the bound target.
- DISPATCH ONLY: you dispatch `deep-context` to run the loop; you do NOT read, edit, patch, or run the context loop over the target yourself. The `deep-context` leaf owns the loop and every artifact write — mixing your own inline work with the dispatch is a route violation.
- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so `deep-context` writes each iteration state record with the route-proof fields present — `target_agent: "deep-context"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "context"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

Your job is to DISPATCH `deep-context` to run the context loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. This contract is your instruction set; the context target is the bound spec_folder/target named in your message, never this document.

## sourceAuthority

1. `.opencode/commands/deep/context.md`
2. `.opencode/commands/deep/assets/deep_context_presentation.txt`
3. `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`
4. `.opencode/commands/deep/assets/deep_context_auto.yaml`
5. `.opencode/commands/deep/assets/deep_context_confirm.yaml`
6. `.opencode/skills/deep-loop-workflows/mode-registry.json`
7. `.opencode/skills/deep-loop-workflows/SKILL.md`
8. `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md`
9. `.opencode/skills/deep-loop-workflows/deep-context/references/protocol/loop_protocol.md`
10. `.opencode/skills/deep-loop-workflows/deep-context/references/state/state_format.md`
11. `.opencode/skills/deep-loop-workflows/deep-context/references/convergence/convergence.md`
12. `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json`
13. `.opencode/skills/deep-loop-workflows/deep-context/assets/context_report_template.md`
14. `.opencode/agents/deep-context.md`
15. `.opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs`

## gate3Precedence

```yaml
block: gate3Precedence
classifierPath: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts
classifierLines:
  commandContractShape: "67-72"
  autonomousSatisfaction: "653-680"
command: /deep:context
executionMode: AUTONOMOUS
commandContract:
  declaresAutonomousExecution: true
  ownsSpecFolderSetup: true
  allowedSpecFolderSources:
    - flag
    - marker
    - scope_extract
  writeBoundary: "{artifact_dir} resolved from spec_folder for context"
rule: "When the classifier receives AUTONOMOUS execution, a validated prebound spec folder, and this command contract, Gate 3 is satisfied by the prebound folder before any write."
```

## renderBlocks.auto

Rule: render the marked block verbatim; do not paraphrase, summarize, reorder, or substitute inside the START/END boundary.

<!-- START renderBlocks.auto -->
~~~markdown
### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{artifact_dir}/deep-context-config.json` (shape: `scope`, `specFolder`, `loopType: "context"`, `maxIterations`, `convergenceThreshold`, `executionMode: "auto"`, `relevanceGate`, `agreementMin`, `fanout.{mode,concurrency,executors}`, `report.*`, `reducer.*`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep_context_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_folder`. **Ordering rule**: none needed. Missing `scope` is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:context:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  scope: WebSocket reconnection in the realtime client  # string — target feature/area to gather context for
  spec_folder: <spec-folder>  # existing | new | update-related | phase-folder | explicit path
  execution_mode: AUTONOMOUS  # from :auto suffix
  maxIterations: 8  # positive integer
  convergenceThreshold: 0.10  # decimal 0..1
  relevanceGate: 0.55  # decimal 0..1 — prune findings below this relevance
  agreementMin: 2  # positive integer — distinct executors required to confirm a finding
  concurrency: 4  # positive integer — CLI-pool concurrency cap
  executors: '[{"kind":"native","label":"native-a"},{"kind":"native","label":"native-b"}]'  # JSON array — the executor pool (native-only by default; add cli-* seats for a heterogeneous pool)
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `scope` | Y | `$ARGUMENTS` positional scope, or marker `scope` | none | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, `scope-extract` → a spec-folder path named in the positional scope (auto-bound + stripped, per `auto_mode_contract` §1 source 3), or targeted choice among suggested existing/new/update-related/phase folder | none | Y, ONLY when scope is present, names no resolvable spec folder, and the folder choice is ambiguous |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `maxIterations` | Y | flag `--max-iterations`, marker `maxIterations`, or default | `8` | N |
| `convergenceThreshold` | Y | flag `--convergence`, marker `convergenceThreshold`, or default | `0.10` | N |
| `relevanceGate` | N | flag `--relevance-gate`, marker `relevanceGate`, or default | `0.55` | N |
| `agreementMin` | N | flag `--agreement-min`, marker `agreementMin`, or default | `2` | N |
| `executor_pool` | N | repeatable `--executor=<type>` flags or `--executors=<json>`, marker `executors`, config file, or default pool; each `--executor` group accepts `--model`, `--reasoning-effort`, `--prompt-framework`, `--label` | default native-only pool, 2 native (see config) | N |
| `concurrency` | N | flag `--concurrency=N`, marker `concurrency`, or default | `4` | N |

**Pool default policy (the key difference from research/review):** deep-context is **always a shared-scope pool** — there is no single-executor path. 0 `--executor` flags and no `--executors`/marker → the default **native-only pool** (2 `@deep-context` seats) from `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json`. Any explicit `--executor`/`--executors`/marker → that pool (native, CLI, or combined). A 1-seat pool is legal but defeats the purpose (no agreement signal); warn and continue. The pool is written to `config.fanout.executors` with `config.fanout.mode = "by-model-shared-scope"`.
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
   |-- ":auto"         -> execution_mode = "AUTONOMOUS"
   |-- ":confirm"      -> execution_mode = "INTERACTIVE"
   +-- No suffix       -> execution_mode = "ASK"

2. CHECK $ARGUMENTS for scope:
   |-- Has content (ignoring suffixes and flags):
   |     -> scope = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --relevance-gate=N -> relevanceGate = N
   |-- --agreement-min=N -> agreementMin = N
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   |-- --executor=<type> [--model=X] [--reasoning-effort=Y] [--prompt-framework=Z] [--label=X]
   |     (repeatable; each occurrence adds one seat to config.fanout.executors)
   |     type = `native` | `cli-opencode` | `cli-opencode` | `cli-claude-code`
   |-- --executors=<json> -> config.fanout.executors = parse(json) escape hatch for the full pool
   |-- --concurrency=N -> config.fanout.concurrency (default 4)
   |
   |   Pool resolution:
   |   - No --executor / --executors / marker: use the default native-only pool (2 native) from
   |     .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json
   |   - Any explicit seats: write config.fanout.executors from them
   |   - ALWAYS set config.fanout.mode = "by-model-shared-scope" (every seat sweeps the SAME focus)
   |
   +-- Defaults: maxIterations=8, convergenceThreshold=0.10, relevanceGate=0.55, agreementMin=2,
       concurrency=4, config.loopType="context"

   Pool precedence for setup resolution:
   - CLI flags / --executors / marker > config file > default pool
   - The generated `deep-context-config.json` stores the pool under `config.fanout.executors`
     and per-model prompt framing under each seat's `promptFramework`

   Per-model prompt framing:
   - Each seat's optional `promptFramework` is resolved against `sk-prompt-models`
     (MiMo -> COSTAR, MiniMax -> TIDD-EC, DeepSeek -> TIDD-EC). Native seats carry no framework.
   - cli dispatch honors the cli-* contracts (cli-opencode: closed stdin `</dev/null`,
     NO top-level `--agent`; model id form per the executor skill).

4. Resolve spec_folder from the scope BEFORE asking (auto_mode_contract §1 source 3):
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort
   |-- If {scope} (raw $ARGUMENTS) contains a path token that canonicalizes (resolve the
   |   specs/ -> .opencode/specs/ symlink) to one of these EXISTING spec folders:
   |     -> spec_path = that folder; STRIP the path token from scope; omit Q1 (Tier-1 resolved).
   |        Output lands at {spec_path}/context/ (root spec) or {spec_path}/context/{packet}/ (phase child).
   |-- Else: keep the most-recent (tail -10) as suggestions for Q1.
   +-- FAIL-CLOSED: do NOT offer or select the standalone run dir (Q1 option E) when a spec folder
       was named in the scope or is derivable from it.

5. Seed the frontier + load prior context (background, read-only):
   - code_graph_query on 2-5 word concept descriptions from {scope} -> ranked SLICE anchors
   - memory_context({ input: scope OR "deep-context", mode: "focused", includeContent: true })
   - Store: frontier_seeded = [yes/no], prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):
   - Include Q-Pool only when no `--executor`/`--executors` is present and the scope text does
     NOT already name an executor pool. If Q-Pool is omitted and no pool is otherwise resolved,
     default to the native-only pool from deep_context_config.json.

   Q0. Scope (if not in command): What feature/area should I gather codebase context for?

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)
     E) None yet — use a standalone run dir and hand the report path to /speckit:plan
        (offer E ONLY when no spec folder was named in the scope or is derivable from it. If step 4
         bound a spec_folder, SKIP Q1 entirely and NEVER select E — standalone is fail-closed when a
         folder is identifiable, per auto_mode_contract §1.)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 8. Change? [Enter number or press enter for default]

   Q-Pool. Executor Pool (optional, press enter for default = Native only):
     A) Native only — 2 @deep-context Task subagents (on the host runtime's model) in a parallel batch. No CLI seats.
     B) Custom — Native, through CLI Skill, or Combined. Optionally provide a pool via repeatable `--executor=...` flags or `--executors='<json>'`.

   Reply format examples:
   - `"A, A"`
   - `"WebSocket reconnection context, A, A, 6"`
   - `"realtime client reconnection, B, A, 8, 0.10, A"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - scope = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D/E from Q1]
   - spec_path = [derived path, or standalone run dir for E]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 8]
   - convergenceThreshold = [from flag or default 0.10]
   - executor_pool = [CLI flags, --executors, compact reply, config file, or default native-only pool;
     ALWAYS written to config.fanout.executors with config.fanout.mode = "by-model-shared-scope"]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**

- `scope` | `spec_choice` | `spec_path`
- `execution_mode` | `maxIterations` | `convergenceThreshold`
- `executor_pool` (by-model-shared-scope)
~~~
<!-- END renderBlocks.confirm -->

## setup

```yaml
block: setup
mode: "AUTONOMOUS for :auto, INTERACTIVE for :confirm, ASK when no suffix is supplied"
requiredFields:
  - "scope"
  - "spec_folder"
  - "max_iterations"
  - "convergence_threshold"
  - "executor_pool"
optionalFields:
  - "relevance_gate"
  - "agreement_min"
  - "concurrency"
  - "executor"
  - "executor_model"
  - "executor_reasoning"
  - "executor_prompt_framework"
  - "executor_label"
  - "executors"
autoWorkflow: .opencode/commands/deep/assets/deep_context_auto.yaml
confirmWorkflow: .opencode/commands/deep/assets/deep_context_confirm.yaml
```

## outputTemplate

```yaml
block: outputTemplate
requiredArtifacts:
  - "{state_paths_iteration_pattern} iteration narrative markdown"
  - "{state_paths_state_log} append-only canonical JSONL iteration record"
  - "{state_paths_delta_pattern} per-iteration delta JSONL"
  - "{state_paths_report_output} synthesized Context Report markdown"
  - "{state_paths_report_json_output} synthesized Context Report JSON"
validation: "YAML-owned post-dispatch validation rejects missing or malformed artifacts."
```

## writeBoundary

```yaml
block: writeBoundary
approvedRoot: "{artifact_dir} resolved from spec_folder for context"
allowed:
  - "{state_paths.config}"
  - "{state_paths.state_log} append only"
  - "{state_paths.strategy} in-place updates only"
  - "{state_paths.registry} reducer-owned in-place updates only"
  - "{state_paths.dashboard} reducer-owned in-place updates only"
  - "{state_paths.prompt_dir} rendered seat prompts"
  - "{state_paths.iteration_pattern}"
  - "{state_paths.delta_pattern}"
  - "{state_paths.seat_pattern} host-collected per-seat findings"
  - "{state_paths.report_output}"
  - "{state_paths.report_json_output}"
  - "{state_paths.lock_file} advisory lock acquire/release"
  - "coverage-graph records for loop_type=context"
readOnly:
  - "declared context scope source files"
  - "command Markdown"
  - "workflow YAML assets"
  - "agent definitions"
  - "compiled contracts other than the selected build target"
  - "downstream planning or implementation files"
banned:
  - "delete, rename, move, or truncate operations outside the allowed list"
  - "writes outside the resolved context packet"
  - "implementation fixes during context execution"
  - "agent seat writes to merged state or source files"
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
    - "Task"
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
