#!/usr/bin/env bash
# usage: assemble.sh <code|md> <devin|pi> <body.txt> <out.md>
D=$(dirname "$0")
POST="$D/_post.txt"; [ "$2" = devin ] && POST="$D/_post-devin.txt"
{ cat "$D/_preamble.txt"; echo; cat "$D/_persona-$1.txt"; echo; cat "$3"; echo; cat "$POST"; } > "$4"
wc -l < "$4"
