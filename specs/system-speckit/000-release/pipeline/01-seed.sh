#!/usr/bin/env bash
# PHASE 1 — deterministic seed. For each in-window top-level packet, assemble one
# bounded source blob (rollup summary > child summaries > spec.md). No model.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
cd "$REPO"; mkdir -p "$SRC_DIR" "$STATE_DIR"; : > "$MANIFEST"
MAXLINES=450

git diff --name-only "$BASELINE_TAG..$TARGET_REF" -- specs/ 2>/dev/null \
  | grep -oE '^specs/[^/]+/(z_archive/)?[0-9]{3}-[a-z0-9-]+' \
  | grep -v '/\.backup' | sort -u > "$WORK/inwindow-packets.txt"

n=0
while IFS= read -r pkt; do
  [ -d "$pkt" ] || continue
  track=$(echo "$pkt" | sed -E 's#^specs/([^/]+)/.*#\1#')
  slug=$(echo "$pkt" | sed -E 's#^specs/##; s#/#__#g')
  out="$SRC_DIR/$slug.md"
  if [ -f "$pkt/implementation-summary.md" ]; then
    strat=rollup
    { echo "# PACKET: $pkt"; echo; sed -n "1,${MAXLINES}p" "$pkt/implementation-summary.md"; } > "$out"
  else
    kids=$(find "$pkt" -mindepth 2 -name implementation-summary.md -not -path '*/.backup*' 2>/dev/null | sort | head -12)
    if [ -n "$kids" ]; then
      strat=children
      { echo "# PACKET: $pkt (rolled up from child summaries)"; echo
        [ -f "$pkt/spec.md" ] && { echo "## parent spec (excerpt)"; sed -n '1,40p' "$pkt/spec.md"; echo; }
        while IFS= read -r k; do [ -n "$k" ] || continue; echo "## ${k#$pkt/}"; sed -n '1,60p' "$k"; echo; done <<< "$kids"
      } | sed -n "1,$((MAXLINES*2))p" > "$out"
    elif [ -f "$pkt/spec.md" ]; then
      strat=spec; { echo "# PACKET: $pkt (spec only)"; echo; sed -n "1,${MAXLINES}p" "$pkt/spec.md"; } > "$out"
    else
      strat=empty; echo "# PACKET: $pkt (no docs)" > "$out"
    fi
  fi
  # hard cap for model window
  if [ "$(wc -c <"$out")" -gt 45000 ]; then head -c 45000 "$out" > "$out.t" && printf '\n[...truncated 45KB...]\n' >> "$out.t" && mv "$out.t" "$out"; fi
  printf '%s\t%s\t%s\t%s\n' "$pkt" "$track" "$strat" "$out" >> "$MANIFEST"
  n=$((n+1))
done < "$WORK/inwindow-packets.txt"

log "PHASE1 seed: $n packets -> $MANIFEST"
mark_done phase1
