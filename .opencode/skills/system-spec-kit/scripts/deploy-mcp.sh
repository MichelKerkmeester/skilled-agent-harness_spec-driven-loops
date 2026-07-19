#!/usr/bin/env bash
# Rebuild every MCP server's dist after a source change, optionally recycle the
# transparently-recyclable daemon, and flag launcher changes that a recycle
# cannot pick up.
#
# Why this exists: dist/ is gitignored (a build artifact), so pulling source
# changes does NOT update the running servers — each server's dist must be
# rebuilt locally. The three MCP servers also build from different roots
# (code-graph builds from its SKILL root, not its mcp_server dir), which is
# easy to miss and leaves one server running stale code. This script builds
# all of them so none is forgotten.
#
# Recycle model (see references/memory/ for detail):
#   - mk-spec-memory recycles transparently: SIGTERM its daemon CHILD and the
#     owner launcher respawns it from the fresh dist while the front-proxy keeps
#     MCP up. This script does that when --recycle is passed.
#   - mk-code-index and mk-skill-advisor launchers EXIT on child SIGTERM instead
#     of respawning, so this script never SIGTERMs them; their fresh dist loads
#     when they next start.
#   - A launcher *.cjs* change never reloads in place (SIGHUP is a shutdown
#     signal, not a reload): the running owner launcher holds the old .cjs in
#     memory. Such a change goes live only in a FRESH session (a new launcher
#     process). This script detects recently-changed launcher .cjs and warns.
#
# Usage:
#   deploy-mcp.sh            # build all dists + report (safe, no recycle)
#   deploy-mcp.sh --recycle  # also transparently recycle the mk-spec-memory daemon

set -euo pipefail
REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO" || exit 1
RECYCLE=0; [ "${1:-}" = "--recycle" ] && RECYCLE=1
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

echo "== Building MCP server dists =="
# mk-spec-memory: builds @spec-kit/shared too via TS project references.
build_pkg "mk-spec-memory" ".opencode/skills/system-spec-kit/mcp-server"
# mk-code-index (code-graph): builds from the SKILL root (tsconfig lives there).
build_pkg "code-graph" ".opencode/skills/system-code-graph"
# mk-skill-advisor: build if it ships a build script.
build_pkg "advisor" ".opencode/skills/system-skill-advisor/mcp-server"

if [ "$FAIL" -ne 0 ]; then
  echo "!! One or more builds failed — NOT recycling. Fix builds first." >&2
  exit 1
fi

echo "== Launcher .cjs change check =="
# Surface launcher .cjs touched in the working tree or last commit: these need a
# FRESH session to take effect, which a recycle cannot provide.
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

if [ "$RECYCLE" -eq 1 ]; then
  echo "== Recycling mk-spec-memory daemon (transparent) =="
  CHILD="$(pgrep -f 'system-spec-kit/mcp-server/dist/context-server.js' | head -1 || true)"
  if [ -z "$CHILD" ]; then
    echo "  No running mk-spec-memory daemon child found — it will load fresh dist on next start."
  else
    kill -TERM "$CHILD" && echo "  SIGTERM sent to daemon child $CHILD; owner launcher will respawn from fresh dist."
    i=0
    while [ $i -lt 60 ]; do
      NEW="$(pgrep -f 'system-spec-kit/mcp-server/dist/context-server.js' | grep -v "^$CHILD$" | head -1 || true)"
      [ -n "$NEW" ] && { echo "  Respawned daemon child: $NEW"; break; }
      sleep 0.5; i=$((i+1))
    done
    [ -z "${NEW:-}" ] && { echo "  !! No respawn within ~30s — check MCP health." >&2; exit 1; }
  fi
  echo "  Note: code-graph and advisor are not SIGTERM-recycled (their launchers exit, not respawn); fresh dist loads on next start."
fi

echo "== Done =="
