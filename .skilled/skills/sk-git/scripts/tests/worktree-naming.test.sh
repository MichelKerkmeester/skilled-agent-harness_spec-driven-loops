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
expect_rc "detached has no branch" 128 git -C "$DET" symbolic-ref HEAD
DED="$(create_branch dep HEAD 2>/dev/null)"
case "$DED" in branches/*) expect_eq "dedicated branch shape" ok ok ;; *) expect_eq "dedicated branch shape" ok "bad:$DED" ;; esac
expect_rc "dedicated branch has no worktree" 1 git worktree list --porcelain 2>/dev/null | grep -q "^worktree .*$DED"
expect_rc "dedicated branch valid" 0 is_valid_branch "$DED"

# ── relocated worktree base (speckit.worktreeBase / SPECKIT_WORKTREE_BASE) ─────
# A configured base moves worktrees OUT of the checkout so the checkout's own
# file-watchers stop scanning them. The allocator must create there, keep
# counting relocated worktrees for numbering, and pair-validate the new path
# while staying tolerant of the legacy in-checkout .worktrees layout.
EXT="$(mktemp -d)"
git config speckit.worktreeBase "$EXT"
expect_eq "base resolver honors config" "$EXT" "$(_wn_base_dir)"
ROUT="$(create_named_worktree relocated HEAD 2>/dev/null)"
RBR="${ROUT%% *}"; RDIR="${ROUT##* }"
expect_eq "relocated dir sits under configured base" "$EXT" "$(dirname "$RDIR")"
expect_rc "relocated worktree dir exists"      0 test -d "$RDIR"
expect_rc "relocated pair valid"               0 is_valid_pair "$RBR" "$RDIR"
expect_rc "legacy .worktrees pair still valid" 0 is_valid_pair worktrees/002-foo .worktrees/002-foo
expect_rc "same basename wrong parent rejected" 1 is_valid_pair "$RBR" "/tmp/${RBR#worktrees/}"
git config --unset speckit.worktreeBase
git -C "$TMP" worktree prune 2>/dev/null || true
rm -rf "$EXT"

# ── regression: an empty fixture dir must abort before any git init ────
# `cd ""` returns 0 in Bash, so a bare `cd "$TMP" || exit 1` would silently
# fall through into the real clone if mktemp ever handed back an empty
# string. The harness itself now guards with ${TMP:?}; this proves the
# guard construct fires on empty input.
_regression_empty_tmp_guard() {
  ( TMP=""; cd "${TMP:?}" ) 2>/dev/null
}
expect_rc "empty TMP guard aborts before cd" 1 _regression_empty_tmp_guard

# ── provision listed outputs with a stubbed npm ──────────────────
PROV="$TMP/prov"
TREE="$PROV/tree"
mkdir -p "$PROV/scripts" "$PROV/bin" "$TREE/needs-install" \
  "$TREE/needs-build" "$TREE/already-built/dist" "$TREE/spec-kit-only" \
  "$TREE/spec-kit-and-real/node_modules/@spec-kit/shared"
TREE="$(cd "$TREE" && pwd -P)"
cp "$NAMING" "$PROV/scripts/worktree-naming.sh"
cat > "$PROV/scripts/worktree-provision-paths.txt" <<'EOF'
needs-install
needs-build  dist/index.js
already-built  dist/index.js
spec-kit-only
spec-kit-and-real
bun-pkg  dist/plugin.js
EOF
printf '{"dependencies":{"left-pad":"1.0.0"}}\n' > "$TREE/needs-install/package.json"
printf '{"dependencies":{"@spec-kit/shared":"file:../shared"}}\n' > "$TREE/spec-kit-only/package.json"
printf '{"dependencies":{"@spec-kit/shared":"file:../shared","left-pad":"1.0.0"}}\n' \
  > "$TREE/spec-kit-and-real/package.json"
printf '{}\n' > "$TREE/needs-build/package.json"
printf '{}\n' > "$TREE/already-built/package.json"
: > "$TREE/already-built/dist/index.js"
cat > "$PROV/bin/npm" <<'EOF'
#!/usr/bin/env bash
printf '%s %s\n' "$(basename "$PWD")" "$*" >> "$NPM_LOG"
case "${1:-}" in
  ci|install)
    mkdir -p node_modules/left-pad node_modules/@spec-kit/shared
    ;;
  run)
    [ "${2:-}" = build ] || exit 0
    [ -z "${NPM_STUB_BUILD_FAIL:-}" ] || exit 1
    [ -z "${NPM_STUB_BUILD_NOOP:-}" ] || exit 0
    mkdir -p dist
    : > dist/index.js
    ;;
esac
EOF
chmod +x "$PROV/bin/npm"
NPM_LOG="$PROV/npm.log"
export NPM_LOG
run_fixture_provision() {
  local fixture_tree="$1"
  (
    source "$PROV/scripts/worktree-naming.sh"
    # The suite runs inside its own repository; the ceiling keeps a fixture without
    # a .git of its own from being read as part of it.
    GIT_CEILING_DIRECTORIES="$PROV" PATH="$PROV/bin:$PATH" provision_worktree "$fixture_tree"
  )
}

run_first_fixture_provision() {
  run_fixture_provision "$TREE" || return 1
  [ -e "$TREE/needs-build/dist/index.js" ]
}
expect_rc "first run exits 0 and writes listed output" 0 run_first_fixture_provision
INSTALL_LINES="$(awk '$1 == "needs-install" && $2 == "install" { count++ } END { print count + 0 }' "$NPM_LOG")"
BUILD_LINES="$(awk '$1 == "needs-build" && $2 == "run" && $3 == "build" { count++ } END { print count + 0 }' "$NPM_LOG")"
ALREADY_BUILT_LINES="$(awk '$1 == "already-built" { count++ } END { print count + 0 }' "$NPM_LOG")"
expect_eq "first run installs and builds once" "1 1" "$INSTALL_LINES $BUILD_LINES"
expect_eq "first run builds only the missing output" "1 0" "$BUILD_LINES $ALREADY_BUILT_LINES"

BUILD_LINES_BEFORE="$(awk '$2 == "run" && $3 == "build" { count++ } END { print count + 0 }' "$NPM_LOG")"
run_second_fixture_provision() {
  run_fixture_provision "$TREE" || return 1
  local build_lines_after
  build_lines_after="$(awk '$2 == "run" && $3 == "build" { count++ } END { print count + 0 }' "$NPM_LOG")"
  [ "$build_lines_after" -eq "$BUILD_LINES_BEFORE" ]
}
expect_rc "second run exits 0 and adds no build line" 0 run_second_fixture_provision

# A @spec-kit/* link alone must trigger an install, yet beside a real
# dependency it must not stand in for that dependency.
install_lines_for() {
  awk -v pkg="$1" '$1 == pkg && ($2 == "install" || $2 == "ci") { count++ } END { print count + 0 }' "$NPM_LOG"
}
expect_eq "spec-kit-only installs once across both runs" "1" "$(install_lines_for spec-kit-only)"
expect_eq "spec-kit-and-real installs although its link was present" "1" "$(install_lines_for spec-kit-and-real)"
expect_eq "needs-build declares nothing and is never installed" "0" "$(install_lines_for needs-build)"

NOOP_TREE="$PROV/noop-tree"
mkdir -p "$NOOP_TREE/needs-build"
cp "$TREE/needs-build/package.json" "$NOOP_TREE/needs-build/package.json"
NPM_STUB_BUILD_NOOP=1 expect_rc "zero-exit build without output fails" 1 run_fixture_provision "$NOOP_TREE"

FAILED_TREE="$PROV/failed-tree"
mkdir -p "$FAILED_TREE/needs-build"
cp "$TREE/needs-build/package.json" "$FAILED_TREE/needs-build/package.json"
NPM_STUB_BUILD_FAIL=1 expect_rc "failed build fails provisioning" 1 run_fixture_provision "$FAILED_TREE"

# ── the build stamp decides staleness; untracked newer files do not ──
# Fixed timestamps keep the checks independent of the clock; staleness itself must
# depend on content, not on modification times.
STALE_TREE="$PROV/stale-tree"
rm -rf "$STALE_TREE"
mkdir -p "$STALE_TREE/needs-build/src" "$STALE_TREE/needs-build/dist"
printf '{}\n' > "$STALE_TREE/needs-build/package.json"
printf 'export {};\n' > "$STALE_TREE/needs-build/src/index.ts"
printf 'readme\n' > "$STALE_TREE/needs-build/README.md"
: > "$STALE_TREE/needs-build/dist/index.js"
git -C "$STALE_TREE" init -q
git -C "$STALE_TREE" add needs-build/package.json needs-build/src/index.ts needs-build/README.md
git -C "$STALE_TREE" -c core.hooksPath="$TMP/.nohooks" -c user.email=t@t -c user.name=t \
  commit -q -m init
touch -t 202001010000 "$STALE_TREE/needs-build/package.json" \
  "$STALE_TREE/needs-build/src/index.ts" "$STALE_TREE/needs-build/README.md"
touch -t 202101010000 "$STALE_TREE/needs-build/dist/index.js"
stale_build_lines() {
  awk '$2 == "run" && $3 == "build" { count++ } END { print count + 0 }' "$NPM_LOG"
}
STALE_OUT_FILE="$PROV/stale.out"
run_stale_provision() {
  run_fixture_provision "$STALE_TREE" > "$STALE_OUT_FILE" 2>&1
}
run_stale_noop_provision() {
  ( export NPM_STUB_BUILD_NOOP=1; run_fixture_provision "$STALE_TREE" ) > "$STALE_OUT_FILE" 2>&1
}

# An existing output with no stamp has no record of what produced it, so the
# first provision builds once and records the fingerprint it built from.
STALE_BEFORE="$(stale_build_lines)"
expect_rc "an unrecorded output provisions" 0 run_stale_provision
expect_rc "an unrecorded output says why it rebuilt" 0 \
  grep -q 'rebuilding needs-build (no record of the sources it was built from)' "$STALE_OUT_FILE"
expect_eq "an unrecorded output builds once" "$((STALE_BEFORE + 1))" "$(stale_build_lines)"

expect_rc "a recorded output provisions" 0 run_stale_provision
expect_eq "a recorded output adds no build" "$((STALE_BEFORE + 1))" "$(stale_build_lines)"

# Untracked files a build writes, newer than the stamp, must not mark it stale.
mkdir -p "$STALE_TREE/needs-build/dist/nested"
: > "$STALE_TREE/needs-build/dist/nested/chunk.js"
: > "$STALE_TREE/needs-build/tsconfig.tsbuildinfo"
touch -t 203001010000 "$STALE_TREE/needs-build/dist/nested/chunk.js" \
  "$STALE_TREE/needs-build/tsconfig.tsbuildinfo"
expect_rc "untracked newer files still provision" 0 run_stale_provision
expect_eq "untracked newer files add no build" "$((STALE_BEFORE + 1))" "$(stale_build_lines)"

# A tracked source edited and staged moves the stamped fingerprint, including a
# change the build itself does not read.
printf 'export const x = 1;\n' > "$STALE_TREE/needs-build/src/index.ts"
git -C "$STALE_TREE" add needs-build/src/index.ts
expect_rc "a staged source change provisions" 0 run_stale_provision
expect_rc "a staged source change says why it rebuilt" 0 \
  grep -q 'rebuilding needs-build (sources changed since its last build)' "$STALE_OUT_FILE"
expect_eq "a staged source change rebuilds once" "$((STALE_BEFORE + 2))" "$(stale_build_lines)"
expect_rc "the recorded staged change provisions" 0 run_stale_provision
expect_eq "the recorded staged change adds no build" "$((STALE_BEFORE + 2))" "$(stale_build_lines)"

# An edit nobody staged changes what is on disk, so the work-tree fingerprint
# moves and the rebuild settles it again.
printf 'export const y = 2;\n' > "$STALE_TREE/needs-build/src/index.ts"
expect_rc "an unstaged edit provisions" 0 run_stale_provision
expect_rc "an unstaged edit says why it rebuilt" 0 \
  grep -q 'rebuilding needs-build (sources changed since its last build)' "$STALE_OUT_FILE"
expect_eq "an unstaged edit rebuilds once" "$((STALE_BEFORE + 3))" "$(stale_build_lines)"
expect_rc "the recorded unstaged edit provisions" 0 run_stale_provision
expect_eq "the recorded unstaged edit adds no build" "$((STALE_BEFORE + 3))" "$(stale_build_lines)"

# A deletion nobody staged removes the path from the work-tree description even
# though the index still lists it.
rm "$STALE_TREE/needs-build/README.md"
expect_rc "an unstaged deletion provisions" 0 run_stale_provision
expect_eq "an unstaged deletion rebuilds once" "$((STALE_BEFORE + 4))" "$(stale_build_lines)"
expect_rc "the recorded unstaged deletion provisions" 0 run_stale_provision
expect_eq "the recorded unstaged deletion adds no build" "$((STALE_BEFORE + 4))" "$(stale_build_lines)"

# A future modification time on an unchanged source must not force a rebuild.
touch -t 203001010000 "$STALE_TREE/needs-build/package.json"
expect_rc "a future modification time provisions" 0 run_stale_provision
expect_eq "a future modification time adds no build" "$((STALE_BEFORE + 4))" "$(stale_build_lines)"
expect_rc "a future modification time provisions again" 0 run_stale_provision
expect_eq "a future modification time still adds no build" "$((STALE_BEFORE + 4))" "$(stale_build_lines)"

# A deletion that reaches the index drops the path from the tracked list, so the
# fingerprint still moves even though the work-tree description already said D.
git -C "$STALE_TREE" rm -q --cached needs-build/README.md
expect_rc "a staged deletion provisions" 0 run_stale_provision
expect_rc "a staged deletion says why it rebuilt" 0 \
  grep -q 'rebuilding needs-build (sources changed since its last build)' "$STALE_OUT_FILE"
expect_eq "a staged deletion rebuilds once" "$((STALE_BEFORE + 5))" "$(stale_build_lines)"
expect_rc "the recorded staged deletion provisions" 0 run_stale_provision
expect_eq "the recorded staged deletion adds no build" "$((STALE_BEFORE + 5))" "$(stale_build_lines)"

# A build that emits nothing still consumed the changed sources, so recording the
# fingerprint ends the rebuild loop instead of repeating it on every provision.
printf 'export const y = 1;\n' > "$STALE_TREE/needs-build/src/index.ts"
git -C "$STALE_TREE" add needs-build/src/index.ts
expect_rc "a staged change before a build that writes nothing provisions" 0 run_stale_noop_provision
expect_eq "a build that writes nothing still counts as the rebuild" "$((STALE_BEFORE + 6))" "$(stale_build_lines)"
expect_rc "the recorded no-emission build provisions" 0 run_stale_provision
expect_eq "a build that wrote nothing ends the rebuild loop" "$((STALE_BEFORE + 6))" "$(stale_build_lines)"

# The stamp lives in the git directory, never in the work tree.
expect_eq "the stamp is not inside the work tree" "" \
  "$(git -C "$STALE_TREE" status --porcelain --ignored | grep provision-stamps || true)"

# A source outside the package that the list names counts the same way.
DEP_PROV="$PROV/dep-prov"
DEP_TREE="$DEP_PROV/tree"
rm -rf "$DEP_PROV"
mkdir -p "$DEP_PROV/scripts" "$DEP_TREE/shared-lib" "$DEP_TREE/needs-build/dist"
cp "$NAMING" "$DEP_PROV/scripts/worktree-naming.sh"
printf 'needs-build  dist/index.js  shared-lib\n' > "$DEP_PROV/scripts/worktree-provision-paths.txt"
printf '{}\n' > "$DEP_TREE/needs-build/package.json"
printf 'export {};\n' > "$DEP_TREE/shared-lib/index.ts"
: > "$DEP_TREE/needs-build/dist/index.js"
git -C "$DEP_TREE" init -q
git -C "$DEP_TREE" add needs-build/package.json shared-lib/index.ts
touch -t 202001010000 "$DEP_TREE/needs-build/package.json" "$DEP_TREE/shared-lib/index.ts"
touch -t 202101010000 "$DEP_TREE/needs-build/dist/index.js"
run_dep_provision() {
  (
    source "$DEP_PROV/scripts/worktree-naming.sh"
    GIT_CEILING_DIRECTORIES="$PROV" PATH="$PROV/bin:$PATH" provision_worktree "$DEP_TREE"
  )
}
DEP_BEFORE="$(stale_build_lines)"
expect_rc "an unrecorded extra source provisions" 0 run_dep_provision
expect_eq "an unrecorded extra source builds once" "$((DEP_BEFORE + 1))" "$(stale_build_lines)"
expect_rc "a recorded extra source provisions" 0 run_dep_provision
expect_eq "a recorded extra source adds no build" "$((DEP_BEFORE + 1))" "$(stale_build_lines)"
printf 'export const z = 1;\n' > "$DEP_TREE/shared-lib/index.ts"
git -C "$DEP_TREE" add shared-lib/index.ts
expect_rc "a staged extra source provisions" 0 run_dep_provision
expect_eq "a staged extra source rebuilds once" "$((DEP_BEFORE + 2))" "$(stale_build_lines)"

# A subdirectory argument must provision the worktree that holds it, because the
# list's paths are relative to the worktree root.
DEP_SUBDIR_OUT="$PROV/dep-subdir.out"
rm -f "$DEP_TREE/needs-build/dist/index.js"
run_dep_subdir_provision() {
  (
    source "$DEP_PROV/scripts/worktree-naming.sh"
    GIT_CEILING_DIRECTORIES="$PROV" PATH="$PROV/bin:$PATH" provision_worktree "$DEP_TREE/shared-lib"
  ) > "$DEP_SUBDIR_OUT" 2>&1
}
DEP_SUBDIR_BEFORE="$(stale_build_lines)"
expect_rc "a worktree subdirectory provisions" 0 run_dep_subdir_provision
expect_eq "a worktree subdirectory builds as its root does" "$((DEP_SUBDIR_BEFORE + 1))" "$(stale_build_lines)"
expect_eq "a worktree subdirectory warns about no listed path" "" \
  "$(grep 'listed but has no package.json' "$DEP_SUBDIR_OUT" || true)"

# Outside a git work tree only a missing output builds, as before.
PLAIN_TREE="$PROV/plain-tree"
mkdir -p "$PLAIN_TREE/needs-build/src" "$PLAIN_TREE/needs-build/dist"
printf '{}\n' > "$PLAIN_TREE/needs-build/package.json"
printf 'export {};\n' > "$PLAIN_TREE/needs-build/src/index.ts"
: > "$PLAIN_TREE/needs-build/dist/index.js"
touch -t 202001010000 "$PLAIN_TREE/needs-build/dist/index.js"
touch -t 202201010000 "$PLAIN_TREE/needs-build/src/index.ts"
PLAIN_BEFORE="$(stale_build_lines)"
expect_rc "a tree outside git provisions" 0 run_fixture_provision "$PLAIN_TREE"
expect_eq "a tree outside git never rebuilds an existing output" "$PLAIN_BEFORE" "$(stale_build_lines)"
rm -f "$PLAIN_TREE/needs-build/dist/index.js"
expect_rc "a tree outside git builds a missing output" 0 run_fixture_provision "$PLAIN_TREE"
expect_eq "a tree outside git builds a missing output once" "$((PLAIN_BEFORE + 1))" "$(stale_build_lines)"

# ── a bun package installs and builds with bun, from its own tree ─
# A dependency hoisted into an ancestor node_modules satisfies an npm package,
# but a bun package's lockfile pins its own versions, so it must not stand in.
cat > "$PROV/bin/bun" <<'EOF'
#!/usr/bin/env bash
printf '%s %s\n' "$(basename "$PWD")" "$*" >> "$BUN_LOG"
case "${1:-}" in
  install) mkdir -p node_modules/left-pad ;;
  run) mkdir -p dist; : > dist/plugin.js ;;
esac
EOF
chmod +x "$PROV/bin/bun"
BUN_LOG="$PROV/bun.log"
export BUN_LOG
BUN_TREE="$PROV/bun-tree"
mkdir -p "$BUN_TREE/node_modules/left-pad" "$BUN_TREE/bun-pkg"
BUN_TREE="$(cd "$BUN_TREE" && pwd -P)"
printf '{"dependencies":{"left-pad":"1.0.0"}}\n' > "$BUN_TREE/bun-pkg/package.json"
: > "$BUN_TREE/bun-pkg/bun.lock"
: > "$NPM_LOG"
expect_rc "bun package provisions and writes its output" 0 run_fixture_provision "$BUN_TREE"
expect_rc "bun package output exists" 0 test -e "$BUN_TREE/bun-pkg/dist/plugin.js"
expect_eq "bun package installs from its own tree despite a hoisted dependency" "1" \
  "$(awk '$1 == "bun-pkg" && $2 == "install" && $3 == "--frozen-lockfile" { c++ } END { print c + 0 }' "$BUN_LOG")"
expect_eq "bun package builds with its flag before the script name" "1" \
  "$(awk '$1 == "bun-pkg" && $2 == "run" && $3 == "--silent" && $4 == "build" { c++ } END { print c + 0 }' "$BUN_LOG")"
expect_eq "bun package never reaches npm" "0" \
  "$(awk '$1 == "bun-pkg" { c++ } END { print c + 0 }' "$NPM_LOG")"

# A relative worktree path must bound the walk exactly as an absolute one does.
REL_TREE="$PROV/rel-tree"
mkdir -p "$REL_TREE/node_modules/left-pad" "$REL_TREE/bun-pkg"
cp "$BUN_TREE/bun-pkg/package.json" "$BUN_TREE/bun-pkg/bun.lock" "$REL_TREE/bun-pkg/"
run_relative_provision() {
  (
    cd "$PROV" || exit 1
    source "$PROV/scripts/worktree-naming.sh"
    GIT_CEILING_DIRECTORIES="$PROV" PATH="$PROV/bin:$PATH" provision_worktree rel-tree
  )
}
: > "$BUN_LOG"
expect_rc "bun package provisions from a relative worktree path" 0 run_relative_provision
expect_eq "relative worktree path still installs the bun package" "1" \
  "$(awk '$1 == "bun-pkg" && $2 == "install" { c++ } END { print c + 0 }' "$BUN_LOG")"

# Without bun on PATH a bun package fails loudly instead of falling back to npm.
NOBUN_TREE="$PROV/nobun-tree"
mkdir -p "$NOBUN_TREE/bun-pkg" "$PROV/nobun-bin"
cp "$BUN_TREE/bun-pkg/package.json" "$BUN_TREE/bun-pkg/bun.lock" "$NOBUN_TREE/bun-pkg/"
cp "$PROV/bin/npm" "$PROV/nobun-bin/npm"
NOBUN_PATH="$PROV/nobun-bin:$(dirname "$(command -v node)"):/usr/bin:/bin"
run_nobun_provision() {
  (
    source "$PROV/scripts/worktree-naming.sh"
    GIT_CEILING_DIRECTORIES="$PROV" PATH="$NOBUN_PATH" provision_worktree "$NOBUN_TREE"
  )
}
if PATH="$NOBUN_PATH" command -v bun >/dev/null 2>&1; then
  echo "SKIP: bun is reachable beside node, so the missing-bun case cannot run here"
else
  expect_rc "bun package without bun on PATH fails provisioning" 1 run_nobun_provision
  expect_eq "bun package without bun never falls back to npm" "0" \
    "$(awk '$1 == "bun-pkg" { c++ } END { print c + 0 }' "$NPM_LOG")"
fi

# A binary bun.lockb marks a bun package just as a text bun.lock does.
LOCKB_TREE="$PROV/lockb-tree"
mkdir -p "$LOCKB_TREE/bun-pkg"
cp "$BUN_TREE/bun-pkg/package.json" "$LOCKB_TREE/bun-pkg/"
: > "$LOCKB_TREE/bun-pkg/bun.lockb"
: > "$BUN_LOG"; : > "$NPM_LOG"
expect_rc "bun.lockb package provisions" 0 run_fixture_provision "$LOCKB_TREE"
expect_eq "bun.lockb package installs with bun" "1" \
  "$(awk '$1 == "bun-pkg" && $2 == "install" { c++ } END { print c + 0 }' "$BUN_LOG")"
expect_eq "bun.lockb package never reaches npm" "0" \
  "$(awk '$1 == "bun-pkg" { c++ } END { print c + 0 }' "$NPM_LOG")"

# A lockfile out of step with package.json fails the frozen install, and
# provisioning names the drift instead of printing a bare failure.
DRIFT_TREE="$PROV/drift-tree"
mkdir -p "$DRIFT_TREE/needs-install" "$PROV/drift-bin"
cp "$TREE/needs-install/package.json" "$DRIFT_TREE/needs-install/"
printf '{}\n' > "$DRIFT_TREE/needs-install/package-lock.json"
cat > "$PROV/drift-bin/npm" <<'STUB'
#!/usr/bin/env bash
echo "npm error \`npm ci\` can only install packages when your package.json and package-lock.json are in sync." >&2
exit 1
STUB
chmod +x "$PROV/drift-bin/npm"
run_drift_provision() {
  (
    source "$PROV/scripts/worktree-naming.sh"
    GIT_CEILING_DIRECTORIES="$PROV" PATH="$PROV/drift-bin:$PATH" provision_worktree "$DRIFT_TREE"
  ) 2> "$PROV/drift.err"
}
expect_rc "lockfile drift fails provisioning" 1 run_drift_provision
expect_rc "lockfile drift shows the installer's error" 0 grep -q "are in sync" "$PROV/drift.err"
expect_rc "lockfile drift names the repair" 0 \
  grep -q "lockfile drift: .*run npm install in needs-install" "$PROV/drift.err"

# A listed path whose package.json is gone is a stale entry, so provisioning names it.
MISSING_TREE="$PROV/missing-tree"
mkdir -p "$MISSING_TREE/needs-install"
run_missing_provision() {
  (
    source "$PROV/scripts/worktree-naming.sh"
    GIT_CEILING_DIRECTORIES="$PROV" PATH="$PROV/bin:$PATH" provision_worktree "$MISSING_TREE"
  ) 2> "$PROV/missing.err"
}
expect_rc "a listed path without package.json does not fail provisioning" 0 run_missing_provision
expect_rc "a listed path without package.json is warned about" 0 \
  grep -q "needs-install is listed but has no package.json" "$PROV/missing.err"

# CI sources the script under set -euo pipefail, so a failed install whose log
# holds no error line must still reach the summary instead of ending the shell.
QUIET_FAIL_TREE="$PROV/quiet-fail-tree"
mkdir -p "$QUIET_FAIL_TREE/needs-install" "$PROV/quiet-fail-bin"
cp "$TREE/needs-install/package.json" "$QUIET_FAIL_TREE/needs-install/"
printf '#!/usr/bin/env bash\nexit 1\n' > "$PROV/quiet-fail-bin/npm"
chmod +x "$PROV/quiet-fail-bin/npm"
run_strict_quiet_fail_provision() {
  bash -c 'set -euo pipefail; source "$1/scripts/worktree-naming.sh"
    GIT_CEILING_DIRECTORIES="$1" PATH="$1/quiet-fail-bin:$PATH" provision_worktree "$2"' \
    _ "$PROV" "$QUIET_FAIL_TREE" > "$PROV/quiet-fail.out" 2>&1
}
expect_rc "a silent install failure under set -e still fails the run" 1 run_strict_quiet_fail_provision
expect_rc "a silent install failure under set -e reaches the summary" 0 \
  grep -q "provisioned: 0 installed, 0 built, 0 already present, 1 failed" "$PROV/quiet-fail.out"

# ── no-argument provision uses the linked worktree ───────────────
LINKED="$PROV/linked"
if git -C "$TMP" worktree add --detach "$LINKED" HEAD >/dev/null 2>&1; then
  mkdir -p "$TMP/needs-build" "$LINKED/needs-build"
  printf '{}\n' > "$TMP/needs-build/package.json"
  printf '{}\n' > "$LINKED/needs-build/package.json"
  run_linked_fixture_provision() {
    (
      cd "$LINKED" || exit 1
      source "$PROV/scripts/worktree-naming.sh"
      PATH="$PROV/bin:$PATH" provision_worktree
    )
  }
  expect_rc "provision without dir exits 0 from linked worktree" 0 run_linked_fixture_provision
  expect_rc "linked worktree receives listed output" 0 test -e "$LINKED/needs-build/dist/index.js"
  expect_rc "primary checkout receives no listed output" 1 test -e "$TMP/needs-build/dist"
  git -C "$TMP" worktree remove --force "$LINKED" >/dev/null 2>&1
else
  FAIL=$((FAIL + 1))
  echo "FAIL: linked worktree fixture creation"
fi

# ── every buildable listed package names its build output ────────
# A listed package whose `main` is an untracked build product, listed without
# its output, is installed but never built, so a fresh worktree lacks code that
# scripts import, and provisioning still reports success.
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd -P)"
unnamed_build_outputs() { # unnamed_build_outputs <list> -- print each listed package missing its output
  local list="$1" pkg artifact _ main
  while read -r pkg artifact _; do
    case "$pkg" in ''|\#*) continue ;; esac
    [ -n "$artifact" ] && continue
    [ -f "$REPO_ROOT/$pkg/package.json" ] || continue
    main="$(node -e '
      const path = require("path");
      const manifest = require(path.resolve(process.argv[1], "package.json"));
      if (manifest.scripts && manifest.scripts.build && manifest.main) process.stdout.write(path.normalize(manifest.main));
    ' "$REPO_ROOT/$pkg" 2>/dev/null)"
    [ -n "$main" ] || continue
    git -C "$REPO_ROOT" ls-files --error-unmatch "$pkg/$main" >/dev/null 2>&1 && continue
    echo "$pkg"
  done < "$list"
}
expect_eq "every buildable listed package names its build output" "" \
  "$(unnamed_build_outputs "$SCRIPT_DIR/worktree-provision-paths.txt")"
UNNAMED_LIST="$TMP/unnamed-output-paths.txt"
printf '.skilled/skills/system-spec-kit/runtime\n' > "$UNNAMED_LIST"
expect_eq "a buildable package listed without its output is reported" \
  ".skilled/skills/system-spec-kit/runtime" "$(unnamed_build_outputs "$UNNAMED_LIST")"

# ── every tracked package tree is listed or excluded ─────────────
# A tracked package.json under .skilled, .opencode or .pi that the list neither
# names nor excludes is a tree a fresh worktree never installs, and a listed or
# excluded path with no package.json is a stale entry.
provision_list_gaps() { # provision_list_gaps <list> -- print stale entries, then unlisted trees
  local list="$1" known pkg
  known="$(awk '$1 !~ /^#/ && NF { print $1 }' "$list"; sed -n 's/^# excluded: *\([^ ]*\).*/\1/p' "$list")"
  while read -r pkg; do
    [ -n "$pkg" ] || continue
    [ -f "$REPO_ROOT/$pkg/package.json" ] || echo "stale: $pkg"
  done <<< "$known"
  git -C "$REPO_ROOT" ls-files -- .skilled .opencode .pi | grep -E '(^|/)package\.json$' |
    sed 's#/package\.json$##' | while read -r pkg; do
      printf '%s\n' "$known" | grep -Fxq -- "$pkg" || echo "unlisted: $pkg"
    done
}
expect_eq "every tracked package tree is listed or excluded" "" \
  "$(provision_list_gaps "$SCRIPT_DIR/worktree-provision-paths.txt")"
GAP_LIST="$TMP/gap-paths.txt"
awk '$1 != ".pi/extensions/pi-cache-optimizer"' "$SCRIPT_DIR/worktree-provision-paths.txt" > "$GAP_LIST"
printf 'no/such/pkg\n' >> "$GAP_LIST"
expect_eq "an unlisted tree and a stale entry are both reported" \
  "stale: no/such/pkg
unlisted: .pi/extensions/pi-cache-optimizer" "$(provision_list_gaps "$GAP_LIST")"

# ── create reports a failed provision as a non-zero exit ────────
# A worktree whose dependency install failed is not ready to use. The creator
# must return non-zero but still name the branch and directory it created.
FAILED_CREATE="$(mktemp -d)"
mkdir -p "$FAILED_CREATE/repo/scripts" "$FAILED_CREATE/repo/stub" "$FAILED_CREATE/repo/pkg"
cp "$NAMING" "$FAILED_CREATE/repo/scripts/worktree-naming.sh"
printf 'pkg dist/out.js\n' > "$FAILED_CREATE/repo/scripts/worktree-provision-paths.txt"
printf '{"name":"pkg","version":"1.0.0","dependencies":{"left-pad":"1.3.0"}}\n' \
  > "$FAILED_CREATE/repo/pkg/package.json"
cat > "$FAILED_CREATE/repo/stub/npm" <<'EOF'
#!/usr/bin/env bash
echo "npm stub: refusing install" >&2
exit 1
EOF
chmod +x "$FAILED_CREATE/repo/stub/npm"
(
  cd "$FAILED_CREATE/repo" || exit 1
  export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false
  git init -q -b main
  git config user.email t@t
  git config user.name t
  git add scripts pkg
  git commit -q -m init
  PATH="$FAILED_CREATE/repo/stub:$PATH" bash -c 'source scripts/worktree-naming.sh; create_named_worktree demo main'
) > "$FAILED_CREATE/stdout" 2> "$FAILED_CREATE/stderr"
FAILED_CREATE_RC=$?
FAILED_CREATE_DIR="$(cd "$FAILED_CREATE/repo" && pwd -P)/.worktrees/001-demo"
expect_eq "failed provision create rc" 3 "$FAILED_CREATE_RC"
expect_eq "failed provision create stdout" "worktrees/001-demo $FAILED_CREATE_DIR" \
  "$(cat "$FAILED_CREATE/stdout")"
expect_rc "failed provision create stderr" 0 grep -q "provisioning failed" "$FAILED_CREATE/stderr"
rm -rf "$FAILED_CREATE"

# ── report ─────────────────────────────────────────────────────
echo "worktree-naming tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
