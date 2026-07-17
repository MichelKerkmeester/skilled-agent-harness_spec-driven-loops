#!/usr/bin/env bash
# WHY: read-only diagnostics for the Aside CLI and MCP surfaces. It changes
# nothing, installs nothing, never runs `aside --update`, and never prints
# secrets. The MCP probe speaks a minimal JSON-RPC handshake over stdio and
# then closes the process — the only supported lifecycle control.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

_c_red=$'\033[31m'; _c_grn=$'\033[32m'; _c_ylw=$'\033[33m'; _c_dim=$'\033[2m'; _c_rst=$'\033[0m'
log()  { printf '%s\n' "$*"; }
info() { printf '%s%s%s\n' "$_c_dim" "$*" "$_c_rst"; }
ok()   { printf '%s✓ %s%s\n' "$_c_grn" "$*" "$_c_rst"; }
warn() { printf '%s! %s%s\n' "$_c_ylw" "$*" "$_c_rst" >&2; }
err()  { printf '%s✗ %s%s\n' "$_c_red" "$*" "$_c_rst" >&2; }

log "== mcp-aside-devtools doctor (read-only) =="

# Platform: the official installer supports macOS arm64/x64 only.
case "$(uname -s)" in
  Darwin) ok "Platform: macOS $(uname -m)" ;;
  *)      warn "Platform: $(uname -s) (unsupported — Aside installer is macOS-only)" ;;
esac

# Primary CLI
log "-- aside CLI --"
if command -v aside >/dev/null 2>&1; then
  if version="$(aside --version 2>/dev/null)"; then
    ok "aside: $(command -v aside) ($version)"
  else
    warn "aside: $(command -v aside) (version unavailable)"
  fi
else
  warn "aside not on PATH"
  [ -x "$HOME/.local/bin/aside" ] && info "Found ~/.local/bin/aside — add ~/.local/bin to PATH"
  info "Install (operator-invoked): curl -fsSL https://releases.aside.com/install.sh | bash"
  log ""
  log "Doctor is read-only. For setup, see install.sh and install-guide.md."
  exit 0
fi

# Account state (read-only). Built-in models fail closed when signed out;
# BYO API-key providers keep working.
log "-- Account state --"
if account_out="$(aside account status 2>&1)"; then
  ok "aside account status succeeded"
  printf '%s\n' "$account_out" | head -10
else
  warn "aside account status failed — possibly signed out (built-in models fail closed)"
  printf '%s\n' "$account_out" | head -5 >&2
fi

# MCP handshake probe: spawn `aside mcp`, send initialize + tools/list over
# stdio, then close stdin. A watchdog kills the child if it survives EOF, so
# the probe never hangs and never leaves a process behind.
log "-- MCP handshake (stdio probe) --"
probe_out="$(mktemp)"; probe_err="$(mktemp)"
cleanup() { rm -f "$probe_out" "$probe_err"; }
trap cleanup EXIT

REQ_INIT='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"mcp-aside-devtools-doctor","version":"1.0.0"}}}'
REQ_NOTE='{"jsonrpc":"2.0","method":"notifications/initialized"}'
REQ_LIST='{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

(
  { printf '%s\n' "$REQ_INIT"; sleep 1; printf '%s\n' "$REQ_NOTE" "$REQ_LIST"; sleep 3; } \
    | aside mcp >"$probe_out" 2>"$probe_err"
) &
probe_pid=$!
waited=0
while kill -0 "$probe_pid" 2>/dev/null && [ "$waited" -lt 30 ]; do
  sleep 0.5
  waited=$((waited + 1))
done
kill "$probe_pid" 2>/dev/null || true
wait "$probe_pid" 2>/dev/null || true

if grep -q '"protocolVersion"' "$probe_out" 2>/dev/null; then
  proto="$(grep -o '"protocolVersion"[^,}]*' "$probe_out" | head -1)"
  ok "MCP initialize responded (${proto:-protocol version present})"
else
  # A transport-dead child and an unavailable Aside daemon/browser are
  # different failures; stderr is the only way to tell them apart.
  warn "No initialize response from 'aside mcp'"
  if [ -s "$probe_err" ]; then
    info "stderr (first lines — distinguish dead child vs unavailable daemon/browser):"
    head -5 "$probe_err" >&2
  fi
fi

if grep -q '"tools"' "$probe_out" 2>/dev/null; then
  ok "tools/list responded"
  if grep -q '"name":"repl"' "$probe_out" 2>/dev/null || grep -q '"name": "repl"' "$probe_out" 2>/dev/null; then
    ok "Discovered tool: repl (matches the version-pinned research inventory)"
  else
    warn "Tool inventory differs from the documented single 'repl' tool — version drift; save a fresh fixture"
  fi
  info "Inventory is runtime-discovered (listChanged: true) — never hardcode it."
else
  warn "No tools/list response captured"
fi

# Code Mode registration state. The `aside` manual is registered in
# .utcp_config.json, so its absence now indicates a regression and is an error.
log "-- Code Mode manual (registered) --"
UTCP="$HERE/../../../../../.utcp_config.json"
manual_missing=0
if [ -f "$UTCP" ]; then
  if grep -q '"name"[[:space:]]*:[[:space:]]*"aside"' "$UTCP" 2>/dev/null; then
    ok "Code Mode 'aside' manual registered in .utcp_config.json"
    info "Confirm callables via Code Mode discovery before invoking. 2026-07-16 fixture baseline: registry name aside.aside.repl (dotted); TS callable aside.aside_repl(args). See references/discovery-fixture-2026-07-16.json"
  else
    err "No 'aside' manual in .utcp_config.json — expected registered; registration has regressed"
    info "Restore from the snapshot in assets/utcp-aside-manual.md (operator-invoked; doctor never writes)."
    manual_missing=1
  fi
else
  warn ".utcp_config.json not found at expected repo root — cannot verify the registered 'aside' manual"
fi

log ""
log "Doctor is read-only. For setup, see install.sh and install-guide.md."
exit "$manual_missing"
