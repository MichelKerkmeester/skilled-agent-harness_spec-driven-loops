---
title: Agent Authoring Checklist
description: Checklist for authoring OpenCode and Claude agent mirrors with clear authority boundaries, permissions, and dispatch contracts.
trigger_phrases:
  - "agent authoring checklist"
  - "opencode agent permissions"
  - "leaf vs orchestrator"
  - "runtime mirror parity"
importance_tier: normal
contextType: implementation
version: 1.0.0.14
---

# Agent Authoring Checklist

Checklist for authoring or modifying OpenCode and Claude agent mirrors with safe authority boundaries, least-authority permissions, dispatch contracts, and runtime-mirror parity.

## 1. OVERVIEW

### Purpose

This checklist makes agents safe to dispatch and keeps the two live runtime mirrors aligned. It focuses on authority boundaries, runtime-specific permission frontmatter, LEAF versus orchestrator behavior, and the files that must stay in parity.

### Usage

- Use this when authoring a new agent.
- Use this when modifying an existing agent's frontmatter, permissions, dispatch contract, or workflow authority.
- Use this when converting an informal role into a runtime-dispatchable agent.
- Use this when updating mirrored agent files across OpenCode and Claude.

---

## 2. PRE-CHECKS

- [ ] Read the mirrored `code` agent examples at `.opencode/agents/code.md` and `.claude/agents/code.md`.
- [ ] Read `sk-doc` source rules at `.opencode/skills/sk-doc/create-agent/references/README.md`.
- [ ] Read the mirror checker at `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`; it treats `.opencode/agents/` as canonical and `.claude/agents/` as the runtime mirror.
- [ ] Decide whether the agent is LEAF-only or an orchestrator before granting task/delegation authority.
- [ ] Confirm the dispatch contract: who may invoke the agent, what inputs it expects, and what outputs it returns.
- [ ] Set runtime permissions to the least authority that supports the role: OpenCode agent frontmatter uses `permission:`, while Claude mirrors use `tools:`.
- [ ] Do not use `allowed-tools:` in agent frontmatter; current agent frontmatter uses `permission:` in `.opencode/agents/` and `tools:` in `.claude/agents/`.
- [ ] Identify the repo-managed mirror set: `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/`. All three are live runtime mirrors — `.codex/agents/*.toml` mirrors the `.opencode/agents/` roster one-to-one, alongside `.codex/hooks.json` and `.codex/config.toml`.
- [ ] When adding or renaming an agent, mirror it across all three surfaces; `.codex/agents/` uses TOML (`[agents.<name>]` in `.codex/config.toml` pointing at `.codex/agents/<name>.toml`), not the OpenCode/Claude frontmatter form.

---

## 3. STEPS

1. Define the agent name, role, authority boundary, and runtime invocation contract.
2. Draft OpenCode frontmatter with `permission:` fields matching the role's least authority.
3. Draft the Claude mirror frontmatter with `tools:` for the equivalent runtime capability set.
4. Write the workflow as operational instructions, not a copied skill reference.
5. State LEAF constraints or orchestration permissions explicitly.
6. Add verification expectations and failure/escalation rules.
7. Keep `.opencode/agents/` and `.claude/agents/` in sync for shared behavior; retain only intentional frontmatter/runtime wording differences.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` against the owning spec folder when the agent change is part of a spec folder.
- [ ] grep verification for OpenCode frontmatter shape: `rg -n "^(name|description|mode|permission):" .opencode/agents/code.md`.
- [ ] grep verification for Claude frontmatter shape: `rg -n "^(name|description|tools):" .claude/agents/code.md`.
- [ ] grep verification that agent frontmatter is not using the command/skill field: `rg -n "^allowed-tools:" .opencode/agents .claude/agents` should return no agent matches.
- [ ] Mirror parity check: run `node .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` after editing agent mirrors.
- [ ] Verify dispatch references in commands or orchestrators point to the new agent name.

---

## 5. RELATED RESOURCES

- `.opencode/skills/sk-doc/create-agent/references/README.md` (source-of-truth for agent content rules)
- Mirror checker: `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`
- Mirrored example: `.opencode/agents/code.md` and `.claude/agents/code.md`
- Runtime directories: `.opencode/agents/` and `.claude/agents/`
- Verification recipes: `.opencode/skills/sk-code/code-opencode/assets/checklists/universal-checklist.md`
