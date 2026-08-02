#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-obsidian :: Embedded Install Script
# Installs the headless notesmd-cli, prints the steps to enable the official
# obsidian CLI, and prints the Obsidian MCP config snippet + env keys.
# Does NOT modify .utcp_config.json, .env, or any config files — prints only.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
NODE_MIN_MAJOR=18
SCRIPT_NAME="$(basename "$0")"

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${BLUE}[mcp-obsidian]${RESET} $*"; }
success() { echo -e "${GREEN}[mcp-obsidian]${RESET} ✓ $*"; }
warn()    { echo -e "${YELLOW}[mcp-obsidian]${RESET} ⚠ $*"; }
error()   { echo -e "${RED}[mcp-obsidian]${RESET} ✗ $*" >&2; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

usage() {
  cat <<EOF
Usage: $SCRIPT_NAME [OPTIONS]

Install notesmd-cli, print official obsidian CLI enable steps, and print the
Obsidian MCP config snippet for .utcp_config.json.

OPTIONS:
  --check-only    Check installation status without installing
  --mcp-only      Print MCP config snippet + env keys only (skip CLI install)
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

# ── Phase 1: Prerequisite Check ───────────────────────────────────────────────
check_prereqs() {
  header "Phase 1: Prerequisites"

  if command -v brew &>/dev/null; then
    success "Homebrew found at $(command -v brew)"
    export HAVE_BREW=true
  else
    warn "Homebrew not found — notesmd-cli install will print manual alternatives."
    export HAVE_BREW=false
  fi

  # Node/npx are needed by the MCP server (obsidian-mcp-server via npx), not the CLI.
  if command -v node &>/dev/null; then
    local node_major
    node_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
    if [[ "$node_major" -ge "$NODE_MIN_MAJOR" ]]; then
      success "Node $(node -v) found (needed by the MCP server via npx)"
    else
      warn "Node $(node -v) found but < ${NODE_MIN_MAJOR} — the MCP server needs Node ${NODE_MIN_MAJOR}+."
    fi
  else
    warn "Node not found — required by the Obsidian MCP server (npx). The CLI does not need it."
  fi
}

# ── Phase 2: notesmd-cli Already Installed? ───────────────────────────────────
check_cli() {
  header "Phase 2: notesmd-cli Status"

  if command -v notesmd-cli &>/dev/null; then
    success "notesmd-cli already installed at $(command -v notesmd-cli)"
    info "Register a vault: notesmd-cli add-vault <path> && notesmd-cli set-default-vault <name>"
    export CLI_ALREADY_INSTALLED=true
  else
    info "notesmd-cli not found — will install."
    export CLI_ALREADY_INSTALLED=false
  fi
}

# ── Phase 3: Install notesmd-cli ──────────────────────────────────────────────
install_cli() {
  if [[ "$CLI_ALREADY_INSTALLED" == "true" ]]; then
    return 0
  fi

  header "Phase 3: Installing notesmd-cli"

  if [[ "$HAVE_BREW" == "true" ]]; then
    info "Installing via Homebrew (tap yakitrak/yakitrak)..."
    brew tap yakitrak/yakitrak
    brew install yakitrak/yakitrak/notesmd-cli

    if ! command -v notesmd-cli &>/dev/null; then
      error "notesmd-cli installation failed — 'notesmd-cli' not found in PATH."
      error "Ensure Homebrew's bin directory is on PATH, then retry."
      exit 1
    fi
    success "notesmd-cli installed at $(command -v notesmd-cli)"
  else
    warn "Homebrew unavailable — printing manual install options (nothing installed)."
    cat <<'EOF'

  Scoop (Windows):
    scoop bucket add scoop-yakitrak https://github.com/yakitrak/scoop-yakitrak.git
    scoop install notesmd-cli

  AUR (Arch Linux):
    yay -S notesmd-cli-bin

  From source (Go 1.19+, `go install` is NOT supported):
    git clone https://github.com/Yakitrak/obsidian-cli
    cd obsidian-cli && go build -o notesmd-cli
    # then move the notesmd-cli binary onto your PATH

EOF
  fi
}

# ── Phase 4: Official obsidian CLI (print-only) ───────────────────────────────
print_official_cli_steps() {
  header "Phase 4: Official obsidian CLI (app-backed, optional)"

  cat <<'EOF'
The official `obsidian` CLI ships inside the Obsidian desktop app (v1.12.4+,
free). There is no npm or Homebrew package — these steps are printed only,
nothing is toggled inside the app for you.

Enable it in the desktop app:
  1. Settings → General → Command line interface
  2. Toggle it on
  3. Click "Register CLI"  (adds `obsidian` to PATH on macOS/Linux)

It remote-controls a RUNNING app (launching it if not running), so it is not a
headless/filesystem tool. Verify with: obsidian --help

EOF
}

# ── Phase 5: MCP Config Snippet + Env Keys ────────────────────────────────────
print_mcp_config() {
  header "Phase 5: Obsidian MCP Configuration"

  cat <<'MCPEOF'
The Obsidian MCP server provides app-backed note operations:
  reading, writing, searching and tagging notes against a running vault.

SERVER:   obsidian-mcp-server (cyanheads, npm v3.2.9), launched via npx over stdio
PREREQS:  Obsidian Local REST API plugin v4.0.0+ enabled, an API key generated,
          and a running Obsidian app.

Add the following manual to .utcp_config.json's manual_call_templates
(NOT opencode.json — that file is for native/non-Code-Mode MCP tools):

─────────────────────────────────────────────────────────────────
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "obsidian-mcp-server@latest"],
        "env": {
          "OBSIDIAN_API_KEY": "${obsidian_OBSIDIAN_API_KEY}",
          "OBSIDIAN_BASE_URL": "${obsidian_OBSIDIAN_BASE_URL}",
          "OBSIDIAN_VERIFY_SSL": "${obsidian_OBSIDIAN_VERIFY_SSL}"
        }
      }
    }
  }
}
─────────────────────────────────────────────────────────────────

Add these keys to .env.example / your local .env (the obsidian_ prefix
matches the manual name):

  obsidian_OBSIDIAN_API_KEY=          # Local REST API bearer token (required)
  obsidian_OBSIDIAN_BASE_URL=http://127.0.0.1:27123
  obsidian_OBSIDIAN_VERIFY_SSL=false

NOTE: The mcp-obsidian skill invokes the MCP via Code Mode call_tool_chain().
      Tools are named: obsidian.obsidian_{tool_name} (e.g. obsidian.obsidian_get_note)

HEADLESS ALT: obsidian-mcp (StevenStavrakis, npm v1.0.6) is filesystem-based
      and needs no running app or token. Verify its behavior before relying on it.

MCPEOF

  info "This script prints config only — it never writes .utcp_config.json or .env."
}

# ── Phase 6: Success Summary ───────────────────────────────────────────────────
print_summary() {
  header "Installation Complete"

  cat <<'EOF'
NEXT STEPS:
  1. Register a vault:   notesmd-cli add-vault <path>
                         notesmd-cli set-default-vault <name>
  2. Verify CLI:         notesmd-cli --help
  3. (Optional) Enable the official obsidian CLI in-app (see Phase 4)
  4. For MCP support:    Add the snippet above to .utcp_config.json + env keys to .env

QUICK REFERENCE (notesmd-cli):
  notesmd-cli list | list-vaults
  notesmd-cli search <query> | search-content <query>
  notesmd-cli open <note> | print <note> | daily
  notesmd-cli create <note> | move <src> <dst> | delete <note>
  notesmd-cli frontmatter <note>
  notesmd-cli add-vault <path> | remove-vault <name> | set-default-vault <name>

SKILL REFERENCE:
  .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md
  .opencode/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md

EOF
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo -e "${BOLD}mcp-obsidian :: Install Script${RESET}"
  echo "Installs notesmd-cli + prints official obsidian CLI steps and MCP config"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [[ "$MCP_ONLY" == "true" ]]; then
    print_mcp_config
    exit 0
  fi

  check_prereqs
  check_cli

  if [[ "$CHECK_ONLY" == "true" ]]; then
    info "Check-only mode — no installation performed."
    exit 0
  fi

  install_cli
  print_official_cli_steps
  print_mcp_config
  print_summary
}

main "$@"
