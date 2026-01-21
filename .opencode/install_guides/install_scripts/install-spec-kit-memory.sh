#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────────
# install-spec-kit-memory.sh: Install Spec Kit Memory MCP Server
# ───────────────────────────────────────────────────────────────────

# Spec Kit Memory provides semantic vector search for conversation context,
# decisions, and session memories. It enables context preservation across
# sessions with constitutional tier priorities.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

# ───────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────────
MCP_NAME="spec_kit_memory"
MCP_DISPLAY_NAME="Spec Kit Memory"
MCP_SERVER_DIR=".opencode/skill/system-spec-kit/mcp_server"
MCP_SERVER_SCRIPT="context-server.js"
MIN_NODE_VERSION="18"
SKIP_VERIFY=${SKIP_VERIFY:-false}

# ───────────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ───────────────────────────────────────────────────────────────────

install_mcp() {
    log_step "Checking prerequisites..."
    
    local project_root
    project_root=$(get_project_root) || exit 1
    local server_dir="${project_root}/${MCP_SERVER_DIR}"
    
    # Check if server directory exists
    if [[ ! -d "${server_dir}" ]]; then
        log_error "Spec Kit Memory server directory not found: ${server_dir}"
        log_info "This MCP is bundled with the project. Ensure .opencode/skill/system-spec-kit exists."
        exit 1
    fi
    
    # Check if package.json exists
    if [[ ! -f "${server_dir}/package.json" ]]; then
        log_error "package.json not found in ${server_dir}"
        exit 1
    fi
    
    # Check if dependencies are already installed
    if [[ -d "${server_dir}/node_modules" ]]; then
        log_info "Dependencies already installed. Checking for updates..."
    fi
    
    # Install dependencies
    log_step "Installing dependencies..."
    (
        cd "${server_dir}"
        npm install --silent 2>/dev/null || npm install
    )
    
    if [[ $? -eq 0 ]]; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi
    
    # Verify the server script exists
    if [[ ! -f "${server_dir}/${MCP_SERVER_SCRIPT}" ]]; then
        log_error "Server script not found: ${server_dir}/${MCP_SERVER_SCRIPT}"
        exit 1
    fi
    
    log_success "Server script verified: ${MCP_SERVER_SCRIPT}"
}

configure_mcp() {
    log_step "Configuring ${MCP_DISPLAY_NAME}..."
    
    local project_root
    project_root=$(get_project_root) || exit 1
    local config_file="${project_root}/opencode.json"
    
    # Check if already configured
    if mcp_entry_exists "${config_file}" "${MCP_NAME}"; then
        log_info "${MCP_DISPLAY_NAME} is already configured in opencode.json"
        return 0
    fi
    
    # Validate config file before modification
    if ! json_validate "${config_file}"; then
        log_error "opencode.json is invalid. Please fix it first."
        exit 1
    fi
    
    # Add MCP entry with relative path (portable)
    local mcp_config='{
        "type": "local",
        "command": ["node", "'"${MCP_SERVER_DIR}/${MCP_SERVER_SCRIPT}"'"],
        "environment": {
            "EMBEDDINGS_PROVIDER": "auto",
            "VOYAGE_API_KEY": "YOUR_VOYAGE_API_KEY_HERE",
            "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY_HERE",
            "_NOTE_1_DATABASE": "Stores vectors in: .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite",
            "_NOTE_2_PROVIDERS": "Supports: Voyage (1024 dims, recommended), OpenAI (1536/3072 dims), HF Local (768 dims, fallback)",
            "_NOTE_3_AUTO_DETECTION": "Priority: VOYAGE_API_KEY -> OPENAI_API_KEY -> HF Local (no installation needed)",
            "_NOTE_4_PORTABLE": "Uses relative path - works when copying project to new location"
        }
    }'
    
    if add_mcp_entry "${config_file}" "${MCP_NAME}" "${mcp_config}"; then
        log_success "Added ${MCP_DISPLAY_NAME} to opencode.json"
    else
        log_error "Failed to add ${MCP_DISPLAY_NAME} to opencode.json"
        exit 1
    fi
    
    # Validate config file after modification
    if ! json_validate "${config_file}"; then
        log_error "opencode.json became invalid after modification"
        exit 1
    fi
}

verify_installation() {
    if [[ "${SKIP_VERIFY}" == "true" ]]; then
        log_info "Skipping verification (--skip-verify)"
        return 0
    fi
    
    log_step "Verifying installation..."
    
    local project_root
    project_root=$(get_project_root) || exit 1
    local server_path="${project_root}/${MCP_SERVER_DIR}/${MCP_SERVER_SCRIPT}"
    
    # Verify server script can be loaded (syntax check)
    if node -c "${server_path}" 2>/dev/null; then
        log_success "Server script syntax verified"
    else
        log_warn "Server script syntax check failed (may still work)"
    fi
    
    # Verify node_modules exist (may be in parent dir due to npm hoisting)
    local parent_dir
    parent_dir="$(dirname "${project_root}/${MCP_SERVER_DIR}")"
    if [[ -d "${project_root}/${MCP_SERVER_DIR}/node_modules" ]] || [[ -d "${parent_dir}/node_modules" ]]; then
        log_success "Dependencies verified"
    else
        log_warn "node_modules not found - dependencies may be installed elsewhere"
    fi
    
    # Verify config entry exists
    local config_file="${project_root}/opencode.json"
    
    if mcp_entry_exists "${config_file}" "${MCP_NAME}"; then
        log_success "Configuration verified in opencode.json"
    else
        log_error "Configuration not found in opencode.json"
        return 1
    fi
    
    # Note about database creation
    local db_dir="${project_root}/.opencode/skill/system-spec-kit/mcp_server/database"
    if [[ -f "${db_dir}/context-index.sqlite" ]]; then
        log_info "Database already exists at: ${db_dir}/context-index.sqlite"
    else
        log_info "Database will be created on first use at: ${db_dir}/"
    fi
}

show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Install ${MCP_DISPLAY_NAME} MCP Server

${MCP_DISPLAY_NAME} provides semantic vector search for conversation context,
decisions, and session memories. It enables context preservation across
sessions with constitutional tier priorities.

Features:
    - Semantic search via vector embeddings
    - Multiple embedding providers (Voyage, OpenAI, local HF)
    - Constitutional tier memories (always surface first)
    - Checkpoint save/restore
    - Trigger phrase matching

Options:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output
    --skip-verify   Skip verification step

Examples:
    $(basename "$0")              # Standard installation
    $(basename "$0") --verbose    # With detailed output
    $(basename "$0") --skip-verify # Skip verification

Requirements:
    - Node.js ${MIN_NODE_VERSION}+
    - npm

Embedding Providers (auto-detected in order):
    1. Voyage AI (VOYAGE_API_KEY) - Recommended, 8% better than OpenAI
    2. OpenAI (OPENAI_API_KEY)
    3. Local Hugging Face (no API key needed, default fallback)

After installation:
    Restart OpenCode to load the new MCP server.
    Set VOYAGE_API_KEY or OPENAI_API_KEY for better embeddings (optional).

EOF
}

# ───────────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo "───────────────────────────────────────"
    echo "  ${MCP_DISPLAY_NAME} MCP Installer"
    echo "───────────────────────────────────────"
    echo ""
    
    log_info "Installing ${MCP_DISPLAY_NAME} MCP Server..."
    echo ""
    
    # Prerequisites
    check_node_version "${MIN_NODE_VERSION}" || exit 1
    check_npm || exit 1
    echo ""
    
    # Install (npm install in mcp_server directory)
    install_mcp
    echo ""
    
    # Configure opencode.json
    configure_mcp
    echo ""
    
    # Verify
    verify_installation
    echo ""
    
    echo "───────────────────────────────────────"
    log_success "${MCP_DISPLAY_NAME} MCP installed successfully!"
    echo "───────────────────────────────────────"
    echo ""
    log_info "Next steps:"
    echo "  1. Restart OpenCode to load the new MCP"
    echo "  2. (Optional) Set VOYAGE_API_KEY for better embeddings"
    echo "  3. Use memory_search, memory_save tools for context preservation"
    echo ""
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --skip-verify)
            SKIP_VERIFY=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

main "$@"
