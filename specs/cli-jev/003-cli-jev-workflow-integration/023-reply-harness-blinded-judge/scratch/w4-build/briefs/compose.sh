#!/usr/bin/env bash
# Compose a brief: PREAMBLE, PERSONA, task, RUN CONTEXT, DON'T, HANDBACK.
# usage: compose.sh <code|markdown> <task.md> <brief.md>
set -eu
B="$(dirname "$0")/_blocks"
{ cat "$B/preamble.txt"; echo; cat "$B/persona-$1.txt"; echo; cat "$2"; echo; cat "$B/run-context.txt"; echo; cat "$B/dont.txt"; echo; cat "$B/handback.txt"; } > "$3"
wc -l < "$3"
