#!/usr/bin/env bash
# Test harness for worktree-naming.sh. Runs entirely inside a throwaway git repo
# so it never creates refs or worktrees in the real clone. Exercises the grammar
# validators, the number scan, locked allocation (incl. concurrent), and the
# named + detached worktree creators.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
NAMING="$SCRIPT_DIR/worktree-naming.sh"

PASS=0; FAIL=0
_rc() { if "$@" >/dev/null 2>&1; then echo 0; else echo $?; fi; }
expect_rc() { # expect_rc <desc> <expected-rc> <cmd...>
  local desc="$1" exp="$2"; shift 2
  local rc; rc="$(_rc "$@")"
  if [ "$rc" = "$exp" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $desc (rc=$rc exp=$exp)"; fi
}
expect_eq() { # expect_eq <desc> <expected> <actual>
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $1 (exp='$2' got='$3')"; fi
}

# ── isolated fixture repo ──────────────────────────────────────
TMP="$(mktemp -d)"
trap 'git -C "$TMP" worktree prune 2>/dev/null; rm -rf "$TMP"' EXIT
cd "${TMP:?mktemp -d failed}"
git init -q
# Hermetic fixture: override any global core.hooksPath so the shared commit-msg /
# pre-commit gates never run against throwaway test commits.
mkdir -p "$TMP/.nohooks"
git config core.hooksPath "$TMP/.nohooks"
git config user.email t@t.t; git config user.name t
git commit -q --allow-empty -m init
mkdir -p .opencode/skills/sk-git .opencode/skills/sk-doc
printf 'name: sk-git\n' > .opencode/skills/sk-git/SKILL.md
printf 'name: sk-doc\n' > .opencode/skills/sk-doc/SKILL.md
git add -f .opencode/skills
git commit -q -m 'fixture skills'

# shellcheck source=/dev/null
source "$NAMING"

# ── grammar: owners ────────────────────────────────────────────
expect_rc "owner sk-git valid"   0 is_valid_owner sk-git
expect_rc "owner skilled valid"  0 is_valid_owner skilled
expect_rc "owner bogus invalid"  1 is_valid_owner bogus
expect_rc "owner uppercase bad"  1 is_valid_owner Sk-Git
mkdir -p .opencode/skills/untracked-owner
printf 'name: untracked-owner\n' > .opencode/skills/untracked-owner/SKILL.md
expect_rc "untracked owner invalid" 1 is_valid_owner untracked-owner
expect_rc "tracked owner still valid" 0 is_valid_owner sk-git

# ── grammar: slugs ─────────────────────────────────────────────
expect_rc "slug ok"              0 is_valid_slug add-oauth
expect_rc "slug underscore bad"  1 is_valid_slug bad_slug
expect_rc "slug lead-hyphen bad" 1 is_valid_slug -x
expect_rc "slug trail-hyphen bad" 1 is_valid_slug x-
expect_rc "slug double-hyphen bad" 1 is_valid_slug a--b
expect_rc "slug empty bad"       1 is_valid_slug ""

# ── grammar: branches ──────────────────────────────────────────
expect_rc "branch task ok"       0 is_valid_branch sk-git/0040-foo
expect_rc "branch skilled ok"    0 is_valid_branch skilled/0001-bar
expect_rc "branch release ok"    0 is_valid_branch skilled/v4.0.0.0
expect_rc "branch main ok"       0 is_valid_branch main
expect_rc "branch wt/ bad"       1 is_valid_branch wt/0001-foo
expect_rc "branch 2-digit bad"   1 is_valid_branch sk-git/40-foo
expect_rc "branch bad owner"     1 is_valid_branch bogus/0001-x
expect_rc "branch uppercase bad" 1 is_valid_branch sk-git/0040-Foo

# ── grammar: wrapper lane + pairing ────────────────────────────
expect_rc "wrapper recognized"   0 is_wrapper_branch work/opencode/20260101-1
expect_rc "task not wrapper"     1 is_wrapper_branch sk-git/0001-x
expect_rc "pair matches"         0 is_valid_pair sk-git/0040-foo .worktrees/0040-sk-git-foo
expect_rc "pair mismatch"        1 is_valid_pair sk-git/0040-foo .worktrees/0040-sk-git-bar
expect_rc "zero number invalid"   1 is_valid_nnnn 0000
expect_rc "pair outside worktrees invalid" 1 is_valid_pair sk-git/0001-foo /tmp/0001-sk-git-foo
mkdir -p .worktrees/0001-sk-git-foo
expect_rc "pair in worktrees valid" 0 is_valid_pair sk-git/0001-foo .worktrees/0001-sk-git-foo

# ── number scan / preview ──────────────────────────────────────
git update-ref refs/heads/sk-git/0007-a HEAD
git update-ref refs/heads/skilled/0003-b HEAD
expect_eq "scan-max sees refs" 7  "$(scan_max_number)"
expect_eq "next after 7"      0008 "$(next_number)"

# ── next_number boundary: preview must never promise an unallocatable
#    number (a stubbed scan_max_number keeps this independent of real refs) ──
NEXT_9998="$(bash -c 'source "'"$NAMING"'"; scan_max_number() { echo 9998; }; next_number')"
expect_eq "next_number at 9998 previews 9999" 9999 "$NEXT_9998"
NEXT_9999_OUT="$(bash -c 'source "'"$NAMING"'"; scan_max_number() { echo 9999; }; next_number' 2>/dev/null)"
NEXT_9999_RC=$?
expect_eq "next_number at 9999 output empty" "" "$NEXT_9999_OUT"
expect_eq "next_number at 9999 rc" 1 "$NEXT_9999_RC"

# ── locked allocation is monotonic + persistent ────────────────
expect_eq "allocate 1" 0008 "$(allocate_number)"
expect_eq "allocate 2" 0009 "$(allocate_number)"

# ── concurrent allocation yields distinct numbers ──────────────
rm -f "$(_wn_highwater_file)"
git update-ref refs/heads/skilled/0020-seed HEAD
for i in 1 2 3 4 5 6 7 8; do
  ( cd "$TMP" || exit; bash -c 'source "'"$NAMING"'"; allocate_number' ) > "$TMP/alloc.$i" 2>/dev/null &
done
wait
DISTINCT="$(cat "$TMP"/alloc.* | sort -u | wc -l | tr -d ' ')"
expect_eq "8 concurrent allocs distinct" 8 "$DISTINCT"

# Delay every lock-directory cleanup to widen ownership-transfer interleavings.
ORIGINAL_PATH="$PATH"
mkdir -p "$TMP/bin"
REAL_RM="$(command -v rm)"
{
  printf '%s\n' '#!/usr/bin/env bash'
  printf '%s\n' "last=\"\${!#}\""
  printf '%s\n' "case \"\$last\" in *worktree-number.lock*) sleep 0.05 ;; esac"
  printf 'exec "%s" "$@"\n' "$REAL_RM"
} > "$TMP/bin/rm"
chmod +x "$TMP/bin/rm"
rm -rf "$(_wn_lock_dir)" "$(_wn_highwater_file)"
mkdir "$(_wn_lock_dir)"
printf '2147483647\n' > "$(_wn_lock_dir)/pid"
STALE_COUNT=16
i=1
while [ "$i" -le "$STALE_COUNT" ]; do
  ( cd "$TMP" && PATH="$TMP/bin:$ORIGINAL_PATH" bash -c 'source "'"$NAMING"'"; allocate_number' ) > "$TMP/stale-alloc.$i" 2>/dev/null &
  i=$((i+1))
done
wait
STALE_DISTINCT="$(cat "$TMP"/stale-alloc.* | grep -E '^[0-9]{4}$' | sort -u | wc -l | tr -d ' ')"
expect_eq "stale-lock concurrent allocs distinct" "$STALE_COUNT" "$STALE_DISTINCT"
PATH="$ORIGINAL_PATH"
export PATH
rm -rf "${TMP:?}/bin"

# A failed persistence operation must not turn a preview into a reservation.
rm -rf "$(_wn_highwater_file)"
mkdir "$(_wn_highwater_file)"
FIRST_FAILED_OUT="$(allocate_number 2>/dev/null)"; FIRST_FAILED_RC=$?
SECOND_FAILED_OUT="$(allocate_number 2>/dev/null)"; SECOND_FAILED_RC=$?
expect_eq "directory high-water first rc" 1 "$FIRST_FAILED_RC"
expect_eq "directory high-water first output" "" "$FIRST_FAILED_OUT"
expect_eq "directory high-water second rc" 1 "$SECOND_FAILED_RC"
expect_eq "directory high-water second output" "" "$SECOND_FAILED_OUT"
rm -rf "$(_wn_highwater_file)"

# Do not emit a number that cannot fit the documented four-digit namespace.
printf '9999\n' > "$(_wn_highwater_file)"
BOUNDARY_OUT="$(allocate_number 2>/dev/null)"; BOUNDARY_RC=$?
expect_eq "9999 allocation rc" 1 "$BOUNDARY_RC"
expect_eq "9999 allocation output" "" "$BOUNDARY_OUT"
rm -f "$(_wn_highwater_file)"

# ── named + detached worktree creation ─────────────────────────
git update-ref -d refs/heads/skilled/0020-seed 2>/dev/null || true
rm -f "$(_wn_highwater_file)"
OUT="$(create_named_worktree sk-git demo HEAD 2>/dev/null)"
BR="${OUT%% *}"; DIR="${OUT##* }"
expect_rc "created branch valid"  0 is_valid_branch "$BR"
expect_rc "created pair valid"    0 is_valid_pair "$BR" "$DIR"
DET="$(create_detached_worktree probe HEAD 2>/dev/null)"
case "$DET" in *-detached-probe) expect_eq "detached dir shape" ok ok ;; *) expect_eq "detached dir shape" ok "bad:$DET" ;; esac
expect_rc "detached has no branch" 128 git -C "$TMP/$DET" symbolic-ref HEAD

# ── regression: an empty fixture dir must abort before any git init ────
# `cd ""` returns 0 in Bash, so a bare `cd "$TMP" || exit 1` would silently
# fall through into the real clone if mktemp ever handed back an empty
# string. The harness itself now guards with ${TMP:?}; this proves the
# guard construct fires on empty input.
_regression_empty_tmp_guard() {
  ( TMP=""; cd "${TMP:?}" ) 2>/dev/null
}
expect_rc "empty TMP guard aborts before cd" 1 _regression_empty_tmp_guard

# ── report ─────────────────────────────────────────────────────
echo "worktree-naming tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
