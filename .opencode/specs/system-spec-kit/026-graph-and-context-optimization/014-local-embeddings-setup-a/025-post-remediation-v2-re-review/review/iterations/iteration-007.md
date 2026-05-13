# Iteration 007 — Local-LLM Legacy Hunt

## Focus
This iteration focused on correctness residue in live runtime and configuration surfaces: MCP config notes, root release docs, and doctor command workflow assets that can steer mutation boundaries or operator behavior. I scanned for singleton memory DB names, provider-profile filenames missing the dtype segment, removed ONNX runtime references, stale MiniLM/Nomic default claims, and non-canonical provider cascade language while excluding the review packet itself, archives, forensic evidence/logs, and previously reported mcp-coco documentation residue.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-007-001 | P1 | correctness | .opencode/commands/doctor/assets/doctor_update.yaml:102 | `"mcp_server/database/context-index.sqlite"  # memory FTS/metadata DB` | confirmed-residue | Replace the singleton memory DB allowed target with the active profile-keyed DB resolution contract, or resolve the concrete active DB path at runtime before snapshot/mutation validation. |
| L-007-002 | P1 | correctness | .opencode/commands/doctor/assets/doctor_update.yaml:104 | `"mcp_server/database/context-index__voyage__voyage-4__1024.sqlite"  # memory vector DB` | confirmed-residue | Update doctor update's vector DB boundary to include the dtype-bearing profile filename pattern, e.g. `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`, instead of the stale Voyage literal. |
| L-007-003 | P1 | correctness | .opencode/commands/doctor/assets/doctor_update.yaml:416 | `const db = new Database('.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite');` | confirmed-residue | Resolve the active profile DB path via the shared embedding profile helper before counting indexed specs; the current post-run count can inspect the wrong database. |
| L-007-004 | P1 | correctness | .opencode/commands/doctor/assets/doctor_causal-graph.yaml:78 | `"mcp_server/database/context-index.sqlite"  # host DB for causal_edges table` | confirmed-residue | Change the causal-graph mutation boundary to resolve the active profile-keyed memory DB path instead of whitelisting the removed singleton. |
| L-007-005 | P1 | correctness | .opencode/commands/doctor/assets/doctor_causal-graph.yaml:161 | `"Bash: stat -f '%m %z' mcp_server/database/context-index.sqlite"` | confirmed-residue | Replace the hardcoded stat probe with a resolved active DB path probe so causal-graph diagnostics do not report the active profile DB as missing. |
| L-007-006 | P1 | correctness | .vscode/mcp.json:20 | `"Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local). Options: 'auto', 'voyage', 'openai', 'hf-local'"` | confirmed-residue | Align the committed VS Code MCP config note with the canonical cascade: Voyage -> OpenAI -> llama-cpp when GGUF runtime is installed -> hf-local, and include `llama-cpp` in options. |
| L-007-007 | P1 | correctness | .vscode/mcp.json:22 | `"Get Voyage key: https://dash.voyageai.com/api-keys (recommended, 8% better than OpenAI)"` | confirmed-residue | Remove the marketing/performance claim or replace it with neutral key setup text; Voyage auto-selection is intentional, but the unsubstantiated "8% better" recommendation is not canonical. |
| L-007-008 | P1 | correctness | .vscode/mcp.json:39 | `"Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"` | confirmed-residue | Update the CocoIndex VS Code MCP note to the canonical default `google/embeddinggemma-300m` with 768 dimensions, or point to the shared settings resolver. |
| L-007-009 | P1 | correctness | PUBLIC_RELEASE.md:25 | `context-index.sqlite` | confirmed-residue | Replace the project-local database example with a profile-keyed sqlite filename or a wildcard/profile pattern so consumer projects do not seed the obsolete singleton path. |

## Iteration summary
- Files scanned: 4506
- New findings: 9 (P0=0, P1=9, P2=0)
- Out-of-scope/historical noted but NOT flagged: 14
- Notes: Saturation is starting on the mcp-coco documentation side; most remaining new correctness residue is in doctor workflow assets and alternate runtime config mirrors. I did not re-flag prior mcp-coco `voyage-code-3` docs, vitest temp `context-index.sqlite` fixtures, intentional legacy model registries, `test_backward_compat.py`, historical changelogs, or package-lock transitive ONNX entries.
