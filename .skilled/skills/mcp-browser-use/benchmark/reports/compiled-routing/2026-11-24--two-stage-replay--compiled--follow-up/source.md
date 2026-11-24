# mcp-browser-use Benchmark Sources

> mcp-browser-use · two-stage routing replay, follow-up · 2026-11-24

This file says how the run in this folder was produced and where its limits are.

| Resource | Value |
|---|---|
| Target hub | `.skilled/skills/mcp-browser-use` |
| Spec folder | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings` |
| Requests | The 49 rows of the first 2026-11-24 run, plus MBU-N-19, MBU-N-20 and MBU-B-01 |
| Stage one | `.skilled/bin/skill-advisor.cjs advisor_recommend`, default threshold 0.8 |
| Stage two | `.skilled/bin/compiled-route.cjs`, the hub's compiled front door, with no runtime flag set |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Method

The replay script of the first 2026-11-24 run, with three rows added, sent each request once through each stage from the same checkout. The advisor ran from a rebuilt `dist`. The hub's activation manifest was re-minted with `compiled-route-manifest.cjs refresh` after `hub-router.json` and `SKILL.md` changed, and the front door reads that policy.

## Boundary

The run measures routing only. It does not run a browser.
