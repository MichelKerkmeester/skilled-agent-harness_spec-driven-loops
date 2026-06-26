---
description: Design QA and critique - accessibility, performance, responsive, theming, anti-slop detection, scoring, and production hardening. The sk-design audit mode.
argument-hint: "<design request>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:audit

Thin bridge into the `sk-design` parent skill's `audit` mode. The parent hub owns
routing across modes; this command pins `audit` directly.

## Execution

1. Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table, the
   shared references under `shared/`, and the family contract.
2. Read `.opencode/skills/sk-design/audit/SKILL.md` -- the `audit` mode contract --
   and load its `references/` and assets as the work requires.
3. Apply the `audit` mode to the request, following its workflow and quality gates.

If the request spans more than `audit`, defer to the hub: use the parent routing
table and load the matching mode(s) instead of forcing this one.

User request: $ARGUMENTS
