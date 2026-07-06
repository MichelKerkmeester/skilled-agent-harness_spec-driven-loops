# create-command

Scaffold OpenCode slash commands with clear arguments, tight tool permissions, and router/presentation separation when needed.

## When to Use

Use this packet when you need to:

- Create a reusable OpenCode slash command under `.opencode/commands/`.
- Add or fix command frontmatter such as `description`, `argument-hint`, and `allowed-tools`.
- Design `$ARGUMENTS` handling and mandatory input gates.
- Build namespace commands such as `/namespace:action`.
- Split a mode-based command into a thin router plus a presentation asset.
- Decide whether a workflow should be a command instead of a skill, agent, or one-off task.

Do not use it for skill scaffolding, agent scaffolding, prose-only documentation quality, one-time work, or runtime debugging of an existing command.

## What's Inside

- `SKILL.md`: authoritative packet contract, workflow, rules, validation expectations, and escalation conditions.
- `assets/command/command_template.md`: main command-authoring template covering frontmatter, command types, gates, structure, and examples.
- `assets/command/command_presentation_template.md`: template for `_presentation.txt` assets used by thin router commands.
- `changelog/.gitkeep`: placeholder for packet-local changelog entries.
- No packet-local `references/` or `scripts/` directories are present.

Shared validation and doc-quality resources live outside this packet:

- `../shared/references/global/core_standards.md`
- `../shared/references/global/validation.md`
- `../shared/scripts/validate_document.py`
- `../shared/scripts/extract_structure.py`
- `../shared/scripts/quick_validate.py`

## Quick Start

1. Confirm the command path, invocation name, namespace, and expected arguments.
2. Read any existing command file before editing it.
3. Load `assets/command/command_template.md`.
4. Draft concise frontmatter with accurate `argument-hint` and minimal `allowed-tools`.
5. Add a required-input gate when arguments are mandatory.
6. Keep the command body executable and workflow-oriented, not reference-heavy.
7. For mode-based commands, keep the `.md` file as a thin router.
8. If visible prompts, dashboards, or result templates are needed, create a presentation asset from `assets/command/command_presentation_template.md`.
9. Validate before claiming the command is structurally valid:

```bash
python ../shared/scripts/validate_document.py <command-file.md> --type command
python ../shared/scripts/extract_structure.py <command-file.md>
```

## Example

```text
Request: create /doctor:memory with :auto and :confirm modes

Use this packet to:
- choose the namespace command path,
- define argument handling for mode suffixes,
- keep routing in the command file,
- move user-facing prompts and result templates into a presentation asset,
- validate the command through the shared doc-quality scripts.
```

## Parent Hub

`create-command` is a nested workflow packet of the `sk-doc` parent hub. The shared doc-quality backbone lives at `../shared`; the single advisor identity and mode registry live at the hub root, not inside this packet.
