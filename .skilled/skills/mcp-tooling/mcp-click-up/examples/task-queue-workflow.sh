#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: TASK QUEUE WORKFLOW
# ───────────────────────────────────────────────────────────────
# Processes a tagged ClickUp work queue: inspect, dry-run, complete, hand off.
#
# Usage: task-queue-workflow.sh [--tag X] [--dry-run]
#
# Exit Codes:
#   0 - Queue processed or empty, or a dry-run finished
#   1 - Invalid arguments, cupt or jq missing, a cupt call reported an error
#       (including the auth preflight) or a task failed to complete
#   other - a cupt or jq call failed and its own status is passed through
# shellcheck disable=SC1010 # "cupt done" is a cupt subcommand, not the loop keyword
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROCESSING_TAG="ai_ready"             # Tag to process (default: ai_ready)
REVIEW_TAG="needs_review"             # Tag to apply after processing
AGENT_NOTE="Processed by AI agent"   # Note added on completion
DRY_RUN=false

# ── Argument Parsing ──────────────────────────────────────────────────────────
# A bare first argument is still read as the tag, as earlier versions did.
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag=*) PROCESSING_TAG="${1#*=}" ;;
    --tag)
      if [[ $# -lt 2 ]]; then
        echo "[task-queue] ✗ --tag needs a value" >&2
        exit 1
      fi
      PROCESSING_TAG="$2"
      shift
      ;;
    --dry-run) DRY_RUN=true ;;
    -*)
      echo "[task-queue] ✗ Unknown option: $1" >&2
      echo "Usage: $(basename "$0") [--tag X] [--dry-run]" >&2
      exit 1
      ;;
    *) PROCESSING_TAG="$1" ;;
  esac
  shift
done

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    echo "[task-queue] ⚠ Exited with error code: $exit_code" >&2
  fi
}
trap cleanup EXIT INT TERM

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo "[task-queue] → $*"; }
success() { echo "[task-queue] ✓ $*"; }
warn()    { echo "[task-queue] ⚠ $*"; }
error()   { echo "[task-queue] ✗ $*" >&2; }

require_cmd() {
  if ! command -v "$1" &>/dev/null; then
    error "Required command not found: $1"
    error "Install cupt: bash $SCRIPT_DIR/../scripts/install.sh"
    exit 1
  fi
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

# ── Preflight ─────────────────────────────────────────────────────────────────
preflight() {
  require_cmd cupt
  require_cmd jq

  info "Running preflight checks..."
  if ! cupt_checked status >/dev/null 2>&1; then
    error "cupt authentication failed. Run: cupt auth"
    exit 1
  fi
  success "Authenticated and connected"
}

# ── Fetch Work Queue ──────────────────────────────────────────────────────────
# Runs in the main shell, not in $(...), so its exit on an empty queue ends
# the script and its log lines never mix with the JSON it stores.
QUEUE_JSON=""
QUEUE_COUNT=0

fetch_queue() {
  info "Fetching tasks tagged: $PROCESSING_TAG"

  if ! QUEUE_JSON="$(cupt_checked list --tag "$PROCESSING_TAG" --all --json)"; then
    error "Could not fetch the queue for tag '$PROCESSING_TAG'"
    exit 1
  fi
  QUEUE_COUNT="$(printf '%s' "$QUEUE_JSON" | jq 'length')"

  if [[ "$QUEUE_COUNT" -eq 0 ]]; then
    warn "Queue empty. No tasks tagged '$PROCESSING_TAG'."
    echo ""
    echo "  Before escalating:"
    echo "  → Check tag spelling: cupt list --all --json | jq '.[].tags[].name' | sort -u"
    echo "  → Try wider scope:    cupt list --all --json"
    echo "  → Verify teams:       cupt teams"
    exit 0
  fi

  info "Found $QUEUE_COUNT task(s) in queue"
}

# ── Inspect Task ──────────────────────────────────────────────────────────────
inspect_task() {
  local task_id="$1"
  local task_name="$2"

  info "Inspecting: [$task_id] $task_name"

  # Get full task details
  cupt_checked show "$task_id" --notes

  # Get context (parent + siblings)
  cupt context "$task_id" 2>/dev/null || true

  # Discover status schema for this task's list
  info "Status schema for task's list:"
  cupt_checked statuses "$task_id"
}

# ── Dry-Run Completion ────────────────────────────────────────────────────────
dry_run_task() {
  local task_id="$1"

  info "Dry-run: cupt done $task_id --dry-run"
  cupt_checked done "$task_id" --dry-run
}

# ── Complete Task ─────────────────────────────────────────────────────────────
complete_task() {
  local task_id="$1"
  local task_name="$2"

  if [[ "$DRY_RUN" == "true" ]]; then
    warn "DRY-RUN mode: skipping actual completion for [$task_id]"
    return 0
  fi

  info "Completing: [$task_id] $task_name"
  if ! cupt_checked done "$task_id" --note "$AGENT_NOTE"; then
    return 1
  fi
  success "Completed: $task_name"
}

# ── Handoff Task ──────────────────────────────────────────────────────────────
handoff_task() {
  local task_id="$1"
  local task_name="$2"

  if [[ "$DRY_RUN" == "true" ]]; then
    warn "DRY-RUN mode: skipping tag changes for [$task_id]"
    return 0
  fi

  # Remove processing tag, add review tag
  cupt tag remove "$task_id" "$PROCESSING_TAG" 2>/dev/null || true
  cupt tag add "$task_id" "$REVIEW_TAG" 2>/dev/null || true

  if ! cupt_checked note "$task_id" "Handoff complete. Moved from '$PROCESSING_TAG' to '$REVIEW_TAG' for human review."; then
    return 1
  fi
  success "Handoff complete: $task_name → $REVIEW_TAG"
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo "══════════════════════════════════════════"
  echo " Task Queue Workflow"
  echo " Tag: $PROCESSING_TAG | Dry-run: $DRY_RUN"
  echo "══════════════════════════════════════════"

  preflight

  fetch_queue

  # Collect task IDs and names
  local task_ids=()
  local task_names=()
  while IFS= read -r id; do
    task_ids+=("$id")
  done < <(printf '%s' "$QUEUE_JSON" | jq -r '.[].id')
  while IFS= read -r name; do
    task_names+=("$name")
  done < <(printf '%s' "$QUEUE_JSON" | jq -r '.[].name')

  echo ""
  info "=== Phase 1: Inspect all tasks ==="
  for i in "${!task_ids[@]}"; do
    inspect_task "${task_ids[$i]}" "${task_names[$i]}"
    echo ""
  done

  echo ""
  info "=== Phase 2: Dry-run all completions ==="
  for i in "${!task_ids[@]}"; do
    dry_run_task "${task_ids[$i]}"
  done

  echo ""
  if [[ "$DRY_RUN" == "true" ]]; then
    warn "DRY-RUN complete. Re-run without --dry-run to complete tasks."
    exit 0
  fi

  # Confirm before proceeding
  echo ""
  echo "  About to complete $QUEUE_COUNT task(s). Press Enter to continue (Ctrl+C to abort)..."
  read -r

  info "=== Phase 3: Complete and hand off ==="
  local completed=0
  local failed=0

  for i in "${!task_ids[@]}"; do
    if complete_task "${task_ids[$i]}" "${task_names[$i]}"; then
      ((completed++)) || true
      if ! handoff_task "${task_ids[$i]}" "${task_names[$i]}"; then
        error "Completed but handoff failed: ${task_names[$i]}"
        ((failed++)) || true
      fi
    else
      error "Failed to complete: ${task_names[$i]}"
      ((failed++)) || true
    fi
    echo ""
  done

  echo ""
  echo "══════════════════════════════════════════"
  echo " Summary"
  echo " Completed: $completed | Failed: $failed"
  echo "══════════════════════════════════════════"

  if [[ $failed -gt 0 ]]; then
    exit 1
  fi
}

main
