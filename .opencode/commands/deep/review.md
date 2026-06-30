---
description: Autonomous deep-review loop: iterative code audit with convergence detection. Modes :auto, :confirm.
argument-hint: "<target> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--stop-policy=convergence|max-iterations] [--spec-folder=PATH] [--restart|--lineage-mode=restart] [--executor=<type> --model=X --config-dir=PATH --count=N --label=X ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context
---

# Deep Start Review Loop

Thin router for the deep-review loop. This command verifies the orchestrating agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoints, success output, failure output, examples, or next-step prompts.

This command is **general-agent based** and must pass the general-agent verification gate before setup routing continues. Do not use the Task tool to spawn the general agent; in `opencode run --command`, the default primary agent is the command orchestrator when it has the tools listed below. Keep raw agent handles out of this command body because OpenCode parses them as delegation requests.

In `:auto` mode, an explicit `--restart` or `--lineage-mode=restart` flag is operator authorization to archive the resolved review packet before fan-out or phase init. Do not ask for a second confirmation; preserve rollback by moving the timestamped archive directory back to `review/` if needed.

### PHASE 0: GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the general agent?
│
├─ INDICATORS that you ARE the general agent:
│   ├─ You can orchestrate the deep-review loop (YAML workflow execution)
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│   ├─ You are the default primary agent for `opencode run --command deep/review`
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to the Unified Setup Phase (also a HARD BLOCK)
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    ├─ Do NOT dispatch the general agent through Task; it is not a loop executor.
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates the deep-review loop and runs    │
    │   │ general-agent based.                                       │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:review [arguments]                                 │ 
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, `lineage_mode`

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_review_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_review_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_review_confirm.yaml` |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:review:auto` and `/deep:review:confirm`; keep AGENTS, skills, and quick references synchronized to this entrypoint.
2. Treat target text, `--max-iterations`, `--convergence`, `--stop-policy`, `--spec-folder`, lifecycle flags (`--restart`, `--lineage-mode`), executor flags, fan-out flags, the internal `--fanout-lineage-artifact-dir`, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS` and resolve required setup inputs through the presentation contract's three-tier auto setup resolution before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, and `lineage_mode` are bound.

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_review_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_review_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep_review_presentation.txt`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display behavior.
- Dashboard/checkpoint layouts, workflow overview displays, mode behavior descriptions, and review reference displays.
- Success and failure result templates, error-handling displays, and verdict wording.
- Example invocations, fan-out explanation display, and next-step suggestion wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs iterative code review by initializing a review packet under `{artifact_dir}`, dispatching fresh deep-review LEAF agents, evaluating convergence across configured review dimensions, and synthesizing findings into `review-report.md` plus optional `resource-map.md`. Convergence uses the review-specific `convergenceThreshold` severity-weighted finding ratio; do not transfer sibling defaults from deep-research or deep-ai-council. Code graph tool IDs remain stable as `code_graph_query` and `code_graph_context`; implementation and docs live under `.opencode/skills/system-code-graph/`.

**Review path (findings):** `/deep:review` -> (if FAIL/CONDITIONAL) `/speckit:plan` -> `/speckit:implement`
**Review path (clean):** `/deep:review` -> (if PASS) `/create:changelog`
