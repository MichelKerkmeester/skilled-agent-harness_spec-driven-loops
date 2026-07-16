#!/bin/bash
# inspect-export-readonly.sh
#
# Worked example for the mcp-figma skill: a strictly READ-ONLY inspect and
# export flow against the open Figma file, mirroring playbook scenarios
# INSPECT-001 and EXPORT-001.
#
# SAFETY MODEL (matches SKILL.md rules):
#   - READ-ONLY verbs only: status, find, node tree, get, export screenshot.
#     No create/set/bind/delete verb ever runs in this script.
#   - Local exports still write files, so the output path is EXPLICIT and an
#     existing file is never silently overwritten (the script refuses).
#   - Destructive verbs (node delete, var delete-all, undo, unwrap, ...) are
#     GATED per SKILL.md: confirmation + explicit target + one-line rollback.
#     They are intentionally absent here.
#
# Preconditions:
#   - Connected session (run safe-connect-daemon-health.sh first).
#   - Figma Desktop open with a file.
#
# Usage:
#   bash examples/inspect-export-readonly.sh [output.svg]
#
# Exit codes:
#   0  inspect + export succeeded to a fresh explicit path
#   1  preflight failed (binary/daemon) or output path already exists

set -euo pipefail

OUT="${1:-/tmp/figma-export-$(date +%Y%m%d-%H%M%S).svg}"

log() { echo "[inspect-export] $*"; }

# --- Preflight: binary + daemon health (read-only) ------------------------
BIN=""
command -v figma-ds-cli >/dev/null 2>&1 && BIN="figma-ds-cli"
[ -z "$BIN" ] && command -v figma-cli >/dev/null 2>&1 && BIN="figma-cli"
if [ -z "$BIN" ]; then
  log "figma-ds-cli not found; run scripts/install.sh first"
  exit 1
fi

log "verifying daemon health (read-only)..."
"$BIN" daemon status 2>&1 || { log "daemon unreachable; run safe-connect-daemon-health.sh"; exit 1; }

# --- Read-only inspect (INSPECT-001) ---------------------------------------
# These verbs return structure and properties and change nothing in the
# document. Verify exact flags against `figma-ds-cli --help` on the live
# machine, since command examples are illustrative per the playbook.
log "listing document structure (read-only)..."
"$BIN" node tree 2>&1 || "$BIN" find "*" 2>&1

# --- Read-only export to an EXPLICIT path (EXPORT-001) ---------------------
# Exports require an explicit output path and must never silently overwrite.
if [ -e "$OUT" ]; then
  log "refusing to overwrite existing file: $OUT"
  log "pick a fresh explicit output path and re-run"
  exit 1
fi

log "exporting current selection/page as SVG to explicit path: $OUT"
"$BIN" export screenshot -f svg -o "$OUT" 2>&1

if [ -f "$OUT" ]; then
  log "export written: $OUT"
  log "done: read-only flow complete, no mutating verb ran, nothing overwritten."
else
  log "export did not produce a file; check selection and daemon health"
  exit 1
fi
