#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CUPT SETUP
# ───────────────────────────────────────────────────────────────
# Installs the cupt CLI in an isolated environment via pipx (preferred) or pip.
#
# Usage: setup.sh
#
# Exit Codes:
#   0 - cupt installed or already on PATH
#   other - pipx or pip failed and its own status is passed through
set -euo pipefail

if command -v cupt >/dev/null 2>&1; then
  echo "cupt already installed"
  exit 0
fi

if command -v pipx &>/dev/null; then
  pipx install cupt
else
  pip install --user cupt
fi

echo "cupt installed. Run: cupt auth"
