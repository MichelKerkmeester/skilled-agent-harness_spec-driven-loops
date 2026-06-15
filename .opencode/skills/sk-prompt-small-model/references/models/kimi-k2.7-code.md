---
title: Kimi-k2.7-code Prompt-Craft Profile
model_id: "kimi-k2.7-code"
description: How to prompt Kimi-k2.7-code (Kimi For Coding plan, slug kimi-for-coding/k2p7) via cli-opencode — RCAF framework with medium pre-planning over the 256k window pending the bakeoff-006 result, file-anchored context scaffold, and Kimi For Coding dispatch gotchas.
trigger_phrases:
  - "kimi k2.7 prompt framework"
  - "kimi k2.7 code dispatch scaffold"
  - "kimi for coding prompting"
  - "kimi k2.7 dispatch gotchas"
importance_tier: normal
contextType: implementation
---

# Kimi-k2.7-code Prompt-Craft Profile

Single source of truth for how to prompt Kimi-k2.7-code in the small-model rotation. Framework choices mirror `recommended_frameworks` in the model-profiles registry (the DATA source); executor MECHANICS live in `cli-opencode`.

---

## 1. OVERVIEW

### Purpose

This profile is the single source for how to prompt Kimi-k2.7-code, the coding-optimized large-context Kimi dispatched through `cli-opencode` on the dedicated **Kimi For Coding** subscription plan (provider `kimi-for-coding`, slug `kimi-for-coding/k2p7`). It mirrors the `kimi-k2.7-code` entry in `model-profiles.json`, covering its framework, scaffold, and dispatch gotchas.

### When to Use

- Before dispatching Kimi-k2.7-code through `cli-opencode`.
- When choosing its prompt framework and scaffold shape.
- When you need its dispatch gotchas (provider path, quota pool, variant behavior).

### Core Principle

RCAF + medium pre-planning: the 256k window is for front-loading explicit file-anchored Context, not for unstructured raw dumps. (Bakeoff 006 returned a correctness-saturated TIE — see §4 — so RCAF is retained as the default; framework choice did not affect correctness for this model.)

---

## 2. IDENTITY

| Field | Value |
| --- | --- |
| Model slug | `kimi-for-coding/k2p7` (display name "Kimi K2.7 Code") |
| Canonical id | `kimi-k2.7-code` |
| Context window | 262,144 tokens (256k); 32,768-token output |
| Primary quota pool | `kimi-for-coding` (dedicated Kimi For Coding subscription pool) |
| Executor path | `cli-opencode` → provider `kimi-for-coding` → pool `kimi-for-coding` |
| Avg iteration wall-clock | not yet measured |
| Fallback target | none |

Kimi-k2.7-code is the **coding-optimized large-context** Kimi in the rotation — 256k tokens makes it a strong choice for sprawling diff reviews, long-file inspection, multi-repo evidence gathering, and cross-cutting refactors. It runs on the Kimi For Coding subscription plan (dispatch cost shows 0), on a quota pool independent of `opencode-go`. It supersedes the historical `kimi-k2.6` (which ran on the shared `opencode-go` gateway).

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** RCAF
**Fallback:** none specified in registry
**Avoid:** none specified in registry
**Pre-planning density:** MEDIUM

These choices mirror `recommended_frameworks` in [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) entry `kimi-k2.7-code` (the DATA source of truth). See `patterns_evaluation.md` for the generic RCAF, COSTAR, and RACE definitions — this profile records the per-model choice and rationale only.

**Why RCAF for Kimi-k2.7-code (default-unverified, benchmark-inconclusive):** RCAF's four elements — Role, Context, Action, Format — map cleanly onto large-context coding work, and RCAF at medium pre-planning density is the convention default for unverified models in this rotation. Benchmark `006-kimi-k2.7-prompt-framework` ran a full 5-framework bakeoff but returned a **TIE — correctness saturated** (see §4): Kimi K2.7 Code produced fully-correct code under every framework, so the bakeoff could not crown a winner. RCAF is therefore retained as the convention default rather than replaced. The weak secondary signals (efficiency within noise; a subjective LLM-judge that slightly favored COSTAR/CIDI for clarity) are not strong enough to override it.

**Counter-intuitive note:** the large context window is a capability, not a licence to send unstructured dumps. Prompt structure still matters — pad the `Context` block with explicit file anchors and line ranges rather than trusting the model to self-select from a raw paste. This keeps the action section tight and makes the output verifiable.

---

## 4. BENCHMARK EVIDENCE

Benchmark **`006-kimi-k2.7-prompt-framework`** ran a full 5-framework bakeoff (`rcaf`, `race`, `cidi`, `tidd-ec`, `costar`) across 2 T3 coding fixtures × 3 samples, with 30/30 real `kimi-for-coding/k2p7` dispatches succeeding.

**Verdict: TIE — correctness SATURATED.** Every framework scored correctness 1.0 + format 1.0 on the deterministic oracle: Kimi K2.7 Code produced fully-correct code under all five frameworks, so correctness could not rank them. The saturation guard dropped to efficiency as the ranking key, where the top-pair margin (0.5 words) sat far inside the noise floor (90% CI [-4.67, 5.17] overlaps zero) — no trustworthy winner. The engine's own action for these fixtures was "demote-to-smoke" (too easy to discriminate this model).

**Secondary LLM-judge (gpt-5.5, the saturation tie-break — subjective, NOT a correctness verdict):** mean scores cidi 0.989 ≈ costar 0.989 > tidd-ec 0.983 ≫ race 0.881 > rcaf 0.726. Treat with caution — the judge flagged some oracle-*confirmed-correct* code (RCAF/RACE on the SemVer fixture) as buggy, the known LLM-judge subjectivity failure mode, so this ranks perceived clarity, not correctness.

**What this means for framework choice:** for Kimi K2.7 Code on coding tasks, framework choice does **not** affect correctness — it is robust across all five. RCAF is retained as the `default-unverified` convention default; the registry status stays `default-unverified` because no framework empirically won. A sharper recommendation would need a follow-up bakeoff with harder, less-saturating fixtures (and ideally a correctness-anchored judge); the weak secondary signal hints COSTAR/CIDI for clarity. Do not carry scores from sibling models — their contexts and providers differ enough that score transfer would be misleading.

---

## 5. TUNED TEMPLATE SNIPPET

The generic RCAF framework definition and its full layered-RCAF YAML are defined in [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) § 3 "RCAF Mastery Patterns" — do not restate them here.

The scaffold below is the Kimi-k2.7-code-specific fill of the RCAF body. Copy-paste-ready; executor-agnostic (no opencode invocation wrapper included — those live in the executor cards).

```text
## Role
You are a senior software engineer specialising in [domain: e.g. TypeScript / Python / Go].
Your task requires reading across [N] files / [N] repos and producing a unified analysis or change.

## Context
<!-- LARGE-CONTEXT ANCHOR BLOCK — keep explicit; do not paste raw file dumps -->
Target files / ranges:
  - <path/to/file-A.ts>  (lines <start>–<end> or "full file")
  - <path/to/file-B.py>  (lines <start>–<end> or "full file")
  [add entries for every relevant file or module]

Background:
  - [One-paragraph description of the codebase area, its purpose, and why this task exists]
  - Constraints: [Any hard limits — API compatibility, performance envelope, do-not-touch areas]
  - Related prior work: [PR/commit/spec link if relevant]

## Action
[Single primary directive, e.g.:]
  "Review all listed files for <concern> and produce a ranked list of findings."
  OR
  "Refactor <pattern X> to <pattern Y> across all listed files, maintaining the existing public API."

Pre-plan (medium density):
  1. Read each anchored file in the order listed above.
  2. Identify occurrences of [target pattern / concern].
  3. [Next logical step — e.g. "Group by severity" or "Produce a unified diff".]
  4. Verify the output satisfies [acceptance criterion].

## Format
Output:
  - [Structured list / unified diff / markdown table — pick one]
  - Max [N] items or [N] lines; favour precision over completeness.
  - Include file path + line number for every finding or edit.
  - End with a one-paragraph summary of confidence and any unresolved ambiguities.
```

**Kimi-k2.7-code-specific notes for the scaffold:**

- Keep `Context` as the longest block — this is where the 256k window earns its place.
- The `Action` pre-plan should name files in the same order as the `Context` block; large-context Kimi models are sensitive to ordering mismatches on long contexts.
- Avoid open-ended `Action` directives like "analyse and improve" — scope to one concern per dispatch to keep results verifiable.
- This scaffold reflects the RCAF default; revisit it once bakeoff 006 names the empirically-best framework (§4).

---

## 6. DISPATCH GOTCHAS

Model-specific capability fields and flags are sourced from the `kimi-k2.7-code` entry in [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json). Full dispatch wrappers live in [`cli-opencode`](../../../cli-opencode/SKILL.md); this section does not own wrapper syntax.

| Field | Value | Implication |
| --- | --- | --- |
| `model_slug` | `kimi-for-coding/k2p7` | Pass as-is to the executor (`--model kimi-for-coding/k2p7`). Provider-prefixed; not the bare `k2p7`. |
| `variant_flag` | `--variant` (accepted-unverified) | `--variant high` is accepted without error (smoke-tested 2026-06-15) but its reasoning-effort effect is not benchmark-confirmed; safe to pass, do not depend on it. |
| `agent_policy` | `omit-general` | Do NOT pass `--agent` at the top level — opencode rejects named agents there. State the role in the prompt body. |
| `format_mode` | `json` | Dispatch via `opencode run --format json` for the normalized token/cost/latency envelope. |
| `quota_pool` | `kimi-for-coding` | Dedicated Kimi For Coding subscription pool, independent of `opencode-go`/`minimax`/`xiaomi`. Dispatch cost shows 0. No same-pool fallback target configured. |
| `fallback_target` | `null` | When the pool is exhausted there is no automated fallback model. Escalate or defer. |
| `avg_iter_wall_clock_min` | not yet measured | Size timeout headroom conservatively via the executor-owned wrapper until measured. |

**Slug-drift guard:** re-verify the live slug with `opencode models kimi-for-coding` before automation runs — Kimi/Moonshot ids drift. The provider is `kimi-for-coding`; do NOT use the invented `kimi-token-plan-ams` slug.

**Non-TTY automation rule (executor mechanic):** In any non-interactive automation context, append `</dev/null` to the executor-owned invocation wrapper to prevent stdin blocking. Use the wrapper from [`cli-opencode`](../../../cli-opencode/SKILL.md), not this profile.

**Fallback target:** none. If the `kimi-for-coding` pool is exhausted, defer the task — do not retry against the same pool.

---

## 7. SEE ALSO

- [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) `#kimi-k2.7-code` — Registry entry; the authoritative DATA this profile mirrors.
- [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) — Generic framework definitions (RCAF § 3, full framework library).
- [`../../../cli-opencode/SKILL.md`](../../../cli-opencode/SKILL.md) — Executor MECHANICS for the cli-opencode path (Kimi For Coding); non-TTY rule, permissions, model-selection guidance.
- [`../../../cli-opencode/assets/prompt_templates.md`](../../../cli-opencode/assets/prompt_templates.md) — Executor prompt-pack templates (MiniMax TIDD-EC + MiMo COSTAR templates as worked examples of the format).
- [`../pattern-index.md`](../pattern-index.md) — Index of all MECHANICS patterns + ship status.
- [`../models/_index.md`](../models/_index.md) — Sibling model index; see GLM-5.1 and DeepSeek-v4-pro for large-context peers; `kimi-k2.6.md` for the historical opencode-go Kimi path.
- **Executor quality card:** [`../../../cli-opencode/assets/prompt_quality_card.md`](../../../cli-opencode/assets/prompt_quality_card.md) — the model-selection table links to this profile; this closes the navigability round-trip.
