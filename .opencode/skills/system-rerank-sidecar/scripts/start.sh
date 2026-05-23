#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM RERANK SIDECAR LAUNCHER
# ───────────────────────────────────────────────────────────────
# Activate the skill venv and exec uvicorn on localhost.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

cd "$SKILL_DIR"

load_dotenv_file() {
    local file_path="$1"
    [[ -f "$file_path" ]] || return 0

    local line key value
    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ "$line" =~ ^[[:space:]]*$ || "$line" =~ ^[[:space:]]*# ]] && continue
        if [[ ! "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$ ]]; then
            continue
        fi
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        value="${value%%[[:space:]]#*}"
        value="${value%"${value##*[![:space:]]}"}"
        if [[ ( "$value" == \"*\" && "$value" == *\" ) || ( "$value" == \'*\' && "$value" == *\' ) ]]; then
            value="${value:1:${#value}-2}"
        fi
        case "$key" in
            RERANK_*|HF_*|TRANSFORMERS_OFFLINE|PYTORCH_ENABLE_MPS_FALLBACK)
                printf -v "$key" '%s' "$value"
                export "$key"
                ;;
        esac
    done < "$file_path"
}

load_dotenv_file .env
load_dotenv_file .env.local

# 022/008 cross-language sync: 8765 default mirrors sidecar_defaults.py:DEFAULT_PORT.
# When changing the default, update sidecar_defaults.py AND .opencode/bin/lib/ensure-rerank-sidecar.cjs:DEFAULT_PORT in lockstep.
PORT="${RERANK_SIDECAR_PORT:-8765}"

if [[ ! -f .venv/bin/activate ]]; then
    echo "Error: .venv missing. Run: bash scripts/install.sh" >&2
    exit 1
fi

# Env allowlist: scrub parent-shell secrets before exec'ing uvicorn. Only the
# minimal system + Python runtime + explicitly approved HF/RERANK knobs cross
# the boundary (DR-003-P2-001 - env-var leak mitigation).
#
# Reaper knobs:
#   RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS: owner-liveness check cadence.
#   RERANK_SIDECAR_REAPER_DISABLE: set 1 to inhibit self-reap for debugging.
#   RERANK_SIDECAR_REAPER_TELEMETRY_PATH: lifecycle JSONL forensic log path.
#   RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS: idle self-exit timeout; 0 disables.
RUNTIME_PYTHON="$SKILL_DIR/.venv/bin/python"
env_args=(
    "HOME=$HOME"
    "PATH=$SKILL_DIR/.venv/bin:/usr/bin:/bin"
    "LANG=${LANG:-en_US.UTF-8}"
    "TMPDIR=${TMPDIR:-/tmp}"
    "HF_HOME=${HF_HOME:-$HOME/.cache/huggingface}"
    "HF_HUB_CACHE=${HF_HUB_CACHE:-$HOME/.cache/huggingface/hub}"
    "HF_HUB_OFFLINE=${HF_HUB_OFFLINE:-1}"
    "TRANSFORMERS_OFFLINE=${TRANSFORMERS_OFFLINE:-1}"
    "PYTORCH_ENABLE_MPS_FALLBACK=${PYTORCH_ENABLE_MPS_FALLBACK:-1}"
    "RERANK_SIDECAR_PORT=$PORT"
    # 022/008 cross-language sync: Qwen3-Reranker-0.6B mirrors sidecar_defaults.py:DEFAULT_MODEL_NAME.
    "RERANK_MODEL_NAME=${RERANK_MODEL_NAME:-Qwen/Qwen3-Reranker-0.6B}"
    "RERANK_MODEL_REVISION=${RERANK_MODEL_REVISION:-e61197ed45024b0ed8a2d74b80b4d909f1255473}"
)

add_env_if_set() {
    local key="$1"
    [[ ${!key+x} ]] && env_args+=("$key=${!key}")
    return 0
}

for key in \
    RERANK_API_KEY RERANK_ALLOWED_MODELS RERANK_MODEL_REVISIONS RERANK_DEVICE \
    RERANK_TORCH_DTYPE RERANK_LOG_PATH RERANK_LOG_MAX_BYTES RERANK_LOG_RAW_QUERIES \
    RERANK_RATE_LIMIT_PER_MIN RERANK_MAX_DOCUMENT_BYTES RERANK_SIDECAR_OWNER_TOKEN \
    RERANK_SIDECAR_CONFIG_HASH RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS \
    RERANK_SIDECAR_REAPER_DISABLE RERANK_SIDECAR_REAPER_TELEMETRY_PATH \
    RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS
do
    add_env_if_set "$key"
done

while IFS= read -r key; do
    [[ "$key" == RERANK_*_API_KEY ]] && add_env_if_set "$key"
done < <(compgen -e)

exec env -i "${env_args[@]}" \
    "$RUNTIME_PYTHON" -m uvicorn scripts.rerank_sidecar:app --host 127.0.0.1 --port "$PORT" --workers 1
