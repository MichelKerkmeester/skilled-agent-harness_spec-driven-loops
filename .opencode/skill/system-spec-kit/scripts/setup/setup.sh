#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPEC-KIT: MEMORY SYSTEM SETUP
# ───────────────────────────────────────────────────────────────
#
# Usage: ./setup.sh [--force]
# Options: --force  Reinstall dependencies even if node_modules exists

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROJECT_ROOT="$(cd "$SKILL_DIR/../../.." && pwd)"

FORCE_INSTALL=false
[[ "${1:-}" == "--force" ]] && FORCE_INSTALL=true

echo "───────────────────────────────────────────────────────────"
echo "  Memory System Setup"
echo "───────────────────────────────────────────────────────────"
echo ""
echo "Project: $PROJECT_ROOT"
echo ""

# ───────────────────────────────────────────────────────────────
# 1. PREREQUISITES CHECK
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}📋 Checking Prerequisites...${NC}"

PREREQS_OK=true

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1 | tr -d 'v')

  if [[ $NODE_MAJOR -ge 18 ]]; then
    echo -e "  ${GREEN}✓${NC} Node.js $NODE_VERSION"
  else
    echo -e "  ${YELLOW}⚠${NC} Node.js $NODE_VERSION (v18+ recommended)"
  fi
else
  echo -e "  ${RED}✗${NC} Node.js not found"
  echo ""
  echo "Please install Node.js v18+:"
  echo "  - macOS: brew install node"
  echo "  - Or visit: https://nodejs.org/"
  PREREQS_OK=false
fi

if command -v npm &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} npm $(npm --version)"
else
  echo -e "  ${RED}✗${NC} npm not found"
  PREREQS_OK=false
fi

if command -v rsync &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} rsync available"
else
  echo -e "  ${YELLOW}⚠${NC} rsync not found (optional, for platform sync)"
fi

if [[ "$PREREQS_OK" == false ]]; then
  echo ""
  echo -e "${RED}Prerequisites check failed. Please install missing dependencies.${NC}"
  exit 1
fi

# ───────────────────────────────────────────────────────────────
# 2. INSTALL DEPENDENCIES
# ───────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}📦 Installing Dependencies...${NC}"

cd "$SKILL_DIR"

if [[ -f "package.json" ]]; then
  if [[ -d "node_modules" ]] && [[ "$FORCE_INSTALL" == false ]]; then
    echo -e "  ${GREEN}✓${NC} Dependencies already installed"
    echo "    (use --force to reinstall)"
  else
    echo "  Installing npm packages..."
    npm install --production 2>&1 | while read -r line; do
      if [[ "$line" == *"added"* ]] || [[ "$line" == *"up to date"* ]]; then
        echo "    $line"
      fi
    done
    echo -e "  ${GREEN}✓${NC} Dependencies installed"
  fi
else
  echo -e "  ${YELLOW}⚠${NC} No package.json found"
  echo "    Creating minimal package.json..."

  cat > package.json << 'EOF'
{
  "name": "memory-system",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "better-sqlite3": "^9.0.0"
  }
}
EOF

  npm install --production
  echo -e "  ${GREEN}✓${NC} Dependencies installed"
fi

# ───────────────────────────────────────────────────────────────
# 3. INITIALIZE DATABASE
# ───────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}🗃️  Initializing Database...${NC}"

DB_DIR="$HOME/.opencode"
mkdir -p "$DB_DIR"

PROJECT_DB_DIR="$PROJECT_ROOT/.codebase"
mkdir -p "$PROJECT_DB_DIR"

cd "$SKILL_DIR/scripts"

node -e "
const path = require('path');

try {
  const vectorIndex = require('./lib/vector-index.js');

  vectorIndex.initializeDb();

  const stats = vectorIndex.getStats();

  console.log('  Database initialized successfully');
  console.log('  Location: .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite');
  console.log('  Memories indexed: ' + (stats.total || 0));

  process.exit(0);
} catch (err) {
  if (err.message && err.message.includes('sqlite-vec')) {
    console.log('  Database ready (keyword search mode)');
    console.log('  Note: sqlite-vec not available for vector search');
    process.exit(0);
  }
  console.error('  Error: ' + err.message);
  process.exit(1);
}
" 2>&1 | while read -r line; do
  if [[ "$line" == *"Error"* ]]; then
    echo -e "  ${YELLOW}$line${NC}"
  else
    echo -e "  ${GREEN}✓${NC}$line"
  fi
done

# ───────────────────────────────────────────────────────────────
# 4. VERIFY INSTALLATION
# ───────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}🔍 Verifying Installation...${NC}"

VERIFY_OK=true

KEY_FILES=(
  "lib/vector-index.js"
  "lib/embeddings.js"
  "lib/trigger-matcher.js"
  "index-all.js"
  "semantic-search.js"
)

for file in "${KEY_FILES[@]}"; do
  if [[ -f "$SKILL_DIR/scripts/$file" ]]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file missing"
    VERIFY_OK=false
  fi
done

# ───────────────────────────────────────────────────────────────
# 5. SUMMARY
# ───────────────────────────────────────────────────────────────

echo ""
echo "───────────────────────────────────────────────────────────"

if [[ "$VERIFY_OK" == true ]]; then
  echo -e "${GREEN}✅ Setup Complete!${NC}"
  echo ""
  echo "Available Commands:"
  echo -e "  ${CYAN}/memory/save${NC}     - Save current conversation context"
  echo -e "  ${CYAN}/memory/search${NC}   - Search and browse memories"
  echo -e "  ${CYAN}/memory/cleanup${NC}  - Clean up old memories"
  echo -e "  ${CYAN}/memory/triggers${NC} - View learned trigger phrases"
  echo -e "  ${CYAN}/memory/status${NC}   - Check system health"
  echo ""
  echo "Quick Start:"
  echo "  1. Use 'save context' or 'remember this' in conversation"
  echo "  2. Run /memory/search to find past context"
  echo "  3. Run /memory/status to verify health"
  echo ""
  echo "Documentation:"
  echo "  See .opencode/skill/system-spec-kit/ for skill documentation"
else
  echo -e "${YELLOW}⚠️  Setup completed with warnings${NC}"
  echo ""
  echo "Some components may be missing. The system should still work"
  echo "but with reduced functionality."
fi

echo "───────────────────────────────────────────────────────────"
