---
title: "Iter 003 — Track 1: MCP server registration inventory"
iteration: 3
track: 1
focus: "MCP server registration inventory"
status: complete
newInfoRatio: 0.00
---

# Iter 003 — Track 1: MCP server registration inventory

## RQ
List every claim in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` about MCP servers (names, counts, registrations across runtimes). Verify each appears identically in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`. Flag any drift in naming (underscore vs hyphen, prefix), missing registrations across runtimes, or extra registrations not mentioned in README. Particular focus: the 4 runtime configs may declare different sets. Confirm or refute the README's "Native MCP Topology" section's claim that all 6 servers are registered identically across all 4 runtimes.

## Actions
Read 5 files: README.md (lines 1-341), opencode.json (97 lines), .codex/config.toml (125 lines), .claude/mcp.json (77 lines), .gemini/settings.json (176 lines). Compared MCP server names and registrations across all configs.

## Findings
### F-003-001: mk-spec-memory
- **Claim in README**: "mk-spec-memory      context + memory" (line 91)
- **Registration in opencode.json**: yes, "mk-spec-memory"
- **Registration in .codex/config.toml**: yes, "mk-spec-memory"
- **Registration in .claude/mcp.json**: yes, "mk-spec-memory"
- **Registration in .gemini/settings.json**: yes, "mk-spec-memory"
- **Status**: CURRENT
- **Suggested edit**: none

### F-003-002: mk_skill_advisor
- **Claim in README**: "mk_skill_advisor     skill routing" (line 92)
- **Registration in opencode.json**: yes, "mk_skill_advisor"
- **Registration in .codex/config.toml**: yes, "mk_skill_advisor"
- **Registration in .claude/mcp.json**: yes, "mk_skill_advisor"
- **Registration in .gemini/settings.json**: yes, "mk_skill_advisor"
- **Status**: CURRENT
- **Suggested edit**: none

### F-003-003: mk_code_index
- **Claim in README**: "mk_code_index        structural graph" (line 93)
- **Registration in opencode.json**: yes, "mk_code_index"
- **Registration in .codex/config.toml**: yes, "mk_code_index"
- **Registration in .claude/mcp.json**: yes, "mk_code_index"
- **Registration in .gemini/settings.json**: yes, "mk_code_index"
- **Status**: CURRENT
- **Suggested edit**: none

### F-003-004: cocoindex_code
- **Claim in README**: "cocoindex_code       semantic search" (line 94)
- **Registration in opencode.json**: yes, "cocoindex_code"
- **Registration in .codex/config.toml**: yes, "cocoindex_code"
- **Registration in .claude/mcp.json**: yes, "cocoindex_code"
- **Registration in .gemini/settings.json**: yes, "cocoindex_code"
- **Status**: CURRENT
- **Suggested edit**: none

### F-003-005: code_mode
- **Claim in README**: "code_mode            external tools" (line 95)
- **Registration in opencode.json**: yes, "code_mode"
- **Registration in .codex/config.toml**: yes, "code_mode"
- **Registration in .claude/mcp.json**: yes, "code_mode"
- **Registration in .gemini/settings.json**: yes, "code_mode"
- **Status**: CURRENT
- **Suggested edit**: none

### F-003-006: sequential_thinking
- **Claim in README**: "sequential_thinking  reasoning helper" (line 96)
- **Registration in opencode.json**: yes, "sequential_thinking"
- **Registration in .codex/config.toml**: yes, "sequential_thinking"
- **Registration in .claude/mcp.json**: yes, "sequential_thinking"
- **Registration in .gemini/settings.json**: yes, "sequential_thinking"
- **Status**: CURRENT
- **Suggested edit**: none

## Coverage notes
- README.md: scanned lines 90-96 (Native MCP Topology section)
- opencode.json: scanned all 97 lines, mcp section lines 10-93
- .codex/config.toml: scanned all 125 lines, mcp_servers section lines 5-73
- .claude/mcp.json: scanned all 77 lines, mcpServers section lines 2-76
- .gemini/settings.json: scanned all 176 lines, mcpServers section lines 17-100

## newInfoRatio rationale
0.00 — All 6 MCP servers claimed in README's "Native MCP Topology" section are registered identically across all 4 runtime configs (opencode.json, .codex/config.toml, .claude/mcp.json, .gemini/settings.json). No naming drift, no missing registrations, no extra registrations. The README's claim is confirmed.

ITER_003_COMPLETE: 6 findings, newInfoRatio=0.00
