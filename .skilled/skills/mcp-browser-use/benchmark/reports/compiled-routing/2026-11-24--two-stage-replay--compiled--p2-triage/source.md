# mcp-browser-use Benchmark Sources

> mcp-browser-use · two-stage routing replay, P2 triage · 2026-11-24

This file says how the run in this folder was produced and where its limits are.

| Resource | Value |
|---|---|
| Target hub | `.skilled/skills/mcp-browser-use` |
| Spec folder | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/018-triage-gen4-p2-findings` |
| Requests | The 56 rows of the second follow-up run |
| Stage one | `.skilled/bin/skill-advisor.cjs advisor_recommend`, default threshold 0.8 |
| Stage two | `.skilled/bin/compiled-route.cjs`, the hub's compiled front door, with no runtime flag set |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Method

The replay script of the second follow-up run sent each request once through each stage from the same checkout. The advisor ran from a `dist` rebuilt from the committed source. The hub's activation manifest was re-minted after the version bump, and the front door reads that policy.

## Boundary

The run measures routing only. It does not run a browser.
