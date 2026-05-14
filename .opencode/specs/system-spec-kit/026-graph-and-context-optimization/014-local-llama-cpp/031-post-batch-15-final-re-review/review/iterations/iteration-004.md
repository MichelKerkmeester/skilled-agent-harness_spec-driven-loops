# Iteration 004 — Local-LLM Legacy Hunt

## Focus
This correctness pass re-scanned the live embedding/runtime surfaces after packet 022: TypeScript/JavaScript/Python provider and profile code, MCP/CocoIndex tests that can assert dimensions or database paths, runtime config mirrors, and current setup/install docs where wording could imply the wrong default. I focused on production-code hardcodes, stale default assertions, rejected ONNX runtime references, and config drift against the canonical auto cascade: Voyage -> OpenAI -> llama-cpp when installed -> hf-local.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 4282
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 9
- Notes: saturation. I did not find new correctness residue beyond iteration 001's already-covered `memory-crud-extended.vitest.ts` 384-dimension health fixture. Candidate hits were filtered as intentional or non-default-bearing: temp-dir `context-index.sqlite` test idioms, profile-filename tests asserting the Voyage keyed DB shape, mock-provider lifecycle tests using 384 as arbitrary injected metadata, synthetic sqlite-vec fixtures using `FLOAT[384]`, legacy Nomic prefix/dimension registry support, `test_backward_compat.py` MiniLM compatibility assertions, CocoIndex `voyage-code-3` cloud-alternative docs, transitive `onnxruntime-*` package-lock entries from Transformers.js, and config/doc wording that correctly describes cloud keys as an opt-in way to enter the canonical auto cascade.
