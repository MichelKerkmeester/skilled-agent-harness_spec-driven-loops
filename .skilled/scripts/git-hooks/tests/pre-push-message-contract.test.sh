#!/usr/bin/env bash
# Test harness for the pre-push message-contract gate.
#
# The commit-msg hook can be skipped with --no-verify, so this gate is what
# re-checks every pushed commit against the repository's own templates. The
# fixture is a real clone of a throwaway bare remote, because the gate reads
# real commit ranges and remote-tracking refs; fake SHAs would prove nothing.
# Fixture commits run with hooks disabled, which is exactly the --no-verify
# path the gate exists to catch.
set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/pre-push"
CONTRACT_DIR="$REPO_ROOT/.opencode/skills/sk-git/assets"

PASS=0; FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
printf -v ZERO_SHA '%040d' 0

# A bare remote plus a clone that already has main pushed, so updates have a base.
setup() {
  rm -rf "$TMP"; mkdir -p "$TMP"
  git init -q --bare -b main "$TMP/remote.git"
  git clone -q "$TMP/remote.git" "$TMP/repo" 2>/dev/null
  mkdir -p "$TMP/.nohooks"
  git -C "$TMP/repo" config core.hooksPath "$TMP/.nohooks"
  git -C "$TMP/repo" config skgit.contractDir "$CONTRACT_DIR"
  git -C "$TMP/repo" config user.email t@example.com
  git -C "$TMP/repo" config user.name test
  git -C "$TMP/repo" checkout -q -b main
  commit "chore(sk-git): seed the fixture" "Seeds the fixture so pushes have a base."
  git -C "$TMP/repo" push -q origin main
}

# commit <subject> [body] — a commit made with no hooks, as --no-verify would.
commit() {
  local subject="$1" body="${2:-}" n
  n=$(( $(git -C "$TMP/repo" rev-list --count --all 2>/dev/null || echo 0) + 1 ))
  printf '%s\n' "$n" > "$TMP/repo/file$n.txt"
  git -C "$TMP/repo" add "file$n.txt"
  if [[ -n "$body" ]]; then
    git -C "$TMP/repo" commit -q -m "$subject" -m "$body"
  else
    git -C "$TMP/repo" commit -q -m "$subject"
  fi
}

# push_rc <local-branch> <remote-branch> [env...] — run the hook for one ref the
# way git would, and return its exit code.
push_rc() {
  local local_ref="$1" remote_ref="$2"; shift 2
  local local_sha remote_sha
  local_sha="$(git -C "$TMP/repo" rev-parse "$local_ref")"
  remote_sha="$(git -C "$TMP/repo" rev-parse --verify -q "refs/remotes/origin/$remote_ref" || echo "$ZERO_SHA")"
  printf 'refs/heads/%s %s refs/heads/%s %s\n' "$local_ref" "$local_sha" "$remote_ref" "$remote_sha" \
    | ( cd "$TMP/repo" && env "$@" bash "$HOOK" origin "$TMP/remote.git" ) >"$TMP/out.log" 2>&1
}

check() { # check <label> <expected-rc> <actual-rc> [<substring the log must contain>]
  local label="$1" want="$2" got="$3" needle="${4:-}"
  if [[ "$got" != "$want" ]]; then
    echo "FAIL  $label: expected rc $want, got $got"; sed 's/^/        /' "$TMP/out.log" | tail -8
    FAIL=$((FAIL + 1)); return
  fi
  if [[ -n "$needle" ]] && ! grep -qF -- "$needle" "$TMP/out.log"; then
    echo "FAIL  $label: log did not contain '$needle'"; sed 's/^/        /' "$TMP/out.log" | tail -8
    FAIL=$((FAIL + 1)); return
  fi
  echo "PASS  $label"; PASS=$((PASS + 1))
}

# ── 1. a conforming commit pushes ───────────────────────────────────────────
setup
commit "feat(sk-git): add a thing" "Explains why the thing was added."
push_rc main main; RC=$?
check "a conforming commit passes the gate" 0 "$RC"

# ── 2. a --no-verify commit without a body is caught at push ────────────────
setup
commit "feat(sk-git): add a thing"
push_rc main main; RC=$?
check "a commit that skipped commit-msg is blocked at push" 1 "$RC" "gate:message-contract"

# ── 3. every commit in the range is checked, not only the tip ───────────────
setup
commit "update" "No type and no scope."
commit "feat(sk-git): add a thing" "Explains why the thing was added."
push_rc main main; RC=$?
check "a bad commit below a good tip is blocked" 1 "$RC" "subject.format"

# ── 4. the removed bypass variable does not skip the gate ───────────────────
setup
commit "feat(sk-git): add a thing"
push_rc main main SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1; RC=$?
check "the old bypass variable does not skip the push gate" 1 "$RC" "gate:message-contract"

# ── 5. a new branch outside the naming contract is blocked ──────────────────
setup
git -C "$TMP/repo" checkout -q -b feature/oops
commit "feat(sk-git): add a thing" "Explains why the thing was added."
push_rc feature/oops feature/oops SPECKIT_ALLOW_REMOTE_PUSH=feature/oops; RC=$?
check "a new branch with a non-contract name is blocked" 1 "$RC" "branch.name"

# ── 6. a new branch inside the naming contract passes ───────────────────────
setup
git -C "$TMP/repo" checkout -q -b branches/001-demo
commit "feat(sk-git): add a thing" "Explains why the thing was added."
push_rc branches/001-demo branches/001-demo SPECKIT_ALLOW_REMOTE_PUSH=branches/001-demo; RC=$?
check "a new branch with a contract name passes" 0 "$RC"

# ── 7. a rebased branch is not compared with its own old copies ─────────────
# The pre-rebase commit still sits under origin/main with the same Commit-Id.
setup
commit "feat(sk-git): add a thing" "$(printf 'Explains why.\n\nCommit-Id: 0001234')"
git -C "$TMP/repo" push -q origin main
git -C "$TMP/repo" commit -q --amend -m "feat(sk-git): add a better thing" -m "$(printf 'Explains why.\n\nCommit-Id: 0001234')"
push_rc main main; RC=$?
check "a force-pushed rewrite keeps its own Commit-Id" 0 "$RC"

# ── 8. a Commit-Id another remote branch already carries is a collision ─────
setup
git -C "$TMP/repo" checkout -q -b branches/002-other
commit "feat(sk-git): add another thing" "$(printf 'Explains why.\n\nCommit-Id: 0005678')"
git -C "$TMP/repo" push -q origin branches/002-other
git -C "$TMP/repo" checkout -q main
# A different commit: its own author date, as two separate commits have.
GIT_AUTHOR_DATE='2001-02-03T04:05:06Z' commit "feat(sk-git): add a thing" "$(printf 'Explains why.\n\nCommit-Id: 0005678')"
push_rc main main; RC=$?
check "a Commit-Id already on another remote branch is blocked" 1 "$RC" "trailer.commit-id-unique"

# ── 9. a repository without a contract is not checked ───────────────────────
setup
git -C "$TMP/repo" config --unset skgit.contractDir
commit "anything goes here"
push_rc main main; RC=$?
check "a repository without a contract pushes anything" 0 "$RC"

# ── 10. a deletion pushes no commits and is not checked ─────────────────────
setup
printf 'refs/heads/gone %s refs/heads/gone %s\n' "$ZERO_SHA" "$(git -C "$TMP/repo" rev-parse main)" \
  | ( cd "$TMP/repo" && bash "$HOOK" origin "$TMP/remote.git" ) >"$TMP/out.log" 2>&1; RC=$?
if grep -qF "gate:message-contract" "$TMP/out.log"; then
  echo "FAIL  a branch deletion was run through the message gate"; FAIL=$((FAIL + 1))
else
  echo "PASS  a branch deletion skips the message gate"; PASS=$((PASS + 1))
fi

# ── 11. commits merged in from the remote are not re-checked ─────────────────
# A web-UI edit lands on main without the hooks; merging main into a branch must
# not make that branch's push answer for it.
setup
git -C "$TMP/repo" checkout -q -b branches/003-merge
git -C "$TMP/repo" push -q origin branches/003-merge
git -C "$TMP/repo" checkout -q main
commit "Update README.md"
git -C "$TMP/repo" push -q origin main
git -C "$TMP/repo" checkout -q branches/003-merge
git -C "$TMP/repo" merge -q --no-ff main -m "Merge branch 'main' into branches/003-merge"
push_rc branches/003-merge branches/003-merge SPECKIT_ALLOW_REMOTE_PUSH=1; RC=$?
check "a merged-in remote commit is not re-checked" 0 "$RC"

# ── 12. a force-push over a remote tip never fetched checks only new commits ──
setup
git clone -q "$TMP/remote.git" "$TMP/other" 2>/dev/null
git -C "$TMP/other" -c core.hooksPath="$TMP/.nohooks" -c user.email=t@example.com -c user.name=test \
  commit -q --allow-empty -m "feat(sk-git): work pushed from elsewhere" -m "Pushed by someone else."
git -C "$TMP/other" -c core.hooksPath="$TMP/.nohooks" push -q origin main
commit "feat(sk-git): add a thing" "Explains why the thing was added."
printf 'refs/heads/main %s refs/heads/main %s\n' "$(git -C "$TMP/repo" rev-parse main)" "$(git -C "$TMP/remote.git" rev-parse main)" \
  | ( cd "$TMP/repo" && bash "$HOOK" origin "$TMP/remote.git" ) >"$TMP/out.log" 2>&1; RC=$?
check "a force-push over an unfetched remote tip checks only the new commits" 0 "$RC"

# ── 13. a new branch pushed by URL skips what any remote already holds ────────
setup
commit "initial import"
git -C "$TMP/repo" push -q origin main
git -C "$TMP/repo" checkout -q -b branches/004-url
commit "feat(sk-git): add a thing" "Explains why the thing was added."
printf 'refs/heads/branches/004-url %s refs/heads/branches/004-url %s\n' "$(git -C "$TMP/repo" rev-parse HEAD)" "$ZERO_SHA" \
  | ( cd "$TMP/repo" && env SPECKIT_ALLOW_REMOTE_PUSH=branches/004-url bash "$HOOK" "$TMP/remote.git" "$TMP/remote.git" ) >"$TMP/out.log" 2>&1; RC=$?
check "a new branch pushed by URL checks only its own commits" 0 "$RC"

# ── 14. a validator that cannot run is not reported as a rule failure ─────────
setup
mkdir -p "$TMP/broken"
printf '## Enforced rules\n\n```json\n{ not json\n```\n' > "$TMP/broken/commit-message-template.md"
git -C "$TMP/repo" config skgit.contractDir "$TMP/broken"
commit "feat(sk-git): add a thing" "Explains why the thing was added."
push_rc main main; RC=$?
check "a broken contract is reported as a validator failure" 1 "$RC" "could not check"

# ── 15. a rebased branch landed on main is not a collision ───────────────────
# The pre-rebase copy still sits on origin/branches/005-feat with the same id,
# author and author date.
setup
git -C "$TMP/repo" checkout -q -b branches/005-feat
commit "feat(sk-git): add a thing" "$(printf 'Explains why.\n\nCommit-Id: 0002222')"
git -C "$TMP/repo" push -q origin branches/005-feat
git -C "$TMP/repo" checkout -q main
commit "feat(sk-git): move main ahead" "Moves main past the branch point."
git -C "$TMP/repo" push -q origin main
git -C "$TMP/repo" checkout -q branches/005-feat
git -C "$TMP/repo" rebase -q main
git -C "$TMP/repo" checkout -q main
git -C "$TMP/repo" merge -q --ff-only branches/005-feat
push_rc main main SPECKIT_ALLOW_REMOTE_PUSH=1; RC=$?
check "a rebased copy of one's own commit landed on main is not a collision" 0 "$RC"

echo ""
echo "PASS=$PASS FAIL=$FAIL"
[[ "$FAIL" -eq 0 ]]
