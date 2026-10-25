#!/usr/bin/env bash
# Reduces one run's raw transcripts to the extract the packet cites, then deletes the raw
# transcripts (they hold the operator's private instruction files) and the project logs.
# Usage: finish-run.sh <out-dir>
set -u
out="$1"; here="$(cd "$(dirname "$0")" && pwd)"
for f in "$out"/transcript-*.jsonl; do
  id=$(basename "$f" .jsonl); id=${id#transcript-}
  { echo "# $id"; node "$here/extract-receiver.cjs" "$f" | cut -c1-400; } > "$out/extract-$id.txt"
  rm -f "$f"
done
rm -rf "$(cat "$out/project-dir.txt")"
rm -rf "$out/run"
