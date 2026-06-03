---
title: Shared Model Profile Registry
description: Schema, active entries, optional adoption protocol, and quota semantics for sk-prompt/assets/model-profiles.json.
---

# Shared Model Profile Registry

## Purpose

`sk-prompt/assets/model-profiles.json` is the cross-CLI source of truth for the user's small-model rotation.

The registry is data, not routing code.

CLI skills may read it for model facts, context lengths, quota-pool labels, fallback targets, and prompt-framework recommendations.

**Architecture note:** this JSON holds the DATA layer. Per-model prompt-crafting prose (framework rationale, density guidance, fixture evidence) lives in `sk-prompt-small-model/references/models/<id>.md`. The small-model skill is the model-craft hub; this registry is the lookup anchor.

The registry currently contains 8 active models plus 2 optional unverified stubs.

The active small-model rotation is:

- SWE-1.6
- DeepSeek-v4-pro
- Kimi-k2.6
- Qwen3.6
- GLM-5.1
- MiniMax-M3
- MiniMax-2.7
- MiMo-V2.5-Pro

The optional stubs are present for future adoption, but they are not active routing targets today:

- optional Claude Haiku stub
- optional Gemini Flash stub

Frontier models (gpt-5.5, Opus, Sonnet) remain out of scope.

Each model declares an `executors` array — one item per dispatch path. A model with multiple paths (DeepSeek-v4-pro is the canonical example: cli-devin → Cognition Pro, cli-opencode → DeepSeek API direct, cli-opencode → opencode-go) lists each path as a separate entry with its own `provider` and `quota_pool` so the fallback engine can pick a different pool when one is exhausted. `primary_quota_pool` records the preferred path.

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
- `glm-5.1`
- `minimax-m3`
- `minimax-2.7`
- `mimo-v2.5-pro`
- `haiku`
- `gemini-flash`

Use `id` in fallback targets and tests.

Do not use display names in routing.

### `executors[].provider`

Provider label for one dispatch path.

Provider is nested under each `executors[]` entry, not at the model top level.

Each executor path declares its own `executor`, `provider`, `quota_pool`, `status`, and `notes`.

Examples:

- `cognition`
- `deepseek-api`
- `opencode-go`
- `minimax-coding-plan`
- `minimax`
- `xiaomi-token-plan-ams`
- `anthropic`
- `google`

Provider is not the quota key.

Use `executors[].quota_pool` and `primary_quota_pool` for fallback decisions.

### `context_length`

Maximum context window in tokens when verified for this workflow.

Active entries:

- SWE-1.6: `128000`
- DeepSeek-v4-pro: `64000`
- Kimi-k2.6: `200000`
- Qwen3.6: `32000`
- GLM-5.1: `128000`
- MiniMax-M3: `null` (unverified at time of registry entry)
- MiniMax-2.7: `204800`
- MiMo-V2.5-Pro: `1000000`

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

### `executors[].quota_pool` and `primary_quota_pool`

`executors[].quota_pool` is the quota bucket used by that specific dispatch path.

`primary_quota_pool` is the model-level preferred quota bucket and points to the preferred executor path.

There is no model-level `quota_pool` field.

Current allowed labels:

- `cognition-free`
- `cognition-pro`
- `opencode-go`
- `deepseek-api`
- `minimax-token-plan`
- `minimax-api`
- `xiaomi-token-plan`
- `anthropic`
- `google`

Fallback routing compares quota pools, not provider display names.

Same-pool fallback is rejected.

Different-pool fallback is allowed only when `fallback_target` is populated.

### `fallback_target`

One-step fallback target by registry `id`.

Most active entries keep this `null` by design so no model silently rotates.

`minimax-m3` points to `minimax-2.7` (same billing relationship; different slug).

Operators may populate other targets when an optional stub is adopted.

### `free_tier`

Boolean flag for whether the active dispatch is free-tier.

Current value:

- SWE-1.6: `true`
- all others: `false`

This flag is descriptive.

It does not replace executor quota-pool routing.

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

Optional stubs and models without measured dispatches may keep it `null`.

### `status`

Lifecycle state.

Current values:

- `active`
- `optional-unverified`

Only `active` models are in the current rotation.

Optional stubs exist so adoption can be metadata-first.

### `capability`

Optional block present on models that have executor-level variant/format metadata.

Currently used by: `minimax-m3`, `minimax-2.7`, `mimo-v2.5-pro`.

Sub-fields:

| Sub-field | Meaning |
| --- | --- |
| `model_slug` | The exact slug passed to the executor (`provider/model-id`). |
| `default_variant` | Dispatch-layer default when `--variant` is applicable. |
| `variant_flag` | Flag name used by the executor CLI to forward the variant. |
| `agent_policy` | Whether `--agent` should be omitted, forwarded, or left as default. |
| `format_mode` | Executor output format (e.g. `json` for normalized cost/latency envelope). |
| `quota_pool` | Echoes the model's `primary_quota_pool` for capability-default convenience. |
| `variant_status` | Whether `--variant` forwarding is confirmed, unverified, or omitted by default. |
| `notes` | Operator notes specific to this executor path. |

### `recommended_frameworks`

Per-model prompt-framework recommendation, backed by benchmark evidence where available.

This field captures the **what** (framework ids, density) and **why** (evidence provenance). Prose rationale and fixture details live in the corresponding `sk-prompt-small-model/references/models/<id>.md` file.

Sub-fields:

| Sub-field | Type | Meaning |
| --- | --- | --- |
| `primary` | string | Recommended framework id (lowercase). The default choice for this model. |
| `fallback` | string \| null | Framework to use when the primary is unavailable or inappropriate. `null` means no verified fallback. |
| `avoid` | array of strings | Framework ids that perform measurably worse on this model. Do not use these without explicit operator override. |
| `preplanning_density` | `"lean"` \| `"medium"` \| `"dense"` | How much pre-planning content to include before the main prompt body. `lean` = minimal scaffolding; `medium` = structured goals/steps; `dense` = full guardrail-heavy preamble. |
| `evidence.benchmark` | string \| null | Packet id that produced the benchmark data (e.g. `"126/004"`). `null` means no dedicated benchmark run. |
| `evidence.primary_score` | number \| null | Aggregate score for the primary framework from the benchmark. Range is framework-dependent; null when no benchmark. |
| `evidence.fallback_score` | number \| null | Aggregate score for the fallback framework from the benchmark. null when no benchmark or no fallback. |
| `evidence.sample` | string | Short prose describing the benchmark sample (e.g. number of fixtures, model variant used). |
| `evidence.confidence` | `"low"` \| `"medium"` \| `"high"` | Confidence in the recommendation. `low` = no dedicated benchmark; `medium` = limited fixtures; `high` = strong multi-run evidence. |
| `profile_ref` | string | Relative path to the per-model prose file in the small-model skill. |
| `carried_from` | string (optional) | When `status` is `"carried"`, the id of the source model whose benchmark data was transferred. |
| `status` | `"empirical"` \| `"carried"` \| `"default-unverified"` | Data provenance. `empirical` = own benchmark run; `carried` = transferred from a related model with explicit note; `default-unverified` = no benchmark, falls back to rcaf as safe default. |

## The 8 Active Models

| Model | ID | Primary Framework | Density | Evidence Confidence | Status |
| --- | --- | --- | --- | --- | --- |
| SWE-1.6 | `swe-1.6` | rcaf | medium | low | `active` |
| DeepSeek v4 Pro | `deepseek-v4-pro` | rcaf | medium | low | `active` |
| Kimi k2.6 | `kimi-k2.6` | rcaf | medium | low | `active` |
| Qwen3.6 | `qwen3.6` | rcaf | medium | low | `active` |
| GLM-5.1 | `glm-5.1` | rcaf | medium | low | `active` |
| MiniMax-M3 | `minimax-m3` | tidd-ec | dense | medium (carried from minimax-2.7) | `active` |
| MiniMax-2.7 | `minimax-2.7` | tidd-ec | dense | medium | `active` |
| MiMo-V2.5-Pro | `mimo-v2.5-pro` | costar | lean | high | `active` |

### SWE-1.6

Use SWE-1.6 for context gathering, simple-to-medium code tasks, and clearly bounded tool work.

It is the only active `cognition-free` entry.

It remains available when Cognition Pro quota is exhausted.

Prompt framework: rcaf (default-unverified). No dedicated benchmark; the model contract mandates explicit caller-side pre-planning, which aligns with rcaf structure. star is the verified fallback shape when rcaf cannot apply.

### DeepSeek-v4-pro

Use DeepSeek-v4-pro for complex reasoning, root-cause debugging, and architecture-heavy code work.

It uses the shared `cognition-pro` pool.

That means it is not a safe automatic fallback for another Cognition Pro model during pool exhaustion.

Prompt framework: rcaf (default-unverified). No dedicated benchmark run; medium density matches the reasoning depth this model targets.

### Kimi-k2.6

Use Kimi-k2.6 when the task shape is dominated by context size.

It is one of the largest context windows in this registry (200k).

It also uses `cognition-pro`.

Give it timeout headroom for complex fixtures.

Prompt framework: rcaf (default-unverified). No dedicated benchmark run; medium density.

### Qwen3.6

Use Qwen3.6 for bounded small-model coding and cost-conscious iteration.

It has the smallest active context length (32k).

Give it tight scope and avoid asking it to infer missing architecture.

Prompt framework: rcaf (default-unverified). No dedicated benchmark run; medium density with a tight context budget.

### GLM-5.1

Use GLM-5.1 for long-context structured reasoning and broad multi-file synthesis.

It is available via both cli-devin (Cognition Pro) and cli-opencode (opencode-go).

Prompt framework: rcaf (default-unverified). No dedicated benchmark run; medium density.

### MiniMax-M3

Use MiniMax-M3 as the default MiniMax rotation entry on the Token Plan subscription.

It falls back to `minimax-2.7` when the M3 slug is unavailable on the account tier.

Prompt framework: tidd-ec + dense pre-planning, carried from `minimax-2.7` benchmark (120/003, 7-fixture rig, primary score 0.767, fallback rcaf score 0.742). tidd-ec's guardrail-heavy framing consistently outperforms lighter frameworks on MiniMax models.

### MiniMax-2.7

Use MiniMax-2.7 as the confirmed MiniMax Token Plan highspeed fallback.

The live slug `minimax-coding-plan/MiniMax-M2.7-highspeed` is confirmed on opencode 1.15.13.

Prompt framework: tidd-ec + dense pre-planning, empirical (120/003, 7-fixture rig, primary score 0.767, fallback rcaf score 0.742). This is the benchmark source that minimax-m3 carries from.

### MiMo-V2.5-Pro

Use MiMo-V2.5-Pro for large-context agentic tasks and token-efficient multi-step work.

It has the largest context window in the active rotation (1,000,000 tokens).

Dispatch always with `--variant high` (confirmed accepted on opencode 1.15.13).

Prompt framework: costar + lean pre-planning, empirical (126/004, 10/10 real runs at `--variant high`, primary score 1.0, fallback race score 0.9934). Frame prompts for output format and brevity — avoid tidd-ec and cidi (both ranked last in the benchmark).

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
5. Keep `primary_quota_pool: "anthropic"` and the executor `quota_pool: "anthropic"` unless the billing route changes.
6. Run a model-specific prompt-framework benchmark and populate `recommended_frameworks`.
7. Optionally set `fallback_target: "haiku"` on source models that should route there.
8. Re-run `jq empty sk-prompt/assets/model-profiles.json`.
9. Run fallback-router tests with the populated target.
10. Re-index the advisor so discovery picks up the new routing state.

### Gemini Flash Adoption Checklist

1. Populate the `gemini-flash` stub entry's unverified fields.
2. Confirm the runtime model id used by the actual executor.
3. Confirm `context_length` from the executor's current docs or live model list.
4. Measure or estimate `avg_iter_wall_clock_min` from real dispatches.
5. Keep `primary_quota_pool: "google"` and the executor `quota_pool: "google"` unless the billing route changes.
6. Run a model-specific prompt-framework benchmark and populate `recommended_frameworks`.
7. Optionally set `fallback_target: "gemini-flash"` on source models that should route there.
8. Re-run `jq empty sk-prompt/assets/model-profiles.json`.
9. Run fallback-router tests with the populated target.
10. Re-index the advisor so discovery picks up the new routing state.

## Quota Pool Semantics

Quota pools model exhaustion boundaries.

They are deliberately coarser than model ids.

If one model in a pool fails because the pool is exhausted, another model in the same pool is expected to fail too.

Current pools:

| Pool | Members | Meaning |
| --- | --- | --- |
| `cognition-free` | `swe-1.6` | Devin/Cognition free-tier route. |
| `cognition-pro` | `deepseek-v4-pro`, `kimi-k2.6`, `glm-5.1` (via cli-devin) | Shared paid Cognition Pro route. |
| `opencode-go` | `deepseek-v4-pro`, `kimi-k2.6`, `qwen3.6`, `glm-5.1` (via cli-opencode) | Shared opencode-go credit pool. |
| `deepseek-api` | `deepseek-v4-pro` (direct API path) | Pay-per-token DeepSeek direct API. |
| `minimax-token-plan` | `minimax-m3`, `minimax-2.7` | MiniMax Token Plan subscription. |
| `minimax-api` | `minimax-2.7` (direct API path) | Pay-per-token MiniMax direct API. |
| `xiaomi-token-plan` | `mimo-v2.5-pro` | Xiaomi Token Plan (Europe) subscription. |
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
8. Assign the correct executor `quota_pool` values and model-level `primary_quota_pool`.
9. Leave `fallback_target: null` unless the operator explicitly wants fallback.
10. Fill strengths and weaknesses with operational facts.
11. Run a prompt-framework benchmark (or carry from a related model with `carried_from`) and populate `recommended_frameworks`.
12. Set `status: "active"` only after a real dispatch succeeds.
13. Validate JSON with `jq empty`.
14. Run fallback-router tests if fallback fields changed.
15. Update CLI skill docs only by pointing back to this registry.
16. Re-index the advisor after changing routing-relevant fields.

## Compatibility Rules

The registry must remain backward compatible for readers that only need model facts.

Do not remove required fields.

Do not rename ids without a migration note.

Do not make optional stubs active without verification.

Do not add frontier models to satisfy old wording.

Do not encode long policy prose in JSON.

Put prose in this reference doc.

Per-model prompt-craft prose belongs in `sk-prompt-small-model/references/models/<id>.md`, not here.

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
10
```

Active ids:

```bash
jq -r '.models[] | select(.status == "active") | .id' .opencode/skills/sk-prompt/assets/model-profiles.json
```

Expected set:

```text
swe-1.6
deepseek-v4-pro
kimi-k2.6
qwen3.6
glm-5.1
minimax-m3
minimax-2.7
mimo-v2.5-pro
```

Models with recommended_frameworks:

```bash
jq '[.models[]|select(.recommended_frameworks)]|length' .opencode/skills/sk-prompt/assets/model-profiles.json
```

Expected:

```text
8
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

The `recommended_frameworks` field is additive and optional for stubs; it is required when promoting a stub to `active` status. Use `"status": "default-unverified"` and rcaf as the safe default when no benchmark exists.
