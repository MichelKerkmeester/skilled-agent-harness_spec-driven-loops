#!/usr/bin/env bash
# WHY: prove the Aside MCP stdio transport end-to-end without touching a
# browser profile: initialize, list tools, print the discovered inventory,
# and close the process. The inventory is runtime-discovered (the server
# advertises listChanged: true), so this probe is how a workflow refreshes
# its version-pinned fixture instead of trusting a hardcoded tool list.

set -euo pipefail

command -v aside >/dev/null 2>&1 || { echo "aside not found — see INSTALL_GUIDE.md" >&2; exit 1; }

OUT_DIR="${1:-/tmp/aside-mcp-probe}"
mkdir -p "$OUT_DIR"
stamp="$(date +%Y%m%d-%H%M%S)"
out_file="$OUT_DIR/handshake-$stamp.jsonl"
err_file="$OUT_DIR/handshake-$stamp.stderr"

REQ_INIT='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"mcp-aside-devtools-example","version":"1.0.0"}}}'
REQ_NOTE='{"jsonrpc":"2.0","method":"notifications/initialized"}'
REQ_LIST='{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

echo "Probing 'aside mcp' over stdio (output: $out_file)"

# Close stdin after the requests; a watchdog kills the child if it survives
# EOF so the probe never hangs and never leaves a stray server process.
(
  { printf '%s\n' "$REQ_INIT"; sleep 1; printf '%s\n' "$REQ_NOTE" "$REQ_LIST"; sleep 3; } \
    | aside mcp >"$out_file" 2>"$err_file"
) &
probe_pid=$!
waited=0
while kill -0 "$probe_pid" 2>/dev/null && [ "$waited" -lt 30 ]; do
  sleep 0.5
  waited=$((waited + 1))
done
kill "$probe_pid" 2>/dev/null || true
wait "$probe_pid" 2>/dev/null || true

echo ""
echo "== Results =="

if ! grep -q '"protocolVersion"' "$out_file" 2>/dev/null; then
  echo "FAIL: no initialize response." >&2
  # Distinguish a dead stdio child from an unavailable Aside daemon/browser —
  # the recovery paths differ (respawn vs escalate).
  [ -s "$err_file" ] && { echo "stderr:"; head -10 "$err_file"; } >&2
  exit 1
fi

if command -v jq >/dev/null 2>&1; then
  echo "-- serverInfo / protocol --"
  jq -c 'select(.id==1) | .result | {protocolVersion, serverInfo, capabilities}' "$out_file" 2>/dev/null || true
  echo "-- discovered tools --"
  jq -c 'select(.id==2) | .result.tools[]? | {name, required: (.inputSchema.required // [])}' "$out_file" 2>/dev/null || true
else
  echo "(install jq for parsed output; raw responses below)"
  head -5 "$out_file"
fi

if grep -q '"name":"repl"' "$out_file" 2>/dev/null || grep -q '"name": "repl"' "$out_file" 2>/dev/null; then
  echo "PASS: 'repl' tool discovered (matches the version-pinned research inventory)."
else
  echo "NOTE: inventory differs from the documented single 'repl' tool — version drift."
  echo "Save this fixture and re-evaluate the workflow before invoking anything."
fi

echo ""
echo "Fixture saved: $out_file"
echo "Reminder: rediscover before every invocation path — never hardcode this inventory."
exit 0
