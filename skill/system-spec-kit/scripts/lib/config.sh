#!/usr/bin/env bash
#
# config.sh - Configuration Loading for SpecKit Validation
#
# Loads configuration from .speckit.yaml, environment variables, and defaults.
# Provides glob pattern matching utilities for path filtering.
#
# VERSION: 1.0.0
# CREATED: 2024-12-24
#
# USAGE: source "$SCRIPT_DIR/lib/config.sh"
#
# PRIORITY: CLI args > Environment vars > Config file > Defaults
#

# ============================================================================
# DEFAULT CONFIGURATION
# ============================================================================

# Rule severity: error | warn | info | skip
declare -A CONFIG_RULES=(
    ["FILE_EXISTS"]="error"
    ["PLACEHOLDER_FILLED"]="error"
    ["SECTIONS_PRESENT"]="warn"
    ["LEVEL_DECLARED"]="info"
    ["PRIORITY_TAGS"]="warn"
    ["EVIDENCE_CITED"]="warn"
    ["ANCHORS_VALID"]="error"
)

# Paths to skip during validation (glob patterns)
declare -a CONFIG_SKIP_PATHS=(
    "**/scratch/**"
    "**/memory/**"
    "**/templates/**"
)

# Rule execution order (empty = alphabetical)
declare -a CONFIG_RULE_ORDER=()

# Config file search result
CONFIG_FILE_PATH=""

# ============================================================================
# CONFIG FILE DISCOVERY
# ============================================================================

# find_config_file(folder)
# Find .speckit.yaml configuration file.
# Searches: 1) spec folder, 2) project root (git root or cwd)
# Args: $1 - spec folder path
# Returns: Path to config file or empty string
find_config_file() {
    local folder="${1:-.}"
    
    # Priority 1: Check spec folder itself
    if [[ -f "$folder/.speckit.yaml" ]]; then
        echo "$folder/.speckit.yaml"
        return
    fi
    
    # Priority 2: Check project root
    local project_root
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        project_root="$(git rev-parse --show-toplevel)"
    else
        project_root="$(pwd)"
    fi
    
    if [[ -f "$project_root/.speckit.yaml" ]]; then
        echo "$project_root/.speckit.yaml"
        return
    fi
    
    # No config file found
    echo ""
}

# ============================================================================
# CONFIG FILE PARSING
# ============================================================================

# load_config(folder)
# Load configuration from .speckit.yaml if present.
# Uses yq if available, falls back to grep/awk parsing.
# Args: $1 - spec folder path
load_config() {
    local folder="${1:-.}"
    
    CONFIG_FILE_PATH="$(find_config_file "$folder")"
    
    # No config file - use defaults
    [[ -z "$CONFIG_FILE_PATH" ]] && return 0
    
    # Parse config file
    if command -v yq >/dev/null 2>&1; then
        _parse_config_yq "$CONFIG_FILE_PATH"
    else
        _parse_config_fallback "$CONFIG_FILE_PATH"
    fi
}

# _parse_config_yq(config_path)
# Parse config using yq (preferred method).
_parse_config_yq() {
    local config="$1"
    
    # Load rule severities
    local rules
    rules=$(yq -r '.validation.rules // {} | to_entries | .[] | "\(.key)=\(.value)"' "$config" 2>/dev/null || true)
    
    while IFS='=' read -r key value; do
        [[ -n "$key" && -n "$value" ]] && CONFIG_RULES["$key"]="$value"
    done <<< "$rules"
    
    # Load skip paths
    local skip_paths
    skip_paths=$(yq -r '.validation.skip[]? // empty' "$config" 2>/dev/null || true)
    
    if [[ -n "$skip_paths" ]]; then
        CONFIG_SKIP_PATHS=()
        while IFS= read -r path; do
            [[ -n "$path" ]] && CONFIG_SKIP_PATHS+=("$path")
        done <<< "$skip_paths"
    fi
    
    # Load rule execution order
    local rule_order
    rule_order=$(yq -r '.validation.rule_order[]? // empty' "$config" 2>/dev/null || true)
    
    if [[ -n "$rule_order" ]]; then
        CONFIG_RULE_ORDER=()
        while IFS= read -r rule; do
            [[ -n "$rule" ]] && CONFIG_RULE_ORDER+=("$rule")
        done <<< "$rule_order"
    fi
}

# _parse_config_fallback(config_path)
# Parse config using grep/awk (fallback when yq unavailable).
_parse_config_fallback() {
    local config="$1"
    local in_rules=false
    local in_skip=false
    local in_order=false
    
    while IFS= read -r line; do
        # Detect section changes
        if [[ "$line" =~ ^[[:space:]]*rules: ]]; then
            in_rules=true; in_skip=false; in_order=false; continue
        elif [[ "$line" =~ ^[[:space:]]*skip: ]]; then
            in_rules=false; in_skip=true; in_order=false
            CONFIG_SKIP_PATHS=()  # Reset to load from file
            continue
        elif [[ "$line" =~ ^[[:space:]]*rule_order: ]]; then
            in_rules=false; in_skip=false; in_order=true
            CONFIG_RULE_ORDER=()  # Reset to load from file
            continue
        elif [[ "$line" =~ ^[[:alpha:]] ]]; then
            in_rules=false; in_skip=false; in_order=false; continue
        fi
        
        # Parse rule entries (e.g., "    FILE_EXISTS: error")
        if $in_rules && [[ "$line" =~ ^[[:space:]]+([A-Z_]+):[[:space:]]*([a-z]+) ]]; then
            CONFIG_RULES["${BASH_REMATCH[1]}"]="${BASH_REMATCH[2]}"
        fi
        
        # Parse skip entries (e.g., "    - **/scratch/**")
        if $in_skip && [[ "$line" =~ ^[[:space:]]+-[[:space:]]+(.+) ]]; then
            CONFIG_SKIP_PATHS+=("${BASH_REMATCH[1]}")
        fi
        
        # Parse rule order entries (e.g., "    - FILE_EXISTS")
        if $in_order && [[ "$line" =~ ^[[:space:]]+-[[:space:]]+([A-Z_]+) ]]; then
            CONFIG_RULE_ORDER+=("${BASH_REMATCH[1]}")
        fi
    done < "$config"
}

# ============================================================================
# ENVIRONMENT VARIABLE OVERRIDES
# ============================================================================

# apply_env_overrides()
# Apply environment variable overrides.
# Called after config file loading but before CLI arg processing.
apply_env_overrides() {
    # SPECKIT_VALIDATION=false - disable validation entirely
    if [[ "${SPECKIT_VALIDATION:-}" == "false" ]]; then
        echo "Validation disabled via SPECKIT_VALIDATION=false"
        exit 0
    fi
    
    # SPECKIT_STRICT=true - treat warnings as errors
    [[ "${SPECKIT_STRICT:-}" == "true" ]] && STRICT_MODE=true
    
    # SPECKIT_VERBOSE=true - enable verbose output
    [[ "${SPECKIT_VERBOSE:-}" == "true" ]] && VERBOSE=true
    
    # SPECKIT_JSON=true - force JSON output
    [[ "${SPECKIT_JSON:-}" == "true" ]] && JSON_MODE=true
    
    # SPECKIT_QUIET=true - suppress non-essential output
    [[ "${SPECKIT_QUIET:-}" == "true" ]] && QUIET_MODE=true
}

# ============================================================================
# GLOB PATTERN MATCHING
# ============================================================================

# glob_to_regex(pattern)
# Convert glob pattern to regex.
# Handles: ** (any path), * (single segment), ? (single char)
# Args: $1 - glob pattern
# Outputs: regex pattern
glob_to_regex() {
    local pattern="$1"
    local regex=""
    local i=0
    local len=${#pattern}
    
    while ((i < len)); do
        local char="${pattern:i:1}"
        local next="${pattern:i+1:1}"
        
        case "$char" in
            '*')
                if [[ "$next" == "*" ]]; then
                    # ** matches any path (including /)
                    regex+=".*"
                    ((i++))
                else
                    # * matches single segment (no /)
                    regex+="[^/]*"
                fi
                ;;
            '?')
                # ? matches single character (no /)
                regex+="[^/]"
                ;;
            '.'|'['|']'|'('|')'|'{'|'}'|'+'|'^'|'$'|'|'|'\\')
                # Escape regex special characters
                regex+="\\$char"
                ;;
            *)
                regex+="$char"
                ;;
        esac
        ((i++))
    done
    
    echo "^${regex}$"
}

# match_path_pattern(path, pattern)
# Test if path matches glob pattern.
# Args: $1 - path to test, $2 - glob pattern
# Returns: 0 if match, 1 if no match
match_path_pattern() {
    local path="$1"
    local pattern="$2"
    local regex
    
    regex="$(glob_to_regex "$pattern")"
    
    if [[ "$path" =~ $regex ]]; then
        return 0
    fi
    return 1
}

# should_skip_path(path)
# Check if path should be skipped based on CONFIG_SKIP_PATHS.
# Args: $1 - path to check
# Returns: 0 if should skip, 1 if should process
should_skip_path() {
    local path="$1"
    
    for pattern in "${CONFIG_SKIP_PATHS[@]}"; do
        if match_path_pattern "$path" "$pattern"; then
            return 0
        fi
    done
    
    return 1
}

# ============================================================================
# RULE CONFIGURATION ACCESS
# ============================================================================

# get_rule_severity(rule_name)
# Get configured severity for a rule.
# Args: $1 - rule name (e.g., FILE_EXISTS)
# Returns: Severity level (error|warn|info|skip), defaults to "error"
get_rule_severity() {
    local rule_name="$1"
    echo "${CONFIG_RULES[$rule_name]:-error}"
}

# should_run_rule(rule_name)
# Check if a rule should be executed.
# Args: $1 - rule name
# Returns: 0 if should run, 1 if severity is "skip"
should_run_rule() {
    local rule_name="$1"
    local severity
    
    severity="$(get_rule_severity "$rule_name")"
    
    [[ "$severity" == "skip" ]] && return 1
    return 0
}
