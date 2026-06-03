---
title: "Qwen3.6 Prompt-Craft Profile"
model_id: "qwen3.6"
profile_of: "../../../sk-prompt-small-model/assets/model-profiles.json"
status: "default-unverified"
last_benchmarked: "none"
---

# Qwen3.6 — Prompt-Craft Profile

Single source of truth for how to prompt `qwen3.6`. Framework choices mirror the `recommended_frameworks` entry in [`model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json); executor MECHANICS (binary flags, invocation wrappers, permissions, budgets) live in [`cli-opencode`](../../../cli-opencode/). See [`pattern-index.md`](../pattern-index.md) for the canonical locations of those patterns.

---

## 1. Identity

| Field | Value |
| --- | --- |
| Registry ID | `qwen3.6` |
| Context window | 32,000 tokens (SMALL — keep prompts tight) |
| Quota pool | `opencode-go` (sole pool; no cross-pool fallback) |
| Executor | `cli-opencode` only — provider `opencode-go` |
| Fallback target | none (`fallback_target: null` in registry) |
| Avg wall-clock / iter | ~12 min |

Qwen3.6 is available only via the `opencode-go` provider credits. There is no Devin/Cognition path and no alternative pool. With only 32k tokens of context, prompt economy is non-negotiable: keep role statements lean, anchor to specific files rather than full-file pastes, and truncate long evidence blocks with `[... truncated N tokens]` markers before dispatch.

---

## 2. Recommended Framework

**Primary:** RCAF  
**Fallback:** none  
**Avoid:** none specified  
**Pre-planning density:** MEDIUM

These values are drawn verbatim from the `recommended_frameworks` object for `qwen3.6` in [`model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) — that file is the DATA source of truth; this section records the rationale.

**Why RCAF as default:** RCAF (Role, Context, Action, Format) is the registry default for focused, bounded coding tasks on this unverified profile. Qwen3.6's strengths — "focused edits", "bounded analysis", "cost-conscious iteration" — align naturally with RCAF's tight four-element structure, which also minimises token overhead on a 32k window. The model has not been benchmarked against alternatives; RCAF is the convention default for unverified small coding models.

**Counter-intuitive note:** Unlike MiniMax models (which reward guardrail-heavy TIDD-EC + dense pre-planning), Qwen3.6 has a hard context ceiling. Dense instruction lists and elaborated Do/Don't blocks consume budget that should instead carry file-anchoring context. Use MEDIUM pre-planning density: one explicit plan section is enough; do not expand it to the TIDD-EC guardrail scaffold unless a future benchmark shows that pays off.

**No fallback framework is registered.** If RCAF output quality is insufficient for a specific task, escalate the task to a larger-context model (e.g., `kimi-k2.6` or `mimo-v2.5-pro`) rather than switching frameworks within Qwen3.6.

---

## 3. Benchmark Evidence

No model-specific benchmark has been run for `qwen3.6` as of this profile's authoring date.

**Registry state (verbatim):**

```json
"evidence": {
  "benchmark": null,
  "primary_score": null,
  "fallback_score": null,
  "sample": "no model-specific benchmark",
  "confidence": "low"
}
```

**Reasoned default:** RCAF at MEDIUM pre-planning density is the convention default for all unverified small coding models in this rotation (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, GLM-5.1 carry the same default). The discriminating constraint for Qwen3.6 specifically is its 32k window — the smallest in the active rotation. This makes RCAF's economy an asset rather than just a default: any framework that expands prompt length (TIDD-EC's instruction/guardrail blocks, COSTAR's audience/style elaborations) reduces the payload budget available for actual code and file context. Until a benchmark demonstrates otherwise, RCAF + MEDIUM density is the conservative and principled choice.

**When to re-evaluate:** If correctness failures are observed on multi-step tasks, consider a structured pre-plan section (closer to dense) or switching to a larger-context model. If a benchmark is run, update `model-profiles.json` first, then update sections 2 and 3 here to reflect the empirical result.

---

## 4. Tuned Template Snippet

The generic RCAF framework definition and scoring context live in [`patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) — do not copy that definition here; link to it.

Below is a Qwen3.6-tuned RCAF scaffold. It is executor-agnostic (no opencode invocation wrapper); apply the cli-opencode dispatch mechanics separately from [`cli-opencode`](../../../cli-opencode/).

```
## Role
You are a focused coding assistant. Work within the scope defined below — do not expand it.

## Context
Model: qwen3.6 | Context budget: 32k tokens (TIGHT)
File anchor: <absolute/path/to/file.ext> (lines X–Y)
Task summary (1–2 sentences): <what needs to change and why>

## Pre-plan (required — keep to ≤ 5 steps)
1. <step>
2. <step>
3. …

[Include only directly relevant code snippets. Truncate long blocks:
  // … truncated N tokens
Keep total prompt under ~18k tokens to leave room for model response.]

## Action
<Single imperative sentence: "Edit function foo in file X to do Y.">

Constraints:
- Touch only the files listed above
- If a required file is not anchored here, STOP and report it — do not guess paths
- Do not refactor outside the scope of this task

## Format
Return:
1. A summary of what was changed and why (2–4 sentences)
2. The diff or edited code block (exact file + line range)
3. If blocked: state the blocker explicitly — do not silently skip it
```

**Usage notes:**
- The `[... truncated N tokens]` pattern is mandatory when pasting evidence that exceeds ~2k tokens.
- Keep the Pre-plan to 5 steps or fewer; longer plans consume budget that belongs to file context.
- The Format section's "if blocked" clause is important on Qwen3.6: the small context window means the model may silently omit output rather than error. Making blocking behaviour explicit reduces silent failures.

---

## 5. Dispatch Gotchas

Source of truth for model-specific capability fields and flags: [`model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) entry `qwen3.6`. Full invocation wrappers live in [`cli-opencode`](../../../cli-opencode/SKILL.md); this profile records wrapper inputs, not wrapper syntax.

| Field | Value | Implication |
| --- | --- | --- |
| `model_slug` | (not set — no `capability` block) | Dispatch as `--model qwen3.6` via the `opencode-go` provider; confirm live slug with `opencode models opencode-go` |
| `variant_flag` | not applicable | No `--variant` flag registered for this model |
| `agent_policy` | not set | No explicit agent flag restriction documented; standard opencode-go conventions apply |
| `format_mode` | not set | No `--format json` requirement documented; use default output format |
| `quota_pool` | `opencode-go` | Shared pool with DeepSeek-v4-pro, Kimi-k2.6, GLM-5.1, and others; pool exhaustion has no cross-pool fallback for this model |
| `fallback_target` | `null` | If `opencode-go` credits are exhausted, there is NO automatic fallback — escalate manually to a model on a different pool |

**Non-TTY automation rule (executor mechanic):** Append `</dev/null` when dispatching in non-interactive (CI/pipeline) contexts. Use the full invocation wrapper from [`cli-opencode`](../../../cli-opencode/SKILL.md) rather than copying wrapper syntax into this profile.

**Context ceiling caution:** At 32k tokens, Qwen3.6 is the tightest-windowed model in the active rotation. Budget overruns result in truncated context, not an error — the model will silently work with whatever fits. Always pre-estimate prompt token count before dispatch and apply `[... truncated N tokens]` markers on any evidence block over ~2k tokens.

**Fallback target:** None (`fallback_target: null`). If `opencode-go` is exhausted or the task exceeds Qwen3.6's context ceiling, route manually to `kimi-k2.6` (200k context, `opencode-go`) or `mimo-v2.5-pro` (1M context, `xiaomi-token-plan`).

---

## 6. See Also

- [`model-profiles.json#qwen3.6`](../../../sk-prompt-small-model/assets/model-profiles.json) — Registry entry; authoritative source for capability fields and `recommended_frameworks`
- [`patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) — Generic RCAF framework definition, CLEAR scoring, and all 7 framework bodies
- [`cli-opencode/assets/prompt_templates.md`](../../../cli-opencode/assets/prompt_templates.md) — Executor prompt-pack templates and dispatch wrappers (MECHANICS)
- [`cli-opencode/references/context-budget.md`](../../../cli-opencode/references/context-budget.md) — Context budget propagation reference for cli-opencode
- [`cli-opencode/references/permissions-matrix.md`](../../../cli-opencode/references/permissions-matrix.md) — Structured permissions schema for tool-call gating
- [`../pattern-index.md`](../pattern-index.md) — Index of executor-owned MECHANICS + ship status
- [`../_index.md`](./_index.md) — All model profiles at a glance
- **Sibling default-unverified profiles (same RCAF/medium convention):** `swe-1.6.md`, `deepseek-v4-pro.md`, `kimi-k2.6.md`, `glm-5.1.md` — same framework default; differ in context window, executor paths, and pool membership
