#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP CODE MODE DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only health check for the mcp-code-mode MCP server.
# Catches missing dependencies that would prevent the server
# starting at first MCP request.
#
# Usage: bash .opencode/skills/mcp-code-mode/scripts/doctor.sh [--strict]
#
# Exit Codes:
#   0  - Health checks passed (or advisory mode complete)
#   1  - Invalid arguments
#   20 - mcp_server dist missing
#   26 - Runtime Node imports missing (utcp/code-mode-mcp, MCP SDK)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
MCP_DIR="$SKILL_DIR/mcp_server"

STRICT_MODE=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        --strict) STRICT_MODE=true; shift ;;
        -h|--help) echo "Usage: $0 [--strict]"; exit 0 ;;
        *) echo "Unknown arg: $1" >&2; exit 1 ;;
    esac
done

log_pass() { printf '  PASS: %s\n' "$1"; }
log_warn() { printf '  WARN: %s\n' "$1"; }

echo "=== mcp-code-mode Doctor ==="
echo "MCP server: $MCP_DIR"
echo ""

if [[ ! -d "$MCP_DIR/node_modules" ]]; then
    log_warn "MCP server node_modules missing — run \`npm install\` in $MCP_DIR."
    exit 20
fi
log_pass "MCP server node_modules present"

NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" ]]; then
    log_warn "node not on PATH"
    [[ "$STRICT_MODE" == true ]] && exit 26
    exit 0
fi
log_pass "Node interpreter: $NODE_BIN"

# Critical runtime imports for code-mode MCP. The skill IS the @utcp/code-mode-mcp
# package itself (mcp_server/package.json `name`); test the SDK + the @utcp helper
# packages it bundles, plus verify dist/index.js loads without ImportError.
DEP_CHECK_MODULES="@modelcontextprotocol/sdk/server/index.js @utcp/code-mode @utcp/cli"
DEP_CHECK_MISSING=()
for mod in $DEP_CHECK_MODULES; do
    ( cd "$MCP_DIR" && "$NODE_BIN" -e "require('$mod')" 2>/dev/null ) || DEP_CHECK_MISSING+=("$mod")
done

# Also smoke-test the dist entry point if present.
ENTRY_BROKEN=false
if [[ -f "$MCP_DIR/dist/index.js" ]]; then
    if ! ( cd "$MCP_DIR" && "$NODE_BIN" --check dist/index.js 2>/dev/null ); then
        ENTRY_BROKEN=true
        DEP_CHECK_MISSING+=("dist/index.js (syntax/load error)")
    fi
fi

if [[ ${#DEP_CHECK_MISSING[@]} -eq 0 ]]; then
    log_pass "Runtime imports OK (MCP SDK + @utcp/code-mode + @utcp/cli + dist/index.js)"
else
    log_warn "Runtime imports FAILED — missing or broken: ${DEP_CHECK_MISSING[*]}"
    echo "  Fix via: ( cd $MCP_DIR && npm install )"
    if [[ "$ENTRY_BROKEN" == true ]]; then
        echo "  dist/index.js failed --check — re-run \`npm run build\` in $MCP_DIR."
    fi
    if [[ "$STRICT_MODE" == true ]]; then
        exit 26
    fi
fi

echo ""
echo "Doctor done."
