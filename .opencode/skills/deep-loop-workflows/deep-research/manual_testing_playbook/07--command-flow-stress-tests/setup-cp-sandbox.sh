#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../../.." && pwd)"
SANDBOX_DIR="/tmp/cp-deep-research-sandbox"

usage() {
  echo "Usage: setup-cp-sandbox.sh [--sandbox-dir PATH]"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --sandbox-dir)
      if [[ $# -lt 2 || -z "${2:-}" ]]; then
        echo "ERROR: --sandbox-dir requires a path" >&2
        exit 2
      fi
      SANDBOX_DIR="$2"
      shift 2
      ;;
    --sandbox-dir=*)
      SANDBOX_DIR="${1#--sandbox-dir=}"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

require_path() {
  local path="$1"
  [[ -e "$path" ]] && return 0
  echo "ERROR: required path not found: $path" >&2
  exit 1
}

# Guard the destructive rm -rf: the sandbox dir must be a concrete absolute
# path strictly under /tmp/ with no '..' traversal, so a stray or malicious
# --sandbox-dir value can never wipe a real directory outside the sandbox.
validate_sandbox_dir() {
  local dir="$1"
  if [[ -z "$dir" ]]; then
    echo "ERROR: sandbox dir must not be empty" >&2
    exit 2
  fi
  if [[ "$dir" != /* ]]; then
    echo "ERROR: sandbox dir must be an absolute path: $dir" >&2
    exit 2
  fi
  case "$dir" in
    ..|../*|*/..|*/../*)
      echo "ERROR: sandbox dir must not contain '..': $dir" >&2
      exit 2
      ;;
  esac
  if [[ "$dir" != /tmp/* ]]; then
    echo "ERROR: sandbox dir must be under /tmp/: $dir" >&2
    exit 2
  fi
}

copy_dir() {
  local source="$1"
  local target="$2"
  require_path "$source"
  rm -rf "$target"
  mkdir -p "$(dirname "$target")"
  cp -a "$source" "$target"
}

copy_file() {
  local source="$1"
  local target="$2"
  require_path "$source"
  mkdir -p "$(dirname "$target")"
  cp "$source" "$target"
}

require_path "${REPO_ROOT}/.opencode/commands/deep/research.md"
require_path "${REPO_ROOT}/.opencode/commands/deep/assets/deep_research_auto.yaml"
require_path "${REPO_ROOT}/.opencode/commands/deep/assets/deep_research_confirm.yaml"
require_path "${REPO_ROOT}/.opencode/skills/deep-loop-workflows/deep-research"
require_path "${REPO_ROOT}/.opencode/skills/system-spec-kit"
require_path "${REPO_ROOT}/.opencode/agents/deep-research.md"
require_path "${REPO_ROOT}/.claude/agents/deep-research.md"
require_path "${REPO_ROOT}/.codex/agents/deep-research.toml"

validate_sandbox_dir "$SANDBOX_DIR"

rm -rf "$SANDBOX_DIR"
mkdir -p "$SANDBOX_DIR"

copy_dir "${REPO_ROOT}/.opencode/commands/speckit" "${SANDBOX_DIR}/.opencode/commands/speckit"
copy_dir "${REPO_ROOT}/.opencode/skills/deep-loop-workflows/deep-research" "${SANDBOX_DIR}/.opencode/skills/deep-loop-workflows/deep-research"
copy_dir "${REPO_ROOT}/.opencode/skills/system-spec-kit" "${SANDBOX_DIR}/.opencode/skills/system-spec-kit"

copy_file "${REPO_ROOT}/.opencode/agents/deep-research.md" "${SANDBOX_DIR}/.opencode/agents/deep-research.md"
copy_file "${REPO_ROOT}/.claude/agents/deep-research.md" "${SANDBOX_DIR}/.claude/agents/deep-research.md"
copy_file "${REPO_ROOT}/.codex/agents/deep-research.toml" "${SANDBOX_DIR}/.codex/agents/deep-research.toml"

echo "Created deep-research command sandbox at ${SANDBOX_DIR}"
