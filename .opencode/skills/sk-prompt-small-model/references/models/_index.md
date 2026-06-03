---
title: Small-Model Prompt-Craft Profiles — Index
description: Thin index of the per-model prompt-craft profiles that ARE this skill's hub content. One row per active small model — prompt framework + status — linking to each model's profile. Frameworks mirror sk-prompt-small-model/assets/model-profiles.json recommended_frameworks (the DATA source of truth); executor MECHANICS stay in cli-devin / cli-opencode.
---

# Small-Model Prompt-Craft Profiles — Index

These per-model profiles are the WEIGHT of `sk-prompt-small-model` — its prompt-craft hub content. Each `<id>.md` records how to PROMPT that model: framework (primary + fallback), pre-planning density, scaffold shape, and gotchas. The framework choices below mirror `recommended_frameworks` in [`sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) (the DATA source of truth) and each profile cites it. Executor MECHANICS (binary flags, invocation wrappers) live in `cli-devin` / `cli-opencode` — see [`../pattern-index.md`](../pattern-index.md).

> A profile path that is missing on disk is a roadmap pointer (profile not yet authored), not a broken link — same convention as `pattern-index.md`.

---

## 1. ACTIVE MODELS

| Model | Profile | Framework (primary; fallback) | Pre-planning | Status |
| --- | --- | --- | --- | --- |
| `minimax-m3` | [`minimax-m3.md`](./minimax-m3.md) | TIDD-EC; RCAF fallback | dense | carried (from minimax-2.7, benchmark 120/003) |
| `mimo-v2.5-pro` | [`mimo-v2.5-pro.md`](./mimo-v2.5-pro.md) | COSTAR; RACE fallback (avoid TIDD-EC, CIDI) | lean | empirical (benchmark 126/004, confidence high) |
| `minimax-2.7` | [`minimax-2.7.md`](./minimax-2.7.md) | TIDD-EC; RCAF fallback | dense | empirical (benchmark 120/003, confidence medium) |
| `swe-1.6` | [`swe-1.6.md`](./swe-1.6.md) | RCAF; no fallback | medium | default-unverified |
| `deepseek-v4-pro` | [`deepseek-v4-pro.md`](./deepseek-v4-pro.md) | RCAF; no fallback | medium | default-unverified |
| `kimi-k2.6` | [`kimi-k2.6.md`](./kimi-k2.6.md) | RCAF; no fallback | medium | default-unverified |
| `qwen3.6` | [`qwen3.6.md`](./qwen3.6.md) | RCAF; no fallback | medium | default-unverified |
| `glm-5.1` | [`glm-5.1.md`](./glm-5.1.md) | RCAF; no fallback | medium | default-unverified |

Status legend mirrors the registry's `recommended_frameworks.status`:
- **empirical** — framework chosen from a real benchmark on this model.
- **carried** — inherited from a sibling model's benchmark; `carried_from` names the source. NOT a fresh run on this model.
- **default-unverified** — convention default (RCAF + mandatory caller-side pre-planning); no model-specific benchmark yet.

Optional, not-yet-adopted (no active profile): Claude Haiku, Gemini Flash. Frontier models (Opus, Sonnet, gpt-5.5) are out of scope.

---

## 2. RELATED

- [`../pattern-index.md`](../pattern-index.md) — Locates executor-owned MECHANICS + ship status.
- [`../../SKILL.md`](../../SKILL.md) — Hub workflow, dispatch matrix, rules.
- [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) — The registry DATA every profile mirrors.
