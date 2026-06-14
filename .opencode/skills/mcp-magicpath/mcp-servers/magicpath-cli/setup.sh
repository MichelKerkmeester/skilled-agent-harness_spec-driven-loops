#!/usr/bin/env bash
# Vendor the magicpath-ai CLI into this directory's node_modules via npm.
# Mirrors the mcp-click-up/mcp-servers setup pattern. For a global install
# instead, run ../../scripts/install.sh.
set -euo pipefail

cd "$(dirname "$0")"
npm install

echo "magicpath-ai vendored locally. Verify:"
echo "  node node_modules/magicpath-ai/dist/cli.js --version"
echo "Authenticate (browser session):"
echo "  node node_modules/magicpath-ai/dist/cli.js login"
