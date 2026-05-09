#!/usr/bin/env bash
# COMPONENT: Doctor Sandbox Fixture Fetch
# Resolves and verifies archived sandbox states declared by manifest.json.
#
# Per-fixture sources (priority order):
#   1. local_path     -- relative to manifest.json directory; cp into states/
#   2. url            -- file:// or https:// URL fetched via curl
#   3. placeholder=true -- skip without warning (intentional pending fixture)
#
# Exit Codes:
#   0 - All available fixtures are present, copied, downloaded, or skipped intentionally
#   1 - Source resolution or checksum verification failed for at least one fixture

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="${SCRIPT_DIR}/manifest.json"
STATES_DIR="${SCRIPT_DIR}/states"

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' NC=''
fi

log_info() {
    printf '%s\n' "$1"
}

log_warn() {
    printf '%bWARN:%b %s\n' "$YELLOW" "$NC" "$1" >&2
}

log_error() {
    printf '%bERROR:%b %s\n' "$RED" "$NC" "$1" >&2
}

sha256_file() {
    local file_path="$1"
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$file_path" | awk '{print $1}'
    else
        shasum -a 256 "$file_path" | awk '{print $1}'
    fi
}

resolve_local_path() {
    local relative="$1"
    if [[ "$relative" = /* ]]; then
        printf '%s\n' "$relative"
        return 0
    fi
    (cd "$SCRIPT_DIR" && cd "$(dirname "$relative")" 2>/dev/null && printf '%s/%s\n' "$(pwd)" "$(basename "$relative")") \
        || printf '%s/%s\n' "$SCRIPT_DIR" "$relative"
}

fetch_one_fixture() {
    local name="$1"
    local placeholder
    local local_path
    local url
    local expected_sha
    local target="${STATES_DIR}/${name}.tar.gz"
    local actual_sha=""

    placeholder="$(jq -r --arg name "$name" '.fixtures[$name].placeholder // false' "$MANIFEST")"
    local_path="$(jq -r --arg name "$name" '.fixtures[$name].local_path // empty' "$MANIFEST")"
    url="$(jq -r --arg name "$name" '.fixtures[$name].url // empty' "$MANIFEST")"
    expected_sha="$(jq -r --arg name "$name" '.fixtures[$name].sha256' "$MANIFEST")"

    if [[ -f "$target" ]]; then
        actual_sha="$(sha256_file "$target")"
        if [[ "$actual_sha" = "$expected_sha" ]]; then
            log_info "OK ${name}: checksum matched, skipping"
            return 0
        fi
        log_warn "${name}: existing file checksum mismatch, re-fetching"
        rm -f "$target"
    fi

    if [[ "$placeholder" = "true" ]]; then
        log_info "SKIP ${name}: marked placeholder=true (pending publish)"
        return 0
    fi

    if [[ -n "$local_path" ]]; then
        local resolved
        resolved="$(resolve_local_path "$local_path")"
        if [[ ! -f "$resolved" ]]; then
            log_error "${name}: local_path missing on disk: ${resolved}"
            return 1
        fi
        log_info "COPY ${name}: ${resolved}"
        cp "$resolved" "$target"
    elif [[ -n "$url" ]]; then
        log_info "FETCH ${name}: ${url}"
        if ! curl -fL "$url" -o "$target"; then
            log_error "${name}: download failed"
            rm -f "$target"
            return 1
        fi
    else
        log_error "${name}: no local_path or url declared"
        return 1
    fi

    actual_sha="$(sha256_file "$target")"
    if [[ "$actual_sha" != "$expected_sha" ]]; then
        log_error "${name}: checksum mismatch expected=${expected_sha} actual=${actual_sha}"
        rm -f "$target"
        return 1
    fi

    log_info "OK ${name}: resolved and verified"
    return 0
}

main() {
    local failures=0
    local fixture_names=""
    local name=""

    mkdir -p "$STATES_DIR"

    if [[ ! -f "$MANIFEST" ]]; then
        log_error "manifest not found: ${MANIFEST}"
        return 1
    fi

    fixture_names="$(jq -r '.fixtures | keys[]' "$MANIFEST")"
    while IFS= read -r name; do
        [[ -n "$name" ]] || continue
        if ! fetch_one_fixture "$name"; then
            failures=$((failures + 1))
        fi
    done <<EOF
$fixture_names
EOF

    if [[ "$failures" -gt 0 ]]; then
        log_error "fixture fetch completed with ${failures} failure(s)"
        return 1
    fi

    printf '%bOK:%b fixture fetch complete\n' "$GREEN" "$NC"
    return 0
}

main "$@"
