---
level: 2
status: implementing
created: 2026-02-17
---

# 012 — Create Commands Codex Compatibility

## Problem

Codex misinterprets agent routing metadata in create command `.md` and `.yaml` files as dispatch instructions, causing unintended agent invocations. Same root causes as spec `010` (spec_kit commands) but in a lighter form.

## Root Causes

1. `## Agent Routing` sections in `.md` files with `@agent` names in tables
2. `dispatch:` fields in YAML files with imperative `"Task tool -> @agent..."` strings
3. Weak `<!-- REFERENCE ONLY -->` HTML comment guards that Codex ignores

## Solution

Three-pronged approach (same strategy as spec 010, adapted for create commands):

- **Change A**: Remove `## Agent Routing` sections and `<!-- REFERENCE ONLY -->` guards from all 6 `.md` files
- **Change B**: Add `## CONSTRAINTS` section to all 6 `.md` files with explicit anti-dispatch rules
- **Change C**: Restructure YAML `agent_routing:` to `agent_availability:` — remove `dispatch:` and `agent:` fields, add `condition:` and `not_for:` fields

## Scope

- 6 `.md` command files in `.opencode/command/create/`
- 14 `.yaml` workflow files in `.opencode/command/create/assets/`
- 20 total `agent_routing:` occurrences across YAML files

## Verification

1. `grep -r "agent_routing:" .opencode/command/create/` returns 0 matches
2. `grep -r "agent_availability:" .opencode/command/create/assets/` returns 20 matches
3. `grep -r "dispatch:.*@" .opencode/command/create/assets/` returns 0 matches
4. `grep -r "## Agent Routing" .opencode/command/create/*.md` returns 0 matches
5. `grep -r "## CONSTRAINTS" .opencode/command/create/*.md` returns 6 matches
6. `grep -r "REFERENCE ONLY" .opencode/command/create/*.md` returns 0 matches
