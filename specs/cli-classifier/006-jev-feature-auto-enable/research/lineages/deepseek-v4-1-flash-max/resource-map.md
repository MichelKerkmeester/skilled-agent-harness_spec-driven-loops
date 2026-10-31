---
title: "Resource Map — Jev feature proof-or-retire (deepseek-v4-1-flash-max lineage)"
description: "Evidence-derived resource map for the detached deepseek-v4-1-flash-max lineage."
trigger_phrases: []
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- Scope: the shared Jev feature gate and its four proven live paths; the three scorers without a clean keep (spec-track narrowing, routing clarify default, alignment folder suggestion); the shared scorer-report kit; the routing seam; the recorded runs behind each verdict; the prior research and build packets (003 children 017, 020, 022, 047, 048, 049).
- Generated from: five mechanically verified iteration deltas (`deltas/iter-001.jsonl` … `iter-005.jsonl`).
- Primary local authorities: `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs` (the gate), `scorer-report.mjs` (the shared measurement kit), the three scorers, the compiled-routing runtime, and the recorded label runs under `~/.skilled/.labels/runs/`.
- Resource status is an evidence snapshot dated 2026-10-04; the compiled-routing engine and the scorers are live surfaces that can move.

## Local Integration Sources

| Path | Action | Status | Evidence use |
|---|---|---|---|
| `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs` | Read | OK | Gate contract: FEATURES, featureSwitch, jevReady, featureReady (iter 1 F-001..F-006) |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs` | Read | OK | Stub-CLI test pattern and no-spawn proof (iter 1 F-005) |
| `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs` | Read | OK | Shared kit exports; amendment site (iter 5 F-002, F-004) |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Read | OK | Proven advisory shape; version-pinned gate (iter 1 F-003, F-006) |
| `.skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs` | Read | OK | Proven hook shape; fail-open (iter 1 F-003) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Read | OK | Proven auto-resolution with recorded reason (iter 1 F-003, F-004) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Read | OK | Proven auto grader; explicit-jev hard fail (iter 1 F-003, F-004) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Read | OK | Keep rule, verdict order, pins, bootstrap, replay (iter 2) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Read | OK | 33-case inventory (iter 2 F-007) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Read | OK | Gate 1 live surface for the advisory shape (iter 2 F-008) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Read + ran read-only | OK | Replay refusal, label gate, baselines, early stop, census (iter 3) |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Read | OK | Normalized route drops clarify alternatives (iter 3 F-005) |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Read | OK | resolveRoute serves only the normalized shape (iter 3 F-005) |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Read | OK | Kill branch, controls, recall, interval, pins (iter 4) |
| `~/.skilled/.labels/runs/049-002-jev.stdout.txt` | Read | OK | Track repeat verdict, arms, per-track table, bootstrap (iter 2 F-001..F-007) |
| `~/.skilled/.labels/runs/049-002-jev-20261003/report.json` | Read | OK | Row-set/model-tuple pins (iter 2 F-005) |
| `~/.skilled/.labels/runs/049-008-jev.stdout.txt` | Read | OK | Alignment primary + label-swap + distractor + gated arms (iter 4 F-001, F-002, F-005) |
| `~/.skilled/.labels/020-rows.jsonl` | Ran read-only | OK | 54-row fixture; 42 refused on replay (iter 3 F-002) |
| `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/{002,007,008}-*/research/research.md` | Read | OK | Prior merged research; ranked recommendations (iters 2-4) |
| `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/{002,007,008}-*/implementation-summary.md` | Read | OK | What was built; verification; limitations (iters 2-4) |
| `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md` | Read | OK | Fleet measured rows incl. proven features (iter 5 F-004) |
| `specs/cli-jev/006-jev-feature-auto-enable/{spec.md,plan.md}` | Read | OK | Deliverable contract REQ-010; scope (init) |

## Recorded External Runs

| Run | Feature | Verdict line (as recorded) |
|---|---|---|
| `017-.../scratch/w3-build/runs/jev-live-1` | track (first) | `keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330` |
| `~/.skilled/.labels/runs/049-002-jev-20261003` | track (repeat) | `stop (margin) K=270 M=270 A=106 B=82 W=80 L=56 F=48 p=0.02409`, CI [-0.1185, 0.2760] |
| `~/.skilled/.labels/runs/047-020-jev-20261002` | clarify | `keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599` (historical; 42 of 54 now refused) |
| `~/.skilled/.labels/runs/049-008-jev-20261003b` | alignment | `keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059`; distractor `kill W=0 L=30` |

## Commands Run Read-Only In This Lineage

- `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` — census, zero model calls: `total prompts=365 … clarify=3 clarify_mode=2 clarify_checklist=1`.
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score ~/.skilled/.labels/020-rows.jsonl` — 42 refused (route), 12 labeled, `stop: fewer than 30 labeled rows`.
- Exact binomial power computations (scripts, no model calls): track (217 decided pairs / ~431 rows at 0.588; MDE 0.634) and clarify (158/69/37 discordant pairs at 0.60/0.65/0.70).

## Notes

- No write escaped the lineage directory; the append gateway wrote the ledger and the state-log projection inside it.
- `resource-map.md` is emitted from the deltas in the shared format; the official reducer cannot run against this detached lineage (it resolves artifact paths from the spec folder, outside the write boundary).
