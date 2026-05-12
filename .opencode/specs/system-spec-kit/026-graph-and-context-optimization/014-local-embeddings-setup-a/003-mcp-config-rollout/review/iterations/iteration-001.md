# Deep Review Iteration 001 — 003-mcp-config-rollout

**Dimension:** correctness
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:32:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-003-001 | .codex/config.toml:9 | Codex's spec_kit_memory server bypasses the `.env.local` launcher, so Setup A model env is not loaded on this runtime. | `.codex/config.toml:9-14` runs `node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` with only `EMBEDDINGS_PROVIDER=auto`; the launcher that loads `.env.local` is `.opencode/bin/spec-kit-memory-launcher.cjs:9-40`. `context-server.js` has no dotenv loader. | Point Codex at `.opencode/bin/spec-kit-memory-launcher.cjs`, or add the same `.env.local` loader to the direct context-server startup path. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-003-001 | .env.local:17 | `.env.local` sets `HF_EMBEDDINGS_MODEL` and `EMBEDDING_DIM`, but not `EMBEDDINGS_PROVIDER=hf-local`; any direct runtime path with `EMBEDDINGS_PROVIDER=auto` can still choose Voyage if a key leaks back into env. | `.env.local:17-18` contains model/dim only; factory precedence at `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:377-385` chooses Voyage when `VOYAGE_API_KEY` exists in auto mode. | Add `EMBEDDINGS_PROVIDER=hf-local` to `.env.local` for Setup A, or make launchers inject it when Setup A is active. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-003-001 | .codex/config.toml:22 | Codex config note still claims vectors are stored in `context-index.sqlite`, contradicting filename-keying. | `.codex/config.toml:22` says `Stores vectors in ... context-index.sqlite`; actual live DB is `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768.sqlite`. | Update the note to say the path is derived from provider/model/dim. |

## Notes
Reviewed the config rollout against actual runtime config. The blocker is specific to Codex: other MCP configs use the launcher, while Codex still starts the built server directly.
