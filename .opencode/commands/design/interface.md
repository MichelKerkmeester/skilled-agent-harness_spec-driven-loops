---
description: Distinctive, intentional UI design - palette, typography, layout, and motion choices when building or reshaping an interface. The sk-design interface mode.
argument-hint: "<design request>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:interface

Thin bridge into the `sk-design` parent skill's `interface` mode. The parent hub owns
routing across modes; this command pins `interface` directly.

## Execution

1. Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table, the
   shared references under `shared/`, and the family contract.
2. Read `.opencode/skills/sk-design/interface/SKILL.md` -- the `interface` mode contract --
   and load its `references/` and assets as the work requires.
3. Apply the `interface` mode to the request, following its workflow and quality gates.

If the request spans more than `interface`, defer to the hub: use the parent routing
table and load the matching mode(s) instead of forcing this one.

User request: $ARGUMENTS
