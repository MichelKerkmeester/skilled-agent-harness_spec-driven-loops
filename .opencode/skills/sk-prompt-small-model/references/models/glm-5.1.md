---
title: GLM-5.1 Prompt-Craft Profile
model_id: glm-5.1
profile_of: "../../../sk-prompt-small-model/assets/model-profiles.json"
status: default-unverified
last_benchmarked: "none"
---

# GLM-5.1 Prompt-Craft Profile

Single source of truth for how to prompt GLM-5.1. Framework choices mirror `recommended_frameworks` in [`model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) (the DATA source); executor mechanics (binary flags, invocation wrappers) live in `cli-opencode`.

---

## 1. OVERVIEW

### Purpose

This profile is the single source for how to prompt GLM-5.1, an agentic model dispatched through `cli-opencode` (opencode-go). It mirrors the `glm-5.1` entry in `model-profiles.json`, covering its framework, scaffold, and dispatch gotchas.

### When to Use

- Before dispatching GLM-5.1 through `cli-opencode`.
- When choosing its prompt framework and scaffold shape.
- When you need its dispatch gotchas (quota pool, no cross-pool fallback).

### Core Principle

RCAF + medium pre-planning: front-load explicit Role and Context for structured multi-file synthesis, but keep the Action tightly scoped — the 128k window is not a licence to broaden scope.

---

## 2. IDENTITY

| Field | Value |
| --- | --- |
| Model slug | `glm-5.1` |
| Context window | 128,000 tokens |
| Primary quota pool | `opencode-go` |
| Executor path | `cli-opencode` via provider `opencode-go` (opencode-go credit pool) |
| Average iteration wall-clock | ~16 min |
| Status | active |

GLM-5.1 is an agentic model dispatched via opencode-go. Context depth and structured reasoning across multi-file synthesis are the documented strengths; shared opencode-go pool exposure (with DeepSeek, Kimi, Qwen) is the primary weakness.

---

## 3. RECOMMENDED FRAMEWORK

| Attribute | Value |
| --- | --- |
| Primary | RCAF |
| Fallback | none |
| Avoid | none documented |
| Pre-planning density | medium |

These mirror the `recommended_frameworks` object for `glm-5.1` in `model-profiles.json`.

**Why RCAF / medium density:** RCAF (Role, Context, Action, Format) is the rotation-wide convention default for models without an empirical benchmark. It pairs well with medium pre-planning density — enough structured context so the model can plan ahead without overloading the prompt. GLM-5.1's documented strengths in structured reasoning and broad multi-file synthesis align with RCAF's explicit Role + Context front-loading.

**Counter-intuitive note:** Despite the 128k context window, do not expand scope to fill it. Broader context increases synthesis load; keep file anchors explicit and scope the Action block tightly. Longer is not better here.

No fallback framework is defined in `model-profiles.json`; if RCAF scaffolding feels too heavy for a narrow sub-task, narrow the prompt while preserving the RCAF fields rather than naming an unregistered fallback framework.

---

## 4. BENCHMARK EVIDENCE

No model-specific benchmark has been run for GLM-5.1. The `recommended_frameworks.evidence` block in `model-profiles.json` states `"sample": "no model-specific benchmark"`, `"confidence": "low"`, and `"benchmark": null`.

**Reasoned default (status: default-unverified):**

RCAF at medium pre-planning density is the convention default for the entire small-model rotation. It is applied to GLM-5.1 for the following reasons:

1. The model is described as agentic with structured reasoning and multi-file synthesis strengths — capabilities that benefit from explicit Role and Context framing.
2. Medium density avoids under-specifying the task (risking drift) while staying within the 128k window comfortably for typical iteration payloads.
3. No counter-evidence exists from any sibling benchmark (e.g., benchmark 003, benchmark 004) that would argue for a different framework on a similarly-scoped structured-reasoning model.

The discriminator for a future benchmark should be **format adherence** (does RCAF produce more structured, verifiable outputs than plain instructions?) since GLM-5.1's stated strengths suggest it can follow structured roles, but that has not been measured.

---

## 5. TUNED TEMPLATE SNIPPET

For the generic RCAF framework definition — including field semantics, scoring criteria, and pattern variants — see [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md).

The scaffold below is the GLM-5.1-specific instantiation. Copy and fill the bracketed tokens before dispatch.

```
## Role
You are [concise role description, e.g. "a senior TypeScript engineer specializing in API design"].

## Context
[2–4 sentences of background. Include: the file or module being changed, what already exists, and why this change is needed. Anchor to specific file paths where relevant.]

Relevant files:
- [path/to/file-A.ts] — [one-line purpose]
- [path/to/file-B.ts] — [one-line purpose]

## Action
[Numbered step list. Each step is one concrete, verifiable operation. Keep total scope to what fits in a single iteration (~16 min wall-clock). No open-ended "improve" steps — prefer "add X to function Y in file Z".]

1. [First concrete step]
2. [Second concrete step]
3. ...

## Format
[Describe expected output shape: patch / inline edit / JSON / summary. Specify verification: "run `npm test` and report pass/fail", "confirm no TypeScript errors after the change". Omit if pure analysis task.]
```

**Pre-planning note (medium density):** Before issuing the Action steps, insert a brief context summary at the top of the prompt when the task spans more than two files: one sentence per file describing its role and the specific change target. This surfaces the model's planning assumptions early and reduces mid-iteration course corrections.

---

## 6. DISPATCH GOTCHAS

Source of truth for model-specific capability fields and flags: [`model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) entry `"id": "glm-5.1"`. Full invocation wrappers live in [`cli-opencode`](../../../cli-opencode/SKILL.md); this section does not own wrapper syntax.

| Field | Value | Notes |
| --- | --- | --- |
| `model_slug` | not set (no `capability` block) | Use the executor's model selector directly; no documented `MiniMax`-style slug override. Verify the live id with `opencode models opencode-go` before relying on a specific string. |
| `variant_flag` | not set | No `--variant` flag defined for this model. Omit. |
| `agent_policy` | not set | No documented `--agent` restriction. Confirm with the executor's `--help` before adding. |
| `format_mode` | not set | No `--format json` override required by default. Use executor default. |
| `quota_pool` | `opencode-go` | Shared across the opencode-go rotation (DeepSeek, Kimi, Qwen, GLM). Not an independent pool; monitor for exhaustion. |
| `fallback_target` | `null` | No cross-pool fallback registered in `model-profiles.json`. When both pools are exhausted, escalate to the operator rather than retrying. |

**Non-TTY automation rule (executor mechanic):** In any non-interactive automation context (CI, scripts, background agent dispatch), append `</dev/null` to the executor-owned invocation wrapper so the process does not hang waiting for terminal input. Use the full wrapper from [`cli-opencode`](../../../cli-opencode/SKILL.md), not this profile.

**Fallback target:** `null` — no automatic pool fallback is registered. When `opencode-go` is exhausted, do not retry on the same pool.

---

## 7. SEE ALSO

- [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) `#glm-5.1` — Authoritative capability fields, executor list, and `recommended_frameworks` object.
- [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) — Generic RCAF framework definition, scoring criteria, and all other supported frameworks.
- [`../../../cli-opencode/SKILL.md`](../../../cli-opencode/SKILL.md) — Executor card for the `cli-opencode` / opencode-go path.
- [`_index.md`](./_index.md) — Hub index listing all active small-model profiles and their framework status.
- Sibling default-unverified profiles with the same RCAF / medium baseline: [`deepseek-v4-pro.md`](./deepseek-v4-pro.md), [`kimi-k2.6.md`](./kimi-k2.6.md), [`qwen3.6.md`](./qwen3.6.md).
- **Executor quality card:** [`../../../cli-opencode/assets/prompt_quality_card.md`](../../../cli-opencode/assets/prompt_quality_card.md) — the model-selection table links to this profile; this closes the navigability round-trip.
