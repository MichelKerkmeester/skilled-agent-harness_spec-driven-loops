---
title: Quota-Pool-Aware Fallback
description: One-step small-model fallback rules for Cognition free, Cognition Pro, Anthropic, and Google quota pools.
---

# Quota-Pool-Aware Fallback

## Overview

Phase 005 ships a quota-pool-aware fallback contract for the user's small-only model ecosystem.

The fallback engine reads `sk-prompt-small-model/assets/model-profiles.json`.

It uses two fields:

- `quota_pool`
- `fallback_target`

Fallback is one step.

Fallback is opt-in.

Fallback is off today because every active model has `fallback_target: null`.

The default behavior is fail-fast with a message naming the exhausted pool.

---

## Why This Is NOT A Tier Escalator

This design replaced the older small-to-frontier escalation idea.

The user does not run frontier models in this rotation.

No gpt-5.5, Opus, Sonnet, or GLM-5.1 entry belongs in the Phase 005 registry.

The fallback engine should not invent a larger model.

The fallback engine should not burn another model from an exhausted quota pool.

The fallback engine should not silently switch providers.

It may route to a configured separate-pool target later, after the operator adopts Haiku or Gemini Flash.

### ADR-001 Rationale

ADR-001 says:

> The user's actual model rotation is small-only: SWE-1.6 (Cognition free), DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 (all sharing one Cognition Pro pool via cli-opencode), with optional future Claude Haiku and Gemini Flash. There are no frontier models (Opus / Sonnet / gpt-5.5 / GLM-5.1) in scope to escalate to. The original Phase D plan assumed a small→frontier escalation chain — that assumption is gone. Naïve "pick another model" routing on hard-fail would just pick a same-pool sibling (e.g. SWE-1.6 fails → fall back to DeepSeek, but DeepSeek also fails because it's the same Cognition account) — accomplishing nothing while spending more Pro quota.

Implementation follows that rationale.

The safe result is explicit failure when no configured separate-pool target exists.

---

## Pool-Membership Table

| Quota pool | Active members | Optional members | Notes |
| --- | --- | --- | --- |
| `cognition-free` | `swe-1.6` | none | Free-tier Cognition route. |
| `cognition-pro` | `deepseek-v4-pro`, `kimi-k2.6`, `qwen3.6` | none | Shared Cognition Pro pool. |
| `anthropic` | none | `haiku` | Optional separate provider pool. |
| `google` | none | `gemini-flash` | Optional separate provider pool. |

Pool labels are operational boundaries.

They are not display names.

They decide whether fallback is allowed.

---

## Fallback Decision Algorithm

Input:

- `failedModelId`
- parsed registry from `sk-prompt-small-model/assets/model-profiles.json`

Output:

```typescript
{ action: "fallback" | "fail-fast", target?: string, reason: string }
```

Algorithm:

1. Find the failed model by `id`.
2. If the failed model is unknown, return `fail-fast`.
3. Read the failed model's `quota_pool`.
4. Read the failed model's `fallback_target`.
5. If `fallback_target` is `null`, return `fail-fast`.
6. Find the target model by `id`.
7. If the target model is unknown, return `fail-fast`.
8. Compare `target.quota_pool` with `failed.quota_pool`.
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
  return failFast(`${failed.quota_pool} pool exhausted, no separate-pool fallback configured`);
}

const target = registry.models.find((model) => model.id === failed.fallback_target);
if (!target) return failFast("configured fallback is not in the registry");

if (target.quota_pool === failed.quota_pool) {
  return failFast("same-pool fallback rejected");
}

return fallback(target.id);
```

The production helper is:

```text
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts
```

---

## Worked Examples

### SWE-1.6 Default

Registry:

```json
{
  "id": "swe-1.6",
  "quota_pool": "cognition-free",
  "fallback_target": null
}
```

Result:

```json
{
  "action": "fail-fast",
  "reason": "cognition-free pool exhausted, no separate-pool fallback configured for swe-1.6"
}
```

This is correct today.

No Haiku or Gemini Flash route is active.

### SWE-1.6 With Haiku Adopted

Registry change:

```json
{
  "id": "swe-1.6",
  "quota_pool": "cognition-free",
  "fallback_target": "haiku"
}
```

Target:

```json
{
  "id": "haiku",
  "quota_pool": "anthropic",
  "status": "active"
}
```

Result:

```json
{
  "action": "fallback",
  "target": "haiku"
}
```

This is allowed because the target is in a separate pool.

### SWE-1.6 With Gemini Flash Adopted

Registry change:

```json
{
  "id": "swe-1.6",
  "fallback_target": "gemini-flash"
}
```

Target:

```json
{
  "id": "gemini-flash",
  "quota_pool": "google",
  "status": "active"
}
```

Result:

```json
{
  "action": "fallback",
  "target": "gemini-flash"
}
```

This is allowed after adoption.

### DeepSeek-v4-pro Default

Registry:

```json
{
  "id": "deepseek-v4-pro",
  "quota_pool": "cognition-pro",
  "fallback_target": null
}
```

Result:

```json
{
  "action": "fail-fast",
  "reason": "cognition-pro pool exhausted, no separate-pool fallback configured for deepseek-v4-pro"
}
```

This prevents a useless retry through Kimi or Qwen.

### DeepSeek-v4-pro To Kimi-k2.6

Registry change:

```json
{
  "id": "deepseek-v4-pro",
  "quota_pool": "cognition-pro",
  "fallback_target": "kimi-k2.6"
}
```

Target:

```json
{
  "id": "kimi-k2.6",
  "quota_pool": "cognition-pro"
}
```

Result:

```json
{
  "action": "fail-fast",
  "reason": "cognition-pro pool exhausted, fallback target kimi-k2.6 shares the same pool; same-pool fallback rejected"
}
```

Same-pool siblings are rejected.

### Kimi-k2.6 Default

Registry:

```json
{
  "id": "kimi-k2.6",
  "quota_pool": "cognition-pro",
  "fallback_target": null
}
```

Result:

```json
{
  "action": "fail-fast",
  "reason": "cognition-pro pool exhausted, no separate-pool fallback configured for kimi-k2.6"
}
```

Kimi shares the same Pro pool as DeepSeek and Qwen.

### Qwen3.6 Default

Registry:

```json
{
  "id": "qwen3.6",
  "quota_pool": "cognition-pro",
  "fallback_target": null
}
```

Result:

```json
{
  "action": "fail-fast",
  "reason": "cognition-pro pool exhausted, no separate-pool fallback configured for qwen3.6"
}
```

Qwen's small context window is not the issue when the Pro pool is exhausted.

The pool is the boundary.

### Haiku To Gemini Flash

Registry change:

```json
{
  "id": "haiku",
  "quota_pool": "anthropic",
  "fallback_target": "gemini-flash"
}
```

Target:

```json
{
  "id": "gemini-flash",
  "quota_pool": "google"
}
```

Result:

```json
{
  "action": "fallback",
  "target": "gemini-flash"
}
```

This is a separate-pool fallback.

It is only relevant after optional stubs become active.

---

## Adoption Checklist For Haiku

1. Confirm Haiku is actually in the user's dispatch rotation.
2. Confirm the exact executor and model id.
3. Populate the `haiku` stub in `sk-prompt-small-model/assets/model-profiles.json`.
4. Set `context_length` from current official/runtime information.
5. Set `avg_iter_wall_clock_min` from a measured iteration.
6. Change `status` from `optional-unverified` to `active`.
7. Set source model `fallback_target` fields only where fallback is desired.
8. Run `jq empty` on the registry.
9. Run `fallback-router` unit tests.
10. Re-index the advisor.

---

## Adoption Checklist For Gemini Flash

1. Confirm Gemini Flash is actually in the user's dispatch rotation.
2. Confirm the exact executor and model id.
3. Populate the `gemini-flash` stub in `sk-prompt-small-model/assets/model-profiles.json`.
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

Example:

```text
cognition-free pool exhausted, no separate-pool fallback configured for swe-1.6
```

### Same-Pool Target Rejected

```text
{quota_pool} pool exhausted, fallback target {target_id} shares the same pool; same-pool fallback rejected
```

Example:

```text
cognition-pro pool exhausted, fallback target qwen3.6 shares the same pool; same-pool fallback rejected
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

## Recipe Contract

The shipped `--agent-config` recipes do NOT carry a `fallback_chain` field. Devin's strict `--agent-config` parser rejects unknown top-level fields (the same constraint that defers `mcp_servers`), so the recipe-level fallback declaration is deferred until Devin supports custom agent-config fields. The intended shape was:

```json
{
  "fallback_chain": []
}
```

When supplied through a Devin-supported channel, the field is optional and defaults to an empty array. It is one-step max. It does not override the registry.

Recipe instructions tell workers to consult registry `fallback_target` semantics.

The registry remains the source of truth.

---

## Verification

Focused tests:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/deep-loop/fallback-router.vitest.ts
```

Empirical simulations to keep:

- default `resolveFallback("swe-1.6", registry)` fails fast
- in-memory `swe-1.6.fallback_target = "haiku"` routes to Haiku
- default `resolveFallback("deepseek-v4-pro", registry)` fails fast
- same-pool `deepseek-v4-pro -> kimi-k2.6` is rejected

---

## Operator Rules

Fail-fast is not a bug.

Fail-fast is the honest default until a separate-pool target is adopted.

Do not hide quota exhaustion behind retries.

Do not route within the Cognition Pro pool when that pool is exhausted.

Do not add frontier models to make fallback look more capable.

Do not make fallback recursive.

Do not change this file without updating the router tests when the algorithm changes.
