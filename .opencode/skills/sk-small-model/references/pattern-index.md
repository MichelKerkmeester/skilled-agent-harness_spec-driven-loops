---
title: Small-Model Pattern Index
description: Authoritative index of small-model optimization patterns with their canonical executor-owned locations and ship status per Phase 002-006.
---

# Small-Model Pattern Index

A single lookup table operators use to find each small-model pattern's canonical location and ship status; no pattern logic lives here.

---

## 1. OVERVIEW

### Purpose

Provide one discoverable index that maps each small-model optimization pattern (context budget, output verification, model profiles, structured permissions, quota fallback, tool scoring, budget propagation, budget awareness) to its executor-owned location. Keeps `sk-small-model` thin and avoids duplicate pattern bodies across skills.

### When to Use

- Operator searches for "where is the small-model X pattern?"
- Skill-advisor surfaces `sk-small-model` alongside `cli-devin` or `cli-opencode`
- Onboarding to the 114-small-ai-model-optimization arc
- Verifying which phase shipped a given pattern

### Core Principle

The index is the contract; executor skills own the patterns. If a path here is missing on disk, the linked phase has not shipped — that is a roadmap pointer, not a bug.

---

## 2. PATTERN INDEX

| Pattern | Owner Skill | Canonical Location | Shipped In |
| --- | --- | --- | --- |
| Context budget engine (per-model defaults, fit-to-budget truncation, priority eviction) | `cli-devin` | [`../../cli-devin/references/context-budget.md`](../../cli-devin/references/context-budget.md) | Phase 004 |
| Output verification pipeline (compile → execute → smoke-test → lint) | `cli-devin` | [`../../cli-devin/references/output-verification.md`](../../cli-devin/references/output-verification.md) | Phase 004 |
| Confidence-scoring rubric (verification scoring formula) | `cli-devin` | [`../../cli-devin/assets/confidence-scoring-rubric.md`](../../cli-devin/assets/confidence-scoring-rubric.md) | Phase 004 |
| Per-model budget defaults (4 required + 2 optional stubs) | `cli-devin` | [`../../cli-devin/assets/per-model-budgets.json`](../../cli-devin/assets/per-model-budgets.json) | Phase 004 |
| Quota-pool-aware fallback (no same-pool retry; fail-fast when no different-pool target) | `cli-devin` | [`../../cli-devin/references/quota-fallback.md`](../../cli-devin/references/quota-fallback.md) | Phase 005 |
| Model-profile registry (unified per-model metadata) | `sk-prompt` | [`../../sk-prompt/assets/model-profiles.json`](../../sk-prompt/assets/model-profiles.json) | Phase 005 |
| Model-profile registry doc (schema + adoption protocol) | `sk-prompt` | [`../../sk-prompt/references/model-profiles.md`](../../sk-prompt/references/model-profiles.md) | Phase 005 |
| Bayesian tool scoring (Laplace-smoothed per-call scoring) | `system-spec-kit` + `cli-devin` | [`../../system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts`](../../system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts) + [`../../cli-devin/references/output-verification.md`](../../cli-devin/references/output-verification.md) § Tool scoring state file format | Phase 005 |
| Fallback router (TS helper applied via recipe field) | `system-spec-kit` | [`../../system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts`](../../system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts) | Phase 005 |
| Structured permissions schema (JSON Schema for tool-call gating) | `cli-opencode` | [`../../cli-opencode/assets/permissions-matrix.schema.json`](../../cli-opencode/assets/permissions-matrix.schema.json) | Phase 003 |
| Structured permissions reference (schema fields + 3 examples + RM-8 walkthrough) | `cli-opencode` | [`../../cli-opencode/references/permissions-matrix.md`](../../cli-opencode/references/permissions-matrix.md) | Phase 003 |
| Permissions gate runtime (pre-tool-call enforcer) | `system-spec-kit` | [`../../system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts`](../../system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts) | Phase 003 |
| cli-opencode budget propagation (sentinel mirror of cli-devin canonical) | `cli-opencode` | [`../../cli-opencode/references/context-budget.md`](../../cli-opencode/references/context-budget.md) | Phase 006 |
| sk-prompt budget awareness (subsection in cross-CLI quality card) | `sk-prompt` | [`../../sk-prompt/assets/cli_prompt_quality_card.md`](../../sk-prompt/assets/cli_prompt_quality_card.md) § Budget Awareness | Phase 006 |

---

## 3. OWNERSHIP BOUNDARY

| Executor / Skill | Owns | Surface |
| --- | --- | --- |
| `cli-devin` | SWE-1.6 (free) + DeepSeek-v4-pro / Kimi-k2.6 / GLM-5.1 via Cognition Pro | Budget engine, output verification, confidence rubric, per-model budgets, quota fallback |
| `cli-opencode` | DeepSeek-v4-pro via DeepSeek API direct + DeepSeek/Kimi/Qwen/GLM via opencode-go pool | Permissions matrix, budget propagation mirror |
| `sk-prompt` | Cross-CLI prompt quality + model registry | Model-profiles.json (each entry has `executors` array), cli_prompt_quality_card.md |
| `system-spec-kit` | Runtime helpers (TypeScript) | bayesian-scorer.ts, fallback-router.ts, permissions-gate.ts |
| `sk-small-model` (this skill) | Discovery + index only | This file, SKILL.md, graph-metadata.json |

If a pattern needs to span two executors, the rule is: ship the body in the primary executor and add a sentinel-style mirror (≤ 200 LOC, link-only) in the secondary. Phase 006's `cli-opencode/references/context-budget.md` is the canonical example of this pattern.

---

## 4. ADOPTING A NEW PROVIDER

When adopting Claude Haiku, Gemini Flash, or any future small-model provider, follow this checklist in order:

1. **Populate the registry stub** at `sk-prompt/assets/model-profiles.json` — set `quota_pool`, `context_length`, `tool_calling`, `provider`, and any other required fields.
2. **Optional: set `fallback_target`** on existing models that should fall back to the new provider (only if the new provider's quota pool differs from the source).
3. **Add trigger phrases** in `sk-small-model/graph-metadata.json` if the new provider has a distinct dispatch keyword (e.g. `haiku dispatch`).
4. **Mark the affected rows** in this index as shipped — no rows need to be added if the existing patterns already cover the new provider's needs.
5. **Re-index the advisor** — `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-refresh`.
6. **Verify routing** — simulate a sample prompt naming the new provider and confirm the advisor surfaces `sk-small-model` plus the relevant executor skill.

No code changes are required for adoption when the new provider fits an existing quota-pool category.

---

## 5. STALENESS POLICY

If a downstream phase moves, renames, or removes a pattern file:

| Situation | Action |
| --- | --- |
| File renamed | Update the row's path; keep the row |
| File removed (pattern dropped) | Replace the path with `(deprecated)` and add a one-line reason in a footnote |
| Pattern split across multiple files | List all locations in the same row (comma-separated paths) |
| Pattern merged into another | Point both rows at the merged location |

There is no automated CI check for staleness (Phase 007 was deleted 2026-05-18 per user direction). Rely on PR review when modifying any path referenced here.

---

## 6. RELATED RESOURCES

- [`../SKILL.md`](../SKILL.md) — Sentinel skill runtime instructions
- [`../README.md`](../README.md) — Human-facing overview + quick start
- [`../graph-metadata.json`](../graph-metadata.json) — `enhances` edges + trigger phrases
- [`../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/spec.md`](../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/spec.md) — Phase parent + roadmap
- [`../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/research.md`](../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/research.md) — Research synthesis (HYBRID-with-Anchor verdict in §RQ5)
