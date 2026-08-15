# Iteration 5: Provider model — OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, privacy routing

## Focus

Establish the provider-neutral configuration model: OpenCode Go DeepSeek V4 Flash compatibility (protocol, endpoint, non-thinking), Ollama and llama.cpp local support, provider record fields, privacy-aware local-vs-hosted routing, and streaming/retry semantics.

## Actions Taken

- Read the official OpenCode Go documentation (https://opencode.ai/docs/go/): models, endpoints, usage limits, pricing, privacy.
- Read the official Ollama show-model-details API reference (https://docs.ollama.com/api-reference/show-model-details).
- Read repo-local cli-opencode providers-and-models references and Pi extension provider-registration facts.

## Findings

1. **OpenCode Go DeepSeek V4 Flash endpoint is OpenAI-compatible Chat Completions (confirmed)** — Model ID `deepseek-v4-flash`; endpoint `https://opencode.ai/zen/go/v1/chat/completions`; AI SDK package `@ai-sdk/openai-compatible`. OpenCode config uses `opencode-go/<model-id>` → `opencode-go/deepseek-v4-flash`. [SOURCE: https://opencode.ai/docs/go/]

2. **DeepSeek V4 Flash Go pricing and limits (confirmed)** — Input `$0.14/M`, output `$0.28/M`, cached read `$0.0028/M`, $60/month included usage. Estimated ~31,650 requests per 5-hour window, ~158,150/month. Cheapest coding model on Go after MiMo-V2.5. [SOURCE: https://opencode.ai/docs/go/]

3. **DeepSeek V4 Flash Go privacy class (confirmed)** — "Not used" for model training; 0 days data retention. "ZDR agreement is renewed monthly. The current agreement is valid through August 31, 2026." This is a dated privacy fact: the portable design must re-verify the ZDR status after 2026-08-31. [SOURCE: https://opencode.ai/docs/go/]

4. **Go endpoints are protocol-heterogeneous (confirmed)** — Most models use `/v1/chat/completions` with `@ai-sdk/openai-compatible`; GPT 5.6 Luna uses `/v1/responses` with `@ai-sdk/openai`; MiniMax/Qwen use `/v1/messages` with `@ai-sdk/anthropic`. This confirms the provider record MUST carry the protocol family per model, not assume one protocol. [SOURCE: https://opencode.ai/docs/go/]

5. **Go model list is discoverable (confirmed)** — `GET https://opencode.ai/zen/go/v1/models` returns the full list with metadata. Go "works like any other provider in OpenCode": subscribe, `/connect`, paste API key, `/models`. [SOURCE: https://opencode.ai/docs/go/]

6. **Ollama `/api/show` exposes discovery fields (confirmed)** — Returns `parameters`, `license`, `modified_at`, `details` (format, family, families, parameter_size, quantization_level), `capabilities` (e.g. `completion`, `vision`), `model_info`, and `template`. This supports capability-negotiated local routing without a probe. [SOURCE: https://docs.ollama.com/api-reference/show-model-details]

7. **Ollama-local routing is protocol-distinct from Go (confirmed)** — Ollama serves `/api/chat`, `/api/generate`, `/api/show`, `/api/tags`, `/api/ps` on `http://localhost:11434` (per the OpenAPI spec servers block). The reference plugin uses `/api/chat` with `stream:false`, `think:false`, `options.temperature` (`rewrite.sh:162-163`). A provider record must distinguish `ollama-native` from `ollama-cloud` and from OpenAI-compatible proxies. [SOURCE: https://docs.ollama.com/api-reference/show-model-details + file:../context/claudish-to-english-main/rewrite.sh:162]

8. **Pi's `pi.registerProvider()` shows the local provider-record shape (confirmed)** — An async extension can register `{baseUrl, apiKey, api: "openai-completions", models: [{id, name, reasoning, input, cost:{input,output,cacheRead,cacheWrite}, contextWindow, maxTokens}]}`. This is a concrete, live-confirmed example of a provider-neutral record. [SOURCE: https://pi.dev/docs/latest/extensions]

9. **llama.cpp server is OpenAI-compatible (confirmed at plan level; to be probed)** — The llama.cpp server README documents OpenAI-compatible `/v1/chat/completions`-style endpoints. The plan labels it "best-effort; probe streaming and structured-output behavior per build/model." This remains a probe-gated capability, not a primary-source-verified protocol guarantee in this lineage. [SOURCE: plan.md:285-287 + https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md]

10. **Privacy-aware routing rule (inferred, grounded)** — Local-only policy must be distinguishable from local-adjacent-but-hosted (Ollama Cloud) and hosted (OpenCode Go). Never auto-cascade local-classified content to hosted services; fallback requires explicit privacy-class-compatible consent (per spec REQ-005 / NFR-S03). Go privacy facts are dated per-model and must be re-probed (DeepSeek ZDR expires 2026-08-31). [SOURCE: spec.md:165, spec.md:188-193]

11. **Non-thinking request semantics (inferred)** — The reference sends `think:false` to Ollama (`rewrite.sh:163`). For hosted OpenAI-compatible models, the equivalent lever varies (some use `reasoning_effort: minimal`, some ignore unknown fields). The provider record needs a `capability.thinkingControl` enum (`native | openai-compatible | unsupported`) with a probe before assuming any hosted model honors a non-thinking request. [SOURCE: file:../context/claudish-to-english-main/rewrite.sh:163 + plan.md:283]

## Questions Answered

- Q6 (partial): Provider-neutral record shape confirmed — protocol family per model, base URL, auth, model, cost, privacy class (dated), capability flags (thinking control, streaming), discovery endpoint, and explicit fallback policy. OpenCode Go DeepSeek V4 Flash = OpenAI-compatible Chat Completions at the documented Go endpoint; Ollama = `ollama-native` with `/api/show` discovery; llama.cpp = probe-gated OpenAI-compatible.

## Questions Remaining

- Q6: Exact hosted-model non-thinking lever per provider (probe-gated); retry/timeout policy specifics (iteration 7).
- Q4, Q5, Q7, Q8: unchanged.

## Next Focus

Fidelity validation and protected spans: how to encode protected literals (code, paths, URLs, numbers, identifiers) before inference and objectively reject missing/duplicated/changed spans, plus the exact-original fallback contract.

## Assessment

- newInfoRatio: 0.58
- noveltyJustification: Provider facts grounded in primary sources — Go endpoint/protocol/pricing/privacy dated 2026-08-09, Ollama discovery fields, and Pi's concrete provider-record shape. The dated ZDR expiry is a new, load-bearing constraint.
- Confidence: High for Go/Ollama/Pi-record (primary sources). llama.cpp and hosted non-thinking levers remain probe-gated.

## Reflection

What worked: provider facts separated into confirmed (primary source) vs probe-gated (llama.cpp, hosted thinking levers).
What failed / ruled out:
- Assuming one provider protocol for all models: Go is protocol-heterogeneous (confirmed, ruled out).
- Trusting privacy facts without dates: DeepSeek ZDR expires 2026-08-31 (confirmed, must re-probe).
- Auto-cascading local→hosted: prohibited by spec privacy rule (confirmed, ruled out).
Ruled out: none additional.
