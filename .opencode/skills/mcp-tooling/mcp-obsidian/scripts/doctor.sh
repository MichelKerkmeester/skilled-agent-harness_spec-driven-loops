#!/usr/bin/env bash
# WHY: Read-only diagnostics for the Obsidian skill. It changes nothing and
# installs nothing, and it never prints secrets — only whether keys are set.

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

log "== mcp-obsidian doctor (read-only) =="

# Platform and runtime
case "$(uname -s)" in Darwin) ok "Platform: macOS";; *) warn "Platform: $(uname -s) (unsupported/unverified)";; esac
if command -v node >/dev/null 2>&1; then
  nm="$(node_major)"
  nv="$(node -v 2>/dev/null || printf 'unknown')"
  if [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null; then ok "Node $nv (needed by the MCP server via npx)"; else warn "Node $nv (<18) — the MCP server needs Node 18+"; fi
else warn "Node not found — required by the Obsidian MCP server (npx). The CLI does not need it."; fi
command -v npm >/dev/null 2>&1 && ok "npm $(npm -v)" || warn "npm not found"
command -v npx >/dev/null 2>&1 && ok "npx present (launches obsidian-mcp-server)" || warn "npx not found — cannot launch the MCP server"

# Headless CLI: notesmd-cli
log "-- notesmd-cli (headless, filesystem) --"
info "CLI package: notesmd-cli (Yakitrak)"
if command -v notesmd-cli >/dev/null 2>&1; then
  cli_version="$(notesmd-cli --version 2>/dev/null || true)"
  ok "notesmd-cli: $(command -v notesmd-cli) ($(first_line_or_unknown "$cli_version"))"
else
  warn "notesmd-cli: not on PATH (run scripts/install.sh)"
fi

# App-backed CLI: official obsidian
log "-- obsidian CLI (app-backed, official) --"
if command -v obsidian >/dev/null 2>&1; then
  ok "obsidian: $(command -v obsidian) (enabled in-app; remote-controls a running app)"
else
  info "obsidian CLI not on PATH — enable it in Settings → General → Command line interface → Register CLI (Obsidian v1.12.4+)"
fi

# Optional MCP via Code Mode
log "-- Optional Obsidian MCP via Code Mode --"
UTCP="$HERE/../../../../../.utcp_config.json"
if [ -f "$UTCP" ]; then
  if grep -qi 'obsidian-mcp-server' "$UTCP" 2>/dev/null; then
    ok "Code Mode Obsidian manual registered in .utcp_config.json (obsidian-mcp-server via npx)"
  elif grep -qi '"obsidian' "$UTCP" 2>/dev/null; then
    warn "An obsidian manual is registered in .utcp_config.json but does not point at obsidian-mcp-server — it may be a different/stale server"
  else
    info "No obsidian manual in .utcp_config.json (registered by a later phase)"
  fi
else
  info ".utcp_config.json not found at expected repo root"
fi
info "MCP server: obsidian-mcp-server (cyanheads v3.2.9), stdio via npx"

# Local REST API reachability + auth env (never print the secret)
log "-- Obsidian Local REST API + auth --"
base_url="${OBSIDIAN_BASE_URL:-${obsidian_OBSIDIAN_BASE_URL:-http://127.0.0.1:27123}}"
info "Base URL: $base_url"
if command -v curl >/dev/null 2>&1; then
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$base_url/" 2>/dev/null || true)"
  [ -n "$code" ] || code="000"
  if [ "$code" != "000" ]; then
    ok "Local REST API reachable at $base_url (HTTP $code)"
  else
    warn "Local REST API not reachable at $base_url — is Obsidian running with the Local REST API plugin (v4.0.0+) enabled?"
  fi
else
  info "curl not found — cannot probe Local REST API reachability"
fi

if [ -n "${OBSIDIAN_API_KEY:-${obsidian_OBSIDIAN_API_KEY:-}}" ]; then
  ok "OBSIDIAN_API_KEY is set (value hidden)"
else
  warn "OBSIDIAN_API_KEY not set — required by the MCP server (see .env.example / obsidian_OBSIDIAN_API_KEY)"
fi

log ""
log "Doctor is read-only. For setup and authentication, run install.sh or read ../INSTALL-GUIDE.md."
exit 0
