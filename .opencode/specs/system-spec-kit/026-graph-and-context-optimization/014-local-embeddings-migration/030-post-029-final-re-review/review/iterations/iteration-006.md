# Iteration 006 — Local-LLM Legacy Hunt

## Focus
This maintainability pass scanned template, fixture, asset, reference, install-guide, root README/config, and scoped code surfaces for residue likely to rot future setup paths: stale hf-local defaults, MiniLM/Nomic-as-current assertions, singleton SQLite filename literals, ONNX runtime backend references, and voyage-code-3 marketing/default-context claims. The sweep treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade and llama-cpp auto-selection as canonical, and excluded the review packet itself, archived/history paths, forensic evidence, and test-only temp database idioms per the iteration brief.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 5000
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 6
- Notes: Saturation for the maintainability dimension. Remaining hits were already covered by prior iterations, intentional legacy-model lookup support, CocoIndex optional alternative-model docs, test-only `context-index.sqlite` or 384-dim fixtures, transitive `onnxruntime-*` dependency notes for Transformers.js rather than the rejected ONNX backend, or historical changelog/manual-testing records.
