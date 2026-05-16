# Iteration 004 — Local-LLM Legacy Hunt

## Focus
I scanned correctness-sensitive embedding resolver, provider-profile, database-filename, runtime config, and local test-contract surfaces for residue after packet 022. The pass specifically avoided flagging the intentional Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp auto-selection, legacy model registries, vitest temp sqlite filenames, archived packets, and forensic review/evidence outputs.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-004-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts:338 | "provider: 'voyage'," | confirmed-residue | Add `dtype: 'cloud'` to `VoyageProvider.getProfile()` so initialized Voyage profiles keep the canonical provider/model/dim/dtype shape and cannot derive dtype-less cloud slugs. |
| L-004-002 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts:308 | "provider: 'openai'," | confirmed-residue | Add `dtype: 'cloud'` to `OpenAIProvider.getProfile()` so initialized OpenAI profiles match the post-029 cloud filename contract. |
| L-004-003 | P1 | correctness | .opencode/skills/system-spec-kit/shared/types.ts:70 | "dtype?: HfLocalDtype \| null;" | confirmed-residue | Widen provider metadata dtype typing to include the synthetic cloud dtype, or introduce a shared `EmbeddingProfileDtype` union used by local and cloud providers. |
| L-004-004 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts:66 | "expect(path.basename(dbPath)).toBe('context-index__voyage__voyage-4__1024.sqlite');" | confirmed-residue | Update the Voyage profile filename assertion to `context-index__voyage__voyage-4__1024__cloud.sqlite` and construct the test profile with `dtype: 'cloud'`. |
| L-004-005 | P1 | correctness | .opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts:72 | "expect(path.basename(dbPath)).toBe('context-index__openai__text-embedding-3-small__1536.sqlite');" | confirmed-residue | Update the OpenAI profile filename assertion to `context-index__openai__text-embedding-3-small__1536__cloud.sqlite` and construct the test profile with `dtype: 'cloud'`. |

## Iteration summary
- Files scanned: 5042
- New findings: 5 (P0=0, P1=5, P2=0)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation is close for the correctness residue requested here. The only new residue I found is the cloud-dtype/profile-filename inconsistency; I did not flag package-lock transitive `onnxruntime-*`, `test_backward_compat.py`, legacy model registries, vitest temp `context-index.sqlite` patterns, or the canonical cascade wording.
