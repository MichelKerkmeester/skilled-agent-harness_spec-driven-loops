#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
INPUT_FILE="$(mktemp "${TMPDIR:-/tmp}/speckit-copilot-user-prompt.XXXXXX")"
trap 'rm -f "$INPUT_FILE"' EXIT

cat > "$INPUT_FILE"

cd "$REPO_ROOT"
if [ -f ".opencode/skills/system-spec-kit/mcp-server/dist/hooks/copilot/user-prompt-submit.js" ]; then
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/copilot/user-prompt-submit.js < "$INPUT_FILE"
else
  INSTRUCTIONS_PATH="${SPECKIT_COPILOT_INSTRUCTIONS_PATH:-$REPO_ROOT/.github/copilot-instructions.md}"
  mkdir -p "$(dirname "$INSTRUCTIONS_PATH")"
  cat > "$INSTRUCTIONS_PATH" <<'EOF'
<!-- SPEC-KIT-COPILOT-CONTEXT:START -->
# Spec Kit Memory Auto-Generated Context

Active Advisor Brief: Copilot wrapper fallback active. Use `session_bootstrap()` or `session_resume()` for fresh context when needed.
<!-- SPEC-KIT-COPILOT-CONTEXT:END -->
EOF
  printf '{}\n'
fi
