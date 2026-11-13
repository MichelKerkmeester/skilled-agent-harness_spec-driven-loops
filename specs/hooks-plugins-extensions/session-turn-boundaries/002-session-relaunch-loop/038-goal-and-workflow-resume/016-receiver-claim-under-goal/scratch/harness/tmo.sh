#!/usr/bin/env bash
# usage: tmo.sh <seconds> <cmd...>  - runs a command with a wall-clock cap, stdin closed
secs="$1"; shift
"$@" </dev/null &
pid=$!
( sleep "$secs"; kill -TERM "$pid" 2>/dev/null; sleep 2; kill -KILL "$pid" 2>/dev/null ) &
watch=$!
wait "$pid"; code=$?
kill "$watch" 2>/dev/null
exit $code
