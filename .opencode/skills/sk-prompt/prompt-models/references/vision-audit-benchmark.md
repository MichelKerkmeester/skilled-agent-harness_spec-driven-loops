---
title: Vision Capability and Design-Audit Benchmark
description: Benchmark of small-model vision capability, API transport, visual-audit accuracy, and the recommended design-vision auditor.
trigger_phrases:
  - "small-model vision capability"
  - "design-audit benchmark"
  - "visual design auditor"
  - "vision model transport"
importance_tier: normal
contextType: general
version: 0.9.0.1
---

# Vision capability + design-audit benchmark (small-model rotation)

> Which rotation models accept image input, and which one is an accurate visual-design
> auditor. Established 2026-06-28 while choosing an auditor for the Anobel bento-tile run.

## 1. Capability matrix (image input)

Source: opencode's `models.dev` cache (`~/.cache/opencode/models.json`, the data opencode
itself routes on) cross-checked with a live direct-API probe.

| Model | Provider / base URL | Image input | Notes |
|-------|---------------------|-------------|-------|
| **MiniMax-M3** | `minimax` / `minimax-coding-plan` — `https://api.minimax.io/anthropic/v1` | ✅ text + image + video | `attachment: true`. Anthropic-shaped messages API. |
| **Kimi k2.7 (`k2p7`)** | `kimi-for-coding` — `https://api.kimi.com/coding/v1` | ✅ text + image + video | `attachment: true`. OpenAI-shaped. |
| DeepSeek-v4-pro | `deepseek` — `https://api.deepseek.com` | ❌ text only | Vision lives in a separate DeepSeek-VL model, not this coding flagship. |
| MiMo-v2.5-pro | `xiaomi` — `https://api.xiaomimimo.com/v1` | ❌ text only | Vision lives in a separate MiMo-VL model. |
| GLM-5.2 | `zai-coding-plan` — `https://api.z.ai/api/coding/paas/v4` | ⚠️ accepts images empirically | models.dev flags it `text`-only, but the API **does** accept `image_url` and acts on it. The flag is wrong; capability is real. (`glm-5v-turbo` is the documented VL sibling.) |

Takeaway: of the four coding-flagship candidates, **only MiniMax-M3 and Kimi k2.7 have
vision**. DeepSeek-v4-pro and MiMo-v2.5-pro are text-only — their VL siblings are different
models. GLM-5.2 is multimodal in practice despite its registry flag.

## 2. Transport (direct API — opencode `--file` is broken here)

opencode `run --file <image>` does **not** deliver the image to custom OpenAI-compatible
providers (bug #20802), so vision dispatch must go direct to each provider's HTTP API:

- **MiniMax-M3** — `POST https://api.minimax.io/anthropic/v1/messages`, header `x-api-key: <key>`
  + `anthropic-version: 2023-06-01`; content block `{type:"image", source:{type:"base64",
  media_type:"image/png", data:"<b64>"}}`. Returns clean JSON. (The OpenAI-shaped endpoint
  `api.minimax.io/v1` also sees the image but emits `<think>` prose instead of JSON — use the
  anthropic endpoint.)
- **Kimi k2p7** — `POST https://api.kimi.com/coding/v1/chat/completions`, `Bearer <key>`, OpenAI
  `image_url` data-URI block.
- **GLM-5.2** — `POST https://api.z.ai/api/coding/paas/v4/chat/completions`, `Bearer <key>`,
  OpenAI `image_url` data-URI block. Keep `max_tokens` large — thinking is consumed first.

Keys come from `~/.local/share/opencode/auth.json` (`<provider>.key`).

## 3. Accuracy benchmark (the part that matters)

Vision *capability* ≠ audit *accuracy*. Probed each vision model on two ground-truth render
tiles — a CLEAN tile (no orange, nothing clipped, legible) and a CLIPPED tile (real vertical
overflow) — scoring hallucination (false flaws on the clean tile) vs detection.

| Model | Verdict |
|-------|---------|
| **MiniMax-M3 (anthropic)** | ✅ **WINNER.** Accurate perception, **zero hallucination** — correctly read "green/blue/red, no orange, legible." Returned clean structured JSON. Only weakness: missed the *subtle* vertical clip (false negative) — pair it with a deterministic overflow/CSS check. |
| GLM-5.2 | ❌ **Confabulates.** Invented an "orange CTA" and "`#cccccc` text" that **do not exist** in the files (verified: 0 orange, no `#cccccc`). Its own reasoning trace even said "which I cannot see." A strong generator, an unreliable auditor. |
| Kimi k2p7 | ⚠️ Inconclusive — accepts the image (HTTP 200) but truncated to empty content at a low token budget; needs a larger budget + retest to verdict. |
| MiniMax-M3 (openai ep) | Perceives accurately but emits `<think>` prose, not JSON — wrong endpoint for structured audit. |

Real-world confirmation: MiniMax-M3 (anthropic) then audited 7 Anobel concepts (35 tiles) and
returned specific, accurate, file-grounded findings (panel overflow, eyebrow overlapping a
node, too-light bottom row) — no hallucinated palette violations.

## 4. Recommendation

- **Design-vision auditor of record = MiniMax-M3** via the anthropic endpoint + base64 image,
  paired with the deterministic gates (`contrast_check.py`, palette/anti-tell greps, render
  inspection) for the hard contrast/palette/overflow facts MiniMax can miss.
- **GLM-5.2 = generator, not auditor.** Use it for vision-to-code; do not trust its self-audits.
- DeepSeek-v4-pro and MiMo-v2.5-pro cannot audit images at all (text-only).

See also: `models/minimax-m3.md`, `models/kimi-k2.7-code.md`, `models/glm-5.2.md` §7.
