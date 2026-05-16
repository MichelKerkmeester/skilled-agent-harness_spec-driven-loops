# Iteration 005 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability residue in user-facing markdown, skill READMEs, install guides, reference docs, config metadata, templates, and packet `description.json`/`graph-metadata.json` surfaces. I searched for stale default claims around Nomic/MiniLM/384-dim embeddings, reversed llama-cpp opt-in wording, hf-local-as-current-default wording, Voyage recommendation/primary language, singleton sqlite filenames, and ONNX runtime residue, then separated live operator-facing docs from accepted alternatives, test idioms, and historical/forensic packet material.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 3425
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation reached for the traceability pass. Canonical skill docs and install guides now describe `EMBEDDINGS_PROVIDER=auto` as Voyage -> OpenAI -> llama-cpp -> hf-local, CocoIndex defaults as `google/embeddinggemma-300m` 768d, and Memory hf-local fallback as EmbeddingGemma ONNX q8. Remaining hits were prior-iteration duplicates, intentional legacy model registries, backward-compat tests, vitest temp sqlite filenames, optional `voyage-code-3` cloud alternative docs, transitive Transformers.js `onnxruntime-common` notes explicitly labeled as not a standalone ONNX backend, historical phase metadata, or already-remediated review artifacts.
