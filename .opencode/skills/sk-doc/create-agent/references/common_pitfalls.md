---
title: Common Agent-Creation Pitfalls
description: The recurring mistakes that break agent files - wrong component choice, wrong runtime directory, filename and name drift, over-permissive permissions, leaked orchestration authority, bloated bodies, and deprecated frontmatter - each with why it breaks and the correct fix.
trigger_phrases:
  - "agent creation pitfalls"
  - "agent wrong runtime directory"
  - "over-permissive agent permissions"
  - "agent filename name mismatch"
  - "agent common mistakes"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Common Agent-Creation Pitfalls

The mistakes that most often make an agent file fail to resolve, exceed its contract, or bloat over time. Each pairs the reason it breaks with the correct fix. `SKILL.md` § RULES states these as NEVER lines; this file explains the *why* and the remedy.

---

## 1. OVERVIEW

Agent files fail in a small, predictable set of ways: the component should not have been an agent at all, the file lands in the wrong runtime directory, identity fields drift apart, permissions over-grant, or the body absorbs guidance that belongs in a skill. Catch these before validation rather than after.

**Core Principle**: Most agent defects are authority and placement defects — scope and location first, prose second.

---

## 2. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Creating an agent for reusable knowledge only | Authority and persona are unnecessary overhead | Create or extend a skill instead |
| Using the wrong runtime agent directory | The runtime will not resolve the file as intended | Place the file under the active runtime path (`.opencode/agents/` or `.claude/agents/`) |
| Mismatching filename and `name` | Invocation and identity drift apart | Keep the filename stem and `name` identical |
| Over-permissive `permission` values | The role can do more than its contract allows | Reduce permissions to the least authority needed |
| Giving `task: allow` to a non-orchestrator | Delegation authority leaks into a leaf role | Deny `task` unless orchestration is intentional |
| Copying skill reference content into the agent body | The agent becomes bloated and hard to maintain | Keep deep guidance in skills and link to them |
| Using deprecated frontmatter conventions | The file drifts from current runtime expectations | Use the unified `permission:` contract |

**Placement integrity**: do not create the file in one runtime directory and then document it as if it belongs to another. The runtime path is part of the contract, not a cosmetic detail.

---

## 3. RELATED RESOURCES

- [README.md](README.md) - reference route map for the create-agent packet
- [agent-vs-skill-vs-command.md](agent-vs-skill-vs-command.md) - avoids the first mistake by choosing the component type up front
- [permission_design.md](permission_design.md) - avoids the permission and `task` mistakes
- [validation.md](../../shared/references/validation.md) - the validation pipeline that catches structural defects
