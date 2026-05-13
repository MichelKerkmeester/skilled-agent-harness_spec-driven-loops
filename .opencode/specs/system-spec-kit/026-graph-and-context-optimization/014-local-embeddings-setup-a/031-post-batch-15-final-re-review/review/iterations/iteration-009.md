# Iteration 009 — Local-LLM Legacy Hunt

## Focus
This maintainability pass re-scanned active test fixtures, script-level behavioral checks, template/reference surfaces, install-guide snippets, and committed runtime examples for residue that packet 022 may have missed after the canonical default clarification. I targeted stale 384-dimensional fixture shapes, old local model names, singleton sqlite examples, rejected ONNX package references, and Voyage marketing/default wording, while filtering out the intended Voyage -> OpenAI -> llama-cpp -> hf-local cascade, profile-keyed DB examples, legacy lookup registries, frozen history, forensic logs, and prior-iteration findings.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-009-001 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:688 | "const mockProvider = createMockProvider({ dim: 384, provider: 'lifecycle-test', model: 'test-v2' });" | confirmed-residue | Replace the lifecycle mock with a named canonical local fixture dimension, preferably 768, or rename the constant to make the non-default synthetic dimension explicit. |
| L-009-002 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:20 | "embedding_model: 'gte-small'," | confirmed-residue | Update the normalization fixture to the canonical EmbeddingGemma model string, or use an intentionally neutral `test-embedding-model` value so old local-model examples do not linger in active fixtures. |

## Iteration summary
- Files scanned: 4428
- New findings: 2 (P0=0, P1=0, P2=2)
- Out-of-scope/historical noted but NOT flagged: 12
- Notes: saturation. I did not find new P0/P1 residue in active docs, configs, provider code, or setup scripts. Not flagged: the intentional auto cascade, llama-cpp default-local wording, profile-keyed sqlite paths, optional Voyage cloud-key examples, vitest temp `context-index.sqlite` idioms, legacy Nomic lookup tests/registries, cross-encoder MiniLM reranker references, transitive `onnxruntime-*` lockfile entries, package history/changelog text, prior L-001/L-006 findings, and excluded review/remediation packet artifacts.
