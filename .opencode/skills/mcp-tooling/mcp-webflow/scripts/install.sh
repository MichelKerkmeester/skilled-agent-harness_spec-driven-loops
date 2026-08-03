#!/usr/bin/env bash
# Install helper for mcp-webflow: verifies prerequisites, checks the registered manual,
# and prints the operator steps (token creation + env export) without ever handling values.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
CONFIG="$REPO_ROOT/.utcp_config.json"

say() { printf '%s\n' "$*"; }

say "mcp-webflow install helper"
say "--------------------------"

# 1. Prerequisites
command -v node >/dev/null 2>&1 || { say "ERROR: node not found (Node 22.3.0+ required)"; exit 1; }
NODE_OK="$(node -e 'const [maj,min,pat]=process.versions.node.split(".").map(Number); console.log(maj>22||(maj===22&&(min>3||(min===3&&pat>=0)))?"ok":"old")' 2>/dev/null || echo old)"
if [ "$NODE_MAJOR" -lt 22 ]; then say "ERROR: node $(node --version) — webflow-mcp-server requires Node 22.3.0+"; exit 1; fi
say "[ok] node $(node --version)"

# 2. Manual registration (verify-only)
if [ -f "$CONFIG" ] && grep -q '"name": "webflow"' "$CONFIG"; then
  say "[ok] webflow manual already registered in .utcp_config.json (verify, never re-add)"
else
  say "[!!] webflow manual NOT found — register the stdio manual:"
  say '     {"name":"webflow","call_template_type":"mcp","config":{"mcpServers":{"webflow":'
  say '      {"transport":"stdio","command":"npx","args":["-y","webflow-mcp-server@latest"],'
  say '      "env":{"WEBFLOW_TOKEN":"${WEBFLOW_TOKEN}"}}}}'
fi

# 3. Operator steps (values stay with the operator)
say
say "Operator steps (from INSTALL-GUIDE.md):"
say "  1. Webflow -> Site settings -> Integrations -> API access; generate a Site Token for"
say "     the dedicated test site with least-privilege scopes (read-only baseline:"
say "     cms:read pages:read sites:read assets:read components:read forms:read authorized_user:read)."
say "  2. export WEBFLOW_TOKEN=<value>   (never commit or log the value)"
say "  3. Run scripts/doctor.sh, then run discovery (list_tools) per session."
say "  4. Pin the server version after the first verified session and record the discovered"
say "     tool set in references/tool-surface.md."
say
say "Done. See INSTALL-GUIDE.md and references/mcp-wiring.md for the remote-OAuth alternative."
