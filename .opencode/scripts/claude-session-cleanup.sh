#!/usr/bin/env bash
set -euo pipefail

# Back-compat shim. This script was renamed to session-cleanup.sh when MCP session
# cleanup became runtime-agnostic (no longer Claude-specific). Any existing hook or
# config still pointing at the old name keeps working by delegating here.
#
# Prefer calling session-cleanup.sh directly in new wiring.

exec "$(dirname "$0")/session-cleanup.sh" "$@"
