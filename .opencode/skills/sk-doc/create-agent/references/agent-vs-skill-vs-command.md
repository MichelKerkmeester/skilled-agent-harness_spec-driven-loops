---
title: Agent vs Skill vs Command
description: Decide whether a request should become a runtime agent, a reusable skill, or a slash command before authoring, with signals for when an agent is the right component and when a lighter alternative wins.
trigger_phrases:
  - "agent vs skill vs command"
  - "should this be an agent"
  - "when to create an agent"
  - "component choice agent skill command"
  - "agent decision rule"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Agent vs Skill vs Command

Deep detail for the component-choice decision. `SKILL.md` states the rule inline; this file is the expanded signal set for the harder calls — when an agent, a skill, and a command each pull at the same request.

---

## 1. OVERVIEW

Choose the component type before authoring anything. An agent answers *who* should do the work, a skill answers *how* the work should be done, and a command answers *how a user should trigger* the workflow. Picking wrong produces either a bloated agent that should have been a skill, or a skill that quietly needs runtime authority it can never hold.

**Core Principle**: Create an agent only when the role needs authority and tool policy. Put reusable knowledge and templates in skills, not in agents.

---

## 2. COMPONENT COMPARISON

| Component | Primary Question | Use It When |
|---|---|---|
| Agent | Who should do this work? | A stable persona needs authority, permissions, and operating rules |
| Skill | How should the work be done? | Reusable knowledge, standards, templates, or workflows are needed |
| Command | How should a user trigger a workflow? | A slash command should gather inputs and launch a repeatable procedure |

**Practical rule**:
- create an **agent** for role and authority
- create a **skill** for reusable knowledge and references
- create a **command** for user-triggered workflow entry

**Common healthy pairing**: the three are not rivals. The agent provides the persona and boundaries, the skill provides the detailed domain knowledge, and the command provides the ergonomic entry point. A mature capability often ships all three.

---

## 3. SIGNALS FOR EACH ANSWER

**Strong signals that the answer is an agent**:
- the role needs explicit tool permissions
- the role needs behavioral constraints that should apply every time
- the role should be invokable by name as a stable persona
- the role needs orchestration authority, or must be explicitly denied orchestration authority
- the same execution posture will be reused across many tasks

**Use a lighter alternative when**:
- the request only needs reusable knowledge or workflow guidance — create or extend a skill
- the task can be handled by an existing agent plus a skill — reuse, do not duplicate
- the only goal is scaffolding or content generation without a new runtime role — a command or template fits

**Decision rule**:

```text
Need a named runtime persona with authority and tool policy?
  YES -> Create an agent
  NO  -> Use or create a skill, template, or command instead
```

---

## 4. RELATED RESOURCES

- [README.md](README.md) - reference route map for the create-agent packet
- [permission_design.md](permission_design.md) - once the answer is "agent", how to scope its frontmatter and permissions
- [common_pitfalls.md](common_pitfalls.md) - failure modes, including creating an agent for reusable knowledge alone
- [create-skill README](../../create-skill/references/README.md) - companion workflow for reusable knowledge bundles
- [command_template.md](../../create-command/assets/command/command_template.md) - companion scaffold for slash-command entry points
