#!/usr/bin/env bash
# Test harness for the blocking commit-message hook.
#
# Runs the real hook file against a throwaway repository so a change to the
# grammar, the trailer whitelist or the Commit-Id collision check is covered
# here even when nobody remembers to update this harness. The fixture never
# touches the real clone's index or the operator's global git config; every
# commit made inside it runs with core.hooksPath=/dev/null so the fixtures
# themselves are not re-validated.
set -uo pipefail

# git resolves its repository from these in preference to -C/cwd. Clear them so
# the fixture stays hermetic even when the caller sits inside a worktree.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/commit-msg"

PASS=0; FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# A fresh single-commit repository. Callers seed extra commits on top.
setup_repo() {
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
  git -C "$TMP" config core.hooksPath /dev/null
  git -C "$TMP" config user.email t@example.com
  git -C "$TMP" config user.name test
  echo seed > "$TMP/seed.txt"
  git -C "$TMP" add seed.txt
  # The bypass plus core.hooksPath=/dev/null keep the fixture's own history out of
  # the validator, so a fixture commit can never be rejected by the code under test.
  SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git -C "$TMP" commit -qm "chore(sk-git): seed the fixture"
}

# Four staged paths, the threshold that demands an explanatory body line.
stage_four() {
  local n
  for n in 1 2 3 4; do printf 'file %s\n' "$n" > "$TMP/file$n.txt"; done
  git -C "$TMP" add file1.txt file2.txt file3.txt file4.txt
}

# Run the real hook inside the fixture. Prints nothing; the caller reads $? and
# the captured stderr/stdout log.
run_hook() { ( cd "$TMP" && bash "$HOOK" "$TMP/message.txt" >"$TMP/out.log" 2>&1 ); }

check() { # check <label> <expected-rc> <actual-rc> [<substring the log must contain>]
  local label="$1" want="$2" got="$3" needle="${4:-}"
  if [[ "$got" != "$want" ]]; then
    echo "FAIL  $label: expected rc $want, got $got"; sed 's/^/        /' "$TMP/out.log" | tail -5
    FAIL=$((FAIL + 1)); return
  fi
  if [[ -n "$needle" ]] && ! grep -q "$needle" "$TMP/out.log"; then
    echo "FAIL  $label: log did not contain '$needle'"; sed 's/^/        /' "$TMP/out.log" | tail -5
    FAIL=$((FAIL + 1)); return
  fi
  echo "PASS  $label"; PASS=$((PASS + 1))
}

# ── 1. the established grammar with a prose body still passes ────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.
MSG
run_hook; RC=$?
check "old grammar with a prose body passes" 0 "$RC"

# ── 2. a numeric scope is still refused ─────────────────────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(028): add a thing

This explains why the thing was added.
MSG
run_hook; RC=$?
check "numeric scope is still blocked" 1 "$RC" "numeric-only"

# ── 3. four paths with nothing but the two new keys is a block ──────────────
# The keys are machine trailers, so they cannot satisfy the explanatory-body
# requirement the way a prose line does.
setup_repo
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

Spec: specs/example/001-demo
Commit-Id: 0009113
MSG
run_hook; RC=$?
check "four paths with only trailer keys is blocked" 1 "$RC" "SKILL.md requires a body"

# ── 4. one prose line alongside the keys clears the four-path gate ──────────
setup_repo
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Spec: specs/example/001-demo
Commit-Id: 0009114
MSG
run_hook; RC=$?
check "a prose line plus the new keys passes" 0 "$RC"

# ── 5. a space after Spec is prose, not the Spec: trailer ───────────────────
# The colon-only branch exists for exactly this line: folding Spec into the
# space-tolerant alternation would classify it as a trailer and wave the commit
# through with no explanatory body at all.
setup_repo
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

Spec folder was renamed during the wave
MSG
run_hook; RC=$?
check "space-form Spec is prose, not a trailer" 0 "$RC"

# ── 6. a Commit-Id that is not seven digits is malformed ────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

Commit-Id: 12
MSG
run_hook; RC=$?
check "a malformed Commit-Id is blocked" 1 "$RC" "seven digits"

# ── 7. an id already carried by another branch is a collision ───────────────
# The search runs against --all minus HEAD, so a commit on a side branch that
# never reached this HEAD is exactly the foreign id the gate must reject.
setup_repo
BASE="$(git -C "$TMP" rev-parse --abbrev-ref HEAD)"
git -C "$TMP" checkout -q -b sidecar
printf 'carried\n' > "$TMP/carried.txt"
git -C "$TMP" add carried.txt
cat > "$TMP/carried-message.txt" <<'MSG'
chore(sk-git): carry an id on another branch

Commit-Id: 0009121
MSG
SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git -C "$TMP" commit -qF "$TMP/carried-message.txt"
git -C "$TMP" checkout -q "$BASE"
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.
Commit-Id: 0009121
MSG
run_hook; RC=$?
check "a Commit-Id used on another branch is blocked" 1 "$RC" "already belongs"

# ── 8. the amend case: an id only HEAD carries is not a collision ───────────
setup_repo
printf 'head\n' > "$TMP/head.txt"
git -C "$TMP" add head.txt
cat > "$TMP/head-message.txt" <<'MSG'
chore(sk-git): head carries the id

Commit-Id: 0009131
MSG
SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git -C "$TMP" commit -qF "$TMP/head-message.txt"
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Commit-Id: 0009131
MSG
run_hook; RC=$?
check "an id carried only by HEAD passes" 0 "$RC"

# ── 9. the bypass short-circuits every check ────────────────────────────────
# Run in a subshell so the bypass variable cannot leak into any later case.
setup_repo
cat > "$TMP/message.txt" <<'MSG'
totally invalid message with no grammar at all
MSG
( cd "$TMP" && SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 bash "$HOOK" "$TMP/message.txt" >"$TMP/out.log" 2>&1 ); RC=$?
check "the bypass passes an otherwise blocked message" 0 "$RC"

# ── 10. a long trailer line is machine data, exempt from the body-length check ──
# A `Spec:` path can exceed 100 characters without being prose the length rule
# should measure. The line must still classify as a trailer and warn nothing.
setup_repo
LONG_TRAILER="Spec: specs/example/$(printf 'a%.0s' {1..90})"
cat > "$TMP/message.txt" <<MSG
feat(sk-git): add a thing

This explains why the thing was added.

$LONG_TRAILER
MSG
run_hook; RC=$?
check "a long Spec: trailer passes" 0 "$RC"
if grep -q 'exceeds 100 characters' "$TMP/out.log"; then
  echo "FAIL  a long trailer line was counted against the 100-char body limit"
  sed 's/^/        /' "$TMP/out.log" | tail -5
  FAIL=$((FAIL + 1))
else
  echo "PASS  a long trailer line is exempt from the body-length warning"
  PASS=$((PASS + 1))
fi

# ── 11. keys above prose are invisible to git's trailer parser and are refused ──
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

Spec: specs/example/001-demo
Commit-Id: 0009140

Prose that landed after the keys.
MSG
run_hook; RC=$?
check "keys above prose are blocked" 1 "$RC"

# ── 12. a colon-form Fixes: line is a trailer, not prose ────────────────────
setup_repo
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

Fixes: #12
Commit-Id: 0009141
MSG
run_hook; RC=$?
check "colon-form Fixes: counts as a trailer, so four paths still need prose" 1 "$RC"

# ── 13. prose that quotes an id is not a collision ──────────────────────────
setup_repo
git -C "$TMP/repo" commit -q --allow-empty -m "feat(x): carrier" -m "Commit-Id: 0009150" 2>/dev/null || true
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

See the note about Commit-Id: 0009150 in the plan.

Commit-Id: 0009151
MSG
run_hook; RC=$?
check "prose quoting another id is not a collision" 0 "$RC"

# ── 14. attribution trailers are refused ───────────────────────
# The rewrite strips these from old history; the hook is the wall that keeps a
# runtime from appending a new one to a fresh commit.
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Co-Authored-By: A <a@b.c>
Claude-Session: xyz
MSG
run_hook; RC=$?
check "attribution trailer lines are refused" 1 "$RC" "Forbidden attribution line"

# ── 15. an anthropic trailer is refused ─────────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Generated-By: Anthropic Claude
MSG
run_hook; RC=$?
check "a trailer naming the vendor is refused" 1 "$RC" "Anthropic"

# ── 16. prose that mentions the vendor is not an attribution line ──────────
# Only trailer-shaped lines are machine data, so a prose mention stays a
# question for the operator rather than a hook block.
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the Anthropic client moved.
MSG
run_hook; RC=$?
check "prose mentioning the vendor passes" 0 "$RC"

echo ""
echo "PASS=$PASS FAIL=$FAIL"
[[ "$FAIL" -eq 0 ]]
