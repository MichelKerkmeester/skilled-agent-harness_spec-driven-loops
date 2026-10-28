#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: POST-EDIT ADAPTER TEST COMPATIBILITY ENTRY
# ───────────────────────────────────────────────────────────────
# Exit Codes: 0 syntax checks pass; nonzero when the test entrypoint fails.
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. TEST LOCATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ───────────────────────────────────────────────────────────────
# 2. DISPATCH
# ───────────────────────────────────────────────────────────────

exec bash "$SCRIPT_DIR/../tests/claude-posttooluse.test.sh" "$@"
