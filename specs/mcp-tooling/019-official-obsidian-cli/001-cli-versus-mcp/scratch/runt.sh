#!/usr/bin/env bash
# Evidence runner with a hard timeout (portable, no coreutils). Writes stdout/stderr/exit/elapsed to files.
EV="$(cd "$(dirname "$0")" && pwd)/evidence"
to="$1"; id="$2"; shift 2
mkdir -p "$EV"
{ printf '%q ' "$@"; printf '\n'; } > "$EV/$id.cmd"
s=$(python3 -c 'import time;print(int(time.time()*1000))')
"$@" > "$EV/$id.out" 2> "$EV/$id.err" &
pid=$!
( sleep "$to"; kill -9 $pid 2>/dev/null ) & watcher=$!
wait $pid; rc=$?
kill -9 $watcher 2>/dev/null
e=$(python3 -c 'import time;print(int(time.time()*1000))')
echo "$rc" > "$EV/$id.rc"; echo "$((e-s))" > "$EV/$id.ms"
