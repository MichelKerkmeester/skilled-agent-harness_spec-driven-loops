#!/usr/bin/env bash
# mcp-open-design doctor: REPORT-ONLY diagnostics.
# WHY: this script is read-only. It changes nothing, never prints secrets, never
# starts the daemon, and never wires MCP.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

log "== mcp-open-design doctor (read-only) =="
info "The daemon HTTP port is ephemeral, so this doctor does not probe a fixed port."

log "-- Platform --"
case "$(uname -s)" in
  Darwin) ok "Platform: macOS";;
  *) warn "Platform: $(uname -s) (unsupported or unverified)";;
esac

log "-- Runtime --"
if command -v node >/dev/null 2>&1; then
  nm="$(node_major)"
  if [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null; then
    ok "Node $(node -v) (>=18)"
  else
    warn "Node $(node -v 2>/dev/null || printf 'none') (<18)"
  fi
else
  warn "Node not found"
fi

log "-- Open Design Desktop --"
if app="$(od_app_path)"; then
  ok "Open Design.app found: $app"
else
  warn "Open Design.app not found in /Applications or ~/Applications"
fi

if command -v pgrep >/dev/null 2>&1; then
  if pgrep -f "Open Design" >/dev/null 2>&1; then
    ok "Open Design desktop app: running"
  else
    info "Open Design desktop app: not running"
  fi
else
  info "Open Design desktop app: unknown (pgrep unavailable)"
fi

log "-- od CLI --"
OD_BIN=""
if OD_BIN="$(od_bin)"; then
  ok "Bundled od CLI: $OD_BIN"
  if version_output="$(node "$OD_BIN" --version 2>/dev/null | head -1)" && [ -n "$version_output" ]; then
    ok "node \"$OD_BIN\" --version: $version_output"
  elif node "$OD_BIN" --help >/dev/null 2>&1; then
    warn "--version produced no output. --help OK."
  else
    warn "Unable to verify the bundled od CLI with --version or --help"
  fi
else
  warn "Bundled od CLI not found"
  info "Expected: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"
  info "Or: $HOME/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"
fi

log "-- Daemon Socket --"
if [ -S "$OD_SOCKET" ]; then
  ok "Daemon socket present: $OD_SOCKET"
elif [ -e "$OD_SOCKET" ]; then
  warn "Daemon socket path exists but is not a socket: $OD_SOCKET"
else
  info "Daemon socket not present: $OD_SOCKET"
fi

log "-- MCP config presence --"
OPENCODE_CONFIG="$HOME/.config/opencode/opencode.json"
if [ -f "$OPENCODE_CONFIG" ]; then
  if grep -qi 'open-design' "$OPENCODE_CONFIG" 2>/dev/null; then
    ok "opencode config: open-design entry present"
  else
    info "opencode config: open-design entry not found"
  fi
else
  info "opencode config not found at $OPENCODE_CONFIG"
fi

CLAUDE_CONFIG="$HOME/.claude.json"
if [ -f "$CLAUDE_CONFIG" ]; then
  if grep -qi 'open-design' "$CLAUDE_CONFIG" 2>/dev/null; then
    ok "Claude config: open-design entry present"
  else
    info "Claude config: open-design entry not found"
  fi
else
  info "Claude config not found at $CLAUDE_CONFIG"
fi

log ""
log "Doctor is read-only. It changes nothing. See $HERE/install.sh and INSTALL_GUIDE.md. The Open Design app must be open for live tool calls."
exit 0
