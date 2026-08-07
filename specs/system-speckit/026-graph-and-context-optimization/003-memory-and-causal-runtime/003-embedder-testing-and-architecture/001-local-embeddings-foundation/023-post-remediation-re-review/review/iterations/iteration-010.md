# Iteration 010 — Local-LLM Legacy Hunt

## Focus
This iteration focused on correctness residue in live embedding resolver code, startup model reporting, active runtime messages, committed configs, and stale assertions in executable tests. The scan intentionally treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade as canonical, ignored historical review packets and evidence transcripts, and deduped hits already reported by iterations 001-009.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-010-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings.ts:771 | "return providerInfo.config.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL_NAME;" | confirmed-residue | Add a `llama-cpp` branch in `detectConfiguredModelName()` so uninitialized model reporting returns `LLAMA_CPP_EMBEDDINGS_MODEL`/`unsloth/embeddinggemma-300m-GGUF` instead of falling through to the hf-local ONNX default. |
| L-010-002 | P1 | correctness | .opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:361 | "// Both keys → defaults to 768 (ambiguous)" | confirmed-residue | Update the assertion to the canonical cascade: when both usable keys are present, Voyage wins and startup dimension should be 1024, not ambiguous 768. |
| L-010-003 | P2 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:188 | "Set EMBEDDINGS_PROVIDER=hf-local explicitly to force local, or unset VOYAGE_API_KEY." | confirmed-residue | Reword the runtime warning to point local-only users at `EMBEDDINGS_PROVIDER=llama-cpp` or the full local fallback chain, with hf-local described only as the final fallback/explicit override. |
| L-010-004 | P2 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:843 | "Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local." | confirmed-residue | Update the Voyage missing-key error action so it does not teach hf-local as the local path; prefer `EMBEDDINGS_PROVIDER=llama-cpp` when available, or neutral local-provider wording. |
| L-010-005 | P2 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1120 | "Or use EMBEDDINGS_PROVIDER=hf-local to use local model" | confirmed-residue | Refresh the API-key validation remediation action to name the canonical local default path (`llama-cpp` when installed, hf-local fallback) instead of forcing the fallback provider. |

## Iteration summary
- Files scanned: 4437
- New findings: 5 (P0=0, P1=2, P2=3)
- Out-of-scope/historical noted but NOT flagged: 28
- Notes: Saturation is high for correctness. Most remaining high-signal hits were prior findings, intentional legacy lookup tables, vitest temp DB idioms, or explicitly excluded historical/evidence paths.
