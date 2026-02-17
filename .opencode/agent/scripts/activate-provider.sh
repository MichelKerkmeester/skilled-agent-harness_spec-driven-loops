#!/usr/bin/env bash

# ------------------------------------------------------------------------------
# COMPONENT: AGENT PROVIDER ACTIVATION
# ------------------------------------------------------------------------------
# Activates provider profile files into `.opencode/agent/*.md` runtime files.
#
# Usage: activate-provider.sh <copilot|chatgpt> [--force] [--dry-run]
#
# Exit Codes:
#   0 - Success
#   2 - Invalid or missing arguments
#   3 - Missing runtime/profile path or required profile files
#   4 - Runtime files are dirty and --force was not provided
#   5 - Verification failed and backup restore was triggered

set -euo pipefail
IFS=$'\n\t'

# ------------------------------------------------------------------------------
# 1. CLI HELP
# ------------------------------------------------------------------------------

usage() {
  cat <<'EOF'
Usage: activate-provider.sh <copilot|chatgpt> [--force] [--dry-run]

Activates a provider profile into .opencode/agent/*.md while keeping that
runtime path as the single source used by commands/orchestration.

Options:
  --force    Overwrite runtime agent files even when they are git-dirty
  --dry-run  Print what would change without writing files
  -h, --help Show this help
EOF
}

# ------------------------------------------------------------------------------
# 2. ARGUMENT PARSING
# ------------------------------------------------------------------------------

PROVIDER=""
FORCE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    copilot|chatgpt)
      if [[ -n "$PROVIDER" ]]; then
        echo "ERROR: Provider already set to '$PROVIDER'" >&2
        exit 2
      fi
      PROVIDER="$1"
      ;;
    --force)
      FORCE=true
      ;;
    --dry-run)
      DRY_RUN=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument '$1'" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

if [[ -z "$PROVIDER" ]]; then
  echo "ERROR: Missing provider (copilot|chatgpt)" >&2
  usage >&2
  exit 2
fi

# ------------------------------------------------------------------------------
# 3. PATH RESOLUTION AND INPUT VALIDATION
# ------------------------------------------------------------------------------

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
fi

AGENT_ROOT="$REPO_ROOT/.opencode/agent"
SRC_DIR="$AGENT_ROOT/$PROVIDER"
BACKUP_ROOT="$AGENT_ROOT/.provider-backups"
MARKER_FILE="$AGENT_ROOT/.active-provider"

declare -ar MANAGED=(context debug handover orchestrate research review speckit write)

if [[ ! -d "$AGENT_ROOT" ]]; then
  echo "ERROR: Agent root not found: $AGENT_ROOT" >&2
  exit 3
fi

if [[ ! -d "$SRC_DIR" ]]; then
  echo "ERROR: Provider profile folder not found: $SRC_DIR" >&2
  exit 3
fi

for agent in "${MANAGED[@]}"; do
  if [[ ! -f "$SRC_DIR/$agent.md" ]]; then
    echo "ERROR: Missing profile file: $SRC_DIR/$agent.md" >&2
    exit 3
  fi
done

RUNTIME_PATHS=()
for agent in "${MANAGED[@]}"; do
  RUNTIME_PATHS+=(".opencode/agent/$agent.md")
done

if [[ "$FORCE" != true && "$DRY_RUN" != true ]]; then
  DIRTY_OUTPUT="$(git -C "$REPO_ROOT" status --porcelain -- "${RUNTIME_PATHS[@]}" || true)"
  if [[ -n "$DIRTY_OUTPUT" ]]; then
    echo "ERROR: Runtime agent files have uncommitted changes." >&2
    echo "$DIRTY_OUTPUT" >&2
    echo "Re-run with --force to overwrite them." >&2
    exit 4
  fi
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/${TIMESTAMP}-${PROVIDER}-$$"

# ------------------------------------------------------------------------------
# 4. ACTIVATION EXECUTION
# ------------------------------------------------------------------------------

echo "Activating provider: $PROVIDER"
echo "Profile source: $SRC_DIR"
echo "Runtime target: $AGENT_ROOT/*.md"

if [[ "$DRY_RUN" == true ]]; then
  echo "[dry-run] Would create backup: $BACKUP_DIR"
  for agent in "${MANAGED[@]}"; do
    echo "[dry-run] Would copy: $SRC_DIR/$agent.md -> $AGENT_ROOT/$agent.md"
  done
  echo "[dry-run] Would verify all copied files"
  echo "[dry-run] Would write marker: $MARKER_FILE"
  exit 0
fi

mkdir -p "$BACKUP_DIR"
for agent in "${MANAGED[@]}"; do
  RUNTIME_FILE="$AGENT_ROOT/$agent.md"
  if [[ -f "$RUNTIME_FILE" ]]; then
    cp "$RUNTIME_FILE" "$BACKUP_DIR/$agent.md"
  fi
done

restore_backup() {
  # Restore previous runtime state when post-copy verification fails.
  local agent
  for agent in "${MANAGED[@]}"; do
    if [[ -f "$BACKUP_DIR/$agent.md" ]]; then
      cp "$BACKUP_DIR/$agent.md" "$AGENT_ROOT/$agent.md"
    fi
  done
}

set +e
for agent in "${MANAGED[@]}"; do
  cp "$SRC_DIR/$agent.md" "$AGENT_ROOT/$agent.md"
done

VERIFY_OK=true
for agent in "${MANAGED[@]}"; do
  if ! cmp -s "$SRC_DIR/$agent.md" "$AGENT_ROOT/$agent.md"; then
    VERIFY_OK=false
    echo "ERROR: Verification failed for $agent.md" >&2
  fi
done

if [[ "$VERIFY_OK" != true ]]; then
  echo "Activation failed. Restoring backup..." >&2
  restore_backup
  set -e
  exit 5
fi
set -e

printf '%s\n' "$PROVIDER" > "$MARKER_FILE"

echo "Activation complete. Active provider: $PROVIDER"
echo "Backup saved at: $BACKUP_DIR"
