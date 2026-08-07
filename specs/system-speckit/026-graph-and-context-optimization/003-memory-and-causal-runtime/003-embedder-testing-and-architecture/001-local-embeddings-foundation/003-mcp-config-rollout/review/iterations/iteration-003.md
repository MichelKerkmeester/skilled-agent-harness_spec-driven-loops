# Deep Review Iteration 003 — 003-mcp-config-rollout

**Dimension:** cross-stack
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:34:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-003-001 | .codex/config.toml:9 | Cross-runtime lockstep is broken: Codex uses the direct context-server path while the launcher-owned runtimes load `.env.local`. | `.mcp.json:11-18` uses `.opencode/bin/spec-kit-memory-launcher.cjs`; `.codex/config.toml:9-14` uses `mcp_server/dist/context-server.js` directly. | Align Codex with the launcher before treating Setup A as universally rolled out. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-003-003 | .codex/config.toml:24 | Codex notes say current provider is `hf-local`, but the actual configured value is `EMBEDDINGS_PROVIDER = "auto"`. | `.codex/config.toml:14` sets auto; `.codex/config.toml:24` says current is hf-local. | Make the note reflect the real config or change the config to `hf-local`. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-003-003 | 003-mcp-config-rollout/spec.md:85 | The spec still describes adding model vars to five committed configs, but final design moved model identity to `.env.local`. | `003-mcp-config-rollout/spec.md:85-86` says per-config env additions; implementation later says project-local `.env.local`. | Update the spec scope to match the final mechanism so future reviewers do not chase reverted config edits. |

## Notes
Converging: the same P0 remains the only release-blocking issue found in this packet, with two documentation/API-contract cleanups around it.
