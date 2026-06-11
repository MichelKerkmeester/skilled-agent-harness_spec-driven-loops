---
title: MiMo-V2.5-Pro Prompt-Craft Profile
model_id: "mimo-v2.5-pro"
description: How to prompt MiMo-V2.5-Pro via cli-opencode, benchmark-backed COSTAR framework with lean pre-planning, tuned scaffold, and dispatch gotchas.
trigger_phrases:
  - "mimo v2.5 pro prompt framework"
  - "mimo costar scaffold"
  - "xiaomi mimo prompting"
  - "mimo dispatch gotchas"
importance_tier: normal
contextType: implementation
---

# MiMo-V2.5-Pro Prompt-Craft Profile

Single source of truth for **how to prompt** MiMo-V2.5-Pro. Framework rationale, benchmark evidence, tuned scaffold, and dispatch gotchas. Executor MECHANICS (invocation wrappers, binary flags) live in `cli-opencode` — this profile owns the prompt-craft contract only.

---

## 1. OVERVIEW

### Purpose

The single source for how to prompt `mimo-v2.5-pro` when dispatching it through `cli-opencode`, mirroring its `model-profiles.json` registry entry so the framework, scaffold, and gotchas stay in sync with the canonical data.

### When to Use

- Before dispatching `mimo-v2.5-pro` through `cli-opencode`.
- When choosing its prompt framework or building its tuned scaffold.
- When you need its dispatch gotchas (slug, variant, agent, quota pool).

### Core Principle

MiMo-V2.5-Pro wins on COSTAR plus lean pre-planning — frame for output format, not guardrails.

---

## 2. IDENTITY

| Field | Value |
| ----- | ----- |
| Slug (primary) | `xiaomi-token-plan-ams/mimo-v2.5-pro` |
| Context window | 1,000,000 tokens |
| Quota pool | `xiaomi-token-plan` (Xiaomi Token Plan, Europe) |
| Provider id | `xiaomi-token-plan-ams` |
| Executor path | `cli-opencode` → provider `xiaomi-token-plan-ams` |
| Free cheap-iteration sibling | `opencode/mimo-v2.5-free` (opencode-go gateway, v2.5 tier, separate pool) |
| SWE-bench Pro | 57.2 (strongly agentic; sustains 1000+ sequential tool calls) |
| Token efficiency | 40–60% fewer tokens/trajectory vs frontier models (Opus 4.6 / GPT-5.4) |

MiMo-V2.5-Pro is the **largest-context model in the small-model rotation** and the most token-efficient. It lives on its own subscription quota pool (`xiaomi-token-plan`), isolated from `opencode-go`, `cognition-pro`, and `minimax-token-plan`. Billing via the Token Plan shows cost 0/0 in opencode — no pay-per-token burn on the primary path.

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** COSTAR
**Fallback:** RACE
**Avoid:** `tidd-ec`, `cidi`

**Pre-planning density:** lean (2–3 ordered steps with acceptance criteria)

These choices mirror `recommended_frameworks` in `model-profiles.json#mimo-v2.5-pro`: `primary: "costar"`, `fallback: "race"`, `avoid: ["tidd-ec", "cidi"]`, `preplanning_density: "lean"`, `status: "empirical"`.

### Why COSTAR wins for MiMo

MiMo-V2.5-Pro was **frontier-correct on every benchmarked framework** — correctness was not the discriminator in benchmark 004 (100% assertion pass across all five frameworks, per benchmark `004` synthesis). The discriminator was **format adherence + token efficiency**: lean, audience-framed prompts suppress the explanatory preamble that CIDI, RCAF, and TIDD-EC leak.

The two key levers in COSTAR are:
- `Style: "precise, no preamble"` — eliminates the warm-up paragraph MiMo emits under guardrail-heavy framing
- `Audience: "automated pipeline / downstream parser"` — signals that prose wrapping around code is actively harmful

TIDD-EC — the framework that **wins for MiniMax** — came **dead last** for MiMo: on the harder fixture it produced 151 words versus COSTAR's 62 words (`2.4×`), per benchmark `004` synthesis, and leaked substantial explanatory prose, breaking code-only contracts. The Do's/Don'ts guardrail structure MiniMax needs is unnecessary overhead for MiMo.

CIDI is unreliable on MiMo: it intermittently writes output to a file via tool call instead of returning inline code, which fails automated suite parsing.

### Counter-intuitive note

MiMo and MiniMax are **opposite on framework choice**. Per benchmark `004` synthesis, RCAF was middle-of-pack for MiMo and only 50% format-adherent, while COSTAR and RACE were both 100% format-adherent. Dense pre-planning adds prompt cost without yield for MiMo; TIDD-EC's dense scaffold ranked last.

---

## 4. BENCHMARK EVIDENCE

Evidence source for this section: benchmark `004` synthesis.

| Field | Value |
| ----- | ----- |
| Benchmark id | `004` |
| Runs | 10/10 real `mimo-v2.5-pro` dispatches succeeded (5 frameworks × 2 fixtures), per benchmark `004` synthesis |
| COSTAR score | 1.0000 (composite), per benchmark `004` synthesis |
| RACE score | 0.9934 (composite, statistical tie), per benchmark `004` synthesis |
| TIDD-EC score | ranked last; hard-fixture output was 151 words vs COSTAR's 62 words (`2.4×`), per benchmark `004` synthesis |
| Sample size | 2 fixtures × 5 framework passes (single-sample per framework per fixture) |
| **Discriminator** | **Format adherence + token efficiency, NOT correctness** |

All five benchmarked frameworks produced 100% correct assertions, per benchmark `004` synthesis. The ranking was driven by whether the model emitted only the requested output shape or wrapped it in explanatory prose. COSTAR's `Audience` and `Style` fields are the structural mechanism that suppresses preamble.

**Caveat:** The benchmark 004 sample is 2 fixtures / single-sample per framework — the COSTAR/RACE margin is inside single-sample noise. Both are safe to use. TIDD-EC/dense ranked last, was the longest average output, and was one of the frameworks that failed format adherence on the harder fixture.

---

## 5. TUNED TEMPLATE SNIPPET

For the generic COSTAR framework definition and field semantics, see [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md).

The scaffold below is the **MiMo-specific fill** — copy-paste ready, executor-agnostic (no `opencode run` wrapper here; invocation mechanics live in `cli-opencode`).

```text
## Context
<One paragraph: what the codebase does, which files are in scope, and the current state that motivates this task. Include CWD, active surface, and any constraints the model must not violate.>

## Objective
<Single concrete deliverable in one sentence. Prefer a verb + artifact: "Return the updated function body", "Write a migration script that …", "Produce the diff for …".>

## Style
precise, no preamble

## Tone
neutral

## Audience
automated pipeline — output will be parsed directly; prose wrapping around code is harmful

## Response
<Exact output shape. Examples:
  - "Return ONLY the function body in a fenced code block with the file path in a comment on the first line."
  - "Return a JSON array of findings, one object per finding, no surrounding prose."
  - "Return the full file content after your edits, in a single fenced block.">

---
Pre-plan (lean — 2–3 steps):
1. <Step: action → expected output, acceptance criterion>
2. <Step: action → expected output, acceptance criterion>
3. (Optional) Verification: <exact command or assertion that proves the criterion>
```

**RACE fallback scaffold** (use when a shorter 4-field prompt is preferred):

```text
Role: <one-line specialist identity>
Action: <the single deliverable in imperative mood>
Context: <CWD, in-scope files, constraints, acceptance criterion>
Expectation: <exact output shape; append "no preamble, no prose wrapping">
```

**Key difference from MiniMax template:** omit Do's/Don'ts guardrail sections — they inflate output for MiMo. Keep pre-planning lean (2–3 steps), not dense (4–5 steps).

---

## 6. DISPATCH GOTCHAS

Source of truth for the capability fields below: `model-profiles.json#mimo-v2.5-pro.capability`.

| Capability field | Value | Implication |
| ---------------- | ----- | ----------- |
| `model_slug` | `xiaomi-token-plan-ams/mimo-v2.5-pro` | Use this exact slug; shorter aliases are unverified |
| `variant_flag` | `--variant` | Required; maps to MiMo reasoning effort (low / medium / high) |
| `default_variant` | `high` | **Always pass `--variant high`** — confirmed accepted on opencode 1.15.13; high reasoning is the standing default |
| `variant_status` | `confirmed` | Unlike MiniMax, `--variant` forwarding is verified for this provider |
| `agent_policy` | `omit-general` | **Omit `--agent`** — `--agent general` warns and falls back on opencode 1.15.13; do not pass any `--agent` flag |
| `format_mode` | `json` | Dispatch via `opencode run --format json` for the normalized token/cost/latency envelope |
| `quota_pool` | `xiaomi-token-plan` | Independent pool — does not draw from `opencode-go`, `cognition-pro`, or `minimax-token-plan` |
| `fallback_target` | `null` | No automatic pool fallback defined; use `opencode/mimo-v2.5-free` (opencode-go) for cheap iteration when the primary pool is exhausted |

**Non-TTY automation rule (executor mechanic):** every non-interactive `opencode run` must append `</dev/null` after the prompt argument, before any output redirects — opencode reads stdin at startup and hangs at 0% CPU without closed stdin. The full invocation wrapper (slug, `--variant high`, `--format json`, `--dir`, redirects) lives in [`../../../cli-opencode/assets/prompt_templates.md`](../../../cli-opencode/assets/prompt_templates.md); compose from there, not from this profile.

**Fallback target:** `opencode/mimo-v2.5-free` (opencode-go gateway, v2.5 tier, free). Use for cheap probing / iterative drafts when you do not need full -pro reasoning depth. Verify live model ids with `opencode models xiaomi-token-plan-ams` and `opencode models opencode-go` before relying on either path.

**Long-context degradation:** MiMo's 1M-token window is real, but quality degrades past ~512k. For tasks approaching that boundary, prefer tighter context slices over full-context dumps.

---

## 7. SEE ALSO

- [`model-profiles.json#mimo-v2.5-pro`](../../../sk-prompt-small-model/assets/model-profiles.json) — Canonical capability fields and recommended_frameworks data; this profile mirrors and annotates it.
- [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) — Generic framework definitions (COSTAR, RACE, TIDD-EC, RCAF, CIDI, CRISPE, CRAFT). Section 4 (Tuned Template Snippet) links here rather than copying.
- [`../../../cli-opencode/assets/prompt_templates.md` §TEMPLATE 15](../../../cli-opencode/assets/prompt_templates.md) — MiMo executor card with the `opencode run` invocation wrapper and benchmark evidence pointer. The executor card points here for the prompt-craft contract.
- [`../../../cli-opencode/assets/prompt_quality_card.md` §Per-model override — MiMo](../../../cli-opencode/assets/prompt_quality_card.md) — Fast-path selection note for MiMo in the OpenCode CLI quality card.
- Sibling profiles (same hub): [`minimax-m3.md`](./minimax-m3.md) — The MiniMax profile is the counter-example: TIDD-EC + dense wins there, the opposite of MiMo.
- [`../../SKILL.md`](../../SKILL.md) — sk-prompt-small-model hub workflow and dispatch matrix.
