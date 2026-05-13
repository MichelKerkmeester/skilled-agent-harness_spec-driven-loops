# Iteration 003 — Local-LLM Legacy Hunt

## Focus
This maintainability pass scanned shared embedding helpers, parser comments, non-vitest fixtures, config templates, and CocoIndex reference/docs surfaces for residue that 022 may have missed after the canonical post-014 defaults were clarified. I filtered out the intentional Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp-as-default-local wording, legacy model registries, vitest temp DB filenames, frozen review/evidence artifacts, and the prior iteration findings already covering singleton DB docs and ONNX dependency docs.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-003-001 | P2 | maintainability | .opencode/skills/system-spec-kit/shared/chunking.ts:18 | "Based on nomic-embed-text-v1.5 context window (~8192 tokens)." | confirmed-residue | Reword the shared chunking comment around the current provider-neutral limit, or cite current EmbeddingGemma/local profile constraints instead of Nomic. |
| L-003-002 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:210 | "embedding models (nomic-embed-text-v1.5 and compatible providers)." | confirmed-residue | Replace the provider-specific Nomic wording with provider-neutral embedding text, or name current EmbeddingGemma profiles plus legacy compatibility separately. |
| L-003-003 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:22 | "const REAL_DB_PATH = path.join(SKILL_ROOT, 'mcp_server/database/context-index.sqlite');" | confirmed-residue | Update this non-vitest functional fixture to resolve the active profile-keyed DB path or label the singleton path as a legacy compatibility fixture. |
| L-003-004 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:942 | "'skill/system-spec-kit/mcp_server/database/context-index.sqlite'" | confirmed-residue | Refresh the path-alignment assertion so it no longer encodes the old singleton DB as the expected runtime location. |
| L-003-005 | P2 | maintainability | .opencode/skills/mcp-coco-index/assets/config_templates.md:161 | "_NOTE_3 = \"If you switch to LiteLLM with VOYAGE_API_KEY, use voyage/voyage-code-3 and rebuild the index\"" | confirmed-residue | Align the optional Voyage template with the canonical `voyage-4` default, or explicitly mark `voyage-code-3` as a non-default legacy/code-search alternative. |

## Iteration summary
- Files scanned: 51
- New findings: 5 (P0=0, P1=0, P2=5)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation is starting on maintainability residue. Most remaining hits are prior iteration duplicates, intentional legacy registries, vitest temp-dir DB patterns, current llama-cpp default-local wording, historical changelogs/research, or CocoIndex references that correctly name EmbeddingGemma as the default while listing optional alternatives.
