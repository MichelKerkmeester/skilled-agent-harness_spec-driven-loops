---
title: Agent Creation Reference Map
description: Route map over the create-agent overflow references - component choice, permission design, and common pitfalls. The primary creation workflow lives in SKILL.md; these files hold only the depth that would bloat it.
trigger_phrases:
  - "agent creation reference map"
  - "create agent references"
  - "agent creation overflow"
  - "agent authoring reference index"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Agent Creation Reference Map

Route map for the `create-agent` overflow references. The authoritative, numbered creation workflow lives in [`../SKILL.md`](../SKILL.md); open a file below only when you need depth the primary contract deliberately leaves out.

---

## 1. OVERVIEW

`SKILL.md` is the primary contract: when to use, component choice, output package, canonical frontmatter, required body shape, the ordered creation workflow, and the validation gate. It is complete on its own for authoring an agent.

These reference files hold single-concern depth that would bloat that contract — the harder component-choice calls, the reasoning behind permission scoping, and the catalogue of failure modes. Load the one the current task needs; do not read them front to back.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **Which component to build** — agent vs skill vs command comparison, signals that the answer is an agent, lighter-alternative signals, decision rule | [agent-vs-skill-vs-command.md](agent-vs-skill-vs-command.md) | The request could plausibly be a skill or command, or mixes responsibilities and needs a clear owner |
| **Frontmatter and permission depth** — `mode` selection, least-authority permission design rules, the deprecated `tools:` contract to migrate away from | [permission_design.md](permission_design.md) | Scoping an agent's `permission:` object, choosing `mode`, or justifying `task: allow` |
| **What goes wrong** — seven recurring defects with why-it-breaks and the correct fix, plus runtime-placement integrity | [common_pitfalls.md](common_pitfalls.md) | Reviewing a draft agent, or an agent fails validation, over-permits, or bloats |

---

## 3. RELATED RESOURCES

### Create-Agent Packet
- [SKILL.md](../SKILL.md) - authoritative packet contract and the complete creation workflow
- [agent_template.md](../assets/agent_template.md) - canonical scaffold: frontmatter shape, boundaries, workflow, verification, anti-patterns
- `.opencode/commands/create/agent.md` - preferred command-driven creation workflow for `/create:agent`

### Sibling sk-doc Packets
- [create-skill README](../../create-skill/references/README.md) - companion workflow for reusable knowledge bundles
- [command_template.md](../../create-command/assets/command/command_template.md) - companion scaffold for slash-command entry points

### Shared Reference Files
- [core_standards.md](../../shared/references/global/core_standards.md) - document type rules and structural requirements
- [validation.md](../../shared/references/global/validation.md) - quality scoring and validation workflows
- [quick_reference.md](../../shared/references/global/quick_reference.md) - condensed commands and file locations
- [workflows.md](../../create-quality-control/references/workflows.md) - execution-mode reference
