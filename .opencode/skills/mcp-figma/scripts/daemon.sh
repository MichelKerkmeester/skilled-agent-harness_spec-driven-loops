#!/usr/bin/env bash
# Thin wrapper over `figma-ds-cli daemon <verb>`. Read verbs are safe; start/stop/
# restart/reconnect change daemon state (not the Figma document).

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_common.sh
. "$HERE/_common.sh"

verb="${1:-status}"
case "$verb" in
  status|diagnose|start|stop|restart|reconnect) ;;
  -h|--help|help) echo "Usage: daemon.sh {status|diagnose|start|stop|restart|reconnect}"; exit 0;;
  *) err "Unknown daemon verb: $verb"; echo "Use: status|diagnose|start|stop|restart|reconnect" >&2; exit 2;;
esac

b="$(figma_bin)" || { err "No figma-ds-cli on PATH — run install.sh first"; exit 1; }
info "Running: $b daemon $verb"
"$b" daemon "$verb"
