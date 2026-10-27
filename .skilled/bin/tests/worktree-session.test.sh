#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Session Test
# ───────────────────────────────────────────────────────────────
# Hermetic regression coverage for worktree-session.sh path safety,
# child argument handling, and runtime identity validation.

set -euo pipefail

# A run started from a git hook inherits variables that point git at the enclosing
# repository, so fixture commits and the launcher would write there. Clear them first.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_GLOBAL GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

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
# Every top-level launch now sweeps fsmonitor daemons; point the launcher at a no-op stub so
# no case reaches the real reaper.
printf '%s\n' '#!/usr/bin/env bash' 'exit 0' > "$BIN_DIR/reaper-stub"
chmod +x "$BIN_DIR/reaper-stub"
export SPECKIT_FSMON_REAPER="$BIN_DIR/reaper-stub"
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

# ── F4: an environment-only base is persisted so a later reaper agrees ──
# The base can arrive solely through SPECKIT_WORKTREE_BASE, which a reaper started on its
# own does not inherit; the wrapper records its choice in the repo config so the reaper
# resolves the same directory instead of falling back to the in-checkout default.
F4_FIXTURE="$ROOT/f4"
F4_BASE="$ROOT/f4-base"
mkdir -p "$F4_FIXTURE"
make_fixture "$F4_FIXTURE"
set +e
(
  cd "$F4_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_WORKTREE_BASE="$F4_BASE" \
    bash "$WRAPPER" myrt
) >/dev/null 2>"$ROOT/f4.stderr"
F4_RC=$?
set -e
F4_CFG="$(git -C "$F4_FIXTURE" config --get speckit.worktreeBase 2>/dev/null || true)"
expect "env-base launch succeeds" test "$F4_RC" -eq 0
expect "env-base launch allocates under the env base" test -d "$F4_BASE"
expect "env-base launch persists the base into repo config" test "$F4_CFG" = "$F4_BASE"

# ── F4b-F4d: only an explicitly chosen base is persisted ──
# A launch that falls back to the legacy in-checkout default must leave the repository config
# untouched: recording that default would pin every later worktree inside the checkout.
F4B_FIXTURE="$ROOT/f4b"
mkdir -p "$F4B_FIXTURE"
make_fixture "$F4B_FIXTURE"
set +e
(
  cd "$F4B_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD -u SPECKIT_WORKTREE_BASE \
    PATH="$BIN_DIR:$PATH" \
    bash "$WRAPPER" myrt
) >/dev/null 2>"$ROOT/f4b.stderr"
F4B_RC=$?
set -e
expect "default-base launch succeeds" test "$F4B_RC" -eq 0
expect_not "default-base launch records no base in repo config" \
  git -C "$F4B_FIXTURE" config --get speckit.worktreeBase
expect "default-base launch names the in-checkout default" \
  grep -F "in-checkout default" "$ROOT/f4b.stderr"
expect "default-base launch reports the resolved default path" \
  grep -F "$F4B_FIXTURE/.worktrees" "$ROOT/f4b.stderr"

F4C_FIXTURE="$ROOT/f4c"
mkdir -p "$F4C_FIXTURE"
make_fixture "$F4C_FIXTURE"
set +e
(
  cd "$F4C_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_WORKTREE_BASE='' \
    bash "$WRAPPER" myrt
) >/dev/null 2>"$ROOT/f4c.stderr"
F4C_RC=$?
set -e
expect "empty env-base launch succeeds" test "$F4C_RC" -eq 0
expect_not "empty env-base launch records no base in repo config" \
  git -C "$F4C_FIXTURE" config --get speckit.worktreeBase
expect "empty env-base launch names the in-checkout default" \
  grep -F "in-checkout default" "$ROOT/f4c.stderr"

F4D_FIXTURE="$ROOT/f4d"
F4D_BASE="$ROOT/f4d-base"
mkdir -p "$F4D_FIXTURE" "$F4D_BASE"
make_fixture "$F4D_FIXTURE"
git -C "$F4D_FIXTURE" config speckit.worktreeBase "$F4D_BASE"
set +e
(
  cd "$F4D_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD -u SPECKIT_WORKTREE_BASE \
    PATH="$BIN_DIR:$PATH" \
    bash "$WRAPPER" myrt
) >/dev/null 2>"$ROOT/f4d.stderr"
F4D_RC=$?
set -e
F4D_CFG="$(git -C "$F4D_FIXTURE" config --get speckit.worktreeBase 2>/dev/null || true)"
expect "config-base launch succeeds" test "$F4D_RC" -eq 0
expect "config-base launch leaves the recorded base unchanged" test "$F4D_CFG" = "$F4D_BASE"


# A dependency root holding a workspace package's own entry cannot be shared as one link: the
# entry's relative text re-anchors through wherever the link sits, so the session silently
# reads the main checkout's copy. Asserted on the bytes a child process loads, because a path
# is spellable and the wrong file can be reported under the right-looking name.
# Physical paths: the wrapper canonicalizes both sides of its containment checks, and a
# temp root reached through a symlinked parent would be skipped as outside the worktree.
F5_FIXTURE="$ROOT/f5"
mkdir -p "$F5_FIXTURE/pkg" "$F5_FIXTURE/node_modules/@scope" "$F5_FIXTURE/node_modules/vendored"
F5_FIXTURE="$(cd "$F5_FIXTURE" && pwd -P)"
make_fixture "$F5_FIXTURE"
printf '{"name":"@scope/pkg","main":"index.js"}\n' > "$F5_FIXTURE/pkg/package.json"
printf 'module.exports = "MAIN";\n' > "$F5_FIXTURE/pkg/index.js"
printf 'node_modules\n' > "$F5_FIXTURE/.gitignore"
git -C "$F5_FIXTURE" add -A
git -C "$F5_FIXTURE" commit -q -m workspace
printf 'module.exports = "VENDORED";\n' > "$F5_FIXTURE/node_modules/vendored/index.js"
ln -s ../../pkg "$F5_FIXTURE/node_modules/@scope/pkg"
mkdir -p "$ROOT/f5-base"
F5_BASE="$(cd "$ROOT/f5-base" && pwd -P)"
set +e
(
  cd "$F5_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_WORKTREE_SHARED_PATHS='node_modules' \
    SPECKIT_WORKTREE_BASE="$F5_BASE" \
    bash "$WRAPPER" myrt
) >/dev/null 2>"$ROOT/f5.stderr"
F5_RC=$?
set -e
F5_WT="$(find "$F5_BASE" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)"

expect "workspace-link launch succeeds" test "$F5_RC" -eq 0
expect "dependency root is a real directory, so relative links cannot re-anchor" test ! -L "$F5_WT/node_modules"
expect "scope directory is real for the same reason" test ! -L "$F5_WT/node_modules/@scope"
expect "third-party entry stays shared with the main checkout" test -L "$F5_WT/node_modules/vendored"
expect "workspace link is recreated with the checkout's own relative text" \
  test "$(readlink "$F5_WT/node_modules/@scope/pkg")" = "../../pkg"

printf 'module.exports = "WORKTREE";\n' > "$F5_WT/pkg/index.js"
F5_LOADED="$(cd "$F5_WT" && node -e 'process.stdout.write(require("@scope/pkg"))' 2>/dev/null || true)"
F5_MAIN="$(cd "$F5_FIXTURE" && node -e 'process.stdout.write(require("@scope/pkg"))' 2>/dev/null || true)"
expect "worktree loads its own bytes for the workspace package" test "$F5_LOADED" = "WORKTREE"
expect "main checkout still loads its own, so the probe can see both" test "$F5_MAIN" = "MAIN"

# ── F6-F8: shared paths and the database directory follow each checkout's real source root ──
# The tree sits under .opencode beside a tracked .skilled placeholder (today), under .skilled,
# or under .skilled with .opencode linked to it. Physical paths, for the same containment
# reason as F5.
make_layout_fixture() {
  local fixture="$1" layout="$2" real=".skilled"
  [ "$layout" != "today" ] || real=".opencode"
  make_fixture "$fixture"
  mkdir -p "$fixture/$real/skills/system-spec-kit/node_modules"
  printf '# sentinel\n' > "$fixture/$real/skills/system-spec-kit/SKILL.md"
  if [ "$layout" = "today" ]; then
    mkdir -p "$fixture/.skilled/future-task-placeholder"
    : > "$fixture/.skilled/future-task-placeholder/.gitkeep"
  fi
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
# This runtime stub records the database directory the launcher exports to the session.
printf '%s\n' '#!/usr/bin/env bash' 'printf "%s\n" "$SPEC_KIT_DB_DIR" > "$DB_DIR_RECORD"' > "$BIN_DIR/dbrt"
chmod +x "$BIN_DIR/dbrt"
export DB_DIR_RECORD="$ROOT/f7.db-dir"
set +e
run_layout_wrapper "$F7_FIXTURE" "$F7_BASE" /dev/null "$ROOT/f7.stderr" dbrt
F7_RC=$?
set -e
F7_WT="$(find "$F7_BASE" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)"
expect "skilled-only launch succeeds" test "$F7_RC" -eq 0
expect "skilled-only launch links the dependency root under .skilled" \
  test -L "$F7_WT/.skilled/skills/system-spec-kit/node_modules"
expect "skilled-only launch exports the database directory under the worktree's .skilled tree" \
  test "$(cat "$DB_DIR_RECORD" 2>/dev/null)" = "$F7_WT/.skilled/skills/system-spec-kit/runtime/database"
expect "skilled-only launch creates no .opencode path in the worktree" test ! -e "$F7_WT/.opencode"

# The main checkout moved its tree in the working copy, replacing the placeholder, but not in
# the commit the worktree checks out, so the two checkouts name different source roots.
mkdir -p "$ROOT/f8" "$ROOT/f8-base"
F8_FIXTURE="$(cd "$ROOT/f8" && pwd -P)"
F8_BASE="$(cd "$ROOT/f8-base" && pwd -P)"
make_layout_fixture "$F8_FIXTURE" today
rm -rf "$F8_FIXTURE/.skilled"
mv "$F8_FIXTURE/.opencode" "$F8_FIXTURE/.skilled"
set +e
run_layout_wrapper "$F8_FIXTURE" "$F8_BASE" /dev/null "$ROOT/f8.stderr" myrt
F8_RC=$?
set -e
F8_WT="$(find "$F8_BASE" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)"
expect "mismatched launch still starts the session" test "$F8_RC" -eq 0
expect "an uncommitted move in main is reported as a source-root mismatch" \
  grep -F "main checkout keeps its source tree under .skilled but the new worktree keeps it under .opencode" "$ROOT/f8.stderr"
expect "the mismatched worktree plants no links in its .skilled placeholder" test ! -e "$F8_WT/.skilled/skills"

# ── A launched session carries a launcher-only marker, never the dispatched-child marker ──
# The stub records its environment, then asks the launcher for a dry run from the main checkout,
# as a descendant that changed directory would. That descendant must exec in place rather than
# plan a second worktree.
F9_MAIN="$ROOT/f9"
F9_BASE="$ROOT/f9-base"
F9_ENV_RECORD="$ROOT/f9.env"
F9_NESTED_RECORD="$ROOT/f9.nested"
mkdir -p "$F9_MAIN" "$F9_BASE"
make_fixture "$F9_MAIN"
F9_MAIN="$(cd "$F9_MAIN" && pwd -P)"
F9_BASE="$(cd "$F9_BASE" && pwd -P)"
cat > "$BIN_DIR/launchedrt" <<EOF
#!/usr/bin/env bash
env > "$F9_ENV_RECORD"
(cd "$F9_MAIN" && bash "$WRAPPER" --dry-run myrt) > "$F9_NESTED_RECORD" 2>&1 || true
EOF
chmod +x "$BIN_DIR/launchedrt"
set +e
(
  cd "$F9_MAIN" || exit 1
  env -u AI_SESSION_CHILD -u SPECKIT_WORKTREE_SHARED_PATHS \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_WORKTREE_BASE="$F9_BASE" \
    bash "$WRAPPER" launchedrt
) >"$ROOT/f9.stdout" 2>"$ROOT/f9.stderr"
F9_RC=$?
set -e

expect "launched session starts" test "$F9_RC" -eq 0
expect_not "launched session does not carry the dispatched-child marker" grep -q '^AI_SESSION_CHILD=' "$F9_ENV_RECORD"
expect "launched session carries the launcher-only marker" grep -q '^SKILLED_WORKTREE_SESSION=1$' "$F9_ENV_RECORD"
expect "descendant started from the main checkout execs in place" grep -F "would exec in place: myrt" "$F9_NESTED_RECORD"
expect_not "descendant started from the main checkout plans no second worktree" grep -F "work/myrt/" "$F9_NESTED_RECORD"

# ── A worktree base written with a leading tilde resolves to the home directory ──
F10_FIXTURE="$ROOT/f10"
mkdir -p "$F10_FIXTURE"
make_fixture "$F10_FIXTURE"
F10_FIXTURE="$(cd "$F10_FIXTURE" && pwd -P)"
set +e
(
  cd "$F10_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD -u SKILLED_WORKTREE_SESSION -u SPECKIT_WORKTREE_SHARED_PATHS -u SYSTEM_SPEC_GATE_ENFORCE \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_WORKTREE_BASE='~/f10-base' \
    bash "$WRAPPER" --dry-run myrt
) >"$ROOT/f10.stdout" 2>"$ROOT/f10.stderr"
F10_RC=$?
set -e

expect "tilde base dry-run succeeds" test "$F10_RC" -eq 0
expect "tilde base plans its worktree under HOME" grep -F "$FAKE_HOME/f10-base/" "$ROOT/f10.stdout"

# ── The enforce setting each launch path hands to its runtime ──
# A stub records the enforce value it inherits. Only a dispatched child is neutralized: a launched
# session and a session already in a linked worktree keep the value the operator set.
F11_MAIN="$ROOT/f11"
F11_BASE="$ROOT/f11-base"
mkdir -p "$F11_MAIN" "$F11_BASE"
make_fixture "$F11_MAIN"
F11_MAIN="$(cd "$F11_MAIN" && pwd -P)"
F11_BASE="$(cd "$F11_BASE" && pwd -P)"
printf '%s\n' '#!/usr/bin/env bash' 'printf "%s\n" "${SYSTEM_SPEC_GATE_ENFORCE-unset}" > "$ENFORCE_RECORD"' > "$BIN_DIR/enfrt"
chmod +x "$BIN_DIR/enfrt"

probe_enforce() {
  local record="$1" cwd="$2"
  shift 2
  set +e
  (
    cd "$cwd" || exit 1
    env -u SYSTEM_SPEC_GATE_ENFORCE -u AI_SESSION_CHILD -u SKILLED_WORKTREE_SESSION -u SPECKIT_WORKTREE_SHARED_PATHS \
      PATH="$BIN_DIR:$PATH" SPECKIT_WORKTREE_BASE="$F11_BASE" ENFORCE_RECORD="$record" \
      "$@" bash "$WRAPPER" enfrt
  ) >/dev/null 2>"$record.stderr"
  set -e
}

probe_enforce "$ROOT/f11-child.rec" "$F11_MAIN" AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=1
expect "dispatched child sees the enforce setting off" grep -qx 0 "$ROOT/f11-child.rec"

probe_enforce "$ROOT/f11-marker.rec" "$F11_MAIN" SKILLED_WORKTREE_SESSION=1 SYSTEM_SPEC_GATE_ENFORCE=1
expect "descendant of a launched session keeps the enforce setting" grep -qx 1 "$ROOT/f11-marker.rec"

F11_LINKED="$ROOT/f11-linked"
git -C "$F11_MAIN" worktree add -q --detach "$F11_LINKED"
F11_LINKED="$(cd "$F11_LINKED" && pwd -P)"
probe_enforce "$ROOT/f11-linked.rec" "$F11_LINKED" SYSTEM_SPEC_GATE_ENFORCE=1
expect "session already in a linked worktree keeps the enforce setting" grep -qx 1 "$ROOT/f11-linked.rec"

probe_enforce "$ROOT/f11-launched.rec" "$F11_MAIN" SYSTEM_SPEC_GATE_ENFORCE=1
expect "top-level launch keeps the enforce setting" grep -qx 1 "$ROOT/f11-launched.rec"

set +e
(
  cd "$F11_MAIN" || exit 1
  env -u SYSTEM_SPEC_GATE_ENFORCE -u AI_SESSION_CHILD -u SPECKIT_WORKTREE_SHARED_PATHS \
    PATH="$BIN_DIR:$PATH" SPECKIT_WORKTREE_BASE="$F11_BASE" \
    SKILLED_WORKTREE_SESSION=1 \
    bash "$WRAPPER" --dry-run myrt
) >"$ROOT/f11-dry.stdout" 2>"$ROOT/f11-dry.stderr"
set -e
expect "descendant dry run names the exec in place" grep -F "would exec in place: myrt" "$ROOT/f11-dry.stdout"
expect_not "dry run claims no enforce value when none is set" grep -F "SYSTEM_SPEC_GATE_ENFORCE=0" "$ROOT/f11-dry.stdout"

# ── F12: a top-level launch sweeps fsmonitor daemons without waiting for the sweep ──
# The sweep is detached: a reaper that blocks for half a minute must not delay the launch, and
# it must receive the idle window and the main checkout it sweeps for.
F12_FIXTURE="$ROOT/f12"
F12_BASE="$ROOT/f12-base"
F12_ARGS="$ROOT/f12.reaper.args"
F12_PIDS="$ROOT/f12.reaper.pids"
mkdir -p "$F12_FIXTURE" "$F12_BASE"
make_fixture "$F12_FIXTURE"
cat > "$BIN_DIR/slow-reaper" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$$" > "$FSMON_PID_LOG"
printf '%s\n' "$*" > "$FSMON_ARG_LOG"
exec sleep 30
EOF
chmod +x "$BIN_DIR/slow-reaper"
F12_START="$(date +%s)"
set +e
(
  cd "$F12_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD -u SPECKIT_WORKTREE_SHARED_PATHS \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_WORKTREE_BASE="$F12_BASE" \
    SPECKIT_FSMON_REAPER="$BIN_DIR/slow-reaper" \
    FSMON_ARG_LOG="$F12_ARGS" FSMON_PID_LOG="$F12_PIDS" \
    bash "$WRAPPER" myrt
) >/dev/null 2>"$ROOT/f12.stderr"
F12_RC=$?
set -e
F12_ELAPSED=$(( $(date +%s) - F12_START ))
F12_TL="$(git -C "$F12_FIXTURE" rev-parse --show-toplevel)"
F12_REAPED=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if grep -Fqx -- "--apply --idle-hours 12 --repo $F12_TL" "$F12_ARGS" 2>/dev/null; then
    F12_REAPED=1
    break
  fi
  sleep 0.5
done
expect "slow sweep does not delay the launch" test "$F12_ELAPSED" -lt 10
expect "top-level launch succeeds with a blocking reaper" test "$F12_RC" -eq 0
expect "top-level launch sweeps the main checkout for idle daemons" test "$F12_REAPED" -eq 1
if [ -f "$F12_PIDS" ]; then
  while IFS= read -r reaper_pid; do
    case "$reaper_pid" in ''|*[!0-9]*) continue ;; esac
    kill "$reaper_pid" 2>/dev/null || true
  done < "$F12_PIDS"
fi

# ── F13-F14: only a top-level launch that allocates a worktree sweeps ──
# A dispatched child and a dry run must not reach the reaper at all.
F13_FIXTURE="$ROOT/f13"
F13_ARGS="$ROOT/f13.reaper.args"
mkdir -p "$F13_FIXTURE"
make_fixture "$F13_FIXTURE"
cat > "$BIN_DIR/log-reaper" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" > "$FSMON_ARG_LOG"
EOF
chmod +x "$BIN_DIR/log-reaper"
set +e
(
  cd "$F13_FIXTURE" || exit 1
  env -u SPECKIT_WORKTREE_SHARED_PATHS \
    AI_SESSION_CHILD=1 \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_FSMON_REAPER="$BIN_DIR/log-reaper" \
    FSMON_ARG_LOG="$F13_ARGS" \
    bash "$WRAPPER" myrt
) >/dev/null 2>"$ROOT/f13.stderr"
F13_RC=$?
set -e
F13_LEAKED=0
for _ in 1 2 3; do
  [ ! -e "$F13_ARGS" ] || { F13_LEAKED=1; break; }
  sleep 0.5
done
expect "child launch succeeds" test "$F13_RC" -eq 0
expect "child launch never sweeps fsmonitor daemons" test "$F13_LEAKED" -eq 0

F14_FIXTURE="$ROOT/f14"
F14_ARGS="$ROOT/f14.reaper.args"
mkdir -p "$F14_FIXTURE"
make_fixture "$F14_FIXTURE"
set +e
(
  cd "$F14_FIXTURE" || exit 1
  env -u AI_SESSION_CHILD -u SPECKIT_WORKTREE_SHARED_PATHS \
    PATH="$BIN_DIR:$PATH" \
    SPECKIT_FSMON_REAPER="$BIN_DIR/log-reaper" \
    FSMON_ARG_LOG="$F14_ARGS" \
    bash "$WRAPPER" --dry-run myrt
) >/dev/null 2>"$ROOT/f14.stderr"
F14_RC=$?
set -e
F14_LEAKED=0
for _ in 1 2 3; do
  [ ! -e "$F14_ARGS" ] || { F14_LEAKED=1; break; }
  sleep 0.5
done
expect "dry-run launch succeeds" test "$F14_RC" -eq 0
expect "dry-run launch never sweeps fsmonitor daemons" test "$F14_LEAKED" -eq 0

echo "worktree-session tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]