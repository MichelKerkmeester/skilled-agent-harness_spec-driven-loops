#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# NARSIL HTTP SERVER MANAGER
# ═══════════════════════════════════════════════════════════════════════════════
# Manages a long-lived Narsil HTTP server for reliable search functionality.
# 
# PROBLEM: Code Mode spawns fresh MCP processes, causing search indexes to rebuild
#          each time (~40-60s). This makes search functions unreliable.
#
# SOLUTION: Run Narsil as a persistent HTTP server. Search indexes build once and
#           stay warm in memory. Call tools via HTTP instead of Code Mode.
#
# USAGE:
#   ./narsil-server.sh start   - Start the HTTP server
#   ./narsil-server.sh stop    - Stop the HTTP server
#   ./narsil-server.sh status  - Check server status
#   ./narsil-server.sh restart - Restart the server
#   ./narsil-server.sh logs    - View server logs
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Configuration
# NARSIL_PATH must be set - no default to avoid hardcoded paths
if [ -z "${NARSIL_PATH:-}" ]; then
    echo "ERROR: NARSIL_PATH environment variable not set"
    echo "Set it to your narsil-mcp directory, e.g.:"
    echo "  export NARSIL_PATH=\$HOME/narsil-mcp"
    exit 1
fi
NARSIL_BIN="${NARSIL_PATH}/target/release/narsil-mcp"
HTTP_PORT="${NARSIL_HTTP_PORT:-3001}"
LOG_FILE="/tmp/narsil-http-server.log"
PID_FILE="/tmp/narsil-http-server.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if server is running
is_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        fi
    fi
    # Also check by port
    if lsof -i ":$HTTP_PORT" > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

# Get server PID
get_pid() {
    if [ -f "$PID_FILE" ]; then
        cat "$PID_FILE"
    else
        lsof -t -i ":$HTTP_PORT" 2>/dev/null || echo ""
    fi
}

# Start the server
start_server() {
    if is_running; then
        log_warn "Server already running on port $HTTP_PORT (PID: $(get_pid))"
        return 0
    fi

    if [ ! -f "$NARSIL_BIN" ]; then
        log_error "Narsil binary not found at: $NARSIL_BIN"
        log_info "Set NARSIL_PATH environment variable to your narsil-mcp directory"
        exit 1
    fi

    log_info "Starting Narsil HTTP server on port $HTTP_PORT..."
    
    # Start server in background
    "$NARSIL_BIN" \
        --repos . \
        --index-path .narsil-index \
        --git \
        --call-graph \
        --persist \
        --http \
        --http-port "$HTTP_PORT" \
        --neural \
        --neural-backend api \
        --neural-model voyage-code-2 \
        > "$LOG_FILE" 2>&1 &
    
    local pid=$!
    echo "$pid" > "$PID_FILE"
    
    # Wait for server to be ready
    log_info "Waiting for server to start..."
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -s "http://localhost:$HTTP_PORT/health" > /dev/null 2>&1; then
            log_success "Server started successfully (PID: $pid)"
            log_info "Health endpoint: http://localhost:$HTTP_PORT/health"
            log_info "Tools endpoint: http://localhost:$HTTP_PORT/tools/call"
            
            # Trigger reindex to build search indexes
            log_info "Triggering reindex to build search indexes..."
            curl -s -X POST "http://localhost:$HTTP_PORT/tools/call" \
                -H "Content-Type: application/json" \
                -d '{"tool": "reindex", "args": {"repo": "unknown"}}' > /dev/null 2>&1 || true
            
            log_warn "Search indexes building in background (~45-60s)"
            log_info "Use 'narsil-server.sh status' to check index status"
            return 0
        fi
        
        sleep 1
        attempts=$((attempts + 1))
    done
    
    log_error "Server failed to start within ${max_attempts}s"
    log_info "Check logs: $LOG_FILE"
    return 1
}

# Stop the server
stop_server() {
    if ! is_running; then
        log_warn "Server not running"
        rm -f "$PID_FILE"
        return 0
    fi
    
    local pid=$(get_pid)
    log_info "Stopping server (PID: $pid)..."
    
    kill "$pid" 2>/dev/null || true
    
    # Wait for graceful shutdown
    local attempts=0
    while [ $attempts -lt 10 ]; do
        if ! is_running; then
            log_success "Server stopped"
            rm -f "$PID_FILE"
            return 0
        fi
        sleep 1
        attempts=$((attempts + 1))
    done
    
    # Force kill if still running
    log_warn "Force killing server..."
    kill -9 "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"
    log_success "Server stopped (forced)"
}

# Check server status
check_status() {
    if ! is_running; then
        log_warn "Server not running"
        return 1
    fi
    
    local pid=$(get_pid)
    log_success "Server running on port $HTTP_PORT (PID: $pid)"
    
    # Check health
    local health=$(curl -s "http://localhost:$HTTP_PORT/health" 2>/dev/null)
    if [ -n "$health" ]; then
        log_info "Health: $health"
    fi
    
    # Check index status
    log_info "Fetching index status..."
    local status=$(curl -s -X POST "http://localhost:$HTTP_PORT/tools/call" \
        -H "Content-Type: application/json" \
        -d '{"tool": "get_index_status", "args": {}}' 2>/dev/null | jq -r '.result' 2>/dev/null)
    
    if [ -n "$status" ]; then
        echo ""
        echo "$status" | head -20
    fi
}

# View logs
view_logs() {
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        log_warn "No log file found at: $LOG_FILE"
    fi
}

# Main command handler
case "${1:-}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        sleep 2
        start_server
        ;;
    status)
        check_status
        ;;
    logs)
        view_logs
        ;;
    *)
        echo "Narsil HTTP Server Manager"
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the HTTP server"
        echo "  stop    - Stop the HTTP server"
        echo "  restart - Restart the server"
        echo "  status  - Check server status and index info"
        echo "  logs    - View server logs (tail -f)"
        echo ""
        echo "Environment Variables:"
        echo "  NARSIL_PATH      - Path to narsil-mcp directory"
        echo "  NARSIL_HTTP_PORT - HTTP port (default: 3001)"
        exit 1
        ;;
esac
