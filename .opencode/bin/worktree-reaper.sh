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
#   - Prune per-session socket dirs and session markers whose worktree is no longer in
#     git's worktree registry.
#
# Flags:
#   --dry-run        Print what would be pruned; change nothing.
#
# Safety: resolves worktrees from `git worktree list` (any base), never removes the main
# checkout, never touches a worktree a live process is using, never signals a process.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

log() { echo "[worktree-reaper] $*" >&2; }
# Run a command as an argv array (never as a re-parsed shell string) so values
# carrying quotes/metacharacters cannot inject. Dry-run prints %q-escaped tokens.
act() { if [ "$DRY_RUN" = "1" ]; then printf 'DRY_RUN would:'; printf ' %q' "$@"; printf '\n'; else "$@"; fi; }

# ───────────────────────────────────────────────────────────────
# 3. PATH RESOLUTION
# ───────────────────────────────────────────────────────────────

MAIN_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$MAIN_ROOT" ]; then log "not in a git repo"; exit 1; fi
# Operate from the main common dir so worktree commands are unambiguous.
COMMON="$(git rev-parse --git-common-dir 2>/dev/null || true)"
MAIN_TOPLEVEL="$(cd "$(dirname "$COMMON")" && pwd -P)"
case "$COMMON" in /*) COMMON_ABS="$COMMON" ;; *) COMMON_ABS="$(cd "$COMMON" && pwd -P)" ;; esac

# Worktree base (canonical resolver: sk-git worktree-naming.sh _wn_base_dir;
# inlined to keep the reaper self-contained). Must agree with the allocator and
# launch wrapper so relocated worktrees are still found. Precedence: env >
# git config > legacy in-checkout .worktrees.
WT_BASE="${SPECKIT_WORKTREE_BASE:-$(git -C "$MAIN_TOPLEVEL" config --get speckit.worktreeBase 2>/dev/null || true)}"
[ -n "$WT_BASE" ] || WT_BASE=".worktrees"
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
INTEGRATION="$(git -C "$MAIN_TOPLEVEL" rev-parse --verify --quiet HEAD 2>/dev/null || true)"

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

# Every slug git currently registers as a worktree, the primary checkout excluded. The
# launcher's base directory is per-process state (an environment variable), so a reaper
# started without that environment cannot see the worktree through its own base probe and
# would mistake a live session's state for a leftover. git's registry is authoritative
# regardless of which base the launcher chose, so membership here decides existence.
_registered_slugs() {
  git -C "$MAIN_TOPLEVEL" worktree list --porcelain 2>/dev/null | while IFS= read -r line; do
    case "$line" in worktree\ *) ;; *) continue ;; esac
    p="${line#worktree }"
    [ "$p" = "$MAIN_TOPLEVEL" ] || basename "$p"
  done
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
# Method: `lsof -a -d cwd -F pn` emits a machine-readable pid/name stream for every
# process's cwd descriptor and is available on both macOS and Linux; where lsof is absent
# but /proc exists, each /proc/<pid>/cwd link is read instead. Both paths compare against
# the symlink-resolved worktree path because lsof reports resolved paths while git may hand
# us one with a symlinked prefix (e.g. /var vs /private/var).
_busy_pid_in() {
  local root="$1" canon pid name link
  canon="$(cd "$root" 2>/dev/null && pwd -P)" || canon="$root"
  if command -v lsof >/dev/null 2>&1; then
    while IFS= read -r line; do
      case "$line" in
        p*) pid="${line#p}" ;;
        n*) name="${line#n}"
            case "$name" in
              "$canon"|"$canon"/*) printf '%s\n' "$pid"; return 0 ;;
            esac ;;
      esac
    done < <(lsof -a -d cwd -F pn 2>/dev/null || true)
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
  fi
  return 1
}

# ───────────────────────────────────────────────────────────────
# 4. WORKTREE PRUNING
# ───────────────────────────────────────────────────────────────

log "pruning stale worktree admin entries"
act git -C "$MAIN_TOPLEVEL" worktree prune

[ -d "$WT_BASE" ] || log "no worktree base dir ($WT_BASE) — resolving worktrees from the registry"

# Iterate every registered worktree, from any base: the launcher may have chosen the base
# from the environment, so a reaper without it must still see the worktree.
while IFS= read -r line; do
    case "$line" in worktree\ *) ;; *) continue ;; esac
    wt_path="${line#worktree }"
    [ "$wt_path" = "$MAIN_TOPLEVEL" ] && continue   # never the primary checkout
    [ -d "$wt_path" ] || continue
    bn="$(basename "$wt_path")"

    branch="$(git -C "$wt_path" rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)"
    # Only the machine-owned launch-wrapper lane (work/<runtime>/<slug>) is ever
    # auto-reaped. Detached worktrees and human numbered worktrees are reported,
    # never removed automatically — their cleanup is an operator decision.
    if [ "$branch" = "HEAD" ]; then
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
      *) log "keep (human worktree; report-only): $wt_path [$branch]"; continue ;;
    esac

    # Wrapper worktree: reap ONLY when all three hold — clean tree, merged into
    # the live integration tip, and proven inactive by its session marker.
    if [ -n "$(git -C "$wt_path" status --porcelain 2>/dev/null)" ]; then
      log "keep (wrapper dirty): $wt_path [$branch]"
      continue
    fi
    if [ -z "$INTEGRATION" ] || ! git -C "$MAIN_TOPLEVEL" merge-base --is-ancestor "$branch" "$INTEGRATION" 2>/dev/null; then
      log "keep (wrapper not merged into live branch): $wt_path [$branch]"
      continue
    fi
    if ! _marker_says_inactive "$bn"; then
      log "keep (wrapper active or liveness unproven): $wt_path [$branch]"
      continue
    fi
    if busy_pid="$(_busy_pid_in "$wt_path")"; then
      log "keep (live process inside; pid $busy_pid): $wt_path [$branch]"
      continue
    fi
    log "prune (wrapper merged + clean + inactive): $wt_path [$branch]"
    act git -C "$MAIN_TOPLEVEL" worktree remove "$wt_path"
    act git -C "$MAIN_TOPLEVEL" branch -d "$branch"
    act rm -f "$MARKERS_DIR/$bn.pid"
  done < <(git -C "$MAIN_TOPLEVEL" worktree list --porcelain | grep '^worktree ')

# Snapshot the registry AFTER reaping, so a worktree removed above is already absent here
# and its leftover socket dir and marker still get cleaned.
REGISTERED_SLUGS="$(_registered_slugs)"

# ───────────────────────────────────────────────────────────────
# 5. SOCKET DIRECTORY CLEANUP
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
