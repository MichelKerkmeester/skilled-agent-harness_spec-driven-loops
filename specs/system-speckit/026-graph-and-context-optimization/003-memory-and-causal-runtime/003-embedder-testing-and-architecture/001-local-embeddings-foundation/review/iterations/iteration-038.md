# Deep Review v3 Iteration 038 - launcher parity

**Dimension:** cross-stack  
**Commit reviewed:** d76f3b795

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P0-V3-LAUNCHER-001 | `.codex/config.toml:10` | 011 updated Codex docstrings but did not fix launcher routing. | The `spec_kit_memory` command is still `node` with args `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` at lines 10-11. The launcher that loads `.env.local` is `.opencode/bin/spec-kit-memory-launcher.cjs:9-40`. | Route Codex through `.opencode/bin/spec-kit-memory-launcher.cjs`, or move equivalent env/bootstrap logic into `context-server.js`. |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V3-LAUNCHER-001 | `.claude/mcp.json:11` | Runtime parity is broader than Codex: Claude and Gemini also bypass the launcher. | `.claude/mcp.json:11-14` and `.gemini/settings.json:27-30` invoke `context-server.js` directly; `.mcp.json:12-14` and `opencode.json:21-23` use the launcher. | Standardize all maintained runtime configs on one launch path. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | Old Codex DB-path note is resolved. | `.codex/config.toml:16` and `:21` now name the EmbeddingGemma 768 DB path. | Keep the updated notes while fixing the command. |

## Notes
The direct default now happens to be EmbeddingGemma, so the immediate Setup A model mismatch is reduced. The launcher parity bug is still real because `.env.local`, build-if-needed, and launcher state handling remain bypassed.
