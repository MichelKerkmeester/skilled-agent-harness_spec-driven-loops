#!/usr/bin/env bash
# Read-only census of the deep-research and deep-review workflow twins.
# Run from the repository root. Prints sizes, step sets, branch sets,
# dry-run wiring, inline heredoc bytes and pivot seat bytes. With --single
# it reads the merged deep-research.yaml and deep-review.yaml instead.
set -euo pipefail

A=.skilled/commands/deep/assets
C=.skilled/commands/deep

keys() {
  grep -oE '^ *step_[a-z0-9_]+:' "$1" | tr -d ' :' | sort -u
}

block_keys() {
  awk '/^workflow:/{p=1;next} /^[a-z_]+:/{p=0} p' "$1" | grep -oE '^ *step_[a-z0-9_]+:' | tr -d ' :' | sort -u
}

heredoc_bytes() {
  awk 'match($0,/<<-?\x27?[A-Z_]+/){tag=substr($0,RSTART,RLENGTH);gsub(/<<-?\x27?/,"",tag);inb=1;n++;next}
       inb{b+=length($0)+1;if($0 ~ "^[ ]*"tag"[ ]*$")inb=0}
       END{printf "%d heredocs, %d bytes", n, b}' "$1"
}

seat_bytes() {
  awk '/^ *step_dispatch_pivot_seat_001:/{p=1} /^ *step_finalize_divergent_pivot:/{p=0} p{b+=length($0)+1} END{print b}' "$1"
}

if [ "${1:-}" = "--single" ]; then
  for c in research review; do
    f="$A/deep-$c.yaml"
    [ -f "$f" ] || { echo "missing $f" >&2; exit 2; }
    echo "== $c single"
    echo "bytes: $(wc -c < "$f" | tr -d ' ')"
    echo "inline heredocs: $(heredoc_bytes "$f")"
    echo "step keys inside workflow block: $(block_keys "$f" | wc -l | tr -d ' ')"
    echo "step key list: $(block_keys "$f" | tr '\n' ' ')"
    echo "executor branches: $(grep -oE '^ *if_(native|cli_[a-z_]+):' "$f" | tr -d ' :' | sort | uniq -c | tr -s ' ' | tr '\n' ' ')"
    echo "dry_run mentions: $(grep -c dry_run "$f" || true)"
  done
  exit 0
fi

echo "== bytes"
wc -c "$A/deep-research-auto.yaml" "$A/deep-research-confirm.yaml" "$A/deep-review-auto.yaml" "$A/deep-review-confirm.yaml"

for c in research review; do
  au="$A/deep-$c-auto.yaml"
  co="$A/deep-$c-confirm.yaml"
  echo "== $c"
  echo "differing lines auto vs confirm: $(diff "$au" "$co" | grep -c '^[<>]' || true)"
  echo "keyed step names anywhere: auto=$(keys "$au" | wc -l | tr -d ' ') confirm=$(keys "$co" | wc -l | tr -d ' ')"
  echo "step keys inside workflow block: auto=$(block_keys "$au" | wc -l | tr -d ' ') confirm=$(block_keys "$co" | wc -l | tr -d ' ')"
  echo "auto-only workflow steps: $(comm -23 <(block_keys "$au") <(block_keys "$co") | tr '\n' ' ')"
  echo "confirm-only workflow steps: $(comm -13 <(block_keys "$au") <(block_keys "$co") | tr '\n' ' ')"
  echo "executor branches auto: $(grep -oE '^ *if_(native|cli_[a-z_]+):' "$au" | tr -d ' :' | sort -u | tr '\n' ' ')"
  echo "executor branches confirm: $(grep -oE '^ *if_(native|cli_[a-z_]+):' "$co" | tr -d ' :' | sort -u | tr '\n' ' ')"
  echo "failure branches auto: $(grep -oE '^ *if_failed[a-z_]*:' "$au" | tr -d ' :' | sort -u | tr '\n' ' ')"
  echo "failure branches confirm: $(grep -oE '^ *if_failed[a-z_]*:' "$co" | tr -d ' :' | sort -u | tr '\n' ' ')"
  echo "dry_run mentions: auto=$(grep -c dry_run "$au" || true) confirm=$(grep -c dry_run "$co" || true)"
  echo "--no-resource-map mentions: auto=$(grep -c -- --no-resource-map "$au" || true) confirm=$(grep -c -- --no-resource-map "$co" || true)"
  echo "inline heredocs auto: $(heredoc_bytes "$au")"
  echo "pivot seat block bytes auto: $(seat_bytes "$au")"
  echo "dry-run mentions in $c.md: $(grep -ciE 'dry[-_]run' "$C/$c.md" || true) presentation: $(grep -ciE 'dry[-_]run' "$A/deep-$c-presentation.txt" || true)"
done

echo "== shared"
echo "workflow step keys shared by research auto and review auto: $(comm -12 <(block_keys "$A/deep-research-auto.yaml") <(block_keys "$A/deep-review-auto.yaml") | wc -l | tr -d ' ')"
