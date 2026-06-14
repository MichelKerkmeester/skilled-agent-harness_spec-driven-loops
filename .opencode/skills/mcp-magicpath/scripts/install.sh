#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-magicpath :: Embedded Install Script
# Installs the magicpath-ai CLI globally so the `magicpath-ai` command is
# available without an npx fetch on every call. Does NOT modify any config
# files and does NOT authenticate — it prints the login steps for the user.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
NPM_PACKAGE="magicpath-ai"
CLI_COMMAND="magicpath-ai"
MIN_NODE_MAJOR=16            # magicpath-ai engines: node >=16.0.0
SCRIPT_NAME="$(basename "$0")"

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${BLUE}[mcp-magicpath]${RESET} $*"; }
success() { echo -e "${GREEN}[mcp-magicpath]${RESET} ✓ $*"; }
warn()    { echo -e "${YELLOW}[mcp-magicpath]${RESET} ⚠ $*"; }
error()   { echo -e "${RED}[mcp-magicpath]${RESET} ✗ $*" >&2; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

usage() {
  cat <<EOF
Usage: $SCRIPT_NAME [OPTIONS]

Install the magicpath-ai CLI globally for the mcp-magicpath skill.

OPTIONS:
  --check-only    Report installation status without installing
  --force         Reinstall even if magicpath-ai is already present
  --help, -h      Show this help

EOF
}

# ── Argument Parsing ──────────────────────────────────────────────────────────
CHECK_ONLY=false
FORCE_INSTALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check-only)  CHECK_ONLY=true ;;
    --force)       FORCE_INSTALL=true ;;
    --help|-h)     usage; exit 0 ;;
    *) warn "Unknown option: $1"; usage; exit 1 ;;
  esac
  shift
done

# ── Phase 1: Prerequisites (Node.js + npm) ────────────────────────────────────
check_prereqs() {
  header "Phase 1: Prerequisites"

  if ! command -v node &>/dev/null; then
    error "Node.js ${MIN_NODE_MAJOR}+ is required but 'node' was not found."
    error "Install Node.js: https://nodejs.org/"
    exit 1
  fi

  local node_version node_major
  node_version="$(node --version 2>&1 | sed 's/^v//')"
  node_major="$(echo "$node_version" | cut -d. -f1)"
  if [[ "$node_major" -lt "$MIN_NODE_MAJOR" ]]; then
    error "Node.js ${MIN_NODE_MAJOR}+ required, found $node_version."
    exit 1
  fi
  success "Node.js $node_version found at $(command -v node)"

  if ! command -v npm &>/dev/null; then
    error "npm is required but was not found (it normally ships with Node.js)."
    exit 1
  fi
  success "npm $(npm --version 2>&1) found"
}

# ── Phase 2: Already Installed? ───────────────────────────────────────────────
check_cli() {
  header "Phase 2: ${CLI_COMMAND} Status"

  if command -v "$CLI_COMMAND" &>/dev/null; then
    local installed_version
    installed_version="$("$CLI_COMMAND" --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "unknown")"
    success "${CLI_COMMAND} $installed_version already installed at $(command -v "$CLI_COMMAND")"
    export CLI_ALREADY_INSTALLED=true
  else
    info "${CLI_COMMAND} not found — will install."
    export CLI_ALREADY_INSTALLED=false
  fi
}

# ── Phase 3: Install ──────────────────────────────────────────────────────────
install_cli() {
  if [[ "$CLI_ALREADY_INSTALLED" == "true" && "$FORCE_INSTALL" != "true" ]]; then
    info "Already installed — skipping (use --force to reinstall)."
    return 0
  fi

  header "Phase 3: Installing ${NPM_PACKAGE}"
  info "Running: npm install -g ${NPM_PACKAGE}"
  npm install -g "$NPM_PACKAGE"

  if ! command -v "$CLI_COMMAND" &>/dev/null; then
    error "${CLI_COMMAND} not found in PATH after install."
    error "Ensure your npm global bin dir is in PATH: npm bin -g"
    error "Fallback: the skill also works via 'npx -y ${NPM_PACKAGE}' with no global install."
    exit 1
  fi

  local installed_version
  installed_version="$("$CLI_COMMAND" --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "unknown")"
  success "${CLI_COMMAND} $installed_version installed successfully"
}

# ── Phase 4: Authentication ───────────────────────────────────────────────────
print_auth_instructions() {
  header "Phase 4: Authentication"

  cat <<'EOF'
MagicPath authenticates through a browser session. After install:

  magicpath-ai login                 # opens the browser, auto-completes on authorize
  magicpath-ai login --code <code>   # headless fallback: exchange a browser auth code

VERIFY:
  magicpath-ai whoami -o json        # confirms the authenticated user
  magicpath-ai info -o json          # auth status + teams + projects in one call

EOF
}

# ── Phase 5: Summary ───────────────────────────────────────────────────────────
print_summary() {
  header "Installation Complete"

  cat <<'EOF'
NEXT STEPS:
  1. Authenticate:   magicpath-ai login
  2. Verify:         magicpath-ai info -o json
  3. Find a design:  magicpath-ai search "card" -o json
  4. Read source:    magicpath-ai inspect <generatedName> -o json   (read-only)
  5. Install (React/TS only): magicpath-ai add <generatedName> -y

QUICK REFERENCE (always pass -o json from an agent; -y skips prompts):
  magicpath-ai info | whoami | login
  magicpath-ai search "<query>" [--team <nameOrId>|--personal]
  magicpath-ai inspect <generatedName>            # read-only source
  magicpath-ai add <generatedName> [--dry-run]    # React/TS install
  magicpath-ai list-themes | get-theme <id>
  magicpath-ai selection | active-project         # live canvas state
  magicpath-ai code start --project <id> --dir <dir>   # author on canvas
  magicpath-ai code submit --dir <dir> --wait

NOTE: The skill's docs use 'npx -y magicpath-ai ...', which resolves to this
      global install when present, or fetches on demand when it is not.

SKILL REFERENCE:
  .opencode/skills/mcp-magicpath/SKILL.md
  .opencode/skills/mcp-magicpath/references/cli_reference.md

EOF
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo -e "${BOLD}mcp-magicpath :: Install Script${RESET}"
  echo "Installs the magicpath-ai CLI globally"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  check_prereqs
  check_cli

  if [[ "$CHECK_ONLY" == "true" ]]; then
    info "Check-only mode — no installation performed."
    exit 0
  fi

  install_cli
  print_auth_instructions
  print_summary
}

main "$@"
