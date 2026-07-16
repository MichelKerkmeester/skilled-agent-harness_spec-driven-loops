# Iteration 003 — Local-LLM Legacy Hunt

## Focus
This iteration scanned maintainability-oriented residue across live command assets, runtime config examples, test fixtures, CocoIndex templates/references, and checked-in MCP config surfaces. The pass used targeted `rg` searches for old embedding defaults, legacy sqlite filenames, ONNX runtime remnants, Voyage marketing/model residue, and hf-local default wording, then read candidate files to separate active fixture/template rot from intentional historical records, provider registries, vitest temp-file idioms, and prior iteration coverage.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-003-001 | P1 | maintainability | .codex/config.toml:16 | "e.g., context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite" | confirmed-residue | Update the Codex config comment to use the llama-cpp default DB example, or phrase the hf-local filename strictly as fallback/override. |
| L-003-002 | P1 | maintainability | .codex/config.toml:17 | "for the Setup A default since 014/012" | confirmed-residue | Remove the stale Setup A default claim; post-014 no-cloud-key default is llama-cpp when GGUF runtime is installed. |
| L-003-003 | P2 | maintainability | .opencode/commands/doctor/update.md:213 | "`mcp_server/database/context-index.sqlite`" | confirmed-residue | Refresh the `/doctor:update` subsystem contract so memory DB examples use the active provider-keyed profile path instead of the legacy singleton filename. |
| L-003-004 | P2 | maintainability | .opencode/commands/doctor/update.md:268 | "`mcp_server/database/context-index.sqlite` and `mcp_server/database/context-index.sqlite.pre-doctor-update.*.bak`" | confirmed-residue | Update the allowed-target example to describe provider-keyed memory DBs and their matching backup pattern. |
| L-003-005 | P2 | maintainability | .opencode/commands/doctor/assets/doctor_update.yaml:102 | "- \"mcp_server/database/context-index.sqlite\"  # memory FTS/metadata DB" | confirmed-residue | Replace the hardcoded update workflow target with active-profile DB resolution language or a provider-keyed glob constrained by the canonical resolver. |
| L-003-006 | P2 | maintainability | .opencode/commands/doctor/assets/doctor_update.yaml:416 | "const db = new Database('.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite');" | confirmed-residue | Make the embedded count snippet resolve the active profile DB before opening SQLite, otherwise the workflow can audit the wrong file. |
| L-003-007 | P2 | maintainability | .opencode/commands/doctor/assets/doctor_causal-graph.yaml:78 | "- \"mcp_server/database/context-index.sqlite\"  # host DB for causal_edges table" | confirmed-residue | Reword the causal-graph mutation boundary around the active memory DB path instead of the legacy singleton filename. |
| L-003-008 | P2 | maintainability | .opencode/commands/doctor/assets/doctor_causal-graph.yaml:174 | "context-index.sqlite missing -> STATUS=MISSING with recommendation to run /doctor memory" | confirmed-residue | Change the missing-DB halt condition to check the active resolved profile DB, not `context-index.sqlite`. |
| L-003-009 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:609 | "MEMORY_DB_PATH points directly to the active hf-local default profile database" | confirmed-residue | Rebase the manual playbook fixture text on the canonical active profile, with hf-local described only as fallback. |
| L-003-010 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:380 | "MEMORY_DB_PATH points directly to context-index.sqlite for disposable fixtures." | confirmed-residue | Keep the disposable fixture DB if tests need it, but update the generated fixture prose so it does not teach the legacy singleton DB as the memory path. |

## Iteration summary
- Files scanned: 70
- New findings: 10 (P0=0, P1=2, P2=8)
- Out-of-scope/historical noted but NOT flagged: 13
- Notes: Saturation is starting on the obvious residue strings. I intentionally did not flag the canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp default-local wording, provider registries for legacy model lookup, vitest temp-dir `context-index.sqlite` idioms, `test_backward_compat.py`, `doctor_memory.yaml` / `_routes.yaml` provider-detection branches, prior iteration findings, `.vscode/mcp.json` because it was outside the supplied config surface list, or frozen review/evidence/archive content.
