#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: BLADEBRO ATTACH READ
# ───────────────────────────────────────────────────────────────
# Attaches Bladebro to a browser the operator already runs on a fixed debug
# port and reads one confirmed site: the page text, the page model and a
# title check that tells a signed-in page from a sign-in page.
#
# MUTATION CLASS: read-only on the page. It navigates the attached tab to URL
# once and then only reads. It never clicks or types, and it never launches,
# quits or kills a browser. It prints only exit codes, the "ok" result and
# the eval line, never page text, so no signed-in content reaches the output.
#
# Run it only on an explicit operator request, after the operator picked the
# browser and confirmed the site. Starting the browser with the port, and
# closing the port afterwards, stay with the operator. While the port is
# open, any local process can drive that browser.
#
# Usage: attach-read.sh --port <N> <URL>
#
# Exit Codes:
#   0 - The port answered and every read succeeded
#   1 - bladebro or curl is missing, the port did not answer or a read failed
#   2 - Invalid arguments
set -euo pipefail

PORT=""
URL=""

err() { printf 'ERROR: %s\n' "$*" >&2; }

usage() {
  printf 'Usage: attach-read.sh --port <N> <URL>\n'
  printf 'The operator first starts the browser with --remote-debugging-port=<N>.\n'
}

# Reports the exit code and the "ok" field of one read without echoing the
# page content the read returned.
check_read() {
  local label="$1"
  local output="$2"
  if [[ "$output" != *'"ok":true'* ]]; then
    err "$label returned no \"ok\":true"
    return 1
  fi
  printf 'PASS: %s (exit 0, ok true)\n' "$label"
}

# The eval value sits inside the envelope's "text" field as escaped JSON, so
# a real JSON parser reads it; without one the value is reported as unparsed.
json_text() {
  local output="$1"
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$output" | jq -r '.text'
  elif command -v python3 >/dev/null 2>&1; then
    printf '%s' "$output" | python3 -c 'import json, sys; print(json.load(sys.stdin)["text"])'
  else
    printf '(install jq or python3 to print the eval result)'
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      if [[ $# -lt 2 ]]; then
        err "--port needs a value"
        exit 2
      fi
      PORT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      err "unknown option: $1"
      exit 2
      ;;
    *)
      if [[ -n "$URL" ]]; then
        err "only one URL is accepted"
        exit 2
      fi
      URL="$1"
      shift
      ;;
  esac
done

if [[ ! "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  err "--port must be a number from 1 to 65535"
  usage >&2
  exit 2
fi
if [[ ! "$URL" =~ ^https?:// ]]; then
  err "a URL starting with http:// or https:// is required"
  usage >&2
  exit 2
fi
# The URL is embedded in a single-quoted JavaScript string below.
if [[ "$URL" == *"'"* || "$URL" == *\\* ]]; then
  err "the URL must not contain a quote or a backslash"
  exit 2
fi
for tool in bladebro curl; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    err "$tool not found"
    exit 1
  fi
done

export BLADE_NO_UPDATE_CHECK=1
export BLADE_PLAIN=1

printf '== Step 1: probe the debug port %s ==\n' "$PORT"
if ! version_out="$(curl -s --max-time 3 "http://127.0.0.1:$PORT/json/version")" \
  || [[ "$version_out" != *'"Browser"'* ]]; then
  err "no browser answered on port $PORT; the operator starts it with --remote-debugging-port=$PORT after quitting it fully"
  exit 1
fi
printf 'PASS: the debug port answered with a Browser line\n'

printf '== Step 2: see content ==\n'
if ! content_out="$(bladebro see content "$URL" --port "$PORT" --json 2>/dev/null)"; then
  err "see content exited non-zero"
  exit 1
fi
check_read "see content" "$content_out"

printf '== Step 3: see model ==\n'
if ! model_out="$(bladebro see model --port "$PORT" --json 2>/dev/null)"; then
  err "see model exited non-zero"
  exit 1
fi
check_read "see model" "$model_out"

# The eval returns two booleans and never the hostname, which on a site with
# one subdomain per customer would name the workspace. "host-match true
# sign-in false" means the tab is on the target and holds a session for it.
printf '== Step 4: act eval ==\n'
eval_js="'host-match ' + (location.hostname === new URL('$URL').hostname) + ' sign-in ' + /sign ?in|log ?in/i.test(document.title)"
if ! eval_out="$(bladebro act eval "$eval_js" --port "$PORT" --json 2>/dev/null)"; then
  err "act eval exited non-zero"
  exit 1
fi
check_read "act eval" "$eval_out"
printf 'eval: %s\n' "$(json_text "$eval_out")"

printf '\nDone. Close the debug port now: quit the browser, then start it normally.\n'
exit 0
