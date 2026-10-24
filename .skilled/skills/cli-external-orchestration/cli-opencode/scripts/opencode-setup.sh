#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: OPENCODE SETUP HELPER
# ───────────────────────────────────────────────────────────────
# Builds the v2-only (recommended), side-by-side or v1-only (fallback)
# OpenCode layout under HOME, and reports which version each command
# name resolves to. OpenCode 2 is the expected version; OpenCode 1 is
# kept for users who have not updated yet.
#
# Usage: opencode-setup.sh <v2|both|v1|check>
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
readonly V2_PKG="@opencode/cli@2.1.4"

# Every path derives from HOME, so a throwaway HOME isolates the whole run
readonly V1_PREFIX="$HOME/.local"
readonly V2_PREFIX="$HOME/.local/opencode-v2"
readonly BIN="$HOME/.local/bin"
readonly DB_DIR="$HOME/.local/share/opencode"
readonly LAUNCHER="$BIN/opencode1"
# Relative to BIN, the same shape npm writes, so the side-by-side names point into the v2 prefix
readonly V2_LINK_TARGET="../opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe"

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
# OpenCode 1 fallback. OpenCode 2 owns opencode.db and migrates it in place,
# so v1 keeps its own copy. A relative OPENCODE_DB resolves under the shared data directory.
# An auto-update reinstalls the v1 package, which takes the opencode name back from v2.
: "${OPENCODE_DB:=opencode-v1.db}"
: "${OPENCODE_DISABLE_AUTOUPDATE:=1}"
export OPENCODE_DB OPENCODE_DISABLE_AUTOUPDATE
exec "$HOME/.local/lib/node_modules/opencode-ai/bin/opencode.exe" "$@"
LAUNCHER_EOF
}

# Point one name in BIN at the v2 binary; a file the earlier layout left there is moved aside, never deleted
link_v2_name() {
    local name="$1" path="$BIN/$1" aside="$BIN/$1.pre-v2-default"
    if [[ -L "$path" ]] && [[ "$(readlink "$path")" == "$V2_LINK_TARGET" ]]; then
        log_info "$name: left unchanged ($path)"
        return 0
    fi
    if [[ -L "$path" ]]; then
        print_step "relink \"$path\" to v2" "ln -sfn \"$(readlink "$path")\" \"$path\""
    elif [[ -e "$path" ]]; then
        if [[ -e "$aside" ]] || [[ -L "$aside" ]]; then
            log_error "$aside already exists; moving $path aside would overwrite it"
            log_error "Nothing was moved; remove or rename $aside and rerun this mode"
            exit 1
        fi
        print_step "move \"$path\" aside to \"$aside\" and link the name to v2" "rm \"$path\" && mv \"$aside\" \"$path\""
        mv "$path" "$aside"
    else
        print_step "link \"$path\" to v2" "rm \"$path\""
    fi
    ln -sfn "$V2_LINK_TARGET" "$path"
    log_info "$name: now runs v2 ($path)"
}

# Retire the opencode2 name: a link into the v2 prefix is removed, anything else is moved aside, never deleted
retire_opencode2() {
    local path="$BIN/opencode2" aside="$BIN/opencode2.pre-v2-default"
    if [[ ! -e "$path" ]] && [[ ! -L "$path" ]]; then
        return 0
    fi
    if [[ -L "$path" ]] && [[ "$(readlink "$path")" == "$V2_LINK_TARGET" ]]; then
        print_step "remove \"$path\"" "ln -s \"$V2_LINK_TARGET\" \"$path\""
        rm "$path"
    else
        if [[ -e "$aside" ]] || [[ -L "$aside" ]]; then
            log_error "$aside already exists; moving $path aside would overwrite it"
            log_error "Nothing was moved; remove or rename $aside and rerun this mode"
            exit 1
        fi
        print_step "move \"$path\" aside to \"$aside\"" "mv \"$aside\" \"$path\""
        mv "$path" "$aside"
    fi
    log_info "opencode2: retired ($path)"
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

# Verify all three names after the launcher lands; every line prints before any failure exit
verify_pair() {
    local failed=0 name want
    for name in opencode:v2 opencode1:v1; do
        want="${name#*:}"
        name="${name%%:*}"
        if ! probe_shape "$BIN/$name" "$want"; then
            log_error "$BIN/$name did not report a $want version"
            failed=1
        fi
    done
    if [[ "$failed" -ne 0 ]]; then
        exit 1
    fi
}

# ───────────────────────────────────────────────────────────────
# 4. MODES
# ───────────────────────────────────────────────────────────────

# Report what each name resolves to and which data files exist; this mode never writes
mode_check() {
    local name on_path direct candidate shape resolved found db
    local opencode_on_path="" opencode_shape=""

    ensure_probe_dir
    print_paths

    for name in opencode opencode2 opencode1; do
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

    log_pass "check complete; nothing under HOME was changed"
}

# Build the side-by-side layout: both packages installed, opencode linked to v2, opencode2 retired, the opencode1 launcher last
mode_both() {
    print_paths
    require_npm

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

    # The v1 install takes the name opencode, so the v2 links are written after it
    link_v2_name opencode
    retire_opencode2
    write_launcher

    if [[ -e "$DB_DIR/opencode.db" ]] && [[ ! -e "$DB_DIR/opencode-v1.db" ]]; then
        log_warn "v2 now runs as opencode and migrates $DB_DIR/opencode.db in place on its first run"
        log_warn "to keep v1's history, copy it first: sqlite3 \"$DB_DIR/opencode.db\" \".backup '$DB_DIR/opencode-v1.db'\""
        log_warn "this script changes no data file"
    fi

    ensure_probe_dir
    verify_pair
    log_pass "v2 answers to opencode; v1 answers to opencode1"
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
Usage: $SCRIPT_NAME <v2|both|v1|check>

Modes:
  v2     Install v2 only into the default prefix (recommended)
  both   Install v1 and v2 side by side: opencode runs v2, the opencode1 launcher runs v1 (recommended)
  v1     Install v1 only into the default prefix (fallback for users who have not updated)
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
