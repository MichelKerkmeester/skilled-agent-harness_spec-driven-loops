---
description: Static visual-system design - color, typography, layout, spacing, hierarchy, responsive adaptation, themes, and design tokens. The sk-design foundations mode.
argument-hint: "<design request>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:foundations

Thin bridge into the `sk-design` parent skill's `foundations` mode. The parent hub owns
routing across modes; this command pins `foundations` directly.

## Execution

1. Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table, the
   shared references under `shared/`, and the family contract.
2. Read `.opencode/skills/sk-design/foundations/SKILL.md` -- the `foundations` mode contract --
   and load its `references/` and assets as the work requires.
3. Apply the `foundations` mode to the request, following its workflow and quality gates.

If the request spans more than `foundations`, defer to the hub: use the parent routing
table and load the matching mode(s) instead of forcing this one.

User request: $ARGUMENTS
