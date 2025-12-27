#!/bin/bash
# Update LEANN MCP to latest version
#
# LEANN is installed via uv (Python package manager).
# This script updates leann-core and the MCP server to the latest version.
#
# Prerequisites:
#   - uv installed: curl -LsSf https://astral.sh/uv/install.sh | sh
#   - Ollama running: brew services start ollama
#   - nomic-embed-text model: ollama pull nomic-embed-text

set -e

echo "=== LEANN MCP Update Script ==="
echo ""

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Error: uv is not installed" >&2
    echo "Install with: curl -LsSf https://astral.sh/uv/install.sh | sh" >&2
    exit 1
fi

# Check if leann is currently installed
if ! command -v leann &> /dev/null; then
    echo "Warning: leann is not currently installed"
    echo "Installing leann-core..."
    uv tool install leann-core --with leann
else
    echo "Current version:"
    leann --version 2>/dev/null || echo "  (version check not available)"
    echo ""
fi

echo "Updating leann-core..."
uv tool upgrade leann-core --with leann

echo ""
echo "Verifying installation..."

# Verify CLI
if command -v leann &> /dev/null; then
    echo "  leann CLI: $(which leann)"
    leann --version 2>/dev/null || echo "  (installed)"
else
    echo "  Error: leann CLI not found after update" >&2
    exit 1
fi

# Verify MCP server
if command -v leann_mcp &> /dev/null; then
    echo "  leann_mcp:  $(which leann_mcp)"
else
    echo "  Warning: leann_mcp not found in PATH"
    echo "  You may need to add ~/.local/bin to your PATH:"
    echo '  export PATH="$HOME/.local/bin:$PATH"'
fi

echo ""
echo "Checking Ollama status..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "  Ollama: Running"
    
    # Check for required model
    if ollama list 2>/dev/null | grep -q "nomic-embed-text"; then
        echo "  nomic-embed-text: Installed"
    else
        echo "  nomic-embed-text: Not found"
        echo "  Install with: ollama pull nomic-embed-text"
    fi
else
    echo "  Ollama: Not running"
    echo "  Start with: brew services start ollama"
fi

echo ""
echo "=== Update complete! ==="
echo ""
echo "Quick test:"
echo "  leann list                              # List indexes"
echo "  leann build test --docs ./README.md    # Build test index"
echo "  leann search test \"test query\"         # Search"
echo "  leann remove test                       # Cleanup"
