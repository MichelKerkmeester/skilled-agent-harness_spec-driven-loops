---
title: GLM-5.2 Prompt-Craft Profile
model_id: "glm-5.2"
description: How to prompt GLM-5.2 (Z.AI GLM Coding Plan, slug zai-coding-plan/glm-5.2) via cli-opencode — COSTAR framework (empirical, benchmark 008 — best-of-tied perfect tier; fallback TIDD-EC, avoid RCAF) with lean pre-planning over the 1M window, file-anchored context scaffold, Z.AI Coding Plan dispatch gotchas, and native vision-to-code image input (§7).
trigger_phrases:
  - "glm-5.2 prompt framework"
  - "glm-5.2 dispatch scaffold"
  - "z.ai coding plan prompting"
  - "glm-5.2 dispatch gotchas"
  - "glm-5.2 vision image input"
  - "glm-5.2 vision to code"
importance_tier: normal
contextType: implementation
version: 0.8.1.0
---

# GLM-5.2 Prompt-Craft Profile

Single source of truth for how to prompt GLM-5.2 in the small-model rotation. Framework choices mirror `recommended_frameworks` in the model-profiles registry (the DATA source); executor MECHANICS live in `cli-opencode`.

---

## 1. OVERVIEW

### Purpose

This profile is the single source for how to prompt GLM-5.2, the flagship long-horizon coding model dispatched through `cli-opencode` on the dedicated **Z.AI GLM Coding Plan** (provider `zai-coding-plan`, slug `zai-coding-plan/glm-5.2`). It mirrors the `glm-5.2` entry in `model_profiles.json`, covering its framework, scaffold, and dispatch gotchas.

### When to Use

- Before dispatching GLM-5.2 through `cli-opencode`.
- When choosing its prompt framework and scaffold shape.
- When you need its dispatch gotchas (provider path, quota pool, variant/reasoning behavior, thinking + tool-calling quirks).

### Core Principle

COSTAR + lean pre-planning, framed for the task and output shape. The 1M window is for front-loading explicit file-anchored Context, not unstructured dumps. (Benchmark 008 on strict validators put COSTAR/TIDD-EC/CIDI/RACE at perfect correctness and RCAF weakest — see §4 — so the default is COSTAR, the most token-efficient of the perfect tier and the cross-model-corroborated pick.)

---

## 2. IDENTITY

| Field | Value |
| --- | --- |
| Model slug | `zai-coding-plan/glm-5.2` (display name "Z.AI Coding Plan / GLM-5.2") |
| Canonical id | `glm-5.2` |
| Context window | 1,000,000 tokens (1M); 131,072 (128K) output — per Z.AI docs, re-verify on the install |
| Modalities | text + **vision (image input)** — native multimodal / vision-to-code, confirmed live 2026-06-28 (see §7) |
| Primary quota pool | `zai-coding-plan` (dedicated Z.AI GLM Coding Plan subscription pool) |
| Executor path | `cli-opencode` → provider `zai-coding-plan` → pool `zai-coding-plan` |
| Avg iteration wall-clock | OBSERVED (benchmark 008, n=45 small code-gen cells): latency 6–161s, avg ~26s; thinking-on drives high variance. Budget generous timeouts for non-trivial scopes. |
| Fallback target | none |

GLM-5.2 is the **flagship long-horizon coding** model in the rotation — Z.AI positions it as their strongest coding model to date (docs report Terminal-Bench 2.1 81.0 and SWE-bench Pro 62.1, both above GLM-5.1), with a usable 1M context for sprawling multi-file and multi-repo work. It runs on the Z.AI GLM Coding Plan subscription, on a quota pool independent of `kimi-for-coding` / `minimax` / `xiaomi`. It supersedes the gateway-only `glm-5.1` that was removed from cli-opencode in v1.3.15.0 (no direct provider existed then; `zai-coding-plan` now provides one).

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** COSTAR
**Fallback:** TIDD-EC
**Avoid:** RCAF (objectively weakest on strict validators — benchmark 008)
**Pre-planning density:** LEAN

These choices mirror `recommended_frameworks` in [`../../assets/model_profiles.json`](../../assets/model_profiles.json) entry `glm-5.2` (the DATA source of truth). See `../../../prompt-improve/references/patterns_evaluation.md` for the generic COSTAR / TIDD-EC / RCAF definitions — this profile records the per-model choice and rationale only.

**Why COSTAR for GLM-5.2 (empirical, benchmark 008):** On invalid-dominant strict validators, four frameworks tied at perfect correctness — COSTAR, TIDD-EC, CIDI, RACE — while RCAF was the measured-weakest (correctness 0.976, the only sub-perfect framework, plus the worst format adherence at 0.889). Among the perfect tier, COSTAR is the safest default: it is the **most token-efficient** (13 median output words vs TIDD-EC 38, CIDI/RACE 94) AND the most cross-validated pick — it is also the empirical winner for kimi-k2.7-code (benchmark 007) and MiMo-V2.5-Pro (benchmark 004), two comparable strong coding models. COSTAR frames by objective + output-shape rather than guardrails, which fits a strong model that does not need heavy scaffolding. TIDD-EC (fallback) tied on correctness and is the 2nd-most token-efficient. **Avoid RCAF** — it was the only framework to miss strict-validator edges and had the weakest format adherence. The trust verdict was a TIE among the perfect tier (top-pair COSTAR vs TIDD-EC, margin 0, 90% CI [0,0]), so this is "best-of-tied + corroborated", not a decisive single winner.

> **Note on CRAFT:** phase 1 recorded CRAFT (from Z.AI's official prompting guidance) as a doc-guided default. CRAFT is **not in the benchmark harness framework registry** `[rcaf, race, cidi, tidd-ec, costar]`, so it could not be measured; the empirical winner among the five supported frameworks (COSTAR) replaces it. Z.AI's structured Goal/Context/Constraints/Done-when guidance still maps cleanly onto the COSTAR scaffold below.

---

## 4. BENCHMARK EVIDENCE

**Run `008-glm-5.2-prompt-framework`.** A 5-framework bakeoff on **invalid-dominant strict validators** (`validate-ipv4` + `validate-date` + `validate-semver`) — where a lax-but-plausible solution scores <1.0 — at 3 samples/cell of real `zai-coding-plan/glm-5.2` dispatches, graded by the **deterministic hidden-test oracle** (`--grader noop`, no LLM-judge bias). Designed with strict validators from the start (the lesson from kimi's saturated run 006 → discriminating run 007).

**Result: correctness SEPARATED** (run status `separable`, not saturated). Per-framework correctness (n=9):

| Rank | Framework | Correctness | Format adherence | Output words (median) |
| ---: | --- | ---: | ---: | ---: |
| 1 | costar | 1.000 | 1.000 | 13 |
| 2 | tidd-ec | 1.000 | 1.000 | 38 |
| 3 | cidi | 1.000 | 1.000 | 94 |
| 4 | race | 1.000 | 1.000 | 94 |
| 5 | rcaf | 0.976 | 0.889 | 85 |

**Trust verdict: TIE on correctness** — the four perfect frameworks cannot be statistically separated (top-pair COSTAR vs TIDD-EC margin 0, 90% CI [0,0]). But the structure is actionable: **`rcaf` is objectively the weakest** — it was the only framework to miss strict-validator cases and had the worst format adherence — so it is avoided for this model, and the default sits in the perfect tier (COSTAR; see §3 for why COSTAR over the equally-correct TIDD-EC/RACE/CIDI). 1 of 45 dispatches was a transient infra failure (exit -1, `dispatch_failed`) and was excluded from scoring; the affected framework (costar) was perfect on its 8 valid dispatches. Outputs: `prompt-models/benchmarks/008-glm-5.2-prompt-framework/` (`results.json`, `aggregate.json`, `synthesis.md`). Do not carry scores from sibling models — contexts and providers differ; the cross-model COSTAR agreement is corroboration, not transfer.

---

## 5. TUNED TEMPLATE SNIPPET

The generic COSTAR framework definition lives in [`../../../prompt-improve/references/patterns_evaluation.md`](../../../prompt-improve/references/patterns_evaluation.md) — do not restate it here.

The scaffold below is the GLM-5.2-specific COSTAR fill (lean pre-planning). Copy-paste-ready; executor-agnostic (no opencode invocation wrapper — those live in the executor cards).

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
weaker framings (rcaf) are exactly where GLM-5.2 let a strict edge case slip (benchmark 008).

## Style
Production code, no narration. Strictly in scope: no invented parameters, helper globals, or behaviour.

## Tone
Terse and literal.

## Audience
A senior engineer who will run the output against a strict hidden-test oracle.

## Response
[Exact output contract, e.g.: "Return ONLY the function source — no prose, no test code, no markdown fence."]
```

**GLM-5.2-specific notes for the scaffold:**

- Keep `Context` as the longest block — this is where the 1M window earns its place; name files in a stable order.
- The decisive lever is the `Objective`: enumerate adversarial edge cases explicitly. That is exactly where benchmark 008 separated the frameworks — rcaf let strict-validator edges slip; costar/tidd-ec/cidi/race did not.
- COSTAR is also the tersest correct output (13 median words in benchmark 008) — good for token budget on top of a large context.
- Scope to one concern per dispatch with a **hard read-cap** ("read ≤N files, then emit and stop browsing") on broad scopes; the 1M context can invite over-exploration (cf. kimi-k2.7). GLM-5.2 has **thinking on by default** with high latency variance (6–161s observed, benchmark 008) — budget a generous timeout.

---

## 6. DISPATCH GOTCHAS

Model-specific capability fields and flags are sourced from the `glm-5.2` entry in [`../../assets/model_profiles.json`](../../assets/model_profiles.json). Full dispatch wrappers live in [`cli-opencode`](../../../../cli-opencode/SKILL.md); this section does not own wrapper syntax.

| Field | Value | Implication |
| --- | --- | --- |
| `model_slug` | `zai-coding-plan/glm-5.2` | Pass as-is to the executor (`--model zai-coding-plan/glm-5.2`). Provider-prefixed. |
| `variant_flag` | `--variant` (accepted-unverified) | GLM has native `reasoning_effort` (`high`, `max`); whether opencode's `--variant high/max` forwards to it is NOT confirmed. Smoke-test before relying on it; do not depend on a reasoning bump. Benchmark 008 ran with `variant: default` (no `--variant`). |
| `agent_policy` | `omit-general` | Do NOT pass `--agent` at the top level — opencode rejects named agents there. State the role in the prompt body (the COSTAR `Audience`/`Style`). |
| `format_mode` | `json` | Dispatch via `opencode run --format json` for the normalized token/cost/latency envelope. |
| `quota_pool` | `zai-coding-plan` | Dedicated Z.AI GLM Coding Plan subscription pool, independent of `kimi-for-coding` / `minimax` / `xiaomi`. Dispatch cost shows 0/null (subscription — confirmed across benchmark 008's 45 cells). No same-pool fallback target. |
| `fallback_target` | `null` | When the pool is exhausted there is no automated fallback model. Escalate or defer. |
| Latency | 6–161s observed (benchmark 008, n=45 small cells); avg ~26s | Thinking-on-by-default drives ~27x latency variance. Budget generous timeouts; a tight timeout will kill the slow tail. |
| Transient failures | ~1/45 (exit -1, `dispatch_failed`) in benchmark 008 | Expect occasional transient dispatch failures at scale; retry the cell rather than treating it as a model error. |
| Thinking | on by default; preserved on Coding Plan endpoint | Expect `reasoning_content`; return it unmodified where applicable; budget latency/output. |
| `tool_choice` | `auto` only (Z.AI docs) | Function-calling supports only `tool_choice="auto"` — do not pass an unsupported value. |
| Streaming tool calls | need `tool_stream=true` (Z.AI docs) | When streaming tool calls, set `stream=true` AND `tool_stream=true`, then concatenate streamed `delta.tool_calls[*].function.arguments`. |

**Slug-drift guard:** re-verify the live slug with `opencode models zai-coding-plan` before automation runs — Z.AI ids drift (the provider also serves `glm-4.7`, `glm-5.1`, `glm-5-turbo`, `glm-5v-turbo`). The provider is `zai-coding-plan`.

**Non-TTY automation rule (executor mechanic):** In any non-interactive automation context, append `</dev/null` to the executor-owned invocation wrapper to prevent stdin blocking. Use the wrapper from [`cli-opencode`](../../../../cli-opencode/SKILL.md), not this profile.

**Fallback target:** none. If the `zai-coding-plan` pool is exhausted, defer the task — do not retry against the same pool.

---

## 7. VISION / IMAGE INPUT (vision-to-code)

GLM-5.2 is **natively multimodal** — it reads images and builds frontend code from a design (vision-to-code), the trait it is most known for. Confirmed live on this install 2026-06-28 (packet `157-glm-5-2-support/006`): a `glm-5.2` request carrying an `image_url` content block returned a correct reading of the attached UI, and a budget dashboard tile was then built from a reference screenshot.

**For design work, feed pixels — not a text transcription.** Transcribing a reference image to prose is lossy (it drops the refinement that lives in the pixels) and yields "same composition, less refined" output. Attach the actual image.

### Working transport (image input)

| Concern | Value |
| --- | --- |
| Endpoint | `https://api.z.ai/api/coding/paas/v4/chat/completions` — the Coding Plan endpoint. The general `/api/paas/v4` returns 429 "insufficient balance" for the subscription key. |
| Auth | `Authorization: Bearer <zai-coding-plan key>` (from opencode `auth.json`). |
| Image payload | OpenAI-style content array: a `{type:"image_url", image_url:{url:"data:image/png;base64,…"}}` block alongside the `{type:"text",…}` block. |
| Token budget | Thinking is on by default and consumes the budget first — set a LARGE `max_tokens` (≥ ~12k for an HTML build) or `content` returns empty with `finish_reason:"length"`. |
| Model id (raw) | `glm-5.2` accepts images (also `glm-4.6v`); non-vision `glm-4.6` rejects image content with error code 1210. |

### opencode `--file` caveat — do NOT rely on it for this provider

`opencode run --file <image>` does **not** deliver image attachments to vision models on **custom OpenAI-compatible providers** — upstream bug **opencode #20802**, and `zai-coding-plan` is exactly such a provider. Verified 2026-06-28: `--file` to `zai-coding-plan/glm-5.2` → model replies `NO_IMAGE_RECEIVED` (no image part attached); `glm-5v-turbo --file` → hang/timeout. Until #20802 is fixed (or an opencode-native vision config is confirmed), use the direct Coding Plan API above for image input. Because that bypasses `opencode run`, it sits OUTSIDE the cli-opencode dispatch mandate — a deviation justified only by the verified #20802 breakage; flag it to the operator.

### Large vision generations: DISABLE thinking

On big vision-to-code requests (full HTML tile from a reference image), GLM-5.2 on the Z.AI
Coding Plan can fall into a **reasoning spiral** — it spends the entire `max_tokens` budget in
`reasoning_content` (often confabulating that it "cannot see images"), returning
`finish_reason: undefined` / `length` with **empty `content`**. Symptom: repeated `len=0`
failures even though trivial text calls succeed. Fix: send `"thinking": {"type": "disabled"}`
in the request body — the budget then goes to output, and the same prompt that returned 0 bytes
returns a complete ~10–12 KB tile (`finish_reason: stop`, `reasoning=0`). Verified 2026-06-29.
Keep `max_tokens` generous regardless; strip a leading ```html fence from the output.

### Generator, not auditor

GLM-5.2 reads images well enough to BUILD from them, but it is **not** a reliable visual
auditor: asked to critique a render it confabulates specific flaws that are not present
(e.g. claimed an "orange CTA" + "`#cccccc` text" on tiles that had neither — verified 0
orange, no such hex; 2026-06-28). Use it to generate; do not trust its self-audits. For an
accurate vision audit, **MiniMax-M3** (anthropic endpoint + base64 image) is the rotation's
auditor of record — see [`../vision-audit-benchmark.md`](../vision-audit-benchmark.md).

### Render-feedback loop (iterating on a design)

Round 1: attach the reference image + the house-style/design-system contract → the model builds. Round N: render the model's own output to an image and attach BOTH the reference AND the current render → "here is the target, here is your result, close these named gaps." Keep the deterministic gates (contrast/proof) as checks — never let a gate pre-empt a refined design choice.

---

## 8. SEE ALSO

- [`../../assets/model_profiles.json`](../../assets/model_profiles.json) `#glm-5.2` — Registry entry; the authoritative DATA this profile mirrors.
- [`../../../prompt-improve/references/patterns_evaluation.md`](../../../prompt-improve/references/patterns_evaluation.md) — Generic framework definitions (COSTAR, TIDD-EC, RCAF, full library).
- [`../../../../cli-opencode/SKILL.md`](../../../../cli-opencode/SKILL.md) — Executor MECHANICS for the cli-opencode path (Z.AI GLM Coding Plan); non-TTY rule, permissions, model-selection guidance.
- [`../pattern_index.md`](../pattern_index.md) — Index of all MECHANICS patterns + ship status.
- [`../models/_index.md`](../models/_index.md) — Sibling model index; see mimo-v2.5-pro for the other 1M-context rotation peer, and kimi-k2.7-code for the other COSTAR-winning coding model.
- [`../vision-audit-benchmark.md`](../vision-audit-benchmark.md) — Cross-model vision capability + design-audit accuracy (GLM generates but confabulates audits; MiniMax-M3 is the accurate auditor).
- **Benchmark outputs:** `../../benchmarks/008-glm-5.2-prompt-framework/` — results.json, aggregate.json, synthesis.md.
- **Adoption packet:** `157-glm-5-2-support` — phase 1 registration; phase 2 framework bakeoff (008); phase 3 promotion.
