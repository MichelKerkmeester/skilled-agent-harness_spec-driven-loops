#!/usr/bin/env bash
# Reduces one run's raw transcripts to the extract the packet cites, then deletes the raw
# transcripts (they hold the runtime's system prompt and any private instruction files) and the
# runtime's own project or session folder for the sandbox. Usage: finish-run.sh <claude|pi> <out-dir>
set -u
kind="$1"; out="$2"; here="$(cd "$(dirname "$0")" && pwd)"
for f in "$out"/transcript-*.jsonl; do
  [ -e "$f" ] || continue
  id=$(basename "$f" .jsonl); id=${id#transcript-}
  case "$kind" in
    claude) { echo "# $id"; node "$here/extract-receiver.cjs" "$f" | cut -c1-400; } > "$out/extract-${id}.txt" ;;
    pi) { echo "# $id"; node "$here/extract-pi.cjs" "$f" | cut -c1-400; } > "$out/extract-${id#*_}.txt" ;;
  esac
  rm -f "$f"
done
[ -f "$out/project-dir.txt" ] && rm -rf "$(cat "$out/project-dir.txt")"
rm -rf "$out/run"
