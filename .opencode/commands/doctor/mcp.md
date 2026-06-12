---
description: Install or repair MCP servers via /doctor:mcp <install|debug> sub-action routing.
argument-hint: "<install|debug> [--server <name>] [--runtime <name>] [--fix]"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---
<!-- skill_agent: system-spec-kit -->

# /doctor:mcp Router

This command is a thin router. It resolves the MCP sub-action and setup values, then loads the matching workflow YAML and the presentation contract.

## Router Contract

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, approval prompts, MCP health dashboards, result summaries, or next-step text.

## Owned Assets

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/doctor/assets/doctor_mcp_presentation.txt` |
| Install workflow | `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` |
| Debug workflow | `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` |

No workflow-asset gap exists for this command.

## Execution Order

1. Read `.opencode/commands/doctor/assets/doctor_mcp_presentation.txt`.
2. Parse the first positional token from `$ARGUMENTS` as `sub_action`.
3. If `sub_action` is missing, ask the presentation contract's sub-action prompt and wait.
4. If `sub_action` is not `install` or `debug`, render the presentation contract's unknown-sub-action failure and stop.
5. Bind the workflow asset:
   - `install` -> `.opencode/commands/doctor/assets/doctor_mcp_install.yaml`
   - `debug` -> `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml`
6. Parse remaining flags using only the selected sub-action schema:
   - `install`: `--server <name>`, `--runtime <name>`
   - `debug`: `--fix`, `--server <name>`
7. Reject cross-sub-action flags before YAML load using the presentation contract's error wording.
8. Load the selected workflow YAML and execute it step by step.
9. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, and next-step display.

## Routing Rules

- The sub-action is positional and must be parsed before flags.
- No mode suffix is supported.
- `install` and `debug` have overlapping `--server` flag names; keep their schemas separate.
- If any referenced asset is missing, stop and report the missing path.
- This command repairs MCP infrastructure itself; subsystem database diagnostics stay under `/doctor <target>` and `/doctor:update`.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

## Presentation Boundary

The following content lives only in `.opencode/commands/doctor/assets/doctor_mcp_presentation.txt`:

- Sub-action menu, accepted answers, and cancellation display.
- Unknown-sub-action and cross-sub-action flag errors.
- MCP assessment, install, repair, verification, and final-report display templates.
- Examples, troubleshooting display, and next-step text.

User request: {{args}}
