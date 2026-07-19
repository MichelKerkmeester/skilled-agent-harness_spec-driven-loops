#!/usr/bin/env bash
# Prepare the system-spec-kit runtime before /doctor:update asks OpenCode for MCP tools.
set -euo pipefail

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
      cat <<'HELP'
Usage: bash .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh [--root <workspace>] [--json]

Migrates a legacy .opencode/skill directory into .opencode/skills when present,
installs system-spec-kit workspace dependencies, and builds the MCP server and
script runtimes needed by /doctor:update.
HELP
      exit 0
      ;;
    *)
      echo "doctor-runtime-bootstrap: unknown option: $1" >&2
      exit 2
      ;;
  esac
done

if [[ -z "$ROOT" ]]; then
  ROOT="$(pwd)"
fi
ROOT="$(cd "$ROOT" && pwd)"

OPENCODE_DIR="$ROOT/.opencode"
SKILLS_DIR="$OPENCODE_DIR/skills"
LEGACY_SKILL_DIR="$OPENCODE_DIR/skill"
KIT_DIR="$SKILLS_DIR/system-spec-kit"
DB_DIR="$KIT_DIR/mcp-server/database"
STATE_FILE="$DB_DIR/.doctor-update.bootstrap.json"
LOCK_FILE="/tmp/doctor-runtime-bootstrap.lock"
MCP_DIST="$KIT_DIR/mcp-server/dist/context-server.js"
GRAPH_BACKFILL_DIST="$KIT_DIR/scripts/dist/graph/backfill-graph-metadata.js"
DESCRIPTION_DIST="$KIT_DIR/scripts/dist/spec-folder/generate-description.js"

started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
actions_file="$(mktemp "${TMPDIR:-/tmp}/doctor-runtime-bootstrap-actions.XXXXXX")"
restart_required=false

finish_state() {
  local status="$1"
  local message="${2:-}"
  local ended_at
  ended_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

  mkdir -p "$DB_DIR"
  STARTED_AT="$started_at" \
  ENDED_AT="$ended_at" \
  STATUS="$status" \
  MESSAGE="$message" \
  RESTART_REQUIRED="$restart_required" \
  ACTIONS_FILE="$actions_file" \
  STATE_FILE="$STATE_FILE" \
  node <<'NODE'
const fs = require('fs');

const actions = fs.existsSync(process.env.ACTIONS_FILE)
  ? fs.readFileSync(process.env.ACTIONS_FILE, 'utf8').split('\n').filter(Boolean)
  : [];

const payload = {
  command: '/doctor:update',
  phase: 'runtime-bootstrap',
  start: process.env.STARTED_AT,
  end: process.env.ENDED_AT,
  status: process.env.STATUS,
  restart_required: process.env.RESTART_REQUIRED === 'true',
  actions,
};

if (process.env.MESSAGE) {
  payload.message = process.env.MESSAGE;
}

fs.writeFileSync(process.env.STATE_FILE, `${JSON.stringify(payload, null, 2)}\n`);
NODE
}

cleanup() {
  rm -f "$actions_file"
}
trap cleanup EXIT

record_action() {
  printf '%s\n' "$1" >> "$actions_file"
}

emit() {
  if [[ "$JSON_MODE" == true ]]; then
    node -e "const fs=require('fs'); process.stdout.write(fs.readFileSync(process.argv[1], 'utf8'))" "$STATE_FILE"
  else
    echo "$1"
  fi
}

fail() {
  local message="$1"
  finish_state "failed" "$message"
  emit "BOOTSTRAP_FAILED restart_required=$restart_required state_log=$STATE_FILE message=$message"
  exit 1
}

if [[ ! -d "$OPENCODE_DIR" ]]; then
  echo "doctor-runtime-bootstrap: .opencode directory not found under $ROOT" >&2
  exit 1
fi

mkdir -p "$DB_DIR"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  printf '[doctor-bootstrap] Another bootstrap is in progress (lock %s held). Exiting.\n' "$LOCK_FILE" >&2
  exit 0
fi

# Migrate a real legacy .opencode/skill directory into the canonical .opencode/skills
# layout. Every launcher and config resolves the plural path directly, so the singular
# .opencode/skill compatibility symlink is unnecessary. The bootstrap no longer creates it,
# and a layout move alone never forces a restart -- the old code recreated the shim whenever
# it was absent and looped restart_required, blocking the rebuild. A genuine fresh install
# still restarts via the dist build step below.
if [[ ! -d "$SKILLS_DIR" && -d "$LEGACY_SKILL_DIR" && ! -L "$LEGACY_SKILL_DIR" ]]; then
  mv "$LEGACY_SKILL_DIR" "$SKILLS_DIR"
  record_action "promoted legacy .opencode/skill directory to .opencode/skills"
elif [[ -d "$SKILLS_DIR" && -d "$LEGACY_SKILL_DIR" && ! -L "$LEGACY_SKILL_DIR" ]]; then
  backup="$OPENCODE_DIR/skill_legacy_backup_$(date -u +%Y%m%dT%H%M%SZ)"
  mv "$LEGACY_SKILL_DIR" "$backup"
  record_action "moved stray legacy .opencode/skill directory to ${backup#$ROOT/}"
fi

KIT_DIR="$SKILLS_DIR/system-spec-kit"
DB_DIR="$KIT_DIR/mcp-server/database"
STATE_FILE="$DB_DIR/.doctor-update.bootstrap.json"
MCP_DIST="$KIT_DIR/mcp-server/dist/context-server.js"
GRAPH_BACKFILL_DIST="$KIT_DIR/scripts/dist/graph/backfill-graph-metadata.js"
DESCRIPTION_DIST="$KIT_DIR/scripts/dist/spec-folder/generate-description.js"

if [[ ! -d "$KIT_DIR" ]]; then
  fail "system-spec-kit not found at $KIT_DIR"
fi

if ! command -v node >/dev/null 2>&1; then
  fail "node is required to build system-spec-kit"
fi
if ! command -v npm >/dev/null 2>&1; then
  fail "npm is required to build system-spec-kit"
fi

need_build=false
if [[ ! -f "$MCP_DIST" ]]; then
  need_build=true
  record_action "detected missing mcp-server/dist/context-server.js"
fi
if [[ ! -f "$GRAPH_BACKFILL_DIST" || ! -f "$DESCRIPTION_DIST" ]]; then
  need_build=true
  record_action "detected missing scripts/dist migration helpers"
fi

if [[ "$need_build" == true ]]; then
  if [[ "$JSON_MODE" == true ]]; then
    (
      cd "$KIT_DIR"
      if [[ -f package-lock.json ]]; then
        npm ci --no-fund --silent
      else
        npm install --no-fund --silent
      fi
      npm audit --audit-level=high || {
        printf '[doctor-bootstrap] WARNING: npm audit found high-severity issues. Continuing bootstrap; investigate at next opportunity.\n' >&2
      }
      npm run build --workspace=@spec-kit/mcp-server
      npm run build --workspace=@spec-kit/scripts
    ) >&2
  else
    (
      cd "$KIT_DIR"
      if [[ -f package-lock.json ]]; then
        npm ci --no-fund --silent
      else
        npm install --no-fund --silent
      fi
      npm audit --audit-level=high || {
        printf '[doctor-bootstrap] WARNING: npm audit found high-severity issues. Continuing bootstrap; investigate at next opportunity.\n' >&2
      }
      npm run build --workspace=@spec-kit/mcp-server
      npm run build --workspace=@spec-kit/scripts
    )
  fi
  restart_required=true
  record_action "installed dependencies and built @spec-kit/mcp-server plus @spec-kit/scripts"
fi

[[ -f "$MCP_DIST" ]] || fail "mcp-server/dist/context-server.js is still missing after bootstrap"
[[ -f "$GRAPH_BACKFILL_DIST" ]] || fail "scripts/dist/graph/backfill-graph-metadata.js is still missing after bootstrap"
[[ -f "$DESCRIPTION_DIST" ]] || fail "scripts/dist/spec-folder/generate-description.js is still missing after bootstrap"

finish_state "complete" ""
emit "BOOTSTRAP_READY restart_required=$restart_required state_log=$STATE_FILE"
