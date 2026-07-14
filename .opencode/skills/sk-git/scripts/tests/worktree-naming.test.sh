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
cd "$TMP"
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

# shellcheck source=/dev/null
source "$NAMING"

# ── grammar: owners ────────────────────────────────────────────
expect_rc "owner sk-git valid"   0 is_valid_owner sk-git
expect_rc "owner skilled valid"  0 is_valid_owner skilled
expect_rc "owner bogus invalid"  1 is_valid_owner bogus
expect_rc "owner uppercase bad"  1 is_valid_owner Sk-Git

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

# ── number scan / preview ──────────────────────────────────────
git update-ref refs/heads/sk-git/0007-a HEAD
git update-ref refs/heads/skilled/0003-b HEAD
expect_eq "scan-max sees refs" 7  "$(scan_max_number)"
expect_eq "next after 7"      0008 "$(next_number)"

# ── locked allocation is monotonic + persistent ────────────────
expect_eq "allocate 1" 0008 "$(allocate_number)"
expect_eq "allocate 2" 0009 "$(allocate_number)"

# ── concurrent allocation yields distinct numbers ──────────────
rm -f "$(_wn_highwater_file)"
git update-ref refs/heads/skilled/0020-seed HEAD
for i in 1 2 3 4 5 6 7 8; do
  ( cd "$TMP"; bash -c 'source "'"$NAMING"'"; allocate_number' ) > "$TMP/alloc.$i" 2>/dev/null &
done
wait
DISTINCT="$(cat "$TMP"/alloc.* | sort -u | wc -l | tr -d ' ')"
expect_eq "8 concurrent allocs distinct" 8 "$DISTINCT"

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

# ── report ─────────────────────────────────────────────────────
echo "worktree-naming tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
