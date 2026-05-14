# Iteration 007 — Local-LLM Legacy Hunt

## Focus
I scanned the correctness surface for post-022 regressions that would break canonical provider resolution, profile-keyed database filenames, cloud/local model dimensions, or rejected ONNX runtime cleanup. The sweep targeted production TypeScript/Python/CJS, committed runtime configs, package manifests, and correctness-bearing tests; I treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp auto-selection, Voyage auto-pick with `VOYAGE_API_KEY`, legacy model-dimension registries, and fixed test temp DB filenames as intentional per the user clarifications.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 2325
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 9
- Notes: Saturation. No new correctness residue beyond prior-iteration duplicates. Confirmed no non-test production hardcode of `context-index.sqlite`, `context-index__voyage__voyage-4__1024.sqlite`, or `context-index__openai__text-embedding-3-small__1536.sqlite`; no standalone `onnxruntime-node` / `onnxruntime-common` production import or package manifest dependency; package-lock/INSTALL_GUIDE mentions are transitive `@huggingface/transformers` context, not the rejected standalone ONNX backend. Skipped/discounted prior L-004 profile filename assertions, intentional legacy `nomic-ai/nomic-embed-text-v1.5` registries, `test_backward_compat.py` MiniLM assertions, and vitest temp-dir `context-index.sqlite` idioms.
