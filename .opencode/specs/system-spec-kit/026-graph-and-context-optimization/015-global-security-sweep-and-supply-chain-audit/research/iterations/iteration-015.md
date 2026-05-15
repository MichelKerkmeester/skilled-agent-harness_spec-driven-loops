# Iteration 015 - External MCP Transports

## Summary
All MCP transports use local stdio only; no HTTP/SSE/WebSocket external transports detected. No remote MCP endpoints, tunnel services, or exposed ports found. Credential references use environment variables with no hardcoded values. One local listener on 127.0.0.1:7265 (Node.js process).

## Files/Commands Reviewed
- `find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ~ -maxdepth 5 -name ".utcp_config.json" -print` (exit code 1, found 4 files)
- `find ... | xargs sed -E "s/(token|secret|key|password).../[REDACTED]/Ig"` (exit code 1, redacted output reviewed)
- `rg -n --hidden (utcp|sse|websocket|ws://|wss://|https?://|ngrok|cloudflared|localhost.run|serveo|reverse tunnel|remoteMcp|transport)` (exit code 0, matches reviewed)
- `ps auxww | grep -Ei "(ngrok|cloudflared|ssh -R|socat|websocket|sse|mcp|utcp|proxy)"` (exit code 0, processes reviewed)
- `lsof -nP -iTCP -sTCP:LISTEN | grep -Ei "(node|python|uvx|npx|mcp|codex|claude|devin|gemini|cloudflared|ngrok)"` (exit code 0, listeners reviewed)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.utcp_config.json` (112 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.gemini/.utcp_config.json` (112 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/.utcp_config.json` (112 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/mcp.json` (78 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.vscode/mcp.json` (80 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.vscode/sessions.json` (56 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/docker-compose.yml` (56 lines)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I015-L001 | Archived docker-compose.yml exposes database ports to localhost | `.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/docker-compose.yml:8-9,32-34` exposes Neo4j (7474, 7687) and Qdrant (6333, 6334) ports. All bound to localhost only, not 0.0.0.0. File is in z_archive (deprecated spec). | No action needed (archived, localhost-only binding). Consider deleting archived spec if no longer needed. |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I015-I001 | All MCP transports use stdio only (no external transports) | `.utcp_config.json:21,39,57,78,98` and `.claude/mcp.json:4-9,11-14,28-32,40-44,56-60,68-72` show all MCP servers use `"transport": "stdio"` with local command execution (npx, node, ccc). No HTTP/SSE/WebSocket transports configured. | This is the secure default. Continue using stdio transports. |
| I015-I002 | Credentials referenced via environment variables only | `.utcp_config.json:64-65,86,105` reference `${CLICKUP_API_KEY}`, `${CLICKUP_TEAM_ID}`, `${FIGMA_API_KEY}`, `${GITHUB_PERSONAL_ACCESS_TOKEN}`. No hardcoded secret values found. | This is the secure pattern. Ensure .env files are gitignored and not committed. |
| I015-I003 | Multiple MCP servers running via stdio (local processes only) | Process list shows chrome-devtools-mcp, clickup-mcp-server, figma-developer-mcp, mcp-server-github, sequential-thinking MCP all running as local Node.js processes via stdio. No external connections. | This is expected for local MCP architecture. No action needed. |
| I015-I004 | One local TCP listener detected (127.0.0.1:7265) | `lsof` shows Node.js process PID 14365 listening on 127.0.0.1:7265. Bound to localhost only, not exposed externally. | Verify this is a known local service. Consider documenting purpose in operations runbook. |
| I015-I005 | Windsurf IDE language server with HTTPS to codeium.com | Process list shows Windsurf language server connecting to `https://server.self-serve.windsurf.com` and `https://inference.codeium.com`. This is expected IDE telemetry/autocomplete functionality. | This is expected Windsurf behavior. Review Windsurf privacy policy if concerned about telemetry. |
| I015-I006 | No tunnel/proxy services detected | Process and file scans found no ngrok, cloudflared, ssh -R, socat, or reverse tunnel services running. No tunnel configurations in MCP configs. | This is the secure state. Continue monitoring for unauthorized tunnel services. |
| I015-I007 | HTTPS URLs in documentation only (no transport configs) | `.claude/mcp.json:22-23`, `.vscode/mcp.json:23-24` contain HTTPS URLs to `dash.voyageai.com/api-keys` and `platform.openai.com/api-keys` as documentation notes. Package-lock.json contains npm registry URLs. These are documentation/registry URLs, not transport endpoints. | No action needed (documentation URLs are benign). |

## Convergence Signal
newInfoRatio=0.12 - LOW: All MCP transports use local stdio only. No external HTTP/SSE/WebSocket transports, remote endpoints, or tunnel services detected. Credential management follows secure patterns (environment variables only). One local TCP listener on localhost. Archived docker-compose with localhost-only port bindings. Dimension is CLEAN with no security concerns.
