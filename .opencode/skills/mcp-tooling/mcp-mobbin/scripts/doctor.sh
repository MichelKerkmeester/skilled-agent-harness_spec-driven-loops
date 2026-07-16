#!/usr/bin/env bash
# mcp-mobbin doctor: REPORT-ONLY diagnostics. Changes nothing, installs nothing,
# never edits .utcp_config.json, never touches auth state (~/.mcp-auth), and
# never handles credentials. Non-interactive by design.
#
# Registered-state expectation: the 'mobbin' manual IS registered in
# .utcp_config.json (stdio npx mcp-remote bridge, empty env). Its presence is
# the healthy result; ABSENCE now indicates a broken or reverted registration
# and is reported as an ERROR.
#
# Optional live probe: set MOBBIN_DOCTOR_LIVE=1 to send one unauthenticated
# HTTPS request to the Mobbin MCP endpoint. Expected result on a healthy
# unauthenticated environment is HTTP 401 (the endpoint requires browser OAuth;
# no API key exists). The probe proves reachability only; it cannot complete
# OAuth and it never will.

set -euo pipefail

ok()   { printf 'OK    %s\n' "$*"; }
info() { printf 'INFO  %s\n' "$*"; }
warn() { printf 'WARN  %s\n' "$*"; }
err()  { printf 'ERR   %s\n' "$*"; }
log()  { printf '%s\n' "$*"; }

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$HERE/../../../../.." && pwd)"
UTCP="$REPO_ROOT/.utcp_config.json"
ENDPOINT="https://api.mobbin.com/mcp"

log "== mcp-mobbin doctor (read-only) =="

# Runtime: node + npx (mcp-remote would be launched by Code Mode via npx)
log "-- Runtime --"
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1)"
  if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
    ok "Node $(node -v)"
  else
    warn "Node $(node -v 2>/dev/null || echo none) (<18; the npx mcp-remote bridge needs 18+)"
  fi
else
  err "Node not found (the npx mcp-remote bridge cannot run)"
fi
command -v npx >/dev/null 2>&1 && ok "npx present" || err "npx not found"

# Manual presence (read-only grep; this script NEVER edits the config).
# The manual is registered, so presence is the healthy result and ABSENCE
# is an ERROR (a broken or reverted registration to escalate, never to
# repair from this script).
log "-- Code Mode 'mobbin' manual --"
if [ -f "$UTCP" ]; then
  if grep -q '"name": "mobbin"' "$UTCP" 2>/dev/null; then
    ok "'mobbin' manual registered in .utcp_config.json (verify only; never edited here)"
    if grep -q 'mcp-remote' "$UTCP" 2>/dev/null && grep -q 'api.mobbin.com/mcp' "$UTCP" 2>/dev/null; then
      ok "Bridge shape present: npx mcp-remote -> $ENDPOINT"
    else
      info "Expected bridge shape (npx mcp-remote -> $ENDPOINT) not fully matched; inspect the manual manually"
    fi
  else
    err "'mobbin' manual NOT found in .utcp_config.json — UNEXPECTED: the manual is registered; absence means a broken or reverted registration. Escalate to the operator (reference shape in assets/utcp_mobbin_manual.md); never re-add it from this script"
  fi
else
  warn ".utcp_config.json not found at repo root ($UTCP)"
fi

# Auth expectations (report only; auth state is operator-owned)
log "-- Authentication (report only) --"
info "Mobbin MCP auth is browser OAuth only (DCR, PKCE S256, openid); NO API key or auth env var exists"
info "MCP access requires a paid plan (Pro, Team, or Enterprise); the Free plan has no MCP access"
info "First use triggers browser OAuth (operator-only); auth state lives under ~/.mcp-auth and is never touched here"
info "Unauthenticated requests return HTTP 401; end-to-end OAuth through the bridge is unverified (Inferred)"
info "Rate limit: 60 requests per 60 seconds per user; on 429 honor Retry-After, then backoff with jitter"

# Optional live endpoint probe, gated behind an env flag
log "-- Live endpoint probe --"
if [ "${MOBBIN_DOCTOR_LIVE:-0}" = "1" ]; then
  if command -v curl >/dev/null 2>&1; then
    HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$ENDPOINT" 2>/dev/null || echo "000")"
    case "$HTTP_CODE" in
      401) ok "Endpoint reachable: HTTP 401 (auth required, as documented; not a missing-key error)";;
      000) warn "Endpoint unreachable (network/DNS failure or timeout)";;
      *)   info "Endpoint returned HTTP $HTTP_CODE (expected 401 unauthenticated; inspect manually)";;
    esac
  else
    warn "curl not found; cannot probe the endpoint"
  fi
else
  info "Skipped (set MOBBIN_DOCTOR_LIVE=1 to send one unauthenticated request; expected HTTP 401)"
fi

# Tool discovery pointer (tool_info runs inside Code Mode, not in a shell)
log "-- Callable confirmation (run inside Code Mode) --"
info "The mandatory tool_info confirmation cannot run from a shell. In a fresh Code Mode session (manuals load at startup), run:"
info '  tool_info({ tool_name: "mobbin.mobbin_search_screens" })'
info "That callable form is INFERRED from convention, never observed live. Confirm first; fail closed on drift."
info "Discovery has not yet run against the registered manual; OAuth (operator-only) has not been completed."

log ""
log "Doctor is read-only. Authentication and any config change are operator-only steps (see INSTALL_GUIDE.md)."
