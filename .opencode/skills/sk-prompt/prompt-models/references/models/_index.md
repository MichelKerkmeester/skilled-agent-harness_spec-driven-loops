---
title: Small-Model Prompt-Craft Profiles — Index
description: Thin index of the per-model prompt-craft profiles that ARE this skill's hub content. One row per active small model — prompt framework + status — linking to each model's profile. Frameworks mirror prompt-models/assets/model-profiles.json recommended_frameworks (the DATA source of truth); executor MECHANICS stay in cli-opencode.
trigger_phrases:
  - "small model profile index"
  - "prompt craft profiles index"
  - "per model framework table"
  - "which framework for which model"
importance_tier: normal
contextType: general
version: 0.8.0.12
---

# Small-Model Prompt-Craft Profiles — Index

These per-model profiles are the WEIGHT of `prompt-models` — its prompt-craft hub content. Each `<id>.md` records how to PROMPT that model: framework (primary + fallback), pre-planning density, scaffold shape, and gotchas. The framework choices below mirror `recommended_frameworks` in [`prompt-models/assets/model-profiles.json`](../../assets/model-profiles.json) (the DATA source of truth) and each profile cites it. Executor MECHANICS (binary flags, invocation wrappers) live in `cli-opencode` — see [`../pattern-index.md`](../pattern-index.md).

> A profile path that is missing on disk is a roadmap pointer (profile not yet authored), not a broken link — same convention as `pattern-index.md`.

---

## 1. ACTIVE MODELS

| Model | Profile | Framework (primary; fallback) | Pre-planning | Status |
| --- | --- | --- | --- | --- |
| `minimax-m3` | [`minimax-m3.md`](./minimax-m3.md) | TIDD-EC; RCAF fallback | dense | empirical (benchmark 003, run on M2.7; contract carried to M3) |
| `mimo-v2.5-pro` | [`mimo-v2.5-pro.md`](./mimo-v2.5-pro.md) | COSTAR; RACE fallback (avoid TIDD-EC, CIDI) | lean | empirical (benchmark 004, confidence high) |
| `deepseek-v4-pro` | [`deepseek-v4-pro.md`](./deepseek-v4-pro.md) | RCAF; no fallback | medium | default-unverified |
| `kimi-k2.7-code` | [`kimi-k2.7-code.md`](./kimi-k2.7-code.md) | COSTAR; TIDD-EC fallback (avoid rcaf) | lean | empirical (benchmark 007; perfect tier tied, rcaf weakest) |
| `glm-5.2` | [`glm-5.2.md`](./glm-5.2.md) | COSTAR; TIDD-EC fallback (avoid RCAF) | lean | empirical (benchmark 008; perfect tier tied, rcaf weakest) |
| `composer-2.5` | [`composer-2.5.md`](./composer-2.5.md) | RCAF; no fallback | medium | default-unverified (Cursor-native, dispatched via `cli-cursor`; no benchmark run) |

### Historical

None.

Status legend mirrors the registry's `recommended_frameworks.status`:
- **empirical** — framework chosen from a real benchmark on this model.
- **carried** — inherited from a sibling model's benchmark; `carried_from` names the source. NOT a fresh run on this model.
- **default-unverified** — convention default (RCAF + mandatory caller-side pre-planning); no model-specific benchmark yet.

Optional, not-yet-adopted (no active profile): Claude Haiku. Frontier models (Opus, Sonnet, gpt-5.5) are out of scope — this includes the hosted frontier ids Cursor can also drive (`gpt-5.6-sol-*`, `claude-opus-4-8-*`, `cursor-grok-4.5-*`); only Composer, Cursor's own native model, gets a profile here.

---

## 2. RELATED

- [`../pattern-index.md`](../pattern-index.md) — Locates executor-owned MECHANICS + ship status.
- [`../../SKILL.md`](../../SKILL.md) — Hub workflow, dispatch matrix, rules.
- [`../../assets/model-profiles.json`](../../assets/model-profiles.json) — The registry DATA every profile mirrors.
