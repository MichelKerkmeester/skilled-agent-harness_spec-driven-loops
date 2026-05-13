# Iteration 010 — Local-LLM Legacy Hunt

## Focus
Scanned correctness-oriented residue signatures across active code, package/config surfaces, and embedding-provider implementation paths: hardcoded legacy sqlite filenames, rejected ONNX runtime package references, stale 384-dimensional embedding assumptions, old Nomic/MiniLM defaults, and resolver/profile drift. I treated the canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade as intentional and checked ambiguous hits against the post-014/post-022 ground truth rather than flagging the cascade itself.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 4875
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation for correctness. Active resolver/profile code matched the canonical defaults (`voyage-4`, `text-embedding-3-small`, llama-cpp GGUF 768 q8, hf-local EmbeddingGemma ONNX 768 q8), package.json manifests did not list rejected `onnxruntime-node` or `onnxruntime-common`, and hardcoded `context-index.sqlite` hits were limited to vitest/temp-dir idioms or historical changelog/spec material. Remaining 384/Nomic/MiniLM hits were prior-iteration findings, legacy lookup registries explicitly allowed by the prompt, or `test_backward_compat.py` regression coverage.
