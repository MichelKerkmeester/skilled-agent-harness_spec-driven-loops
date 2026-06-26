---
description: Temporal interaction design - purposeful animation, micro-interactions, transitions, AnimatePresence, and reduced motion. The sk-design motion mode.
argument-hint: "<design request>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:motion

Thin bridge into the `sk-design` parent skill's `motion` mode. The parent hub owns
routing across modes; this command pins `motion` directly.

## Execution

1. Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table, the
   shared references under `shared/`, and the family contract.
2. Read `.opencode/skills/sk-design/motion/SKILL.md` -- the `motion` mode contract --
   and load its `references/` and assets as the work requires.
3. Apply the `motion` mode to the request, following its workflow and quality gates.

If the request spans more than `motion`, defer to the hub: use the parent routing
table and load the matching mode(s) instead of forcing this one.

User request: $ARGUMENTS
