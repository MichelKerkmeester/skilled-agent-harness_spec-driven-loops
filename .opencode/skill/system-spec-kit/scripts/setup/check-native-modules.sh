#!/usr/bin/env bash
# ---------------------------------------------------------------
# COMPONENT: Check Native Modules
# ---------------------------------------------------------------
# Quick diagnostic for native module health.
# Run from spec-kit root: bash scripts/setup/check-native-modules.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
MARKER="$ROOT_DIR/.node-version-marker"

echo "── Native Module Health Check ──"
echo ""
echo "Current Node.js: $(node --version)"
echo "MODULE_VERSION:  $(node -e 'console.log(process.versions.modules)')"
echo ""

# Check .node-version-marker
if [[ -f "$MARKER" ]]; then
  MARKER_NODE=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$MARKER','utf8')).nodeVersion)")
  MARKER_MOD=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$MARKER','utf8')).moduleVersion)")
  echo "Marker Node.js:  $MARKER_NODE"
  echo "Marker MODULE:   $MARKER_MOD"
  CURRENT_MOD=$(node -e 'console.log(process.versions.modules)')
  if [[ "$MARKER_MOD" = "$CURRENT_MOD" ]]; then
    echo "Version match:   ✓ OK"
  else
    echo "Version match:   ✗ MISMATCH — rebuild needed!"
  fi
else
  echo "Marker:          ✗ Not found (run rebuild script to create)"
fi

echo ""
echo "── Module Probes ──"
echo ""

# Probe better-sqlite3
if node -e "require('$ROOT_DIR/mcp_server/node_modules/better-sqlite3')" 2>/dev/null; then
  echo "better-sqlite3:    ✓ loads OK"
else
  echo "better-sqlite3:    ✗ FAILED to load"
fi

# Probe onnxruntime-node (optional, may not be installed)
if [[ -d "$ROOT_DIR/shared/node_modules/onnxruntime-node" ]]; then
  if node -e "require('$ROOT_DIR/shared/node_modules/onnxruntime-node')" 2>/dev/null; then
    echo "onnxruntime-node:  ✓ loads OK"
  else
    echo "onnxruntime-node:  ✗ FAILED to load"
  fi
else
  echo "onnxruntime-node:  ⊘ not installed"
fi

# Probe sharp (optional)
if [[ -d "$ROOT_DIR/shared/node_modules/sharp" ]]; then
  if node -e "require('$ROOT_DIR/shared/node_modules/sharp')" 2>/dev/null; then
    echo "sharp:             ✓ loads OK"
  else
    echo "sharp:             ✗ FAILED to load"
  fi
else
  echo "sharp:             ⊘ not installed"
fi

echo ""
echo "── Summary ──"
echo ""
echo "If any modules FAILED, run: bash scripts/setup/rebuild-native-modules.sh"
