---
title: "Resource Map - deepseek lineage"
trigger_phrases: []
---
# Resource Map - deepseek lineage

Evidence-derived map of the sources this lineage actually used, grouped by role. Derived from the iteration deltas; no file here is a new source.

## Primary subject

| Resource | Role | Key evidence lines |
|----------|------|--------------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | The scorer under study (1,682 lines): test set, baselines, keep rule, Jev arm, report | test set :298; cap :330; verdict :880; sign test :823; report :1465; arm :1234; gate :1146 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Pinned contract (978 lines, ten describes) | describes :184, :272, :309, :353, :441, :502, :631, :743, :825 |

## Baseline and retrieval machinery

| Resource | Role | Key evidence lines |
|----------|------|--------------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Trigger-index lookup baseline (80 percent phrase coverage, scope filter) | lookup :132; spec folder :107 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs` | Token floors, phrase scoring, normalization contract | token floors :16-22; score :129; coverage :146 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Recipe builders and runner for the ripgrep lane | path-only :119; structured :96 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs` | Latency budget for the lexical lane (200 ms p95/max) | budget :43 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Index generator; phraseQuality bucket | :256 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Retrieval package contract; promptSetHash slot note | :79 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json` | Probe fixture: 120 rows, latin/cjk x exact/paraphrase/distractor | manifestHash, promptSetHash |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/prompt-set.json` | Frozen prompt set fixture, unused by this scorer | top-level cases |

## Recorded run and packet records

| Resource | Role | Key evidence |
|----------|------|--------------|
| `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt` | The verdict line, baselines, payload estimate, probe line | `verdict jev: keep ...` 0.006330 |
| `.../jev-live-1/out/report.json` | Counts, columns, latency, option set hash | columns.jev A=97 etc. |
| `.../jev-live-1/out/calls.jsonl` | 811 call records replayed offline for recovery, aggregation and per-track analysis | picks, pickProb, noneProb |
| `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/implementation-summary.md` | Operator record; keep "serves nothing" note | :66 |
| `specs/cli-jev/003-cli-jev-workflow-integration/scratch/w3-session/session-evidence.md` | Session recount; P2 on out-dir truncation | :176-181 |
| `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md` | Family-wide verdict table | feature 022 label precedent |
| `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` | Parent directive: D1 dormancy and no-secret policy | :47 |

## Same-judgment surfaces

| Resource | Role | Key evidence lines |
|----------|------|--------------------|
| `AGENTS.md` | Gate 1 instruction (all runtimes) | :65 |
| `.skilled/commands/speckit/search.md` | Search front door; declares semantic matching unsupported | :2, :77, :138 |
| `.skilled/skills/system-spec-kit/SKILL.md` | Gate 1 contract in the spec-kit skill | :462, :568 |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md` | Spec-folder suggestion scorer (same keep-rule shape) | :28, :42 |
| `.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` | Clarify-default scorer (3 orders, none class) | :30 |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md` | Advisor near-tie ordering with probability aggregation | :26, :28 |
| `.skilled/skills/cli-classifier/SKILL.md` | cli-jev transport hub policy | :22, :24 |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` | Pi transport measurement (adopt; p95, cost) | :79 |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md` | Injection screen scorer (shared pattern) | :18, :36 |
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | `JEV_TRANSPORT` serving route | :32 |

## Coverage notes

- Every recommendation in `research.md` traces to at least one row above.
- Not consulted: the Composer/Deem arm sources (out of scope for this feature study), and no sibling scorer was executed; their catalog contracts were read instead.
