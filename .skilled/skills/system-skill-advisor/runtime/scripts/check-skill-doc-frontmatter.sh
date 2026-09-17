#!/usr/bin/env bash
# ====================================================================
# check-skill-doc-frontmatter.sh — canonical frontmatter contract
#                                  guard for skill reference/asset docs
# ====================================================================
# Validates the doc-frontmatter contract the skill advisor harvests
# (SPECKIT_ADVISOR_DOC_TRIGGERS): title, description, trigger_phrases
# (3-8), importance_tier and contextType on every doc under
# .opencode/skills/*/references/ and assets/ (README.md exempt).
#
# Modes:
#   --shape     (default) any doc carrying any detailed field must be
#               fully valid; not-yet-authored docs pass
#   --coverage  every reference/asset doc must carry the full block
#               (flip CI to this once the authoring campaign completes)
#
# Options:
#   --skill <name>  restrict to one skill (per-phase authoring runs)
#
# Exit codes:
#   0 — all checks pass
#   1 — any violation (see FAIL lines)
#   2 — usage / environment error
#
# Usage: check-skill-doc-frontmatter.sh [repo-root] [--shape|--coverage] [--skill <name>]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECKER="${SCRIPT_DIR}/check-skill-doc-frontmatter.mjs"

if [ ! -f "$CHECKER" ]; then
  echo "FAIL checker not found: $CHECKER" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "FAIL node is required on PATH" >&2
  exit 2
fi

exec node "$CHECKER" "$@"
