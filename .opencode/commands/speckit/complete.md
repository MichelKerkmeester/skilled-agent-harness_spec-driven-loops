---
description: End-to-end SpecKit workflow (14+ steps). Modes: :auto, :confirm, :with-research, :with-context, :with-phases.
argument-hint: "<feature-description> [:auto|:confirm] [:with-research] [:with-context] [:with-phases] [--phases N] [--phase-names list] [--phase-folder=<path>] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_save, mcp__mk_spec_memory__memory_index_scan
---

# SpecKit Complete

Thin router for the end-to-end SpecKit workflow. This command resolves mode and optional workflow flags, loads the presentation contract, then executes the owned workflow YAML.

## 1. Router Contract

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, research/context/phase insertion, artifact writing, validation, and context-save behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, checkpoints, dashboards, success output, failure output, or next-step prompts.

## 2. Owned Assets

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/speckit/assets/speckit_complete_presentation.txt` |
| Auto workflow | `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` |
| Confirm workflow | `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml` |

No workflow-asset gap exists for this command.

## 3. Mode Routing

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. Treat `:with-research`, `:with-context`, `:with-phases`, `--phases`, `--phase-names`, and `--phase-folder` as workflow inputs, not execution modes.
3. If no mode suffix is present, use the presentation contract's startup prompt to ask for execution mode.
4. For `:auto`, resolve required setup inputs using the presentation contract's auto-resolution rules before loading YAML.
5. Load the selected workflow asset and execute it step by step.

## 4. Execution Targets

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml` |

## 5. Presentation Boundary

The following content lives only in `.opencode/commands/speckit/assets/speckit_complete_presentation.txt`:

- Startup-question wording and reply format.
- `:auto` pre-bound setup answer schema, default table, targeted-ask rules, and fail-fast display.
- Research, deep-context, phase-decomposition, planning-gate, implementation, checklist, and closeout dashboards.
- Success and failure result templates.
- Next-step suggestions and final user prompt wording.

## 6. Workflow Summary

The YAML workflow runs the full lifecycle from specification through implementation, validation, context refresh, and workflow closeout. Optional research, context, and phase-decomposition flows are routed through the selected workflow asset.
