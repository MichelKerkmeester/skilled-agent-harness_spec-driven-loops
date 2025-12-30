#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# NARSIL SEARCH CLI
# ═══════════════════════════════════════════════════════════════════════════════
# Command-line interface for Narsil search functions via HTTP API.
# Requires the Narsil HTTP server to be running (use narsil-server.sh start).
#
# USAGE:
#   ./narsil-search.sh neural "how does auth work"
#   ./narsil-search.sh semantic "cookie consent"
#   ./narsil-search.sh code "addEventListener"
#   ./narsil-search.sh hybrid "modal system"
#   ./narsil-search.sh symbols function
#   ./narsil-search.sh call <tool_name> '{"arg": "value"}'
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Configuration
HTTP_PORT="${NARSIL_HTTP_PORT:-3001}"
BASE_URL="http://localhost:$HTTP_PORT"
REPO="${NARSIL_REPO:-unknown}"
DEFAULT_LIMIT=10

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1" >&2; }

# Check if server is running
check_server() {
    if ! curl -s "$BASE_URL/health" > /dev/null 2>&1; then
        log_error "Narsil HTTP server not running on port $HTTP_PORT"
        log_info "Start it with: narsil-server.sh start"
        exit 1
    fi
}

# Call a Narsil tool via HTTP
call_tool() {
    local tool="$1"
    local args="$2"
    
    local response=$(curl -s -X POST "$BASE_URL/tools/call" \
        -H "Content-Type: application/json" \
        -d "{\"tool\": \"$tool\", \"args\": $args}")
    
    local success=$(echo "$response" | jq -r '.success' 2>/dev/null)
    
    if [ "$success" = "true" ]; then
        echo "$response" | jq -r '.result' 2>/dev/null
    else
        local error=$(echo "$response" | jq -r '.error // "Unknown error"' 2>/dev/null)
        log_error "Tool call failed: $error"
        return 1
    fi
}

# Neural search (semantic understanding via embeddings)
neural_search() {
    local query="$1"
    local limit="${2:-$DEFAULT_LIMIT}"
    
    log_info "Neural search: \"$query\" (top $limit)"
    call_tool "neural_search" "{\"repo\": \"$REPO\", \"query\": \"$query\", \"top_k\": $limit}"
}

# Semantic search (BM25 keyword ranking)
semantic_search() {
    local query="$1"
    local limit="${2:-$DEFAULT_LIMIT}"
    
    log_info "Semantic search (BM25): \"$query\" (limit $limit)"
    call_tool "semantic_search" "{\"repo\": \"$REPO\", \"query\": \"$query\", \"limit\": $limit}"
}

# Code search (exact keyword matching)
code_search() {
    local query="$1"
    local limit="${2:-$DEFAULT_LIMIT}"
    
    log_info "Code search: \"$query\" (limit $limit)"
    call_tool "search_code" "{\"repo\": \"$REPO\", \"query\": \"$query\", \"limit\": $limit}"
}

# Hybrid search (BM25 + TF-IDF + Neural)
hybrid_search() {
    local query="$1"
    local limit="${2:-$DEFAULT_LIMIT}"
    
    log_info "Hybrid search: \"$query\" (limit $limit)"
    call_tool "hybrid_search" "{\"repo\": \"$REPO\", \"query\": \"$query\", \"limit\": $limit}"
}

# Find symbols
find_symbols() {
    local symbol_type="${1:-function}"
    local pattern="${2:-}"
    
    log_info "Finding symbols: type=$symbol_type, pattern=$pattern"
    call_tool "find_symbols" "{\"repo\": \"$REPO\", \"symbol_type\": \"$symbol_type\", \"pattern\": \"$pattern\"}"
}

# Get index status
index_status() {
    log_info "Fetching index status..."
    call_tool "get_index_status" "{}"
}

# List available tools
list_tools() {
    log_info "Fetching available tools..."
    curl -s "$BASE_URL/tools" | jq '.tools[].name' 2>/dev/null | sort
}

# Generic tool call
generic_call() {
    local tool="$1"
    local args="${2:-{}}"
    
    log_info "Calling tool: $tool"
    call_tool "$tool" "$args"
}

# Show help
show_help() {
    cat << EOF
Narsil Search CLI - Search your codebase via HTTP API

${CYAN}USAGE:${NC}
  $0 <command> [arguments]

${CYAN}SEARCH COMMANDS:${NC}
  neural <query> [limit]     Neural semantic search (embeddings)
  semantic <query> [limit]   BM25 keyword search
  code <query> [limit]       Exact code search
  hybrid <query> [limit]     Combined search (BM25 + TF-IDF + Neural)

${CYAN}SYMBOL COMMANDS:${NC}
  symbols [type] [pattern]   Find symbols (function, class, struct, etc.)

${CYAN}UTILITY COMMANDS:${NC}
  status                     Show index status
  tools                      List available tools
  call <tool> [args_json]    Call any tool directly

${CYAN}EXAMPLES:${NC}
  $0 neural "how does authentication work"
  $0 semantic "cookie consent" 5
  $0 code "addEventListener"
  $0 symbols function "handle"
  $0 call get_call_graph '{"repo": "unknown", "function": "main"}'

${CYAN}ENVIRONMENT:${NC}
  NARSIL_HTTP_PORT  HTTP port (default: 3001)
  NARSIL_REPO       Repository name (default: unknown)

${YELLOW}NOTE:${NC} Requires Narsil HTTP server running. Start with:
  narsil-server.sh start
EOF
}

# Main command handler
case "${1:-}" in
    neural)
        check_server
        neural_search "${2:-}" "${3:-}"
        ;;
    semantic)
        check_server
        semantic_search "${2:-}" "${3:-}"
        ;;
    code)
        check_server
        code_search "${2:-}" "${3:-}"
        ;;
    hybrid)
        check_server
        hybrid_search "${2:-}" "${3:-}"
        ;;
    symbols)
        check_server
        find_symbols "${2:-function}" "${3:-}"
        ;;
    status)
        check_server
        index_status
        ;;
    tools)
        check_server
        list_tools
        ;;
    call)
        check_server
        generic_call "${2:-}" "${3:-{}}"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -n "${1:-}" ]; then
            log_error "Unknown command: $1"
            echo ""
        fi
        show_help
        exit 1
        ;;
esac
