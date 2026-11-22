#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: BLADEBRO AGENT-BROWSER READ
# ───────────────────────────────────────────────────────────────
# Reads one page on an isolated Bladebro agent browser: the page text, the
# page model with refs and a marked screenshot whose PNG is checked on disk.
#
# MUTATION CLASS: browser-side only. It navigates a Bladebro-owned agent
# browser that lives in a scratch BLADE_HOME, copies one PNG into OUT_DIR and
# deletes the scratch home on exit. It never touches a personal browser
# profile, the shared Bladebro data root or a repository file.
#
# Usage: agent-browser-read.sh [URL] [OUT_DIR]
#   URL      defaults to https://example.com
#   OUT_DIR  defaults to ${TMPDIR:-/tmp}/bladebro-agent-read
#
# Exit Codes:
#   0 - Every read succeeded and the PNG passed the on-disk check
#   1 - bladebro is missing, a read failed or the PNG check failed
#   2 - Invalid arguments
set -euo pipefail

readonly DEFAULT_URL="https://example.com"
readonly PNG_MAGIC="89504e47"

URL="${1:-$DEFAULT_URL}"
OUT_DIR="${2:-${TMPDIR:-/tmp}/bladebro-agent-read}"
SCRATCH_HOME=""

err() { printf 'ERROR: %s\n' "$*" >&2; }

# The daemon and its browser live inside the scratch home, so stopping with
# the same BLADE_HOME stops only this script's daemon and never another one.
# shellcheck disable=SC2329  # invoked through trap EXIT
cleanup() {
  if [[ -n "$SCRATCH_HOME" && -d "$SCRATCH_HOME" ]]; then
    BLADE_HOME="$SCRATCH_HOME" bladebro stop >/dev/null 2>&1 || true
    rm -rf "$SCRATCH_HOME"
  fi
}

# The CLI prints one compact JSON object with --json; a successful result
# carries "ok":true, and the exit code alone is checked first.
require_ok() {
  local label="$1"
  local output="$2"
  if [[ "$output" != *'"ok":true'* ]]; then
    err "$label returned no \"ok\":true"
    return 1
  fi
  printf 'PASS: %s\n' "$label"
}

if [[ $# -gt 2 ]]; then
  err "expected at most two arguments: [URL] [OUT_DIR]"
  exit 2
fi
if [[ ! "$URL" =~ ^https?:// ]]; then
  err "URL must start with http:// or https://"
  exit 2
fi
if ! command -v bladebro >/dev/null 2>&1; then
  err "bladebro not found; see ../INSTALL-GUIDE.md (installing is an operator decision)"
  exit 1
fi

SCRATCH_HOME="$(mktemp -d "${TMPDIR:-/tmp}/bladebro-home.XXXXXX")"
trap cleanup EXIT

# A scratch BLADE_HOME starts a fresh daemon with these settings, because a
# running daemon would keep its own launch settings.
export BLADE_HOME="$SCRATCH_HOME"
export BLADE_LANE=agent
export BLADE_NO_UPDATE_CHECK=1
export BLADE_PLAIN=1

mkdir -p "$OUT_DIR"
printf 'Target URL:   %s\n' "$URL"
printf 'Scratch home: %s (deleted on exit)\n' "$SCRATCH_HOME"
printf 'Output dir:   %s\n\n' "$OUT_DIR"

printf '== Step 1: see content ==\n'
if ! content_out="$(bladebro see content "$URL" --json 2>/dev/null)"; then
  err "see content exited non-zero: ${content_out:-no output}"
  exit 1
fi
require_ok "see content" "$content_out"

printf '== Step 2: see model ==\n'
if ! model_out="$(bladebro see model --json 2>/dev/null)"; then
  err "see model exited non-zero: ${model_out:-no output}"
  exit 1
fi
require_ok "see model" "$model_out"

printf '== Step 3: vision --marks ==\n'
if ! vision_out="$(bladebro vision --marks --json 2>/dev/null)"; then
  err "vision exited non-zero: ${vision_out:-no output}"
  exit 1
fi
require_ok "vision --marks" "$vision_out"

image_path="$(printf '%s' "$vision_out" | sed -n 's/.*"image_path":"\([^"]*\)".*/\1/p')"
if [[ -z "$image_path" || ! -s "$image_path" ]]; then
  err "vision reported no readable image_path"
  exit 1
fi

# The response is not proof: the file must exist, be non-empty and start
# with the PNG magic bytes.
magic="$(od -An -tx1 -N4 "$image_path" | tr -d ' \n')"
if [[ "$magic" != "$PNG_MAGIC" ]]; then
  err "image at $image_path is not a PNG (magic: ${magic:-none})"
  exit 1
fi

stamp="$(date +%Y%m%d-%H%M%S)"
saved="$OUT_DIR/marked-$stamp.png"
cp "$image_path" "$saved"
printf 'PASS: PNG verified and saved to %s\n' "$saved"
exit 0
