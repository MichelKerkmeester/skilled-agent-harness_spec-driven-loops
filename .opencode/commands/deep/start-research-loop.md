---
description: Autonomous deep-research loop: iterative investigation with convergence detection. Modes :auto, :confirm.
argument-hint: "<topic> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--executor=<type> [--model=X] [--config-dir=PATH] [--count=N] [--label=X] ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context
---

# Deep Start Research Loop

Thin router for the deep-research loop. This command verifies the runtime agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. Router Contract

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, artifact-writing behavior, convergence detection, synthesis, and memory save behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoint text, success output, failure output, examples, or next-step prompts.

> **Code Graph ownership:** `code_graph_query` and `code_graph_context` stay stable MCP tool IDs; implementation and docs now live under `.opencode/skills/system-code-graph/`.

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates — do them in order, skip neither):**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run the Unified Setup Phase (BLOCKED gate) through the presentation contract and resolve:
>    - `research_topic`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
> 3. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `deep_start-research-loop_auto.yaml`
>    - Confirm: `deep_start-research-loop_confirm.yaml`
> 4. Execute the YAML workflow step by step using those resolved values
>
> This command is **general-agent based** — it orchestrates the deep-research loop. Gate 1 (@general verification) and Gate 2 (the BLOCKED Unified Setup Phase) are HARD BLOCKS; neither may be skipped.

### Phase 0: @general Agent Verification

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate the deep-research loop (YAML workflow execution)
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
    │   │ This command orchestrates the deep-research loop and runs  │
    │   │ general-agent based.                                       │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:start-research-loop [arguments]                    │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

### Mandatory Input Gate

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`

For `:confirm` or no suffix, the consolidated setup prompt in the presentation contract MUST be the first visible response. For `:auto`, do not emit the consolidated setup prompt by default; use the auto setup resolution rules in the presentation contract and fail fast when required fields cannot be resolved.

> **Canonical mode syntax:** use attached command suffixes (`/deep:start-research-loop:auto`, `/deep:start-research-loop:confirm`) and keep AGENTS, skills, and quick references synchronized to this entrypoint.

> **Note:** Late-INIT `spec.md` detection and bounded `spec.md` mutations follow
> `.opencode/skills/deep-research/references/protocol/spec_check_protocol.md`.
> Acquire `{spec_folder}/research/.deep-research.lock` before `folder_state` classification and keep `research/research.md` as the source of truth for any generated findings sync.
> Targeted strict validation after deep-research spec mutations uses the Node validation orchestrator; the current strict path is designed for fast packet checks and was measured at about 108ms for a fresh Level 3 packet on the local harness.

## 2. Owned Assets

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_start-research-loop_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` |

No workflow-asset gap exists for this command.

## 3. Mode Routing

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `execution_mode = INTERACTIVE`; no suffix sets `execution_mode = ASK`.
2. Treat `--max-iterations`, `--convergence`, `--spec-folder`, `--executor`, `--model`, `--config-dir`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`, `--label`, `--count`, `--executors`, `--concurrency`, and `--no-resource-map` as workflow inputs, not execution modes.
3. For `:auto`, resolve setup from `$ARGUMENTS` flags, any `PRE-BOUND SETUP ANSWERS:` marker block, scope-extracted spec-folder paths, and the presentation contract's default resolution table. When all required fields are resolved, persist `{artifact_dir}/deep-research-config.json`, bind runtime YAML placeholders, and load `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`.
4. In `:auto`, ask a targeted Tier-2 question only for `spec_folder` when the topic is present, names no resolvable spec folder, and the folder choice is ambiguous. Missing `research_topic` is absence, not ambiguity; use the named-missing-inputs fail-fast format from the auto-mode contract and do not load YAML.
5. For `:confirm`, use the presentation contract's consolidated setup prompt to bind missing setup values, then load `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`.
6. For no suffix, use the presentation contract's consolidated setup prompt to choose execution mode and bind missing setup values, then route the resolved interactive choice to the matching YAML.
7. Lightweight read-only discovery for related spec folders or prior memory may support setup, but it must feed the single consolidated prompt and never split setup questions.
8. After the selected workflow asset is loaded, execute it step by step using the resolved setup values.

## 4. Execution Targets

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` |

## 5. Presentation Boundary

The following content lives only in `.opencode/commands/deep/assets/deep_start-research-loop_presentation.txt`:

- Startup-question wording, consolidated setup prompt text, and reply format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display references.
- Dashboard/checkpoint layout, workflow overview display, convergence-threshold explanation, and user-facing examples.
- Success and failure result templates, error-handling display, and memory-integration result wording.
- Next-step suggestions, command-chain wording, skill-reference text, and offline optimization notes.

## 6. Workflow Summary

The selected YAML workflow initializes deep-research state, dispatches fresh `@deep-research` LEAF agents per iteration, evaluates convergence, synthesizes `{artifact_dir}/research.md`, optionally emits `{artifact_dir}/resource-map.md`, and refreshes continuity through canonical spec docs. This command does not proceed to implementation.

For code review and quality auditing, route to `/deep:start-review-loop`. Research path: `/deep:start-research-loop` → `/speckit:plan` → `/speckit:implement`; review path: `/deep:start-review-loop` → (if issues) `/speckit:plan` → `/speckit:implement`.
