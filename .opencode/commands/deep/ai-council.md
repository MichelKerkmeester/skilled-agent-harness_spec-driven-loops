---
title: "Deep Council"
description: Multi-topic deep-ai-council session loop with adjudicator-verdict stability. Modes :auto, :confirm.
argument-hint: "<deliberation-topic|topics> [:auto|:confirm] [--max-topics=N] [--max-rounds-per-topic=N] [--executor=TYPE]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__system_spec_memory__memory_context, mcp__system_spec_memory__memory_search
---

# Deep Council

Thin router for the deep-ai-council session loop. This command verifies the orchestrating agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoints, success output, failure output, examples, or next-step prompts.

This command is **general-agent based**. The Unified Setup Phase (the BLOCKED input gate) is a HARD BLOCK; it may not be skipped.

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `deliberation_topic` or `topics`
  - `max_rounds_per_topic`
  - `max_topics_per_session`
  - `saturation_threshold`
  - `convergenceThreshold`
  - `executor.*`
  - `spec_folder`
  - `execution_mode`
- **PLANNING BOUNDARY**: deep council writes packet-local `ai-council/**` artifacts only. Implementation remains with the caller or follow-on implementation agents.
- **GRAPH BOUNDARY**: derived council graph replay uses `runtime/` CLI scripts with `--loop-type council`; `ai-council/**` artifacts remain authoritative.
- **ONE CLI PER ROUND**: all seats in a round use one executor boundary. Different CLIs are separate rounds, not mixed seats.

> **Canonical mode syntax:** use attached command suffixes (`/deep:ai-council:auto`, `/deep:ai-council:confirm`).

### AUTONOMOUS EXECUTION DIRECTIVE (:auto)

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/ai-council` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (the prebound spec folder is your write authority).
- PROCEED immediately: load the auto workflow YAML and convene the ai-council round over the bound topic.
- CONVENE IN-CLI: run the round's seats using your OWN model bench / distinct reasoning lenses in-CLI — do NOT dispatch a task per seat (in-CLI is the default and common council mode). Produce at least 3 DISTINCT seats.
- SEAT PROOF: persist each seat stepwise as it returns (persist-artifacts.cjs --seat / persistSeatStepwise) so the persisted artifacts name distinct seat ids; the completed per-seat progress-record count must equal seats_per_round. The delegation evidence is the persisted distinct seats, not a task dispatch.

Your job is to CONVENE 3+ distinct ai-council seats in-CLI over the bound topic and persist each as it returns — NOT to write a single-lens plan yourself, and NOT to review, analyze, or summarize this contract. This contract is your instruction set; the topic is the bound spec_folder/target named in your message, never this document.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep-ai-council-presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:ai-council:auto` and `/deep:ai-council:confirm`.
2. Treat topic text, `--max-rounds-per-topic`, `--max-topics`, `--saturation`, `--convergence`, `--spec-folder`, executor flags, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS` and resolve required setup inputs through the presentation contract's three-tier auto setup resolution before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `deliberation_topic` or `topics`, `max_rounds_per_topic`, `max_topics_per_session`, `saturation_threshold`, `convergenceThreshold`, `executor.*`, `spec_folder`, and `execution_mode` are bound.

### Workflow Flag Surface

The argument hint names the invocation shape; the whole flag surface is here. Every flag below
is a workflow input, never an execution mode, and the presentation asset owns how each one binds
into `config`.

| Flag | Value | Effect |
|------|-------|--------|
| `--spec-folder` | `PATH` | Binds the packet that owns this session's writes. |
| `--max-topics` | `N` | Ceiling on topics deliberated in one session. |
| `--max-rounds-per-topic` | `N` | Ceiling on deliberation rounds per topic. |
| `--saturation` | `N` | Saturation threshold that ends a topic once new argument stops arriving. |
| `--convergence` | `N` | Adjudicator-verdict stability threshold. |
| `--executor-mode` | `in-cli` \| `external-cli` | Binds `executor.mode`. Default `in-cli`, which deliberates the seats inside this session; `external-cli` dispatches them to an external CLI executor. |
| `--executor` | `TYPE` | Selects the executor kind for `external-cli`, alongside `--model=X`, `--reasoning-effort=LEVEL`, `--service-tier=TIER` and `--executor-timeout=SECONDS`. Which of those a given kind supports is in the presentation asset. |

Under `:auto` a `PRE-BOUND SETUP ANSWERS:` block in the prompt body binds the same values without
an interactive prompt.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep-ai-council-presentation.txt`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display behavior.
- Dashboard/checkpoint layouts, workflow overview displays, mode behavior descriptions, and council reference displays.
- Success, failure, and cancelled result templates, output formats, and final status wording.
- Example invocations, memory integration display wording, skill references, and next-step suggestion wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs a bounded multi-topic AI Council session under `{spec_folder}/ai-council/`: it initializes session state, runs topic loops with findings-registry priors, evaluates adjudicator-verdict stability, synthesizes per-topic and session reports, and refreshes packet continuity. Convergence uses the council-specific 0.20 default on adjudicator-verdict stability; do not transfer sibling defaults from deep-review or deep-research. Packet-local `ai-council/**` artifacts remain canonical, and derived council graph replay uses `runtime/` CLI scripts with `--loop-type council`.

For single-round planning, use the regular `ai-council` agent behavior. After a successful deep council session, continue to implementation planning or the next packet phase.
