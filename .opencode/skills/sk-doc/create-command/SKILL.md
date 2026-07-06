---
name: create-command
description: Scaffold OpenCode slash commands with explicit argument hints, allowed tools, and router/presentation separation.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-command, slash command, opencode command, argument-hint, allowed-tools, command router, presentation contract, thin router, command scaffold -->

# Create Command

`create-command` is the command-authoring workflow packet of the `sk-doc` parent hub. It scaffolds OpenCode slash commands under `.opencode/commands/`, using `assets/command/command_template.md` for command structure and `assets/command/command_presentation_template.md` when a command needs a router/presentation split.

This packet is lean and self-contained. The advisor identity lives at the `sk-doc` hub root; do not add packet-local `graph-metadata.json`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request involves:
- Creating a new OpenCode slash command.
- Refactoring a command into a thin router plus owned presentation asset.
- Adding or fixing command frontmatter, especially `argument-hint` and `allowed-tools`.
- Designing command argument handling with `$ARGUMENTS`.
- Authoring a namespace command such as `/namespace:action`.
- Separating visible prompts, dashboards, result templates, or next-step wording into a presentation contract.
- Checking whether a workflow should be a command instead of a skill, agent, or one-off task.

Keyword triggers: `create command`, `slash command`, `opencode command`, `argument-hint`, `allowed-tools`, `command template`, `router presentation split`, `thin router`, `presentation contract`, `$ARGUMENTS`, `:auto`, `:confirm`.

### When NOT to Use

Skip this packet when:
- The request is to create a skill. Use `create-skill`.
- The request is to create an agent. Use `create-agent`.
- The request is only prose documentation quality. Use `doc-quality`.
- The task is a one-time operation that does not need a reusable slash command.
- The command already exists and the user asks for runtime debugging rather than command authoring.
- The requested workflow is destructive or externally privileged but lacks confirmation and rollback requirements.

### Packet Boundary

This packet owns command scaffolding and command-document quality. It does not own the runtime behavior of every command family, command registration outside `.opencode/commands/`, or package-level advisor metadata.

---

## 2. HOW IT WORKS

### Resource Loading

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any command scaffold or command edit | `assets/command/command_template.md` |
| ALWAYS | Any validation or delivery claim | `../shared/references/global/core_standards.md`, `../shared/references/global/validation.md` |
| CONDITIONAL | Router/presentation split, dashboards, prompts, result wording | `assets/command/command_presentation_template.md` |
| CONDITIONAL | Need structured validation output | `../shared/scripts/extract_structure.py` |
| CONDITIONAL | Need blocking document validation | `../shared/scripts/validate_document.py`, `../shared/scripts/quick_validate.py` |

### Command Authoring Workflow

1. Confirm the target command path, namespace, invocation name, and expected arguments.
2. Read any existing command file before editing it.
3. Load `assets/command/command_template.md` and classify the command as simple, workflow, mode-based, argument-dispatch, destructive, or namespace-scoped.
4. Write command frontmatter first: concise `description`, accurate `argument-hint` when arguments are expected, and complete `allowed-tools`.
5. Use fully qualified MCP tool IDs in `allowed-tools`, such as `mcp__<server>__<tool>`. Keep bare helper names in prose only.
6. Add a mandatory input gate when `argument-hint` contains required arguments.
7. Keep the command body executable and instruction-oriented. Commands are workflows, not reference manuals.
8. For mode-based commands, keep the `.md` file as a thin router with routing logic only.
9. For router/presentation split commands, create or update the presentation asset from `assets/command/command_presentation_template.md`.
10. Validate command structure through the shared doc-quality scripts before delivery.

### Thin Router Shape

Use this shape for new mode-based workflow commands:

```text
Router Contract
Owned Assets
Mode Routing
Execution Targets
Presentation Boundary
Workflow Summary
```

The router owns mode resolution, mandatory-input gates, owned-assets tables, and execution routing. It must not contain inline startup prompts, dashboard templates, result templates, or next-step wording when a presentation asset exists.

### Presentation Contract Shape

Use `assets/command/command_presentation_template.md` for `assets/<ns>_<command>_presentation.txt` when visible output needs a source of truth.

The presentation asset owns:
- Startup prompts and consolidated setup questions.
- Auto fail-fast display text.
- Dashboard and checkpoint layouts.
- Success and failure result templates.
- Next-step suggestions.

The presentation asset does not own routing, mode resolution, tool selection, or execution semantics.

### Validation

Run the shared validators from the packet root or adjust paths as needed:

```bash
python ../shared/scripts/validate_document.py <command-file.md> --type command
python ../shared/scripts/extract_structure.py <command-file.md>
```

Exit code `0` from `validate_document.py` is required before claiming the command document is structurally valid.

---

## 3. RULES

### ALWAYS

1. Read existing target files before editing them.
2. Load `assets/command/command_template.md` before writing command frontmatter or command body.
3. Use `argument-hint` whenever the command expects user-supplied arguments.
4. Add a mandatory gate for required arguments before any action that depends on them.
5. Keep `description` concise and invocation-oriented.
6. List every tool the command actually uses in `allowed-tools`.
7. Use fully qualified MCP names in `allowed-tools`.
8. Keep visible presentation text in the presentation asset when using the router/presentation split.
9. Validate with `../shared` doc-quality scripts before delivery.
10. Keep this packet free of `graph-metadata.json`.

### NEVER

1. Never put dashboard, startup prompt, or result-template text inside a thin router when a presentation asset exists.
2. Never use broad `allowed-tools` just in case.
3. Never omit confirmation gates for destructive or irreversible actions.
4. Never create a command for one-off work that does not need reuse.
5. Never turn a command into long reference documentation; move background knowledge to a skill or reference file.
6. Never add advisor identity metadata inside this nested packet.
7. Never claim a command is valid without running the shared validator or clearly stating validation was not run.

### ESCALATE IF

1. The command name, namespace, or invocation contract is unclear.
2. Required arguments cannot be safely defaulted.
3. The command would perform destructive work without an explicit confirmation design.
4. Tool permissions are broader than the workflow appears to need.
5. Router logic and presentation wording cannot be separated without changing behavior.
