#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────────
# install-narsil.sh: Install Narsil MCP Server
# ───────────────────────────────────────────────────────────────────

# Narsil provides deep code intelligence with 90 tools including:
# - Neural/semantic code search (via Voyage AI, OpenAI, or local ONNX)
# - Structural queries (symbols, definitions, references)
# - Security scanning (OWASP, CWE, taint analysis)
# - Call graph analysis (CFG, DFG, callers/callees)
# - Supply chain security (SBOM, license compliance)
#
# Official repo: https://github.com/postrv/narsil-mcp

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

# ───────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────────
MCP_NAME="Narsil"
MIN_NODE_VERSION="18"
UTCP_CONFIG_FILE=".utcp_config.json"
ENV_FILE=".env"

# Installation methods
INSTALL_METHODS=(
    "npm (RECOMMENDED - cross-platform)"
    "Homebrew (macOS/Linux)"
    "One-click installer (macOS/Linux)"
    "Cargo (requires Rust toolchain)"
)

# ───────────────────────────────────────────────────────────────────
# 2. HELP
# ───────────────────────────────────────────────────────────────────
show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Install and configure Narsil MCP Server for deep code intelligence.

Options:
    -h, --help          Show this help message
    -m, --method NUM    Use installation method (1-4, skips prompt)
    -v, --verbose       Enable verbose output
    --skip-config       Skip .utcp_config.json configuration
    --skip-wizard       Skip Narsil config wizard
    --voyage-key KEY    Set VOYAGE_API_KEY for neural search
    --force             Force reinstallation even if already installed

Installation Methods:
    1) npm (RECOMMENDED)     npm install -g narsil-mcp
    2) Homebrew              brew tap postrv/narsil && brew install narsil-mcp
    3) One-click installer   curl -fsSL .../install.sh | bash
    4) Cargo                 cargo install narsil-mcp

Neural Search Backends:
    Narsil supports 3 embedding backends for semantic code search:
    
    1) Voyage AI (RECOMMENDED for code)
       --neural --neural-backend api --neural-model voyage-code-2
       Requires: VOYAGE_API_KEY (get from voyageai.com)
    
    2) OpenAI
       --neural --neural-backend api --neural-model text-embedding-3-small
       Requires: OPENAI_API_KEY (get from platform.openai.com)
    
    3) Local ONNX (no API key needed)
       --neural --neural-backend onnx
       Runs locally, no API key required

Examples:
    $(basename "$0")                      # Interactive installation
    $(basename "$0") -m 1                 # Install via npm (no prompt)
    $(basename "$0") --voyage-key abc123  # Install with Voyage API key

EOF
}

# ───────────────────────────────────────────────────────────────────
# 3. DISPLAY FUNCTIONS
# ───────────────────────────────────────────────────────────────────
show_banner() {
    echo ""
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│                    Narsil MCP Installer                         │"
    echo "│          Deep Code Intelligence for AI Assistants               │"
    echo "└─────────────────────────────────────────────────────────────────┘"
    echo ""
}

show_install_methods() {
    cat << EOF

Narsil MCP Installation Methods:

  1) npm (RECOMMENDED - works on all platforms)
     Command: npm install -g narsil-mcp

  2) Homebrew (macOS/Linux)
     Command: brew tap postrv/narsil && brew install narsil-mcp

  3) One-click installer (macOS/Linux)
     Downloads and installs automatically

  4) Cargo (requires Rust toolchain)
     Command: cargo install narsil-mcp

EOF
}

# ───────────────────────────────────────────────────────────────────
# 4. PREREQUISITE CHECKS
# ───────────────────────────────────────────────────────────────────

# Check if Code Mode is configured (Narsil requires Code Mode)
check_code_mode() {
    local project_root
    project_root=$(get_project_root) || return 1
    
    local opencode_config="${project_root}/opencode.json"
    
    if [[ ! -f "${opencode_config}" ]]; then
        log_warn "opencode.json not found at ${project_root}"
        return 1
    fi
    
    # Check if code-mode MCP is configured
    if node -e "
        const cfg = JSON.parse(require('fs').readFileSync('${opencode_config}', 'utf8'));
        const hasMcp = cfg.mcp && (cfg.mcp['code-mode'] || cfg.mcp['code_mode']);
        process.exit(hasMcp ? 0 : 1);
    " 2>/dev/null; then
        log_info "Code Mode MCP found in opencode.json ✓"
        return 0
    fi
    
    return 1
}

# Check if narsil-mcp is already installed
check_narsil_installed() {
    # Check direct command first
    if command -v narsil-mcp &> /dev/null; then
        local version
        version=$(narsil-mcp --version 2>/dev/null || echo "unknown")
        log_info "narsil-mcp already installed: ${version}"
        return 0
    fi
    
    # Check via npx (npm global may not create symlink on some systems)
    if npx narsil-mcp --version &> /dev/null; then
        local version
        version=$(npx narsil-mcp --version 2>/dev/null || echo "unknown")
        log_info "narsil-mcp available via npx: ${version}"
        return 0
    fi
    
    return 1
}

# Check if narsil entry exists in .utcp_config.json
check_narsil_configured() {
    local project_root
    project_root=$(get_project_root) || return 1
    
    local config_file="${project_root}/${UTCP_CONFIG_FILE}"
    
    if [[ ! -f "${config_file}" ]]; then
        return 1
    fi
    
    # Check if narsil is in manual_call_templates
    if node -e "
        const cfg = JSON.parse(require('fs').readFileSync('${config_file}', 'utf8'));
        const templates = cfg.manual_call_templates || [];
        const hasNarsil = templates.some(t => t.name === 'narsil');
        process.exit(hasNarsil ? 0 : 1);
    " 2>/dev/null; then
        log_info "Narsil already configured in ${UTCP_CONFIG_FILE} ✓"
        return 0
    fi
    
    return 1
}

# Check if Homebrew is available
check_homebrew() {
    if command -v brew &> /dev/null; then
        log_info "Homebrew available ✓"
        return 0
    fi
    return 1
}

# Check if Cargo/Rust is available
check_cargo() {
    if command -v cargo &> /dev/null; then
        log_info "Cargo (Rust) available ✓"
        return 0
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────────
# 5. INSTALLATION METHODS
# ───────────────────────────────────────────────────────────────────

install_via_npm() {
    log_step "Installing Narsil via npm..."
    
    if ! check_npm; then
        log_error "npm is required for this installation method"
        return 1
    fi
    
    npm install -g narsil-mcp
    
    if check_narsil_installed; then
        log_success "Narsil installed via npm"
        return 0
    else
        log_error "npm installation failed"
        return 1
    fi
}

install_via_homebrew() {
    log_step "Installing Narsil via Homebrew..."
    
    if ! check_homebrew; then
        log_error "Homebrew is not installed"
        log_info "Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        return 1
    fi
    
    # Check if tap already exists
    if ! brew tap | grep -q "postrv/narsil"; then
        log_info "Adding Homebrew tap: postrv/narsil"
        brew tap postrv/narsil
    fi
    
    brew install narsil-mcp
    
    if check_narsil_installed; then
        log_success "Narsil installed via Homebrew"
        return 0
    else
        log_error "Homebrew installation failed"
        return 1
    fi
}

install_via_oneclick() {
    log_step "Running Narsil one-click installer..."
    
    local platform
    platform=$(detect_platform)
    
    if [[ "${platform}" == "windows" ]]; then
        log_error "One-click installer not supported on Windows via bash"
        log_info "Use PowerShell: irm https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.ps1 | iex"
        return 1
    fi
    
    log_info "Downloading and running install script from GitHub..."
    curl -fsSL https://raw.githubusercontent.com/postrv/narsil-mcp/main/install.sh | bash
    
    # Refresh PATH to find newly installed binary
    export PATH="$HOME/.cargo/bin:$HOME/.local/bin:$PATH"
    
    if check_narsil_installed; then
        log_success "Narsil installed via one-click installer"
        return 0
    else
        log_error "One-click installation may have failed. Check the output above."
        return 1
    fi
}

install_via_cargo() {
    log_step "Installing Narsil via Cargo..."
    
    if ! check_cargo; then
        log_error "Cargo (Rust) is not installed"
        log_info "Install Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        return 1
    fi
    
    cargo install narsil-mcp
    
    # Refresh PATH
    export PATH="$HOME/.cargo/bin:$PATH"
    
    if check_narsil_installed; then
        log_success "Narsil installed via Cargo"
        return 0
    else
        log_error "Cargo installation failed"
        return 1
    fi
}

# ───────────────────────────────────────────────────────────────────
# 6. CONFIGURATION
# ───────────────────────────────────────────────────────────────────

run_config_wizard() {
    log_step "Running Narsil configuration wizard..."
    
    echo ""
    echo "The config wizard helps set up Narsil with optimal settings for your codebase."
    echo "It can auto-detect your editor and configure neural search."
    echo ""
    
    # Run the interactive config wizard
    narsil-mcp config init --neural
    
    log_success "Narsil configuration wizard completed"
}

# Add Narsil to .utcp_config.json
configure_utcp() {
    local project_root
    project_root=$(get_project_root) || return 1
    
    local config_file="${project_root}/${UTCP_CONFIG_FILE}"
    local voyage_key="${1:-}"
    
    log_step "Configuring Narsil in ${UTCP_CONFIG_FILE}..."
    
    # Create config file if it doesn't exist
    if [[ ! -f "${config_file}" ]]; then
        log_info "Creating ${UTCP_CONFIG_FILE}..."
        cat > "${config_file}" << 'UTCP_EOF'
{
  "load_variables_from": [
    {
      "variable_loader_type": "dotenv",
      "env_file_path": ".env"
    }
  ],
  "tool_repository": {
    "tool_repository_type": "in_memory"
  },
  "tool_search_strategy": {
    "tool_search_strategy_type": "tag_and_description_word_match"
  },
  "manual_call_templates": []
}
UTCP_EOF
    fi
    
    # Validate existing config
    if ! json_validate "${config_file}"; then
        log_error "Existing ${UTCP_CONFIG_FILE} is invalid JSON"
        return 1
    fi
    
    # Backup before modification
    cp "${config_file}" "${config_file}.bak"
    
    # Build the Narsil configuration
    local env_block="{}"
    if [[ -n "${voyage_key}" ]]; then
        env_block="{\"VOYAGE_API_KEY\": \"${voyage_key}\"}"
    fi
    
    # Add Narsil entry using Node.js
    node -e "
        const fs = require('fs');
        const cfg = JSON.parse(fs.readFileSync('${config_file}', 'utf8'));
        
        if (!cfg.manual_call_templates) {
            cfg.manual_call_templates = [];
        }
        
        // Remove existing narsil entry if present
        cfg.manual_call_templates = cfg.manual_call_templates.filter(t => t.name !== 'narsil');
        
        // Add new narsil configuration
        // NOTE: Do NOT add extra fields like _note, _neural_backends - they break Code Mode parsing
        const narsilConfig = {
            name: 'narsil',
            call_template_type: 'mcp',
            config: {
                mcpServers: {
                    narsil: {
                        transport: 'stdio',
                        command: 'narsil-mcp',
                        args: [
                            '--repos', '.',
                            '--index-path', '.narsil-index',
                            '--git',
                            '--call-graph',
                            '--persist',
                            '--watch',
                            '--neural',
                            '--neural-backend', 'api',
                            '--neural-model', 'voyage-code-2'
                        ],
                        env: ${env_block}
                    }
                }
            }
        };
        
        cfg.manual_call_templates.push(narsilConfig);
        
        fs.writeFileSync('${config_file}', JSON.stringify(cfg, null, 2) + '\n');
    " 2>/dev/null
    
    if [[ $? -ne 0 ]]; then
        log_error "Failed to update ${UTCP_CONFIG_FILE}"
        mv "${config_file}.bak" "${config_file}"
        return 1
    fi
    
    # Validate the result
    if ! json_validate "${config_file}"; then
        log_error "Config file corrupted, restoring backup"
        mv "${config_file}.bak" "${config_file}"
        return 1
    fi
    
    rm -f "${config_file}.bak"
    log_success "Narsil configured in ${UTCP_CONFIG_FILE}"
    return 0
}

# Add VOYAGE_API_KEY to .env if not present
configure_env() {
    local project_root
    project_root=$(get_project_root) || return 1
    
    local env_file="${project_root}/${ENV_FILE}"
    local voyage_key="${1:-}"
    
    # Create .env if it doesn't exist
    if [[ ! -f "${env_file}" ]]; then
        touch "${env_file}"
        log_info "Created ${ENV_FILE}"
    fi
    
    # Check if VOYAGE_API_KEY already exists
    if grep -q "^VOYAGE_API_KEY=" "${env_file}" 2>/dev/null; then
        log_info "VOYAGE_API_KEY already exists in ${ENV_FILE}"
        return 0
    fi
    
    if [[ -n "${voyage_key}" ]]; then
        echo "VOYAGE_API_KEY=${voyage_key}" >> "${env_file}"
        log_success "Added VOYAGE_API_KEY to ${ENV_FILE}"
    else
        echo "# VOYAGE_API_KEY=your-voyage-api-key-here" >> "${env_file}"
        log_info "Added placeholder for VOYAGE_API_KEY in ${ENV_FILE}"
        log_info "Get your API key from: https://www.voyageai.com/"
    fi
    
    return 0
}

# ───────────────────────────────────────────────────────────────────
# 7. VERIFICATION
# ───────────────────────────────────────────────────────────────────

verify_installation() {
    log_step "Verifying Narsil installation..."
    
    echo ""
    
    # Check binary
    if command -v narsil-mcp &> /dev/null; then
        local version
        version=$(narsil-mcp --version 2>/dev/null || echo "unknown")
        log_success "narsil-mcp binary: ${version}"
    else
        log_error "narsil-mcp binary not found in PATH"
        return 1
    fi
    
    # Check .utcp_config.json
    local project_root
    project_root=$(get_project_root) || true
    
    if [[ -n "${project_root}" ]]; then
        local config_file="${project_root}/${UTCP_CONFIG_FILE}"
        if [[ -f "${config_file}" ]] && check_narsil_configured; then
            log_success "Narsil configured in ${UTCP_CONFIG_FILE}"
        else
            log_warn "Narsil not configured in ${UTCP_CONFIG_FILE}"
        fi
    fi
    
    echo ""
    log_info "To verify via Code Mode, run in OpenCode:"
    echo "    search_tools({ task_description: \"narsil\" })"
    echo ""
    
    return 0
}

# ───────────────────────────────────────────────────────────────────
# 8. MAIN
# ───────────────────────────────────────────────────────────────────

main() {
    local install_method=""
    local skip_config=false
    local skip_wizard=false
    local voyage_key=""
    local force=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            -m|--method)
                install_method="$2"
                shift 2
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            --skip-config)
                skip_config=true
                shift
                ;;
            --skip-wizard)
                skip_wizard=true
                shift
                ;;
            --voyage-key)
                voyage_key="$2"
                shift 2
                ;;
            --force)
                force=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    show_banner
    
    # ───────────────────────────────────────────────────────────────────
    # PREREQUISITE CHECKS
    # ───────────────────────────────────────────────────────────────────
    log_step "Checking prerequisites..."
    
    # Check Node.js (needed for npm method and config validation)
    check_node_version "${MIN_NODE_VERSION}" || {
        log_warn "Node.js ${MIN_NODE_VERSION}+ is recommended"
    }
    
    # Check Code Mode
    if ! check_code_mode; then
        log_warn "Code Mode MCP not found in opencode.json"
        log_warn "Narsil is accessed via Code Mode - install Code Mode first for full functionality"
        echo ""
        read -rp "Continue anyway? [y/N]: " continue_install
        if [[ ! "${continue_install}" =~ ^[Yy]$ ]]; then
            log_info "Installation cancelled. Run install-code-mode.sh first."
            exit 0
        fi
    fi
    
    # Check if already installed
    if check_narsil_installed && [[ "${force}" != "true" ]]; then
        echo ""
        read -rp "Narsil is already installed. Reinstall? [y/N]: " reinstall
        if [[ ! "${reinstall}" =~ ^[Yy]$ ]]; then
            log_info "Skipping installation, proceeding to configuration check..."
            
            if [[ "${skip_config}" != "true" ]] && ! check_narsil_configured; then
                configure_utcp "${voyage_key}"
            fi
            
            verify_installation
            exit 0
        fi
    fi
    
    # ───────────────────────────────────────────────────────────────────
    # INSTALLATION METHOD SELECTION
    # ───────────────────────────────────────────────────────────────────
    if [[ -z "${install_method}" ]]; then
        show_install_methods
        
        read -rp "Which installation method? [1]: " install_method
        install_method="${install_method:-1}"
    fi
    
    # Validate method selection
    if [[ ! "${install_method}" =~ ^[1-4]$ ]]; then
        log_error "Invalid selection: ${install_method}. Please choose 1-4."
        exit 1
    fi
    
    # ───────────────────────────────────────────────────────────────────
    # PERFORM INSTALLATION
    # ───────────────────────────────────────────────────────────────────
    echo ""
    case "${install_method}" in
        1)
            install_via_npm || exit 1
            ;;
        2)
            install_via_homebrew || exit 1
            ;;
        3)
            install_via_oneclick || exit 1
            ;;
        4)
            install_via_cargo || exit 1
            ;;
    esac
    
    # ───────────────────────────────────────────────────────────────────
    # CONFIGURATION WIZARD
    # ───────────────────────────────────────────────────────────────────
    if [[ "${skip_wizard}" != "true" ]]; then
        echo ""
        read -rp "Run Narsil config wizard (recommended for first-time setup)? [Y/n]: " run_wizard
        if [[ ! "${run_wizard}" =~ ^[Nn]$ ]]; then
            run_config_wizard || log_warn "Config wizard had issues, continuing..."
        fi
    fi
    
    # ───────────────────────────────────────────────────────────────────
    # NEURAL SEARCH API KEY
    # ───────────────────────────────────────────────────────────────────
    if [[ -z "${voyage_key}" ]]; then
        echo ""
        echo "Narsil's neural search supports 3 embedding backends:"
        echo ""
        echo "  1) Voyage AI (RECOMMENDED) - Best for code search"
        echo "     Get API key: https://www.voyageai.com/"
        echo ""
        echo "  2) OpenAI - General purpose embeddings"
        echo "     Get API key: https://platform.openai.com/api-keys"
        echo "     (Manually edit .utcp_config.json to use OpenAI)"
        echo ""
        echo "  3) Local ONNX - No API key needed (runs offline)"
        echo "     (Manually edit .utcp_config.json: --neural-backend onnx)"
        echo ""
        echo "This installer configures Voyage AI by default."
        echo "(You can skip and configure manually later)"
        echo ""
        read -rp "Enter VOYAGE_API_KEY (or press Enter to skip): " voyage_key
    fi
    
    # ───────────────────────────────────────────────────────────────────
    # CONFIGURE .utcp_config.json
    # ───────────────────────────────────────────────────────────────────
    if [[ "${skip_config}" != "true" ]]; then
        configure_utcp "${voyage_key}" || log_warn "Failed to configure ${UTCP_CONFIG_FILE}"
        configure_env "${voyage_key}" || log_warn "Failed to configure ${ENV_FILE}"
    fi
    
    # ───────────────────────────────────────────────────────────────────
    # VERIFICATION
    # ───────────────────────────────────────────────────────────────────
    verify_installation
    
    echo ""
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│                    Installation Complete!                       │"
    echo "└─────────────────────────────────────────────────────────────────┘"
    echo ""
    log_success "Narsil MCP is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart OpenCode to load the new MCP"
    echo "  2. Test with: narsil.narsil_find_symbols({ path: \".\" })"
    echo "  3. For neural search, set one of these in .env:"
    echo "     - VOYAGE_API_KEY (recommended for code)"
    echo "     - OPENAI_API_KEY (general purpose)"
    echo "     - Or use --neural-backend onnx (no key needed)"
    echo ""
    echo "Useful commands:"
    echo "  narsil-mcp --help              Show all options"
    echo "  narsil-mcp config show         Show current configuration"
    echo "  narsil-mcp config init         Re-run configuration wizard"
    echo ""
}

# Run main
main "$@"
