#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-notion :: Embedded Install Script
# Checks Node/npx and prints the Code Mode manual snippet + the NOTION_TOKEN
# env key for the official Notion MCP server. Does NOT modify .utcp_config.json,
# opencode.json, or any config file — it prints snippets only.
# Notion is MCP-only: there is no CLI to install.
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
info()    { echo -e "${BLUE}[mcp-notion]${RESET} $*"; }
success() { echo -e "${GREEN}[mcp-notion]${RESET} ✓ $*"; }
warn()    { echo -e "${YELLOW}[mcp-notion]${RESET} ⚠ $*"; }
error()   { echo -e "${RED}[mcp-notion]${RESET} ✗ $*" >&2; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

usage() {
  cat <<EOF
Usage: $SCRIPT_NAME [OPTIONS]

Check the Node/npx runtime for the official Notion MCP server and print the
Code Mode manual snippet plus the NOTION_TOKEN env key. Writes no config files.

OPTIONS:
  --check-only    Check the runtime without printing the config snippet
  --mcp-only      Print the MCP config snippet only (skip runtime checks)
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

# ── Phase 1: Node Version Check ───────────────────────────────────────────────
check_node() {
  header "Phase 1: Node Runtime"

  if ! command -v node &>/dev/null; then
    error "Node.js ${NODE_MIN_MAJOR}+ required but 'node' was not found."
    error "The official Notion MCP server runs via 'npx @notionhq/notion-mcp-server'."
    error "Install Node: https://nodejs.org/en/download"
    exit 1
  fi

  local node_version node_major
  node_version="$(node -v 2>/dev/null | sed 's/^v//')"
  node_major="$(echo "$node_version" | cut -d. -f1)"

  if [[ "$node_major" -ge "$NODE_MIN_MAJOR" ]]; then
    success "Node $node_version found at $(command -v node)"
  else
    warn "Node $node_version found, but ${NODE_MIN_MAJOR}+ is recommended for the Notion MCP server."
  fi
}

# ── Phase 2: npx Check ────────────────────────────────────────────────────────
check_npx() {
  header "Phase 2: npx"

  if command -v npx &>/dev/null; then
    success "npx $(npx --version 2>/dev/null || echo 'present') at $(command -v npx)"
    info "The server is fetched on demand via 'npx -y @notionhq/notion-mcp-server' — no global install needed."
  else
    error "npx not found. It ships with Node.js/npm — reinstall Node to get it."
    error "Install Node: https://nodejs.org/en/download"
    exit 1
  fi
}

# ── Phase 3: Authentication (env key) ─────────────────────────────────────────
print_auth_instructions() {
  header "Phase 3: Authentication"

  cat <<'EOF'
The official Notion MCP server (local stdio backend) authenticates with an
internal integration token, exposed to Code Mode as the env key:

  ENV KEY:  notion_NOTION_TOKEN
  RESOLVES: NOTION_TOKEN inside the "notion" manual in .utcp_config.json

TO OBTAIN A TOKEN:
  1. Go to: https://www.notion.so/my-integrations
  2. Create an internal integration and copy its token (starts with "ntn_"
     or, on older integrations, "secret_").
  3. Share the target pages / databases with that integration — a Notion token
     sees only content explicitly shared with it.
  4. Export the key so Code Mode can resolve it:
       export notion_NOTION_TOKEN="ntn_YOUR_TOKEN_HERE"
     (Add it to your shell profile or .env — never commit the raw token.)

NOTE: The remote server (https://mcp.notion.com/mcp) uses OAuth and cannot run
      headless, so the headless Code Mode path uses the local stdio server above.
EOF
}

# ── Phase 4: MCP Config Snippet ───────────────────────────────────────────────
print_mcp_config() {
  header "Phase 4: Notion MCP Configuration (Code Mode)"

  cat <<'MCPEOF'
The official Notion MCP server provides pages, blocks, data sources, comments,
users, and search — 24 tools in total. Invoke it through Code Mode.

SERVER:  @notionhq/notion-mcp-server (local stdio, launched via npx)
DOCS:    https://github.com/makenotion/notion-mcp-server

Add the following manual to .utcp_config.json's manual_call_templates
(NOT opencode.json — that file is for native / non-Code-Mode MCP tools):

─────────────────────────────────────────────────────────────────
{
  "name": "notion",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "notion": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@notionhq/notion-mcp-server"],
        "env": {
          "NOTION_TOKEN": "${notion_NOTION_TOKEN}"
        }
      }
    }
  }
}
─────────────────────────────────────────────────────────────────

NOTE: The mcp-notion mode invokes the MCP via Code Mode call_tool_chain().
      Tools are named: notion.notion_{tool_name} (e.g. notion.notion_retrieve-a-page)
      Confirm every tool name live with list_tools() / tool_info() — do not guess.

MCPEOF

  info "Set the env key before use:  export notion_NOTION_TOKEN=\"ntn_...\""
}

# ── Phase 5: Success Summary ──────────────────────────────────────────────────
print_summary() {
  header "Setup Complete"

  cat <<'EOF'
NEXT STEPS:
  1. Set the token:    export notion_NOTION_TOKEN="ntn_YOUR_TOKEN"
  2. Register the MCP: add the snippet above to .utcp_config.json
  3. Verify:           bash scripts/doctor.sh
  4. Smoke test:       call notion.notion_get-self({}) via Code Mode

QUICK REFERENCE:
  Pages   : create-a-page, retrieve-a-page, patch-page, archive-a-page
  Blocks  : patch-block-children, retrieve-block-children, update/delete a block
  Data    : create/retrieve/update a data source, post-data-source-query
  Comments: create-a-comment, retrieve-a-comment
  Users   : get-users, get-user, get-self
  Search  : post-search  (title-only)

SKILL REFERENCE:
  .opencode/skills/mcp-tooling/mcp-notion/SKILL.md
  .opencode/skills/mcp-tooling/mcp-notion/feature-catalog/FEATURE-CATALOG.md

EOF
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo -e "${BOLD}mcp-notion :: Install Script${RESET}"
  echo "Checks Node/npx + prints the Notion MCP Code Mode config (no file writes)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [[ "$MCP_ONLY" == "true" ]]; then
    print_mcp_config
    exit 0
  fi

  check_node
  check_npx

  if [[ "$CHECK_ONLY" == "true" ]]; then
    info "Check-only mode — runtime verified, no config snippet printed."
    exit 0
  fi

  print_auth_instructions
  print_mcp_config
  print_summary
}

main "$@"
