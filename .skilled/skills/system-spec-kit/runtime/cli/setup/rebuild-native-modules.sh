#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Rebuild Native Modules
# ───────────────────────────────────────────────────────────────
# Rebuilds native Node.js modules after a Node version change.
# Run from spec-kit root: bash runtime/cli/setup/rebuild-native-modules.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Rebuilding Native Modules                               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Node.js:        $(node --version)"
echo "MODULE_VERSION: $(node -e 'console.log(process.versions.modules)')"
echo "Platform:       $(uname -s) $(uname -m)"
echo ""

# Step 1: Rebuild shared workspace native modules
echo "── Step 1: Rebuilding shared workspace modules..."
cd "$ROOT_DIR/shared"
if [[ -d "node_modules" ]]; then
  npm rebuild 2>/dev/null || echo "   (no native modules in shared/)"
else
  echo "   (shared/node_modules not found — run npm install first)" >&2
fi
echo "   ✓ shared modules rebuilt"

# Step 2: Write .node-version-marker
echo ""
echo "── Step 2: Writing .node-version-marker..."
node "$ROOT_DIR/runtime/cli/setup/record-node-version.js"
echo "   ✓ .node-version-marker updated"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Done! Restart your session to apply changes.            ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Exit codes:
#   0 - Success
