#!/usr/bin/env bash
# Shared helpers for Spec Kit setup installers.

set -euo pipefail

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    CYAN=''
    NC=''
fi
readonly RED GREEN YELLOW BLUE CYAN NC

log_info() { printf '%b[INFO]%b %s\n' "$BLUE" "$NC" "$1"; }
log_success() { printf '%b[OK]%b %s\n' "$GREEN" "$NC" "$1"; }
log_warn() { printf '%b[WARN]%b %s\n' "$YELLOW" "$NC" "$1"; }
log_error() { printf '%b[ERROR]%b %s\n' "$RED" "$NC" "$1" >&2; }
log_step() { printf '%b[STEP]%b %s\n' "$CYAN" "$NC" "$1"; }

check_command() {
    command -v "$1" >/dev/null 2>&1
}

check_node_version() {
    local min_version="${1:-20.11.0}"
    if ! check_command node; then
        log_error "Node.js is not installed"
        return 1
    fi

    local actual
    actual="$(node --version | sed 's/^v//')"
    if ! node -e '
const actual = process.argv[1].split(".").map(Number);
const min = process.argv[2].split(".").map(Number);
for (let i = 0; i < 3; i += 1) {
  if ((actual[i] || 0) > (min[i] || 0)) process.exit(0);
  if ((actual[i] || 0) < (min[i] || 0)) process.exit(1);
}
process.exit(0);
' "$actual" "$min_version"; then
        log_error "Node.js version ${min_version}+ required (found: v${actual})"
        return 1
    fi

    log_success "Node.js v${actual} detected"
}

check_npm() {
    if ! check_command npm; then
        log_error "npm is not installed"
        return 1
    fi
    log_success "npm v$(npm --version) detected"
}

check_npx() {
    if ! check_command npx; then
        log_error "npx is not available"
        return 1
    fi
    log_success "npx is available"
}

get_project_root() {
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        git rev-parse --show-toplevel
        return 0
    fi

    local dir="$PWD"
    while [[ "$dir" != "/" ]]; do
        if [[ -f "$dir/opencode.json" || -d "$dir/.opencode/skills/system-spec-kit" ]]; then
            printf '%s\n' "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done

    log_error "Unable to locate project root"
    return 1
}

json_validate() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        log_error "File not found: $file"
        return 1
    fi

    python3 - "$file" <<'PY'
import json
import sys
with open(sys.argv[1], "r", encoding="utf-8") as fh:
    json.load(fh)
PY
}

json_has_key() {
    local file="$1"
    local dotted_path="$2"
    [[ -f "$file" ]] || return 1

    python3 - "$file" "$dotted_path" <<'PY'
import json
import sys
with open(sys.argv[1], "r", encoding="utf-8") as fh:
    data = json.load(fh)
current = data
for key in sys.argv[2].lstrip(".").split("."):
    if not isinstance(current, dict) or key not in current:
        sys.exit(1)
    current = current[key]
sys.exit(0)
PY
}

backup_file() {
    local file="$1"
    [[ -f "$file" ]] || return 0
    cp "$file" "${file}.bak.$(date +%Y%m%d%H%M%S)"
}

mcp_entry_exists() {
    local file="$1"
    local name="$2"
    json_has_key "$file" ".mcp.${name}"
}

add_mcp_entry() {
    local file="$1"
    local name="$2"
    local config_json="$3"

    [[ -f "$file" ]] || {
        log_error "File not found: $file"
        return 1
    }

    backup_file "$file"
    python3 - "$file" "$name" "$config_json" <<'PY'
import json
import sys
file_path, name, config_raw = sys.argv[1:4]
with open(file_path, "r", encoding="utf-8") as fh:
    data = json.load(fh)
data.setdefault("mcp", {})[name] = json.loads(config_raw)
with open(file_path, "w", encoding="utf-8") as fh:
    json.dump(data, fh, indent=2)
    fh.write("\n")
PY
}
