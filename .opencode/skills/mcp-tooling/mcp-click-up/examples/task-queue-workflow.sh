#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-click-up :: Task Queue Workflow
# Processes a tagged ClickUp work queue: inspect → dry-run → complete → handoff
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
PROCESSING_TAG="${1:-ai_ready}"       # Tag to process (default: ai_ready)
REVIEW_TAG="needs_review"             # Tag to apply after processing
AGENT_NOTE="Processed by AI agent"   # Note added on completion
DRY_RUN=false

# ── Argument Parsing ──────────────────────────────────────────────────────────
for arg in "$@"; do
  case "$arg" in
    --tag=*) PROCESSING_TAG="${arg#*=}" ;;
    --tag)   shift; PROCESSING_TAG="$1" ;;
    --dry-run) DRY_RUN=true ;;
  esac
done

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    echo "[task-queue] ⚠ Exited with error code: $exit_code"
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
    error "Install cupt: bash .opencode/skills/mcp-click-up/scripts/install.sh"
    exit 1
  fi
}

# ── Preflight ─────────────────────────────────────────────────────────────────
preflight() {
  require_cmd cupt
  require_cmd jq

  info "Running preflight checks..."
  if ! cupt status &>/dev/null; then
    error "cupt authentication failed. Run: cupt auth"
    exit 1
  fi
  success "Authenticated and connected"
}

# ── Fetch Work Queue ──────────────────────────────────────────────────────────
fetch_queue() {
  info "Fetching tasks tagged: $PROCESSING_TAG"

  local tasks
  tasks="$(cupt list --tag "$PROCESSING_TAG" --all --json 2>/dev/null)"

  local count
  count="$(echo "$tasks" | jq 'length')"

  if [[ "$count" -eq 0 ]]; then
    warn "Queue empty. No tasks tagged '$PROCESSING_TAG'."
    echo ""
    echo "  Before escalating:"
    echo "  → Check tag spelling: cupt list --all --json | jq '.[].tags[].name' | sort -u"
    echo "  → Try wider scope:    cupt list --all --json"
    echo "  → Verify teams:       cupt teams"
    exit 0
  fi

  info "Found $count task(s) in queue"
  echo "$tasks"
}

# ── Inspect Task ──────────────────────────────────────────────────────────────
inspect_task() {
  local task_id="$1"
  local task_name="$2"

  info "Inspecting: [$task_id] $task_name"

  # Get full task details
  cupt show "$task_id" --notes --json > /tmp/cupt_task_detail.json 2>/dev/null

  # Get context (parent + siblings)
  cupt context "$task_id" 2>/dev/null || true

  # Discover status schema for this task's list
  info "Status schema for task's list:"
  cupt statuses "$task_id"
}

# ── Dry-Run Completion ────────────────────────────────────────────────────────
dry_run_task() {
  local task_id="$1"

  info "Dry-run: cupt done $task_id --dry-run"
  cupt done "$task_id" --dry-run
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
  cupt done "$task_id" --note "$AGENT_NOTE"
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

  cupt note "$task_id" "Handoff complete. Moved from '$PROCESSING_TAG' to '$REVIEW_TAG' for human review."
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

  # Fetch the queue
  local tasks
  tasks="$(fetch_queue)"
  local count
  count="$(echo "$tasks" | jq 'length')"

  # Collect task IDs and names
  local task_ids=()
  local task_names=()
  while IFS= read -r id; do
    task_ids+=("$id")
  done < <(echo "$tasks" | jq -r '.[].id')
  while IFS= read -r name; do
    task_names+=("$name")
  done < <(echo "$tasks" | jq -r '.[].name')

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
  echo "  About to complete $count task(s). Press Enter to continue (Ctrl+C to abort)..."
  read -r

  info "=== Phase 3: Complete and hand off ==="
  local completed=0
  local failed=0

  for i in "${!task_ids[@]}"; do
    if complete_task "${task_ids[$i]}" "${task_names[$i]}"; then
      handoff_task "${task_ids[$i]}" "${task_names[$i]}"
      ((completed++)) || true
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
}

main "$@"
