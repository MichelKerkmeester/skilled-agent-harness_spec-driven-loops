---
description: Create a new OpenCode agent with frontmatter, tool permissions, behavioral rules. Modes :auto, :confirm.
argument-hint: "<agent_name> [agent_description] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, mcp__mk_code_index__code_graph_query, mcp__mk_spec_memory__memory_save
---

# /create:agent Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:agent to its presentation contract and workflow YAML for creating an OpenCode agent with frontmatter, tool permissions, and behavioral rules.

- Do not dispatch agents from this router.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation contract | `.opencode/commands/create/assets/create_agent_presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create_agent_auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create_agent_confirm.yaml` |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

1. Read `.opencode/commands/create/assets/create_agent_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/create/assets/create_agent_auto.yaml` |
| `:confirm` or omitted mode | `.opencode/commands/create/assets/create_agent_confirm.yaml` |

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create_agent_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, confirmation prompts, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create_agent_auto.yaml` for `:auto`, `create_agent_confirm.yaml` for `:confirm` or an omitted mode) runs the agent-creation workflow step by step after Phase 0 verification and setup resolution, producing an OpenCode agent with frontmatter, tool permissions, and behavioral rules. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract, not this router.

User request: $ARGUMENTS
