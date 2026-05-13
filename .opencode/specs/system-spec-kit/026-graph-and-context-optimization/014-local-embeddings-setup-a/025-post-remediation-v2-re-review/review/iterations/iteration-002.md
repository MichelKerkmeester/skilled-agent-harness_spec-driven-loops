# Iteration 002 — Local-LLM Legacy Hunt

## Focus
This iteration scanned traceability surfaces for post-022 residue: install guides, skill references, README/SKILL files, feature catalogs, manual testing playbooks, config files, and source-adjacent comments under the requested scope. I treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade and llama-cpp auto-selection as canonical, so the scan focused on stale singleton database paths, removed ONNX runtime references, and user-facing text that still contradicts the active profile-keyed EmbeddingGemma defaults.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-002-001 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:82 | "`mcp_server/database/context-index.sqlite (memory)`" | confirmed-residue | Update the architecture diagram to describe the active profile-keyed memory DB filename contract. |
| L-002-002 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:120 | "`code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)" | confirmed-residue | Replace the singleton memory DB reference with "stored in the active memory DB directory" or the profile-keyed DB contract. |
| L-002-003 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:826 | "`sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \\`" | confirmed-residue | Change troubleshooting commands to resolve or substitute the active profile-keyed sqlite path before querying. |
| L-002-004 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:948 | "`sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \\`" | confirmed-residue | Refresh the empty-memory diagnostic block to use the resolved active profile DB path. |
| L-002-005 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1019 | "`cp .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \\`" | confirmed-residue | Backup instructions should copy the active profile-keyed DB rather than the removed singleton filename. |
| L-002-006 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1059 | "`.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`" | confirmed-residue | Restore instructions should target the same active profile DB path that was backed up. |
| L-002-007 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1081 | "`.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` \\| Canonical database (runtime)" | confirmed-residue | Replace the resource-table row with the profile-keyed sqlite naming pattern and resolver source. |
| L-002-008 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1113 | "`sqlite3 mcp_server/database/context-index.sqlite \\`" | confirmed-residue | Update the operational checklist's database inspection commands to require the resolved active profile DB. |
| L-002-009 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1138 | "`DB PATH:      mcp_server/database/context-index.sqlite`" | confirmed-residue | Replace the quick-reference DB path with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`. |
| L-002-010 | P2 | traceability | .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md:32 | "`optional `onnxruntime-node` and `sharp` installs`" | confirmed-residue | Remove the ONNX runtime probe from current setup-traceability docs, or mark it historical if the probe no longer applies post-014. |

## Iteration summary
- Files scanned: 4153
- New findings: 10 (P0=0, P1=9, P2=1)
- Out-of-scope/historical noted but NOT flagged: 29
- Notes: Saturation is emerging outside the System Spec Kit install guide. CocoIndex `voyage-code-3` references were not flagged because they describe an optional cloud alternative, not the memory MCP default. Model registry/backward-compatibility references to Nomic/MiniLM and test-fixture `context-index.sqlite` paths were also left unflagged per the prompt constraints.
