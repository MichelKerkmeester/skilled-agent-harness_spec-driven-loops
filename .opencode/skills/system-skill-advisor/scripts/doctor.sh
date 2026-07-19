#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM SKILL ADVISOR DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only health check for the system-skill-advisor MCP server.
# Critical risk: @huggingface/transformers downloads Jina embedding
# models on first use; can fail silently if disk or network is
# constrained at install time.
#
# Usage: bash .opencode/skills/system-skill-advisor/scripts/doctor.sh [--strict]
#
# Exit Codes:
#   0  - Health checks passed (or advisory mode complete)
#   1  - Invalid arguments
#   20 - mcp_server dist missing
#   26 - Runtime Node imports missing (HF transformers, better-sqlite3, MCP SDK)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
MCP_DIR="$SKILL_DIR/mcp-server"

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

echo "=== system-skill-advisor Doctor ==="
echo "MCP server: $MCP_DIR"
echo ""

if [[ ! -d "$MCP_DIR/dist" ]]; then
    log_warn "MCP server dist missing at $MCP_DIR/dist — run \`npm run build\` in $MCP_DIR."
    exit 20
fi
log_pass "MCP server dist present"

NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" ]]; then
    log_warn "node not on PATH"
    [[ "$STRICT_MODE" == true ]] && exit 26
    exit 0
fi
log_pass "Node interpreter: $NODE_BIN"

# Critical runtime imports for the skill advisor.
# @huggingface/transformers is heaviest (model downloads at first use).
# better-sqlite3 backs the skill-graph cache.
# zod for schema validation; MCP SDK for the server.
DEP_CHECK_MODULES="@huggingface/transformers better-sqlite3 @modelcontextprotocol/sdk/server/index.js zod"
DEP_CHECK_MISSING=()
for mod in $DEP_CHECK_MODULES; do
    ( cd "$MCP_DIR" && "$NODE_BIN" -e "require('$mod')" 2>/dev/null ) || DEP_CHECK_MISSING+=("$mod")
done

if [[ ${#DEP_CHECK_MISSING[@]} -eq 0 ]]; then
    log_pass "Runtime imports OK (@huggingface/transformers + better-sqlite3 + MCP SDK + zod)"
else
    log_warn "Runtime imports FAILED — missing modules: ${DEP_CHECK_MISSING[*]}"
    echo "  Fix via: ( cd $MCP_DIR && npm install )"
    echo "  Note: @huggingface/transformers downloads Jina models on first import;"
    echo "  if your disk or network is constrained, the post-install hook may have skipped."
    if [[ "$STRICT_MODE" == true ]]; then
        exit 26
    fi
fi

echo ""
echo "Doctor done."
