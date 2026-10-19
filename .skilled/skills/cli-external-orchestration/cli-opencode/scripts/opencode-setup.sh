#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: OPENCODE SETUP HELPER
# ───────────────────────────────────────────────────────────────
# Builds the v1-only, v2-only or side-by-side OpenCode layout under
# HOME, and reports which version each command name resolves to.
#
# Usage: opencode-setup.sh <both|v1|v2|check>
#
# Exit Codes:
#   0 - Success
#   1 - Refusal or failure
#   2 - Usage error

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

if [[ -z "${HOME:-}" ]]; then
    printf 'Error: HOME is not set\n' >&2
    exit 1
fi

readonly SCRIPT_NAME="${0##*/}"

readonly V1_PKG="opencode-ai@1.19.3"
readonly V2_PKG="@opencode/cli@2.0.32"

# Every path derives from HOME, so a throwaway HOME isolates the whole run
readonly V1_PREFIX="$HOME/.local"
readonly V2_PREFIX="$HOME/.local/opencode-v2"
readonly BIN="$HOME/.local/bin"
readonly DB_DIR="$HOME/.local/share/opencode"
readonly LAUNCHER="$BIN/opencode2"

# Cleared at startup so an inherited value never replaces the helper's own probe folder
PROBE_DATA_DIR=""

# ───────────────────────────────────────────────────────────────
# 2. COLORS AND LOGGING
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

log_info() { printf "${BLUE}INFO:${NC} %s\n" "$1"; }
log_pass() { printf "${GREEN}PASS:${NC} %s\n" "$1"; }
log_warn() { printf "${YELLOW}WARN:${NC} %s\n" "$1" >&2; }
log_error() { printf "${RED}ERROR:${NC} %s\n" "$1" >&2; }

# ───────────────────────────────────────────────────────────────
# 3. UTILITIES
# ───────────────────────────────────────────────────────────────

# Print the resolved layout paths so every write target is visible before it happens
print_paths() {
    printf 'resolved paths:\n'
    printf '  V1_PREFIX: %s\n' "$V1_PREFIX"
    printf '  V2_PREFIX: %s\n' "$V2_PREFIX"
    printf '  BIN:       %s\n' "$BIN"
    printf '  DB_DIR:    %s\n' "$DB_DIR"
}

# Announce a mutating step and the rollback line it would need; the rollback is printed, never run
print_step() {
    printf "\n${BOLD}[step]${NC} %s\n" "$1"
    printf '[rollback, never run] %s\n' "$2"
}

# Classify version output by shape, not by command name; the first matching token decides
classify_version() {
    local line token
    local -a tokens
    while IFS= read -r line || [[ -n "$line" ]]; do
        line="${line%$'\r'}"
        read -r -a tokens <<< "$line"
        if [[ ${#tokens[@]} -gt 0 ]]; then
            for token in "${tokens[@]}"; do
                if [[ "$token" =~ ^[vV]?([0-9]+)\.[0-9]+\.[0-9]+([-+][^[:space:]]*)?$ ]]; then
                    case "${BASH_REMATCH[1]}" in
                        1) printf 'v1\n' ;;
                        2) printf 'v2\n' ;;
                        *) printf 'unknown\n' ;;
                    esac
                    return 0
                fi
            done
        fi
    done
    printf 'unknown\n'
}

# Create one temporary probe folder in the system temp area; signals are ignored while it is created, so an interrupt never leaves it
ensure_probe_dir() {
    if [[ -n "${PROBE_DATA_DIR:-}" ]]; then
        return 0
    fi
    trap 'if [[ -n "${PROBE_DATA_DIR:-}" ]]; then rm -rf -- "$PROBE_DATA_DIR"; fi' EXIT
    trap '' INT TERM
    PROBE_DATA_DIR="$(mktemp -d "${TMPDIR:-/tmp}/opencode-setup-probe.XXXXXX")"
    trap 'exit 130' INT
    trap 'exit 143' TERM
}

# The v2 binary logs every launch, so probes point its data directory at a temporary folder and leave HOME untouched
probe_version() {
    local path="$1"
    XDG_DATA_HOME="$PROBE_DATA_DIR" "$path" --version 2>/dev/null || true
}

# Classify a binary by the shape of its version output; empty or other output is unknown
classify_binary() {
    local path="$1" output
    output="$(probe_version "$path")"
    printf '%s\n' "$output" | classify_version
}

# Classify what a bare name resolves to on PATH; "absent" when it does not resolve at all
classify_name_on_path() {
    local name="$1" path
    path="$(command -v "$name" 2>/dev/null || true)"
    if [[ -z "$path" ]]; then
        printf 'absent\n'
        return 0
    fi
    classify_binary "$path"
}

# Resolve a path through its symlink chain so the answering install is visible when a name is shadowed
resolve_realpath() {
    local target="$1" link dir hops=0
    while [[ -L "$target" ]] && [[ "$hops" -lt 32 ]]; do
        link="$(readlink "$target")"
        if [[ "$link" == /* ]]; then
            target="$link"
        else
            target="$(dirname "$target")/$link"
        fi
        hops=$((hops + 1))
    done
    dir="$(cd "$(dirname "$target")" 2>/dev/null && pwd -P)" || dir=""
    if [[ -n "$dir" ]]; then
        printf '%s/%s\n' "$dir" "$(basename "$target")"
    else
        printf '%s\n' "$target"
    fi
}

# Match PATH segments exactly; a substring test would false-positive on similarly named directories
is_on_path() {
    local needle="$1" remaining="${PATH:-}" entry
    while [[ -n "$remaining" ]]; do
        entry="${remaining%%:*}"
        if [[ "$entry" == "$needle" ]]; then
            return 0
        fi
        if [[ "$remaining" == *:* ]]; then
            remaining="${remaining#*:}"
        else
            remaining=""
        fi
    done
    return 1
}

# Refuse before any write when npm cannot run the installs
require_npm() {
    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm was not found on PATH; nothing was written"
        exit 1
    fi
}

# Read a package manifest's version field without invoking node
manifest_version() {
    sed -n '/"version"/{
        s/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p
        q
    }' "$1" 2>/dev/null
}

# True when a prefix already holds the pinned package version and its bin
pinned_installed() {
    local manifest="$1" pkg="$2" bin="$3" version
    if [[ ! -f "$manifest" ]]; then
        return 1
    fi
    version="$(manifest_version "$manifest" || true)"
    if [[ "$version" == "${pkg##*@}" ]] && [[ -x "$bin" ]]; then
        return 0
    fi
    return 1
}

# Keep the launcher byte-exact so an unchanged launcher is never rewritten
launcher_content() {
    cat <<'LAUNCHER_EOF'
#!/bin/sh
# v2 would otherwise open the same opencode.db as v1 and migrate it in place.
# A relative OPENCODE_DB resolves under the shared data directory.
: "${OPENCODE_DB:=opencode-v2.db}"
export OPENCODE_DB
exec "$HOME/.local/opencode-v2/bin/opencode2" "$@"
LAUNCHER_EOF
}

# Write the launcher only when absent or byte-different, so reruns stay idempotent
write_launcher() {
    local state="wrote"
    if [[ -L "$LAUNCHER" ]]; then
        log_error "$LAUNCHER is a symlink; writing the launcher would write through the link"
        log_error "Nothing was written through the link; remove the link and rerun this mode"
        exit 1
    fi
    if [[ -e "$LAUNCHER" ]]; then
        if launcher_content | cmp -s - "$LAUNCHER"; then
            log_info "launcher: left unchanged ($LAUNCHER)"
            return 0
        fi
        state="rewrote"
    fi
    print_step "write launcher \"$LAUNCHER\"" "rm \"$LAUNCHER\""
    launcher_content > "$LAUNCHER"
    chmod 755 "$LAUNCHER"
    log_info "launcher: $state ($LAUNCHER)"
}

# Print one version probe line; succeed only when the shape matches the wanted major
probe_shape() {
    local path="$1" want="$2" output shape
    output="$(probe_version "$path")"
    shape="$(printf '%s\n' "$output" | classify_version)"
    printf 'verify: %s -> %s [%s]\n' "$path" "$output" "$shape"
    [[ "$shape" == "$want" ]]
}

# Verify one installed name reports the expected version shape
verify_one() {
    local path="$1" want="$2"
    if ! probe_shape "$path" "$want"; then
        log_error "$path did not report a $want version"
        exit 1
    fi
}

# Verify both names after the launcher lands; both lines print before any failure exit
verify_pair() {
    local v1_failed=0 v2_failed=0
    probe_shape "$BIN/opencode" v1 || v1_failed=1
    probe_shape "$BIN/opencode2" v2 || v2_failed=1
    if [[ "$v1_failed" -ne 0 ]]; then
        log_error "$BIN/opencode did not report a v1 version"
    fi
    if [[ "$v2_failed" -ne 0 ]]; then
        log_error "$BIN/opencode2 did not report a v2 version"
    fi
    if [[ "$v1_failed" -ne 0 ]] || [[ "$v2_failed" -ne 0 ]]; then
        exit 1
    fi
}

# ───────────────────────────────────────────────────────────────
# 4. MODES
# ───────────────────────────────────────────────────────────────

# Report what each name resolves to and which data files exist; this mode never writes
mode_check() {
    local name on_path direct candidate shape resolved found db v2_on_path
    local opencode_on_path="" opencode_shape=""

    ensure_probe_dir
    print_paths

    for name in opencode opencode2; do
        on_path="$(command -v "$name" 2>/dev/null || true)"
        direct="$BIN/$name"
        candidate=""
        printf '\nname: %s\n' "$name"
        if [[ -n "$on_path" ]]; then
            printf '  command -v: %s\n' "$on_path"
        else
            printf '  command -v: (not found)\n'
        fi
        if [[ -x "$direct" ]]; then
            printf "  \$BIN/%s: %s\n" "$name" "$direct"
            candidate="$direct"
        elif [[ -e "$direct" ]]; then
            printf "  \$BIN/%s: %s (present, not executable)\n" "$name" "$direct"
        else
            printf "  \$BIN/%s: (absent)\n" "$name"
        fi
        if [[ -n "$candidate" ]]; then
            resolved="$(resolve_realpath "$candidate")"
            shape="$(classify_binary "$candidate")"
            printf '  realpath: %s\n' "$resolved"
            printf '  shape: %s\n' "$shape"
        else
            shape=""
            printf '  realpath: (none)\n'
            printf '  shape: (not installed)\n'
        fi
        if [[ "$name" == "opencode" ]]; then
            opencode_on_path="$on_path"
            opencode_shape="$shape"
        fi
    done

    printf '\n'
    if [[ -z "$opencode_on_path" ]]; then
        printf "bare name 'opencode' resolves to: (not on PATH)\n"
    elif [[ "$opencode_on_path" == "$BIN/opencode" ]]; then
        printf "bare name 'opencode' resolves to: %s (%s)\n" "$opencode_shape" "$opencode_on_path"
    else
        printf "bare name 'opencode' resolves to: (outside HOME, not probed) (%s)\n" "$opencode_on_path"
    fi

    printf '\ndatabase files in %s:\n' "$DB_DIR"
    found="false"
    if [[ -d "$DB_DIR" ]]; then
        for db in "$DB_DIR"/*.db; do
            if [[ -e "$db" ]]; then
                printf '  %s\n' "$db"
                found="true"
            fi
        done
    fi
    if [[ "$found" == "false" ]]; then
        printf '  none exists\n'
    fi

    v2_on_path="no"
    if is_on_path "$V2_PREFIX/bin"; then
        v2_on_path="yes"
    fi
    printf '\n"%s" on PATH: %s\n' "$V2_PREFIX/bin" "$v2_on_path"
    if [[ "$v2_on_path" == "yes" ]]; then
        log_warn "that path must stay off PATH for the side-by-side layout"
    fi

    log_pass "check complete; nothing under HOME was changed"
}

# Build the side-by-side layout: v1 in the default prefix, v2 in its own prefix, launcher last
mode_both() {
    print_paths
    require_npm

    if is_on_path "$V2_PREFIX/bin"; then
        log_error "\"$V2_PREFIX/bin\" is on PATH; that recreates the name collision the side-by-side layout exists to avoid"
        log_error "Remove it from PATH and rerun this mode"
        exit 1
    fi

    if pinned_installed "$V1_PREFIX/lib/node_modules/opencode-ai/package.json" \
        "$V1_PKG" "$V1_PREFIX/bin/opencode"; then
        log_info "already installed: $V1_PKG, skipped"
        printf '[rollback, never run] %s\n' "npm uninstall -g --prefix \"$V1_PREFIX\" opencode-ai"
    else
        print_step "npm install -g --prefix \"$V1_PREFIX\" \"$V1_PKG\"" \
            "npm uninstall -g --prefix \"$V1_PREFIX\" opencode-ai"
        if ! npm install -g --prefix "$V1_PREFIX" "$V1_PKG"; then
            log_error "npm install failed for $V1_PKG; nothing further was written"
            exit 1
        fi
    fi

    if pinned_installed "$V2_PREFIX/lib/node_modules/@opencode/cli/package.json" \
        "$V2_PKG" "$V2_PREFIX/bin/opencode2"; then
        log_info "already installed: $V2_PKG, skipped"
        printf '[rollback, never run] %s\n' "npm uninstall -g --prefix \"$V2_PREFIX\" @opencode/cli"
    else
        print_step "npm install -g --prefix \"$V2_PREFIX\" \"$V2_PKG\"" \
            "npm uninstall -g --prefix \"$V2_PREFIX\" @opencode/cli"
        if ! npm install -g --prefix "$V2_PREFIX" "$V2_PKG"; then
            log_error "npm install failed for $V2_PKG; nothing further was written"
            exit 1
        fi
    fi

    write_launcher
    ensure_probe_dir
    verify_pair
    log_pass "v1 and v2 are installed side by side"
}

# Install v1 only; refuse when a v2 already answers to the name opencode
mode_v1() {
    local shape on_path
    print_paths

    ensure_probe_dir
    shape="$(classify_name_on_path opencode)"
    if [[ "$shape" == "v2" ]]; then
        on_path="$(command -v opencode 2>/dev/null || true)"
        log_error "an OpenCode v2 is on PATH as 'opencode' ($on_path); installing v1 here would collide with it"
        log_error "Hint: run this script with \"both\" to build the side-by-side layout"
        exit 1
    fi

    require_npm

    if pinned_installed "$V1_PREFIX/lib/node_modules/opencode-ai/package.json" \
        "$V1_PKG" "$V1_PREFIX/bin/opencode"; then
        log_info "already installed: $V1_PKG, skipped"
        printf '[rollback, never run] %s\n' "npm uninstall -g --prefix \"$V1_PREFIX\" opencode-ai"
    else
        print_step "npm install -g --prefix \"$V1_PREFIX\" \"$V1_PKG\"" \
            "npm uninstall -g --prefix \"$V1_PREFIX\" opencode-ai"
        if ! npm install -g --prefix "$V1_PREFIX" "$V1_PKG"; then
            log_error "npm install failed for $V1_PKG"
            exit 1
        fi
    fi

    verify_one "$BIN/opencode" "v1"
    log_pass "opencode now reports v1"
}

# Install v2 only into the default prefix so the name opencode answers with v2
mode_v2() {
    local shape on_path
    print_paths

    ensure_probe_dir
    shape="$(classify_name_on_path opencode)"
    if [[ "$shape" == "v1" ]]; then
        on_path="$(command -v opencode 2>/dev/null || true)"
        log_error "an OpenCode v1 is on PATH as 'opencode' ($on_path)"
        log_error "Installing v2 into the default prefix would overwrite that name and orphan the v1 install"
        log_error "Hint: run this script with \"both\" to build the side-by-side layout"
        exit 1
    fi

    require_npm

    if pinned_installed "$V1_PREFIX/lib/node_modules/@opencode/cli/package.json" \
        "$V2_PKG" "$V1_PREFIX/bin/opencode"; then
        log_info "already installed: $V2_PKG, skipped"
        printf '[rollback, never run] %s\n' "npm uninstall -g --prefix \"$V1_PREFIX\" @opencode/cli"
    else
        print_step "npm install -g --prefix \"$V1_PREFIX\" \"$V2_PKG\"" \
            "npm uninstall -g --prefix \"$V1_PREFIX\" @opencode/cli"
        if ! npm install -g --prefix "$V1_PREFIX" "$V2_PKG"; then
            log_error "npm install failed for $V2_PKG"
            exit 1
        fi
    fi

    if [[ -e "$DB_DIR/opencode.db" ]]; then
        log_warn "a v1 database exists at $DB_DIR/opencode.db"
        log_warn "v2 adopts and migrates that file in place unless OPENCODE_DB is set"
        log_warn "move the file aside or export OPENCODE_DB before the first v2 run; this script changes no data file"
    fi

    verify_one "$BIN/opencode" "v2"
    log_pass "opencode now reports v2"
}

# ───────────────────────────────────────────────────────────────
# 5. ENTRY POINT
# ───────────────────────────────────────────────────────────────

usage() {
    cat <<EOF
Usage: $SCRIPT_NAME <both|v1|v2|check>

Modes:
  both   Install v1 and v2 side by side in the home directory and write the opencode2 launcher
  v1     Install v1 only into the default prefix
  v2     Install v2 only into the default prefix
  check  Report what each name resolves to; change nothing

Exit Codes:
   0 - Success
   1 - Refusal or failure
   2 - Usage error
EOF
}

if [[ $# -ne 1 ]]; then
    printf 'Error: expected exactly one mode\n\n' >&2
    usage >&2
    exit 2
fi

case "$1" in
    both) mode_both ;;
    v1) mode_v1 ;;
    v2) mode_v2 ;;
    check) mode_check ;;
    *)
        printf 'Error: unknown mode: %s\n\n' "$1" >&2
        usage >&2
        exit 2
        ;;
esac

exit 0
