#!/usr/bin/env bash
# mcp-figma doctor: REPORT-ONLY diagnostics. Changes nothing, installs nothing,
# never exposes the daemon token, never connects or patches.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

log "== mcp-figma doctor (read-only) =="

# Platform / runtime
case "$(uname -s)" in Darwin) ok "Platform: macOS";; *) warn "Platform: $(uname -s) (unsupported/unverified)";; esac
if command -v node >/dev/null 2>&1; then
  nm="$(node_major)"; { [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null && ok "Node $(node -v)"; } || warn "Node $(node -v 2>/dev/null||echo none) (<18)"
else warn "Node not found"; fi
command -v npm >/dev/null 2>&1 && ok "npm $(npm -v)" || warn "npm not found"

# Binary identity (the collision check)
log "-- figma binary --"
if command -v figma-ds-cli >/dev/null 2>&1; then ok "figma-ds-cli: $(command -v figma-ds-cli) ($(figma-ds-cli --version 2>/dev/null|head -1||echo '?'))"; else info "figma-ds-cli: not on PATH"; fi
if command -v figma-cli >/dev/null 2>&1; then ok "figma-cli: $(command -v figma-cli) (silships repo build, if from upstream)"; else info "figma-cli: not on PATH (expected unless installed from the silships repo)"; fi
if command -v figma >/dev/null 2>&1; then warn "a 'figma' command is on PATH — this is likely the UNRELATED unic/figma-cli, NOT the silships tool"; fi
if b="$(figma_bin)"; then ok "Resolved skill binary: $b"; else err "No silships figma binary resolved — run install.sh (do NOT 'npm i -g figma-cli')"; fi

# Figma Desktop
log "-- Figma Desktop --"
if p="$(figma_desktop_path)"; then ok "Found: $p"; else warn "Not found in /Applications or ~/Applications"; fi

# Daemon
log "-- Daemon --"
if [ -f "$DAEMON_TOKEN_FILE" ]; then ok "Token file present: $DAEMON_TOKEN_FILE (contents NOT shown)"; else info "No token file ($DAEMON_TOKEN_FILE) — daemon not initialized yet"; fi
if [ -f "$DAEMON_PID_FILE" ]; then info "PID file: $DAEMON_PID_FILE ($(cat "$DAEMON_PID_FILE" 2>/dev/null||echo '?'))"; else info "No PID file ($DAEMON_PID_FILE)"; fi
case "$(port_listening "$DAEMON_PORT"; echo $?)" in
  0) ok "Daemon port $DAEMON_PORT: LISTENING";;
  1) info "Daemon port $DAEMON_PORT: not listening";;
  *) info "Daemon port $DAEMON_PORT: unknown (lsof unavailable)";;
esac
case "$(port_listening "$CDP_PORT"; echo $?)" in
  0) info "CDP port $CDP_PORT: LISTENING (yolo/remote-debugging active or another CDP client)";;
  1) info "CDP port $CDP_PORT: not listening";;
  *) info "CDP port $CDP_PORT: unknown";;
esac

# Optional MCP (Code Mode, Framelink figma manual)
log "-- Optional Figma MCP via Code Mode (Framelink) --"
UTCP="$HERE/../../../../.utcp_config.json"
if [ -f "$UTCP" ]; then
  if grep -q '"figma"' "$UTCP" 2>/dev/null; then ok "Code Mode 'figma' manual registered in .utcp_config.json"; else info "No 'figma' manual in .utcp_config.json"; fi
else info ".utcp_config.json not found at expected repo root (optional MCP is opt-in)"; fi
info "Token must be in .env as: figma_FIGMA_API_KEY=figd_... (Code Mode prefixes the manual name)"

log ""
log "Doctor is read-only. To connect: connect-safe.sh (safe) or connect-yolo.sh (gated patch)."
