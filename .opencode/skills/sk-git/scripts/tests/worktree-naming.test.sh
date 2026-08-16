#!/usr/bin/env bash
# Test harness for worktree-naming.sh. Runs entirely inside a throwaway git repo
# so it never creates refs or worktrees in the real clone. Exercises the grammar
# validators, the per-namespace number scan, locked allocation (incl.
# concurrent), the no-skip rule, and the named/dedicated/detached creators.
set -uo pipefail

# git resolves its repository and config from these variables in preference to the working
# directory. If the caller's environment has any set (routine inside a git worktree), the
# fixture's git writes and the EXIT trap's `worktree prune` would escape $TMP and hit the real,
# shared repository. Clear them so `cd "$TMP"` is the only thing that selects the repo.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_GLOBAL GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

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

# shellcheck source=/dev/null
source "$NAMING"

# ── grammar: slugs ─────────────────────────────────────────────
expect_rc "slug ok"              0 is_valid_slug add-oauth
expect_rc "slug underscore bad"  1 is_valid_slug bad_slug
expect_rc "slug lead-hyphen bad" 1 is_valid_slug -x
expect_rc "slug trail-hyphen bad" 1 is_valid_slug x-
expect_rc "slug double-hyphen bad" 1 is_valid_slug a--b
expect_rc "slug empty bad"       1 is_valid_slug ""

# ── grammar: NNN (3-digit 001..999, base-10) ───────────────────
expect_rc "nnn 001 ok"   0 is_valid_nnn 001
expect_rc "nnn 007 ok"   0 is_valid_nnn 007
expect_rc "nnn 099 ok"   0 is_valid_nnn 099
expect_rc "nnn 100 ok"   0 is_valid_nnn 100
expect_rc "nnn 999 ok"   0 is_valid_nnn 999
expect_rc "nnn 000 bad"  1 is_valid_nnn 000
expect_rc "nnn 2-digit bad" 1 is_valid_nnn 40
expect_rc "nnn 4-digit bad" 1 is_valid_nnn 1000
expect_rc "nnn alpha bad"   1 is_valid_nnn abc

# ── grammar: branches ──────────────────────────────────────────
expect_rc "branch worktrees ok"  0 is_valid_branch worktrees/007-foo
expect_rc "branch branches ok"   0 is_valid_branch branches/003-bar
expect_rc "branch skilled-owner bad" 1 is_valid_branch skilled/0001-bar
expect_rc "branch release ok"    0 is_valid_branch skilled/v4.0.0.0
expect_rc "branch main ok"       0 is_valid_branch main
expect_rc "branch backup ok"     0 is_valid_branch backup/anything
expect_rc "branch wrapper ok"    0 is_valid_branch work/x/y
expect_rc "branch owner-first bad" 1 is_valid_branch sk-doc/0131-foo
expect_rc "branch wt/ bad"       1 is_valid_branch wt/0001-foo
expect_rc "branch 2-digit bad"   1 is_valid_branch worktrees/7-foo
expect_rc "branch uppercase bad" 1 is_valid_branch worktrees/007-Bad_slug
expect_rc "branch zero-num bad"  1 is_valid_branch worktrees/000-foo
expect_rc "branch 4-digit bad"   1 is_valid_branch worktrees/1000-foo

# ── grammar: wrapper lane + backup lane + pairing ──────────────
expect_rc "wrapper recognized"   0 is_wrapper_branch work/opencode/20260101-1
expect_rc "task not wrapper"     1 is_wrapper_branch worktrees/001-x
expect_rc "backup recognized"    0 is_backup_branch backup/2026-08-16-pre-bump
expect_rc "backup empty bad"     1 is_backup_branch backup/
expect_rc "backup task not backup" 1 is_backup_branch worktrees/001-x
expect_rc "pair matches"         0 is_valid_pair worktrees/004-foo .worktrees/004-foo
expect_rc "pair mismatch"        1 is_valid_pair worktrees/004-foo .worktrees/004-bar
expect_rc "pair branches ns invalid" 1 is_valid_pair branches/003-bar .worktrees/003-bar
expect_rc "pair owner-first invalid" 1 is_valid_pair sk-git/0040-foo .worktrees/0040-sk-git-foo
expect_rc "pair outside worktrees invalid" 1 is_valid_pair worktrees/001-foo /tmp/001-foo
mkdir -p .worktrees/001-foo
expect_rc "pair in worktrees valid" 0 is_valid_pair worktrees/001-foo .worktrees/001-foo

# ── number scan / preview (per-namespace) ──────────────────────
git update-ref refs/heads/worktrees/007-a HEAD
git update-ref refs/heads/branches/003-b HEAD
expect_eq "scan-max worktrees sees refs" 7   "$(scan_max_number worktrees)"
expect_eq "scan-max branches sees refs"  3   "$(scan_max_number branches)"
expect_eq "next worktrees after 7"       008 "$(next_number worktrees)"
expect_eq "next branches after 3"        004 "$(next_number branches)"

# ── next_number boundary: preview must never promise an unallocatable
#    number (a stubbed scan_max_number keeps this independent of real refs) ──
NEXT_998="$(bash -c 'source "'"$NAMING"'"; scan_max_number() { echo 998; }; next_number worktrees')"
expect_eq "next_number at 998 previews 999" 999 "$NEXT_998"
NEXT_999_OUT="$(bash -c 'source "'"$NAMING"'"; scan_max_number() { echo 999; }; next_number worktrees' 2>/dev/null)"
NEXT_999_RC=$?
expect_eq "next_number at 999 output empty" "" "$NEXT_999_OUT"
expect_eq "next_number at 999 rc" 1 "$NEXT_999_RC"

# ── per-namespace locked allocation is monotonic + independent ─
expect_eq "allocate worktrees 1" 008 "$(allocate_number worktrees)"
expect_eq "allocate worktrees 2" 009 "$(allocate_number worktrees)"
expect_eq "allocate branches independent" 004 "$(allocate_number branches)"

# ── no-skip: delete a middle number, next must be max+1, never a gap backfill ──
git update-ref -d refs/heads/worktrees/008-a 2>/dev/null || true
expect_eq "after delete 008, next is 010 (no reuse/backfill)" 010 "$(allocate_number worktrees)"

# ── concurrent allocation yields distinct numbers per namespace ─
rm -f "$(_wn_highwater_file worktrees)" "$(_wn_highwater_file branches)"
git update-ref refs/heads/branches/0020-seed HEAD
for i in 1 2 3 4 5 6 7 8; do
  ( cd "$TMP" || exit; bash -c 'source "'"$NAMING"'"; allocate_number worktrees' ) > "$TMP/alloc.$i" 2>/dev/null &
done
wait
DISTINCT="$(cat "$TMP"/alloc.* | sort -u | wc -l | tr -d ' ')"
expect_eq "8 concurrent worktrees allocs distinct" 8 "$DISTINCT"

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
rm -rf "$(_wn_lock_dir)" "$(_wn_highwater_file worktrees)"
mkdir "$(_wn_lock_dir)"
printf '2147483647\n' > "$(_wn_lock_dir)/pid"
STALE_COUNT=16
i=1
while [ "$i" -le "$STALE_COUNT" ]; do
  ( cd "$TMP" && PATH="$TMP/bin:$ORIGINAL_PATH" bash -c 'source "'"$NAMING"'"; allocate_number worktrees' ) > "$TMP/stale-alloc.$i" 2>/dev/null &
  i=$((i+1))
done
wait
STALE_DISTINCT="$(cat "$TMP"/stale-alloc.* | grep -E '^[0-9]{3}$' | sort -u | wc -l | tr -d ' ')"
expect_eq "stale-lock concurrent allocs distinct" "$STALE_COUNT" "$STALE_DISTINCT"
PATH="$ORIGINAL_PATH"
export PATH
rm -rf "${TMP:?}/bin"

# A failed persistence operation must not turn a preview into a reservation.
rm -rf "$(_wn_highwater_file worktrees)"
mkdir "$(_wn_highwater_file worktrees)"
FIRST_FAILED_OUT="$(allocate_number worktrees 2>/dev/null)"; FIRST_FAILED_RC=$?
SECOND_FAILED_OUT="$(allocate_number worktrees 2>/dev/null)"; SECOND_FAILED_RC=$?
expect_eq "directory high-water first rc" 1 "$FIRST_FAILED_RC"
expect_eq "directory high-water first output" "" "$FIRST_FAILED_OUT"
expect_eq "directory high-water second rc" 1 "$SECOND_FAILED_RC"
expect_eq "directory high-water second output" "" "$SECOND_FAILED_OUT"
rm -rf "$(_wn_highwater_file worktrees)"

# Do not emit a number that cannot fit the documented three-digit namespace.
printf '999\n' > "$(_wn_highwater_file worktrees)"
BOUNDARY_OUT="$(allocate_number worktrees 2>/dev/null)"; BOUNDARY_RC=$?
expect_eq "999 allocation rc" 1 "$BOUNDARY_RC"
expect_eq "999 allocation output" "" "$BOUNDARY_OUT"
rm -f "$(_wn_highwater_file worktrees)"

# ── named / dedicated / detached creation ─────────────────────
git update-ref -d refs/heads/branches/0020-seed 2>/dev/null || true
rm -f "$(_wn_highwater_file worktrees)" "$(_wn_highwater_file branches)"
OUT="$(create_named_worktree demo HEAD 2>/dev/null)"
BR="${OUT%% *}"; DIR="${OUT##* }"
expect_rc "created worktree branch valid"  0 is_valid_branch "$BR"
expect_rc "created worktree pair valid"    0 is_valid_pair "$BR" "$DIR"
DET="$(create_detached_worktree probe HEAD 2>/dev/null)"
case "$DET" in *-detached-probe) expect_eq "detached dir shape" ok ok ;; *) expect_eq "detached dir shape" ok "bad:$DET" ;; esac
expect_rc "detached has no branch" 128 git -C "$TMP/$DET" symbolic-ref HEAD
DED="$(create_branch dep HEAD 2>/dev/null)"
case "$DED" in branches/*) expect_eq "dedicated branch shape" ok ok ;; *) expect_eq "dedicated branch shape" ok "bad:$DED" ;; esac
expect_rc "dedicated branch has no worktree" 1 git worktree list --porcelain 2>/dev/null | grep -q "^worktree .*$DED"
expect_rc "dedicated branch valid" 0 is_valid_branch "$DED"

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
