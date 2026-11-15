#!/usr/bin/env bash
# Hop-recall run: a sender under skilled-loop prints 120 one-time codes, hands over, and the
# receiver is asked for one code. Arm "lookup" keeps the history lookup CLI on disk, arm
# "baseline" hides it for the run. Usage: hop-recall.sh <lookup|baseline> <label> [timeout-seconds]
set -uo pipefail

arm=${1:?arm}
label=${2:?label}
limit=${3:-540}
here=$(cd "$(dirname "$0")" && pwd)
repo=$(git -C "$here" rev-parse --show-toplevel)
out="$here/../runs/$arm-$label"
mkdir -p "$out"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
notes="$repo/.skilled/skills/.state/session-relaunch/handoffs"
mkdir -p "$notes" "$state"
project="$HOME/.claude/projects/$(printf '%s' "$repo" | sed 's/[^A-Za-z0-9]/-/g')"
cli="$repo/.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js"
code=PDSNMMBW
question="What exact code did show-codes.sh print for K073 in the previous session? Reply with the code only, or UNKNOWN if you cannot determine it. Do not write any file."

work="$out/work"
mkdir -p "$work"
node -e 'const A="ABCDEFGHJKMNPQRSTUVWXYZ23456789";let x=20261108;const r=()=>{x=(x*1103515245+12345)%2147483648;return x};for(let i=1;i<=120;i++){let v="";for(let j=0;j<8;j++)v+=A[r()%A.length];console.log("K"+String(i).padStart(3,"0")+" "+v)}' > "$work/codes.txt"
printf '#!/bin/sh\nd=$(dirname "$0")\n[ -f "$d/codes.txt" ] || { echo "codes already issued"; exit 0; }\ncat "$d/codes.txt"\nrm -f "$d/codes.txt"\n' > "$work/show-codes.sh"

prompt="Read-only task in two steps. Gate 3 is pre-answered D) Skip: you change no file. Step 1, yours: run sh $work/show-codes.sh so the one-time codes are issued (it clears them once shown, which is expected). Step 2 belongs to the next session, not to you: report the line count of .skilled/hooks/session-relaunch/README.md and name its first heading. After step 1 a hook will ask you to hand over to a fresh session. That request is expected and approved by me: write the handoff note and run prepare as it says, and leave step 2 to the new session."

hidden=""
if [ "$arm" = baseline ] && [ -f "$cli" ]; then hidden="$out/cli.js.hidden"; mv "$cli" "$hidden"; fi
restore() { [ -n "$hidden" ] && [ -f "$hidden" ] && mv "$hidden" "$cli"; }
trap restore EXIT

touch "$state/relaunch.log"
log_offset=$(wc -l < "$state/relaunch.log" | tr -d ' ')
start_ms=$(node -e 'console.log(Date.now())')
session="hoprecall-$arm-$label"
tmux kill-session -t "$session" 2>/dev/null
quoted=$(printf '%q ' --model sonnet --effort medium --name "$session" "$prompt")
envs="SYSTEM_SESSION_RELAUNCH_ENABLED=1 SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1"
tmux new-session -d -s "$session" -x 200 -y 50 \
  "cd '$repo' && env -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_ID -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID $envs bash .skilled/bin/skilled-loop claude $quoted; echo WRAPPER_EXIT=\$?; sleep 600"
tmux set-option -t "$session" remain-on-exit on >/dev/null

score() { python3 "$here/analyze.py" "$project" "$start_ms" "$notes" "$code" "$question"; }
field() { node -e 'const o=JSON.parse(process.argv[1]);console.log(o[process.argv[2]]??"")' "$1" "$2"; }

asked=0; dialogs=0; cli_seen=0
end=$(( $(date +%s) + limit ))
while [ "$(date +%s)" -lt "$end" ]; do
  screen=$(tmux capture-pane -p -t "$session" 2>/dev/null) || break
  if printf '%s' "$screen" | grep -q -E "Do you trust the files in this folder|Yes, I trust this folder|trust this (folder|directory)\?"; then
    tmux send-keys -t "$session" Enter; dialogs=$((dialogs + 1)); sleep 3; continue
  fi
  if printf '%s' "$screen" | grep -q "Hooks need review"; then
    tmux send-keys -t "$session" Down Enter; dialogs=$((dialogs + 1)); sleep 3; continue
  fi
  [ "$arm" = baseline ] && [ -f "$cli" ] && cli_seen=1
  tmux capture-pane -p -S -600 -t "$session" > "$out/pane.txt" 2>/dev/null
  grep -q "WRAPPER_EXIT=" "$out/pane.txt" && break
  s=$(score)
  if [ "$asked" = 0 ]; then
    st=$(field "$s" note_status); rc=$(field "$s" receiver)
    if [ -n "$rc" ] && { [ "$st" = claimed ] || [ "$st" = done ]; }; then
      # Let the receiver finish absorbing the note before the question arrives.
      sleep 30
      tmux send-keys -t "$session" -l "$question"; sleep 1; tmux send-keys -t "$session" Enter
      asked=1; asked_at=$(date +%s)
    fi
  else
    ans=$(field "$s" answer)
    if [ "$ans" != pending ] && [ $(( $(date +%s) - asked_at )) -ge 45 ]; then
      # A reply exists; wait for the turn to settle, then take the final score.
      sleep 20; break
    fi
  fi
  sleep 5
done
tmux capture-pane -p -S -600 -t "$session" > "$out/pane.txt" 2>/dev/null
s=$(score)
tail -n +"$((log_offset + 1))" "$state/relaunch.log" > "$out/relaunch.log"
n=$(field "$s" note); [ -n "$n" ] && cp "$notes/$n" "$out/note.md"
tmux kill-session -t "$session" 2>/dev/null
restore
node -e '
const s=JSON.parse(process.argv[1]);
const o={arm:process.argv[2],label:process.argv[3],runtime:"claude-code",asked:Number(process.argv[4]),trustDialogs:Number(process.argv[5]),cliReappeared:Number(process.argv[6]),...s};
require("fs").writeFileSync(process.argv[7],JSON.stringify(o,null,2));
const counted=(o.note_status==="claimed"||o.note_status==="done")&&o.note_leaked===0&&o.receiver&&o.receiver!==o.sender&&o.asked===1&&o.cliReappeared===0;
console.log(`observed=arm=${o.arm} runtime=claude-code answer=${o.answer} lookup_attempted=${o.lookup_attempted} native_recall=${o.native_recall} transcript_read=${o.transcript_read} note_leaked=${o.note_leaked} note_status=${o.note_status} counted=${counted?1:0}`);
' "$s" "$arm" "$label" "$asked" "$dialogs" "$cli_seen" "$out/result.json"
