#!/usr/bin/env bash
# Doctor for the mcp-webflow transport: verifies the runtime, the registered manual,
# and token presence WITHOUT ever printing token values.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
CONFIG="$REPO_ROOT/.utcp_config.json"
FAIL=0

say()  { printf '%s\n' "$*"; }
ok()   { say "  [OK] $*"; }
warn() { say "  [!!] $*"; FAIL=1; }

say "mcp-webflow doctor"
say "------------------"

# 1. Runtime
say "[1] Runtime"
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -e 'console.log(process.versions.node.split(".")[0])' 2>/dev/null || echo 0)"
  if [ "$NODE_MAJOR" -ge 22 ]; then ok "node $(node --version) (>= 22.3 required)";
  else warn "node $(node --version) — webflow-mcp-server requires Node 22.3.0+"; fi
else warn "node not found"; fi
command -v npx >/dev/null 2>&1 && ok "npx present" || warn "npx not found"

# 2. Registered manual (verify-only: never re-add, never edit)
say "[2] Code Mode manual"
if [ -f "$CONFIG" ]; then
  if python3 - "$CONFIG" <<'PY'
import json, sys
cfg = json.load(open(sys.argv[1]))
for m in cfg.get("manual_call_templates", []):
    if m.get("name") == "webflow":
        server = m.get("config", {}).get("mcpServers", {}).get("webflow", {})
        assert server.get("transport") == "stdio", "transport changed"
        assert "webflow-mcp-server" in " ".join(server.get("args", [])), "server changed"
        assert "WEBFLOW_TOKEN" in server.get("env", {}), "env binding changed"
        print("ok")
        sys.exit(0)
print("missing")
sys.exit(1)
PY
  then ok "webflow manual registered with stdio + WEBFLOW_TOKEN binding";
  else warn "webflow manual missing or altered — verify before re-adding"; fi
  python3 -c "import json; json.load(open('$CONFIG'))" 2>/dev/null \
    && ok ".utcp_config.json parses" || warn ".utcp_config.json does not parse"
else warn ".utcp_config.json not found at $CONFIG"; fi

# 3. Token presence (boolean only — never print the value)
say "[3] Token presence"
if [ -n "${WEBFLOW_TOKEN:-}" ]; then ok "WEBFLOW_TOKEN is set (value not shown)";
else warn "WEBFLOW_TOKEN is not set in this environment"; fi

say "------------------"
if [ "$FAIL" -eq 0 ]; then say "doctor: all checks passed"; else say "doctor: $FAIL check(s) need attention"; fi
exit "$FAIL"
