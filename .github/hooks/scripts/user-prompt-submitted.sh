#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
INPUT_FILE="$(mktemp "${TMPDIR:-/tmp}/speckit-copilot-user-prompt.XXXXXX")"
trap 'rm -f "$INPUT_FILE"' EXIT

cat > "$INPUT_FILE"

cd "$REPO_ROOT"
if [ -f ".opencode/skills/system-spec-kit/runtime/dist/hooks/copilot/user-prompt-submit.js" ]; then
  node .opencode/skills/system-spec-kit/runtime/dist/hooks/copilot/user-prompt-submit.js < "$INPUT_FILE"
else
  # No compiled handler: answer the host with an empty hook response and touch
  # nothing in the repository. A hook fallback that rewrites a tracked document
  # would put unreviewed content into the working tree on every prompt.
  printf '{}\n'
fi
