#!/bin/bash
# Interleaved timing of the full census: baseline copy (B) against the current scanner (N),
# three runs each at one commit and worktree state. Each default run is bracketed by
# `git status --porcelain --untracked-files=all` to show it writes no file.
set -u
ROOT="$1"
D="$ROOT/specs/system-speckit/050-open-knowledge-format-adoption/009-census-hardening/scratch"
OUT="$D/timing"
mkdir -p "$OUT"
cd "$ROOT" || exit 2
echo "commit $(git rev-parse --short=12 HEAD) started $(date -u +%FT%TZ)" > "$OUT/timing.log"
for i in 1 2 3; do
  for arm in B N; do
    if [ "$arm" = B ]; then S="$D/baseline-scanner/cite-drift-scan.mjs"; else S="$ROOT/.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"; fi
    git status --porcelain --untracked-files=all | grep -v -e "/009-census-hardening/scratch/timing/" -e "/009-census-hardening/scratch/labels/" -e "system-skill-advisor/runtime/" > "$OUT/status-before-$arm$i.txt"
    touch "$OUT/.marker"
    s=$(python3 -c 'import time;print(time.time())')
    node "$S" --corpus all > "$OUT/census-$arm$i.txt" 2> "$OUT/census-$arm$i.err"; rc=$?
    e=$(python3 -c 'import time;print(time.time())')
    find . \( -path ./.git -o -path '*/node_modules' -o -path '*/009-census-hardening/scratch/timing' -o -path '*/009-census-hardening/scratch/labels' -o -path '*/system-skill-advisor/runtime' \) -prune -o -type f -newer "$OUT/.marker" -print > "$OUT/newer-$arm$i.txt"
    git status --porcelain --untracked-files=all | grep -v -e "/009-census-hardening/scratch/timing/" -e "/009-census-hardening/scratch/labels/" -e "system-skill-advisor/runtime/" > "$OUT/status-after-$arm$i.txt"
    same=$(cmp -s "$OUT/status-before-$arm$i.txt" "$OUT/status-after-$arm$i.txt" && echo yes || echo no)
    echo "$arm$i rc=$rc seconds=$(python3 -c "print(round($e-$s,1))") sha=$(shasum -a 256 "$OUT/census-$arm$i.txt" | cut -c1-16) status_unchanged=$same files_written=$(wc -l < "$OUT/newer-$arm$i.txt" | tr -d ' ')" >> "$OUT/timing.log"
  done
done
echo DONE >> "$OUT/timing.log"
