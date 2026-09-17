#!/usr/bin/env bash
# Roll back the yolo patch: restore Figma Desktop's original app.asar.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

b="$(figma_bin)" || { err "No figma-ds-cli on PATH"; exit 1; }
info "Running: $b unpatch  (restores Figma Desktop to its original state)"
"$b" unpatch
ok "Unpatch complete. If Figma still misbehaves, update/reinstall Figma Desktop, then reconnect with connect-safe.sh."
