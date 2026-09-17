#!/usr/bin/env bash
# mcp-refero doctor: REPORT-ONLY diagnostics. Changes nothing, installs nothing,
# never edits .utcp_config.json, never touches auth state (~/.mcp-auth), and
# never handles credentials. Non-interactive by design.
#
# Optional live probe: set REFERO_DOCTOR_LIVE=1 to send one unauthenticated
# HTTPS request to the Refero MCP endpoint. Expected result on a healthy
# unauthenticated environment is HTTP 401 (the endpoint requires auth). The
# probe proves reachability only; it cannot complete OAuth and it never will.

set -euo pipefail

ok()   { printf 'OK    %s\n' "$*"; }
info() { printf 'INFO  %s\n' "$*"; }
warn() { printf 'WARN  %s\n' "$*"; }
err()  { printf 'ERR   %s\n' "$*"; }
log()  { printf '%s\n' "$*"; }

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$HERE/../../../../.." && pwd)"
UTCP="$REPO_ROOT/.utcp_config.json"
ENDPOINT="https://api.refero.design/mcp"

log "== mcp-refero doctor (read-only) =="

# Runtime: node + npx (mcp-remote is launched by Code Mode via npx)
log "-- Runtime --"
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1)"
  if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
    ok "Node $(node -v)"
  else
    warn "Node $(node -v 2>/dev/null || echo none) (<18; the npx bridge needs 18+)"
  fi
  # Code Mode's isolated-vm currently has no Node 25 build; calls SIGSEGV there.
  if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 25 ] 2>/dev/null; then
    warn "Node ${NODE_MAJOR} detected: Code Mode call_tool_chain is known to crash on Node 25; run Code Mode on Node 24"
  fi
else
  err "Node not found (the npx mcp-remote bridge cannot run)"
fi
command -v npx >/dev/null 2>&1 && ok "npx present" || err "npx not found"

# Manual presence (read-only grep; this script NEVER edits the config)
log "-- Code Mode 'refero' manual --"
if [ -f "$UTCP" ]; then
  if grep -q '"name": "refero"' "$UTCP" 2>/dev/null; then
    ok "'refero' manual registered in .utcp_config.json (verify only; do not re-add)"
  else
    warn "No 'refero' manual found in .utcp_config.json (registration is an operator decision)"
  fi
  if grep -q 'mcp-remote' "$UTCP" 2>/dev/null && grep -q 'api.refero.design/mcp' "$UTCP" 2>/dev/null; then
    ok "Bridge shape present: npx mcp-remote -> $ENDPOINT"
  else
    info "Expected bridge shape (npx mcp-remote -> $ENDPOINT) not fully matched; inspect the manual manually"
  fi
else
  warn ".utcp_config.json not found at repo root ($UTCP)"
fi

# Auth expectations (report only; auth state is operator-owned)
log "-- Authentication (report only) --"
info "Live MCP access requires a Refero Pro (or higher) plan; the Free plan has NO MCP access"
info "First use triggers browser OAuth (operator-only); auth state lives under ~/.mcp-auth and is never touched here"
info "Unauthenticated requests return HTTP 401; end-to-end OAuth through the bridge is unverified (Inferred)"

# Optional live endpoint probe, gated behind an env flag
log "-- Live endpoint probe --"
if [ "${REFERO_DOCTOR_LIVE:-0}" = "1" ]; then
  if command -v curl >/dev/null 2>&1; then
    HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$ENDPOINT" 2>/dev/null || echo "000")"
    case "$HTTP_CODE" in
      401) ok "Endpoint reachable: HTTP 401 (auth required, as documented)";;
      000) warn "Endpoint unreachable (network/DNS failure or timeout)";;
      *)   info "Endpoint returned HTTP $HTTP_CODE (expected 401 unauthenticated; inspect manually)";;
    esac
  else
    warn "curl not found; cannot probe the endpoint"
  fi
else
  info "Skipped (set REFERO_DOCTOR_LIVE=1 to send one unauthenticated request; expected HTTP 401)"
fi

# Tool discovery pointer (tool_info runs inside Code Mode, not in a shell)
log "-- Callable confirmation (run inside Code Mode) --"
info "The mandatory tool_info confirmation cannot run from a shell. In Code Mode, run:"
info '  tool_info({ tool_name: "refero.refero_refero_search_styles" })'
info "Callables use the DOUBLED prefix: refero.refero_refero_<tool>(...). Fail closed on drift."

log ""
log "Doctor is read-only. Authentication and any config change are operator-only steps (see INSTALL-GUIDE.md)."
