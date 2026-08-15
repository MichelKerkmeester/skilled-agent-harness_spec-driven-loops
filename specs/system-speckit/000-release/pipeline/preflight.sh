#!/usr/bin/env bash
# Pre-flight — must pass before any dispatch. Never substitutes a model silently.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
fail=0
echo "== pre-flight =="
# self-invocation guard: must NOT be inside opencode
if env | grep -q '^OPENCODE_'; then echo "FAIL: inside an OpenCode session (self-invocation)"; fail=1; else echo "ok: not inside opencode"; fi
command -v opencode >/dev/null && echo "ok: opencode $(opencode --version 2>/dev/null|head -1)" || { echo "FAIL: opencode not installed"; fail=1; }
# provider auth for the extract gateway
provs=$(timeout 40 opencode providers list 2>/dev/null)
echo "$provs" | grep -qi 'OpenCode Go' && echo "ok: OpenCode Go authed" || { echo "FAIL: opencode-go not authed (opencode providers login)"; fail=1; }
echo "$provs" | grep -qi 'DeepSeek'     && echo "ok: DeepSeek authed"     || echo "warn: DeepSeek direct not authed (opencode-go covers extract)"
# synth backend
if [ "$SYNTH_KIND" = "devin" ]; then
  command -v devin >/dev/null && echo "ok: devin present" || { echo "FAIL: SYNTH_KIND=devin but devin not installed"; fail=1; }
  echo "note: ensure 'devin auth login' is complete + smoke-test glm-5-2 before a full run"
else
  echo "ok: synth via $SYNTH_MODEL_OPENCODE (same gateway as extract)"
fi
echo "== models: extract=$EXTRACT_MODEL | synth=$SYNTH_KIND =="
echo "== work dir: $WORK =="
[ $fail -eq 0 ] && echo "PREFLIGHT: READY" || echo "PREFLIGHT: NOT READY"
exit $fail
