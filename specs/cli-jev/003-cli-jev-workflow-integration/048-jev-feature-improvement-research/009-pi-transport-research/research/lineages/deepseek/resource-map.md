---
title: "Resource map — Jev Pi native classifier transport (deepseek lineage)"
trigger_phrases: []
---
# Resource Map — Jev Pi native classifier transport

Evidence-derived map of the artifacts this lineage read, recomputed from, or cited. Paths are
repository-relative unless marked home-relative. Produced from the five iterations' deltas and sources.

## Primary Implementation

| Artifact | Path | Role in research |
|---|---|---|
| Transport module | `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | The subject: switch (`resolveTransport`), request/context mappers, gates, CLI fallback |
| Transport tests | `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | 22+ stub-backed rows, both backends |
| Comparison scorer | `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Keep rule, metrics, replay plan, both arms, verdict line |
| Caller (opted in) | `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | `require` at :26, call at :1105 |
| Caller (opted in) | `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | `require` at :24, call at :943 |
| Shared CLI helpers | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | `nearestRank`, `topKey`, `rotations`, `optionArgs`, `readProbabilities`, CLI job shape |
| Shared call/gate helpers | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | `jevGate` (pins `jev 0.6.2`), `spawnCall`, `writeCall` |

## Measured Evidence

| Artifact | Path | What it holds |
|---|---|---|
| 037 live run calls | `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/calls.jsonl` | 334 Pi records (333 choice + model_check) |
| 037 live run report | `.../037-.../scratch/live-run/report.json` | Metrics, columns, verdict, cost_per_100 |
| 037 stdout | `.../037-.../scratch/live-run.stdout.txt` | Census, gate, column, metrics and verdict lines |
| 019 CLI baseline | `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl` | 334 CLI records (1 auth + 333 choice) |
| 037 limitations | `.../037-.../implementation-summary.md` | One-row margin, latency pairing, four P2s, identity scope |
| 038 limitations | `specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/implementation-summary.md` | Backend naming, unpinned Pi version, choice-only, 13 callers, no smoke call |
| 038 review round 1 | `.../037-.../scratch/verify/review-mimo-r1.txt` | P2-1..P2-4 findings (rounding, latency field, timeout/skip lines) |
| 019 method | `.../019-.../implementation-summary.md` | No gold labels; corpus has no operator labels |

## Judgment Call Sites (inventory)

| Type | Call sites (file:line) |
|---|---|
| `choice` | `score-verdict-fallback.cjs:783`, `score-severity-replay.cjs:1070`, `score-jev-tiebreak.mjs:1005`, `score-debug-next-check.mjs:733`, `score-track-narrowing.mjs:1327`, `score-alignment-suggestion.ts:1083` |
| `noul` | `cite-drift-scan.mjs:1081`, `score-goal-lint.cjs:313`, `score-severity-replay.cjs:1118`, `score-fanout-pairs.cjs:985`, `score-residue-flagger.cjs:1093`, `score-completion-claims.mjs:784`, `score-jev-tiebreak.mjs:928`, `score-d4-agreement.cjs` |
| `score` | `score-stop-rater.cjs:1090` |
| Audit rule | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:236-241` |

## External Dependencies Read

| Artifact | Path | Use |
|---|---|---|
| Pi classifier docs | `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md` | Classifier surfaces, provider table, cost accounting |
| Pi codemode docs | `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/cli.md:178` | 4-at-a-time classify parallelism |
| Pi model catalog | `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/chunks/chunk-3YAHQSW6.js` | `cost.input` for every available classifier arm |
| Pi worker guidance | `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:165-176,219,232` | Native surfaces; answer is evidence, never permission |
| cli-jev docs | `.skilled/skills/cli-classifier/cli-jev/SKILL.md:240-260` | Switch table and `choice`-only boundary |
| Hermes mirror | `.hermes/skills/cli-classifier/SKILL.md` (skill-only, no code copy) | Bounds default-flip propagation |

## Lineage Artifacts (this packet)

| Artifact | Path |
|---|---|
| Iterations 1-5 | `.../research/lineages/deepseek/iterations/iteration-00{1..5}.md` |
| Deltas 1-5 | `.../research/lineages/deepseek/deltas/iter-00{1..5}.jsonl` |
| State log | `.../research/lineages/deepseek/deep-research-state.jsonl` |
| Strategy | `.../research/lineages/deepseek/deep-research-strategy.md` |
| Synthesis | `.../research/lineages/deepseek/research.md` |
| Registry | `.../research/lineages/deepseek/findings-registry.json` |
