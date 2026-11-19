#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: OPENCODE SETUP HELPER
# ───────────────────────────────────────────────────────────────
# Installs OpenCode 2 under HOME, reports which version each command
# name resolves to, and removes the OpenCode 1 install and launcher an
# earlier side-by-side layout left behind. OpenCode 2 is the only
# supported version.
#
# Usage: opencode-setup.sh <v2|remove-v1|check>
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

readonly V2_PKG="@opencode/cli@2.3.2"
readonly V1_PKG_NAME="opencode-ai"

# Every path derives from HOME, so a throwaway HOME isolates the whole run
readonly PREFIX="$HOME/.local"
readonly BIN="$HOME/.local/bin"
readonly DB_DIR="$HOME/.local/share/opencode"
# The only path the earlier side-by-side layout wrote its OpenCode 1 launcher to
readonly V1_LAUNCHER="$BIN/opencode1"

# Where remove-v1 sets aside an opencode entry that belongs to another install
readonly PRESERVED_ASIDE="$BIN/.opencode.remove-v1-preserved"

# Cleared at startup so an inherited value never replaces the helper's own probe folder
PROBE_DATA_DIR=""
# Set only while an opencode entry sits at the aside path, so an early exit can name it
PRESERVED_OPENCODE=""

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
    printf '  PREFIX: %s\n' "$PREFIX"
    printf '  BIN:    %s\n' "$BIN"
    printf '  DB_DIR: %s\n' "$DB_DIR"
}

# Announce a mutating step and the rollback line it would need; the rollback is printed, never run
print_step() {
    printf "\n${BOLD}[step]${NC} %s\n" "$1"
    printf '[rollback, never run] %s\n' "$2"
}

# Classify version output by shape, not by command name; the first matching token decides.
# OpenCode 1 is reported as unsupported, so a leftover install is named rather than hidden.
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
                        1) printf 'unsupported\n' ;;
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

# List the database files in the data folder; they are reported and never changed
list_data_files() {
    local db found="false"
    printf '\ndatabase files in %s:\n' "$DB_DIR"
    if [[ -d "$DB_DIR" ]]; then
        for db in "$DB_DIR"/*.db "$DB_DIR"/*.db-wal "$DB_DIR"/*.db-shm; do
            if [[ -e "$db" ]]; then
                printf '  %s\n' "$db"
                found="true"
            fi
        done
    fi
    if [[ "$found" == "false" ]]; then
        printf '  none exists\n'
    fi
}

# Refuse unless the launcher is the regular file the side-by-side layout wrote:
# a link, a folder or a file that does not run the OpenCode 1 package belongs to
# someone else, so it is never removed
check_v1_launcher() {
    if [[ -L "$V1_LAUNCHER" ]]; then
        log_error "$V1_LAUNCHER is a symlink to $(readlink "$V1_LAUNCHER"); only the launcher file this helper wrote is removed"
        log_error "Nothing was changed; remove the link yourself if it is yours to remove"
        exit 1
    fi
    if [[ ! -e "$V1_LAUNCHER" ]]; then
        return 0
    fi
    if [[ ! -f "$V1_LAUNCHER" ]] || ! grep -q -F "node_modules/$V1_PKG_NAME/" "$V1_LAUNCHER"; then
        log_error "$V1_LAUNCHER is not the OpenCode 1 launcher this helper wrote"
        log_error "Nothing was changed; remove the file yourself if it is yours to remove"
        exit 1
    fi
}

# ───────────────────────────────────────────────────────────────
# 4. MODES
# ───────────────────────────────────────────────────────────────

# Report what each name resolves to and which data files exist; this mode never writes
mode_check() {
    local name on_path direct candidate shape resolved
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

    list_data_files

    log_pass "check complete; nothing under HOME was changed"
}

# Install v2 into the default prefix so the name opencode answers with v2
mode_v2() {
    print_paths
    ensure_probe_dir
    require_npm

    if pinned_installed "$PREFIX/lib/node_modules/@opencode/cli/package.json" \
        "$V2_PKG" "$PREFIX/bin/opencode"; then
        log_info "already installed: $V2_PKG, skipped"
        printf '[rollback, never run] %s\n' "npm uninstall -g --prefix \"$PREFIX\" @opencode/cli"
    else
        print_step "npm install -g --prefix \"$PREFIX\" \"$V2_PKG\"" \
            "npm uninstall -g --prefix \"$PREFIX\" @opencode/cli"
        if ! npm install -g --prefix "$PREFIX" "$V2_PKG"; then
            log_error "npm install failed for $V2_PKG"
            exit 1
        fi
    fi

    if [[ -e "$DB_DIR/opencode.db" ]]; then
        log_warn "a database already exists at $DB_DIR/opencode.db"
        log_warn "v2 adopts and migrates that file in place unless OPENCODE_DB is set"
        log_warn "move the file aside or export OPENCODE_DB before the first v2 run; this script changes no data file"
    fi

    verify_one "$BIN/opencode" "v2"
    log_pass "opencode now reports v2"
}

# Move the user's opencode entry back from where remove-v1 set it aside, then prove
# it still resolves to the target it had before the uninstall
restore_opencode() {
    local link_before="$1" resolved_before="$2" link_after=""
    if [[ -L "$BIN/opencode" || -e "$BIN/opencode" ]]; then
        log_error "$BIN/opencode reappeared during the uninstall; the original is kept at $PRESERVED_OPENCODE"
        log_error "Move it back yourself once you have checked which one you want"
        exit 1
    fi
    mv -- "$PRESERVED_OPENCODE" "$BIN/opencode"
    PRESERVED_OPENCODE=""
    if [[ -L "$BIN/opencode" ]]; then
        link_after="$(readlink "$BIN/opencode")"
    fi
    if [[ "$link_after" != "$link_before" ]] \
        || [[ "$(resolve_realpath "$BIN/opencode")" != "$resolved_before" ]]; then
        log_error "$BIN/opencode no longer resolves to $resolved_before after the restore"
        exit 1
    fi
    log_info "opencode: restored ($BIN/opencode -> ${link_before:-regular file}, resolves to $resolved_before)"
}

# Remove the OpenCode 1 package from the default prefix and the opencode1 launcher;
# every refusal runs before the first write, and data files are listed, never removed.
# npm removes $BIN/opencode by bin name when it uninstalls opencode-ai, wherever that
# entry points, so an opencode that belongs to another install is set aside first.
mode_remove_v1() {
    local pkg_dir="$PREFIX/lib/node_modules/$V1_PKG_NAME"
    local manifest="$pkg_dir/package.json" version pkg_real reinstall
    local keep_opencode="false" link_before="" resolved_before=""

    print_paths
    check_v1_launcher

    if [[ -f "$manifest" ]]; then
        require_npm
        version="$(manifest_version "$manifest" || true)"
        reinstall="npm install -g --prefix \"$PREFIX\" \"$V1_PKG_NAME@${version:-<version>}\""
        pkg_real="$(cd "$pkg_dir" && pwd -P)"

        if [[ -L "$BIN/opencode" || -e "$BIN/opencode" ]]; then
            if [[ -L "$BIN/opencode" ]]; then
                link_before="$(readlink "$BIN/opencode")"
            fi
            resolved_before="$(resolve_realpath "$BIN/opencode")"
            if [[ "$resolved_before" == "$pkg_real/"* ]]; then
                log_info "opencode: $BIN/opencode resolves into $V1_PKG_NAME ($resolved_before); no OpenCode 2 there, it goes with the package"
            else
                if [[ -L "$PRESERVED_ASIDE" || -e "$PRESERVED_ASIDE" ]]; then
                    log_error "$PRESERVED_ASIDE already exists; an earlier run may have left the opencode entry there"
                    log_error "Nothing was changed; move it back to $BIN/opencode or remove it, then rerun"
                    exit 1
                fi
                keep_opencode="true"
            fi
        fi

        if [[ "$keep_opencode" == "true" ]]; then
            print_step "preserve \"$BIN/opencode\" (-> ${link_before:-regular file}, resolves to $resolved_before) at \"$PRESERVED_ASIDE\" during the uninstall, then restore it" \
                "mv \"$PRESERVED_ASIDE\" \"$BIN/opencode\""
            trap 'if [[ -n "${PRESERVED_OPENCODE:-}" ]]; then log_warn "your opencode entry is still at $PRESERVED_OPENCODE; move it back to $BIN/opencode"; fi' EXIT
            trap 'exit 130' INT
            trap 'exit 143' TERM
            mv -- "$BIN/opencode" "$PRESERVED_ASIDE"
            PRESERVED_OPENCODE="$PRESERVED_ASIDE"
            if [[ -n "$link_before" ]]; then
                reinstall="$reinstall, then restore the OpenCode 2 link: ln -sfn '$link_before' \"$BIN/opencode\" (or run $SCRIPT_NAME v2)"
            else
                reinstall="$reinstall, then run $SCRIPT_NAME v2 so OpenCode 2 owns opencode again"
            fi
        else
            reinstall="$reinstall, then run $SCRIPT_NAME v2 so OpenCode 2 owns opencode"
        fi

        print_step "npm uninstall -g --prefix \"$PREFIX\" $V1_PKG_NAME" "$reinstall"
        if ! npm uninstall -g --prefix "$PREFIX" "$V1_PKG_NAME"; then
            log_error "npm uninstall failed for $V1_PKG_NAME; the launcher was left in place"
            if [[ "$keep_opencode" == "true" ]]; then
                restore_opencode "$link_before" "$resolved_before"
            fi
            exit 1
        fi
        if [[ "$keep_opencode" == "true" ]]; then
            restore_opencode "$link_before" "$resolved_before"
        fi
    else
        log_info "$V1_PKG_NAME: not installed under $PREFIX, skipped"
    fi

    if [[ -e "$V1_LAUNCHER" ]]; then
        print_step "remove launcher \"$V1_LAUNCHER\"" \
            "none needed: the launcher only ran the package removed above"
        rm -- "$V1_LAUNCHER"
        log_info "launcher: removed ($V1_LAUNCHER)"
    else
        log_info "launcher: not present ($V1_LAUNCHER), skipped"
    fi

    list_data_files
    log_info "data files were left in place; an opencode-v1.db holds only OpenCode 1 history and is yours to keep or delete"
    if [[ ! -e "$BIN/opencode" ]]; then
        log_warn "nothing answers to opencode in $BIN now; run this script with \"v2\" to install OpenCode 2"
    fi
    log_pass "OpenCode 1 removed"
}

# ───────────────────────────────────────────────────────────────
# 5. ENTRY POINT
# ───────────────────────────────────────────────────────────────

usage() {
    cat <<EOF
Usage: $SCRIPT_NAME <v2|remove-v1|check>

Modes:
  v2         Install OpenCode 2 into the default prefix
  remove-v1  Remove the OpenCode 1 package and the opencode1 launcher; data files are listed and left in place
  check      Report what each name resolves to; change nothing

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
    v2) mode_v2 ;;
    remove-v1) mode_remove_v1 ;;
    check) mode_check ;;
    *)
        printf 'Error: unknown mode: %s\n\n' "$1" >&2
        usage >&2
        exit 2
        ;;
esac

exit 0
