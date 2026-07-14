#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Naming Allocator + Validator
# ───────────────────────────────────────────────────────────────
# Owner-first branch/worktree naming: every managed branch starts with the
# owning skill (or "skilled" for cross-cutting work), so a Git-UI branch tree is
# legible at a glance instead of a flat pile. One clone-wide numbered counter
# keeps names globally unique.
#
#   OWNER        := <skill-id> | "skilled"
#   TASK_BRANCH  := OWNER "/" NNNN "-" SLUG        (NNNN 4-digit; SLUG lowercase kebab)
#   TASK_DIR     := ".worktrees/" NNNN "-" OWNER "-" SLUG
#   RELEASE      := "skilled/v" A "." B "." C "." D
#   RESERVED     := "main"
#   WRAPPER      := "work/" RUNTIME "/" SLUG        (launch-wrapper lane; exempt)
#
# The counter cannot be enforced per-owner (Git has no cross-prefix uniqueness),
# so allocation holds a lock in the shared common Git dir and seeds its max from
# the stored high-water mark, every registered worktree basename, and all
# local + remote refs — a partial scan can never reissue a live number.
#
# Sourceable: validators (is_valid_owner/slug/branch/pair) are used by the
# pre-push hook. Strict mode is scoped to direct execution so sourcing a caller's
# shell does not inherit `set -e`.

if [[ "${BASH_SOURCE[0]}" = "${0}" ]]; then
  set -euo pipefail
fi

# ───────────────────────────────────────────────────────────────
# 1. REPO RESOLUTION
# ───────────────────────────────────────────────────────────────

_wn_common_dir() { git rev-parse --git-common-dir 2>/dev/null; }

# The common dir's parent is the main worktree toplevel (works from any linked
# worktree, so the counter is shared clone-wide rather than per-worktree).
_wn_toplevel() {
  local common
  common="$(_wn_common_dir)" || return 1
  [ -n "$common" ] || return 1
  ( cd "$(dirname "$common")" && pwd -P )
}

_wn_highwater_file() { echo "$(_wn_common_dir)/worktree-number.highwater"; }
_wn_lock_dir()       { echo "$(_wn_common_dir)/worktree-number.lock"; }

# ───────────────────────────────────────────────────────────────
# 2. SKILL-ID DISCOVERY
# ───────────────────────────────────────────────────────────────

# Canonical first-party owners = the frontmatter `name:` of every version
# controlled SKILL.md. One per line, sorted-unique.
load_skill_ids() {
  local root skills_dir tracked rel f name
  root="$(_wn_toplevel)" || return 0
  skills_dir="$root/.opencode/skills"
  [ -d "$skills_dir" ] || return 0
  if ! tracked="$(git -C "$root" ls-files -- \
    '.opencode/skills/*/SKILL.md' '.opencode/skills/**/SKILL.md' 2>/dev/null)"; then
    return 2
  fi
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    f="$root/$rel"
    [ -f "$f" ] || continue
    name="$(grep -m1 -E '^name:[[:space:]]*' "$f" 2>/dev/null \
      | sed -E 's/^name:[[:space:]]*//; s/^["'\'']//; s/["'\'']$//; s/[[:space:]]*$//')"
    [ -n "$name" ] && echo "$name"
  done <<< "$tracked" | sort -u
}

# ───────────────────────────────────────────────────────────────
# 3. VALIDATORS
# ───────────────────────────────────────────────────────────────

is_valid_slug() {
  local s="$1"
  case "$s" in
    ""|*[!a-z0-9-]*) return 1 ;;   # only lowercase letters, digits, hyphen
    -*|*-|*--*)      return 1 ;;   # no leading/trailing/double hyphen
  esac
  return 0
}

is_valid_nnnn() {
  local n="${1:-}" value
  case "$n" in [0-9][0-9][0-9][0-9]) ;; *) return 1 ;; esac
  value=$((10#$n))
  [[ "$value" -ge 1 && "$value" -le 9999 ]]
}

is_valid_owner() {
  local owner="$1" ids owner_rc id
  [ "$owner" = "skilled" ] && return 0
  case "$owner" in ""|*[!a-z0-9-]*|-*|*-) return 1 ;; esac
  if ids="$(load_skill_ids)"; then
    :
  else
    owner_rc=$?
    [ "$owner_rc" -eq 2 ] && return 2
    return 1
  fi
  while IFS= read -r id; do
    [ "$id" = "$owner" ] && return 0
  done <<< "$ids"
  return 1
}

# Legal, in-grammar branch: reserved, release, or an owner-first task branch.
is_valid_branch() {
  local b="$1"
  [ "$b" = "main" ] && return 0
  if [[ "$b" =~ ^skilled/v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then return 0; fi
  if [[ "$b" =~ ^([a-z0-9][a-z0-9-]*)/([0-9][0-9][0-9][0-9])-([a-z0-9-]+)$ ]]; then
    if is_valid_owner "${BASH_REMATCH[1]}"; then
      :
    else
      local owner_rc=$?
      [ "$owner_rc" -eq 2 ] && return 2
      return 1
    fi
    is_valid_nnnn "${BASH_REMATCH[2]}" || return 1
    is_valid_slug  "${BASH_REMATCH[3]}" || return 1
    return 0
  fi
  return 1
}

# The launch-wrapper lane is a separate, machine-owned namespace — legal but not
# a task branch, so callers can tell "exempt wrapper" apart from "malformed".
is_wrapper_branch() {
  [[ "$1" =~ ^work/[a-z0-9][a-z0-9-]*/.+$ ]]
}

# Branch OWNER/NNNN-SLUG must pair with directory NNNN-OWNER-SLUG.
is_valid_pair() {
  local branch="$1" dir="$2" base parent branch_rc
  if is_valid_branch "$branch"; then
    :
  else
    branch_rc=$?
    [ "$branch_rc" -eq 2 ] && return 2
    return 1
  fi
  [[ "$branch" =~ ^([a-z0-9][a-z0-9-]*)/([0-9][0-9][0-9][0-9])-([a-z0-9-]+)$ ]] || return 1
  [[ "$dir" == .worktrees/* ]] || return 1
  base="${dir##*/}"
  parent="${dir%/*}"
  [ "$parent" = ".worktrees" ] || return 1
  [ "$base" = "${BASH_REMATCH[2]}-${BASH_REMATCH[1]}-${BASH_REMATCH[3]}" ]
}

# ───────────────────────────────────────────────────────────────
# 4. NUMBER SCANNING + ALLOCATION
# ───────────────────────────────────────────────────────────────

# Leading 4-digit number of a basename/last-segment, else nothing.
_wn_leading_nnnn() {
  case "$1" in
    [0-9][0-9][0-9][0-9]-*|[0-9][0-9][0-9][0-9]) echo "${1:0:4}" ;;
  esac
}

# Highest number in use across ALL sources (base-10; leading zeros are not octal).
scan_max_number() {
  local max=0 n hw line p bn ref last
  hw="$(_wn_highwater_file)"
  if [ -f "$hw" ]; then
    n="$(tr -dc '0-9' < "$hw" 2>/dev/null)"
    [ -n "$n" ] && [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
  fi
  while IFS= read -r line; do
    case "$line" in "worktree "*) ;; *) continue ;; esac
    p="${line#worktree }"; bn="$(basename "$p")"
    n="$(_wn_leading_nnnn "$bn")"
    [ -n "$n" ] && [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
  done < <(git worktree list --porcelain 2>/dev/null | grep '^worktree ')
  while IFS= read -r ref; do
    last="${ref##*/}"; n="$(_wn_leading_nnnn "$last")"
    [ -n "$n" ] && [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
  done < <(git for-each-ref --format='%(refname)' refs/heads refs/remotes 2>/dev/null)
  echo "$max"
}

# Non-binding preview of the next number (no lock, no write).
next_number() { printf '%04d\n' "$(( $(scan_max_number) + 1 ))"; }

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
  local next="$1" hw tmp expected actual
  hw="$(_wn_highwater_file)"
  [ -d "$hw" ] && return 1
  tmp="$(mktemp "${hw}.tmp.XXXXXX" 2>/dev/null)" || return 1
  expected="$(printf '%04d' "$next")"
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

# Atomically reserve the next number and persist the high-water mark.
allocate_number() {
  local max next retries=0
  while :; do
    _wn_acquire_lock || return 1
    if ! _wn_lock_owned; then
      _wn_release_lock
      retries=$((retries + 1))
      [ "$retries" -gt 300 ] && return 1
      sleep 0.01
      continue
    fi
    if ! max="$(scan_max_number)"; then
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
    if [ "$next" -gt 9999 ]; then
      _wn_release_lock
      return 1
    fi
    if ! _wn_persist_highwater "$next"; then
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
    printf '%04d\n' "$next"
    return 0
  done
}

# ───────────────────────────────────────────────────────────────
# 5. WORKTREE CREATION
# ───────────────────────────────────────────────────────────────

_wn_default_base() {
  echo "${SPECKIT_LIVE_BRANCH:-$(git symbolic-ref --quiet --short HEAD 2>/dev/null || echo HEAD)}"
}

# create_named_worktree <owner> <slug> [base]
# Emits "<branch> <dir>" on success.
create_named_worktree() {
  local owner="$1" slug="$2" base="${3:-}" top nnnn branch dir
  is_valid_owner "$owner" || { echo "invalid owner: $owner" >&2; return 1; }
  is_valid_slug  "$slug"  || { echo "invalid slug: $slug"   >&2; return 1; }
  top="$(_wn_toplevel)"   || { echo "not in a git repo" >&2; return 1; }
  [ -n "$base" ] || base="$(_wn_default_base)"
  nnnn="$(allocate_number)" || return 1
  branch="$owner/$nnnn-$slug"
  dir=".worktrees/$nnnn-$owner-$slug"
  git -C "$top" worktree add -b "$branch" "$top/$dir" "$base" >&2 || return 1
  echo "$branch $dir"
}

# create_detached_worktree <slug> [base]  — numbered dir, no branch.
create_detached_worktree() {
  local slug="$1" base="${2:-}" top nnnn dir
  is_valid_slug "$slug" || { echo "invalid slug: $slug" >&2; return 1; }
  top="$(_wn_toplevel)" || { echo "not in a git repo" >&2; return 1; }
  [ -n "$base" ] || base="$(_wn_default_base)"
  nnnn="$(allocate_number)" || return 1
  dir=".worktrees/$nnnn-detached-$slug"
  git -C "$top" worktree add --detach "$top/$dir" "$base" >&2 || return 1
  echo "$dir"
}

# ───────────────────────────────────────────────────────────────
# 6. CLI DISPATCH
# ───────────────────────────────────────────────────────────────

_wn_usage() {
  cat >&2 <<'USAGE'
worktree-naming.sh <command> [args]

  skill-ids                       List canonical owner ids.
  next                            Preview the next number (no lock/write).
  allocate                        Reserve the next number (locked; writes high-water).
  scan-max                        Highest number currently in use.
  validate-owner  <owner>
  validate-slug   <slug>
  validate-branch <branch>
  validate-pair   <branch> <dir>
  create          <owner> <slug> [base]     Create an owner-first worktree.
  create-detached <slug> [base]             Create a numbered detached worktree.
USAGE
}

_wn_main() {
  local cmd="${1:-}" rc; shift || true
  case "$cmd" in
    skill-ids)       load_skill_ids ;;
    next)            next_number ;;
    allocate)        allocate_number ;;
    scan-max)        scan_max_number ;;
    validate-owner)
      if is_valid_owner "${1:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    validate-slug)
      if is_valid_slug "${1:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    validate-branch)
      if is_valid_branch "${1:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    validate-pair)
      if is_valid_pair "${1:-}" "${2:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    create)          create_named_worktree "$@" ;;
    create-detached) create_detached_worktree "$@" ;;
    ""|-h|--help|help) _wn_usage ;;
    *) echo "unknown command: $cmd" >&2; _wn_usage; exit 2 ;;
  esac
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  _wn_main "$@"
fi
