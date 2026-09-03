---
title: "Iteration 001 — registrations, transport, configuration, and baseline counts"
trigger_phrases: []
---
# Iteration 001 — registrations, transport, configuration, and baseline counts

## Route proof

- Mode: research
- Target agent: deep-research
- Resolved route: Resolved route: mode=research target_agent=deep-research
- Agent definition loaded: true
- Executor: cli-codex model=gpt-5.6-luna reasoning=max service-tier=fast

## Focus

Read the parent `spec.md` and `goal.md` first (already seeded in the strategy context). Inventory the subsystem implementation, complete MCP tool registration set, launchers and shims, plugin/bridge, hooks, runtime/MCP configuration, package scripts, environment flags, and transport/embedding surfaces. Search all non-archived files, exclude `z_archive`, and collapse `.opencode/skills/system-spec-kit/mcp-server` to one final inventory entry while preserving line evidence. Establish exact baseline counts for tools, flags, files, lines, unique external consumer files, and surface types. Every finding must carry `[SOURCE: path:line]` evidence and assign phase 002 (rewire), phase 003 (delete), or both; classify live instruction versus historical narrative and flag old-contract breakage risk.

## Required outputs

1. `iterations/iteration-001.md` with classified findings and cited evidence.
2. `deltas/iter-001.jsonl` containing a canonical `type=iteration` row.
3. Gateway append through `append-mode-event.cjs`; never directly write the canonical state log.

## Constraints

Do not edit source or packet specs. Do not run `generate-context.js`, `validate.sh`, memory save, or git writes. All outputs stay under this lineage.
