#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP CODE MODE DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only health check for the mcp-code-mode MCP server.
# Catches missing dependencies that would prevent the server
# starting at first MCP request.
#
# Usage: bash .skilled/skills/mcp-code-mode/scripts/doctor.sh [--strict]
#
# The import checks run under the Node interpreter the MCP launcher resolves
# from the server manifest, falling back to PATH node when none matches.
#
# Exit Codes:
#   0  - Health checks passed (or advisory mode complete)
#   1  - Invalid arguments
#   20 - mcp-server node_modules missing
#   26 - Strict mode only: node not on PATH, runtime Node imports missing
#        (MCP SDK, @utcp/code-mode, @utcp/cli) or dist/index.js fails --check

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
MCP_DIR="$SKILL_DIR/mcp-server"
# The launcher resolves its interpreter through this module. Resolve the real
# path so the lookup still works when the skill is reached through a link.
RESOLVER=""
RESOLVER_DIR="$(cd "$(dirname "$(cd "$SKILL_DIR" && pwd -P)")/../bin/lib" 2>/dev/null && pwd -P || true)"
[[ -n "$RESOLVER_DIR" ]] && RESOLVER="$RESOLVER_DIR/node-engine-resolver.cjs"

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

PATH_NODE="$(command -v node || true)"
if [[ -z "$PATH_NODE" ]]; then
    log_warn "node not on PATH"
    [[ "$STRICT_MODE" == true ]] && exit 26
    exit 0
fi

# The server runs under the interpreter the launcher picks from the manifest's
# engines range, not under whatever node is first on PATH. The native addon in
# @utcp/code-mode is built for that interpreter, so the import checks below must
# use the same one or they report a false failure.
NODE_BIN=""
if [[ -f "$RESOLVER" ]]; then
    NODE_BIN="$("$PATH_NODE" -e '
const { resolveNodeInterpreter } = require(process.argv[1]);
const resolution = resolveNodeInterpreter({ manifestPath: process.argv[2] });
if (resolution && resolution.path) process.stdout.write(resolution.path);
' "$RESOLVER" "$MCP_DIR/package.json" 2>/dev/null || true)"
fi
if [[ -z "$NODE_BIN" ]]; then
    echo "  NOTE: the engine resolver found no Node matching the server manifest, so the checks use PATH node."
    NODE_BIN="$PATH_NODE"
fi
log_pass "Node interpreter: $NODE_BIN"

# Critical runtime imports for code-mode MCP. The skill IS the @utcp/code-mode-mcp
# package itself (mcp-server/package.json `name`); test the SDK + the @utcp helper
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
