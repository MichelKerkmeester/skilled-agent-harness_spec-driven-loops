---
description: Codebase-context loop: heterogeneous parallel sweep with convergence detection. Modes :auto, :confirm.
argument-hint: "<scope> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--executor=<type> [--model=X] [--prompt-framework=X] [--label=X] ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query, code_graph_context
---

# Deep Start Context Loop

Thin router for the deep-context loop. This command verifies the orchestrating agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. Router Contract

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoints, success output, failure output, examples, or next-step prompts.

This command is **general-agent based** and must pass the @general verification gate before setup routing continues. Gate 1 (@general verification) and Gate 2 (the BLOCKED Unified Setup Phase) are HARD BLOCKS; neither may be skipped.

### Phase 0: @general Agent Verification

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate the deep-context loop (YAML workflow execution)
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to the Unified Setup Phase (also a HARD BLOCK)
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates the deep-context loop and runs   │
    │   │ general-agent based.                                       │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:start-context-loop [arguments]                     │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

### Mandatory Input Gate

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `scope`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`
- Resolve `executor_pool` before persisting config and entering the YAML workflow.

## 2. Owned Assets

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_start-context-loop_presentation.md` |
| Auto workflow | `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` |

No workflow-asset gap exists for this command.

## 3. Mode Routing

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:start-context-loop:auto` and `/deep:start-context-loop:confirm`; keep AGENTS, skills, and quick references synchronized to this entrypoint.
2. Treat scope text, `--max-iterations`, `--convergence`, relevance/agreement flags, executor pool flags, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS` and resolve required setup inputs through the presentation contract's three-tier auto setup resolution before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `scope`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, and `executor_pool` are bound.

## 4. Execution Targets

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` |

## 5. Presentation Boundary

The following content lives only in `.opencode/commands/deep/assets/deep_start-context-loop_presentation.md`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display behavior.
- Dashboard/checkpoint layouts, workflow overview displays, convergence threshold semantics, runtime robustness/session classification displays, and memory/skill reference displays.
- Success and failure result templates, output formats, and error-handling displays.
- Example invocations, executor-pool explanation display, and next-step suggestion wording.

## 6. Workflow Summary

The YAML workflow runs iterative codebase-context gathering by seeding a `SLICE` frontier from the scope, dispatching every executor over the same focus as a parallel sweep, merging findings by `file:symbol` with agreement counts, and synthesizing a reuse-first Context Report under `context/`. Convergence uses deep-context's relevance-gated coverage saturation with agreement and relevance as blocking guards; do not transfer sibling defaults from deep-research or deep-review. Code graph tool IDs remain stable as `code_graph_query` and `code_graph_context`; implementation and docs live under `.opencode/skills/system-code-graph/`.

**Context path:** `/deep:start-context-loop` -> `/speckit:plan` -> `/speckit:implement`
**Research:** `/deep:start-research-loop` -> `/speckit:plan` -> `/speckit:implement`
**Review:** `/deep:start-review-loop` -> (if issues) `/speckit:plan` -> `/speckit:implement`
