#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP Doctor — Shared Library
# ───────────────────────────────────────────────────────────────
# Shared helper functions for mcp-doctor.sh.
# Source this file; do not execute directly.
#
# Provides: colors, logging, JSON helpers, project root detection,
#           result tracking, and summary rendering.
#
# Exit Codes: N/A (library — sourced, not executed)
# ───────────────────────────────────────────────────────────────
set -euo pipefail

# ── 1. COLOR SUPPORT ─────────────────────────────────────────
# Respects NO_COLOR env var and non-TTY pipes
if [[ -z "${NO_COLOR:-}" ]] && [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  DIM='\033[2m'
  NC='\033[0m'
else
  RED='' GREEN='' YELLOW='' BLUE='' CYAN='' BOLD='' DIM='' NC=''
fi

# ── 2. LOGGING ───────────────────────────────────────────────
log_pass()   { printf '  %b[PASS]%b %s\n' "$GREEN" "$NC" "$1"; }
log_warn()   { printf '  %b[WARN]%b %s\n' "$YELLOW" "$NC" "$1"; }
log_fail()   { printf '  %b[FAIL]%b %s\n' "$RED" "$NC" "$1" >&2; }
log_skip()   { printf '  %b[SKIP]%b %s\n' "$DIM" "$NC" "$1"; }
log_info()   { printf '  %b[INFO]%b %s\n' "$CYAN" "$NC" "$1"; }
log_header() { printf '\n%b=== %s ===%b\n' "$BOLD" "$1" "$NC"; }

# ── 3. RESULT TRACKING ──────────────────────────────────────
declare -a DOCTOR_RESULTS=()
DOCTOR_PASS_COUNT=0
DOCTOR_WARN_COUNT=0
DOCTOR_FAIL_COUNT=0

# Record a passing check result
# Args: $1=server $2=check $3=detail(optional)
record_pass() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("PASS|${server}|${check}|${detail}")
  ((DOCTOR_PASS_COUNT++)) || true
}

# Record a warning check result
# Args: $1=server $2=check $3=detail(optional)
record_warn() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("WARN|${server}|${check}|${detail}")
  ((DOCTOR_WARN_COUNT++)) || true
}

# Record a failing check result
# Args: $1=server $2=check $3=detail(optional)
record_fail() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("FAIL|${server}|${check}|${detail}")
  ((DOCTOR_FAIL_COUNT++)) || true
}

# Record a skipped check result
# Args: $1=server $2=check $3=detail(optional)
record_skip() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("SKIP|${server}|${check}|${detail}")
}

# Keep operator-managed registration visible without changing health counts.
record_info() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("INFO|${server}|${check}|${detail}")
}

# ── 4. JSON HELPERS ──────────────────────────────────────────

# Escape a string for safe JSON embedding
# Args: $1=string to escape
# Returns: escaped string on stdout
json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

# Emit full JSON diagnostic report from DOCTOR_RESULTS
# Args: $1=exit_code
emit_json_report() {
  local exit_code="$1"
  local status_label
  if [[ "$exit_code" -eq 0 ]]; then
    status_label="healthy"
  elif [[ "$exit_code" -eq 1 ]]; then
    status_label="warnings"
  else
    status_label="unhealthy"
  fi

  printf '{\n'
  printf '  "status": "%s",\n' "$status_label"
  printf '  "exitCode": %d,\n' "$exit_code"
  printf '  "summary": { "pass": %d, "warn": %d, "fail": %d },\n' \
    "$DOCTOR_PASS_COUNT" "$DOCTOR_WARN_COUNT" "$DOCTOR_FAIL_COUNT"
  printf '  "checks": [\n'

  local i=0
  local status server check detail
  for result in "${DOCTOR_RESULTS[@]}"; do
    IFS='|' read -r status server check detail <<< "$result"
    [[ "$i" -gt 0 ]] && printf ',\n'
    printf '    { "status": "%s", "server": "%s", "check": "%s", "detail": "%s" }' \
      "$(json_escape "$status")" "$(json_escape "$server")" \
      "$(json_escape "$check")" "$(json_escape "$detail")"
    ((i++)) || true
  done

  printf '\n  ]\n'
  printf '}\n'
}

# ── 5. SUMMARY ───────────────────────────────────────────────

# Print human-readable summary with exit code context
# Args: $1=exit_code
print_summary() {
  local exit_code="$1"
  printf '\n%b─── Summary ───%b\n' "$BOLD" "$NC"
  printf '  Pass: %b%d%b  Warn: %b%d%b  Fail: %b%d%b\n' \
    "$GREEN" "$DOCTOR_PASS_COUNT" "$NC" \
    "$YELLOW" "$DOCTOR_WARN_COUNT" "$NC" \
    "$RED" "$DOCTOR_FAIL_COUNT" "$NC"
  if [[ "$exit_code" -eq 0 ]]; then
    printf '  %bCode Mode checks healthy.%b\n' "$GREEN" "$NC"
  elif [[ "$exit_code" -eq 1 ]]; then
    printf '  %bWarnings detected. Review the Code Mode checks above.%b\n' "$YELLOW" "$NC"
  else
    printf '  %bFailures detected. Run with --fix to attempt auto-repair.%b\n' "$RED" "$NC" >&2
  fi
}

# ── 6. PROJECT ROOT DETECTION ────────────────────────────────

# Walk up from script location to find project root
# Args: $1=hint path (optional)
# Returns: absolute project root path on stdout
resolve_project_root() {
  local hint="${1:-}"
  if [[ -n "$hint" && -d "$hint" ]]; then
    cd "$hint" && pwd
    return
  fi
  local dir
  dir="$(cd "$(dirname "${BASH_SOURCE[1]:-${BASH_SOURCE[0]}}")" && pwd)"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/opencode.json" ]] || [[ -d "$dir/.opencode" ]]; then
      printf '%s' "$dir"
      return
    fi
    dir="$(dirname "$dir")"
  done
  pwd
}

# ── 7. PREREQUISITE CHECKING ─────────────────────────────────

# Check if a command exists on PATH
# Args: $1=command name
# Returns: 0 if found, 1 if not
check_command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Get the major version of Node.js
# Returns: major version number on stdout, "0" if node not found
get_node_major_version() {
  if check_command_exists node; then
    node -e 'console.log(process.versions.node.split(".")[0])' 2>/dev/null || echo "0"
  else
    echo "0"
  fi
}

node_version_at_least() {
  local minimum="$1"
  check_command_exists node || return 1
  node -e "
    const actual = process.versions.node.split('.').map(Number);
    const min = '$minimum'.split('.').map(Number);
    for (let i = 0; i < Math.max(actual.length, min.length); i += 1) {
      const a = actual[i] || 0;
      const b = min[i] || 0;
      if (a > b) process.exit(0);
      if (a < b) process.exit(1);
    }
    process.exit(0);
  " 2>/dev/null
}

# ── 8. CONFIG FILE CHECKING ──────────────────────────────────

# Keep parser results limited to registration status so unrelated config values stay private.
CONFIG_CHECK_STATUS=""
CONFIG_CHECK_DETAIL=""

# Pick the first Python interpreter on PATH whose stdlib provides tomllib, since the
# default python3 on some hosts predates 3.11 and cannot parse TOML.
# Returns: interpreter command name on stdout, empty when none qualifies
_doctor_toml_python() {
  local candidate
  for candidate in python3 python3.14 python3.13 python3.12 python3.11; do
    if check_command_exists "$candidate" && "$candidate" -c 'import tomllib' >/dev/null 2>&1; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 0
}

config_check_registration() {
  local file="$1" runtime="$2" parser_result=""
  CONFIG_CHECK_STATUS="WARN"
  CONFIG_CHECK_DETAIL="File not present"

  if [[ ! -f "$file" ]]; then
    return 0
  fi

  if [[ "$runtime" == "codex" ]]; then
    local toml_python
    toml_python="$(_doctor_toml_python)"
    if [[ -z "$toml_python" ]]; then
      toml_python="python3"
    fi
    if parser_result="$("$toml_python" - "$file" 2>/dev/null <<'PY'
import pathlib
import sys

try:
    import tomllib
except ImportError:
    print("unvalidated")
    raise SystemExit(2)

try:
    config = tomllib.loads(pathlib.Path(sys.argv[1]).read_text())
except Exception:
    print("invalid_toml")
    raise SystemExit(3)

entry = config.get("mcp_servers", {}).get("code_mode", {})
env = entry.get("env", {}) if isinstance(entry, dict) else {}
args = entry.get("args", []) if isinstance(entry, dict) else []
is_wired = (
    isinstance(entry, dict)
    and entry.get("command") == "node"
    and isinstance(args, list)
    and any(
        isinstance(argument, str)
        and ".skilled/bin/mcp-code-mode-launcher.cjs" in argument
        for argument in args
    )
    and isinstance(env, dict)
    and env.get("UTCP_CONFIG_FILE") == ".utcp_config.json"
)
print("wired" if is_wired else "not_wired")
PY
)"; then
      :
    else
      :
    fi
  else
    if parser_result="$(node - "$file" "$runtime" 2>/dev/null <<'NODE'
const fs = require("fs");
const [filePath, runtime] = process.argv.slice(2);
let config;

try {
  config = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch {
  process.stdout.write("invalid_json");
  process.exit(3);
}

const entry = runtime === "opencode"
  ? config?.mcp?.code_mode
  : config?.mcpServers?.code_mode;
const command = entry?.command;
const args = Array.isArray(entry?.args) ? entry.args : [];
const commandParts = Array.isArray(command) ? command : [command];
const environment = entry?.environment ?? entry?.env;
const commandIsNode = Array.isArray(command)
  ? command[0] === "node"
  : command === "node";
const hasLauncher = [...commandParts, ...args].some(
  (part) => typeof part === "string"
    && part.includes(".skilled/bin/mcp-code-mode-launcher.cjs"),
);
const isWired = commandIsNode
  && hasLauncher
  && environment?.UTCP_CONFIG_FILE === ".utcp_config.json";

process.stdout.write(isWired ? "wired" : "not_wired");
if (!isWired) process.exit(2);
NODE
)"; then
      :
    else
      :
    fi
  fi

  case "$parser_result" in
    wired)
      CONFIG_CHECK_STATUS="PASS"
      CONFIG_CHECK_DETAIL="Code Mode launcher and UTCP path verified"
      ;;
    unvalidated)
      CONFIG_CHECK_STATUS="WARN"
      CONFIG_CHECK_DETAIL="unvalidated: no tomllib-capable Python (3.11+) was found"
      ;;
    invalid_json)
      CONFIG_CHECK_STATUS="FAIL"
      CONFIG_CHECK_DETAIL="Invalid JSON syntax"
      ;;
    invalid_toml)
      CONFIG_CHECK_STATUS="FAIL"
      CONFIG_CHECK_DETAIL="Invalid TOML syntax"
      ;;
    not_wired)
      CONFIG_CHECK_STATUS="WARN"
      CONFIG_CHECK_DETAIL="Code Mode launcher or UTCP path is missing or incorrect"
      ;;
    *)
      CONFIG_CHECK_STATUS="WARN"
      if [[ "$runtime" == "codex" ]]; then
        CONFIG_CHECK_DETAIL="unvalidated: no tomllib-capable Python (3.11+) was found"
      else
        CONFIG_CHECK_DETAIL="unvalidated: Node.js unavailable"
      fi
      ;;
  esac

  return 0
}

# Report credential presence only so diagnostics never disclose environment values.
inspect_utcp_config() {
  local config_file="$1" env_file="$2"
  node - "$config_file" "$env_file" <<'NODE'
const fs = require("fs");
const [configPath, envPath] = process.argv.slice(2);
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const manualEntries = config.manual_call_templates;
const manualIssues = [];
const credentials = [];
const envFileValues = new Map();

function hasNonEmptyValue(rawValue) {
  let value = rawValue.trim();
  if (value.length === 0 || value.startsWith("#")) return false;
  if ((value.startsWith("\"") && value.endsWith("\""))
    || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  } else {
    value = value.split(/\s+#/, 1)[0];
  }
  return value.trim().length > 0;
}

try {
  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && hasNonEmptyValue(match[2])) envFileValues.set(match[1], true);
  }
} catch {
  // A missing or unreadable .env leaves referenced credentials unverified.
}

function collectReferences(value, references) {
  if (typeof value === "string") {
    for (const match of value.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)) {
      references.add(match[1]);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectReferences(item, references);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectReferences(item, references);
  }
}

if (!Array.isArray(manualEntries)) {
  manualIssues.push("manual_call_templates is missing or is not an array");
} else {
  manualEntries.forEach((manual, index) => {
    const name = typeof manual?.name === "string" ? manual.name.trim() : "";
    const hasValidName = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/u.test(name);
    const hasCallTemplateType = typeof manual?.call_template_type === "string"
      && manual.call_template_type.trim().length > 0;

    if (!hasValidName) manualIssues.push(`entry ${index + 1}: missing or invalid name`);
    if (!hasCallTemplateType) manualIssues.push(`entry ${index + 1}: missing call_template_type`);
    if (!hasValidName) return;

    const references = new Set();
    collectReferences(manual, references);
    for (const reference of references) {
      // Mirrors the UTCP SDK: underscores in the manual name are doubled before joining.
      const key = `${name.replace(/_/g, "__")}_${reference}`;
      const processValue = process.env[key];
      credentials.push({
        key,
        present: typeof processValue === "string" && processValue.trim().length > 0
          || envFileValues.has(key),
      });
    }
  });
}

credentials.sort((left, right) => left.key.localeCompare(right.key));
process.stdout.write(JSON.stringify({
  manualCount: Array.isArray(manualEntries) ? manualEntries.length : 0,
  manualArrayValid: Array.isArray(manualEntries),
  manualIssues,
  credentials,
}));
NODE
}
