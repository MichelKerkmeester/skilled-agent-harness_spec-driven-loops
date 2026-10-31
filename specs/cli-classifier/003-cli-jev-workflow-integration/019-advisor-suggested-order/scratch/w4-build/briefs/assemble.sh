#!/usr/bin/env bash
# usage: assemble.sh <name> <code|md>  -> writes <name>.md from the shared blocks and bodies/<name>.txt
set -eu
cd "$(dirname "$0")"
N="$1"; K="$2"
cat _preamble.txt "_persona-$K.txt" "bodies/$N.txt" _post.txt > "$N.md"
wc -l < "$N.md"
