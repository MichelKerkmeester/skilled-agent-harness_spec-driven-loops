---
title: Composer Prompt-Craft Profile
model_id: "composer-2.5"
description: How to prompt Composer (Cursor's native model) via cli-cursor - RCAF framework with medium pre-planning as the reasoned default, dispatch scaffold, and gotchas mirroring its model-profiles.json entry. No model-specific benchmark exists yet.
trigger_phrases:
  - "composer prompt framework"
  - "composer dispatch scaffold"
  - "cursor composer prompting"
  - "composer dispatch gotchas"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Composer Prompt-Craft Profile

Single source of truth for how to prompt Composer, Cursor's own native model. Framework choices mirror `recommended_frameworks` in [`model-profiles.json`](../../assets/model-profiles.json) (the DATA source of truth). Executor MECHANICS (binary flags, invocation wrappers, non-TTY rules) live in [`cli-cursor`](../../../../cli-external-orchestration/cli-cursor/SKILL.md) — not here.

---

## 1. OVERVIEW

### Purpose

This profile is the single source for how to prompt Composer, dispatched through `cli-cursor` as the direct analog to a provider's own house model (the same role Cognition's `swe-1.6` plays for `cli-devin`). It mirrors the `composer-2.5` entry in `model-profiles.json`, covering its framework, scaffold, and dispatch gotchas. Composer has **zero prior empirical dispatch data in this repo** — it is a first-time registration, not a framework bakeoff.

### When to Use

- Before dispatching Composer through `cli-cursor` (`--model composer-2.5` or `composer-2.5-fast`).
- When choosing its prompt framework and scaffold shape.
- When you need its dispatch gotchas (model selection, approval flags, the confirmed absence of a reasoning-effort flag).

### Core Principle

RCAF + medium pre-planning, the convention default for an unbenchmarked model — a clear Role, concrete file-anchored Context, one precise Action, and an explicit Format contract. No Composer-specific framing has been validated; this is the reasoned starting point, not an empirical finding.

---

## 2. IDENTITY

| Field | Value |
| --- | --- |
| **Model slug** | `composer-2.5` (fast variant: `composer-2.5-fast`) — confirmed live via `cursor-agent --list-models`, authenticated 2026-07-24 |
| **Context window** | TBD — not exposed by `cursor-agent --list-models`; Cursor's product page does not publish it either. Re-verify at implementation time if a task depends on it. |
| **Primary executor** | `cli-cursor` → `cursor-agent -p --model composer-2.5` |
| **Avg iteration wall-clock** | Not yet measured — no dispatch history exists for this model in this repo |
| **Role in rotation** | Cursor-exclusive coding model; reach for it specifically when a task wants Cursor's own model's perspective rather than a hosted frontier provider dispatched through Cursor |

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** RCAF (Role → Context → Action → Format)
**Fallback:** none (registry `fallback: null` — no empirical alternative validated)
**Avoid:** none specified in the registry (`avoid: []`); no model-specific benchmark has measured Composer against alternative frameworks

**Pre-planning density:** MEDIUM — the convention default for a first-time, unbenchmarked model registration. Neither "lean" (validated for high-context, brevity-rewarding models) nor "dense" (validated for models needing heavy guardrails) has any evidence behind it for Composer specifically.

This mirrors `model-profiles.json` → `recommended_frameworks` for `composer-2.5`:
- `primary`: `"rcaf"`
- `fallback`: `null`
- `avoid`: `[]`
- `preplanning_density`: `"medium"`

---

## 4. BENCHMARK EVIDENCE

**Status:** default-unverified — no model-specific benchmark has been run for Composer.

The `recommended_frameworks` entry in `model-profiles.json` records:
```
benchmark:       null
primary_score:   null
fallback_score:  null
sample:          "no model-specific benchmark"
confidence:      "low"
```

**Reasoned default:** RCAF + medium pre-planning is the convention default across this repo's model rotation for a model with no dispatch history. For Composer specifically:

1. **No prior data exists.** This is a first-time registration (`030-cli-cursor-creation` packet) — there is no archived dispatch log, no informal observation, nothing to reason from beyond the convention default.
2. **Cursor-exclusive, general-purpose positioning.** Cursor markets Composer as its own general coding model, not a specialized escalation target the way DeepSeek-v4-pro is for reasoning depth — RCAF's balanced Role/Context/Action/Format shape fits a general-purpose model better than a framework tuned for a specific strength.
3. **No confirmed context-window constraint.** Unlike DeepSeek-v4-pro's tight 64k window (which motivated its medium density), Composer's context window is unconfirmed — medium density is a safe middle ground until real dispatch data justifies leaning lean or dense.

The discriminator for a future benchmark run should be **general code-generation correctness** against Cursor's other available models (hosted frontier ids dispatched through the same CLI), not a narrow specialty — that comparison is the actual open question this registration leaves for later.

---

## 5. TUNED TEMPLATE SNIPPET

Primary framework: **RCAF**. For the generic RCAF definition and CLEAR scoring methodology, see [`../../../prompt-improve/references/patterns-evaluation.md`](../../../prompt-improve/references/patterns-evaluation.md).

The scaffold below is a generic RCAF fill (medium pre-planning) — not tuned to any Composer-specific strength, since none is validated yet. Copy-paste-ready; executor-agnostic (no `cursor-agent` invocation wrapper here — those live in the executor SKILL.md).

```
## Role
You are a senior software engineer working in this repository's existing conventions.

## Context
Repository: [REPO NAME / brief description]
Active files in scope:
  - [FILE PATH 1] — [one-line purpose]
  - [FILE PATH 2] — [one-line purpose]

Relevant background:
[2-4 sentences: what is known, what the task needs, any hard constraints (API compatibility,
do-not-touch areas, prior work).]

Pre-plan (caller-provided, medium density):
1. [Step - anchored to a concrete file/function/class]
2. [Step]
3. [Step]
[Keep to 3-6 numbered steps. Each step names the specific artifact it touches.]

## Action
[SINGLE task statement. Start with an imperative verb. Name the exact problem.]
Examples:
  - "Implement <fn> so it satisfies every acceptance rule below."
  - "Refactor <pattern X> to <pattern Y> across the listed files, preserving the public API."

Acceptance criteria:
- [Specific, falsifiable criterion 1]
- [Specific, falsifiable criterion 2]
- [Specific, falsifiable criterion 3 - max 5 total]

## Format
[Choose one output shape.]
Option A (code): Output ONLY the corrected file/function - no prose, no markdown fence.
Option B (analysis): Numbered findings list, each with evidence (file:line) and severity.

Constraints:
- Do not modify files outside the scope list above.
- Do not introduce new dependencies without flagging them explicitly.
```

---

## 6. DISPATCH GOTCHAS

Source of truth for model-specific capability fields and flags: [`model-profiles.json`](../../assets/model-profiles.json) → entry `"id": "composer-2.5"`. Full invocation wrappers stay in [`cli-cursor`](../../../../cli-external-orchestration/cli-cursor/SKILL.md); this section only records facts needed to choose the wrapper.

| Field | Value | Notes |
| --- | --- | --- |
| `model_slug` | `composer-2.5` (or `composer-2.5-fast`) | Pass as-is: `--model composer-2.5`. Not provider-prefixed (unlike `zai-coding-plan/glm-5.2`) — Cursor's roster uses bare ids. |
| `variant_flag` | not present | Confirmed live: Cursor has no `--reasoning-effort` flag, and the parameterized `model[effort=...]` bracket syntax is rejected outright ("Cannot use this model"). There is no fast/composer-2.5-fast effort dial beyond picking the `-fast` id itself. |
| `agent_policy` | not applicable | `cli-cursor` has no `--agent` flag; execution mode is `--mode plan`/`--mode ask`/default agent instead. |
| `format_mode` | `text` (default) or `json` | `--output-format text` for the final answer only; `--output-format json` for a structured envelope with `session_id`/`usage`. |
| `approval` | `--auto-review` (default write-capable) or `--force` (unattended) | No automatic approval default — always set explicitly per `cli-cursor`'s dispatch conventions. |
| **Non-TTY rule** | Append `</dev/null` in any automation script | Live-verified: a `cursor-agent -p ... </dev/null` dispatch completes normally, no hang. |
| **Fallback target** | `null` (registry `fallback_target: null`) | No automatic fallback defined; Composer is Cursor-exclusive — there is no sibling-executor equivalent to fall back to. |
| **Context budget** | Unconfirmed | No context-window figure to budget against yet; keep prompts reasonably scoped until this is confirmed. |

---

## 7. SEE ALSO

- [`../../assets/model-profiles.json#composer-2.5`](../../assets/model-profiles.json) — Registry entry; authoritative for all capability fields and `recommended_frameworks` data
- [`../../../prompt-improve/references/patterns-evaluation.md`](../../../prompt-improve/references/patterns-evaluation.md) — Generic RCAF definition, CLEAR scoring, full framework matrix
- [`../../SKILL.md`](../../SKILL.md) — prompt-models hub workflow and dispatch matrix
- [`../pattern-index.md`](../pattern-index.md) — MECHANICS patterns (context budget, output verification, quota fallback)
- [`../../../../cli-external-orchestration/cli-cursor/SKILL.md`](../../../../cli-external-orchestration/cli-cursor/SKILL.md) — Executor card for the `cli-cursor` path; model selection, approval flags, self-invocation guard
- **Other unbenchmarked profiles:** [`deepseek-v4-pro.md`](./deepseek-v4-pro.md) (RCAF + medium — the direct structural precedent for this profile)
