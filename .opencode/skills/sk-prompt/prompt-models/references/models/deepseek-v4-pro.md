---
title: DeepSeek-v4-Pro Prompt-Craft Profile
model_id: "deepseek-v4-pro"
description: How to prompt DeepSeek-v4-pro via cli-opencode, RCAF framework with medium pre-planning, dispatch scaffold, and gotchas mirroring its model_profiles.json entry.
trigger_phrases:
  - "deepseek v4 pro prompt framework"
  - "deepseek dispatch scaffold"
  - "deepseek rcaf prompt"
  - "deepseek dispatch gotchas"
importance_tier: normal
contextType: implementation
version: 0.8.0.12
---

# DeepSeek-v4-Pro Prompt-Craft Profile

Single source of truth for how to prompt DeepSeek-v4-pro in the small-model rotation. Framework choices mirror `recommended_frameworks` in [`model_profiles.json`](../../assets/model_profiles.json) (the DATA source of truth). Executor MECHANICS (binary flags, invocation wrappers, non-TTY rules) live in [`cli-opencode`](../../../../cli-external-orchestration/cli-opencode/SKILL.md) — not here.

---

## 1. OVERVIEW

### Purpose

This profile is the single source for how to prompt DeepSeek-v4-pro, dispatched through `cli-opencode` via the direct DeepSeek provider as the small-model rotation's reasoning-depth escalation target. It mirrors the `deepseek-v4-pro` entry in `model_profiles.json`, covering its framework, scaffold, and dispatch gotchas.

### When to Use

- Before dispatching DeepSeek-v4-pro through `cli-opencode`.
- When choosing its prompt framework and scaffold shape.
- When you need its dispatch gotchas (`--pure` flag, quota pools, timeout headroom).

### Core Principle

RCAF + medium pre-planning, leaning into depth: name concrete files, exact symbols, and explicit acceptance criteria — vague prompts waste this model's reasoning capability on scope disambiguation.

---

## 2. IDENTITY

| Field | Value |
| --- | --- |
| **Model slug** | `deepseek-v4-pro`. Direct-API id is not pinned in the registry — confirm the live id with `opencode models deepseek` before use |
| **Context window** | 64,000 tokens |
| **Primary quota pool** | `deepseek-api` (direct) |
| **Executor paths** | `cli-opencode` → provider `deepseek-api` (requires `DEEPSEEK_API_KEY`; `--pure` flag mandatory), pool `deepseek-api` |
| **Avg iteration wall-clock** | ~18 min |
| **Role in rotation** | Escalation target for complex review, RCA, and architecture trade-off analysis; strongest reasoning depth in the direct DeepSeek path |

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** RCAF (Role → Context → Action → Format)
**Fallback:** none (registry `fallback: null` — no empirical alternative validated)
**Avoid:** none specified in the registry (`avoid: []`); no model-specific benchmark has measured DeepSeek-v4-pro against alternative frameworks

**Pre-planning density:** MEDIUM — include a structured step-by-step plan before the action section. DeepSeek-v4-pro handles longer reasoning chains well, but its 64k window is tighter than larger-context siblings such as mimo-v2.5-pro (1M), so the plan should be concise and file-anchored rather than exhaustive.

**Counter-intuitive note:** Unlike MiniMax (which rewards heavy guardrail framing) or MiMo (which rewards lean brevity-focused framing), DeepSeek-v4-pro is the escalation model for DEPTH — the prompt should lean into specificity: concrete file paths, exact function/class names, and explicit acceptance criteria. Vague high-level prompts waste the model's reasoning capability on scope disambiguation. RCAF earns its keep here not through guardrails but through a tight Role that frames the model as a senior reviewer or architect, and a precise Action that names the problem without hedging.

This mirrors `model_profiles.json` → `recommended_frameworks` for `deepseek-v4-pro`:
- `primary`: `"rcaf"`
- `fallback`: `null`
- `avoid`: `[]`
- `preplanning_density`: `"medium"`

---

## 4. BENCHMARK EVIDENCE

**Status:** default-unverified — no model-specific benchmark has been run for deepseek-v4-pro.

The `recommended_frameworks` entry in `model_profiles.json` records:
```
benchmark:       null
primary_score:   null
fallback_score:  null
sample:          "no model-specific benchmark"
confidence:      "low"
```

**Reasoned default:** RCAF + medium pre-planning is the convention default for the entire small-model rotation. For deepseek-v4-pro specifically, this choice is additionally motivated by:

1. **Model positioning.** The registry lists `complex reasoning`, `root-cause debugging`, `multi-step implementation`, and `architecture trade-off analysis` as its strengths. RCAF is the registry default for those tasks; there is no model-specific benchmark comparing RCAF, RACE, or TIDD-EC on DeepSeek-v4-pro.
2. **Context budget.** At 64k, this is the tightest context window in the active rotation. Medium pre-planning keeps the plan concise enough to leave budget for the actual payload (files, diffs, traces).
3. **Escalation contract.** DeepSeek-v4-pro is an escalation target when a lighter model saturates. The caller already has a pre-plan; this model receives it and deepens it — medium density matches the hand-off pattern.

The discriminator for a future benchmark run should be **correctness on multi-step RCA fixtures**, not format adherence — format is straightforward for this model class.

---

## 5. TUNED TEMPLATE SNIPPET

Primary framework: **RCAF**. For the generic RCAF definition and CLEAR scoring methodology, see [`../../../prompt-improve/references/patterns_evaluation.md`](../../../prompt-improve/references/patterns_evaluation.md).

The scaffold below is filled for deepseek-v4-pro's escalation use-cases (complex review, RCA, architecture analysis). Copy-paste-ready; executor-agnostic (no opencode wrapper here — add those from the executor SKILL.md).

```
## Role
You are a senior software engineer specialising in [DOMAIN — e.g. "distributed systems", "TypeScript compiler internals", "React state management"].
Your primary strength is deep root-cause analysis and architecture trade-off reasoning.

## Context
Repository: [REPO NAME / brief description]
Active files in scope:
  - [FILE PATH 1] — [one-line purpose]
  - [FILE PATH 2] — [one-line purpose]

Relevant background:
[2–4 sentences max. State what is known, what failed, and why the previous (lighter model) pass was insufficient.
Include exact error messages or test output verbatim.]

Pre-plan (caller-provided, medium density):
1. [Step — anchored to a concrete file/function/class]
2. [Step]
3. [Step]
[Keep to 3–6 numbered steps. No bullet nesting. Each step names the specific artifact it touches.]

## Action
[SINGLE task statement. Start with an imperative verb. Name the exact problem.]
Examples:
  - "Identify the root cause of the race condition in `ConnectionPool.acquire()` and propose a minimal fix."
  - "Review the schema migration in `db/migrations/0042_add_index.sql` for correctness and rollback safety."
  - "Evaluate the three architecture options in the pre-plan above and recommend one with justification."

Acceptance criteria:
- [Specific, falsifiable criterion 1]
- [Specific, falsifiable criterion 2]
- [Specific, falsifiable criterion 3 — max 5 total]

## Format
[Choose one output shape. Keep it tight for the 64k budget.]
Option A (analysis): Numbered findings list → each finding: problem statement, evidence (file:line), severity (P0/P1/P2), recommended fix.
Option B (recommendation): One-paragraph diagnosis → bulleted options → explicit recommendation with rationale.
Option C (diff): Prose explanation (≤ 150 words) → fenced code block with the complete corrected function/section.

Constraints:
- Do not modify files outside the scope list above.
- Do not introduce new dependencies without flagging them explicitly.
- If confidence in a finding is < 80%, label it "LOW CONFIDENCE:" inline.
```

---

## 6. DISPATCH GOTCHAS

Source of truth for model-specific capability fields and flags: [`model_profiles.json`](../../assets/model_profiles.json) → entry `"id": "deepseek-v4-pro"`. Full invocation wrappers stay in [`cli-opencode`](../../../../cli-external-orchestration/cli-opencode/SKILL.md); this section only records facts needed to choose the wrapper.

| Field | Value | Notes |
| --- | --- | --- |
| `primary_quota_pool` | `deepseek-api` (direct) | Primary pool |
| `executor paths` | `cli-opencode` (deepseek-api) | Direct API requires `DEEPSEEK_API_KEY` |
| `variant_flag` | not present | No `--variant` flag for this model; the field is absent in the registry entry |
| `agent_policy` | not specified in registry | No `capability.agent_policy` field — follow the executor's default `--agent` behavior; verify before dispatch |
| `format_mode` | not specified in registry | No `capability.format_mode` field — executor default applies; `--format json` is not mandated but safe to add |
| `quota_pool` | `deepseek-api` (primary/direct) | No automatic gateway fallback; operator reroutes manually on pool exhaustion |
| **`--pure` flag** | **Required** on `cli-opencode` + `deepseek-api` provider | DeepSeek API rejects tool names containing `:` — `--pure` strips them. Omitting it causes silent tool-call failures |
| **Non-TTY rule** | Append `</dev/null` in any automation script | Applies to all cli-opencode invocations; missing redirect is the #1 hang cause in non-TTY environments (see cli-opencode SKILL.md §ALWAYS rule 5) |
| **Timeout headroom** | Budget ≥ 25 min (`gtimeout` / `--timeout`) | Avg wall-clock is 18 min; complex RCA fixtures can run long — under-budgeted timeouts kill mid-reasoning |
| **Fallback target** | `null` (registry `fallback_target: null`) | No automatic fallback defined; on pool exhaustion, operator must manually route to a different-pool model |
| **Context budget** | 64,000 tokens | Smallest window in the cognition-pro tier — keep pre-plans concise; trim context aggressively before dispatch |

---

## 7. DESIGN & ILLUSTRATION TASKS (informal observation, n=1)

**Task type:** bento-card visual illustration applying `sk-design` (1 page = Budgetteren, single sample, 2026-06-22 bake-off vs kimi-k2.7-code + mimo-v2.5-pro; same brief, same shell, all three read the design skill).

**Observed — gold-heavy / blue-starved:** the **richest, most-detailed individual drawings** of the three — but gold filled 4/5 cards and the brand's lead blue was under-used (output skewed dark/gold), with two overlapping concepts (two chests). It respected the hard constraints (brand palette only, flat).

**Implication:** strong raw illustration craft, weak brand-palette discipline. For a brand-critical illustration set prefer kimi-k2.7-code (strongest restraint); if deepseek is used, **pin the lead color and cap gold explicitly** in the brief and palette-check the output.

**Caveat:** informal, n=1 fixture / single sample — a dispatch observation, **NOT benchmark evidence**. Mirror of `model_profiles.json#deepseek-v4-pro.weaknesses`. Path to canonical: `/deep:model-benchmark` (≥3 illustration fixtures × ≥2 samples; results land in `prompt-models/benchmarks/<label>/`).

---

## 8. SEE ALSO

- [`../../assets/model_profiles.json#deepseek-v4-pro`](../../assets/model_profiles.json) — Registry entry; authoritative for all capability fields and `recommended_frameworks` data
- [`../../../prompt-improve/references/patterns_evaluation.md`](../../../prompt-improve/references/patterns_evaluation.md) — Generic RCAF definition, CLEAR scoring, full framework matrix
- [`../../SKILL.md`](../../SKILL.md) — prompt-models hub workflow and dispatch matrix
- [`../pattern_index.md`](../pattern_index.md) — MECHANICS patterns (context budget, output verification, quota fallback)
- [`../../../../cli-external-orchestration/cli-opencode/SKILL.md`](../../../../cli-external-orchestration/cli-opencode/SKILL.md) — Executor card for the deepseek-api path; `--pure` flag, provider wiring, `DEEPSEEK_API_KEY` setup
- **Other active profiles:** [`kimi-k2.7-code.md`](./kimi-k2.7-code.md) (COSTAR + lean — benchmark 007), [`mimo-v2.5-pro.md`](./mimo-v2.5-pro.md) (COSTAR + lean — opposite of RCAF/medium), [`minimax-m3.md`](./minimax-m3.md) (TIDD-EC + dense — benchmark 003)
- **Executor quality card:** [`../../../../cli-external-orchestration/cli-opencode/assets/prompt_quality_card.md`](../../../../cli-external-orchestration/cli-opencode/assets/prompt_quality_card.md) — the model-selection table links to this profile; this closes the navigability round-trip.
