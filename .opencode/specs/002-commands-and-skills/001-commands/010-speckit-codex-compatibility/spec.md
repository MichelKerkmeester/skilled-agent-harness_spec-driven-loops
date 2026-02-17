# Spec: Make spec_kit Commands Codex-Compatible

**Level:** 2
**Status:** In Progress
**Created:** 2026-02-17

## Problem

Codex (OpenAI's coding agent) misinterprets `.claude/commands/spec_kit/` command files in three ways:
1. Dispatches `@review` to "review" the workflow prompt itself instead of only at the designated step
2. Dispatches `@handover` prematurely instead of waiting for user opt-in at the final step
3. Dispatches `@debug` unnecessarily instead of only when `failure_count >= 3`

## Root Causes

1. Agent routing tables in .md files read as action items by Codex
2. Dispatch templates look like executable prompts
3. `<!-- REFERENCE ONLY -->` guards are too weak
4. Two-layer architecture (md + YAML) creates double-exposure of agent references
5. YAML `agent_routing` uses dispatch-like language

## Approach

Three combined changes across all 7 commands:

### Change A: Strip Agent Content from .md Files
Remove `AGENT ROUTING` sections, dispatch templates, blocking/fallback subsections, and `SUB-AGENT DELEGATION` sections from all .md command files. YAML files already contain this information.

### Change B: Add Explicit Anti-Pattern Guards
Add `CONSTRAINTS` section to each .md file with explicit DO NOT dispatch instructions.

### Change C: Restructure YAML `agent_routing` Sections
Rename `agent_routing` to `agent_availability` with conditional, non-imperative language. Remove `dispatch:` fields, add `condition:` and `not_for:` fields.

## Scope

- 7 .md command files (complete, implement, debug, handover, plan, research, resume)
- 11 YAML workflow files (all except 2 resume YAMLs which have no agent_routing)
- `.claude/commands/spec_kit/` is a symlink to `.opencode/command/spec_kit/` so changes apply to both locations

## Acceptance Criteria

- [P0] All agent routing sections removed from .md files
- [P0] CONSTRAINTS section added to all 7 .md files
- [P0] All YAML `agent_routing` renamed to `agent_availability` with non-imperative language
- [P0] `dispatch:` fields removed from all YAML files
- [P1] Commands still work correctly with Claude models
- [P1] Codex no longer prematurely dispatches agents
