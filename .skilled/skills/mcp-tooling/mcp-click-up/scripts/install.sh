#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-click-up :: Embedded Install Script
# Installs cupt CLI and prints the official ClickUp MCP configuration snippet.
# Does NOT modify opencode.json or any config files — prints snippets only.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
PYTHON_MIN_MAJOR=3
PYTHON_MIN_MINOR=8
SCRIPT_NAME="$(basename "$0")"

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${BLUE}[mcp-click-up]${RESET} $*"; }
success() { echo -e "${GREEN}[mcp-click-up]${RESET} ✓ $*"; }
warn()    { echo -e "${YELLOW}[mcp-click-up]${RESET} ⚠ $*"; }
error()   { echo -e "${RED}[mcp-click-up]${RESET} ✗ $*" >&2; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

usage() {
  cat <<EOF
Usage: $SCRIPT_NAME [OPTIONS]

Install cupt CLI for ClickUp task management and print MCP config snippet.

OPTIONS:
  --check-only    Check installation status without installing
  --mcp-only      Print MCP config snippet only (skip cupt install)
  --help, -h      Show this help

EOF
}

# ── Argument Parsing ──────────────────────────────────────────────────────────
CHECK_ONLY=false
MCP_ONLY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check-only)  CHECK_ONLY=true ;;
    --mcp-only)    MCP_ONLY=true ;;
    --help|-h)     usage; exit 0 ;;
    *) warn "Unknown option: $1"; usage; exit 1 ;;
  esac
  shift
done

# ── Phase 1: Python Version Check ─────────────────────────────────────────────
check_python() {
  header "Phase 1: Python Version"

  local python_cmd=""
  for cmd in python3 python; do
    if command -v "$cmd" &>/dev/null; then
      local version
      version="$("$cmd" --version 2>&1 | awk '{print $2}')"
      local major minor
      major="$(echo "$version" | cut -d. -f1)"
      minor="$(echo "$version" | cut -d. -f2)"
      if [[ "$major" -gt "$PYTHON_MIN_MAJOR" || ( "$major" -eq "$PYTHON_MIN_MAJOR" && "$minor" -ge "$PYTHON_MIN_MINOR" ) ]]; then
        python_cmd="$cmd"
        success "Python $version found at $(command -v "$cmd")"
        break
      fi
    fi
  done

  if [[ -z "$python_cmd" ]]; then
    error "Python ${PYTHON_MIN_MAJOR}.${PYTHON_MIN_MINOR}+ required but not found."
    error "Install Python: https://www.python.org/downloads/"
    exit 1
  fi

  export PYTHON_CMD="$python_cmd"
}

# ── Phase 2: cupt Already Installed? ─────────────────────────────────────────
check_cupt() {
  header "Phase 2: cupt Status"

  if command -v cupt &>/dev/null; then
    local installed_version
    installed_version="$(cupt --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "unknown")"
    success "cupt $installed_version already installed at $(command -v cupt)"
    echo ""
    info "Run 'cupt status' to verify authentication."
    export CUPT_ALREADY_INSTALLED=true
  else
    info "cupt not found — will install."
    export CUPT_ALREADY_INSTALLED=false
  fi
}

# ── Phase 3: Install cupt ─────────────────────────────────────────────────────
install_cupt() {
  if [[ "$CUPT_ALREADY_INSTALLED" == "true" ]]; then
    return 0
  fi

  header "Phase 3: Installing cupt"

  if command -v pipx &>/dev/null; then
    info "Installing via pipx (recommended — isolated environment)..."
    pipx install cupt
  else
    warn "pipx not found. Installing via pip (consider installing pipx for isolation)."
    warn "Install pipx: https://pipx.pypa.io/stable/installation/"
    "$PYTHON_CMD" -m pip install --user cupt
  fi

  # Verify installation
  if ! command -v cupt &>/dev/null; then
    error "cupt installation failed — 'cupt' not found in PATH."
    error "Try: pipx install cupt  OR  pip install cupt"
    error "Ensure your Python bin dir is in PATH."
    exit 1
  fi

  local installed_version
  installed_version="$(cupt --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "unknown")"
  success "cupt $installed_version installed successfully"
}

# ── Phase 4: Authentication Setup ─────────────────────────────────────────────
print_auth_instructions() {
  header "Phase 4: Authentication"

  cat <<'EOF'
cupt requires a ClickUp API token. Two options:

OPTION A — Personal API Token (recommended for individuals):
  1. Go to: https://app.clickup.com/settings/apps
  2. Generate a Personal API Token (starts with "pk_")
  3. Run: cupt config --api-token pk_YOUR_TOKEN_HERE
     OR:  cupt auth   (interactive setup wizard)

OPTION B — OAuth (recommended for teams):
  1. Create an app at: https://app.clickup.com/settings/apps
  2. Set redirect URL to: http://localhost:4321
  3. Run: cupt auth   (enter Client ID + Client Secret when prompted)

VERIFY:
  cupt status   # Shows workspace info if authenticated

EOF
}

# ── Phase 5: MCP Config Snippet ───────────────────────────────────────────────
print_mcp_config() {
  header "Phase 5: Official ClickUp MCP Configuration"

  cat <<'MCPEOF'
The official ClickUp MCP server provides advanced operations:
  documents, goals/OKRs, bulk task creation, webhooks, and more.

SERVER: https://mcp.clickup.com/mcp (ClickUp's own hosted server)
DOCS:   https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server

Auth is OAuth 2.1 + PKCE only. ClickUp does not support API keys or access
tokens for this server, the first connection opens a browser to authorize.
There is no token to paste into config.

Add the following manual to .utcp_config.json's manual_call_templates
(NOT opencode.json, that file is for native/non-Code-Mode MCP tools):

─────────────────────────────────────────────────────────────────
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["mcp-remote", "https://mcp.clickup.com/mcp"],
        "env": {}
      }
    }
  }
}
─────────────────────────────────────────────────────────────────

NOTE: The mcp-click-up skill invokes the MCP via Code Mode call_tool_chain().
      Tools are named: clickup.clickup_{tool_name} (e.g. clickup.clickup_create_task)

MCPEOF

  info "No env vars to set. Authorize in the browser on first connection."
}

# ── Phase 6: Success Summary ───────────────────────────────────────────────────
print_summary() {
  header "Installation Complete"

  cat <<'EOF'
NEXT STEPS:
  1. Authenticate:      cupt auth   OR   cupt config --api-token pk_...
  2. Verify:            cupt status
  3. List tasks:        cupt list --today --json
  4. For MCP support:   Add the config snippet above to .utcp_config.json

QUICK REFERENCE:
  cupt list [--today|--week|--overdue] [--tag X] [--mine|--all] [--json]
  cupt show <id> [--notes] [--json]
  cupt statuses <id>
  cupt done <id> [--dry-run]
  cupt note <id> "<text>"
  cupt time start <id> | stop | add <id> <duration>
  cupt tag add|remove <id> <name>
  cupt context <id>

SKILL REFERENCE:
  .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md
  .opencode/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md

EOF
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo -e "${BOLD}mcp-click-up :: Install Script${RESET}"
  echo "Installs cupt CLI + prints official ClickUp MCP config"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [[ "$MCP_ONLY" == "true" ]]; then
    print_mcp_config
    exit 0
  fi

  check_python
  check_cupt

  if [[ "$CHECK_ONLY" == "true" ]]; then
    info "Check-only mode — no installation performed."
    exit 0
  fi

  install_cupt
  print_auth_instructions
  print_mcp_config
  print_summary
}

main "$@"
