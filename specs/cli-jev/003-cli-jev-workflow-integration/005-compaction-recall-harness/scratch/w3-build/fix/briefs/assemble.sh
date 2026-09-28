#!/usr/bin/env bash
# usage: assemble.sh <body.txt> <out.md>   (joins the verbatim shared blocks around one task body)
D=$(dirname "$0")/blocks
{ cat "$D/preamble.txt"; echo; cat "$D/persona-code.txt"; echo; cat "$1"; echo; cat "$D/run-context.txt"; echo; cat "$D/dont.txt"; echo; cat "$D/handback.txt"; } > "$2"
wc -l < "$2"
