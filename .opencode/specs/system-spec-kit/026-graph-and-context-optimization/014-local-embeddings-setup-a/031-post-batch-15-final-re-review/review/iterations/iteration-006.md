# Iteration 006 — Local-LLM Legacy Hunt

## Focus
This iteration focused on maintainability residue after packet 022: active test fixtures, generated/manual playbook assets, config templates, references, and committed runtime configs that could keep MiniLM-era dimensions, legacy singleton DB filenames, obsolete ONNX-backend assumptions, or stale Voyage marketing language alive after the default-stack cleanup. I searched the scoped code, docs, fixtures, assets, references, and configs with `rg`, skipped frozen review/history/evidence paths, and treated the clarified Voyage -> OpenAI -> llama-cpp -> hf-local cascade as canonical rather than residue.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-006-001 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:159 | "embedding FLOAT[384]" | confirmed-residue | Update the orphaned-vector fixture schema to use a named 768-dimensional EmbeddingGemma test constant, or label 384 explicitly as a non-default synthetic vector size. |
| L-006-002 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:442 | "mockEmbedding = new Float32Array(384).fill(0.1);" | confirmed-residue | Replace the repeated 384-dimensional hybrid-search mock vectors with a shared current-default fixture dimension, preferably 768, to avoid preserving MiniLM-era assumptions across search tests. |
| L-006-003 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:795 | "new Float32Array(384).fill(0.1)," | confirmed-residue | Move the dedup test vectors to a named canonical fixture dimension, or document why the test intentionally uses a non-default synthetic dimension. |
| L-006-004 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/trace-propagation.vitest.ts:69 | "new Float32Array(384).fill(0.2)" | confirmed-residue | Use the same 768-dimensional fixture helper as the active search tests so trace propagation examples no longer carry the old local-model dimension. |
| L-006-005 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:371 | "embedding: new Float32Array(Array.from({ length: 384 }, () => Math.random()))" | confirmed-residue | Switch the MMR pipeline fixture to a named default-dimension helper so performance coverage does not imply 384 remains the active embedding shape. |
| L-006-006 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:266 | "const dims = 384;" | confirmed-residue | Replace the cache benchmark's 384 constant with either 768 or a deliberately named arbitrary-dimension constant to reduce fixture drift. |
| L-006-007 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:104 | "lookupEmbedding(db, 'deadbeef00000000', 'any-model', 384)" | confirmed-residue | Align the scoring-calibration cache-miss fixture with the current local default dimension, or make the arbitrary-dimension intent explicit. |

## Iteration summary
- Files scanned: 4367
- New findings: 7 (P0=0, P1=0, P2=7)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation on this maintainability pass: I did not find new active P0/P1 default-asserting docs/configs after applying the Q1/Q2 clarifications. I intentionally did not flag the canonical provider cascade, llama-cpp-as-default-local wording, legacy model registries in provider code, `test_backward_compat.py`, vitest temp-dir `context-index.sqlite` patterns, transitive `onnxruntime-*` references under dependency lock/node_modules context, historical 014/017 migration narrative, or the excluded 021/022/031 review packets.
