# Iteration 003 — Local-LLM Legacy Hunt

## Focus
This iteration focused on maintainability residue across fixture, template, asset, reference, install-guide, package metadata, and config-example surfaces. I used targeted `rg` passes for old local defaults (`nomic-ai/nomic-embed-text-v1.5`, MiniLM, 384-dimensional current-default claims), rejected ONNX backend references, hardcoded singleton/profile SQLite filenames, and stale Voyage marketing/default language, then manually checked the remaining hits against the user-provided intentional and historical exclusions.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 5037
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: saturation. Remaining hits were filtered as intentional or historical: vitest `context-index.sqlite` temp-file idioms, the already-known `memory-crud-extended.vitest.ts` 384-dim assertion from iteration 001, legacy model lookup registries, cross-encoder MiniLM reranker naming, CocoIndex `voyage-code-3` cloud-alternative docs, package-lock transitive `onnxruntime-*` entries from `@huggingface/transformers`, install-guide transitive ONNX notes, and historical/changelog/spec-metadata references to removed legacy databases.
