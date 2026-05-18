---
title: Shared Model Profile Registry
description: Schema, active entries, optional adoption protocol, and quota semantics for sk-prompt/assets/model-profiles.json.
---

# Shared Model Profile Registry

## Purpose

`sk-prompt/assets/model-profiles.json` is the cross-CLI source of truth for the user's small-model rotation.

The registry is data, not routing code.

CLI skills may read it for model facts, context lengths, quota-pool labels, and future fallback targets.

The active Phase 005 scope is intentionally slim:

- SWE-1.6
- DeepSeek-v4-pro
- Kimi-k2.6
- Qwen3.6
- optional Claude Haiku stub
- optional Gemini Flash stub

Do not add GLM-5.1, gpt-5.5, Opus, or Sonnet in this packet.

Those models were part of an earlier research shape, but the user confirmed a small-only rotation on 2026-05-18.

## Source Evidence

| Evidence | Meaning |
| --- | --- |
| `research.md:414-452` | RQ3 identifies per-model profile schema and lookup as reusable small-model patterns. |
| `research.md:458-484` | RQ3 identifies Bayesian tool scoring with Laplace smoothing. |
| `research.md:502-520` | RQ3 captures the original escalation-provider primitive. |
| `research.md:526-546` | iter-008 chooses a shared JSON model-profile asset, later slimmed by user direction. |
| `research.md:587-600` | iter-008 places Bayesian scoring in CLI iteration recipes. |
| `005-shared-intelligence/decision-record.md` | ADR-001 revises escalation into quota-pool-aware fallback for a small-only ecosystem. |

## Schema Fields

Each model entry has the same field shape.

Fields are deliberately simple JSON values so shell, TypeScript, Python, and docs can consume the registry without a custom parser.

### `id`

Stable lowercase model identifier.

Examples:

- `swe-1.6`
- `deepseek-v4-pro`
- `kimi-k2.6`
- `qwen3.6`
- `haiku`
- `gemini-flash`

Use `id` in fallback targets and tests.

Do not use display names in routing.

### `provider`

Provider label for humans and audit logs.

Examples:

- `cognition`
- `deepseek`
- `moonshot`
- `alibaba`
- `anthropic`
- `google`

Provider is not the quota key.

Use `quota_pool` for fallback decisions.

### `context_length`

Maximum context window in tokens when verified for this workflow.

The four active entries reference Phase 004 `cli-devin/assets/per-model-budgets.json` values:

- SWE-1.6: `128000`
- DeepSeek-v4-pro: `64000`
- Kimi-k2.6: `200000`
- Qwen3.6: `32000`

Optional stubs may keep this field `null` until adopted and verified.

### `tool_calling`

Tool-calling mode expected by the CLI runtime.

Current value:

- `native`

Use a concrete enum value when a future provider requires it.

Do not infer a custom tool format from the provider name.

### `chat_template`

Prompt/chat template identifier.

Current value:

- `default`

This stays broad until a provider-specific template becomes operationally necessary.

### `quota_pool`

The quota bucket used by the fallback engine.

Current allowed labels:

- `cognition-free`
- `cognition-pro`
- `anthropic`
- `google`

Fallback routing compares this field, not provider display name.

Same-pool fallback is rejected.

Different-pool fallback is allowed only when `fallback_target` is populated.

### `fallback_target`

One-step fallback target by registry `id`.

Default for all Phase 005 entries:

- `null`

This is intentional.

No model should silently rotate today.

Operators may populate this later when Haiku or Gemini Flash is adopted.

### `free_tier`

Boolean flag for whether the active dispatch is free-tier.

Current value:

- SWE-1.6: `true`
- all others: `false`

This flag is descriptive.

It does not replace `quota_pool`.

### `strengths`

Array of short capability notes.

Keep entries concrete.

Good:

- `large context`
- `root-cause debugging`
- `tool-use friendly`

Avoid vague claims such as "best" or "smart".

### `weaknesses`

Array of operational limits.

Good:

- `uses shared Cognition Pro pool`
- `needs explicit pre-planning`
- `smaller context window`

Weaknesses should help dispatchers choose constraints.

They should not be marketing copy.

### `avg_iter_wall_clock_min`

Approximate average iteration wall-clock time in minutes.

This is an operator planning hint.

It is not a timeout.

Optional stubs may keep it `null` until measured.

### `status`

Lifecycle state.

Current values:

- `active`
- `optional-unverified`

Only `active` models are in the current rotation.

Optional stubs exist so adoption can be metadata-first.

## The 4 Required Models

| Model | ID | Provider | Context | Tool calling | Quota pool | Fallback | Free tier | Status |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| SWE-1.6 | `swe-1.6` | `cognition` | 128000 | `native` | `cognition-free` | `null` | yes | `active` |
| DeepSeek v4 Pro | `deepseek-v4-pro` | `deepseek` | 64000 | `native` | `cognition-pro` | `null` | no | `active` |
| Kimi k2.6 | `kimi-k2.6` | `moonshot` | 200000 | `native` | `cognition-pro` | `null` | no | `active` |
| Qwen3.6 | `qwen3.6` | `alibaba` | 32000 | `native` | `cognition-pro` | `null` | no | `active` |

### SWE-1.6

Use SWE-1.6 for context gathering, simple-to-medium code tasks, and clearly bounded tool work.

It is the only active `cognition-free` entry.

It remains available when Cognition Pro quota is exhausted.

It still needs explicit task shaping.

Give it file anchors, acceptance criteria, and verification commands.

### DeepSeek-v4-pro

Use DeepSeek-v4-pro for complex reasoning, root-cause debugging, and architecture-heavy code work.

It uses the shared `cognition-pro` pool.

That means it is not a safe automatic fallback for another Cognition Pro model during pool exhaustion.

### Kimi-k2.6

Use Kimi-k2.6 when the task shape is dominated by context size.

It is the largest active context window in this registry.

It also uses `cognition-pro`.

Give it timeout headroom for complex fixtures.

### Qwen3.6

Use Qwen3.6 for bounded small-model coding and cost-conscious iteration.

It has the smallest active context length.

Give it tight scope and avoid asking it to infer missing architecture.

## The 2 Optional Stubs

| Model | ID | Provider | Context | Quota pool | Fallback | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Haiku | `haiku` | `anthropic` | `null` | `anthropic` | `null` | `optional-unverified` |
| Gemini Flash | `gemini-flash` | `google` | `null` | `google` | `null` | `optional-unverified` |

Optional stubs are present for future adoption.

They are not active routing targets today.

Do not dispatch to them until the operator confirms credentials, model id, context length, and expected CLI surface.

### Haiku Adoption Checklist

1. Populate the `haiku` stub entry's unverified fields.
2. Confirm the runtime model id used by the actual executor.
3. Confirm `context_length` from the executor's current docs or live model list.
4. Measure or estimate `avg_iter_wall_clock_min` from real dispatches.
5. Keep `quota_pool: "anthropic"` unless the billing route changes.
6. Optionally set `fallback_target: "haiku"` on source models that should route there.
7. Re-run `jq empty sk-prompt/assets/model-profiles.json`.
8. Run fallback-router tests with the populated target.
9. Re-index the advisor so discovery picks up the new routing state.

### Gemini Flash Adoption Checklist

1. Populate the `gemini-flash` stub entry's unverified fields.
2. Confirm the runtime model id used by the actual executor.
3. Confirm `context_length` from the executor's current docs or live model list.
4. Measure or estimate `avg_iter_wall_clock_min` from real dispatches.
5. Keep `quota_pool: "google"` unless the billing route changes.
6. Optionally set `fallback_target: "gemini-flash"` on source models that should route there.
7. Re-run `jq empty sk-prompt/assets/model-profiles.json`.
8. Run fallback-router tests with the populated target.
9. Re-index the advisor so discovery picks up the new routing state.

## Quota Pool Semantics

Quota pools model exhaustion boundaries.

They are deliberately coarser than model ids.

If one model in a pool fails because the pool is exhausted, another model in the same pool is expected to fail too.

Current pools:

| Pool | Members | Meaning |
| --- | --- | --- |
| `cognition-free` | `swe-1.6` | Devin/Cognition free-tier route. |
| `cognition-pro` | `deepseek-v4-pro`, `kimi-k2.6`, `qwen3.6` | Shared paid Cognition Pro route. |
| `anthropic` | `haiku` | Optional separate provider pool. |
| `google` | `gemini-flash` | Optional separate provider pool. |

Fallback is one step.

No chain should recurse beyond the configured target.

Same-pool fallback is rejected even if a target is configured.

Missing target means fail-fast.

Unknown target means fail-fast.

This keeps quota behavior honest.

## Update Protocol For New Models

Use this protocol when adding a model or promoting an optional stub.

1. Confirm the model is in the user's actual rotation.
2. Confirm the executor that will dispatch it.
3. Add or update one registry entry.
4. Use a stable lowercase `id`.
5. Set the verified `context_length`.
6. Set `tool_calling` from runtime behavior.
7. Set `chat_template` only when known.
8. Assign the correct `quota_pool`.
9. Leave `fallback_target: null` unless the operator explicitly wants fallback.
10. Fill strengths and weaknesses with operational facts.
11. Set `status: "active"` only after a real dispatch succeeds.
12. Validate JSON with `jq empty`.
13. Run fallback-router tests if fallback fields changed.
14. Update CLI skill docs only by pointing back to this registry.
15. Re-index the advisor after changing routing-relevant fields.

## Compatibility Rules

The registry must remain backward compatible for readers that only need model facts.

Do not remove required fields.

Do not rename ids without a migration note.

Do not make optional stubs active without verification.

Do not add frontier models to satisfy old Phase 005 wording.

Do not encode long policy prose in JSON.

Put prose in this reference doc.

## Validation Commands

Run:

```bash
jq empty .opencode/skills/sk-prompt/assets/model-profiles.json
```

Count entries:

```bash
jq '.models | length' .opencode/skills/sk-prompt/assets/model-profiles.json
```

Expected:

```text
6
```

Required active ids:

```bash
jq -r '.models[] | select(.status == "active") | .id' .opencode/skills/sk-prompt/assets/model-profiles.json
```

Expected set:

```text
swe-1.6
deepseek-v4-pro
kimi-k2.6
qwen3.6
```

Optional ids:

```bash
jq -r '.models[] | select(.status == "optional-unverified") | .id' .opencode/skills/sk-prompt/assets/model-profiles.json
```

Expected set:

```text
haiku
gemini-flash
```

## Operator Notes

The registry is not a small-to-frontier escalator.

It supports a small-only ecosystem.

The safe default is fail-fast.

Fallback becomes active only when a source model's `fallback_target` points to a different quota pool.

Until Haiku or Gemini Flash is adopted, all active models should keep `fallback_target: null`.
