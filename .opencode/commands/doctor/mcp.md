---
description: Install or repair MCP servers via /doctor:mcp <install|debug> sub-action routing.
argument-hint: "<install|debug> [--server <name>] [--runtime <name>] [--fix]"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---
<!-- skill_agent: system-spec-kit -->

# /doctor:mcp Router

This command is a thin router. It resolves the MCP sub-action and setup values, then loads the matching workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, approval prompts, MCP health dashboards, result summaries, or next-step text.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt` |
| Install workflow | `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` |
| Debug workflow | `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml` |

## 3. MODE ROUTING

- The sub-action is positional and must be parsed before flags.
- No mode suffix is supported.
- `install` and `debug` have overlapping `--server` flag names; keep their schemas separate.
- If any referenced asset is missing, stop and report the missing path.
- This command repairs MCP infrastructure itself; subsystem database diagnostics stay under `/doctor <target>` and `/doctor:update`.
- This command's `install` workflow covers the registered MCP servers (the `servers:` block in `doctor-mcp-install.yaml`). The CLI-primary design skills (`mcp-figma`, `mcp-open-design`, `mcp-chrome-devtools`, `mcp-click-up`) are not registered servers; each self-diagnoses via its own `scripts/install.sh` and read-only `scripts/doctor.sh`, enumerated under `cli_skill_diagnostics:` in the same YAML. Run those per-skill for CLI readiness.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

## 4. EXECUTION TARGETS

1. Read `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt`.
2. Parse the first positional token from `$ARGUMENTS` as `sub_action`.
3. If `sub_action` is missing, ask the presentation contract's sub-action prompt and wait.
4. If `sub_action` is not `install` or `debug`, render the presentation contract's unknown-sub-action failure and stop.
5. Bind the workflow asset:
   - `install` -> `.opencode/commands/doctor/assets/doctor-mcp-install.yaml`
   - `debug` -> `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml`
6. Parse remaining flags using only the selected sub-action schema:
   - `install`: `--server <name>`, `--runtime <name>`
   - `debug`: `--fix`, `--server <name>`
7. Reject cross-sub-action flags before YAML load using the presentation contract's error wording.
8. Load the selected workflow YAML and execute it step by step.
9. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, and next-step display.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt`:

- Sub-action menu, accepted answers, and cancellation display.
- Unknown-sub-action and cross-sub-action flag errors.
- MCP assessment, install, repair, verification, and final-report display templates.
- Examples, troubleshooting display, and next-step text.

## 6. WORKFLOW SUMMARY

The bound sub-action workflow (`doctor-mcp-install.yaml` for `install`, `doctor-mcp-debug.yaml` for `debug`) drives MCP-server assessment, installation or repair, and verification, rendering every user-facing string through the presentation contract. `install` covers the registered `servers:` set plus the enumerated CLI-skill self-diagnostics; `debug` repairs a named or failing server. Subsystem database diagnostics route through `/doctor <target>` and `/doctor:update`, never this command.

User request: $ARGUMENTS
