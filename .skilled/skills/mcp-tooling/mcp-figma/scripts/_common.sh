#!/usr/bin/env bash
# Shared helpers for mcp-figma scripts. Source this; do not run directly.
# WHY: every script must resolve the silships binary the same way, because the
# npm package literally named "figma-cli" is an UNRELATED tool (unic/figma-cli,
# which installs a bin named "figma"). The silships tool is "figma-ds-cli".

set -euo pipefail

_c_red=$'\033[31m'; _c_grn=$'\033[32m'; _c_ylw=$'\033[33m'; _c_dim=$'\033[2m'; _c_rst=$'\033[0m'
log()  { printf '%s\n' "$*"; }
info() { printf '%s%s%s\n' "$_c_dim" "$*" "$_c_rst"; }
ok()   { printf '%s✓ %s%s\n' "$_c_grn" "$*" "$_c_rst"; }
warn() { printf '%s! %s%s\n' "$_c_ylw" "$*" "$_c_rst" >&2; }
err()  { printf '%s✗ %s%s\n' "$_c_red" "$*" "$_c_rst" >&2; }

# Resolve the silships figma-cli binary.
# Order: figma-ds-cli (npm canonical, unambiguous) -> figma-cli (silships repo build only).
# A bare "figma" is NOT ours (that is unic/figma-cli) and is never selected.
# figma-cli is only accepted after its own help names it the silships tool, so a
# foreign binary under that name fails closed instead of being driven.
is_silships() {
  "$1" --help 2>/dev/null | grep -q 'Figma design systems'
}

figma_bin() {
  if command -v figma-ds-cli >/dev/null 2>&1; then printf 'figma-ds-cli'; return 0; fi
  if command -v figma-cli >/dev/null 2>&1 && is_silships figma-cli; then printf 'figma-cli'; return 0; fi
  return 1
}

# Node major version (echoes integer or empty).
node_major() {
  command -v node >/dev/null 2>&1 || { printf ''; return 0; }
  node -p 'process.versions.node.split(".")[0]' 2>/dev/null || printf ''
}

# Locate Figma Desktop without launching it.
figma_desktop_path() {
  for p in "/Applications/Figma.app" "$HOME/Applications/Figma.app"; do
    [ -d "$p" ] && { printf '%s' "$p"; return 0; }
  done
  return 1
}

# Is a TCP port listening on localhost? (best-effort, no install)
port_listening() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1 && return 0 || return 1
  fi
  return 2  # unknown
}

DAEMON_TOKEN_FILE="$HOME/.figma-ds-cli/.daemon-token"
# The daemon writes its PID under the figma-cli name, the silships repo's own
# bin name, not the unrelated npm package. doctor.sh checks the PID before trusting it.
DAEMON_PID_FILE="$HOME/.figma-cli-daemon.pid"
DAEMON_PORT=3456
CDP_PORT=9222
