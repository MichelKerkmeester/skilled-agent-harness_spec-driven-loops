#!/usr/bin/env bash
# WHY: Read-only diagnostics for the Notion MCP mode. It changes nothing and
# installs nothing, and it never prints secrets. Notion is MCP-only (no CLI),
# so it checks the Node/npx runtime, whether the "notion" manual is registered
# in .utcp_config.json, and whether the notion_NOTION_TOKEN env key is set.

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

log "== mcp-notion doctor (read-only) =="

# Platform and runtime
case "$(uname -s)" in Darwin) ok "Platform: macOS";; *) warn "Platform: $(uname -s) (unsupported/unverified)";; esac
if command -v node >/dev/null 2>&1; then
  nm="$(node_major)"
  nv="$(node -v 2>/dev/null || printf 'unknown')"
  if [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null; then ok "Node $nv"; else warn "Node $nv (<18)"; fi
else warn "Node not found (required — the Notion MCP server runs via npx)"; fi
command -v npx >/dev/null 2>&1 && ok "npx $(npx --version 2>/dev/null || echo present)" || warn "npx not found (ships with Node/npm)"

# Notion is MCP-only — no CLI to check
log "-- CLI --"
info "None. Notion is MCP-only; all operations run through Code Mode."

# Notion MCP manual via Code Mode
log "-- Notion MCP via Code Mode --"
UTCP="$HERE/../../../../../.utcp_config.json"
if [ -f "$UTCP" ]; then
  if grep -qi 'notion-mcp-server' "$UTCP" 2>/dev/null; then
    ok "Code Mode Notion manual registered in .utcp_config.json (official @notionhq/notion-mcp-server, local stdio)"
  elif grep -qi '"name": *"notion"' "$UTCP" 2>/dev/null; then
    warn "A notion manual is registered in .utcp_config.json but does not reference @notionhq/notion-mcp-server — it may be a different or stale server"
  else
    info "No notion manual in .utcp_config.json"
  fi
else
  info ".utcp_config.json not found at expected repo root"
fi
info "MCP server: @notionhq/notion-mcp-server (local stdio) — remote alt: https://mcp.notion.com/mcp (OAuth, interactive-only)"

# Auth env key — presence only, never the value
log "-- Notion MCP auth --"
if [ -n "${notion_NOTION_TOKEN:-}" ]; then
  ok "notion_NOTION_TOKEN is set (value hidden)"
elif [ -n "${NOTION_TOKEN:-}" ]; then
  warn "NOTION_TOKEN is set but the Code Mode env key notion_NOTION_TOKEN is not — set notion_NOTION_TOKEN so the manual resolves"
else
  info "notion_NOTION_TOKEN is not set. Export it before use: export notion_NOTION_TOKEN=\"ntn_...\""
fi

log ""
log "Doctor is read-only. For setup and authentication, run install.sh or read the INSTALL-GUIDE."
exit 0
