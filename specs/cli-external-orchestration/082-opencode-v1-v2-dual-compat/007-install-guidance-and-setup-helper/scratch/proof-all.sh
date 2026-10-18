#!/bin/bash
# Final proof set for the setup helper. Usage: proof-all.sh <scratch-dir> <helper> <out-dir>
# Every run uses a throwaway HOME under <scratch-dir>; the operator's ~/.local/bin is never on PATH.
set -u
S=$1 H=$2 O=$3
N=/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin
mkdir -p "$O"
red() { sed "s#$S#<scratch>#g"; }
tree_hash() { (cd "$1" && find . -type f -print0 | sort -z | xargs -0 shasum -a 256 | shasum -a 256 | cut -c1-16; find . -type f | wc -l | tr -d ' '); }
envh() { export HOME="$1" PATH="$1/.local/bin:$N:/opt/homebrew/bin:/usr/bin:/bin" npm_config_cache="$S/npm-cache"; unset OPENCODE_BIN OPENCODE_DB; }

rm -rf "$S/home"; mkdir -p "$S/home"
( envh "$S/home"; r=$(command -v opencode || true); [ -z "$r" ] || { echo "STOP $r"; exit 9; }; cd "$HOME"; bash "$H" both > "$O/both-1.txt" 2>&1; echo "exit=$?" >> "$O/both-1.txt" )
( envh "$S/home"; cd "$HOME"; sh -x "$HOME/.local/bin/opencode2" --version > "$O/launcher-trace.txt" 2>&1 )
ps -axo pid,lstart,command | grep -E "scratch/home|opencode-v2/.*opencode\.exe|opencode-ai/bin/opencode\.exe" | grep -v grep | cut -c1-120 > "$O/ps-after-both.txt"
tree_hash "$S/home" > "$O/tree-after-run1.txt"
( envh "$S/home"; cd "$HOME"; bash "$H" both > "$O/both-2.txt" 2>&1; echo "exit=$?" >> "$O/both-2.txt" )
tree_hash "$S/home" > "$O/tree-after-run2.txt"
( envh "$S/home"; cd "$HOME"; bash "$H" check > "$O/check.txt" 2>&1; echo "exit=$?" >> "$O/check.txt" )
tree_hash "$S/home" > "$O/tree-after-check.txt"
( cd "$S/home" && find . -type f -newer "$O/tree-after-run2.txt" ) > "$O/files-changed-by-check.txt"

F="$S/fakes"; rm -rf "$F"; mkdir -p "$F"
mk() { mkdir -p "$(dirname "$1")"; printf '#!/bin/sh\n%s\n' "$2" > "$1"; chmod +x "$1"; }
mk "$F/v1/opencode" 'echo 1.19.3'
mk "$F/v2/opencode" 'echo "opencode v2.0.32"'
mk "$F/bad/opencode" 'echo "opencode 1.19.3 malformed"'
{
  for c in "v1 v2" "v2 v1"; do set -- $c; mkdir -p "$F/h-$1-$2"
    ( export HOME="$F/h-$1-$2" PATH="$F/$1:$N:/opt/homebrew/bin:/usr/bin:/bin"; cd "$HOME"; bash "$H" "$2" > "$O/tmp.txt" 2>&1; e=$?; echo "fake $1 on PATH, mode $2: exit=$e, files written=$(find "$HOME" -type f | wc -l | tr -d ' ')"; grep -E "ERROR" "$O/tmp.txt" )
  done
  mkdir -p "$F/h-bad"; ( export HOME="$F/h-bad" PATH="$F/bad:/usr/bin:/bin"; cd "$HOME"; bash "$H" check > "$O/tmp.txt" 2>&1; echo "malformed 'opencode 1.19.3 malformed' on PATH, check: exit=$?"; grep -E "bare name" "$O/tmp.txt" )
  mkdir -p "$F/h-bad2/.local/bin"; cp "$F/bad/opencode" "$F/h-bad2/.local/bin/opencode"; ( export HOME="$F/h-bad2" PATH="/usr/bin:/bin"; cd "$HOME"; bash "$H" check > "$O/tmp.txt" 2>&1; echo "malformed line in HOME bin, check: exit=$?"; grep -E "^  shape" "$O/tmp.txt" | head -1 )
  for c in cr joined empty; do mkdir -p "$F/s-$c/.local/bin"; done
  printf '#!/bin/sh\nprintf "1.19.3\\r\\n"\n' > "$F/s-cr/.local/bin/opencode"; printf '#!/bin/sh\nprintf "opencode v2.0.32\\nWARN: x\\n"\n' > "$F/s-joined/.local/bin/opencode2"; printf '#!/bin/sh\nexit 0\n' > "$F/s-empty/.local/bin/opencode"; chmod +x "$F"/s-*/.local/bin/*
  for c in cr joined empty; do ( export HOME="$F/s-$c" PATH="/usr/bin:/bin"; cd "$HOME"; out=$(bash "$H" check 2>&1); echo "shape row $c: exit=$? $(printf '%s\n' "$out" | grep -E '^  shape' | tr '\n' ' ')" ); done
  mkdir -p "$F/h-v2path"; ( export HOME="$F/h-v2path"; export PATH="$HOME/.local/opencode-v2/bin:$N:/opt/homebrew/bin:/usr/bin:/bin"; cd "$HOME"; bash "$H" both > "$O/tmp.txt" 2>&1; echo "V2_PREFIX/bin on PATH, both: exit=$?, files written=$(find "$HOME" -type f | wc -l | tr -d ' ')" )
  mkdir -p "$F/h-nonpm"; ( export HOME="$F/h-nonpm" PATH="/usr/bin:/bin"; cd "$HOME"; bash "$H" both > "$O/tmp.txt" 2>&1; echo "npm missing, both: exit=$?, files written=$(find "$HOME" -type f | wc -l | tr -d ' ')" )
  bash "$H" > /dev/null 2>&1; echo "no mode: exit=$?"; bash "$H" bogus > /dev/null 2>&1; echo "unknown mode: exit=$?"
  SP="$F/home with spaces"; mkdir -p "$SP"; ( envh "$SP"; cd "$HOME"; bash "$H" both > "$O/tmp.txt" 2>&1; echo "HOME with spaces, both: exit=$?"; grep -E "verify" "$O/tmp.txt"; bash "$H" both > /dev/null 2>&1; echo "HOME with spaces, both again: exit=$?"; bash "$H" check > /dev/null 2>&1; echo "HOME with spaces, check: exit=$?" )
  mkdir -p "$F/h-link/.local/bin" "$F/elsewhere"; cp -R "$S/home/.local" "$F/h-link/" ; rm -f "$F/h-link/.local/bin/opencode2"; printf 'outside\n' > "$F/elsewhere/target"; ln -s "$F/elsewhere/target" "$F/h-link/.local/bin/opencode2"
  ( envh "$F/h-link"; cd "$HOME"; bash "$H" both > "$O/tmp.txt" 2>&1; echo "launcher is a symlink, both: exit=$?, link target now: $(cat "$F/elsewhere/target")"; grep -E "ERROR" "$O/tmp.txt" )
} 2>&1 | red > "$O/adversarial.txt"
rm -f "$O/tmp.txt"
for f in "$O"/*.txt; do red < "$f" > "$f.r" && mv "$f.r" "$f"; done
