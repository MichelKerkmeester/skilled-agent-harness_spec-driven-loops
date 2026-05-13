# Iteration 001 — Local-LLM Legacy Hunt

## Focus
I scanned correctness-sensitive embedding surfaces after packet 022: provider/profile resolution code, package/config dependency boundaries, MCP and CocoIndex defaults, setup scripts, and test assertions that could still encode pre-014 dimensions or singleton database assumptions. The pass prioritized code/config residue that could break or mask the canonical `auto` cascade: Voyage -> OpenAI -> llama-cpp when GGUF is installed -> hf-local.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-001-001 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1169 | "expect(parsed?.data?.embeddingProvider?.dimension).toBe(384);" | confirmed-residue | Update this health provider-info fixture to a canonical 768-dimensional local profile, preferably EmbeddingGemma, so the test no longer preserves MiniLM-era dimensional expectations. |

## Iteration summary
- Files scanned: 4370
- New findings: 1 (P0=0, P1=1, P2=0)
- Out-of-scope/historical noted but NOT flagged: 6
- Notes: saturation. Resolver/profile code matched the canonical cascade and profile-keyed sqlite naming. I intentionally did not flag `context-index.sqlite` vitest temp patterns, legacy Nomic registry/prefix coverage, `test_backward_compat.py`, CocoIndex `voyage-code-3` alternatives without primary/default claims, transitive `onnxruntime-*` lockfile entries from `@huggingface/transformers`, or canonical llama-cpp default DB notes in committed runtime configs.
