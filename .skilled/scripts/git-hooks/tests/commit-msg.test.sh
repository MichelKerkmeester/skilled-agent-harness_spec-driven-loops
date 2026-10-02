#!/usr/bin/env bash
# Test harness for the blocking commit-message hook.
#
# Runs the real hook file against a throwaway repository so a change to the
# grammar, the trailer whitelist or the Commit-Id collision check is covered
# here even when nobody remembers to update this harness. The fixture points
# skgit.contractDir at this checkout's sk-git templates, because the hook
# enforces whatever rules block the repository being committed to declares. The fixture never
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
CONTRACT_DIR="$REPO_ROOT/.opencode/skills/sk-git/assets"

PASS=0; FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# A fresh single-commit repository. Callers seed extra commits on top.
setup_repo() {
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
  git -C "$TMP" config core.hooksPath /dev/null
  git -C "$TMP" config skgit.contractDir "$CONTRACT_DIR"
  git -C "$TMP" config user.email t@example.com
  git -C "$TMP" config user.name test
  echo seed > "$TMP/seed.txt"
  git -C "$TMP" add seed.txt
  # core.hooksPath=/dev/null keeps the fixture's own history out of the
  # validator, so a fixture commit can never be rejected by the code under test.
  git -C "$TMP" commit -qm "chore(sk-git): seed the fixture"
}

# Four staged paths. The body rule no longer depends on the count, so these
# cases prove a multi-path change is held to the same rule as a one-path one.
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
check "four paths with only trailer keys is blocked" 1 "$RC" "A prose body is required"

# ── 4. one prose line alongside the keys clears the body gate ───────────────
setup_repo
stage_four
mkdir -p "$TMP/specs/example/001-demo"
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Spec: example/001-demo
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
# A different commit: its own author date, as two separate commits have.
GIT_AUTHOR_DATE='2001-02-03T04:05:06Z' git -C "$TMP" commit -qF "$TMP/carried-message.txt"
git -C "$TMP" checkout -q "$BASE"
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.
Commit-Id: 0009121
MSG
run_hook; RC=$?
check "a Commit-Id used on another branch is blocked" 1 "$RC" "already belongs"

# ── 7b. a rebased copy of one's own commit is not a collision ───────────────
# A rebase and an amend keep the author and the author date, so the pre-rebase
# copy still on another ref is this commit, not a different one with its id.
setup_repo
BASE="$(git -C "$TMP" rev-parse --abbrev-ref HEAD)"
git -C "$TMP" checkout -q -b feat
printf 'feature\n' > "$TMP/feature.txt"
git -C "$TMP" add feature.txt
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Commit-Id: 0009141
MSG
git -C "$TMP" commit -qF "$TMP/message.txt"
git -C "$TMP" branch pre-rebase
git -C "$TMP" checkout -q "$BASE"
printf 'moved\n' > "$TMP/moved.txt"
git -C "$TMP" add moved.txt
git -C "$TMP" commit -qm "chore(sk-git): move the base"
git -C "$TMP" checkout -q feat
git -C "$TMP" rebase -q "$BASE"
GIT_AUTHOR_DATE="$(git -C "$TMP" log -1 --format=%ad --date=raw HEAD)" run_hook; RC=$?
check "an amend of a rebased commit keeps its own Commit-Id" 0 "$RC"

# ── 8. the amend case: an id only HEAD carries is not a collision ───────────
setup_repo
printf 'head\n' > "$TMP/head.txt"
git -C "$TMP" add head.txt
cat > "$TMP/head-message.txt" <<'MSG'
chore(sk-git): head carries the id

Commit-Id: 0009131
MSG
git -C "$TMP" commit -qF "$TMP/head-message.txt"
stage_four
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Commit-Id: 0009131
MSG
run_hook; RC=$?
check "an id carried only by HEAD passes" 0 "$RC"

# ── 9. the old bypass variable no longer skips anything ─────────────────────
# Run in a subshell so the variable cannot leak into any later case.
setup_repo
cat > "$TMP/message.txt" <<'MSG'
totally invalid message with no grammar at all
MSG
( cd "$TMP" && SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 bash "$HOOK" "$TMP/message.txt" >"$TMP/out.log" 2>&1 ); RC=$?
check "the removed bypass variable no longer passes a bad message" 1 "$RC" "subject.format"

# ── 10. a long trailer line is machine data, exempt from the body-length check ──
# A `Spec:` path can exceed 100 characters without being prose the length rule
# should measure. The line must still classify as a trailer and warn nothing.
setup_repo
LONG_PACKET="example/$(printf 'a%.0s' {1..90})"
mkdir -p "$TMP/specs/$LONG_PACKET"
LONG_TRAILER="Spec: $LONG_PACKET"
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

# ── 17. the early checks block with a reason ────────────────────────────────
setup_repo
printf '# only a comment\n#\n' > "$TMP/message.txt"
run_hook; RC=$?
check "an empty message is blocked" 1 "$RC" "message.empty"

setup_repo
( cd "$TMP" && bash "$HOOK" "$TMP/no-such-message.txt" >"$TMP/out.log" 2>&1 ); RC=$?
check "a missing message file is blocked" 1 "$RC" "no readable message file"

# ── 18. one staged path still needs a body ──────────────────────────────────
# A small commit is searched as often as a large one, so the path count no
# longer excuses a missing why.
setup_repo
printf 'one\n' > "$TMP/one.txt"
git -C "$TMP" add one.txt
printf 'docs(sk-git): add a one-path note\n' > "$TMP/message.txt"
run_hook; RC=$?
check "a one-path subject-only message is blocked" 1 "$RC" "A prose body is required"

# ── 19. trailers alone are not a body, however few paths ────────────────────
setup_repo
printf 'one\n' > "$TMP/one.txt"
git -C "$TMP" add one.txt
cat > "$TMP/message.txt" <<'MSG'
docs(sk-git): add a one-path note

Spec: example/001-demo
MSG
run_hook; RC=$?
check "a one-path message with only a Spec trailer is blocked" 1 "$RC" "A prose body is required"

# ── 20. subjects Git writes itself stay exempt from the body rule ───────────
setup_repo
GENERATED_RC=0
for subject in 'Merge branch side' 'Revert "docs(sk-git): add a note"' \
    'fixup! docs(sk-git): add a note' 'squash! docs(sk-git): add a note' \
    'amend! docs(sk-git): add a note'; do
  printf '%s\n' "$subject" > "$TMP/message.txt"
  run_hook || { GENERATED_RC=1; printf 'blocked: %s\n' "$subject" >> "$TMP/generated.log"; }
done
cp "$TMP/generated.log" "$TMP/out.log" 2>/dev/null || : > "$TMP/out.log"
check "Git-generated subjects pass without a body" 0 "$GENERATED_RC"

# ── 21. Spec carries the packet path below specs/, never the prefix ─────────
setup_repo
mkdir -p "$TMP/specs/example/001-demo"
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Spec: specs/example/001-demo
MSG
run_hook; RC=$?
check "a Spec with the specs/ prefix is blocked" 1 "$RC" "trailer.spec-prefix"

# ── 22. Spec must name a packet that exists ─────────────────────────────────
setup_repo
cat > "$TMP/message.txt" <<'MSG'
feat(sk-git): add a thing

This explains why the thing was added.

Spec: example/404-missing
MSG
run_hook; RC=$?
check "a Spec naming no packet folder is blocked" 1 "$RC" "trailer.spec-exists"

# ── 23. a repository with no rules block is not checked ─────────────────────
setup_repo
git -C "$TMP" config --unset skgit.contractDir
printf 'totally invalid message\n' > "$TMP/message.txt"
run_hook; RC=$?
check "a repository without a contract enforces nothing" 0 "$RC"

# ── 24. a repository's own template replaces these rules ────────────────────
# Its contract allows only feat and fix, drops the body rule and caps the subject
# at 50 characters. The same hook must hold it to exactly that.
setup_repo
git -C "$TMP" config --unset skgit.contractDir
mkdir -p "$TMP/.sk-git"
cat > "$TMP/.sk-git/commit-message-template.md" <<'TPL'
# Our commit rules

## Enforced rules

```json
{
  "kind": "commit",
  "version": 1,
  "subject": { "types": ["feat", "fix"], "scopeRequired": false, "maxLength": 50 }
}
```
TPL
printf 'feat: add a thing\n' > "$TMP/message.txt"
run_hook; RC=$?
check "an edited template accepts its own format" 0 "$RC"
printf 'docs(sk-git): add a thing\n\nWhy it was added.\n' > "$TMP/message.txt"
run_hook; RC=$?
check "an edited template rejects a type it does not list" 1 "$RC" "subject.format"
printf 'feat: %s\n' "$(printf 'x%.0s' {1..60})" > "$TMP/message.txt"
run_hook; RC=$?
check "an edited template applies its own length limit" 1 "$RC" "maximum is 50"

# ── 25. a broken rules block blocks rather than passing ─────────────────────
setup_repo
git -C "$TMP" config --unset skgit.contractDir
mkdir -p "$TMP/.sk-git"
printf '## Enforced rules\n\n```json\n{ "kind": "commit", "subjct": {} }\n```\n' > "$TMP/.sk-git/commit-message-template.md"
printf 'feat: add a thing\n' > "$TMP/message.txt"
run_hook; RC=$?
check "a malformed contract blocks the commit" 1 "$RC" "unknown key"

# ── 26. the node-free rules probe agrees with the validator ─────────────────
# shellcheck source=/dev/null
. "$REPO_ROOT/.opencode/scripts/git-hooks/lib/message-contract-gate.sh"
probe_check() { # probe_check <label> <expected: declared|none>
  local got=none
  mcg_repo_declares_rules "$TMP" commit-message-template.md && got=declared
  if [[ "$got" == "$2" ]]; then
    echo "PASS  $1"; PASS=$((PASS + 1))
  else
    echo "FAIL  $1: expected $2, got $got"; FAIL=$((FAIL + 1))
  fi
}
setup_repo
git -C "$TMP" config --unset skgit.contractDir
mkdir -p "$TMP/.sk-git"
printf '##\tEnforced rules\n' > "$TMP/.sk-git/commit-message-template.md"
probe_check "a tab after the heading hashes declares rules" declared

setup_repo
git -C "$TMP" config --unset skgit.contractDir
mkdir -p "$TMP/.sk-git"
printf '## Unenforced rules\n' > "$TMP/.sk-git/commit-message-template.md"
probe_check "the words inside a longer word declare nothing" none

setup_repo
git -C "$TMP" config --unset skgit.contractDir
mkdir -p "$TMP/.sk-git" "$TMP/.skilled/skills/sk-git/assets"
printf '## Enforced rules\n' > "$TMP/.skilled/skills/sk-git/assets/commit-message-template.md"
probe_check "an existing .sk-git without the template shadows the skill assets" none

setup_repo
git -C "$TMP" config skgit.contractDir "$TMP/missing-dir"
probe_check "a contractDir that points nowhere counts as declared" declared

echo ""
echo "PASS=$PASS FAIL=$FAIL"
[[ "$FAIL" -eq 0 ]]
