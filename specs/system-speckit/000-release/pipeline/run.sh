#!/usr/bin/env bash
# ============================================================================
# v4 RELEASE-NOTES PIPELINE — one command, cheap models only, resumable.
#
#   bash run.sh              # run all phases (skips completed ones)
#   bash run.sh --fresh      # wipe work dir + rerun everything
#   bash run.sh --from 3     # resume from phase 3 (consolidate) onward
#   bash run.sh --only 2     # run only phase 2 (extraction)
#   bash run.sh --preflight  # just check readiness
#
# Phases: 1 seed(det) · 2 extract(Flash) · 3 consolidate(det)+synthesize ·
#         4 assemble · 5 readme-delta(proposal).  Outputs land in the packet.
# ============================================================================
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
mkdir -p "$WORK" "$STATE_DIR"; : >> "$LOG"

FROM=1; ONLY=0
while [ $# -gt 0 ]; do case "$1" in
  --fresh) rm -rf "$WORK"; mkdir -p "$WORK" "$STATE_DIR";;
  --from) FROM="$2"; shift;;
  --only) ONLY="$2"; shift;;
  --preflight) bash "$HERE/preflight.sh"; exit $?;;
  *) echo "unknown arg: $1"; exit 2;;
esac; shift; done

want(){ local p="$1"; [ "$ONLY" -ne 0 ] && { [ "$ONLY" = "$p" ]; return; }; [ "$p" -ge "$FROM" ]; }

log "===== v4 release-notes pipeline start (from=$FROM only=$ONLY synth=$SYNTH_KIND) ====="
bash "$HERE/preflight.sh" || { log "ABORT: pre-flight not ready"; exit 1; }

want 1 && { is_done phase1 && [ "$ONLY" = 0 ] && log "phase1 done, skip" || bash "$HERE/01-seed.sh"; }
want 2 && { is_done phase2 && [ "$ONLY" = 0 ] && log "phase2 done, skip" || bash "$HERE/02-fanout.sh"; }
want 3 && { { is_done phase3a && [ "$ONLY" = 0 ] || bash "$HERE/03-consolidate.sh"; }
           { is_done phase3b && [ "$ONLY" = 0 ] && log "phase3b done, skip" || bash "$HERE/04-synthesize.sh"; }; }
want 4 && { is_done phase4 && [ "$ONLY" = 0 ] && log "phase4 done, skip" || bash "$HERE/05-assemble.sh"; }
want 5 && { is_done phase5 && [ "$ONLY" = 0 ] && log "phase5 done, skip" || bash "$HERE/06-readme-delta.sh"; }

echo; echo "===== SUMMARY ====="
echo "fragments : $(wc -l < "$OUT_FRAGMENTS" 2>/dev/null || echo 0) -> $OUT_FRAGMENTS"
echo "sections  : $(ls "$OUT_SECTIONS"/*.md 2>/dev/null | wc -l | tr -d ' ') -> $OUT_SECTIONS"
echo "notes     : $OUT_NOTES ($(wc -l < "$OUT_NOTES" 2>/dev/null || echo 0) lines)"
echo "readme    : $OUT_README_DELTA (proposal only)"
echo "log       : $LOG"
log "===== pipeline end ====="
