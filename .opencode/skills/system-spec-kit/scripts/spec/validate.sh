#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Validate Spec
# ───────────────────────────────────────────────────────────────
# Front-end for the spec folder validation orchestrator.
#
# This script resolves arguments and the set of folders to validate, then hands
# every rule decision to the orchestrator. It deliberately implements no rules
# of its own: a second implementation of the same rules is a second answer to
# the same question, and a packet's verdict must not depend on the caller.

# Strict mode with guarded dynamic expansions.
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

if [[ -n "${SPECKIT_SKIP_VALIDATION:-}" ]]; then
    echo "Validation skipped (SPECKIT_SKIP_VALIDATION=${SPECKIT_SKIP_VALIDATION})" >&2
    exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly VALIDATOR_REGISTRY_JSON="$SCRIPT_DIR/../lib/validator-registry.json"
readonly ORCHESTRATOR_JS="$SCRIPT_DIR/../../runtime/dist/lib/validation/orchestrator.js"
readonly ORCHESTRATOR_TS="$SCRIPT_DIR/../../runtime/lib/validation/orchestrator.ts"
readonly TSX_LOADER="$SCRIPT_DIR/../node_modules/tsx/dist/loader.mjs"
readonly DIST_FRESHNESS_CJS="$SCRIPT_DIR/../lib/dist-freshness.cjs"
readonly VERSION="3.0.0"

# ───────────────────────────────────────────────────────────────
# 2. STATE & GLOBALS
# ───────────────────────────────────────────────────────────────

FOLDER_PATH=""
JSON_MODE=false STRICT_MODE=false VERBOSE=false QUIET_MODE=false
RECURSIVE=false RECURSIVE_OPT_OUT=false
CHILD_MANIFEST_ACTIVE=false CHILD_MANIFEST_HASH="" CHILD_MANIFEST_ENTRIES=() PHASE_DIRS=()

# ───────────────────────────────────────────────────────────────
# 3. HELP & ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

list_registry_rules() {
    [[ -f "$VALIDATOR_REGISTRY_JSON" ]] || { echo "RULES: registry unavailable at $VALIDATOR_REGISTRY_JSON"; return 0; }
    node -e '
const fs = require("fs");
const parsed = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const rules = Array.isArray(parsed) ? parsed : (parsed.rules || []);
const lines = ["RULES BY CATEGORY:"];
for (const category of ["authored_template", "operational_runtime"]) {
  lines.push(`  ${category}:`);
  for (const rule of rules.filter((item) => item.category === category)) {
    const suffix = rule.strict_only ? " strict-only" : "";
    lines.push(`    ${rule.rule_id} [${rule.severity}${suffix}] - ${rule.description}`);
  }
}
process.stdout.write(`${lines.join("\n")}\n`);
' "$VALIDATOR_REGISTRY_JSON" 2>/dev/null || echo "RULES: registry unreadable"
}

show_help() {
    cat << EOF
validate.sh - Spec Folder Validation (v$VERSION)

USAGE: ./validate.sh <folder-path> [OPTIONS]

OPTIONS:
    --help, -h     Show help     --version, -v  Show version
    --json         JSON output   --strict       Warnings as errors
    --verbose      Detailed      --quiet, -q    Results only
    --recursive    Validate parent + all [0-9][0-9][0-9]-*/ child phase folders
    --no-recursive Disable auto-recursive validation when phase children exist

ENVIRONMENT:
    SPECKIT_RULES              Comma-separated subset of rules to evaluate
    SPECKIT_SKIP_VALIDATION    Skip validation entirely
    SPECKIT_STRICT/_VERBOSE/_JSON/_QUIET   Equivalent to the flags above

EXIT CODES: 0=pass, 1=user error, 2=validation error, 3=system error

$(list_registry_rules)

LEVELS: 1=spec+plan+tasks+impl-summary*, 2=+checklist, 3=+architecture guidance
        decision-record.md and other add-ons are on-demand when explicitly added
        review=spec+review/review-report (lean review record, marker-gated)
        *impl-summary required after tasks completed
EOF
exit 0; }

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h) show_help ;;
            --version|-v) echo "validate.sh version $VERSION"; exit 0 ;;
            --json) JSON_MODE=true; shift ;;
            --strict) STRICT_MODE=true; shift ;;
            --verbose) VERBOSE=true; shift ;;
            --quiet|-q) QUIET_MODE=true; shift ;;
            --recursive) RECURSIVE=true; shift ;;
            --no-recursive) RECURSIVE=false; RECURSIVE_OPT_OUT=true; shift ;;
            -*) echo "ERROR: Unknown option '$1'" >&2; exit 1 ;;
            *) [[ -z "$FOLDER_PATH" ]] && FOLDER_PATH="$1" || { echo "ERROR: Multiple paths" >&2; exit 1; }; shift ;;
        esac
    done
    [[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 1; }
    FOLDER_PATH="${FOLDER_PATH%/}"
    [[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 3; }
    return 0
}

apply_env_overrides() {
    [[ "${SPECKIT_VALIDATION:-}" == "false" ]] && { echo "Validation disabled"; exit 0; }
    # This used to select a second rule engine that no longer exists. Silently
    # ignoring it would let a caller believe it is still choosing something.
    if [[ -n "${SPECKIT_VALIDATE_LEGACY:-}" ]]; then
        echo "WARNING: SPECKIT_VALIDATE_LEGACY is set but no longer does anything; there is one validator." >&2
    fi
    [[ "${SPECKIT_STRICT:-}" == "true" ]] && STRICT_MODE=true
    [[ "${SPECKIT_VERBOSE:-}" == "true" ]] && VERBOSE=true
    [[ "${SPECKIT_JSON:-}" == "true" ]] && JSON_MODE=true
    [[ "${SPECKIT_QUIET:-}" == "true" ]] && QUIET_MODE=true
    return 0
}

# ───────────────────────────────────────────────────────────────
# 4. PHASE CHILD DISCOVERY
# ───────────────────────────────────────────────────────────────

has_phase_children() {
    local parent_folder="$1"
    local phase_dir
    for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-*/; do
        if [[ -d "$phase_dir" ]]; then
            return 0
        fi
    done
    return 1
}

child_manifest_hash() {
    local serialized="$1"
    local hash_output=""

    if command -v sha256sum >/dev/null 2>&1; then
        hash_output=$(printf '%s' "$serialized" | sha256sum 2>/dev/null) || return 1
    elif command -v shasum >/dev/null 2>&1; then
        hash_output=$(printf '%s' "$serialized" | shasum -a 256 2>/dev/null) || return 1
    else
        return 1
    fi

    printf '%s\n' "${hash_output%% *}"
}

child_manifest_contains() {
    local candidate="$1"
    local entry
    for entry in "${CHILD_MANIFEST_ENTRIES[@]-}"; do
        [[ -z "$entry" ]] && continue
        [[ "$entry" == "$candidate" ]] && return 0
    done
    return 1
}

# A caller may declare exactly which children a recursive run must cover, so a
# child cannot be added or dropped without the declaration changing with it.
load_child_manifest() {
    local parent_folder="$1"
    local manifest_text=""
    local expected_hash=""
    local line=""
    local serialized=""
    local actual_hash=""
    local phase_dir=""
    local phase_name=""
    local manifest_error=""
    local manifest_file="${SPECKIT_CHILD_MANIFEST_FILE:-}"
    local -a on_disk_phase_dirs=()

    CHILD_MANIFEST_ACTIVE=false
    CHILD_MANIFEST_HASH=""
    CHILD_MANIFEST_ENTRIES=()

    [[ -n "$manifest_file" ]] || return 0
    [[ -f "$manifest_file" ]] || { echo "ERROR: declared child manifest not found: $manifest_file" >&2; return 2; }

    while IFS= read -r line || [[ -n "$line" ]]; do
        case "$line" in
            "# sha256:"*) expected_hash="${line#\# sha256:}"; expected_hash="${expected_hash# }"; continue ;;
            "#"*|"") continue ;;
        esac
        manifest_text+="$line"$'\n'
    done < "$manifest_file"
    expected_hash="${SPECKIT_CHILD_MANIFEST_SHA256:-$expected_hash}"
    [[ -n "$expected_hash" ]] || { echo "ERROR: declared child manifest has no expected sha256" >&2; return 2; }

    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ -z "$line" ]] && continue
        [[ "$line" =~ ^[0-9]{3}-[a-z0-9-]+$ ]] || { echo "ERROR: invalid child manifest entry: $line" >&2; return 2; }
        if child_manifest_contains "$line"; then
            echo "ERROR: duplicate child manifest entry: $line" >&2
            return 2
        fi
        CHILD_MANIFEST_ENTRIES+=("$line")
        serialized+="$line"$'\n'
    done <<< "$manifest_text"

    [[ ${#CHILD_MANIFEST_ENTRIES[@]} -gt 0 ]] || { echo "ERROR: declared child manifest is empty" >&2; return 2; }
    [[ "$expected_hash" =~ ^[[:xdigit:]]{64}$ ]] || { echo "ERROR: invalid child manifest sha256: $expected_hash" >&2; return 2; }
    actual_hash=$(child_manifest_hash "$serialized") || { echo "ERROR: no sha256 implementation is available for child manifest validation" >&2; return 2; }
    local normalized_actual_hash normalized_expected_hash
    normalized_actual_hash=$(printf '%s' "$actual_hash" | tr '[:upper:]' '[:lower:]')
    normalized_expected_hash=$(printf '%s' "$expected_hash" | tr '[:upper:]' '[:lower:]')
    if [[ "$normalized_actual_hash" != "$normalized_expected_hash" ]]; then
        echo "ERROR: child manifest hash mismatch: expected $expected_hash, got $actual_hash" >&2
        return 2
    fi

    for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-*/; do
        [[ -d "$phase_dir" ]] || continue
        on_disk_phase_dirs+=("${phase_dir%/}")
    done

    for phase_dir in "${on_disk_phase_dirs[@]-}"; do
        [[ -z "$phase_dir" ]] && continue
        phase_name=$(basename "$phase_dir")
        if ! child_manifest_contains "$phase_name"; then
            echo "ERROR: on-disk child is absent from the declared manifest: $phase_name" >&2
            manifest_error=1
        fi
    done

    for phase_name in "${CHILD_MANIFEST_ENTRIES[@]}"; do
        if [[ ! -d "$parent_folder/$phase_name" ]]; then
            echo "ERROR: declared child is absent from disk: $phase_name" >&2
            manifest_error=1
        fi
    done

    [[ -z "$manifest_error" ]] || return 2
    CHILD_MANIFEST_ACTIVE=true
    CHILD_MANIFEST_HASH="$actual_hash"
    return 0
}

collect_phase_dirs() {
    local parent_folder="$1"
    local manifest_rc=0
    local phase_dir=""
    local phase_name=""

    PHASE_DIRS=()
    load_child_manifest "$parent_folder" || manifest_rc=$?
    [[ "$manifest_rc" -eq 0 ]] || return "$manifest_rc"

    if $CHILD_MANIFEST_ACTIVE; then
        for phase_name in "${CHILD_MANIFEST_ENTRIES[@]}"; do
            PHASE_DIRS+=("$parent_folder/$phase_name")
        done
    else
        for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-*/; do
            [[ -d "$phase_dir" ]] && PHASE_DIRS+=("${phase_dir%/}")
        done
    fi
    return 0
}

# ───────────────────────────────────────────────────────────────
# 5. VALIDATION
# ───────────────────────────────────────────────────────────────

# Compiled build preferred; the loader keeps source-only checkouts working.
resolve_orchestrator() {
    if [[ -f "$ORCHESTRATOR_JS" ]]; then
        if [[ -f "$DIST_FRESHNESS_CJS" ]]; then
            local freshness_output=""
            local freshness_rc=0
            freshness_output=$(node "$DIST_FRESHNESS_CJS" check --package system-spec-kit/runtime --entry validation-orchestrator 2>&1) || freshness_rc=$?
            if [[ "$freshness_rc" -eq 69 ]]; then
                echo "ERROR: validate.sh compiled validation orchestrator is stale." >&2
                [[ -n "$freshness_output" ]] && echo "$freshness_output" >&2
                echo "Run: cd .opencode/skills/system-spec-kit/runtime && npm run build" >&2
                exit 3
            elif [[ "$freshness_rc" -ne 0 ]]; then
                echo "WARNING: dist freshness check could not run (exit $freshness_rc): $freshness_output" >&2
            fi
        fi
        ORCHESTRATOR_CMD=(node "$ORCHESTRATOR_JS")
        return 0
    fi

    if [[ -f "$ORCHESTRATOR_TS" && -f "$TSX_LOADER" ]]; then
        ORCHESTRATOR_CMD=(node --import "$TSX_LOADER" "$ORCHESTRATOR_TS")
        return 0
    fi

    echo "ERROR: no validation orchestrator is available." >&2
    echo "Expected a build at $ORCHESTRATOR_JS" >&2
    echo "Run: cd .opencode/skills/system-spec-kit/runtime && npm run build" >&2
    exit 3
}

run_validation() {
    local flags=()
    $STRICT_MODE && flags+=(--strict)
    $JSON_MODE && flags+=(--json)
    $QUIET_MODE && flags+=(--quiet)
    $VERBOSE && flags+=(--verbose)

    local manifest_rc=0
    if $RECURSIVE; then
        collect_phase_dirs "$FOLDER_PATH" || manifest_rc=$?
        [[ "$manifest_rc" -eq 0 ]] || return "$manifest_rc"
        if $CHILD_MANIFEST_ACTIVE && ! $JSON_MODE && ! $QUIET_MODE; then
            echo "Child manifest accepted: ${#CHILD_MANIFEST_ENTRIES[@]} entries (sha256: $CHILD_MANIFEST_HASH)"
        fi
    fi

    local rc=0
    "${ORCHESTRATOR_CMD[@]}" --folder "$FOLDER_PATH" ${flags[@]+"${flags[@]}"} || rc=$?

    if $RECURSIVE; then
        local phase_dir
        for phase_dir in "${PHASE_DIRS[@]-}"; do
            [[ -n "$phase_dir" ]] || continue
            if ! $CHILD_MANIFEST_ACTIVE; then
                [[ -f "$phase_dir/spec.md" || -f "$phase_dir/description.json" ]] || continue
            fi
            local child_rc=0
            "${ORCHESTRATOR_CMD[@]}" --folder "$phase_dir" ${flags[@]+"${flags[@]}"} || child_rc=$?
            (( child_rc > rc )) && rc=$child_rc
        done
    fi

    return "$rc"
}

# ───────────────────────────────────────────────────────────────
# 6. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    parse_args "$@"
    # Environment overrides are read before anything prints: the auto-recursion
    # notice below is suppressed in JSON mode, and reading the flags afterwards
    # let that prose land in front of the JSON and make it unparseable.
    apply_env_overrides
    if ! $RECURSIVE && ! $RECURSIVE_OPT_OUT && has_phase_children "$FOLDER_PATH"; then
        RECURSIVE=true
        ! $JSON_MODE && ! $QUIET_MODE && echo "Auto-enabled recursive validation: phase child folders detected."
    fi
    resolve_orchestrator

    local rc=0
    run_validation || rc=$?
    exit "$rc"
}

main "$@"

# Exit codes:
#   0 - Success
#   1 - User error
#   2 - Validation error
#   3 - System error
