#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP-FIGMA SAFE CONNECT AND DAEMON HEALTH EXAMPLE
# ───────────────────────────────────────────────────────────────
# safe-connect-daemon-health.sh
#
# Worked example for the mcp-figma skill: verify the canonical binary, connect
# in SAFE mode (plugin bridge, no patch), and check daemon health, mirroring
# playbook scenarios DETECT-001, CONNECT-001, and DAEMON-001.
#
# SAFETY MODEL (matches SKILL.md rules):
#   - Safe connect only. The yolo patch (`figma-ds-cli connect`, patches
#     app.asar) is GATED: never run it here, and never without explicit
#     consent plus the stated rollback `figma-ds-cli unpatch`.
#   - Read-only health verbs only (`daemon status`, `daemon diagnose`).
#   - The daemon token at ~/.figma-ds-cli/.daemon-token is NEVER printed.
#   - NEVER `npm i -g figma-cli`: that npm package is an UNRELATED tool.
#
# Preconditions (playbook Global Preconditions):
#   - Figma Desktop is OPEN with a file (the CLI drives the live session).
#   - The FigCli plugin manifest was imported once and
#     Plugins -> Development -> FigCli is open in Figma.
#
# Usage:
#   bash examples/safe-connect-daemon-health.sh
#
# Exit codes:
#   0  safe connect ran and the daemon is healthy
#   1  binary missing or daemon unhealthy
#   Any other status comes from the failing figma-ds-cli version or connect call

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { echo "[safe-connect] $*"; }
fail() { echo "[safe-connect] $*" >&2; }

# --- Step 1: Binary detection (DETECT-001) --------------------------------
# Canonical binary is figma-ds-cli. A bare `figma-cli` may be the unrelated
# unic tool, so its version is printed for the operator to confirm before use.
BIN=""
if command -v figma-ds-cli >/dev/null 2>&1; then
  BIN="figma-ds-cli"
elif command -v figma-cli >/dev/null 2>&1; then
  log "found 'figma-cli'; verify it is the silships tool before trusting it:"
  figma-cli --version 2>&1 || true
  BIN="figma-cli"
fi

if [ -z "$BIN" ]; then
  fail "figma-ds-cli not found."
  fail "Install via the skill installer (do NOT 'npm i -g figma-cli'):"
  fail "  bash $SCRIPT_DIR/../scripts/install.sh"
  exit 1
fi

# Version trap: the full surface (safe connect, daemon, extract) needs >= 1.2.0
# from the silships repo. npm publishes only the minimal 1.0.0 build.
log "binary: $BIN"
"$BIN" --version 2>&1

# --- Step 2: Safe connect, no patch (CONNECT-001) -------------------------
# Requires Figma Desktop open with the FigCli plugin running. Applies NO
# app.asar patch and makes no CDP port 9222 change.
log "connecting in safe mode (plugin bridge, no patch)..."
"$BIN" connect --safe 2>&1

# --- Step 3: Daemon health, read-only (DAEMON-001) ------------------------
# Daemon is a local HTTP server on 127.0.0.1:3456. Status and diagnose are
# read-only. On "Unauthorized": diagnose then restart, never delete the token.
log "checking daemon health..."
if "$BIN" daemon status 2>&1; then
  log "daemon healthy on 127.0.0.1:3456"
else
  fail "daemon unhealthy; running read-only diagnose..."
  "$BIN" daemon diagnose 2>&1 || true
  fail "recovery path per SKILL.md: daemon diagnose, then daemon restart."
  fail "NEVER auto-delete ~/.figma-ds-cli/.daemon-token and NEVER print it."
  exit 1
fi

log "done: safe connect verified, daemon healthy, no patch applied."
