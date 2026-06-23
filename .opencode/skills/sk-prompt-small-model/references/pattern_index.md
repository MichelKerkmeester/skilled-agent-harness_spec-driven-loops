---
title: Small-Model Pattern Index
description: Authoritative index of small-model optimization patterns with their canonical executor-owned locations and ship status.
trigger_phrases:
  - "small model pattern index"
  - "pattern canonical location"
  - "small model pattern ship status"
  - "where is the small model pattern"
importance_tier: normal
contextType: general
version: 0.8.0.19
---

# Small-Model Pattern Index

A single lookup table operators use to find each small-model pattern's canonical location and ship status; no pattern logic lives here.

---

## 1. OVERVIEW

### Purpose

Provide one discoverable index that maps each small-model optimization pattern (context budget, output verification, model profiles, structured permissions, quota fallback, tool scoring, budget propagation, budget awareness) to its executor-owned location. Keeps `sk-prompt-small-model` thin and avoids duplicate pattern bodies across skills.

### When to Use

- Operator searches for "where is the small-model X pattern?"
- Skill-advisor surfaces `sk-prompt-small-model` alongside `cli-opencode`
- Onboarding to the small-model optimization patterns
- Verifying which patterns are shipped versus roadmap

### Core Principle

The index is the contract; executor skills own the patterns. If a path here is missing on disk, the linked phase has not shipped — that is a roadmap pointer, not a bug.

---

## 2. PATTERN INDEX

| Pattern | Owner Skill | Canonical Location | Status |
| --- | --- | --- | --- |
| Context budget engine (per-model defaults, fit-to-budget truncation, priority eviction) | `sk-prompt-small-model` | [`./context_budget.md`](./context_budget.md) | shipped |
| Output verification pipeline (compile → execute → smoke-test → lint) | `sk-prompt-small-model` | [`./output_verification.md`](./output_verification.md) | shipped |
| Confidence-scoring rubric (verification scoring formula) | `sk-prompt-small-model` | [`../assets/confidence_scoring_rubric.md`](../assets/confidence_scoring_rubric.md) | shipped |
| Per-model budget defaults (3 required + 1 optional stub) | `sk-prompt-small-model` | [`../assets/per_model_budgets.json`](../assets/per_model_budgets.json) | shipped |
| Quota-pool-aware fallback (no same-pool retry; fail-fast when no different-pool target) | `sk-prompt-small-model` | [`./quota_fallback.md`](./quota_fallback.md) | shipped |
| Model-profile registry (unified per-model metadata) | `sk-prompt-small-model` | [`../assets/model_profiles.json`](../assets/model_profiles.json) | shipped |
| Bayesian tool scoring (Laplace-smoothed per-call scoring) | `system-spec-kit` + `sk-prompt-small-model` | [`../../deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts`](../../deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts) + [`./output_verification.md`](./output_verification.md) § Tool scoring state file format | shipped |
| Fallback router (TS helper applied via recipe field) | `system-spec-kit` | [`../../deep-loop-runtime/lib/deep-loop/fallback-router.ts`](../../deep-loop-runtime/lib/deep-loop/fallback-router.ts) | shipped |
| Structured permissions schema (JSON Schema for tool-call gating) | `cli-opencode` | [`../../cli-opencode/assets/permissions-matrix.schema.json`](../../cli-opencode/assets/permissions-matrix.schema.json) | shipped |
| Structured permissions reference (schema fields + 3 examples + RM-8 walkthrough) | `cli-opencode` | [`../../cli-opencode/references/permissions-matrix.md`](../../cli-opencode/references/permissions-matrix.md) | shipped |
| Permissions gate runtime (pre-tool-call enforcer) | `system-spec-kit` | [`../../deep-loop-runtime/lib/deep-loop/permissions-gate.ts`](../../deep-loop-runtime/lib/deep-loop/permissions-gate.ts) | shipped |
| cli-opencode budget propagation (sentinel mirror of sk-prompt-small-model canonical) | `cli-opencode` | [`../../cli-opencode/references/context-budget.md`](../../cli-opencode/references/context-budget.md) | shipped |
| MiniMax-M3 prompt-framework guidance (TIDD-EC + dense pre-plan; benchmark 003) | `sk-prompt-small-model` | [`./models/minimax-m3.md`](./models/minimax-m3.md) | shipped (benchmark 003, run on M2.7) |
| MiMo-V2.5-Pro prompt-framework guidance (empirical winner: **COSTAR + lean**; RACE fallback — frame for format/brevity, NOT guardrails; TIDD-EC ranked last) | `sk-prompt-small-model` | [`./models/mimo-v2.5-pro.md`](./models/mimo-v2.5-pro.md) | shipped (benchmark 004) |

---

## 3. OWNERSHIP BOUNDARY

| Executor / Skill | Owns | Surface |
| --- | --- | --- |
| `cli-opencode` | DeepSeek-v4-pro via DeepSeek API direct + DeepSeek via opencode-go pool + Kimi-k2.7-code via the Kimi For Coding plan + MiniMax-M3 via the Token Plan (`minimax-coding-plan`) and Direct API (`minimax`, pay-per-token) + MiMo-V2.5-Pro via the Xiaomi Token Plan (`xiaomi-token-plan-ams`) and Xiaomi Direct API (`xiaomi`) | Permissions matrix, budget propagation mirror. Prompt-CRAFT (framework selection, pre-planning density, per-model guidance) now lives in the hub profiles at `sk-prompt-small-model/references/models/`; cli-opencode owns only invocation MECHANICS (binary flags, provider id, quota pool). |
| `sk-prompt` | Cross-CLI prompt quality + generic framework definitions | cli_prompt_quality_card.md |
| `sk-prompt-small-model` (this skill) | Model registry + prompt-craft profiles + indexes + verification/fallback references | `assets/model_profiles.json` (each entry has `executors` array), `references/models/`, `references/output_verification.md`, `references/quota_fallback.md`, `assets/confidence_scoring_rubric.md`, this file, SKILL.md |
| `system-spec-kit` | Runtime helpers (TypeScript) | bayesian-scorer.ts, fallback-router.ts, permissions-gate.ts |

If a pattern needs to span two executors, the rule is: ship the body in `sk-prompt-small-model` (the hub) and add a sentinel-style mirror (≤ 200 LOC, link-only) in the secondary executor. The `cli-opencode/references/context-budget.md` mirror is the canonical example of this pattern.

---

## 4. ADOPTING A NEW PROVIDER

When adopting Claude Haiku or any future small-model provider, follow this checklist in order. **This is the single canonical adoption checklist** — `sk-prompt-small-model/SKILL.md` §3 points here; do not maintain a second copy of these steps.

1. **Populate the registry entry** at `sk-prompt-small-model/assets/model_profiles.json` — set the executor entry's `provider` + `quota_pool` (nested under `executors[]`), plus the model-level `context_length`, `tool_calling`, `primary_quota_pool`, and `recommended_frameworks` fields.
2. **Author the prompt-craft profile** at `sk-prompt-small-model/references/models/<id>.md` from the 6-section per-model template, mirroring + citing the registry entry. **Without this the model has zero hub WEIGHT — a registry entry alone is not an adopted model.**
3. **Add a row to `sk-prompt-small-model/references/models/_index.md`** (id → framework primary; fallback; pre-planning density; status).
4. **Add a row to the `sk-prompt-small-model/SKILL.md` §3 Dispatch Matrix** (model → executor → provider (quota pool) → status).
5. **Register discovery triggers** — add the model name to the `trigger_phrases` of **each dispatching executor's** `graph-metadata.json` (`cli-opencode`), plus `sk-prompt-small-model/graph-metadata.json` `trigger_phrases` + `intent_signals`. Add a phrase only to an executor that actually dispatches the model (do not blanket-add).
6. **Optional: set `fallback_target`** on existing models that should fall back to the new provider (only if the new provider's quota pool differs from the source).
7. **Re-index the advisor** — `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-refresh`.
8. **Verify routing** — simulate a sample prompt naming the new provider and confirm the advisor surfaces `sk-prompt-small-model` plus the relevant executor skill.
9. **Mark the affected rows** in §2 of this index as shipped — add new pattern rows only if the model needs a pattern not already covered.

No executor-MECHANICS or code changes are required for adoption when the new provider fits an existing quota-pool category.

---

## 5. STALENESS POLICY

If a downstream phase moves, renames, or removes a pattern file:

| Situation | Action |
| --- | --- |
| File renamed | Update the row's path; keep the row |
| File removed (pattern dropped) | Replace the path with `(deprecated)` and add a one-line reason in a footnote |
| Pattern split across multiple files | List all locations in the same row (comma-separated paths) |
| Pattern merged into another | Point both rows at the merged location |

There is no automated CI check for staleness. Rely on PR review when modifying any path referenced here.

---

## 6. RELATED RESOURCES

- [`../SKILL.md`](../SKILL.md) — Hub skill runtime instructions + the model-keyed router
- [`../README.md`](../README.md) — Human-facing overview + quick start
- [`../graph-metadata.json`](../graph-metadata.json) — `enhances` edges + trigger phrases
- [`models/_index.md`](models/_index.md) — Per-model profile index
