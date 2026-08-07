#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST_PATH="${1:-$SCRIPT_DIR/goal-file-manifest.txt}"
GIT_BIN="${SPECKIT_MANIFEST_GIT_BIN:-git}"

fail_closed() {
    echo "FAIL CLOSED: $*" >&2
    exit 2
}

command -v "$GIT_BIN" >/dev/null 2>&1 || fail_closed "git is unavailable"
[[ -f "$MANIFEST_PATH" ]] || fail_closed "manifest not found: $MANIFEST_PATH"

REPO_ROOT="${2:-}"
if [[ -z "$REPO_ROOT" ]]; then
    REPO_ROOT=$("$GIT_BIN" -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null) || fail_closed "repository root could not be resolved"
fi

tracked_files=$(mktemp "${TMPDIR:-/tmp}/goal-file-manifest.XXXXXX") || fail_closed "temporary file could not be created"
trap 'rm -f "$tracked_files"' EXIT

"$GIT_BIN" -C "$REPO_ROOT" ls-files >"$tracked_files" 2>/dev/null || fail_closed "git ls-files could not be read"

checked=0
missing=0
while IFS= read -r entry || [[ -n "$entry" ]]; do
    [[ -z "$entry" ]] && continue
    [[ "$entry" =~ ^[[:space:]]*# ]] && continue
    checked=$((checked + 1))
    if ! grep -Fqx -- "$entry" "$tracked_files"; then
        echo "NOT TRACKED: $entry" >&2
        missing=$((missing + 1))
    fi
done < "$MANIFEST_PATH"

if [[ "$missing" -gt 0 ]]; then
    echo "Manifest entries checked: $checked; untracked entries: $missing" >&2
    exit 1
fi

echo "Manifest entries checked: $checked; all entries are tracked"
