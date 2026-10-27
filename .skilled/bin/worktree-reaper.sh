#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Reaper
# ───────────────────────────────────────────────────────────────
# Prune finished per-session AI worktrees and their leftover session state.
#
# Companion to worktree-session.sh. Keeps .worktrees/ bounded without ever touching a
# sibling's LIVE worktree.
#
# Default (safe) behavior:
#   - `git worktree prune` (clears stale administrative entries for already-deleted dirs).
#   - Remove each registered wrapper worktree (branch work/<runtime>/<slug>) whose working
#     tree is clean AND whose branch is fully merged into the live tip. A dirty or unmerged
#     worktree is left alone, as is one that still has a live process working inside it.
#   - Before removing a worktree, end its fsmonitor daemon through
#     fsmonitor-daemon-reaper.sh; a failure there is logged and removal continues.
#   - Prune per-session socket dirs and session markers whose worktree is no longer in
#     git's worktree registry.
#
# Opt-in numbered lane (--numbered): also remove an sk-git numbered worktree (branch
# worktrees/NNN-slug in a folder NNN-slug) once ALL of these hold, and keep it otherwise:
#   - registered, not the primary checkout, not detached, not locked, folder present;
#   - `git status --porcelain --untracked-files=all` is empty;
#   - every ignored path is a regenerable item (node_modules, dist, build caches, the
#     provisioned links) and NOTHING ignored sits under specs/;
#   - its branch is an ancestor of the primary checkout's HEAD;
#   - the newest of the branch reflog, the worktree's own HEAD log and its index file is
#     older than --idle-hours (default 48);
#   - a bounded process listing proves no process works inside it (an empty or timed-out
#     listing counts as busy);
#   - no stash entry belongs to the branch.
# Removal is plain `git worktree remove` then `git branch -d`, never forced; a refusal logs
# keep and the run continues with the next worktree. Unregistered folders under the
# worktree base are reported, never touched.
#
# Flags:
#   --dry-run          Print what would be pruned; change nothing.
#   --numbered         Also sweep numbered worktrees (rules above).
#   --idle-hours <n>   Idle threshold for the numbered lane, in hours (default 48).
#
# Environment:
#   SPECKIT_GIT_TIMEOUT        Seconds one git call may take before it is stopped (default 20).
#   FSMON_PROBE_TIMEOUT        Seconds the process listing may take (default 15).
#   WORKTREE_REAPER_NOW        Fixed epoch seconds for the idle test, for tests.
#
# Safety: resolves worktrees from `git worktree list` (any base), never removes the main
# checkout, never touches a worktree a live process is using, and signals no process other
# than the fsmonitor daemon of a worktree it removes.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

DRY_RUN=0
NUMBERED=0
IDLE_HOURS=48
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --numbered) NUMBERED=1 ;;
    --idle-hours)
      if [ "$#" -lt 2 ]; then echo "--idle-hours needs a number of hours" >&2; exit 2; fi
      IDLE_HOURS="$2"
      shift
      ;;
    *) echo "unknown flag: $1" >&2; exit 2 ;;
  esac
  shift
done
case "$IDLE_HOURS" in
  ''|*[!0-9]*) echo "--idle-hours must be a whole number of hours (got: $IDLE_HOURS)" >&2; exit 2 ;;
esac

# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

# Every git call below runs under a wall-clock bound with fsmonitor off, so a wedged
# daemon or a stuck index lock costs one timeout instead of an open-ended hang. Without
# the helper the calls run unbounded, with fsmonitor still off.
_BOUNDED_GIT_LIB="$SCRIPT_DIR/../scripts/git-hooks/lib/bounded-git.sh"
if [ -r "$_BOUNDED_GIT_LIB" ]; then
  # shellcheck source=../scripts/git-hooks/lib/bounded-git.sh
  . "$_BOUNDED_GIT_LIB"
else
  bounded_run() { shift; "$@"; }
  git_bounded() { git -c core.fsmonitor=false "$@"; }
fi

log() { echo "[worktree-reaper] $*" >&2; }
# Run a command as an argv array (never as a re-parsed shell string) so values
# carrying quotes/metacharacters cannot inject. Dry-run prints %q-escaped tokens.
act() {
  if [ "$DRY_RUN" = "1" ]; then
    local words=("$@")
    [ "${words[0]}" = "git_bounded" ] && words[0]="git"
    printf 'DRY_RUN would:'; printf ' %q' "${words[@]}"; printf '\n'
  else
    "$@"
  fi
}

# One number from the environment, or the default when it is not a positive integer.
_env_seconds() {
  case "$1" in ''|*[!0-9]*|0) printf '%s\n' "$2" ;; *) printf '%s\n' "$1" ;; esac
}
PROBE_TIMEOUT="$(_env_seconds "${FSMON_PROBE_TIMEOUT:-}" 15)"
NOW="$(_env_seconds "${WORKTREE_REAPER_NOW:-}" "$(date +%s)")"

# ───────────────────────────────────────────────────────────────
# 3. PATH RESOLUTION
# ───────────────────────────────────────────────────────────────

MAIN_ROOT="$(git_bounded rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$MAIN_ROOT" ]; then log "not in a git repo"; exit 1; fi
# Operate from the main common dir so worktree commands are unambiguous.
COMMON="$(git_bounded rev-parse --git-common-dir 2>/dev/null || true)"
[ -n "$COMMON" ] || { log "cannot resolve the git common dir"; exit 1; }
MAIN_TOPLEVEL="$(cd "$(dirname "$COMMON")" && pwd -P)"
case "$COMMON" in /*) COMMON_ABS="$COMMON" ;; *) COMMON_ABS="$(cd "$COMMON" && pwd -P)" ;; esac

# Sibling that ends one worktree's fsmonitor daemon. Removal ends it first, while git
# can still stop it cleanly, rather than leaving the daemon to notice its tree vanish.
FSMON_REAPER="${SPECKIT_FSMON_REAPER:-$SCRIPT_DIR/fsmonitor-daemon-reaper.sh}"
# The owner's validator for the numbered branch and folder pair.
NAMING="$SCRIPT_DIR/../skills/sk-git/scripts/worktree-naming.sh"
PROVISION_LIST="$SCRIPT_DIR/../skills/sk-git/scripts/worktree-provision-paths.txt"

# Worktree base (canonical resolver: sk-git worktree-naming.sh _wn_base_dir;
# inlined to keep the reaper self-contained). Must agree with the allocator and
# launch wrapper so relocated worktrees are still found. Precedence: env >
# git config > legacy in-checkout .worktrees.
WT_BASE="${SPECKIT_WORKTREE_BASE:-$(git_bounded -C "$MAIN_TOPLEVEL" config --get speckit.worktreeBase 2>/dev/null || true)}"
[ -n "$WT_BASE" ] || WT_BASE=".worktrees"
# shellcheck disable=SC2088 # the literal "~/" prefix is the pattern being matched
case "$WT_BASE" in
  "~")   WT_BASE="$HOME" ;;
  "~/"*) WT_BASE="$HOME/${WT_BASE#\~/}" ;;
esac
case "$WT_BASE" in
  /*) : ;;
  *)  WT_BASE="$MAIN_TOPLEVEL/$WT_BASE" ;;
esac
[ -d "$WT_BASE" ] && WT_BASE="$(cd "$WT_BASE" && pwd -P)"
MARKERS_DIR="$COMMON_ABS/worktree-sessions"

# The live integration target is whatever commit the primary checkout actually
# has — NOT a stale local `main`, which can be thousands of commits behind the
# live branch and make "merged" checks silently wrong (so real merges look
# unmerged, or worse). Empty on an unborn HEAD -> nothing is eligible.
INTEGRATION="$(git_bounded -C "$MAIN_TOPLEVEL" rev-parse --verify --quiet HEAD 2>/dev/null || true)"

# A wrapper worktree is proven INACTIVE only when its session marker exists AND
# the recorded pid is dead. A missing/unreadable marker or a live pid means keep
# — absence of proof is never proof of absence.
_marker_says_inactive() {
  local mf pid
  mf="$MARKERS_DIR/$1.pid"
  [ -f "$mf" ] && [ -r "$mf" ] || return 1
  if ! pid="$(LC_ALL=C awk '
    NR == 1 && $0 ~ /^[0-9]+$/ && ($0 + 0) >= 1 && ($0 + 0) <= 4194304 {
      printf "%.0f\n", ($0 + 0)
      next
    }
    { exit 1 }
  ' "$mf" 2>/dev/null)"; then
    return 1
  fi
  [ -n "$pid" ] || return 1
  kill -0 "$pid" 2>/dev/null && return 1
  return 0
}

_wrapper_branch_matches_dir() {
  local branch="$1" dir_basename="$2" runtime slug
  if [[ "$branch" =~ ^work/([a-z0-9][a-z0-9-]*)/([a-z0-9][a-z0-9-]*)$ ]]; then
    runtime="${BASH_REMATCH[1]}"
    slug="${BASH_REMATCH[2]}"
    [ "$dir_basename" = "$runtime-$slug" ] || return 1
    return 0
  fi
  return 1
}

# One record per registered worktree, fields joined by the unit separator: path, branch
# (empty when detached), detached flag, locked flag. Paths may hold spaces, so no
# whitespace separator can be used.
_worktree_records() {
  git_bounded -C "$MAIN_TOPLEVEL" worktree list --porcelain 2>/dev/null | LC_ALL=C awk '
    function emit() { if (p != "") printf "%s\037%s\037%s\037%s\n", p, b, d, l }
    /^worktree / { emit(); p = substr($0, 10); b = ""; d = 0; l = 0; next }
    /^branch refs\/heads\// { b = substr($0, 19); next }
    /^detached/ { d = 1; next }
    /^locked/ { l = 1; next }
    END { emit() }
  '
}

# Every slug git currently registers as a worktree, the primary checkout excluded. The
# launcher's base directory is per-process state (an environment variable), so a reaper
# started without that environment cannot see the worktree through its own base probe and
# would mistake a live session's state for a leftover. git's registry is authoritative
# regardless of which base the launcher chose, so membership here decides existence.
_registered_slugs() {
  local p
  while IFS=$'\037' read -r p _; do
    [ -n "$p" ] || continue
    [ "$p" = "$MAIN_TOPLEVEL" ] || basename "$p"
  done < <(_worktree_records)
}
_is_registered_slug() {
  local probe="$1" slug
  while IFS= read -r slug; do
    [ "$slug" = "$probe" ] && return 0
  done <<< "$REGISTERED_SLUGS"
  return 1
}

# Pid of a live process whose working directory is the worktree (or a directory inside it),
# or nothing. The session marker only proves the wrapper's own pid, which a detached or
# background child easily outlives; removing the worktree under such a child pulls the
# ground out from under a running process, so removal must refuse while one holds it.
# Method: one bounded `lsof -d cwd -Fpn` listing, available on both macOS and Linux; where
# lsof is absent but /proc exists, each /proc/<pid>/cwd link is read instead. Both paths
# compare against the symlink-resolved worktree path because lsof reports resolved paths
# while git may hand us one with a symlinked prefix (e.g. /var vs /private/var).
# Prints "unknown" and succeeds when the listing is empty, timed out or unavailable: a
# partial or missing listing is never proof that nothing works inside, so the caller keeps.
# Fails (status 1) only when a complete listing shows no process inside.
_busy_pid_in() {
  local root="$1" canon rows rc=0 line pid="" name link
  canon="$(cd "$root" 2>/dev/null && pwd -P)" || canon="$root"
  if command -v lsof >/dev/null 2>&1; then
    rows="$(bounded_run "$PROBE_TIMEOUT" lsof -nP -d cwd -Fpn 2>/dev/null)" || rc=$?
    if [ "$rc" -eq 142 ] || [ -z "$rows" ]; then
      printf 'unknown\n'
      return 0
    fi
    while IFS= read -r line; do
      case "$line" in
        p*) pid="${line#p}" ;;
        n*) name="${line#n}"
            case "$name" in
              *" (deleted)") name="${name% (deleted)}" ;;
            esac
            case "$name" in
              "$canon"|"$canon"/*) [ -n "$pid" ] && { printf '%s\n' "$pid"; return 0; } ;;
            esac ;;
      esac
    done <<< "$rows"
    return 1
  fi
  if [ -d /proc ]; then
    for link in /proc/[0-9]*/cwd; do
      [ -L "$link" ] || continue
      name="$(readlink "$link" 2>/dev/null || true)"
      case "$name" in
        "$canon"|"$canon"/*) printf '%s\n' "${link#/proc/}" | cut -d/ -f1; return 0 ;;
      esac
    done
    return 1
  fi
  printf 'unknown\n'
  return 0
}

# Modification time of one file in epoch seconds, or nothing when it is absent.
_mtime() {
  [ -e "$1" ] || return 1
  if [ "$(uname)" = "Darwin" ]; then stat -f %m "$1" 2>/dev/null; else stat -c %Y "$1" 2>/dev/null; fi
}

# End the worktree's fsmonitor daemon, then remove it and its branch the plain way. A
# refusal from git is logged and the caller carries on with the next worktree: a refused
# removal means git saw something worth keeping. Returns 1 when the worktree stays.
_remove_worktree() {
  local wt="$1" branch="$2"
  if [ -f "$FSMON_REAPER" ]; then
    if ! act bash "$FSMON_REAPER" --apply --worktree "$wt" --repo "$MAIN_TOPLEVEL" >&2; then
      log "fsmonitor daemon reaper failed for $wt; continuing with removal"
    fi
  fi
  if ! act git_bounded -C "$MAIN_TOPLEVEL" worktree remove "$wt"; then
    log "keep (git refused to remove the worktree): $wt [$branch]"
    return 1
  fi
  if ! act git_bounded -C "$MAIN_TOPLEVEL" branch -d "$branch"; then
    log "keep branch (git refused to delete it): $branch; the worktree is gone"
  fi
  return 0
}

# ───────────────────────────────────────────────────────────────
# 4. NUMBERED LANE
# ───────────────────────────────────────────────────────────────

# Repository-relative paths the provisioning list says are regenerable: each package's
# node_modules and its named build output.
PROVISION_ALLOW=""
if [ "$NUMBERED" = "1" ] && [ -r "$PROVISION_LIST" ]; then
  while read -r pdir pout _; do
    case "$pdir" in ''|'#'*) continue ;; esac
    PROVISION_ALLOW="$PROVISION_ALLOW$pdir/node_modules"$'\n'
    [ -z "${pout:-}" ] || PROVISION_ALLOW="$PROVISION_ALLOW$pdir/$pout"$'\n'
  done < "$PROVISION_LIST"
fi

# Stash entries name their branch, so one listing serves every worktree. A failed listing
# keeps everything: an unreadable stash is not an empty one.
STASH_LIST=""
STASH_KNOWN=0
if [ "$NUMBERED" = "1" ]; then
  if STASH_LIST="$(git_bounded -C "$MAIN_TOPLEVEL" stash list 2>/dev/null)"; then STASH_KNOWN=1; fi
fi

# Whether one ignored path (relative to the worktree) is a regenerable item. Anything under
# specs/ is never regenerable, and an unrecognized path is not either.
_ignored_is_regenerable() {
  local wt="$1" rel="${2%/}" comp target allowed
  local -a comps
  case "$rel" in specs|specs/*) return 1 ;; esac
  IFS=/ read -r -a comps <<< "$rel"
  for comp in "${comps[@]}"; do
    case "$comp" in
      node_modules|dist|build|.cache|.turbo|.next|.nyc_output|coverage|.vitest|.eslintcache|\
      .pytest_cache|__pycache__|.mypy_cache|.ruff_cache|.DS_Store|*.tsbuildinfo|*.pyc) return 0 ;;
    esac
  done
  while IFS= read -r allowed; do
    [ -n "$allowed" ] || continue
    case "$rel" in "$allowed"|"$allowed"/*) return 0 ;; esac
  done <<< "$PROVISION_ALLOW"
  # A provisioned link back to the primary checkout is recreated on the next provision, and
  # so is a folder that holds nothing but such links.
  if [ -L "$wt/$rel" ]; then
    _links_into_primary "$wt/$rel" && return 0
  elif [ -d "$wt/$rel" ]; then
    [ -z "$(find "$wt/$rel" ! -type d ! -type l 2>/dev/null | head -n 1)" ] || return 1
    while IFS= read -r target; do
      _links_into_primary "$target" || return 1
    done < <(find "$wt/$rel" -type l 2>/dev/null)
    return 0
  fi
  return 1
}

# Whether one symbolic link points into the primary checkout.
_links_into_primary() {
  local target
  target="$(readlink "$1" 2>/dev/null || true)"
  case "$target" in "$MAIN_TOPLEVEL"/*) return 0 ;; esac
  return 1
}

# Why a numbered worktree must stay, or nothing when every rule allows removal. Cheap
# checks run first and the process listing last. The index time is read before any git
# command that might refresh the index.
_numbered_keep_reason() {
  local wt="$1" branch="$2" locked="$3" admin newest="" f m ignored status_out status_rc rel busy

  if [ -z "$INTEGRATION" ]; then printf 'the primary checkout has no commit yet\n'; return 0; fi
  if [ ! -r "$NAMING" ] || ! ( cd "$MAIN_TOPLEVEL" && bash "$NAMING" validate-pair "$branch" "$wt" ) >/dev/null 2>&1; then
    printf 'not a numbered branch and folder pair\n'; return 0
  fi
  if [ "$locked" = "1" ]; then printf 'locked\n'; return 0; fi

  admin="$(git_bounded -C "$wt" rev-parse --absolute-git-dir 2>/dev/null || true)"
  for f in "$COMMON_ABS/logs/refs/heads/$branch" "${admin:+$admin/logs/HEAD}" "${admin:+$admin/index}"; do
    [ -n "$f" ] || continue
    m="$(_mtime "$f" || true)"
    [ -n "$m" ] || continue
    if [ -z "$newest" ] || [ "$m" -gt "$newest" ]; then newest="$m"; fi
  done
  if [ -z "$newest" ]; then printf 'no activity time could be read\n'; return 0; fi
  if [ $((NOW - newest)) -le $((IDLE_HOURS * 3600)) ]; then
    printf 'active within the last %s hours\n' "$IDLE_HOURS"; return 0
  fi

  if ! git_bounded -C "$MAIN_TOPLEVEL" merge-base --is-ancestor "refs/heads/$branch" "$INTEGRATION" >/dev/null 2>&1; then
    printf 'branch is not merged into the live branch\n'; return 0
  fi
  if [ "$STASH_KNOWN" != "1" ]; then printf 'stash list unreadable\n'; return 0; fi
  if printf '%s\n' "$STASH_LIST" | grep -Fq -e ": WIP on $branch:" -e ": On $branch:"; then
    printf 'a stash entry belongs to the branch\n'; return 0
  fi

  status_rc=0
  status_out="$(git_bounded --no-optional-locks -C "$wt" status --porcelain --untracked-files=all 2>/dev/null)" || status_rc=$?
  if [ "$status_rc" -eq 142 ]; then printf 'git status timed out\n'; return 0; fi
  if [ "$status_rc" -ne 0 ]; then printf 'git status failed\n'; return 0; fi
  if [ -n "$status_out" ]; then printf 'uncommitted or untracked files\n'; return 0; fi

  if ! ignored="$(git_bounded -C "$wt" ls-files -z --others --ignored --exclude-standard --directory 2>/dev/null | tr '\0' '\n')"; then
    printf 'ignored files could not be listed\n'; return 0
  fi
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    if ! _ignored_is_regenerable "$wt" "$rel"; then
      printf 'ignored path is not regenerable: %s\n' "$rel"; return 0
    fi
  done <<< "$ignored"

  busy="$(_busy_pid_in "$wt")" || busy=""
  if [ "$busy" = "unknown" ]; then printf 'process listing unavailable\n'; return 0; fi
  if [ -n "$busy" ]; then printf 'live process inside; pid %s\n' "$busy"; return 0; fi
  return 0
}

# Machine-readable verdict row on stdout, one per numbered worktree.
_numbered_row() { printf 'numbered verdict=%s worktree=%s branch=%s reason=%s\n' "$1" "$2" "$3" "$4"; }

_sweep_numbered_worktree() {
  local wt="$1" branch="$2" locked="$3" reason
  reason="$(_numbered_keep_reason "$wt" "$branch" "$locked")"
  if [ -n "$reason" ]; then
    log "keep (numbered: $reason): $wt [$branch]"
    _numbered_row keep "$wt" "$branch" "$reason"
    return 0
  fi
  log "prune (numbered merged + clean + idle): $wt [$branch]"
  if _remove_worktree "$wt" "$branch"; then
    if [ "$DRY_RUN" = "1" ]; then _numbered_row would-reap "$wt" "$branch" idle; else _numbered_row reaped "$wt" "$branch" idle; fi
  else
    _numbered_row keep "$wt" "$branch" "git refused removal"
  fi
}

# Folders under the worktree base that look numbered but are not in git's registry. They
# are reported and never touched: only the operator knows whether one holds anything.
_report_orphans() {
  local registered="$1" dir real
  [ -d "$WT_BASE" ] || return 0
  for dir in "$WT_BASE"/[0-9][0-9][0-9]-*; do
    [ -d "$dir" ] || continue
    real="$(cd "$dir" 2>/dev/null && pwd -P)" || real="$dir"
    if printf '%s\n' "$registered" | grep -Fqx -- "$real"; then continue; fi
    log "orphan folder (unregistered; report-only): $real"
    printf 'orphan path=%s\n' "$real"
  done
}

# ───────────────────────────────────────────────────────────────
# 5. WORKTREE PRUNING
# ───────────────────────────────────────────────────────────────

log "pruning stale worktree admin entries"
act git_bounded -C "$MAIN_TOPLEVEL" worktree prune || log "worktree prune failed; continuing"

[ -d "$WT_BASE" ] || log "no worktree base dir ($WT_BASE) — resolving worktrees from the registry"

REGISTERED_PATHS=""

# Iterate every registered worktree, from any base: the launcher may have chosen the base
# from the environment, so a reaper without it must still see the worktree. Records come
# in on fd 3 so no command in the loop can read the list from stdin.
while IFS=$'\037' read -r -u 3 wt_path branch detached locked; do
    [ -n "$wt_path" ] || continue
    [ "$wt_path" = "$MAIN_TOPLEVEL" ] && continue   # never the primary checkout
    [ -d "$wt_path" ] || continue
    REGISTERED_PATHS="$REGISTERED_PATHS$(cd "$wt_path" 2>/dev/null && pwd -P || printf '%s' "$wt_path")"$'\n'
    bn="$(basename "$wt_path")"

    # Only the machine-owned launch-wrapper lane (work/<runtime>/<slug>) and, when asked,
    # the numbered lane are ever auto-reaped. Detached worktrees and every other branch
    # are reported, never removed automatically — their cleanup is an operator decision.
    if [ "$detached" = "1" ] || [ -z "$branch" ]; then
      log "keep (detached; report-only): $wt_path"
      continue
    fi
    case "$branch" in
      work/*)
        if ! _wrapper_branch_matches_dir "$branch" "$bn"; then
          log "keep (non-wrapper worktree; report-only): $wt_path [$branch]"
          continue
        fi
        ;;
      worktrees/*)
        if [ "$NUMBERED" = "1" ]; then
          _sweep_numbered_worktree "$wt_path" "$branch" "$locked"
        else
          log "keep (human worktree; report-only): $wt_path [$branch]"
        fi
        continue
        ;;
      *) log "keep (human worktree; report-only): $wt_path [$branch]"; continue ;;
    esac

    # Wrapper worktree: reap ONLY when all three hold — clean tree, merged into
    # the live integration tip, and proven inactive by its session marker.
    if ! wrapper_status="$(git_bounded --no-optional-locks -C "$wt_path" status --porcelain 2>/dev/null)"; then
      log "keep (wrapper status unreadable): $wt_path [$branch]"
      continue
    fi
    if [ -n "$wrapper_status" ]; then
      log "keep (wrapper dirty): $wt_path [$branch]"
      continue
    fi
    if [ -z "$INTEGRATION" ] || ! git_bounded -C "$MAIN_TOPLEVEL" merge-base --is-ancestor "$branch" "$INTEGRATION" 2>/dev/null; then
      log "keep (wrapper not merged into live branch): $wt_path [$branch]"
      continue
    fi
    if ! _marker_says_inactive "$bn"; then
      log "keep (wrapper active or liveness unproven): $wt_path [$branch]"
      continue
    fi
    busy_pid="$(_busy_pid_in "$wt_path")" || busy_pid=""
    if [ -n "$busy_pid" ]; then
      log "keep (live process inside; pid $busy_pid): $wt_path [$branch]"
      continue
    fi
    log "prune (wrapper merged + clean + inactive): $wt_path [$branch]"
    if _remove_worktree "$wt_path" "$branch"; then
      act rm -f "$MARKERS_DIR/$bn.pid"
    fi
  done 3< <(_worktree_records)

[ "$NUMBERED" != "1" ] || _report_orphans "$REGISTERED_PATHS"

# Snapshot the registry AFTER reaping, so a worktree removed above is already absent here
# and its leftover socket dir and marker still get cleaned.
REGISTERED_SLUGS="$(_registered_slugs)"

# ───────────────────────────────────────────────────────────────
# 6. SOCKET DIRECTORY CLEANUP
# ───────────────────────────────────────────────────────────────

# Prune short per-session socket dirs (~/.spk-wt-sock/<runtime>-<slug>) whose worktree is gone.
SOCK_BASE="$HOME/.spk-wt-sock"
if [ -d "$SOCK_BASE" ]; then
  for sd in "$SOCK_BASE"/*; do
    [ -d "$sd" ] || continue
    slug="$(basename "$sd")"
    if _is_registered_slug "$slug"; then continue; fi
    if [ ! -d "$WT_BASE/$slug" ]; then
      log "prune stale socket dir (no matching worktree): $sd"
      act rm -rf -- "$sd"
    fi
  done
fi

# Prune session markers whose worktree no longer exists.
if [ -d "$MARKERS_DIR" ]; then
  for mf in "$MARKERS_DIR"/*.pid; do
    [ -f "$mf" ] || continue
    slug="$(basename "$mf" .pid)"
    if _is_registered_slug "$slug"; then continue; fi
    [ -d "$WT_BASE/$slug" ] || { log "prune stale session marker (no matching worktree): $mf"; act rm -f -- "$mf"; }
  done
fi

log "done"
