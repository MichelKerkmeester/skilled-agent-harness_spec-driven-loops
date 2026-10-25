#!/usr/bin/env bash
# One live Claude hop through the real wrapper, in a private tmux server and a private runtime
# directory so no shared relaunch state is armed. The sender starts on the goal command, a
# note is prepared out of band in the throwaway checkout, and the next prompt ends a turn so
# Stop arms and the wrapper relaunches. Usage: run-hop.sh <sandbox> <out-dir> <label> [ENV=value ...]
set -u
here="$(cd "$(dirname "$0")" && pwd)"
sb="$1"; out="$2"; label="$3"; shift 3
extra_env=("$@")
mkdir -p "$out"
export XDG_RUNTIME_DIR="$out/run"; mkdir -p "$XDG_RUNTIME_DIR"; chmod 700 "$XDG_RUNTIME_DIR"
state="$XDG_RUNTIME_DIR/skilled-relaunch"
sock="ev027-$label"
tm() { command tmux -L "$sock" "$@"; }
session_name="hop-$label"
say() { tm send-keys -t "$session_name" -l "$1"; sleep 0.7; tm send-keys -t "$session_name" Enter; }
screen() { tm capture-pane -p -S -400 -t "$session_name"; }
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$out/summary.txt"; }
cleanup() { tm kill-server 2>/dev/null; }
trap cleanup EXIT

: > "$out/summary.txt"
cd "$sb" || exit 9
# The slice the receiver will be sent, rendered by the same helper the wrapper calls.
node -e '
  const { renderGoalSlice } = require(process.argv[1]);
  const result = renderGoalSlice({ packet: "specs/demo/001-demo", roots: [process.argv[2]] });
  if (!result.ok) { console.error(result.reason); process.exit(1); }
  process.stdout.write(result.slice);
' -- "$sb/.skilled/hooks/session-relaunch/lib/goal-handover.cjs" "$sb" > "$out/slice.txt" 2> "$out/slice.err"
log "slice chars: $(wc -c < "$out/slice.txt" | tr -d ' ') render err: $(cat "$out/slice.err")"
# A slice the helper refuses still starts the sender on a plain goal so the hop can be prepared.
if [ ! -s "$out/slice.txt" ]; then cp "$sb/specs/demo/001-demo/goal.md" "$out/slice.txt"; fi

env_args=""
for kv in "${extra_env[@]+"${extra_env[@]}"}"; do env_args+=" $(printf '%q' "$kv")"; done
cat > "$out/launch.sh" <<LAUNCH
#!/usr/bin/env bash
cd '$sb'
exec env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_MESSAGING_SOCKET -u CLAUDE_CODE_MESSAGING_TOKEN -u CLAUDE_CODE_BRIDGE_SESSION_ID -u CLAUDE_CODE_CHILD_SESSION -u CLAUDE_CODE_ENTRYPOINT -u CLAUDE_CODE_SESSION_ATTENDED -u CLAUDE_PID -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_ID -u SKILLED_LOOP_RUNTIME -u SKILLED_LOOP_MANUAL_TEMPLATE -u SESSION_RELAUNCH_GOAL -u SESSION_RELAUNCH_GOAL_PACKET -u AI_SESSION_CHILD XDG_RUNTIME_DIR='$XDG_RUNTIME_DIR' SESSION_RELAUNCH_MAX_HOPS=1$env_args bash .skilled/bin/skilled-loop claude --model claude-sonnet-5-5 "/goal \$(cat '$out/slice.txt')"
LAUNCH
chmod +x "$out/launch.sh"
tm new-session -d -x 200 -y 50 -s "$session_name" "bash '$out/launch.sh'"
tm set-option -w -t "$session_name" remain-on-exit on
log "sender launched"
for _ in $(seq 1 30); do
  sleep 2
  s="$(screen)"
  if printf '%s' "$s" | grep -qiE "trust this folder|Yes, I trust|Do you trust"; then tm send-keys -t "$session_name" Enter; sleep 2; fi
  if printf '%s' "$s" | grep -qiE "goal active|Goal set"; then break; fi
done
sleep 20
screen > "$out/pane-sender.txt"
grep -iE "goal" "$out/pane-sender.txt" | head -5 | sed 's/^/  sender pane: /' | tee -a "$out/summary.txt"

# The sandbox path flattened the way Claude names its project folder.
flat=$(printf '%s' "$sb" | sed 's#[/.]#-#g')
proj="$HOME/.claude/projects/$flat"
echo "$proj" > "$out/project-dir.txt"
sender_log=$(ls -t "$proj"/*.jsonl 2>/dev/null | head -1)
sender_id=$(basename "$sender_log" .jsonl)
log "sender session: $sender_id"
pane_pid=$(tm list-panes -t "$session_name" -F '#{pane_pid}' | head -1)
log "wrapper pid (loop id): $pane_pid"

note="$sb/.skilled/skills/.state/session-relaunch/handoffs/note-$label.md"
mkdir -p "$(dirname "$note")"
cat > "$note" <<NOTE
---
status: open
session_id: $sender_id
loop_id: $pane_pid
runtime: claude
cwd: $sb
spec_folder: none
created_at: $(date -u +%FT%TZ)
---
## Goal
Keep the pong keeper running.
## Done
The sender set the goal and answered once.
## Remaining work
Create the file RESUMED.marker in the working directory containing the word OK, then reply with the single word PONG.
## In-flight state
Nothing is running.
NOTE
( cd "$sb" && env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u SKILLED_LOOP_MANUAL_TEMPLATE -u SKILLED_LOOP_RUNTIME SKILLED_LOOP_HOPS=0 SKILLED_LOOP_ID="$pane_pid" node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff "$note" --session "$sender_id" --runtime claude ) > "$out/prepare.txt" 2>&1
log "prepare exit=$? ; $(head -c 300 "$out/prepare.txt")"
log "note goal_packet line: $(grep -E '^goal_packet' "$note" || echo '<none>')"

if [ -n "${GOAL_AFTER_PREPARE:-}" ]; then
  # Grow goal.md past the limit after the note named it, as an author edit between hops would.
  node "$here/make-goal.cjs" "$sb/specs/demo/001-demo" "$GOAL_AFTER_PREPARE" | tee -a "$out/summary.txt"
fi
say "ping"
log "sent ping; waiting for the receiver"
for _ in $(seq 1 90); do
  sleep 2
  n=$(ls "$proj"/*.jsonl 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -ge 2 ] && break
done
log "transcripts in project: $(ls "$proj"/*.jsonl | wc -l | tr -d ' ')"
for _ in $(seq 1 120); do
  sleep 3
  if grep -qE '^status: (claimed|done)' "$note" && [ -f "$sb/RESUMED.marker" ]; then break; fi
done
sleep 25
screen > "$out/pane-receiver.txt"
log "note status: $(grep -E '^status:' "$note")"
log "marker: $(cat "$sb/RESUMED.marker" 2>/dev/null || echo '<absent>')"
cp "$note" "$out/note-final.md"
cp "$state/relaunch.log" "$out/relaunch.log" 2>/dev/null
( cd "$sb" && node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history --last 5 ) > "$out/history.txt" 2>&1
for f in "$proj"/*.jsonl; do cp "$f" "$out/transcript-$(basename "$f")"; done
ps -axo pid,ppid,command | grep -E "claude|skilled-loop" | grep -v grep | grep "$sb" > "$out/processes.txt" 2>&1
log "done"
