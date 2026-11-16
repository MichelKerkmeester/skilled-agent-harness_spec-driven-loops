#!/usr/bin/env bash
# Shows whether a full advisor suite run writes into the shared health-metrics folder.
# It counts and snapshots that folder (path, change time and size of every file)
# before and after one run, records each per-run temp folder the run makes, and tests
# that each is gone after exit. Other sessions on the machine write to the same
# folder, so a changed file is listed with the runtime of its newest record.
# It reads change times with BSD `stat -f`, so it runs on macOS only.
# Usage: bash isolation-check.sh <repo-root>
set -u
ROOT="${1:?repo root}"
ADV="$ROOT/.skilled/skills/system-skill-advisor/runtime"
BASE_TMP="$(node -p 'require("os").tmpdir()')"
SHARED="$BASE_TMP/speckit-skill-advisor-metrics"
WORK="$(mktemp -d "$BASE_TMP/isolation-check.XXXX")"

count() { echo "COUNT files $(find "$SHARED" -type f | wc -l | tr -d ' ') lines $(find "$SHARED" -type f -exec cat {} + | wc -l | tr -d ' ')"; }
snap() { find "$SHARED" -type f -exec stat -f '%N %c %z' {} + | sort; }

echo "shared folder: $SHARED"
count
snap > "$WORK/before"
find "$BASE_TMP" -maxdepth 1 -name 'sav-*' | sort > "$WORK/sav-before"
echo "start $(date +%T)"
(cd "$ADV" && env -u AI_SESSION_CHILD npx vitest run > "$WORK/suite.log" 2>&1; echo $? > "$WORK/exit") &
runner=$!
while kill -0 "$runner" 2>/dev/null; do
  find "$BASE_TMP" -maxdepth 1 -name 'sav-*' >> "$WORK/sav-seen"
  sleep 1
done
wait "$runner"
echo "end $(date +%T)"
grep -E '^\s+(Test Files|Tests)\s' "$WORK/suite.log"
echo "suite exit $(cat "$WORK/exit")"
count
snap > "$WORK/after"
echo "changed shared files:"
changed="$(diff "$WORK/before" "$WORK/after" | grep '^>' | awk '{print $2}')"
if [ -z "$changed" ]; then
  echo "  none"
else
  for file in $changed; do
    echo "  $(basename "$file") newest record runtime $(tail -1 "$file" | jq -r '.runtime // "unknown"')"
  done
fi
sort -u "$WORK/sav-seen" 2>/dev/null | comm -23 - "$WORK/sav-before" > "$WORK/sav-new"
echo "per-run folders seen during the run: $(wc -l < "$WORK/sav-new" | tr -d ' ')"
while read -r folder; do
  test -e "$folder"
  echo "test -e $folder -> exit $?"
done < "$WORK/sav-new"
rm -rf "$WORK"
