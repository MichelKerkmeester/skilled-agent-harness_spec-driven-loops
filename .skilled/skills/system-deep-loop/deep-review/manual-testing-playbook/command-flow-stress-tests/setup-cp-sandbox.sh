#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Deep Review Command Sandbox Setup
# ───────────────────────────────────────────────────────────────
# Build a disposable sandbox under /tmp holding the speckit commands, the
# deep-review, spec-kit and sk-code skills, the deep-review agents and a
# small review target with its test.
#
# Exit Codes:
#   0 - Sandbox created, or help printed
#   1 - A required source path is missing
#   2 - Invalid argument or sandbox directory
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../../../.." && pwd)"
SANDBOX_DIR="/tmp/cp-deep-review-sandbox"

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

# Guard the destructive rm -rf: the sandbox dir must name a child of /tmp, not
# /tmp itself, and must still sit inside /tmp once symlinks are resolved, so a
# stray or malicious --sandbox-dir value can never wipe /tmp or a directory a
# link under /tmp points to.
validate_sandbox_dir() {
  local dir="$1"
  local trimmed
  local existing
  local tail=""
  local resolved
  local tmp_real
  if [[ -z "$dir" ]]; then
    echo "ERROR: sandbox dir must not be empty" >&2
    exit 2
  fi
  if [[ "$dir" != /* ]]; then
    echo "ERROR: sandbox dir must be an absolute path: $dir" >&2
    exit 2
  fi
  case "/${dir}/" in
    */./*|*/../*)
      echo "ERROR: sandbox dir must not contain '.' or '..' segments: $dir" >&2
      exit 2
      ;;
  esac
  if [[ "$dir" != /tmp/* ]]; then
    echo "ERROR: sandbox dir must be under /tmp/: $dir" >&2
    exit 2
  fi

  # Resolve the deepest part of the path that exists (a link counts, even a
  # dangling one), then append the parts that do not exist yet.
  trimmed="$dir"
  while [[ "$trimmed" == */ ]]; do
    trimmed="${trimmed%/}"
  done
  existing="$trimmed"
  while [[ ! -e "$existing" && ! -L "$existing" ]]; do
    tail="/${existing##*/}${tail}"
    existing="${existing%/*}"
  done
  tmp_real="$(CDPATH='' cd -- /tmp && pwd -P)"
  if ! resolved="$(CDPATH='' cd -- "$existing" 2>/dev/null && pwd -P)"; then
    echo "ERROR: sandbox dir must resolve inside /tmp/: $dir" >&2
    exit 2
  fi
  resolved="${resolved}${tail}"
  if [[ "$resolved" != "$tmp_real"/?* ]]; then
    echo "ERROR: sandbox dir must resolve inside /tmp/: $dir" >&2
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

require_path "${REPO_ROOT}/.skilled/commands/speckit"
require_path "${REPO_ROOT}/.skilled/skills/system-deep-loop/deep-review"
require_path "${REPO_ROOT}/.skilled/skills/system-spec-kit"
require_path "${REPO_ROOT}/.skilled/skills/sk-code"
require_path "${REPO_ROOT}/.skilled/agents/deep-review.md"
require_path "${REPO_ROOT}/.claude/agents/deep-review.md"

validate_sandbox_dir "$SANDBOX_DIR"

rm -rf "$SANDBOX_DIR"
mkdir -p "$SANDBOX_DIR"

copy_dir "${REPO_ROOT}/.skilled/commands/speckit" "${SANDBOX_DIR}/.skilled/commands/speckit"
copy_dir "${REPO_ROOT}/.skilled/skills/system-deep-loop/deep-review" "${SANDBOX_DIR}/.skilled/skills/system-deep-loop/deep-review"
copy_dir "${REPO_ROOT}/.skilled/skills/system-spec-kit" "${SANDBOX_DIR}/.skilled/skills/system-spec-kit"
copy_dir "${REPO_ROOT}/.skilled/skills/sk-code" "${SANDBOX_DIR}/.skilled/skills/sk-code"

copy_file "${REPO_ROOT}/.skilled/agents/deep-review.md" "${SANDBOX_DIR}/.skilled/agents/deep-review.md"
copy_file "${REPO_ROOT}/.claude/agents/deep-review.md" "${SANDBOX_DIR}/.claude/agents/deep-review.md"

# OpenCode reads agents through .opencode/agents, a link to the source tree, as in the repo.
mkdir -p "${SANDBOX_DIR}/.opencode"
ln -s ../.skilled/agents "${SANDBOX_DIR}/.opencode/agents"

mkdir -p "${SANDBOX_DIR}/targets"
cat > "${SANDBOX_DIR}/targets/review-target.js" <<'TARGET'
export function normalizeUser(user) {
  if (!user) return { id: "anonymous", role: "guest" };
  return { id: String(user.id), role: user.role || "guest" };
}
TARGET
cat > "${SANDBOX_DIR}/targets/review-target.test.js" <<'TARGET'
import { normalizeUser } from "./review-target.js";

if (normalizeUser({ id: 42 }).id !== "42") {
  throw new Error("normalizeUser should coerce id to string");
}
TARGET

echo "Created deep-review CP sandbox at ${SANDBOX_DIR}"
