---
title: Agent Authoring Checklist
description: Checklist for authoring OpenCode agents with clear authority boundaries, permissions, dispatch contracts, and runtime mirrors.
trigger_phrases:
  - "agent authoring checklist"
  - "opencode agent permissions"
  - "leaf vs orchestrator"
  - "runtime mirror parity"
importance_tier: normal
contextType: implementation
---

# Agent Authoring Checklist

Checklist for authoring or modifying OpenCode `@<name>` agents with safe authority boundaries, least-authority permissions, dispatch contracts, and runtime-mirror parity.

## 1. OVERVIEW

### Purpose

This checklist makes new `@<name>` agents safe to dispatch and easy to mirror across runtimes. It focuses on authority boundaries, tool permissions, LEAF versus orchestrator behavior, and the runtime files that must stay in parity.

### Usage

- Use this when authoring a new `@<name>` agent.
- Use this when modifying an existing agent's frontmatter, permissions, dispatch contract, or workflow authority.
- Use this when converting an informal role into a runtime-dispatchable agent.
- Use this when updating mirrored agent files across OpenCode, Claude, and Codex.

---

## 2. PRE-CHECKS

- [ ] Read canonical agent examples at `.opencode/agents/code.md`, `.opencode/agents/review.md`, and `.opencode/agents/orchestrate.md`.
- [ ] Read `sk-doc` source rules at `.opencode/skills/sk-doc/references/specific/agent_creation.md`.
- [ ] Decide whether the agent is LEAF-only or an orchestrator before granting task/delegation authority.
- [ ] Confirm the dispatch contract: who may invoke the agent, what inputs it expects, and what outputs it returns.
- [ ] Set `allowed-tools` or runtime permission fields to the least authority that supports the role.
- [ ] Identify the repo-managed mirror set: `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/`.

---

## 3. STEPS

1. Define the agent name, role, authority boundary, and runtime invocation contract.
2. Draft frontmatter that matches the filename and limits tools to the role.
3. Write the workflow as operational instructions, not a copied skill reference.
4. State LEAF constraints or orchestration permissions explicitly.
5. Add verification expectations and failure/escalation rules.
6. Mirror the file across all required runtime agent directories when the role is cross-runtime.
7. Compare mirrored files for intentional differences only.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <path> --strict` when the agent change is part of a spec folder.
- [ ] grep verification: `rg -n "name:|description:|allowed-tools:|permission:|LEAF|orchestr" .opencode/agents/<name>.md`.
- [ ] Cross-runtime mirror parity check: compare `.opencode/agents/<name>.md`, `.claude/agents/<name>.md`, and `.codex/agents/<name>.md` where the agent is runtime-wide.
- [ ] Verify dispatch references in commands or orchestrators point to the new agent name.

---

## 5. RELATED RESOURCES

- sk-doc references/specific/agent_creation.md (source-of-truth for agent content rules)
- Prior examples: `.opencode/agents/code.md`, `.opencode/agents/review.md`, `.opencode/agents/orchestrate.md`
- Verification recipes: `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`
