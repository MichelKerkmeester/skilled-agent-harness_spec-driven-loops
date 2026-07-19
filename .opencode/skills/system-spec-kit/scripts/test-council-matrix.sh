#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)"; then
  :
else
  REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
fi

cd "$REPO_ROOT"

npm run --prefix .opencode/skills/system-spec-kit/mcp-server test:council
python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/deep-ai-council
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill --strict

printf '\033[32mCouncil matrix passed: vitest, sk-doc, and strict parent spec validation are green.\033[0m\n'
