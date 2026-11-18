---
description: "Autonomous deep-research loop: iterative investigation with convergence detection. Modes :auto, :confirm."
argument-hint: "<topic> [:auto|:confirm] [--spec-folder=PATH] [--max-iterations=N] [--executor=TYPE] [--concurrency=N] [--dry-run] [--restart] [--extend=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch
---

# Deep Start Research Loop

Thin router for the deep-research loop. This command verifies the runtime agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `convergence_mode`, `depth_mode`, `stop_policy`, `lineage_mode`
  - `dry_run` is normalized to `true` or `false`; absence means `false`

In `:auto` mode, an explicit `--restart` or `--lineage-mode=restart` flag (invocation form `--restart|--lineage-mode=restart`) is operator authorization to archive the resolved research packet before fan-out or phase init. Do not ask for a second confirmation; preserve rollback by moving the timestamped archive directory back to `research/` if needed.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, artifact-writing behavior, convergence detection, synthesis, and memory save behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoint text, success output, failure output, examples, or next-step prompts.


> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION (HARD-BLOCK gate — do not skip):**
> 1. Run the Unified Setup Phase (BLOCKED gate) through the presentation contract and resolve:
>    - `research_topic`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
>    - `convergence_mode` (default `default` unless `--convergence-mode` is present)
>    - `depth_mode` (default `default` unless `--depth-mode=expansive` is present)
>    - `stop_policy` (default `convergence` unless `--stop-policy=max-iterations` is present)
>    - `lineage_mode` (default `auto` unless `--lineage-mode` or `--restart` is present)
>    - `dry_run` (default false unless `--dry-run` is present)
> 2. Load the workflow YAML from `assets/` only after all setup values are resolved: `deep-research.yaml`. The mode binds `execution_mode` to `auto` or `confirm`.
> 3. Execute the YAML workflow step by step using those resolved values
>
> This command is **general-agent based** — it orchestrates the deep-research loop. The Unified Setup Phase (the BLOCKED gate) is a HARD BLOCK; it may not be skipped.

For `:confirm` or no suffix, the consolidated setup prompt in the presentation contract MUST be the first visible response. For `:auto`, do not emit the consolidated setup prompt by default; use the auto setup resolution rules in the presentation contract and fail fast when required fields cannot be resolved.

> **Canonical mode syntax:** use attached command suffixes (`/deep:research:auto`, `/deep:research:confirm`).

> **Note:** Late-INIT `spec.md` detection and bounded `spec.md` mutations follow
> `.skilled/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md`.
> Acquire `{spec_folder}/research/.deep-research.lock` before `folder_state` classification and keep `research/research.md` as the source of truth for any generated findings sync.
> Targeted strict validation after deep-research spec mutations uses the Node validation orchestrator.

### AUTONOMOUS EXECUTION DIRECTIVE (:auto)

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked with the `:auto` suffix and a bound spec_folder and target in your message. Setup is already resolved.

- DO NOT emit the consolidated setup question (target/mode, topic, Spec Folder A/B/C/D, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (the prebound spec folder is your write authority).
- PROCEED immediately: load the workflow YAML with `execution_mode` bound to `auto` and execute it step by step.
- THE WORKFLOW DISPATCHES: the workflow YAML owns setup, the dispatch of the `deep-research` agent for each iteration, reducer sync, convergence checks, synthesis and all loop-level artifact writes. You do not dispatch from this document, and you do not read, edit, patch or run the loop over the target yourself. The `deep-research` leaf owns only its own single-iteration artifacts.
- ROUTE PROOF: dispatch through the workflow with `execution_mode` bound to `auto` and its prompt pack so `deep-research` writes each iteration state record with the route-proof fields present — `target_agent: "deep-research"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "research"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

This contract is your instruction set. The research target is the bound spec_folder or target named in your message, never this document.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/deep/assets/deep-research-presentation.txt` |
| Workflow | `.skilled/commands/deep/assets/deep-research.yaml` (`execution_mode` binds to `auto` or `confirm`) |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `execution_mode = INTERACTIVE`; no suffix sets `execution_mode = ASK`.
2. Treat every flag in the Workflow Flag Surface table below as a workflow input, not an execution mode. The table is the only list of flags.
3. For `:auto`, resolve setup from `$ARGUMENTS` flags, any `PRE-BOUND SETUP ANSWERS:` marker block, scope-extracted spec-folder paths, and the presentation contract's default resolution table. When all required fields are resolved, persist `{artifact_dir}/deep-research-config.json`, bind runtime YAML placeholders, and load `.skilled/commands/deep/assets/deep-research.yaml` with `execution_mode` bound to `auto`.
4. In `:auto`, ask a targeted Tier-2 question only for `spec_folder` when the topic is present, names no resolvable spec folder, and the folder choice is ambiguous. Missing `research_topic` is absence, not ambiguity; use the named-missing-inputs fail-fast format from the auto-mode contract and do not load YAML.
5. For `:confirm`, use the presentation contract's consolidated setup prompt to bind missing setup values, then load `.skilled/commands/deep/assets/deep-research.yaml` with `execution_mode` bound to `confirm`.
6. For no suffix, use the presentation contract's consolidated setup prompt to choose execution mode and bind missing setup values, then load `.skilled/commands/deep/assets/deep-research.yaml` with `execution_mode` bound to the chosen mode.
7. Lightweight read-only discovery for related spec folders or prior memory may support setup, but it must feed the single consolidated prompt and never split setup questions.
8. After the selected workflow asset is loaded, execute it step by step using the resolved setup values.

### Workflow Flag Surface

The argument hint names the invocation shape; the whole flag surface is here. Every flag below
is a workflow input, never an execution mode, and the presentation asset owns how each one binds
into `config`.

| Flag | Value | Effect |
|------|-------|--------|
| `--spec-folder` | `PATH` | Binds the packet that owns this run's writes. |
| `--max-iterations` | `N` | Hard ceiling on loop iterations. |
| `--convergence` | `N` | Threshold the loop must clear before convergence may stop it. |
| `--convergence-mode` | `default` \| `off` \| `sliding-window` \| `divergent` | `default` keeps the anti-convergence `minIterations` floor. `off` disables convergence-driven STOP while max-iterations, pause and halt stay active. `sliding-window` scores novelty over a bounded window, five snapshots by default, on the ordinary legal-stop path. `divergent` sends a `composite_converged` or `all_questions_answered` stop into a one-round three-seat Council pivot instead of ending the run, at proportionally higher cost. |
| `--depth-mode` | `default` \| `expansive` | `default`, the value when the flag is absent, runs exactly as before. `expansive` is opt-in: the run seeds depth-1 frontier nodes from the topic before iteration 1, admits leaf `frontier_proposal` rows as new questions under depth, fan-out, budget, dedupe and cycle caps (`expansiveDepth` in the config: `maxDepth` 3, `maxChildrenPerNode` 6, a 50/35/15 iteration budget across depths, and a run-wide `maxFrontierNodes` cap that defaults to half of `--max-iterations`), steers Next Focus to the shallowest open node, and turns a convergence stop into another iteration while frontier nodes stay open. It never outranks the iteration cap, consecutive failures, the minIterations floor, stuck recovery, pause, `--convergence-mode=off` or `--stop-policy=max-iterations`. When `--max-iterations` is left at its default, the run sizes its budget from the seed: `min(24, max(10, 2 × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes, 16 at the full six seeds, and the seed step prints the derived budget. The node cap stays half that budget, which leaves room for at least two nodes past depth 1. An explicit `--max-iterations`, marker or fan-out matrix `iterations` value always wins, even below the derived value, and the seed warns when it leaves no room past depth 1. Fan-out lineages each get a share of the seeded nodes. |
| `--lineage-timeout-hours` | `N` | See Lineage Timeout Flag below. |
| `--stop-policy` | `convergence` \| `max-iterations` | See Stop Policy Flag below. |
| `--no-resource-map` | no value | Suppresses the `research/resource-map.md` write; `research.md` still emits. |
| `--dry-run` | no value | See Dry-Run Flag below. |
| `--restart` | no value | Shorthand that selects `restart`: opens a new `sessionId` at generation+1 and archives the prior `research/`. |
| `--lineage-mode` | `auto` \| `resume` \| `restart` | Session lifecycle intent, default `auto`. `resume` keeps the same `sessionId` and archives nothing. `restart` opens a new `sessionId` at generation+1 and archives the prior `research/`. `fork` is not accepted. |
| `--extend` | positive integer, as `--extend=N` | Extends a completed run in place by `N` iterations, lineage mode `completed-continue`. The run keeps its `sessionId` and generation, records one `run_extended` ledger event and keeps the prior synthesis as `research/synthesis-v{generation}-r{continuedFromRun}.md`. The run must be complete, so use `--lineage-mode=resume` for an unfinished one. Refused with fan-out. Under `stopPolicy: convergence` an extension with nothing new can re-stop on `all_questions_answered` at once: pass `--convergence-mode=off`, use `stopPolicy: max-iterations` or add questions to `research/inbox.jsonl`. |
| `--extend-minutes` | positive integer, as `--extend-minutes=M` | Minutes added to the duration budget on an extension, default the prior `maxDurationMinutes`. The new budget is `max(prior, elapsed) + M`, because the clock counts idle time since `createdAt`, so an extension started after the old budget still runs. Valid only with `--extend`. |
| `--executor` | `TYPE` | Selects the executor kind, and is repeatable. Each occurrence opens a group accepting `--model=X`, `--config-dir=PATH`, `--reasoning-effort=LEVEL`, `--service-tier=TIER`, `--executor-timeout=SECONDS`, `--iters=N`, `--count=N` and `--label=X`. Which of those a given kind supports, and the fail-fast on an unsupported pairing, are in the presentation asset. |
| `--executors` | `JSON` | Declares the executor matrix in one value; one expanded lineage selects `config.executor`, while two or more select `config.fanout`. |
| `--concurrency` | `N` | Caps concurrent lineages in the fan-out pool. Default `2`. |

Fan-out policy: zero or one `--executor` runs the single-executor path, and so does an
`--executors` matrix that expands to exactly one lineage. Its `iterations` value binds to
`config.maxIterations`, and its executor settings populate `config.executor`. Two or more
`--executor` flags, a matrix expanding to two or more lineages, or any `--count` above 1
selects fan-out. A direct call of the fan-out runner that expands to one research or review
lineage is refused and names this workflow instead, because the runner alone skips packet
init, synthesis and save. Under `:auto` a `PRE-BOUND SETUP ANSWERS:` block
in the prompt body binds the same values without an interactive prompt.

### Lineage Timeout Flag

`--lineage-timeout-hours <N>` optionally narrows the per-lineage wall-clock timeout ceiling below the default 4 hours; values above the hard 4-hour maximum are rejected, and omitting the flag keeps the 4h default.

### Stop Policy Flag

`--stop-policy <convergence|max-iterations>` selects whether convergence may stop the loop early. The default `convergence` stops at legal convergence or `config.maxIterations`, whichever comes first; `max-iterations` treats convergence as telemetry only and forces the loop to continue until `config.maxIterations`, which is useful for forced-depth runs.

### Dry-Run Flag

`--dry-run` is a first-class flag in both execution modes, not a third execution mode. It still performs real setup resolution, artifact-root resolution, focus selection, prompt rendering, and convergence reads when those steps can run without side effects.

When `dry_run=true`, the workflow emits `dry_run_halt` JSONL preview lines to terminal output instead of appending to the live state log, and halts before executor dispatch, persistent state mutation, reducer refresh, or child-lineage spawn.
Under dry run the setup phase binds its values in memory and does not persist `{artifact_dir}/deep-research-config.json`.
A fresh packet and an existing packet both stop at the directory creation step, which is the first persistent state boundary.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` or `:confirm` | `.skilled/commands/deep/assets/deep-research.yaml`, with `execution_mode` bound to `auto` or `confirm` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/deep/assets/deep-research-presentation.txt`:

- Startup-question wording, consolidated setup prompt text, and reply format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display references.
- Dashboard/checkpoint layout, workflow overview display, convergence-threshold explanation, and user-facing examples.
- Success and failure result templates, error-handling display, and memory-integration result wording.
- Next-step suggestions, command-chain wording, skill-reference text, and offline optimization notes.

---

## 6. WORKFLOW SUMMARY

The selected YAML workflow initializes deep-research state, dispatches fresh `@deep-research` LEAF agents per iteration, evaluates convergence, synthesizes `{artifact_dir}/research.md`, optionally emits `{artifact_dir}/resource-map.md`, and refreshes continuity through canonical spec docs. This command does not proceed to implementation.

For code review and quality auditing, route to `/deep:review`. Research path: `/deep:research` → `/speckit:plan` → `/speckit:implement`; review path: `/deep:review` → (if issues) `/speckit:plan` → `/speckit:implement`.

Each iteration's prompt tells the writer that its `[SOURCE: path:line]` tags are checked by the `SOURCE_TAGS` rule. That rule runs in the next `/speckit:*` validation rather than inside this workflow, whose validation calls list their own rules. A resolved tag proves only that the path and line exist.
