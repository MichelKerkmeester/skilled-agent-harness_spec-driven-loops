#!/usr/bin/env bash
# usage: assemble.sh <code|md> <body.txt> <out.md>   (prints the assembled line count)
D=$(dirname "$0")
{ cat "$D/_preamble.txt"; echo; cat "$D/_persona-$1.txt"; echo; cat "$2"; echo; cat "$D/_post.txt"; } > "$3"
wc -l < "$3"
