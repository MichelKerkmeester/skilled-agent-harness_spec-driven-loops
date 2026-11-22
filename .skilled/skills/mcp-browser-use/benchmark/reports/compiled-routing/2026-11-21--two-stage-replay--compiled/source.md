# mcp-browser-use Benchmark Sources

> mcp-browser-use · two-stage routing replay · 2026-11-21

This file says how the run in this folder was produced and where its limits are.

| Resource | Value |
|---|---|
| Target hub | `.skilled/skills/mcp-browser-use` |
| Requests | The three mode requests and three tie-break requests from the hub's routing plan, unchanged |
| Stage one | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, default threshold |
| Stage two | `.skilled/bin/compiled-route.cjs`, the hub's compiled front door, with no runtime flag set |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Method

The operator chose a two-stage replay for this hub over `/create:benchmark`, because that command registers only the `mcp_promotion` family. Each request ran once through each stage from the same checkout. The replay script read the advisor's first row and the front door's first target, and compared them with the expected mode.

## Boundary

The run measures routing only. It does not run a browser. The live runs of each mode are in the mode playbooks. A request that should defer, such as "browser automation for this site", is covered by the hub-routing playbook, not by this run.
