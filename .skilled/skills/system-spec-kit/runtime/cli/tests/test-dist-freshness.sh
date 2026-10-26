#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Dist Freshness Validation Tests
# ───────────────────────────────────────────────────────────────
# Verifies validate.sh fails closed on stale compiled validation dist output and
# passes through once the dist entry is newer than the watched source.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
VALIDATOR="$SCRIPT_DIR/../spec/validate.sh"
FIXTURE="$SCRIPT_DIR/../test-fixtures/053-template-compliant-level2"
SOURCE="$REPO_ROOT/.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts"
DIST="$REPO_ROOT/.skilled/skills/system-spec-kit/runtime/dist/lib/validation/orchestrator.js"
REBUILD_COMMAND="cd .skilled/skills/system-spec-kit/runtime && npm run build"
CACHE_GLOB="$REPO_ROOT/.skilled/skills/system-spec-kit/runtime/dist/lib/validation/.dist-freshness-system-spec-kit-runtime-"*.json

PASSED=0
FAILED=0
SOURCE_BACKUP=""
HOISTED_FIXTURE=""

snapshot_times() {
    python3 - "$1" <<'PY'
import os
import sys
st = os.stat(sys.argv[1])
print(f"{st.st_atime_ns} {st.st_mtime_ns}")
PY
}

restore_file() {
    [[ -n "$SOURCE_BACKUP" && -f "$SOURCE_BACKUP" ]] && cp "$SOURCE_BACKUP" "$SOURCE"
    python3 - "$SOURCE" "$SOURCE_ATIME_NS" "$SOURCE_MTIME_NS" "$DIST" "$DIST_ATIME_NS" "$DIST_MTIME_NS" <<'PY'
import os
import sys
source, source_atime, source_mtime, dist, dist_atime, dist_mtime = sys.argv[1:]
if os.path.exists(source):
    os.utime(source, ns=(int(source_atime), int(source_mtime)))
if os.path.exists(dist):
    os.utime(dist, ns=(int(dist_atime), int(dist_mtime)))
PY
    rm -f $CACHE_GLOB
    [[ -n "$SOURCE_BACKUP" && -f "$SOURCE_BACKUP" ]] && rm -f "$SOURCE_BACKUP"
    if [[ -n "$HOISTED_FIXTURE" && -d "$HOISTED_FIXTURE" ]]; then
        rm -rf "$HOISTED_FIXTURE"
    fi
}

record_pass() {
    printf '[PASS] %s\n' "$1"
    PASSED=$((PASSED + 1))
}

record_fail() {
    printf '[FAIL] %s\n' "$1" >&2
    printf '%s\n' "$2" >&2
    FAILED=$((FAILED + 1))
}

if [[ ! -f "$VALIDATOR" || ! -d "$FIXTURE" || ! -f "$SOURCE" || ! -f "$DIST" ]]; then
    printf 'Required validator fixture or dist/source file is missing.\n' >&2
    exit 1
fi

SOURCE_TIMES=$(snapshot_times "$SOURCE")
DIST_TIMES=$(snapshot_times "$DIST")
SOURCE_ATIME_NS=${SOURCE_TIMES%% *}
SOURCE_MTIME_NS=${SOURCE_TIMES##* }
DIST_ATIME_NS=${DIST_TIMES%% *}
DIST_MTIME_NS=${DIST_TIMES##* }
SOURCE_BACKUP=$(mktemp)
cp "$SOURCE" "$SOURCE_BACKUP"
trap restore_file EXIT

printf '\nDist Freshness Validation Tests\n'
printf '%s\n' '-----------------------------------------------------------------'

printf '\n' >> "$SOURCE"
touch -t 202001010000 "$DIST"
rm -f $CACHE_GLOB

stale_rc=0
stale_output=$(SPECKIT_COMPLETION_FRESHNESS=0 "$VALIDATOR" "$FIXTURE" 2>&1) || stale_rc=$?
if [[ "$stale_rc" -eq 3 && "$stale_output" == *"$REBUILD_COMMAND"* ]]; then
    record_pass "validate.sh exits 3 with rebuild command when validation dist is stale"
else
    record_fail "validate.sh stale-dist backstop" "Expected exit 3 and rebuild command; got exit $stale_rc. Output: $stale_output"
fi

touch "$DIST"
fresh_rc=0
fresh_output=$(SPECKIT_COMPLETION_FRESHNESS=0 "$VALIDATOR" "$FIXTURE" 2>&1) || fresh_rc=$?
if [[ "$fresh_rc" -ne 3 && "$fresh_output" != *"compiled validation orchestrator is stale"* ]]; then
    record_pass "validate.sh passes through when validation dist is newer than source"
else
    record_fail "validate.sh fresh-dist passthrough" "Expected non-stale validation behavior; got exit $fresh_rc. Output: $fresh_output"
fi

check_json=$(node "$SCRIPT_DIR/../lib/dist-freshness.cjs" check-file --file "$DIST" --json --no-write)
if [[ "$check_json" == *'"status":"fresh"'* && "$check_json" == *'"packageId":"system-spec-kit/runtime"'* ]]; then
    record_pass "check-file maps a dist entry back to its package"
else
    record_fail "check-file dist entry mapping" "Expected a fresh verdict for $DIST; got $check_json"
fi

# An npm workspace hoists dependencies to an ancestor, so a package folder can hold no
# node_modules of its own while its imports resolve. The checker has to read that shape
# as provisioned, or every stale build in a fresh worktree passes as clean, and it has
# to read the same tree as unprovisioned once nothing is installed up to the root.
HOISTED_FIXTURE=$(mktemp -d)
hoisted_package="$HOISTED_FIXTURE/.skilled/skills/system-spec-kit/shared"
mkdir -p "$hoisted_package/dist" "$HOISTED_FIXTURE/.skilled/node_modules"
printf '{"name": "@spec-kit/shared"}\n' > "$hoisted_package/package.json"
printf '{"compilerOptions": {}}\n' > "$hoisted_package/tsconfig.json"
printf 'export const value = 1;\n' > "$hoisted_package/index.ts"
printf '{"build": "current"}\n' > "$hoisted_package/dist/tsconfig.tsbuildinfo"
touch -t 202004010000 "$hoisted_package/package.json" "$hoisted_package/tsconfig.json" "$hoisted_package/index.ts"
touch -t 202001010000 "$hoisted_package/dist/tsconfig.tsbuildinfo"

# A stale verdict exits 69, which is the verdict rather than a failure of this case.
hoisted_rc=0
hoisted_json=$(node "$SCRIPT_DIR/../lib/dist-freshness.cjs" check --package system-spec-kit/shared \
    --workspace-root "$HOISTED_FIXTURE" --json --no-write) || hoisted_rc=$?
rm -rf "$HOISTED_FIXTURE/.skilled/node_modules"
bare_rc=0
bare_json=$(node "$SCRIPT_DIR/../lib/dist-freshness.cjs" check --package system-spec-kit/shared \
    --workspace-root "$HOISTED_FIXTURE" --json --no-write) || bare_rc=$?
if [[ "$hoisted_json" == *'"status":"stale"'* && "$hoisted_rc" -eq 69 && "$bare_json" == *'"status":"unprovisioned"'* && "$bare_rc" -eq 0 ]]; then
    record_pass "a package whose dependencies hoisted to an ancestor reports its stale build"
else
    record_fail "hoisted dependency provisioning" "Expected a stale exit 69 then unprovisioned exit 0; got $hoisted_rc $hoisted_json and $bare_rc $bare_json"
fi
rm -rf "$HOISTED_FIXTURE"
HOISTED_FIXTURE=""

printf '\nTotals: %s passed, %s failed\n' "$PASSED" "$FAILED"
if [[ "$FAILED" -gt 0 ]]; then
    exit 1
fi
