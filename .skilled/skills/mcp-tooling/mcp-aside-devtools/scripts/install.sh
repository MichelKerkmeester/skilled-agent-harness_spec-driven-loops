#!/usr/bin/env bash
# WHY: operator-invoked wrapper around the official Aside curl installer.
# It gates on the supported platform, no-ops when a binary already exists,
# and verifies the result. Workflows must never call this implicitly —
# installation is always an explicit operator decision.

set -euo pipefail

INSTALLER_URL="https://releases.aside.com/install.sh"
FORCE_INSTALL="${FORCE_INSTALL:-false}"

_c_red=$'\033[31m'; _c_grn=$'\033[32m'; _c_ylw=$'\033[33m'; _c_dim=$'\033[2m'; _c_rst=$'\033[0m'
log()  { printf '%s\n' "$*"; }
info() { printf '%s%s%s\n' "$_c_dim" "$*" "$_c_rst"; }
ok()   { printf '%s✓ %s%s\n' "$_c_grn" "$*" "$_c_rst"; }
warn() { printf '%s! %s%s\n' "$_c_ylw" "$*" "$_c_rst" >&2; }
err()  { printf '%s✗ %s%s\n' "$_c_red" "$*" "$_c_rst" >&2; }

usage() {
  cat <<'EOF'
Aside CLI install wrapper

USAGE:
    install.sh [--force] [-h|--help]

WHAT THIS SCRIPT DOES:
    1. Gates on macOS (Darwin) arm64/x64 — the official installer rejects
       Linux and Windows, so this wrapper fails fast on those platforms.
    2. No-ops when an `aside` binary is already on PATH (use --force to
       run the installer anyway).
    3. Runs the official installer: curl -fsSL https://releases.aside.com/install.sh | bash
       Honors the installer env overrides ASIDE_CLI_VERSION, ASIDE_CLI_BASE_URL,
       ASIDE_CLI_INSTALL_DIR, ASIDE_CLI_BIN_DIR when set in the environment.
    4. Verifies with `aside --version` and reports sign-in state read-only.

NOTES:
    - Sign-in is not scripted: built-in models require an Aside account
      sign-in completed through the Aside app.
    - This wrapper never runs `aside --update`.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --force)   FORCE_INSTALL="true" ;;
    *) err "Unknown option: $1"; usage; exit 1 ;;
  esac
  shift
done

log "== mcp-aside-devtools installer =="

# Platform gate: the official installer supports macOS arm64/x64 only.
os="$(uname -s)"
arch="$(uname -m)"
if [ "$os" != "Darwin" ]; then
  err "Unsupported platform: $os. The Aside installer supports macOS only."
  exit 1
fi
case "$arch" in
  arm64|aarch64|x86_64) ok "Platform: macOS $arch" ;;
  *) err "Unsupported architecture: $arch (supported: arm64/aarch64, x86_64)"; exit 1 ;;
esac

# Existing-binary check: keep installs idempotent and explicit.
if command -v aside >/dev/null 2>&1 && [ "$FORCE_INSTALL" != "true" ]; then
  version="$(aside --version 2>/dev/null || echo "version unavailable")"
  ok "aside already installed: $(command -v aside) ($version)"
  info "Use --force to run the official installer anyway."
  exit 0
fi

command -v curl >/dev/null 2>&1 || { err "curl not found — required to fetch the installer"; exit 1; }

log "-- Running official installer --"
info "curl -fsSL $INSTALLER_URL | bash"
if curl -fsSL "$INSTALLER_URL" | bash; then
  ok "Installer completed"
else
  err "Installer failed — see output above"
  exit 1
fi

# The installer's default shim location may not be on PATH yet in this shell.
if ! command -v aside >/dev/null 2>&1 && [ -x "$HOME/.local/bin/aside" ]; then
  warn "aside installed at ~/.local/bin/aside but ~/.local/bin is not on PATH"
  info 'Add to your shell profile: export PATH="$HOME/.local/bin:$PATH"'
  PATH="$HOME/.local/bin:$PATH"
fi

log "-- Verification --"
if command -v aside >/dev/null 2>&1; then
  if version="$(aside --version 2>&1)"; then
    ok "aside: $(command -v aside) ($version)"
  else
    warn "aside found but --version failed: $version"
  fi
else
  err "aside not found on PATH after install"
  exit 1
fi

# Read-only sign-in state report; built-in models fail closed when signed out.
log "-- Account state (read-only) --"
if aside account status 2>&1; then
  ok "Account status reported"
else
  warn "Account status unavailable — sign in through the Aside app for built-in models"
fi

log ""
ok "Install complete. Capture 'aside --help 2>&1' as your version fixture before scripting flags."
exit 0
