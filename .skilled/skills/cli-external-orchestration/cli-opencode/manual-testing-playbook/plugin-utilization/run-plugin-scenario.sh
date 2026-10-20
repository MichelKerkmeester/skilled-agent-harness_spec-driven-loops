#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: PLUGIN SCENARIO RUNNER
# ───────────────────────────────────────────────────────────────
# Runs one live OpenCode session on v1 or v2 through the capture proxy and
# records what the repository's plugins did: the event stream, every model
# request's system prompt and tool results, and the plugin log lines and
# state files the run wrote.
#
# Usage: run-plugin-scenario.sh <v1|v2> <name> <prompt> [extra opencode args]
#
# Environment:
#   EVIDENCE_DIR  where the run files go (default: $TMPDIR/plugin-utilization)
#   REPO_ROOT     the checkout to run in (default: this script's repository)
#   CFG_EXTRA     JSON merged into the inline config, e.g. an MCP server
#   RUN_ALARM     seconds before the run is killed (default: 600)
#   Any plugin switch (AI_SESSION_CHILD, SK_VISION_AUTOINSPECT, ...) passes through.
#
# Writes: <name>.<ver>.events.jsonl, .capture.jsonl, .effects.txt, .exit
#
# Exit Codes:
#   0 - The run finished; read the files for the verdict
#   2 - Usage error, REPO_ROOT is not a checkout top, or the capture proxy did not start
set -uo pipefail

if [[ $# -lt 3 || ( "$1" != v1 && "$1" != v2 ) ]]; then
  echo "usage: run-plugin-scenario.sh <v1|v2> <name> <prompt> [extra opencode args]" >&2
  exit 2
fi
VERSION=$1 NAME=$2 PROMPT=$3
shift 3

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="${REPO_ROOT:-$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)}"
EVID="${EVIDENCE_DIR:-${TMPDIR:-/tmp}/plugin-utilization}"
MODEL_V1="llmgateway/deepseek-v4.1-flash"
MODEL_V2="llmgateway/deepseek-v4.1-flash#high"
# A REPO_ROOT inherited from another task would run the session, and any file or
# commit it makes, in that checkout instead of this one.
if [[ "$(git -C "$ROOT" rev-parse --show-toplevel 2>/dev/null)" != "$ROOT" ]]; then
  echo "REPO_ROOT is not the top of a git checkout: $ROOT" >&2
  exit 2
fi
echo "running in $ROOT" >&2
mkdir -p "$EVID"

EVENTS="$EVID/$NAME.$VERSION.events.jsonl"
CAPTURE="$EVID/$NAME.$VERSION.capture.jsonl"
EFFECTS="$EVID/$NAME.$VERSION.effects.txt"
rm -f "$EVENTS" "$CAPTURE" "$CAPTURE.ready" "$EFFECTS" "$EVID/$NAME.$VERSION.exit"

# Plugin logs and runtime state live in these two trees, so a copy taken now
# lets the report show only what this run appended.
WATCH=("$ROOT/.skilled/logs" "$ROOT/.skilled/skills/.state")
SNAP="$(mktemp -d)"
PROXY_PID=""
# An interrupted run must not leave the proxy listening or the snapshot behind.
cleanup() {
  [[ -n "$PROXY_PID" ]] && kill "$PROXY_PID" 2>/dev/null
  rm -rf "$SNAP"
}
trap cleanup EXIT
watched_files() {
  local dir
  for dir in "${WATCH[@]}"; do
    [[ -e "$dir" ]] && find "$dir" -type f \( -name '*.log' -o -name '*.jsonl' \) 2>/dev/null
  done
}
while IFS= read -r file; do
  mkdir -p "$SNAP$(dirname "$file")"
  cp "$file" "$SNAP$file"
done < <(watched_files)
touch "$SNAP/.marker"
sleep 1

PORT=$((20000 + RANDOM % 20000))
node "$SCRIPT_DIR/capture-proxy.mjs" "$PORT" "$CAPTURE" &
PROXY_PID=$!
for _ in $(seq 1 20); do [[ -f "$CAPTURE.ready" ]] && break; sleep 0.25; done
# Without the proxy every request would fail and every plugin would look silent.
if [[ ! -f "$CAPTURE.ready" ]]; then
  echo "capture proxy did not start on port $PORT" >&2
  exit 2
fi

# The inline config points the llmgateway provider at the proxy and leaves every
# other setting to the checkout's own configuration.
CONFIG="$(PORT="$PORT" node -e '
  const base = { provider: { llmgateway: { options: { baseURL: `http://127.0.0.1:${process.env.PORT}/v1` } } } };
  const extra = process.env.CFG_EXTRA ? JSON.parse(process.env.CFG_EXTRA) : {};
  process.stdout.write(JSON.stringify({ ...extra, ...base }));
')"

cd "$ROOT" || exit 2
if [[ "$VERSION" == v1 ]]; then
  OPENCODE_CONFIG_CONTENT="$CONFIG" perl -e "alarm ${RUN_ALARM:-600}; exec @ARGV" \
    opencode run --model "$MODEL_V1" --variant high --format json --dir "$ROOT" "$@" "$PROMPT" \
    </dev/null >"$EVENTS" 2>&1
else
  # OpenCode 2 loads every parent folder's .opencode, so a nested checkout pins
  # its own config folder or it would load the outer checkout's plugins too.
  OPENCODE_CONFIG_CONTENT="$CONFIG" OPENCODE_CONFIG_PROJECT_DISABLE=1 OPENCODE_CONFIG_DIR="$ROOT/.opencode" \
    perl -e "alarm ${RUN_ALARM:-600}; exec @ARGV" \
    opencode2 run --standalone -m "$MODEL_V2" --format json "$@" "$PROMPT" \
    </dev/null >"$EVENTS" 2>&1
fi
STATUS=$?
kill "$PROXY_PID" 2>/dev/null
wait "$PROXY_PID" 2>/dev/null
PROXY_PID=""
rm -f "$CAPTURE.ready"
echo "$STATUS" >"$EVID/$NAME.$VERSION.exit"

{
  echo "# new log lines"
  while IFS= read -r file; do
    if [[ -f "$SNAP$file" ]]; then
      tail -c +"$(( $(wc -c <"$SNAP$file") + 1 ))" "$file" | sed "s|^|$(basename "$file"): |"
    else
      sed "s|^|$(basename "$file") (new): |" "$file"
    fi
  done < <(watched_files)
  echo "# files changed during the run"
  for dir in "${WATCH[@]}"; do
    [[ -e "$dir" ]] && find "$dir" -type f -newer "$SNAP/.marker" 2>/dev/null
  done | sed "s|$ROOT/||"
} >"$EFFECTS"

echo "$NAME $VERSION exit=$STATUS requests=$(wc -l <"$CAPTURE" 2>/dev/null | tr -d ' ') evidence=$EVID"
