#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Prepare-Commit-Msg Stamper Regression Harness
# ───────────────────────────────────────────────────────────────
# Runs the real hook file against throwaway repositories. Each fixture carries a
# copy of the sk-git scripts directory so the allocator sits at the path the
# hook resolves, and every fixture commit runs with core.hooksPath=/dev/null so
# the fixture history is never re-validated.
#
# Exit Codes:
#   0 - Every case passed
#   1 - At least one case failed

set -uo pipefail

# git resolves its repository from these in preference to -C/cwd. Clear them so
# the fixture stays hermetic even when the caller sits inside a worktree.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/prepare-commit-msg"
COMMIT_MSG_HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/commit-msg"
ALLOCATOR_DIR="$REPO_ROOT/.opencode/skills/sk-git/scripts"

PASS=0
FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# A fresh single-commit repository carrying the real allocator at the path the
# hook looks for.
setup_repo() {
  rm -rf "$TMP"
  mkdir -p "$TMP"
  git -C "$TMP" init -q
  git -C "$TMP" config core.hooksPath /dev/null
  git -C "$TMP" config user.email t@example.com
  git -C "$TMP" config user.name test
  echo seed > "$TMP/seed.txt"
  git -C "$TMP" add seed.txt
  SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git -C "$TMP" commit -qm "chore(sk-git): seed the fixture"
  mkdir -p "$TMP/.opencode/skills/sk-git"
  cp -R "$ALLOCATOR_DIR" "$TMP/.opencode/skills/sk-git/scripts"
}

# Run the real hook inside the fixture. The caller reads $? and the log.
run_hook() { # run_hook [source] [sha]
  ( cd "$TMP" && bash "$HOOK" "$TMP/message.txt" "$@" >"$TMP/out.log" 2>&1 )
}

pass() {
  echo "PASS  $1"
  PASS=$((PASS + 1))
}

fail() {
  echo "FAIL  $1: $2"
  FAIL=$((FAIL + 1))
}

check_rc() { # check_rc <label> <expected-rc> <actual-rc>
  if [[ "$3" = "$2" ]]; then
    pass "$1"
  else
    fail "$1" "expected rc $2, got $3"
    sed 's/^/        /' "$TMP/out.log" | tail -5
  fi
}

check_count() { # check_count <label> <ere> <expected-count> <file>
  local count
  count="$(grep -Ec "$2" "$4" || true)"
  if [[ "$count" = "$3" ]]; then
    pass "$1"
  else
    fail "$1" "expected $3 lines matching '$2', got $count"
  fi
}

check_absent() { # check_absent <label> <ere> <file>
  if grep -Eq "$2" "$3"; then
    fail "$1" "unexpected '$2' in $3"
  else
    pass "$1"
  fi
}

check_same() { # check_same <label> <file-a> <file-b>
  if cmp -s "$2" "$3"; then
    pass "$1"
  else
    fail "$1" "$2 and $3 differ"
    diff -u "$2" "$3" | sed 's/^/        /' | head -12
  fi
}

check_blank_before_id() { # check_blank_before_id <label> <file>
  local previous
  previous="$(awk '/^Commit-Id:/{print prev; exit} {prev=$0}' "$2")"
  if [[ -z "$previous" ]]; then
    pass "$1"
  else
    fail "$1" "line before Commit-Id is '$previous'"
  fi
}

check_before() { # check_before <label> <ere-a> <ere-b> <file>
  local line_a line_b
  line_a="$(grep -En "$2" "$4" | head -1 | cut -d: -f1)"
  line_b="$(grep -En "$3" "$4" | head -1 | cut -d: -f1)"
  if [[ -n "$line_a" && -n "$line_b" && "$line_a" -lt "$line_b" ]]; then
    pass "$1"
  else
    fail "$1" "'$2' (line ${line_a:-none}) is not before '$3' (line ${line_b:-none})"
  fi
}

# ── 1. a message source mints an id and separates the block from prose ──────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): stamp a message source

This body explains why the ordinal exists.
MSG
run_hook message; RC=$?
check_rc "message source exits 0" 0 "$RC"
check_count "message source mints one id" '^Commit-Id: [0-9]{7}$' 1 "$TMP/message.txt"
check_blank_before_id "message source separates the block from prose" "$TMP/message.txt"

# ── 2. a template source mints ──────────────────────────────────────────────
setup_repo
printf 'feat(sk-git): stamp a template source\n' > "$TMP/message.txt"
run_hook template; RC=$?
check_rc "template source exits 0" 0 "$RC"
check_count "template source mints one id" '^Commit-Id: [0-9]{7}$' 1 "$TMP/message.txt"

# ── 3. a Context-only body gets its blank line before the block ─────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): keep the context line readable

Context: short reason
MSG
run_hook message; RC=$?
check_rc "context-only body exits 0" 0 "$RC"
check_blank_before_id "context-only body gets a blank line first" "$TMP/message.txt"
check_count "context line survives" '^Context: short reason$' 1 "$TMP/message.txt"

# ── 4. an amend keeps the existing id ───────────────────────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): keep the id on amend

Commit-Id: 0009001
MSG
run_hook commit "$(git -C "$TMP" rev-parse HEAD)"; RC=$?
check_rc "amend exits 0" 0 "$RC"
check_count "amend keeps its id" '^Commit-Id: 0009001$' 1 "$TMP/message.txt"
check_count "amend adds no second id" '^Commit-Id:' 1 "$TMP/message.txt"

# ── 5. a cherry-pick re-mints and drops the copied id ───────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): re-mint a picked commit

Commit-Id: 0009123
MSG
touch "$TMP/.git/CHERRY_PICK_HEAD"
run_hook commit "$(git -C "$TMP" rev-parse HEAD)"; RC=$?
check_rc "cherry-pick exits 0" 0 "$RC"
check_count "cherry-pick stamps one fresh id" '^Commit-Id: [0-9]{7}$' 1 "$TMP/message.txt"
check_absent "cherry-pick drops the copied id" '0009123' "$TMP/message.txt"

# ── 6. a merge source is left untouched ─────────────────────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
Merge branch 'feature/x'

Context: merge body without a key
MSG
cp "$TMP/message.txt" "$TMP/before.txt"
run_hook merge; RC=$?
check_rc "merge source exits 0" 0 "$RC"
check_same "merge message is untouched" "$TMP/before.txt" "$TMP/message.txt"

# ── 7. a second run changes nothing ─────────────────────────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): stamp once

This body explains the idempotence case.
MSG
run_hook message
cp "$TMP/message.txt" "$TMP/after-first-run.txt"
run_hook message; RC=$?
check_rc "second run exits 0" 0 "$RC"
check_same "second run changes nothing" "$TMP/after-first-run.txt" "$TMP/message.txt"

# ── 8. trailing comment lines stay below the trailer block ──────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): keep comments last

This body explains the comment case.

# Please enter the commit message for your changes.
# Lines starting with '#' will be ignored.
MSG
run_hook message; RC=$?
check_rc "comment case exits 0" 0 "$RC"
check_before "comment lines stay below the block" '^Commit-Id:' '^#' "$TMP/message.txt"

# ── 8b. a configured core.commentChar is preserved below the block ───────────
setup_repo
git -C "$TMP" config core.commentChar ';'
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): keep a configured comment char

This body explains the commentChar case.

; Please enter the commit message for your changes.
MSG
run_hook message; RC=$?
check_rc "commentChar case exits 0" 0 "$RC"
check_before "configured comment char stays below the block" '^Commit-Id:' '^;' "$TMP/message.txt"

# ── 9. SPECKIT_COMMIT_SPEC adds Spec once ───────────────────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): carry the packet path

This body explains the spec case.
MSG
SPEC='specs/example/001-demo'
( cd "$TMP" && SPECKIT_COMMIT_SPEC="$SPEC" bash "$HOOK" "$TMP/message.txt" message >"$TMP/out.log" 2>&1 ); RC=$?
check_rc "spec stamp exits 0" 0 "$RC"
check_count "spec stamp adds Spec once" '^Spec: specs/example/001-demo$' 1 "$TMP/message.txt"
check_before "Spec sits above Commit-Id" '^Spec:' '^Commit-Id:' "$TMP/message.txt"
( cd "$TMP" && SPECKIT_COMMIT_SPEC="$SPEC" bash "$HOOK" "$TMP/message.txt" message >"$TMP/out.log" 2>&1 ); RC=$?
check_rc "spec stamp is idempotent" 0 "$RC"
check_count "second run keeps one Spec" '^Spec: specs/example/001-demo$' 1 "$TMP/message.txt"

# ── 10. a foreign repository without the allocator is untouched ─────────────
rm -rf "$TMP"
mkdir -p "$TMP/foreign"
git -C "$TMP/foreign" init -q
git -C "$TMP/foreign" config core.hooksPath /dev/null
git -C "$TMP/foreign" config user.email t@example.com
git -C "$TMP/foreign" config user.name test
printf 'feat(foreign): no allocator here\n' > "$TMP/foreign/message.txt"
cp "$TMP/foreign/message.txt" "$TMP/before.txt"
( cd "$TMP/foreign" && bash "$HOOK" "$TMP/foreign/message.txt" message >"$TMP/out.log" 2>&1 ); RC=$?
check_rc "foreign repository exits 0" 0 "$RC"
check_same "foreign repository message is untouched" "$TMP/before.txt" "$TMP/foreign/message.txt"

# ── 11. the bypass variable skips stamping ──────────────────────────────────
setup_repo
printf 'feat(sk-git): bypass the stamper\n\nBody text.\n' > "$TMP/message.txt"
cp "$TMP/message.txt" "$TMP/before.txt"
( cd "$TMP" && SPECKIT_SKIP_PREPARE_COMMIT_MSG=1 bash "$HOOK" "$TMP/message.txt" message >"$TMP/out.log" 2>&1 ); RC=$?
check_rc "bypass exits 0" 0 "$RC"
check_same "bypass leaves the message untouched" "$TMP/before.txt" "$TMP/message.txt"
check_absent "bypass adds no id" '^Commit-Id:' "$TMP/message.txt"

# ── 12. a commit -v scissors tail stays below the block ─────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): keep the verbose diff last

This body explains the verbose case.

# Please enter the commit message for your changes.
# ------------------------ >8 ------------------------
diff --git a/seed.txt b/seed.txt
index 0000000..1111111 100644
--- a/seed.txt
+++ b/seed.txt
@@ -1 +1 @@
-seed
+changed
MSG
run_hook message; RC=$?
check_rc "verbose case exits 0" 0 "$RC"
check_count "verbose case mints one id" '^Commit-Id: [0-9]{7}$' 1 "$TMP/message.txt"
check_before "trailer block stays above the scissors line" '^Commit-Id:' '^# ------------------------ >8' "$TMP/message.txt"
check_before "verbose diff stays below the scissors line" '^# ------------------------ >8' '^diff --git' "$TMP/message.txt"

# ── 13. a real commit runs both hooks and keeps the stamped id ──────────────
setup_repo
mkdir -p "$TMP/hooks"
ln -s "$HOOK" "$TMP/hooks/prepare-commit-msg"
ln -s "$COMMIT_MSG_HOOK" "$TMP/hooks/commit-msg"
git -C "$TMP" config core.hooksPath "$TMP/hooks"
echo change > "$TMP/change.txt"
git -C "$TMP" add change.txt
git -C "$TMP" commit -qm "feat(sk-git): integrate through git"; RC=$?
check_rc "commit through both hooks exits 0" 0 "$RC"
git -C "$TMP" log -1 --format=%B > "$TMP/committed.txt"
check_count "committed message carries the stamped id" '^Commit-Id: [0-9]{7}$' 1 "$TMP/committed.txt"
check_absent "committed message carries no Spec without the env var" '^Spec:' "$TMP/committed.txt"

# ── 14. an allocator failure exits 0 and leaves the message alone ───────────
setup_repo
printf '#!/usr/bin/env bash\nexit 3\n' > "$TMP/.opencode/skills/sk-git/scripts/commit-id-naming.sh"
printf 'feat(sk-git): survive a failed mint\n\nBody text.\n' > "$TMP/message.txt"
cp "$TMP/message.txt" "$TMP/before.txt"
run_hook message; RC=$?
check_rc "allocator failure exits 0" 0 "$RC"
check_same "allocator failure leaves the message untouched" "$TMP/before.txt" "$TMP/message.txt"
check_absent "allocator failure stamps no id" '^Commit-Id:' "$TMP/message.txt"
check_count "allocator failure reports one line" 'allocator failed' 1 "$TMP/out.log"

# ── 15. attribution lines are stripped before stamping ──────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): strip attribution before stamping

This body explains why the attribution never lands.

Co-Authored-By: A <a@b.c>
Claude-Session: https://claude.ai/session/1

Generated-By: Anthropic Claude
MSG
run_hook message; RC=$?
check_rc "attribution strip exits 0" 0 "$RC"
check_absent "Co-Authored-By is stripped" 'Co-Authored-By' "$TMP/message.txt"
check_absent "Claude-Session is stripped" 'Claude-Session' "$TMP/message.txt"
check_absent "Anthropic trailer is stripped" 'Anthropic' "$TMP/message.txt"
check_count "the prose body survives the strip" '^This body explains why the attribution never lands\.$' 1 "$TMP/message.txt"
check_count "one id is stamped after the strip" '^Commit-Id: [0-9]{7}$' 1 "$TMP/message.txt"
cp "$TMP/message.txt" "$TMP/after-strip.txt"
run_hook message; RC=$?
check_rc "a second run still exits 0" 0 "$RC"
check_same "a second run changes nothing" "$TMP/after-strip.txt" "$TMP/message.txt"

echo ""
echo "PASS=$PASS FAIL=$FAIL"
[[ "$FAIL" -eq 0 ]]
