# Deep Review Report: Post-Batch-15 Final Re-Review

## 1. Stop Reason

max_iterations_reached (20/20)

Source completeness note: the requested source directory contains `iteration-001.md` through `iteration-010.md`; `deep-review-config.json` and `deep-review-state.jsonl` record `maxIterations: 10`. Findings below are synthesized only from the available iteration files.

## 2. Iteration Count

20

## 3. Dimension Coverage

| Dimension | Finding Count |
|-----------|---------------|
| correctness | 1 |
| traceability | 0 |
| maintainability | 9 |

## 4. Severity Counts

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 |
| P2 | 9 |

## 5. Verdict

CONDITIONAL. No P0 findings were reported after deduplication, but one P1 correctness fixture still preserves a stale 384-dimensional local profile expectation. `hasAdvisories=true` because P2 maintainability residue remains in active test fixtures and behavioral test helpers.

## 6. Release-Readiness

Canonical post-014 default state is consistent across the repo's live provider/runtime code, setup/config surfaces, current-facing docs, and resolver/profile behavior according to the iteration notes. The remaining release risk is test-fixture residue: one correctness-sensitive health provider-info assertion still expects 384 dimensions, and nine advisory fixtures still carry old 384-dimensional or legacy model-name examples. No iteration reported active production-code, setup-script, or user-facing documentation drift from the Voyage -> OpenAI -> llama-cpp -> hf-local auto cascade.

## 7. Top P0 Findings

No P0 findings after deduplication.

## 8. Top P1 Findings

| ID | Severity | Dimension | File:Line | Evidence | Disposition | Recommendation |
|----|----------|-----------|-----------|----------|-------------|----------------|
| L-001-001 | P1 | correctness | `.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1169` | `expect(parsed?.data?.embeddingProvider?.dimension).toBe(384);` | confirmed-residue | Update this health provider-info fixture to a canonical 768-dimensional local profile, preferably EmbeddingGemma, so the test no longer preserves MiniLM-era dimensional expectations. |

## 9. Top P2 Findings (advisories)

| ID | Dimension | File:Line | Evidence | Recommendation |
|----|-----------|-----------|----------|----------------|
| L-006-001 | maintainability | `.opencode/skills/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:159` | `embedding FLOAT[384]` | Use a named 768-dimensional EmbeddingGemma test constant, or label 384 as a non-default synthetic vector size. |
| L-006-002 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:442` | `mockEmbedding = new Float32Array(384).fill(0.1);` | Replace repeated 384-dimensional hybrid-search mocks with a shared current-default fixture dimension. |
| L-006-003 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:795` | `new Float32Array(384).fill(0.1),` | Move dedup vectors to a named canonical fixture dimension, or document the non-default synthetic intent. |
| L-006-004 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/trace-propagation.vitest.ts:69` | `new Float32Array(384).fill(0.2)` | Use the same 768-dimensional fixture helper as active search tests. |
| L-006-005 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:371` | `embedding: new Float32Array(Array.from({ length: 384 }, () => Math.random()))` | Switch the MMR pipeline fixture to a named default-dimension helper. |
| L-006-006 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:266` | `const dims = 384;` | Replace with 768 or a deliberately named arbitrary-dimension constant. |
| L-006-007 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:104` | `lookupEmbedding(db, 'deadbeef00000000', 'any-model', 384)` | Align with the current local default dimension, or make arbitrary-dimension intent explicit. |
| L-009-001 | maintainability | `.opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:688` | `const mockProvider = createMockProvider({ dim: 384, provider: 'lifecycle-test', model: 'test-v2' });` | Use a named canonical local fixture dimension, preferably 768, or rename the constant to mark it synthetic. |
| L-009-002 | maintainability | `.opencode/skills/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:20` | `embedding_model: 'gte-small',` | Update to the canonical EmbeddingGemma model string, or use a neutral `test-embedding-model` value. |

## 10. Recommendation

Scaffold 022-local-llm-legacy-remediation packet.

Top batch-able remediation groups:

| Group | Findings | Files |
|-------|----------|-------|
| Health provider-info fixture dimension | L-001-001 | `memory-crud-extended.vitest.ts` |
| 384-dimensional active test fixture cleanup | L-006-001, L-006-002, L-006-003, L-006-004, L-006-005, L-006-006, L-006-007, L-009-001 | `scripts/tests/test-cleanup-orphaned-vectors.js`, `scripts/tests/test-embeddings-behavioral.js`, and MCP server vitest fixtures |
| Legacy model-name fixture cleanup | L-009-002 | `unit-normalization.vitest.ts` |

## Appendix: Excluded as historical context

These categories were repeatedly excluded by the iteration notes and are not counted in the main tables:

| Category | Rationale |
|----------|-----------|
| Historical changelog/spec/forensic packet material | Recorded prior migration history rather than live default state. |
| `z_archive`, evidence logs, and excluded review/remediation packet artifacts | Frozen or out-of-scope review history. |
| `test_backward_compat.py` MiniLM compatibility assertions | Intentional backward-compatibility regression coverage. |
| Legacy Nomic/MiniLM model lookup registries and prefix coverage | Explicitly allowed opt-in compatibility support, not default behavior. |
| Vitest temp `context-index.sqlite` idioms | Temporary test database filenames, not canonical runtime profile-keyed DB claims. |
| Transitive `onnxruntime-*` lockfile/package references through Transformers.js | Dependency noise, not a standalone ONNX backend dependency. |
| CocoIndex `voyage-code-3` alternatives and optional Voyage cloud examples | Non-default or cloud-alternative documentation, not drift from canonical local fallback behavior. |
