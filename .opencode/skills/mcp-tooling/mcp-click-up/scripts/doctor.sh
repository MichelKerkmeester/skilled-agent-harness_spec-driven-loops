#!/usr/bin/env bash
# WHY: Read-only diagnostics for the ClickUp skill. It changes nothing and
# installs nothing, and it never prints secrets.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

_c_red=$'\033[31m'; _c_grn=$'\033[32m'; _c_ylw=$'\033[33m'; _c_dim=$'\033[2m'; _c_rst=$'\033[0m'
log()  { printf '%s\n' "$*"; }
info() { printf '%s%s%s\n' "$_c_dim" "$*" "$_c_rst"; }
ok()   { printf '%s✓ %s%s\n' "$_c_grn" "$*" "$_c_rst"; }
warn() { printf '%s! %s%s\n' "$_c_ylw" "$*" "$_c_rst" >&2; }
err()  { printf '%s✗ %s%s\n' "$_c_red" "$*" "$_c_rst" >&2; }

node_major() {
  command -v node >/dev/null 2>&1 || { printf ''; return 0; }
  node -p 'process.versions.node.split(".")[0]' 2>/dev/null || printf ''
}

first_line_or_unknown() {
  local value="$1"
  value="${value%%$'\n'*}"
  [ -n "$value" ] && printf '%s' "$value" || printf 'version unknown'
}

log "== mcp-click-up doctor (read-only) =="

# Platform and runtime
case "$(uname -s)" in Darwin) ok "Platform: macOS";; *) warn "Platform: $(uname -s) (unsupported/unverified)";; esac
if command -v node >/dev/null 2>&1; then
  nm="$(node_major)"
  nv="$(node -v 2>/dev/null || printf 'unknown')"
  if [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null; then ok "Node $nv"; else warn "Node $nv (<18)"; fi
else warn "Node not found"; fi
command -v npm >/dev/null 2>&1 && ok "npm $(npm -v)" || warn "npm not found"

# Embedded CLI
log "-- cupt CLI --"
info "CLI package: cupt"
if command -v cupt >/dev/null 2>&1; then
  cupt_version="$(cupt --version 2>/dev/null || true)"
  ok "cupt: $(command -v cupt) ($(first_line_or_unknown "$cupt_version"))"
else
  warn "cupt: not on PATH"
fi

# Python package installer path
log "-- Python package installer --"
if command -v pipx >/dev/null 2>&1; then
  pipx_version="$(pipx --version 2>/dev/null || true)"
  ok "pipx $(first_line_or_unknown "$pipx_version")"
else
  info "pipx not found (recommended install path)"
fi

if command -v python3 >/dev/null 2>&1; then
  pip_version="$(python3 -m pip --version 2>/dev/null || true)"
  if [ -n "$pip_version" ]; then ok "pip via python3: $(first_line_or_unknown "$pip_version")"; else info "pip via python3: not available"; fi
elif command -v pip3 >/dev/null 2>&1; then
  pip_version="$(pip3 --version 2>/dev/null || true)"
  ok "pip3 $(first_line_or_unknown "$pip_version")"
elif command -v pip >/dev/null 2>&1; then
  pip_version="$(pip --version 2>/dev/null || true)"
  ok "pip $(first_line_or_unknown "$pip_version")"
else
  warn "pip not found"
fi

# Optional MCP via Code Mode
log "-- Optional ClickUp MCP via Code Mode --"
UTCP="$HERE/../../../../../.utcp_config.json"
if [ -f "$UTCP" ]; then
  if grep -qi 'mcp.clickup.com' "$UTCP" 2>/dev/null; then
    ok "Code Mode ClickUp manual registered in .utcp_config.json (official server, mcp-remote bridge)"
  elif grep -qi '"clickup' "$UTCP" 2>/dev/null; then
    warn "A ClickUp manual is registered in .utcp_config.json but does not point at mcp.clickup.com, it may be a stale community server"
  else
    info "No ClickUp manual in .utcp_config.json"
  fi
else
  info ".utcp_config.json not found at expected repo root"
fi
info "MCP server: https://mcp.clickup.com/mcp (official, OAuth 2.1 + PKCE)"

# Auth is OAuth-based for the official server, no env var to check
log "-- ClickUp MCP auth --"
info "Auth is OAuth 2.1 + PKCE via the browser, no env var to check. First connection opens a browser to authorize."

log ""
log "Doctor is read-only. For setup and authentication, run install.sh or read INSTALL_GUIDE.md."
exit 0
