#!/usr/bin/env bash
# Copy non-TS assets into the skill-advisor compiled dist tree.
#
# tsc doesn't copy non-TS files (e.g., data/prompt-policy.default.json).
# Without this step, the MCP launcher fails on first start with:
#   ENOENT: no such file or directory, open
#     dist/system-skill-advisor/mcp_server/data/prompt-policy.default.json
#
# Usage:
#   bash .opencode/scripts/copy-skill-advisor-dist-data.sh
#
# Recommended: run this AFTER `npm run build` in the skill-advisor mcp_server.
# Operators may also add a `postbuild` script to their (gitignored) local
# `package.json` that invokes this script — see comment in install guide.
#
# Idempotent. Safe to re-run. Exits 0 if source files are missing (no-op).

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
  echo "ERROR: not inside a git working tree" >&2
  exit 1
fi

SRC="$REPO_ROOT/.opencode/skills/system-skill-advisor/mcp_server/data"
DST="$REPO_ROOT/.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/data"

if [ ! -d "$SRC" ]; then
  echo "skipped: source dir not present ($SRC)" >&2
  exit 0
fi

mkdir -p "$DST"
copied=0
shopt -s nullglob
for f in "$SRC"/*.json; do
  cp "$f" "$DST/"
  copied=$((copied + 1))
done

if [ "$copied" -eq 0 ]; then
  echo "no JSON files to copy in $SRC" >&2
else
  echo "copied $copied JSON file(s) to $DST"
fi
