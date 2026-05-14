# Iteration 003 — Local-LLM Legacy Hunt

## Focus
This iteration focused on maintainability residue in generated examples, config templates, manual testing playbooks, feature catalogs, and fixtures under the declared source surfaces. I prioritized stale artifacts that can quietly reintroduce the pre-014 CocoIndex defaults (`all-MiniLM-L6-v2`, 384 dimensions, Voyage Code 3 as the quality path) even where active code has moved to `sentence-transformers` with `google/embeddinggemma-300m`.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-003-001 | P1 | maintainability | .opencode/skills/mcp-coco-index/assets/config_templates.md:140 | `"_NOTE_2": "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)",` | confirmed-residue | Update the Claude MCP config template to advertise `google/embeddinggemma-300m`, bf16, 768 dims as the CocoIndex default. |
| L-003-002 | P1 | maintainability | .opencode/skills/mcp-coco-index/assets/config_templates.md:160 | `_NOTE_2 = "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"` | confirmed-residue | Update the Codex config template note to the post-014 EmbeddingGemma default. |
| L-003-003 | P1 | maintainability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:354 | `"_NOTE_2_EMBEDDING": "Default: all-MiniLM-L6-v2 (local, no API key needed)",` | confirmed-residue | Refresh the OpenCode install-guide config sample so copied configs do not reintroduce MiniLM. |
| L-003-004 | P1 | maintainability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:409 | `"_NOTE_2_EMBEDDING": "Default: all-MiniLM-L6-v2 (local, no API key needed)",` | confirmed-residue | Refresh the Claude install-guide config sample to the canonical CocoIndex EmbeddingGemma default. |
| L-003-005 | P1 | maintainability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:429 | `_NOTE_2 = "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"` | confirmed-residue | Refresh the Codex install-guide config sample to the canonical CocoIndex EmbeddingGemma default. |
| L-003-006 | P2 | maintainability | .opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:301 | `embedding.model matches a documented model such as the default local sentence-transformers/all-MiniLM-L6-v2 or a LiteLLM model like voyage/voyage-code-3` | confirmed-residue | Regenerate CFG-001 playbook text so manual verification checks for `google/embeddinggemma-300m` instead of accepting stale defaults. |
| L-003-007 | P2 | maintainability | .opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/001-default-model-verification.md:42 | `embedding.model matches a documented model such as sentence-transformers/all-MiniLM-L6-v2 or voyage/voyage-code-3` | confirmed-residue | Regenerate the per-scenario CFG-001 file with the post-014 default model and dimensions. |
| L-003-008 | P2 | maintainability | .opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md:23 | `Default user settings choose sentence-transformers/all-MiniLM-L6-v2.` | confirmed-residue | Regenerate the feature-catalog current-reality section to name `sentence-transformers` + `google/embeddinggemma-300m`. |
| L-003-009 | P2 | maintainability | .opencode/skills/mcp-coco-index/tests/test_settings.py:50 | `assert "all-MiniLM-L6-v2" in s.embedding.model` | confirmed-residue | Update the default settings test to assert `google/embeddinggemma-300m`. |
| L-003-010 | P2 | maintainability | .opencode/skills/mcp-coco-index/tests/test_config.py:49 | `assert "all-MiniLM-L6-v2" in config.embedding_model` | confirmed-residue | Update the env-derived config test to assert the canonical EmbeddingGemma model. |
| L-003-011 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json:77 | `"content": "Vector embeddings use 384 dimensions for semantic search",` | confirmed-residue | Update fixture content to 768 dimensions or make it model-neutral so tests do not preserve MiniLM assumptions. |
| L-003-012 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json:139 | `"embeddingModel": "all-MiniLM-L6-v2",` | confirmed-residue | Update similarity fixture metadata to EmbeddingGemma and 768 dimensions, or remove model-specific metadata if not required. |

## Iteration summary
- Files scanned: 4255
- New findings: 12 (P0=0, P1=5, P2=7)
- Out-of-scope/historical noted but NOT flagged: 6
- Notes: Prior iteration findings in root README, System Spec Kit README/shared README, ENV_REFERENCE, settings_reference, SKILL.md, and the known 014 migration narrative were skipped. Active fallback/provider-registry code, explicit Voyage/OpenAI fallback tests, doctor provider-detection references, and the current review packet were treated as intentional or out of scope.
