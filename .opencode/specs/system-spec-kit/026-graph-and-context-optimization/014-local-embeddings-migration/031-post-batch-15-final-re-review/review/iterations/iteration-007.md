# Iteration 007 — Local-LLM Legacy Hunt

## Focus
I scanned the correctness surface for live default drift after packet 022: provider resolution code, active embedding profile construction, committed MCP/runtime configs, package manifests, env examples, and targeted tests that could still assert old defaults. The pass focused on residue that would change or misreport current behavior rather than historical specs, forensic artifacts, or intentional compatibility registries.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 4001
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 10
- Notes: Saturation for correctness in this pass. Confirmed live Memory MCP code resolves `VOYAGE_API_KEY -> OPENAI_API_KEY -> llama-cpp -> hf-local`, hf-local defaults to `onnx-community/embeddinggemma-300m-ONNX` q8/768, CocoIndex defaults to `google/embeddinggemma-300m`, and committed runtime configs use profile-keyed sqlite filenames. Not flagged: prior-covered 384-dim test fixtures, vitest temp `context-index.sqlite` filenames, `test_backward_compat.py` MiniLM assertions, legacy model-dimension registries for opt-in compatibility, CocoIndex `voyage/voyage-code-3` cloud-alternative docs, unrelated "explicit opt-in" feature-flag text, historical changelogs, package-lock transitive `onnxruntime-*` entries via `@huggingface/transformers`, install-guide text that explicitly labels `onnxruntime-common` as transitive rather than a standalone backend, and the review/remediation packets excluded by scope.
