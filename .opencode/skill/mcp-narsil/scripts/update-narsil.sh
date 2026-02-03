#!/bin/bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: NARSIL MCP UPDATER
# ───────────────────────────────────────────────────────────────
# Update Narsil MCP to latest version from upstream repo.

set -e


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
MCP_SERVER_DIR="$SKILL_DIR/mcp_server"
UPSTREAM_REPO="https://github.com/postrv/narsil-mcp.git"


# ───────────────────────────────────────────────────────────────
# 2. UPDATE
# ───────────────────────────────────────────────────────────────

if [[ ! -d "$MCP_SERVER_DIR" ]]; then
    echo "Error: Narsil mcp_server directory not found at $MCP_SERVER_DIR" >&2
    exit 1
fi

echo "Updating Narsil MCP (embedded)..."
echo "Location: $MCP_SERVER_DIR"

cd "$MCP_SERVER_DIR"

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

rm -rf "$TEMP_DIR"


# ───────────────────────────────────────────────────────────────
# 3. BUILD
# ───────────────────────────────────────────────────────────────

echo "Building..."
cargo build --release

echo "Verifying..."
./target/release/narsil-mcp --version

echo "Update complete!"
