#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Session Test
# ───────────────────────────────────────────────────────────────
# Hermetic regression coverage for worktree-session.sh path safety,
# child argument handling, and runtime identity validation.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
WRAPPER="$SCRIPT_DIR/worktree-session.sh"

PASS=0
FAIL=0
expect() {
  local desc="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    PASS=$((PASS+1))
  else
    FAIL=$((FAIL+1))
    echo "FAIL: $desc"
  fi
}

expect_not() {
  local desc="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    FAIL=$((FAIL+1))
    echo "FAIL: $desc"
  else
    PASS=$((PASS+1))
  fi
}

ROOT="$(mktemp -d)"
FAKE_HOME="$(mktemp -d)"
BIN_DIR="$ROOT/bin"
cleanup() {
  rm -rf "$ROOT" "$FAKE_HOME"
}
trap cleanup EXIT

export HOME="$FAKE_HOME"
mkdir -p "$BIN_DIR"
printf '%s\n' '#!/usr/bin/env bash' 'exit 0' > "$BIN_DIR/myrt"
chmod +x "$BIN_DIR/myrt"

make_fixture() {
  local fixture="$1"
  mkdir -p "$fixture/.nohooks"
  git -C "$fixture" init -q
  git -C "$fixture" config core.hooksPath "$fixture/.nohooks"
  git -C "$fixture" config user.email t@t.t
  git -C "$fixture" config user.name t
  git -C "$fixture" commit -q --allow-empty -m init
}

# Use a destination outside the new worktree to prove rejected traversal cannot
# replace existing checkout content.
F1_ROOT="$ROOT/f1/main"
F1_FIXTURE="$F1_ROOT/checkout"
mkdir -p "$F1_FIXTURE"
make_fixture "$F1_FIXTURE"
printf '%s\n' source-safe > "$ROOT/f1/victim"
printf '%s\n' destination-must-survive > "$F1_FIXTURE/victim"
F1_STDOUT="$ROOT/f1.stdout"
F1_STDERR="$ROOT/f1.stderr"
set +e
(
  cd "$F1_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_WORKTREE_SHARED_PATHS='../../victim' \
    bash "$WRAPPER" myrt
) >"$F1_STDOUT" 2>"$F1_STDERR"
F1_RC=$?
set -e

expect "shared-path fixture launch succeeds" test "$F1_RC" -eq 0
expect "traversal destination remains a regular file" test -f "$F1_FIXTURE/victim"
expect_not "traversal destination is not replaced by a symlink" test -L "$F1_FIXTURE/victim"
expect "traversal destination content is unchanged" cmp -s <(printf '%s\n' destination-must-survive) "$F1_FIXTURE/victim"
expect "traversal entry emits a skip warning" grep -F "unsafe shared path: ../../victim" "$F1_STDERR"

F2_FIXTURE="$ROOT/f2"
mkdir -p "$F2_FIXTURE"
F2_STDOUT="$ROOT/f2.stdout"
F2_STDERR="$ROOT/f2.stderr"
set +e
(
  cd "$F2_FIXTURE" || exit 1
  env -u SPECKIT_WORKTREE_SHARED_PATHS \
    AI_SESSION_CHILD=1 \
    PATH="$BIN_DIR:$PATH" \
    bash "$WRAPPER" --dry-run myrt arg1 arg2
) >"$F2_STDOUT" 2>"$F2_STDERR"
F2_RC=$?
set -e

expect "child dry-run succeeds" test "$F2_RC" -eq 0
expect "child dry-run keeps the runtime arguments" grep -F "would exec in place: myrt arg1 arg2" "$F2_STDOUT"
expect_not "child reason is absent from the exec argv" grep -F "would exec in place: myrt AI_SESSION_CHILD=1" "$F2_STDOUT"

F3_FIXTURE="$ROOT/f3"
mkdir -p "$F3_FIXTURE"
make_fixture "$F3_FIXTURE"
F3_BAD_STDOUT="$ROOT/f3-bad.stdout"
F3_BAD_STDERR="$ROOT/f3-bad.stderr"
set +e
(
  cd "$F3_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD \
    PATH="$BIN_DIR:$PATH" \
    bash "$WRAPPER" "$BIN_DIR/myrt"
) >"$F3_BAD_STDOUT" 2>"$F3_BAD_STDERR"
F3_BAD_RC=$?
set -e

expect_not "path-bearing runtime is rejected" test "$F3_BAD_RC" -eq 0
expect "path-bearing runtime reports invalid identity" grep -F "invalid runtime identity" "$F3_BAD_STDERR"
expect_not "path-bearing runtime does not allocate a worktree" grep -F "allocating worktree" "$F3_BAD_STDERR"
expect_not "path-bearing runtime does not form a double-slash branch" grep -F "work//" "$F3_BAD_STDERR"
expect_not "path-bearing runtime creates no worktree" test -e "$F3_FIXTURE/.worktrees"

F3_GOOD_STDOUT="$ROOT/f3-good.stdout"
F3_GOOD_STDERR="$ROOT/f3-good.stderr"
(
  cd "$F3_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD \
    PATH="$BIN_DIR:$PATH" \
    bash "$WRAPPER" --dry-run myrt
) >"$F3_GOOD_STDOUT" 2>"$F3_GOOD_STDERR"
F3_GOOD_RC=$?

expect "normal runtime identity is accepted" test "$F3_GOOD_RC" -eq 0
expect "normal runtime identity forms a legal branch name" grep -E "branch[[:space:]]+= work/myrt/" "$F3_GOOD_STDOUT"

echo "worktree-session tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
