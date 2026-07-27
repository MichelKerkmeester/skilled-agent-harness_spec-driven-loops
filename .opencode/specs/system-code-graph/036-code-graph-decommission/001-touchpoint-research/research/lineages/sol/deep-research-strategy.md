# Deep Research Strategy

## Topic

Exhaustive touchpoint inventory for fully decommissioning the `system-code-graph` skill and the `mk_code_index` MCP server.

## Key Questions

- [ ] Which live configuration and registration surfaces expose the skill, MCP server, or tool names?
- [ ] Which executable code paths import, invoke, shell out to, or depend on code-graph runtime behavior?
- [ ] Which hooks, plugins, CI jobs, agent definitions, permissions, and tool grants depend on code graph availability?
- [ ] Which live documentation and doctrine claims must change, and which historical records must remain untouched?
- [ ] What removal order, compatibility window, validation gates, rollback plan, and residual-risk checks are required?

## Non-Goals

- Implementing the decommission.
- Editing `.opencode/specs/**`, changelogs, benchmark reports, or any researched source.
- Treating archival historical references as live migration targets.
- Following symlink aliases as distinct physical touchpoints.

## Stop Conditions

- Run all ten configured iterations.
- Cover each requested touchpoint category with `rg --no-ignore`.
- Separate live action items from archival inventory and deduplicate known symlink aliases.
- Produce ordering constraints and rollback risks backed by file-and-line evidence.

## Answered Questions

- Live configuration, runtime, dependency, hook, CI, agent, command, and current documentation surfaces are classified.
- The retiring structural MCP graph is separated from the deep-loop coverage graph.
- Historical records are a distinct immutable inventory class.

## What Worked

- `rg --hidden --no-ignore` with explicit exclusion of Git internals, worktrees, dependencies, scratch space, logs, and the active lineage recovered ignored control files while keeping the sweep bounded.
- Exact identity searches plus narrow source reads separated the startup chain from generic documentation noise.
- Ownership verification separated the retiring structural MCP graph from the independent deep-loop coverage graph.
- Mixed-responsibility hook and CI reads identified surgical removals that preserve memory, autosync, advisor, and quality behavior.
- Runtime mirror identity checks distinguished canonical edits, generated regular-file projections, and symlink aliases.

## What Failed

- `rg --no-ignore` without `--hidden` returned only four visible matches and omitted the hidden runtime surfaces.
- Hook sweeps that did not exclude generic benchmark-report directories pulled large captured transcripts.

## Exhausted Approaches

None yet.

## Ruled-Out Directions

- Counting `CLAUDE.md` separately from `AGENTS.md`.
- Counting `.mcp.json` and `.cursor/mcp.json` separately from `.claude/mcp.json`.
- Treating broad generic phrase matches as an actionable mutation list without role classification.
- Deleting only the skill directory or only MCP command lines.
- Treating ignored `.env.local` as a tracked migration edit.
- Removing all “code graph” code without distinguishing the deep-loop coverage graph.
- One-sided source/dist edits.
- Deleting shared hook, installer, or CI files wholesale.
- Updating repository Codex hooks without refreshing the installed user-level copy.
- Editing only one runtime’s agent definitions.
- Leaving compiled command contracts stale.

## Carried-Forward Open Questions

All primary questions and the adversarial residual pass are answered.

## Next Focus

Terminal synthesis complete. No next research focus.

## Known Context

- The code graph startup context is absent/empty, so direct filesystem evidence is authoritative for this lineage.
- The target spec has no `resource-map.md`; coverage must be built from the repository sweep.
- Required aliases: `CLAUDE.md` resolves to `AGENTS.md`; `.mcp.json` and `.cursor/mcp.json` resolve to `.claude/mcp.json`.
- `.opencode/specs/**`, changelogs, and benchmark reports are archival inventory only.

## Research Boundaries

- Maximum iterations: 10.
- Convergence threshold: 0.05, telemetry only because stop policy is `max-iterations`.
- Writes are restricted to this lineage directory.
