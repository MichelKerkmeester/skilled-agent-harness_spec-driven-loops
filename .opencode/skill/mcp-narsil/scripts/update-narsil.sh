#!/bin/bash
# Update Narsil MCP to latest version
#
# To use a custom Narsil location, set NARSIL_MCP_DIR environment variable:
#   export NARSIL_MCP_DIR="/path/to/your/narsil-mcp"

set -e

# Narsil MCP directory - override with NARSIL_MCP_DIR environment variable
NARSIL_DIR="${NARSIL_MCP_DIR:-$HOME/narsil-mcp}"

if [[ ! -d "$NARSIL_DIR" ]]; then
    echo "Error: Narsil directory not found at $NARSIL_DIR" >&2
    echo "Set NARSIL_MCP_DIR environment variable to your Narsil installation path" >&2
    exit 1
fi

echo "Updating Narsil MCP..."

cd "$NARSIL_DIR"

echo "Pulling latest changes..."
git pull

echo "Building..."
cargo build --release

echo "Verifying..."
./target/release/narsil-mcp --version

echo "Update complete!"