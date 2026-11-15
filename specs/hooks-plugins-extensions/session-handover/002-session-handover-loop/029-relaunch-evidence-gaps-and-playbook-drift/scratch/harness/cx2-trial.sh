#!/usr/bin/env bash
# One live CX-2 run with a wait sized to the reply: an operator prompt withdraws an armed
# Codex hand-over, and the run records how long the receiver takes to answer.
# Usage: cx2-trial.sh <n> <out-dir> [max-wait-seconds]
set -u
n="$1"; out="$2"; max_wait="${3:-300}"
repo_root="$(git rev-parse --show-toplevel)"
trial="$out/run-$n"; mkdir -p "$trial"
export XDG_RUNTIME_DIR="$trial/run"; mkdir -p "$XDG_RUNTIME_DIR"; chmod 700 "$XDG_RUNTIME_DIR"
state="$XDG_RUNTIME_DIR/skilled-relaunch"
sock="ev029-cx2-$n"
tm() { command tmux -L "$sock" "$@"; }
cli() { node "$repo_root/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs" "$@"; }
session_name="cx2-$n"
say() { tm send-keys -t "$session_name" -l "$1"; sleep 0.5; tm send-keys -t "$session_name" Enter; }
screen() { tm capture-pane -p -S -300 -t "$session_name"; }
wait_for_record() {
  local pattern="$1" file="" tries=0
  while [ -z "$file" ] && [ "$tries" -lt "${2:-1800}" ]; do
    file=$(find "$state" -maxdepth 1 -name 'relaunch-*.json' -exec grep -lE "\"status\":\"($pattern)\"" {} + 2>/dev/null | head -1)
    [ -n "$file" ] || { sleep 0.1; tries=$((tries + 1)); }
  done
  [ -n "$file" ] || return 1
  file=${file##*/relaunch-}; echo "${file%.json}"
}
record_field() { grep -oE "\"$2\":\"[^\"]*\"" "$state/relaunch-$1.json"; }
cleanup() { tm kill-server 2>/dev/null; }
trap cleanup EXIT

echo "run=$n start=$(date -u +%FT%TZ) max_wait=${max_wait}s" > "$trial/summary.txt"
tm new-session -d -x 200 -y 50 -s "$session_name" "cd '$repo_root' && env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_MESSAGING_SOCKET -u CLAUDE_CODE_MESSAGING_TOKEN -u CLAUDE_CODE_BRIDGE_SESSION_ID -u CLAUDE_CODE_CHILD_SESSION -u CLAUDE_CODE_ENTRYPOINT -u CLAUDE_PID -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_ID -u SKILLED_LOOP_RUNTIME -u SKILLED_LOOP_MANUAL_TEMPLATE XDG_RUNTIME_DIR='$XDG_RUNTIME_DIR' SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop codex -m gpt-6-luna --sandbox danger-full-access"
tm set-option -w -t "$session_name" remain-on-exit on
ready=no
for _ in $(seq 1 30); do
  sleep 2
  s="$(screen)"
  echo "--- $(date -u +%T)" >> "$trial/startup-screens.txt"; printf '%s\n' "$s" | tail -15 >> "$trial/startup-screens.txt"
  if printf '%s' "$s" | grep -qiE "do you trust|trust the contents|allow codex to work"; then tm send-keys -t "$session_name" Enter; sleep 2; continue; fi
  if printf '%s' "$s" | grep -qE "^\s*›|Ask Codex|context left|gpt-6"; then ready=yes; break; fi
done
echo "ready=$ready" >> "$trial/summary.txt"
t1=$(date +%s)
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none, run prepare and end your turn."
loop_id=$(wait_for_record armed 3000) || { echo "RESULT=NO_ARMED_RECORD" >> "$trial/summary.txt"; screen > "$trial/pane-final.txt"; cp "$state/relaunch.log" "$trial/relaunch.log" 2>/dev/null; exit 3; }
echo "armed_after_seconds=$(( $(date +%s) - t1 )) loop_id=$loop_id" >> "$trial/summary.txt"
session_id=$(grep -oE '"sessionId":"[^"]*"' "$state/relaunch-$loop_id.json" | cut -d'"' -f4)
printf '{"level":2}\n' > "$state/nudge-$session_id.json"
t2=$(date +%s); echo "T_PROMPT2=$(date -u +%FT%TZ)" >> "$trial/summary.txt"
say "Run the shell command 'echo staying'. Then quote, word for word, the first sentence of every [session-relaunch] message you received since my last message, and reply STAYING."
# wait for the reply: the final word on a line of its own, outside the echoed prompt, then a quiet pane
seen_reply=no; waited=0
while [ $waited -lt "$max_wait" ]; do
  sleep 3; waited=$((waited+3))
  tm capture-pane -p -S -300 -t "$session_name" > "$trial/pane-poll.txt"
  if grep -qE '^\s*(•|⏺)?\s*STAYING\.?\s*$' "$trial/pane-poll.txt"; then seen_reply=yes; break; fi
done
reply_seconds=$(( $(date +%s) - t2 ))
sleep 5
echo "reply_seen=$seen_reply reply_after_seconds=$reply_seconds (poll waited ${waited}s of max ${max_wait}s)" >> "$trial/summary.txt"
{
  record_field "$loop_id" status; record_field "$loop_id" disarmReason
  cli should-relaunch --loop-id "$loop_id"; echo "exit $?"
  grep -E ' (withdrawn|killer-signal|relaunch|stop-arm-error|prepare) ' "$state/relaunch.log" | tail -8
  echo "nudge_file=$(cat "$state/nudge-$session_id.json" 2>/dev/null | tr -d '\n')"
  cli history --last 2
} >> "$trial/summary.txt" 2>&1
screen > "$trial/pane-final.txt"
say "/quit"
sleep 6
screen > "$trial/pane-after-quit.txt"
echo "pane_dead_status=$(tm display -p -t "$session_name" '#{pane_dead_status}' 2>&1)" >> "$trial/summary.txt"
cp "$state/relaunch.log" "$trial/relaunch.log" 2>/dev/null
echo "end=$(date -u +%FT%TZ)" >> "$trial/summary.txt"
cleanup
