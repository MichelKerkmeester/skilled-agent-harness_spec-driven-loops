#!/usr/bin/env bash
# Withdraw probe: beside a running live-hop.sh, wait for this run's relaunch record to read
# armed, then type an operator prompt into the session at once, inside the killer's idle wait.
# Usage: withdraw-watch.sh <tmux-session> <out-dir> [timeout-seconds]
set -uo pipefail
session=${1:?tmux session}
out=${2:?out dir}
limit=${3:-400}
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
mkdir -p "$out"
start=$(date +%s)
marker="$out/.withdraw-start"; : > "$marker"
end=$(( start + limit ))
while [ "$(date +%s)" -lt "$end" ]; do
  for f in "$state"/relaunch-*.json; do
    [ -f "$f" ] && [ "$f" -nt "$marker" ] || continue
    if node -e 'const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); process.exit(r.status==="armed"&&r.runtime==="vibe"?0:1)' "$f" 2>/dev/null; then
      tmux send-keys -t "$session" -l 'Actually stay in this session. Do not hand over. Just repeat the code word once.'
      sleep 0.3; tmux send-keys -t "$session" Enter
      printf '%s armed-seen %s prompt-sent\n' "$(node -e 'console.log(Date.now())')" "$(basename "$f")" | tee -a "$out/withdraw.log"
      cp "$f" "$out/record-at-arm.json"
      exit 0
    fi
  done
  sleep 0.2
done
echo "no armed record within ${limit}s" | tee -a "$out/withdraw.log"
exit 1
