#!/usr/bin/env bash
# Test harness for the pre-push hook's two independent gates (naming +
# remote-push-permission). Runs entirely inside a throwaway git repo
# (symlinking the real worktree-naming.sh and a fixture SKILL.md so owner
# resolution works) so it never touches real refs, the real clone's hooks,
# or the operator's global git config.
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
git -C "$TMP" add -f .opencode/skills
git -C "$TMP" commit -q -m 'fixture skills'

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

# ── naming-gate scenarios (unaffected by the permission gate: rejected before
#    it, or exempted before either gate runs) ───────────────────────────────
mkdir -p "$TMP/.opencode/skills/untracked-owner"
printf 'name: untracked-owner\n' > "$TMP/.opencode/skills/untracked-owner/SKILL.md"
expect_hook "untracked owner branch rejected" \
  1 "refs/heads/untracked-owner/0041-valid $SHA_A refs/heads/untracked-owner/0041-valid $ZERO_SHA"

expect_hook "new wrapper ref work/opencode/x rejected" \
  1 "refs/heads/work/opencode/x $SHA_A refs/heads/work/opencode/x $ZERO_SHA"

expect_hook "malformed new branch rejected" \
  1 "refs/heads/sk-git/40-nope $SHA_A refs/heads/sk-git/40-nope $ZERO_SHA"

expect_hook "skilled/v9.9.9.9 never blocked (naming + permission both exempt)" \
  0 "refs/heads/skilled/v9.9.9.9 $SHA_A refs/heads/skilled/v9.9.9.9 $ZERO_SHA"

# A new backup/* branch is NOT a blessed grammar form — it is gated like any
# other non-conformant new branch (genuine backup pushes use the bypass env).
expect_hook "new backup/* branch rejected" \
  1 "refs/heads/backup/foo $SHA_A refs/heads/backup/foo $ZERO_SHA"

# ── remote-push-permission gate: default-blocked, every push, new or update ─
expect_hook "valid new task branch STILL blocked by default (permission gate)" \
  1 "refs/heads/sk-git/0041-fix-thing $SHA_A refs/heads/sk-git/0041-fix-thing $ZERO_SHA"
expect_hook "...but SPECKIT_ALLOW_REMOTE_PUSH=1 lets it through" \
  0 "refs/heads/sk-git/0041-fix-thing $SHA_A refs/heads/sk-git/0041-fix-thing $ZERO_SHA" \
  SPECKIT_ALLOW_REMOTE_PUSH=1

expect_hook "update to an existing non-allowlisted branch STILL blocked by default" \
  1 "refs/heads/legacy-feature $SHA_A refs/heads/legacy-feature $SHA_B"
expect_hook "...but SPECKIT_ALLOW_REMOTE_PUSH=1 lets the update through too" \
  0 "refs/heads/legacy-feature $SHA_A refs/heads/legacy-feature $SHA_B" \
  SPECKIT_ALLOW_REMOTE_PUSH=1

# ── the two bypass env vars are independent — skipping one never skips the other ─
expect_hook "SPECKIT_SKIP_PREPUSH_NAMING=1 alone skips naming but permission STILL blocks" \
  1 "refs/heads/totally!!bad $SHA_A refs/heads/totally!!bad $ZERO_SHA" \
  SPECKIT_SKIP_PREPUSH_NAMING=1
expect_hook "...combined with SPECKIT_ALLOW_REMOTE_PUSH=1, both gates clear" \
  0 "refs/heads/totally!!bad $SHA_A refs/heads/totally!!bad $ZERO_SHA" \
  SPECKIT_SKIP_PREPUSH_NAMING=1 SPECKIT_ALLOW_REMOTE_PUSH=1

# ── main / skilled/v* are exempt from the permission gate with zero env vars ─
expect_hook "main push (new form) allowed with no env vars" \
  0 "refs/heads/main $SHA_A refs/heads/main $ZERO_SHA"
expect_hook "main push (update form) allowed with no env vars" \
  0 "refs/heads/main $SHA_A refs/heads/main $SHA_B"

# ── operator-editable allowlist file extends the built-in exemptions ────────
# Use an UPDATE ref (docs/foo doesn't match the owner-first grammar, so as a
# NEW branch it would be rejected by Gate 1 before ever reaching Gate 2;
# updates are naming-tolerant, so this isolates the allowlist-file check).
printf 'docs/*\n' > "$TMP/.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt"
expect_hook "custom allowlist-file pattern (docs/*) exempts an update push" \
  0 "refs/heads/docs/foo $SHA_A refs/heads/docs/foo $SHA_B"
expect_hook "...but does not exempt a branch outside the pattern" \
  1 "refs/heads/sk-git/0042-bar $SHA_A refs/heads/sk-git/0042-bar $ZERO_SHA"
rm -f "$TMP/.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt"

# ── continuous-integration autosync exception, scoped to the exact live branch ─
expect_hook "autosync publish to \$SPECKIT_LIVE_BRANCH is exempt" \
  0 "refs/heads/sk-git/0099-wip $SHA_A refs/heads/sk-git/0099-wip $SHA_B" \
  SPECKIT_AUTOSYNC=1 SPECKIT_LIVE_BRANCH=sk-git/0099-wip
expect_hook "...but SPECKIT_AUTOSYNC=1 does NOT exempt a DIFFERENT branch (not a blanket bypass)" \
  1 "refs/heads/sk-git/0100-other $SHA_A refs/heads/sk-git/0100-other $SHA_B" \
  SPECKIT_AUTOSYNC=1 SPECKIT_LIVE_BRANCH=sk-git/0099-wip

# An owner-discovery failure is an infrastructure error, so the hook must allow
# a well-shaped branch's NAMING check while still rejecting malformed syntax
# before discovery. SPECKIT_ALLOW_REMOTE_PUSH=1 isolates that assertion from
# the (separately tested) permission gate.
mkdir -p "$TMP/bin"
REAL_GIT="$(command -v git)"
{
  printf '%s\n' '#!/usr/bin/env bash'
  printf '%s\n' "if [[ \"\${1:-}\" == \"-C\" && \"\${3:-}\" == \"ls-files\" ]]; then exit 73; fi"
  printf 'exec "%s" "$@"\n' "$REAL_GIT"
} > "$TMP/bin/git"
chmod +x "$TMP/bin/git"
expect_hook "owner discovery error fails open (naming), permission gate bypassed for isolation" \
  0 "refs/heads/sk-git/0041-valid $SHA_A refs/heads/sk-git/0041-valid $ZERO_SHA" \
  PATH="$TMP/bin:$PATH" SPECKIT_ALLOW_REMOTE_PUSH=1
if grep -q 'internal validator error' "$TMP/last.err"; then
  PASS=$((PASS+1))
else
  FAIL=$((FAIL+1))
  echo "FAIL: owner discovery error warning missing"
fi
expect_hook "malformed branch still rejected during discovery error" \
  1 "refs/heads/sk-git/0041-BAD $SHA_A refs/heads/sk-git/0041-BAD $ZERO_SHA" \
  PATH="$TMP/bin:$PATH" SPECKIT_ALLOW_REMOTE_PUSH=1
rm -rf "${TMP:?}/bin"

# Fail-safe: a broken (syntax-error) validator must NEVER hard-fail a push —
# BOTH gates fall open together (the permission gate's function lives in the
# same sourced file, so a broken source can't fail-open one gate but not the
# other). Regression guard for the errexit-around-source fix.
rm -f "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
printf 'broken {{{ (\n' > "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
expect_hook "broken validator fails open (never blocks either gate)" \
  0 "refs/heads/totally!!bad $SHA_A refs/heads/totally!!bad $ZERO_SHA"
rm -f "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
ln -s "$REAL_NAMING" "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"

# ── report ──────────────────────────────────────────────────────
echo "pre-push tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
