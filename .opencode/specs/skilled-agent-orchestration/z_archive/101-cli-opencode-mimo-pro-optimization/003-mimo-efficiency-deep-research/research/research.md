# MiMo-V2.5-Pro efficiency research (via cli-opencode)

> **Scope**: how to best use and maximize the efficiency of `xiaomi-token-plan-ams/mimo-v2.5-pro` when driven by another AI through `opencode run`. Seeds the registry backfill + the 126/004 prompt-framework benchmark.
> **Method**: live web research (current 2026 sources) + live opencode provider metadata + on-machine probe. cli-codex gpt-5.5 was attempted as the research executor (per the 120/002 precedent) but codex-cli 0.135.0 lacks the `--search` flag; web facts were gathered via the built-in WebSearch tool instead. Confidence tags: HIGH / MEDIUM / LOW / UNKNOWN.

## 1. Model identity & provenance — HIGH
- **MiMo-V2.5-Pro** is Xiaomi's flagship open LLM, released **2026-04-22** (sibling: the smaller `mimo-v2.5`). Source: [MarkTechPost release](https://www.marktechpost.com/2026/04/22/xiaomi-releases-mimo-v2-5-pro-and-mimo-v2-5-matching-frontier-model-benchmarks-at-significantly-lower-token-cost/), [Xiaomi MiMo](https://mimo.xiaomi.com/mimo-v2-5-pro/), [HF: XiaomiMiMo/MiMo-V2.5-Pro](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro).
- **Architecture**: Mixture-of-Experts, **~1.02T total / 42B active** params. Interleaved Sliding-Window + Global Attention (6:1, 128-token window) → ~7× KV-cache reduction at long context. Native Multi-Token Prediction (~3× output throughput). Pre-trained on 27T tokens, FP8, native 32K then extended to 1M. Multimodal (text/image/audio/video).
- **Hosting here**: opencode provider `xiaomi-token-plan-ams`, OpenAI-compatible endpoint **`https://token-plan-ams.xiaomimimo.com/v1`** (`@ai-sdk/openai-compatible`), provider cost in opencode's registry shows `input:0 output:0` → **subscription/Token-Plan billing**, not pay-per-token. Source: `opencode models xiaomi-token-plan-ams --verbose` (on-machine).

## 2. Context window & active budget — HIGH (window) / MEDIUM (budget rule)
- **Context window: 1,000,000 tokens** (1M). Native 32K training, RoPE-extended to 1M; retains usable long-context skill (≈0.56 BFS / 0.92 Parents at 512k; 0.37 / 0.62 at 1M — far past where MiMo-V2-Pro collapses). Sources: [ArtificialAnalysis](https://artificialanalysis.ai/models/mimo-v2-5-pro), [vLLM recipe](https://recipes.vllm.ai/XiaomiMiMo/MiMo-V2.5), WebSearch.
- **Recommended active budget**: apply the repo's 70% safe-fill rule → **~700,000 tokens** working budget, but note real-world long-context quality degrades past ~512k; for orchestrated coding/review dispatches keep inputs well under 256k for best fidelity (MEDIUM — extrapolated from the degradation curve, not a published cliff).

## 3. Reasoning / `--variant` — SUPPORTED → use HIGH (operator-corrected)
- **[CORRECTED 2026-06-02 — operator ground truth + live probe]: opencode DOES expose low/medium/high reasoning for MiMo via `--variant`, and a live probe confirmed `--variant high` is accepted on opencode 1.15.13. Standing contract: **always dispatch MiMo with `--variant high`.** The research-time "unverified" below was a tooling limitation (the OpenAI-compatible adapter masked it), not a real constraint.**
- ~~MiMo-V2.5-Pro is a reasoning-capable model, but whether the Token-Plan OpenAI-compatible endpoint honors an opencode `--variant` lever is UNVERIFIED... Recommend omitting `--variant` until a live ablation confirms it.~~ (Superseded by the correction above.)

## 4. Tool-calling style — HIGH
- Strongly agentic: documented to **sustain 1,000+ sequential tool calls** without losing coherence, completing multi-day expert tasks autonomously. Native function-calling, OpenAI-compatible tool schema. `tool_calling: "native"` is correct in the registry. Sources: [buildfastwithai review](https://www.buildfastwithai.com/blogs/xiaomi-mimo-v2-5-pro-review-2026), MarkTechPost.

## 5. Output-verification heuristics — MEDIUM
- MiMo is **token-efficient** (40–60% fewer tokens/trajectory than Claude Opus 4.6 / Gemini 3.1 Pro / GPT-5.4 on agentic benchmarks) → it tends toward terse, direct output. When orchestrating headless: (a) verify completeness (terse models can under-explain rationale — ask for explicit reasoning when needed); (b) it follows instructions well (frontier-class SWE-bench Pro 57.2) so format adherence is usually good; (c) for code, run stack-appropriate syntax/test verification as always — do not trust output blindly. The orchestrator should request explicit file paths + a short self-check list in the prompt.

## 6. Quota / rate-limit semantics — MEDIUM
- Token Plan (Europe) = **subscription** (opencode cost shows 0/0). Likely a request/-window or seat quota rather than per-token burn (parallels the MiniMax Token Plan's rolling-window model), but the **exact window is UNKNOWN** — not published in the sources reviewed. Cheap-iteration alternative: the free `opencode/mimo-v2.5-free` (opencode-go gateway, `mimo-v2.5` tier) for benchmark/iteration work to avoid spending the Pro subscription window.

## 7. Routing heuristics (MiMo vs MiniMax vs DeepSeek for cli-opencode) — MEDIUM
- **Pick MiMo-V2.5-Pro when**: the task needs (a) very long context (up to 1M — the largest of the three), (b) heavy multi-step agentic/tool-calling work (1000+ calls), or (c) token-cost efficiency on long agentic trajectories. Frontier-class coding (SWE-bench Pro 57.2).
- **Pick MiniMax (minimax-coding-plan)** for guardrail-sensitive structured tasks where its TIDD-EC + dense framing is already tuned (per 120/003), or when the MiMo subscription window is exhausted.
- **Pick DeepSeek (opencode-go/deepseek-v4-pro, default)** for routine low-cost dispatches that don't need MiMo's long context or agentic depth.
- **Free tier**: `opencode/mimo-v2.5-free` for cheap MiMo-family iteration.

## 8. Prompt-framework hypotheses for 126/004 — MEDIUM (to be tested, NOT concluded)
- Per-model framework winners diverge: SWE-1.6 → RCAF (lean); MiniMax-2.7 → TIDD-EC + dense (guardrail-heavy). MiMo is **frontier-class and a strong instruction-follower**, which historically correlates with doing well under **leaner** frameworks (RCAF/RACE) because it needs fewer explicit Do/Don't guardrails — but its terseness might benefit from a structured scaffold that forces fuller output. **Hypothesis to test in 004**: RCAF or RACE (lean/structured) edges out TIDD-EC for MiMo; dense pre-planning may be unnecessary given its native planning strength. Benchmark all five (RCAF/RACE/CIDI/TIDD-EC/COSTAR) + a pre-planning-density sweep on real `mimo-v2.5-pro` dispatches. **Do not assume a winner — 004 measures it.**

## Prioritized Deltas

### P0 (apply now — high confidence)
- `sk-prompt/assets/model-profiles.json` → `mimo-v2.5-pro.context_length`: `null` → **`1000000`** (confidence 0.95; WebSearch + ArtificialAnalysis + vLLM).
- `sk-prompt/assets/model-profiles.json` → `mimo-v2.5-pro` executor `notes`: add the OpenAI-compatible endpoint `https://token-plan-ams.xiaomimimo.com/v1` and the cost-0 (subscription) fact (confidence 0.95; opencode `--verbose`).
- `sk-prompt/assets/model-profiles.json` → `mimo-v2.5-pro.strengths`: add "1,000,000-token context (largest in the small-model rotation)", "strongly agentic — sustains 1000+ sequential tool calls", "token-efficient (40–60% fewer tokens/trajectory vs frontier models)" (confidence 0.9).

### P1 (apply now — medium confidence)
- `cli-opencode/references/cli_reference.md` §5: note MiMo's 1M context + token-efficiency + agentic strength in the model row's use-case (confidence 0.85).
- `model-profiles.json` weaknesses: keep "--variant unverified" + add "subscription window semantics unverified" (confidence 0.8).

### P2 (defer / for 004)
- Best prompt framework + pre-plan density → set by the 126/004 benchmark (do not pre-fill).
- `--variant` live ablation → optional follow-up if reasoning-effort passthrough matters.

## Sources

<!-- ANCHOR:references -->
- [MiMo-V2.5-Pro | Xiaomi](https://mimo.xiaomi.com/mimo-v2-5-pro/) · [HF: XiaomiMiMo/MiMo-V2.5-Pro](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro) · [MarkTechPost release (2026-04-22)](https://www.marktechpost.com/2026/04/22/xiaomi-releases-mimo-v2-5-pro-and-mimo-v2-5-matching-frontier-model-benchmarks-at-significantly-lower-token-cost/) · [ArtificialAnalysis](https://artificialanalysis.ai/models/mimo-v2-5-pro) · [OpenRouter](https://openrouter.ai/xiaomi/mimo-v2.5-pro) · [buildfastwithai review](https://www.buildfastwithai.com/blogs/xiaomi-mimo-v2-5-pro-review-2026)
- On-machine: `opencode models xiaomi-token-plan-ams --verbose`; live one-shot probe to `xiaomi-token-plan-ams/mimo-v2.5-pro`.
<!-- /ANCHOR:references -->
