#!/bin/bash
# Update Narsil MCP to latest version

set -e

NARSIL_DIR="/Users/michelkerkmeester/MEGA/MCP Servers/narsil-mcp"

echo "Updating Narsil MCP..."

cd "$NARSIL_DIR"

echo "Pulling latest changes..."
git pull

echo "Building..."
cargo build --release

echo "Verifying..."
./target/release/narsil-mcp --version

echo "Update complete!"