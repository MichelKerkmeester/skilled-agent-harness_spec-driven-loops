#!/usr/bin/env bash
# compose.sh <NN> <code|md> <out-name>: PREAMBLE+PERSONA, body, blank line, RUN CONTEXT+DON'T+HANDBACK
set -eu
D=$(cd "$(dirname "$0")" && pwd)
{ cat "$D/_pre-$2.txt" "$D/bodies/$1.txt"; echo; cat "$D/_post.txt"; } > "$D/$3"
wc -l "$D/$3"
