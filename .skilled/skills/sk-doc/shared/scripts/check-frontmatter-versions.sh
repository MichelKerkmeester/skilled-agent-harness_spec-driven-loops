#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Post-edit gate: every SKILL.md must carry a 4-part version (the skill edition).
# Discovers every SKILL.md under .skilled/skills/* git-free and exits non-zero on
# any missing or malformed version. Frontmatter-less docs are skipped, not failed.
#
# Standard: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md
# Usage:    check-frontmatter-versions.sh [--skill <name>] [--classes <c1,c2>]
# ───────────────────────────────────────────────────────────────
set -euo pipefail
command -v node >/dev/null 2>&1 || { echo "check-frontmatter-versions: 'node' not found on PATH" >&2; exit 2; }
exec node "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/frontmatter-version.mjs" gate "$@"
