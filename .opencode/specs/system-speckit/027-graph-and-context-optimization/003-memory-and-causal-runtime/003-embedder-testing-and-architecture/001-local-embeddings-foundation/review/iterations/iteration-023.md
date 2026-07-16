# Deep Review v2 Iteration 023 — 003 correctness

**Dimension:** correctness
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P0-V2-003-001 | `.codex/config.toml:9` | Codex still bypasses `spec-kit-memory-launcher.cjs`, so `.env.local` Setup A overrides are not loaded for this runtime. | Lines 9-14 run `node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` with `EMBEDDINGS_PROVIDER=auto`; the launcher loads `.env.local` at `.opencode/bin/spec-kit-memory-launcher.cjs:9-40`. | Point Codex at `.opencode/bin/spec-kit-memory-launcher.cjs`, or add equivalent env-local loading to the direct context-server path. |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No separate P1 in this pass. | - | - |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V2-003-001 | `.codex/config.toml:22` | Codex notes still name the old generic DB path. | Line 22 says vectors are stored in `context-index.sqlite`; live hf-local DB is filename-keyed. | Update the note when the P0 config path is fixed. |

## Notes
This re-confirms v1 `P0-003-001`.
