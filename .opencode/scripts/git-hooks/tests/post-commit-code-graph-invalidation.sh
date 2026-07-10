#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: POST-COMMIT CODE-GRAPH INVALIDATION HARNESS
# ───────────────────────────────────────────────────────────────
# Regression harness for code-graph post-commit invalidation and launcher consumption.
#
# Exit codes:
#   0 - All scenarios passed
#   1 - One or more scenarios failed

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. HARNESS SETUP
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/post-commit"
LAUNCHER="$REPO_ROOT/.opencode/bin/mk-code-index-launcher.cjs"
TEMP_ROOT="$(mktemp -d "$SCRIPT_DIR/.tmp-post-commit-invalidation.XXXXXX")"
FAILURES=0

cleanup() {
  if [[ -n "${HOLDER_PID:-}" ]]; then
    kill "$HOLDER_PID" 2>/dev/null || true
    wait "$HOLDER_PID" 2>/dev/null || true
  fi
  rm -rf "$TEMP_ROOT"
}
trap cleanup EXIT

# ───────────────────────────────────────────────────────────────
# 2. FIXTURE HELPERS
# ───────────────────────────────────────────────────────────────

run_test() {
  local name="$1"
  shift

  if "$@"; then
    printf 'PASS: %s\n' "$name"
  else
    printf 'FAIL: %s\n' "$name" >&2
    FAILURES=$((FAILURES + 1))
  fi
}

create_fake_git() {
  local bin_dir="$1"
  mkdir -p "$bin_dir"
  cat > "$bin_dir/git" <<'GIT'
#!/usr/bin/env bash
set -euo pipefail

case "${1:-} ${2:-}" in
  "rev-parse --show-toplevel")
    printf '%s\n' "$TEST_REPO_ROOT"
    ;;
  "rev-parse HEAD")
    printf '%s\n' '0123456789abcdef0123456789abcdef01234567'
    ;;
  "diff-tree --no-commit-id")
    printf '%s\n' 'src/one.ts' 'src/two.ts'
    ;;
  *)
    printf 'unexpected git invocation: %s\n' "$*" >&2
    exit 1
    ;;
esac
GIT
  chmod +x "$bin_dir/git"
}

seed_code_graph_files() {
  local db_dir="$1"
  mkdir -p "$db_dir"
  printf 'sqlite-state\n' > "$db_dir/code-graph.sqlite"
  printf 'wal-state\n' > "$db_dir/code-graph.sqlite-wal"
  printf 'shm-state\n' > "$db_dir/code-graph.sqlite-shm"
  printf '{"freshness":"fresh"}\n' > "$db_dir/.code-graph-readiness.json"
}

# ───────────────────────────────────────────────────────────────
# 3. TEST SCENARIOS
# ───────────────────────────────────────────────────────────────

test_live_holder_gets_marker_without_deletion() {
  local workspace="$TEMP_ROOT/live-holder"
  local db_dir="$workspace/.opencode/skills/system-code-graph/mcp_server/database"
  local legacy_parent="$workspace/.opencode/.spec-kit/code-graph"
  local fake_bin="$workspace/fake-bin"
  local ready_file="$workspace/holder-ready"
  local stderr_file="$workspace/hook.stderr"
  local marker="$db_dir/.code-graph-invalidation.json"

  seed_code_graph_files "$db_dir"
  mkdir -p "$legacy_parent"
  ln -s "$db_dir" "$legacy_parent/database"
  create_fake_git "$fake_bin"

  bash -c 'exec 9<"$1"; : > "$2"; while :; do sleep 1; done' \
    _ "$db_dir/code-graph.sqlite" "$ready_file" &
  HOLDER_PID=$!
  while [[ ! -f "$ready_file" ]]; do
    sleep 0.01
  done

  PATH="$fake_bin:$PATH" \
    TEST_REPO_ROOT="$workspace" \
    SPECKIT_CODE_GRAPH_POST_COMMIT_REBUILD_THRESHOLD=1 \
    bash "$HOOK" 2> "$stderr_file" || return 1

  kill -0 "$HOLDER_PID" || return 1
  [[ -f "$db_dir/code-graph.sqlite" ]] || return 1
  [[ -f "$db_dir/code-graph.sqlite-wal" ]] || return 1
  [[ -f "$db_dir/code-graph.sqlite-shm" ]] || return 1
  [[ -f "$db_dir/.code-graph-readiness.json" ]] || return 1
  [[ -f "$marker" ]] || return 1
  node -e 'JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8"))' "$marker" || return 1
  [[ "$(<"$stderr_file")" == *"atomic invalidation marker"* ]] || return 1
  ! compgen -G "$marker.tmp.*" >/dev/null || return 1

  kill "$HOLDER_PID"
  wait "$HOLDER_PID" 2>/dev/null || true
  HOLDER_PID=""
}

test_dry_run_preserves_state() {
  local workspace="$TEMP_ROOT/dry-run"
  local db_dir="$workspace/.opencode/skills/system-code-graph/mcp_server/database"
  local fake_bin="$workspace/fake-bin"
  local stderr_file="$workspace/hook.stderr"
  local marker="$db_dir/.code-graph-invalidation.json"

  seed_code_graph_files "$db_dir"
  create_fake_git "$fake_bin"

  PATH="$fake_bin:$PATH" \
    TEST_REPO_ROOT="$workspace" \
    SPECKIT_CODE_GRAPH_POST_COMMIT_REBUILD_THRESHOLD=1 \
    SPECKIT_CODE_GRAPH_POST_COMMIT_DRY_RUN=1 \
    bash "$HOOK" 2> "$stderr_file" || return 1

  [[ -f "$db_dir/code-graph.sqlite" ]] || return 1
  [[ ! -e "$marker" ]] || return 1
  [[ "$(<"$stderr_file")" == *"would write atomic invalidation marker"* ]] || return 1
}

test_launcher_consumes_only_with_exclusive_ownership() {
  local db_dir="$TEMP_ROOT/launcher/.opencode/skills/system-code-graph/mcp_server/database"
  local marker="$db_dir/.code-graph-invalidation.json"

  seed_code_graph_files "$db_dir"
  printf '{"version":1,"reason":"post-commit-threshold"}\n' > "$marker"

  LAUNCHER_PATH="$LAUNCHER" DB_DIR="$db_dir" node <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const launcher = require(process.env.LAUNCHER_PATH);
const dbDir = process.env.DB_DIR;
const marker = path.join(dbDir, '.code-graph-invalidation.json');
const sqlite = path.join(dbDir, 'code-graph.sqlite');

assert.equal(typeof launcher.consumeCodeGraphInvalidation, 'function');
const deferred = launcher.consumeCodeGraphInvalidation(dbDir, {
  exclusiveOwnership: false,
  connectionsClosed: false,
});
assert.equal(deferred.reason, 'ownership-not-exclusive');
assert.equal(fs.existsSync(marker), true);
assert.equal(fs.existsSync(sqlite), true);

const consumed = launcher.consumeCodeGraphInvalidation(dbDir, {
  exclusiveOwnership: true,
  connectionsClosed: true,
});
assert.equal(consumed.consumed, true);
assert.equal(fs.existsSync(marker), false);
for (const file of [
  'code-graph.sqlite',
  'code-graph.sqlite-wal',
  'code-graph.sqlite-shm',
  '.code-graph-readiness.json',
]) {
  assert.equal(fs.existsSync(path.join(dbDir, file)), false, `${file} should be reset`);
}
NODE
}

# ───────────────────────────────────────────────────────────────
# 4. EXECUTION
# ───────────────────────────────────────────────────────────────

run_test 'live SQLite holder keeps files and receives a marker' \
  test_live_holder_gets_marker_without_deletion
run_test 'dry-run reports marker intent without changing state' \
  test_dry_run_preserves_state
run_test 'launcher consumes marker only with exclusive ownership' \
  test_launcher_consumes_only_with_exclusive_ownership

if [[ "$FAILURES" -ne 0 ]]; then
  printf '%d test(s) failed\n' "$FAILURES" >&2
  exit 1
fi

printf 'All 3 post-commit invalidation tests passed\n'
