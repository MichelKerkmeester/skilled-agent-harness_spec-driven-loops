# Iteration 006 — Local-LLM Legacy Hunt

## Focus
This iteration focused on maintainability residue in generated catalogs, packaging metadata, regression tests, fixtures, and manual testing playbooks. I used `rg` across the scoped surfaces for stale embedding/default strings, then read candidate files to separate copied default assertions from allowed opt-in provider coverage and historical compatibility tests.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-006-001 | P1 | maintainability | .opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:51 | "Default install (`pip install -e .`) routes through LiteLLM (Voyage AI etc.) only." | confirmed-residue | Align package dependency guidance with the post-014 CocoIndex default: sentence-transformers plus `google/embeddinggemma-300m`, with LiteLLM/Voyage as explicit opt-in. |
| L-006-002 | P2 | maintainability | .opencode/skills/mcp-coco-index/feature_catalog/08--configuration/01-user-settings.md:23 | "The default user settings use the local sentence-transformers provider and `all-MiniLM-L6-v2`." | confirmed-residue | Regenerate the feature catalog entry so the default model is `google/embeddinggemma-300m` with 768-dimensional expectations. |
| L-006-003 | P2 | maintainability | .opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md:681 | "The default user settings use the local sentence-transformers provider and `all-MiniLM-L6-v2`." | confirmed-residue | Regenerate the aggregate feature catalog after updating the canonical per-feature entry. |
| L-006-004 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:111 | "expect(embeddings.MODEL_NAME).toBe('nomic-ai/nomic-embed-text-v1.5');" | confirmed-residue | Update the regression expectation to the canonical hf-local ONNX EmbeddingGemma model, or make the assertion profile-driven. |
| L-006-005 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:257 | "expect(profile.model).toBe('nomic-ai/nomic-embed-text-v1.5');" | confirmed-residue | Update the no-key startup-profile test to assert `onnx-community/embeddinggemma-300m-ONNX`, q8, 768 dims. |
| L-006-006 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:242 | "assertEqual(emb.MODEL_NAME, 'nomic-ai/nomic-embed-text-v1.5', 'EB-003: MODEL_NAME is nomic default');" | confirmed-residue | Refresh the behavioral test constants and labels so they lock the post-014 hf-local default instead of the old Nomic default. |
| L-006-007 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-embeddings-factory.js:46 | "model: 'nomic-ai/nomic-embed-text-v1.5'," | confirmed-residue | Replace the fixture profile model with the canonical hf-local ONNX EmbeddingGemma identifier. |
| L-006-008 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:324 | "const dbPath = path.join(dbDir, 'context-index.sqlite');" | confirmed-residue | Derive the fixture database filename from the active embedding profile instead of preserving the deleted generic sqlite filename. |
| L-006-009 | P2 | maintainability | .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/323-doctor-memory-fresh-install.md:22 | "Exact command sequence: create disposable workspace -> confirm `mcp_server/database/context-index.sqlite` is absent -> run `/doctor memory --incremental=true` -> verify DB file and gold-battery output." | confirmed-residue | Regenerate the doctor-memory fresh-install playbook to validate profile-derived sqlite filenames, not the legacy generic path. |
| L-006-010 | P2 | maintainability | .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/327-doctor-memory-disk-pressure.md:43 | "free space is less than `2 * (context-index.sqlite bytes + context-index__voyage__voyage-4__1024.sqlite bytes)`." | confirmed-residue | Update disk-pressure fixtures to calculate space against the active hf-local profile DB and optional explicit-provider DBs, not the old Voyage 1024 store. |

## Iteration summary
- Files scanned: 4367
- New findings: 10 (P0=0, P1=1, P2=9)
- Out-of-scope/historical noted but NOT flagged: 7
- Notes: The hunt is nearing saturation for maintainability residue. Remaining noisy hits were mostly explicit cloud-provider tests, backward-compat conversion tests, generated changelog history, or disposable temp DB fixtures where the legacy string is not presented as an active default.
