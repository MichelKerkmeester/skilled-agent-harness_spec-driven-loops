---
description: Planning workflow (8 steps): spec through plan only. Modes :auto, :confirm, :with-context, :with-phases.
argument-hint: "<feature-description> [:auto|:confirm] [:with-context] [:with-phases] [--intake-only] [--phases N] [--phase-names list] [--phase-folder=<path>] [--spec-folder=PATH] [--level=1|2|3|3+] [--start-state=STATE] [--repair-mode=MODE] [--record-relationships=yes|no] [--depends-on=IDs] [--related-to=IDs] [--supersedes=IDs] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_save, mcp__mk_code_index__code_graph_query
---

# SpecKit Plan

Thin router for the SpecKit planning workflow. This command resolves the execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, checkpoints, dashboards, success output, failure output, or next-step prompts.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/speckit/assets/speckit_plan_presentation.txt` |
| Auto workflow | `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` |
| Confirm workflow | `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml` |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. Treat `:with-context`, `:with-phases`, `--intake-only`, `--phases`, `--phase-names`, `--phase-folder`, `--spec-folder`, `--level`, `--start-state`, `--repair-mode`, and relationship flags as workflow inputs, not execution modes.
3. If no mode suffix is present, use the presentation contract's startup prompt to ask for execution mode.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. Load the selected workflow asset and execute it step by step.

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/speckit/assets/speckit_plan_presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Checkpoint and dashboard display templates, including deep-context and phase-decomposition checkpoints.
- Success and failure result templates.
- Next-step suggestions and final user prompt wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs planning from intake through context refresh and terminates before implementation. If a user requests implementation after planning, route to `/speckit:implement`; do not start implementation from this command.
