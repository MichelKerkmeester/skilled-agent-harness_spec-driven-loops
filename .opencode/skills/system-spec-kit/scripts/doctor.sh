#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM SPEC KIT DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only health check for the system-spec-kit MCP server
# installation. Catches the install-time silent-skip-deps failure
# mode where the binary launches but runtime imports fail at first
# real use.
#
# Usage: bash .opencode/skills/system-spec-kit/scripts/doctor.sh [--strict]
#
# Exit Codes:
#   0  - Health checks passed (or advisory mode complete)
#   1  - Invalid arguments
#   20 - mcp_server dist missing
#   26 - Runtime Node imports missing (better-sqlite3, sqlite-vec, MCP SDK)

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

echo "=== system-spec-kit Doctor ==="
echo "MCP server: $MCP_DIR"
echo ""

# Verify mcp_server dist exists.
if [[ ! -d "$MCP_DIR/dist" ]]; then
    log_warn "MCP server dist missing at $MCP_DIR/dist — run \`npm run build\` in $MCP_DIR."
    exit 20
fi
log_pass "MCP server dist present"

# Resolve Node interpreter — uses workspace-managed Node (npm in PATH).
NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" ]]; then
    log_warn "node not on PATH"
    [[ "$STRICT_MODE" == true ]] && exit 26
    exit 0
fi
log_pass "Node interpreter: $NODE_BIN"

# Critical runtime imports for the MCP server.
DEP_CHECK_MODULES="better-sqlite3 sqlite-vec @modelcontextprotocol/sdk/server/index.js zod"
DEP_CHECK_MISSING=()
for mod in $DEP_CHECK_MODULES; do
    ( cd "$MCP_DIR" && "$NODE_BIN" -e "require('$mod')" 2>/dev/null ) || DEP_CHECK_MISSING+=("$mod")
done

if [[ ${#DEP_CHECK_MISSING[@]} -eq 0 ]]; then
    log_pass "Runtime imports OK (better-sqlite3 + sqlite-vec + MCP SDK + zod)"
else
    log_warn "Runtime imports FAILED — missing modules: ${DEP_CHECK_MISSING[*]}"
    echo "  Fix via: ( cd $MCP_DIR && npm install )"
    echo "  If native modules (better-sqlite3, sqlite-vec) fail, see"
    echo "  $SKILL_DIR/scripts/rebuild-native-modules.sh"
    if [[ "$STRICT_MODE" == true ]]; then
        exit 26
    fi
fi

echo ""
echo "Doctor done."
