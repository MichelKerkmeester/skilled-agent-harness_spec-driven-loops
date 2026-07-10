---
title: Quota-Pool-Aware Fallback
description: One-step small-model fallback rules for the small-model registry quota pools. Re-homed from cli-devin.
trigger_phrases:
  - "quota pool aware fallback"
  - "small model fallback rules"
  - "one step model fallback"
  - "exhausted quota pool"
importance_tier: normal
contextType: implementation
version: 0.8.0.7
---

# Quota-Pool-Aware Fallback

> This reference was re-homed from cli-devin to prompt-models as part of the cli-devin deprecation. Content is executor-agnostic.

## Overview

Phase 005 ships a quota-pool-aware fallback contract for the user's small-only model ecosystem.

The fallback engine reads `prompt-models/assets/model_profiles.json`.

It uses these fields:

- `primary_quota_pool`
- `executors[].quota_pool`
- `fallback_target`

Fallback is one step.

Fallback is opt-in.

Fallback is off today because every active model has `fallback_target: null`.

The default behavior is fail-fast with a message naming the exhausted pool.

---

## Why This Is NOT A Tier Escalator

This design replaced the older small-to-frontier escalation idea.

The user does not run frontier models in this rotation.

No gpt-5.5, Opus, or Sonnet entry belongs in the Phase 005 registry.

The fallback engine should not invent a larger model.

The fallback engine should not burn another model from an exhausted quota pool.

The fallback engine should not silently switch providers.

It may route to a configured separate-pool target later, after the operator adopts Haiku.

### ADR-001 Rationale

ADR-001 says:

> The user's actual model rotation is small-only: DeepSeek-v4-pro (deepseek-api pool), Kimi-k2.7-code (kimi-for-coding pool), MiniMax-M3 (minimax-token-plan primary pool, minimax-api secondary executor pool), MiMo-V2.5-Pro (xiaomi-token-plan pool), with optional future Claude Haiku. There are no frontier models (Opus / Sonnet / gpt-5.5) in scope to escalate to. The original Phase D plan assumed a small-to-frontier escalation chain; that assumption is gone. Naive "pick another model" routing on hard-fail would just pick a same-pool sibling, accomplishing nothing while spending more quota.

Implementation follows that rationale.

The safe result is explicit failure when no configured separate-pool target exists.

---

## Pool-Membership Table

| Quota pool | Active members | Optional members | Notes |
| --- | --- | --- | --- |
| `deepseek-api` | `deepseek-v4-pro` | none | Direct DeepSeek API key path; primary pool for DeepSeek. |
| `kimi-for-coding` | `kimi-k2.7-code` | none | Kimi For Coding subscription pool. |
| `minimax-token-plan` | `minimax-m3` | none | MiniMax Token Plan subscription. |
| `minimax-api` | `minimax-m3` | none | Direct MiniMax API executor pool. |
| `xiaomi-token-plan` | `mimo-v2.5-pro` | none | Xiaomi Token Plan Europe. |
| `anthropic` | none | `haiku` | Optional separate provider pool. |

Pool labels are operational boundaries.

They are not display names.

They decide whether fallback is allowed.

---

## Fallback Decision Algorithm

Input:

- `failedModelId`
- parsed registry from `prompt-models/assets/model_profiles.json`

Output:

```typescript
{ action: "fallback" | "fail-fast", target?: string, reason: string }
```

Algorithm:

1. Find the failed model by `id`.
2. If the failed model is unknown, return `fail-fast`.
3. Read the failed model's `primary_quota_pool`.
4. Read the failed model's `fallback_target`.
5. If `fallback_target` is `null`, return `fail-fast`.
6. Find the target model by `id`.
7. If the target model is unknown, return `fail-fast`.
8. Compare `target.primary_quota_pool` with `failed.primary_quota_pool`.
9. If the pools match, return `fail-fast`.
10. If the pools differ, return `fallback` with `target`.

No second fallback step is allowed.

No round-robin is allowed.

No same-pool retry is allowed.

No implicit default target is allowed.

No frontier target is allowed in Phase 005.

---

## Pseudocode

```typescript
const failed = registry.models.find((model) => model.id === failedModelId);
if (!failed) return failFast("unknown model");

if (failed.fallback_target === null) {
  return failFast(`${failed.primary_quota_pool} pool exhausted, no separate-pool fallback configured`);
}

const target = registry.models.find((model) => model.id === failed.fallback_target);
if (!target) return failFast("configured fallback is not in the registry");

if (target.primary_quota_pool === failed.primary_quota_pool) {
  return failFast("same-pool fallback rejected");
}

return fallback(target.id);
```

The production helper is:

```text
.opencode/skills/system-deep-loop/runtime/lib/deep-loop/fallback-router.ts
```

That helper consumes a normalized projection where `quota_pool` is derived from
the registry's `primary_quota_pool`.

---

## Worked Examples

### DeepSeek-v4-pro Default

Registry:

```json
{
  "id": "deepseek-v4-pro",
  "primary_quota_pool": "deepseek-api",
  "fallback_target": null
}
```

Result:

```json
{
  "action": "fail-fast",
  "reason": "deepseek-api pool exhausted, no separate-pool fallback configured for deepseek-v4-pro"
}
```

This prevents an unapproved retry through another provider path.

### Same-Pool Fallback Rejected (hypothetical)

If `deepseek-v4-pro` were configured to fall back to a second model that also lived on the `deepseek-api` pool:

```json
{
  "id": "deepseek-v4-pro",
  "primary_quota_pool": "deepseek-api",
  "fallback_target": "some-deepseek-api-model"
}
```

Target (same pool):

```json
{
  "id": "some-deepseek-api-model",
  "primary_quota_pool": "deepseek-api"
}
```

Result:

```json
{
  "action": "fail-fast",
  "reason": "deepseek-api pool exhausted, fallback target some-deepseek-api-model shares the same pool; same-pool fallback rejected"
}
```

Same-pool siblings are rejected. The pool is the boundary, not the model's context window.

### Haiku To DeepSeek-v4-pro

Registry change:

```json
{
  "id": "haiku",
  "primary_quota_pool": "anthropic",
  "fallback_target": "deepseek-v4-pro"
}
```

Target:

```json
{
  "id": "deepseek-v4-pro",
  "primary_quota_pool": "deepseek-api"
}
```

Result:

```json
{
  "action": "fallback",
  "target": "deepseek-v4-pro"
}
```

This is a separate-pool fallback.

It is only relevant after the optional Haiku stub becomes active.

---

## Adoption Checklist For Haiku

1. Confirm Haiku is actually in the user's dispatch rotation.
2. Confirm the exact executor and model id.
3. Populate the `haiku` stub in `prompt-models/assets/model_profiles.json`.
4. Set `context_length` from current official/runtime information.
5. Set `avg_iter_wall_clock_min` from a measured iteration.
6. Change `status` from `optional-unverified` to `active`.
7. Set source model `fallback_target` fields only where fallback is desired.
8. Run `jq empty` on the registry.
9. Run `fallback-router` unit tests.
10. Re-index the advisor.

---

## Error Message Templates

### No Target Configured

```text
{quota_pool} pool exhausted, no separate-pool fallback configured for {model_id}
```

### Same-Pool Target Rejected

```text
{quota_pool} pool exhausted, fallback target {target_id} shares the same pool; same-pool fallback rejected
```

### Unknown Source

```text
unknown model {model_id}; no quota pool available for fallback routing
```

### Missing Target

```text
{quota_pool} pool exhausted, configured fallback {target_id} is not in the registry
```

### Allowed Fallback

```text
{quota_pool} pool exhausted, routing {source_id} to separate {target_pool} pool target {target_id}
```

---

## Verification

Focused tests:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/deep-loop/fallback-router.vitest.ts
```

Empirical simulations to keep:

- default `resolveFallback("deepseek-v4-pro", registry)` fails fast
- in-memory `deepseek-v4-pro.fallback_target = "haiku"` routes to Haiku (separate pool)
- a same-pool fallback target on the `deepseek-api` pool is rejected

---

## Operator Rules

Fail-fast is not a bug.

Fail-fast is the honest default until a separate-pool target is adopted.

Do not hide quota exhaustion behind retries.

Do not route within the same pool when that pool is exhausted.

Do not add frontier models to make fallback look more capable.

Do not make fallback recursive.

Do not change this file without updating the router tests when the algorithm changes.
