## Edit 1

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
expect "main checkout still loads its own, so the probe can see both" test "$F5_MAIN" = "MAIN"
echo "worktree-session tests: PASS=$PASS FAIL=$FAIL"
~~~~

NEW:

~~~~text
expect "main checkout still loads its own, so the probe can see both" test "$F5_MAIN" = "MAIN"

# ── F6-F8: shared paths and the database directory follow each checkout's real source root ──
# The tree sits under .opencode (today), under .skilled, or under .skilled with .opencode
# linked to it. Physical paths, for the same containment reason as F5.
make_layout_fixture() {
  local fixture="$1" layout="$2" real=".skilled"
  [ "$layout" != "today" ] || real=".opencode"
  make_fixture "$fixture"
  mkdir -p "$fixture/$real/skills/system-spec-kit/node_modules"
  printf '# sentinel\n' > "$fixture/$real/skills/system-spec-kit/SKILL.md"
  [ "$layout" != "whole-link" ] || ln -s .skilled "$fixture/.opencode"
  printf 'node_modules\n' > "$fixture/.gitignore"
  git -C "$fixture" add -A
  git -C "$fixture" commit -q -m layout
}

run_layout_wrapper() {
  local fixture="$1" base="$2" stdout="$3" stderr="$4"
  shift 4
  (
    cd "$fixture" || exit 1
    env -u AI_SESSION_CHILD -u SPECKIT_WORKTREE_SHARED_PATHS \
      PATH="$BIN_DIR:$PATH" \
      SPECKIT_WORKTREE_BASE="$base" \
      bash "$WRAPPER" "$@"
  ) >"$stdout" 2>"$stderr"
}

for layout in today skilled-only whole-link; do
  real=".skilled"
  [ "$layout" != "today" ] || real=".opencode"
  mkdir -p "$ROOT/f6-$layout" "$ROOT/f6-$layout-base"
  F6_FIXTURE="$(cd "$ROOT/f6-$layout" && pwd -P)"
  make_layout_fixture "$F6_FIXTURE" "$layout"
  set +e
  run_layout_wrapper "$F6_FIXTURE" "$ROOT/f6-$layout-base" "$ROOT/f6-$layout.stdout" "$ROOT/f6-$layout.stderr" --dry-run myrt
  F6_RC=$?
  set -e
  expect "$layout dry-run succeeds" test "$F6_RC" -eq 0
  expect "$layout dry-run links the dependency root under $real" \
    grep -F "    + $real/skills/system-spec-kit/node_modules" "$ROOT/f6-$layout.stdout"
  expect "$layout dry-run puts the database directory under $real" \
    grep -F "/$real/skills/system-spec-kit/runtime/database" "$ROOT/f6-$layout.stdout"
done

mkdir -p "$ROOT/f7" "$ROOT/f7-base"
F7_FIXTURE="$(cd "$ROOT/f7" && pwd -P)"
F7_BASE="$(cd "$ROOT/f7-base" && pwd -P)"
make_layout_fixture "$F7_FIXTURE" skilled-only
set +e
run_layout_wrapper "$F7_FIXTURE" "$F7_BASE" /dev/null "$ROOT/f7.stderr" myrt
F7_RC=$?
set -e
F7_WT="$(find "$F7_BASE" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)"
expect "skilled-only launch succeeds" test "$F7_RC" -eq 0
expect "skilled-only launch links the dependency root under .skilled" \
  test -L "$F7_WT/.skilled/skills/system-spec-kit/node_modules"
expect "skilled-only launch creates no .opencode path in the worktree" test ! -e "$F7_WT/.opencode"

# The main checkout moved its tree in the working copy but not in the commit the worktree
# checks out, so the two checkouts name different source roots.
mkdir -p "$ROOT/f8" "$ROOT/f8-base"
F8_FIXTURE="$(cd "$ROOT/f8" && pwd -P)"
F8_BASE="$(cd "$ROOT/f8-base" && pwd -P)"
make_layout_fixture "$F8_FIXTURE" today
mv "$F8_FIXTURE/.opencode" "$F8_FIXTURE/.skilled"
set +e
run_layout_wrapper "$F8_FIXTURE" "$F8_BASE" /dev/null "$ROOT/f8.stderr" myrt
F8_RC=$?
set -e
F8_WT="$(find "$F8_BASE" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)"
expect "mismatched launch still starts the session" test "$F8_RC" -eq 0
expect "an uncommitted move in main is reported as a source-root mismatch" \
  grep -F "main checkout keeps its source tree under .skilled but the new worktree keeps it under .opencode" "$ROOT/f8.stderr"
expect "the mismatched worktree gets no second source tree" test ! -e "$F8_WT/.skilled"
echo "worktree-session tests: PASS=$PASS FAIL=$FAIL"
~~~~
