---
title: Command Authoring Checklist
description: Checklist for authoring slash commands with contract-renderer or YAML-router architecture, symlink-aware runtime parity, and verification gates.
trigger_phrases:
  - "command authoring checklist"
  - "slash command authoring"
  - "execution path yaml"
  - "command runtime mirrors"
importance_tier: normal
contextType: implementation
version: 1.0.0.16
---

# Command Authoring Checklist

Checklist for authoring or modifying slash commands with the correct command architecture, real frontmatter fields, symlink-aware runtime parity, and verification gates.

## 1. OVERVIEW

### Purpose

This checklist keeps user-invoked commands consistent with the two live command architectures: contract-renderer commands and YAML-router commands. It is for commands that dispatch agents, write spec folders, route through create/spec-kit workflows, or render deep-loop contracts.

### Usage

- Use this when authoring a new slash command under `.opencode/commands/`.
- Use this when modifying command frontmatter, execution paths, or command-owned assets.
- Use this when adding `:auto` or `:confirm` behavior through YAML execution files.
- Use this when changing command availability across OpenCode and Claude runtime paths.

---

## 2. PRE-CHECKS

- [ ] Read a YAML-router command such as `.opencode/commands/create/skill.md` or `.opencode/commands/speckit/complete.md`.
- [ ] Read a contract-renderer command such as `.opencode/commands/deep/research.md`, which delegates to `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs`.
- [ ] Confirm command frontmatter uses the live fields `argument-hint` and `allowed-tools` when the command needs arguments or tool permissions.
- [ ] Confirm whether `:auto` needs PRE-BOUND SETUP ANSWERS support in `argument-hint` and the presentation or compiled contract.
- [ ] For YAML-router commands, verify real assets such as `.opencode/commands/create/assets/create_skill_auto.yaml`, `.opencode/commands/create/assets/create_skill_confirm.yaml`, and `.opencode/commands/create/assets/create_skill_presentation.txt`.
- [ ] For contract-renderer commands, verify the rendered contract source such as `.opencode/commands/deep/assets/compiled/deep_research.contract.md` and workflow assets such as `.opencode/commands/deep/assets/deep_research_auto.yaml`.
- [ ] Confirm command scope, required user inputs, dispatch targets, and file-write authority.
- [ ] Check command runtime parity with `ls -la .claude/commands`: `.claude/commands` is a symlink to `../.opencode/commands`, so command parity is automatic through the repo-level symlink.
- [ ] Do not mirror commands into `.opencode/prompts/`; that path is not present in this workspace.
- [ ] Confirm the command does not bypass skill-owned workflows for deep research, deep review, memory save, or spec folder writes.

---

## 3. STEPS

1. Define the command trigger, supported suffixes, and expected arguments.
2. Choose the architecture.
   - Contract-renderer: the command markdown is a small wrapper that invokes `render-command-contract.cjs` and lets the compiled contract own setup, routing, and workflow text.
   - YAML-router: the command markdown owns mode selection and presentation-contract loading, then executes one workflow YAML asset.
3. Author command frontmatter with `description`, `argument-hint`, and `allowed-tools` when the command needs them.
4. For YAML-router commands, add or update presentation and workflow assets under the command asset directory.
5. For contract-renderer commands, keep the wrapper minimal and update the rendered contract source or deep-loop runtime assets instead of duplicating behavior in the wrapper.
6. Reference the owning skill and any agent dispatch contracts by exact path or command name.
7. Rely on the `.claude/commands` symlink for Claude parity; do not add manual command mirrors or `.opencode/prompts` entries.
8. Validate links, command examples, contract-renderer references, and YAML workflow references.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` against the owning spec folder when the command change is part of a spec folder.
- [ ] grep verification for command frontmatter: `rg -n "^(description|argument-hint|allowed-tools):" .opencode/commands/create/skill.md .opencode/commands/speckit/complete.md .opencode/commands/deep/research.md`.
- [ ] grep verification for YAML-router assets: `rg -n "create_skill_(auto|confirm)\\.yaml|speckit_complete_(auto|confirm)\\.yaml|presentation" .opencode/commands/create/skill.md .opencode/commands/speckit/complete.md`.
- [ ] grep verification for contract-renderer commands: `rg -n "render-command-contract\\.cjs|deep/research" .opencode/commands/deep/research.md .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs`.
- [ ] Symlink parity check: `ls -la .claude/commands` must show `../.opencode/commands`; `ls -la .opencode/prompts` should fail because that path is absent.

---

## 5. RELATED RESOURCES

- YAML-router examples: `.opencode/commands/create/skill.md`, `.opencode/commands/speckit/complete.md`
- Contract-renderer example: `.opencode/commands/deep/research.md`
- Renderer: `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs`
- Command parity path: `.claude/commands` symlink to `../.opencode/commands`
- Verification recipes: `.opencode/skills/sk-code/code-opencode/assets/checklists/universal_checklist.md`
