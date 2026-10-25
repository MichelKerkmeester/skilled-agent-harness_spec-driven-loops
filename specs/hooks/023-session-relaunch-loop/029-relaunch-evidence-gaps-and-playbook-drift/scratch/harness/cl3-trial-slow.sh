#!/usr/bin/env bash
# One live CL-3 trial: prepare + defer, withdraw by an operator prompt, then judge whether the
# first tool call after the withdraw delivers the extra nudge. Usage: cl3-trial.sh <n> <out-dir>
set -u
n="$1"; out="$2"
repo_root="$(git rev-parse --show-toplevel)"
trial="$out/trial-$n"; mkdir -p "$trial"
export XDG_RUNTIME_DIR="$trial/run"; mkdir -p "$XDG_RUNTIME_DIR"; chmod 700 "$XDG_RUNTIME_DIR"
state="$XDG_RUNTIME_DIR/skilled-relaunch"
sock="ev029-cl3-$n"
tm() { command tmux -L "$sock" "$@"; }
cli() { node "$repo_root/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs" "$@"; }
session_name="cl3-$n"
export PROBE_LOG="$trial/probe.jsonl" PROBE_HOOKS_ROOT="$repo_root/.skilled/hooks/session-relaunch"
here="$(cd "$(dirname "$0")" && pwd)"
overlay="$trial/overlay-settings.json"
cat > "$overlay" <<JSON
{"hooks":{
 "UserPromptSubmit":[{"matcher":"","hooks":[{"type":"command","command":"node $here/probe-hook.cjs","timeout":5}]}],
 "PostToolUse":[{"matcher":"","hooks":[{"type":"command","command":"node $here/probe-hook.cjs","timeout":5}]}]}}
JSON
say() { tm send-keys -t "$session_name" -l "$1"; sleep 0.5; tm send-keys -t "$session_name" Enter; }
screen() { tm capture-pane -p -S -200 -t "$session_name"; }
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

{ echo "trial=$n start=$(date -u +%FT%TZ)"; } > "$trial/summary.txt"
tm new-session -d -x 200 -y 50 -s "$session_name" "cd '$repo_root' && env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_MESSAGING_SOCKET -u CLAUDE_CODE_MESSAGING_TOKEN -u CLAUDE_CODE_BRIDGE_SESSION_ID -u CLAUDE_CODE_CHILD_SESSION -u CLAUDE_CODE_ENTRYPOINT -u CLAUDE_PID -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_ID -u SKILLED_LOOP_RUNTIME -u SKILLED_LOOP_MANUAL_TEMPLATE XDG_RUNTIME_DIR='$XDG_RUNTIME_DIR' PROBE_LOG='$PROBE_LOG' PROBE_HOOKS_ROOT='$PROBE_HOOKS_ROOT' SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop claude --model claude-sonnet-5-5 --settings '$overlay'"
tm set-option -w -t "$session_name" remain-on-exit on
# first-start prompts (trust folder), answered only when they show
for _ in $(seq 1 20); do
  sleep 2
  s="$(screen)"
  if printf '%s' "$s" | grep -qiE "trust this folder|Yes, I trust"; then tm send-keys -t "$session_name" Enter; sleep 2; fi
  if printf '%s' "$s" | grep -qE "^\s*[>❯]|bypass permissions|Try \""; then break; fi
done
t_p1=$(date +%s)
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them: write the note with spec_folder none and run prepare. Only after prepare exits 0, start 'sleep 90' as a background shell task and end your turn."
loop_id=$(wait_for_record pending 2400) || { echo "RESULT=NO_PENDING_RECORD" >> "$trial/summary.txt"; screen > "$trial/pane-final.txt"; exit 3; }
tries=0
until grep -q deferredAt "$state/relaunch-$loop_id.json" 2>/dev/null; do sleep 1; tries=$((tries+1)); [ $tries -gt 150 ] && break; done
if ! grep -q deferredAt "$state/relaunch-$loop_id.json"; then echo "RESULT=NO_DEFERRED loop=$loop_id" >> "$trial/summary.txt"; screen > "$trial/pane-final.txt"; exit 4; fi
session_id=$(grep -oE '"sessionId":"[^"]*"' "$state/relaunch-$loop_id.json" | cut -d'"' -f4)
{ echo "loop_id=$loop_id session_id=$session_id setup_seconds=$(( $(date +%s) - t_p1 ))"; record_field "$loop_id" status; record_field "$loop_id" deferredAt; cli should-relaunch --loop-id "$loop_id"; echo "exit $?"; } >> "$trial/summary.txt" 2>&1
printf '{"level":2}\n' > "$state/nudge-$session_id.json"
echo "T_PROMPT2=$(date -u +%FT%TZ.%N)" >> "$trial/summary.txt"
say "Run the shell command 'sleep 3; echo staying'. Then quote, word for word, the first sentence of every [session-relaunch] message you received since my last message, and reply STAYING."
# poll until the nudge is delivered (rearm gone) or 90 s pass; the first attempt is the first tool call after the withdraw
delivered=no; waited=0
while [ $waited -lt 90 ]; do
  sleep 1; waited=$((waited+1))
  if grep -q disarmReason "$state/relaunch-$loop_id.json" 2>/dev/null && ! grep -q rearm "$state/nudge-$session_id.json" 2>/dev/null; then
    # rearm field removed after having been set: delivered. Require the probe to have seen a PostToolUse after the prompt.
    if grep -q '"ev":"PostToolUse"' <(sed -n '/"ev":"UserPromptSubmit","prompt":"Run the shell command/,$p' "$trial/probe.jsonl") 2>/dev/null; then delivered=yes; break; fi
  fi
done
sleep 12
{
  echo "delivered_by_state_file=$delivered after_seconds=$waited"
  record_field "$loop_id" disarmReason
  echo "nudge_file=$(cat "$state/nudge-$session_id.json" 2>/dev/null | tr -d '\n')"
  grep -E ' (withdrawn|killer-signal|relaunch|context-nudge-error) ' "$state/relaunch.log" | tail -6
  cli history --last 2
} >> "$trial/summary.txt" 2>&1
screen > "$trial/pane-final.txt"
if grep -q "Context is past the configured window" "$trial/pane-final.txt"; then
  # the quoted reply carries the sentence beyond the tool-result echo only if it appears in the model's prose; count occurrences
  echo "pane_nudge_sentence_count=$(grep -c 'Context is past the configured window' "$trial/pane-final.txt")" >> "$trial/summary.txt"
else
  echo "pane_nudge_sentence_count=0" >> "$trial/summary.txt"
fi
cp "$state/relaunch.log" "$trial/relaunch.log" 2>/dev/null
tpath=$(grep -oE '"transcript":"[^"]*"' "$trial/probe.jsonl" | head -1 | cut -d'"' -f4)
node "$here/transcript-deliveries.cjs" "$tpath" > "$trial/transcript-deliveries.txt" 2>&1
echo "end=$(date -u +%FT%TZ)" >> "$trial/summary.txt"
cleanup
