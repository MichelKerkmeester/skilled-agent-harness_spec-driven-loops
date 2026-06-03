---
title: "MiniMax-M2.7 Prompt-Craft Profile"
model_id: "minimax-2.7"
profile_of: "../../../sk-prompt-small-model/assets/model-profiles.json"
status: empirical
last_benchmarked: "2026 (benchmark 003)"
---

# MiniMax-M2.7 Prompt-Craft Profile

---

## 1. OVERVIEW

### Purpose

The single source for how to prompt `minimax-2.7` when dispatching it through `cli-opencode`, mirroring its `model-profiles.json` registry entry so the framework, scaffold, and gotchas stay in sync with the canonical data.

### When to Use

- Before dispatching `minimax-2.7` through `cli-opencode`.
- When choosing its prompt framework or building its tuned scaffold.
- When you need its dispatch gotchas (slug, variant, agent, quota pool).

### Core Principle

MiniMax-M2.7 rewards guardrail-heavy TIDD-EC framing plus dense pre-planning — more upfront structure, not less.

---

## 2. IDENTITY

| Field | Value |
|---|---|
| **slug (Token Plan — primary)** | `minimax-coding-plan/MiniMax-M2.7-highspeed` |
| **slug (standard)** | `minimax-coding-plan/MiniMax-M2.7` |
| **slug (Direct API — alternative)** | `minimax/MiniMax-M2.7` (confirm live id with `opencode models minimax` before use) |
| **context window** | 204,800 tokens |
| **quota pools** | `minimax-token-plan` (subscription, primary) · `minimax-api` (pay-per-token, alternative) |
| **executor path(s)** | `cli-opencode` — two paths: Token Plan highspeed (`provider: minimax-coding-plan`) and Direct API (`provider: minimax`, requires `MINIMAX_API_KEY`) |
| **sibling / successor** | `minimax-m3` — carries this model's framework finding forward (status: `carried`) |

MiniMax-M2.7 is the **fallback target** for `minimax-m3` in the Token Plan rotation. It is the original benchmark host for the MiniMax TIDD-EC + DENSE finding; the M3 profile carries that result forward without re-running.

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** TIDD-EC  
**Fallback:** RCAF  
**Avoid:** (none explicitly listed; DENSE pre-planning is required alongside the primary)  
**Pre-planning density:** DENSE

This mirrors the `recommended_frameworks` object in `model-profiles.json` for `"id": "minimax-2.7"` exactly. The rationale: MiniMax M2.7 responds strongly to guardrail-heavy framing. TIDD-EC's explicit task decomposition + dependency declaration + constraint envelope + output contract surfaces measurably better correctness (0.767 primary vs. 0.742 RCAF fallback at medium confidence on a 7-fixture rig). Dense pre-planning is not optional — it is the mechanism that makes the TIDD-EC envelope effective on this model.

**Counter-intuitive note:** Unlike the instinct to keep prompts lean for smaller models, MiniMax-M2.7 rewards _more_ structure and upfront constraint specification, not less. In the registry-backed benchmark, RCAF scored lower than TIDD-EC. The sibling MiMo-V2.5-Pro is the opposite: COSTAR + lean is its top performer; do not port that framework to MiniMax-M2.7.

For the generic TIDD-EC framework definition and scoring rubric, see [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md).

---

## 4. BENCHMARK EVIDENCE

**Benchmark:** 003  
**Model under test:** MiniMax-M2.7 (real runs on `minimax-coding-plan/MiniMax-M2.7-highspeed`)  
**Sample size:** 7-fixture rig  
**Confidence:** medium  

| Framework | Score |
|---|---|
| TIDD-EC (primary) | 0.767 |
| RCAF (fallback) | 0.742 |

**Discriminator:** The gap between TIDD-EC and RCAF is modest (0.025), but TIDD-EC's explicit constraint and output-contract sections produced consistently tighter format adherence across the fixture set — format adherence was the primary differentiator, with correctness roughly equivalent between the two. The 7-fixture sample establishes TIDD-EC as the working default at the registry's medium confidence level.

**No model-specific standalone benchmark exists for M2.7 outside of benchmark 003.** The sibling `minimax-m3` carries this result forward with status `carried`; this profile is the original empirical host.

---

## 5. TUNED TEMPLATE SNIPPET

The generic TIDD-EC framework definition and evaluation rubric live in [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md). The scaffold below is the MiniMax-M2.7-specific fill — copy-paste-ready, executor-agnostic.

```
# TASK
[One sentence: what must be done. Be precise and atomic.]

# INTENT
[Why this task matters. What the output will be used for.]

# DEPENDENCIES
- [File or artifact this task reads from]
- [External constraint or interface it must satisfy]

# DECOMPOSITION
1. [Sub-step 1 — what it touches and what it produces]
2. [Sub-step 2]
3. [Sub-step 3]
[Add steps as needed. Each step should be independently verifiable.]

# CONSTRAINTS
- SCOPE: [Explicit boundary — what NOT to change]
- FORMAT: [Output format requirement, e.g. JSON schema / function signature / markdown section]
- QUALITY: [Correctness bar — e.g. "all existing tests must pass", "no new imports"]
- SIDE-EFFECTS: [What must remain untouched]

# OUTPUT CONTRACT
Return exactly:
- [Artifact 1: file path + format + schema if applicable]
- [Artifact 2: if any]
Do not include explanatory prose unless requested. If any constraint cannot be met, state it explicitly before the output.
```

**Density note:** Fill every section before dispatching. Empty or vague CONSTRAINTS and OUTPUT CONTRACT sections degrade output quality on this model. The pre-planning work belongs in the prompt, not delegated to the model.

---

## 6. DISPATCH GOTCHAS

Source of truth for model-specific capability fields and flags: [`model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) entry `"id": "minimax-2.7"` → `"capability"`. Full invocation wrappers live in [`cli-opencode`](../../../cli-opencode/SKILL.md); this section records wrapper inputs, not wrapper syntax.

| Field | Value | Implication |
|---|---|---|
| `model_slug` | `minimax-coding-plan/MiniMax-M2.7-highspeed` | Use this exact slug for the Token Plan path; `MiniMax-M2.7` (no `-highspeed`) also resolves |
| `variant_flag` | `--variant` | Historically omitted by default; `variant_status: omitted-by-default-historically` — confirm acceptance before relying on a non-default variant |
| `agent_policy` | `omit-general` | **Never pass `--agent`** — it is rejected on opencode 1.15.13 for this provider |
| `format_mode` | `json` | Use the executor's JSON format mode to receive the normalized token/cost/latency envelope; wrapper syntax lives in `cli-opencode` |
| `quota_pool` | `minimax-token-plan` (primary) · `minimax-api` (alternative) | Token Plan = subscription; Direct API = pay-per-token — large-context runs on the Direct API path can be expensive |
| `fallback_target` | `null` | No further fallback defined; on Token Plan exhaustion, route to a different pool manually |

**Non-TTY automation rule (executor mechanic):** When dispatching from a script or CI context (any non-interactive shell), append `</dev/null` to the executor-owned invocation wrapper. Use the full wrapper from [`cli-opencode`](../../../cli-opencode/SKILL.md), not this profile.

**Direct API path caveat:** The `minimax/MiniMax-M2.7` id previously errored on opencode 1.15.13. Confirm the live id with `opencode models minimax` before relying on the pay-per-token path.

**Fallback routing:** `minimax-2.7` has `fallback_target: null` in `model-profiles.json`. If both Token Plan and Direct API are unavailable, route to a different quota pool (e.g., `opencode-go` models) manually.

---

## 7. SEE ALSO

- **Data source:** [`model-profiles.json#minimax-2.7`](../../../sk-prompt-small-model/assets/model-profiles.json) — authoritative capability fields, framework scores, executor paths
- **Framework definitions and scoring:** [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md)
- **Executor card and dispatch templates:** [`../../../cli-opencode/assets/prompt_templates.md`](../../../cli-opencode/assets/prompt_templates.md) · [`../../../cli-opencode/assets/prompt_quality_card.md`](../../../cli-opencode/assets/prompt_quality_card.md)
- **Executor mechanics (binary flags, invocation wrappers):** [`../../../cli-opencode/SKILL.md`](../../../cli-opencode/SKILL.md)
- **Sibling model (carries this framework finding):** [`minimax-m3.md`](./minimax-m3.md) — status `carried`; no independent benchmark
- **Model index:** [`_index.md`](./_index.md)
