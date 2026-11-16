#!/usr/bin/env bash
# Prints each deep-loop lineage's per-iteration ratios and recorded stop reason for
# the packet's research loop and its review passes, read from the loops' own
# state files.
set -euo pipefail
PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
for dir in "$PK"/009-ux-performance-cross-cli-research/research/lineages/* "$PK"/review/lineages/*; do
  for state in "$dir"/deep-research-state.jsonl "$dir"/deep-review-state.jsonl; do
    [ -f "$state" ] || continue
    ratios=$(jq -r 'select(.type=="iteration") | (.newInfoRatio // .newFindingsRatio // "?")' "$state" | tr '\n' ' ')
    stop=$(jq -r 'select(.stopReason) | .stopReason' "$state" | tail -1)
    echo "${dir#$PK/} | ratios ${ratios}| stop ${stop:-none}"
  done
done
