# Iteration 009 — Local-LLM Legacy Hunt

## Focus

This iteration focused on maintainability residue in generated catalogs, manual testing playbooks, fixtures, test helpers, and skill metadata. I used targeted `rg` scans for stale model names, dimensions, provider recommendations, generic sqlite filenames, and rejected backend references, then read the candidate files around each hit to avoid re-filing prior README/config findings or intentional historical/compatibility coverage.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-009-001 | P2 | maintainability | .opencode/skills/mcp-coco-index/SKILL.md:8 | "voyage-code-3, all-MiniLM-L6-v2" | confirmed-residue | Refresh the skill keyword metadata so routing/search hints name `google/embeddinggemma-300m` and do not keep MiniLM/Voyage as stale default-era anchors. |
| L-009-002 | P2 | maintainability | .opencode/skills/mcp-coco-index/references/tool_reference.md:400 | "`embedding.model` -- embedding model name (e.g., `all-MiniLM-L6-v2`, `gemini/text-embedding-004`)" | confirmed-residue | Update the tool-reference example to `google/embeddinggemma-300m` or make it provider-neutral so examples do not preserve the removed MiniLM model. |
| L-009-003 | P2 | maintainability | .opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md:293 | "Default user settings choose `sentence-transformers/all-MiniLM-L6-v2`." | confirmed-residue | Regenerate the aggregate CocoIndex feature catalog after updating the source entry so the generated asset reflects the EmbeddingGemma default. |
| L-009-004 | P2 | maintainability | .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/21-eval-runner-cli.md:28 | "The script targets the production memory database at `mcp_server/database/context-index.sqlite`." | confirmed-residue | Regenerate the eval-runner catalog entry to describe profile-derived Memory MCP sqlite paths rather than the deleted generic database filename. |
| L-009-005 | P2 | maintainability | .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md:25 | "`run-ablation.ts` is the controlled channel-ablation CLI. It requires `SPECKIT_ABLATION=true`, opens the production `context-index.sqlite`" | confirmed-residue | Refresh the benchmark/import-policy catalog so ablation guidance resolves the active hf-local EmbeddingGemma profile DB. |
| L-009-006 | P2 | maintainability | .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md:31 | "`map-ground-truth-ids.ts` is the read-only ground-truth provenance helper. It opens the production `context-index.sqlite` in read-only mode" | confirmed-residue | Update the generated provenance-helper description to use the profile-derived database path instead of the legacy generic sqlite file. |
| L-009-007 | P2 | maintainability | .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md:32 | "attempts to load `better-sqlite3` plus optional `onnxruntime-node` and `sharp` installs" | confirmed-residue | Regenerate the native-module health catalog entry so it no longer documents probing the rejected ONNX runtime backend. |
| L-009-008 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/test-utils.js:142 | "* @returns {Array} 384-dimensional embedding vector" | confirmed-residue | Update the shared test helper to generate/document 768-dimensional vectors, or make the dimension profile-driven to avoid locking in MiniLM-era assumptions. |
| L-009-009 | P2 | maintainability | .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/325-doctor-memory-long-pole-rebuild.md:41 | "`test -s .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`" | confirmed-residue | Regenerate the long-pole rebuild playbook so preconditions and snapshot checks use the active profile-derived sqlite filename. |
| L-009-010 | P2 | maintainability | .opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/326-doctor-memory-sigint-cancellation.md:46 | "`shasum .opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`" | confirmed-residue | Replace the required Voyage 1024 checksum fixture with the hf-local EmbeddingGemma default DB, leaving Voyage only as explicit-provider optional coverage. |

## Iteration summary
- Files scanned: 69
- New findings: 10 (P0=0, P1=0, P2=10)
- Out-of-scope/historical noted but NOT flagged: 4
- Notes: Saturation is visible in primary docs/configs; new residue this pass is mostly generated or test-support material. I did not flag explicit Voyage fallback tests, backward-compatibility conversion tests, unrelated Qwen 3.6 CLI model references, or this review packet's own artifacts.
