---
description: "Autonomous deep-review loop: iterative code audit with convergence detection. Modes :auto, :confirm."
argument-hint: "<target> [:auto|:confirm] [--spec-folder=PATH] [--max-iterations=N] [--executor=TYPE] [--concurrency=N] [--restart]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# Deep Start Review Loop

Thin router for the deep-review loop. This command verifies the orchestrating agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoints, success output, failure output, examples, or next-step prompts.

This command is **general-agent based**. Do not use the Task tool to spawn the general agent; in `opencode run --command`, the default primary agent is the command orchestrator when it has the tools listed below. Keep raw agent handles out of this command body because OpenCode parses them as delegation requests.

In `:auto` mode, an explicit `--restart` or `--lineage-mode=restart` flag (invocation form `--restart|--lineage-mode=restart`) is operator authorization to archive the resolved review packet before fan-out or phase init. Do not ask for a second confirmation; preserve rollback by moving the timestamped archive directory back to `review/` if needed.

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, `lineage_mode`

### AUTONOMOUS EXECUTION DIRECTIVE (:auto)

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/review` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (the prebound spec folder is your write authority).
- PROCEED immediately: load the auto workflow YAML and dispatch the `deep-review` agent to run ONE iteration of the review loop over the bound target.
- DISPATCH ONLY: you dispatch `deep-review` to run one iteration; you do NOT read, edit, patch, or run the review loop over the target yourself. The auto workflow YAML owns the loop itself — setup, dispatch-per-iteration, reducer sync, convergence checks, synthesis, and all loop-level artifact writes; the `deep-review` leaf owns only its own single-iteration artifacts — mixing your own inline work with the dispatch is a route violation.
- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so `deep-review` writes each iteration state record with the route-proof fields present — `target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "review"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

Your job is to DISPATCH `deep-review` to run ONE iteration of the review loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. The auto workflow YAML owns the loop itself (setup, dispatch-per-iteration, reducer sync, convergence, synthesis, and loop-level writes). This contract is your instruction set; the review target is the bound spec_folder/target named in your message, never this document.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep-review-presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep-review-auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep-review-confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:review:auto` and `/deep:review:confirm`.
2. Treat target text, `--max-iterations`, `--convergence`, `--lineage-timeout-hours`, `--stop-policy`, `--spec-folder`, lifecycle flags (`--restart`, `--lineage-mode`), executor flags, fan-out flags, the internal `--fanout-lineage-artifact-dir`, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS` and resolve required setup inputs through the presentation contract's three-tier auto setup resolution before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, and `lineage_mode` are bound.

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
| `--restart`, `--lineage-mode` | `auto` \| `resume` \| `restart` | Session lifecycle intent, default `auto`. `resume` keeps the same `sessionId` and archives nothing; `restart`, which bare `--restart` selects, opens a new `sessionId` at generation+1 and archives the prior `review/`. `fork` and `completed-continue` are deferred and rejected. |
| `--executor` | `TYPE` | Selects the executor kind, and is repeatable. Each occurrence opens a group accepting `--model=X`, `--config-dir=PATH`, `--reasoning-effort=LEVEL`, `--service-tier=TIER`, `--executor-timeout=SECONDS`, `--iters=N`, `--count=N` and `--label=X`. Which of those a given kind supports is in the presentation asset. |
| `--executors` | `JSON` | Escape hatch declaring the whole fan-out matrix in one value instead of repeated `--executor` groups. |
| `--concurrency` | `N` | Caps concurrent lineages in the fan-out pool. Default `2`. |

Fan-out policy: zero or one `--executor` and no `--executors` runs the single-executor path;
two or more `--executor` flags, an `--executors` value, or any `--count` above 1 switches to
fan-out, one independent lineage per label. `--fanout-lineage-artifact-dir` is internal and set
by the runtime, not by a caller. Under `:auto` a `PRE-BOUND SETUP ANSWERS:` block in the prompt
body binds the same values without an interactive prompt.

### Lineage Timeout Flag

`--lineage-timeout-hours <N>` may only narrow the per-lineage wall-clock timeout ceiling below the 4-hour hard maximum; a value above 4 is rejected outright. Full-lineage lifetime is non-disableable -- omit the flag to keep the 4h ceiling, or pass a lower `<N>` to cap a lineage more tightly.

### Stop Policy Flag

`--stop-policy <convergence|max-iterations>` (invocation form `--stop-policy=convergence|max-iterations`) selects whether convergence may stop the loop early. The default `convergence` stops at legal convergence or `config.maxIterations`, whichever comes first; `max-iterations` treats convergence as telemetry only and forces the loop to continue until `config.maxIterations`, which is useful for forced-depth runs.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep-review-auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep-review-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep-review-presentation.txt`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display behavior.
- Dashboard/checkpoint layouts, workflow overview displays, mode behavior descriptions, and review reference displays.
- Success and failure result templates, error-handling displays, and verdict wording.
- Example invocations, fan-out explanation display, and next-step suggestion wording.

---

## 6. WORKFLOW SUMMARY


**Review path (findings):** `/deep:review` -> (if FAIL/CONDITIONAL) `/speckit:plan` -> `/speckit:implement`
**Review path (clean):** `/deep:review` -> (if PASS) `/create:changelog`
