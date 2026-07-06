---
title: Agent Frontmatter and Permission Design
description: Deep guidance for agent mode selection and least-authority permission design using the unified permission object, plus the deprecated standalone tools contract to avoid.
trigger_phrases:
  - "agent permission design"
  - "agent frontmatter permission object"
  - "agent mode subagent"
  - "least authority permission"
  - "deprecated tools frontmatter agent"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Agent Frontmatter and Permission Design

Depth for the frontmatter block. `SKILL.md` shows the canonical YAML and the core frontmatter rules inline; this file explains the *design reasoning* — how to pick `mode`, how to scope each `permission` value to the least authority the role needs, and why the old standalone `tools:` object is no longer canonical.

---

## 1. OVERVIEW

Frontmatter is the enforceable part of an agent. Prose describes intent; the `permission:` object decides what the runtime will actually let the agent do. Over-granting here is the most common way an agent quietly exceeds its contract, so permission choices should be justified by the role, not by convenience.

**Core Principle**: Default to the least authority that still lets the role do its job, then justify every `allow` against the role description.

---

## 2. MODE SELECTION

- `mode` must be one of `subagent`, `agent`, or `all`.
- Use `subagent` for specialists dispatched by an orchestrator — the common case.
- `mode` must match how the runtime actually invokes the persona; do not label a dispatched specialist as a top-level `agent`.
- `temperature` should reflect determinism needs; `0.1` suits deterministic, rule-following roles.

---

## 3. PERMISSION DESIGN RULES

- default to the least authority that still enables the job
- set `task: allow` only for agents whose explicit authority is orchestration; a LEAF role must keep `task: deny`
- deny high-risk tools (`webfetch`, `chrome_devtools`, `patch`, `external_directory`) unless the role clearly needs them
- keep permission choices aligned with the role description and workflow — if the prose never uses a tool, the permission should not allow it
- use only `allow`, `deny`, or `ask`; `ask` is the middle ground for capabilities a role occasionally needs under supervision

The check to run against a draft: for every `allow`, point to the sentence in the body that requires it. Any `allow` you cannot justify becomes `deny`.

---

## 4. CURRENT-CONTRACT REMINDER

Do not treat the old standalone `tools:` object as canonical. The unified `permission:` object is the current contract because it expresses `allow` / `deny` / `ask` per capability in one place, which the runtime enforces directly. A file that still leads with a `tools:` list has drifted from current runtime expectations and should be migrated to `permission:`.

---

## 5. RELATED RESOURCES

- [README.md](README.md) - reference route map for the create-agent packet
- [agent-vs-skill-vs-command.md](agent-vs-skill-vs-command.md) - decide the component type before scoping permissions
- [common_pitfalls.md](common_pitfalls.md) - over-permissive values and other frontmatter failure modes
- [agent_template.md](../assets/agent_template.md) - canonical scaffold with the frontmatter shape in place
- `.opencode/commands/create/assets/create_agent_auto.yaml` - machine-executed permission-emitting path for `/create:agent`
- `.opencode/commands/create/assets/create_agent_confirm.yaml` - confirm-mode execution guide for the same command
