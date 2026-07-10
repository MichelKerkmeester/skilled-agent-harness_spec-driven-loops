#!/usr/bin/env bash
# Install cupt CLI in an isolated environment via pipx (preferred) or pip.
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
