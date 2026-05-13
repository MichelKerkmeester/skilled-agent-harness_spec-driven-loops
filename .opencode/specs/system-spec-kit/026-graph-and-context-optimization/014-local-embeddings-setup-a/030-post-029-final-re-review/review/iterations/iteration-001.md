# Iteration 001 — Local-LLM Legacy Hunt

## Focus
Scanned the correctness surface for active code and committed config drift around post-014 embedding defaults: provider auto-cascade, hf-local and CocoIndex EmbeddingGemma defaults, profile-keyed SQLite filenames, removed ONNX runtime dependencies, and stale 384-dimension assumptions. The pass prioritized executable `.ts`/`.py`/`.cjs` surfaces, package/config files, and runtime notes that could steer production behavior; docs-only hits were checked only when they looked like they might assert a current default.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 4366
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation for correctness in this iteration. Confirmed package.json files do not directly reference `onnxruntime-node` or `onnxruntime-common`; package-lock transitive ONNX references were not flagged because the scoped config surface names package.json and the active dependency remains `@huggingface/transformers`. Confirmed active profile code resolves Voyage -> OpenAI -> llama-cpp -> hf-local and profile-keyed SQLite paths. Ignored intentional legacy-model registries for `nomic-ai/nomic-embed-text-v1.5`, `test_backward_compat.py` MiniLM coverage, vitest temp `context-index.sqlite` idioms, 384-dimensional mock vectors in tests, committed llama-cpp default DB notes, CocoIndex `voyage/voyage-code-3` cloud-alternative docs, and current configs describing the canonical cascade.
