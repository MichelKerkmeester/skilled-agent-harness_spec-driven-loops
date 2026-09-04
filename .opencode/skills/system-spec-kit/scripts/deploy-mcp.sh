#!/usr/bin/env bash
# Rebuild every daemon-backed package dist after a source change and flag
# launcher changes a running process cannot pick up.
#
# Why this exists: dist/ is gitignored (a build artifact), so pulling source
# changes does NOT update a running daemon or the compiled engine — each package's dist must be
# rebuilt locally. The packages build from different roots, which is
# easy to miss and leaves one running stale code. This script builds
# all of them so none is forgotten.
#
# A launcher *.cjs* change never reloads in place (SIGHUP is a shutdown signal,
# not a reload): the running owner launcher holds the old .cjs in memory. Such a
# change goes live only in a FRESH session (a new launcher process). This script
# detects recently-changed launcher .cjs and warns.
#
# Usage:
#   deploy-mcp.sh            # build all dists + report

set -euo pipefail
REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO" || exit 1
FAIL=0

build_pkg() {
  # $1 = human label, $2 = dir to run `npm run build` in
  local label="$1" dir="$2"
  if [ ! -d "$dir" ]; then echo "  $label: dir missing ($dir) — skipped"; return; fi
  # Read package.json via fs (a bare relative path passed to require() resolves
  # as a module name, not a file, and would silently report "no build script").
  if ! node -e "const p=JSON.parse(require('node:fs').readFileSync('$dir/package.json','utf8'));process.exit(p.scripts&&p.scripts.build?0:1)" 2>/dev/null; then
    echo "  $label: no build script — skipped"; return
  fi
  if ( cd "$dir" && npm run build >/tmp/deploy-mcp-$label.log 2>&1 ); then
    echo "  $label: built OK"
  else
    echo "  $label: BUILD FAILED (see /tmp/deploy-mcp-$label.log)"; FAIL=1
  fi
}

echo "== Building package dists =="
# spec-kit runtime engine: builds @spec-kit/shared too via TS project references.
build_pkg "spec-kit" ".opencode/skills/system-spec-kit/runtime"
# system-skill-advisor MCP daemon: build if it ships a build script.
build_pkg "advisor" ".opencode/skills/system-skill-advisor/mcp-server"

if [ "$FAIL" -ne 0 ]; then
  echo "!! One or more builds failed. Fix builds first." >&2
  exit 1
fi

echo "== Launcher .cjs change check =="
# Surface launcher .cjs touched in the working tree or last commit: these need a
# FRESH session to take effect.
CJS_CHANGED="$(
  { git diff --name-only -- '.opencode/bin/*.cjs' '.opencode/bin/lib/*.cjs' 2>/dev/null
    git diff --name-only HEAD~1 HEAD -- '.opencode/bin/*.cjs' '.opencode/bin/lib/*.cjs' 2>/dev/null
  } | sort -u || true
)"
if [ -n "$CJS_CHANGED" ]; then
  echo "  WARNING: launcher .cjs changed — recycle CANNOT activate these."
  echo "  Start a FRESH session (new launcher process) to load them:"
  echo "$CJS_CHANGED" | sed 's/^/    - /'
else
  echo "  No launcher .cjs changes detected."
fi

echo "== Done =="
