# Iteration 009 — Local-LLM Legacy Hunt

## Focus
I scanned maintainability-heavy residue surfaces after packet 022: generated workflow assets, command/config mirrors, fixtures, tests, setup scripts, provider comments, and shared utility comments across the allowed source roots. The pass focused on stale legacy names that survive as templates, comments, backup labels, or test-maintenance anchors rather than reflagging already-covered runtime resolver behavior, doctor route drift, install-guide drift, or intentional backward-compatibility registries.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-009-001 | P1 | maintainability | .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:169 | "`${toTimestampId(now)}__pre-restore-context-index.sqlite`," | confirmed-residue | Include the active profile key in pre-restore backup filenames, or use a neutral `pre-restore-memory-db.sqlite` suffix so checkpoint artifacts do not preserve the legacy singleton DB name. |
| L-009-002 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:10 | "// Live production context-index.sqlite and record results in the" | confirmed-residue | Refresh the eval script header to describe the active provider-keyed production DB path resolved by `resolveActiveProfileDbPath()`. |
| L-009-003 | P2 | maintainability | .opencode/skills/system-spec-kit/shared/chunking.ts:18 | "* Based on nomic-embed-text-v1.5 context window (~8192 tokens)." | confirmed-residue | Re-anchor the shared chunking constant comment to provider-agnostic limits or the current EmbeddingGemma/Voyage/OpenAI envelope instead of a nomic-era model. |
| L-009-004 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:210 | "* embedding models (nomic-embed-text-v1.5 and compatible providers)." | confirmed-residue | Replace the nomic-specific prose with provider-neutral wording, or name the current supported provider family without implying nomic is the semantic normalization baseline. |
| L-009-005 | P2 | maintainability | .opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts:248 | "// OpenAI does not use task prefixes like nomic - same method for documents and queries" | confirmed-residue | Reword the comment to say OpenAI uses the same method for documents and queries, without preserving nomic as the comparison anchor. |

## Iteration summary
- Files scanned: 4284
- New findings: 5 (P0=0, P1=1, P2=4)
- Out-of-scope/historical noted but NOT flagged: 43
- Notes: Saturation is likely. Most remaining hits were prior-iteration duplicates, vitest temp-dir `context-index.sqlite` idioms, protected legacy model registries/backward-compat tests, historical changelog/migration text, or correct CocoIndex EmbeddingGemma defaults.
