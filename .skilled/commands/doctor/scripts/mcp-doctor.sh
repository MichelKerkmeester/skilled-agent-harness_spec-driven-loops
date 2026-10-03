#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP DOCTOR
# ───────────────────────────────────────────────────────────────
# Diagnoses MCP Code Mode, its UTCP config, and project runtime wiring.
# Read-only: it reports problems and never repairs them. Repairs belong to the
# /doctor:mcp workflows, which approve each change separately.
#
# Usage:
#   bash .skilled/commands/doctor/scripts/mcp-doctor.sh [OPTIONS]
#
# Options:
#   --help              Show this help message
#   --json              Output machine-readable JSON
#   --root <path>       Diagnose this project root (must be a directory)
#
# Exit Codes:
#   0  All checks passed
#   1  Warnings only (MCP likely works)
#   2  Failures detected (MCP broken)
#   3  Bad arguments, including a --root that is not a directory; no report
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. SETUP AND ARGUMENTS
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source-path=SCRIPTDIR source=mcp-doctor-lib.sh
source "$SCRIPT_DIR/mcp-doctor-lib.sh"

readonly EXIT_USAGE=3

# Conditional output that keeps set -e from tripping on a false && short-circuit
_log() { if [[ "$JSON_MODE" != true ]]; then "$@"; fi; }

JSON_MODE=false
ROOT_OVERRIDE=""

show_help() {
  cat <<'HELP'
MCP Doctor: Unified MCP Diagnostic Command (read-only)

Usage: bash .skilled/commands/doctor/scripts/mcp-doctor.sh [OPTIONS]

Options:
  --help              Show this help message
  --json              Output machine-readable JSON
  --root <path>       Diagnose this project root (must be a directory)

Exit Codes:
  0  All checks passed
  1  Warnings only
  2  Failures detected
  3  Bad arguments (no report is produced)

Servers Checked:
  code_mode             MCP Code Mode

Config Files Scanned:
  opencode.json         OpenCode CLI
  .mcp.json             Claude Code
  .claude/mcp.json      Claude Code
  .codex/config.toml    Codex
  .cursor/mcp.json      Cursor
  .pi/mcp.json          Pi
  .devin/mcp_config.json Devin
HELP
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h)   show_help; exit 0 ;;
    --json)      JSON_MODE=true; shift ;;
    --root)
      if [[ $# -lt 2 ]]; then echo "Error: --root requires a path" >&2; exit "$EXIT_USAGE"; fi
      ROOT_OVERRIDE="$2"; shift 2 ;;
    *)
      echo "Unknown option: $1" >&2; show_help >&2; exit "$EXIT_USAGE" ;;
  esac
done

if ! PROJECT_ROOT="$(resolve_project_root "$ROOT_OVERRIDE")"; then
  exit "$EXIT_USAGE"
fi
HAS_NODE=false

# ───────────────────────────────────────────────────────────────
# 2. PREREQUISITES
# ───────────────────────────────────────────────────────────────

_log printf '%s\n' "╔══════════════════════════════════════════════════╗"
_log printf '%s\n' "║            MCP Doctor — Diagnostic               ║"
_log printf '%s\n' "╚══════════════════════════════════════════════════╝"
_log printf '  Project root: %s\n' "$PROJECT_ROOT"

_log log_header "Prerequisites"

if check_command_exists node; then
  HAS_NODE=true
  if node_version_at_least "20.11.0"; then
    _log log_pass "Node.js $(node --version)"
    record_pass "prerequisites" "node" "$(node --version)"
  else
    _log log_fail "Node.js $(node --version) is below required >=20.11.0 for diagnostics"
    record_fail "prerequisites" "node" "$(node --version) < 20.11.0 for diagnostics"
  fi
else
  _log log_fail "Node.js not found — Code Mode requires Node 24"
  record_fail "prerequisites" "node" "not found"
fi

if check_command_exists npm; then
  record_pass "prerequisites" "npm" "$(npm --version 2>/dev/null)"
else
  record_warn "prerequisites" "npm" "not found"
fi

# ───────────────────────────────────────────────────────────────
# 3. CODE MODE DIAGNOSTICS
# ───────────────────────────────────────────────────────────────

# Check the root UTCP config: manual shape and credential presence, never values
# Args: $1=server id $2=.utcp_config.json path $3=.env path
diagnose_utcp_config() {
  local srv="$1" utcp_config="$2" env_file="$3"
  local utcp_report manual_count manuals_valid manual_issues
  local credential_count credentials_present credential_detail

  if [[ ! -f "$utcp_config" ]]; then
    record_warn "$srv" "utcp_config" "File not found"
    _log log_warn ".utcp_config.json not found — Code Mode needs this config"
    return
  fi

  if ! node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));' "$utcp_config" >/dev/null 2>&1; then
    record_fail "$srv" "utcp_config" "Invalid JSON syntax"
    _log log_fail ".utcp_config.json has invalid JSON syntax"
    return
  fi
  record_pass "$srv" "utcp_config" "Valid JSON"
  _log log_pass ".utcp_config.json exists and is valid JSON"

  if ! utcp_report="$(inspect_utcp_config "$utcp_config" "$env_file" 2>/dev/null)"; then
    record_fail "$srv" "utcp_manuals" "UTCP config could not be inspected"
    _log log_fail "UTCP config could not be inspected"
    return
  fi
  {
    IFS= read -r manual_count
    IFS= read -r manuals_valid
    IFS= read -r manual_issues
    IFS= read -r credential_count
    IFS= read -r credentials_present
    IFS= read -r credential_detail
  } <<< "$utcp_report"

  if [[ "$manuals_valid" == 1 ]]; then
    record_pass "$srv" "utcp_manuals" "$manual_count manuals have a valid name and call_template_type"
    _log log_pass "$manual_count UTCP manuals have a name and call_template_type"
  else
    record_fail "$srv" "utcp_manuals" "${manual_issues:-Invalid manual_call_templates}"
    _log log_fail "UTCP manuals are missing required fields"
  fi

  if [[ "$credential_count" -eq 0 ]]; then
    record_pass "$srv" "utcp_credentials" "No environment variable references"
    _log log_pass "No UTCP credential references need checking"
  elif [[ "$credentials_present" == 1 ]]; then
    record_pass "$srv" "utcp_credentials" "$credential_detail"
    _log log_pass "$credential_detail"
  else
    record_warn "$srv" "utcp_credentials" "$credential_detail"
    _log log_warn "$credential_detail"
  fi
}

diagnose_code_mode() {
  local srv="code_mode"
  local skill_dir="$PROJECT_ROOT/.skilled/skills/mcp-code-mode"
  local server_dir="$skill_dir/mcp-server"
  local dist_entry="$skill_dir/mcp-server/dist/index.js"
  local resolver="$PROJECT_ROOT/.skilled/bin/lib/node-engine-resolver.cjs"
  local launcher="$PROJECT_ROOT/.skilled/bin/mcp-code-mode-launcher.cjs"
  local manifest="$server_dir/package.json"

  _log log_header "Code Mode"

  if [[ "$HAS_NODE" != true ]]; then
    record_skip "$srv" "all" "Node.js not available"
    _log log_skip "Node.js not available — skipping all checks"
    return
  fi

  # Every host config depends on the shared launcher being present.
  if [[ -f "$launcher" ]]; then
    record_pass "$srv" "launcher_exists" "$launcher"
    _log log_pass "launcher present"
  else
    record_fail "$srv" "launcher_exists" "File missing: $launcher"
    _log log_fail "launcher missing — every host config registers this path"
  fi

  # A lockfile cannot establish the supported runtime without its manifest.
  if [[ -f "$manifest" ]]; then
    record_pass "$srv" "package_json" "Present"
    _log log_pass "mcp-server/package.json is present"

    local interpreter_resolution
    # The ${...} below are JavaScript template literals for node, not shell expansions.
    # shellcheck disable=SC2016
    if interpreter_resolution="$(node -e '
      const [resolverPath, manifestPath] = process.argv.slice(1);
      const result = require(resolverPath).resolveNodeInterpreter({ manifestPath });
      if (result.path) {
        process.stdout.write(`resolved\t${result.path}\t${result.range ?? "unknown"}\n`);
      } else {
        process.stdout.write(`unresolved\t${result.range ?? "unknown"}\t${result.reason ?? "unknown"}\n`);
      }
    ' "$resolver" "$manifest" 2>/dev/null)"; then
      local resolution_status resolution_value resolution_detail
      IFS=$'\t' read -r resolution_status resolution_value resolution_detail <<< "$interpreter_resolution"
      if [[ "$resolution_status" == "resolved" ]]; then
        record_pass "$srv" "node_engine" "Resolved interpreter: $resolution_value (range: $resolution_detail)"
        _log log_pass "Node engine range satisfied by $resolution_value"
      else
        record_fail "$srv" "node_engine" "Required range: $resolution_value; reason: $resolution_detail"
        _log log_fail "No Node.js interpreter satisfies $resolution_value ($resolution_detail)"
      fi
    else
      record_fail "$srv" "node_engine" "Resolver failed"
      _log log_fail "Node engine resolver failed"
    fi
  else
    record_fail "$srv" "package_json" "Missing: $manifest"
    record_skip "$srv" "node_engine" "Cannot validate the engine range without package.json"
    _log log_fail "mcp-server/package.json missing — Node engine range cannot be validated"
  fi

  # A present build can still fail syntax checks or lag behind its inputs.
  if [[ -f "$dist_entry" ]]; then
    record_pass "$srv" "dist_exists" "$dist_entry"
    _log log_pass "dist/index.js exists"

    if node --check "$dist_entry" >/dev/null 2>&1; then
      record_pass "$srv" "dist_syntax" "node --check passed"
      _log log_pass "dist/index.js syntax is valid"
    else
      record_fail "$srv" "dist_syntax" "node --check failed"
      _log log_fail "dist/index.js failed node --check"
    fi

    local stale_inputs="" missing_inputs="" source_path source_name
    local -a source_inputs=(
      "$server_dir/index.ts"
      "$server_dir/package.json"
      "$server_dir/package-lock.json"
      "$server_dir/tsconfig.json"
    )
    for source_path in "${source_inputs[@]}"; do
      source_name="${source_path#"$server_dir/"}"
      if [[ ! -f "$source_path" ]]; then
        if [[ -n "$missing_inputs" ]]; then
          missing_inputs+=", "
        fi
        missing_inputs+="$source_name"
      elif [[ "$source_path" -nt "$dist_entry" ]]; then
        if [[ -n "$stale_inputs" ]]; then
          stale_inputs+=", "
        fi
        stale_inputs+="$source_name"
      fi
    done

    if [[ -n "$stale_inputs" ]]; then
      record_warn "$srv" "dist_currentness" "Stale: newer inputs: $stale_inputs"
      _log log_warn "dist/index.js is stale; newer inputs: $stale_inputs"
    elif [[ -n "$missing_inputs" ]]; then
      record_warn "$srv" "dist_currentness" "Unvalidated: missing inputs: $missing_inputs"
      _log log_warn "dist/index.js currentness is unvalidated; missing inputs: $missing_inputs"
    else
      record_pass "$srv" "dist_currentness" "No build input is newer than dist/index.js"
      _log log_pass "dist/index.js is not older than its build inputs"
    fi
  else
    record_fail "$srv" "dist_exists" "File missing: $dist_entry"
    _log log_fail "dist/index.js missing — needs npm install + build"
  fi

  diagnose_utcp_config "$srv" "$PROJECT_ROOT/.utcp_config.json" "$PROJECT_ROOT/.env"

  # Code Mode cannot start without its installed server dependencies.
  if [[ -d "$skill_dir/mcp-server/node_modules" ]]; then
    record_pass "$srv" "node_modules" "Installed"
    _log log_pass "node_modules installed"
  else
    record_fail "$srv" "node_modules" "Missing"
    _log log_fail "node_modules missing — needs npm install"
  fi
}

# ───────────────────────────────────────────────────────────────
# 4. CONFIG WIRING
# ───────────────────────────────────────────────────────────────

detect_and_check_configs() {
  _log log_header "Config Wiring"

  local -a config_files=(
    "opencode.json|opencode|OpenCode"
    ".mcp.json|claude|Claude Code"
    ".claude/mcp.json|claude|Claude Code MCP"
    ".codex/config.toml|codex|Codex"
    ".cursor/mcp.json|cursor|Cursor"
    ".pi/mcp.json|pi|Pi"
    ".devin/mcp_config.json|devin|Devin"
  )

  local cfg_entry cfg_path cfg_runtime cfg_label cfg_status cfg_detail
  for cfg_entry in "${config_files[@]}"; do
    IFS='|' read -r cfg_path cfg_runtime cfg_label <<< "$cfg_entry"
    _log printf '\n  %s%s%s (%s):\n' "$BOLD" "$cfg_label" "$NC" "$cfg_path"
    IFS=$'\t' read -r cfg_status cfg_detail \
      <<< "$(config_check_registration "$PROJECT_ROOT/$cfg_path" "$cfg_runtime")"
    case "$cfg_status" in
      PASS)
        record_pass "config" "${cfg_path}:code_mode" "$cfg_detail"
        _log printf '    %s[OK]%s Code Mode launcher and UTCP path verified\n' "$GREEN" "$NC"
        ;;
      FAIL)
        record_fail "config" "${cfg_path}:code_mode" "$cfg_detail"
        _log log_fail "$cfg_detail"
        ;;
      *)
        record_warn "config" "${cfg_path}:code_mode" "$cfg_detail"
        _log log_warn "$cfg_detail"
        ;;
    esac
  done

  record_info "config" "hermes_registration" "User-level in ~/.hermes/config.yaml; not checked"
  _log log_info "Hermes registration is user-level in ~/.hermes/config.yaml and is not checked"
}

# ───────────────────────────────────────────────────────────────
# 5. MAIN
# ───────────────────────────────────────────────────────────────

diagnose_code_mode
detect_and_check_configs

EXIT_CODE=0
if [[ "$DOCTOR_FAIL_COUNT" -gt 0 ]]; then
  EXIT_CODE=2
elif [[ "$DOCTOR_WARN_COUNT" -gt 0 ]]; then
  EXIT_CODE=1
fi

if [[ "$JSON_MODE" == true ]]; then
  emit_json_report "$EXIT_CODE"
else
  print_summary "$EXIT_CODE"
fi

exit "$EXIT_CODE"
