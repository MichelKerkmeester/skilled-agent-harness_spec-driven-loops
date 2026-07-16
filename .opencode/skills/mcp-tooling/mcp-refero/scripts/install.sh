#!/usr/bin/env bash
# WHY: mcp-refero has nothing to install — the 'refero' manual is already
# registered in .utcp_config.json and is validated as-is, and Code Mode owns
# launching the npx mcp-remote bridge. This script therefore VERIFIES posture
# only: runtime prerequisites, manual presence (read-only grep), and the
# operator-only boundaries. It changes nothing, never edits the config, never
# touches auth state (~/.mcp-auth), and never handles credentials.

set -euo pipefail

ok()   { printf 'OK    %s\n' "$*"; }
info() { printf 'INFO  %s\n' "$*"; }
warn() { printf 'WARN  %s\n' "$*"; }
err()  { printf 'ERR   %s\n' "$*"; }
log()  { printf '%s\n' "$*"; }

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$HERE/../../../../.." && pwd)"
UTCP="$REPO_ROOT/.utcp_config.json"

FAILURES=0

log "== mcp-refero install (verify-only; nothing is installed or modified) =="

# Runtime prerequisites: the npx mcp-remote bridge needs Node 18+.
log "-- Runtime prerequisites --"
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1)"
  if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
    ok "Node $(node -v) (>=18 required by the npx mcp-remote bridge)"
  else
    err "Node $(node -v 2>/dev/null || echo none) is below 18; the bridge cannot run"
    FAILURES=$((FAILURES + 1))
  fi
  # isolated-vm has no Node 25 build, so Code Mode's call_tool_chain SIGSEGVs
  # under Node 25 — a local runtime fact, not a Refero server property.
  if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 25 ] 2>/dev/null; then
    warn "Node ${NODE_MAJOR} detected: Code Mode call_tool_chain is known to SIGSEGV on Node 25; run Code Mode on Node 24"
  fi
else
  err "Node not found (the npx mcp-remote bridge cannot run)"
  FAILURES=$((FAILURES + 1))
fi
if command -v npx >/dev/null 2>&1; then
  ok "npx present (Code Mode launches the bridge; you never run it yourself)"
else
  err "npx not found"
  FAILURES=$((FAILURES + 1))
fi

# Manual presence: read-only grep. Presence = OK. Registration or repair is
# an operator decision — this script never writes to the config.
log "-- Code Mode 'refero' manual (read-only check) --"
if [ -f "$UTCP" ]; then
  if grep -q '"name": "refero"' "$UTCP" 2>/dev/null; then
    ok "'refero' manual registered in .utcp_config.json (validated as-is; verify only, never edit, never re-add)"
  else
    warn "No 'refero' manual found in .utcp_config.json — registration is an operator decision, not this script's"
  fi
else
  warn ".utcp_config.json not found at repo root ($UTCP)"
fi

# Authentication boundary: everything below is operator-only.
log "-- Authentication (operator-only; reported, never performed) --"
info "Live MCP access needs a Refero Pro (or higher) plan; the Free plan has NO MCP access at all"
info "First use triggers a browser OAuth flow (operator-only); auth state lives under ~/.mcp-auth and is never touched here"
info "Unauthenticated requests return HTTP 401; end-to-end OAuth through the bridge is Inferred, not verified"

log ""
if [ "$FAILURES" -gt 0 ]; then
  err "Posture check found $FAILURES blocking issue(s). Fix the runtime, then re-run."
  exit 1
fi
ok "Posture verified. Next: confirm callables inside Code Mode with tool_info (doubled prefix: refero.refero_refero_<tool>), per SKILL.md."
info "Deeper diagnostics incl. the optional gated endpoint probe: bash scripts/doctor.sh (REFERO_DOCTOR_LIVE=1 for the probe)"
exit 0
