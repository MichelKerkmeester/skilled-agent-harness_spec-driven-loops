#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# The script sits six directories below the repository root; when the skill tree moves
# a level, this count moves with it or every path below resolves too shallow.
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../../../.." && pwd)"
SANDBOX_DIR="/tmp/cp-improve-sandbox"
FIXTURE_ROOT="${REPO_ROOT}/.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test"

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
  cp -a "$source" "$target"
}

require_path "${REPO_ROOT}/.opencode/commands/deep"
require_path "${REPO_ROOT}/.opencode/skills/system-deep-loop/deep-improvement"
# The sandboxed scenarios invoke helper scripts that resolve @spec-kit/shared by
# walking up from their own path, so the sandbox carries the package and its one
# runtime dependency; without them the helper steps fail MODULE_NOT_FOUND.
require_path "${REPO_ROOT}/.opencode/skills/system-deep-loop/node_modules/@spec-kit"
require_path "${REPO_ROOT}/.opencode/skills/system-spec-kit/shared"
require_path "${REPO_ROOT}/.opencode/skills/system-spec-kit/node_modules/js-yaml"
require_path "${FIXTURE_ROOT}/.opencode/agents/cp-improve-target.md"
require_path "${FIXTURE_ROOT}/.claude/agents/cp-improve-target.md"
require_path "${FIXTURE_ROOT}/.cursor/agents/cp-improve-target.md"
require_path "${FIXTURE_ROOT}/.devin/agents/cp-improve-target/AGENT.md"
require_path "${FIXTURE_ROOT}/.codex/agents/cp-improve-target.toml"
require_path "${FIXTURE_ROOT}/.pi/agents/cp-improve-target.md"

validate_sandbox_dir "$SANDBOX_DIR"

rm -rf "$SANDBOX_DIR"
mkdir -p "$SANDBOX_DIR"

copy_dir "${REPO_ROOT}/.opencode/commands/deep" "${SANDBOX_DIR}/.opencode/commands/deep"
copy_dir "${REPO_ROOT}/.opencode/skills/system-deep-loop/deep-improvement" "${SANDBOX_DIR}/.opencode/skills/system-deep-loop/deep-improvement"
copy_dir "${REPO_ROOT}/.opencode/skills/system-deep-loop/node_modules/@spec-kit" "${SANDBOX_DIR}/.opencode/skills/system-deep-loop/node_modules/@spec-kit"
copy_dir "${REPO_ROOT}/.opencode/skills/system-spec-kit/shared" "${SANDBOX_DIR}/.opencode/skills/system-spec-kit/shared"
copy_dir "${REPO_ROOT}/.opencode/skills/system-spec-kit/node_modules/js-yaml" "${SANDBOX_DIR}/.opencode/skills/system-spec-kit/node_modules/js-yaml"

copy_file "${FIXTURE_ROOT}/.opencode/agents/cp-improve-target.md" "${SANDBOX_DIR}/.opencode/agents/cp-improve-target.md"
copy_file "${FIXTURE_ROOT}/.claude/agents/cp-improve-target.md" "${SANDBOX_DIR}/.claude/agents/cp-improve-target.md"
copy_file "${FIXTURE_ROOT}/.cursor/agents/cp-improve-target.md" "${SANDBOX_DIR}/.cursor/agents/cp-improve-target.md"
copy_file "${FIXTURE_ROOT}/.devin/agents/cp-improve-target/AGENT.md" "${SANDBOX_DIR}/.devin/agents/cp-improve-target/AGENT.md"
copy_file "${FIXTURE_ROOT}/.codex/agents/cp-improve-target.toml" "${SANDBOX_DIR}/.codex/agents/cp-improve-target.toml"
copy_file "${FIXTURE_ROOT}/.pi/agents/cp-improve-target.md" "${SANDBOX_DIR}/.pi/agents/cp-improve-target.md"

echo "Created deep-improvement sandbox at ${SANDBOX_DIR}"
