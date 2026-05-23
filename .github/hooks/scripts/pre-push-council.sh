#!/usr/bin/env bash
set -euo pipefail

# Opt-in install:
#   ln -s ../../.github/hooks/scripts/pre-push-council.sh .git/hooks/pre-push
#
# The hook stays local-only. It runs the council matrix when the branch being
# pushed changes deep-ai-council skill, council MCP, or 101 phase files.

CHANGED_FILES_SOURCE="env"

if [[ -z "${CHANGED_FILES:-}" ]]; then
  CHANGED_FILES_SOURCE="git"

  if ! UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null)"; then
    UPSTREAM=""
  fi

  if [[ -n "$UPSTREAM" ]]; then
    CHANGED_FILES="$(git diff --name-only "$UPSTREAM"..HEAD)"
  else
    CHANGED_FILES="$(git diff --name-only HEAD~1..HEAD 2>/dev/null || true)"
  fi
fi

COUNCIL_PATTERN='^(\.opencode/skills/deep-ai-council/|\.opencode/skills/system-spec-kit/mcp_server/(handlers|lib|tests|schemas)/.*council|\.opencode/specs/skilled-agent-orchestration/101-)'

if printf '%s\n' "$CHANGED_FILES" | grep -Eq "$COUNCIL_PATTERN"; then
  if [[ "$CHANGED_FILES_SOURCE" == "env" ]]; then
    printf 'Council path detected by pre-push smoke check.\n'
    exit 0
  fi

  bash .opencode/skills/system-spec-kit/scripts/test-council-matrix.sh
fi
