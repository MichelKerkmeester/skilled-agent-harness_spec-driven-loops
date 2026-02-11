#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SHARED UTILITIES
# ───────────────────────────────────────────────────────────────
# Shared utility functions for MCP install scripts.
# Usage: source "${SCRIPT_DIR}/_utils.sh"

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. COLORS & FORMATTING
# ───────────────────────────────────────────────────────────────

# Check if stdout is a terminal (for color support)
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    DIM='\033[2m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    CYAN=''
    BOLD=''
    DIM=''
    NC=''
fi
readonly RED GREEN YELLOW BLUE CYAN BOLD DIM NC

# ───────────────────────────────────────────────────────────────
# 2. LOGGING FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Log file path (set by individual scripts if needed)
LOG_FILE="${LOG_FILE:-}"

_log() {
    local level="$1"
    local message="$2"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Log to file if LOG_FILE is set
    if [[ -n "$LOG_FILE" ]]; then
        echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    fi
}

log_info() {
    local message="$1"
    echo -e "${BLUE}[INFO]${NC} $message"
    _log "INFO" "$message"
}

log_success() {
    local message="$1"
    echo -e "${GREEN}[OK]${NC} $message"
    _log "SUCCESS" "$message"
}

log_warn() {
    local message="$1"
    echo -e "${YELLOW}[WARN]${NC} $message"
    _log "WARN" "$message"
}

log_error() {
    local message="$1"
    echo -e "${RED}[ERROR]${NC} $message" >&2
    _log "ERROR" "$message"
}

log_step() {
    local step="$1"
    local message="${2:-}"
    # If only one argument, treat it as the message
    if [[ -z "$message" ]]; then
        message="$step"
        echo -e "${CYAN}[STEP]${NC} $message"
        _log "STEP" "$message"
    else
        echo -e "${CYAN}[$step]${NC} $message"
        _log "STEP" "[$step] $message"
    fi
}

log_debug() {
    local message="$1"
    if [[ "${DEBUG:-}" == "1" ]]; then
        echo -e "${DIM}[DEBUG] $message${NC}"
        _log "DEBUG" "$message"
    fi
}

# ───────────────────────────────────────────────────────────────
# 3. PLATFORM DETECTION
# ───────────────────────────────────────────────────────────────

detect_platform() {
    local os
    os="$(uname -s)"
    
    case "$os" in
        Darwin)
            echo "macos"
            ;;
        Linux)
            echo "linux"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo "windows"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

detect_arch() {
    local arch
    arch="$(uname -m)"
    
    case "$arch" in
        x86_64|amd64)
            echo "x86_64"
            ;;
        arm64|aarch64)
            echo "arm64"
            ;;
        *)
            echo "$arch"
            ;;
    esac
}

# ───────────────────────────────────────────────────────────────
# 4. PREREQUISITE CHECKS
# ───────────────────────────────────────────────────────────────

check_command() {
    local cmd="$1"
    local name="${2:-$cmd}"
    
    if command -v "$cmd" &> /dev/null; then
        log_debug "$name found: $(command -v "$cmd")"
        return 0
    else
        log_debug "$name not found"
        return 1
    fi
}

check_node_version() {
    local min_version="${1:-18}"
    
    if ! check_command "node" "Node.js"; then
        log_error "Node.js is not installed"
        log_info "Install Node.js 18+ from: https://nodejs.org/"
        return 1
    fi
    
    local node_version
    node_version=$(node --version | sed 's/v//' | cut -d. -f1)
    
    if [[ "$node_version" -lt "$min_version" ]]; then
        log_error "Node.js version $min_version+ required (found: v$node_version)"
        return 1
    fi
    
    log_success "Node.js v$(node --version | sed 's/v//') detected"
    return 0
}

check_npx() {
    if ! check_command "npx"; then
        log_error "npx is not available"
        log_info "npx should be included with Node.js/npm"
        return 1
    fi
    
    log_success "npx is available"
    return 0
}

check_npm() {
    if ! check_command "npm"; then
        log_error "npm is not installed"
        return 1
    fi
    
    log_success "npm v$(npm --version) detected"
    return 0
}

check_jq() {
    if check_command "jq"; then
        log_debug "jq is available"
        return 0
    fi
    return 1
}

# Check if Code Mode MCP is configured in opencode.json
check_code_mode() {
    local project_root
    project_root="$(find_project_root 2>/dev/null)" || project_root="."
    local opencode_json="${project_root}/opencode.json"
    
    if [[ ! -f "$opencode_json" ]]; then
        log_error "opencode.json not found"
        return 1
    fi
    
    if json_has_key "$opencode_json" ".mcp.code_mode"; then
        log_success "Code Mode MCP is configured in opencode.json"
        return 0
    fi
    
    log_error "Code Mode MCP is not configured in opencode.json"
    return 1
}

# ───────────────────────────────────────────────────────────────
# 5. JSON MANIPULATION
# ───────────────────────────────────────────────────────────────

# Check if a JSON file is valid
json_validate() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        log_error "File not found: $file"
        return 1
    fi
    
    if check_jq; then
        if jq empty "$file" 2>/dev/null; then
            return 0
        fi
    else
        # Fallback to Python
        if python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
            return 0
        fi
    fi
    
    log_error "Invalid JSON in: $file"
    return 1
}

# Add/update an entry in a JSON file
# Usage: json_set_value "file.json" ".key.subkey" "value"
json_set_value() {
    local file="$1"
    local path="$2"
    local value="$3"
    
    if check_jq; then
        local tmp
        tmp=$(mktemp)
        if jq "$path = $value" "$file" > "$tmp" 2>/dev/null; then
            mv "$tmp" "$file"
            return 0
        fi
        rm -f "$tmp"
    fi
    
    # Fallback to Python
    python3 << EOF
import json
import sys

file_path = "$file"
json_path = "$path".lstrip('.')
value = json.loads('''$value''')

with open(file_path, 'r') as f:
    data = json.load(f)

# Navigate and set the value
keys = json_path.split('.')
current = data
for key in keys[:-1]:
    if key not in current:
        current[key] = {}
    current = current[key]
current[keys[-1]] = value

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)
EOF
}

# Create directory if it doesn't exist
# Usage: ensure_dir "/path/to/dir"
ensure_dir() {
    local path="$1"
    
    if [[ ! -d "$path" ]]; then
        mkdir -p "$path"
        log_debug "Created directory: $path"
    fi
}

# Check if a key exists in JSON
# Usage: json_has_key "file.json" ".key.subkey"
json_has_key() {
    local file="$1"
    local path="$2"
    
    if check_jq; then
        if jq -e "$path" "$file" &>/dev/null; then
            return 0
        fi
        return 1
    fi
    
    # Fallback to Python
    python3 << EOF
import json
import sys

file_path = "$file"
json_path = "$path".lstrip('.')

try:
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    keys = json_path.split('.')
    current = data
    for key in keys:
        current = current[key]
    sys.exit(0)
except (KeyError, TypeError):
    sys.exit(1)
EOF
}

# Add MCP server entry to opencode.json
# Usage: json_add_mcp_entry "server_name" "command" '["arg1", "arg2"]' '{"KEY": "value"}'
# Creates opencode.json if it doesn't exist, validates JSON before and after
json_add_mcp_entry() {
    local name="$1"
    local command="$2"
    local args_json="${3:-'[]'}"
    local env_json="${4:-'{}'}"
    
    local project_root
    project_root="$(find_project_root 2>/dev/null)" || project_root="."
    local opencode_json="${project_root}/opencode.json"
    
    # Create minimal opencode.json if not exists
    if [[ ! -f "$opencode_json" ]]; then
        log_info "Creating opencode.json..."
        echo '{"mcp":{}}' > "$opencode_json"
    fi
    
    # Validate before modification
    if ! json_validate "$opencode_json"; then
        log_error "opencode.json is invalid, cannot add MCP entry"
        return 1
    fi
    
    # Backup before modification
    backup_file "$opencode_json" >/dev/null
    
    if check_jq; then
        local tmp
        tmp=$(mktemp)
        
        if jq --arg name "$name" \
           --arg cmd "$command" \
           --argjson args "$args_json" \
           --argjson env "$env_json" \
           '.mcp //= {} | .mcp[$name] = {
               "type": "local",
               "command": ([$cmd] + $args),
               "environment": $env,
               "enabled": true
           }' "$opencode_json" > "$tmp" 2>/dev/null; then
            if json_validate "$tmp"; then
                mv "$tmp" "$opencode_json"
                log_success "Added MCP entry '$name' to opencode.json"
                return 0
            fi
        fi
        rm -f "$tmp"
    fi
    
    # Fallback to Python
    python3 << EOF
import json
import sys

name = "$name"
command = "$command"
args = json.loads('$args_json')
env = json.loads('$env_json')

try:
    with open("$opencode_json", "r") as f:
        data = json.load(f)
except:
    data = {}

if "mcp" not in data:
    data["mcp"] = {}

data["mcp"][name] = {
    "type": "local",
    "command": [command] + args,
    "environment": env,
    "enabled": True
}

with open("$opencode_json", "w") as f:
    json.dump(data, f, indent=2)
EOF
    
    if json_validate "$opencode_json"; then
        log_success "Added MCP entry '$name' to opencode.json"
        return 0
    fi
    
    log_error "Failed to add MCP entry"
    return 1
}

# Add provider entry to .utcp_config.json
# Usage: json_add_utcp_entry "name" "stdio" "command" '["arg1", "arg2"]' '{"KEY": "value"}'
# Creates .utcp_config.json if it doesn't exist
json_add_utcp_entry() {
    local name="$1"
    local transport_type="${2:-stdio}"
    local command="$3"
    local args_json="${4:-'[]'}"
    local env_json="${5:-'{}'}"
    
    local project_root
    project_root="$(find_project_root 2>/dev/null)" || project_root="."
    local utcp_config="${project_root}/.utcp_config.json"
    
    # Create minimal .utcp_config.json if not exists
    if [[ ! -f "$utcp_config" ]]; then
        log_info "Creating .utcp_config.json..."
        cat > "$utcp_config" << 'UTCPEOF'
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
UTCPEOF
    fi
    
    # Validate before modification
    if ! json_validate "$utcp_config"; then
        log_error ".utcp_config.json is invalid, cannot add UTCP entry"
        return 1
    fi
    
    # Backup before modification
    backup_file "$utcp_config" >/dev/null
    
    if check_jq; then
        local tmp
        tmp=$(mktemp)
        
        if jq --arg name "$name" \
           --arg transport "$transport_type" \
           --arg cmd "$command" \
           --argjson args "$args_json" \
           --argjson env "$env_json" \
           '.manual_call_templates += [{
               "name": $name,
               "call_template_type": "mcp",
               "config": {
                   "mcpServers": {
                       ($name): {
                           "transport": $transport,
                           "command": $cmd,
                           "args": $args,
                           "env": $env
                       }
                   }
               }
           }]' "$utcp_config" > "$tmp" 2>/dev/null; then
            if json_validate "$tmp"; then
                mv "$tmp" "$utcp_config"
                log_success "Added UTCP entry '$name' to .utcp_config.json"
                return 0
            fi
        fi
        rm -f "$tmp"
    fi
    
    # Fallback to Python
    python3 << EOF
import json

name = "$name"
transport = "$transport_type"
command = "$command"
args = json.loads('$args_json')
env = json.loads('$env_json')

try:
    with open("$utcp_config", "r") as f:
        data = json.load(f)
except:
    data = {
        "load_variables_from": [{"variable_loader_type": "dotenv", "env_file_path": ".env"}],
        "tool_repository": {"tool_repository_type": "in_memory"},
        "tool_search_strategy": {"tool_search_strategy_type": "tag_and_description_word_match"},
        "manual_call_templates": []
    }

if "manual_call_templates" not in data:
    data["manual_call_templates"] = []

new_entry = {
    "name": name,
    "call_template_type": "mcp",
    "config": {
        "mcpServers": {
            name: {
                "transport": transport,
                "command": command,
                "args": args,
                "env": env
            }
        }
    }
}

data["manual_call_templates"].append(new_entry)

with open("$utcp_config", "w") as f:
    json.dump(data, f, indent=2)
EOF
    
    if json_validate "$utcp_config"; then
        log_success "Added UTCP entry '$name' to .utcp_config.json"
        return 0
    fi
    
    log_error "Failed to add UTCP entry"
    return 1
}

# ───────────────────────────────────────────────────────────────
# 6. FILE OPERATIONS
# ───────────────────────────────────────────────────────────────

# Backup a file before modification
backup_file() {
    local file="$1"
    local backup="${file}.bak.$(date +%Y%m%d_%H%M%S)"
    
    if [[ -f "$file" ]]; then
        cp "$file" "$backup"
        log_debug "Backed up $file to $backup"
        echo "$backup"
    fi
}

# Find project root (directory containing opencode.json)
find_project_root() {
    local dir="$PWD"
    
    while [[ "$dir" != "/" ]]; do
        if [[ -f "$dir/opencode.json" ]]; then
            echo "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    
    log_error "Could not find project root (no opencode.json found)"
    return 1
}

# Alias for find_project_root (for compatibility)
get_project_root() {
    find_project_root "$@"
}

# Check if an MCP entry exists in opencode.json
# Usage: mcp_entry_exists "opencode.json" "mcp_name"
mcp_entry_exists() {
    local file="$1"
    local name="$2"
    
    if [[ ! -f "$file" ]]; then
        return 1
    fi
    
    json_has_key "$file" ".mcp.${name}"
}

# Add MCP entry to opencode.json
# Usage: add_mcp_entry "opencode.json" "mcp_name" '{"type": "local", ...}'
add_mcp_entry() {
    local file="$1"
    local name="$2"
    local config_json="$3"
    
    if [[ ! -f "$file" ]]; then
        log_error "File not found: $file"
        return 1
    fi
    
    # Backup before modification
    backup_file "$file" >/dev/null
    
    if check_jq; then
        local tmp
        tmp=$(mktemp)
        
        if jq --arg name "$name" --argjson config "$config_json" \
           '.mcp //= {} | .mcp[$name] = $config' "$file" > "$tmp" 2>/dev/null; then
            if json_validate "$tmp"; then
                mv "$tmp" "$file"
                return 0
            fi
        fi
        rm -f "$tmp"
    fi
    
    # Fallback to Python
    python3 << EOF
import json
import sys

file_path = "$file"
name = "$name"
config = json.loads('''$config_json''')

try:
    with open(file_path, 'r') as f:
        data = json.load(f)
except:
    data = {}

if 'mcp' not in data:
    data['mcp'] = {}

data['mcp'][name] = config

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)
EOF
    
    return $?
}

# ───────────────────────────────────────────────────────────────
# 7. USER INTERACTION
# ───────────────────────────────────────────────────────────────

# Prompt for confirmation
# Usage: confirm "Are you sure?" && do_something
confirm() {
    local prompt="${1:-Continue?}"
    local default="${2:-n}"
    
    local yn_prompt
    if [[ "$default" == "y" ]]; then
        yn_prompt="[Y/n]"
    else
        yn_prompt="[y/N]"
    fi
    
    local response
    read -r -p "$prompt $yn_prompt: " response
    response="${response:-$default}"
    
    case "$response" in
        [yY]|[yY][eE][sS])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Prompt for a value with a default
# Usage: value=$(prompt_value "Enter API key" "default_value")
prompt_value() {
    local prompt="$1"
    local default="${2:-}"
    
    local display_default=""
    if [[ -n "$default" ]]; then
        display_default=" [$default]"
    fi
    
    local value
    read -r -p "$prompt$display_default: " value
    echo "${value:-$default}"
}

# Prompt for a secret (no echo)
# Usage: secret=$(prompt_secret "Enter API key")
prompt_secret() {
    local prompt="$1"
    local secret
    
    read -r -s -p "$prompt: " secret
    echo ""  # New line after hidden input
    echo "$secret"
}

# Prompt for a choice from options
# Usage: choice=$(prompt_choice "Select option" "A" "B" "C")
prompt_choice() {
    local prompt="$1"
    shift
    local options=("$@")
    local default="${options[0]}"
    
    echo "$prompt"
    for i in "${!options[@]}"; do
        local opt="${options[$i]}"
        if [[ $i -eq 0 ]]; then
            echo "  $opt (default)"
        else
            echo "  $opt"
        fi
    done
    
    local choice
    read -r -p "Choice [$default]: " choice
    choice="${choice:-$default}"
    
    # Validate choice
    for opt in "${options[@]}"; do
        if [[ "${choice^^}" == "${opt:0:1}" || "${choice^^}" == "${opt^^}" ]]; then
            echo "${opt:0:1}"
            return 0
        fi
    done
    
    # Default if invalid
    echo "${default:0:1}"
}

# Alias for confirm (matches spec naming)
confirm_action() {
    confirm "$@"
}

# ───────────────────────────────────────────────────────────────
# 8. ENVIRONMENT & CONFIG
# ───────────────────────────────────────────────────────────────

# Add a variable to .env file (creates if not exists)
# Usage: env_add_var ".env" "VAR_NAME" "value"
env_add_var() {
    local env_file="$1"
    local var_name="$2"
    local var_value="$3"
    
    # Create .env if it doesn't exist
    touch "$env_file"
    
    # Check if variable already exists
    if grep -q "^${var_name}=" "$env_file" 2>/dev/null; then
        # Update existing
        if [[ "$(detect_platform)" == "macos" ]]; then
            sed -i '' "s|^${var_name}=.*|${var_name}=${var_value}|" "$env_file"
        else
            sed -i "s|^${var_name}=.*|${var_name}=${var_value}|" "$env_file"
        fi
        log_debug "Updated $var_name in $env_file"
    else
        # Add new
        echo "${var_name}=${var_value}" >> "$env_file"
        log_debug "Added $var_name to $env_file"
    fi
}

# Check if .env has a variable set (non-empty)
# Usage: env_has_var ".env" "VAR_NAME"
env_has_var() {
    local env_file="$1"
    local var_name="$2"
    
    if [[ -f "$env_file" ]]; then
        if grep -q "^${var_name}=.\+" "$env_file" 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────
# 9. VERIFICATION
# ───────────────────────────────────────────────────────────────

# Verify a command runs successfully
# Usage: verify_command "npx -y package --help"
verify_command() {
    local cmd="$1"
    local description="${2:-command}"
    
    log_info "Verifying $description..."
    
    if eval "$cmd" &>/dev/null; then
        log_success "$description verified"
        return 0
    else
        log_error "$description verification failed"
        return 1
    fi
}

# ───────────────────────────────────────────────────────────────
# 10. HELP & USAGE
# ───────────────────────────────────────────────────────────────

# Show script header
show_header() {
    local name="$1"
    local description="$2"
    
    echo ""
    echo -e "${BOLD}$name${NC}"
    echo "$description"
    echo ""
}

# Standard help footer
show_help_footer() {
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  --log FILE     Log output to FILE"
    echo "  --debug        Enable debug output"
    echo ""
    echo "Environment:"
    echo "  DEBUG=1        Enable debug output"
    echo ""
}
