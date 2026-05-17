#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
INPUT_FILE="$(mktemp "${TMPDIR:-/tmp}/speckit-copilot-session-start.XXXXXX")"
trap 'rm -f "$INPUT_FILE"' EXIT

cat > "$INPUT_FILE"

cd "$REPO_ROOT"
if [ -f ".opencode/skills/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js" ]; then
  node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js < "$INPUT_FILE"
else
  printf '%s\n' 'Session context received. Current state:'
  printf '%s\n' ''
  printf '%s\n' '- Memory: startup summary only (resume on demand)'
  printf '%s\n' '- Code Graph: unavailable'
  printf '%s\n' '- CocoIndex: unknown'
  printf '%s\n' ''
  printf '%s\n' 'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.'
fi

if [ -x "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh" ]; then
  /Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionStart < "$INPUT_FILE" >/dev/null 2>/dev/null || true
fi
