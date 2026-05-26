# Iteration 011 - MCP Server Allowlist

## Summary
MCP server configurations are distributed across multiple config files with no centralized allowlist. The primary security concern is the use of `npx -y` for external package installation, which creates a supply chain attack vector. Multiple external MCP servers are observed running but not configured in standard MCP config files, indicating potential loading mechanisms outside the allowlist.

## Files/Commands Reviewed
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/mcp.json` (78 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.vscode/mcp.json` (80 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex/config.toml` (125 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.devin/config.json` (79 lines)
- `/Users/michelkerkmeester/.claude/settings.json` (323 lines)
- `/Users/michelkerkmeester/.codex/config.json` (3 lines)
- `/Users/michelkerkmeester/.codex/config.toml` (122 lines)
- `/Users/michelkerkmeester/.gemini/settings.json` (82 lines)
- `/Users/michelkerkmeester/Library/Application Support/Code/User/settings.json` (86 lines)
- `/Users/michelkerkmeester/Library/Application Support/Code/User/mcp.json` (26 lines)
- `find . ~/.config ~/.claude ~/.codex ~/.gemini -maxdepth 4 \( -name "mcp.json" -o -name "*.mcp.json" -o -name "settings.json" -o -name "config.toml" -o -name "config.json" \)` (exit code 0)
- `rg -n --hidden --glob "!**/node_modules/**" --glob "!**/*.sqlite*" "(mcpServers|command|args|env|stdio|sse|http|https://|uvx|npx|node|python|docker)" .opencode .vscode .claude .codex .gemini` (exit code 0)
- `ps auxww | grep -Ei "(mcp|model.context|mk-code-index|mk-spec-memory|mk-skill-advisor|node|uvx|npx)"` (exit code 0)
- `ls -la /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/` (exit code 0)
- `ls -la /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/` (exit code 0)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| MCP-001 | `npx -y` flag enables auto-confirmation of package installation without user interaction, creating supply chain attack vector | `.claude/mcp.json:4-8`, `.vscode/mcp.json:5-9`, `.codex/config.toml:6-7`, `.devin/config.json:4-8` all use `npx -y @modelcontextprotocol/server-sequential-thinking` | Remove `-y` flag or pin to specific package version with lockfile validation |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| MCP-002 | External MCP servers running without configuration in standard allowlist files (chrome-devtools-mcp, figma-developer-mcp, clickup-mcp-server, mcp-server-github, mcp-server-sequential-thinking) | Process list shows multiple `npm exec` and `npx` spawned MCP servers not present in any mcp.json/config.toml files | Audit extension configurations and implement centralized allowlist with explicit approval for external servers |
| MCP-003 | No centralized MCP server allowlist mechanism - configuration scattered across 4+ files without single source of truth | Separate configs in `.claude/mcp.json`, `.vscode/mcp.json`, `.codex/config.toml`, `.devin/config.json` with identical server definitions | Implement centralized MCP allowlist with symlink or import mechanism to prevent configuration drift |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| MCP-004 | All local MCP server launchers use relative paths, vulnerable to path manipulation if repository structure is compromised | `.claude/mcp.json:13`, `.claude/mcp.json:31`, `.claude/mcp.json:43`, `.claude/mcp.json:58`, `.claude/mcp.json:71` all use relative paths like `.opencode/bin/mk-spec-memory-launcher.cjs` | Use absolute paths or implement path validation/sanitization before execution |
| MCP-005 | No signature verification or checksum validation for local MCP server executables | Local launchers in `.opencode/bin/` and `.opencode/skills/*/mcp_server/` have no integrity checks | Implement cryptographic signature verification for local MCP server binaries |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| MCP-006 | Configuration duplication across multiple files creates maintenance burden and potential for configuration drift | Identical MCP server definitions repeated in `.claude/mcp.json`, `.vscode/mcp.json`, `.codex/config.toml`, `.devin/config.json` | Consolidate to single source of truth with symlinks or import mechanism |
| MCP-007 | Environment variable names exposed in config files could aid targeted attacks | `.claude/mcp.json:16`, `.claude/mcp.json:22-23` expose `EMBEDDINGS_PROVIDER`, `VOYAGE_API_KEY`, `OPENAI_API_KEY` variable names | Remove sensitive variable name documentation or move to separate secure configuration |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| MCP-008 | All configured MCP servers in repo are either local relative paths or official @modelcontextprotocol packages | Review of all mcp.json files shows only local launchers and `@modelcontextprotocol/server-sequential-thinking` | Continue monitoring for any new external package additions |
| MCP-009 | Process list shows active MCP server instances from both local and external sources | Running processes include `.opencode/skills/*/mcp_server/` local servers and external npm packages | Document approved external servers and implement process monitoring |

## Convergence Signal
newInfoRatio: 0.7 - VERIFIED-CLEAN with INDICATORS-PRESENT

The MCP server allowlist dimension shows INDICATORS-PRESENT due to the critical `npx -y` supply chain vector and unexplained external MCP servers running outside the standard allowlist. While the repo-level configurations are clean (only local paths and one official package), the lack of centralized control and presence of unconfigured external servers running represents a real exposure that requires remediation.