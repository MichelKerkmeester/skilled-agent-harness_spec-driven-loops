#!/bin/bash
# Update LEANN MCP to latest version
#
# LEANN is installed via uv (Python package manager).
# This script updates leann-core and the MCP server to the latest version.
#
# Prerequisites:
#   - uv installed: curl -LsSf https://astral.sh/uv/install.sh | sh
#   - For MLX (Apple Silicon): No additional setup needed
#   - For Ollama (optional): brew services start ollama
#
# Recommended embedding settings (Apple Silicon):
#   LEANN_EMBEDDING_MODE=mlx
#   LEANN_EMBEDDING_MODEL=mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ

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
echo "Checking embedding setup..."
# Check if running on Apple Silicon
if [[ $(uname -m) == "arm64" ]]; then
    echo "  Platform: Apple Silicon (arm64)"
    echo "  Recommended: MLX mode with Qwen3 embedding"
    echo ""
    
    # Check for existing shell alias
    SHELL_RC="$HOME/.zshrc"
    if [[ -n "$BASH_VERSION" ]]; then
        SHELL_RC="$HOME/.bashrc"
    fi
    
    if grep -q "alias leann-build=" "$SHELL_RC" 2>/dev/null; then
        echo "  Shell alias: Already configured in $SHELL_RC"
    else
        echo ""
        echo "  Would you like to add the leann-build alias to $SHELL_RC? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo "" >> "$SHELL_RC"
            echo "# LEANN build alias with Qwen3 embedding (Apple Silicon)" >> "$SHELL_RC"
            echo 'alias leann-build='"'"'leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'"'" >> "$SHELL_RC"
            echo "  Alias added to $SHELL_RC"
            echo "  Run: source $SHELL_RC"
        else
            echo "  Skipped. Add manually if needed:"
            echo "    alias leann-build='leann build --embedding-mode mlx --embedding-model \"mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ\"'"
        fi
    fi
else
    echo "  Platform: $(uname -m)"
    echo "  Recommended: sentence-transformers with Contriever"
fi

echo ""
echo "Checking Ollama status (optional for LLM features)..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "  Ollama: Running"
    
    # Check for LLM model (used by 'leann ask')
    if ollama list 2>/dev/null | grep -q "qwen3:8b"; then
        echo "  qwen3:8b: Installed (for 'leann ask' command)"
    else
        echo "  qwen3:8b: Not found"
        echo "  Install with: ollama pull qwen3:8b (optional, for 'leann ask')"
    fi
else
    echo "  Ollama: Not running (optional for 'leann ask' command)"
    echo "  Start with: brew services start ollama"
fi

echo ""
echo "=== Update complete! ==="
echo ""
echo "Quick test:"
echo "  leann list                           # List indexes"
echo "  leann-build test --docs ./README.md  # Build test index (with alias)"
echo "  leann search test \"test query\"       # Search"
echo "  leann remove test                    # Cleanup"
echo ""
echo "Build commands:"
echo "  # With alias (recommended)"
echo "  leann-build <name> --docs src/"
echo "  leann-build <name> --docs src/ --file-types \".js,.css,.html\""
echo ""
echo "  # Full command (equivalent)"
echo "  leann build <name> --docs src/ --embedding-mode mlx --embedding-model \"mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ\""
echo ""
echo "Why Qwen3-Embedding?"
echo "  - 50% better quality than Contriever (MTEB 70.7 vs ~40)"
echo "  - Trained on code (MTEB-Code 75.41)"
echo "  - 32K context vs 512 tokens"
echo "  - Native MLX support with 4-bit quantization"
