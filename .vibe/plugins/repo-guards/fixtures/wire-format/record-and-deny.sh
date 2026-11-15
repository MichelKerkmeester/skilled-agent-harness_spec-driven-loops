#!/bin/sh
# Wire-format fixture: append the hook's stdin payload to $WIRE_LOG, then deny the call.
# The deny reply uses Vibe's structured-response schema on stdout with exit 0.
cat >> "${WIRE_LOG:?WIRE_LOG must name the capture file}"
printf '\n' >> "$WIRE_LOG"
printf '%s\n' '{"decision": "deny", "reason": "wire-format fixture: shell calls are refused in this run"}'
