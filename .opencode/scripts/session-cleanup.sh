#!/usr/bin/env bash
# Clean up MCP helper descendants owned by the current runtime session.
#
# This script is intentionally session-scoped: it only ever kills processes it
# can prove are descendants of an explicit session PID, and it re-proves that
# ancestry immediately before each kill. There is deliberately NO fallback to
# the hook's PPID — under a shared terminal that PPID can resolve to an
# ancestor common to MANY live sessions, turning "this session's descendants"
# into "every session's MCP helpers" and killing sibling sessions' transports
# mid-flight. Missing session identity means we do nothing.
#
# Runs at session teardown (Claude SessionEnd, OpenCode dispose), never per
# response. Session identity comes only from the environment, never from a
# hook's stdin payload, so the same script is correct from any teardown
# invocation point regardless of what event delivered it.

set -euo pipefail

SESSION_PID="${SESSION_CLEANUP_PID:-${CLAUDE_SESSION_PID:-}}"
LOG_PATH="${SESSION_CLEANUP_LOG_PATH:-${CLAUDE_SESSION_CLEANUP_LOG_PATH:-${HOME:-/tmp}/.local/share/session-cleanup.log}}"
LOG_MAX_BYTES="${SESSION_CLEANUP_LOG_MAX_BYTES:-${CLAUDE_SESSION_CLEANUP_LOG_MAX_BYTES:-10485760}}"
EXIT_CODE=0
descendants=()

# Orphan-sweep fallback for the no-session-pid case. Default off. "dry-run" logs candidate reaps
# without mutating; "1"/"on"/"live" reaps. It delegates to the ORPHAN-ONLY sweeper, which reaps only
# ownerless (reparented) MCP processes and so can never touch a live sibling session — unlike a PPID
# guess, which this script deliberately refuses (see header). The sweeper path is overridable for tests.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ORPHAN_SWEEP_MODE="${SPECKIT_STOP_HOOK_ORPHAN_SWEEP:-off}"
ORPHAN_SWEEPER_BIN="${SPECKIT_ORPHAN_SWEEPER_BIN:-$SCRIPT_DIR/orphan-mcp-sweeper.sh}"

is_positive_int() {
  case "$1" in
    ''|*[!0-9]*) return 1 ;;
    *) [ "$1" -gt 0 ] ;;
  esac
}

if ! is_positive_int "$LOG_MAX_BYTES"; then
  LOG_MAX_BYTES=10485760
fi

rotate_log_if_needed() {
  [ -n "$LOG_PATH" ] || return 0
  [ -f "$LOG_PATH" ] || return 0

  local size
  size="$(wc -c < "$LOG_PATH" 2>/dev/null || echo 0)"
  is_positive_int "$size" || size=0
  [ "$size" -le "$LOG_MAX_BYTES" ] && return 0

  [ ! -f "$LOG_PATH.2" ] || cp -f "$LOG_PATH.2" "$LOG_PATH.3" 2>/dev/null || true
  [ ! -f "$LOG_PATH.1" ] || cp -f "$LOG_PATH.1" "$LOG_PATH.2" 2>/dev/null || true
  cp -f "$LOG_PATH" "$LOG_PATH.1" 2>/dev/null || return 0
  : > "$LOG_PATH" 2>/dev/null || true
}

emit() {
  local line
  line="$(date '+%Y-%m-%dT%H:%M:%S%z') $*"
  printf '%s\n' "$line"
  if [ -n "$LOG_PATH" ]; then
    mkdir -p "$(dirname "$LOG_PATH")" 2>/dev/null || true
    rotate_log_if_needed
    printf '%s\n' "$line" >> "$LOG_PATH" 2>/dev/null || true
  fi
}

pid_in_descendants() {
  local needle="$1"
  local item
  [ "${#descendants[@]}" -gt 0 ] || return 1
  for item in "${descendants[@]}"; do
    [ "$item" = "$needle" ] && return 0
  done
  return 1
}

append_descendants() {
  local parent="$1"
  local child
  while read -r child; do
    [ -n "$child" ] || continue
    if ! pid_in_descendants "$child"; then
      descendants+=("$child")
      append_descendants "$child"
    fi
  done <<EOF
$(pgrep -P "$parent" 2>/dev/null || true)
EOF
}

is_target_command() {
  local cmd="$1"
  case "$cmd" in
    *"mk-spec-memory-launcher.cjs"*|\
    *"mk-skill-advisor-launcher.cjs"*|\
    *"mk-code-index-launcher.cjs"*|\
    *"system-spec-kit/mcp-server/dist/context-server.js"*|\
    *"system-skill-advisor/mcp-server/dist/"*"advisor-server.js"*|\
    *"system-code-graph/mcp-server/dist/index.js"*|\
    *"mcp-code-mode/mcp-server/dist/index.js"*|\
    *"@modelcontextprotocol/server-sequential-thinking"*|\
    *"server-sequential-thinking"*|\
    *"clickup-mcp-server"*)
      return 0
      ;;
  esac
  return 1
}

# Re-prove, at kill time, that a candidate is still a descendant of the
# session. The pgrep walk above is a snapshot; a process can be re-parented
# (orphan adoption by launchd/init) between the walk and the kill, and a pid
# can in principle be recycled. Walking the live ppid chain upward closes
# that race: a process belonging to a sibling session can never have OUR
# session pid in its ancestor chain.
is_descendant_of_session() {
  local pid="$1"
  local depth=0
  local current="$pid"
  while [ "$depth" -lt 15 ]; do
    current="$(ps -o ppid= -p "$current" 2>/dev/null | tr -d ' ' || true)"
    [ -n "$current" ] || return 1
    [ "$current" = "0" ] && return 1
    [ "$current" = "1" ] && return 1
    if [ "$current" = "$SESSION_PID" ]; then
      return 0
    fi
    depth=$((depth + 1))
  done
  return 1
}

# Without a session pid the session-scoped kill below is impossible, and guessing is unsafe. Fall
# back to the orphan-only sweeper when explicitly enabled; otherwise keep the historical no-op.
run_orphan_sweep_fallback() {
  case "$ORPHAN_SWEEP_MODE" in
    1|on|live)
      emit "action=orphan-sweep mode=live reason=no-session-pid"
      bash "$ORPHAN_SWEEPER_BIN" || true
      ;;
    dry-run|dryrun|dry)
      emit "action=orphan-sweep mode=dry-run reason=no-session-pid"
      bash "$ORPHAN_SWEEPER_BIN" --dry-run || true
      ;;
    *)
      emit "action=skip reason=no-session-pid"
      ;;
  esac
}

if [ -z "$SESSION_PID" ]; then
  run_orphan_sweep_fallback
  exit 0
fi
if ! kill -0 "$SESSION_PID" 2>/dev/null; then
  emit "action=skip reason=session-pid-not-alive session_pid=$SESSION_PID"
  exit 0
fi

append_descendants "$SESSION_PID"
emit "action=start session_pid=$SESSION_PID descendants=${#descendants[@]}"

if [ "${#descendants[@]}" -gt 0 ]; then
  for ((i=${#descendants[@]} - 1; i >= 0; i--)); do
    pid="${descendants[i]}"
    cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
    [ -n "$cmd" ] || continue
    if is_target_command "$cmd"; then
      if ! is_descendant_of_session "$pid"; then
        emit "action=skip-kill reason=ancestry-not-confirmed pid=$pid matched_by=name ancestor_ok=no command=$cmd"
        continue
      fi
      emit "action=kill signal=TERM pid=$pid matched_by=name ancestor_ok=yes command=$cmd"
      if ! kill -15 "$pid" 2>/dev/null; then
        emit "action=kill-failed signal=TERM pid=$pid"
        EXIT_CODE=1
      fi
    fi
  done
fi

emit "action=summary session_pid=$SESSION_PID exit_code=$EXIT_CODE"
exit "$EXIT_CODE"
