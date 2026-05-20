#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM RERANK SIDECAR LAUNCHER
# ───────────────────────────────────────────────────────────────
# Activate the skill venv and exec uvicorn on localhost.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

cd "$SKILL_DIR"

[ -f .env ] && set -a && . ./.env && set +a
[ -f .env.local ] && set -a && . ./.env.local && set +a

PORT="${RERANK_SIDECAR_PORT:-8765}"

if [[ ! -f .venv/bin/activate ]]; then
    echo "Error: .venv missing. Run: bash scripts/install.sh" >&2
    exit 1
fi

source .venv/bin/activate
exec python -m uvicorn scripts.rerank_sidecar:app --host 127.0.0.1 --port "$PORT" --workers 1
