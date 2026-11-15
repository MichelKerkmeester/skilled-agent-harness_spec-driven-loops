#!/bin/sh
d=$(dirname "$0")
[ -f "$d/codes.txt" ] || { echo "codes already issued"; exit 0; }
cat "$d/codes.txt"
rm -f "$d/codes.txt"
