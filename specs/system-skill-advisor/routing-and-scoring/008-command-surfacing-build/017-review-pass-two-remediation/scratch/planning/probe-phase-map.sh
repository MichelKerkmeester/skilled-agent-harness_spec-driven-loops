#!/bin/bash
# Run from the repository root: bash <this file>
# Prints each phase map row's status beside the status its child spec states.
# Reads files only.
P=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
rg '^\| [0-9]+ \| [0-9]{3}-' "$P/spec.md" | while IFS='|' read -r _ num folder _ status _; do
  folder=$(echo "$folder" | tr -d ' /'); map=$(echo "$status" | sed 's/^ *//;s/ *$//')
  child=$(rg -o -m1 '\*\*Status\*\* \| [A-Za-z ]+' "$P/$folder/spec.md" 2>/dev/null | sed 's/.*| //;s/ *$//')
  flag=""; [ "$map" != "$child" ] && flag="  <- differs"
  echo "row$num $folder: map=$map child=$child$flag"
done
