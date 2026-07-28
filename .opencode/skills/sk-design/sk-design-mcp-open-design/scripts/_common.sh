#!/usr/bin/env bash
# Shared helpers for design-mcp-open-design scripts. Source this, do not run directly.
# WHY: the od CLI is not an npm package and not a global binary. It ships
# inside the Open Design desktop app and is run as `node <daemon-cli.mjs>`.
# A bare `od` is the unrelated octal-dump tool.

set -euo pipefail

_c_red=$'\033[31m'; _c_grn=$'\033[32m'; _c_ylw=$'\033[33m'; _c_dim=$'\033[2m'; _c_rst=$'\033[0m'
log()  { printf '%s\n' "$*"; }
info() { printf '%s%s%s\n' "$_c_dim" "$*" "$_c_rst"; }
ok()   { printf '%s✓ %s%s\n' "$_c_grn" "$*" "$_c_rst"; }
warn() { printf '%s! %s%s\n' "$_c_ylw" "$*" "$_c_rst" >&2; }
err()  { printf '%s✗ %s%s\n' "$_c_red" "$*" "$_c_rst" >&2; }

od_app_path() {
  for p in "/Applications/Open Design.app" "$HOME/Applications/Open Design.app"; do
    [ -d "$p" ] && { printf '%s' "$p"; return 0; }
  done
  return 1
}

od_bin() {
  local app
  if app="$(od_app_path)"; then
    local bin="$app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"
    if [ -f "$bin" ]; then
      printf '%s' "$bin"
      return 0
    fi
  fi
  return 1
}

# Node major version echoes an integer or empty.
node_major() {
  command -v node >/dev/null 2>&1 || { printf ''; return 0; }
  node -p 'process.versions.node.split(".")[0]' 2>/dev/null || printf ''
}

OD_SOCKET="/tmp/open-design/ipc/release-stable/daemon.sock"

# The daemon HTTP port is ephemeral and must not be hardcoded.
