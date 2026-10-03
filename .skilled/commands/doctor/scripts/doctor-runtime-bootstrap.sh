#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCTOR RUNTIME BOOTSTRAP
# ───────────────────────────────────────────────────────────────
# Prepares the system-spec-kit runtime before /doctor:rebuild asks OpenCode for
# MCP tools: moves a legacy .opencode/skill directory to .opencode/skills,
# installs the workspace dependencies and builds @spec-kit/runtime plus
# @spec-kit/cli when their dist helpers are missing. Every terminal path except
# bad arguments and a missing .opencode directory writes the state file.
#
# Usage: doctor-runtime-bootstrap.sh [--root <workspace>] [--json]
#
# Environment:
#   DOCTOR_BOOTSTRAP_LOCK  Lock directory. Defaults to
#                          .doctor-rebuild.bootstrap.lock in the advisor database dir.
#
# Exit Codes:
#   0 - Runtime ready (state status=complete)
#   1 - Bootstrap failed (state status=failed), or no .opencode directory
#   2 - Bad arguments
#   3 - Another bootstrap holds the lock (state status=busy)
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENTS
# ───────────────────────────────────────────────────────────────

show_help() {
  cat <<'HELP'
Usage: bash .skilled/commands/doctor/scripts/doctor-runtime-bootstrap.sh [--root <workspace>] [--json]

Moves a legacy .opencode/skill directory to .opencode/skills when present (in
this repository .opencode/skills is a symlink to .skilled/skills), installs
system-spec-kit workspace dependencies, and builds the @spec-kit/runtime and
@spec-kit/cli workspaces /doctor:rebuild needs.

State: .opencode/skills/system-skill-advisor/runtime/database/.doctor-rebuild.bootstrap.json
Lock:  .doctor-rebuild.bootstrap.lock beside the state file, or $DOCTOR_BOOTSTRAP_LOCK

Exit codes:
  0  runtime ready (status=complete)
  1  bootstrap failed (status=failed), or no .opencode directory
  2  bad arguments
  3  another bootstrap holds the lock (status=busy)
HELP
}

ROOT=""
JSON_MODE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --root)
      if [[ $# -lt 2 ]]; then
        echo "doctor-runtime-bootstrap: --root requires a path" >&2
        exit 2
      fi
      ROOT="$2"
      shift 2
      ;;
    --json)
      JSON_MODE=true
      shift
      ;;
    --help|-h)
      show_help
      exit 0
      ;;
    *)
      echo "doctor-runtime-bootstrap: unknown option: $1" >&2
      exit 2
      ;;
  esac
done

# ───────────────────────────────────────────────────────────────
# 2. PATHS
# ───────────────────────────────────────────────────────────────

ROOT="$(cd "${ROOT:-.}" && pwd)"
OPENCODE_DIR="$ROOT/.opencode"
SKILLS_DIR="$OPENCODE_DIR/skills"
LEGACY_SKILL_DIR="$OPENCODE_DIR/skill"
KIT_DIR="$SKILLS_DIR/system-spec-kit"
# Runtime state for /doctor:rebuild. It lives in the advisor's database directory
# because that one is tracked and gitignore-managed; the spec-kit runtime/database
# directory that used to hold it left with its server and is absent on a fresh clone.
DB_DIR="$SKILLS_DIR/system-skill-advisor/runtime/database"
STATE_FILE="$DB_DIR/.doctor-rebuild.bootstrap.json"
# Per workspace, so worktrees and users never share one lock.
LOCK_DIR="${DOCTOR_BOOTSTRAP_LOCK:-$DB_DIR/.doctor-rebuild.bootstrap.lock}"
GRAPH_BACKFILL_DIST="$KIT_DIR/runtime/cli/dist/graph/backfill-graph-metadata.js"
DESCRIPTION_DIST="$KIT_DIR/runtime/cli/dist/spec-folder/generate-description.js"

started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
actions_file="$(mktemp "${TMPDIR:-/tmp}/doctor-runtime-bootstrap-actions.XXXXXX")"
restart_required=false
lock_held=false

# ───────────────────────────────────────────────────────────────
# 3. STATE AND OUTPUT
# ───────────────────────────────────────────────────────────────

cleanup() {
  rm -f "$actions_file"
  if [[ "$lock_held" == true ]]; then
    rm -rf "$LOCK_DIR"
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

record_action() {
  printf '%s\n' "$1" >> "$actions_file"
}

_json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/\\r}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

# Write the state file without node, so a missing toolchain still leaves a record
# Args: $1=status $2=message (optional)
finish_state() {
  local status="$1" message="${2:-}" ended_at action separator=""
  ended_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  mkdir -p "$DB_DIR"
  {
    printf '{\n'
    printf '  "command": "/doctor:rebuild",\n'
    printf '  "phase": "runtime-bootstrap",\n'
    printf '  "start": "%s",\n' "$started_at"
    printf '  "end": "%s",\n' "$ended_at"
    printf '  "status": "%s",\n' "$(_json_escape "$status")"
    printf '  "restart_required": %s,\n' "$restart_required"
    printf '  "actions": ['
    while IFS= read -r action; do
      [[ -n "$action" ]] || continue
      printf '%s\n    "%s"' "$separator" "$(_json_escape "$action")"
      separator=","
    done < "$actions_file"
    if [[ -n "$separator" ]]; then
      printf '\n  ]'
    else
      printf ']'
    fi
    if [[ -n "$message" ]]; then
      printf ',\n  "message": "%s"' "$(_json_escape "$message")"
    fi
    printf '\n}\n'
  } > "$STATE_FILE.tmp.$$"
  mv "$STATE_FILE.tmp.$$" "$STATE_FILE"
}

emit() {
  if [[ "$JSON_MODE" == true ]]; then
    cat "$STATE_FILE"
  else
    printf '%s\n' "$1"
  fi
}

fail() {
  local message="$1"
  finish_state "failed" "$message"
  emit "BOOTSTRAP_FAILED restart_required=$restart_required state_log=$STATE_FILE message=$message"
  exit 1
}

# ───────────────────────────────────────────────────────────────
# 4. LOCKING
# ───────────────────────────────────────────────────────────────

# Take the lock with an atomic mkdir, which needs no flock binary and never
# follows a planted symlink. A lock whose recorded holder no longer runs was
# left by a killed bootstrap and is reclaimed once.
# Returns: 0 when held, 1 when another live bootstrap holds it
acquire_lock() {
  local holder=""
  mkdir -p "${LOCK_DIR%/*}"
  if ! mkdir "$LOCK_DIR" 2>/dev/null; then
    [[ -d "$LOCK_DIR" ]] || fail "cannot create lock directory $LOCK_DIR"
    holder="$(cat "$LOCK_DIR/pid" 2>/dev/null || true)"
    if [[ ! "$holder" =~ ^[0-9]+$ ]] || kill -0 "$holder" 2>/dev/null; then
      return 1
    fi
    rm -rf "$LOCK_DIR"
    mkdir "$LOCK_DIR" 2>/dev/null || return 1
    record_action "reclaimed a stale bootstrap lock left by process $holder"
  fi
  lock_held=true
  printf '%s\n' "$$" > "$LOCK_DIR/pid"
}

# ───────────────────────────────────────────────────────────────
# 5. LEGACY LAYOUT
# ───────────────────────────────────────────────────────────────

# Move a real legacy .opencode/skill directory to .opencode/skills. This runs
# before anything creates paths under .opencode/skills, otherwise a legacy
# layout would look like a stray copy and be backed up instead of promoted. A
# layout move alone never forces a restart; a fresh install still restarts via
# the build step.
migrate_legacy_layout() {
  local backup
  if [[ ! -d "$LEGACY_SKILL_DIR" || -L "$LEGACY_SKILL_DIR" ]]; then
    return 0
  fi
  if [[ ! -e "$SKILLS_DIR" && ! -L "$SKILLS_DIR" ]]; then
    mv "$LEGACY_SKILL_DIR" "$SKILLS_DIR"
    record_action "promoted legacy .opencode/skill directory to .opencode/skills"
  elif [[ -d "$SKILLS_DIR" ]]; then
    backup="$OPENCODE_DIR/skill_legacy_backup_$(date -u +%Y%m%dT%H%M%SZ)"
    mv "$LEGACY_SKILL_DIR" "$backup"
    record_action "moved stray legacy .opencode/skill directory to ${backup#"$ROOT"/}"
  fi
}

# ───────────────────────────────────────────────────────────────
# 6. BUILD
# ───────────────────────────────────────────────────────────────

# Install dependencies and build both workspaces from the kit directory. Each
# step returns explicitly because errexit is off inside a tested function.
run_build() {
  cd "$KIT_DIR" || return 1
  if [[ -f package-lock.json ]]; then
    npm ci --no-fund --silent || return 1
  else
    npm install --no-fund --silent || return 1
  fi
  if ! npm audit --audit-level=high; then
    printf '[doctor-bootstrap] WARNING: npm audit found high-severity issues. Continuing bootstrap; investigate at next opportunity.\n' >&2
  fi
  npm run build --workspace=@spec-kit/runtime || return 1
  npm run build --workspace=@spec-kit/cli || return 1
}

# ───────────────────────────────────────────────────────────────
# 7. MAIN
# ───────────────────────────────────────────────────────────────

if [[ ! -d "$OPENCODE_DIR" ]]; then
  echo "doctor-runtime-bootstrap: .opencode directory not found under $ROOT" >&2
  exit 1
fi

migrate_legacy_layout
mkdir -p "$DB_DIR"

if ! acquire_lock; then
  printf '[doctor-bootstrap] Another bootstrap holds the lock %s. Rerun after it finishes, or remove the lock if no bootstrap is running.\n' "$LOCK_DIR" >&2
  finish_state "busy" "another bootstrap holds the lock $LOCK_DIR"
  emit "BOOTSTRAP_BUSY restart_required=$restart_required state_log=$STATE_FILE lock=$LOCK_DIR"
  exit 3
fi

if [[ ! -d "$KIT_DIR" ]]; then
  fail "system-spec-kit not found at $KIT_DIR"
fi
if ! command -v node >/dev/null 2>&1; then
  fail "node is required to build system-spec-kit"
fi
if ! command -v npm >/dev/null 2>&1; then
  fail "npm is required to build system-spec-kit"
fi

if [[ ! -f "$GRAPH_BACKFILL_DIST" || ! -f "$DESCRIPTION_DIST" ]]; then
  record_action "detected missing runtime/cli/dist migration helpers"
  # Under --json, stdout carries only the state document.
  if [[ "$JSON_MODE" == true ]]; then
    ( run_build ) >&2 || fail "dependency install or build failed in $KIT_DIR"
  else
    ( run_build ) || fail "dependency install or build failed in $KIT_DIR"
  fi
  restart_required=true
  record_action "installed dependencies and built @spec-kit/runtime plus @spec-kit/cli"
fi

[[ -f "$GRAPH_BACKFILL_DIST" ]] || fail "runtime/cli/dist/graph/backfill-graph-metadata.js is still missing after bootstrap"
[[ -f "$DESCRIPTION_DIST" ]] || fail "runtime/cli/dist/spec-folder/generate-description.js is still missing after bootstrap"

finish_state "complete" ""
emit "BOOTSTRAP_READY restart_required=$restart_required state_log=$STATE_FILE"
