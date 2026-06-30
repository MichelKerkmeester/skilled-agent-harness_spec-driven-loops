---
title: Command Authoring Checklist
description: Checklist for authoring slash commands with execution-path YAML, runtime mirrors, and verification gates.
trigger_phrases:
  - "command authoring checklist"
  - "slash command authoring"
  - "execution path yaml"
  - "command runtime mirrors"
importance_tier: normal
contextType: implementation
version: 3.5.0.9
---

# Command Authoring Checklist

Checklist for authoring or modifying `/<command>` slash commands with consistent command markdown, execution-path YAML, runtime mirrors, and verification gates.

## 1. OVERVIEW

### Purpose

This checklist keeps `/<command>` workflows consistent across command markdown, execution-path YAML, and runtime mirrors. It is for commands that users invoke directly, especially commands that dispatch agents, write spec folders, or route through create/spec-kit workflows.

### Usage

- Use this when authoring a new slash command under `.opencode/commands/`.
- Use this when modifying command frontmatter, execution paths, or command-owned assets.
- Use this when adding `:auto` or `:confirm` behavior through YAML execution files.
- Use this when mirroring commands into Claude or OpenCode runtime formats.

---

## 2. PRE-CHECKS

- [ ] Read canonical command examples at `.opencode/commands/speckit/complete.md` and `.opencode/commands/create/sk-skill.md`.
- [ ] Verify whether the command needs execution-path files such as `assets/<command>_auto.yaml` and `assets/<command>_confirm.yaml`.
- [ ] Confirm command scope, required user inputs, dispatch targets, and file-write authority.
- [ ] Check mirror destinations: `.claude/commands/` and `.opencode/prompts/`.
- [ ] Confirm the command does not bypass skill-owned workflows for deep research, deep review, memory save, or spec folder writes.

---

## 3. STEPS

1. Define the command trigger, supported suffixes, and expected arguments.
2. Author the OpenCode command markdown under `.opencode/commands/<group>/<name>.md`.
3. Add or update execution-path YAML under the command asset directory when the workflow has auto/confirm routes.
4. Reference the owning skill and any agent dispatch contracts by exact path or command name.
5. Mirror the command into `.claude/commands/` and `.opencode/prompts/` when cross-runtime availability is required.
6. Validate links, command examples, and execution-path references.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <path> --strict` when the command change is part of a spec folder.
- [ ] grep verification: `rg -n "assets/.+_(auto|confirm)\\.yaml|dispatch|allowed|validate" .opencode/commands/<group>/<name>.md .opencode/commands/<group>/assets`.
- [ ] Cross-runtime mirror parity check: compare `.opencode/commands/`, `.claude/commands/`, and `.opencode/prompts/` entries for the same command.

---

## 5. RELATED RESOURCES

- sk-doc assets/command/command_template.md (source-of-truth for command document shape)
- Prior examples: `.opencode/commands/speckit/complete.md`, `.opencode/commands/create/sk-skill.md`
- Verification recipes: `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`
