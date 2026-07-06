#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# CI / pre-commit gate: every in-scope skill doc must carry a 4-part version.
# Discovers in-scope docs (SKILL.md, README, references, assets, feature_catalog,
# manual_testing_playbook under .opencode/skills/*) git-free and exits non-zero on
# any missing or malformed version. Frontmatter-less docs are skipped, not failed.
#
# Standard: .opencode/skills/sk-doc/references/frontmatter_versioning.md
# Usage:    check-frontmatter-versions.sh [--skill <name>] [--classes <c1,c2>]
# ───────────────────────────────────────────────────────────────
set -euo pipefail
command -v node >/dev/null 2>&1 || { echo "check-frontmatter-versions: 'node' not found on PATH" >&2; exit 2; }
exec node "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/frontmatter-version.mjs" gate "$@"
