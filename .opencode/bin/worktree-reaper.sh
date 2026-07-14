#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Reaper
# ───────────────────────────────────────────────────────────────
# Prune finished per-session AI worktrees, report orphan daemons.
#
# Companion to worktree-session.sh. Keeps .worktrees/ and the MCP daemon population
# bounded without ever touching a sibling's LIVE worktree.
#
# Default (safe) behavior:
#   - `git worktree prune` (clears stale administrative entries for already-deleted dirs).
#   - Remove each .worktrees/* whose branch is fully merged into main AND whose working
#     tree is clean (no uncommitted changes). A dirty or unmerged worktree is left alone.
#   - REPORT (does not kill) MCP daemons whose recorded lease points at a .worktrees/ dir
#     that no longer exists.
#
# Flags:
#   --dry-run        Print what would be pruned/reported; change nothing.
#   --reap-daemons   Also SIGTERM (then SIGKILL) daemons whose worktree DB dir is gone.
#                    Off by default — daemon killing is opt-in to protect live sessions.
#
# Safety: only operates on worktrees under <repo>/.worktrees/. Never removes the main
# checkout. Never kills a daemon whose worktree still exists.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

DRY_RUN=0
REAP_DAEMONS=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --reap-daemons) REAP_DAEMONS=1 ;;
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

WT_BASE="$MAIN_TOPLEVEL/.worktrees"
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

_daemon_worktree_path_from_cmdline() {
  local cmdline="$1" worktree_base worktree_name worktree_path canonical_base
  if [[ "$cmdline" =~ (/.*/\.worktrees/)([A-Za-z0-9._-]+)(/[^[:space:]]*)? ]]; then
    worktree_base="${BASH_REMATCH[1]%/}"
    worktree_name="${BASH_REMATCH[2]}"
    case "$worktree_name" in
      ''|.|..) return 1 ;;
    esac
    canonical_base="$(cd "$worktree_base" 2>/dev/null && pwd -P)" || return 1
    [ "$canonical_base" = "$WT_BASE" ] || return 1
    worktree_path="$worktree_base/$worktree_name"
    if [ -d "$worktree_path" ]; then
      ( cd "$worktree_path" 2>/dev/null && pwd -P )
    else
      printf '%s/%s\n' "$canonical_base" "$worktree_name"
    fi
    return 0
  fi
  return 1
}

_daemon_cmdline_is_orphan() {
  local cmdline="$1" worktree_path
  if ! worktree_path="$(_daemon_worktree_path_from_cmdline "$cmdline")"; then
    return 1
  fi
  [ -e "$worktree_path" ] || [ -L "$worktree_path" ] || return 0
  return 1
}

# ───────────────────────────────────────────────────────────────
# 4. WORKTREE PRUNING
# ───────────────────────────────────────────────────────────────

log "pruning stale worktree admin entries"
act git -C "$MAIN_TOPLEVEL" worktree prune

if [ ! -d "$WT_BASE" ]; then
  log "no .worktrees/ dir — nothing to prune"
else
  # Iterate registered worktrees under .worktrees/ only.
  while IFS= read -r line; do
    case "$line" in worktree\ *) ;; *) continue ;; esac
    wt_path="${line#worktree }"
    case "$wt_path" in "$WT_BASE"/*) ;; *) continue ;; esac   # only .worktrees/* (skip main)
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
    log "prune (wrapper merged + clean + inactive): $wt_path [$branch]"
    act git -C "$MAIN_TOPLEVEL" worktree remove "$wt_path"
    act git -C "$MAIN_TOPLEVEL" branch -d "$branch"
    act rm -f "$MARKERS_DIR/$bn.pid"
  done < <(git -C "$MAIN_TOPLEVEL" worktree list --porcelain | grep '^worktree ')
fi

# ───────────────────────────────────────────────────────────────
# 5. ORPHAN DAEMON REPORTING
# ───────────────────────────────────────────────────────────────

# --- orphan daemon reporting (kill only with --reap-daemons) ---------------
# A worktree daemon writes its lease under <worktree-db-dir>/.mk-spec-memory-launcher.json.
# If that lease names a live childPid but the worktree DB dir is gone, it is orphaned.
log "scanning for orphan worktree daemons"
ORPHANS=0
# Look at lease files that ever lived under .worktrees/. After worktree removal the file
# is gone, so we instead detect live daemon PIDs whose cwd/db-dir no longer resolves.
# Conservative heuristic: list node daemons referencing a .worktrees/ path that is absent.
while IFS= read -r pid; do
  [ -z "$pid" ] && continue
  # Resolve the process command line; match worktree DB dir references.
  cmdline="$(ps -o command= -p "$pid" 2>/dev/null || true)"
  [ -z "$cmdline" ] && continue
  case "$cmdline" in
    *node*context-server.js*) ;;
    *) continue ;;
  esac
  if ! _daemon_cmdline_is_orphan "$cmdline"; then
    log "skip live or unproven daemon pid=$pid"
    continue
  fi
  if [ "$REAP_DAEMONS" = "1" ]; then
    current_cmdline="$(ps -o command= -p "$pid" 2>/dev/null || true)"
    if [ -z "$current_cmdline" ] || [ "$current_cmdline" != "$cmdline" ]; then
      log "skip changed daemon pid=$pid"
      continue
    fi
    case "$current_cmdline" in
      *node*context-server.js*) ;;
      *)
        log "skip changed daemon pid=$pid"
        continue
        ;;
    esac
    if ! _daemon_cmdline_is_orphan "$current_cmdline"; then
      log "skip live daemon pid=$pid"
      continue
    fi
  fi
  ORPHANS=$((ORPHANS+1))
  if [ "$REAP_DAEMONS" = "1" ]; then
    log "reaping orphan daemon pid=$pid"
    act kill -TERM "$pid"
  else
    log "orphan daemon (report only; use --reap-daemons to kill) pid=$pid :: $cmdline"
  fi
done < <(pgrep -f '\.worktrees/.*context-server\.js' 2>/dev/null || true)

# ───────────────────────────────────────────────────────────────
# 6. SOCKET DIRECTORY CLEANUP
# ───────────────────────────────────────────────────────────────

# Prune short per-session socket dirs (~/.spk-wt-sock/<runtime>-<slug>) whose worktree is gone.
SOCK_BASE="$HOME/.spk-wt-sock"
if [ -d "$SOCK_BASE" ]; then
  for sd in "$SOCK_BASE"/*; do
    [ -d "$sd" ] || continue
    slug="$(basename "$sd")"
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
    [ -d "$WT_BASE/$slug" ] || { log "prune stale session marker (no matching worktree): $mf"; act rm -f -- "$mf"; }
  done
fi

log "done (orphan daemon candidates: $ORPHANS; reap-daemons=$REAP_DAEMONS)"
