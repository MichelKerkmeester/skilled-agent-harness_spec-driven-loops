---
title: "Validation Baselines + Troubleshooting"
description: "Baseline metrics for advisor_validate (corpus, holdout, UNKNOWN, daemon, cache latency) plus the troubleshooting playbook when a slice regresses."
trigger_phrases:
  - "advisor validation baselines"
  - "validate baseline regression"
  - "advisor_validate troubleshooting"
importance_tier: "normal"
contextType: "research"
version: 0.8.0.5
---

# Validation Baselines + Troubleshooting

Baseline metrics for advisor_validate (corpus, holdout, UNKNOWN, daemon, cache latency) plus the troubleshooting playbook when a slice regresses.

---

## 1. OVERVIEW

### Purpose

Captures `advisor_validate` baseline metrics and the troubleshooting playbook for validation slice regressions.

### When to Use

- Running release validation after scorer, metadata or graph changes.
- Diagnosing corpus, holdout, parity, safety or latency failures.
- Deciding whether a lane-weight change can ship.

### Core Principle

Validation baselines are the promotion gate for routing behavior changes, not after-the-fact reporting.

### Key Sources

- [`lane-weight-tuning.md`](./lane-weight-tuning.md)
- [`advisor-scorer.md`](./advisor-scorer.md)
- [`tool-ids-reference.md`](../runtime/tool-ids-reference.md)

---

## 2. CURRENT BASELINES

Baseline numbers as of remediation SHA `97a318d83`:

| Metric | Baseline | Source |
|---|---:|---|
| Full-corpus top-1 accuracy | 80.5% | `mcp-server/tests/scorer/corpus.vitest.ts` |
| Holdout top-1 accuracy | 77.5% | `mcp-server/tests/scorer/holdout.vitest.ts` |
| UNKNOWN count (full corpus) | <= 10 | `advisor_validate` `slices.corpus.unknown_count.value` |
| Python regression suite | full pass | `mcp-server/scripts/skill_advisor_regression.py` |
| Advisor vitest tests | 167 across 23 files | `mcp-server/tests/` |
| Watcher idle CPU | 0.031% | `mcp-server/lib/daemon/watcher.ts` benchmark |
| Watcher idle RSS | 5.516 MB | same |
| Cache-hit p95 latency | ~6.989 ms | `mcp-server/bench/cache-latency.bench.ts` |
| Uncached p95 latency | ~11.45 ms | same |

Drift threshold: top-1 accuracy below 80.5% on full corpus OR below 77.5% on holdout is a hard regression that blocks ship.

---

## 3. RUNNING VALIDATE

`advisor_validate` is a heavy operation. It runs the full corpus plus holdout plus parity plus safety plus latency slices in one pass. Require `confirmHeavyRun=true` to invoke.

```text
mcp__mk_skill_advisor__advisor_validate({ "confirmHeavyRun": true })
```

For a single-skill check (skip corpus + holdout):

```text
mcp__mk_skill_advisor__advisor_validate({ "confirmHeavyRun": true, "skillSlug": "sk-code" })
```

Response fields to retain for baseline tracking:

- `overallAccuracy` (float 0..1)
- `slices.corpus.full_corpus_top1` (validation slice)
- `slices.corpus.unknown_count.value` (integer)
- `slices.corpus.gold_none_false_fire_count` (count plus baseline delta)
- `slices.holdout.holdout_top1` (validation slice)
- `slices.parity.explicit_skill_top1_regression.passed` (boolean)
- `slices.parity.ambiguity_slice_stable.top2Within005` (boolean)
- `slices.parity.derived_lane_attribution_complete` (boolean)
- `slices.safety.adversarial_stuffing_blocked.passed` (boolean)
- `slices.latency.regression_suite_status.cacheHitP95Ms` (float)
- `slices.latency.regression_suite_status.uncachedP95Ms` (float)
- `slices.latency.regression_suite_status.failedCount` (integer)
- `telemetry` (prompt-safe outcome totals and run metadata)
- `perSkill[]` (array of per-skill results)
- `generatedAt` (ISO timestamp)

---

## 4. INTERPRETING SLICES

### Corpus slice

Runs every skill in the full corpus through the scorer. Top-1 accuracy is the percent of prompts where the correct skill ranks first. Baseline 80.5%.

Drift signal: a drop of more than 2 percentage points. Likely causes are scorer weight changes, new skills disrupting the lexical lane or stale skill metadata.

### Holdout slice

Runs a curated subset reserved for measuring generalization. Top-1 accuracy is the percent where the correct skill ranks first. Baseline 77.5%.

Drift signal: drop > 1pp is a stronger regression signal than the corpus slice because holdout is unseen during weight tuning.

### Parity slice

Checks that the Python shim plus the native MCP scorer return the same recommendations for the same prompt. Pass means parity holds.

Drift signal: any parity failure. Indicates a divergence between native plus Python paths. Inspect the failing prompt to identify which path drifted.

### Safety slice

Checks that prompt-safety boundaries hold. Counts violations where attribution leaks prompt content or trust-state leaks raw input.

Drift signal: any violation count above zero. Block ship until investigated.

### Latency slice

Reports cache-hit p95 plus uncached p95. Baselines: ~6.989 ms cache-hit, ~11.45 ms uncached.

Drift signal: cache-hit > 15 ms or uncached > 25 ms. Likely causes are SQLite contention, daemon lease starvation or scoring algorithm changes.

---

## 5. TROUBLESHOOTING

| Symptom | Likely Cause | Remediation |
|---|---|---|
| Corpus top-1 drops > 2pp | Scorer weight change OR new skill metadata regression | Run `advisor_rebuild --force`. If still regressed, inspect `perSkill[]` for the regressed skills. Roll back weights per `lane-weight-tuning.md` §6 |
| Holdout top-1 drops while corpus stays steady | Overfit to corpus | Inspect which holdout prompts misroute. Add representative cases to corpus. Re-run tuning |
| UNKNOWN count spikes above 10 | Trust-state went to `absent` OR scorer threshold misconfigured | Check `advisor_status.trustState`. If `absent`, run `advisor_rebuild`. If `live`, inspect lane weights for an over-aggressive threshold |
| Parity slice fails on specific skill | Python shim missing recent token boost added to native scorer | Re-sync `scripts/skill_advisor.py` against `mcp-server/lib/scorer/lanes/` |
| Safety violations > 0 | Attribution leaks prompt content | Inspect `slices.safety.violations[]` for the leaking field. Patch handler to redact |
| Cache-hit p95 > 15 ms | SQLite contention | Check `advisor_status.daemon.leaseHolder`. If contested, kill stale processes. Verify `mcp-server/database/skill-graph.sqlite` integrity |
| Uncached p95 > 25 ms | Scoring algorithm changed OR semantic_shadow lane embedding lookup slow | Profile via `mcp-server/bench/`. If semantic_shadow is the culprit, verify embeddings index freshness |
| `advisor_validate` errors with `confirmHeavyRun is required` | Caller did not opt in | Pass `confirmHeavyRun: true` |
| `advisor_validate` hangs > 5 min | Daemon lock OR test-corpus growth | Check process via `ps`. If hung, kill the MCP server plus restart. If completion exceeds 5 min routinely, trim test corpus or split into incremental runs |

---

## 6. RELATED

- [`tool-ids-reference.md`](../runtime/tool-ids-reference.md) §2, `advisor_validate` input plus output schema
- [`lane-weight-tuning.md`](./lane-weight-tuning.md), when plus how to change lane weights
- [`advisor-scorer.md`](./advisor-scorer.md), scorer mechanics that the validate slices probe
- [`freshness-contract.md`](../runtime/freshness-contract.md), trust state affects validate outcomes
- `feature-catalog/feature-catalog.md` §1, canonical baseline source
- `mcp-server/handlers/advisor-validate.ts`, handler implementation
- `mcp-server/bench/`, latency benchmark harnesses
