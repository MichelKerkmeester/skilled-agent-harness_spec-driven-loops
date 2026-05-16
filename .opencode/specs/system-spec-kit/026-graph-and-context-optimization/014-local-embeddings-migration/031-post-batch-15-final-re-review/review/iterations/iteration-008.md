# Iteration 008 — Local-LLM Legacy Hunt

## Focus
This iteration scanned traceability surfaces for post-022 residue: live READMEs, SKILL.md files, install guides, references, prompt/config assets, JSON/YAML/TOML configs, and nearby source/test text that can leak default-claim wording. The search targeted stale local-embedding defaults, obsolete MiniLM/Nomic/384-dimensional claims, llama-cpp opt-in wording, Voyage marketing language, legacy sqlite filename claims, and ONNX-runtime wording, while excluding the current review packet, frozen review artifacts, z_archive, evidence logs, generated/build/vendor paths, and user-declared intentional legacy lookup/test patterns.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 4167
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 112
- Notes: Saturation reached for the traceability pass. Remaining candidate hits were historical changelog/spec records, vitest temp DB filename idioms, transitive `@huggingface/transformers` dependency notes, explicit legacy-model lookup support, or already-correct canonical docs naming `google/embeddinggemma-300m`, `onnx-community/embeddinggemma-300m-ONNX`, llama-cpp default local behavior, and the Voyage -> OpenAI -> llama-cpp -> hf-local auto cascade.
