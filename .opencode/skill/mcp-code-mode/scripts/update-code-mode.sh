#!/bin/bash
# Update Code Mode MCP to latest version
#
# Code Mode is installed via npm as @utcp/code-mode-mcp.
# This script updates the MCP server to the latest version.
#
# To use a custom installation location, set CODE_MODE_DIR environment variable:
#   export CODE_MODE_DIR="/path/to/your/code-mode"

set -e

echo "=== Code Mode MCP Update Script ==="
echo ""

# Code Mode directory - override with CODE_MODE_DIR environment variable
CODE_MODE_DIR="${CODE_MODE_DIR:-$HOME/code-mode-mcp}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed" >&2
    echo "Install Node.js from https://nodejs.org or via: brew install node" >&2
    exit 1
fi

# Check if directory exists
if [[ ! -d "$CODE_MODE_DIR" ]]; then
    echo "Code Mode directory not found at: $CODE_MODE_DIR"
    echo ""
    echo "Options:"
    echo "  1. Set CODE_MODE_DIR to your installation path:"
    echo "     export CODE_MODE_DIR=\"/path/to/code-mode\""
    echo ""
    echo "  2. Install Code Mode fresh:"
    echo "     mkdir -p \"$CODE_MODE_DIR\""
    echo "     cd \"$CODE_MODE_DIR\""
    echo "     npm init -y"
    echo "     npm install @utcp/code-mode-mcp"
    echo ""
    
    read -p "Would you like to install Code Mode now? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Code Mode..."
        mkdir -p "$CODE_MODE_DIR"
        cd "$CODE_MODE_DIR"
        npm init -y > /dev/null 2>&1
        npm install @utcp/code-mode-mcp
        echo ""
        echo "Installation complete!"
    else
        echo "Aborted."
        exit 1
    fi
else
    echo "Code Mode directory: $CODE_MODE_DIR"
    echo ""
    
    cd "$CODE_MODE_DIR"
    
    # Show current version
    if [[ -f "node_modules/@utcp/code-mode-mcp/package.json" ]]; then
        CURRENT_VERSION=$(node -p "require('./node_modules/@utcp/code-mode-mcp/package.json').version" 2>/dev/null || echo "unknown")
        echo "Current version: $CURRENT_VERSION"
    fi
    
    echo ""
    echo "Updating @utcp/code-mode-mcp..."
    npm update @utcp/code-mode-mcp
    
    # Show new version
    if [[ -f "node_modules/@utcp/code-mode-mcp/package.json" ]]; then
        NEW_VERSION=$(node -p "require('./node_modules/@utcp/code-mode-mcp/package.json').version" 2>/dev/null || echo "unknown")
        echo ""
        echo "Updated version: $NEW_VERSION"
    fi
fi

echo ""
echo "Verifying installation..."

# Check for the MCP entry point
MCP_ENTRY="$CODE_MODE_DIR/node_modules/@utcp/code-mode-mcp/dist/index.js"
if [[ -f "$MCP_ENTRY" ]]; then
    echo "  MCP entry point: $MCP_ENTRY"
else
    echo "  Warning: MCP entry point not found at expected location"
    echo "  Looking for alternatives..."
    find "$CODE_MODE_DIR/node_modules/@utcp" -name "index.js" -type f 2>/dev/null | head -5
fi

echo ""
echo "Checking .utcp_config.json..."
if [[ -f ".utcp_config.json" ]]; then
    echo "  Config found: $CODE_MODE_DIR/.utcp_config.json"
    
    # Validate JSON
    if node -e "JSON.parse(require('fs').readFileSync('.utcp_config.json'))" 2>/dev/null; then
        echo "  Config valid: Yes"
    else
        echo "  Config valid: No (JSON parse error)"
    fi
else
    echo "  Warning: .utcp_config.json not found"
    echo "  Create one using the template in:"
    echo "  .opencode/skill/mcp-code-mode/assets/config_template.md"
fi

echo ""
echo "=== Update complete! ==="
echo ""
echo "Remember to update opencode.json if the path changed:"
echo ""
echo '  "code_mode": {'
echo '    "type": "local",'
echo "    \"command\": [\"node\", \"$MCP_ENTRY\"],"
echo '    "environment": {'
echo "      \"UTCP_CONFIG_FILE\": \"$CODE_MODE_DIR/.utcp_config.json\""
echo '    },'
echo '    "enabled": true'
echo '  }'
