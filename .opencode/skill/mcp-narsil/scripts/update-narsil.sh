#!/bin/bash
# Update Narsil MCP to latest version
#
# This script updates the embedded Narsil MCP server in the skill folder.
# It fetches the latest changes from the upstream repo and rebuilds.

set -e

# Get script directory and derive paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
MCP_SERVER_DIR="$SKILL_DIR/mcp_server"

if [[ ! -d "$MCP_SERVER_DIR" ]]; then
    echo "Error: Narsil mcp_server directory not found at $MCP_SERVER_DIR" >&2
    exit 1
fi

echo "Updating Narsil MCP (embedded)..."
echo "Location: $MCP_SERVER_DIR"

cd "$MCP_SERVER_DIR"

# Note: The embedded copy doesn't have .git, so we need to update from upstream
# Check if we have a reference to upstream
UPSTREAM_REPO="https://github.com/postrv/narsil-mcp.git"
TEMP_DIR=$(mktemp -d)

echo "Fetching latest from upstream..."
git clone --depth 1 "$UPSTREAM_REPO" "$TEMP_DIR"

echo "Syncing source files..."
rsync -av --delete \
    --exclude='.git' \
    --exclude='target' \
    --exclude='frontend' \
    --exclude='docs' \
    --exclude='.github' \
    --exclude='node_modules' \
    --exclude='.DS_Store' \
    "$TEMP_DIR/" "$MCP_SERVER_DIR/"

echo "Cleaning up temp directory..."
rm -rf "$TEMP_DIR"

echo "Building..."
cargo build --release

echo "Verifying..."
./target/release/narsil-mcp --version

echo "Update complete!"