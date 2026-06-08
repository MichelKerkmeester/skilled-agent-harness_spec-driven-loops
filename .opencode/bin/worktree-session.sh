#!/usr/bin/env bash
#
# worktree-session.sh — launch an AI coding session in its own isolated git worktree.
#
# A top-level (human-launched) session gets its own worktree + branch + isolated MCP
# databases, so concurrent sessions on different runtimes never share a working tree or
# contend on the single-writer DB lease. An orchestrated child (subagent / dispatched
# task / deep-loop iteration) shares its parent's worktree instead of nesting.
#
# Usage:
#   worktree-session.sh <runtime> [cli-args...]
#   worktree-session.sh --dry-run <runtime> [cli-args...]   # print the plan, change nothing
#
# <runtime> is the CLI to exec (claude, codex, opencode, ...).
#
# Child detection (either signal => exec in place, no new worktree):
#   1. AI_SESSION_CHILD=1 in the environment (set at dispatch sites for orchestrated children).
#   2. Structural backstop: the process is already inside a linked git worktree
#      (git --git-dir differs from --git-common-dir).
# On an unknown/ambiguous signal we default to top-level (isolate) — the safe failure mode.
#
# DB isolation is hybrid: shared node_modules/dist are symlinked from the main checkout
# (no per-worktree reinstall/rebuild), but each worktree gets its own MCP databases via
# SPEC_KIT_DB_DIR + SPECKIT_CODE_GRAPH_DB_DIR.
#
# Socket-length workaround: the daemon's unix-domain IPC socket defaults to <db-dir>/
# daemon-ipc.sock. A worktree DB dir nested deep inside the repo blows past the platform
# sun_path limit (~104 bytes on macOS, ~108 on Linux) and the daemon dies with EINVAL on
# listen(). So we also point SPECKIT_IPC_SOCKET_DIR at a short per-session dir under $HOME,
# keeping the socket path well under the limit while the DBs stay in the worktree.

set -euo pipefail

DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then DRY_RUN=1; shift || true; fi

RUNTIME="${1:-}"
if [ -z "$RUNTIME" ]; then
  echo "usage: worktree-session.sh [--dry-run] <runtime> [cli-args...]" >&2
  exit 2
fi
shift || true

log() { echo "[worktree-session] $*" >&2; }

# Shared artifacts symlinked from main into each worktree (deps + compiled output).
# Override with SPECKIT_WORKTREE_SHARED_PATHS (newline- or colon-separated relative paths).
default_shared_paths() {
  cat <<'PATHS'
.opencode/skills/system-spec-kit/node_modules
.opencode/skills/system-spec-kit/mcp_server/node_modules
.opencode/skills/system-spec-kit/mcp_server/dist
.opencode/skills/system-spec-kit/scripts/dist
.opencode/skills/system-code-graph/mcp_server/node_modules
.opencode/skills/system-code-graph/mcp_server/dist
PATHS
}

exec_in_place() {
  local reason="$1"
  log "child/already-isolated session ($reason) — exec'ing in place, no new worktree"
  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY_RUN: would exec in place: $RUNTIME $*"
    exit 0
  fi
  exec "$RUNTIME" "$@"
}

# --- Child detection -------------------------------------------------------
if [ "${AI_SESSION_CHILD:-}" = "1" ]; then
  exec_in_place "AI_SESSION_CHILD=1" "$@"
fi

GIT_DIR="$(git rev-parse --git-dir 2>/dev/null || true)"
GIT_COMMON_DIR="$(git rev-parse --git-common-dir 2>/dev/null || true)"
if [ -n "$GIT_DIR" ] && [ -n "$GIT_COMMON_DIR" ]; then
  # Normalize to absolute for a reliable comparison.
  GIT_DIR_ABS="$(cd "$(dirname "$GIT_DIR")" 2>/dev/null && pwd -P)/$(basename "$GIT_DIR")" || GIT_DIR_ABS="$GIT_DIR"
  GIT_COMMON_ABS="$(cd "$(dirname "$GIT_COMMON_DIR")" 2>/dev/null && pwd -P)/$(basename "$GIT_COMMON_DIR")" || GIT_COMMON_ABS="$GIT_COMMON_DIR"
  if [ "$GIT_DIR_ABS" != "$GIT_COMMON_ABS" ]; then
    exec_in_place "already inside a linked worktree" "$@"
  fi
fi

# --- Top-level session: allocate an isolated worktree ----------------------
MAIN_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$MAIN_ROOT" ]; then
  log "not inside a git repository — exec'ing in place (cannot isolate)"
  if [ "$DRY_RUN" = "1" ]; then echo "DRY_RUN: not a git repo; would exec in place"; exit 0; fi
  exec "$RUNTIME" "$@"
fi

# Short unique slug (epoch + pid). bash has no Date.now restriction.
SLUG="$(date +%Y%m%d-%H%M%S)-$$"
WT_REL=".worktrees/${RUNTIME}-${SLUG}"
WT_ABS="$MAIN_ROOT/$WT_REL"
BRANCH="work/${RUNTIME}/${SLUG}"

# Resolve the shared-artifact list.
if [ -n "${SPECKIT_WORKTREE_SHARED_PATHS:-}" ]; then
  SHARED_RAW="$(printf '%s' "$SPECKIT_WORKTREE_SHARED_PATHS" | tr ':' '\n')"
else
  SHARED_RAW="$(default_shared_paths)"
fi

WT_DB_DIR="$WT_ABS/.opencode/skills/system-spec-kit/mcp_server/database"
WT_CG_DB_DIR="$WT_ABS/.opencode/skills/system-code-graph/mcp_server/database"
# Short per-session socket dir under $HOME (NOT inside the deep worktree) to stay under the
# platform sun_path limit. The reaper cleans these alongside merged worktrees.
SOCK_DIR="$HOME/.spk-wt-sock/${RUNTIME}-${SLUG}"

if [ "$DRY_RUN" = "1" ]; then
  echo "DRY_RUN PLAN"
  echo "  main_root      = $MAIN_ROOT"
  echo "  worktree       = $WT_ABS"
  echo "  branch         = $BRANCH"
  echo "  SPEC_KIT_DB_DIR        = $WT_DB_DIR"
  echo "  SPECKIT_CODE_GRAPH_DB_DIR = $WT_CG_DB_DIR"
  echo "  SPECKIT_IPC_SOCKET_DIR = $SOCK_DIR  (socket path len $(( ${#SOCK_DIR} + 16 )), platform limit ~104)"
  echo "  symlink shared paths (those present in main):"
  while IFS= read -r rel; do
    [ -z "$rel" ] && continue
    if [ -e "$MAIN_ROOT/$rel" ]; then echo "    + $rel"; else echo "    - $rel (absent in main, skip)"; fi
  done <<< "$SHARED_RAW"
  echo "  then: cd worktree; exec $RUNTIME $*"
  exit 0
fi

log "allocating worktree $WT_REL on branch $BRANCH"
git -C "$MAIN_ROOT" worktree add -b "$BRANCH" "$WT_ABS" HEAD >&2

# Symlink shared artifacts so the worktree reuses main's installed deps + compiled output.
while IFS= read -r rel; do
  [ -z "$rel" ] && continue
  src="$MAIN_ROOT/$rel"
  dst="$WT_ABS/$rel"
  if [ ! -e "$src" ]; then
    log "shared path absent in main, skipping: $rel"
    continue
  fi
  mkdir -p "$(dirname "$dst")"
  rm -rf "$dst"
  ln -s "$src" "$dst"
  log "linked $rel -> main"
done <<< "$SHARED_RAW"

# Per-worktree isolated MCP databases, with a short socket dir to dodge the sun_path limit.
mkdir -p "$WT_DB_DIR" "$WT_CG_DB_DIR" "$SOCK_DIR"
export SPEC_KIT_DB_DIR="$WT_DB_DIR"
export SPECKIT_CODE_GRAPH_DB_DIR="$WT_CG_DB_DIR"
export SPECKIT_IPC_SOCKET_DIR="$SOCK_DIR"
SOCK_PATH_LEN=$(( ${#SOCK_DIR} + 16 ))
if [ "$SOCK_PATH_LEN" -ge 104 ]; then
  log "WARNING: socket path length $SOCK_PATH_LEN may exceed the platform limit (~104); the daemon could fail to listen"
fi

# Mark descendants of THIS session as children so they do not re-nest.
export AI_SESSION_CHILD=1

log "entering $WT_REL with isolated DBs; launching $RUNTIME"
cd "$WT_ABS"
exec "$RUNTIME" "$@"
