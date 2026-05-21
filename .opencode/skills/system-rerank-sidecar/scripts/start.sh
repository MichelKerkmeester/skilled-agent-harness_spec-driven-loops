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

# Env allowlist: scrub parent-shell secrets before exec'ing uvicorn. Only the
# minimal system + Python runtime + RERANK_*/HF_* knobs cross the boundary
# (DR-003-P2-001 — fix env-var leak; complement to RS-023 advisory in playbook).
RUNTIME_PYTHON="$SKILL_DIR/.venv/bin/python"
exec env -i \
    HOME="$HOME" \
    PATH="$SKILL_DIR/.venv/bin:/usr/bin:/bin" \
    LANG="${LANG:-en_US.UTF-8}" \
    TMPDIR="${TMPDIR:-/tmp}" \
    HF_HOME="${HF_HOME:-$HOME/.cache/huggingface}" \
    HF_HUB_CACHE="${HF_HUB_CACHE:-$HOME/.cache/huggingface/hub}" \
    HF_HUB_OFFLINE="${HF_HUB_OFFLINE:-1}" \
    TRANSFORMERS_OFFLINE="${TRANSFORMERS_OFFLINE:-1}" \
    PYTORCH_ENABLE_MPS_FALLBACK="${PYTORCH_ENABLE_MPS_FALLBACK:-1}" \
    RERANK_SIDECAR_PORT="$PORT" \
    RERANK_MODEL_NAME="${RERANK_MODEL_NAME:-Qwen/Qwen3-Reranker-0.6B}" \
    RERANK_MODEL_REVISION="${RERANK_MODEL_REVISION:-e61197ed45024b0ed8a2d74b80b4d909f1255473}" \
    ${RERANK_ALLOWED_MODELS:+RERANK_ALLOWED_MODELS="$RERANK_ALLOWED_MODELS"} \
    ${RERANK_MODEL_REVISIONS:+RERANK_MODEL_REVISIONS="$RERANK_MODEL_REVISIONS"} \
    ${RERANK_DEVICE:+RERANK_DEVICE="$RERANK_DEVICE"} \
    ${RERANK_TORCH_DTYPE:+RERANK_TORCH_DTYPE="$RERANK_TORCH_DTYPE"} \
    ${RERANK_LOG_PATH:+RERANK_LOG_PATH="$RERANK_LOG_PATH"} \
    "$RUNTIME_PYTHON" -m uvicorn scripts.rerank_sidecar:app --host 127.0.0.1 --port "$PORT" --workers 1
