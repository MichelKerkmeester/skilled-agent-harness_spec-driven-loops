# Iteration 9: D2 Security — Database Path, Live MCP, Bootstrap Lock

## Focus
D2 Security — Review database path handling, live MCP process safety, and bootstrap lock edge cases.

## Scorecard
- Dimensions covered: security
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.67

## Findings

### P2 — Suggestion

- **F019**: The launcher bootstrap lock uses a directory-based mutex with 120-second deadline (mk-code-index-launcher.cjs:183-203). If SIGKILL hits during lock acquisition, the lockdir persists indefinitely. The `artifactsReady()` escape hatch (line 194) skips building if dist artifacts exist, but if they aren't built yet, subsequent launches wait the full timeout. Lock staleness detection would improve resilience. — mk-code-index-launcher.cjs:183-203

- **F020**: `SPECKIT_CODE_GRAPH_DB_DIR` override (mcp.json:45) is not documented in the README.md or SKILL.md configuration tables. If set to a world-readable location, the SQLite database could expose project structure. — .claude/mcp.json:45

## Assessment
- No P0/P1 security findings
- Standard .env behavior for env loading
- Local SQLite with no network exposure
- Bootstrap lock has functional escape hatch

## Recommended Next Focus
D4 Maintainability — stabilization/regression re-check