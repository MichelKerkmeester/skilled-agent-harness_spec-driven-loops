#!/usr/bin/env bash
# mcp-figma installer: install + verify ONLY. Never connects, never patches Figma.
# Canonical package = figma-ds-cli (silships). NEVER `npm i -g figma-cli` (that is
# unic/figma-cli, an unrelated tool that installs a bin named "figma").

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

SOURCE="auto"           # auto | npm | repo
REPO_URL="https://github.com/silships/figma-cli.git"
INSTALL_ROOT="$HOME/.figma-ds-cli/source"
FORCE=0; SKIP_VERIFY=0; VERBOSE=0

usage() {
  cat <<EOF
mcp-figma install.sh: install + verify the silships figma-cli (as figma-ds-cli).

Usage: install.sh [options]
  --source auto|npm|repo   Install source (default: auto = try npm, fall back to repo)
  --repo-url <url>         Git URL for repo install (default: $REPO_URL)
  --install-root <path>    Clone location for repo install (default: $INSTALL_ROOT)
  --force                  Reinstall even if a working binary is present
  --skip-verify            Skip post-install verification
  --verbose                Verbose npm/git output
  --help                   This help

This script NEVER runs connect, NEVER patches Figma, and NEVER installs the
unrelated npm package named figma-cli. It installs figma-ds-cli (npm) or builds
from the silships repo (which also exposes a figma-cli command).
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --source) SOURCE="${2:?}"; shift 2;;
    --repo-url) REPO_URL="${2:?}"; shift 2;;
    --install-root) INSTALL_ROOT="${2:?}"; shift 2;;
    --force) FORCE=1; shift;;
    --skip-verify) SKIP_VERIFY=1; shift;;
    --verbose) VERBOSE=1; shift;;
    --help|-h) usage; exit 0;;
    *) err "Unknown option: $1"; usage; exit 2;;
  esac
done

npm_q() { [ "$VERBOSE" = 1 ] && npm "$@" || npm "$@" >/dev/null 2>&1; }

# Full documented surface (safe connect, daemon, extract, most commands) needs >= this.
MIN_FULL_VERSION="1.2.0"
installed_version() { local b; b="$(figma_bin)" 2>/dev/null || { printf ''; return 0; }; "$b" --version 2>/dev/null | head -1 | tr -d '[:space:]'; }
# version_lt A B -> true (0) when A < B
version_lt() { [ "$1" = "$2" ] && return 1; [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | head -1)" = "$1" ]; }

check_prerequisites() {
  log "== Prerequisites =="
  case "$(uname -s)" in
    Darwin) ok "macOS (supported baseline)";;
    *) warn "$(uname -s) is unsupported/unverified for figma-cli; macOS is the baseline";;
  esac
  command -v node >/dev/null 2>&1 || { err "Node.js not found; install Node >=18"; exit 1; }
  local nm; nm="$(node_major)"
  if [ -n "$nm" ] && [ "$nm" -ge 18 ] 2>/dev/null; then ok "Node $(node -v) (>=18)"; else err "Node >=18 required (found $(node -v 2>/dev/null||echo none))"; exit 1; fi
  command -v npm >/dev/null 2>&1 || { err "npm not found"; exit 1; }
  ok "npm $(npm -v)"
  if [ "$SOURCE" = "repo" ]; then command -v git >/dev/null 2>&1 || { err "git required for --source repo"; exit 1; }; fi
}

detect_figma_desktop() {
  log "== Figma Desktop (not installed by this script) =="
  if p="$(figma_desktop_path)"; then ok "Figma Desktop found: $p"; else warn "Figma Desktop not found, required at connect time, not for install"; fi
}

check_existing() {
  local b; if b="$(figma_bin)"; then
    ok "Existing binary: $b ($("$b" --version 2>/dev/null | head -1 || echo '?'))"
    return 0
  fi
  info "No silships figma binary on PATH yet."
  return 1
}

install_npm() {
  log "== npm install (figma-ds-cli) =="
  info "Running: npm install -g figma-ds-cli"
  npm_q install -g figma-ds-cli
}

install_repo() {
  log "== repo install (silships/figma-cli) =="
  mkdir -p "$(dirname "$INSTALL_ROOT")"
  if [ -d "$INSTALL_ROOT/.git" ]; then
    info "Updating existing checkout: $INSTALL_ROOT"
    if [ -n "${VERBOSE:-}" ]; then
      git -C "$INSTALL_ROOT" pull --ff-only || warn "git pull failed; using existing checkout"
    else
      git -C "$INSTALL_ROOT" pull --ff-only >/dev/null 2>&1 || warn "git pull failed; using existing checkout"
    fi
  else
    info "Cloning $REPO_URL -> $INSTALL_ROOT (outside this repo; not vendored)"
    git clone --depth 1 "$REPO_URL" "$INSTALL_ROOT" >/dev/null 2>&1 || { err "git clone of $REPO_URL failed (check network/access); cannot build the full figma-ds-cli surface."; exit 1; }
  fi
  ( cd "$INSTALL_ROOT" && npm_q install && npm_q install -g . ) || { err "npm build/install of the silships repo in $INSTALL_ROOT failed; re-run with --verbose to see the error."; exit 1; }
}

verify_install() {
  [ "$SKIP_VERIFY" = 1 ] && { warn "Skipping verification (--skip-verify)"; return 0; }
  log "== Verify =="
  local b; if ! b="$(figma_bin)"; then
    err "No figma-ds-cli / figma-cli on PATH after install."
    err "Check: npm config get prefix ; ensure its bin dir is on PATH."
    err "Do NOT 'npm i -g figma-cli' (that installs the unrelated unic/figma-cli, bin 'figma')."
    exit 1
  fi
  ok "Binary: $b"
  "$b" --version 2>/dev/null | head -1 || warn "--version produced no output"
  "$b" --help >/dev/null 2>&1 && ok "--help OK" || warn "--help failed"
  if [ "$b" = "figma-ds-cli" ]; then ok "Canonical binary present"; else warn "Using 'figma-cli' (silships repo build); 'figma-ds-cli' is the canonical name"; fi
  local v; v="$(installed_version)"
  if [ -n "$v" ] && version_lt "$v" "$MIN_FULL_VERSION"; then
    warn "Version $v is STALE/minimal: the documented skill surface (safe connect, daemon, extract, most commands) needs >=$MIN_FULL_VERSION."
    warn "Run: install.sh --source repo   (builds $MIN_FULL_VERSION from silships/figma-cli)"
  else
    ok "Version $v (full surface)"
  fi
}

report_next_steps() {
  log ""
  log "== Next steps (manual, gated) =="
  log "  1) Open Figma Desktop with a file."
  log "  2) Connect (SAFE, no patch):  $HERE/connect-safe.sh"
  log "     or via CLI:                $(figma_bin 2>/dev/null || echo figma-ds-cli) connect --safe"
  log "  3) Check daemon:              $HERE/daemon.sh status"
  log "  Yolo (patches Figma, gated):  $HERE/connect-yolo.sh --i-understand-this-patches-figma"
  log "  Diagnostics (read-only):      $HERE/doctor.sh"
}

main() {
  check_prerequisites
  detect_figma_desktop
  if check_existing && [ "$FORCE" = 0 ]; then
    ok "figma-cli already installed; nothing to do (use --force to reinstall)."
    verify_install; report_next_steps; exit 0
  fi
  case "$SOURCE" in
    npm)  install_npm;;
    repo) install_repo;;
    auto)
      install_npm || true
      if ! figma_bin >/dev/null 2>&1; then
        warn "npm install did not yield a usable binary; trying repo install"
        install_repo
      else
        v="$(installed_version)"
        if [ -n "$v" ] && version_lt "$v" "$MIN_FULL_VERSION"; then
          warn "npm figma-ds-cli is $v, stale/minimal (lacks safe connect, daemon, and most commands)."
          warn "Upgrading from the silships repo for the full $MIN_FULL_VERSION surface."
          install_repo
        fi
      fi
      ;;
    *) err "Invalid --source: $SOURCE"; exit 2;;
  esac
  verify_install
  report_next_steps
}
main
