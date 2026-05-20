#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM RERANK SIDECAR INSTALLER
# ───────────────────────────────────────────────────────────────
# Create the local venv and install the FastAPI rerank sidecar.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

find_python_bin() {
    local candidate
    for candidate in python3.11 python3.12 python3.13 python3; do
        if command -v "$candidate" >/dev/null 2>&1 &&
            "$candidate" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' >/dev/null 2>&1; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done
    return 1
}

cd "$SKILL_DIR"

PYTHON_BIN="$(find_python_bin || true)"
if [[ -z "$PYTHON_BIN" ]]; then
    echo "Error: Python 3.11+ is required but was not found on PATH." >&2
    exit 1
fi

if [[ ! -d .venv ]]; then
    "$PYTHON_BIN" -m venv .venv
fi

source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -e .
python -c "from sentence_transformers import CrossEncoder; print('sentence-transformers OK')"
python -c "import fastapi; import uvicorn; print('fastapi + uvicorn OK')"
echo "system-rerank-sidecar install complete"
