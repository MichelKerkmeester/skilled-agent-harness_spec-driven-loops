#!/usr/bin/env bash
# WHY: read-only diagnostics for Chrome DevTools tooling. It changes nothing,
# installs nothing, and never prints secrets.

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

chrome_path() {
  if [ -n "${CHROME_PATH:-}" ] && [ -x "$CHROME_PATH" ]; then
    printf '%s' "$CHROME_PATH"
    return 0
  fi

  for p in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  do
    [ -x "$p" ] && { printf '%s' "$p"; return 0; }
  done

  for c in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
    if command -v "$c" >/dev/null 2>&1; then
      command -v "$c"
      return 0
    fi
  done

  return 1
}

log "== mcp-chrome-devtools doctor (read-only) =="

# Platform and runtime
case "$(uname -s)" in Darwin) ok "Platform: macOS";; *) warn "Platform: $(uname -s) (unsupported/unverified)";; esac
if command -v node >/dev/null 2>&1; then
  nm="$(node_major)"; { [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null && ok "Node $(node -v)"; } || warn "Node $(node -v 2>/dev/null || echo none) (<18)"
else warn "Node not found"; fi
command -v npm >/dev/null 2>&1 && ok "npm $(npm -v)" || warn "npm not found"

# Primary CLI
log "-- bdg CLI --"
if command -v bdg >/dev/null 2>&1; then
  if version="$(bdg --version 2>/dev/null)"; then
    ok "bdg: $(command -v bdg) ($version)"
  else
    ok "bdg: $(command -v bdg) (version unavailable)"
  fi
elif command -v npx >/dev/null 2>&1; then
  if timeout 5 npx --no-install --prefer-offline browser-debugger-cli@alpha --version >/dev/null 2>&1; then
    ok "browser-debugger-cli@alpha: resolvable via npx --no-install"
  else
    warn "bdg not on PATH and browser-debugger-cli@alpha not resolvable via npx --no-install"
  fi
else
  warn "bdg not on PATH and npx not found"
fi

# Browser runtime
log "-- Chrome/Chromium browser --"
if p="$(chrome_path)"; then
  ok "Chrome/Chromium/Edge: $p"
else
  warn "Chrome/Chromium/Edge not found at common paths or PATH"
fi

# Optional MCP via Code Mode
log "-- Optional Chrome DevTools MCP via Code Mode --"
UTCP="$HERE/../../../../.utcp_config.json"
if [ -f "$UTCP" ]; then
  if grep -q '"name"[[:space:]]*:[[:space:]]*"chrome_devtools' "$UTCP" 2>/dev/null; then
    ok "Code Mode chrome_devtools manual registered in .utcp_config.json"
  else
    info "No chrome_devtools manual in .utcp_config.json"
  fi
else
  info ".utcp_config.json not found at expected repo root, optional MCP is opt-in"
fi

log ""
log "Doctor is read-only. For setup, see install.sh and INSTALL_GUIDE.md."

exit 0
