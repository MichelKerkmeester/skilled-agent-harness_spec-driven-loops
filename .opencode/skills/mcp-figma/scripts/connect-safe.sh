#!/usr/bin/env bash
# Guided SAFE connect (FigCli plugin bridge). Never patches Figma Desktop.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

b="$(figma_bin)" || { err "No figma-ds-cli on PATH, run install.sh first (do NOT 'npm i -g figma-cli')"; exit 1; }
figma_desktop_path >/dev/null || warn "Figma Desktop not found; safe connect needs it open with a file."

cat <<EOF
== SAFE connect (no patch) ==
Safe mode uses the FigCli plugin instead of patching Figma Desktop.
Before continuing, in Figma Desktop:
  1) Open the target Figma file.
  2) One-time: import the FigCli plugin manifest (plugin/manifest.json from the figma-cli install).
  3) Open: Plugins -> Development -> FigCli  (keep it open during the session).
EOF
if [ ! -t 0 ]; then info "Non-interactive shell detected; safe connect needs an interactive prompt. Re-run in a terminal."; exit 0; fi
printf 'Proceed with safe connect now? [y/N] '
read -r ans
case "$ans" in y|Y|yes|YES) ;; *) info "Aborted."; exit 0;; esac

info "Running: $b connect --safe"
"$b" connect --safe
info "Daemon status:"; "$b" daemon status || warn "daemon status failed; try: $HERE/daemon.sh diagnose"
