#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Commit-Id Ordinal Allocator + Validator
# ───────────────────────────────────────────────────────────────
# Every commit carries `Commit-Id: NNNNNNN`, a repository-wide ordinal minted
# in commit order and never reissued. Nothing but the message history records
# the sequence, so the high-water file is a cache: a cold start, or any read
# whose cache went missing, rescans `git log --all` for the highest ordinal.
# Gaps are never back-filled: next = max-in-use + 1, even after a delete.
#
# Allocation holds a lock in the common Git dir so linked worktrees of one
# clone share a single sequence and two concurrent mints cannot collide. The
# lock and counter files are deliberately separate from the worktree
# allocator's: the two sequences advance independently.
#
# Sourceable: the validator and allocator functions are used by the
# prepare-commit-msg hook. Strict mode is scoped to direct execution so
# sourcing a caller's shell does not inherit `set -e`.
#
# Usage: commit-id-naming.sh <command> [args]

if [[ "${BASH_SOURCE[0]}" = "${0}" ]]; then
  set -euo pipefail
fi

# ───────────────────────────────────────────────────────────────
# 1. REPO RESOLUTION
# ───────────────────────────────────────────────────────────────

_ci_common_dir() { git rev-parse --git-common-dir 2>/dev/null; }

# Both counter files live under the shared Git data so every linked worktree of
# one clone mints from the same sequence.
_ci_highwater_file() { echo "$(_ci_common_dir)/commit-id-number.highwater"; }
_ci_lock_dir()       { echo "$(_ci_common_dir)/commit-id-number.lock"; }

# ───────────────────────────────────────────────────────────────
# 2. VALIDATORS
# ───────────────────────────────────────────────────────────────

# Exactly 7 digits, value 0000001..9999999, interpreted base-10 so leading
# zeros are never read as octal.
is_valid_commit_id() {
  local n="${1:-}" value
  case "$n" in [0-9][0-9][0-9][0-9][0-9][0-9][0-9]) ;; *) return 1 ;; esac
  value=$((10#$n))
  [[ "$value" -ge 1 && "$value" -le 9999999 ]]
}

# ───────────────────────────────────────────────────────────────
# 3. NUMBER SCANNING + ALLOCATION
# ───────────────────────────────────────────────────────────────

# Highest ordinal in use: the cached high-water mark plus every commit message
# line across all refs. Both sources are read so a stale cache cannot reissue a
# number history already spent. Grep filters the full body stream in C; the
# shell loop then walks only candidate lines, so a warm mint stays fast on a
# large history instead of re-parsing every commit body in bash.
scan_max_ordinal() {
  local max=0 n hw line
  hw="$(_ci_highwater_file)"
  if [ -f "$hw" ]; then
    n="$(tr -dc '0-9' < "$hw" 2>/dev/null)"
    [ -n "$n" ] && [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
  fi
  while IFS= read -r line; do
    n="${line#Commit-Id: }"
    [ "$((10#$n))" -gt "$max" ] && max="$((10#$n))"
  done < <(git log --all --format='%B' 2>/dev/null | grep -E '^Commit-Id: [0-9]{7}$' || true)
  echo "$max"
}

# Non-binding preview of the next ordinal (no lock, no write). Mirrors the
# allocator's own ceiling refusal so a preview never promises a number the
# locked path would then reject.
next_ordinal() {
  local max
  max="$(scan_max_ordinal)" || return 1
  [ "$max" -ge 9999999 ] && return 1
  printf '%07d\n' "$((max + 1))"
}

# Epoch seconds of a path's last modification, or failure when no stat form is available.
# GNU and macOS stat disagree on the flag, so try the unambiguous GNU form first and fall back
# to the BSD one rather than let GNU's `-f` filesystem mode emit a non-numeric report.
_ci_mtime() {
  local p="${1:-}" ts
  [ -n "$p" ] || return 1
  ts="$(stat -c %Y "$p" 2>/dev/null || true)"
  case "$ts" in ''|*[!0-9]*) ts="$(stat -f %m "$p" 2>/dev/null || true)" ;; esac
  case "$ts" in ''|*[!0-9]*) return 1 ;; esac
  printf '%s\n' "$ts"
}

_ci_acquire_lock() {
  local ld pidf waited owner steal st stamp stale lock_mtime
  # Fail fast outside a repository: the lock path can never be created, and the
  # retry loop below would otherwise burn its full timeout before reporting it.
  [ -n "$(_ci_common_dir)" ] || { echo "commit-id-naming: not in a git repository" >&2; return 1; }
  ld="$(_ci_lock_dir)"; pidf="$ld/pid"; waited=0
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
    # stolen lock that turns out live is restored in place, never a bare
    # re-insert that could clobber a lock another contender legitimately
    # acquired in the meantime.
    owner="$(cat "$pidf" 2>/dev/null || true)"
    # Stale when the recorded holder is dead, OR when the lock directory still has no readable
    # owner after a short grace. The second case is a kill between `mkdir "$ld"` and the atomic
    # pid write: there is no owner to test, so every contender would otherwise wait out the
    # timeout and fail. Both are reclaimed through the same atomic rename below, which lets a
    # pid that appears late win the confirmation and restore the lock in place.
    stale=false
    if [ -n "$owner" ]; then
      kill -0 "$owner" 2>/dev/null || stale=true
    else
      lock_mtime="$(_ci_mtime "$ld" || true)"
      if [ -n "$lock_mtime" ] && [ "$(( $(date +%s) - lock_mtime ))" -ge 2 ]; then
        stale=true
      fi
    fi
    if [ "$stale" = true ]; then
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
    [ "$waited" -gt 300 ] && { echo "commit-id-naming: lock acquisition timed out" >&2; return 1; }
    sleep 0.1
  done
}
_ci_lock_owned() {
  local ld owner
  ld="$(_ci_lock_dir)"
  owner="$(cat "$ld/pid" 2>/dev/null || true)"
  [ "$owner" = "$$" ]
}
_ci_release_lock() {
  local ld owner release
  ld="$(_ci_lock_dir)"
  owner="$(cat "$ld/pid" 2>/dev/null || true)"
  [ "$owner" = "$$" ] || return 0
  release="$ld.release.$$.$RANDOM"
  if mv "$ld" "$release" 2>/dev/null; then
    # Releasing only a matching token prevents a displaced holder from deleting a newer lock.
    rm -rf "$release" 2>/dev/null || true
  fi
}

_ci_persist_highwater() {
  local next="$1" hw tmp expected actual
  hw="$(_ci_highwater_file)"
  [ -d "$hw" ] && return 1
  tmp="$(mktemp "${hw}.tmp.XXXXXX" 2>/dev/null)" || return 1
  expected="$(printf '%07d' "$next")"
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

# Atomically reserve the next ordinal and persist the high-water mark.
allocate_ordinal() {
  local max next retries=0
  while :; do
    _ci_acquire_lock || return 1
    if ! _ci_lock_owned; then
      _ci_release_lock
      retries=$((retries + 1))
      [ "$retries" -gt 300 ] && return 1
      sleep 0.01
      continue
    fi
    if ! max="$(scan_max_ordinal)"; then
      _ci_release_lock
      return 1
    fi
    if ! _ci_lock_owned; then
      _ci_release_lock
      retries=$((retries + 1))
      [ "$retries" -gt 300 ] && return 1
      sleep 0.01
      continue
    fi
    next=$((max + 1))
    if [ "$next" -gt 9999999 ]; then
      _ci_release_lock
      return 1
    fi
    if ! _ci_persist_highwater "$next"; then
      _ci_release_lock
      return 1
    fi
    if ! _ci_lock_owned; then
      _ci_release_lock
      retries=$((retries + 1))
      [ "$retries" -gt 300 ] && return 1
      sleep 0.01
      continue
    fi
    _ci_release_lock
    printf '%07d\n' "$next"
    return 0
  done
}

# Rescan history and rewrite the high-water file (recovery after a history
# rewrite). The written value is the greater of history and the cached mark: a
# rewrite can remove commits, but an ordinal already minted must stay spent, so
# a rebuild never lowers the floor.
rebuild_highwater() {
  local max
  _ci_acquire_lock || return 1
  if ! _ci_lock_owned; then
    _ci_release_lock
    return 1
  fi
  if ! max="$(scan_max_ordinal)"; then
    _ci_release_lock
    return 1
  fi
  if ! _ci_persist_highwater "$max"; then
    _ci_release_lock
    return 1
  fi
  _ci_release_lock
  printf '%07d\n' "$max"
}

# ───────────────────────────────────────────────────────────────
# 4. CLI DISPATCH
# ───────────────────────────────────────────────────────────────

_ci_usage() {
  cat >&2 <<'USAGE'
commit-id-naming.sh <command> [args]

  allocate            Reserve the next ordinal (locked; writes high-water).
  next                Preview the next ordinal (no lock/write).
  scan-max            Highest ordinal in use: the high-water file, then every
                      commit message across all refs.
  validate <value>    Exit 0 for exactly seven digits in 0000001..9999999.
  rebuild-highwater   Rescan history and rewrite the high-water file.
USAGE
}

_ci_main() {
  local cmd="${1:-}" rc; shift || true
  case "$cmd" in
    allocate)          allocate_ordinal ;;
    next)              next_ordinal ;;
    scan-max)          scan_max_ordinal ;;
    validate)
      if is_valid_commit_id "${1:-}"; then echo ok; else rc=$?; echo invalid >&2; exit "$rc"; fi
      ;;
    rebuild-highwater) rebuild_highwater ;;
    ""|-h|--help|help) _ci_usage ;;
    *) echo "unknown command: $cmd" >&2; _ci_usage; exit 2 ;;
  esac
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  _ci_main "$@"
fi
