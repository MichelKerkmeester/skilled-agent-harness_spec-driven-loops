#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Install llama-cpp Embeddings
# ───────────────────────────────────────────────────────────────
# Installs node-llama-cpp and the Q8_0 EmbeddingGemma GGUF used by
# Spec Kit Memory's llama-cpp default provider.
#
# Usage: bash .opencode/skills/system-spec-kit/scripts/install-llama-cpp.sh
#
# Exit Codes:
#   0 - Success
#   1 - Download or verification failure

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SKILL_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly MCP_SERVER_DIR="${SKILL_DIR}/mcp_server"
readonly MODEL_DIR="${HOME}/.cache/huggingface/gguf/embeddinggemma-300m"
readonly MODEL_FILE="embeddinggemma-300M-Q8_0.gguf"
readonly MODEL_PATH="${MODEL_DIR}/${MODEL_FILE}"
readonly MODEL_URL="https://huggingface.co/unsloth/embeddinggemma-300m-GGUF/resolve/main/${MODEL_FILE}"
readonly MODEL_INFO_PATH="${SKILL_DIR}/../../specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/015-node-llama-cpp-evaluation/scratch/model-info.json"
readonly EXPECTED_SHA256="a0f7b4e13c397a6e1b32c2de75b1f65a14c92ec524d5f674d94a4290a1c4969b"

log_info() { printf 'INFO: %s\n' "$1"; }
log_pass() { printf 'PASS: %s\n' "$1"; }
log_error() { printf 'ERROR: %s\n' "$1" >&2; }

read_expected_sha256() {
  if [[ -f "${MODEL_INFO_PATH}" ]] && command -v node >/dev/null 2>&1; then
    node -e "const fs=require('fs'); const p=process.argv[1]; const data=JSON.parse(fs.readFileSync(p,'utf8')); process.stdout.write(data.sha256 || '');" "${MODEL_INFO_PATH}"
    return
  fi
  printf '%s' "${EXPECTED_SHA256}"
}

install_dependency() {
  cd "${MCP_SERVER_DIR}"
  if npm list node-llama-cpp@3.17.1 --depth=0 >/dev/null 2>&1; then
    log_pass "node-llama-cpp@3.17.1 already installed"
    return
  fi

  log_info "Installing node-llama-cpp@3.17.1 as optional dependency"
  npm install node-llama-cpp@3.17.1 --save-optional
}

download_model() {
  mkdir -p "${MODEL_DIR}"
  if [[ -s "${MODEL_PATH}" ]]; then
    log_pass "GGUF model already present at ${MODEL_PATH}"
    return
  fi

  log_info "Downloading ${MODEL_URL}"
  curl -L --fail --show-error --output "${MODEL_PATH}" "${MODEL_URL}"
}

verify_model() {
  local expected_sha
  expected_sha="$(read_expected_sha256)"
  if [[ -z "${expected_sha}" ]]; then
    log_error "Could not resolve expected SHA-256"
    exit 1
  fi

  local actual_sha
  actual_sha="$(shasum -a 256 "${MODEL_PATH}" | awk '{print $1}')"
  if [[ "${actual_sha}" != "${expected_sha}" ]]; then
    log_error "SHA-256 mismatch for ${MODEL_PATH}"
    log_error "expected=${expected_sha}"
    log_error "actual=${actual_sha}"
    exit 1
  fi
  log_pass "Verified GGUF SHA-256 ${actual_sha}"
}

main() {
  install_dependency
  download_model
  verify_model
  log_pass "llama-cpp embeddings ready. Default auto mode can now use llama-cpp."
}

main "$@"
