#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: BLADEBRO RUN STEP PLAN
# ───────────────────────────────────────────────────────────────
# Runs a two-step Bladebro plan, navigate then read, in one call and checks
# that the plan reports status "completed".
#
# MUTATION CLASS: browser-side only. It navigates a Bladebro-owned agent
# browser that lives in a scratch BLADE_HOME and deletes that home and the
# plan file on exit. It never touches a personal browser profile, the shared
# Bladebro data root or a repository file.
#
# Usage: run-step-plan.sh [URL]
#   URL  defaults to https://example.com
#
# Exit Codes:
#   0 - The plan reported status "completed"
#   1 - bladebro is missing, the plan exited non-zero or it stopped early
#   2 - Invalid arguments
set -euo pipefail

readonly DEFAULT_URL="https://example.com"

URL="${1:-$DEFAULT_URL}"
SCRATCH_HOME=""
PLAN_FILE=""

err() { printf 'ERROR: %s\n' "$*" >&2; }

# Stopping with the scratch BLADE_HOME reaches only this script's daemon.
# shellcheck disable=SC2329  # invoked through trap EXIT
cleanup() {
  if [[ -n "$SCRATCH_HOME" && -d "$SCRATCH_HOME" ]]; then
    BLADE_HOME="$SCRATCH_HOME" bladebro stop >/dev/null 2>&1 || true
    rm -rf "$SCRATCH_HOME"
  fi
  if [[ -n "$PLAN_FILE" && -f "$PLAN_FILE" ]]; then
    rm -f "$PLAN_FILE"
  fi
}

if [[ $# -gt 1 ]]; then
  err "expected at most one argument: [URL]"
  exit 2
fi
# The URL is written into JSON, so only plain http(s) URLs without quotes or
# backslashes are accepted.
if [[ ! "$URL" =~ ^https?://[^\"\\[:space:]]+$ ]]; then
  err "URL must start with http:// or https:// and hold no quotes, backslashes or spaces"
  exit 2
fi
if ! command -v bladebro >/dev/null 2>&1; then
  err "bladebro not found; see ../INSTALL-GUIDE.md (installing is an operator decision)"
  exit 1
fi

SCRATCH_HOME="$(mktemp -d "${TMPDIR:-/tmp}/bladebro-home.XXXXXX")"
PLAN_FILE="$(mktemp "${TMPDIR:-/tmp}/bladebro-plan.XXXXXX")"
trap cleanup EXIT

export BLADE_HOME="$SCRATCH_HOME"
export BLADE_LANE=agent
export BLADE_NO_UPDATE_CHECK=1
export BLADE_PLAIN=1

# A plan validates every static step before the first effect, so a malformed
# step fails with a usage error before anything navigates.
printf '[{"action":"navigate","url":"%s"},{"action":"see","mode":"content"}]\n' "$URL" >"$PLAN_FILE"

printf 'Target URL: %s\n' "$URL"
printf 'Plan:       %s\n\n' "$(cat "$PLAN_FILE")"

if ! plan_out="$(bladebro run "@$PLAN_FILE" --format json 2>/dev/null)"; then
  err "bladebro run exited non-zero"
  printf '%s\n' "${plan_out:-no output}" | head -5 >&2
  exit 1
fi

if [[ "$plan_out" != *'"status":"completed"'* ]]; then
  err "the plan did not report status \"completed\""
  printf '%s\n' "$plan_out" | head -5 >&2
  exit 1
fi

printf 'PASS: plan status "completed"\n'
exit 0
