#!/usr/bin/env bash
# Clean up MCP helper descendants owned by the current Claude Code session.
#
# This script is intentionally session-scoped. It walks descendants of
# CLAUDE_SESSION_PID when present, otherwise the hook process PPID, and never
# scans unrelated sibling sessions.

set -euo pipefail

SESSION_PID="${CLAUDE_SESSION_PID:-${PPID:-}}"
LOG_PATH="${CLAUDE_SESSION_CLEANUP_LOG_PATH:-${HOME:-/tmp}/.local/share/claude-stop-hook.log}"
EXIT_CODE=0
descendants=()

emit() {
  local line
  line="$(date '+%Y-%m-%dT%H:%M:%S%z') $*"
  printf '%s\n' "$line"
  if [ -n "$LOG_PATH" ]; then
    mkdir -p "$(dirname "$LOG_PATH")" 2>/dev/null || true
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
    *"system-spec-kit/mcp_server/dist/context-server.js"*|\
    *"system-skill-advisor/mcp_server/dist/"*"advisor-server.js"*|\
    *"system-code-graph/mcp_server/dist/index.js"*|\
    *"mcp-code-mode/mcp_server/dist/index.js"*|\
    *"@modelcontextprotocol/server-sequential-thinking"*|\
    *"server-sequential-thinking"*|\
    *"clickup-mcp-server"*)
      return 0
      ;;
  esac
  return 1
}

if [ -z "$SESSION_PID" ] || ! kill -0 "$SESSION_PID" 2>/dev/null; then
  emit "action=skip reason=missing-session-pid session_pid=${SESSION_PID:-}"
  exit 0
fi

append_descendants "$SESSION_PID"
emit "action=start session_pid=$SESSION_PID descendants=${#descendants[@]}"

if [ "${#descendants[@]}" -gt 0 ]; then
  for pid in "${descendants[@]}"; do
    cmd="$(ps -p "$pid" -o command= 2>/dev/null || true)"
    [ -n "$cmd" ] || continue
    if is_target_command "$cmd"; then
      emit "action=kill signal=TERM pid=$pid command=$cmd"
      if ! kill -15 "$pid" 2>/dev/null; then
        emit "action=kill-failed signal=TERM pid=$pid"
        EXIT_CODE=1
      fi
    fi
  done
fi

emit "action=summary session_pid=$SESSION_PID exit_code=$EXIT_CODE"
exit "$EXIT_CODE"
