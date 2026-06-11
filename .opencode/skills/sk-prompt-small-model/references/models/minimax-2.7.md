---
title: MiniMax-M2.7 Prompt-Craft Profile (Historical — see minimax-m3.md)
model_id: "minimax-2.7"
description: Historical record of the MiniMax-M2.7 benchmark findings (benchmark 003); the TIDD-EC contract carried forward to MiniMax-M3, the active profile.
trigger_phrases:
  - "minimax m2.7 historical profile"
  - "minimax 2.7 benchmark record"
  - "superseded minimax profile"
importance_tier: deprecated
contextType: research
---

# MiniMax-M2.7 Prompt-Craft Profile — HISTORICAL

> **This profile is a historical record.** MiniMax-M3 is now the sole MiniMax model for both Token Plan and Direct API. The TIDD-EC + dense framework contract originally benchmarked on M2.7 has been carried to M3. See [`minimax-m3.md`](./minimax-m3.md) for the active profile.

---

## 1. OVERVIEW

This profile documents the original MiniMax-M2.7 benchmark findings (benchmark 003). The model `minimax-coding-plan/MiniMax-M2.7-highspeed` and `minimax/MiniMax-M2.7` are no longer the recommended dispatch targets. Use `minimax-coding-plan/MiniMax-M3` (Token Plan) or `minimax/MiniMax-M3` (Direct API) instead.

### Historical Purpose

This was the single source for how to prompt `minimax-2.7` when dispatching it through `cli-opencode`. Its framework finding (TIDD-EC + dense pre-planning) is carried forward to MiniMax-M3.

---

## 2. IDENTITY (HISTORICAL)

| Field | Historical Value |
|---|---|
| **slug (Token Plan)** | `minimax-coding-plan/MiniMax-M2.7-highspeed` |
| **slug (Direct API)** | `minimax/MiniMax-M2.7` |
| **context window** | 204,800 tokens |
| **quota pools** | `minimax-token-plan` (subscription) · `minimax-api` (pay-per-token) |
| **successor** | `minimax-m3` — carries this model's framework finding |

---

## 3. BENCHMARK EVIDENCE (HISTORICAL)

**Benchmark:** 003
**Model under test:** MiniMax-M2.7 (real runs on `minimax-coding-plan/MiniMax-M2.7-highspeed`)
**Sample size:** 7-fixture rig, 49 dispatches (7 variants × 7 fixtures)
**Confidence:** medium

| Framework | Score |
|---|---|
| TIDD-EC (primary) | 0.767 |
| RCAF (fallback) | 0.742 |
| Dense pre-plan | 0.775 |
| Medium pre-plan | 0.767 |

**Discriminator:** TIDD-EC's explicit Do's/Don'ts curbed MiniMax's scope/format drift, and dense pre-planning gave MiniMax extra structure it used rather than being slowed by it. Format adherence was the primary differentiator.

---

## 4. SEE ALSO

- **Active profile:** [`minimax-m3.md`](./minimax-m3.md) — use this for all current dispatches
- **Benchmark data:** [`../../benchmarks/003-minimax-prompt-framework/`](../../benchmarks/003-minimax-prompt-framework/) — raw benchmark results
- **Framework definitions:** [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md)
