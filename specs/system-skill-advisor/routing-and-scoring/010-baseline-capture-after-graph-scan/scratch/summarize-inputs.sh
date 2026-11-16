#!/usr/bin/env bash
# Summarize, per run, which capture inputs changed between moments.
W=$1
echo "Capture inputs hashed at five moments per run: before the scan, after the regenerate step, after capture 1, before capture 2 and after capture 2."
echo "Input list: $(wc -l < $W/capture-inputs.txt | tr -d ' ') files the capture read (traced with trace-reads.mjs), plus the scan's generation file."
echo
for n in $(seq 1 $(ls -d $W/run-* | wc -l)); do d=$W/run-$n;
  n=${d##*-}
  a=$(diff $d/hash-before-scan.txt $d/hash-after-regenerate.txt | awk '/^>/{print $3}' | tr '\n' ' ')
  b=$(diff $d/hash-after-regenerate.txt $d/hash-after-capture-1.txt | awk '/^>/{print $3}' | tr '\n' ' ')
  c=$(diff $d/hash-after-capture-1.txt $d/hash-before-capture-2.txt | awk '/^>/{print $3}' | tr '\n' ' ')
  e=$(diff $d/hash-before-capture-2.txt $d/hash-after-capture-2.txt | awk '/^>/{print $3}' | tr '\n' ' ')
  w=$(wc -l < $d/hub-watch.log | tr -d ' ')
  echo "run $n"
  echo "  regenerate step changed: ${a:-nothing}"
  echo "  scan + capture 1 changed: ${b:-nothing}"
  echo "  the wait changed: ${c:-nothing}"
  echo "  capture 2 changed: ${e:-nothing}"
  echo "  sk-code graph-metadata.json states seen by the 200 ms poll: $w"
done
