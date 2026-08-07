# Deep Review Iteration 002 — 003-mcp-config-rollout

**Dimension:** security
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:33:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-003-001 | .codex/config.toml:9 | Same active blocker as iteration 001: the Codex direct server path can ignore project-local Setup A overrides and auto-resolve to a cloud provider. | `.codex/config.toml:9-14` plus factory auto precedence at `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:377-385`. | Route Codex through the launcher and force/recommend `EMBEDDINGS_PROVIDER=hf-local` for Setup A. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-003-002 | .opencode/bin/spec-kit-memory-launcher.cjs:20 | The launcher env parser accepts only simple `KEY=value` lines and does not implement dotenv escapes or inline comments, so config parity differs from Python `load_dotenv`. | Node parser is a regex plus quote strip at `.opencode/bin/spec-kit-memory-launcher.cjs:20-29`; Python uses `dotenv.load_dotenv` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:16-25`. | Either document the supported subset in `.env.local` or switch the Node launcher to the same dotenv parser semantics. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-003-002 | .mcp.json:20 | Several committed config notes still describe `auto` as key-driven while Setup A relies on local-only behavior. | `.mcp.json:20-21` explains `auto` as `VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local`; that is accurate code behavior but risky as Setup A operator guidance. | Add a Setup A note that `.env.local` should force local model/provider identity. |

## Notes
Security pass focused on env trust boundaries. The key risk is not secret disclosure in committed files; it is silent cloud-provider egress if the Setup A env path is missed.
