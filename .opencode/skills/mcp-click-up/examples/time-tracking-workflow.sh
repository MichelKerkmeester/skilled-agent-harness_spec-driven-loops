#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-click-up :: Time Tracking Workflow
# Manages cupt time tracking: start, stop, log, and verify timer state
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    echo "[time-track] ⚠ Exited with error code: $exit_code"
    echo "[time-track]   Check if a timer is still running: cupt time status"
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

require_cupt() {
  if ! command -v cupt &>/dev/null; then
    error "cupt not found. Install: bash .opencode/skills/mcp-click-up/scripts/install.sh"
    exit 1
  fi
  if ! cupt status &>/dev/null; then
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

  cupt time start "$task_id"
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
  cupt time stop
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

  cupt time add "$task_id" "$duration"
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
