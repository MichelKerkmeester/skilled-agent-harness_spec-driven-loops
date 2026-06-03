---
title: "MiniMax-M3 Prompt-Craft Profile"
model_id: "minimax-m3"
profile_of: "../../../sk-prompt-small-model/assets/model-profiles.json"
status: "carried"
last_benchmarked: "inherited from minimax-2.7"
---

# MiniMax-M3 Prompt-Craft Profile

Single source of truth for HOW TO PROMPT `minimax-m3`. Framework choices mirror `model-profiles.json` (the DATA source of truth). Executor MECHANICS (binary flags, invocation wrappers) live in `cli-opencode`.

---

## 1. OVERVIEW

### Purpose

The single source for how to prompt `minimax-m3` when dispatching it through `cli-opencode`, mirroring its `model-profiles.json` registry entry so the framework, scaffold, and gotchas stay in sync with the canonical data.

### When to Use

- Before dispatching `minimax-m3` through `cli-opencode`.
- When choosing its prompt framework or building its tuned scaffold.
- When you need its dispatch gotchas (slug, variant, agent, quota pool).

### Core Principle

MiniMax wants guardrail-heavy TIDD-EC framing plus dense pre-planning — more structure, not less.

---

## 2. IDENTITY

| Field | Value |
|---|---|
| **Model slug** | `minimax-coding-plan/MiniMax-M3-highspeed` (plain `minimax-coding-plan/MiniMax-M3` also resolves; `-highspeed` variant is account-holder-directed — confirm with `opencode models minimax-coding-plan`) |
| **Context window** | Unverified (shares M2.7 usage patterns; M2.7 confirmed 204,800 tokens) |
| **Quota pool** | `minimax-token-plan` (MiniMax Token Plan subscription; separate from `cognition-pro`, `opencode-go`, `minimax-api`) |
| **Executor path** | `cli-opencode` → provider `minimax-coding-plan` |
| **Fallback target** | `minimax-2.7` (`minimax-coding-plan/MiniMax-M2.7-highspeed`) |
| **Billing** | Subscription (no pay-per-token burn on the Token Plan) |

The subscription pool resets on a 5-hour rolling window. `--variant` behavior is unverified for this provider and is omitted by default (see §5). `--agent` is rejected on opencode 1.15.13 and must be omitted.

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** TIDD-EC (Task → Instructions → Do's → Don'ts → Examples → Context)
**Fallback:** RCAF (Role → Context → Action → Format)
**Avoid:** nothing explicitly blocked, but lean/medium pre-planning and bare RCAF underperform (see §3)
**Pre-planning density:** DENSE — 4–5 ordered steps, each with an explicit input, output, acceptance criterion, and verification command

This mirrors `model-profiles.json` `recommended_frameworks` for `minimax-m3`:
`primary: "tidd-ec"`, `fallback: "rcaf"`, `preplanning_density: "dense"`, `status: "carried"`.

**Counter-intuitive note:** MiniMax wants guardrail-heavy framing (TIDD-EC Do's/Don'ts) **plus** dense pre-planning — the **opposite** of the cross-model default (medium pre-planning, lighter framing). Most models plateau or regress with dense pre-plans; MiniMax actively uses the dense plan structure rather than being slowed by it. This is because TIDD-EC's explicit Do's/Don'ts curb MiniMax's scope and format drift more effectively than RCAF's role anchor, and the dense pre-plan gives MiniMax a concrete decision scaffold it follows rather than ignoring. For all other models in the rotation (SWE-1.6, DeepSeek, Kimi, GLM, Qwen) the cross-model default applies (RCAF + medium); MiniMax is the explicit exception.

The benchmark that produced these numbers was run on `minimax-2.7` in benchmark `003`; the framework contract is **carried** to M3 until a fresh M3-specific run is completed.

---

## 4. BENCHMARK EVIDENCE

Evidence source for this section: benchmark `003` synthesis.

| Field | Value |
|---|---|
| **Benchmark id** | `003` |
| **Model benchmarked** | `minimax-2.7` (carried to M3) |
| **Primary score** (TIDD-EC medium) | `0.7671` (per benchmark `003` synthesis) |
| **Fallback score** (RCAF medium) | `0.7419` (per benchmark `003` synthesis) |
| **Dense vs medium pre-plan** | `0.7750` (dense) vs `0.7671` (medium) — dense wins (per benchmark `003` synthesis) |
| **Sample** | 7-fixture rig; 49 real MiniMax M2.7 dispatches (7 variants × 7 fixtures), per benchmark `003` synthesis |
| **Caveat** | Single sample per variant/fixture; margins of `0.008`–`0.03` were above the synthesis' `~0.02` fixture-noise floor |
| **Status** | `carried` — framework inherited from `minimax-2.7`; NOT a fresh run on M3 |

**Discriminator:** Per benchmark `003` synthesis, TIDD-EC's explicit Do's/Don'ts curbed MiniMax's scope/format drift, and dense pre-planning gave MiniMax extra structure it used rather than being slowed by it.

For `status: "carried"`: the M3-highspeed model slug is newer and its exact behaviour is unverified. The framework contract is a reasonable prior given MiniMax's architectural continuity, but a fresh 7+ fixture benchmark on M3 should be run before elevating status to `empirical`.

---

## 5. TUNED TEMPLATE SNIPPET

For the **generic TIDD-EC framework definition** (component meanings, scoring rubric, usage guidance), see [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md). The scaffold below is the MiniMax-M3-specific fill — copy-paste-ready, executor-agnostic (no invocation wrapper).

```markdown
## Task
<one-line goal — be precise, no preamble>

## Instructions
1. Write a `<pre-plan>` block with 4-5 ordered steps (dense). Each step must include:
   - Input: what this step receives
   - Output: what this step produces
   - Acceptance criterion: the exact condition that proves this step is done
   - Verification command: the shell/test command that checks it
2. Write the code in fenced markdown blocks with the file path in a comment on the first line.
3. End with a `## Verification` section listing the exact commands that prove all acceptance criteria are met.

## Do's
- Stay strictly within the allowed-writes scope (list affected files explicitly).
- Use only documented, real CLI flags, functions, and file paths.
- Satisfy every acceptance criterion exactly as stated.
- Emit a `<pre-plan>` block before any code.

## Don'ts
- Do not invent CLI flags, functions, or files that are not in the codebase.
- Do not touch files outside the explicit scope list.
- Do not replace code blocks with prose disclaimers or "you could also..." alternatives.
- Do not omit the `## Verification` section.

## Examples
Output shape: a `<pre-plan>` block (dense, 4-5 steps), then fenced code blocks each with a path comment on line 1, then a `## Verification` command list.

## Context
- CWD: <absolute path>
- Active surface: <surface name, e.g. "Node.js / TypeScript">
- Files in scope: <list of files that may be read or written>
- Acceptance criteria: <what "done" means — be concrete>
```

**Why this shape:** The `## Do's` / `## Don'ts` block is the mechanism that suppresses MiniMax's observed scope drift and format evasion. The dense `<pre-plan>` block gives the model a concrete decision scaffold to follow. The `## Examples` section (even when only describing the shape rather than providing a real example) anchors output format expectations. Omitting any of these three sections degrades to RCAF-level performance.

---

## 6. DISPATCH GOTCHAS

Source of truth for capability fields: [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) → `models[id="minimax-m3"].capability`.

| Capability field | Value | Dispatch rule |
|---|---|---|
| `model_slug` | `minimax-coding-plan/MiniMax-M3` | Pass as `--model minimax-coding-plan/MiniMax-M3-highspeed` (account-holder-directed; confirm availability first) |
| `variant_flag` | `--variant` | `variant_status: "omitted-by-default-historically"` — omit `--variant` until accepted behaviour on this provider is verified |
| `agent_policy` | `omit-general` | **Do NOT pass `--agent`** — rejected on opencode 1.15.13; causes immediate dispatch failure |
| `format_mode` | `json` | Pass `--format json` for the normalized token/cost/latency envelope |
| `quota_pool` | `minimax-token-plan` | Independent of `cognition-pro`, `opencode-go`, `minimax-api`; resets on a 5-hour rolling window |
| `default_variant` | `high` | Dispatch-layer default; `--variant` forwarding unverified — do not rely on a non-default variant |
| `fallback_target` | `minimax-2.7` | When M3-highspeed slug is unavailable, fall back to `minimax-coding-plan/MiniMax-M2.7-highspeed` |

**Non-TTY / automation rule (executor mechanic):** every non-interactive `opencode run` must append `</dev/null` after the prompt argument, before any `> file` redirects — opencode reads stdin at startup and hangs at 0% CPU without closed stdin. The full invocation wrapper (slug, `--format json`, `--dir`, redirects) lives in [`../../../cli-opencode/assets/prompt_templates.md`](../../../cli-opencode/assets/prompt_templates.md); compose from there, not from this profile.

**Slug availability note:** Plain `minimax-coding-plan/MiniMax-M3` is confirmed live (2026-06-02). The `-highspeed` variant slug is account-holder-directed — verify with `opencode models minimax-coding-plan` before relying on it. If absent, fall back to `minimax-coding-plan/MiniMax-M2.7-highspeed` (confirmed on opencode 1.15.13).

---

## 7. SEE ALSO

- [`../../../sk-prompt-small-model/assets/model-profiles.json#minimax-m3`](../../../sk-prompt-small-model/assets/model-profiles.json) — canonical capability registry entry (model_slug, variant_flag, agent_policy, format_mode, quota_pool, fallback_target, recommended_frameworks)
- [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) — generic TIDD-EC and RCAF framework definitions + scoring rubric
- [`minimax-2.7.md`](./minimax-2.7.md) — empirical sibling; benchmark 003 was run on this model; M3 carries its framework contract
- [`../../../cli-opencode/assets/prompt_templates.md`](../../../cli-opencode/assets/prompt_templates.md) — Template 14 (MiniMax TIDD-EC + dense); executor invocation wrappers, `</dev/null` rule, Memory Epilogue
- [`../../../cli-opencode/assets/prompt_quality_card.md`](../../../cli-opencode/assets/prompt_quality_card.md) — per-model override block for MiniMax (cross-model pre-planning density context)
- [`../../SKILL.md`](../../SKILL.md) — sk-prompt-small-model hub workflow, dispatch matrix, escalation rules
