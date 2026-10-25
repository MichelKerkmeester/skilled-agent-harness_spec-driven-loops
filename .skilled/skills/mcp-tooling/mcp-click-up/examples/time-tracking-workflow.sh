#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: TIME TRACKING WORKFLOW
# ───────────────────────────────────────────────────────────────
# Manages cupt time tracking: start, stop, log and verify timer state.
#
# Usage: time-tracking-workflow.sh {start <task_id>|stop|log <task_id> <dur>|status}
#
# Exit Codes:
#   0 - Command succeeded, or usage was printed
#   1 - cupt missing or not authenticated, invalid arguments, a timer already
#       running or a cupt call that reported an error
#   other - a cupt call failed and its own status is passed through
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    echo "[time-track] ⚠ Exited with error code: $exit_code" >&2
    echo "[time-track]   Check if a timer is still running: cupt time status" >&2
  fi
}
trap cleanup EXIT INT TERM

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo "[time-track] → $*"; }
success() { echo "[time-track] ✓ $*"; }
warn()    { echo "[time-track] ⚠ $*"; }
error()   { echo "[time-track] ✗ $*" >&2; }

usage() {
  cat <<EOF
Usage: $(basename "$0") <command> [args]

Commands:
  start <task_id>         Start timer on task
  stop                    Stop current timer
  log <task_id> <dur>     Log time manually (e.g., 1h30m, 45m, 2h)
  status                  Show current timer state

Examples:
  $(basename "$0") start abc123
  $(basename "$0") stop
  $(basename "$0") log abc123 1h30m
  $(basename "$0") status
EOF
}

# cupt reports API failures such as an invalid token as "ERROR: ..." on
# stderr and still exits 0, so its exit status alone cannot be trusted.
cupt_checked() {
  local err rc=0
  { err="$(cupt "$@" 2>&1 >&3 3>&-)"; } 3>&1 || rc=$?
  if [[ -n "$err" ]]; then printf '%s\n' "$err" >&2; fi
  if [[ $rc -ne 0 ]]; then return "$rc"; fi
  if [[ "$err" == *ERROR* ]]; then return 1; fi
  return 0
}

require_cupt() {
  if ! command -v cupt &>/dev/null; then
    error "cupt not found. Install: bash $SCRIPT_DIR/../scripts/install.sh"
    exit 1
  fi
  if ! cupt_checked status >/dev/null 2>&1; then
    error "cupt authentication failed. Run: cupt auth"
    exit 1
  fi
}

# ── Commands ──────────────────────────────────────────────────────────────────
cmd_start() {
  local task_id="$1"

  require_cupt

  # Check if a timer is already running
  local current_status
  current_status="$(cupt time status 2>/dev/null || echo "no timer")"

  if echo "$current_status" | grep -qi "running"; then
    warn "A timer is already running:"
    echo "$current_status"
    echo ""
    warn "Stop it first: $(basename "$0") stop"
    exit 1
  fi

  # Show task info before starting
  info "Starting timer on task: $task_id"
  cupt show "$task_id" --json 2>/dev/null | jq -r '"Task: \(.name) [\(.status.status)]"' || true

  if ! cupt_checked time start "$task_id"; then
    error "Could not start the timer on: $task_id"
    exit 1
  fi
  success "Timer started on: $task_id"
  echo ""
  echo "  Stop when done: $(basename "$0") stop"
  echo "  Check status:   $(basename "$0") status"
}

cmd_stop() {
  require_cupt

  # Check if a timer is running
  local current_status
  current_status="$(cupt time status 2>/dev/null || echo "no timer")"

  if ! echo "$current_status" | grep -qi "running"; then
    warn "No timer is currently running."
    cupt time status
    exit 0
  fi

  info "Stopping timer..."
  if ! cupt_checked time stop; then
    error "Could not stop the timer"
    exit 1
  fi
  success "Timer stopped and logged"

  # Show final status
  cupt time status
}

cmd_log() {
  local task_id="$1"
  local duration="$2"

  require_cupt

  # Validate duration format
  if ! echo "$duration" | grep -qE '^[0-9]+h([0-9]+m)?$|^[0-9]+m$'; then
    error "Invalid duration format: $duration"
    error "Use: 1h30m, 45m, 2h, 30m"
    exit 1
  fi

  # Show task info before logging
  info "Logging $duration on task: $task_id"
  cupt show "$task_id" --json 2>/dev/null | jq -r '"Task: \(.name) [\(.status.status)]"' || true

  if ! cupt_checked time add "$task_id" "$duration"; then
    error "Could not log $duration to: $task_id"
    exit 1
  fi
  success "Logged $duration to task: $task_id"
}

cmd_status() {
  require_cupt

  info "Current timer state:"
  cupt time status
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  if [[ $# -eq 0 ]]; then
    usage
    exit 0
  fi

  local command="$1"
  shift

  case "$command" in
    start)
      if [[ $# -lt 1 ]]; then
        error "start requires a task_id"
        usage
        exit 1
      fi
      cmd_start "$1"
      ;;
    stop)
      cmd_stop
      ;;
    log)
      if [[ $# -lt 2 ]]; then
        error "log requires task_id and duration (e.g., log abc123 1h30m)"
        usage
        exit 1
      fi
      cmd_log "$1" "$2"
      ;;
    status)
      cmd_status
      ;;
    --help|-h|help)
      usage
      ;;
    *)
      error "Unknown command: $command"
      usage
      exit 1
      ;;
  esac
}

main "$@"
