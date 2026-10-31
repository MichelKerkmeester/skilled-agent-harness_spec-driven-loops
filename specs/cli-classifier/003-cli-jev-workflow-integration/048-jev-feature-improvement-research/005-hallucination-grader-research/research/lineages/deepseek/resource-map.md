---
title: "Resource map — Jev hallucination grader DeepSeek lineage"
trigger_phrases: []
---
# Resource map — Jev hallucination grader DeepSeek lineage

Emitted from the five iterations' evidence trail (config `resource_map.emit` is true). Paths are as read; recorded-run data lives outside the repository and is marked.

## Measurement run (read-only, outside repository)

| Resource | Purpose | Iterations |
|---|---|---|
| `~/.skilled/.labels/024-labels.jsonl` | 56 operator-delegated labels (47 no / 9 yes) | 1, 3, 5 |
| `~/.skilled/.labels/runs/047-024-jev-20261002/report.json` | Verdict, counts, latency, model identity | 1, 5 |
| `~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl` | 169 per-call records (noul, status, wallMs) | 1, 2, 3, 5 |
| `~/.skilled/.labels/runs/047-024-jev.stdout.txt` | Printed census and verdict lines | 1 |

## Scorer and runner code

| Resource | Purpose | Iterations |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | The agreement arm under study (gates, baseline, keep rule, jev arm) | 1-5 |
| `.../scorer/deterministic/hallucination-flag.cjs` | Deterministic baseline check (allowlist, extraction, scoring) | 1, 2, 3 |
| `.../scorer/grader/harness.cjs` | Production D4 grader dispatch, parsing, caching, injection defenses | 2, 3, 5 |
| `.../scorer/grader/dispute.cjs` | Confidence-threshold adversarial escalation | 2 |
| `.../scorer/grader/prompts/system-grader.md` | D4 rubric the LLM grader follows | 2, 5 |
| `.../scorer/lib/cache.cjs` | Grader/det cache keying and identity | 2, 3, 5 |
| `.../scorer/score-model-variant.cjs` | 5-dim scorer, D4 seat, grader factory, rubric weights | 2, 5 |
| `.../run-benchmark.cjs` | Grader defaults, validation, family guard, report stamping | 2, 5 |
| `.../lib/reviewer-scorer.cjs` | Reviewer-output grading seat with its own fixture contract | 4 |
| `.../assets/model-benchmark/benchmark-fixtures/` | 21 fixtures (0 with allowlists; 4 reviewer fixtures) | 1, 2, 4 |
| `.../assets/model-benchmark/benchmark-profiles/{default,capability-m3-vs-mimo-v2}.json` | Output-volume shapes; repeatability tolerance | 5 |

## Fixture outputs

| Resource | Purpose | Iterations |
|---|---|---|
| `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/024-outputs/` | 56 outputs (42 honest run1/run2 + 14 careless run3) | 1, 3, 5 |

## Packet and method documents

| Resource | Purpose | Iterations |
|---|---|---|
| `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/{spec.md,goal.md,acceptance-criteria.md,scratch/evidence/results.md}` | Measurement campaign, labeler rules, recorded rows | 1, 3, 5 |
| `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/{spec.md,goal.md,implementation-summary.md}` | Feature requirements, frozen decisions, build record | 1, 2, 4, 5 |
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md` | ADR-001 delegated-arbiter label method | 3, 5 |

## Adoption-surface contracts

| Resource | Purpose | Iterations |
|---|---|---|
| `.skilled/agents/review.md` | Review output-verification promises and self-check | 4 |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Review evidence contract | 4 |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Cross-reference protocol dimensions | 4 |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md` | Citation drift scope and its own jev question | 4 |
| `.skilled/skills/cli-classifier/{SKILL.md,mode-registry.json}` | Reusable classifier-mode route | 4 |
| `.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml` | Promotion advisory semantics | 5 |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Lineage cost-unit budget precedent | 5 |
