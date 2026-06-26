---
description: Extract a live website's real CSS into a v3 Style Reference DESIGN.md via the extract-write-validate pipeline. The sk-design md-generator mode.
argument-hint: "<design request>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:md-generator

Thin bridge into the `sk-design` parent skill's `md-generator` mode. The parent hub owns
routing across modes; this command pins `md-generator` directly.

## Execution

1. Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table, the
   shared references under `shared/`, and the family contract.
2. Read `.opencode/skills/sk-design/md-generator/SKILL.md` -- the `md-generator` mode contract --
   and load its `references/` and assets as the work requires.
3. Apply the `md-generator` mode to the request, following its workflow and quality gates.

If the request spans more than `md-generator`, defer to the hub: use the parent routing
table and load the matching mode(s) instead of forcing this one.

User request: $ARGUMENTS
