#!/usr/bin/env bash
# design-mcp-open-design installer: install + verify ONLY. Never wires MCP and never
# starts the daemon.
# WHY: unlike normal CLI tooling, there is nothing to npm-install. "install"
# verifies the desktop app and locates its bundled od CLI.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

SKIP_VERIFY=0
VERBOSE=0
OD_APP=""
OD_BIN=""

usage() {
  cat <<EOF
design-mcp-open-design install.sh: verify the Open Design desktop app and bundled od CLI.

Usage: install.sh [options]
  --skip-verify            Skip CLI verification
  --verbose                Show the verification command before running it
  --help                   This help

This script NEVER starts the Open Design daemon, NEVER wires MCP, and NEVER
uses a remote installer. It only checks local readiness and reports next steps.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-verify) SKIP_VERIFY=1; shift;;
    --verbose) VERBOSE=1; shift;;
    --help|-h) usage; exit 0;;
    *) err "Unknown option: $1"; usage; exit 2;;
  esac
done

check_prerequisites() {
  log "== Prerequisites =="
  case "$(uname -s)" in
    Darwin) ok "macOS (supported baseline)";;
    *) warn "$(uname -s) is unsupported or unverified for Open Design. macOS is the baseline";;
  esac

  command -v node >/dev/null 2>&1 || { err "Node.js not found. Install Node >=18."; exit 1; }
  local nm
  nm="$(node_major)"
  if [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null; then
    ok "Node $(node -v) (>=18)"
  else
    err "Node >=18 required (found $(node -v 2>/dev/null || printf 'none'))"
    exit 1
  fi

  if command -v npm >/dev/null 2>&1; then
    info "npm $(npm -v) present. npm is not used by this installer."
  else
    info "npm not found. npm is optional because the od CLI ships inside the app."
  fi
}

detect_app() {
  log "== Open Design Desktop =="
  if OD_APP="$(od_app_path)"; then
    ok "Open Design.app found: $OD_APP"
  else
    warn "Open Design.app not found in /Applications or ~/Applications."
    warn "The app is required at run time because it hosts the daemon and ships the CLI."
    info "See INSTALL_GUIDE.md for the app download."
  fi
}

locate_cli() {
  log "== od CLI =="
  if OD_BIN="$(od_bin)"; then
    ok "Bundled od CLI: $OD_BIN"
    return 0
  fi

  err "Open Design od CLI not found."
  err "Expected: /Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"
  err "Or: $HOME/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"
  err "Install or open the Open Design desktop app, then rerun this script."
  return 1
}

verify_cli() {
  [ "$SKIP_VERIFY" = 1 ] && { warn "Skipping CLI verification (--skip-verify)"; return 0; }
  [ -n "${OD_BIN:-}" ] || return 1

  log "== Verify =="
  if [ "$VERBOSE" = 1 ]; then
    info "Running: node \"$OD_BIN\" --version"
  fi

  local version_output
  if version_output="$(node "$OD_BIN" --version 2>/dev/null | head -1)" && [ -n "$version_output" ]; then
    ok "node \"$OD_BIN\" --version: $version_output"
    return 0
  fi

  warn "--version produced no output. Trying --help."
  if [ "$VERBOSE" = 1 ]; then
    info "Running: node \"$OD_BIN\" --help"
  fi
  node "$OD_BIN" --help >/dev/null 2>&1 && { ok "node \"$OD_BIN\" --help OK"; return 0; }

  err "Unable to verify the bundled od CLI with --version or --help."
  return 1
}

report_next_steps() {
  local cli
  cli="${OD_BIN:-/Applications/Open Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs}"

  log ""
  log "== Next steps (manual, gated) =="
  log "  1) Open the Open Design desktop app."
  log "  2) MCP wiring: this repo already wires Open Design via Code Mode"
  log "     (.utcp_config.json's open_design manual). The native form below"
  log "     is only for a different repo/environment that doesn't use Code Mode:"
  log "     node \"$cli\" mcp install opencode --print --json"
  log "     Review the printed command and environment before wiring."
  log "  3) Run diagnostics: $HERE/doctor.sh"
  log ""
  log "install.sh wires nothing. MCP wiring is a separate gated step."
}

main() {
  check_prerequisites
  detect_app
  locate_cli || true
  verify_cli || true
  report_next_steps
}
main
