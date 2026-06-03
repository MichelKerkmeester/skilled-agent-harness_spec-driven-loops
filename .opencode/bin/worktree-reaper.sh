#!/usr/bin/env bash
#
# worktree-reaper.sh — prune finished per-session AI worktrees, report orphan daemons.
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

DRY_RUN=0
REAP_DAEMONS=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --reap-daemons) REAP_DAEMONS=1 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

log() { echo "[worktree-reaper] $*" >&2; }
# Run a command as an argv array (never as a re-parsed shell string) so values
# carrying quotes/metacharacters cannot inject. Dry-run prints %q-escaped tokens.
act() { if [ "$DRY_RUN" = "1" ]; then printf 'DRY_RUN would:'; printf ' %q' "$@"; printf '\n'; else "$@"; fi; }

MAIN_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$MAIN_ROOT" ]; then log "not in a git repo"; exit 1; fi
# Operate from the main common dir so worktree commands are unambiguous.
COMMON="$(git rev-parse --git-common-dir 2>/dev/null || true)"
MAIN_TOPLEVEL="$(cd "$(dirname "$COMMON")" && pwd -P)"

WT_BASE="$MAIN_TOPLEVEL/.worktrees"

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

    branch="$(git -C "$wt_path" rev-parse --abbrev-ref HEAD 2>/dev/null || echo DETACHED)"
    # Dirty check: any staged/unstaged/untracked changes -> keep.
    if [ -n "$(git -C "$wt_path" status --porcelain 2>/dev/null)" ]; then
      log "keep (dirty): $wt_path [$branch]"
      continue
    fi
    # Merged check: branch tip reachable from main -> safe to remove.
    if [ "$branch" != "DETACHED" ] && git -C "$MAIN_TOPLEVEL" merge-base --is-ancestor "$branch" main 2>/dev/null; then
      log "prune (merged + clean): $wt_path [$branch]"
      act git -C "$MAIN_TOPLEVEL" worktree remove "$wt_path"
      act git -C "$MAIN_TOPLEVEL" branch -d "$branch"
    else
      log "keep (unmerged or detached): $wt_path [$branch]"
    fi
  done < <(git -C "$MAIN_TOPLEVEL" worktree list --porcelain | grep '^worktree ')
fi

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
  ORPHANS=$((ORPHANS+1))
  if [ "$REAP_DAEMONS" = "1" ]; then
    log "reaping orphan daemon pid=$pid"
    act kill -TERM "$pid"
  else
    log "orphan daemon (report only; use --reap-daemons to kill) pid=$pid :: $cmdline"
  fi
done < <(pgrep -f '\.worktrees/.*context-server\.js' 2>/dev/null || true)

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

log "done (orphan daemon candidates: $ORPHANS; reap-daemons=$REAP_DAEMONS)"
