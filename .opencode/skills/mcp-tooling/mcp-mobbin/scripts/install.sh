#!/usr/bin/env bash
# mcp-mobbin install: VERIFY-ONLY posture check. There is nothing to install:
# the provider is a hosted remote service and the 'mobbin' Code Mode manual is
# already registered in .utcp_config.json. This script confirms the runtime
# (Node 18+, npx), confirms the registered manual is present (read-only grep;
# never edited), and points at the operator-only first-use OAuth step (browser
# round-trip; no API key exists and none may be invented).
#
# Non-interactive by design. Exit 0 = posture verified; exit 1 = a required
# element is missing (broken runtime or a broken/reverted registration).

set -euo pipefail

ok()   { printf 'OK    %s\n' "$*"; }
info() { printf 'INFO  %s\n' "$*"; }
err()  { printf 'ERR   %s\n' "$*"; }
log()  { printf '%s\n' "$*"; }

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$HERE/../../../../.." && pwd)"
UTCP="$REPO_ROOT/.utcp_config.json"
ENDPOINT="https://api.mobbin.com/mcp"
FAILURES=0

log "== mcp-mobbin install (verify-only; installs nothing, edits nothing) =="

# Phase 1: runtime (the npx mcp-remote bridge needs Node 18+)
log "-- Phase 1: runtime --"
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1)"
  if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
    ok "Node $(node -v) (>=18)"
  else
    err "Node $(node -v 2>/dev/null || echo none) is below 18; the npx mcp-remote bridge needs 18+"
    FAILURES=$((FAILURES + 1))
  fi
else
  err "Node not found on PATH"
  FAILURES=$((FAILURES + 1))
fi
if command -v npx >/dev/null 2>&1; then
  ok "npx present"
else
  err "npx not found on PATH"
  FAILURES=$((FAILURES + 1))
fi

# Phase 2: the registered manual (presence = OK; read-only grep, never edited)
log "-- Phase 2: registered 'mobbin' manual --"
if [ -f "$UTCP" ]; then
  if grep -q '"name": "mobbin"' "$UTCP" 2>/dev/null; then
    ok "'mobbin' manual present in .utcp_config.json"
    if grep -q 'mcp-remote' "$UTCP" 2>/dev/null && grep -q 'api.mobbin.com/mcp' "$UTCP" 2>/dev/null; then
      ok "Bridge shape present: npx mcp-remote -> $ENDPOINT (empty env; no credential belongs here)"
    else
      err "Manual present but the expected bridge shape (npx mcp-remote -> $ENDPOINT) is not fully matched; escalate to the operator with assets/utcp-mobbin-manual.md as the reference shape"
      FAILURES=$((FAILURES + 1))
    fi
  else
    err "'mobbin' manual NOT found in .utcp_config.json — a broken or reverted registration. Escalate to the operator (reference shape: assets/utcp-mobbin-manual.md); this script never re-adds it"
    FAILURES=$((FAILURES + 1))
  fi
else
  err ".utcp_config.json not found at repo root ($UTCP)"
  FAILURES=$((FAILURES + 1))
fi

# Phase 3: first-use OAuth pointer (operator-only; nothing runs here)
log "-- Phase 3: first-use authentication (operator-only pointer) --"
info "Mobbin MCP auth is a browser OAuth round-trip on first use — operator-only, never automated here"
info "There is NO API key or auth env var for Mobbin MCP; the manual env stays empty and no credential is ever added"
info "Requires a paid plan (Pro, Team, or Enterprise); the Free plan has no MCP access"
info "To authenticate: open a FRESH Code Mode session (manuals load at startup), trigger any first mobbin.* call, and complete the browser authorization; auth state persists under ~/.mcp-auth"
info "Then confirm the callables inside Code Mode: tool_info({ tool_name: \"mobbin.mobbin_search_screens\" }) — confirmed 2026-07-16 (plus search_flows, search_sections; see references/discovery-fixture-2026-07-16.json); re-confirm per session"

log ""
if [ "$FAILURES" -eq 0 ]; then
  ok "Posture verified: runtime ready, manual registered. Remaining steps are operator-only (reconnect + OAuth)"
  exit 0
else
  err "Posture check failed ($FAILURES issue(s) above). Nothing was changed; see install-guide.md"
  exit 1
fi
