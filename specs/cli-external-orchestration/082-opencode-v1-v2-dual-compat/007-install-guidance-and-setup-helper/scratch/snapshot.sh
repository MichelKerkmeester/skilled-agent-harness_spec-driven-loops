#!/bin/sh
# Read-only snapshot of the operator's OpenCode installs. Usage: snapshot.sh <out-file>
# Runs with the operator's real HOME; it only lists and stats. It launches no OpenCode binary,
# because a v2 launch appends to the v2 log and a v1 launch opens the shared database.
OUT=$1
R=/Users/michelkerkmeester
{
  echo "# names and link targets"
  for d in "$R/.local/bin" "$R/.local/opencode-v2/bin"; do
    for n in opencode opencode2; do
      p="$d/$n"
      if [ -e "$p" ] || [ -L "$p" ]; then
        printf '%s -> %s | sha256 %s | mtime %s\n' "$p" "$(readlink "$p" || echo '(file)')" "$(shasum -a 256 "$p" | cut -d' ' -f1)" "$(stat -f %m "$p")"
      fi
    done
  done
  echo "# realpath targets"
  for p in "$R/.local/bin/opencode" "$R/.local/opencode-v2/bin/opencode2"; do
    t=$(python3 -c 'import os,sys;print(os.path.realpath(sys.argv[1]))' "$p")
    printf '%s | size %s | mtime %s\n' "$t" "$(stat -f %z "$t")" "$(stat -f %m "$t")"
  done
  echo "# opencode service and server processes (pid, start, command head)"
  ps -axo pid,lstart,command | grep -E "opencode-v2/.*opencode\.exe|opencode-ai/bin/opencode\.exe" | grep -v grep | cut -c1-140 | sort
  echo "# top-level entries of ~/.config/opencode and ~/.local/share/opencode (name, mtime)"
  for d in "$R/.config/opencode" "$R/.local/share/opencode"; do
    for e in "$d"/* "$d"/.[!.]*; do [ -e "$e" ] && printf '%s | %s\n' "$e" "$(stat -f %m "$e")"; done
  done
  echo "# prefix package versions"
  for f in "$R/.local/lib/node_modules/opencode-ai/package.json" "$R/.local/opencode-v2/lib/node_modules/@opencode/cli/package.json"; do
    printf '%s | %s\n' "$f" "$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["version"])' "$f")"
  done
} > "$OUT" 2>&1
