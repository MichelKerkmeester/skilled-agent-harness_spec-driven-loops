# Plan: Make spec_kit Commands Codex-Compatible

**Level:** 2

## Execution Order

1. `complete.md` + 2 YAML files (highest complexity, most agents)
2. `implement.md` + 2 YAML files
3. `debug.md` + 2 YAML files (most sub-agent delegation content)
4. `handover.md` + 1 YAML file
5. `plan.md` + 2 YAML files
6. `research.md` + 2 YAML files
7. `resume.md` (CONSTRAINTS only, no YAML changes)

## Per-File Changes

### .md Files (Change A + B)
- Strip: AGENT ROUTING sections, dispatch templates, SUB-AGENT DELEGATION sections
- Add: CONSTRAINTS section after Execution Protocol
- Keep: Setup Phase, YAML Pointer, Output Format, Quality Gates, non-agent references

### YAML Files (Change C)
- Rename `agent_routing` to `agent_availability`
- Remove `dispatch:` fields
- Add `condition:` and `not_for:` fields
- Change comments from "REFERENCE ONLY" to "AGENT AVAILABILITY (conditional)"

## Technical Approach

Both `.claude/commands/spec_kit/` and `.opencode/command/spec_kit/` point to the same files via symlink, so only one set of changes is needed.
