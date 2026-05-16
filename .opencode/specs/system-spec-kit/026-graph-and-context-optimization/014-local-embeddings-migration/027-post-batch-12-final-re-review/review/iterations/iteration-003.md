# Iteration 003 — Local-LLM Legacy Hunt

## Focus
This iteration scanned maintainability-heavy live surfaces: committed fixtures, manual playbook assets, eval helpers, install guides, profile path tests, and comments around embedding/database defaults. The scan intentionally treated Voyage -> OpenAI -> llama-cpp -> hf-local as canonical and filtered out historical packets, frozen review artifacts, evidence transcripts, package-lock transitive dependency noise, and vitest temp-directory `context-index.sqlite` idioms unless the occurrence asserted a live profile contract.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-003-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/profile.ts:211 | "return null;" | confirmed-residue | `resolveActiveProfileDtype()` returns no dtype for Voyage/OpenAI, so cloud profile DB filenames omit the dtype segment. Define a canonical cloud dtype/precision slug or otherwise make cloud profiles satisfy the provider/model/dim/dtype filename contract. |
| L-003-002 | P1 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:250 | "expect(profile.getDatabasePath('/tmp/spec-kit-db')).toBe('/tmp/spec-kit-db/context-index__voyage__voyage-4__1024.sqlite');" | confirmed-residue | Update this profile-path assertion to the canonical dtype-inclusive cloud filename shape after fixing `resolveActiveProfileDtype()`. |
| L-003-003 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:116 | "cloud profiles use `context-index__voyage__voyage-4__1024.sqlite` and `context-index__openai__text-embedding-3-small__1536.sqlite`." | confirmed-residue | Replace the cloud filename examples with dtype-inclusive profile-keyed examples, or use the generic `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` placeholder. |
| L-003-004 | P2 | maintainability | .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/326-doctor-memory-sigint-cancellation.md:46 | "context-index__voyage__voyage-4__1024.sqlite" | confirmed-residue | Refresh the manual playbook's Voyage checksum example to the canonical profile-keyed filename pattern so operators do not copy the stale no-dtype shape. |
| L-003-005 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:10 | "// Live production context-index.sqlite and record results in the" | confirmed-residue | Update the comment to say the script uses `resolveActiveProfileDbPath()` and the active profile-keyed sqlite file, not the old singleton database. |
| L-003-006 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100 | "* IDs were mapped from the production context-index.sqlite DB via" | confirmed-residue | Reword the provenance comment to reference the active profile DB or the historical source DB explicitly, avoiding a current singleton-path implication. |
| L-003-007 | P2 | maintainability | .opencode/skills/system-spec-kit/shared/chunking.ts:18 | "* Based on nomic-embed-text-v1.5 context window (~8192 tokens)." | confirmed-residue | Replace the Nomic-era rationale with provider-neutral wording, or tie the limit to the current shared chunking contract rather than an obsolete default model. |
| L-003-008 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:22 | "const REAL_DB_PATH = path.join(SKILL_ROOT, 'mcp_server/database/context-index.sqlite');" | confirmed-residue | Update this non-temp functional test to resolve the active profile DB path instead of asserting the old singleton runtime database location. |
| L-003-009 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:380 | "'MEMORY_DB_PATH points directly to context-index.sqlite for disposable fixtures.'," | confirmed-residue | Regenerate or patch the committed JS fixture to match the TypeScript source's provider-keyed fixture wording. |

## Iteration summary
- Files scanned: 790
- New findings: 9 (P0=0, P1=3, P2=6)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Skipped the intended auto cascade, provider registries, `test_backward_compat.py`, package-lock/node_modules ONNX transitive references, changelog history, vitest temp-dir singleton filenames, 384-dimensional generic mock vectors, and prior iteration findings already covered by iterations 001-002.
