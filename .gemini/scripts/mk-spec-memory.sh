#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SPEC KIT MEMORY MCP LAUNCHER
# ───────────────────────────────────────────────────────────────
# Launches the Spec Kit Memory MCP server with auto-detected
# embedding provider and database path resolution.
#
# Usage: mk-spec-memory.sh
#
# Environment:
#   EMBEDDINGS_PROVIDER   - auto | voyage | openai | llama-cpp | hf-local (default: auto)
#   MEMORY_DB_PATH        - Override database path (absolute or relative)
#   VOYAGE_API_KEY        - Voyage AI API key (triggers voyage provider)
#   OPENAI_API_KEY        - OpenAI API key (triggers openai provider)
#   SPECKIT_DISABLE_STARTUP_SCAN - Disable startup scan (default: true)

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. PATH RESOLUTION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${REPO_ROOT}"

# ───────────────────────────────────────────────────────────────
# 2. DATABASE CONFIGURATION
# ───────────────────────────────────────────────────────────────

DEFAULT_DB_PATH="${REPO_ROOT}/.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite"
HF_LOCAL_DB_PATH="${REPO_ROOT}/.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite"
LLAMA_CPP_DB_PATH="${REPO_ROOT}/.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"

export EMBEDDINGS_PROVIDER="${EMBEDDINGS_PROVIDER:-auto}"
RAW_MEMORY_DB_PATH="${MEMORY_DB_PATH:-}"
export SPECKIT_DISABLE_STARTUP_SCAN="${SPECKIT_DISABLE_STARTUP_SCAN:-true}"

# Normalize relative paths to absolute
if [[ -z "${RAW_MEMORY_DB_PATH}" ]]; then
  unset MEMORY_DB_PATH
elif [[ "${RAW_MEMORY_DB_PATH}" = /* ]]; then
  export MEMORY_DB_PATH="${RAW_MEMORY_DB_PATH}"
else
  export MEMORY_DB_PATH="${REPO_ROOT}/${RAW_MEMORY_DB_PATH#./}"
fi

# ───────────────────────────────────────────────────────────────
# 3. EMBEDDING PROVIDER AUTO-DETECTION
# ───────────────────────────────────────────────────────────────

# Fall back to hf-local DB only when no API keys AND no llama-cpp runtime; llama-cpp profile DB takes precedence when its GGUF model is installed
if [[ -z "${MEMORY_DB_PATH:-}" ]]; then
  case "${EMBEDDINGS_PROVIDER}" in
    auto)
      ;;
    llama-cpp)
      export MEMORY_DB_PATH="${LLAMA_CPP_DB_PATH}"
      ;;
    hf-local)
      export MEMORY_DB_PATH="${HF_LOCAL_DB_PATH}"
      ;;
  esac
fi

# ───────────────────────────────────────────────────────────────
# 4. LAUNCH
# ───────────────────────────────────────────────────────────────

exec node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js
