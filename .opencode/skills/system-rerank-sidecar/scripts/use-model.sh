#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM RERANK SIDECAR MODEL SWITCHER
# ───────────────────────────────────────────────────────────────
# Swap the cross-encoder model the sidecar serves. Updates .env.local,
# downloads weights if missing, stops the running sidecar, starts a fresh
# one with the new model, and probes /health + /warmup.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
ENV_LOCAL="$SKILL_DIR/.env.local"

usage() {
    cat <<'EOF'
Usage: bash use-model.sh <model-id> [options]

Swap the cross-encoder model the sidecar serves.

Arguments:
  <model-id>          HuggingFace model id (e.g. "Qwen/Qwen3-Reranker-0.6B")

Options:
  --revision <sha>    Pin to a specific commit (default: main branch tip)
  --device <cpu|mps|cuda>   Optional device override
  --no-restart        Update .env.local only; do not stop/start the sidecar
  --no-download       Fail loudly if model weights are not already cached
  -h, --help          Show this help

Vetted presets (all Apache-2.0, commercial-safe):
  Qwen/Qwen3-Reranker-0.6B          (default; best quality, 1.5 GB RAM warm)
  BAAI/bge-reranker-v2-m3           (multilingual, ~600 MB warm)
  cross-encoder/ms-marco-MiniLM-L-6-v2  (fastest, ~80 MB warm, lower quality)

NON-commercial only (avoid for shipped products):
  jinaai/jina-reranker-v3           (CC BY-NC 4.0)

Example:
  bash use-model.sh BAAI/bge-reranker-v2-m3
  bash use-model.sh Qwen/Qwen3-Reranker-0.6B --revision e61197ed45024b0ed8a2d74b80b4d909f1255473
  bash use-model.sh cross-encoder/ms-marco-MiniLM-L-6-v2 --device cpu --no-restart
EOF
}

MODEL=""
REVISION=""
DEVICE=""
RESTART=1
DOWNLOAD=1

while [[ $# -gt 0 ]]; do
    case "$1" in
        --revision)     REVISION="${2:-}"; shift 2 ;;
        --device)       DEVICE="${2:-}"; shift 2 ;;
        --no-restart)   RESTART=0; shift ;;
        --no-download)  DOWNLOAD=0; shift ;;
        -h|--help)      usage; exit 0 ;;
        -*)             echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
        *)              if [[ -z "$MODEL" ]]; then MODEL="$1"; else echo "Unexpected: $1" >&2; exit 1; fi; shift ;;
    esac
done

if [[ -z "$MODEL" ]]; then
    echo "Error: <model-id> is required." >&2
    usage >&2
    exit 1
fi

if [[ ! "$MODEL" =~ ^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$ ]]; then
    echo "Error: model id must be 'org/name' (e.g. 'Qwen/Qwen3-Reranker-0.6B')." >&2
    exit 1
fi

VENV_PY="$SKILL_DIR/.venv/bin/python"
if [[ ! -x "$VENV_PY" ]]; then
    echo "Error: sidecar venv missing at $VENV_PY. Run: bash scripts/install.sh" >&2
    exit 1
fi

# Resolve revision (HEAD if unspecified) + check cache.
HF_CACHE="${HF_HOME:-$HOME/.cache/huggingface}/hub"
MODEL_DIR_SAFE="${MODEL//\//--}"
SNAPSHOT_DIR="$HF_CACHE/models--$MODEL_DIR_SAFE/snapshots"

CACHED=0
if [[ -d "$SNAPSHOT_DIR" ]]; then
    if [[ -n "$REVISION" ]]; then
        [[ -d "$SNAPSHOT_DIR/$REVISION" ]] && CACHED=1
    else
        [[ -n "$(ls -A "$SNAPSHOT_DIR" 2>/dev/null)" ]] && CACHED=1
    fi
fi

if [[ "$CACHED" -eq 0 ]]; then
    if [[ "$DOWNLOAD" -eq 0 ]]; then
        echo "Error: model weights not cached and --no-download set." >&2
        echo "Expected at: $SNAPSHOT_DIR${REVISION:+/$REVISION}" >&2
        exit 1
    fi
    echo "[use-model] downloading $MODEL${REVISION:+ @ $REVISION}…" >&2
    HF_HUB_OFFLINE=0 TRANSFORMERS_OFFLINE=0 \
        "$VENV_PY" -c "
from huggingface_hub import snapshot_download
import sys
kwargs = {'repo_id': sys.argv[1]}
if sys.argv[2]:
    kwargs['revision'] = sys.argv[2]
path = snapshot_download(**kwargs)
print(f'cached at: {path}')
" "$MODEL" "$REVISION"
fi

# If revision was unspecified, pick the snapshot we have on disk
if [[ -z "$REVISION" ]]; then
    REVISION="$(ls "$SNAPSHOT_DIR" 2>/dev/null | head -1 || true)"
    if [[ -z "$REVISION" ]]; then
        echo "Error: cache check failed — no snapshot found after download." >&2
        exit 1
    fi
fi

# Write .env.local atomically
TMP_ENV="$(mktemp)"
{
    [[ -f "$ENV_LOCAL" ]] && grep -v '^RERANK_MODEL_NAME=\|^RERANK_MODEL_REVISION=\|^RERANK_DEVICE=' "$ENV_LOCAL" || true
    echo "RERANK_MODEL_NAME=$MODEL"
    echo "RERANK_MODEL_REVISION=$REVISION"
    [[ -n "$DEVICE" ]] && echo "RERANK_DEVICE=$DEVICE"
} > "$TMP_ENV"
mv "$TMP_ENV" "$ENV_LOCAL"
echo "[use-model] wrote $ENV_LOCAL (MODEL=$MODEL REVISION=$REVISION${DEVICE:+ DEVICE=$DEVICE})"

if [[ "$RESTART" -eq 0 ]]; then
    echo "[use-model] --no-restart: skipping sidecar restart. Run 'bash scripts/start.sh' when ready."
    exit 0
fi

# Stop existing sidecar
pkill -TERM -f "uvicorn scripts.rerank_sidecar" 2>/dev/null || true
sleep 1

# Start fresh
PORT="${RERANK_SIDECAR_PORT:-8765}"
nohup bash "$SCRIPT_DIR/start.sh" > /tmp/rerank-sidecar.log 2>&1 & disown
sleep 4

# Probe + warm
if ! curl -sf -m 5 "http://127.0.0.1:$PORT/health" > /dev/null; then
    echo "[use-model] sidecar health probe FAILED on :$PORT. Tail /tmp/rerank-sidecar.log" >&2
    tail -15 /tmp/rerank-sidecar.log >&2 || true
    exit 1
fi

echo "[use-model] warming model (may take 5-15s)…"
WARMUP="$(curl -sf -m 90 -X POST "http://127.0.0.1:$PORT/warmup" 2>&1 || true)"
echo "[use-model] warmup: $WARMUP"

if ! echo "$WARMUP" | grep -q '"status":"warmed"'; then
    echo "[use-model] warmup did not return status=warmed; sidecar may be in degraded state." >&2
    exit 1
fi

echo "[use-model] ✓ sidecar now serving $MODEL (revision $REVISION) on :$PORT"
