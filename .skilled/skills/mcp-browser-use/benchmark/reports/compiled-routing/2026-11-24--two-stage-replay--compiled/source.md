# mcp-browser-use Benchmark Sources

> mcp-browser-use · two-stage routing replay · 2026-11-24

This file says how the run in this folder was produced and where its limits are.

| Resource | Value |
|---|---|
| Target hub | `.skilled/skills/mcp-browser-use` |
| Spec folder | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings` |
| Requests | The six requests of the 2026-11-21 run, the out-of-domain prompts from the hub's routing phase and its review, paraphrases of each tie-break kind, the seven hub playbook prompts, one out-of-domain prompt per new alias and two own-Chrome rows |
| Stage one | `.skilled/bin/skill-advisor.cjs advisor_recommend`, default threshold 0.8 |
| Stage two | `.skilled/bin/compiled-route.cjs`, the hub's compiled front door, with no runtime flag set |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Method

A replay script sent each request once through each stage from the same checkout. It read every advisor row, not only the first, so a negative row records the hub's confidence even when another skill ranks above it. It read the front door's action and targets.

The script ran once before the vocabulary change and once after. Between the two, the hub's generated intent signals were rewritten with `generate-router-intent-signals.cjs --write --hub mcp-browser-use`, and the activation manifest was re-minted with `compiled-route-manifest.cjs refresh`. The after run reads the re-minted policy.

## Differences from the 2026-11-21 run

- Stage one now runs through the advisor CLI, not `skill_advisor.py`. Before the change, the six original rows scored within 0.004 of their 2026-11-21 confidences.
- Rows added during the change have no before numbers. The results mark them `not-captured`.

## Boundary

The run measures routing only. It does not run a browser. The live runs of each mode are in the mode playbooks.

The final replay ran after the skill advisor scorer change in 2.0.2.0. That change made the task-intent confidence floor need the prompt to name the skill, dropped the bare `har` token and hint, and narrowed the browser read-only lift on "performance trace". Its own corpus gates are recorded in the advisor changelog, not here. The front door was not rebuilt for it, and the policy hash is the same as the earlier after run.

MBU-PB-04 still gets no advisor recommendation. The front door routes it correctly, so it is a stage-one limitation that this run records and does not fix.
