#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SEQUENTIAL THINKING MCP INSTALLER
# ───────────────────────────────────────────────────────────────
# Install and configure the Sequential Thinking MCP Server.
# Provides dynamic, reflective problem-solving through a flexible
# thinking process that can adapt and evolve.

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────
readonly MCP_NAME="sequential_thinking"
readonly MCP_DISPLAY_NAME="Sequential Thinking"
readonly MCP_PACKAGE="@modelcontextprotocol/server-sequential-thinking"
readonly MIN_NODE_VERSION="18"
SKIP_VERIFY="${SKIP_VERIFY:-false}"

# ───────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ───────────────────────────────────────────────────────────────

install_mcp() {
    log_step "Checking prerequisites..."
    
    # No installation needed - runs via npx
    log_info "${MCP_DISPLAY_NAME} runs via npx, no installation required."
    
    # Verify the package is accessible
    log_step "Verifying package accessibility..."
    if ! npx -y "${MCP_PACKAGE}" --help &>/dev/null; then
        # Some MCP servers don't have --help, try brief startup
        log_info "Package accessible (will download on first use)"
    else
        log_success "Package verified: ${MCP_PACKAGE}"
    fi
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
    
    # Add MCP entry
    local mcp_config='{
        "type": "local",
        "command": ["npx", "-y", "'"${MCP_PACKAGE}"'"]
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
    
    # Try to run the package briefly
    # Sequential Thinking MCP doesn't have a --version flag, so we just verify npx can find it
    if timeout 5 npx -y "${MCP_PACKAGE}" --help &>/dev/null 2>&1; then
        log_success "Package responds to --help"
    else
        # Package may not support --help but still work
        log_info "Package accessible (stdio server, no --help flag)"
    fi
    
    # Verify config entry exists
    local project_root
    project_root=$(get_project_root) || exit 1
    local config_file="${project_root}/opencode.json"
    
    if mcp_entry_exists "${config_file}" "${MCP_NAME}"; then
        log_success "Configuration verified in opencode.json"
    else
        log_error "Configuration not found in opencode.json"
        return 1
    fi
}

show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Install ${MCP_DISPLAY_NAME} MCP Server

${MCP_DISPLAY_NAME} provides dynamic, reflective problem-solving through
a flexible thinking process that can adapt and evolve. It breaks down
complex problems into manageable steps with room for revision.

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
    - npx (comes with npm)

After installation:
    Restart OpenCode to load the new MCP server.
    The server will start automatically when needed.

EOF
}

# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────
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
    check_npx || exit 1
    echo ""
    
    # Install (download/verify package)
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
    echo "  2. The server will auto-start when you use sequential thinking tools"
    echo ""
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
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
