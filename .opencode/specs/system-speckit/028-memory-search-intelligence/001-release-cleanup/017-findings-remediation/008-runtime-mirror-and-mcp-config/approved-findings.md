# Approved finding set

2 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-04:F10` | CAT-5 | `python3 -c 'import json; c=json.load(open(".claude/mcp.json"))["mcpServers"]; o=json.load(open("opencode.json"))["mcp"]; normc={k:{"command":[v["command"],*v.get("args",[])],"env":v.get("env",{})} fo` | The two physical files independently define the same five semantically equivalent server configurations. |
| `devin-04:F9` | CAT-5 | `node -e 'const fs=require("node:fs"); const t=fs.readFileSync(".codex/config.toml","utf8"),c=[...t.matchAll(/^\[mcp_servers\.(?:"([^"]+)"\` | ([^\].]+))\]$/gm)].map(m=>m[1]\ |
