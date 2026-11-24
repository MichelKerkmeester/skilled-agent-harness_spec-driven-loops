# mcp-browser-use Benchmark Sources

> mcp-browser-use · two-stage routing replay, second follow-up · 2026-11-24

This file says how the run in this folder was produced and where its limits are.

| Resource | Value |
|---|---|
| Target hub | `.skilled/skills/mcp-browser-use` |
| Spec folder | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/016-fix-second-follow-up-findings` |
| Requests | The 52 rows of the first follow-up run, plus MBU-B-02, MBU-B-03, MBU-B-04 and MBU-P-17 |
| Stage one | `.skilled/bin/skill-advisor.cjs advisor_recommend`, default threshold 0.8 |
| Stage two | `.skilled/bin/compiled-route.cjs`, the hub's compiled front door, with no runtime flag set |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Method

The replay script of the first follow-up run, with four rows added, sent each request once through each stage from the same checkout. The advisor ran from a rebuilt `dist`. The hub's activation manifest was re-minted with `compiled-route-manifest.cjs refresh` after `hub-router.json`, the hub router scoring and `SKILL.md` changed, and the front door reads that policy.

## Boundary

The run measures routing only. It does not run a browser.
