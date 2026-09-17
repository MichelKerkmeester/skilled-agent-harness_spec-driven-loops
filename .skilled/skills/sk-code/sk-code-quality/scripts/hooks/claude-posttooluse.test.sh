#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADAPTER="$(cd "$SCRIPT_DIR/../../../../../hooks/post-edit-quality/claude" && pwd)/claude-posttooluse.cjs"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

node --check "$ADAPTER"

BROKEN_ADAPTER="$TMP_DIR/claude-posttooluse.cjs"
cp "$ADAPTER" "$BROKEN_ADAPTER"
printf '\n<<<<<<< HEAD\n' >> "$BROKEN_ADAPTER"

set +e
node --check "$BROKEN_ADAPTER" >/dev/null 2>&1
BROKEN_RC=$?
set -e

if [[ "$BROKEN_RC" -eq 0 ]]; then
  printf 'FAIL: a syntax-broken adapter copy parsed successfully\n' >&2
  exit 1
fi

printf 'Post-edit adapter parse regression fixture passed\n'
