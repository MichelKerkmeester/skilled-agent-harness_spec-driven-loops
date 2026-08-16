#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree/Branch Naming Allocator + Validator
# ───────────────────────────────────────────────────────────────
# Two flat, spec-style numbered namespaces keep a Git-UI branch tree legible as
# a few clean folders instead of a per-skill pile. A worktree-backed branch
# lives under worktrees/, a dedicated worktree-less branch under branches/,
# both numbered 001, 002, 003 … strictly sequentially with no skipped or
# reused number. skilled/ (releases) and backup/ (safety refs) stay.
#
#   WORKTREE_BRANCH := "worktrees/" NNN "-" SLUG    (NNN 3-digit 001..999)
#   WORKTREE_DIR    := ".worktrees/" NNN "-" SLUG    (dir mirrors the branch tail)
#   DEDICATED_BRANCH:= "branches/" NNN "-" SLUG      (a branch with NO worktree)
#   RELEASE         := "skilled/v" A "." B "." C "." D
#   BACKUP          := "backup/" ANYTHING            (safety refs; legal, not numbered)
#   RESERVED        := "main"
#   WRAPPER         := "work/" RUNTIME "/" SLUG      (launch-wrapper lane; exempt)
#   SLUG            := lowercase [a-z0-9-], no leading/trailing/double hyphen
#
# worktrees/ and branches/ each own an INDEPENDENT 001-based sequence (like two
# spec tracks), so a worktrees/003 and a branches/003 may coexist. Git cannot
# enforce sequential numbering itself, so allocation holds a lock in the shared
# common Git dir and seeds its max from the namespace's stored high-water mark,
# every matching local + remote ref, and (for worktrees/) every registered
# .worktrees/NNN-* basename — a partial scan can never reissue a live number.
# Gaps are never back-filled: next = max-in-use + 1, even after a delete.
#
# Sourceable: validators (is_valid_slug/nnn/branch/wrapper/backup/pair) are
# used by the pre-push hook. Strict mode is scoped to direct execution so
# sourcing a caller's shell does not inherit `set -e`.

if [[ "${BASH_SOURCE[0]}" = "${0}" ]]; then
  set -euo pipefail
fi

# ───────────────────────────────────────────────────────────────
# 1. REPO RESOLUTION
# ───────────────────────────────────────────────────────────────

_wn_common_dir() { git rev-parse --git-common-dir 2>/dev/null; }

# The common dir's parent is the main worktree toplevel (works from any linked
# worktree, so the counters are shared clone-wide rather than per-worktree).
_wn_toplevel() {
  local common
  common="$(_wn_common_dir)" || return 1
  [ -n "$common" ] || return 1
  ( cd "$(dirname "$common")" && pwd -P )
}

# Per-namespace high-water files keep the two counters independent.
_wn_highwater_file() { echo "$(_wn_common_dir)/$1-number.highwater"; }
_wn_lock_dir()       { echo "$(_wn_common_dir)/worktree-number.lock"; }

_wn_valid_namespace() { [ "$1" = "worktrees" ] || [ "$1" = "branches" ]; }

# ───────────────────────────────────────────────────────────────
# 2. VALIDATORS
# ───────────────────────────────────────────────────────────────

is_valid_slug() {
  local s="$1"
  case "$s" in
    ""|*[!a-z0-9-]*) return 1 ;;   # only lowercase letters, digits, hyphen
    -*|*-|*--*)      return 1 ;;   # no leading/trailing/double hyphen
  esac
  return 0
}

# Exactly 3 digits, value 001..999, interpreted base-10 (leading zeros are not
# octal — 007 is the number 7, not octal 7 == 7, but 099 must not trip octal).
is_valid_nnn() {
  local n="${1:-}" value
  case "$n" in [0-9][0-9][0-9]) ;; *) return 1 ;; esac
  value=$((10#$n))
  [[ "$value" -ge 1 && "$value" -le 999 ]]
}

# Legal, in-grammar branch: reserved, release, a numbered worktrees/ or
# branches/ task branch, or one of the two legal-but-not-task lanes (wrapper
# and backup). Owner-first and malformed names are rejected.
is_valid_branch() {
  local b="$1"
  [ "$b" = "main" ] && return 0
  if [[ "$b" =~ ^skilled/v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then return 0; fi
  is_wrapper_branch "$b" && return 0
  is_backup_branch  "$b" && return 0
  if [[ "$b" =~ ^(worktrees|branches)/([0-9][0-9][0-9])-([a-z0-9-]+)$ ]]; then
    is_valid_nnn "${BASH_REMATCH[2]}" || return 1
    is_valid_slug "${BASH_REMATCH[3]}" || return 1
    return 0
  fi
  return 1
}

# The launch-wrapper lane is a separate, machine-owned namespace — legal but not
# a task branch, so callers can tell "exempt wrapper" apart from "malformed".
is_wrapper_branch() {
  [[ "$1" =~ ^work/[a-z0-9][a-z0-9-]*/.+$ ]]
}

# Safety-ref lane: legal but not a numbered task branch, exempt from the
# new-branch naming gate exactly like the wrapper lane. Anything non-empty
# after the backup/ prefix is accepted — these refs are operator safety copies.
is_backup_branch() {
  [[ "$1" =~ ^backup/.+$ ]]
}

# Branches exempt from the pre-push remote-push-permission gate (see
# is_remote_push_allowlisted below). `main`/`skilled/v*` are hardcoded so a
# missing or emptied allowlist file can only narrow exemptions back to these
# two, never widen toward "everything" — the file is purely additive.
_wn_remote_allowlist_file() {
  local top
  top="$(_wn_toplevel)" || return 1
  echo "$top/.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt"
}

# True when a branch may reach origin without an explicit ask-first
# confirmation for THIS push (see .opencode/scripts/git-hooks/pre-push).
is_remote_push_allowlisted() {
  local branch="$1" file line trimmed
  case "$branch" in
    main|skilled/v*) return 0 ;;
  esac
  file="$(_wn_remote_allowlist_file)" || return 1
  [ -f "$file" ] || return 1
  while IFS= read -r line || [ -n "$line" ]; do
    trimmed="${line%%#*}"
    trimmed="${trimmed#"${trimmed%%[![:space:]]*}"}"
    trimmed="${trimmed%"${trimmed##*[![:space:]]}"}"
    [ -n "$trimmed" ] || continue
    case "$branch" in
      $trimmed) return 0 ;;
    esac
  done < "$file"
  return 1
}

# A worktrees/NNN-slug branch must pair with directory .worktrees/NNN-slug.
# branches/NNN-slug dedicated branches have no worktree and therefore no pair.
is_valid_pair() {
  local branch="$1" dir="$2" base parent
  [[ "$branch" =~ ^worktrees/([0-9][0-9][0-9])-([a-z0-9-]+)$ ]] || return 1
  is_valid_nnn  "${BASH_REMATCH[1]}" || return 1
  is_valid_slug "${BASH_REMATCH[2]}" || return 1
  [[ "$dir" == .worktrees/* ]] || return 1
  base="${dir##*/}"
  parent="${dir%/*}"
  [ "$parent" = ".worktrees" ] || return 1
  [ "$base" = "${BASH_REMATCH[1]}-${BASH_REMATCH[2]}" ]
}

# ───────────────────────────────────────────────────────────────
# 3. NUMBER SCANNING + ALLOCATION
# ───────────────────────────────────────────────────────────────

# Leading 3-digit number of a basename/last-segment, else nothing.
_wn_leading_nnn() {
  case "$1" in
    [0-9][0-9][0-9]-*|[0-9][0-9][0-9]) echo "${1:0:3}" ;;
  esac
}

# Highest number in use in ONE namespace across all sources (base-10; leading
# zeros are not octal). Scope = the namespace's stored high-water mark + every
# refs/heads/<ns>/NNN-* and refs/remotes/*/<ns>/NNN-* ref + (worktrees/ only)
# every registered .worktrees/NNN-* basename.
scan_max_number() {
  local ns="${1:-worktrees}" max=0 n hw line p bn ref
  _wn_valid_namespace "$ns" || { echo "scan_max_number: invalid namespace: $ns" >&2; return 1; }
  hw="$(_wn_highwater_file "$ns")"
  if [ -f "$hw" ]; then
    n="$(tr -dc '0-9' < "$hw" 2>/dev/null)"
    [ -n "$n" ] && [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
  fi
  if [ "$ns" = "worktrees" ]; then
    while IFS= read -r line; do
      case "$line" in "worktree "*) ;; *) continue ;; esac
      p="${line#worktree }"; bn="$(basename "$p")"
      n="$(_wn_leading_nnn "$bn")"
      [ -n "$n" ] && [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
    done < <(git worktree list --porcelain 2>/dev/null | grep '^worktree ')
  fi
  while IFS= read -r ref; do
    case "$ref" in
      "refs/heads/$ns/"*|"refs/remotes/"*"/$ns/"*) ;;
      *) continue ;;
    esac
    last="${ref##*/}"; n="$(_wn_leading_nnn "$last")"
    [ -n "$n" ] && [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
  done < <(git for-each-ref --format='%(refname)' refs/heads refs/remotes 2>/dev/null)
  echo "$max"
}

# Non-binding preview of the next number (no lock, no write). Mirrors the
# allocator's own >999 refusal so a preview never promises a number the
# locked path would then reject: at exhaustion this prints nothing and
# returns non-zero instead of previewing an unallocatable value.
next_number() {
  local ns="${1:-worktrees}" max
  max="$(scan_max_number "$ns")" || return 1
  [ "$max" -ge 999 ] && return 1
  printf '%03d\n' "$((max + 1))"
}

_wn_acquire_lock() {
  local ld pidf waited owner steal st stamp
  ld="$(_wn_lock_dir)"; pidf="$ld/pid"; waited=0
  while :; do
    if mkdir "$ld" 2>/dev/null; then
      stamp="$ld/pid.$$.$RANDOM"
      if printf '%s\n' "$$" > "$stamp" 2>/dev/null \
        && mv -f "$stamp" "$pidf" 2>/dev/null \
        && [ "$(cat "$pidf" 2>/dev/null)" = "$$" ]; then
        return 0
      fi
      rm -f "$stamp" "$pidf" 2>/dev/null || true
      rmdir "$ld" 2>/dev/null || true
    fi
    # A stale lock (its recorded holder is dead) is reclaimed by an atomic
    # rename: only one contender can win moving the lock directory aside, so
    # the reclaim is serialized. The winner confirms the moved lock is still
    # dead, discards it, and re-races a fresh mkdir; losers simply retry. A
    # stolen lock that turns out live is restored in place — never a bare
    # re-insert that could clobber a lock another contender legitimately
    # acquired in the meantime.
    owner="$(cat "$pidf" 2>/dev/null || true)"
    if [ -n "$owner" ] && ! kill -0 "$owner" 2>/dev/null; then
      steal="$ld.stale.$$.$RANDOM"
      if mv "$ld" "$steal" 2>/dev/null; then
        st="$(cat "$steal/pid" 2>/dev/null || true)"
        if [ -z "$st" ] || ! kill -0 "$st" 2>/dev/null; then
          rm -rf "$steal" 2>/dev/null || true
        elif [ ! -e "$ld" ] && mv "$steal" "$ld" 2>/dev/null; then
          :
        else
          rm -rf "$steal" 2>/dev/null || true
        fi
      fi
      continue
    fi
    waited=$((waited + 1))
    [ "$waited" -gt 300 ] && { echo "worktree-naming: lock acquisition timed out" >&2; return 1; }
    sleep 0.1
  done
}
_wn_lock_owned() {
  local ld owner
  ld="$(_wn_lock_dir)"
  owner="$(cat "$ld/pid" 2>/dev/null || true)"
  [ "$owner" = "$$" ]
}
_wn_release_lock() {
  local ld owner release
  ld="$(_wn_lock_dir)"
  owner="$(cat "$ld/pid" 2>/dev/null || true)"
  [ "$owner" = "$$" ] || return 0
  release="$ld.release.$$.$RANDOM"
  if mv "$ld" "$release" 2>/dev/null; then
    # Releasing only a matching token prevents a displaced holder from deleting a newer lock.
    rm -rf "$release" 2>/dev/null || true
  fi
}

_wn_persist_highwater() {
  local ns="$1" next="$2" hw tmp expected actual
  hw="$(_wn_highwater_file "$ns")"
  [ -d "$hw" ] && return 1
  tmp="$(mktemp "${hw}.tmp.XXXXXX" 2>/dev/null)" || return 1
  expected="$(printf '%03d' "$next")"
  if ! printf '%s\n' "$expected" > "$tmp"; then
    rm -f "$tmp" 2>/dev/null || true
    return 1
  fi
  if ! mv -f "$tmp" "$hw" 2>/dev/null; then
    rm -f "$tmp" 2>/dev/null || true
    return 1
  fi
  [ -f "$hw" ] || return 1
  actual="$(cat "$hw" 2>/dev/null)" || return 1
  [ "$actual" = "$expected" ]
}

# Atomically reserve the next number in ONE namespace and persist that
# namespace's high-water mark.
allocate_number() {
  local ns="${1:-worktrees}" max next retries=0
  _wn_valid_namespace "$ns" || { echo "allocate_number: invalid namespace: $ns" >&2; return 1; }
  while :; do
    _wn_acquire_lock || return 1
    if ! _wn_lock_owned; then
      _wn_release_lock
      retries=$((retries + 1))
      [ "$retries" -gt 300 ] && return 1
      sleep 0.01
      continue
    fi
    if ! max="$(scan_max_number "$ns")"; then
      _wn_release_lock
      return 1
    fi
    if ! _wn_lock_owned; then
      _wn_release_lock
      retries=$((retries + 1))
      [ "$retries" -gt 300 ] && return 1
      sleep 0.01
      continue
    fi
    next=$((max + 1))
    if [ "$next" -gt 999 ]; then
      _wn_release_lock
      return 1
    fi
    if ! _wn_persist_highwater "$ns" "$next"; then
      _wn_release_lock
      return 1
    fi
    if ! _wn_lock_owned; then
      _wn_release_lock
      retries=$((retries + 1))
      [ "$retries" -gt 300 ] && return 1
      sleep 0.01
      continue
    fi
    _wn_release_lock
    printf '%03d\n' "$next"
    return 0
  done
}

# ───────────────────────────────────────────────────────────────
# 4. BRANCH / WORKTREE CREATION
# ───────────────────────────────────────────────────────────────

_wn_default_base() {
  echo "${SPECKIT_LIVE_BRANCH:-$(git symbolic-ref --quiet --short HEAD 2>/dev/null || echo HEAD)}"
}

# create_named_worktree <slug> [base] — allocate a worktrees/ number, then
# create branch worktrees/NNN-slug and directory .worktrees/NNN-slug together.
# Emits "<branch> <dir>" on success.
create_named_worktree() {
  local slug="$1" base="${2:-}" top nnn branch dir
  is_valid_slug "$slug" || { echo "invalid slug: $slug" >&2; return 1; }
  top="$(_wn_toplevel)" || { echo "not in a git repo" >&2; return 1; }
  [ -n "$base" ] || base="$(_wn_default_base)"
  nnn="$(allocate_number worktrees)" || return 1
  branch="worktrees/$nnn-$slug"
  dir=".worktrees/$nnn-$slug"
  git -C "$top" worktree add -b "$branch" "$top/$dir" "$base" >&2 || return 1
  echo "$branch $dir"
}

# create_branch <slug> [base] — allocate a branches/ number and create branch
# branches/NNN-slug WITHOUT a worktree. Emits the branch name on success.
create_branch() {
  local slug="$1" base="${2:-}" top nnn branch
  is_valid_slug "$slug" || { echo "invalid slug: $slug" >&2; return 1; }
  top="$(_wn_toplevel)" || { echo "not in a git repo" >&2; return 1; }
  [ -n "$base" ] || base="$(_wn_default_base)"
  nnn="$(allocate_number branches)" || return 1
  branch="branches/$nnn-$slug"
  git -C "$top" branch "$branch" "$base" >&2 || return 1
  echo "$branch"
}

# create_detached_worktree <slug> [base] — numbered dir, no branch. Uses the
# worktrees/ counter so a detached dir can never collide with a paired one.
create_detached_worktree() {
  local slug="$1" base="${2:-}" top nnn dir
  is_valid_slug "$slug" || { echo "invalid slug: $slug" >&2; return 1; }
  top="$(_wn_toplevel)" || { echo "not in a git repo" >&2; return 1; }
  [ -n "$base" ] || base="$(_wn_default_base)"
  nnn="$(allocate_number worktrees)" || return 1
  dir=".worktrees/$nnn-detached-$slug"
  git -C "$top" worktree add --detach "$top/$dir" "$base" >&2 || return 1
  echo "$dir"
}

# ───────────────────────────────────────────────────────────────
# 5. CLI DISPATCH
# ───────────────────────────────────────────────────────────────

_wn_usage() {
  cat >&2 <<'USAGE'
worktree-naming.sh <command> [args]

  allocate  [worktrees|branches]    Reserve the next number (locked; writes high-water).
  next      [worktrees|branches]    Preview the next number (no lock/write).
  scan-max  [worktrees|branches]    Highest number currently in use in a namespace.
  validate-slug   <slug>
  validate-nnn    <nnn>             Exit 0 for a 3-digit number in 001..999.
  validate-branch <branch>
  validate-pair   <branch> <dir>
  validate-backup <branch>          Exit 0 when the branch is a backup/* safety ref.
  validate-remote-allowlist <branch>  Check the remote-push-permission allowlist.
  create          <slug> [base]     Create a worktrees/NNN-slug worktree (branch + dir).
  create-branch   <slug> [base]     Create a branches/NNN-slug branch (no worktree).
  create-detached <slug> [base]     Create a numbered detached worktree.
USAGE
}

_wn_main() {
  local cmd="${1:-}" rc; shift || true
  case "$cmd" in
    next)            next_number "${1:-worktrees}" ;;
    allocate)        allocate_number "${1:-worktrees}" ;;
    scan-max)        scan_max_number "${1:-worktrees}" ;;
    validate-slug)
      if is_valid_slug "${1:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    validate-nnn)
      if is_valid_nnn "${1:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    validate-branch)
      if is_valid_branch "${1:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    validate-pair)
      if is_valid_pair "${1:-}" "${2:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    validate-backup)
      if is_backup_branch "${1:-}"; then echo ok; else echo not-backup >&2; exit 1; fi
      ;;
    validate-remote-allowlist)
      if is_remote_push_allowlisted "${1:-}"; then echo ok; else echo not-allowlisted >&2; exit 1; fi
      ;;
    create)          create_named_worktree "$@" ;;
    create-branch)   create_branch "$@" ;;
    create-detached) create_detached_worktree "$@" ;;
    ""|-h|--help|help) _wn_usage ;;
    *) echo "unknown command: $cmd" >&2; _wn_usage; exit 2 ;;
  esac
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  _wn_main "$@"
fi
