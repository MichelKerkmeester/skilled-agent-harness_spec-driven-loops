#!/bin/sh
# Stand-in for osascript in the delivery tests: writes each argument on its
# own line to the file named by OSASCRIPT_STUB_LOG and exits with
# OSASCRIPT_STUB_EXIT, so a test can see the argv without any notice shown.
for arg in "$@"; do printf '%s\n--\n' "$arg" >> "$OSASCRIPT_STUB_LOG"; done
exit "${OSASCRIPT_STUB_EXIT:-0}"
