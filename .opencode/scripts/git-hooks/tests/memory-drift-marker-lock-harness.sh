#!/usr/bin/env bash
# Exercises drift-marker path parity and lock ownership against real helper processes.
#
# Exit codes:
#   0 - All scenarios passed
#   1 - Fixture setup or an assertion failed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARKER_LIB="$(cd "$SCRIPT_DIR/../lib" && pwd)/memory-drift-marker.sh"
TEMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/memory-drift-lock-harness.XXXXXX")"
REPO_ROOT="$TEMP_ROOT/repo"
PRELOAD="$TEMP_ROOT/drift-lock-preload.cjs"
export GIT_CONFIG_GLOBAL=/dev/null
export GIT_CONFIG_SYSTEM=/dev/null

cleanup() {
  local pid
  for pid in $(jobs -pr); do
    kill "$pid" 2>/dev/null || true
  done
  rm -rf "$TEMP_ROOT"
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

wait_for_file() {
  local file_path="$1"
  local attempts=0
  while (( attempts < 200 )); do
    [[ -f "$file_path" ]] && return 0
    sleep 0.025
    ((attempts += 1))
  done
  fail "timed out waiting for $file_path"
}

run_hook() {
  local before="${1:-HEAD^}"
  local after="${2:-HEAD}"
  (
    cd "$REPO_ROOT"
    bash -c 'source "$1"; mark_memory_drift_from_diff "$2" "$3"' \
      _ "$MARKER_LIB" "$before" "$after"
  )
}

reset_default_marker() {
  rm -rf "$MARKER_PATH" "$LOCK_DIR"
  if compgen -G "$MARKER_PATH.tmp-*" >/dev/null; then
    rm -f "$MARKER_PATH".tmp-*
  fi
}

cat > "$PRELOAD" <<'JS'
const fs = require('node:fs');
const path = require('node:path');

const originalRenameSync = fs.renameSync.bind(fs);
const originalWriteFileSync = fs.writeFileSync.bind(fs);
let paused = false;

function isMarkerCommit(source, destination) {
  return String(destination).endsWith('.memory-drift-dirty-paths.json')
    && String(source).includes('.tmp-');
}

fs.writeFileSync = (target, data, ...args) => {
  if (
    process.env.DRIFT_LOCK_TEST_MODE === 'write-fail'
    && String(target).includes('.memory-drift-dirty-paths.json.tmp-')
  ) {
    const error = new Error('forced marker write failure');
    error.code = 'EIO';
    throw error;
  }
  return originalWriteFileSync(target, data, ...args);
};

fs.renameSync = (source, destination, ...args) => {
  const mode = process.env.DRIFT_LOCK_TEST_MODE || '';
  const markerCommit = isMarkerCommit(source, destination);
  if (!paused && mode === 'before-commit' && markerCommit) {
    paused = true;
    Atomics.wait(
      new Int32Array(new SharedArrayBuffer(4)),
      0,
      0,
      Number(process.env.DRIFT_LOCK_TEST_PAUSE_MS || 300),
    );
  }

  const result = originalRenameSync(source, destination, ...args);
  const isAcquisition = mode === 'acquire' && path.basename(String(destination)) === 'owner.json';
  const isCommitPause = mode === 'commit' && markerCommit;
  if (!paused && (isAcquisition || isCommitPause)) {
    paused = true;
    originalWriteFileSync(process.env.DRIFT_LOCK_TEST_SIGNAL, 'ready');
    Atomics.wait(
      new Int32Array(new SharedArrayBuffer(4)),
      0,
      0,
      Number(process.env.DRIFT_LOCK_TEST_PAUSE_MS || 2000),
    );
  }
  if (mode === 'capture' && markerCommit) {
    originalWriteFileSync(process.env.DRIFT_LOCK_TEST_SIGNAL, String(destination));
  }
  return result;
};
JS

mkdir -p \
  "$REPO_ROOT/.opencode/specs/demo/old" \
  "$REPO_ROOT/.opencode/specs/demo/delete-a" \
  "$REPO_ROOT/.opencode/specs/demo/rename-b"
printf '# moved\n' > "$REPO_ROOT/.opencode/specs/demo/old/spec.md"
printf '# deleted\n' > "$REPO_ROOT/.opencode/specs/demo/delete-a/spec.md"
printf '# renamed\n' > "$REPO_ROOT/.opencode/specs/demo/rename-b/spec.md"
git -C "$REPO_ROOT" init -q
git -C "$REPO_ROOT" config user.email 'lock-harness@example.invalid'
git -C "$REPO_ROOT" config user.name 'Lock Harness'
git -C "$REPO_ROOT" add -f .opencode/specs
git -C "$REPO_ROOT" commit -qm 'initial marker fixture'

mkdir -p "$REPO_ROOT/.opencode/specs/demo/new"
mv "$REPO_ROOT/.opencode/specs/demo/old/spec.md" "$REPO_ROOT/.opencode/specs/demo/new/spec.md"
rmdir "$REPO_ROOT/.opencode/specs/demo/old"
git -C "$REPO_ROOT" add -f -A
git -C "$REPO_ROOT" commit -qm 'rename marker fixture'
RENAME_COMMIT="$(git -C "$REPO_ROOT" rev-parse HEAD)"

rm "$REPO_ROOT/.opencode/specs/demo/delete-a/spec.md"
rmdir "$REPO_ROOT/.opencode/specs/demo/delete-a"
git -C "$REPO_ROOT" add -f -A
git -C "$REPO_ROOT" commit -qm 'delete marker fixture'
DELETE_COMMIT="$(git -C "$REPO_ROOT" rev-parse HEAD)"

mkdir -p "$REPO_ROOT/.opencode/specs/demo/renamed-b"
mv "$REPO_ROOT/.opencode/specs/demo/rename-b/spec.md" "$REPO_ROOT/.opencode/specs/demo/renamed-b/spec.md"
rmdir "$REPO_ROOT/.opencode/specs/demo/rename-b"
git -C "$REPO_ROOT" add -f -A
git -C "$REPO_ROOT" commit -qm 'second rename marker fixture'
SECOND_RENAME_COMMIT="$(git -C "$REPO_ROOT" rev-parse HEAD)"

MARKER_PATH="$REPO_ROOT/.opencode/skills/system-spec-kit/mcp_server/database/.memory-drift-dirty-paths.json"
LOCK_DIR="$MARKER_PATH.lock"
OWNER_PATH="$LOCK_DIR/owner.json"

# The captured destination proves the producer uses the consumer's canonical path,
# rather than merely relying on the filesystem to follow a lexical symlink.
REAL_DB_DIR="$TEMP_ROOT/real-database"
LINKED_DB_DIR="$REPO_ROOT/runtime-database"
mkdir -p "$REAL_DB_DIR"
ln -s "$REAL_DB_DIR" "$LINKED_DB_DIR"
capture_signal="$TEMP_ROOT/canonical-destination"
SPEC_KIT_DB_DIR="$LINKED_DB_DIR" \
NODE_OPTIONS="--require=$PRELOAD" \
DRIFT_LOCK_TEST_MODE=capture \
DRIFT_LOCK_TEST_SIGNAL="$capture_signal" \
run_hook "$RENAME_COMMIT^" "$RENAME_COMMIT"
expected_marker="$(cd "$REAL_DB_DIR" && pwd -P)/.memory-drift-dirty-paths.json"
[[ -f "$capture_signal" ]] || fail 'canonical marker destination was not captured'
[[ "$(<"$capture_signal")" == "$expected_marker" ]] || fail 'producer used a non-canonical marker destination'
[[ -f "$expected_marker" ]] || fail 'consumer-resolved marker path does not contain the producer marker'
printf 'PASS symlink-path-parity: marker committed at %s\n' "$expected_marker"

reset_default_marker
signal_one="$TEMP_ROOT/acquired-one"
NODE_OPTIONS="--require=$PRELOAD" \
DRIFT_LOCK_TEST_MODE=acquire \
DRIFT_LOCK_TEST_SIGNAL="$signal_one" \
DRIFT_LOCK_TEST_PAUSE_MS=2000 \
run_hook "$RENAME_COMMIT^" "$RENAME_COMMIT" &
owner_process=$!
wait_for_file "$signal_one"
[[ -f "$OWNER_PATH" ]] || fail 'owner record was not created'
first_token="$(node -e 'console.log(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).token)' "$OWNER_PATH")"
node -e 'const fs=require("node:fs"); const path=require("node:path"); const p=process.argv[1]; const old=new Date(Date.now()-60000); fs.utimesSync(p, old, old); fs.utimesSync(path.join(p,"owner.json"), old, old);' "$LOCK_DIR"

run_hook "$DELETE_COMMIT^" "$DELETE_COMMIT" &
successor_process=$!
sleep 0.35
kill -0 "$owner_process" 2>/dev/null || fail 'paused owner exited before the contention check'
current_token="$(node -e 'console.log(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).token)' "$OWNER_PATH")"
[[ "$current_token" == "$first_token" ]] || fail 'successor reclaimed a live paused owner'
wait "$owner_process"
wait "$successor_process"
[[ ! -e "$LOCK_DIR" ]] || fail 'lock remained after both valid owners completed'
[[ -f "$MARKER_PATH" ]] || fail 'marker write did not complete'
printf 'PASS paused-owner-non-reclaim: live owner token remained %s\n' "$first_token"

reset_default_marker
mkdir -p "$LOCK_DIR"
node -e 'const fs=require("node:fs"); const old=new Date(Date.now()-60000); fs.utimesSync(process.argv[1], old, old);' "$LOCK_DIR"
run_hook "$RENAME_COMMIT^" "$RENAME_COMMIT"
[[ -f "$MARKER_PATH" ]] || fail 'old ownerless lock was not reclaimed'
[[ ! -e "$LOCK_DIR" ]] || fail 'reclaimed old lock remained after marker write'

reset_default_marker
mkdir -p "$LOCK_DIR"
node -e 'const fs=require("node:fs"); const future=new Date(Date.now()+60000); fs.utimesSync(process.argv[1], future, future);' "$LOCK_DIR"
run_hook "$RENAME_COMMIT^" "$RENAME_COMMIT"
[[ ! -e "$MARKER_PATH" ]] || fail 'future-dated ownerless lock was reclaimed'
[[ -d "$LOCK_DIR" ]] || fail 'future-dated ownerless lock did not remain authoritative'
printf 'PASS orphan-lock-mtimes: old lock reclaimed and future lock retained\n'

reset_default_marker
NODE_OPTIONS="--require=$PRELOAD" DRIFT_LOCK_TEST_MODE=before-commit DRIFT_LOCK_TEST_PAUSE_MS=300 \
  run_hook "$RENAME_COMMIT^" "$RENAME_COMMIT" &
writer_one=$!
NODE_OPTIONS="--require=$PRELOAD" DRIFT_LOCK_TEST_MODE=before-commit DRIFT_LOCK_TEST_PAUSE_MS=300 \
  run_hook "$DELETE_COMMIT^" "$DELETE_COMMIT" &
writer_two=$!
NODE_OPTIONS="--require=$PRELOAD" DRIFT_LOCK_TEST_MODE=before-commit DRIFT_LOCK_TEST_PAUSE_MS=300 \
  run_hook "$SECOND_RENAME_COMMIT^" "$SECOND_RENAME_COMMIT" &
writer_three=$!
wait "$writer_one"
wait "$writer_two"
wait "$writer_three"
MARKER_PATH="$MARKER_PATH" node <<'NODE'
const fs = require('node:fs');
const assert = require('node:assert/strict');
const payload = JSON.parse(fs.readFileSync(process.env.MARKER_PATH, 'utf8'));
const keys = new Set(payload.entries.map((entry) => entry.kind === 'rename'
  ? `rename:${entry.oldPath}->${entry.newPath}`
  : `delete:${entry.oldPath}`));
assert.deepEqual(keys, new Set([
  'rename:.opencode/specs/demo/old/spec.md->.opencode/specs/demo/new/spec.md',
  'delete:.opencode/specs/demo/delete-a/spec.md',
  'rename:.opencode/specs/demo/rename-b/spec.md->.opencode/specs/demo/renamed-b/spec.md',
]));
NODE
printf 'PASS concurrent-writers: all three entries survived the merged marker\n'

reset_default_marker
printf '%s\n' '{"version":1,"entries":[{"kind":"delete","oldPath":".opencode/specs/demo/existing/spec.md"}]}' > "$MARKER_PATH"
marker_before="$(<"$MARKER_PATH")"
if NODE_OPTIONS="--require=$PRELOAD" DRIFT_LOCK_TEST_MODE=write-fail \
  run_hook "$RENAME_COMMIT^" "$RENAME_COMMIT" 2> "$TEMP_ROOT/write-fail.stderr"; then
  fail 'forced marker write unexpectedly succeeded'
fi
[[ ! -e "$LOCK_DIR" ]] || fail 'lock remained after a failed marker write'
[[ "$(<"$MARKER_PATH")" == "$marker_before" ]] || fail 'failed write corrupted the existing marker'
if compgen -G "$MARKER_PATH.tmp-*" >/dev/null; then
  fail 'failed write left a marker temp file'
fi
printf 'PASS failed-write: lock released and existing marker remained intact\n'

reset_default_marker
signal_two="$TEMP_ROOT/committed-two"
NODE_OPTIONS="--require=$PRELOAD" \
DRIFT_LOCK_TEST_MODE=commit \
DRIFT_LOCK_TEST_SIGNAL="$signal_two" \
DRIFT_LOCK_TEST_PAUSE_MS=2000 \
run_hook "$RENAME_COMMIT^" "$RENAME_COMMIT" &
releaser_process=$!
wait_for_file "$signal_two"
[[ -f "$OWNER_PATH" ]] || fail 'owner record disappeared before release check'
replacement_token="replacement-token-$releaser_process"
node -e 'const fs=require("node:fs"); const p=process.argv[1]; const owner=JSON.parse(fs.readFileSync(p,"utf8")); owner.token=process.argv[2]; owner.heartbeatAt=new Date().toISOString(); fs.writeFileSync(p, JSON.stringify(owner)+"\n");' "$OWNER_PATH" "$replacement_token"
wait "$releaser_process"
[[ -d "$LOCK_DIR" ]] || fail 'releaser removed a lock with a replacement token'
current_token="$(node -e 'console.log(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).token)' "$OWNER_PATH")"
[[ "$current_token" == "$replacement_token" ]] || fail 'replacement ownership record changed during release'
printf 'PASS token-checked-release: mismatched token %s preserved the lock\n' "$replacement_token"

printf 'All 7 memory drift marker producer scenarios passed\n'
