---
description: "Autonomous deep-review loop: iterative code audit with convergence detection. Modes :auto, :confirm."
argument-hint: "<target> [:auto|:confirm] [--spec-folder=PATH] [--max-iterations=N] [--executor=TYPE] [--concurrency=N] [--dry-run] [--restart] [--extend=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# Deep Start Review Loop

Thin router for the deep-review loop. This command verifies the orchestrating agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, `lineage_mode`
  - `dry_run` (default false unless `--dry-run` is present)

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoints, success output, failure output, examples, or next-step prompts.


> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION (HARD-BLOCK gate — do not skip):**
> 1. Run the Unified Setup Phase (BLOCKED gate) through the presentation contract and resolve:
>    - `review_target`
>    - `review_target_type`
>    - `review_dimensions`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
>    - `stop_policy` (default `convergence` unless `--stop-policy=max-iterations` is present)
>    - `dry_run` (default false unless `--dry-run` is present)
> 2. Load the workflow YAML from `assets/` only after all setup values are resolved: `deep-review.yaml`. The mode binds `execution_mode` to `auto` or `confirm`.
> 3. Execute the YAML workflow step by step using those resolved values
>
> This command is **general-agent based** — it orchestrates the deep-review loop. The Unified Setup Phase (the BLOCKED gate) is a HARD BLOCK; it may not be skipped.

This command is **general-agent based**. Do not use the Task tool to spawn the general agent; the default primary agent is the command orchestrator when it has the tools listed below. Keep raw agent handles out of this command body because OpenCode parses them as delegation requests.

In `:auto` mode, an explicit `--restart` or `--lineage-mode=restart` flag (invocation form `--restart|--lineage-mode=restart`) is operator authorization to archive the resolved review packet before fan-out or phase init. Do not ask for a second confirmation; preserve rollback by moving the timestamped archive directory back to `review/` if needed.

### AUTONOMOUS EXECUTION DIRECTIVE (:auto)

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked with the `:auto` suffix and a bound spec_folder and review target in your message. Setup is already resolved.

- DO NOT emit the consolidated setup question (target/mode, review target, Spec Folder A/B/C/D, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (the prebound spec folder is your write authority).
- PROCEED immediately: load the workflow YAML with `execution_mode` bound to `auto` and execute it step by step.
- THE WORKFLOW DISPATCHES: the workflow YAML owns setup, the dispatch of the `deep-review` agent for each iteration, reducer sync, convergence checks, synthesis and all loop-level artifact writes. You do not dispatch from this document, and you do not read, edit, patch or run the loop over the target yourself. The `deep-review` leaf owns only its own single-iteration artifacts.
- ROUTE PROOF: dispatch through the workflow with `execution_mode` bound to `auto` and its prompt pack so `deep-review` writes each iteration state record with the route-proof fields present — `target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "review"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

This contract is your instruction set. The review target is the bound spec_folder or target named in your message, never this document.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/deep/assets/deep-review-presentation.txt` |
| Workflow | `.skilled/commands/deep/assets/deep-review.yaml` (`execution_mode` binds to `auto` or `confirm`) |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:review:auto` and `/deep:review:confirm`.
2. Treat the target text, pre-bound setup answers and every flag in the Workflow Flag Surface table below as workflow inputs, not execution modes. The table is the only list of flags.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS` and resolve required setup inputs through the presentation contract's three-tier auto setup resolution before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, `lineage_mode` and `dry_run` are bound.

### Workflow Flag Surface

The argument hint names the invocation shape; the whole flag surface is here. Every flag below
is a workflow input, never an execution mode, and the presentation asset owns how each one binds
into `config`.

| Flag | Value | Effect |
|------|-------|--------|
| `--spec-folder` | `PATH` | Binds the packet that owns this run's writes. |
| `--max-iterations` | `N` | Hard ceiling on loop iterations. |
| `--convergence` | `N` | Threshold the loop must clear before convergence may stop it. |
| `--convergence-mode` | `default` \| `off` \| `sliding-window` \| `divergent` | `default` keeps the anti-convergence `minIterations` floor. `off` disables convergence-driven STOP while max-iterations, pause and halt stay active. `sliding-window` scores novelty over a bounded window, five snapshots by default. `divergent` routes an eligible convergence stop into a Council pivot rather than ending the run. |
| `--lineage-timeout-hours` | `N` | See Lineage Timeout Flag below. |
| `--stop-policy` | `convergence` \| `max-iterations` | See Stop Policy Flag below. |
| `--no-resource-map` | no value | Suppresses the resource-map write; the review report still emits. |
| `--dry-run` | no value | See Dry-Run Flag below. |
| `--review-focus` | `"TEXT"` | Optional operator focus that every iteration covers in addition to its dimension, in single-executor and fan-out runs alike. It is cut to one line of at most 1000 characters, stored as `reviewFocus` in the config and shown in the review report. |
| `--restart`, `--lineage-mode` | `auto` \| `resume` \| `restart` | Session lifecycle intent, default `auto`. `resume` keeps the same `sessionId` and archives nothing; `restart`, which bare `--restart` selects, opens a new `sessionId` at generation+1 and archives the prior `review/`. `fork` is not accepted. |
| `--extend` | positive integer, as `--extend=N` | Extends a completed run in place by `N` iterations, lineage mode `completed-continue`. The run keeps its `sessionId` and generation, records one `run_extended` ledger event and keeps the prior review report as `review/review-report-v{generation}-r{continuedFromRun}.md`. The run must be complete, so use `--lineage-mode=resume` for an unfinished one. Refused with fan-out. Under `stopPolicy: convergence` an extension with nothing new can re-stop on `all_dimensions_clean` at once: pass `--convergence-mode=off` or use `stopPolicy: max-iterations`. |
| `--extend-minutes` | positive integer, as `--extend-minutes=M` | Minutes added to the duration budget on an extension, default the prior `maxDurationMinutes`. The new budget is `max(prior, elapsed) + M`, because the clock counts idle time since `createdAt`, so an extension started after the old budget still runs. Valid only with `--extend`. |
| `--executor` | `TYPE` | Selects the executor kind, and is repeatable. Each occurrence opens a group accepting `--model=X`, `--config-dir=PATH`, `--reasoning-effort=LEVEL`, `--service-tier=TIER`, `--executor-timeout=SECONDS`, `--iters=N`, `--count=N` and `--label=X`. Which of those a given kind supports is in the presentation asset. |
| `--executors` | `JSON` | Declares the executor matrix in one value; one expanded lineage selects `config.executor`, while two or more select `config.fanout`. |
| `--concurrency` | `N` | Caps concurrent lineages in the fan-out pool. Default `2`. |

Fan-out policy: zero or one `--executor` runs the single-executor path, and so does an
`--executors` matrix that expands to exactly one lineage. Its `iterations` value binds to
`config.maxIterations`, and its executor settings populate `config.executor`. Two or more
`--executor` flags, a matrix expanding to two or more lineages, or any `--count` above 1
selects fan-out. A direct call of the fan-out runner that expands to one research or review
lineage is refused and names this workflow instead, because the runner alone skips packet
init, synthesis and save. `--fanout-lineage-artifact-dir` is internal and
set by the runtime, not by a caller. Under `:auto` a `PRE-BOUND SETUP ANSWERS:` block in the
prompt body binds the same values without an interactive prompt.

### Lineage Timeout Flag

`--lineage-timeout-hours <N>` may only narrow the per-lineage wall-clock timeout ceiling below the 4-hour hard maximum; a value above 4 is rejected outright. Full-lineage lifetime is non-disableable -- omit the flag to keep the 4h ceiling, or pass a lower `<N>` to cap a lineage more tightly.

### Stop Policy Flag

`--stop-policy <convergence|max-iterations>` (invocation form `--stop-policy=convergence|max-iterations`) selects whether convergence may stop the loop early.
The default `convergence` stops at legal convergence or `config.maxIterations`, whichever comes first.
`max-iterations` treats convergence as telemetry only and forces the loop to continue until `config.maxIterations`, which is useful for forced-depth runs.

### Dry-Run Flag

`--dry-run` is a first-class flag in both execution modes, not a third execution mode. It still performs real setup resolution, artifact-root resolution, focus selection, prompt rendering and convergence reads when those steps can run without side effects.

When `dry_run=true`, the workflow emits `dry_run_halt` JSONL preview lines to terminal output instead of appending to the live state log, and halts before executor dispatch, persistent state mutation, reducer refresh or child-lineage spawn.
Under dry run the setup phase binds its values in memory and does not persist `{artifact_dir}/deep-review-config.json`.
A fresh packet and an existing packet both stop at the directory creation step, which is the first persistent state boundary.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` or `:confirm` | `.skilled/commands/deep/assets/deep-review.yaml`, with `execution_mode` bound to `auto` or `confirm` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/deep/assets/deep-review-presentation.txt`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display behavior.
- Dashboard/checkpoint layouts, workflow overview displays, mode behavior descriptions, and review reference displays.
- Success and failure result templates, error-handling displays, and verdict wording.
- Example invocations, fan-out explanation display, and next-step suggestion wording.

---

## 6. WORKFLOW SUMMARY

The selected YAML workflow initializes deep-review state, dispatches a fresh `deep-review` LEAF agent per iteration, evaluates convergence and synthesizes `{artifact_dir}/review-report.md`, then routes a FAIL or CONDITIONAL verdict to `/speckit:plan` and a PASS verdict to `/create:changelog`.

**Review path (findings):** `/deep:review` -> (if FAIL/CONDITIONAL) `/speckit:plan` -> `/speckit:implement`
**Review path (clean):** `/deep:review` -> (if PASS) `/create:changelog`

Each iteration's prompt tells the writer that its `[SOURCE: path:line]` tags are checked by the `SOURCE_TAGS` rule. That rule runs in the next `/speckit:*` validation rather than inside this workflow, whose validation calls list their own rules.
