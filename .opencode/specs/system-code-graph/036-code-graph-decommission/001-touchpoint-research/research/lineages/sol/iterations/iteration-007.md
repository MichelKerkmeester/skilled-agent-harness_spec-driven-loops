# Iteration 007 — Archival Inventory and No-Edit Boundary

## Focus

Quantify historical references and prove they are inventory evidence, not migration targets.

## Method

- Re-ran exact-identity and generic-phrase sweeps with `rg --hidden --no-ignore`.
- Classified paths before interpreting content.
- Verified the three known symlink aliases at the filesystem level.

## Findings

1. The exact retiring identities occur in 5,155 files under `.opencode/specs/**`. The largest historical families are `system-speckit`, `system-code-graph`, `system-deep-loop`, `sk-doc`, `z-future`/`z_future`, `system-skill-advisor`, `sk-design`, and `cli-external-orchestration`.
2. The broader Code Graph phrase sweep finds 9,074 spec files. The delta from exact-token results consists largely of historical design language and confirms that generic phrase replacement would be dangerously over-broad.
3. Outside specs, exact-token classification found 23 changelog files and 10 benchmark-named files. The broader phrase sweep found 35 changelog and 36 benchmark files. Both classes remain unchanged even when they document retired behavior.
4. Historical benchmark transcripts can contain copied live paths, tool grants, configuration blocks, or command output. Content shape does not make them current authority; path class controls the no-edit decision.
5. The decommission’s own parent packet and sibling research remain archival once written. Synthesis may cite them but must not turn this lineage into a proposal to rewrite `.opencode/specs/**`.
6. `CLAUDE.md -> AGENTS.md`; `.mcp.json -> .claude/mcp.json`; `.cursor/mcp.json -> ../.mcp.json -> .claude/mcp.json`. These aliases are inventoried once by physical authority, avoiding duplicate edits and misleading touchpoint counts.
7. The retiring `.opencode/skills/system-code-graph/**` tree is live implementation despite containing its own README, changelog, benchmarks, tests, and reports. The whole owned tree is a deletion unit; the global “do not edit changelogs/benchmarks” rule means delete it as part of removing the skill, not selectively rewrite historical content within it.

## Immutable Archive Rule

Do not edit or delete historical records outside the retiring skill’s owned deletion unit:

- `.opencode/specs/**`
- changelog files
- benchmark reports and captured transcripts

Inventory residual hits in those classes after decommission as expected, not failures.

## Telemetry

- Findings: 7
- New-information ratio: 0.62
- Convergence: above threshold; telemetry only under `max-iterations`
- Next angle: derive safe ordering, compatibility constraints, rollback points, and old-contract consumers
