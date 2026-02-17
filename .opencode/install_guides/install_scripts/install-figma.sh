#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: FIGMA MCP INSTALLER
# ───────────────────────────────────────────────────────────────
# Installs the Figma MCP server with two available options:
#   A) Official Figma MCP - HTTP remote server with OAuth (RECOMMENDED)
#   B) Framelink - Third-party local server with API key
#
# Usage: ./install-figma.sh [OPTIONS]
#
# Options:
#   -h, --help        Show help message
#   -a, --official    Install Official Figma MCP (Option A)
#   -b, --framelink   Install Framelink (Option B)
#   --log FILE        Log output to FILE
#   --debug           Enable debug output

set -euo pipefail
IFS=$'\n\t'

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

readonly MCP_NAME="Figma"
readonly MIN_NODE_VERSION="18"

# Official Figma MCP
readonly FIGMA_OFFICIAL_URL="https://mcp.figma.com/mcp"
readonly FIGMA_OFFICIAL_DOCS="https://developers.figma.com/docs/figma-mcp-server/"

# Framelink (third-party)
readonly FRAMELINK_PACKAGE="figma-developer-mcp"
readonly FRAMELINK_REPO="https://github.com/GLips/Figma-Context-MCP"

# ───────────────────────────────────────────────────────────────
# 2. HELP
# ───────────────────────────────────────────────────────────────

show_help() {
    show_header "install-figma.sh" "Install Figma MCP Server for OpenCode"
    
    cat << EOF
DESCRIPTION
    This script installs the Figma MCP server with two available options:

    Option A: Official Figma MCP (RECOMMENDED)
        - Hosted by Figma at mcp.figma.com
        - Uses OAuth authentication (browser login)
        - No local installation required
        - Adds HTTP server config to opencode.json

    Option B: Framelink (Third-Party)
        - Runs locally via npx
        - Requires Figma API key (Personal Access Token)
        - More features for power users
        - Adds config to .utcp_config.json (for Code Mode)

USAGE
    ./install-figma.sh              Interactive mode (prompts for choice)
    ./install-figma.sh -a           Install Official Figma MCP
    ./install-figma.sh -b           Install Framelink

OPTIONS
    -a, --official    Install Official Figma MCP (Option A)
    -b, --framelink   Install Framelink (Option B)
    -h, --help        Show this help message
    --log FILE        Log output to FILE
    --debug           Enable debug output

RESOURCES
    Official Figma MCP: ${FIGMA_OFFICIAL_DOCS}
    Framelink GitHub:   ${FRAMELINK_REPO}

EOF
    show_help_footer
}

# ───────────────────────────────────────────────────────────────
# 3. OPTION DISPLAY
# ───────────────────────────────────────────────────────────────

show_options() {
    echo ""
    echo -e "${BOLD}Figma MCP Installation Options:${NC}"
    echo ""
    echo -e "  ${GREEN}A)${NC} Official Figma MCP ${CYAN}(RECOMMENDED)${NC}"
    echo "     - No installation needed"
    echo "     - Uses OAuth (browser login)"
    echo "     - Hosted by Figma at mcp.figma.com"
    echo ""
    echo -e "  ${YELLOW}B)${NC} Framelink (Third-Party)"
    echo "     - Runs locally via npx"
    echo "     - Requires Figma API key"
    echo "     - Package: figma-developer-mcp"
    echo ""
}

# ───────────────────────────────────────────────────────────────
# 4. OPTION A: OFFICIAL FIGMA MCP
# ───────────────────────────────────────────────────────────────

install_official() {
    log_step "1/3" "Configuring Official Figma MCP..."
    
    local project_root
    project_root=$(find_project_root)
    local opencode_json="${project_root}/opencode.json"
    
    # Validate opencode.json exists
    if [[ ! -f "$opencode_json" ]]; then
        log_error "opencode.json not found at: $opencode_json"
        log_info "Run this script from a directory containing opencode.json"
        return 1
    fi
    
    # Validate JSON before modification
    if ! json_validate "$opencode_json"; then
        log_error "opencode.json contains invalid JSON"
        return 1
    fi
    
    # Backup before modification
    log_step "2/3" "Backing up opencode.json..."
    backup_file "$opencode_json"
    
    # Check if figma entry already exists in mcp section
    if json_has_key "$opencode_json" ".mcp.figma"; then
        log_warn "Figma MCP entry already exists in opencode.json"
        if ! confirm "Overwrite existing configuration?"; then
            log_info "Installation cancelled"
            return 0
        fi
    fi
    
    log_step "3/3" "Adding Figma MCP configuration..."
    
    # Add HTTP server configuration
    # Using Python for reliable JSON manipulation
    python3 << EOF
import json

config_path = "$opencode_json"

with open(config_path, 'r') as f:
    config = json.load(f)

# Ensure mcp section exists
if 'mcp' not in config:
    config['mcp'] = {}

# Add Figma HTTP server configuration
config['mcp']['figma'] = {
    "type": "http",
    "url": "$FIGMA_OFFICIAL_URL",
    "enabled": True,
    "_note": "Official Figma MCP - authenticate via browser on first use"
}

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)
    f.write('\n')  # Trailing newline

print("Configuration added successfully")
EOF
    
    # Validate JSON after modification
    if ! json_validate "$opencode_json"; then
        log_error "JSON validation failed after modification!"
        log_info "Restoring from backup..."
        # Find most recent backup
        local backup
        backup=$(ls -t "${opencode_json}.bak."* 2>/dev/null | head -1)
        if [[ -n "$backup" ]]; then
            cp "$backup" "$opencode_json"
            log_info "Restored from: $backup"
        fi
        return 1
    fi
    
    log_success "Official Figma MCP configured successfully!"
    echo ""
    echo -e "${BOLD}Next Steps:${NC}"
    echo "  1. Restart OpenCode to load the new MCP"
    echo "  2. When you first use Figma tools, a browser window will open"
    echo "  3. Log in to your Figma account to authenticate"
    echo ""
    echo -e "${DIM}Documentation: ${FIGMA_OFFICIAL_DOCS}${NC}"
    
    return 0
}

# ───────────────────────────────────────────────────────────────
# 5. OPTION B: FRAMELINK
# ───────────────────────────────────────────────────────────────

check_code_mode() {
    local project_root
    project_root=$(find_project_root)
    local utcp_config="${project_root}/.utcp_config.json"
    
    if [[ -f "$utcp_config" ]]; then
        log_success "Code Mode configuration found (.utcp_config.json)"
        return 0
    else
        log_warn "Code Mode configuration not found"
        log_info "Framelink works best with Code Mode for tool orchestration"
        log_info "Consider running install-code-mode.sh first"
        return 1
    fi
}

install_framelink() {
    log_step "1/5" "Checking prerequisites..."
    
    # Check Node.js
    if ! check_node_version "$MIN_NODE_VERSION"; then
        return 1
    fi
    
    # Check npx
    if ! check_npx; then
        return 1
    fi
    
    local project_root
    project_root=$(find_project_root)
    local utcp_config="${project_root}/.utcp_config.json"
    local env_file="${project_root}/.env"
    
    # Check/warn about Code Mode
    log_step "2/5" "Checking Code Mode..."
    local has_code_mode=false
    if check_code_mode; then
        has_code_mode=true
    fi
    
    if [[ "$has_code_mode" == "false" ]]; then
        if ! confirm "Continue without Code Mode?"; then
            log_info "Installation cancelled"
            log_info "Run install-code-mode.sh first, then try again"
            return 0
        fi
    fi
    
    # Get API key
    log_step "3/5" "Configuring Figma API key..."
    
    local api_key=""
    
    # Check if already in .env
    if env_has_var "$env_file" "FIGMA_API_KEY"; then
        log_info "FIGMA_API_KEY already set in .env"
        if ! confirm "Use existing API key?"; then
            api_key=$(prompt_secret "Enter Figma Personal Access Token")
        fi
    else
        echo ""
        echo -e "${BOLD}Figma API Key Required${NC}"
        echo "  1. Go to: https://www.figma.com/developers/api#access-tokens"
        echo "  2. Click 'Get personal access token'"
        echo "  3. Copy and paste the token below"
        echo ""
        api_key=$(prompt_secret "Enter Figma Personal Access Token")
        
        if [[ -z "$api_key" ]]; then
            log_error "API key is required for Framelink"
            return 1
        fi
        
        # Save to .env
        log_step "4/5" "Saving API key to .env..."
        env_add_var "$env_file" "FIGMA_API_KEY" "$api_key"
        log_success "API key saved to .env"
        
        # Ensure .env is in .gitignore
        local gitignore="${project_root}/.gitignore"
        if [[ -f "$gitignore" ]]; then
            if ! grep -q "^\.env$" "$gitignore" 2>/dev/null; then
                echo ".env" >> "$gitignore"
                log_info "Added .env to .gitignore"
            fi
        fi
    fi
    
    # Add to .utcp_config.json
    log_step "5/5" "Adding Framelink configuration..."
    
    if [[ "$has_code_mode" == "true" ]]; then
        # Add to .utcp_config.json for Code Mode
        
        # Create or update .utcp_config.json
        if [[ ! -f "$utcp_config" ]]; then
            # Create minimal config
            cat > "$utcp_config" << 'EOFUTCP'
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
EOFUTCP
            log_info "Created .utcp_config.json"
        fi
        
        # Backup
        backup_file "$utcp_config"
        
        # Add Figma entry
        python3 << EOF
import json

config_path = "$utcp_config"

with open(config_path, 'r') as f:
    config = json.load(f)

# Ensure manual_call_templates exists
if 'manual_call_templates' not in config:
    config['manual_call_templates'] = []

# Check if figma already exists
figma_exists = False
for i, template in enumerate(config['manual_call_templates']):
    if template.get('name') == 'figma':
        figma_exists = True
        # Update existing
        config['manual_call_templates'][i] = {
            "name": "figma",
            "call_template_type": "mcp",
            "config": {
                "mcpServers": {
                    "figma": {
                        "transport": "stdio",
                        "command": "npx",
                        "args": ["-y", "figma-developer-mcp", "--stdio"],
                        "env": {
                            "FIGMA_API_KEY": "\${FIGMA_API_KEY}"
                        }
                    }
                }
            }
        }
        break

if not figma_exists:
    config['manual_call_templates'].append({
        "name": "figma",
        "call_template_type": "mcp",
        "config": {
            "mcpServers": {
                "figma": {
                    "transport": "stdio",
                    "command": "npx",
                    "args": ["-y", "figma-developer-mcp", "--stdio"],
                    "env": {
                        "FIGMA_API_KEY": "\${FIGMA_API_KEY}"
                    }
                }
            }
        }
    })

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)
    f.write('\n')

print("Configuration added successfully")
EOF
        
        # Validate
        if ! json_validate "$utcp_config"; then
            log_error "JSON validation failed!"
            return 1
        fi
        
        log_success "Framelink configured in .utcp_config.json"
    else
        # Add directly to opencode.json as standalone
        local opencode_json="${project_root}/opencode.json"
        
        if [[ ! -f "$opencode_json" ]]; then
            log_error "opencode.json not found"
            return 1
        fi
        
        backup_file "$opencode_json"
        
        python3 << EOF
import json

config_path = "$opencode_json"

with open(config_path, 'r') as f:
    config = json.load(f)

# Ensure mcp section exists
if 'mcp' not in config:
    config['mcp'] = {}

# Add Figma Framelink configuration
config['mcp']['figma'] = {
    "type": "local",
    "command": ["npx", "-y", "figma-developer-mcp", "--stdio"],
    "environment": {
        "FIGMA_API_KEY": "\${FIGMA_API_KEY}"
    },
    "enabled": True,
    "_note": "Framelink MCP - requires FIGMA_API_KEY in .env"
}

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)
    f.write('\n')

print("Configuration added successfully")
EOF
        
        if ! json_validate "$opencode_json"; then
            log_error "JSON validation failed!"
            return 1
        fi
        
        log_success "Framelink configured in opencode.json"
    fi
    
    # Verification
    echo ""
    log_success "Framelink Figma MCP configured successfully!"
    echo ""
    echo -e "${BOLD}Next Steps:${NC}"
    echo "  1. Restart OpenCode to load the new MCP"
    if [[ "$has_code_mode" == "true" ]]; then
        echo "  2. Verify with Code Mode: search_tools({ task_description: \"figma\" })"
    else
        echo "  2. The MCP will be available via Figma tools"
    fi
    echo ""
    echo -e "${DIM}Documentation: ${FRAMELINK_REPO}${NC}"
    
    return 0
}

# ───────────────────────────────────────────────────────────────
# 6. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    local option=""
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            -a|--official)
                option="A"
                shift
                ;;
            -b|--framelink)
                option="B"
                shift
                ;;
            --log)
                LOG_FILE="$2"
                shift 2
                ;;
            --debug)
                DEBUG=1
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information" >&2
                exit 1
                ;;
        esac
    done
    
    show_header "Figma MCP Installer" "Install Figma MCP Server for OpenCode"
    
    # If no option specified, show interactive menu
    if [[ -z "$option" ]]; then
        show_options
        read -r -p "Which option? [A/b]: " choice
        choice="${choice:-A}"
        option="${choice^^}"  # Uppercase
    fi
    
    # Execute selected option
    case "$option" in
        A)
            log_info "Installing Official Figma MCP..."
            install_official
            ;;
        B)
            log_info "Installing Framelink..."
            install_framelink
            ;;
        *)
            log_error "Invalid option: $option"
            show_options
            exit 1
            ;;
    esac
}

# Run main if not sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
