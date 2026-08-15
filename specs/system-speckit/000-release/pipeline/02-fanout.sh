#!/usr/bin/env bash
# PHASE 2 (driver) — fan out extraction over the manifest at CONCURRENCY. Resumable.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
[ -f "$MANIFEST" ] || { log "no manifest; run 01-seed.sh first"; exit 1; }
total=$(wc -l < "$MANIFEST" | tr -d ' ')
log "PHASE2 extract: $total packets, concurrency $CONCURRENCY, model $EXTRACT_MODEL"
awk -F'\t' '{n=split($4,a,"/"); f=a[n]; sub(/\.md$/,"",f); print f}' "$MANIFEST" \
  | xargs -P"$CONCURRENCY" -I{} bash "$HERE/02-extract.sh" {} | tee -a "$LOG"
ok=$(ls "$FRAG_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
log "PHASE2 done: $ok/$total fragments"
# one automatic retry sweep for stragglers
if [ "$ok" -lt "$total" ]; then
  log "PHASE2 retry sweep for $((total-ok)) missing"
  comm -23 <(awk -F'\t' '{n=split($4,a,"/"); f=a[n]; sub(/\.md$/,"",f); print f}' "$MANIFEST" | sort) \
           <(ls "$FRAG_DIR" 2>/dev/null | sed 's/\.json$//' | sort) \
    | xargs -P"$CONCURRENCY" -I{} bash "$HERE/02-extract.sh" {} | tee -a "$LOG"
  ok=$(ls "$FRAG_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
  log "PHASE2 after retry: $ok/$total"
fi
[ "$ok" -ge $(( total * 9 / 10 )) ] && mark_done phase2 || log "PHASE2 under 90% — not marking done"
