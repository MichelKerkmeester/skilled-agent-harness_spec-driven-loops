#!/usr/bin/env bash
# Test harness for the pre-push branch-naming gate. Runs entirely inside a
# throwaway git repo (symlinking the real worktree-naming.sh and a fixture
# SKILL.md so owner resolution works) so it never touches real refs, the
# real clone's hooks, or the operator's global git config.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/pre-push"
REAL_NAMING="$REPO_ROOT/.opencode/skills/sk-git/scripts/worktree-naming.sh"

PASS=0; FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null

# ── isolated fixture repo ──────────────────────────────────────
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git -C "$TMP" init -q
# Hermetic fixture: override any global core.hooksPath so the shared commit-msg /
# pre-commit gates never run against the throwaway init commit below.
mkdir -p "$TMP/.nohooks"
git -C "$TMP" config core.hooksPath "$TMP/.nohooks"
git -C "$TMP" config user.email t@t.t
git -C "$TMP" config user.name t
git -C "$TMP" commit -q --allow-empty -m init

mkdir -p "$TMP/.opencode/skills/sk-git/scripts"
printf 'name: sk-git\n' > "$TMP/.opencode/skills/sk-git/SKILL.md"
ln -s "$REAL_NAMING" "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"

printf -v ZERO_SHA '%040d' 0
printf -v SHA_A '%040d' 111111
printf -v SHA_B '%040d' 222222

# ── stdin-line + exit-code helpers ─────────────────────────────
_hook_rc() {
  # _hook_rc <stdin-line> [env-assignment...] — feeds one line to the real
  # hook (cwd = the fixture repo) and returns the hook's own exit code.
  local line="$1"; shift
  printf '%s\n' "$line" | ( cd "$TMP" && env "$@" bash "$HOOK" ) \
    >"$TMP/last.out" 2>"$TMP/last.err"
}
expect_hook() { # expect_hook <desc> <expected-rc> <line> [env-assignment...]
  local desc="$1" exp="$2" line="$3"; shift 3
  local rc=0
  _hook_rc "$line" "$@" || rc=$?
  if [ "$rc" = "$exp" ]; then
    PASS=$((PASS+1))
  else
    FAIL=$((FAIL+1))
    echo "FAIL: $desc (rc=$rc exp=$exp)"
    sed 's/^/    err> /' "$TMP/last.err" >&2 || true
  fi
}

# ── scenarios ───────────────────────────────────────────────────
expect_hook "valid new task branch accepted" \
  0 "refs/heads/sk-git/0041-fix-thing $SHA_A refs/heads/sk-git/0041-fix-thing $ZERO_SHA"

expect_hook "new wrapper ref work/opencode/x rejected" \
  1 "refs/heads/work/opencode/x $SHA_A refs/heads/work/opencode/x $ZERO_SHA"

expect_hook "malformed new branch rejected" \
  1 "refs/heads/sk-git/40-nope $SHA_A refs/heads/sk-git/40-nope $ZERO_SHA"

expect_hook "legacy update to an existing branch allowed" \
  0 "refs/heads/legacy-feature $SHA_A refs/heads/legacy-feature $SHA_B"

expect_hook "skilled/v9.9.9.9 never blocked" \
  0 "refs/heads/skilled/v9.9.9.9 $SHA_A refs/heads/skilled/v9.9.9.9 $ZERO_SHA"

expect_hook "SPECKIT_SKIP_PREPUSH_NAMING=1 bypasses the gate entirely" \
  0 "refs/heads/totally!!bad $SHA_A refs/heads/totally!!bad $ZERO_SHA" \
  SPECKIT_SKIP_PREPUSH_NAMING=1

# A new backup/* branch is NOT a blessed grammar form — it is gated like any
# other non-conformant new branch (genuine backup pushes use the bypass env).
expect_hook "new backup/* branch rejected" \
  1 "refs/heads/backup/foo $SHA_A refs/heads/backup/foo $ZERO_SHA"

# Fail-safe: a broken (syntax-error) validator must NEVER hard-fail a push —
# the gate falls open. Regression guard for the errexit-around-source fix.
rm -f "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
printf 'broken {{{ (\n' > "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
expect_hook "broken validator fails open (never blocks)" \
  0 "refs/heads/totally!!bad $SHA_A refs/heads/totally!!bad $ZERO_SHA"
rm -f "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
ln -s "$REAL_NAMING" "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"

# ── report ──────────────────────────────────────────────────────
echo "pre-push tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
