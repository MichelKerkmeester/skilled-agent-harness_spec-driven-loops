---
description: "Install or debug Code Mode, its UTCP configuration, and runtime registration."
argument-hint: "<install [--runtime <name>]|debug [--fix]>"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---
<!-- skill_agent: system-spec-kit -->

# /doctor:mcp Router

This command is a thin router. It resolves the MCP sub-action and setup values, then loads the matching workflow YAML and the presentation contract.

### MANDATORY INPUT GATE

**STATUS: BLOCKED** until `sub_action` is bound.

1. Parse the first positional token of `$ARGUMENTS` as `sub_action`, before any flag.
2. Treat an absent or whitespace-only sub-action as missing. Do not infer it from conversation history, open files, earlier runs, runtime config state or repository state.
3. When it is missing, show the presentation contract's sub-action menu, stop, and wait. Use only `$ARGUMENTS` or that explicit reply.

If this gate was skipped, stop, say so, return to it, and bind the sub-action before loading any workflow.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing startup questions, setup dashboards, approval prompts, MCP health dashboards, result summaries, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt` |
| Install workflow | `.skilled/commands/doctor/assets/doctor-mcp-install.yaml` |
| Debug workflow | `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml` |

---

## 3. MODE ROUTING

- The sub-action is positional and must be parsed before flags.
- No mode suffix is supported.
- `install` accepts `--runtime <name>`; `debug` accepts `--fix`.
- If any referenced asset is missing, stop and report the missing path.
- This command installs and diagnoses Code Mode, its `.utcp_config.json` manuals, credential references, and runtime registrations.
- Subsystem diagnostics have their own commands: `/doctor:speckit`, `/doctor:skill-advisor`, `/doctor:deep-loop` and `/doctor:runtime-mirrors`.
- The YAML owns workflow behavior; the presentation Markdown owns visible wording and layout.

---

## 4. EXECUTION TARGETS

1. Read `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt`.
2. Take `sub_action` from the input gate.
3. If `sub_action` is not `install` or `debug`, render the presentation contract's unknown-sub-action failure and stop.
4. Bind the workflow asset:
   - `install` -> `.skilled/commands/doctor/assets/doctor-mcp-install.yaml`
   - `debug` -> `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml`
5. Parse remaining flags using only the selected sub-action schema:
   - `install`: optional `--runtime <name>` from `opencode`, `claude`, `codex`, `cursor`, `pi`, or `devin`
   - `debug`: optional `--fix`
6. Before YAML load, reject a flag that belongs to the other sub-action with the presentation contract's cross-sub-action error, and a flag neither sub-action accepts with its unknown-flag error.
7. Load the selected workflow YAML and execute it step by step.
8. Use the presentation contract, not this router, for user prompts, dashboards, result summaries, and next-step display.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt`:

- Sub-action menu, accepted answers, and cancellation display.
- Unknown-sub-action, cross-sub-action flag and unknown-flag errors.
- MCP assessment, install, repair, verification, and final-report display templates.
- Examples, troubleshooting display, and next-step text.

---

## 6. WORKFLOW SUMMARY

The bound sub-action workflow (`doctor-mcp-install.yaml` for `install`, `doctor-mcp-debug.yaml` for `debug`) drives Code Mode assessment, installation or repair, and verification, rendering every user-facing string through the presentation contract. The health script runs with `--json` and preserves its structured output. Each repair requires explicit approval, including when `--fix` is set. The workflow reports credential reference presence without requesting or writing credential values. Subsystem diagnostics route through `/doctor:speckit`, `/doctor:skill-advisor`, `/doctor:deep-loop` and `/doctor:runtime-mirrors`.
