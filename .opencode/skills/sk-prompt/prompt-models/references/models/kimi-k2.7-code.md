---
title: Kimi-k2.7-code Prompt-Craft Profile
model_id: "kimi-k2.7-code"
description: How to prompt Kimi-k2.7-code (Kimi For Coding plan, slug kimi-for-coding/k2p7) via cli-opencode — COSTAR framework (empirical, benchmark 007; fallback TIDD-EC, avoid rcaf) with lean pre-planning over the 256k window, file-anchored context scaffold, and Kimi For Coding dispatch gotchas.
trigger_phrases:
  - "kimi k2.7 prompt framework"
  - "kimi k2.7 code dispatch scaffold"
  - "kimi for coding prompting"
  - "kimi k2.7 dispatch gotchas"
importance_tier: normal
contextType: implementation
version: 0.8.0.7
---

# Kimi-k2.7-code Prompt-Craft Profile

Single source of truth for how to prompt Kimi-k2.7-code in the small-model rotation. Framework choices mirror `recommended_frameworks` in the model-profiles registry (the DATA source); executor MECHANICS live in `cli-opencode`.

---

## 1. OVERVIEW

### Purpose

This profile is the single source for how to prompt Kimi-k2.7-code, the coding-optimized large-context Kimi dispatched through `cli-opencode` on the dedicated **Kimi For Coding** subscription plan (provider `kimi-for-coding`, slug `kimi-for-coding/k2p7`). It mirrors the `kimi-k2.7-code` entry in `model_profiles.json`, covering its framework, scaffold, and dispatch gotchas.

### When to Use

- Before dispatching Kimi-k2.7-code through `cli-opencode`.
- When choosing its prompt framework and scaffold shape.
- When you need its dispatch gotchas (provider path, quota pool, variant behavior).

### Core Principle

COSTAR + lean pre-planning, framed for the task and output shape — the 256k window is for front-loading explicit file-anchored Context, not unstructured raw dumps. (Benchmark 007 on strict validators put COSTAR/RACE/TIDD-EC at perfect correctness and rcaf weakest — see §4 — so the default moved off rcaf to COSTAR.)

---

## 2. IDENTITY

| Field | Value |
| --- | --- |
| Model slug | `kimi-for-coding/k2p7` (display name "Kimi K2.7 Code") |
| Canonical id | `kimi-k2.7-code` |
| Context window | 262,144 tokens (256k); 32,768-token output |
| Primary quota pool | `kimi-for-coding` (dedicated Kimi For Coding subscription pool) |
| Executor path | `cli-opencode` → provider `kimi-for-coding` → pool `kimi-for-coding` |
| Avg iteration wall-clock | not formally measured; OBSERVED 2026-06-17 — a bounded ≤4-read task finished well within 1200s, but a broad large-repo task at `--variant high` exceeded 600s (over-exploration). Budget **1200s+** for broad scopes; cap reads. |
| Fallback target | none |

Kimi-k2.7-code is the **coding-optimized large-context** Kimi in the rotation — 256k tokens makes it a strong choice for sprawling diff reviews, long-file inspection, multi-repo evidence gathering, and cross-cutting refactors. It runs on the Kimi For Coding subscription plan (dispatch cost shows 0), on a quota pool independent of `opencode-go`.

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** COSTAR
**Fallback:** TIDD-EC
**Avoid:** RCAF (objectively weakest on strict validators — benchmark 007)
**Pre-planning density:** LEAN

These choices mirror `recommended_frameworks` in [`../../assets/model_profiles.json`](../../assets/model_profiles.json) entry `kimi-k2.7-code` (the DATA source of truth). See `patterns_evaluation.md` for the generic RCAF, COSTAR, and RACE definitions — this profile records the per-model choice and rationale only.

**Why COSTAR for Kimi-k2.7-code (empirical, benchmark 007):** On invalid-dominant strict validators, three frameworks tied at perfect correctness — COSTAR, RACE, TIDD-EC — while RCAF (the old default) and CIDI were the measured-weakest (see §4). Among the perfect tier, COSTAR is the most cross-validated pick: it is MiMo's empirical winner (benchmark 004, a comparable strong coding model) and was favored by run 006's judge, so it is the safest default across evidence sources. COSTAR frames by objective + output-shape rather than guardrails, which fits a strong model that does not need heavy scaffolding. TIDD-EC (fallback) tied on correctness and is the most token-efficient; RACE is an equally-correct simpler alternative. **Avoid RCAF** — it was objectively weakest (0.992) and is retired as this model's default. The trust verdict was a TIE among the perfect tier, so this is "best-of-tied + corroborated", not a decisive single winner.

**Counter-intuitive note:** the large context window is a capability, not a licence to send unstructured dumps. Prompt structure still matters — pad the `Context` block with explicit file anchors and line ranges rather than trusting the model to self-select from a raw paste. This keeps the action section tight and makes the output verifiable.

---

## 4. BENCHMARK EVIDENCE

Two bakeoffs were run. **Run `006`** used easy T3 fixtures and **saturated** — all five frameworks scored correctness 1.0, so it returned an uninformative TIE (a strong coding model aces easy fixtures regardless of framing). **Run `007-kimi-k2.7-discriminating`** fixed that with **invalid-dominant strict validators** (`validate-ipv4` + `validate-date` + `validate-semver`), where a lax-but-plausible solution scores <1.0, at 6 samples/cell of throttled serial real `kimi-for-coding/k2p7` dispatches. (The 4th fixture `hard-roman-to-int` was excluded — its run stalled under orchestration churn; the 3-fixture result is conclusive.)

**Run 007 result: correctness SEPARATED.** Per-framework correctness (n=18):

| Rank | Framework | Correctness | Output words (median) |
| ---: | --- | ---: | ---: |
| 1 | tidd-ec | 1.000 | 25 |
| 2 | race | 1.000 | 53.5 |
| 3 | costar | 1.000 | 70 |
| 4 | cidi | 0.996 | 83.5 |
| 5 | rcaf | 0.992 | 64.5 |

**Trust verdict: TIE on correctness** — the three perfect frameworks (tidd-ec, race, costar) cannot be statistically separated (top-pair margin 0, 90% CI [0,0]). But the structure is actionable: **`rcaf` — the former convention default — is objectively the weakest**, producing strict-validator code that missed adversarial cases (SemVer precedence / leading-zero edges); `cidi` is second-weakest. So rcaf is retired/avoided for this model, and the default moves into the perfect tier (COSTAR; see §3 for why COSTAR over the equally-correct TIDD-EC/RACE).

**This objectively refutes run 006's secondary gpt-5.5 judge**, which had subjectively ranked rcaf/race highest and read oracle-*confirmed-correct* code as buggy — the deterministic oracle is the source of truth here. Do not carry scores from sibling models — contexts and providers differ enough that score transfer would mislead.

---

## 5. TUNED TEMPLATE SNIPPET

The generic COSTAR framework definition is defined in [`../../../prompt-improve/references/patterns_evaluation.md`](../../../prompt-improve/references/patterns_evaluation.md) — do not restate it here.

The scaffold below is the Kimi-k2.7-code-specific COSTAR fill (lean pre-planning). Copy-paste-ready; executor-agnostic (no opencode invocation wrapper included — those live in the executor cards).

```text
## Context
<!-- LARGE-CONTEXT ANCHOR BLOCK — explicit file anchors, not raw dumps -->
Target files / ranges:
  - <path/to/file-A.ts>  (lines <start>–<end> or "full file")
  [add an entry for every relevant file or module]
Background: [one-paragraph purpose of the code area + hard constraints (API compatibility, do-not-touch areas, prior work)]

## Objective
[Single precise directive, e.g.:]
  "Implement <fn> so it satisfies every acceptance rule below."
  OR
  "Refactor <pattern X> to <pattern Y> across the listed files, preserving the public API."
Enumerate the non-obvious / adversarial edge cases EXPLICITLY — this is the decisive lever:
weaker framings are exactly where Kimi occasionally let a strict edge case slip (benchmark 007).

## Style
Production code, no narration. Strictly in scope: no invented parameters, helper globals, or behaviour.

## Tone
Terse and literal.

## Audience
A senior engineer who will run the output against a strict hidden-test oracle.

## Response
[Exact output contract, e.g.: "Return ONLY the function source — no prose, no test code, no markdown fence."]
```

**Kimi-k2.7-code-specific notes for the scaffold:**

- Keep `Context` as the longest block — this is where the 256k window earns its place; name files in a stable order (large-context Kimi is sensitive to ordering mismatches).
- The decisive lever is the `Objective`: enumerate adversarial edge cases explicitly. That is exactly where benchmark 007 separated the frameworks — rcaf/cidi let strict-validator edges slip; costar/race/tidd-ec did not.
- Scope to one concern per dispatch with a **hard read-cap** ("read ≤N files, then emit and stop browsing"); avoid open-ended directives like "analyse and improve." **This is load-bearing, not just for verifiability:** on a broad / large-repo task at `--variant high`, k2.7-code was observed to **over-explore (many sequential file reads) and blow past a 600s dispatch timeout without ever emitting** — and opencode flushes only the *final* assistant message to stdout, so the killed run yields **0 bytes** (it looks like a hang, but the model was working productively the whole time). Mitigate with the read-cap above + a **1200s+ timeout** in the executor wrapper, and **consider omitting `--variant high`** for bounded tasks. (Observed 2026-06-17, n=few — see §6.)
- For the tersest correct output (token budget), TIDD-EC (the fallback) was the most token-efficient of the perfect tier in benchmark 007.

---

## 6. DISPATCH GOTCHAS

Model-specific capability fields and flags are sourced from the `kimi-k2.7-code` entry in [`../../assets/model_profiles.json`](../../assets/model_profiles.json). Full dispatch wrappers live in [`cli-opencode`](../../../../cli-opencode/SKILL.md); this section does not own wrapper syntax.

| Field | Value | Implication |
| --- | --- | --- |
| `model_slug` | `kimi-for-coding/k2p7` | Pass as-is to the executor (`--model kimi-for-coding/k2p7`). Provider-prefixed; not the bare `k2p7`. |
| `variant_flag` | `--variant` (accepted-unverified) | `--variant high` is accepted without error (smoke-tested 2026-06-15) but its reasoning-effort effect is not benchmark-confirmed; safe to pass, do not depend on it. **Operational caveat (observed 2026-06-17):** on broad / large-repo scopes it appears to drive **over-exploration → 600s-timeout → 0-bytes** (see §5) — prefer **omitting it** for bounded tasks, and always pair a broad scope with a read-cap + 1200s+ timeout. Whether `--variant high` is the specific driver is not isolated (scope, variant, and timeout all changed in the fix run), but tight-scope + 1200s + no-`--variant` returned cleanly. |
| `agent_policy` | `omit-general` | Do NOT pass `--agent` at the top level — opencode rejects named agents there. State the role in the prompt body. |
| `format_mode` | `json` | Dispatch via `opencode run --format json` for the normalized token/cost/latency envelope. |
| `quota_pool` | `kimi-for-coding` | Dedicated Kimi For Coding subscription pool, independent of `opencode-go`/`minimax`/`xiaomi`. Dispatch cost shows 0. No same-pool fallback target configured. |
| `fallback_target` | `null` | When the pool is exhausted there is no automated fallback model. Escalate or defer. |
| `avg_iter_wall_clock_min` | not yet measured | Size timeout headroom conservatively via the executor-owned wrapper until measured. |

**Slug-drift guard:** re-verify the live slug with `opencode models kimi-for-coding` before automation runs — Kimi/Moonshot ids drift. The provider is `kimi-for-coding`; do NOT use the invented `kimi-token-plan-ams` slug.

**Non-TTY automation rule (executor mechanic):** In any non-interactive automation context, append `</dev/null` to the executor-owned invocation wrapper to prevent stdin blocking. Use the wrapper from [`cli-opencode`](../../../../cli-opencode/SKILL.md), not this profile.

**Fallback target:** none. If the `kimi-for-coding` pool is exhausted, defer the task — do not retry against the same pool.

---

## 7. DESIGN & ILLUSTRATION TASKS (informal observation, n=1)

**Task type:** bento-card visual illustration applying `sk-design` (1 page = Budgetteren, single sample, 2026-06-22 bake-off vs deepseek-v4-pro + mimo-v2.5-pro; same brief, same shell, all three read the design skill).

**Observed — best of the three:** blue-led composition; **orange reserved for the one functional alert**; gold rare/intentional; a cohesive set whose cards map to the feature's facets (per schip / per locatie / overschrijdingsalert / balans). Cleaner brand discipline than deepseek (gold-heavy) or mimo (over-accents). More icon-like/simpler in places, but the most intentional and on-brand. Respected the hard constraints (brand palette only, flat, no gradients).

**Implication:** preferred small-model for **brand-critical illustration / color-budgeted visual** work; the COSTAR + read-cap scaffold (§5) plus an embedded brand brief carries it.

**Caveat:** informal, n=1 fixture / single sample — a dispatch observation, **NOT benchmark evidence**. Mirror of `model_profiles.json#kimi-k2.7-code.strengths`. Path to canonical: `/deep:model-benchmark` (≥3 illustration fixtures × ≥2 samples; results land in `prompt-models/benchmarks/<label>/`).

---

## 8. SEE ALSO

- [`../../assets/model_profiles.json`](../../assets/model_profiles.json) `#kimi-k2.7-code` — Registry entry; the authoritative DATA this profile mirrors.
- [`../../../prompt-improve/references/patterns_evaluation.md`](../../../prompt-improve/references/patterns_evaluation.md) — Generic framework definitions (RCAF § 3, full framework library).
- [`../../../../cli-opencode/SKILL.md`](../../../../cli-opencode/SKILL.md) — Executor MECHANICS for the cli-opencode path (Kimi For Coding); non-TTY rule, permissions, model-selection guidance.
- [`../../../../cli-opencode/assets/prompt_templates.md`](../../../../cli-opencode/assets/prompt_templates.md) — Executor prompt-pack templates (MiniMax TIDD-EC + MiMo COSTAR templates as worked examples of the format).
- [`../pattern_index.md`](../pattern_index.md) — Index of all MECHANICS patterns + ship status.
- [`../models/_index.md`](../models/_index.md) — Sibling model index; see DeepSeek-v4-pro for an opencode-go-tier reasoning peer.
- **Executor quality card:** [`../../../../cli-opencode/assets/prompt_quality_card.md`](../../../../cli-opencode/assets/prompt_quality_card.md) — the model-selection table links to this profile; this closes the navigability round-trip.
