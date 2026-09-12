#!/usr/bin/env bash
# Evidence runner: writes stdout, stderr, exit status and elapsed ms to separate files.
# No pipes anywhere in the measured path.
EV="$(cd "$(dirname "$0")" && pwd)/evidence"
id="$1"; shift
mkdir -p "$EV"
{ printf '%q ' "$@"; printf '\n'; } > "$EV/$id.cmd"
s=$(python3 -c 'import time;print(int(time.time()*1000))')
"$@" > "$EV/$id.out" 2> "$EV/$id.err"
rc=$?
e=$(python3 -c 'import time;print(int(time.time()*1000))')
echo "$rc" > "$EV/$id.rc"
echo "$((e-s))" > "$EV/$id.ms"
echo "[$id] exit=$rc ms=$((e-s))"
echo "--- stdout ---"; cat "$EV/$id.out"
echo "--- stderr ---"; cat "$EV/$id.err"
