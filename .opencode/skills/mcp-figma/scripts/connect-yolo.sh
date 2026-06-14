#!/usr/bin/env bash
# YOLO connect — PATCHES Figma Desktop (app.asar) and restarts it with CDP on 9222.
# Gated behind an explicit consent flag. Rollback: unpatch.sh (figma-ds-cli unpatch).

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

CONSENT=0
[ "${1:-}" = "--i-understand-this-patches-figma" ] && CONSENT=1

if [ "$CONSENT" != 1 ]; then
  cat >&2 <<EOF
${_c_ylw}REFUSED: yolo connect patches Figma Desktop.${_c_rst}

Effect:  modifies Figma's app.asar (remote-debugging switch), codesigns the app
         on macOS, restarts Figma, and exposes CDP on 127.0.0.1:$CDP_PORT.
Risks:   may require Full Disk Access / admin; a Figma update can invalidate the
         patch and require re-running connect.
Rollback: $HERE/unpatch.sh   (runs: figma-ds-cli unpatch)

Prefer SAFE mode: $HERE/connect-safe.sh
To proceed anyway, re-run with: $0 --i-understand-this-patches-figma
EOF
  exit 2
fi

b="$(figma_bin)" || { err "No figma-ds-cli on PATH — run install.sh first"; exit 1; }
figma_desktop_path >/dev/null || { err "Figma Desktop not found; cannot patch."; exit 1; }

warn "Consent received. Patching Figma Desktop and starting yolo connect."
info "Running: $b connect"
"$b" connect
info "Daemon status:"; "$b" daemon status || warn "daemon status failed; try: $HERE/daemon.sh diagnose"
info "Rollback any time with: $HERE/unpatch.sh"
