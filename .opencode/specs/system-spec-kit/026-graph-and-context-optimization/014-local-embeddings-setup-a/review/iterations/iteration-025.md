# Deep Review v2 Iteration 025 — 003 cross-stack

**Dimension:** cross-stack
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P0-V2-003-001 | `.codex/config.toml:11` | Runtime parity is broken: generic MCP config uses the launcher, Codex uses the built server directly. | `.mcp.json:11-15` runs `.opencode/bin/spec-kit-memory-launcher.cjs`; `.codex/config.toml:9-14` does not. | Align Codex with the launcher path. |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No new P1. | - | - |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V2-003-002 | `.opencode/bin/spec-kit-memory-launcher.cjs:13` | Node launcher uses a minimal dotenv subset while Python uses `python-dotenv`. | Lines 13-34 implement a simple regex parser; `cli.py:16-25` uses `load_dotenv`. | Document the subset or use equivalent dotenv semantics across runtimes. |

## Notes
Converged for 003: one active P0 plus small documentation/parser parity issues.
