# Iteration 006 — Local-LLM Legacy Hunt

## Focus
This maintainability pass scanned authored setup assets, skill metadata, test fixtures, package/config manifests, root docs, and embedding-related tests for stale local-LLM residue that 022 missed or introduced. I prioritized rot-prone generated fixtures, templates, SKILL metadata, and repeated model-option tables, while excluding the current review packet, frozen review/log/evidence artifacts, intentional legacy model registries, and vitest temp-database idioms.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-006-001 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:194 | "const dbPath = path.join(dbDir, 'context-index.sqlite');" | confirmed-residue | Regenerate or patch the compiled fixture to match the TypeScript source's active hf-local profile DB filename. |
| L-006-002 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:380 | "'MEMORY_DB_PATH points directly to context-index.sqlite for disposable fixtures.'" | confirmed-residue | Refresh the seeded fixture text to name the active profile-keyed disposable DB instead of the singleton filename. |
| L-006-003 | P1 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:103 | "it('T513-01d: auto mode defaults to hf-local with no keys', () => {" | confirmed-residue | Rename/split the test so hf-local is expected only when llama-cpp is mocked unavailable, and add coverage for llama-cpp auto-selection when installed. |
| L-006-004 | P2 | maintainability | .opencode/skills/mcp-coco-index/assets/config_templates.md:180 | "model: voyage/voyage-code-3" | confirmed-residue | Update the optional cloud embedding template to `voyage/voyage-4`, or label `voyage-code-3` as a non-default legacy alternative. |
| L-006-005 | P2 | maintainability | .opencode/skills/mcp-coco-index/SKILL.md:8 | "<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, voyage-code-3, embeddinggemma-300m -->" | confirmed-residue | Remove the stale `voyage-code-3` routing keyword or replace it with `voyage-4` so skill discovery metadata matches current defaults. |
| L-006-006 | P1 | maintainability | .opencode/skills/mcp-coco-index/SKILL.md:272 | "| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` required | Cloud alternative requiring a rebuild |" | confirmed-residue | Align the skill's embedding model table with canonical `voyage/voyage-4`, keeping `voyage-code-3` only as clearly marked legacy/non-default support if needed. |
| L-006-007 | P1 | maintainability | .opencode/skills/mcp-coco-index/README.md:210 | "| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` | Higher dimensional cloud embeddings (requires API key) |" | confirmed-residue | Replace this repeated model-table entry with `voyage/voyage-4` or move `voyage-code-3` into explicitly legacy/alternate documentation. |
| L-006-008 | P2 | maintainability | .opencode/skills/mcp-coco-index/README.md:278 | "model: google/embeddinggemma-300m     # default 768d (also: voyage/voyage-code-3)" | confirmed-residue | Refresh the settings example comment to reference `voyage/voyage-4` as the current cloud alternative. |
| L-006-009 | P2 | maintainability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:844 | "- **Cloud Embedding Option**: [Voyage Code 3](https://docs.voyageai.com/docs/embeddings)" | confirmed-residue | Update the external-resource pointer to Voyage 4/current Voyage embeddings docs, or mark the Code 3 pointer as legacy. |

## Iteration summary
- Files scanned: 4348
- New findings: 9 (P0=0, P1=4, P2=5)
- Out-of-scope/historical noted but NOT flagged: 31
- Notes: No new ONNX runtime package manifest residue was found in package.json/pyproject surfaces. I treated the resolver cascade, llama-cpp auto-selection, Voyage auto-pick, provider model-dimension registries, `test_backward_compat.py`, package-lock transitive ONNX strings, vitest temp `context-index.sqlite` filenames, and prior-iteration duplicate lines as non-findings. Saturation is starting to show: the remaining fresh residue is mostly duplicated CocoIndex auxiliary text plus one stale generated fixture/test pair.
