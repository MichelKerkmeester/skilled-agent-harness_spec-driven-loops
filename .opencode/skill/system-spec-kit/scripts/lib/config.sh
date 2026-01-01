#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# LIB: CONFIGURATION LOADER
# ───────────────────────────────────────────────────────────────
#
# Loads config from .speckit.yaml, env vars, and defaults.
# Priority: CLI args > Environment vars > Config file > Defaults

# ───────────────────────────────────────────────────────────────
# 1. BASH VERSION CHECK
# ───────────────────────────────────────────────────────────────

if ((BASH_VERSINFO[0] < 4)); then
    echo "ERROR: config.sh requires Bash 4.0+" >&2
    echo "macOS: Install with 'brew install bash'" >&2
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 2. DEFAULT CONFIGURATION
# ───────────────────────────────────────────────────────────────

declare -A CONFIG_RULES=(
    ["FILE_EXISTS"]="error"
    ["PLACEHOLDER_FILLED"]="error"
    ["SECTIONS_PRESENT"]="warn"
    ["LEVEL_DECLARED"]="info"
    ["PRIORITY_TAGS"]="warn"
    ["EVIDENCE_CITED"]="warn"
    ["ANCHORS_VALID"]="error"
)

declare -a CONFIG_SKIP_PATHS=("**/scratch/**" "**/memory/**" "**/templates/**")
declare -a CONFIG_RULE_ORDER=()
CONFIG_FILE_PATH=""

# ───────────────────────────────────────────────────────────────
# 3. CONFIG FILE DISCOVERY
# ───────────────────────────────────────────────────────────────

# Searches: spec folder → project root (git root or cwd)
find_config_file() {
    local folder="${1:-.}"
    if [[ -f "$folder/.speckit.yaml" ]]; then
        echo "$folder/.speckit.yaml"
        return
    fi
    local project_root
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        project_root="$(git rev-parse --show-toplevel)"
    else
        project_root="$(pwd)"
    fi
    [[ -f "$project_root/.speckit.yaml" ]] && echo "$project_root/.speckit.yaml"
}

# ───────────────────────────────────────────────────────────────
# 4. CONFIG FILE PARSING
# ───────────────────────────────────────────────────────────────

load_config() {
    local folder="${1:-.}"
    CONFIG_FILE_PATH="$(find_config_file "$folder")"
    [[ -z "$CONFIG_FILE_PATH" ]] && return 0
    if command -v yq >/dev/null 2>&1; then
        _parse_config_yq "$CONFIG_FILE_PATH"
    else
        _parse_config_fallback "$CONFIG_FILE_PATH"
    fi
}

_parse_config_yq() {
    local config="$1"
    local rules skip_paths rule_order
    rules=$(yq -r '.validation.rules // {} | to_entries | .[] | "\(.key)=\(.value)"' "$config" 2>/dev/null || true)
    while IFS='=' read -r key value; do
        [[ -n "$key" && -n "$value" ]] && CONFIG_RULES["$key"]="$value"
    done <<< "$rules"
    
    skip_paths=$(yq -r '.validation.skip[]? // empty' "$config" 2>/dev/null || true)
    if [[ -n "$skip_paths" ]]; then
        CONFIG_SKIP_PATHS=()
        while IFS= read -r path; do
            [[ -n "$path" ]] && CONFIG_SKIP_PATHS+=("$path")
        done <<< "$skip_paths"
    fi
    
    rule_order=$(yq -r '.validation.rule_order[]? // empty' "$config" 2>/dev/null || true)
    if [[ -n "$rule_order" ]]; then
        CONFIG_RULE_ORDER=()
        while IFS= read -r rule; do
            [[ -n "$rule" ]] && CONFIG_RULE_ORDER+=("$rule")
        done <<< "$rule_order"
    fi
}

_parse_config_fallback() {
    local config="$1"
    local in_rules=false in_skip=false in_order=false
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^[[:space:]]*rules: ]]; then
            in_rules=true; in_skip=false; in_order=false; continue
        elif [[ "$line" =~ ^[[:space:]]*skip: ]]; then
            in_rules=false; in_skip=true; in_order=false; CONFIG_SKIP_PATHS=(); continue
        elif [[ "$line" =~ ^[[:space:]]*rule_order: ]]; then
            in_rules=false; in_skip=false; in_order=true; CONFIG_RULE_ORDER=(); continue
        elif [[ "$line" =~ ^[[:alpha:]] ]]; then
            in_rules=false; in_skip=false; in_order=false; continue
        fi
        
        $in_rules && [[ "$line" =~ ^[[:space:]]+([A-Z_]+):[[:space:]]*([a-z]+) ]] && CONFIG_RULES["${BASH_REMATCH[1]}"]="${BASH_REMATCH[2]}"
        $in_skip && [[ "$line" =~ ^[[:space:]]+-[[:space:]]+(.+) ]] && CONFIG_SKIP_PATHS+=("${BASH_REMATCH[1]}")
        $in_order && [[ "$line" =~ ^[[:space:]]+-[[:space:]]+([A-Z_]+) ]] && CONFIG_RULE_ORDER+=("${BASH_REMATCH[1]}")
    done < "$config"
}

# ───────────────────────────────────────────────────────────────
# 5. ENVIRONMENT VARIABLE OVERRIDES
# ───────────────────────────────────────────────────────────────

apply_env_overrides() {
    [[ "${SPECKIT_VALIDATION:-}" == "false" ]] && echo "Validation disabled via SPECKIT_VALIDATION=false" && exit 0
    [[ "${SPECKIT_STRICT:-}" == "true" ]] && STRICT_MODE=true
    [[ "${SPECKIT_VERBOSE:-}" == "true" ]] && VERBOSE=true
    [[ "${SPECKIT_JSON:-}" == "true" ]] && JSON_MODE=true
    [[ "${SPECKIT_QUIET:-}" == "true" ]] && QUIET_MODE=true
}

# ───────────────────────────────────────────────────────────────
# 6. GLOB PATTERN MATCHING
# ───────────────────────────────────────────────────────────────

# Handles: ** (any path), * (single segment), ? (single char)
glob_to_regex() {
    local pattern="$1"
    local regex=""
    local i=0 len=${#pattern}
    
    while ((i < len)); do
        local char="${pattern:i:1}" next="${pattern:i+1:1}"
        case "$char" in
            '*') [[ "$next" == "*" ]] && { regex+=".*"; ((i++)); } || regex+="[^/]*" ;;
            '?') regex+="[^/]" ;;
            '.'|'['|']'|'('|')'|'{'|'}'|'+'|'^'|'$'|'|'|'\\') regex+="\\$char" ;;
            *) regex+="$char" ;;
        esac
        ((i++))
    done
    echo "^${regex}$"
}

match_path_pattern() {
    local path="$1" pattern="$2" regex
    regex="$(glob_to_regex "$pattern")"
    [[ "$path" =~ $regex ]]
}

should_skip_path() {
    local path="$1"
    for pattern in "${CONFIG_SKIP_PATHS[@]}"; do
        match_path_pattern "$path" "$pattern" && return 0
    done
    return 1
}

# ───────────────────────────────────────────────────────────────
# 7. RULE CONFIGURATION ACCESS
# ───────────────────────────────────────────────────────────────

get_rule_severity() {
    echo "${CONFIG_RULES[${1}]:-error}"
}

should_run_rule() {
    [[ "$(get_rule_severity "$1")" != "skip" ]]
}
